import { Link, useSearchParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { useProducts } from "@/modules/product/hooks";
import { ProductFilterPanel } from "./components/ProductFilterPanel";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { components } from "@/schema";

type Product = components["schemas"]["Product"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFilter = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "";
  const sortByParam = searchParams.get("sortBy") || "";
  const sortOrderParam = searchParams.get("sortOrder") || "";
  const minWeightParam = searchParams.get("minWeight") || "0";
  const maxWeightParam = searchParams.get("maxWeight") || "2000";
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "500000";
  const pageParam = searchParams.get("page") || "1";

  const { data: responseData, isLoading } = useProducts({
    search: searchFilter || undefined,
    type: typeFilter || undefined,
    minWeight: minWeightParam !== "0" ? minWeightParam : undefined,
    maxWeight: maxWeightParam !== "2000" ? maxWeightParam : undefined,
    minPrice: minPriceParam !== "0" ? minPriceParam : undefined,
    maxPrice: maxPriceParam !== "500000" ? maxPriceParam : undefined,
    sortBy:
      (sortByParam as "name" | "price" | "weight" | "createdAt") || undefined,
    sortOrder: (sortOrderParam as "asc" | "desc") || undefined,
    limit: "12",
    page: pageParam,
  });

  const products: Product[] = Array.isArray(responseData?.data)
    ? responseData.data
    : [];
  const totalPages = responseData?.totalPages || 1;
  const currentPage = parseInt(pageParam, 10);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter Section */}
        <ProductFilterPanel />

        {/* Product Grid */}
        <div className="grow">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              Menampilkan {products.length} produk{" "}
              {searchFilter && `untuk "${searchFilter}"`}
              {typeFilter && ` dengan jenis ${typeFilter}`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-lg border border-border">
              <MagnifyingGlassIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">
                Tidak ada produk
              </h3>
              <p className="text-muted-foreground mt-1">
                Coba ubah kata kunci pencarian atau filter Anda
              </p>
              <Button
                variant="link"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="mt-4"
              >
                Reset semua filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="flex flex-col h-full bg-background rounded-lg shadow-sm hover:shadow-md transition border border-border overflow-hidden group"
                >
                  <div className="relative h-40 sm:h-56 p-2 sm:p-4 flex items-center justify-center bg-background border-b border-border/50">
                    <img
                      src={
                        product.imageUrl ||
                        "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2.png"
                      }
                      loading="lazy"
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[10px] sm:text-xs font-bold bg-card/90 backdrop-blur-sm shadow-sm uppercase pointer-events-none text-primary"
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
                        className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9 rounded-full shadow-sm hover:cursor-pointer"
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

          {/* Pagination */}
          {totalPages > 1 && products.length > 0 && !isLoading && (
            <div className="mt-12 mb-8 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-10 h-10 rounded-full"
              >
                <CaretLeftIcon
                  weight="bold"
                  className="w-4 h-4 text-muted-foreground"
                />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10 rounded-full"
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-10 h-10 rounded-full"
              >
                <CaretRightIcon
                  weight="bold"
                  className="w-4 h-4 text-muted-foreground"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
