import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { CartItem } from '@/components/CartItem';
import { formatPrice } from '@/utils/dateUtils';
import { getOrders, saveOrders } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function OrderPage() {
  const navigate = useNavigate();
  const { userName, cart, currentOrderId, clearCart, setCurrentOrderId } = useStore();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  }, [userName, navigate]);

  useEffect(() => {
    if (cart.length === 0 && !confirmed) navigate('/menu', { replace: true });
  }, [cart, confirmed, navigate]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  async function handleConfirm() {
    const orders = await getOrders();

    if (currentOrderId) {
      // Update existing order
      const updated = orders.map((o) =>
        o.id === currentOrderId
          ? { ...o, items: cart, createdAt: new Date().toISOString() }
          : o
      );
      await saveOrders(updated);
    } else {
      // Create new order
      const newOrder = {
        id: crypto.randomUUID(),
        userName,
        createdAt: new Date().toISOString(),
        items: cart,
      };
      await saveOrders([...orders, newOrder]);
      setCurrentOrderId(newOrder.id);
    }

    setConfirmed(true);
    clearCart();
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-4 text-center">
          <CheckCircle2 size={56} className="text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Đơn hàng đã được xác nhận!</h2>
          <p className="text-gray-500 text-sm">
            Đơn hàng của bạn đã được đặt thành công, {userName.startsWith('anon_') ? 'người đẹp' : userName}.
          </p>
          <Button
            className="w-full mt-2"
            onClick={() => {
              clearCart();
              navigate('/');
            }}
          >
            Đơn hàng mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/menu')} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h1 className="font-bold text-gray-900 text-base">Đơn hàng của bạn</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Summary card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">{totalItems} mặt hàng{totalItems !== 1 ? 's' : ''}</h2>
            <span className="text-xs text-gray-400">by {userName.startsWith('anon_') ? 'người đẹp' : userName}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {cart.map((item) => (
              <CartItem key={item.itemId} item={item} editable={true} />
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-700">Tổng tiền</span>
            <span className="font-bold text-blue-600 text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/menu')}>
            Chỉnh sửa đơn hàng
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            {currentOrderId ? 'Cập nhật đơn hàng' : 'Đặt hàng'}
          </Button>
        </div>
      </div>
    </div>
  );
}
