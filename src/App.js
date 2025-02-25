import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import GruposPage from './pages/GruposPage/GruposPage';
import BuzonPage from './pages/BuzonPage/BuzonPage';
import MisGruposPage from './pages/MisGruposPage/MisGruposPage';  // Asegúrate de importar la nueva página
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/dashboard/grupos" element={<MainLayout><GruposPage /></MainLayout>} />
        <Route path="/dashboard/buzon" element={<MainLayout><BuzonPage /></MainLayout>} />
        <Route path="/dashboard/mis-grupos" element={<MainLayout><MisGruposPage /></MainLayout>} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
