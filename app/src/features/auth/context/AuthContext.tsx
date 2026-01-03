import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  signOut
} from '../../onboarding/services/auth.service';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshSession = async () => {
    try {
      const [session, user] = await Promise.all([
        getCurrentSession(),
        getCurrentUser(),
      ]);

      setAuthState({
        user,
        session,
        isLoading: false,
        isAuthenticated: !!session && !!user,
      });
    } catch (error) {
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    refreshSession();

    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session) {
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    ...authState,
    signOut: handleSignOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
