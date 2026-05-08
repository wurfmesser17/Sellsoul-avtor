import React from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  BookOpen, 
  Bot, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SIDEBAR_ITEMS = [
  { id: 'calculator', name: 'Калькулятор', icon: Calculator },
  { id: 'course', name: 'Курс Kaspi', icon: BookOpen },
  { id: 'calendar', name: 'Календарь', icon: CalendarDays },
  { id: 'ai', name: 'AI Гид', icon: Bot },
];

export function Shell({ children, activeTab, onTabChange }: ShellProps) {
  const { user, profile, logout, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-brand-bg">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="relative flex flex-col border-r border-brand-line bg-white"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted hover:text-brand-ink"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo Section */}
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand-ink" />
            {!isCollapsed && (
              <span className="text-xl font-extrabold tracking-tighter">SELLSOUL</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 mt-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  isActive 
                    ? "bg-brand-ink text-white font-medium" 
                    : "text-brand-muted hover:bg-zinc-100 hover:text-brand-ink"
                )}
              >
                <item.icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-2 h-6 w-[3px] rounded-r bg-white"
                  />
                )}
              </button>
            );
          })}
          
          {isAdmin && (
            <button
              onClick={() => onTabChange('admin')}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                activeTab === 'admin' 
                  ? "bg-brand-ink text-white font-medium" 
                  : "text-brand-muted hover:bg-zinc-100 hover:text-brand-ink"
              )}
            >
              <ShieldCheck size={18} />
              {!isCollapsed && <span>Админ-панель</span>}
            </button>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-brand-line p-4">
          <div className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
            !isCollapsed && "bg-zinc-50 border border-zinc-100"
          )}>
            <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full bg-brand-line overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={16} className="text-brand-muted" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold leading-tight">
                  {user?.displayName || 'Пользователь'}
                </span>
                <span className="truncate text-[10px] text-brand-muted leading-tight">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={logout}
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand-muted hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Выйти</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-brand-bg relative selection:bg-brand-ink selection:text-white">
        <div className="mx-auto max-w-5xl px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
