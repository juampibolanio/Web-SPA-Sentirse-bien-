import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../auth/auth';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        deleteToken();
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Cerrar sesión
        </button>
    );
}
