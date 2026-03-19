export { useAuth, AuthProvider, AuthContext } from "./context";
export type { AuthUser } from "./context";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchClient } from "../common/api";
import { useAuth } from "./context";
import type { components } from "@/schema";

type LoginPayload = components["schemas"]["Login"];
type RegisterPayload = components["schemas"]["Register"];

export const useLogin = () => {
  const { setTokens } = useAuth();
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

      if (data) {
        setTokens(data.token, data.refreshToken, data.user as never);
      }
      return data;
    },
    onSuccess: () => navigate("/"),
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
