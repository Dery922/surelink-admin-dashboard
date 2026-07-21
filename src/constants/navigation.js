/**
 * Sidebar navigation items.
 * `roles` — if set, only admins with one of these roles see the item.
 *           If omitted/empty, all authenticated admins see it.
 */
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'fa-solid fa-gauge-high',
    roles: [],
  },
  {
    label: 'Providers',
    path: '/providers',
    icon: 'fa-solid fa-building',
    roles: ['SUPER_ADMIN', 'PROVIDER_MANAGEMENT_ADMIN'],
  },
  {
    label: 'Operations',
    path: '/operations',
    icon: 'fa-solid fa-truck-fast',
    roles: ['SUPER_ADMIN', 'OPERATIONS_ADMIN'],
  },
  {
    label: 'Bookings',
    path: '/bookings',
    icon: 'fa-solid fa-calendar-check',
    roles: ['SUPER_ADMIN', 'OPERATIONS_ADMIN'],
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: 'fa-solid fa-receipt',
    roles: ['SUPER_ADMIN', 'OPERATIONS_ADMIN'],
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: 'fa-solid fa-users',
    roles: ['SUPER_ADMIN', 'OPERATIONS_ADMIN'],
  },
  {
    label: 'Verifications',
    path: '/verifications',
    icon: 'fa-solid fa-id-card',
    roles: ['SUPER_ADMIN', 'PROVIDER_MANAGEMENT_ADMIN'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'fa-solid fa-gear',
    roles: ['SUPER_ADMIN'],
  },
];

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  PROVIDER_MANAGEMENT_ADMIN: 'Provider Admin',
  OPERATIONS_ADMIN: 'Operations Admin',
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PROVIDER_MANAGEMENT_ADMIN: 'PROVIDER_MANAGEMENT_ADMIN',
  OPERATIONS_ADMIN: 'OPERATIONS_ADMIN',
};
