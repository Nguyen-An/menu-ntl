import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { UtensilsCrossed, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';
import AdminLoginPage from './AdminLoginPage';
import { Button } from '@/components/ui/button';

const SESSION_KEY = 'adminSession';

type AdminSession = { id: string; name: string; role: string };

export default function AdminLayout() {
  const [session, setSession] = useState<AdminSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  if (!session) {
    return <AdminLoginPage onLogin={setSession} />;
  }

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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Xin chào, <span className="font-medium text-gray-700">{session.name}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-gray-600"
              onClick={() => setSession(null)}
            >
              <LogOut size={15} />
              Đăng xuất
            </Button>
          </div>
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
