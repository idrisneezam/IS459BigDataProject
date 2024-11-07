FROM public.ecr.aws/lambda/python:3.8

# Install dependencies
RUN pip install numpy pandas joblib boto3 xgboost

# Copy Lambda function code
COPY lambda_function.py ${LAMBDA_TASK_ROOT}

# Set the CMD to the handler
CMD ["lambda_function.lambda_handler"]
