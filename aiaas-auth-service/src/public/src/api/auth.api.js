import apiClient from './client';

export const register = (email, password, phone) =>
  apiClient.post('/auth/register', { email, password, ...(phone && { phone }) });

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password });

export const refresh = () =>
  apiClient.post('/auth/refresh');

export const logout = (sessionId) =>
  apiClient.post('/auth/logout', { sessionId });
