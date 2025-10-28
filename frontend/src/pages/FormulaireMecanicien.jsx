import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../assets/giphy (1).gif'
import '../App.css';
import { servicesrvice } from '../serviceservice/serviceservice';

const FormulaireMecanicien = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomgarageouentreprise: '',
        adresse: '',
        numtel: '',
        numbon: 0,
    });

    const handleChange = (e) => {
        let fieldName = e.target.id;
        const idMapping = {
            'nom de garage ou entreprise': 'nomgarageouentreprise',
            'adresse': 'adresse',
            'numéro de téléphone': 'numtel',
            'numéro du bon': 'numbon' 
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
        if (!formData.nomgarageouentreprise || !formData.adresse || !formData.numtel || !formData.numbon) {
            alert('Veuillez remplir tous les champs obligatoires !');
            return;
        }
        
        try {
            await servicesrvice.createMecanicien(formData);
            alert('Mécanicien enregistré avec succés !');
            setFormData({
                nomgarageouentreprise: '',
                adresse: '',
                numtel: '',
                numbon: 0,
            });
            // Navigation vers la table après l'enregistrement réussi
            navigate('/liste-mecaniciens');
        } catch (error) {
            console.error('Erreur détaillée:', error);
            alert('Erreur lors de l\'enregistrement: ' + (error.response?.data?.message || error.message));
        }
    };

    const goToDashMecanicien = () => {
        navigate('/mechanic/dashboard');
    };

    return (
        <div className='formulaireChauffeur flex'>
        <div className="container flex">
            <div className="videoDiv">
            <img src={image} alt="Bus animé" />
            </div>

            <div className="formDiv flex">
            <div className="headerDiv">
                <h3>Formulaire mécanicien</h3>
            </div>

            <form onSubmit={handleSubmit} className='form grid'> {}
                <div className="inputDiv">
                <label htmlFor="nom de garage ou entreprise">Nom de garage/entreprise</label>
                <div className="input flex">
                    <input type="text" id='nom de garage ou entreprise' placeholder='Entrer le nom de votre garage ou de votre entreprise' value={formData.nomgarageouentreprise} onChange={handleChange}/>
                </div>
                <label htmlFor="adresse">Adresse</label>
                <div className="input flex">
                    <input type="text" id='adresse' placeholder='Entrer votre adresse' value={formData.adresse} onChange={handleChange}/>
                </div>
                <label htmlFor="numéro de téléphone">Numéro de téléphone</label>
                <div className="input flex">
                    <input type="tel" id='numéro de téléphone' placeholder='Entrer votre numéro de téléphone' value={formData.numtel} onChange={handleChange}/>
                </div>
                <label htmlFor="numéro du bon">Numéro du bon</label>
                <div className="input flex">
                    <input type="text" id='numéro du bon' placeholder='Entrer votre numéro du Bon' value={formData.numbon} onChange={handleChange}/>
                </div>
                
                <div className="buttonContainer">
                    <button type='submit' className='btn'>Enregistrer</button>
                    <button type='button' className='btn1' onClick={goToDashMecanicien}>Retour</button>
                </div>
                </div>
            </form>
            </div>
        </div>
        </div>
    )
}

export default FormulaireMecanicien