import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsService } from '../../services/notificationsService';
import './BreakdownAlerts.css';

const BreakdownAlerts = () => {
  const [breakdowns, setBreakdowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Récupérer l'utilisateur à l'intérieur du composant
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'mecanicien') {
        navigate('/');
        return;
      }
      
      loadBreakdowns(parsedUser.id);
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const loadBreakdowns = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }
      
      const response = await notificationsService.getMechanicNotifications(userId);
      
      // Filtrer seulement les pannes (type breakdown)
      const breakdownNotifications = response.data.filter(
        notification => notification.type === 'breakdown'
      );
      
      setBreakdowns(breakdownNotifications);
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirection gérée par l'intercepteur
        return;
      }
      setError('Erreur lors du chargement des alertes de panne');
      console.error('Erreur lors du chargement des pannes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (breakdownId) => {
    if (!user) return;
    
    try {
      await notificationsService.acceptBreakdown(breakdownId);
      alert('Panne acceptée ! Une notification a été envoyée au chauffeur.');
      loadBreakdowns(user.id); // Recharger la liste avec l'ID utilisateur
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirection gérée par l'intercepteur
        return;
      }
      alert('Erreur lors de l\'acceptation de la panne: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (breakdownId) => {
    if (!user) return;
    
    try {
      await notificationsService.rejectBreakdown(breakdownId);
      alert('Panne refusée ! Une notification a été envoyée au chauffeur.');
      loadBreakdowns(user.id); // Recharger la liste avec l'ID utilisateur
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirection gérée par l'intercepteur
        return;
      }
      alert('Erreur lors du refus de la panne: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResolve = async (breakdownId) => {
    if (!user) return;
    
    try {
      await notificationsService.resolveBreakdown(breakdownId);
      alert('Panne marquée comme résolue !');
      loadBreakdowns(user.id); // Recharger la liste avec l'ID utilisateur
    } catch (err) {
      if (err.response?.status === 401) {
        // Redirection gérée par l'intercepteur
        return;
      }
      alert('Erreur lors de la résolution de la panne: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleBackToDashboard = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'mecanicien') {
        navigate('/mechanic/dashboard');
      } else {
        // Rediriger vers le tableau de bord approprié selon le rôle
        navigate(`/${parsedUser.role}/dashboard`);
      }
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      navigate('/');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { label: 'En attente', class: 'status-pending' },
      'accepted': { label: 'Acceptée', class: 'status-accepted' },
      'rejected': { label: 'Refusée', class: 'status-rejected' },
      'resolved': { label: 'Résolue', class: 'status-resolved' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return <div className="loading">Chargement des alertes de panne...</div>;
  }

  return (
    <div className="breakdown-alerts">
      {/* Bouton de retour en haut */}
      <div className="back-button-container">
        <button className="btn-back" onClick={handleBackToDashboard}>
          ← Retour au Dashboard
        </button>
      </div>

      <div className="alerts-header">
        <h2>🚨 Alertes de Pannes</h2>
        <p>Gérez les pannes signalées par les chauffeurs</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="alerts-container">
        {breakdowns.length === 0 ? (
          <div className="no-alerts">
            <p>Aucune alerte de panne pour le moment</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {breakdowns.map(breakdown => (
              <div key={breakdown.id} className="alert-card">
                <div className="alert-header">
                  <h3>{breakdown.title}</h3>
                  {getStatusBadge(breakdown.status)}
                </div>
                
                <div className="alert-content">
                  <p className="alert-message">{breakdown.message}</p>
                  
                  <div className="alert-details">
                    <div className="detail-item">
                      <strong>Chauffeur:</strong> 
                      {breakdown.driver?.prenom} {breakdown.driver?.nom}
                    </div>
                    <div className="detail-item">
                      <strong>Véhicule:</strong> 
                      {breakdown.vehicleInfo || 'Non spécifié'}
                    </div>
                    <div className="detail-item">
                      <strong>Localisation:</strong> 
                      {breakdown.location || 'Non spécifiée'}
                    </div>
                    <div className="detail-item">
                      <strong>Signalée le:</strong> 
                      {formatDate(breakdown.createdAt)}
                    </div>
                    {breakdown.respondedAt && (
                      <div className="detail-item">
                        <strong>Réponse le:</strong> 
                        {formatDate(breakdown.respondedAt)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="alert-actions">
                  {breakdown.status === 'pending' && (
                    <>
                      <button 
                        className="btn-accept"
                        onClick={() => handleAccept(breakdown.id)}
                      >
                        ✅ Accepter
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => handleReject(breakdown.id)}
                      >
                        ❌ Refuser
                      </button>
                    </>
                  )}
                  
                  {breakdown.status === 'accepted' && (
                    <button 
                      className="btn-resolve"
                      onClick={() => handleResolve(breakdown.id)}
                    >
                      🔧 Marquer comme résolue
                    </button>
                  )}
                  
                  {(breakdown.status === 'rejected' || breakdown.status === 'resolved') && (
                    <span className="action-completed">
                      Action terminée - {breakdown.status === 'rejected' ? 'Refusée' : 'Résolue'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakdownAlerts;