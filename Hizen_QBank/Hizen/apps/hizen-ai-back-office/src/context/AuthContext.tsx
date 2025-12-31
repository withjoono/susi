import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn as apiSignIn, SignInResponse } from '../api/api';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: Date | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  checkTokenExpiry: () => boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedExpiresAt = localStorage.getItem('expiresAt');

    if (storedToken && storedExpiresAt) {
      const expirationDate = new Date(storedExpiresAt);
      const now = new Date();

      console.log('=== Page Load Token Check ===');
      console.log('Current time:', now.toISOString());
      console.log('Token expires at:', expirationDate.toISOString());
      console.log('Is token expired?', now >= expirationDate);
      console.log('==============================');

      // Check if token is still valid
      if (expirationDate > now) {
        console.log('Token is valid, restoring session');
        setToken(storedToken);
        setExpiresAt(expirationDate);
        setIsAuthenticated(true);
      } else {
        // Token expired, clear storage
        console.log('Stored token was expired - clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
      }
    } else {
      console.log('No stored token found');
    }

    // 테스트를 위해 임시로
    // setIsAuthenticated(true);

    setLoading(false);
  }, []);

  // Handle authentication-based routing
  useEffect(() => {
    if (loading) return; // Don't redirect while still loading

    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect_url');

    // If on signin page and authenticated, redirect to home or redirect_url
    if (currentPath === '/auth/signin' && isAuthenticated) {
      const targetUrl = redirectUrl || '/';
      console.log(`Already authenticated, redirecting to: ${targetUrl}`);
      navigate(targetUrl, { replace: true });
      return;
    }

    // If not on auth pages and not authenticated, redirect to signin with current path
    if (!currentPath.startsWith('/auth') && !isAuthenticated) {
      const signInUrl = `/auth/signin?redirect_url=${encodeURIComponent(
        currentPath,
      )}`;
      console.log(`Not authenticated, redirecting to: ${signInUrl}`);
      navigate(signInUrl, { replace: true });
      return;
    }
  }, [isAuthenticated, loading, location, navigate]);

  // Check token expiry function
  const checkTokenExpiry = () => {
    if (!expiresAt) return true; // If no expiry date, consider expired

    const now = new Date();
    const isExpired = now >= expiresAt;

    if (isExpired) {
      console.log('Token has expired, logging out');
      signOut();
      return true;
    }
    return false;
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response: SignInResponse = await apiSignIn(email, password);

      // Console log the token
      console.log('Login successful! Token:', response.token);
      console.log('Token expires at:', response.expiresAt);

      const expirationDate = new Date(response.expiresAt);

      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('expiresAt', response.expiresAt);

      // Update state
      setToken(response.token);
      setExpiresAt(expirationDate);
      setIsAuthenticated(true);
    } catch (error) {
      // Clear any partial state
      signOut();
      throw error;
    }
  };

  const signOut = () => {
    console.log('Signing out - clearing token and localStorage');

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');

    // Clear state
    setToken(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    expiresAt,
    signIn,
    signOut,
    loading,
    checkTokenExpiry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
