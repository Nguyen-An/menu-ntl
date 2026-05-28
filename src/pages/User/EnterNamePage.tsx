import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed } from 'lucide-react';

export default function EnterNamePage() {
  const [name, setName] = useState('');
  const setUserName = useStore((s) => s.setUserName);
  const navigate = useNavigate();

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    navigate('/menu');
  }

  function handleAnonymous() {
    setUserName(`anon_${crypto.randomUUID()}`);
    navigate('/menu');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-6">
        <div className="bg-blue-100 rounded-full p-4">
          <UtensilsCrossed size={36} className="text-blue-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Xin chào người đẹp!</h1>
          <p className="text-gray-500 text-sm mt-1">Nhập tên của bạn để bắt đầu đặt hàng</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <Input
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="text-base h-12"
            autoFocus
          />
          <Button
            onClick={handleStart}
            disabled={!name.trim()}
            size="lg"
            className="w-full"
          >
            Bắt đầu đặt hàng
          </Button>
          <Button
            onClick={handleAnonymous}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Ẩn danh
          </Button>
        </div>
      </div>
    </div>
  );
}
