import { toDateInputValue } from '@/utils/dateUtils';
import { CalendarDays } from 'lucide-react';

type Props = {
  value: string;
  onChange: (date: string) => void;
};

export function CalendarFilter({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CalendarDays size={16} className="text-gray-500" />
        Date
      </label>
      <input
        type="date"
        value={value}
        max={toDateInputValue(new Date())}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}
