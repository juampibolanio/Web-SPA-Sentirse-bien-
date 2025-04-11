import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Shifts from './pages/Shifts'
import Contact from './pages/Contact'
import Footer from './components/Footer'

function App() {
    return (
    <>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/services' element={<Services />} />
            <Route path='/shifts' element={<Shifts />} />
            <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer />
    </>
    )
}

export default App
