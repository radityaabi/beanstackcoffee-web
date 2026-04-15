import { Link } from "react-router-dom";
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { useProducts } from "@/modules/product/hooks";
import { formatRupiah, getPreviewUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeRoute() {
  const { data: responseData, isLoading } = useProducts({ limit: "4" });
  const productList = Array.isArray(responseData?.data)
    ? responseData.data
    : [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-card py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="mb-10 pr-0 md:mb-0 md:w-1/2 md:pr-10">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Kopi Pilihan Terbaik
            </span>
            <h1 className="text-foreground mt-2 mb-6 text-4xl leading-tight font-bold md:text-5xl">
              Awali Hari dengan Kopi Berkualitas
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Jelajahi koleksi biji kopi Arabica, Robusta, dan Blend premium
              kami. Di-roast dengan sempurna untuk pengalaman ngopi terbaik
              Anda.
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link to="/products">Beli Sekarang</Link>
            </Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800"
              alt="Coffee Pour"
              className="border-background h-96 w-full rounded-xl border-4 object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-foreground mb-8 text-center text-2xl font-bold">
          Produk Terfavorit
        </h2>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {productList.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="border-border group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="border-border/50 relative flex h-40 items-center justify-center border-b bg-white p-2 sm:h-56 sm:p-4">
                  <img
                    src={getPreviewUrl(
                      product.imageUrl ||
                        "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/",
                      "300x300",
                    )}
                    loading="lazy"
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                  <Badge
                    variant="secondary"
                    className="text-primary bg-card/90 pointer-events-none absolute top-2 left-2 z-10 text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm sm:top-3 sm:left-3 sm:text-xs"
                  >
                    {product.type}
                  </Badge>
                </div>
                <div className="flex grow flex-col p-3 sm:p-4">
                  <h3 className="text-foreground line-clamp-2 text-xs font-semibold sm:text-sm">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs">
                    Berat: {product.weight}g
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4">
                    <p className="text-primary text-sm font-bold sm:text-base">
                      {formatRupiah(product.price)}
                    </p>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="hidden h-8 w-8 rounded-full shadow-sm sm:inline-flex sm:h-9 sm:w-9"
                    >
                      <ShoppingCartIcon
                        weight="bold"
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button variant="link" asChild className="group">
            <Link to="/products">
              Lihat Semua Produk
              <ArrowRightIcon
                weight="bold"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
