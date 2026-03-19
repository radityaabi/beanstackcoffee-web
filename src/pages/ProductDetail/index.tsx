import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react";
import { useProduct } from "@/modules/product/hooks";
import { useAddToCart } from "@/modules/cart/hooks";
import { useAuth } from "@/modules/auth/hooks";
import { formatRupiah } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (addedMessage) {
      const timer = setTimeout(() => {
        setAddedMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addedMessage]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          message:
            "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.",
        },
      });
      return;
    }

    if (product) {
      addToCart(
        { productId: product.id, quantity },
        {
          onSuccess: () => {
            setAddedMessage("Berhasil ditambahkan ke keranjang!");
            setQuantity(1);
          },
          onError: () => {
            navigate("/login");
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center grow py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center flex-col items-center grow py-32">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Produk Tidak Ditemukan
        </h2>
        <Link
          to="/products"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <CaretLeftIcon weight="bold" /> Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button
        variant="ghost"
        asChild
        className="mb-8 -ml-4 text-muted-foreground hover:text-primary group"
      >
        <Link to="/products">
          <CaretLeftIcon
            weight="bold"
            className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
          />
          Kembali ke Produk
        </Link>
      </Button>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-background border-b md:border-b-0 md:border-r border-border min-h-[400px]">
            <img
              src={
                product.imageUrl ||
                "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/600x600/"
              }
              alt={product.name}
              className="max-h-[400px] object-contain hover:scale-105 transition duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 uppercase tracking-wider text-primary font-bold"
              >
                {product.type}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-2">
              {product.name}
            </h1>

            <p className="text-xl font-semibold text-primary mb-6">
              {formatRupiah(product.price)}
            </p>

            <div className="prose prose-sm text-muted-foreground mb-8">
              <p>
                {product.description ||
                  `${product.name} pilihan terbaik yang diroast dengan sempurna untuk menghasilkan cita rasa kopi yang luar biasa.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Berat</p>
                <p className="font-semibold text-foreground">
                  {product.weight}g
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Stok</p>
                <p className="font-semibold text-foreground">
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} tersedia`
                    : "Habis"}
                </p>
              </div>
            </div>

            <div className="mt-auto">
              {product.stockQuantity > 0 ? (
                <div className="flex flex-row gap-4">
                  <div className="flex items-center border border-border rounded-md w-32 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="rounded-none rounded-l-md flex-1 h-12 hover:cursor-pointer hover:bg-muted/40"
                      disabled={quantity <= 1 || isAdding}
                    >
                      <MinusIcon weight="bold" className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center font-medium text-foreground">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        product &&
                        quantity < product.stockQuantity &&
                        setQuantity(quantity + 1)
                      }
                      className="rounded-none rounded-r-md flex-1 h-12 hover:cursor-pointer hover:bg-muted/40"
                      disabled={quantity >= product.stockQuantity || isAdding}
                    >
                      <PlusIcon weight="bold" className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 h-12 flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-teal-700 px-0 sm:px-8"
                  >
                    {isAdding ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background"></div>
                    ) : (
                      <ShoppingCartIcon weight="bold" className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">
                      {isAdding ? "Menambahkan..." : "Tambah ke Keranjang"}
                    </span>
                  </Button>
                </div>
              ) : (
                <Button
                  disabled
                  size="lg"
                  variant="secondary"
                  className="w-full h-12"
                >
                  Stok Habis
                </Button>
              )}
            </div>

            {/* Success Message Banner */}
            {addedMessage && (
              <div className="mt-4 p-3 text-emerald-600 rounded-md text-sm text-center animate-in fade-in slide-in-from-bottom-2">
                {addedMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
