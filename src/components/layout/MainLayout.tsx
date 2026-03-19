import { Link, Outlet, useSearchParams, useLocation } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  InstagramLogoIcon,
  XLogoIcon,
  FacebookLogoIcon,
  TiktokLogoIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useCart } from "@/modules/cart/hooks";
import { useAuth } from "@/modules/auth/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useCart(isAuthenticated);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get("search") || "";

  const totalItems = cart?.items?.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col">
      <nav className="bg-card border-border sticky top-0 z-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Nav Links */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="group flex items-center gap-1">
                <img
                  src="/logo.svg"
                  alt="Beanstack"
                  className="h-8 w-8 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-foreground group-hover:text-primary text-2xl leading-none font-bold tracking-tight transition">
                    Beanstack
                  </span>
                  <span className="mt-0.1 text-muted-foreground group-hover:text-primary/80 pl-0.5 text-center text-[9px] font-bold tracking-[0.3em] transition">
                    COFFEE
                  </span>
                </div>
              </Link>
              <div className="text-foreground hidden space-x-6 md:flex">
                <Link
                  to="/"
                  className={`${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"} hover:text-primary font-medium transition`}
                >
                  Beranda
                </Link>
                <Link
                  to="/products"
                  className={`${location.pathname.startsWith("/products") ? "text-foreground" : "text-muted-foreground"} hover:text-primary font-medium transition`}
                >
                  Semua Produk
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden grow justify-center px-8 lg:flex">
              <form action="/products" className="relative w-full max-w-md">
                <Input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Cari biji kopi (misal: Gayo)..."
                  className="w-full rounded-full bg-white pr-10 pl-4"
                />
                <button
                  type="submit"
                  className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transform transition"
                >
                  <MagnifyingGlassIcon weight="bold" className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Cart & Auth */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="text-muted-foreground hover:text-primary relative"
              >
                <ShoppingCartIcon weight="bold" className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <div className="border-border hidden items-center space-x-2 border-l pl-4 md:flex">
                {isAuthenticated ? (
                  <>
                    <span className="text-foreground mr-2 flex items-center gap-1.5 text-sm font-medium">
                      <UserCircleIcon className="h-5 w-5" />
                      {user?.username}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <SignOutIcon className="mr-1.5 h-4 w-4" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login" className="text-muted-foreground">
                        Masuk
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Daftar</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Auth */}
              <div className="border-border flex items-center border-l pl-4 md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition outline-none">
                      <UserCircleIcon weight="bold" className="h-6 w-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 w-48">
                    {isAuthenticated ? (
                      <>
                        <DropdownMenuLabel className="font-normal">
                          <span className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                            <UserCircleIcon className="h-4 w-4" />
                            {user?.username}
                          </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={logout}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          <SignOutIcon className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/login"
                            className="text-foreground w-full cursor-pointer"
                          >
                            Masuk
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to="/register"
                            className="text-foreground w-full cursor-pointer"
                          >
                            Daftar
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-4 lg:hidden">
          <form action="/products" className="relative w-full">
            <Input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Cari biji kopi (misal: Gayo)..."
              className="w-full rounded-full bg-white pr-10 pl-4"
            />
            <button
              type="submit"
              className="text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 transform transition"
            >
              <MagnifyingGlassIcon weight="bold" className="h-5 w-5" />
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex grow flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-border mt-auto border-t pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 text-center md:mb-0 md:text-left">
              <span className="text-primary text-2xl font-bold tracking-tight">
                Beanstack
              </span>
              <p className="text-muted-foreground mt-2 text-sm">
                Diseduh dengan cinta di Indonesia.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <InstagramLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <XLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FacebookLogoIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <TiktokLogoIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
            &copy; 2026 Beanstack Coffee All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
