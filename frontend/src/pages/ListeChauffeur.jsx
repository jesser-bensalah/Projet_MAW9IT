import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const ChauffeurList = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const navigate = useNavigate();

  const loadChauffeurs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicesrvice.getAllChauffeurs();
      setChauffeurs(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChauffeurs();
  }, []);

  const retour = async () => {
    navigate('/formulairechauffeur'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      try {
        await servicesrvice.deleteChauffeur(id);
        loadChauffeurs();
        alert('Chauffeur supprimé avec succès !');
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const startEdit = (chauffeur) => {
    setEditingId(chauffeur.idchauffeur);
    setEditForm({ ...chauffeur });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (id) => {
    try {
      await servicesrvice.updateChauffeur(id, editForm);
      setEditingId(null);
      setEditForm({});
      loadChauffeurs();
      alert('Chauffeur modifié avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="chauffeur-list">
      <h2>Liste des Chauffeurs ({chauffeurs.length})</h2>
      
      <button onClick={retour} className="refresh-btn">
        🔄 Retour
      </button>

      {chauffeurs.length === 0 ? (
        <p>Aucun chauffeur trouvé.</p>
      ) : (
        <table className="chauffeurs-table">
          <thead>
            <tr>
              <th>ID Chauffeur</th>
              <th>Matricule</th>
              <th>Ligne assignée</th>
              <th>Numéro de bus</th>
              <th>Date de prise de service</th>
              <th>Date de fin de service</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chauffeurs.map((chauffeur) => (
              <tr key={chauffeur.idchauffeur}>
                <td>{chauffeur.idchauffeur}</td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <input
                      type="text"
                      name="matricule"
                      value={editForm.matricule || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    chauffeur.matricule
                  )}
                </td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <input
                      type="text"
                      name="ligneassignée"
                      value={editForm.ligneassignée || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    chauffeur.ligneassignée
                  )}
                </td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <input
                      type="text"
                      name="numbus"
                      value={editForm.numbus || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    chauffeur.numbus
                  )}
                </td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <input
                      type="date"
                      name="daterrisservice"
                      value={editForm.daterrisservice || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    chauffeur.daterrisservice
                  )}
                </td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <input
                      type="date"
                      name="daterfinservice"
                      value={editForm.daterfinservice || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    chauffeur.daterfinservice
                  )}
                </td>
                <td>
                  {editingId === chauffeur.idchauffeur ? (
                    <div>
                      <button 
                        onClick={() => handleUpdate(chauffeur.idchauffeur)}
                        className="save-btn"
                      >
                        💾 Sauvegarder
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="cancel-btn"
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button 
                        onClick={() => startEdit(chauffeur)}
                        className="edit-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(chauffeur.idchauffeur)}
                        className="delete-btn"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChauffeurList;