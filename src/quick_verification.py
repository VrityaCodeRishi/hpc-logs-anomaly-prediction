import pandas as pd
raw = pd.read_csv("/Users/curious_techie/Desktop/predictive-maintainence/raw/data/HPC_2k.log_structured.csv")
feat = pd.read_csv("/Users/curious_techie/Desktop/predictive-maintainence/raw/data/hpc_features.csv")
# Suppose you exported LineId to hpc_features.csv
merged = raw.merge(feat, left_on="LineId", right_on="LineId")
# Compare anomaly columns
anomalies_mismatch = merged[merged["anomaly_x"] != merged["anomaly_y"]]
print(anomalies_mismatch)