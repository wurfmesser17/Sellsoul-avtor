import { 
  getSettings, 
  saveSettings, 
  subscribeToGoods, 
  addGood, 
  updateGood, 
  deleteGood 
} from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { Good, CalculatorSettings } from '../../types';
import { useState, useEffect } from 'react';
import { GoodCard } from './GoodCard';
import { SettingsBar } from './SettingsBar';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { fmt, cn, kaspiDelivery } from '../../lib/utils';

const DEFAULT_SETTINGS: CalculatorSettings = {
  cargo: 3.9,
  nds: 13,
  kaspiTax: 12.5,
  ip: 3,
  usd: 470,
  cny: 68
};

export function Calculator() {
  const { user } = useAuth();
  const [goods, setGoods] = useState<Good[]>([]);
  const [settings, setSettings] = useState<CalculatorSettings>(DEFAULT_SETTINGS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<'potential' | 'dead'>('potential');

  useEffect(() => {
    if (user) {
      // Load settings
      getSettings(user.uid).then(s => {
        setSettings(s);
        setIsInitialLoading(false);
      });
      // Subscribe to goods
      return subscribeToGoods(user.uid, setGoods);
    }
  }, [user]);

  if (!user) return null;

  const filteredGoods = goods.filter(g => g.status === activeStatus);
  const totalCount = goods.length;
  const potentialCount = goods.filter(g => g.status === 'potential').length;
  const deadCount = goods.filter(g => g.status === 'dead').length;

  const totals = goods.reduce((acc, g) => {
    const cost1 = g.price1688 * settings.cny;
    const cost2 = g.price1688 * settings.cny * (settings.nds / 100);
    const cost3 = g.chinaDelivery * settings.cny;
    const cost4 = g.weight * settings.cargo * settings.usd;
    
    const delivery = kaspiDelivery(g.kaspiPrice, g.weight);
    const costUnit = cost1 + cost2 + cost3 + cost4 + delivery;
    const rev = g.kaspiPrice - g.kaspiPrice * (settings.kaspiTax / 100) - g.kaspiPrice * (settings.ip / 100);
    
    acc.cost += costUnit * g.qty;
    acc.revenue += rev * g.qty;
    acc.margin += (rev - costUnit) * g.qty;
    acc.totalKaspiPrice += g.kaspiPrice * g.qty;
    acc.totalFees += (g.kaspiPrice * (settings.kaspiTax / 100) + g.kaspiPrice * (settings.ip / 100)) * g.qty;
    return acc;
  }, { cost: 0, revenue: 0, margin: 0, totalKaspiPrice: 0, totalFees: 0 });

  const totalMarginPct = totals.totalKaspiPrice > 0 ? (totals.margin / totals.totalKaspiPrice) * 100 : 0;

  const handleSettingChange = (key: keyof CalculatorSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(user.uid, newSettings);
  };

  const handleGoodUpdate = async (id: string, data: Partial<Good>) => {
    // If status changes in the data, we might want to follow it
    if (data.status && data.status !== activeStatus) {
      setActiveStatus(data.status);
    }
    await updateGood(id, data);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter">КАЛЬКУЛЯТОР МАРЖИ</h1>
          <p className="text-sm text-brand-muted mt-1 uppercase tracking-widest font-mono">1688.com × KASPI.KZ</p>
        </div>
      </div>

      <SettingsBar settings={settings} onChange={handleSettingChange} />
      
      {isInitialLoading && (
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-muted animate-pulse">
          <Loader2 size={12} className="animate-spin" />
          Синхронизация параметров...
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveStatus('potential')}
          className={cn(
            "flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold transition-all uppercase tracking-widest",
            activeStatus === 'potential' 
              ? "bg-brand-ink text-white" 
              : "border border-brand-line text-brand-muted hover:border-brand-ink hover:text-brand-ink"
          )}
        >
          🟢 Потенциальные {potentialCount > 0 && `(${potentialCount})`}
        </button>
        <button
          onClick={() => setActiveStatus('dead')}
          className={cn(
            "flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold transition-all uppercase tracking-widest",
            activeStatus === 'dead' 
              ? "bg-brand-ink text-white" 
              : "border border-brand-line text-brand-muted hover:border-brand-ink hover:text-brand-ink"
          )}
        >
          🔴 Мёртвые {deadCount > 0 && `(${deadCount})`}
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={async () => {
             const confirms = window.confirm("Вы уверены? Все товары будут удалены.");
             if (confirms) {
               for (const g of goods) {
                 await deleteGood(g.id);
               }
             }
          }}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-muted hover:text-red-500 transition-colors"
        >
          <Trash2 size={12} />
          Очистить историю
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredGoods.length > 0 ? (
            filteredGoods.map((good: Good, idx: number) => (
              <GoodCard 
                key={good.id} 
                good={good} 
                settings={settings as CalculatorSettings} 
                onUpdate={(data: Partial<Good>) => handleGoodUpdate(good.id, data)}
                onDelete={() => deleteGood(good.id)}
                index={idx + 1}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-brand-line text-xs font-mono uppercase tracking-widest text-brand-muted"
            >
              // нет товаров в этой категории
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 flex justify-center">
        <button
          onClick={() => addGood(user.uid, { status: activeStatus })}
          className="flex items-center gap-2 rounded-xl bg-zinc-50 border border-brand-line px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-all shadow-sm"
        >
          <Plus size={16} />
          Добавить расчет
        </button>
      </div>
    </div>
  );
}
