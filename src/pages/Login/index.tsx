import { Link, useLocation } from "react-router-dom";
import {
  EnvelopeSimpleIcon,
  LockKeyIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import { useLogin } from "@/modules/auth/hooks";
import { useState } from "react";
import type { components } from "@/schema";
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
        <CardHeader className="border-border border-b p-8 text-center">
          <Link
            to="/"
            className="text-foreground hover:text-primary mb-2 inline-flex items-center justify-center gap-2 text-2xl font-bold transition-opacity"
          >
            <img src="/logo.svg" alt="Beanstack" className="h-8 w-8" />
            <span className="tracking-tight">Beanstack Coffee</span>
          </Link>
          <CardDescription className="text-sm">
            Selamat datang kembali di sajian minuman harian Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pb-4">
          <CardTitle className="text-card-foreground mb-5 text-center text-2xl font-bold">
            Masuk ke Akun Anda
          </CardTitle>

          {successMessage && (
            <div className="mb-2 p-4 text-center text-sm text-green-600">
              {successMessage}
            </div>
          )}

          {loginMutation.error && (
            <div className="text-destructive mb-6 p-4 text-center text-sm">
              {loginMutation.error.message}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const payload = Object.fromEntries(formData) as components["schemas"]["Login"];
              loginMutation.mutate(payload);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <EnvelopeSimpleIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="rounded-xl bg-white pl-10 focus:bg-amber-50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockKeyIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="rounded-xl bg-white pr-10 pl-10 focus:bg-amber-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="mt-4 w-full rounded-xl"
              size="lg"
            >
              {loginMutation.isPending ? "Masuk ke Akun..." : "Masuk ke Akun"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pt-2 pb-8">
          <div className="text-muted-foreground text-center text-sm">
            Tidak punya akun?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/90 font-semibold hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
