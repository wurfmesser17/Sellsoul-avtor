import { CalculatorSettings } from '../../types';
import { DollarSign, Percent, Globe, Scale } from 'lucide-react';

interface SettingsBarProps {
  settings: CalculatorSettings;
  onChange: (key: keyof CalculatorSettings, value: number) => void;
}

export function SettingsBar({ settings, onChange }: SettingsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-brand-line border border-brand-line rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <Globe size={12} className="text-brand-ink" /> CARGO $/kg
        </label>
        <input
          type="number"
          value={settings.cargo}
          onChange={(e) => onChange('cargo', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <Percent size={12} className="text-brand-ink" /> НДС %
        </label>
        <input
          type="number"
          value={settings.nds}
          onChange={(e) => onChange('nds', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <Scale size={12} className="text-brand-ink" /> Kaspi %
        </label>
        <input
          type="number"
          value={settings.kaspiTax}
          onChange={(e) => onChange('kaspiTax', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <Percent size={12} className="text-brand-ink" /> ИП %
        </label>
        <input
          type="number"
          value={settings.ip}
          onChange={(e) => onChange('ip', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <DollarSign size={12} className="text-brand-ink" /> USD ₸
        </label>
        <input
          type="number"
          value={settings.usd}
          onChange={(e) => onChange('usd', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
      <div className="bg-white p-4 space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
          <DollarSign size={12} className="text-brand-ink" /> CNY ₸
        </label>
        <input
          type="number"
          value={settings.cny}
          onChange={(e) => onChange('cny', parseFloat(e.target.value) || 0)}
          className="w-full bg-transparent text-sm font-mono font-bold focus:outline-none"
        />
      </div>
    </div>
  );
}
