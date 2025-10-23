from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from datetime import datetime
from pathlib import Path

# --- Load model and encoders ---
BASE_DIR = Path('/Users/curious_techie/Desktop/predictive-maintainence')
with open(BASE_DIR / 'models/random_forest_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open(BASE_DIR / 'models/label_encoders.pkl', 'rb') as f:
    label_encoders = pickle.load(f)

structured_path = BASE_DIR / 'raw/data/HPC_2k.log_structured.csv'
structured_df = pd.read_csv(structured_path, usecols=['Content', 'EventId', 'EventTemplate']).drop_duplicates('Content')
content_lookup = {
    str(row['Content']).strip(): (str(row['EventId']), str(row['EventTemplate']))
    for _, row in structured_df.iterrows()
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def encode_with_debug(le, value, key):
    if value in le.classes_:
        encoded = int(le.transform([value])[0])
        print(f"{key}: '{value}' -> {encoded}")
        return encoded
    else:
        encoded = int(le.transform(['unknown'])[0])
        print(f"{key}: '{value}' (UNSEEN, mapped to 'unknown') -> {encoded}")
        return encoded

def lookup_event_attributes(content: str):
    key = content.strip()
    if key in content_lookup:
        return content_lookup[key]
    return 'unknown', 'unknown'


def parse_log_line(log_line: str):
    normalized = log_line.strip()
    if not normalized:
        raise ValueError("Empty log line")
    # Detect CSV-like structured input
    if normalized.count(',') >= 9:
        fields = [x.strip() for x in normalized.split(',')]
        if len(fields) >= 10:
            node = fields[2]
            component = fields[3]
            state = fields[4]
            time_int = int(fields[5])
            event_id = fields[8]
            event_template = fields[9]
        else:
            raise ValueError("CSV log line does not have enough columns")
    else:
        parts = normalized.split()
        if len(parts) >= 7:
            node = parts[1]
            component = parts[2]
            state = parts[3]
            time_int = int(parts[4])
            content = " ".join(parts[6:])
            event_id, event_template = lookup_event_attributes(content)
        else:
            raise ValueError("Raw log line does not have enough tokens")
    dt = datetime.utcfromtimestamp(time_int)
    features = {
        'Node_enc': encode_with_debug(label_encoders['Node'], node, 'Node'),
        'Component_enc': encode_with_debug(label_encoders['Component'], component, 'Component'),
        'State_enc': encode_with_debug(label_encoders['State'], state, 'State'),
        'EventId_enc': encode_with_debug(label_encoders['EventId'], event_id, 'EventId'),
        'EventTemplate_enc': encode_with_debug(label_encoders['EventTemplate'], event_template, 'EventTemplate'),
        'hour': dt.hour,
        'dayofweek': dt.weekday()
    }
    print("Final features used for prediction:", features)
    return features

@app.post('/predict_logline')
async def predict_logline(request: Request):
    try:
        data = await request.json()
        print("Received payload:", data)
        if "logLine" not in data or not isinstance(data["logLine"], str) or not data["logLine"].strip():
            return {"error": "No log line provided."}
        log_line = data['logLine']
        features = parse_log_line(log_line)
        df = pd.DataFrame([features])
        prediction = model.predict(df)[0]
        print('Prediction output from ML model:', prediction)
        return {'prediction': int(prediction)}
    except Exception as e:
        print("Error during parse/predict:", e)
        return {'error': f'Could not parse log line: {e}'}

@app.post('/predict')
async def predict(input: dict):
    try:
        df = pd.DataFrame([input])
        prediction = model.predict(df)[0]
        print('Direct feature prediction:', prediction)
        return {'prediction': int(prediction)}
    except Exception as e:
        print("Error in direct feature prediction:", e)
        return {'error': str(e)}
