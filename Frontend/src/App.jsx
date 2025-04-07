import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

function App() {
    return (
    <>
        <Navbar />
        <Hero />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </>
    )
}

export default App
