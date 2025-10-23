import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pickle

# Load raw structured log CSV
df = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/HPC_2k.log_structured.csv')

# --- Encode categorical columns with 'unknown' fallback ---
label_encoders = {}
for col in ['Node', 'Component', 'State', 'EventId', 'EventTemplate']:
    le = LabelEncoder()
    values = df[col].astype(str).tolist()
    if 'unknown' not in values:
        values.append('unknown')
    le.fit(values)
    df[col+'_enc'] = df[col].astype(str).apply(lambda x: x if x in le.classes_ else 'unknown')
    df[col+'_enc'] = le.transform(df[col+'_enc'])
    label_encoders[col] = le

# --- Time features ---
df['Time_dt'] = pd.to_datetime(df['Time'], unit='s')
df['hour'] = df['Time_dt'].dt.hour
df['dayofweek'] = df['Time_dt'].dt.dayofweek

# --- Select features for ML model, including LineId for EXACT mapping ---
feature_cols = [
    'LineId',    # original identifier for traceability
    'Node_enc', 'Component_enc', 'State_enc', 'EventId_enc', 'EventTemplate_enc',
    'hour', 'dayofweek'
]
target_col = 'anomaly'
df_ml = df[feature_cols + [target_col]]

# --- Save features CSV ---
df_ml.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/hpc_features.csv', index=False)
print("Saved ML feature file. Example:")
print(df_ml.head())

# --- Save label encoders for API use ---
with open('/Users/curious_techie/Desktop/predictive-maintainence/models/label_encoders.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)
