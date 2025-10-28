import React, { useState, useEffect } from 'react';
import { usersService } from '../../services/usersService';
import './UserManagement.css';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'chauffeur'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'chauffeur'
    });
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersService.updateUser(editingUser.id, formData);
      } else {
        await usersService.createUser(formData);
      }
      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: '', 
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = async (id, email) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${email} ?`)) {
      try {
        await usersService.deleteUser(id);
        loadUsers(); 
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

 
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'chauffeur': { label: 'Chauffeur', class: 'badge-driver' },
      'mecanicien': { label: 'Mécanicien', class: 'badge-mechanic' },
    };
    
    const config = roleConfig[role] || { label: role, class: 'badge-default' };
    return React.createElement('span', { 
      className: `role-badge ${config.class}` 
    }, config.label);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return React.createElement('div', { className: 'loading' }, 'Chargement des utilisateurs...');
  }

  return React.createElement('div', { className: 'user-management' },
    // Bouton de retour en haut
    React.createElement('div', { className: 'back-button-container' },
      React.createElement('button', {
        className: 'btn-back',
        onClick: handleBackToDashboard
      }, '← Retour')
    ),

    React.createElement('div', { className: 'user-header' },
      React.createElement('h2', null, 'Gestion des Utilisateurs'),
      React.createElement('button', { 
        className: 'btn-primary', 
        onClick: openCreateModal 
      }, '+ Nouvel Utilisateur')
    ),

    error && React.createElement('div', { className: 'error-message' }, error),

    React.createElement('div', { className: 'users-table-container' },
      React.createElement('table', { className: 'users-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'ID'),
            React.createElement('th', null, 'Nom'),
            React.createElement('th', null, 'Prénom'),
            React.createElement('th', null, 'Email'),
            React.createElement('th', null, 'Rôle'),
            React.createElement('th', null, 'Date de création'),
            React.createElement('th', null, 'Actions')
          )
        ),
        React.createElement('tbody', null,
          users.map(user => 
            React.createElement('tr', { key: user.id },
              React.createElement('td', null, user.id),
              React.createElement('td', null, user.nom),
              React.createElement('td', null, user.prenom),
              React.createElement('td', null, user.email),
              React.createElement('td', null, getRoleBadge(user.role)),
              React.createElement('td', null, formatDate(user.createdAt)),
              React.createElement('td', { className: 'actions' },
                React.createElement('button', {
                  className: 'btn-edit',
                  onClick: () => handleEdit(user),
                  disabled: user.email === 'admin@maw9it.com'
                }, 'Modifier'),
                React.createElement('button', {
                  className: 'btn-delete',
                  onClick: () => handleDelete(user.id, user.email),
                  disabled: user.email === 'admin@maw9it.com'
                }, 'Supprimer')
              )
            )
          )
        )
      ),
      
      users.length === 0 && 
        React.createElement('div', { className: 'no-users' }, 'Aucun utilisateur trouvé')
    ),

    showModal && React.createElement('div', { className: 'modal-overlay' },
      React.createElement('div', { className: 'modal' },
        React.createElement('div', { className: 'modal-header' },
          React.createElement('h3', null, editingUser ? 'Modifier l\'utilisateur' : 'Nouvel Utilisateur'),
          React.createElement('button', { 
            className: 'close-btn', 
            onClick: () => setShowModal(false) 
          }, '×')
        ),
        React.createElement('form', { onSubmit: handleSubmit, className: 'modal-form' },
          React.createElement('div', { className: 'form-row' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Nom *'),
              React.createElement('input', {
                type: 'text',
                name: 'nom',
                value: formData.nom,
                onChange: handleInputChange,
                required: true
              })
            ),
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Prénom *'),
              React.createElement('input', {
                type: 'text',
                name: 'prenom',
                value: formData.prenom,
                onChange: handleInputChange,
                required: true
              })
            )
          ),

          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Email *'),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              value: formData.email,
              onChange: handleInputChange,
              required: true
            })
          ),

          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 
              `Mot de passe ${editingUser ? '(laisser vide pour ne pas changer)' : '*'}`
            ),
            React.createElement('input', {
              type: 'password',
              name: 'password',
              value: formData.password,
              onChange: handleInputChange,
              required: !editingUser,
              minLength: 6
            })
          ),

          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Rôle *'),
            React.createElement('select', {
              name: 'role',
              value: formData.role,
              onChange: handleInputChange,
              required: true
            },
              React.createElement('option', { value: 'chauffeur' }, 'Chauffeur'),
              React.createElement('option', { value: 'mecanicien' }, 'Mécanicien'),
            )
          ),

          React.createElement('div', { className: 'modal-actions' },
            React.createElement('button', {
              type: 'button',
              onClick: () => setShowModal(false),
              className: 'btn-cancel'
            }, 'Annuler'),
            React.createElement('button', {
              type: 'submit',
              className: 'btn-submit'
            }, editingUser ? 'Modifier' : 'Créer')
          )
        )
      )
    )
  );
};

export default UserManagement;