import api from "./client.js";

export const getDashboardSummary = () =>
  api.get("/api/admin/dashboard/summary").then((r) => r.data.data);
