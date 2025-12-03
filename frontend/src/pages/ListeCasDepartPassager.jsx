import React, { useState, useEffect } from 'react';
import { servicesrvice } from '../serviceservice/serviceservice';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const DepartListPassager = () => {
  const [departs, setDeparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const navigate = useNavigate();

  const loadDeparts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await servicesrvice.getAllDeparts();
      setDeparts(data);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeparts();
  }, []);

  const retour = async () => {
    navigate('/cas-depart'); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas de depart ?')) {
      try {
        await servicesrvice.deleteDepart(id);
        loadDeparts();
        alert('Cas de depart supprimé avec succès !');
      } catch (err) {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    }
  };

  const startEdit = (depart) => {
    setEditingId(depart.idCasDepart);
    setEditForm({ ...depart });
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
      await servicesrvice.updateDepart(id, editForm);
      setEditingId(null);
      setEditForm({});
      loadDeparts();
      alert('Cas de depart modifié avec succès !');
    } catch (err) {
      alert('Erreur lors de la modification: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="chauffeur-list">
      <h2>Liste des cas de depart ({departs.length})</h2>

      {departs.length === 0 ? (
        <p>Aucune cas de depart trouvée.</p>
      ) : (
        <table className="chauffeurs-table">
          <thead>
            <tr>
              <th>ID Cas de départ</th>
              <th>Temps de départ</th>
              <th>Temps d'arrivé</th>
              <th>Station de départ</th>
              <th>Station d'arrivée</th>
              <th>Durée d'attente</th>
            </tr>
          </thead>
          <tbody>
            {departs.map((depart) => (
              <tr key={depart.idCasDepart}>
                <td>{depart.idCasDepart}</td>
                <td>
                  {editingId === depart.idCasDepart ? (
                    <input
                      type="text"
                      name="tempsdep"
                      value={editForm.tempsdep || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    depart.tempsdep
                  )}
                </td>
                <td>
                  {editingId === depart.idCasDepart ? (
                    <input
                      type="text"
                      name="tempsarr"
                      value={editForm.tempsarr || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    depart.tempsarr
                  )}
                </td>
                <td>
                  {editingId === depart.idCasDepart ? (
                    <input
                      type="text"
                      name="stationdep"
                      value={editForm.stationdep || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    depart.stationdep
                  )}
                </td>
                <td>
                  {editingId === depart.idCasDepart ? (
                    <input
                      type="text"
                      name="stationarr"
                      value={editForm.stationarr || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    depart.stationarr
                  )}
                </td>
                 <td>
                  {editingId === depart.idCasDepart ? (
                    <input
                      type="text"
                      name="dureeatt"
                      value={editForm.dureeatt || ''}
                      onChange={handleEditChange}
                    />
                  ) : (
                    depart.dureeatt
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

export default DepartListPassager;