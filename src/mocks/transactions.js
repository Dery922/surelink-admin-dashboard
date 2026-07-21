import { delay } from './_delay.js';

const now = Date.now();
const hrsAgo = (n) => new Date(now - n * 3600e3).toISOString();
const daysAgo = (n) => new Date(now - n * 864e5).toISOString();

const fees = (amount) => {
  const platform = Math.round(amount * 0.1);
  const processing = Math.round(amount * 0.02);
  return { platform, processing, provider_payout: amount - platform - processing };
};

const TRANSACTIONS = [
  {
    _id: 'tx1', reference: 'TXN-50012', status: 'paid', amount: 350, currency: 'GHS', fees: fees(350),
    method: 'mobile_money', booking: { id: 'bk1', reference: 'BK-10234' }, customer: { name: 'Kwame Asante' }, provider: { name: 'CityMove' },
    refund: { state: 'none', reason: null }, dispute: { state: 'none', reason: null },
    audit: [
      { status: 'processing', at: hrsAgo(6), actor: 'system', note: 'Payment initiated' },
      { status: 'paid', at: hrsAgo(6), actor: 'system', note: 'Payment captured' },
    ],
    createdAt: hrsAgo(6),
  },
  {
    _id: 'tx2', reference: 'TXN-50013', status: 'processing', amount: 200, currency: 'GHS', fees: fees(200),
    method: 'mobile_money', booking: { id: 'bk2', reference: 'BK-10235' }, customer: { name: 'Ama Owusu' }, provider: { name: null },
    refund: { state: 'none', reason: null }, dispute: { state: 'none', reason: null },
    audit: [{ status: 'processing', at: hrsAgo(2), actor: 'system', note: 'Awaiting confirmation' }],
    createdAt: hrsAgo(2),
  },
  {
    _id: 'tx3', reference: 'TXN-50014', status: 'paid', amount: 500, currency: 'GHS', fees: fees(500),
    method: 'card', booking: { id: 'bk3', reference: 'BK-10236' }, customer: { name: 'Yaw Boateng' }, provider: { name: 'FastTrack Inc' },
    refund: { state: 'none', reason: null }, dispute: { state: 'none', reason: null },
    audit: [
      { status: 'processing', at: daysAgo(3), actor: 'system', note: 'Payment initiated' },
      { status: 'paid', at: daysAgo(3), actor: 'system', note: 'Payment captured' },
    ],
    createdAt: daysAgo(3),
  },
  {
    _id: 'tx4', reference: 'TXN-50015', status: 'disputed', amount: 1200, currency: 'GHS', fees: fees(1200),
    method: 'mobile_money', booking: { id: 'bk4', reference: 'BK-10237' }, customer: { name: 'Akosua Dankwa' }, provider: { name: 'PrimeFreight GH' },
    refund: { state: 'none', reason: null }, dispute: { state: 'open', reason: 'Damaged item during move' },
    audit: [
      { status: 'processing', at: daysAgo(5), actor: 'system', note: 'Payment initiated' },
      { status: 'paid', at: daysAgo(5), actor: 'system', note: 'Payment captured' },
      { status: 'disputed', at: daysAgo(3), actor: 'system', note: 'Customer opened dispute' },
    ],
    createdAt: daysAgo(5),
  },
  {
    _id: 'tx5', reference: 'TXN-50016', status: 'failed', amount: 300, currency: 'GHS', fees: fees(300),
    method: 'card', booking: { id: 'bk5', reference: 'BK-10238' }, customer: { name: 'Nii Laryea' }, provider: { name: 'SwiftCouriers Ltd' },
    refund: { state: 'none', reason: null }, dispute: { state: 'none', reason: null },
    audit: [
      { status: 'processing', at: daysAgo(2), actor: 'system', note: 'Payment initiated' },
      { status: 'failed', at: daysAgo(2), actor: 'system', note: 'Card declined' },
    ],
    createdAt: daysAgo(2),
  },
  {
    _id: 'tx6', reference: 'TXN-50017', status: 'paid', amount: 450, currency: 'GHS', fees: fees(450),
    method: 'card', booking: { id: 'bk6', reference: 'BK-10239' }, customer: { name: 'Efua Mensah' }, provider: { name: 'NovaDrop' },
    refund: { state: 'none', reason: null }, dispute: { state: 'none', reason: null },
    audit: [
      { status: 'processing', at: hrsAgo(8), actor: 'system', note: 'Payment initiated' },
      { status: 'paid', at: hrsAgo(6), actor: 'system', note: 'Payment captured' },
    ],
    createdAt: hrsAgo(8),
  },
  {
    _id: 'tx7', reference: 'TXN-50018', status: 'refunded', amount: 280, currency: 'GHS', fees: fees(280),
    method: 'mobile_money', booking: { id: 'bk7', reference: 'BK-10240' }, customer: { name: 'Kwabena Ofori' }, provider: { name: 'AirLink Express' },
    refund: { state: 'completed', reason: 'Repair unsuccessful' }, dispute: { state: 'none', reason: null },
    audit: [
      { status: 'processing', at: daysAgo(7), actor: 'system', note: 'Payment initiated' },
      { status: 'paid', at: daysAgo(7), actor: 'system', note: 'Payment captured' },
      { status: 'refunded', at: daysAgo(5), actor: 'system', note: 'Refund issued' },
    ],
    createdAt: daysAgo(7),
  },
];

const stats = () => {
  const s = { total: 0, processing: 0, paid: 0, failed: 0, refunded: 0, disputed: 0, paid_volume: 0 };
  for (const t of TRANSACTIONS) {
    s[t.status] = (s[t.status] || 0) + 1;
    s.total += 1;
    if (t.status === 'paid') s.paid_volume += t.amount;
  }
  return s;
};

export const mockListTransactions = async ({ status, search, page = 1, limit = 20 } = {}) => {
  await delay();
  let rows = TRANSACTIONS;
  if (status && status !== 'all') rows = rows.filter((t) => t.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((t) =>
      [t.reference, t.booking.reference, t.customer.name, t.provider.name].some((v) => v?.toLowerCase().includes(q)),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { transactions: rows.slice(start, start + limit), total, page, limit, stats: stats() };
};

export const mockGetTransaction = async (id) => {
  await delay();
  const transaction = TRANSACTIONS.find((t) => t._id === id);
  if (!transaction) throw new Error('Transaction not found');
  return transaction;
};
