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
import { formatRupiah } from "@/lib/utils";

export default function Cart() {
  const { data: cart, isLoading, error } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();

  const totalAmount = cart?.totalPrice ?? 0;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem({ id, payload: { quantity: newQuantity } });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center grow py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Memuat keranjang Anda...</p>
      </div>
    );
  }

  if (error || !cart) {
    return (
      <div className="flex justify-center flex-col items-center grow py-32">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Gagal memuat keranjang
        </h2>
        <p className="text-muted-foreground mb-6">
          Silakan coba lagi beberapa saat.
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-medium transition"
        >
          Ke Beranda
        </Link>
      </div>
    );
  }

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <Link
        to="/products"
        className="inline-flex items-center text-muted-foreground hover:text-primary transition mb-8 group"
      >
        <CaretLeftIcon
          weight="bold"
          className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
        />
        Lanjutkan Belanja
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        Keranjang Belanja
      </h1>

      {hasItems ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Produk</div>
                <div className="col-span-3 text-center">Harga</div>
                <div className="col-span-2 text-center">Jumlah</div>
                <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-y divide-border">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:bg-muted/10 transition"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 bg-background rounded-md border border-border flex items-center justify-center p-2 shrink-0">
                        <img
                          src={
                            item.product?.imageUrl ||
                            "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"
                          }
                          alt={item.product?.name}
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/products/${item.product?.slug}`}
                          className="font-semibold text-foreground hover:text-primary transition line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1 uppercase">
                          {item.product?.type} • {item.product?.weight}g
                        </p>
                        <div className="md:hidden mt-2 font-medium text-primary">
                          {formatRupiah(item.product?.price || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block col-span-3 text-center font-medium text-primary">
                      {formatRupiah(item.product?.price || 0)}
                    </div>

                    <div className="col-span-2 flex md:justify-center items-center">
                      <div className="flex outline outline-border rounded-md bg-background overflow-hidden h-9">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-10 flex items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 text-right mt-2 md:mt-0 absolute md:static top-4 right-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition"
                        title="Hapus item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Ringkasan Belanja
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Harga ({cart.items.length} Barang)</span>
                  <span>{formatRupiah(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground border-b border-border pb-4">
                  <span>Diskon</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg text-foreground">
                    Total Bayar
                  </span>
                  <span className="font-bold text-2xl text-primary">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-md font-medium transition shadow-sm mb-4">
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm p-16 text-center">
          <ShoppingCartIcon
            weight="light"
            className="w-24 h-24 mx-auto text-muted-foreground mb-6 opacity-30"
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Keranjang Anda Masih Kosong
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sepertinya Anda belum menemukan kopi favorit Anda. Mari telusuri
            katalog produk kami.
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-medium transition"
          >
            Mulai Belanja
          </Link>
        </div>
      )}
    </div>
  );
}
