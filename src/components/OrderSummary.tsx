import { useStore } from '@/store/useStore';
import { formatPrice } from '@/utils/dateUtils';
import { ShoppingCart } from 'lucide-react';

type Props = {
  onConfirm: () => void;
};

export function OrderSummary({ onConfirm }: Props) {
  const cart = useStore((s) => s.cart);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-40">
      <button
        onClick={onConfirm}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 flex items-center justify-between px-4 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} />
          <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </span>
        </div>
        <span>Xác nhận đơn hàng</span>
        <span className="font-bold">{formatPrice(totalPrice)}</span>
      </button>
    </div>
  );
}
