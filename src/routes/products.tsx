import { Link, useSearchParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { useProducts } from "@/modules/product/hooks";
import { ProductFilterPanel } from "@/components/product/product-filter-panel";
import { formatRupiah, getPreviewUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { components } from "@/schema";

type Product = components["schemas"]["Product"];

export function ProductsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFilter = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("categoryId") || "";
  const sortByParam = searchParams.get("sortBy") || "";
  const sortOrderParam = searchParams.get("sortOrder") || "";
  const minWeightParam = searchParams.get("minWeight") || "0";
  const maxWeightParam = searchParams.get("maxWeight") || "2000";
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "500000";
  const pageParam = searchParams.get("page") || "1";

  const { data: responseData, isLoading } = useProducts({
    search: searchFilter || undefined,
    categoryId: categoryFilter || undefined,
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
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        {/* Sidebar Filter Section */}
        <ProductFilterPanel />

        {/* Product Grid */}
        <div className="grow">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Menampilkan {products.length} produk{" "}
              {searchFilter && `untuk "${searchFilter}"`}
              {categoryFilter && ` dengan kategori terpilih`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-background border-border rounded-lg border py-20 text-center">
              <MagnifyingGlassIcon className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
              <h3 className="text-foreground text-lg font-medium">
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
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="border-border group flex h-full flex-col overflow-hidden rounded-lg border bg-gray-50 shadow-sm transition hover:shadow-md"
                >
                  <div className="border-border/50 relative flex h-40 items-center justify-center border-b bg-gray-50 p-2 sm:h-56 sm:p-4">
                    <img
                      src={getPreviewUrl(
                        product.imageUrl ||
                          "https://2xm7hdufl9.ucarecdn.net/3cd44a25-d8fc-4d52-a977-fc566af061c2.png",
                        "300x300",
                      )}
                      loading="lazy"
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                    <Badge
                      variant="secondary"
                      className="bg-card/90 text-primary pointer-events-none absolute top-2 left-2 z-10 text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm sm:top-3 sm:left-3 sm:text-xs"
                    >
                      {product.category.name}
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
                        className="hidden h-8 w-8 rounded-full shadow-sm hover:cursor-pointer sm:inline-flex sm:h-9 sm:w-9"
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

          {/* Pagination */}
          {totalPages > 1 && products.length > 0 && !isLoading && (
            <div className="mt-12 mb-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-10 w-10 rounded-full"
              >
                <CaretLeftIcon
                  weight="bold"
                  className="text-muted-foreground h-4 w-4"
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
                      className="h-10 w-10 rounded-full"
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
                className="h-10 w-10 rounded-full"
              >
                <CaretRightIcon
                  weight="bold"
                  className="text-muted-foreground h-4 w-4"
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
