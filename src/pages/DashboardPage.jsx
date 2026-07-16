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
    <div className="p-5 max-w-[1280px] mx-auto space-y-4">
      <WelcomeBanner />

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-[88px] animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((card) => <StatCard key={card.id} {...card} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
