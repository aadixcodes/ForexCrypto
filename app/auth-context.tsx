'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie,setCookie,removeCookie } from './utils/cookies';
export const dynamic = "force-dynamic";

type AuthContextType = {
  userId: string | null;
  email: string | null;
  name: string | null;
  isLoading: boolean;
  role: string | null;
  setAuth: (userId: string, email: string, name: string, role: string) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  name: null,
  isLoading: true,
  role: null,
  setAuth: () => {},
  logout: () => {},
  login: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = getCookie('userId');
    const storedEmail = getCookie('userEmail');
    const storedName = getCookie('userName');
    const storedRole = getCookie('userRole');
    
    if (storedUserId && storedEmail) {
      setUserId(storedUserId);
      setEmail(storedEmail);
      setName(storedName);
    }
    
    if (storedRole) setRole(storedRole);
    
    setIsLoading(false);
  }, []);

  const setAuth = (userId: string, email: string, name: string, role: string) => {
    setUserId(userId);
    setEmail(email);
    setName(name);
    setRole(role);
    
    setCookie('userId', userId);
    setCookie('userEmail', email);
    setCookie('userName', name);
    setCookie('userRole', role);
  };

  const logout = () => {
    setUserId(null);
    setEmail(null);
    setName(null);
    setRole(null);
    
    removeCookie('userId');
    removeCookie('userEmail');
    removeCookie('userName');
    removeCookie('userRole');
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    setAuth(data.user.id, data.user.email, data.user.name, data.user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      userId, 
      email, 
      name,
      role,
      isLoading, 
      setAuth, 
      logout,
      login,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 