import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const RetardList = () => {
  const [retards, setRetards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const navigate = useNavigate();

  const loadRetards = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicesrvice.getAllRetards();
      setRetards(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRetards();
  }, []);

  const retour = async () => {
    navigate('/cas-retard'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas de retard ?')) {
      try {
        await servicesrvice.deleteRetard(id);
        loadRetards();
        alert('Cas de retard supprimé avec succès !');
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const startEdit = (retard) => {
    setEditingId(retard.idCasRetard);
    setEditForm({ ...retard });
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
      await servicesrvice.updateRetard(id, editForm);
      setEditingId(null);
      setEditForm({});
      loadRetards();
      alert('Cas de retard modifié avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="chauffeur-list">
      <h2>Liste des cas de retard ({retards.length})</h2>
      
      <button onClick={retour} className="refresh-btn">
        🔄 Retour
      </button>

      {retards.length === 0 ? (
        <p>Aucune cas de retard trouvée.</p>
      ) : (
        <table className="chauffeurs-table">
          <thead>
            <tr>
              <th>ID Cas de retard</th>
              <th>Période de retard</th>
              <th>Cause de retard</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {retards.map((retard) => (
              <tr key={retard.idCasRetard}>
                <td>{retard.idCasRetard}</td>
                <td>
                  {editingId === retard.idCasRetard ? (
                    <input
                      type="text"
                      name="perioderetard"
                      value={editForm.perioderetard || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    retard.perioderetard
                  )}
                </td>
                <td>
                  {editingId === retard.idCasRetard? (
                    <input
                      type="text"
                      name="causeretard"
                      value={editForm.causeretard || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    retard.causeretard
                  )}
                </td>
                <td>
                  {editingId === retard.idCasRetard ? (
                    <div>
                      <button 
                        onClick={() => handleUpdate(retard.idCasRetard)}
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
                        onClick={() => startEdit(retard)}
                        className="edit-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(retard.idCasRetard)}
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

export default RetardList;