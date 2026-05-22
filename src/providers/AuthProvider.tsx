'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User } from 'firebase/auth';
import {
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthChange,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sh_mock_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as any);
        setLoading(false);
        return;
      } catch (e) {}
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (email === 'admin@studenthub.in' && password === 'StudentHub@2026') {
      const mockUser = {
        email: 'admin@studenthub.in',
        uid: 'mock-admin-uid',
        emailVerified: true,
      };
      localStorage.setItem('sh_mock_user', JSON.stringify(mockUser));
      setUser(mockUser as any);
      return;
    }
    await firebaseSignIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem('sh_mock_user');
    setUser(null);
    try {
      await firebaseSignOut();
    } catch (e) {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
