import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { CartItem } from '@/components/CartItem';
import { formatPrice } from '@/utils/dateUtils';
import { getOrders, saveOrders } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, ChevronLeft, Download, QrCode, Banknote } from 'lucide-react';
import type { OrderItem } from '@/types';

export default function OrderPage() {
  const navigate = useNavigate();
  const { userName, cart, currentOrderId, clearCart, setCurrentOrderId } = useStore();
  const [paymentModal, setPaymentModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState<OrderItem[]>([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  }, [userName, navigate]);

  useEffect(() => {
    if (cart.length === 0 && !confirmed && !showQR) navigate('/menu', { replace: true });
  }, [cart, confirmed, showQR, navigate]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  async function saveOrder(paymentMethod: 'cash' | 'qr') {
    const orders = await getOrders();
    if (currentOrderId) {
      const updated = orders.map((o) =>
        o.id === currentOrderId
          ? { ...o, items: cart, createdAt: new Date().toISOString(), payment_method: paymentMethod }
          : o
      );
      await saveOrders(updated);
    } else {
      const newOrder = {
        id: crypto.randomUUID(),
        userName,
        createdAt: new Date().toISOString(),
        items: cart,
        status: 'created' as const,
        payment_method: paymentMethod,
      };
      await saveOrders([...orders, newOrder]);
      setCurrentOrderId(newOrder.id);
    }
  }

  async function handleCash() {
    setConfirmedItems([...cart]);
    setConfirmedTotal(total);
    await saveOrder('cash');
    setPaymentModal(false);
    setConfirmed(true);
    clearCart();
  }

  function handleQR() {
    setPaymentModal(false);
    setShowQR(true);
  }

  async function handleQRConfirm() {
    setConfirmedItems([...cart]);
    setConfirmedTotal(total);
    await saveOrder('qr');
    setShowQR(false);
    setConfirmed(true);
    clearCart();
  }

  function handleDownloadQR() {
    const a = document.createElement('a');
    a.href = '/QR_PAY.jpg';
    a.download = 'QR_PAY.jpg';
    a.click();
  }

  function handleNewOrder() {
    setCurrentOrderId(null);
    navigate('/menu');
  }

  // Confirmed screen
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-center">
            <h1 className="font-bold text-gray-900 text-base">Chi tiết đơn hàng của bạn</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-4">
            <CheckCircle2 size={48} className="text-green-500" />
            <p className="text-gray-500 text-sm">
              Đặt hàng thành công, {userName.startsWith('anon_') ? 'người đẹp' : userName}!
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="divide-y divide-gray-100">
              {confirmedItems.map((item) => (
                <div key={item.itemId} className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-800">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-700">Tổng tiền</span>
              <span className="font-bold text-blue-600 text-lg">{formatPrice(confirmedTotal)}</span>
            </div>
          </div>
          <Button className="w-full" onClick={handleNewOrder}>
            Đặt đơn hàng mới
          </Button>
        </div>
      </div>
    );
  }

  // QR payment screen
  if (showQR) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => { setShowQR(false); setPaymentModal(true); }}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="font-bold text-gray-900 text-base">Thanh toán QR</h1>
            <div className="w-6" />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6 flex flex-col items-center gap-6">
          <img src="/QR_PAY.jpg" alt="QR thanh toán" className="w-full max-w-xs rounded-2xl shadow-lg" />
          <div className="flex gap-3 w-full max-w-xs">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleDownloadQR}>
              <Download size={16} />
              Tải ảnh
            </Button>
            <Button className="flex-1" onClick={handleQRConfirm}>
              Xác nhận
            </Button>
          </div>
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
            <h2 className="font-semibold text-gray-800">{totalItems} mặt hàng</h2>
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
          <Button className="flex-1" onClick={() => setPaymentModal(true)}>
            {currentOrderId ? 'Cập nhật đơn hàng' : 'Đặt hàng'}
          </Button>
        </div>
      </div>

      {/* Payment method dialog */}
      <Dialog open={paymentModal} onOpenChange={setPaymentModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bạn muốn thanh toán bằng hình thức nào?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="outline" className="w-full gap-2 h-12" onClick={handleCash}>
              <Banknote size={18} />
              Thanh toán tiền mặt
            </Button>
            <Button className="w-full gap-2 h-12" onClick={handleQR}>
              <QrCode size={18} />
              Thanh toán QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

