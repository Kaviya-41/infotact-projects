/**
 * AuthContext.tsx – Authentication context for DisasterIQ
 * Client-side only auth using localStorage for demo purposes.
 * Provides login, signup, logout, and user state.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// ── Storage keys ───────────────────────────────────────────────────────────────

const STORAGE_KEY_USER = 'disasteriq_user';
const STORAGE_KEY_ACCOUNTS = 'disasteriq_accounts';

// ── Context ────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = user !== null;

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  // Get stored accounts
  const getAccounts = (): Record<string, { name: string; password: string }> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    const accounts = getAccounts();
    const account = accounts[email.toLowerCase()];

    if (!account) {
      return { success: false, error: 'No account found with this email.' };
    }

    if (account.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }

    setUser({ name: account.name, email: email.toLowerCase(), role: 'Emergency Coordinator' });
    return { success: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string): { success: boolean; error?: string } => {
    if (!name || !email || !password) {
      return { success: false, error: 'Please fill in all fields.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const accounts = getAccounts();
    const emailLower = email.toLowerCase();

    if (accounts[emailLower]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    accounts[emailLower] = { name, password };
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));

    setUser({ name, email: emailLower, role: 'Emergency Coordinator' });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
