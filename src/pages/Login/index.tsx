import { Link, useLocation } from "react-router-dom";
import { EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react";
import { useLogin } from "@/modules/auth/hooks";
import { useState } from "react";

const Login = () => {
  const loginMutation = useLogin();
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


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
            Welcome back to your daily brew
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Sign In
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm text-center">
              {successMessage}
            </div>
          )}

          {loginMutation.error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {loginMutation.error.message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate({ email, password });
            }}
            className="space-y-4"
          >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary/90 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
