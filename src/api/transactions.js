import api from './client.js';
import { mockListTransactions, mockGetTransaction } from '../mocks/transactions.js';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const getTransactions = (params) =>
  USE_MOCKS ? mockListTransactions(params) : api.get('/api/admin/transactions', { params }).then((r) => r.data.data);

export const getTransaction = (id) =>
  USE_MOCKS ? mockGetTransaction(id) : api.get(`/api/admin/transactions/${id}`).then((r) => r.data.data.transaction);

export const refundTransaction = (id, reason) =>
  api.post(`/api/admin/transactions/${id}/refund`, { reason }).then((r) => r.data.data.transaction);

export const disputeTransaction = (id, reason) =>
  api.post(`/api/admin/transactions/${id}/dispute`, { reason }).then((r) => r.data.data.transaction);

export const resolveDispute = (id, note) =>
  api.post(`/api/admin/transactions/${id}/resolve-dispute`, { note }).then((r) => r.data.data.transaction);
