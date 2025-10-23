import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/hpc_features.csv')
X = df.drop(['anomaly', 'LineId'], axis=1)
y = df['anomaly']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, test_size=0.2, random_state=42
)

X_train.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/X_train.csv', index=False)
X_test.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/X_test.csv', index=False)
y_train.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/y_train.csv', index=False)
y_test.to_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/y_test.csv', index=False)
print("Train/test splits saved.")
