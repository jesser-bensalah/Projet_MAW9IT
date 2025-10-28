import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'chauffeur' // Par défaut chauffeur
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

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      const { access_token, user } = response.data;

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger vers le dashboard selon le rôle
      switch (user.role) {
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
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Inscription à Maw9it</h2>
          <p>Rejoignez notre plateforme en tant que professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                placeholder="Votre nom"
              />
            </div>

            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                placeholder="Votre prénom"
              />
            </div>
          </div>

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
              minLength="6"
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <div className="form-group">
            <label>Rôle *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="chauffeur"
                  checked={formData.role === 'chauffeur'}
                  onChange={handleChange}
                />
                🚗 Chauffeur
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="mecanicien"
                  checked={formData.role === 'mecanicien'}
                  onChange={handleChange}
                />
                🔧 Mécanicien
              </label>
            </div>
            <small className="role-info">
              * Les passagers n'ont pas besoin de compte - ils utilisent la page publique
            </small>
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
          <Link to="/" className="back-home">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;