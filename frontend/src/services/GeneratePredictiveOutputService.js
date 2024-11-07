import axios from 'axios';

const API_URL = 'https://fyj8mwh28k.execute-api.us-east-1.amazonaws.com/generateoutputahmad'

// Send prediction data to the API and retrieve the result
export async function fetchOutputResults(formData) {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching prediction results:', error);
        throw error;
    }
}
