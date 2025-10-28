import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const PanneList = () => {
  const [pannes, setPannes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const navigate = useNavigate();

  const loadPannes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicesrvice.getAllPannes();
      setPannes(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPannes();
  }, []);

  const retour = async () => {
    navigate('/cas-panne'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas de panne ?')) {
      try {
        await servicesrvice.deletePanne(id);
        loadPannes();
        alert('Cas de panne supprimé avec succès !');
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const startEdit = (panne) => {
    setEditingId(panne.idCasPanne);
    setEditForm({ ...panne });
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
      await servicesrvice.updatePanne(id, editForm);
      setEditingId(null);
      setEditForm({});
      loadPannes();
      alert('Cas de panne modifié avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="chauffeur-list">
      <h2>Liste des cas de panne ({pannes.length})</h2>
      
      <button onClick={retour} className="refresh-btn">
        🔄 Retour
      </button>

      {pannes.length === 0 ? (
        <p>Aucune cas de panne trouvée.</p>
      ) : (
        <table className="chauffeurs-table">
          <thead>
            <tr>
              <th>ID Cas de panne</th>
              <th>Nom</th>
              <th>Marque</th>
              <th>Modele</th>
              <th>Matricule</th>
              <th>Type de panne</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pannes.map((panne) => (
              <tr key={panne.idCasPanne}>
                <td>{panne.idCasPanne}</td>
                <td>
                  {editingId === panne.idCasPanne ? (
                    <input
                      type="text"
                      name="nom"
                      value={editForm.nom || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    panne.nom
                  )}
                </td>
                <td>
                  {editingId === panne.idCasPanne ? (
                    <input
                      type="text"
                      name="marque"
                      value={editForm.marque || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    panne.marque
                  )}
                </td>
                <td>
                  {editingId === panne.idCasPanne ? (
                    <input
                      type="text"
                      name="modele"
                      value={editForm.modele || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    panne.modele
                  )}
                </td>
                <td>
                  {editingId === panne.idCasPanne ? (
                    <input
                      type="text"
                      name="matricule"
                      value={editForm.matricule || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    panne.matricule
                  )}
                </td>
                 <td>
                  {editingId === panne.idCasPanne ? (
                    <select
                      name="typepanne"
                      value={editForm.typepanne || ''}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>Sélectionnez</option>
                      <option value="Batterie">Batterie</option>
                      <option value="Réseau">Réseau</option>
                      <option value="Moteur">Moteur</option>
                    </select>
                  ) : (
                    panne.typepanne
                  )}
                </td>
                <td>
                  {editingId === panne.idCasPanne ? (
                    <div>
                      <button 
                        onClick={() => handleUpdate(panne.idCasPanne)}
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
                        onClick={() => startEdit(panne)}
                        className="edit-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(panne.idCasPanne)}
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

export default PanneList;