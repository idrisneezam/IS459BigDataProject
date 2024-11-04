# Use Python 3.8 slim as the base image
FROM python:3.8-slim

# Set the working directory
WORKDIR /opt/ml/code

# Copy the training script and requirements
COPY train.py .
COPY requirements.txt .

# Make train.py executable
RUN chmod +x train.py

# Install dependencies
RUN pip install -r requirements.txt

# Use the full path for python in the entrypoint
ENTRYPOINT ["/usr/local/bin/python", "train.py"]
