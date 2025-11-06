import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';

const CasDepart = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    tempsdep: '',
    tempsarr: '',
    stationdep: '',
    stationarr: '',
    dureeatt: ''
  });

  const handleChange = (e) => {
    let fieldName = e.target.id;
    const idMapping = {
      'tempsdep': 'tempsdep',
      'tempsarr': 'tempsarr',
      'stationdep': 'stationdep', 
      'stationarr': 'stationarr',
      'dureeatt': 'dureeatt'
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
    if (!formData.tempsdep || !formData.tempsarr || !formData.stationdep || !formData.stationarr || !formData.dureeatt) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    
    try {
      await servicesrvice.createDepart(formData);
      alert('Cas de départ enregistrée avec succès !');
      setFormData({
        tempsdep: '',
        tempsarr: '',
        stationdep: '',
        stationarr: '',
        dureeatt: ''
      });
      // Navigation vers la table après l'enregistrement réussi
      navigate('/liste-cas-depart');
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
            <h3>Formulaire de cas de depart</h3>
          </div>

          <form onSubmit={handleSubmit} className='form grid'>
            <div className="inputDiv">
              <label htmlFor="tempsdep">Temps de départ</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='tempsdep' 
                  placeholder='Entrer votre temps de départ'
                  value={formData.tempsdep}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="tempsarr">Temps d'arrivée</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='tempsarr' 
                  placeholder='Entrer le temps d\arrivée'
                  value={formData.tempsarr}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="stationdep">Station de départ</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='stationdep' 
                  placeholder='Entrer la station de départ'
                  value={formData.stationdep}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="stationarr">Station d'arrivée</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='stationarr' 
                  placeholder='Entrer la station d\arrivée'
                  value={formData.stationarr}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="dureeatt">Durée d'attente</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='dureeatt' 
                  placeholder='Entrer la durée d\attente'
                  value={formData.sdureeatt}
                  onChange={handleChange}
                />
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

export default CasDepart