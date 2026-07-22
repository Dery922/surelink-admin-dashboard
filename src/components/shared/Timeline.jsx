import StatusBadge from './StatusBadge';

/**
 * Timeline — vertical status stepper for booking/transaction history.
 * Each event: { status, at, actor?, note? }. Renders newest-to-oldest as passed.
 */
export default function Timeline({ events = [] }) {
  if (!events.length) {
    return <p className="text-[12px] text-gray-400">No history yet.</p>;
  }

  return (
    <ol className="relative space-y-5">
      {events.map((ev, i) => {
        const isLast = i === events.length - 1;
        return (
          <li key={`${ev.status}-${ev.at}-${i}`} className="relative flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0057FF] ring-4 ring-[#EEF4FF]" />
              {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200" />}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={ev.status} />
                {ev.at && (
                  <span className="text-[11px] text-gray-400 tabular-nums">
                    {new Date(ev.at).toLocaleString()}
                  </span>
                )}
              </div>
              {ev.note && <p className="mt-1 text-[12px] text-gray-600">{ev.note}</p>}
              {ev.actor && ev.actor !== 'system' && (
                <p className="mt-0.5 text-[11px] text-gray-400">by {ev.actor}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
