import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const servicesrvice = {
  createChauffeur: async (data) => {
    const response = await API.post('/formulaireschauffeurs', data);
    return response.data;
  },
  
  getAllChauffeurs: async () => {
    const response = await API.get('/formulaireschauffeurs');
    return response.data;
  },
  
  getChauffeurById: async (idchauffeur) => {
    const response = await API.get(`/formulaireschauffeurs/${idchauffeur}`);
    return response.data;
  },
  
  updateChauffeur: async (idchauffeur, data) => {
    const response = await API.patch(`/formulaireschauffeurs/${idchauffeur}`, data);
    return response.data;
  },
  
  deleteChauffeur: async (idchauffeur) => {
    const response = await API.delete(`/formulaireschauffeurs/${idchauffeur}`);
    return response.data;
  },

  createMecanicien: async (data) => {
    const response = await API.post('/formulairesmecaniciens', data);
    return response.data;
  },
  
  getAllMecaniciens: async () => {
    const response = await API.get('/formulairesmecaniciens');
    return response.data;
  },
  
  getMecanicienById: async (idMecanicien) => {
    const response = await API.get(`/formulairesmecaniciens/${idMecanicien}`);
    return response.data;
  },
  
  updateMecanicien: async (idMecanicien, data) => {
    const response = await API.patch(`/formulairesmecaniciens/${idMecanicien}`, data);
    return response.data;
  },
  
  deleteMecanicien: async (idMecanicien) => {
    const response = await API.delete(`/formulairesmecaniciens/${idMecanicien}`);
    return response.data;
  },

  createRetard: async (data) => {
    const response = await API.post('/casretard', data);
    return response.data;
  },
  
  getAllRetards: async () => {
    const response = await API.get('/casretard');
    return response.data;
  },
  
  getRetardById: async (idCasRetard) => {
    const response = await API.get(`/casretard/${idCasRetard}`);
    return response.data;
  },
  
  updateRetard: async (idCasRetard, data) => {
    const response = await API.patch(`/casretard/${idCasRetard}`, data);
    return response.data;
  },
  
  deleteRetard: async (idCasRetard) => {
    const response = await API.delete(`/casretard/${idCasRetard}`);
    return response.data;
  },

  createPanne: async (data) => {
    const response = await API.post('/caspanne', data);
    return response.data;
  },
  
  getAllPannes: async () => {
    const response = await API.get('/caspanne');
    return response.data;
  },
  
  getPanneById: async (idCasPanne) => {
    const response = await API.get(`/caspanne/${idCasPanne}`);
    return response.data;
  },
  
  updatePanne: async (idCasPanne, data) => {
    const response = await API.patch(`/caspanne/${idCasPanne}`, data);
    return response.data;
  },
  
  deletePanne: async (idCasPanne) => {
    const response = await API.delete(`/caspanne/${idCasPanne}`);
    return response.data;
  },

  createDepart: async (data) => {
    const response = await API.post('/casdepart', data);
    return response.data;
  },
  
  getAllDeparts: async () => {
    const response = await API.get('/casdepart');
    return response.data;
  },
  
  getDepartById: async (idCasDepart) => {
    const response = await API.get(`/casdepart/${idCasDepart}`);
    return response.data;
  },
  
  updateDepart: async (idCasDepart, data) => {
    const response = await API.patch(`/casdepart/${idCasDepart}`, data);
    return response.data;
  },
  
  deleteDepart: async (idCasDepart) => {
    const response = await API.delete(`/casdepart/${idCasDepart}`);
    return response.data;
  },
};