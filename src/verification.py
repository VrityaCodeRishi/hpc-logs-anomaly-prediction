import pandas as pd
import matplotlib.pyplot as plt

# Load the structured log file
df = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/HPC_2k.log_structured.csv')

# Show basic info
print("Shape:", df.shape)
print("Columns:", df.columns)
print("First 5 rows:\n", df.head())
print("Missing values per column:\n", df.isnull().sum())
print("Data types:\n", df.dtypes)

# Check for anomaly/label column
label_col = None
for col in df.columns:
    if col.lower() in ['label', 'anomaly', 'is_anomaly', 'target']:
        label_col = col
        break

if label_col:
    print(f"Label column is '{label_col}'. Value counts:")
    print(df[label_col].value_counts())
    # Visualize label distribution
    df[label_col].value_counts().plot(kind='bar')
    plt.title(f'Log Label Distribution: {label_col}')
    plt.xlabel('Label')
    plt.ylabel('Count')
    plt.show()
else:
    print("No explicit anomaly/label column found. Will need to create one with heuristics.")

# Optional: Preview any template or node columns
for col in ['TemplateId', 'Node', 'node_id']:
    if col in df.columns:
        print(f"Example values from {col}: {df[col].unique()[:5]}")
