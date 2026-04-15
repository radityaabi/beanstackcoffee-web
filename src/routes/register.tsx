import { useRegister } from "@/modules/auth/hooks";
import type { components } from "@/schema";
import { RegisterForm } from "@/components/auth/register-form";

export function RegisterRoute() {
  const registerMutation = useRegister();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData) as components["schemas"]["Register"];
    registerMutation.mutate(payload);
  };

  return (
    <RegisterForm
      handleSubmit={handleSubmit}
      isPending={registerMutation.isPending}
      error={registerMutation.error}
    />
  );
}
