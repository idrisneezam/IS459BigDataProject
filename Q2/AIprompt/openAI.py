from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Get the API key from the environment variable
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"),)

# Make a request to the OpenAI API
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What is 1 + 1?"}
    ]
)

# Print the response
print(response['choices'][0]['message']['content'])
