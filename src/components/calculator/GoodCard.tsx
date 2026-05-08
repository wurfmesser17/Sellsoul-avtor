import { Good, CalculatorSettings } from '../../types';
import { motion } from 'motion/react';
import { Trash2, TrendingUp, TrendingDown, Info, Package, DollarSign, Weight, Truck } from 'lucide-react';
import { fmt, kaspiDelivery, cn } from '../../lib/utils';
import { useEffect } from 'react';

interface GoodCardProps {
  key?: string | number;
  good: Good;
  settings: CalculatorSettings;
  onUpdate: (data: Partial<Good>) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  index: number;
}

export function GoodCard({ good, settings, onUpdate, onDelete, index }: GoodCardProps) {
  // Calculations
  const cost1 = good.price1688 * settings.cny;
  const cost2 = good.price1688 * settings.cny * (settings.nds / 100);
  const cost3 = good.chinaDelivery * settings.cny;
  const cost4 = good.weight * settings.cargo * settings.usd;
  
  const costSourcingUnit = cost1 + cost2 + cost3 + cost4;
  const costSourcingTotal = costSourcingUnit * good.qty;
  
  const delivery = kaspiDelivery(good.kaspiPrice, good.weight);
  
  const kaspiTaxAmount = good.kaspiPrice * (settings.kaspiTax / 100);
  const ipTaxAmount = good.kaspiPrice * (settings.ip / 100);
  const totalFeesUnit = kaspiTaxAmount + ipTaxAmount;
  
  const revenueUnit = good.kaspiPrice - totalFeesUnit - delivery;
  const revenueTotal = revenueUnit * good.qty;
  
  const marginUnit = revenueUnit - costSourcingUnit;
  const marginTotal = marginUnit * good.qty;
  const marginPct = good.kaspiPrice > 0 ? (marginUnit / good.kaspiPrice) * 100 : 0;

  const isDead = marginPct < 0;
  const isWarning = marginUnit < 3000 && !isDead;

  // Sync status if it changed due to calculations
  const newStatus = isDead ? 'dead' : 'potential';
  
  useEffect(() => {
    if (good.status !== newStatus) {
      onUpdate({ status: newStatus });
    }
  }, [newStatus, good.status, onUpdate]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative rounded-2xl border-2 p-6 transition-all duration-300",
        isDead ? "bg-red-50/30 border-red-100" : isWarning ? "bg-amber-50/30 border-amber-100" : "bg-white border-brand-line hover:border-brand-ink"
      )}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest font-bold">
              // ИЗДЕЛИЕ_{String(index).padStart(3, '0')}
            </span>
            <input
              type="text"
              value={good.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Введите название товара..."
              className="flex-1 bg-transparent text-xl font-extrabold tracking-tight placeholder:text-zinc-300 focus:outline-none"
            />
            <button
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-brand-muted hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                <DollarSign size={10} /> Цена 1688 (¥)
              </label>
              <input
                type="number"
                value={good.price1688 || ''}
                onChange={(e) => onUpdate({ price1688: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm font-mono focus:border-brand-ink focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                <Weight size={10} /> Вес (кг)
              </label>
              <input
                type="number"
                value={good.weight || ''}
                onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm font-mono focus:border-brand-ink focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                <Truck size={10} /> Дост. Китай (¥)
              </label>
              <input
                type="number"
                value={good.chinaDelivery || ''}
                onChange={(e) => onUpdate({ chinaDelivery: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm font-mono focus:border-brand-ink focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                <Package size={10} /> Кол-во (шт)
              </label>
              <input
                type="number"
                value={good.qty || ''}
                onChange={(e) => onUpdate({ qty: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm font-mono focus:border-brand-ink focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                <Info size={10} /> Цена Kaspi (₸)
              </label>
              <input
                type="number"
                value={good.kaspiPrice || ''}
                onChange={(e) => onUpdate({ kaspiPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm font-mono focus:border-brand-ink focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="w-full lg:w-72 bg-zinc-50 rounded-xl p-5 space-y-4 border border-brand-line">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            Итоги по товару
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-brand-muted font-medium">Себестоимость</span>
              <span className="font-mono text-sm">{fmt(costSourcingTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-brand-muted font-medium">Комиссии+ИП</span>
              <span className="font-mono text-xs text-red-400">-{fmt(totalFeesUnit * good.qty)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-brand-muted font-medium">Доставка Kaspi</span>
              <span className="font-mono text-xs text-red-400">-{fmt(delivery * good.qty)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-brand-muted font-bold">Чистая выручка</span>
              <span className="font-mono text-sm font-bold">{fmt(revenueTotal)}</span>
            </div>
            <div className="h-px bg-brand-line" />
            
            <div className="flex justify-between items-center py-1">
              <span className="text-xs font-black uppercase tracking-widest">Маржа ₸</span>
              <div className="text-right">
                <div className={cn(
                  "text-xl font-black tracking-tighter leading-tight",
                  marginTotal < 0 ? "text-red-500" : "text-emerald-600"
                )}>
                  {fmt(marginTotal)}
                </div>
                <div className={cn(
                  "text-[10px] font-bold font-mono",
                  marginPct < 15 ? "text-red-400" : marginPct > 25 ? "text-emerald-500" : "text-brand-muted"
                )}>
                  {marginPct.toFixed(1)}% {marginPct < 0 ? <TrendingDown size={10} className="inline ml-1" /> : <TrendingUp size={10} className="inline ml-1" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
