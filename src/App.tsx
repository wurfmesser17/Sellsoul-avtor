import { AuthProvider, useAuth } from './context/AuthContext';
import { Shell } from './components/layout/Shell';
import { Calculator } from './components/calculator/Calculator';
import { Course } from './components/course/Course';
import { Calendar } from './components/calendar/Calendar';
import { AIGuide } from './components/ai/AIGuide';
import { Login } from './components/auth/Login';
import { AdminPanel } from './components/admin/AdminPanel';
import { useState } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('calculator');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-line border-t-brand-ink" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse text-brand-muted">
            SellSoul Engine Initializing
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'calculator' && <Calculator />}
      {activeTab === 'course' && <Course />}
      {activeTab === 'calendar' && <Calendar />}
      {activeTab === 'ai' && <AIGuide />}
      {activeTab === 'admin' && <AdminPanel />}
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
