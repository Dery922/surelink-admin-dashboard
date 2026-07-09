/**
 * Mock activity feed items keyed by admin role.
 * Each item: { id, text, time (ISO string), icon, iconColor }
 */
const now = () => new Date().toISOString();
const minsAgo = (n) => new Date(Date.now() - n * 60 * 1000).toISOString();
const hrsAgo = (n) => new Date(Date.now() - n * 3600 * 1000).toISOString();

export const MOCK_ACTIVITY = {
  SUPER_ADMIN: [
    { id: 1, text: 'New provider "SwiftCouriers Ltd" registered', time: minsAgo(12), icon: 'fa-solid fa-building-circle-check', iconColor: 'text-[#0057FF]' },
    { id: 2, text: 'Operations admin account created', time: minsAgo(45), icon: 'fa-solid fa-user-plus', iconColor: 'text-green-500' },
    { id: 3, text: 'System settings updated — max delivery radius changed to 50 km', time: hrsAgo(2), icon: 'fa-solid fa-gear', iconColor: 'text-gray-500' },
    { id: 4, text: 'Provider "AirLink Express" approved', time: hrsAgo(5), icon: 'fa-solid fa-circle-check', iconColor: 'text-green-500' },
    { id: 5, text: 'Suspicious login attempt flagged for review', time: hrsAgo(8), icon: 'fa-solid fa-triangle-exclamation', iconColor: 'text-[#FF6B00]' },
  ],
  PROVIDER_MANAGEMENT_ADMIN: [
    { id: 1, text: '"QuickRide Logistics" submitted onboarding documents', time: minsAgo(8), icon: 'fa-solid fa-file-arrow-up', iconColor: 'text-[#0057FF]' },
    { id: 2, text: 'Provider "CityMove" tier upgraded to Premium', time: minsAgo(33), icon: 'fa-solid fa-circle-arrow-up', iconColor: 'text-green-500' },
    { id: 3, text: '3 provider verification requests pending review', time: hrsAgo(1), icon: 'fa-solid fa-hourglass-half', iconColor: 'text-[#FF6B00]' },
    { id: 4, text: '"FastTrack Inc" profile updated', time: hrsAgo(3), icon: 'fa-solid fa-pen-to-square', iconColor: 'text-gray-500' },
    { id: 5, text: 'Provider "NovaDrop" contract renewed', time: hrsAgo(6), icon: 'fa-solid fa-file-contract', iconColor: 'text-green-500' },
  ],
  OPERATIONS_ADMIN: [
    { id: 1, text: '14 active deliveries in progress across 3 zones', time: minsAgo(5), icon: 'fa-solid fa-truck-fast', iconColor: 'text-[#0057FF]' },
    { id: 2, text: 'Delivery #SL-9923 flagged — delayed by 45 min', time: minsAgo(20), icon: 'fa-solid fa-clock', iconColor: 'text-[#FF6B00]' },
    { id: 3, text: 'Zone B capacity at 87% — consider redistribution', time: hrsAgo(1), icon: 'fa-solid fa-chart-pie', iconColor: 'text-[#FF6B00]' },
    { id: 4, text: '3 deliveries completed successfully this hour', time: hrsAgo(1), icon: 'fa-solid fa-circle-check', iconColor: 'text-green-500' },
    { id: 5, text: 'Route optimisation ran — avg delivery time -8 min', time: hrsAgo(3), icon: 'fa-solid fa-route', iconColor: 'text-green-500' },
  ],
};
