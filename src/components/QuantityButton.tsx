import { Minus, Plus } from 'lucide-react';

type Props = {
  onClick: () => void;
  type: 'plus' | 'minus';
};

export function QuantityButton({ onClick, type }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 active:scale-95"
    >
      {type === 'plus' ? <Plus size={14} /> : <Minus size={14} />}
    </button>
  );
}
