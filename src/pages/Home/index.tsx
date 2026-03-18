import { Link } from "react-router-dom";
import { ArrowRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { useProducts } from "@/modules/products/hooks";
import { formatRupiah } from "@/lib/utils";

export default function Home() {
  const { data: responseData, isLoading } = useProducts({ limit: "4" });
  const productList = Array.isArray(responseData?.data) ? responseData.data : [];

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
            <Link
              to="/products"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md text-lg font-medium transition inline-block shadow-sm"
            >
              Beli Sekarang
            </Link>
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
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[10px] sm:text-xs font-bold text-primary bg-card/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm uppercase">
                    {product.type}
                  </span>
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
                    <button className="text-primary bg-card hover:bg-accent p-1.5 sm:p-2 rounded-full transition shadow-sm">
                      <ShoppingCartIcon weight="bold" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="text-primary font-medium hover:text-primary/80 transition inline-flex items-center gap-1 group"
          >
            Lihat Semua Produk
            <ArrowRightIcon
              weight="bold"
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
