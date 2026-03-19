import { FunnelIcon, CaretRightIcon } from "@phosphor-icons/react";
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
  const sortOrderParam = searchParams.get("sortOrder") || "";

  return (
    <div className="w-full md:w-64 shrink-0">
      <Button
        type="button"
        variant="outline"
        onClick={toggleFilterOpen}
        className="md:hidden w-full h-14 flex justify-between items-center rounded-lg shadow-sm"
      >
        <span className="flex items-center gap-2">
          <FunnelIcon weight="bold" className="w-5 h-5 text-primary" />
          Filter & Urutkan
        </span>
        <CaretRightIcon
          weight="bold"
          className={`w-5 h-5 text-muted-foreground transition-transform ${isFilterOpen ? "rotate-90" : ""}`}
        />
      </Button>

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
                  value={sliders.wMin.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.wMax.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
              </div>
              <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                <div
                  className="absolute h-1.5 bg-primary rounded-full transition-all"
                  style={{
                    left: `${(sliders.wMin / maxWeight) * 100}%`,
                    right: `${100 - (sliders.wMax / maxWeight) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  name="wMin"
                  min="0"
                  max={maxWeight}
                  value={sliders.wMin}
                  step="50"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
                <input
                  type="range"
                  name="wMax"
                  min="0"
                  max={maxWeight}
                  value={sliders.wMax}
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
                  value={sliders.pMin.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="text"
                  value={sliders.pMax.toLocaleString("id-ID")}
                  readOnly
                  className="w-full border border-border bg-background rounded-md px-3 py-2 text-sm focus:outline-none text-foreground pointer-events-none"
                />
              </div>
              <div className="relative w-full h-1.5 bg-accent rounded-full mt-2">
                <div
                  className="absolute h-1.5 bg-primary rounded-full transition-all"
                  style={{
                    left: `${(sliders.pMin / maxPrice) * 100}%`,
                    right: `${100 - (sliders.pMax / maxPrice) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  name="pMin"
                  min="0"
                  max={maxPrice}
                  value={sliders.pMin}
                  step="5000"
                  onChange={handleSliderChange}
                  className="absolute w-full -top-[5px] appearance-none bg-transparent pointer-events-none custom-slider"
                />
                <input
                  type="range"
                  name="pMax"
                  min="0"
                  max={maxPrice}
                  value={sliders.pMax}
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
