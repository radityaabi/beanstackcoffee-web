import { Link, Navigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  PackageIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeSimpleIcon,
  ArrowRightIcon,
  CoffeeIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/hooks";
import { useCart } from "@/modules/cart/hooks";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function DashboardRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: cart } = useCart(isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const totalItems = cart?.items?.length ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Selamat datang, {user?.username}!
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Ini adalah ringkasan akun dan aktivitas belanja Anda.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border overflow-hidden bg-gray-50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="bg-blue-100 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <ShoppingCartIcon weight="duotone" className="text-blue-700 h-5 w-5" />
            </div>
            <div>
              <CardDescription className="text-xs">Keranjang</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {totalItems} Produk
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm">
              {totalItems} item &middot;{" "}
              <span className="text-primary font-semibold">
                {formatRupiah(totalPrice)}
              </span>
            </p>
            <Button variant="link" asChild className="group mt-2 h-auto p-0 text-sm">
              <Link to="/cart">
                Lihat Keranjang
                <ArrowRightIcon weight="bold" className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border overflow-hidden bg-gray-50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <CoffeeIcon weight="duotone" className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <CardDescription className="text-xs">Katalog</CardDescription>
              <CardTitle className="text-2xl font-bold">Produk</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm">
              Jelajahi koleksi biji kopi premium kami.
            </p>
            <Button variant="link" asChild className="group mt-2 h-auto p-0 text-sm">
              <Link to="/products">
                Lihat Semua Produk
                <ArrowRightIcon weight="bold" className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border overflow-hidden bg-gray-50 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <UserIcon weight="duotone" className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <CardDescription className="text-xs">Akun</CardDescription>
              <CardTitle className="text-2xl font-bold">Profil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <EnvelopeSimpleIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span>Bergabung {memberSince}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart items preview */}
      {totalItems > 0 && (
        <Card className="border-border bg-gray-50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageIcon weight="duotone" className="text-muted-foreground h-5 w-5" />
              Item di Keranjang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-border divide-y">
              {cart?.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-background border-border flex h-12 w-12 shrink-0 items-center justify-center rounded-md border p-1 shadow-sm">
                      <img
                        src={
                          item.product?.imageUrl ||
                          "https://2xm7hdufl9.ucarecdn.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"
                        }
                        alt={item.product?.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="text-foreground hover:text-primary block truncate text-sm font-medium transition"
                        title={item.product.name}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {item.quantity} &times; {formatRupiah(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-foreground shrink-0 text-right text-sm font-semibold">
                    {formatRupiah(item.subTotalPrice)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground text-sm font-medium">Total</span>
              <span className="text-primary text-lg font-bold">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty cart state */}
      {totalItems === 0 && (
        <Card className="border-border bg-gray-50 shadow-sm">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <ShoppingCartIcon weight="duotone" className="text-muted-foreground/40 mb-4 h-16 w-16" />
            <p className="text-muted-foreground mb-4 text-sm">
              Keranjang Anda masih kosong. Ayo mulai belanja!
            </p>
            <Button asChild>
              <Link to="/products">Jelajahi Produk</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
