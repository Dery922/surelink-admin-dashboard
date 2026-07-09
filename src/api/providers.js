import api from "./client.js";

export const getProviders = (params) => api.get("/api/admin/providers", { params }).then(r => r.data.data);
export const getProvider = (id) => api.get(`/api/admin/providers/${id}`).then(r => r.data.data.provider);
export const createProvider = (payload) => api.post("/api/admin/providers", payload).then(r => r.data.data.provider);
export const updateProvider = (id, payload) => api.patch(`/api/admin/providers/${id}`, payload).then(r => r.data.data.provider);
export const approveProvider = (id) => api.post(`/api/admin/providers/${id}/approve`).then(r => r.data.data.provider);
export const suspendProvider = (id) => api.post(`/api/admin/providers/${id}/suspend`).then(r => r.data.data.provider);
export const reinstateProvider = (id) => api.post(`/api/admin/providers/${id}/reinstate`).then(r => r.data.data.provider);
