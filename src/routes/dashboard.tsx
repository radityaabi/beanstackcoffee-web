import { Link, Navigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  PackageIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeSimpleIcon,
  ArrowRightIcon,
  CoffeeIcon,
  SparkleIcon,
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

function UserAvatar({ name }: { name?: string }) {
  const initials = (name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#54bab9] to-[#3a8a89] text-xl font-bold tracking-tight text-white shadow-lg ring-2 ring-white/60">
      {initials}
    </div>
  );
}

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
      {/* ── Welcome Header ─────────────────────────── */}
      <div className="mb-10 flex items-center gap-5">
        <UserAvatar name={user?.username} />
        <div>
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Selamat datang, {user?.username}!
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
            <SparkleIcon weight="duotone" className="text-primary h-4 w-4" />
            Bergabung sejak {memberSince}
          </p>
        </div>
      </div>

      {/* ── Summary Cards ──────────────────────────── */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Cart card */}
        <Card className="group relative overflow-hidden border-none bg-linear-to-br from-blue-50 to-sky-100/60 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-200/40 transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/20">
              <ShoppingCartIcon
                weight="duotone"
                className="h-6 w-6 text-blue-700"
              />
            </div>
            <div>
              <CardDescription className="text-xs font-medium tracking-wider text-blue-600/70 uppercase">
                Keranjang
              </CardDescription>
              <CardTitle className="text-foreground text-2xl font-extrabold">
                {totalItems} Produk
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <p className="text-muted-foreground text-sm">
              Total&nbsp;
              <span className="font-semibold text-blue-700">
                {formatRupiah(totalPrice)}
              </span>
            </p>
            <Button
              variant="link"
              asChild
              className="group/btn mt-3 h-auto p-0 text-sm font-semibold text-blue-700"
            >
              <Link to="/cart">
                Lihat Keranjang
                <ArrowRightIcon
                  weight="bold"
                  className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1"
                />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Catalog card */}
        <Card className="group relative overflow-hidden border-none bg-linear-to-br from-amber-50 to-orange-100/60 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-200/40 transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 ring-1 ring-amber-600/20">
              <CoffeeIcon weight="duotone" className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <CardDescription className="text-xs font-medium tracking-wider text-amber-600/70 uppercase">
                Katalog
              </CardDescription>
              <CardTitle className="text-foreground text-2xl font-extrabold">
                Produk Kopi
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <p className="text-muted-foreground text-sm">
              Jelajahi koleksi biji kopi premium kami.
            </p>
            <Button
              variant="link"
              asChild
              className="group/btn mt-3 h-auto p-0 text-sm font-semibold text-amber-700"
            >
              <Link to="/products">
                Lihat Semua Produk
                <ArrowRightIcon
                  weight="bold"
                  className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1"
                />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile card */}
        <Card className="group relative overflow-hidden border-none bg-linear-to-br from-emerald-50 to-teal-100/60 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
          <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-200/40 transition-transform duration-500 group-hover:scale-150" />
          <CardHeader className="relative z-10 flex flex-row items-center gap-4 pb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 ring-1 ring-emerald-600/20">
              <UserIcon weight="duotone" className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <CardDescription className="text-xs font-medium tracking-wider text-emerald-600/70 uppercase">
                Akun
              </CardDescription>
              <CardTitle className="text-foreground text-2xl font-extrabold">
                Profil
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-2.5 pt-0">
            <div className="text-muted-foreground flex items-center gap-2.5 text-sm">
              <EnvelopeSimpleIcon className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2.5 text-sm">
              <CalendarIcon className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Bergabung {memberSince}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Cart Items Preview ─────────────────────── */}
      {totalItems > 0 && (
        <Card className="border-border/60 overflow-hidden shadow-md">
          <CardHeader className="border-border/60 from-card to-secondary/30 border-b bg-linear-to-r">
            <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
              <PackageIcon weight="duotone" className="text-primary h-5 w-5" />
              Item di Keranjang
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-border/60 divide-y">
              {cart?.items?.map((item) => (
                <div
                  key={item.id}
                  className="group/item hover:bg-secondary/20 flex items-center justify-between gap-4 px-5 py-4 transition-colors sm:px-6"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="bg-background border-border/60 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border shadow-sm">
                      <img
                        src={
                          item.product?.imageUrl ||
                          "https://2xm7hdufl9.ucarecdn.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"
                        }
                        alt={item.product?.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="text-foreground hover:text-primary block truncate text-sm font-semibold transition"
                        title={item.product.name}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {item.quantity} &times;{" "}
                        {formatRupiah(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-foreground shrink-0 text-right text-sm font-bold tabular-nums">
                    {formatRupiah(item.subTotalPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total bar */}
            <div className="border-border/60 from-card to-secondary/30 flex items-center justify-between border-t bg-linear-to-r px-5 py-4 sm:px-6">
              <span className="text-muted-foreground text-sm font-semibold">
                Total
              </span>
              <span className="text-primary text-xl font-extrabold tabular-nums">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Empty Cart State ───────────────────────── */}
      {totalItems === 0 && (
        <Card className="border-border/60 overflow-hidden shadow-md">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="from-secondary to-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br">
              <ShoppingCartIcon
                weight="duotone"
                className="text-muted-foreground/50 h-10 w-10"
              />
            </div>
            <p className="text-foreground mb-1 text-lg font-semibold">
              Keranjang Masih Kosong
            </p>
            <p className="text-muted-foreground mb-6 max-w-xs text-sm">
              Belum ada produk di keranjang Anda. Ayo temukan kopi favorit Anda!
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 font-semibold shadow-md"
            >
              <Link to="/products">Jelajahi Produk</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
