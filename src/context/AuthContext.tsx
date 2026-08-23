'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ShippingAddress } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdminMode: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  toggleAdminMode: () => void;
  addAddress: (addr: ShippingAddress) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Sync session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setIsAdminMode(data.user.isAdmin || false);
          } else {
            // Token expired or invalid
            localStorage.removeItem('authToken');
            setUser(null);
          }
        }
      } catch (e) {
        console.error('Error fetching current user:', e);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (!res.ok) {
        return false;
      }

      const { token } = await res.json();
      localStorage.setItem('authToken', token);

      // Fetch user profile
      const userRes = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userRes.ok) {
        const data = await userRes.json();
        setUser(data.user);
        setIsAdminMode(data.user.isAdmin || false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });

      if (!res.ok) {
        return false;
      }

      // Auto login after registration
      return await login(email, pass);
    } catch (e) {
      console.error('Registration error:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdminMode(false);
    localStorage.removeItem('authToken');
  };

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => !prev);
  };

  const addAddress = async (addr: ShippingAddress) => {
    if (!user) return;
    const updatedAddresses = [...(user.addresses || []), addr];
    const updatedUser = {
      ...user,
      addresses: updatedAddresses
    };
    setUser(updatedUser);

    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ addresses: updatedAddresses })
        });
      }
    } catch (e) {
      console.error('Error saving address:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdminMode,
        login,
        register,
        logout,
        toggleAdminMode,
        addAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
