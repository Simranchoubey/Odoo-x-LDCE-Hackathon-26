import { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!setTokenCheck()) { setLoading(false); return; }
    api('/auth/me')
      .then((me) => {
        setUser(me);
        setIsAuthenticated(true);
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    try {
      const email = credentials.email || credentials.username;
      const { token, user: me } = await api('/auth/login', {
        method: 'POST',
        body: { email, password: credentials.password },
      });
      setToken(token);
      setUser(me);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async ({ name, email, password, avatarUrl }) => {
    try {
      const { token, user: me } = await api('/auth/register', {
        method: 'POST',
        body: { name, email, password, avatarUrl },
      });
      setToken(token);
      setUser(me);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updates) => {
    try {
      const updated = await api('/users/me', { method: 'PATCH', body: updates });
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]" aria-busy="true" />
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function setTokenCheck() {
  return !!localStorage.getItem('gt_token');
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
