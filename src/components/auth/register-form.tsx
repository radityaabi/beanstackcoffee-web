import { Link } from "react-router-dom";
import {
  EnvelopeSimpleIcon,
  LockKeyIcon,
  UserIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@phosphor-icons/react";
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

interface RegisterFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  error: Error | null;
}

export function RegisterForm({ handleSubmit, isPending, error }: RegisterFormProps) {
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
            Mulailah petualangan kopi Anda dengan membuat akun baru.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pb-4">
          <CardTitle className="text-card-foreground mb-6 text-center text-2xl font-bold">
            Daftar Akun Baru
          </CardTitle>

          {error && (
            <div className="text-destructive mb-6 p-4 text-center text-sm">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="rounded-xl bg-white pl-10 focus:bg-amber-50"
                  placeholder="your name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="text-muted-foreground h-5 w-5" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="rounded-xl bg-white pl-10 focus:bg-amber-50"
                  placeholder="your username"
                />
              </div>
            </div>

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
                  minLength={8}
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
              <p className="text-muted-foreground mt-1 pb-1 text-xs">
                Minimal 8 karakter, gunakan kombinasi 1 huruf besar, huruf kecil
                dan angka.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded-xl"
              size="lg"
            >
              {isPending ? "Buat Akun..." : "Buat Akun"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pt-2 pb-8">
          <div className="text-muted-foreground text-center text-sm">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/90 font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
