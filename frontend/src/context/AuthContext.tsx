/**
 * AuthContext.tsx – Frontend Authentication Context for FleetDash
 * Handles user login, signup, and session state via localStorage.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types/fleet';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string, company?: string) => { success: boolean; error?: string };
  logout: () => void;
}

const STORAGE_KEY_USER = 'fleetdash_user';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    // Demo validation
    const newUser: User = {
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'Fleet Dispatcher',
      company: 'LogiTech Logistics',
    };
    setUser(newUser);
    return { success: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string, company?: string) => {
    if (!name || !email || !password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }
    const newUser: User = {
      name,
      email,
      company: company || 'Logistics Inc',
      role: 'Fleet Manager',
    };
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
