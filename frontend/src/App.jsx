import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Dashboard_admin from './pages/Dashboard_admin'
import Gestion_usuario from './pages/Gestion_usuario'
import AccessDenied from './pages/AccessDenied'
import Trafico from './pages/Trafico'
import Apoyopsiqui from './pages/Apoyopsiqui'
import Perfil_admin from './pages/Perfil_admin'
import UserNotificaciones from './pages/UserNotificaciones'
import AdminAuditoria from './pages/AdminAuditoria'

// Secciones del Dashboard
import Juegos from './pages/Juegos'
import Wrapped from './pages/Wrapped'
import Perfil from './pages/Perfil'
import Configuracion from './pages/Configuracion'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/Dashboard" element={<Dashboard />}>
                    <Route path="juegos" element={<Juegos />} />
                    <Route path="wrapped" element={<Wrapped userId="user123" />} />
                    <Route path="congestion" element={<Trafico />} />
                    <Route path="perfil" element={<Perfil />} />
                    <Route path="apoyo-psicologico" element={<Apoyopsiqui />} />
                    <Route path="configuracion" element={<Configuracion />} />
                    <Route path="notificaciones" element={<UserNotificaciones />} />
                </Route>

                <Route path="/Dashboard_admin" element={<Dashboard_admin />} />
                <Route path="/admin/usuarios" element={<Gestion_usuario />} />
                <Route path="/admin/auditoria" element={<AdminAuditoria />} />
                <Route path="/trafico" element={<Trafico />} /> {/* Ruta para mapa completo */}
                <Route path="/apoyo-psicologico" element={<Apoyopsiqui />} />
                <Route path="/admin/perfil" element={<Perfil_admin />} />
                <Route path="*" element={<AccessDenied />} />
            </Routes>
        </Router>
    )
}

export default App