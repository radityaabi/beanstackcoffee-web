import { FunnelIcon, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/modules/product/hooks";
import type { components } from "@/schema";

type Product = components["schemas"]["Product"];
const COFFEE_TYPES: Product["type"][] = ["ARABICA", "ROBUSTA", "BLEND"];

export function ProductFilterPanel() {
  const {
    searchParams,
    sliders,
    isFilterOpen,
    toggleFilterOpen,
    handleSliderChange,
    handleApplyFilter,
    handleResetFilter,
  } = useProductFilters();

  const maxPrice = 2000000;
  const maxWeight = 2000;

  const typeFilter = searchParams.get("type") || "";
  const typeArray = typeFilter ? typeFilter.split(",") : [];

  return (
    <div className="w-full md:w-64 shrink-0">
      {/* Mobile Filter Toggle Button */}
      <Button
        type="button"
        variant="outline"
        onClick={toggleFilterOpen}
        className="md:hidden w-full h-12 flex items-center justify-center gap-2 mb-2 rounded-lg bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
        Filter
      </Button>

      {/* Overlay background for mobile */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={toggleFilterOpen}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-dvh w-[85%] sm:w-80 bg-background shadow-2xl transition-transform duration-300 ease-in-out md:static md:z-auto md:h-auto md:w-full md:bg-transparent md:shadow-none md:translate-x-0 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full hidden md:block"
        }`}
      >
        <form
          onSubmit={handleApplyFilter}
          onReset={handleResetFilter}
          className="h-full overflow-y-auto md:overflow-visible bg-background rounded-none md:rounded-lg border-l md:border border-border p-5 md:sticky md:top-24 md:shadow-sm space-y-6"
        >
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between mb-2 md:hidden">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
              Filter & Urutkan
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleFilterOpen}
              className="h-8 w-8 rounded-full"
            >
              <X weight="bold" className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex items-center gap-2 mb-4">
            <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg text-foreground">
              Filter & Urutkan
            </h2>
          </div>

          {/* Urutkan Berdasarkan */}
          <div>
            <h3 className="font-medium mb-3 text-sm text-foreground">
              Urutkan Berdasarkan
            </h3>
            <select
              name="sort"
              defaultValue={
                searchParams.get("sortBy")
                  ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}`
                  : ""
              }
              className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground cursor-pointer"
            >
              <option value="">Paling Relevan</option>
              <option value="name-asc">Nama: A - Z</option>
              <option value="name-desc">Nama: Z - A</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Termahal</option>
            </select>
          </div>

          {/* Jenis Kopi */}
          <div>
            <h3 className="font-medium mb-3 text-sm text-foreground">
              Jenis Kopi
            </h3>
            <div className="space-y-2">
              {COFFEE_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center group cursor-pointer"
                >
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
                  type="text"
                  value={sliders.weightMin.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.weightMax.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
              </div>
              <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                <div
                  className="absolute h-1.5 bg-primary rounded-full transition-all"
                  style={{
                    left: `${(sliders.weightMin / maxWeight) * 100}%`,
                    right: `${100 - (sliders.weightMax / maxWeight) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  name="weightMin"
                  min="0"
                  max={maxWeight}
                  value={sliders.weightMin}
                  step="50"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
                <input
                  type="range"
                  name="weightMax"
                  min="0"
                  max={maxWeight}
                  value={sliders.weightMax}
                  step="50"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
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
                  type="text"
                  value={sliders.priceMin.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.priceMax.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
              </div>
              <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                <div
                  className="absolute h-1.5 bg-primary rounded-full transition-all"
                  style={{
                    left: `${(sliders.priceMin / maxPrice) * 100}%`,
                    right: `${100 - (sliders.priceMax / maxPrice) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  name="priceMin"
                  min="0"
                  max={maxPrice}
                  value={sliders.priceMin}
                  step="5000"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
                <input
                  type="range"
                  name="priceMax"
                  min="0"
                  max={maxPrice}
                  value={sliders.priceMax}
                  step="5000"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Terapkan Filter
            </Button>
            <Button type="reset" variant="outline" className="w-full">
              Reset
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
