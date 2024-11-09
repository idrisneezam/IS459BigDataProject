import boto3
import json
import os

# Initialize QuickSight client
quicksight = boto3.client('quicksight')

# Define your QuickSight dataset ID and AWS account ID
QUICKSIGHT_DATASET_ID = "your_dataset_id"
AWS_ACCOUNT_ID = "your_aws_account_id"
QUICKSIGHT_ANALYSIS_ID = "your_analysis_id"

def lambda_handler(event, context):
    try:
        # Log the event
        print("Received event:", json.dumps(event))

        # Trigger QuickSight dataset refresh
        response = quicksight.update_data_set_refresh_schedule(
            AwsAccountId=AWS_ACCOUNT_ID,
            DataSetId=QUICKSIGHT_DATASET_ID
        )

        # Log the response
        print("QuickSight dataset refresh triggered:", response)

        # Optionally trigger an analysis refresh (if needed)
        analysis_response = quicksight.start_dashboard_snapshot_job(
            AwsAccountId=AWS_ACCOUNT_ID,
            AnalysisId=QUICKSIGHT_ANALYSIS_ID
        )
        
        # Log the analysis response
        print("QuickSight analysis refresh triggered:", analysis_response)

        return {
            "statusCode": 200,
            "body": json.dumps("QuickSight dataset and analysis refresh triggered successfully!")
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }
