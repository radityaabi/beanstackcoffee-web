import { Link } from "react-router-dom";
import {
  EnvelopeSimpleIcon,
  LockKeyIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useRegister } from "@/modules/auth/hooks";
import { useState } from "react";

const Register = () => {
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="bg-card border-b border-border p-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground font-bold text-2xl mb-2 hover:text-primary transition-opacity"
          >
            <img src="/logo.svg" alt="Beanstack" className="w-8 h-8" />
            <span className="tracking-tight">Beanstack Coffee</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Join us for the perfect cup
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Create Account
          </h2>

          {registerMutation.error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {registerMutation.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-foreground mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                  placeholder="johndoe123"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-foreground mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeSimpleIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-foreground mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Min 8 chars, includes uppercase, lowercase & number
              </p>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/90 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
