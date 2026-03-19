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
    <div className="flex flex-col min-h-screen">
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Nav Links */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center gap-1 group">
                <img
                  src="/logo.svg"
                  alt="Beanstack"
                  className="w-8 h-8 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground group-hover:text-primary transition tracking-tight leading-none">
                    Beanstack
                  </span>
                  <span className="mt-0.1 text-[9px] font-bold text-muted-foreground tracking-[0.3em] group-hover:text-primary/80 transition pl-0.5 text-center">
                    COFFEE
                  </span>
                </div>
              </Link>
              <div className="hidden text-foreground md:flex space-x-6">
                <Link
                  to="/"
                  className={`${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"} hover:text-primary transition font-medium`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`${location.pathname.startsWith("/products") ? "text-foreground" : "text-muted-foreground"} hover:text-primary transition font-medium`}
                >
                  Products
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex grow justify-center px-8">
              <form action="/products" className="w-full max-w-md relative">
                <Input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Cari biji kopi (misal: Gayo)..."
                  className="w-full pl-4 pr-10 rounded-full bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                >
                  <MagnifyingGlassIcon weight="bold" className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Cart & Auth */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="text-muted-foreground hover:text-primary relative"
              >
                <ShoppingCartIcon weight="bold" className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <div className="hidden md:flex space-x-2 border-l border-border pl-4 items-center">
                {isAuthenticated ? (
                  <>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground mr-2">
                      <UserCircleIcon className="w-5 h-5" />
                      {user?.username}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <SignOutIcon className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login" className="text-muted-foreground">
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Auth */}
              <div className="flex md:hidden border-l border-border pl-4 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:text-primary transition outline-none">
                      <UserCircleIcon weight="bold" className="w-6 h-6" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 mt-2">
                    {isAuthenticated ? (
                      <>
                        <DropdownMenuLabel className="font-normal">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <UserCircleIcon className="w-4 h-4" />
                            {user?.username}
                          </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                          <SignOutIcon className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/login" className="cursor-pointer w-full text-foreground">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/register" className="cursor-pointer w-full text-foreground">Register</Link>
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
        <div className="lg:hidden px-4 pb-4">
          <form action="/products" className="w-full relative">
            <Input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Cari biji kopi (misal: Gayo)..."
              className="w-full pl-4 pr-10 rounded-full bg-white"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition"
            >
              <MagnifyingGlassIcon weight="bold" className="w-5 h-5" />
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <span className="text-2xl font-bold text-primary tracking-tight">
                Beanstack
              </span>
              <p className="text-muted-foreground text-sm mt-2">
                Diseduh dengan cinta di Indonesia.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <InstagramLogoIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <XLogoIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <FacebookLogoIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition"
              >
                <TiktokLogoIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; 2026 Beanstack Coffee All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
