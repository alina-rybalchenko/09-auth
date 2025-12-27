'use client';

import { useEffect, useState } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuth = await checkSession();
        if (isAuth) {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return null;

  return <>{children}</>;
}

export default AuthProvider;
