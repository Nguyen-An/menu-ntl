import { useState } from 'react';
import { getAdmins } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, Lock } from 'lucide-react';

type Props = {
  onLogin: (user: { id: string; name: string; role: string }) => void;
};

export default function AdminLoginPage({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!name.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên và mật khẩu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const admins = await getAdmins();
      const found = admins.find(
        (a) => a.name === name.trim() && a.password === password
      );
      if (found) {
        onLogin({ id: found.id, name: found.name, role: found.role });
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-6">
        <div className="bg-blue-100 rounded-full p-4">
          <UtensilsCrossed size={36} className="text-blue-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Đăng nhập Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Vui lòng đăng nhập để tiếp tục</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <Input
            placeholder="Tên đăng nhập"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="h-11"
            autoFocus
          />
          <div className="relative">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="h-11 pr-10"
            />
            <Lock size={15} className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <Button
            onClick={handleLogin}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </div>
      </div>
    </div>
  );
}
