from datetime import datetime
from awsglue.context import GlueContext
from pyspark.context import SparkContext
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.types import IntegerType, FloatType, StringType

# Initialize Spark and Glue context
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session

# Define paths for input and output
source_bucket = "projectairlinedatapipeline"
input_path = f"s3://{source_bucket}/raw_data/airline.csv.shuffle"

# Generate a unique timestamp to avoid conflicts
current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")
timestamped_output_path = f"s3://{source_bucket}/processed_data/{current_time}/filtered_airline_data.csv"
latest_output_path = f"s3://{source_bucket}/processed_data/latest/filtered_airline_data.csv"

# Load data from S3
df = spark.read.format("csv").option("header", "true").load(input_path)

# Data preparation steps
columns_needed = [
    'Year', 'Month', 'DayofMonth', 'DayOfWeek',
    'CRSDepTime', 'CRSArrTime', 'CRSElapsedTime',
    'DepDelay', 'Origin', 'Dest', 'UniqueCarrier',
    'Distance'
]
df = df.select(columns_needed)

selected_carriers = ['DL', 'WN', 'AA']
selected_destinations = ['ORD', 'ATL', 'DFW']
df_filtered = df.filter((df['UniqueCarrier'].isin(selected_carriers)) & (df['Dest'].isin(selected_destinations)))
df_filtered = df_filtered.dropna().filter(df_filtered['DepDelay'] >= 0)

df_filtered = df_filtered.withColumn("CRSDepTime", F.format_string("%04d", df_filtered["CRSDepTime"].cast(IntegerType())))
df_filtered = df_filtered.withColumn("CRSArrTime", F.format_string("%04d", df_filtered["CRSArrTime"].cast(IntegerType())))
df_filtered = df_filtered.withColumn("DepHour", df_filtered["CRSDepTime"].substr(1, 2).cast(IntegerType()))
df_filtered = df_filtered.withColumn("DepMinute", df_filtered["CRSDepTime"].substr(3, 2).cast(IntegerType()))
df_filtered = df_filtered.withColumn("ArrHour", df_filtered["CRSArrTime"].substr(1, 2).cast(IntegerType()))
df_filtered = df_filtered.withColumn("ArrMinute", df_filtered["CRSArrTime"].substr(3, 2).cast(IntegerType()))

df_filtered = df_filtered.withColumn("IsWeekend", F.when(df_filtered['DayOfWeek'].isin([6, 7]), 1).otherwise(0))

def time_of_day(hour):
    return (F.when((hour >= 5) & (hour < 12), 'Morning')
            .when((hour >= 12) & (hour < 17), 'Afternoon')
            .when((hour >= 17) & (hour < 21), 'Evening')
            .otherwise('Night'))

df_filtered = df_filtered.withColumn("TimeOfDay", time_of_day(df_filtered['DepHour']))

# Save processed data as a single file to the unique timestamped path
df_filtered.coalesce(1).write.mode("overwrite").format("csv").save(timestamped_output_path)

# Save processed data as a single file to the "latest" path, overwriting existing data
df_filtered.coalesce(1).write.mode("overwrite").format("csv").save(latest_output_path)

print(f"ETL job completed successfully.")
print(f"Processed data saved to: {timestamped_output_path}")
print(f"Latest processed data saved to: {latest_output_path}")