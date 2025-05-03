export const loginUser = async (credentials) => {
    try {
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: credentials.usuario,
                password: credentials.password
            })
        });

        const token = await response.text(); 
        console.log('Token recibido:', token);

        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }

        return { token }; 
    } catch (error) {
        console.error('Error en loginUser:', error.message);
        throw error;
    }
};
