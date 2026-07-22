import api from './client.js';
import { mockListVerifications, mockGetVerification } from '../mocks/verifications.js';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const getVerifications = (params) =>
  USE_MOCKS ? mockListVerifications(params) : api.get('/api/admin/verifications', { params }).then((r) => r.data.data);

export const getVerification = (id) =>
  USE_MOCKS ? mockGetVerification(id) : api.get(`/api/admin/verifications/${id}`).then((r) => r.data.data);

export const approveVerification = (id, note) =>
  api.post(`/api/admin/verifications/${id}/approve`, { note }).then((r) => r.data.data);

export const rejectVerification = (id, reason) =>
  api.post(`/api/admin/verifications/${id}/reject`, { reason }).then((r) => r.data.data);
