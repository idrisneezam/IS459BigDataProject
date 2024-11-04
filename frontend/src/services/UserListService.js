import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Retrieve a list of users from the API
export async function fetchUsers() {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};