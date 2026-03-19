import React, {
  createContext,
  useContext,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const { data: user, isLoading: isQueryLoading, isFetching } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await fetchClient.GET("/auth/me");
      return data ?? null;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    queryClient.setQueryData(["auth", "me"], null);
    fetchClient.POST("/auth/logout").catch(() => {});
    if (window.location.pathname !== "/login") window.location.href = "/login";
  }, [queryClient]);

  const setTokens = useCallback(
    (accessToken: string, refreshToken: string, userData?: AuthUser) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      if (userData) {
        queryClient.setQueryData(["auth", "me"], userData);
      } else {
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    },
    [queryClient],
  );

  const isLoading = token ? (isQueryLoading || isFetching) : false;

  return (
    <AuthContext.Provider
      value={{ user: user || null, isAuthenticated: !!user, isLoading, setTokens, logout }}
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
