import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import PrivateRoute from './routes/PrivateRoute';
import SolicitudTurno from './pages/SolicitudTurno';
import Registro from './pages/Registro';
import ProfesionalHome from './pages/ProfesionalHome';
import Header from './components/header';
import DraHome from './pages/DraHome';
import CrearServicio from './pages/CrearServicio';
import CrearTurnoManual from './pages/CrearTurnoManual';
import ReportesPagos from './pages/ReportePagos';
import HomePublic from './pages/HomePublic';
import ServiciosPublic from './pages/ServiciosPublic';
import TurnosPublic from './pages/TurnosPublic';

export default function App() {
    return (
        <>
        <Router>
            <Header/>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/home"
                    element={
                        <Home />
                    }
                />
                <Route
                    path="/servicios-public"
                    element={
                        <ServiciosPublic />
                    }
                />
                <Route
                    path="/turnos"
                    element={
                        <TurnosPublic />
                    }
                />
                <Route
                    path="/servicios"
                    element={
                        <Servicios />
                    }
                />
                <Route
                    path="/solicitud-turno"
                    element={
                        <SolicitudTurno />
                    }
                />
                <Route
                    path="/register"
                    element={
                        <Registro />
                    }
                />
                <Route
                    path="/panel-profesional"
                    element={
                        <ProfesionalHome />
                    }
                />
                <Route
                    path="/dra"
                    element={
                        <DraHome />
                    }
                />
                <Route
                    path="/dra/crear-servicio"
                    element={
                        <CrearServicio />
                    }
                />
                <Route
                    path="/dra/crear-turno-manual"
                    element={
                        <CrearTurnoManual />
                    }
                />
                <Route
                    path="/dra/reportes"
                    element={
                        <ReportesPagos />
                    }
                />
                {/* Redirección por defecto */}
                <Route
                    path="/"
                    element={
                        <HomePublic />
                    }
                />
            </Routes>
        </Router>
        </>
    );
    
}
