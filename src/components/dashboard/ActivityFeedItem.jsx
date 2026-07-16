import { relativeTime } from '../../utils/relativeTime.js';

export default function ActivityFeedItem({ text, time, icon, iconColor }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <i className={`${icon} ${iconColor} text-xs`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#1A1A1A] leading-snug font-medium">{text}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{relativeTime(time)}</p>
      </div>
    </div>
  );
}
