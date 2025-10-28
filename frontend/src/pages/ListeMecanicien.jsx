import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const MecanicienList = () => {
  const [mecaniciens, setMecaniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
    navigate('/formulairemecanicien'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mecanicien ?')) {
      try {
        await servicesrvice.deleteMecanicien(id);
        loadMecaniciens();
        alert('Mecanicien supprimé avec succès !');
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const startEdit = (mecanicien) => {
    setEditingId(mecanicien.idMecanicien);
    setEditForm({ ...mecanicien });
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
      await servicesrvice.updateMecanicien(id, editForm);
      setEditingId(null);
      setEditForm({});
      loadMecaniciens();
      alert('Mecanicien modifié avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification: ' + err.message);
    }
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mecaniciens.map((mecanicien) => (
              <tr key={mecanicien.idMecanicien}>
                <td>{mecanicien.idMecanicien}</td>
                <td>
                  {editingId === mecanicien.idMecanicien ? (
                    <input
                      type="text"
                      name="nomgarageouentreprise"
                      value={editForm.nomgarageouentreprise || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    mecanicien.nomgarageouentreprise
                  )}
                </td>
                <td>
                  {editingId === mecanicien.idMecanicien ? (
                    <input
                      type="text"
                      name="adresse"
                      value={editForm.adresse || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    mecanicien.adresse
                  )}
                </td>
                <td>
                  {editingId === mecanicien.idMecanicien ? (
                    <input
                      type="text"
                      name="numtel"
                      value={editForm.numtel || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    mecanicien.numtel
                  )}
                </td>
                <td>
                  {editingId === mecanicien.idMecanicien ? (
                    <input
                      type="number"
                      name="numbon"
                      value={editForm.numbon || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    mecanicien.numbon
                  )}
                </td>
                <td>
                  {editingId === mecanicien.idMecanicien ? (
                    <div>
                      <button 
                        onClick={() => handleUpdate(mecanicien.idMecanicien)}
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
                        onClick={() => startEdit(mecanicien)}
                        className="edit-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(mecanicien.idMecanicien)}
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

export default MecanicienList;