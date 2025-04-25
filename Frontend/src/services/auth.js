import axios from 'axios';

// Configuración básica de la URL base para todas las solicitudes
const API_URL = 'http://localhost:8080'; // URL de tu backend de Spring Boot

// Crear una instancia de axios con la URL base configurada
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para agregar el token JWT a cada solicitud
api.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // Si el token está presente, agregarlo al encabezado Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Manejo de errores si la solicitud falla
        return Promise.reject(error);
    }
);

// Función para hacer login
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data; // Devuelve el token JWT
    } catch (error) {
        console.error('Error al iniciar sesión:', error.response?.data || error.message);
        throw error.response?.data || new Error('Error al iniciar sesión');
    }
};

// Función para hacer registro
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData); // Usando axios para registrar
        return response.data; // Devuelve la respuesta del backend (mensaje o token)
    } catch (error) {
        console.error('Error al registrar el usuario:', error.response?.data || error.message);
        throw error.response?.data || new Error('Error al registrar el usuario');
    }
};

export default api;
