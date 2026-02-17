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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, nickname: string, fullName?: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token helpers
  const getToken = () => localStorage.getItem('institut-biznis-token');
  const setToken = (token: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('institut-biznis-token', token);
    } else {
      sessionStorage.setItem('institut-biznis-token', token);
    }
  };
  const getStoredToken = (): string | null => {
    return localStorage.getItem('institut-biznis-token') || sessionStorage.getItem('institut-biznis-token');
  };
  const removeToken = () => {
    localStorage.removeItem('institut-biznis-token');
    sessionStorage.removeItem('institut-biznis-token');
  };
  const getRememberMe = () => localStorage.getItem('remember-me') === 'true';

  // Fetch user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          // Token expired
          removeToken();
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const userWithRole = {
            ...data.user,
            role: data.user.role || payload.role || 'polaznik'
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

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token with remember me setting
      setToken(data.token, rememberMe);
      if (rememberMe) {
        localStorage.setItem('remember-me', 'true');
      } else {
        localStorage.removeItem('remember-me');
      }

      // Parse token to get role
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const userWithRole = {
        ...data.user,
        role: data.user.role || payload.role || 'polaznik'
      };
      
      setUser(userWithRole);
      localStorage.setItem('institut-biznis-user', JSON.stringify(userWithRole));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, nickname: string, fullName?: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname, fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToken(data.token, true); // New users remember by default
      localStorage.setItem('remember-me', 'true');

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const userWithRole = {
        ...data.user,
        role: data.user.role || payload.role || 'polaznik'
      };
      
      setUser(userWithRole);
      localStorage.setItem('institut-biznis-user', JSON.stringify(userWithRole));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userWithRole = {
          ...data.user,
          role: data.user.role || payload.role || 'polaznik'
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
    localStorage.removeItem('remember-me');
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
