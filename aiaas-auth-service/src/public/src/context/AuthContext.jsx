import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import * as authApi from '../api/auth.api';
import * as orgApi from '../api/org.api';

const AuthContext = createContext(null);

/**
 * Decode a JWT payload (without verifying signature).
 */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // decoded JWT payload
  const [activeOrg, setActiveOrg] = useState(null);
  const [loading, setLoading] = useState(true); // hydrating from storage

  // Hydrate on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      const payload = decodeJwtPayload(storedToken);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser(payload);
        if (payload.oid) {
          // fetch active org
          orgApi.getOrg(payload.oid).then(({ data }) => {
            setActiveOrg(data);
          });
        }
      } else {
        // call route /auth/refresh
        authApi.refresh().then(({ data }) => {
          storeTokens(data.token);
          setUser(payload);
        });
      }
    }
    setLoading(false);
  }, []);

  const storeTokens = (tokenPair) => {
    if (tokenPair?.accessToken) {
      localStorage.setItem('access_token', tokenPair.accessToken);
      const payload = decodeJwtPayload(tokenPair.accessToken);
      setUser(payload);
    }
    if (tokenPair?.refreshToken) {
      Cookies.set('refresh_token', tokenPair.refreshToken, {
        expires: 30,           // 30 days
        secure: false,         // true in production (HTTPS)
        sameSite: 'Strict',
      });
    }
  };

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login(email, password);
    storeTokens(data.token);
    return data;
  }, []);

  const register = useCallback(async (email, password, phone) => {
    const { data } = await authApi.register(email, password, phone);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const payload = token ? decodeJwtPayload(token) : null;
      if (payload?.sessionId) {
        await authApi.logout(payload.sessionId);
      }
    } catch {
      // best-effort logout
    } finally {
      localStorage.removeItem('access_token');
      Cookies.remove('refresh_token');
      setUser(null);
    }
  }, []);



  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    storeTokens,
    activeOrg,
    setActiveOrg,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
