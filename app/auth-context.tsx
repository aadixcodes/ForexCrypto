'use client';

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  email: string | null;
  setAuth: (userId: string, email: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  setAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const setAuth = (userId: string, email: string) => {
    setUserId(userId);
    setEmail(email);
  };

  return (
    <AuthContext.Provider value={{ userId, email, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 