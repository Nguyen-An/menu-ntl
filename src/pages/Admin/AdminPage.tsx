import { useState, useEffect } from 'react';
import type { Order } from '@/types';
import { getOrders, saveOrders } from '@/utils/storage';
import { isSameDay, toDateInputValue, formatPrice, formatTime } from '@/utils/dateUtils';
import { CalendarFilter } from '@/components/CalendarFilter';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClipboardList, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()));
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filteredOrders = orders.filter((o) => isSameDay(o.createdAt, selectedDate));

  const dailyTotal = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const dailyActual = filteredOrders
    .filter((o) => o.status === 'approved')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  function openDetail(order: Order) {
    setSelectedOrder(order);
    setModalOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const updated = orders.filter((o) => o.id !== deleteTarget.id);
    await saveOrders(updated);
    setOrders(updated);
    setDeleteTarget(null);
  }

  async function approveOrder(order: Order) {
    const updated = orders.map((o) =>
      o.id === order.id ? { ...o, status: 'approved' as const } : o
    );
    await saveOrders(updated);
    setOrders(updated);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-gray-600" />
            <span className="font-semibold text-gray-800">
              {filteredOrders.length} Đơn hàng
            </span>
            {filteredOrders.length > 0 && (
              <>
                <span className="text-gray-400 text-sm">— Dự tính: {formatPrice(dailyTotal)}</span>
                <span className="text-gray-400 text-sm">| Thực tế: <span className="text-green-600 font-medium">{formatPrice(dailyActual)}</span></span>
              </>
            )}
          </div>
          <CalendarFilter value={selectedDate} onChange={setSelectedDate} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <ClipboardList size={40} />
              <p className="text-sm">No orders for this date</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Mặt hàng</TableHead>
                  <TableHead>Tổng</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const orderTotal = order.items.reduce(
                    (sum, i) => sum + i.price * i.quantity,
                    0
                  );
                  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const isApproved = order.status === 'approved';
                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => openDetail(order)}
                    >
                      <TableCell className="text-gray-400 text-xs">{index + 1}</TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{order.userName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-medium">
                          {itemCount} mặt hàng
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">{formatPrice(orderTotal)}</span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {formatTime(order.createdAt)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 size={13} />
                            Đã phê duyệt
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">Tạo mới</span>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={isApproved}
                            onClick={() => approveOrder(order)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                            title="Xác nhận đơn"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(order)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={18} />
              Xác nhận xóa order
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn xóa order của{' '}
            <span className="font-semibold text-gray-900">{deleteTarget?.userName}</span> không?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteTarget(null)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmDelete}
            >
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
