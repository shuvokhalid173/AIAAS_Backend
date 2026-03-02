import apiClient from './client';

export const createOrg = (orgData) => apiClient.post('/orgs', orgData);

export const getUserOrgs = (userId) => apiClient.get(`/orgs/u/${userId}`);

export const switchOrg = (orgId) => apiClient.post('/orgs/switch', { orgId });
