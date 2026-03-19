import { Link, useLocation } from "react-router-dom";
import { EnvelopeSimpleIcon, LockKeyIcon } from "@phosphor-icons/react";
import { useLogin } from "@/modules/auth/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const Login = () => {
  const loginMutation = useLogin();
  const location = useLocation();
  const successMessage = (location.state as { message?: string })?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Card className="max-w-md w-full shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="text-center border-b border-border p-8">
          <Link
            to="/"
            className="inline-flex justify-center items-center gap-2 text-foreground font-bold text-2xl mb-2 hover:text-primary transition-opacity"
          >
            <img src="/logo.svg" alt="Beanstack" className="w-8 h-8" />
            <span className="tracking-tight">Beanstack Coffee</span>
          </Link>
          <CardDescription className="text-sm">
            Welcome back to your daily brew
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Sign In
          </CardTitle>

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
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeSimpleIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-4 rounded-xl"
              size="lg"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-8 pt-2">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary/90 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
