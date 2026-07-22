import api from './client.js';
import { mockListBookings, mockGetBooking } from '../mocks/bookings.js';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const getBookings = (params) =>
  USE_MOCKS ? mockListBookings(params) : api.get('/api/admin/bookings', { params }).then((r) => r.data.data);

export const getBooking = (id) =>
  USE_MOCKS ? mockGetBooking(id) : api.get(`/api/admin/bookings/${id}`).then((r) => r.data.data.booking);

export const cancelBooking = (id, reason) =>
  api.post(`/api/admin/bookings/${id}/cancel`, { reason }).then((r) => r.data.data.booking);

export const refundBooking = (id, reason) =>
  api.post(`/api/admin/bookings/${id}/refund`, { reason }).then((r) => r.data.data.booking);

export const reassignBooking = (id, providerId) =>
  api.post(`/api/admin/bookings/${id}/reassign`, { provider_id: providerId }).then((r) => r.data.data.booking);
