import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const MechanicDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

    const goToFomMecanicien = () => {
    navigate('/formulairemecanicien');
  };

   const goToMessagerie = () => {
    navigate('/chat');
  };


  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>Maw9it - Dashboard Mécanicien</h1>
          <div className="nav-actions">
            <span>Bienvenue, {user?.prenom} {user?.nom}</span>
            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>Tableau de Bord Mécanicien</h2>
          <p>Gérez les interventions et alertes</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📝 Formulaire Mécanicien</h3>
            <p>Compléter vos informations</p>
            <button className="card-btn" onClick={goToFomMecanicien}>Remplir</button>
          </div>

          <div className="dashboard-card">
            <h3>🚨 Alertes Pannes</h3>
            <p>Voir les chauffeurs en panne</p>
            <button className="card-btn">Voir alertes</button>
          </div>

          <div className="dashboard-card">
            <h3>💬 Chatbot</h3>
            <p>Communiquer avec les chauffeurs</p>
            <button className="card-btn" onClick={goToMessagerie}>Ouvrir</button>
          </div>

          <div className="dashboard-card">
            <h3>📋 Interventions</h3>
            <p>Historique des interventions</p>
            <button className="card-btn">Consulter</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MechanicDashboard;