import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  CaretLeftIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useProduct } from "@/modules/product/hooks";
import { useAddToCart } from "@/modules/cart/hooks";
import { useAuth } from "@/modules/auth/hooks";
import { formatRupiah, getPreviewUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { isAuthenticated } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [displayQuantity, setDisplayQuantity] = useState("1");

  const updateQuantity = (value: number) => {
    setQuantity(value);
    setDisplayQuantity(String(value));
  };

  const navigate = useNavigate();

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
            toast.custom(() => (
              <div className="border-border flex items-center gap-2 rounded-md border bg-white p-2">
                <ShoppingCartIcon className="text-primary size-4" />
                <span className="text-foreground text-sm">
                  Berhasil ditambahkan ke keranjang!
                </span>
              </div>
            ));
            updateQuantity(1);
          },
          onError: () => {
            if (
              error instanceof Error &&
              error.message.includes("Unauthorized")
            ) {
              navigate("/login", {
                state: {
                  message: "Sesi Anda telah habis. Silakan login kembali.",
                },
              });
            } else {
              toast.custom(() => (
                <div className="border-border flex items-center gap-2 rounded-md border bg-white p-2">
                  <XCircleIcon className="text-destructive size-4" />
                  <span className="text-foreground text-sm">
                    Gagal menambahkan ke keranjang.
                  </span>
                </div>
              ));
            }
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex grow flex-col items-center justify-center gap-3 py-32">
        <Spinner className="text-primary size-8" />
        <p className="text-muted-foreground text-sm">Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex grow flex-col items-center justify-center py-32">
        <h2 className="text-foreground mb-4 text-2xl font-bold">
          Produk Tidak Ditemukan
        </h2>
        <Link
          to="/products"
          className="text-primary flex items-center gap-2 hover:underline"
        >
          <CaretLeftIcon weight="bold" /> Kembali ke Daftar Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        asChild
        className="text-muted-foreground hover:text-primary group mb-8 -ml-4"
      >
        <Link to="/products">
          <CaretLeftIcon
            weight="bold"
            className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1"
          />
          Kembali ke Produk
        </Link>
      </Button>

      <div className="border-border overflow-hidden rounded-2xl border bg-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="bg-background border-border flex h-120 items-center justify-center overflow-hidden border-b md:h-auto md:w-1/2 md:border-r md:border-b-0">
            <img
              src={getPreviewUrl(
                product.imageUrl ||
                  "https://2xm7hdufl9.ucarecdn.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/",
                "700x700",
              )}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col p-8 md:w-1/2 md:p-12">
            <div className="mb-2">
              <Badge
                variant="secondary"
                className="text-primary px-3 py-1 font-bold tracking-wider uppercase"
              >
                {product.type}
              </Badge>
            </div>

            <h1 className="text-foreground mt-4 mb-2 text-3xl font-bold md:text-4xl">
              {product.name}
            </h1>

            <p className="text-primary mb-6 text-xl font-semibold">
              {formatRupiah(product.price)}
            </p>

            <div className="prose prose-sm text-muted-foreground mb-8">
              <p>
                {product.description ||
                  `${product.name} pilihan terbaik yang diroast dengan sempurna untuk menghasilkan cita rasa kopi yang luar biasa.`}
              </p>
            </div>

            <div className="border-border mb-8 grid grid-cols-2 gap-4 border-y py-6">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Berat</p>
                <p className="text-foreground font-semibold">
                  {product.weight}g
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Stok</p>
                <p className="text-foreground font-semibold">
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} tersedia`
                    : "Habis"}
                </p>
              </div>
            </div>

            <div className="mt-auto">
              {product.stockQuantity > 0 ? (
                <div className="flex flex-row gap-4">
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        quantity > 1 && updateQuantity(quantity - 1)
                      }
                      className="border-border hover:bg-muted/40 h-12 w-12 rounded-lg bg-white hover:cursor-pointer"
                      disabled={quantity <= 1 || isAdding}
                    >
                      <MinusIcon weight="bold" className="h-4 w-4" />
                    </Button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={displayQuantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          setDisplayQuantity(val);
                        }
                      }}
                      onBlur={() => {
                        const num = parseInt(displayQuantity, 10);
                        if (isNaN(num) || num < 1) {
                          updateQuantity(1);
                        } else if (product && num > product.stockQuantity) {
                          updateQuantity(product.stockQuantity);
                        } else {
                          updateQuantity(num);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur();
                      }}
                      disabled={isAdding}
                      className="text-foreground border-border focus:ring-primary/40 h-12 w-14 [appearance:textfield] rounded-lg border bg-white px-1 text-center font-medium transition outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        product &&
                        quantity < product.stockQuantity &&
                        updateQuantity(quantity + 1)
                      }
                      className="border-border hover:bg-muted/40 h-12 w-12 rounded-lg bg-white hover:cursor-pointer"
                      disabled={quantity >= product.stockQuantity || isAdding}
                    >
                      <PlusIcon weight="bold" className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex h-12 flex-1 items-center justify-center gap-2 px-0 hover:cursor-pointer sm:px-8"
                    variant="default"
                  >
                    {isAdding ? (
                      <div className="border-background h-5 w-5 animate-spin rounded-full border-b-2"></div>
                    ) : (
                      <ShoppingCartIcon weight="bold" className="h-5 w-5" />
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
                  className="h-12 w-full"
                >
                  Stok Habis
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
