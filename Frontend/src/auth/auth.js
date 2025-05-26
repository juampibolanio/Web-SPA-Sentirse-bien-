import axios from 'axios';

export function getToken() {
    return localStorage.getItem("token");
}

export function saveToken(token) {
    localStorage.setItem("token", token);
}

export function deleteToken() {
    localStorage.removeItem("token");
}

export function logout() {
    deleteToken();
}

export function getUserEmailFromToken() {
    const token = getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    try {
        const decoded = JSON.parse(atob(payload));
        return decoded.sub || null;
    } catch (err) {
        return null;
        
    }
}

export async function getUsuarioPorToken() {
    const email = getUserEmailFromToken();
    if (!email) throw new Error('No se pudo extraer el email del token');

    const token = getToken();
    const response = await axios.get(`http://localhost:8080/api/usuarios/email/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function fetchUsuarioPorEmail(email) {
    const res = await fetch(`http://localhost:8080/api/usuarios/email/${email}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!res.ok) throw new Error('Error al obtener usuario');
    return res.json();
}