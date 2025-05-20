
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { isNativePlatform } from "@/lib/capacitor";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Create a query client instance
const queryClient = new QueryClient();

// Protected route component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    // Redirect to auth page with the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Auth route component to redirect authenticated users
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    // Redirect to the intended destination or default to home
    const destination = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  // Apply mobile-specific styles when running as a native app
  useEffect(() => {
    if (isNativePlatform()) {
      // Add a class to the body element for mobile-specific styling
      document.body.classList.add('native-app');
      
      // Prevent pinch zoom on mobile devices
      document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      });
    }
  }, []);

  return (
    <Routes>
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <React.StrictMode>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" closeButton richColors />
              <AppRoutes />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </React.StrictMode>
    </BrowserRouter>
  );
};

export default App;
