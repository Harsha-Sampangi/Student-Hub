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
import { isFirebaseConfigured } from '@/lib/firebase';

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
    // 1. Check local mock user first
    const savedUser = localStorage.getItem('sh_mock_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as any);
        setLoading(false);
        return;
      } catch (e) {}
    }

    // 2. Listen to Firebase auth changes if configured
    if (isFirebaseConfigured()) {
      const unsubscribe = onAuthChange((firebaseUser) => {
        // If there is a firebase user, use it; otherwise preserve local mock user if active
        if (firebaseUser) {
          setUser(firebaseUser);
        } else if (!localStorage.getItem('sh_mock_user')) {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // 1. Try Firebase Auth first if configured
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignIn(email, password);
        // Remove mock user session on successful Firebase sign-in
        localStorage.removeItem('sh_mock_user');
        return;
      } catch (error: any) {
        console.warn('Firebase Auth sign-in failed, trying local fallback:', error.message);
        // If the error indicates invalid password/email but configuration exists, let it fall through
        // to check if it's the fallback admin account.
      }
    }

    // 2. Local Fallback credentials check
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

    throw new Error('Invalid email or password.');
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem('sh_mock_user');
    setUser(null);
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignOut();
      } catch (e) {}
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
