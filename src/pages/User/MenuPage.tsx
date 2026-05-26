import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { MenuItemCard } from '@/components/MenuItemCard';
import { OrderSummary } from '@/components/OrderSummary';
import menuData from '@/data/menu.json';
import type { MenuItem } from '@/types';
import { ChevronLeft } from 'lucide-react';

const menuItems = menuData as MenuItem[];

export default function MenuPage() {
  const navigate = useNavigate();
  const userName = useStore((s) => s.userName);

  useEffect(() => {
    if (!userName) navigate('/', { replace: true });
  }, [userName, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-gray-900 text-base">Menu</h1>
            <p className="text-xs text-gray-500">Hi, {userName}!</p>
          </div>
          <div className="w-6" />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <OrderSummary onConfirm={() => navigate('/order')} />
    </div>
  );
}
