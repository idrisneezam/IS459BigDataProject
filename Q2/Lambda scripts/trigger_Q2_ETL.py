import boto3
import json

# Initialize the AWS Glue client
glue = boto3.client('glue')

# Define your Glue job name
GLUE_JOB_NAME = "Question 2 ETL job"

def lambda_handler(event, context):
    try:
        # Log the event (for debugging purposes)
        print("Received event:", json.dumps(event))

        # Extract bucket and object key from the S3 event
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        object_key = event['Records'][0]['s3']['object']['key']

        print(f"File {object_key} was uploaded to bucket {bucket_name}.")

        # Start the Glue job
        response = glue.start_job_run(JobName=GLUE_JOB_NAME)
        print("Glue job started:", response)

        return {
            'statusCode': 200,
            'body': json.dumps('Glue job triggered successfully!')
        }
    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps('Failed to trigger Glue job.')
        }
