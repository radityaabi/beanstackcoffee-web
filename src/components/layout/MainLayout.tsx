import { Link, Outlet, useSearchParams } from "react-router-dom";
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

export function MainLayout() {
  const { data: cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
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
                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition tracking-tight">
                  Beanstack.
                </span>
              </Link>
              <div className="hidden text-foreground md:flex space-x-6">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition font-medium"
                >
                  Products
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex grow justify-center px-8">
              <form action="/products" className="w-full max-w-md relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Cari biji kopi (misal: Gayo)..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-shadow shadow-sm text-foreground"
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
                    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <UserCircleIcon className="w-5 h-5" />
                      {user?.username}
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive px-3 py-2 text-sm font-medium transition"
                    >
                      <SignOutIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <form action="/products" className="w-full relative">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Cari biji kopi (misal: Gayo)..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-shadow shadow-sm text-foreground"
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
                Beanstack.
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
            &copy; 2026 Beanstack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
