'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

type AuthContextType = {
  userId: string | null;
  email: string | null;
  role: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  email: null,
  role: null,
  isLoading: false,
  login: () => Promise.resolve(),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Update state with user data
      setUserId(data.user.id);
      setEmail(data.user.email);
      setRole(data.user.role);
      console.log(data.user);
      // Redirect based on role
      if (data.user.role === "admin") {
        console.log("admin");
        router.push('/admin');
      } else {
        console.log("user")
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserId(null);
    setEmail(null);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, email, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 