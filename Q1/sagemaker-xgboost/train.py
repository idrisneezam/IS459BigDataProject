import logging
import os
import pandas as pd
import boto3
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import joblib
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize S3 client
s3_client = boto3.client("s3")

# Define bucket and prefix for latest data
bucket_name = "projectairlinedatapipeline"
data_prefix = "processed_data/latest/filtered_airline_data.csv/"

# Fetch the latest CSV file dynamically
def get_latest_csv(bucket, prefix):
    response = s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)
    files = [obj['Key'] for obj in response.get('Contents', []) if obj['Key'].endswith('.csv')]
    if not files:
        raise FileNotFoundError("No CSV files found in the specified S3 path.")
    # Assuming the most recent file has the latest timestamp in the filename
    latest_file = sorted(files)[-1]
    return f"s3://{bucket}/{latest_file}"

# Retrieve the latest data file
data_file = get_latest_csv(bucket_name, data_prefix)
logger.info(f"Loading data from {data_file}...")

# Load data from S3
df = pd.read_csv(data_file)

# Define column names based on provided data structure
df.columns = [
    "Year", "Month", "Day", "DayOfWeek", "DepTime", "CRSDepTime", "CRSElapsedTime", 
    "ArrDelay", "Origin", "Dest", "Carrier", "FlightNum", "DepHour", "DepMinute", 
    "ArrHour", "ArrMinute", "Cancelled", "TimeOfDay"
]

# Filter data for model training
logger.info("Filtering data for model training...")
df = df.dropna(subset=['ArrDelay'])  # Dropping rows where 'ArrDelay' is NaN
df['DelayCategory'] = df['ArrDelay'].apply(lambda x: 1 if x > 0 else 0)  # Binary delay category

# Convert categorical columns to category type
categorical_columns = ["Origin", "Dest", "Carrier", "TimeOfDay"]
for col in categorical_columns:
    df[col] = df[col].astype("category")

# Split features and labels
X = df.drop(columns=['ArrDelay', 'DelayCategory'])
y = df['DelayCategory']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# Initialize and train XGBoost model with categorical support
logger.info("Training XGBoost model...")
xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', enable_categorical=True)
xgb_model.fit(X_train, y_train)

# Save model to local file
local_model_path = "/opt/ml/model/xgb_model.joblib"
joblib.dump(xgb_model, local_model_path)
logger.info(f"Model saved locally at {local_model_path}")

# Define paths for model output
timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
timestamped_model_path = f"models/xgboost-training-{timestamp}/xgb_model.joblib"
latest_model_path = "models/latest/xgb_model.joblib"

# Upload model to the timestamped path in S3
s3_client.upload_file(local_model_path, bucket_name, timestamped_model_path)
logger.info(f"Model uploaded to S3 at s3://{bucket_name}/{timestamped_model_path}")

# Also upload the model to the latest path in S3
s3_client.upload_file(local_model_path, bucket_name, latest_model_path)
logger.info(f"Model uploaded to S3 at s3://{bucket_name}/{latest_model_path}")
