import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api, tokenStore } from '../lib/api.js';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('fitai_user');
    if (raw && tokenStore.get()) {
      const cached = JSON.parse(raw);
      setUser(cached);
      api.getProfile().then(p => {
        const merged = { id: p.id, email: p.email, role: p.role };
        setUser(merged);
        localStorage.setItem('fitai_user', JSON.stringify(merged));
      }).catch(() => {});
    }
    setReady(true);
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem('fitai_user', JSON.stringify(u));
    else localStorage.removeItem('fitai_user');
  };

  const login = useCallback(async (email, password) => {
    try {
      const { accessToken, refreshToken, user: u } = await api.login(email, password);
      tokenStore.setPair({ accessToken, refreshToken });
      persist(u);
      toast.success('С возвращением');
    } catch (e) {
      toast.error(e.data?.error === 'invalid_credentials' ? 'Неверный email или пароль' : 'Не удалось войти');
      throw e;
    }
  }, []);

  const register = useCallback(async (email, password) => {
    try {
      const { accessToken, refreshToken, user: u } = await api.register(email, password);
      tokenStore.setPair({ accessToken, refreshToken });
      persist(u);
      toast.success('Аккаунт создан');
    } catch (e) {
      toast.error(e.data?.error === 'email_taken' ? 'Email уже занят' : 'Не удалось зарегистрироваться');
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    tokenStore.clear();
    persist(null);
    toast('Вы вышли');
  }, []);

  return (
    <AuthCtx.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
