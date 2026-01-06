import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import {
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
  signOut
} from '../../onboarding/services/auth.service';
import { useUser } from 'expo-superwall';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setOnboarded: (isOnboarded: boolean) => void;
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
    isOnboarded: false,
  });
  const { identify, signOut: superwallSignOut } = useUser();

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
        isOnboarded: true,
      });

      if (user?.id) {
        await identify(user.id);
      }
    } catch (error) {
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        isOnboarded: false,
      });
      await superwallSignOut();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      await superwallSignOut();
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        isOnboarded: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setOnboarded = (isOnboarded: boolean) => {
    setAuthState((prev) => ({ ...prev, isOnboarded }));
  };

  useEffect(() => {
    refreshSession();

    const { data: { subscription } } = onAuthStateChange((event, session) => {

      if (event === 'SIGNED_IN' && session) {
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
          isOnboarded: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          isOnboarded: false,
        });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
          isOnboarded: false,
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
    setOnboarded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
