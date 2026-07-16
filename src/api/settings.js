import api from "./client.js";

export const getSettings = () => api.get("/api/admin/settings").then(r => r.data.data.settings);
export const updateSettings = (payload) => api.patch("/api/admin/settings", payload).then(r => r.data.data.settings);
