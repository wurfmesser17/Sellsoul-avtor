export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export interface CalculatorSettings {
  cargo: number;
  nds: number;
  kaspiTax: number;
  ip: number;
  usd: number;
  cny: number;
}

export type GoodStatus = 'potential' | 'dead';

export interface Good {
  id: string;
  userId: string;
  name: string;
  price1688: number;
  weight: number;
  chinaDelivery: number;
  qty: number;
  kaspiPrice: number;
  status: GoodStatus;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarPerson {
  name: string;
  number: string;
  amount: number;
  checked: boolean;
  type: 'familiar' | 'stranger';
  customized?: boolean;
}

export interface CalendarDay {
  index: number;
  familiars: CalendarPerson[];
  strangers: CalendarPerson[];
}

export interface UserCalendar {
  userId: string;
  familiars: { name: string; number: string }[];
  days: CalendarDay[];
  startDate: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  createdAt: any;
}
