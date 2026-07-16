import { useState, useEffect } from 'react';
import StatCard from './StatCard.jsx';
import { getDashboardSummary } from '../../api/dashboard.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function StatCardGrid({ onSummaryLoaded }) {
  const { admin } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin?.role) return;
    setLoading(true);
    getDashboardSummary()
      .then((data) => {
        setCards(data.stats || []);
        if (onSummaryLoaded) onSummaryLoaded(data);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [admin?.role]);

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.id} {...card} />
      ))}
    </div>
  );
}
