import api from "./client.js";

export const getOperationsSummary = () => api.get("/api/admin/operations/summary").then(r => r.data.data);
export const getDeliveries = (params) => api.get("/api/admin/operations/deliveries", { params }).then(r => r.data.data);
export const getZones = () => api.get("/api/admin/operations/zones").then(r => r.data.data.zones);
export const updateZone = (id, payload) => api.patch(`/api/admin/operations/zones/${id}`, payload).then(r => r.data.data.zone);
