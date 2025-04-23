import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Header } from './components/Header'

function App() {
    return (
    <>  
        <Header />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </>
    )
}

export default App
