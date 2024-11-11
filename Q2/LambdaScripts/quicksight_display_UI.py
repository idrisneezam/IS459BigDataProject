import json
import boto3
import os

def lambda_handler(event, context):
    quicksight = boto3.client('quicksight', region_name=os.environ['AWS_REGION'])

    account_id = os.environ['AWS_ACCOUNT_ID']
    dashboard_id = os.environ['DASHBOARD_ID']
    user_arn = '???'

    try:
        response = quicksight.generate_embed_url_for_registered_user(
            AwsAccountId=account_id,
            UserArn=user_arn,
            ExperienceConfiguration={
                'Dashboard': {
                    'InitialDashboardId': dashboard_id
                }
            },
            SessionLifetimeInMinutes=600,
            AllowedDomains=['http://localhost:5173']
        )

        embed_url = response['EmbedUrl']

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'embedUrl': embed_url})
        }

    except Exception as e:
        print(f"Error generating embed URL: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
