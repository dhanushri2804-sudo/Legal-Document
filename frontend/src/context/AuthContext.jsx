import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('legalease-token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('legalease-token');
    if (savedToken) {
      api
        .get('/auth/me')
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem('legalease-token');
          setToken('');
          setUser(null);
        })
        .finally(() => setLoading(false));
      return;
    }
    setLoading(false);
  }, [token]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    const authToken = response.data.token;
    localStorage.setItem('legalease-token', authToken);
    setToken(authToken);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const authToken = response.data.token;
    localStorage.setItem('legalease-token', authToken);
    setToken(authToken);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('legalease-token');
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
