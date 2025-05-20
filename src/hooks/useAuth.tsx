
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasShownWelcomeToast, setHasShownWelcomeToast] = useState(false);
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

    // Check if we're in the middle of an OAuth callback
    const isOAuthCallback = url.searchParams.has('access_token') || 
                           url.searchParams.has('error') ||
                           url.searchParams.has('provider');

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle authentication events
      if (event === 'SIGNED_IN') {
        // Show welcome toast only once per session
        if (!hasShownWelcomeToast) {
          toast.success(`Welcome${session?.user?.email ? ` ${session.user.email}` : ''}!`);
          setHasShownWelcomeToast(true);
        }
        
        // If we're not already redirecting and not in an OAuth callback, navigate to home
        if (!isRedirecting && !isOAuthCallback) {
          setIsRedirecting(true);
          // Use a timeout to ensure state is updated before navigation
          setTimeout(() => {
            navigate('/', { replace: true });
            // Reset redirecting flag after a delay
            setTimeout(() => setIsRedirecting(false), 100);
          }, 100);
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth', { replace: true });
        // Reset welcome toast flag on sign out
        setHasShownWelcomeToast(false);
      } else if (event === 'USER_UPDATED') {
        toast.info('Your profile has been updated');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Auth token refreshed');
      }
    });

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // If we have a session but we're on the auth page and not in an OAuth flow
        if (session && window.location.pathname === '/auth' && !isOAuthCallback && !isRedirecting) {
          setIsRedirecting(true);
          // Delay to prevent race conditions
          setTimeout(() => {
            navigate('/', { replace: true });
            // Reset redirecting flag after a delay
            setTimeout(() => setIsRedirecting(false), 100);
          }, 100);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, isRedirecting, hasShownWelcomeToast]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast.success("Logged out successfully");
      
      // Reset welcome toast flag
      setHasShownWelcomeToast(false);
      
      // Navigate to auth page
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
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
