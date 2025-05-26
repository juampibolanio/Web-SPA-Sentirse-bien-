import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate(); // 👈 este hook permite redireccionar

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/home');
            window.location.reload();
            

        } catch (error) {
            setMensaje(error.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Contraseña:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Ingresar</button>

                {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
            </form>
        </div>
    );
}
