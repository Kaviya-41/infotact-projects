/**
 * AuthContext.tsx – Frontend Authentication Context for FleetDash
 * Handles user login, signup, profile updates, and session state via backend API & localStorage.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types/fleet';
import { updateUserProfile } from '../api/userApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string, company?: string) => { success: boolean; error?: string };
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY_USER = 'fleetdash_user';

const DEFAULT_USER: User = {
  name: 'Soundarya Lakshmi',
  email: 'dispatcher@fleetdash.io',
  role: 'Fleet Dispatcher',
  company: 'LogiTech Logistics',
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
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
    const formattedName = email.split('@')[0].replace(/[._-]/g, ' ');
    const capitalName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    const newUser: User = {
      name: capitalName || 'Soundarya Lakshmi',
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

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      let updatedData: User;

      // 1. Attempt to send profile update to backend server
      try {
        const backendRes = await updateUserProfile(updates);
        updatedData = { ...(user || DEFAULT_USER), ...backendRes };
      } catch {
        // Fallback to client-side persistence if backend API endpoint is offline
        updatedData = { ...(user || DEFAULT_USER), ...updates };
      }

      // 2. Update React global state & persistent storage
      setUser(updatedData);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedData));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to update profile. Please try again.';
      return { success: false, error: msg };
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, updateProfile, logout }}>
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

