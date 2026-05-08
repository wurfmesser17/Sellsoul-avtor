import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, Lock, ChevronRight, KeyRound } from 'lucide-react';

const ADMIN_PIN = '7081321';
const AUTH_KEY = 'sell_soul_admin_auth';

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  if (!isAdmin) return <div className="p-10 text-center font-mono opacity-20 uppercase tracking-widest">// ACCESS DENIED</div>;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-xs space-y-8 bg-zinc-50 border border-brand-line p-8 rounded-3xl text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-brand-ink flex items-center justify-center text-white">
            <Lock size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tighter uppercase">ADMIN ACCESS</h3>
            <p className="text-[10px] text-brand-muted font-mono uppercase tracking-[0.2em]">Введите код доступа системы</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-mono font-bold tracking-[0.5em] focus:outline-none transition-all ${
                error ? 'border-red-500 animate-bounce' : 'border-brand-line focus:border-brand-ink'
              }`}
              placeholder="•••••••"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-brand-ink text-white rounded-xl py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              ПОДТВЕРДИТЬ КОД
            </button>
            {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Неверный код доступа</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tighter">АДМИН-ПАНЕЛЬ</h2>
        <p className="text-sm text-brand-muted font-mono uppercase tracking-widest mt-1">
          System Control & User Management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-brand-line p-6 space-y-4">
          <div className="flex items-center gap-3 text-brand-ink">
            <Users size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Пользователи</span>
          </div>
          <div className="text-4xl font-extrabold tabular-nums">0</div>
          <p className="text-[10px] text-brand-muted uppercase tracking-widest">Всего зарегистрировано</p>
        </div>
        <div className="rounded-2xl border border-brand-line p-6 space-y-4">
          <div className="flex items-center gap-3 text-brand-ink">
            <Shield size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Сессии</span>
          </div>
          <div className="text-4xl font-extrabold tabular-nums">0</div>
          <p className="text-[10px] text-brand-muted uppercase tracking-widest">Активно сейчас</p>
        </div>
        <div className="rounded-2xl border border-brand-line p-6 space-y-4">
          <div className="flex items-center gap-3 text-brand-ink">
            <Lock size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Безопасность</span>
          </div>
          <div className="text-4xl font-extrabold tabular-nums">STABLE</div>
          <p className="text-[10px] text-brand-muted uppercase tracking-widest">Статус системы</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-line overflow-hidden">
        <div className="bg-zinc-50 p-4 border-b border-brand-line flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest">Последние входы</span>
          <button className="text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-brand-ink">Смотреть всех</button>
        </div>
        <div className="divide-y divide-brand-line">
          <div className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-brand-muted">browgaming1@gmail.com</span>
            </div>
            <span className="font-mono text-zinc-300">ADMIN</span>
          </div>
          <div className="p-12 text-center text-[10px] font-mono text-zinc-300 uppercase tracking-widest">
            // No recent activity log
          </div>
        </div>
      </div>
    </div>
  );
}
