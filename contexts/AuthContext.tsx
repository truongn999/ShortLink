import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isPro: boolean | null; // null = đang xác thực
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isPro: null,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('plan_type, plan_active_until, role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      // Check Pro status
      const active =
        data.plan_type === 'pro' &&
        data.plan_active_until &&
        new Date(data.plan_active_until) > new Date();
      setIsPro(active);

      // Check Admin status
      setIsAdmin(data.role === 'admin');
    } else {
      setIsPro(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setIsPro(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setIsPro(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsPro(false);
    setIsAdmin(false);
  };

  const value = { session, user, loading, isPro, isAdmin, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
