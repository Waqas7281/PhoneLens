import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { searchHistoryMock } from '../data/mockData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[];
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  mobileId: string;
  mobileFullName: string;
  imageUrl: string;
  detectedBrand: string;
  detectedModel: string;
  confidence: number;
  searchDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addFavorite: (mobileId: string) => void;
  removeFavorite: (mobileId: string) => void;
  isFavorite: (mobileId: string) => boolean;
  searchHistory: SearchHistoryItem[];
  addToHistory: (item: Omit<SearchHistoryItem, 'id' | 'searchDate'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'user@demo.com',
    password: 'Demo1234',
    role: 'user' as const,
    favorites: ['1', '3'],
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'u2',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'Admin1234',
    role: 'admin' as const,
    favorites: ['2', '6'],
    createdAt: '2024-01-01T08:00:00Z',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('phonedetect_user');
    const storedHistory = localStorage.getItem('phonedetect_history');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    } else {
      setSearchHistory(searchHistoryMock);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('phonedetect_user', JSON.stringify(userData));
      const storedHistory = localStorage.getItem(`phonedetect_history_${found.id}`);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      } else {
        setSearchHistory(searchHistoryMock);
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password. Try user@demo.com / Demo1234' };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: 'user',
      favorites: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('phonedetect_user', JSON.stringify(newUser));
    setSearchHistory([]);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setSearchHistory([]);
    localStorage.removeItem('phonedetect_user');
  };

  const addFavorite = (mobileId: string) => {
    if (!user) return;
    const updated = { ...user, favorites: [...user.favorites, mobileId] };
    setUser(updated);
    localStorage.setItem('phonedetect_user', JSON.stringify(updated));
  };

  const removeFavorite = (mobileId: string) => {
    if (!user) return;
    const updated = { ...user, favorites: user.favorites.filter(id => id !== mobileId) };
    setUser(updated);
    localStorage.setItem('phonedetect_user', JSON.stringify(updated));
  };

  const isFavorite = (mobileId: string): boolean => {
    return user?.favorites.includes(mobileId) ?? false;
  };

  const addToHistory = (item: Omit<SearchHistoryItem, 'id' | 'searchDate'>) => {
    const newItem: SearchHistoryItem = {
      ...item,
      id: `h${Date.now()}`,
      searchDate: new Date().toISOString(),
    };
    setSearchHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 20);
      if (user) localStorage.setItem(`phonedetect_history_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, login, register, logout,
      addFavorite, removeFavorite, isFavorite, searchHistory, addToHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
