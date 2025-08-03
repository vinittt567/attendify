
'use client';

import { createContext, useContext, ReactNode } from 'react';

// A placeholder user type.
type User = {
  displayName: string;
  photoURL: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Since Firebase is removed, we'll provide a mock user or null.
  // Set loading to false as there's no async auth check.
  const user: User = null; 
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
