import axios from 'axios';

const API_URL = 'https://<dummy data>'; // Replace with your actual API endpoint

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
