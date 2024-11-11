from datetime import datetime
from awsglue.context import GlueContext
from pyspark.context import SparkContext
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.types import IntegerType, FloatType, StringType
from pyspark.sql.functions import when, col, round
import boto3

# Initialize Spark and Glue context
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session

# Define paths for input and output
source_bucket = "projectairlinedatapipeline"
input_path = f"s3://{source_bucket}/raw_data/airline.csv.shuffle"
wages_raw_path = f"s3://{source_bucket}/raw_data_wages_fuel/wages_raw_data.csv"
fuel_raw_path = f"s3://{source_bucket}/raw_data_wages_fuel/fuel_raw_data.csv"

# Generate a unique timestamp to avoid conflicts
current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")
timestamped_output_path = f"s3://{source_bucket}/q2_processed_data/{current_time}"
#latest_output_path = f"s3://{source_bucket}/q2_processed_data/latest"
temp_output_path = f"s3://{source_bucket}/q2_processed_data/temp_filtered_airline_data"

temp_reco_AA_path = f"s3://{source_bucket}/q2_processed_data/temp_filtered_reco_AA_airline_data"
temp_reco_DL_path = f"s3://{source_bucket}/q2_processed_data/temp_filtered_reco_DL_airline_data"
temp_reco_WN_path = f"s3://{source_bucket}/q2_processed_data/temp_filtered_reco_WN_airline_data"

# Load data from S3
df = spark.read.format("csv").option("header", "true").load(input_path)
fuel_df = spark.read.format("csv").option("header", "true").load(fuel_raw_path)
wages_df = spark.read.format("csv").option("header", "true").load(wages_raw_path)

# Filtering
selected_carriers = ['DL', 'WN', 'AA']
df_filtered = df.filter((df['UniqueCarrier'].isin(selected_carriers)))
df_filtered = df_filtered.filter(
    (df['Year'] >= 1987) &
    (df['Year'] <= 2018)
)

df_filtered = df_filtered.dropna().filter(df_filtered['DepDelay'] > 0)

################################## CALCULATE WAGES ################################################
# combining the wages and fuel data
q2_raw_df = wages_df.join(fuel_df, "Year", "inner")

# Rename columns in q2_raw_df:
q2_raw_df = q2_raw_df.withColumnRenamed("Jet Fuel (Yearly Average, Dollars/Gallon)", "JetFuelCost") \
                   .withColumnRenamed("AA Pilot Wages", "AAPilotWages") \
                   .withColumnRenamed("AA Flight Attendants Wages", "AAFlightAttendantsWages") \
                   .withColumnRenamed("DL Pilot Wages", "DLPilotWages") \
                   .withColumnRenamed("DL Flight Attendants Wages", "DLFlightAttendantsWages") \
                   .withColumnRenamed("WN Pilot Wages", "WNPilotWages") \
                   .withColumnRenamed("WN Flight Attendants Wages", "WNFlightAttendantsWages")
                   
# Join df_filtered with q2_raw_df
df_joined = df_filtered.join(q2_raw_df, "Year", "left")

# Calculate wages 
average_pilot = 2
average_attendant = 4
df_joined = df_joined.withColumn(
    "WagesCost",
    when(
        col("DepDelay") > 2,
        ((col("DepDelay") - 2) * 5 * average_pilot * (col("AAPilotWages") * (col("UniqueCarrier") == 'AA').cast("int") +
                                                          col("DLPilotWages") * (col("UniqueCarrier") == 'DL').cast("int") +
                                                          col("WNPilotWages") * (col("UniqueCarrier") == 'WN').cast("int")) +
         (col("DepDelay") - 2) * 20 * average_attendant * (col("AAFlightAttendantsWages") * (col("UniqueCarrier") == 'AA').cast("int") +
                                                           col("DLFlightAttendantsWages") * (col("UniqueCarrier") == 'DL').cast("int") +
                                                           col("WNFlightAttendantsWages") * (col("UniqueCarrier") == 'WN').cast("int"))
        )
    ).otherwise(0)
)

# Assuming a known average fuel consumption rate (in gallons/hour)
fuel_consumption_rate = 20  

# Set TaxiOut to 0 if it is "NA"
df_joined = df_joined.withColumn(
    "TaxiOut",
    when(col("TaxiOut") == "NA", 0).otherwise(col("TaxiOut").cast(FloatType()))
)

# Calculate fuel cost wasted during delays
df_joined = df_joined.withColumn(
    "FuelCost",
    when(
        col("TaxiOut") > 0,
        col("TaxiOut") * fuel_consumption_rate * col("JetFuelCost")
    ).otherwise(0)
)

# Round WagesCost, FuelCost, and TotalCost to 2 decimal places
df_joined = df_joined.withColumn("WagesCost", round(col("WagesCost"), 2)) \
                     .withColumn("FuelCost", round(col("FuelCost"), 2)) \
                     .withColumn("TotalCost", round(col("WagesCost") + col("FuelCost"), 2))



# Drop wage-related columns from q2_raw_df
wage_columns = [col for col in q2_raw_df.columns if col != "Year"]
df_joined = df_joined.drop(*wage_columns)

# Drop unnecessary columns
df_joined = df_joined.drop("AirTime", "Distance", "FlightNum", "TaxiIn", "TailNum")

# Replace "NA" string values with actual null values (None)
df_joined = df_joined.replace("NA", None)

df_AA = df_joined \
    .filter(df_joined['UniqueCarrier'] == "AA") \
    .select("Year", "DayofMonth", "TaxiOut", "DepDelay", "FuelCost", "WagesCost", "TotalCost")

df_DL = df_joined \
    .filter(df_joined['UniqueCarrier'] == "DL") \
    .select("Year", "DayofMonth", "TaxiOut", "DepDelay", "FuelCost", "WagesCost", "TotalCost")

df_WN = df_joined \
    .filter(df_joined['UniqueCarrier'] == "WN") \
    .select("Year", "DayofMonth", "TaxiOut", "DepDelay", "FuelCost", "WagesCost", "TotalCost")

######################################## SAVE FILE ################################################
# Save processed data as a single file to the unique timestamped path
df_joined.coalesce(1).write.option("header", "true").mode("overwrite").format("csv").save(timestamped_output_path)

# Save processed data as a single file to the "latest" path, overwriting existing data
df_joined.coalesce(1).write.option("header", "true").mode("overwrite").format("csv").save(temp_output_path)

df_AA.coalesce(1).write.option("header", "true").mode("overwrite").format("csv").save(temp_reco_AA_path)
df_DL.coalesce(1).write.option("header", "true").mode("overwrite").format("csv").save(temp_reco_DL_path)
df_WN.coalesce(1).write.option("header", "true").mode("overwrite").format("csv").save(temp_reco_WN_path)

print(f"ETL job completed successfully.")
print(f"Processed data saved to: {timestamped_output_path}")
print(f"Temporary processed data saved to: {temp_output_path}")


###################################### RENAME CSV FILE ################################################
# Use boto3 to rename the generated CSV file
s3 = boto3.resource('s3')

# Specify your desired output filename
desired_csv_filename = "filtered_airline_data.csv"
bucket = s3.Bucket(source_bucket)

# Find the generated part file (Note: there should be only one part file)
temp_csv_key = None
for obj in bucket.objects.filter(Prefix='q2_processed_data/temp_filtered_airline_data/'):
    if obj.key.endswith('.csv'):
        temp_csv_key = obj.key  # This is the generated part file key
        break

if temp_csv_key:
    # Define the new key for the desired filename
    new_csv_key = f"q2_processed_data/latest/{desired_csv_filename}"

    # Copy the file to the new location with the desired name
    copy_source = {'Bucket': source_bucket, 'Key': temp_csv_key}
    s3.Object(source_bucket, new_csv_key).copy_from(CopySource=copy_source)

    # Optionally, delete the temporary directory
    bucket.objects.filter(Prefix='q2_processed_data/temp_filtered_airline_data/').delete()

    print(f"CSV file saved with desired filename to latest: {new_csv_key}")
else:
    print("No CSV files found to copy.")
    
###################################### FOR RECOMMENDATION ################################################
# Define desired output filenames
desired_filenames = {
    "temp_filtered_reco_AA_airline_data": "filtered_AA.csv",
    "temp_filtered_reco_DL_airline_data": "filtered_DL.csv",
    "temp_filtered_reco_WN_airline_data": "filtered_WN.csv"
}

temp_folders = list(desired_filenames.keys())
bucket = s3.Bucket(source_bucket)

# Iterate over each folder and desired filename
for folder, filename in desired_filenames.items():
    # Find the generated part file
    temp_csv_key = None
    for obj in bucket.objects.filter(Prefix=f'q2_processed_data/{folder}/'):
        if obj.key.endswith('.csv'):
            temp_csv_key = obj.key  # This is the generated part file key
            break

    if temp_csv_key:
        # Define the new key for the desired filename
        new_csv_key = f"q2_processed_data/recommendations/{filename}"
        
        # Copy the file to the new location with the desired name
        copy_source = {'Bucket': source_bucket, 'Key': temp_csv_key}
        s3.Object(source_bucket, new_csv_key).copy_from(CopySource=copy_source)

        # Optionally, delete the temporary directory
        bucket.objects.filter(Prefix=f'q2_processed_data/{folder}/').delete()
        
        print(f"CSV file saved with desired filename to recommendations: {new_csv_key}")
    else:
        print(f"No CSV files found to copy in {folder}.")
