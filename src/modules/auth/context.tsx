import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { fetchClient } from "../common/api";
import type { components } from "@/schema";

export type AuthUser = components["schemas"]["MeResponse"];

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    userData?: AuthUser,
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingMe = useRef(false);

  const fetchMe = useCallback(async () => {
    if (isFetchingMe.current) return;
    isFetchingMe.current = true;
    try {
      const { data } = await fetchClient.GET("/auth/me");
      setUser(data ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
      isFetchingMe.current = false;
    }
  }, []);

  // Restore session if a token exists in localStorage
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);

    fetchClient.POST("/auth/logout").catch(() => {});
  }, []);

  // Listen for 401 events dispatched by the fetch interceptor
  useEffect(() => {
    window.addEventListener("auth-unauthorized", logout);
    return () => window.removeEventListener("auth-unauthorized", logout);
  }, [logout]);

  const setTokens = useCallback(
    (accessToken: string, refreshToken: string, userData?: AuthUser) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (userData) {
        setUser(userData);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        fetchMe();
      }
    },
    [fetchMe],
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, setTokens, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
