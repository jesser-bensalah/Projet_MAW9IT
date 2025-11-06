import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../App.css';

// Correction de l'erreur require
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Composant pour gérer le clic sur la carte
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance en km
  return distance;
}

// Fonction pour calculer toutes les distances entre les points
function calculateAllDistances(points) {
  const distances = [];
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const pointA = points[i];
      const pointB = points[j];
      
      const distance = calculateDistance(
        parseFloat(pointA.latitude),
        parseFloat(pointA.longitude),
        parseFloat(pointB.latitude),
        parseFloat(pointB.longitude)
      );
      
      distances.push({
        pointA: pointA.idMap || i + 1,
        pointB: pointB.idMap || j + 1,
        distance: distance,
        coordinates: [
          [parseFloat(pointA.latitude), parseFloat(pointA.longitude)],
          [parseFloat(pointB.latitude), parseFloat(pointB.longitude)]
        ]
      });
    }
  }
  
  // Trier par distance (croissant)
  distances.sort((a, b) => a.distance - b.distance);
  
  return distances;
}

function Map() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: ''
  });
  const [showDistances, setShowDistances] = useState(false);
  const [distances, setDistances] = useState([]);

  const tunisiaCenter = [34.0, 9.0];

  useEffect(() => {
    fetchMaps();
  }, []);

  useEffect(() => {
    if (maps.length > 1) {
      const calculatedDistances = calculateAllDistances(maps);
      setDistances(calculatedDistances);
    } else {
      setDistances([]);
    }
  }, [maps]);

  // CHANGEMENT ICI : Port 3001 → 3000
  const fetchMaps = async () => {
  try {
    const response = await axios.get('http://localhost:3000/maps'); // ← PORT CORRIGÉ
    setMaps(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Erreur lors du chargement des maps:', error);
    setLoading(false);
  }
};

  const handleMapClick = (lat, lng) => {
    setClickPosition({ lat, lng });
    setFormData({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // CHANGEMENT ICI : Port 3001 → 3000
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:3000/maps', { // ← PORT CORRIGÉ
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    });
    
    // Fermer le formulaire et recharger les points
    setShowForm(false);
    setClickPosition(null);
    fetchMaps();
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout du point:', error);
  }
};

  const handleCancel = () => {
    setShowForm(false);
    setClickPosition(null);
    setFormData({ latitude: '', longitude: '' });
  };

  const toggleDistances = () => {
    setShowDistances(!showDistances);
  };

  // Fonction pour calculer la distance totale
  const calculateTotalDistance = () => {
    return distances.reduce((total, dist) => total + dist.distance, 0);
  };

  if (loading) {
    return <div className="loading">Chargement de la carte...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Carte de la Tunisie - Points d'intérêt</h1>
        <div className="points-info">
          <p>Cliquez sur la carte pour ajouter un nouveau point</p>
          <div className="points-counter">
            <span className="counter-badge">
              {maps.length} point{maps.length !== 1 ? 's' : ''} sur la carte
            </span>
            {maps.length > 1 && (
              <button 
                className={`distance-toggle ${showDistances ? 'active' : ''}`}
                onClick={toggleDistances}
              >
                {showDistances ? 'Masquer' : 'Afficher'} les distances
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Panneau des distances */}
      {showDistances && distances.length > 0 && (
        <div className="distances-panel">
          <h3>📏 Distances entre les points</h3>
          <div className="distances-list">
            {distances.map((dist, index) => (
              <div key={index} className="distance-item">
                <span className="distance-points">
                  Point {dist.pointA} → Point {dist.pointB}
                </span>
                <span className="distance-value">
                  {dist.distance.toFixed(2)} km
                </span>
              </div>
            ))}
          </div>
          {distances.length > 0 && (
            <div className="total-distance">
              <strong>Distance totale: {calculateTotalDistance().toFixed(2)} km</strong>
            </div>
          )}
        </div>
      )}
      
      {/* Formulaire modale */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ajouter un nouveau point</h3>
            <div className="new-point-info">
              <small>Ce sera le point #{maps.length + 1} sur la carte</small>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Latitude:</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Longitude:</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Ajouter le point</button>
                <button type="button" onClick={handleCancel}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="map-container">
        {/* Badge flottant avec le nombre de points */}
        <div className="floating-counter">
          <div className="counter-card">
            <div className="counter-icon">📍</div>
            <div className="counter-text">
              <div className="counter-number">{maps.length}</div>
              <div className="counter-label">Points</div>
            </div>
          </div>
          {distances.length > 0 && (
            <div className="distance-badge">
              <div className="distance-text">
                <div className="distance-total">{calculateTotalDistance().toFixed(1)}</div>
                <div className="distance-label">km total</div>
              </div>
            </div>
          )}
        </div>

        <MapContainer
          center={tunisiaCenter}
          zoom={6}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Lignes de distance */}
          {showDistances && distances.map((dist, index) => (
            <Polyline
              key={index}
              positions={dist.coordinates}
              color="blue"
              weight={2}
              opacity={0.7}
            />
          ))}
          
          {/* Afficher le point temporaire si le formulaire est ouvert */}
          {showForm && clickPosition && (
            <Marker
              position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
            >
              <Popup>
                <div className="popup-content">
                  <h4>Nouveau point à ajouter</h4>
                  <small>Ce sera le point #{maps.length + 1}</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Points existants */}
          {maps.map((map, index) => (
            <Marker
              key={map.idMap}
              position={[parseFloat(map.latitude), parseFloat(map.longitude)]}
            >
              <Popup>
                <div className="popup-content">
                  <h3>Point #{map.idMap || index + 1}</h3>
                  <div className="coordinates">
                    <small>
                      Latitude: {map.latitude}<br/>
                      Longitude: {map.longitude}
                    </small>
                  </div>
                  <div className="point-position">
                    <small>Position: {index + 1}/{maps.length}</small>
                  </div>
                  {/* Distances depuis ce point */}
                  {distances.filter(d => d.pointA === (map.idMap || index + 1) || d.pointB === (map.idMap || index + 1))
                    .slice(0, 3) // Limiter à 3 distances pour ne pas surcharger
                    .map((dist, distIndex) => (
                      <div key={distIndex} className="point-distance">
                        <small>
                          → Point {dist.pointA === (map.idMap || index + 1) ? dist.pointB : dist.pointA}: 
                          {dist.distance.toFixed(2)} km
                        </small>
                      </div>
                    ))
                  }
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;