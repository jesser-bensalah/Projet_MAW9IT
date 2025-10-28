import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPage.css';

const PublicPage = () => {
  return (
    <div className="public-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">Maw9it</h1>
          <div className="nav-buttons">
            <Link to="/login" className="nav-btn login-btn">Connexion</Link>
            <Link to="/register" className="nav-btn register-btn">S'inscrire</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Bienvenue sur Maw9it</h1>
            <p>Votre solution de gestion et d'organisation du transport par bus</p>
          </div>
        </section>

        <section className="info-section">
          <div className="container">
            <h2>Informations sur les bus</h2>
            <div className="bus-info-grid">
              <div className="info-card">
                <h3>Horaires des bus</h3>
                <p>Consultez les horaires en temps réel de tous les bus</p>
              </div>
              <div className="info-card">
                <h3>Itinéraires</h3>
                <p>Découvrez les différents itinéraires disponibles</p>
              </div>
              <div className="info-card">
                <h3>Statuts</h3>
                <p>Suivez l'état de vos bus en temps réel</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicPage;