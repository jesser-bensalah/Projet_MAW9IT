import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      const { access_token, user } = response.data;

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger vers le dashboard selon le rôle
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'chauffeur':
          navigate('/driver/dashboard');
          break;
        case 'mecanicien':
          navigate('/mechanic/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion à Maw9it</h2>
          <p>Connectez-vous à votre espace professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
          <p className="passenger-info">
            🚌 Passager ? Utilisez la <Link to="/">page publique</Link>
          </p>
          <Link to="/" className="back-home">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;