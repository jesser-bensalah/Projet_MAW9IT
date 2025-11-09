import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import DriverBellNotification from '../driver/DriverBellNotification';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'chauffeur') {
      navigate('/login');
      return;
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const goToForm = () => {
    navigate('/formulairechauffeur');
  };

  const goToFormPanne = () => {
    navigate('/cas-panne');
  };

  const goToFormRetard = () => {
    navigate('/cas-retard');
  };

  const goToListeMecanicien = () => {
    navigate('/liste-mecaniciens-chauffeur');
  };

  const goToMessagerie = () => {
    navigate('/chat');
  };

  const goToFormDepart = () => {
    navigate('/cas-depart');
  };

  // Si pas d'utilisateur, ne rien afficher
  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>Maw9it - Dashboard Chauffeur</h1>
          <div className="nav-actions">
            <span>Bienvenue, {user?.prenom} {user?.nom}</span>
            <div className="nav-buttons">
              {user && (
                <div className="notification-bell">
                  <DriverBellNotification userId={user.id} />
                </div>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>Tableau de Bord Chauffeur</h2>
          <p>Gérez vos trajets et signalements</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📝 Formulaire Chauffeur</h3>
            <p>Créer ou modifier votre formulaire</p>
            <button className="card-btn" onClick={goToForm}>Gérer</button>
          </div>

          <div className="dashboard-card">
            <h3>🚨 Signaler une Panne</h3>
            <p>Envoyer une alerte au mécanicien</p>
            <button className="card-btn" onClick={goToFormPanne}>Signaler</button>
          </div>

          <div className="dashboard-card">
            <h3>🚨 Signaler un retard</h3>
            <p>Envoyer une notification au passager</p>
            <button className="card-btn" onClick={goToFormRetard}>Signaler</button>
          </div>

          <div className="dashboard-card">
            <h3>🚨 Signaler un départ</h3>
            <p>Envoyer une notification au passager</p>
            <button className="card-btn" onClick={goToFormDepart}>Signaler</button>
          </div>

          <div className="dashboard-card">
            <h3>🔧 Mécaniciens Proches</h3>
            <p>Visualiser les mécaniciens disponibles</p>
            <button className="card-btn" onClick={goToListeMecanicien}>Voir</button>
          </div>

          <div className="dashboard-card">
            <h3>💬 Chatbot</h3>
            <p>Communiquer avec les mécaniciens</p>
            <button className="card-btn" onClick={goToMessagerie}>Ouvrir</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;