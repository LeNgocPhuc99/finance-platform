import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const TOKEN_KEY = 'auth_token';

type AuthContextValue = {
  /** true until the persisted session has been read from secure storage */
  isLoading: boolean;
  isSignedIn: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(TOKEN_KEY)
      .then((stored) => {
        if (active) setToken(stored);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (next: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, next);
    setToken(next);
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ isLoading, isSignedIn: token !== null, signIn, signOut }),
    [isLoading, token, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
