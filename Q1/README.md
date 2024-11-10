# IS459 Big Data Project: Airline Delay Prediction Pipeline

This project is an end-to-end pipeline that predicts airline delays based on historical flight data. It includes ETL processing, model training using Amazon SageMaker, and real-time prediction generation through a serverless architecture on AWS. The project leverages AWS Lambda, AWS Glue, Amazon S3, Amazon ECR, and SageMaker to automate the pipeline from data ingestion to prediction. A simple web UI allows users to input flight details and receive delay predictions.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [AWS S3](#aws-s3)
  - [AWS Glue ETL Job](#aws-glue-etl-job)
  - [Amazon SageMaker Training Job](#amazon-sagemaker-training-job)
  - [AWS Lambda Functions](#aws-lambda-functions)
  - [Amazon ECR Containers](#amazon-ecr-containers)
  - [Web UI](#web-ui)
- [Pipeline Flow](#pipeline-flow)
- [Setup and Configuration](#setup-and-configuration)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

## Architecture

The airline delay prediction pipeline consists of the following components:

1. **Data Storage**: Historical flight data is stored in Amazon S3.
2. **ETL Job**: AWS Glue ETL job cleans and preprocesses the data and saves it to another S3 location.
3. **Model Training**: A SageMaker training job uses the preprocessed data to train a machine learning model (XGBoost) and saves the trained model in S3.
4. **Prediction Generation**: A Lambda function utilizes the trained model from S3 to generate predictions on user inputs.
5. **Web UI**: A simple web UI allows users to input flight details and receive predictions.

## Components

### AWS S3

- **Raw Data**: The raw flight data is stored in `s3://projectairlinedatapipeline/raw_data/`.
- **Processed Data**: The ETL job saves processed data in `s3://projectairlinedatapipeline/processed_data/`.
- **Model Storage**: The trained model is stored in `s3://projectairlinedatapipeline/models/latest/xgb_model.joblib`.

### AWS Glue ETL Job

- **Name**: `Question 1 ETL Job`
- **Purpose**: Cleanses, transforms, and catalogs data for training.
- **Trigger**: An S3 upload event in the `raw_data` folder triggers the `TriggerAhmadGlueETLJob` Lambda function to start this ETL job.
- **Output**: Processed data is stored in the `processed_data` folder in S3.

### Amazon SageMaker Training Job

- **Container**: A custom-built container stored in Amazon ECR (`sagemaker-xgboost`) contains the training environment.
- **Lambda Trigger**: `lambdaTriggerSagemakerTrainingJobAhmad` function is triggered after the ETL job completes.
- **Output**: The trained model is saved as a joblib file in S3.

### AWS Lambda Functions

1. **TriggerAhmadGlueETLJob**
   - **Function**: Initiates the Glue ETL job when a new file is uploaded to the `raw_data` folder in S3.

2. **lambdaTriggerSagemakerTrainingJobAhmad**
   - **Function**: Starts the SageMaker training job after the ETL job finishes successfully.

3. **generateoutputahmad**
   - **Function**: Loads the joblib model from S3 and generates predictions based on user input from the web UI.

### Amazon ECR Containers

- **Model Training Container**: `sagemaker-xgboost` - Contains the environment and dependencies required for training the model in SageMaker.
- **Output Generation Container**: `generate-output-container` - Contains the environment for the `generateoutputahmad` Lambda function to generate predictions.

### Web UI

- **Purpose**: Provides a user interface for users to input flight details and receive delay predictions.
- **Backend**: Calls the `generateoutputahmad` Lambda function to process user inputs and return predictions.

## Pipeline Flow

1. **Data Upload**: Historical flight data is uploaded to the `raw_data` folder in S3.
2. **ETL Job Trigger**: The upload triggers the `TriggerAhmadGlueETLJob` Lambda function, which starts the AWS Glue ETL job.
3. **ETL Job**: The Glue ETL job cleanses and transforms the data, then saves it to the `processed_data` folder in S3.
4. **SageMaker Training Job**: Once the ETL job completes, `lambdaTriggerSagemakerTrainingJobAhmad` Lambda function initiates a SageMaker training job.
5. **Model Storage**: The trained model is saved in S3.
6. **Prediction Generation**: The `generateoutputahmad` Lambda function is invoked by the web UI to generate predictions using the trained model.
7. **Web UI Output**: The web UI displays the prediction result to the user.

## Setup and Configuration

1. **S3 Buckets**: Create buckets for raw data, processed data, and model storage (`projectairlinedatapipeline/raw_data`, `projectairlinedatapipeline/processed_data`, and `projectairlinedatapipeline/models`).
2. **Glue ETL Job**: Configure AWS Glue with the appropriate IAM roles and security permissions. Set the script path and logging settings.
3. **SageMaker Training**: Deploy the training container to Amazon ECR. Configure SageMaker to use this image and set up a training role.
4. **Lambda Functions**: Create and configure the Lambda functions:
   - `TriggerAhmadGlueETLJob` to listen to S3 events.
   - `lambdaTriggerSagemakerTrainingJobAhmad` to start after ETL job completion.
   - `generateoutputahmad` to generate predictions from the trained model.
5. **Web UI**: Deploy the frontend application that collects user inputs and displays predictions. Integrate it with `generateoutputahmad` for backend processing.

## Usage

1. **Uploading Data**: Place new flight data in the `raw_data` folder in S3. The pipeline will automatically start processing.
2. **Generating Predictions**: Access the web UI, enter flight details, and receive delay predictions in real-time.

## Future Improvements

- **Model Monitoring**: Add monitoring for model performance to ensure continued accuracy.
- **Error Handling**: Improve error handling in Lambda functions and Glue jobs.
- **Scalability**: Optimize resource allocation for large datasets and multiple concurrent users.
- **User Authentication**: Add authentication to the web UI to restrict access to authorized users.
- **Real-time Data Integration**: Enhance the ETL job to incorporate real-time data feeds. 

This automated pipeline enables scalable and efficient airline delay predictions, making it easy to continuously train and serve models as new data becomes available.
