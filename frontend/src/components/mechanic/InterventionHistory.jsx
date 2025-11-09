import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsService } from '../../services/notificationsService';
import './InterventionHistory.css';

const InterventionHistory = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const calculateDuration = (createdAt, respondedAt) => {
    if (!createdAt || !respondedAt) return 'Non disponible';
    
    try {
      const start = new Date(createdAt);
      const end = new Date(respondedAt);
      const diffMs = end - start;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}min`;
      }
      return `${diffMinutes}min`;
    } catch (e) {
      return 'Non disponible';
    }
  };

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
      
      loadInterventions(parsedUser.id);
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const loadInterventions = async (userId) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }
      
      const response = await notificationsService.getMechanicNotifications(userId);
      
      if (!response || !response.data) {
        setInterventions([]);
        return;
      }

      const mechanicInterventions = response.data.filter(notification => {
        const isMechanicNotification = notification.mechanicId === userId;
        const isAcceptedOrResolved = notification.status === 'accepted' || notification.status === 'resolved';
        
        return isMechanicNotification && isAcceptedOrResolved;
      });
      
      const sortedInterventions = mechanicInterventions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setInterventions(sortedInterventions);
      
    } catch (err) {
      if (err.response?.status === 401) {
        return;
      }
      setError('Erreur lors du chargement des interventions. Veuillez réessayer.');
      console.error('Erreur lors du chargement des interventions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/mechanic/dashboard');
  };

  const getFilteredInterventions = () => {
    switch (filter) {
      case 'accepted':
        return interventions.filter(intervention => intervention.status === 'accepted');
      case 'resolved':
        return interventions.filter(intervention => intervention.status === 'resolved');
      default:
        return interventions;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'accepted': { 
        label: 'En cours', 
        class: 'status-accepted', 
        icon: '⏳' 
      },
      'resolved': { 
        label: 'Terminée', 
        class: 'status-resolved', 
        icon: '✅' 
      },
      'pending': { 
        label: 'En attente', 
        class: 'status-pending', 
        icon: '⏱️' 
      }
    };
    
    const config = statusConfig[status] || { 
      label: status, 
      class: 'status-default', 
      icon: '🔔' 
    };
    
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      'breakdown': { icon: '🔧', label: 'Panne' },
      'acceptance': { icon: '✅', label: 'Acceptation' },
      'rejection': { icon: '❌', label: 'Refus' },
      'default': { icon: '📋', label: 'Intervention' }
    };
    
    const config = icons[type] || icons.default;
    return (
      <div className="type-icon">
        <span className="icon">{config.icon}</span>
        <span className="label">{config.label}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <div className="intervention-history">
        <div className="back-button-container">
          <button className="btn-back" onClick={handleBackToDashboard}>
            <span className="icon">←</span>
            Retour au Tableau de Bord
          </button>
        </div>
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Chargement des interventions</h2>
          <p>Récupération de votre historique en cours...</p>
        </div>
      </div>
    );
  }

  const filteredInterventions = getFilteredInterventions();

  return (
    <div className="intervention-history">
      {/* Navigation */}
      <div className="navigation-section">
        <div className="container">
          <div className="back-button-container">
            <button className="btn-back" onClick={handleBackToDashboard}>
              <span className="icon">←</span>
              Retour au Tableau de Bord
            </button>
            <button 
              onClick={() => user && loadInterventions(user.id)} 
              className="btn-reload"
            >
              <span className="icon">🔄</span>
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* En-tête principal */}
     
      

      {/* Message d'erreur */}
      {error && (
        <div className="error-section">
          <div className="container">
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <strong>Erreur de chargement</strong>
                <p>{error}</p>
              </div>
              <button 
                onClick={() => user && loadInterventions(user.id)} 
                className="btn-retry"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-section">
        <div className="container">
          <div className="section-header">
            <h2> Historique des Interventions</h2>
            <p> Vue d'ensemble de statistiques de vos interventions</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <span className="stat-number">{interventions.length}</span>
                <span className="stat-label">Total des interventions</span>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-number">
                  {interventions.filter(i => i.status === 'resolved').length}
                </span>
                <span className="stat-label">Interventions terminées</span>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <span className="stat-number">
                  {interventions.filter(i => i.status === 'accepted').length}
                </span>
                <span className="stat-label">En cours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="container">
          <div className="section-header">
            <h2>Filtrer les interventions</h2>
            <p>Affichez les interventions par statut</p>
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <span className="filter-icon">📁</span>
              Toutes
              <span className="filter-count">({interventions.length})</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilter('accepted')}
            >
              <span className="filter-icon">⏳</span>
              En cours
              <span className="filter-count">({interventions.filter(i => i.status === 'accepted').length})</span>
            </button>
            <button 
              className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilter('resolved')}
            >
              <span className="filter-icon">✅</span>
              Terminées
              <span className="filter-count">({interventions.filter(i => i.status === 'resolved').length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des interventions */}
      <div className="interventions-section">
        <div className="container">
          <div className="section-header">
           
            <p>
              {filteredInterventions.length === 0 
                ? 'Aucune intervention trouvée' 
                : `${filteredInterventions.length} intervention(s) ${filter === 'all' ? 'au total' : filter === 'accepted' ? 'en cours' : 'terminées'}`
              }
            </p>
          </div>

          <div className="interventions-container">
            {filteredInterventions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-content">
                  <h3>Aucune intervention trouvée</h3>
                  <p>
                    {filter === 'all' 
                      ? "Vous n'avez pas encore d'interventions. Les pannes que vous acceptez apparaîtront ici."
                      : `Aucune intervention ${filter === 'accepted' ? 'en cours' : 'terminée'} pour le moment.`
                    }
                  </p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/mechanic/breakdowns')}
                  >
                    <span className="icon">🚨</span>
                    Consulter les alertes de pannes
                  </button>
                </div>
              </div>
            ) : (
              <div className="interventions-list">
                {filteredInterventions.map(intervention => (
                  <div key={intervention.id} className="intervention-card">
                    {/* En-tête de la carte */}
                    <div className="card-header">
                      <div className="card-title-section">
                        {getTypeIcon(intervention.type)}
                        <div className="title-content">
                          <h3>{intervention.title || 'Intervention technique'}</h3>
                          <div className="card-meta">
                            <span className="date">
                              <span className="meta-icon">📅</span>
                              {formatDate(intervention.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(intervention.status)}
                    </div>

                    {/* Contenu de la carte */}
                    <div className="card-content">
                      <div className="intervention-message">
                        <p>{intervention.message || 'Aucune description fournie'}</p>
                      </div>
                      
                      <div className="details-grid">
                        <div className="detail-group">
                          <div className="detail-item">
                            <span className="detail-label">
                              <span className="detail-icon">👤</span>
                              Chauffeur
                            </span>
                            <span className="detail-value">
                              {intervention.driver ? 
                                `${intervention.driver.prenom} ${intervention.driver.nom}` : 
                                'Non spécifié'
                              }
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">
                              <span className="detail-icon">🚗</span>
                              Véhicule
                            </span>
                            <span className="detail-value">
                              {intervention.vehicleInfo || 'Non spécifié'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-group">
                          <div className="detail-item">
                            <span className="detail-label">
                              <span className="detail-icon">📍</span>
                              Localisation
                            </span>
                            <span className="detail-value">
                              {intervention.location || 'Non spécifiée'}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">
                              <span className="detail-icon">⏰</span>
                              Durée
                            </span>
                            <span className="detail-value">
                              {calculateDuration(intervention.createdAt, intervention.respondedAt)}
                            </span>
                          </div>
                        </div>

                        {intervention.respondedAt && (
                          <div className="detail-group">
                            <div className="detail-item full-width">
                              <span className="detail-label">
                                <span className="detail-icon">✅</span>
                                Résolue le
                              </span>
                              <span className="detail-value">
                                {formatDate(intervention.respondedAt)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions de la carte */}
                    <div className="card-actions">
                      {intervention.status === 'accepted' && (
                        <button 
                          className="btn-action primary"
                          onClick={() => navigate('/mechanic/breakdowns')}
                        >
                          <span className="action-icon">🔧</span>
                          Gérer l'intervention
                        </button>
                      )}
                      {intervention.status === 'resolved' && (
                        <div className="completion-badge">
                          <span className="completion-icon">✅</span>
                          Intervention finalisée
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionHistory;