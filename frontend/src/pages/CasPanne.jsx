import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';

const CasPanne = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    nom: '',
    marque: '',
    modele: '',
    matricule: '',
    typepanne: ''
  });

  const handleChange = (e) => {
    let fieldName = e.target.id;
    const idMapping = {
      'nom': 'nom',
      'marque': 'marque',
      'modele': 'modele', 
      'matricule': 'matricule',
      'typepanne': 'typepanne',
      'dropdown': 'typepanne'
    };
    fieldName = idMapping[fieldName] || fieldName;
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données à envoyer:', formData);
    
    // Validation des champs obligatoires
    if (!formData.nom || !formData.marque || !formData.modele || !formData.matricule || !formData.typepanne) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    
    try {
      await servicesrvice.createPanne(formData);
      alert('Cas de panne enregistrée avec succès !');
      setFormData({
        nom: '',
        marque: '',
        modele: '',
        matricule: '',
        typepanne: ''
      });
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
                </select>
              </div>
              
              <div className="buttonContainer">
                <button type='submit' className='btn'>Enregistrer</button>
                <button type='button' className='btn1' onClick={goToDashChauffeur}>Retour</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CasPanne