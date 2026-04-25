import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  CaretLeftIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import {
  useCart,
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/modules/cart/hooks";
import { useAuth } from "@/modules/auth/hooks";
import { formatRupiah } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function CartRoute() {
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading, error } = useCart(isAuthenticated);
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [displayQuantities, setDisplayQuantities] = useState<
    Record<string, string>
  >({});

  const getDisplayQuantity = (itemId: string, quantity: number) =>
    displayQuantities[itemId] ?? String(quantity);

  const setDisplayQuantity = (itemId: string, value: string) =>
    setDisplayQuantities((prev) => ({ ...prev, [itemId]: value }));

  const totalAmount = cart?.totalPrice ?? 0;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return setItemToDelete(id);
    updateItem({ id, payload: { quantity: newQuantity } });
    setDisplayQuantities((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex grow flex-col items-center justify-center py-32">
        <div className="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground">Memuat keranjang Anda...</p>
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className="flex grow flex-col items-center justify-center py-32">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          Gagal memuat keranjang
        </h2>
        <p className="text-muted-foreground mb-6">
          Silakan coba lagi beberapa saat.
        </p>
        <Button asChild>
          <Link to="/">Ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
          Lanjutkan Belanja
        </Link>
      </Button>

      <h1 className="text-foreground mb-8 text-3xl font-bold">
        Keranjang Belanja
      </h1>

      {hasItems ? (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            <div className="border-border overflow-hidden rounded-xl border bg-gray-50 shadow-sm">
              <div className="border-border bg-muted/50 text-muted-foreground hidden grid-cols-12 gap-4 border-b p-4 text-sm font-medium md:grid">
                <div className="col-span-6">Produk</div>
                <div className="col-span-3 text-center">Subtotal</div>
                <div className="col-span-2 text-center">Jumlah</div>
                <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-border divide-y">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="hover:bg-muted/10 relative flex flex-col gap-4 p-4 transition md:grid md:grid-cols-12 md:items-center"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="bg-background border-border flex h-20 w-20 shrink-0 items-center justify-center rounded-md border p-2">
                        <img
                          src={
                            item.product?.imageUrl ||
                            "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"
                          }
                          alt={item.product?.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div className="pr-14 md:pr-0">
                        <Link
                          to={`/products/${item.product?.slug}`}
                          className="text-foreground hover:text-primary line-clamp-2 font-semibold transition"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-muted-foreground mt-1 text-xs uppercase">
                          {item.product?.category?.name} • {item.product?.weight}g
                        </p>
                        <p className="text-primary mt-1 text-sm font-medium">
                          {formatRupiah(item.product?.price || 0)}
                        </p>
                        <div className="text-foreground mt-1 text-sm font-semibold md:hidden">
                          Subtotal: {formatRupiah(item.subTotalPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="text-foreground col-span-3 hidden text-center font-semibold md:block">
                      {formatRupiah(item.subTotalPrice)}
                    </div>

                    <div className="col-span-2 flex items-center md:justify-center">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="border-border hover:bg-muted/30 h-9 w-9 rounded-lg bg-white hover:cursor-pointer"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </Button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={getDisplayQuantity(item.id, item.quantity)}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*$/.test(val)) {
                              setDisplayQuantity(item.id, val);
                            }
                          }}
                          onBlur={() => {
                            const raw = getDisplayQuantity(
                              item.id,
                              item.quantity,
                            );
                            const num = parseInt(raw, 10);
                            const maxQty =
                              item.product?.stockQuantity ?? Infinity;
                            if (isNaN(num) || num < 1) {
                              handleUpdateQuantity(item.id, 1);
                              setDisplayQuantity(item.id, "1");
                            } else if (num > maxQty) {
                              handleUpdateQuantity(item.id, maxQty);
                              setDisplayQuantity(item.id, String(maxQty));
                            } else {
                              handleUpdateQuantity(item.id, num);
                              setDisplayQuantity(item.id, String(num));
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter")
                              event.currentTarget.blur();
                          }}
                          className="border-border focus:ring-primary/40 h-9 w-12 [appearance:textfield] rounded-lg border bg-white px-1 text-center text-sm font-medium transition outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >=
                            (item.product?.stockQuantity ?? Infinity)
                          }
                          className="border-border hover:bg-muted/30 h-9 w-9 rounded-lg bg-white hover:cursor-pointer"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 col-span-1 mt-2 text-right md:static md:mt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemToDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full hover:cursor-pointer"
                        title="Hapus item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="border-border sticky top-24 rounded-xl border bg-gray-50 p-6 shadow-sm">
              <h2 className="text-foreground mb-6 text-xl font-bold">
                Ringkasan Belanja
              </h2>

              <div className="mb-6 space-y-4">
                <div className="text-muted-foreground flex justify-between">
                  <span>Total Harga ({cart.items.length} Barang)</span>
                  <span>{formatRupiah(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-foreground text-lg font-bold">
                    Total Bayar
                  </span>
                  <span className="text-primary text-2xl font-bold">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="mb-4 w-full hover:cursor-pointer hover:bg-teal-700"
              >
                Lanjut ke Pembayaran
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border-border rounded-xl border p-16 text-center shadow-sm">
          <ShoppingCartIcon
            weight="light"
            className="text-muted-foreground mx-auto mb-6 h-24 w-24 opacity-30"
          />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Keranjang Anda Masih Kosong
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-md">
            Sepertinya Anda belum menemukan kopi favorit Anda. Mari telusuri
            katalog produk kami.
          </p>
          <Button asChild size="lg" className="mt-4 px-8">
            <Link to="/products">Mulai Belanja</Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="text-foreground font-semibold">
                {cart?.items?.find((i) => i.id === itemToDelete)?.product
                  ?.name || "ini"}
              </span>{" "}
              dari keranjang belanja Anda?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive hover:cursor-pointer"
              onClick={() => {
                if (itemToDelete) {
                  removeItem(itemToDelete);
                  setItemToDelete(null);
                }
              }}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
