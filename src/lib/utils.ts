import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number) {
  if (!isFinite(n)) return '—';
  return Math.round(n).toLocaleString('ru-RU') + ' ₸';
}

export function kaspiDelivery(kaspiPrice: number, weightKg: number) {
  if (kaspiPrice <= 0) return 0;
  if (kaspiPrice < 10000) {
    if (kaspiPrice < 1000)  return 57;
    if (kaspiPrice < 3000)  return 173;
    if (kaspiPrice < 5000)  return 231;
    return 927; // 5000–10000
  } else {
    const w = weightKg || 0;
    if (w <= 5)   return 1507;
    if (w <= 15)  return 1971;
    if (w <= 30)  return 4175;
    if (w <= 60)  return 6553;
    if (w <= 100) return 9917;
    return 13919;
  }
}
