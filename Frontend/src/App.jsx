import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Footer } from './components/Footer'
import Services_Beauty from './pages/Services_Beauty'
import Services_Massage from './pages/Services_Massage'
import Services_FaceTreat from './pages/Services_FaceTreat'
import Services_Body from './pages/Services_body'
import Services_Group from './pages/Services_Group'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Turno from './pages/AppointmentForm'
import AdminPanel from './pages/AdminPanel'
import ScrollToTop from './components/ScrollTop'

function App() {
    
    const location = useLocation();
    const hideFooterRoutes = ['/login', '/register', '/reset-password', '/admin-panel']; // Podés agregar más rutas acá

    const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/masajes" element={<Services_Massage />} />
                <Route path="/belleza" element={<Services_Beauty />} />
                <Route path="/tratamientosfaciales" element={<Services_FaceTreat />} />
                <Route path="/tratamientoscorporales" element={<Services_Body />} />
                <Route path="/grupales" element={<Services_Group />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path='/reset-password' element={<ResetPassword />}/>
                <Route path='/turnos' element={<Turno />}/>
                <Route path='/admin-panel' element={<AdminPanel />}/>
            </Routes>
            {!shouldHideFooter && <Footer />}
        </>
    )
}

export default App
