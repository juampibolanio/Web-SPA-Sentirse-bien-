import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/login'; // Cambiar si tu backend está en otra URL

export async function loginUser(credentials) {
    const response = await axios.post(API_URL, credentials);
    return response.data; // Debería contener el token
}
