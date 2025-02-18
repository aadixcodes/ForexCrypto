'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, removeCookie } from '@/app/utils/cookies';

type AuthContextType = {
  userId: string | null;
  email: string | null;
  isLoading: boolean;
  setAuth: (userId: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  isLoading: true,
  setAuth: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const storedUserId = getCookie('userId');
    const storedEmail = getCookie('userEmail');
    
    if (storedUserId && storedEmail) {
      setUserId(storedUserId);
      setEmail(storedEmail);
    }
    
    setIsLoading(false);
  }, []);

  const setAuth = (userId: string, email: string) => {
    setUserId(userId);
    setEmail(email);
    
    // Store in cookies
    setCookie('userId', userId);
    setCookie('userEmail', email);
  };

  const logout = () => {
    setUserId(null);
    setEmail(null);
    
    // Remove from cookies
    removeCookie('userId');
    removeCookie('userEmail');
  };

  return (
    <AuthContext.Provider value={{ userId, email, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 