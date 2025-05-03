// apiService.js (Nuevo archivo para manejar las solicitudes de API)
export const getTurnos = async () => {
    const response = await fetch('http://localhost:8080/api/turnos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener los turnos');
    }

    return await response.json(); 
};
