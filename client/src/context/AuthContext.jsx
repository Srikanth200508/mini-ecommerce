import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('shopnova_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopnova_token') || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('shopnova_user', JSON.stringify(user));
      localStorage.setItem('shopnova_token', token);
    } else {
      localStorage.removeItem('shopnova_user');
      localStorage.removeItem('shopnova_token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.register({ name, email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

