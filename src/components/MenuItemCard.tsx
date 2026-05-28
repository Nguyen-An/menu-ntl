import type { MenuItem } from '@/types';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/utils/dateUtils';
import { QuantityButton } from './QuantityButton';

type Props = {
  item: MenuItem;
};

export function MenuItemCard({ item }: Props) {
  const { cart, addItem, updateQuantity } = useStore();
  const cartItem = cart.find((c) => c.itemId === item.id);
  const quantity = cartItem?.quantity ?? 0;

  function handleAdd() {
    if (quantity === 0) {
      addItem({ itemId: item.id, name: item.name, price: item.price, quantity: 1 });
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  }

  function handleRemove() {
    updateQuantity(item.id, quantity - 1);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {quantity > 0 && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
            {quantity}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
        <p className="text-blue-600 font-bold text-sm">{formatPrice(item.price)}</p>
        <div className="mt-auto pt-1">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
            >
              Thêm nè
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <QuantityButton onClick={handleRemove} type="minus" />
              <span className="font-bold text-gray-900 w-8 text-center">{quantity}</span>
              <QuantityButton onClick={handleAdd} type="plus" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
