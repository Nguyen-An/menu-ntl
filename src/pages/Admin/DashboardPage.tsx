import { useEffect, useState } from 'react';
import { getOrders } from '@/utils/storage';
import { formatPrice } from '@/utils/dateUtils';
import type { Order } from '@/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

type Period = 'day' | 'week' | 'month' | 'year';

function getOrderTotal(order: Order) {
  return order.items.reduce((s, i) => s + i.price * i.quantity, 0);
}

function buildDayData(allOrders: Order[], approvedOrders: Order[]) {
  const estimated: Record<string, number> = {};
  const actual: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    estimated[key] = 0;
    actual[key] = 0;
  }
  allOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays <= 6) {
      const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      estimated[key] = (estimated[key] ?? 0) + getOrderTotal(o);
    }
  });
  approvedOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays <= 6) {
      const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      actual[key] = (actual[key] ?? 0) + getOrderTotal(o);
    }
  });
  return Object.keys(estimated).map((label) => ({ label, estimated: estimated[label], actual: actual[label] ?? 0 }));
}

function buildWeekData(allOrders: Order[], approvedOrders: Order[]) {
  const estimated: Record<string, number> = {};
  const actual: Record<string, number> = {};
  for (let i = 7; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const year = d.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const key = `T${week}/${year.toString().slice(2)}`;
    estimated[key] = 0;
    actual[key] = 0;
  }
  allOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays <= 56) {
      const year = d.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      const key = `T${week}/${year.toString().slice(2)}`;
      if (key in estimated) estimated[key] = (estimated[key] ?? 0) + getOrderTotal(o);
    }
  });
  approvedOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays <= 56) {
      const year = d.getFullYear();
      const startOfYear = new Date(year, 0, 1);
      const week = Math.ceil(((d.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      const key = `T${week}/${year.toString().slice(2)}`;
      if (key in actual) actual[key] = (actual[key] ?? 0) + getOrderTotal(o);
    }
  });
  return Object.keys(estimated).map((label) => ({ label, estimated: estimated[label], actual: actual[label] ?? 0 }));
}

function buildMonthData(allOrders: Order[], approvedOrders: Order[]) {
  const estimated: Record<string, number> = {};
  const actual: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' });
    estimated[key] = 0;
    actual[key] = 0;
  }
  allOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = d.toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' });
    if (key in estimated) estimated[key] = (estimated[key] ?? 0) + getOrderTotal(o);
  });
  approvedOrders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = d.toLocaleDateString('vi-VN', { month: '2-digit', year: '2-digit' });
    if (key in actual) actual[key] = (actual[key] ?? 0) + getOrderTotal(o);
  });
  return Object.keys(estimated).map((label) => ({ label, estimated: estimated[label], actual: actual[label] ?? 0 }));
}

function buildYearData(allOrders: Order[], approvedOrders: Order[]) {
  const estimated: Record<string, number> = {};
  const actual: Record<string, number> = {};
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 3; y <= currentYear; y++) {
    estimated[String(y)] = 0;
    actual[String(y)] = 0;
  }
  allOrders.forEach((o) => {
    const key = String(new Date(o.createdAt).getFullYear());
    if (key in estimated) estimated[key] = (estimated[key] ?? 0) + getOrderTotal(o);
  });
  approvedOrders.forEach((o) => {
    const key = String(new Date(o.createdAt).getFullYear());
    if (key in actual) actual[key] = (actual[key] ?? 0) + getOrderTotal(o);
  });
  return Object.keys(estimated).map((label) => ({ label, estimated: estimated[label], actual: actual[label] ?? 0 }));
}

const PERIOD_LABELS: Record<Period, string> = {
  day: '7 ngày qua',
  week: '8 tuần qua',
  month: '12 tháng qua',
  year: 'Theo năm',
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<Period>('day');

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const approvedOrders = orders.filter((o) => o.status === 'approved');
  const totalEstimated = orders.reduce((s, o) => s + getOrderTotal(o), 0);
  const totalActual = approvedOrders.reduce((s, o) => s + getOrderTotal(o), 0);
  const totalOrders = orders.length;

  const chartData =
    period === 'day' ? buildDayData(orders, approvedOrders)
    : period === 'week' ? buildWeekData(orders, approvedOrders)
    : period === 'month' ? buildMonthData(orders, approvedOrders)
    : buildYearData(orders, approvedOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Doanh thu dự tính</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatPrice(totalEstimated)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Doanh thu thực tế</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(totalActual)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-800">Doanh thu — {PERIOD_LABELS[period]}</h2>
            </div>
            <div className="flex gap-1">
              {(['day', 'week', 'month', 'year'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {{ day: 'Ngày', week: 'Tuần', month: 'Tháng', year: 'Năm' }[p]}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={45}
              />
              <Tooltip
                formatter={(value, name) => [formatPrice(Number(value ?? 0)), String(name ?? '')]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="estimated" name="Dự tính" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Thực tế" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
