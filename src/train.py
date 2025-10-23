import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import pickle
try:
    import mlflow
except ImportError:
    mlflow = None

X_train = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/X_train.csv')
X_test = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/X_test.csv')
y_train = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/y_train.csv').values.ravel()
y_test = pd.read_csv('/Users/curious_techie/Desktop/predictive-maintainence/raw/data/y_test.csv').values.ravel()

rf = RandomForestClassifier(class_weight='balanced', random_state=42)
rf.fit(X_train, y_train)
rf_preds = rf.predict(X_test)

print("Random Forest Classification Report:\n", classification_report(y_test, rf_preds))
print("Confusion Matrix:\n", confusion_matrix(y_test, rf_preds))

# Saving the model
pickle.dump(rf, open('/Users/curious_techie/Desktop/predictive-maintainence/models/random_forest_model.pkl', 'wb'))

if mlflow:
    mlflow.start_run()
    mlflow.log_params({'model': 'RandomForest', 'n_estimators': 100})
    mlflow.log_metrics({'accuracy': rf.score(X_test, y_test)})
    mlflow.sklearn.log_model(rf, 'random_forest_model')
    mlflow.end_run()
else:
    print("mlflow not installed; skipping experiment logging.")
