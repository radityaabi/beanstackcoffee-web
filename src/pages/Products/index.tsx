import { Link } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { useProducts, useProductFilters } from "@/modules/products/hooks";
import { formatRupiah } from "@/lib/utils";
import type { components } from "@/schema";

type Product = components["schemas"]["Product"];
const COFFEE_TYPES: Product["type"][] = ["ARABICA", "ROBUSTA", "BLEND"];

export default function Products() {
  const {
    searchParams,
    setSearchParams,
    sliders,
    isFilterOpen,
    toggleFilterOpen,
    handleSliderChange,
    handleApplyFilter,
    handleResetFilter,
  } = useProductFilters();

  const searchFilter = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "";
  const typeArray = typeFilter ? typeFilter.split(",") : [];
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
    sortBy: (sortByParam as "name" | "price" | "weight" | "createdAt") || undefined,
    sortOrder: (sortOrderParam as "asc" | "desc") || undefined,
    limit: "12",
    page: pageParam,
  });

  const products: Product[] = Array.isArray(responseData?.data) ? responseData.data : [];
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
        <div className="w-full md:w-64 shrink-0">
          <button
            type="button"
            onClick={toggleFilterOpen}
            className="md:hidden w-full bg-card border border-border py-3 px-4 rounded-lg flex justify-between items-center text-foreground font-semibold shadow-sm"
          >
            <span className="flex items-center gap-2">
              <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
              Filter & Urutkan
            </span>
            <CaretRightIcon
              weight="bold"
              className={`w-5 h-5 text-muted-foreground transition-transform ${isFilterOpen ? "rotate-90" : ""}`}
            />
          </button>

          <aside
            className={`${isFilterOpen ? "block mt-4" : "hidden"} md:block md:mt-0`}
          >
            <form
              onSubmit={handleApplyFilter}
              onReset={handleResetFilter}
              className="bg-background rounded-lg border border-border p-5 sticky top-24 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg text-foreground">
                  Filter & Urutkan
                </h2>
              </div>

              {/* Urutkan Nama */}
              <div>
                <h3 className="font-medium mb-3 text-sm text-foreground">
                  Urutkan Nama
                </h3>
                <select
                  name="sort_name"
                  defaultValue={sortOrderParam}
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="">Paling Relevan</option>
                  <option value="asc">A - Z</option>
                  <option value="desc">Z - A</option>
                </select>
              </div>

              {/* Jenis Kopi */}
              <div>
                <h3 className="font-medium mb-3 text-sm text-foreground">
                  Jenis Kopi
                </h3>
                <div className="space-y-2">
                  {COFFEE_TYPES.map((type) => (
                    <label key={type} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        name="type"
                        value={type}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 bg-background transition cursor-pointer"
                        defaultChecked={typeArray.includes(type)}
                      />
                      <span className="ml-2 text-muted-foreground group-hover:text-foreground text-sm transition">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Berat (Gram) Dual Slider */}
              <div>
                <h3 className="font-medium mb-3 text-sm text-foreground">
                  Berat (Gram)
                </h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={sliders.wMin}
                      readOnly
                      className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={sliders.wMax}
                      readOnly
                      className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                    />
                  </div>
                  <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                    <div
                      className="absolute h-1.5 bg-primary rounded-full transition-all"
                      style={{
                        left: `${(sliders.wMin / 2000) * 100}%`,
                        right: `${100 - (sliders.wMax / 2000) * 100}%`,
                      }}
                    />
                    <input type="range" name="wMin" min="0" max="2000" value={sliders.wMin} step="50" onChange={handleSliderChange} className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider" />
                    <input type="range" name="wMax" min="0" max="2000" value={sliders.wMax} step="50" onChange={handleSliderChange} className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider" />
                  </div>
                </div>
              </div>

              {/* Harga (Rp) Dual Slider */}
              <div>
                <h3 className="font-medium mb-3 text-sm text-foreground">
                  Harga (Rp)
                </h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={sliders.pMin}
                      readOnly
                      className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                      type="number"
                      value={sliders.pMax}
                      readOnly
                      className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                    />
                  </div>
                  <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                    <div
                      className="absolute h-1.5 bg-primary rounded-full transition-all"
                      style={{
                        left: `${(sliders.pMin / 500000) * 100}%`,
                        right: `${100 - (sliders.pMax / 500000) * 100}%`,
                      }}
                    />
                    <input type="range" name="pMin" min="0" max="500000" value={sliders.pMin} step="5000" onChange={handleSliderChange} className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider" />
                    <input type="range" name="pMax" min="0" max="500000" value={sliders.pMax} step="5000" onChange={handleSliderChange} className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md text-sm transition shadow-sm"
                >
                  Terapkan Filter
                </button>
                <button
                  type="reset"
                  className="w-full py-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground rounded-md text-sm transition bg-background"
                >
                  Reset
                </button>
              </div>
            </form>
          </aside>
        </div>

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
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Reset semua filter
              </button>
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
                      src={product.imageUrl || "https://2xm7hdufl9.ucarecd.net/3cd44a25-d8fc-4d52-a977-fc566af061c2/-/scale_crop/300x300/"}
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

          {/* Pagination */}
          {totalPages > 1 && products.length > 0 && !isLoading && (
            <div className="mt-12 mb-8 flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted hover:border-primary/50 transition-all shadow-sm group"
              >
                <CaretLeftIcon weight="bold" className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all shadow-sm ${
                        isActive
                          ? "bg-primary text-primary-foreground border border-transparent hover:bg-primary/90"
                          : "bg-background border border-border text-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted hover:border-primary/50 transition-all shadow-sm group"
              >
                <CaretRightIcon weight="bold" className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
