/**
 * Returns quick action buttons appropriate for the given admin role.
 * Each action: { id, label, icon, path, description }
 */
export function getQuickActions(role) {
  switch (role) {
    case 'SUPER_ADMIN':
      return [
        { id: 'manage-admins', label: 'Manage Admins', icon: 'fa-solid fa-users-gear', path: '/settings', description: 'Add or update admin accounts' },
        { id: 'view-providers', label: 'View Providers', icon: 'fa-solid fa-building', path: '/providers', description: 'Browse and manage providers' },
        { id: 'operations', label: 'Operations', icon: 'fa-solid fa-truck-fast', path: '/operations', description: 'Monitor live deliveries' },
        { id: 'system-settings', label: 'System Settings', icon: 'fa-solid fa-gear', path: '/settings', description: 'Configure platform settings' },
      ];

    case 'PROVIDER_MANAGEMENT_ADMIN':
      return [
        { id: 'review-providers', label: 'Review Pending', icon: 'fa-solid fa-magnifying-glass', path: '/providers', description: 'Review provider applications' },
        { id: 'add-provider', label: 'Add Provider', icon: 'fa-solid fa-building-circle-arrow-right', path: '/providers', description: 'Onboard a new provider' },
        { id: 'all-providers', label: 'All Providers', icon: 'fa-solid fa-list', path: '/providers', description: 'View full provider list' },
        { id: 'export-report', label: 'Export Report', icon: 'fa-solid fa-file-arrow-down', path: '/providers', description: 'Download provider report' },
      ];

    case 'OPERATIONS_ADMIN':
      return [
        { id: 'live-map', label: 'Live Tracking', icon: 'fa-solid fa-location-dot', path: '/operations', description: 'View active deliveries on map' },
        { id: 'flagged', label: 'Flagged Issues', icon: 'fa-solid fa-flag', path: '/operations', description: 'Review delayed deliveries' },
        { id: 'zones', label: 'Manage Zones', icon: 'fa-solid fa-map', path: '/operations', description: 'Adjust delivery zone capacity' },
        { id: 'reports', label: 'Daily Report', icon: 'fa-solid fa-chart-bar', path: '/operations', description: 'View today\'s operation stats' },
      ];

    default:
      return [];
  }
}
