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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from "@/components/ui/input-group";

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
            <FieldError className="mb-6 p-4 text-center">
              {error.message}
            </FieldError>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <InputGroup className="rounded-xl">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <UserIcon className="h-5 w-5" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="your name"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <InputGroup className="rounded-xl">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <UserIcon className="h-5 w-5" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="your username"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Alamat Email</FieldLabel>
              <InputGroup className="rounded-xl">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <EnvelopeSimpleIcon className="h-5 w-5" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup className="rounded-xl">
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <LockKeyIcon className="h-5 w-5" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Minimal 8 karakter, gunakan kombinasi 1 huruf besar, huruf kecil
                dan angka.
              </FieldDescription>
            </Field>

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
