export const MOCK_DELIVERIES = [
  { id: 'SL-9901', customer: 'Kwame Asante', provider: 'SwiftCouriers Ltd', from: 'East Legon', to: 'Tema', status: 'in_transit', eta: '14 min', startedAt: '2026-07-08T09:00:00Z', driver: 'Kofi Mensah' },
  { id: 'SL-9902', customer: 'Ama Owusu', provider: 'AirLink Express', from: 'Osu', to: 'Madina', status: 'in_transit', eta: '8 min', startedAt: '2026-07-08T09:15:00Z', driver: 'Abena Darko' },
  { id: 'SL-9903', customer: 'Yaw Boateng', provider: 'CityMove', from: 'Accra Mall', to: 'Kasoa', status: 'delayed', eta: '45 min', startedAt: '2026-07-08T08:30:00Z', driver: 'Kweku Frimpong' },
  { id: 'SL-9904', customer: 'Akosua Dankwa', provider: 'FastTrack Inc', from: 'Airport Res.', to: 'Adenta', status: 'in_transit', eta: '22 min', startedAt: '2026-07-08T09:20:00Z', driver: 'Mawuli Tetteh' },
  { id: 'SL-9905', customer: 'Nii Laryea', provider: 'PrimeFreight GH', from: 'Takoradi', to: 'Kumasi', status: 'delayed', eta: '2 hrs', startedAt: '2026-07-08T07:00:00Z', driver: 'Esi Asiedu' },
  { id: 'SL-9906', customer: 'Efua Mensah', provider: 'SwiftCouriers Ltd', from: 'Cantonments', to: 'Spintex', status: 'completed', eta: '—', startedAt: '2026-07-08T08:00:00Z', driver: 'Kofi Mensah' },
  { id: 'SL-9907', customer: 'Kwabena Ofori', provider: 'AirLink Express', from: 'Labone', to: 'Dansoman', status: 'completed', eta: '—', startedAt: '2026-07-08T08:45:00Z', driver: 'Abena Darko' },
  { id: 'SL-9908', customer: 'Adwoa Sarpong', provider: 'CityMove', from: 'Tesano', to: 'Nima', status: 'in_transit', eta: '5 min', startedAt: '2026-07-08T09:25:00Z', driver: 'Kweku Frimpong' },
];

export const MOCK_ZONES = [
  { id: 'z1', name: 'Zone A — Greater Accra Central', capacity: 60, active: 5, utilisation: 83 },
  { id: 'z2', name: 'Zone B — East Legon / Airport', capacity: 40, active: 4, utilisation: 87 },
  { id: 'z3', name: 'Zone C — Tema Industrial', capacity: 30, active: 2, utilisation: 67 },
  { id: 'z4', name: 'Zone D — Kumasi Metro', capacity: 25, active: 3, utilisation: 92 },
];

export const OPS_STATS = {
  activeDeliveries: 14,
  completedToday: 63,
  delayed: 2,
  avgDeliveryMin: 32,
};
