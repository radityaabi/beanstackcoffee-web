import { Link } from "react-router-dom";
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { useProducts } from "@/modules/product/hooks";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: responseData, isLoading } = useProducts({ limit: "4" });
  const productList = Array.isArray(responseData?.data)
    ? responseData.data
    : [];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Kopi Pilihan Terbaik
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6 leading-tight text-foreground">
              Awali Hari dengan Kopi Berkualitas
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Jelajahi koleksi biji kopi Arabica, Robusta, dan Blend premium
              kami. Di-roast dengan sempurna untuk pengalaman ngopi terbaik
              Anda.
            </p>
            <Button asChild size="lg" className="text-lg px-8 h-14">
              <Link to="/products">Beli Sekarang</Link>
            </Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800"
              alt="Coffee Pour"
              className="rounded-xl shadow-lg object-cover h-96 w-full border-4 border-background"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
          Produk Terfavorit
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {productList.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="flex flex-col h-full bg-background rounded-lg shadow-sm hover:shadow-md transition border border-border overflow-hidden group"
              >
                <div className="relative h-40 sm:h-56 p-2 sm:p-4 flex items-center justify-center bg-background border-b border-border/50">
                  <img
                    src={
                      product.imageUrl ||
                      "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"
                    }
                    loading="lazy"
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 text-primary sm:top-3 sm:left-3 z-10 text-[10px] sm:text-xs font-bold bg-card/90 backdrop-blur-sm shadow-sm uppercase pointer-events-none"
                  >
                    {product.type}
                  </Badge>
                </div>
                <div className="p-3 sm:p-4 flex flex-col grow">
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    Berat: {product.weight}g
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-3 sm:pt-4">
                    <p className="font-bold text-sm sm:text-base text-primary">
                      {formatRupiah(product.price)}
                    </p>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shadow-sm"
                    >
                      <ShoppingCartIcon
                        weight="bold"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="link" asChild className="group">
            <Link to="/products">
              Lihat Semua Produk
              <ArrowRightIcon
                weight="bold"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
