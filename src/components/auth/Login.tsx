import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { registerUserProfile } from '../../lib/firestoreService';

export function Login() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
    const user = auth.currentUser;
    if (user) {
      await registerUserProfile(user.uid, user.email || '');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 font-sans">
      <div className="w-full max-w-sm space-y-12 text-center">
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto h-3 w-3 rounded-full bg-brand-ink"
          />
          <h1 className="text-5xl font-extrabold tracking-tighter">SELLSOUL</h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-muted">
            The Elite Kaspi Sellers Toolkit
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-ink bg-white px-6 py-4 text-sm font-bold transition-all hover:bg-brand-ink hover:text-white"
          >
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            Вход через Google
          </button>
          
          <p className="text-[10px] text-brand-muted uppercase tracking-widest leading-relaxed">
            Авторизуйтесь для доступа к вашим расчетам,<br /> аналитике и AI инструментам.
          </p>
        </div>

        <div className="pt-12">
          <div className="h-px bg-brand-line w-12 mx-auto" />
          <p className="mt-8 text-[9px] font-mono text-zinc-300 uppercase tracking-[0.4em]">
            Developed for Professionals
          </p>
        </div>
      </div>
    </div>
  );
}
