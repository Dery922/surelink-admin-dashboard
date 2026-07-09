import api from "./client.js";

export const getAdmins = () => api.get("/api/admin/admins").then(r => r.data.data.admins);
export const createAdmin = (payload) => api.post("/api/admin/admins", payload).then(r => r.data.data.admin);
export const updateAdmin = (id, payload) => api.patch(`/api/admin/admins/${id}`, payload).then(r => r.data.data.admin);
export const deleteAdmin = (id) => api.delete(`/api/admin/admins/${id}`).then(r => r.data);
export const resetPassword = (id, password) => api.post(`/api/admin/admins/${id}/reset-password`, { password }).then(r => r.data);
export const unlockAdmin = (id) => api.post(`/api/admin/admins/${id}/unlock`).then(r => r.data.data.admin);
