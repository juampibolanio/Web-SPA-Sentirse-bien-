import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/login'; 

export async function loginUser(credentials) {
    const response = await axios.post(API_URL, credentials);
    return response.data; 
}
