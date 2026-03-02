import apiClient from './client';

export const getAllServices = () => apiClient.get('/aiaas-services');
export const getServiceById = (id) => apiClient.get(`/aiaas-service/${id}`);
