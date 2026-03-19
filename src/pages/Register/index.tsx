import { Link } from "react-router-dom";
import {
  EnvelopeSimpleIcon,
  LockKeyIcon,
  UserIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@phosphor-icons/react";
import { useRegister } from "@/modules/auth/hooks";
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

const Register = () => {
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerMutation.mutate(formData);
  };

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
            Join us for the perfect cup
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold text-card-foreground mb-6 text-center">
            Create Account
          </CardTitle>

          {registerMutation.error && (
            <div className="mb-6 p-4 text-destructive text-sm text-center">
              {registerMutation.error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 rounded-xl bg-white focus:bg-amber-50"
                  placeholder="your username"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 rounded-xl bg-white focus:bg-amber-50"
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
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 rounded-xl bg-white focus:bg-amber-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 pb-1 text-xs text-muted-foreground">
                Min 8 chars, includes uppercase, lowercase & number
              </p>
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full mt-4 rounded-xl"
              size="lg"
            >
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-8 pt-2">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/90 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
