import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
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
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import Productos from './pages/Productos';
import AdminDashboard from './pages/AdminDashboard';
import ProductoDetalle from './pages/ProductoDetalle';   

function AppContent() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "iI4B1Odx4mDZkyNhLBtBw";  // tu ID personalizado
        script.setAttribute("domain", "www.chatbase.co");
        document.body.appendChild(script);
    }, []);

    return (
        <>
            {loading && <PageLoader />}
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/servicios-public" element={<ServiciosPublic />} />
                <Route path="/turnos" element={<TurnosPublic />} />
                <Route path="/servicios" element={<Servicios />} />
                <Route path="/solicitud-turno" element={<SolicitudTurno />} />
                <Route path="/register" element={<Registro />} />
                <Route path="/panel-profesional" element={<ProfesionalHome />} />
                <Route path="/dra" element={<DraHome />} />
                <Route path="/dra/crear-servicio" element={<CrearServicio />} />
                <Route path="/dra/crear-turno-manual" element={<CrearTurnoManual />} />
                <Route path="/dra/reportes" element={<ReportesPagos />} />
                
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/" element={<HomePublic />} />
            </Routes>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
