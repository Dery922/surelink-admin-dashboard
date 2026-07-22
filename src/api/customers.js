import api from './client.js';
import { mockListCustomers, mockGetCustomer } from '../mocks/customers.js';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const getCustomers = (params) =>
  USE_MOCKS ? mockListCustomers(params) : api.get('/api/admin/customers', { params }).then((r) => r.data.data);

export const getCustomer = (id) =>
  USE_MOCKS ? mockGetCustomer(id) : api.get(`/api/admin/customers/${id}`).then((r) => r.data.data);
