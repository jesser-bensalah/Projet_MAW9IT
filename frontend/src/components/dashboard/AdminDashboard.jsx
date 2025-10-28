import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Fonction pour naviguer vers la gestion des utilisateurs
  const navigateToUserManagement = () => {
    navigate('/admin/users');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
      default:
        return (
          <>
            <div className="dashboard-header">
              <h2>Tableau de Bord Administrateur</h2>
              <p>Gestion complète de la plateforme Maw9it</p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>👥 Gestion des Utilisateurs</h3>
                <p>Gérer les chauffeurs, mécaniciens et comptes</p>
                <button 
                  className="card-btn"
                  onClick={navigateToUserManagement} // Changé ici
                >
                  Accéder
                </button>
              </div>

              <div className="dashboard-card">
                <h3>🚍 Gestion des Bus</h3>
                <p>Visualiser et gérer le parc de bus</p>
                <button className="card-btn">Accéder</button>
              </div>

              <div className="dashboard-card">
                <h3>📊 Statistiques</h3>
                <p>Analyses et rapports de la plateforme</p>
                <button className="card-btn">Voir</button>
              </div>

              <div className="dashboard-card">
                <h3>⚙️ Paramètres</h3>
                <p>Configuration de la plateforme</p>
                <button className="card-btn">Configurer</button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>Maw9it - Dashboard Admin</h1>
          <div className="nav-actions">
            <span>Bienvenue, {user?.prenom} {user?.nom}</span>
            <button onClick={handleLogout} className="logout-btn">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;