import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Good, CalculatorSettings, GoodStatus, UserCalendar, ChatMessage } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// DEFAULT SETTINGS
const DEFAULT_SETTINGS: CalculatorSettings = {
  cargo: 3.9,
  nds: 13,
  kaspiTax: 12.5,
  ip: 3,
  usd: 470,
  cny: 68
};

// SETTINGS
export async function getSettings(userId: string): Promise<CalculatorSettings> {
  const path = `settings/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'settings', userId));
    return snap.exists() ? (snap.data() as CalculatorSettings) : DEFAULT_SETTINGS;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(userId: string, settings: CalculatorSettings) {
  const path = `settings/${userId}`;
  try {
    await setDoc(doc(db, 'settings', userId), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// GOODS
export function subscribeToGoods(userId: string, callback: (goods: Good[]) => void) {
  const path = 'goods';
  const q = query(
    collection(db, path),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const goods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Good[];
    callback(goods);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addGood(userId: string, initialData: Partial<Good> = {}) {
  const path = 'goods';
  try {
    await addDoc(collection(db, path), {
      userId,
      name: '',
      price1688: 0,
      weight: 0,
      chinaDelivery: 0,
      qty: 1,
      kaspiPrice: 0,
      status: 'potential',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...initialData
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateGood(goodId: string, data: Partial<Good>) {
  const path = `goods/${goodId}`;
  try {
    await updateDoc(doc(db, 'goods', goodId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteGood(goodId: string) {
  const path = `goods/${goodId}`;
  try {
    await deleteDoc(doc(db, 'goods', goodId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// CALENDAR
export async function getCalendar(userId: string): Promise<UserCalendar | null> {
  const path = `calendars/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'calendars', userId));
    return snap.exists() ? (snap.data() as UserCalendar) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveCalendar(userId: string, calendar: UserCalendar) {
  const path = `calendars/${userId}`;
  try {
    await setDoc(doc(db, 'calendars', userId), calendar);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// CHATS
export function subscribeToChat(userId: string, callback: (messages: ChatMessage[]) => void) {
  const path = 'chats';
  const q = query(
    collection(db, path),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatMessage[];
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addChatMessage(userId: string, role: 'user' | 'model', text: string) {
  const path = 'chats';
  try {
    await addDoc(collection(db, path), {
      userId,
      role,
      text,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
