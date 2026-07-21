import { delay } from './_delay.js';

const now = Date.now();
const hrsAgo = (n) => new Date(now - n * 3600e3).toISOString();
const daysAgo = (n) => new Date(now - n * 864e5).toISOString();

const BOOKINGS = [
  {
    _id: 'bk1', reference: 'BK-10234', status: 'in_progress',
    service: { category: 'Home Cleaning', description: '3-bedroom deep clean', scheduled_at: hrsAgo(1), location: 'East Legon, Accra' },
    customer: { name: 'Kwame Asante', phone: '233201234567', email: 'kwame@example.com' },
    provider: { name: 'CityMove', phone: '233277445566' },
    payment: { status: 'paid', amount: 350, currency: 'GHS', method: 'mobile_money' },
    timeline: [
      { status: 'pending', at: hrsAgo(6), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: hrsAgo(5), actor: 'system', note: 'Provider accepted' },
      { status: 'in_progress', at: hrsAgo(1), actor: 'system', note: 'Service started' },
    ],
    createdAt: hrsAgo(6),
  },
  {
    _id: 'bk2', reference: 'BK-10235', status: 'pending',
    service: { category: 'Plumbing', description: 'Kitchen sink leak', scheduled_at: hrsAgo(-4), location: 'Osu, Accra' },
    customer: { name: 'Ama Owusu', phone: '233209876543', email: 'ama@example.com' },
    provider: { name: null, phone: null },
    payment: { status: 'unpaid', amount: 200, currency: 'GHS', method: null },
    timeline: [{ status: 'pending', at: hrsAgo(2), actor: 'system', note: 'Awaiting provider' }],
    createdAt: hrsAgo(2),
  },
  {
    _id: 'bk3', reference: 'BK-10236', status: 'completed',
    service: { category: 'Electrical', description: 'Ceiling fan installation', scheduled_at: daysAgo(2), location: 'Tema' },
    customer: { name: 'Yaw Boateng', phone: '233244112233', email: 'yaw@example.com' },
    provider: { name: 'FastTrack Inc', phone: '233233778899' },
    payment: { status: 'paid', amount: 500, currency: 'GHS', method: 'card' },
    timeline: [
      { status: 'pending', at: daysAgo(3), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: daysAgo(3), actor: 'system', note: 'Provider accepted' },
      { status: 'in_progress', at: daysAgo(2), actor: 'system', note: 'Service started' },
      { status: 'completed', at: daysAgo(2), actor: 'system', note: 'Completed & paid' },
    ],
    createdAt: daysAgo(3),
  },
  {
    _id: 'bk4', reference: 'BK-10237', status: 'disputed',
    service: { category: 'Moving', description: '2-bedroom apartment relocation', scheduled_at: daysAgo(4), location: 'Spintex → Kasoa' },
    customer: { name: 'Akosua Dankwa', phone: '233277001122', email: 'akosua@example.com' },
    provider: { name: 'PrimeFreight GH', phone: '233240334455' },
    payment: { status: 'paid', amount: 1200, currency: 'GHS', method: 'mobile_money' },
    timeline: [
      { status: 'pending', at: daysAgo(5), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: daysAgo(5), actor: 'system', note: 'Provider accepted' },
      { status: 'completed', at: daysAgo(4), actor: 'system', note: 'Marked complete' },
      { status: 'disputed', at: daysAgo(3), actor: 'system', note: 'Customer raised dispute — damaged item' },
    ],
    createdAt: daysAgo(5),
  },
  {
    _id: 'bk5', reference: 'BK-10238', status: 'cancelled',
    service: { category: 'Home Cleaning', description: 'Post-event cleanup', scheduled_at: daysAgo(1), location: 'Cantonments' },
    customer: { name: 'Nii Laryea', phone: '233265889900', email: 'nii@example.com' },
    provider: { name: 'SwiftCouriers Ltd', phone: '233201234567' },
    payment: { status: 'unpaid', amount: 300, currency: 'GHS', method: null },
    cancelled_reason: 'Customer no longer needs the service',
    timeline: [
      { status: 'pending', at: daysAgo(2), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: daysAgo(2), actor: 'system', note: 'Provider accepted' },
      { status: 'cancelled', at: daysAgo(1), actor: 'system', note: 'Customer no longer needs the service' },
    ],
    createdAt: daysAgo(2),
  },
  {
    _id: 'bk6', reference: 'BK-10239', status: 'confirmed',
    service: { category: 'Landscaping', description: 'Garden trimming & lawn care', scheduled_at: hrsAgo(-24), location: 'Airport Residential' },
    customer: { name: 'Efua Mensah', phone: '233256001122', email: 'efua@example.com' },
    provider: { name: 'NovaDrop', phone: '233256001122' },
    payment: { status: 'paid', amount: 450, currency: 'GHS', method: 'card' },
    timeline: [
      { status: 'pending', at: hrsAgo(8), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: hrsAgo(6), actor: 'system', note: 'Provider accepted' },
    ],
    createdAt: hrsAgo(8),
  },
  {
    _id: 'bk7', reference: 'BK-10240', status: 'refunded',
    service: { category: 'Appliance Repair', description: 'Washing machine not spinning', scheduled_at: daysAgo(6), location: 'Dansoman' },
    customer: { name: 'Kwabena Ofori', phone: '233209876543', email: 'kwabena@example.com' },
    provider: { name: 'AirLink Express', phone: '233209876543' },
    payment: { status: 'refunded', amount: 280, currency: 'GHS', method: 'mobile_money' },
    timeline: [
      { status: 'pending', at: daysAgo(7), actor: 'system', note: 'Booking created' },
      { status: 'confirmed', at: daysAgo(7), actor: 'system', note: 'Provider accepted' },
      { status: 'completed', at: daysAgo(6), actor: 'system', note: 'Marked complete' },
      { status: 'refunded', at: daysAgo(5), actor: 'system', note: 'Refund issued — repair unsuccessful' },
    ],
    createdAt: daysAgo(7),
  },
];

const stats = () => {
  const s = { total: 0, pending: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0, disputed: 0, refunded: 0 };
  for (const b of BOOKINGS) { s[b.status] = (s[b.status] || 0) + 1; s.total += 1; }
  return s;
};

export const mockListBookings = async ({ status, search, page = 1, limit = 20 } = {}) => {
  await delay();
  let rows = BOOKINGS;
  if (status && status !== 'all') rows = rows.filter((b) => b.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((b) =>
      [b.reference, b.customer.name, b.provider.name, b.service.category].some((v) => v?.toLowerCase().includes(q)),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { bookings: rows.slice(start, start + limit), total, page, limit, stats: stats() };
};

export const mockGetBooking = async (id) => {
  await delay();
  const booking = BOOKINGS.find((b) => b._id === id);
  if (!booking) throw new Error('Booking not found');
  return booking;
};
