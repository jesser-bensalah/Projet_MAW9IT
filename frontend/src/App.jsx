import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicPage from './components/PublicPage';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/dashboard/AdminDashboard';
import DriverDashboard from './components/dashboard/DriverDashboard';
import MechanicDashboard from './components/dashboard/MechanicDashboard';
import FormulaireChauffeur from './pages/FormulaireChauffeur';
import ListeChauffeur from './pages/ListeChauffeur';
import FormulaireMecanicien from './pages/FormulaireMecanicien';
import ListeMecanicien from './pages/ListeMecanicien';
import CasPanne from './pages/CasPanne';
import ListeCasPanne from './pages/ListeCasPanne';
import CasRetard from './pages/CasRetard';
import ListeCasRetard from './pages/ListeCasRetard';
import ListeMecanicienChauffeur from './pages/ListeMacanicienChauffeur';
import UserManagement from './components/admin/UserManagement';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/formulairechauffeur" element={<FormulaireChauffeur />} />
          <Route path="/liste-chauffeurs" element={<ListeChauffeur />} />
          <Route path="/formulairemecanicien" element={<FormulaireMecanicien />} />
          <Route path="/liste-mecaniciens" element={<ListeMecanicien />} />
          <Route path="/cas-retard" element={<CasRetard />} />
          <Route path="/liste-cas-retard" element={<ListeCasRetard />} />
          <Route path="/cas-panne" element={<CasPanne />} />
          <Route path="/liste-cas-panne" element={<ListeCasPanne />} />
          <Route path="/liste-mecaniciens-chauffeur" element={<ListeMecanicienChauffeur />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;