import { delay } from './_delay.js';

const now = Date.now();
const daysAgo = (n) => new Date(now - n * 864e5).toISOString();

const CUSTOMERS = [
  {
    _id: 'c1', name: { full: 'Kwame Asante' }, email: 'kwame.asante@example.com', phone: '+233201234567',
    avatar: { url: null }, status: 'active', trust: { score: 5, average_rating: 4.8, total_ratings: 12 },
    location: { home_address: { area: 'East Legon' } }, createdAt: daysAgo(120), audit: { last_login_at: daysAgo(1) },
  },
  {
    _id: 'c2', name: { full: 'Ama Owusu' }, email: 'ama.owusu@example.com', phone: '+233241112223',
    avatar: { url: null }, status: 'verification_pending', trust: { score: 5, average_rating: null, total_ratings: 0 },
    location: { home_address: { area: 'Osu' } }, createdAt: daysAgo(4), audit: { last_login_at: daysAgo(2) },
  },
  {
    _id: 'c3', name: { full: 'Yaw Boateng' }, email: 'yaw.boateng@example.com', phone: '+233209988776',
    avatar: { url: null }, status: 'active', trust: { score: 4, average_rating: 4.2, total_ratings: 7 },
    location: { home_address: { area: 'Tema' } }, createdAt: daysAgo(200), audit: { last_login_at: daysAgo(10) },
  },
  {
    _id: 'c4', name: { full: 'Akosua Dankwa' }, email: 'akosua.dankwa@example.com', phone: '+233557654321',
    avatar: { url: null }, status: 'suspended', trust: { score: 2, average_rating: 3.1, total_ratings: 5 },
    location: { home_address: { area: 'Adenta' } }, createdAt: daysAgo(75), audit: { last_login_at: daysAgo(30) },
  },
  {
    _id: 'c5', name: { full: 'Nii Laryea' }, email: 'nii.laryea@example.com', phone: '+233263344556',
    avatar: { url: null }, status: 'banned', trust: { score: 1, average_rating: 2.0, total_ratings: 3 },
    location: { home_address: { area: 'Dansoman' } }, createdAt: daysAgo(300), audit: { last_login_at: daysAgo(90) },
  },
  {
    _id: 'c6', name: { full: 'Efua Mensah' }, email: 'efua.mensah@example.com', phone: '+233277112233',
    avatar: { url: null }, status: 'active', trust: { score: 5, average_rating: 5.0, total_ratings: 20 },
    location: { home_address: { area: 'Spintex' } }, createdAt: daysAgo(45), audit: { last_login_at: daysAgo(0) },
  },
];

const BOOKINGS_BY_CUSTOMER = {
  c1: [
    { _id: 'bk1', reference: 'BK-10234', status: 'in_progress', service: { category: 'Home Cleaning' }, payment: { amount: 350, currency: 'GHS', status: 'paid' }, createdAt: daysAgo(1) },
    { _id: 'bk8', reference: 'BK-10230', status: 'completed', service: { category: 'Plumbing' }, payment: { amount: 200, currency: 'GHS', status: 'paid' }, createdAt: daysAgo(30) },
  ],
  c2: [{ _id: 'bk2', reference: 'BK-10235', status: 'pending', service: { category: 'Electrical' }, payment: { amount: 200, currency: 'GHS', status: 'unpaid' }, createdAt: daysAgo(2) }],
  c3: [{ _id: 'bk3', reference: 'BK-10236', status: 'completed', service: { category: 'Moving' }, payment: { amount: 500, currency: 'GHS', status: 'paid' }, createdAt: daysAgo(3) }],
  c4: [{ _id: 'bk4', reference: 'BK-10237', status: 'disputed', service: { category: 'Freight' }, payment: { amount: 1200, currency: 'GHS', status: 'paid' }, createdAt: daysAgo(5) }],
  c5: [{ _id: 'bk5', reference: 'BK-10238', status: 'cancelled', service: { category: 'Courier' }, payment: { amount: 300, currency: 'GHS', status: 'failed' }, createdAt: daysAgo(2) }],
  c6: [{ _id: 'bk6', reference: 'BK-10239', status: 'confirmed', service: { category: 'Delivery' }, payment: { amount: 450, currency: 'GHS', status: 'paid' }, createdAt: daysAgo(1) }],
};

const stats = () => {
  const s = { total: 0, active: 0, pending: 0, suspended: 0, banned: 0 };
  for (const c of CUSTOMERS) {
    s.total += 1;
    if (c.status === 'verification_pending') s.pending += 1;
    else s[c.status] = (s[c.status] || 0) + 1;
  }
  return s;
};

export const mockListCustomers = async ({ status, search, page = 1, limit = 20 } = {}) => {
  await delay();
  let rows = CUSTOMERS;
  if (status && status !== 'all') {
    const mapped = status === 'pending' ? 'verification_pending' : status;
    rows = rows.filter((c) => c.status === mapped);
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((c) => [c.name.full, c.email, c.phone].some((v) => v?.toLowerCase().includes(q)));
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { customers: rows.slice(start, start + limit), total, page, limit, stats: stats() };
};

export const mockGetCustomer = async (id) => {
  await delay();
  const customer = CUSTOMERS.find((c) => c._id === id);
  if (!customer) throw new Error('Customer not found');
  return { customer, bookings: BOOKINGS_BY_CUSTOMER[id] || [] };
};
