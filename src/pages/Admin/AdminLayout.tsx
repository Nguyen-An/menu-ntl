import { Outlet, NavLink } from 'react-router-dom';
import { UtensilsCrossed, ClipboardList, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-800'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Quản lý</h1>
          </div>
          <span className="text-sm text-gray-500">Bảng điều khiển</span>
        </div>
        {/* Nav tabs */}
        <div className="max-w-6xl mx-auto px-6 flex gap-1">
          <NavLink to="/admin" end className={navClass}>
            <ClipboardList size={16} />
            Đơn hàng
          </NavLink>
          <NavLink to="/admin/dashboard" className={navClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
