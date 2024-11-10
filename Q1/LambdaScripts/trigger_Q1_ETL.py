import boto3
import json

# Initialize the Glue client
glue_client = boto3.client('glue')

# Name of the Glue job to trigger
GLUE_JOB_NAME = "Question 1 ETL Job"

def lambda_handler(event, context):
    try:
        # Start the Glue job
        response = glue_client.start_job_run(JobName=GLUE_JOB_NAME)

        # Return the JobRunId in the response for tracking
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": f"Glue job '{GLUE_JOB_NAME}' started successfully.",
                "JobRunId": response['JobRunId']
            })
        }

    except Exception as e:
        # Return error message if the job fails to start
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }
