import axios from 'axios';
import { getToken } from '../auth/auth';

const API_URL = 'http://localhost:8080/api/usuarios/email';

export async function getUsuarioPorEmail(email) {
    const response = await axios.get(`${API_URL}/${email}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}
