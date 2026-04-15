import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../common/api";
import type { components } from "@/schema";

export type AuthUser = components["schemas"]["MeResponse"];

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  invalidateAuth: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await fetchClient.GET("/auth/me");
      return data ?? null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(() => {
    fetchClient.POST("/auth/logout").catch(() => {});
    queryClient.setQueryData(["auth", "me"], null);
    if (window.location.pathname !== "/login") navigate("/login");
  }, [queryClient, navigate]);

  const invalidateAuth = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        invalidateAuth,
        logout,
      }}
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
