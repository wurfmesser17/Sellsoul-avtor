import { useEffect, useState } from 'react';
import { auth } from '../библиотека/firebase';
import {
  subscribeToAllUsers,
  blockUser,
  unblockUser,
  deleteUserProfile
} from '../библиотека/firestoreService';

// Замени на свой UID из Firebase Console → Authentication
const ADMIN_UID = 'ВАШ_UID_ЗДЕСЬ';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (user?.uid === ADMIN_UID) {
        setIsAdmin(true);
        const unsubUsers = subscribeToAllUsers(setUsers);
        return () => unsubUsers();
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubAuth();
  }, []);

  if (!isAdmin) return (
    <div style={styles.denied}>⛔ Нет доступа</div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛡️ Админ панель</h2>
      <p style={styles.count}>Пользователей: {users.length}</p>
      <div style={styles.list}>
        {users.map(user => (
          <div key={user.id} style={{
            ...styles.card,
            borderLeft: user.blocked ? '4px solid #ef4444' : '4px solid #22c55e'
          }}>
            <div>
              <p style={styles.email}>{user.email}</p>
              <p style={styles.uid}>UID: {user.id}</p>
              <span style={{
                ...styles.badge,
                background: user.blocked ? '#ef444420' : '#22c55e20',
                color: user.blocked ? '#ef4444' : '#22c55e'
              }}>
                {user.blocked ? '🔴 Заблокирован' : '🟢 Активен'}
              </span>
            </div>
            <div style={styles.actions}>
              {user.blocked
                ? <button style={styles.btnGreen} onClick={() => unblockUser(user.id)}>Разблокировать</button>
                : <button style={styles.btnRed} onClick={() => blockUser(user.id)}>Заблокировать</button>
              }
              <button style={styles.btnDelete} onClick={() => {
                if (confirm(`Удалить ${user.email}?`)) deleteUserProfile(user.id);
              }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' },
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '8px' },
  count: { color: '#888', marginBottom: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: '#1a1a1a', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  email: { fontWeight: 600, margin: 0 },
  uid: { fontSize: '11px', color: '#666', margin: '4px 0' },
  badge: { fontSize: '12px', padding: '2px 8px', borderRadius: '999px' },
  actions: { display: 'flex', gap: '8px' },
  btnRed: { background: '#ef444420', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' },
  btnGreen: { background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' },
  btnDelete: { background: '#33333380', color: '#999', border: '1px solid #444', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' },
  denied: { textAlign: 'center', marginTop: '100px', fontSize: '24px' }
};
