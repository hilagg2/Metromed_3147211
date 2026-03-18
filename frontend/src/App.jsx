import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard' // Cambié a mayúscula
import Dashboard_admin from './pages/Dashboard_admin'
import Gestion_usuario from './pages/Gestion_usuario'
import AccessDenied from './pages/AccessDenied'
import Trafico from './pages/Trafico'
import Apoyopsiqui from './pages/Apoyopsiqui'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Dashboard_admin" element={<Dashboard_admin />} />
                <Route path="/admin/usuarios" element={<Gestion_usuario />} />
                <Route path="/trafico" element={<Trafico />} /> {/* Ruta para mapa completo */}
                <Route path="/apoyo-psicologico" element={<Apoyopsiqui />} />
                <Route path="*" element={<AccessDenied />} />
            </Routes>
        </Router>
    )
}

export default App