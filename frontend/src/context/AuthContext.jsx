import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pawsync_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pawsync_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('pawsync_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('pawsync_token');
        localStorage.removeItem('pawsync_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('pawsync_token', data.token);
      localStorage.setItem('pawsync_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('pawsync_token', data.token);
      localStorage.setItem('pawsync_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pawsync_token');
    localStorage.removeItem('pawsync_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
