import type { OrderItem } from '@/types';
import { formatPrice } from '@/utils/dateUtils';
import { useStore } from '@/store/useStore';
import { QuantityButton } from './QuantityButton';
import { Trash2 } from 'lucide-react';

type Props = {
  item: OrderItem;
  editable?: boolean;
};

export function CartItem({ item, editable = true }: Props) {
  const { updateQuantity, removeItem } = useStore();

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
        <p className="text-blue-600 text-sm">{formatPrice(item.price)}</p>
      </div>
      {editable ? (
        <div className="flex items-center gap-2">
          <QuantityButton onClick={() => updateQuantity(item.itemId, item.quantity - 1)} type="minus" />
          <span className="font-bold text-gray-900 w-6 text-center text-sm">{item.quantity}</span>
          <QuantityButton onClick={() => updateQuantity(item.itemId, item.quantity + 1)} type="plus" />
          <button
            onClick={() => removeItem(item.itemId)}
            className="ml-1 text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div className="text-right">
          <p className="text-sm text-gray-500">x{item.quantity}</p>
          <p className="font-semibold text-gray-900 text-sm">{formatPrice(item.price * item.quantity)}</p>
        </div>
      )}
    </div>
  );
}
