import { relativeTime } from '../../utils/relativeTime.js';

// Map an icon text-color token to a matching tint background for the chip.
const BG_TINT = {
  'text-[#0057FF]': 'bg-[#EEF4FF]',
  'text-[#FF6B00]': 'bg-orange-50',
  'text-green-500': 'bg-green-50',
  'text-green-600': 'bg-green-50',
  'text-emerald-600': 'bg-emerald-50',
  'text-gray-500': 'bg-gray-100',
};

export default function ActivityFeedItem({ text, time, icon, iconColor }) {
  const bg = BG_TINT[iconColor] || 'bg-gray-50';
  return (
    <li className="relative flex gap-4 py-2.5">
      <div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg} ${iconColor} ring-4 ring-white`}>
        <i className={`${icon} text-[13px]`} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[13px] text-[#1A1A1A] leading-snug">{text}</p>
        <p className="mt-0.5 text-[11.5px] text-gray-400">{relativeTime(time)}</p>
      </div>
    </li>
  );
}
