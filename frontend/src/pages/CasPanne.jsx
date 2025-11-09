import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'; 
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';
import { notificationsService } from '../services/notificationsService';
import { usersService } from '../services/usersService';

const CasPanne = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    nom: '',
    marque: '',
    modele: '',
    matricule: '',
    typepanne: ''
  });
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      const response = await usersService.getMechanics();
      setMechanics(response.data);
      if (response.data.length > 0) {
        setSelectedMechanic(response.data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des mécaniciens:', error);
    }
  };

  const handleChange = (e) => {
    let fieldName = e.target.id;
    const idMapping = {
      'nom': 'nom',
      'marque': 'marque',
      'modele': 'modele', 
      'matricule': 'matricule',
      'typepanne': 'typepanne',
      'dropdown': 'typepanne',
      'mechanic': 'mechanic'
    };
    fieldName = idMapping[fieldName] || fieldName;
    
    if (fieldName === 'mechanic') {
      setSelectedMechanic(e.target.value);
    } else {
      setFormData({
        ...formData,
        [fieldName]: e.target.value
      });
    }
  };

  const sendBreakdownNotification = async (mechanicId) => {
    try {
      const notificationData = {
        type: 'breakdown',
        title: '🚨 Nouvelle panne signalée',
        message: `Panne de type "${formData.typepanne}" sur le véhicule ${formData.marque} ${formData.modele} (${formData.matricule})`,
        driverId: user.id,
        mechanicId: parseInt(mechanicId),
        vehicleInfo: `${formData.marque} ${formData.modele} - ${formData.matricule}`,
        location: 'Localisation à déterminer'
      };
      
      await notificationsService.createNotification(notificationData);
      console.log('Notification de panne envoyée au mécanicien:', mechanicId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données à envoyer:', formData);
    
    // Validation des champs obligatoires
    if (!formData.nom || !formData.marque || !formData.modele || !formData.matricule || !formData.typepanne || !selectedMechanic) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    
    try {
      // 1. Enregistrer la panne dans la base de données
      await servicesrvice.createPanne(formData);
      
      // 2. Envoyer une notification à tous les mécaniciens (ou au mécanicien sélectionné)
      if (selectedMechanic === 'all') {
        // Envoyer à tous les mécaniciens
        for (const mechanic of mechanics) {
          await sendBreakdownNotification(mechanic.id);
        }
      } else {
        // Envoyer au mécanicien sélectionné
        await sendBreakdownNotification(selectedMechanic);
      }
      
      alert('Cas de panne enregistrée et notification envoyée avec succès !');
      setFormData({
        nom: '',
        marque: '',
        modele: '',
        matricule: '',
        typepanne: ''
      });
      setSelectedMechanic(mechanics.length > 0 ? mechanics[0].id : '');
      
      // Navigation vers la table après l'enregistrement réussi
      navigate('/liste-cas-panne');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de l\'enregistrement: ' + (error.response?.data?.message || error.message));
    }
  };

  const goToDashChauffeur = () => {
    navigate('/driver/dashboard');
  };

  return (
    <div className='formulaireChauffeur flex'>
      <div className="container flex">
        <div className="videoDiv">
          <img src={image} alt="Bus animé" />
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <h3>Formulaire de cas de panne</h3>
          </div>

          <form onSubmit={handleSubmit} className='form grid'>
            <div className="inputDiv">
              <label htmlFor="nom">Nom</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='nom' 
                  placeholder='Entrer votre nom'
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="marque">Marque</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='marque' 
                  placeholder='Entrer la marque de votre véhicule'
                  value={formData.marque}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="modele">Modéle</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='modele' 
                  placeholder='Entrer le modéle de votre véhicule'
                  value={formData.modele}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="matricule">Matricule</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='matricule' 
                  placeholder='Entrer la matricule de votre véhicule'
                  value={formData.matricule}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="typepanne">Type de panne</label>
              <div className="input flex">
                <select id="dropdown" value={formData.typepanne} onChange={handleChange}>
                  <option value="" disabled>
                    -- Sélectionnez --
                  </option>
                  <option value="Batterie">Batterie</option>
                  <option value="Réseau">Réseau</option>
                  <option value="Moteur">Moteur</option>
                  <option value="Freins">Freins</option>
                  <option value="Pneus">Pneus</option>
                  <option value="Électricité">Électricité</option>
                </select>
              </div>

              <label htmlFor="mechanic">Mécanicien à notifier</label>
              <div className="input flex">
                <select id="mechanic" value={selectedMechanic} onChange={handleChange}>
                  <option value="all">Tous les mécaniciens</option>
                  {mechanics.map(mechanic => (
                    <option key={mechanic.id} value={mechanic.id}>
                      {mechanic.prenom} {mechanic.nom} - {mechanic.email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="buttonContainer">
                <button type='submit' className='btn'>Enregistrer </button>
                <button type='button' className='btn1' onClick={goToDashChauffeur}>Retour</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CasPanne;