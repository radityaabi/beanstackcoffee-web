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
    <div className="w-full shrink-0 md:w-64">
      {/* Mobile Filter Toggle Button */}
      <Button
        type="button"
        variant="outline"
        onClick={toggleFilterOpen}
        className="bg-background hover:bg-accent hover:text-accent-foreground mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg font-medium transition-colors md:hidden"
      >
        <FunnelIcon weight="bold" className="text-primary h-5 w-5" />
        Filter
      </Button>

      {/* Overlay background for mobile */}
      {isFilterOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleFilterOpen}
        />
      )}

      <aside
        className={`bg-background fixed top-0 right-0 z-50 h-dvh w-[85%] shadow-2xl transition-transform duration-300 ease-in-out sm:w-80 md:static md:z-auto md:h-auto md:w-full md:translate-x-0 md:bg-transparent md:shadow-none ${
          isFilterOpen ? "translate-x-0" : "hidden translate-x-full md:block"
        }`}
      >
        <form
          onSubmit={handleApplyFilter}
          onReset={handleResetFilter}
          className="border-border h-full space-y-6 overflow-y-auto rounded-none border-l bg-white p-5 md:sticky md:top-24 md:overflow-visible md:rounded-lg md:border md:shadow-sm"
        >
          {/* Mobile Header with close button */}
          <div className="mb-2 flex items-center justify-between md:hidden">
            <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold">
              <FunnelIcon weight="bold" className="text-primary h-5 w-5" />
              Filter & Urutkan
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleFilterOpen}
              className="h-8 w-8 rounded-full"
            >
              <X weight="bold" className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop header */}
          <div className="mb-4 hidden items-center gap-2 md:flex">
            <FunnelIcon weight="bold" className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">
              Filter & Urutkan
            </h2>
          </div>

          {/* Urutkan Berdasarkan */}
          <div>
            <h3 className="text-foreground mb-3 text-sm font-medium">
              Urutkan Berdasarkan
            </h3>
            <select
              name="sort"
              defaultValue={
                searchParams.get("sortBy")
                  ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}`
                  : ""
              }
              className="border-border bg-background focus:ring-primary focus:border-primary text-foreground w-full cursor-pointer rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none"
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
            <h3 className="text-foreground mb-3 text-sm font-medium">
              Jenis Kopi
            </h3>
            <div className="space-y-2">
              {COFFEE_TYPES.map((type) => (
                <label
                  key={type}
                  className="group flex cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    name="type"
                    value={type}
                    className="border-border text-primary focus:ring-primary bg-background h-4 w-4 cursor-pointer rounded transition"
                    defaultChecked={typeArray.includes(type)}
                  />
                  <span className="text-muted-foreground group-hover:text-foreground ml-2 text-sm transition">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Berat (Gram) Dual Slider */}
          <div>
            <h3 className="text-foreground mb-3 text-sm font-medium">
              Berat (Gram)
            </h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sliders.weightMin.toLocaleString("id-ID")}
                  readOnly
                  className="border-border bg-background text-foreground pointer-events-none w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.weightMax.toLocaleString("id-ID")}
                  readOnly
                  className="border-border bg-background text-foreground pointer-events-none w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="bg-accent relative mt-2 h-1.5 w-full rounded-full">
                <div
                  className="bg-primary absolute h-1.5 rounded-full transition-all"
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
                  className="custom-slider pointer-events-none absolute -top-1.25 w-full appearance-none bg-transparent"
                />
                <input
                  type="range"
                  name="weightMax"
                  min="0"
                  max={maxWeight}
                  value={sliders.weightMax}
                  step="50"
                  onChange={handleSliderChange}
                  className="custom-slider pointer-events-none absolute -top-1.25 w-full appearance-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Harga (Rp) Dual Slider */}
          <div>
            <h3 className="text-foreground mb-3 text-sm font-medium">
              Harga (Rp)
            </h3>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sliders.priceMin.toLocaleString("id-ID")}
                  readOnly
                  className="border-border bg-background text-foreground pointer-events-none w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.priceMax.toLocaleString("id-ID")}
                  readOnly
                  className="border-border bg-background text-foreground pointer-events-none w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="bg-accent relative mt-2 h-1.5 w-full rounded-full">
                <div
                  className="bg-primary absolute h-1.5 rounded-full transition-all"
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
                  className="custom-slider pointer-events-none absolute -top-1.25 w-full appearance-none bg-transparent"
                />
                <input
                  type="range"
                  name="priceMax"
                  min="0"
                  max={maxPrice}
                  value={sliders.priceMax}
                  step="5000"
                  onChange={handleSliderChange}
                  className="custom-slider pointer-events-none absolute -top-1.25 w-full appearance-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-border flex flex-col gap-2 border-t pt-4">
            <Button
              type="submit"
              variant="default"
              className="w-full cursor-pointer"
            >
              Terapkan Filter
            </Button>
            <Button
              type="reset"
              variant="outline"
              className="w-full cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
