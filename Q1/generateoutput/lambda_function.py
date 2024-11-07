import joblib
import json
import pandas as pd
import boto3
import tempfile

# Initialize S3 client
s3_client = boto3.client("s3")

# S3 bucket and model file path
BUCKET_NAME = "projectairlinedatapipeline"
MODEL_PATH = "models/latest/xgb_model.joblib"

# Expected columns for the model input
expected_columns = [
    'Year', 'Month', 'Day', 'DayOfWeek', 'DepTime', 'CRSDepTime', 
    'CRSElapsedTime', 'Origin', 'Dest', 'Carrier', 'FlightNum', 
    'DepHour', 'DepMinute', 'ArrHour', 'ArrMinute', 'Cancelled', 
    'TimeOfDay'
]

# Load the model from S3 (only happens once per Lambda cold start)
def load_model():
    with tempfile.TemporaryFile() as tmp_file:
        s3_client.download_fileobj(BUCKET_NAME, MODEL_PATH, tmp_file)
        tmp_file.seek(0)
        model = joblib.load(tmp_file)
    return model

# Model loaded globally on first invocation
model = load_model()

def lambda_handler(event, context):
    try:
        # Parse input data from the request
        input_json = json.loads(event['body'])
        input_data = input_json if isinstance(input_json, list) else [input_json]
        
        # Convert input data to DataFrame
        input_df = pd.DataFrame(input_data)

        # Fill missing columns with default value of 0
        missing_cols = [col for col in expected_columns if col not in input_df.columns]
        for col in missing_cols:
            input_df[col] = 0

        # Ensure DataFrame columns are in the expected order
        input_df = input_df[expected_columns]

        # Convert 'TimeOfDay' column to categorical type if the model expects it
        input_df['TimeOfDay'] = input_df['TimeOfDay'].astype('category')

        # Generate predictions
        predictions = model.predict(input_df)

        # Format and return predictions as JSON response
        return {
            "statusCode": 200,
            "body": json.dumps({"predictions": predictions.tolist()})
        }

    except Exception as e:
        # Handle any errors that occur
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
