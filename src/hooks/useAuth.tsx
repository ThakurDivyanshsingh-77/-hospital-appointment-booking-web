import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  apiRequest,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  type AppRole,
  type AuthUser,
} from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiRequest<{ user: AuthUser }>("/auth/me");
        setUser(response.user);
        setRole(response.user.role);
      } catch {
        clearStoredToken();
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(response.token);
      setUser(response.user);
      setRole(response.user.role);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      });
      setStoredToken(response.token);
      setUser(response.user);
      setRole(response.user.role);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    clearStoredToken();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
