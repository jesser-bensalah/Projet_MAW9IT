import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const MecanicienListChauffeur = () => {
  const [mecaniciens, setMecaniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const loadMecaniciens = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicesrvice.getAllMecaniciens();
      setMecaniciens(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMecaniciens();
  }, []);

  const retour = async () => {
    navigate('/driver/dashboard'); 
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="chauffeur-list">
      <h2>Liste des Mecaniciens ({mecaniciens.length})</h2>
      
      <button onClick={retour} className="refresh-btn">
        🔄 Retour
      </button>

      {mecaniciens.length === 0 ? (
        <p>Aucun mecanicien trouvé.</p>
      ) : (
        <table className="chauffeurs-table">
          <thead>
            <tr>
              <th>ID Mecanicien</th>
              <th>Nom de garage ou d'entreprise</th>
              <th>Adresse</th>
              <th>Numéro de téléphone</th>
              <th>Numéro de bon</th>
            </tr>
          </thead>
          <tbody>
            {mecaniciens.map((mecanicien) => (
              <tr key={mecanicien.idMecanicien}>
                <td>{mecanicien.idMecanicien}</td>
                <td>
                  {mecanicien.nomgarageouentreprise}
                </td>
                <td>
                  {mecanicien.adresse}
                </td>
                <td>
                  {mecanicien.numtel}
                </td>
                <td>
                  {mecanicien.numbon}
                </td>
                <td>
                  {/* Ajouter les boutons d'actions ici si nécessaire */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MecanicienListChauffeur;