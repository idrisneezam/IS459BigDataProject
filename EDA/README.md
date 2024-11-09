# Exploratory Data Analysis (EDA) for Airline Delay Prediction

## Project Overview
This notebook conducts an exploratory data analysis (EDA) of the On-Time Airline Performance dataset, focusing on identifying key factors that influence flight delays. The insights derived from this analysis help to refine our business problem and shape the data pipeline for a predictive model to forecast airline departure delays. 

## Objectives
1. To identify primary factors influencing flight delays.
2. To determine patterns and trends that can inform the structure of the predictive model.
3. To refine the business problem scope by focusing on actionable, high-impact variables for delay prediction.

## Key EDA Insights

### 1. Departure Delays as a Key Predictor
- **Insight**: Departure delays show a strong correlation with overall delay impact, as airlines often attempt to compensate for late departures by adjusting flight speeds to reduce arrival delays.
- **Relevance**: This finding led us to focus on predicting departure delays as an actionable indicator of delay patterns, helping airlines manage scheduling and resources more effectively.

### 2. Top Carriers and Origin Airports with High Delay Rates
- **Insight**: Filtering data to include only the top three carriers and the top three origin airports with the highest delay records helped narrow the dataset, targeting high-impact routes and carriers.
- **Relevance**: This selection enables more precise and contextually relevant delay predictions, ensuring the model is optimized for the most frequent and influential flight paths.

### 3. Weekend and Time-of-Day Patterns
- **Insight**: Higher delay occurrences were observed on weekends and specific times of day, with peak delays often occurring during high-traffic periods.
- **Relevance**: These temporal patterns were included as features in the model, allowing for more accurate predictions that consider traffic variation by day and time, supporting airlines in proactive resource planning.

### 4. Delay Severity Classification
- **Insight**: Delays were categorized into three severity levels: "On time," "Moderate delay," and "Major delay." This classification aligns predictions with actionable thresholds, aiding airlines in assessing and communicating expected delays.
- **Relevance**: This approach allows airlines to provide more transparent delay information, enhancing passenger satisfaction by setting realistic expectations and improving communication.

## Data Pipeline and Feature Engineering Decisions
The EDA findings guided several key decisions for structuring our data pipeline:
- **Data Filtering**: Focused on top carriers and origin airports to optimize model training on relevant data.
- **Feature Engineering**: Created new features such as `TimeOfDay`, `IsWeekend`, and `DelayCategory` based on EDA insights, enhancing the model’s ability to predict delay severity accurately.
- **Classification Approach**: The delay severity classification was embedded into the model to provide specific, actionable delay categories.

## Next Steps
Following this EDA, the next steps involve setting up the data pipeline, incorporating these engineered features, and training the predictive model using the refined dataset. These insights form the foundation for a robust and contextually relevant delay prediction model that can assist airlines in managing delays proactively and improving passenger communication.

## Dependencies
- Python 3.x
- Pandas, NumPy
- Matplotlib, Seaborn (for visualizations)
- PySpark (for data processing)
- AWS Glue, SageMaker, Lambda (for data pipeline and model deployment)
