import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../common/api";
import type { components } from "@/schema";

export type AuthUser = components["schemas"]["MeResponse"];

type LoginPayload = components["schemas"]["Login"];
type RegisterPayload = components["schemas"]["Register"];

const AUTH_QUERY_KEY = ["auth", "me"] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const { data } = await fetchClient.GET("/auth/me");
      return data ?? null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = () => {
    fetchClient.POST("/auth/logout").catch(() => {});
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    if (window.location.pathname !== "/login") navigate("/login");
  };

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data, error } = await fetchClient.POST("/auth/login", {
        body: payload,
      });

      if (error) {
        const message = (error as { error?: string })?.error;
        throw new Error(message || "Invalid email or password");
      }

      return data;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: AUTH_QUERY_KEY });
      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data, error } = await fetchClient.POST("/auth/register", {
        body: payload,
      });

      if (error) {
        let message =
          (error as { message?: string })?.message ||
          (error as { error?: string })?.error;

        const typedError = error as {
          details?: Array<{ message?: string }> | { message?: string };
        };

        if (
          Array.isArray(typedError.details) &&
          typedError.details.length > 0
        ) {
          message = typedError.details[0]?.message;
        } else if (typedError.details && !Array.isArray(typedError.details)) {
          message = typedError.details.message || message;
        }

        throw new Error(message || "Username or email already exists");
      }

      return data;
    },
    onSuccess: () =>
      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      }),
  });
};
