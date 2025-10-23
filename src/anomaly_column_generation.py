import pandas as pd

df = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/HPC_2k.log_structured.csv')

# Define anomaly detection heuristics
def is_anomaly(row):
    content = row['Content'].lower()
    state = str(row['State']).lower()
    # You can expand with other keywords as needed
    anomaly_keywords = ['fail', 'error', 'unavailable', 'critical']
    # Use 'any' to match any keyword in content or state
    if any(kw in content for kw in anomaly_keywords) or any(kw in state for kw in anomaly_keywords):
        return 1
    return 0

df['anomaly'] = df.apply(is_anomaly, axis=1)

print(df['anomaly'].value_counts())
df.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/HPC_2k.log_structured.csv', index=False)
print("Saved processed labeled CSV.")

# Preview class distribution
import matplotlib.pyplot as plt
df['anomaly'].value_counts().plot(kind='bar')
plt.title('Anomaly Label Distribution')
plt.xlabel('Label')
plt.ylabel('Count')
plt.show()
