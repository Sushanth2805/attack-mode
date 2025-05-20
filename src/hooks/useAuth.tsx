
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clean up auth state to prevent authentication limbo
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL for error parameters from OAuth redirects
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    if (error) {
      toast.error(`Authentication error: ${errorDescription || error}`);
      // Clear the error from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle authentication events
      if (event === 'SIGNED_IN') {
        toast.success(`Welcome${session?.user?.email ? ` ${session.user.email}` : ''}!`);
        // Use window.location for a full page refresh to ensure clean state
        window.location.href = '/';
      } else if (event === 'SIGNED_OUT') {
        // Use navigate for local navigation
        navigate('/auth');
      } else if (event === 'USER_UPDATED') {
        toast.info('Your profile has been updated');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Auth token refreshed');
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // If we have a session but we're on the auth page, redirect to home
      if (session && window.location.pathname === '/auth') {
        window.location.href = '/';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Logged out successfully");
      
      // Use window.location for a full page refresh on signout
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out");
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
