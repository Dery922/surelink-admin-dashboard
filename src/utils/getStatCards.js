/**
 * Returns stat cards appropriate for the given admin role.
 * Each card: { id, label, value, icon, iconBg, trend, trendLabel }
 */
export function getStatCards(role) {
  switch (role) {
    case 'SUPER_ADMIN':
      return [
        { id: 'total-providers', label: 'Total Providers', value: '48', icon: 'fa-solid fa-building', iconBg: 'bg-[#E8F0FF]', iconColor: 'text-[#0057FF]', trend: '+3', trendLabel: 'this week', trendUp: true },
        { id: 'active-admins', label: 'Admin Accounts', value: '5', icon: 'fa-solid fa-users-gear', iconBg: 'bg-green-50', iconColor: 'text-green-600', trend: '+1', trendLabel: 'this month', trendUp: true },
        { id: 'pending-reviews', label: 'Pending Reviews', value: '7', icon: 'fa-solid fa-hourglass-half', iconBg: 'bg-orange-50', iconColor: 'text-[#FF6B00]', trend: '-2', trendLabel: 'from yesterday', trendUp: false },
        { id: 'system-uptime', label: 'System Uptime', value: '99.9%', icon: 'fa-solid fa-server', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', trend: '', trendLabel: 'last 30 days', trendUp: true },
      ];

    case 'PROVIDER_MANAGEMENT_ADMIN':
      return [
        { id: 'total-providers', label: 'Total Providers', value: '48', icon: 'fa-solid fa-building', iconBg: 'bg-[#E8F0FF]', iconColor: 'text-[#0057FF]', trend: '+3', trendLabel: 'this week', trendUp: true },
        { id: 'pending-approval', label: 'Pending Approval', value: '3', icon: 'fa-solid fa-clock', iconBg: 'bg-orange-50', iconColor: 'text-[#FF6B00]', trend: '', trendLabel: 'awaiting review', trendUp: false },
        { id: 'active-providers', label: 'Active Providers', value: '41', icon: 'fa-solid fa-circle-check', iconBg: 'bg-green-50', iconColor: 'text-green-600', trend: '+2', trendLabel: 'this week', trendUp: true },
        { id: 'suspended', label: 'Suspended', value: '4', icon: 'fa-solid fa-ban', iconBg: 'bg-red-50', iconColor: 'text-red-500', trend: '-1', trendLabel: 'from last week', trendUp: false },
      ];

    case 'OPERATIONS_ADMIN':
      return [
        { id: 'active-deliveries', label: 'Active Deliveries', value: '14', icon: 'fa-solid fa-truck-fast', iconBg: 'bg-[#E8F0FF]', iconColor: 'text-[#0057FF]', trend: '+4', trendLabel: 'from this morning', trendUp: true },
        { id: 'completed-today', label: 'Completed Today', value: '63', icon: 'fa-solid fa-circle-check', iconBg: 'bg-green-50', iconColor: 'text-green-600', trend: '+12', trendLabel: 'vs yesterday', trendUp: true },
        { id: 'delayed', label: 'Delayed', value: '2', icon: 'fa-solid fa-triangle-exclamation', iconBg: 'bg-orange-50', iconColor: 'text-[#FF6B00]', trend: '+1', trendLabel: 'needs attention', trendUp: false },
        { id: 'avg-delivery', label: 'Avg Delivery Time', value: '32 min', icon: 'fa-solid fa-stopwatch', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', trend: '-8 min', trendLabel: 'vs last week', trendUp: true },
      ];

    default:
      return [];
  }
}
