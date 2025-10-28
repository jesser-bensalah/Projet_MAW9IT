import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';

const FormulaireChauffeur = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    matricule: '',
    ligneassignée: '',
    numbus: '',
    daterrisservice: '',
    daterfinservice: ''
  });

  const handleChange = (e) => {
    let fieldName = e.target.id;
    const idMapping = {
      'matricule': 'matricule',
      'ligne assignée': 'ligneassignée',
      'numéro de bus': 'numbus', 
      'date de prise de service': 'daterrisservice',
      'date de fin de service': 'daterfinservice'
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
    if (!formData.matricule || !formData.ligneassignée || !formData.numbus || !formData.daterrisservice || !formData.daterfinservice) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    
    try {
      await servicesrvice.createChauffeur(formData);
      alert('Chauffeur enregistré avec succès !');
      setFormData({
        matricule: '',
        ligneassignée: '',
        numbus: '',
        daterrisservice: '',
        daterfinservice: ''
      });
      // Navigation vers la table après l'enregistrement réussi
      navigate('/liste-chauffeurs');
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
            <h3>Formulaire chauffeur</h3>
          </div>

          <form onSubmit={handleSubmit} className='form grid'>
            <div className="inputDiv">
              <label htmlFor="matricule">Matricule</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='matricule' 
                  placeholder='Entrer votre matricule'
                  value={formData.matricule}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="ligne assignée">Ligne assignée</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='ligne assignée' 
                  placeholder='Entrer votre ligne assignée'
                  value={formData.ligneassignée}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="numéro de bus">Numéro de bus</label>
              <div className="input flex">
                <input 
                  type="number" 
                  id='numéro de bus' 
                  placeholder='Entrer votre numéro de bus'
                  value={formData.numbus}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="date de prise de service">Date de prise de service</label>
              <div className="input flex">
                <input 
                  type="date" 
                  id='date de prise de service' 
                  placeholder='Entrer votre date de prise de service'
                  value={formData.daterrisservice}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="date de fin de service">Date de fin de service</label>
              <div className="input flex">
                <input 
                  type="date" 
                  id='date de fin de service' 
                  placeholder='Entrer votre date de fin de service'
                  value={formData.daterfinservice}
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

export default FormulaireChauffeur