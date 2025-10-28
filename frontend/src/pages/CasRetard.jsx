import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';

const CasRetard = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    perioderetard: '',
    causeretard: ''
  });

  const handleChange = (e) => {
    const fieldName = e.target.id;
    setFormData({
      ...formData,
      [fieldName]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données à envoyer:', formData);
    
    // Validation des champs obligatoires
    if (!formData.perioderetard || !formData.causeretard) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    
    try {
      await servicesrvice.createRetard(formData);
      alert('Formulaire de retard enregistré avec succès !');
      setFormData({
        perioderetard: '',
        causeretard: ''
      });
      // Navigation vers la table après l'enregistrement réussi
      navigate('/liste-cas-retard');
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
            <h3>Formulaire de cas de retard</h3>
          </div>

          <form onSubmit={handleSubmit} className='form grid'>
            <div className="inputDiv">
              <label htmlFor="perioderetard">Période de retard</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='perioderetard' 
                  placeholder='Entrer la période de retard'
                  value={formData.perioderetard}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="causeretard">Cause de retard</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='causeretard' 
                  placeholder='Entrer la cause de votre retard'
                  value={formData.causeretard}
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

export default CasRetard