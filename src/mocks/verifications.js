import { delay } from './_delay.js';

const now = Date.now();
const hrsAgo = (n) => new Date(now - n * 3600e3).toISOString();
const daysAgo = (n) => new Date(now - n * 864e5).toISOString();

const docs = (prefix) => [
  { type: 'ghana_card', label: 'Ghana Card (Front)', url: `https://files.surelink.example/${prefix}/ghana-card-front.jpg` },
  { type: 'ghana_card', label: 'Ghana Card (Back)', url: `https://files.surelink.example/${prefix}/ghana-card-back.jpg` },
  { type: 'business_cert', label: 'Business Registration', url: `https://files.surelink.example/${prefix}/business-cert.pdf` },
  { type: 'selfie', label: 'Verification Selfie', url: `https://files.surelink.example/${prefix}/selfie.jpg` },
];

const VERIFICATIONS = [
  {
    _id: 'ver1', reference: 'VER-3001', status: 'pending',
    provider: { name: 'SwiftCouriers Ltd', email: 'ops@swiftcouriers.gh', phone: '+233201234567' },
    documents: docs('ver-3001'), submitted_at: hrsAgo(3), reviewed_at: null, reviewed_by: null, rejection_reason: null,
    events: [{ status: 'pending', at: hrsAgo(3), actor: 'system', note: 'Submitted for review' }],
  },
  {
    _id: 'ver2', reference: 'VER-3002', status: 'pending',
    provider: { name: 'NovaDrop', email: 'hello@novadrop.gh', phone: '+233241112223' },
    documents: docs('ver-3002'), submitted_at: hrsAgo(9), reviewed_at: null, reviewed_by: null, rejection_reason: null,
    events: [{ status: 'pending', at: hrsAgo(9), actor: 'system', note: 'Submitted for review' }],
  },
  {
    _id: 'ver3', reference: 'VER-3003', status: 'pending',
    provider: { name: 'AirLink Express', email: 'support@airlink.gh', phone: '+233209998887' },
    documents: docs('ver-3003'), submitted_at: daysAgo(1), reviewed_at: null, reviewed_by: null, rejection_reason: null,
    events: [{ status: 'pending', at: daysAgo(1), actor: 'system', note: 'Submitted for review' }],
  },
  {
    _id: 'ver4', reference: 'VER-3004', status: 'approved',
    provider: { name: 'CityMove', email: 'admin@citymove.gh', phone: '+233277654321' },
    documents: docs('ver-3004'), submitted_at: daysAgo(6), reviewed_at: daysAgo(5), reviewed_by: 'system', rejection_reason: null,
    events: [
      { status: 'pending', at: daysAgo(6), actor: 'system', note: 'Submitted for review' },
      { status: 'approved', at: daysAgo(5), actor: 'system', note: 'Documents verified' },
    ],
  },
  {
    _id: 'ver5', reference: 'VER-3005', status: 'rejected',
    provider: { name: 'PrimeFreight GH', email: 'info@primefreight.gh', phone: '+233208889990' },
    documents: docs('ver-3005'), submitted_at: daysAgo(8), reviewed_at: daysAgo(7), reviewed_by: 'system',
    rejection_reason: 'Business certificate expired',
    events: [
      { status: 'pending', at: daysAgo(8), actor: 'system', note: 'Submitted for review' },
      { status: 'rejected', at: daysAgo(7), actor: 'system', note: 'Business certificate expired' },
    ],
  },
];

const stats = () => {
  const s = { total: 0, pending: 0, approved: 0, rejected: 0 };
  for (const v of VERIFICATIONS) {
    s.total += 1;
    s[v.status] = (s[v.status] || 0) + 1;
  }
  return s;
};

export const mockListVerifications = async ({ status, search, page = 1, limit = 20 } = {}) => {
  await delay();
  let rows = VERIFICATIONS;
  if (status && status !== 'all') rows = rows.filter((v) => v.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((v) => [v.reference, v.provider.name, v.provider.email].some((x) => x?.toLowerCase().includes(q)));
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { verifications: rows.slice(start, start + limit), total, page, limit, stats: stats() };
};

export const mockGetVerification = async (id) => {
  await delay();
  const verification = VERIFICATIONS.find((v) => v._id === id);
  if (!verification) throw new Error('Verification not found');
  return verification;
};
