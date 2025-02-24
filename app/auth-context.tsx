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
  setAuth: (userId: string, email: string, name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  name: null,
  isLoading: true,
  setAuth: () => {},
  logout: () => {},
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = getCookie('userId');
    const storedEmail = getCookie('userEmail');
    const storedName = getCookie('userName');
    
    if (storedUserId && storedEmail) {
      setUserId(storedUserId);
      setEmail(storedEmail);
      setName(storedName);
    }
    
    setIsLoading(false);
  }, []);

  const setAuth = (userId: string, email: string, name: string) => {
    setUserId(userId);
    setEmail(email);
    setName(name);
    
    setCookie('userId', userId);
    setCookie('userEmail', email);
    setCookie('userName', name);
  };

  const logout = () => {
    setUserId(null);
    setEmail(null);
    setName(null);
    
    removeCookie('userId');
    removeCookie('userEmail');
    removeCookie('userName');
  };

  return (
    <AuthContext.Provider value={{ 
      userId, 
      email, 
      name,
      isLoading, 
      setAuth, 
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 