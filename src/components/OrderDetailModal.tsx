import type { Order } from '@/types';
import { formatPrice, formatTime } from '@/utils/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Props = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};

export function OrderDetailModal({ order, open, onClose }: Props) {
  if (!order) return null;

  const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Đơn hàng –{' '}
            <span
              title={order.userName.length > 20 ? order.userName : undefined}
              className={order.userName.length > 20 ? 'cursor-help' : undefined}
            >
              {order.userName.length > 20 ? `${order.userName.slice(0, 20)}…` : order.userName}
            </span>
          </DialogTitle>
          <p className="text-sm text-gray-500 pt-1">
            {new Date(order.createdAt).toLocaleString('vi-VN')} &nbsp;·&nbsp; {formatTime(order.createdAt)}
          </p>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mặt hàng</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Tạm tính</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="font-bold text-blue-600 text-lg">{formatPrice(total)}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
