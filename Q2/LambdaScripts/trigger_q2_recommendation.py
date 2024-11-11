import boto3
import pandas as pd
from io import StringIO
from datetime import datetime
import cohere
import json

# Initialize S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # Extract 'Year' and 'Airline' from the user input (event)
    try:
        body = json.loads(event['body'])  # Parse the body of the request
        year = body.get("Year")
        airline = body.get("Airline")
    except Exception as e:
        return {
            'statusCode': 400,
            'body': f"Error parsing event body: {str(e)}"
        }

    # Define S3 bucket and prefix
    bucket_name = 'projectairlinedatapipeline'
    prefix = 'q2_processed_data/recommendations/'

    # Map airline codes to filenames
    airline_files = {
        'AA': 'filtered_AA.csv',
        'DL': 'filtered_DL.csv',
        'WN': 'filtered_WN.csv'
    }

    # Get the corresponding file name
    file_name = airline_files.get(airline)
    if not file_name:
        return {
            'statusCode': 400,
            'body': f'Invalid airline code: {airline}. Use one of {list(airline_files.keys())}.'
        }

    # Define the S3 object key (path)
    s3_key = f"{prefix}{file_name}"

    try:
        # Fetch the file from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
        file_content = response['Body'].read().decode('utf-8')
        
        # Load the CSV data into a DataFrame
        df = pd.read_csv(StringIO(file_content))
        
        # Filter by the specified year
        df = df[df['Year'] == year]
        
        if df.empty:
            return {
                'statusCode': 200,
                'body': f'No data found for Year {year} and Airline {airline}.'
            }
        
        df = df.groupby('DayofMonth').agg(
            Count=('Year', 'size'),
            Avg_Taxi_Out=('TaxiOut', 'mean'),
            Avg_Dep_Delay=('DepDelay', 'mean'),
            Total_Fuel_Cost=('FuelCost', 'sum'),
            Total_Wages_Cost=('WagesCost', 'sum'),
            Total_Cost=('TotalCost', 'sum')
        ).reset_index()

        # Format the monthly data
        df = format_monthly_summary(df)

        output = create_output(df, year, airline)

        # Use Cohere API for chat-based recommendations
        co = cohere.ClientV2(api_key="") # Input your own api key

        res = co.chat(
            model="command-r-plus-08-2024",
            messages=[{"role": "user", "content": output}]
        )

        # Return the recommendation response
        return {
            'statusCode': 200,
            'body': res.message.content[0].text
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"An error occurred: {str(e)}"
        }

def format_monthly_summary(monthly_data):
    month_names = {
        1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
        7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    }

    monthly_summary = []
    for _, row in monthly_data.iterrows():
        month_name = month_names.get(row['DayofMonth'], 'Unknown')
        monthly_summary.append({
            'Month': month_name,
            'Count': row['Count'],
            'Average Taxi Out Time': round(row['Avg_Taxi_Out'], 0),
            'Average DepDelay Time': round(row['Avg_Dep_Delay'], 0),
            'Fuel Cost': f"${round(row['Total_Fuel_Cost'], 0):,.0f}",
            'Staffing Cost': f"${round(row['Total_Wages_Cost'], 0):,.0f}",
            'Total Cost': f"${round(row['Total_Cost'], 0):,.0f}"
        })
    return monthly_summary

def create_output(monthly_summary, year, airline):
    carriers = {"AA": "American Airlines", "DL": "Delta Air Lines", "WN": "Southwest Airlines"}
    carrier_name = carriers.get(airline, 'Unknown Carrier')

    recommendation_output = [
        f"Given the following data about monthly fuel costs, taxi out times, and delays for {carrier_name} in {year}, please provide a summary of recommendations to reduce operational costs caused by delays, specifically focusing on fuel costs, taxi out times, and staff costs:"
    ]

    # Prepare the formatted string for each month and join them
    month_output = [
        f"Month: {data['Month']}\n"
        f"- Count: {data['Count']}\n"
        f"- Average Taxi Out Time: {data['Average Taxi Out Time']} mins\n"
        f"- Average DepDelay Time: {data['Average DepDelay Time']} mins\n"
        f"- Fuel Cost: {data['Fuel Cost']}\n"
        f"- Staff Cost: {data['Staffing Cost']}\n"
        f"- Total Cost: {data['Total Cost']}\n\n"
        for data in monthly_summary
    ]

    recommendation_output += month_output

    recommendation_output.append(f"What are the key strategies {carrier_name} could implement to reduce these costs, especially focusing on delays, taxi out times, and fuel expenses?")
    
    return "\n".join(recommendation_output)