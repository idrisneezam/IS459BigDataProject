import boto3
from datetime import datetime

sagemaker_client = boto3.client("sagemaker")
ecr_client = boto3.client("ecr")
s3_client = boto3.client("s3")

# Define the repository details
repository_name = "sagemaker-xgboost"
account_id = "585768152298"
region = "us-east-1"
bucket_name = "projectairlinedatapipeline"
s3_prefix = "processed_data/latest/filtered_airline_data.csv/"


def get_latest_image_uri(repository_name, account_id, region):
    response = ecr_client.describe_images(
        repositoryName=repository_name,
        filter={"tagStatus": "TAGGED"}
    )
    latest_image = next(
        (image for image in response["imageDetails"]
        if "latest" in image.get("imageTags", [])),
        None
    )
    if latest_image:
        return f"{account_id}.dkr.ecr.{region}.amazonaws.com/{repository_name}:latest"
    else:
        raise ValueError("No 'latest' image found in the repository.")


def get_latest_s3_file(bucket, prefix, file_pattern="part-"):
    try:
        response = s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)
        files = [obj['Key'] for obj in response.get(
            'Contents', []) if file_pattern in obj['Key']]
        if not files:
            raise FileNotFoundError(
                f"No files matching pattern '{file_pattern}' found in S3 prefix: {prefix}")

        # Sort files by the last modified date to get the latest file
        latest_file = max(files, key=lambda x: s3_client.head_object(
            Bucket=bucket, Key=x)['LastModified'])
        print(f"Latest file found: {latest_file}")
        return f"s3://{bucket}/{latest_file}"
    except Exception as e:
        print(f"Error retrieving latest file from S3: {e}")
        raise


def lambda_handler(event, context):
    # Retrieve the latest data file from S3
    data_file_path = get_latest_s3_file(bucket_name, s3_prefix)

    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    job_name = f"xgboost-training-{timestamp}"
    s3_output_path = f"s3://{bucket_name}/models/xgboost-training-{timestamp}"

    # Retrieve the latest image URI from ECR
    training_image_uri = get_latest_image_uri(
        repository_name, account_id, region)

    # Define the training job parameters
    training_params = {
        "TrainingJobName": job_name,
        "AlgorithmSpecification": {
            "TrainingImage": training_image_uri,
            "TrainingInputMode": "File",
        },
        "RoleArn": "arn:aws:iam::585768152298:role/service-role/AmazonSageMakerServiceCatalogProductsUseRole",
        "InputDataConfig": [
            {
                "ChannelName": "train",
                "DataSource": {
                    "S3DataSource": {
                        "S3DataType": "S3Prefix",
                        "S3Uri": data_file_path,  # Use the latest file path
                        "S3DataDistributionType": "FullyReplicated",
                    }
                },
                "ContentType": "text/csv",
            }
        ],
        "OutputDataConfig": {
            "S3OutputPath": s3_output_path,
        },
        "ResourceConfig": {
            "InstanceType": "ml.m5.4xlarge",
            "InstanceCount": 1,
            "VolumeSizeInGB": 30,
        },
        "StoppingCondition": {
            "MaxRuntimeInSeconds": 3600,
        }
    }

    # Start the training job
    try:
        response = sagemaker_client.create_training_job(**training_params)
        print(f"Started training job with name: {job_name}")
        return {
            "statusCode": 200,
            "body": f"Training job {job_name} started successfully."
        }
    except Exception as e:
        print(f"Error starting training job: {e}")
        return {
            "statusCode": 500,
            "body": f"Failed to start training job: {str(e)}"
        }
