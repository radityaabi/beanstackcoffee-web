import { useLocation } from "react-router-dom";
import { useLogin } from "@/modules/auth/hooks";
import type { components } from "@/schema";
import { LoginForm } from "@/components/auth/login-form";

export function LoginRoute() {
  const loginMutation = useLogin();
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as components["schemas"]["Login"];
    loginMutation.mutate(payload);
  };

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      isPending={loginMutation.isPending}
      error={loginMutation.error}
      successMessage={successMessage}
    />
  );
}
