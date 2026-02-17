'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nickname: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  industry?: string;
  yearsExperience?: number;
  rankLevel: number;
  xpPoints: number;
  role: string;
  verified: boolean;
  verificationStatus: string;
  subscriptionStatus: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, fullName?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('institut-biznis-token');
  const setToken = (token: string) => localStorage.setItem('institut-biznis-token', token);
  const removeToken = () => localStorage.removeItem('institut-biznis-token');

  // Fetch user on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Fallback: dodaj rolu iz token-a ako nije u response-u
          const userWithRole = {
            ...data.user,
            role: data.user.role || (() => {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.role || 'polaznik';
              } catch (e) {
                return 'polaznik';
              }
            })()
          };
          setUser(userWithRole);
        } else {
          removeToken();
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setToken(data.token);
    // Dodaj rolu u user object iz token-a ako nije u response-u
    const userWithRole = {
      ...data.user,
      role: data.user.role || data.token ? (() => {
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          return payload.role || 'polaznik';
        } catch (e) {
          return 'polaznik';
        }
      })() : 'polaznik'
    };
    setUser(userWithRole);
    localStorage.setItem('institut-biznis-user', JSON.stringify(userWithRole));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, nickname: string, fullName?: string) => {
    setIsLoading(true);
    
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname, fullName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setToken(data.token);
    // Dodaj rolu u user object
    const userWithRole = {
      ...data.user,
      role: data.user.role || 'polaznik'
    };
    setUser(userWithRole);
    localStorage.setItem('institut-biznis-user', JSON.stringify(userWithRole));
    setIsLoading(false);
  };

  const fetchUser = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userWithRole = {
          ...data.user,
          role: data.user.role || 'polaznik'
        };
        setUser(userWithRole);
        localStorage.setItem('institut-biznis-user', JSON.stringify(userWithRole));
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem('institut-biznis-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, fetchUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
