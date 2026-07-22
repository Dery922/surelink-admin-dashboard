import { useEffect, useState, useCallback } from 'react';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import WelcomeBanner from '../components/dashboard/WelcomeBanner.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel.jsx';
import { getDashboardSummary } from '../api/dashboard.js';

export default function DashboardPage() {
  const { setPageTitle } = usePageTitle();
  const { admin } = useAuth();
  const [stats, setStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setPageTitle('Dashboard'); }, [setPageTitle]);

  const fetchSummary = useCallback(async () => {
    if (!admin?.role) return;
    setLoading(true);
    try {
      const data = await getDashboardSummary();
      setStats(data.stats || []);
      setActivity(data.activity || []);
    } catch {
      // silently degrade — no error banner on the dashboard
    } finally {
      setLoading(false);
    }
  }, [admin?.role]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      <WelcomeBanner />

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-gray-100" />
                <div className="h-5 w-10 rounded-full bg-gray-100" />
              </div>
              <div className="mt-4 h-7 bg-gray-100 rounded w-16" />
              <div className="mt-2 h-3 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((card) => <StatCard key={card.id} {...card} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ActivityFeed items={activity} loading={loading} />
        </div>
        <div>
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
}
