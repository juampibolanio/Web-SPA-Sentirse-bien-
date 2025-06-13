import axios from 'axios';
import { getToken } from '../auth/auth';
import { getUserEmailFromToken } from '../auth/auth';

const API_URL = 'http://localhost:8080/api/usuarios/email';

export async function getUsuarioPorEmail(email) {
    const response = await axios.get(`${API_URL}/${email}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}


export async function getUsuarioDesdeToken() {
    const email = getUserEmailFromToken();
    if (!email) throw new Error('No se pudo extraer el email del token');
    return await getUsuarioPorEmail(email);
}
