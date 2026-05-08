import { useState } from "react";
import { FunnelIcon, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useProductFilters } from "@/modules/product/hooks";
import { useCategories } from "@/modules/category/hooks";

export function ProductFilterPanel() {
  const {
    searchParams,
    sliders,
    isFilterOpen,
    toggleFilterOpen,
    handleWeightSliderChange,
    handlePriceSliderChange,
    handleApplyFilter,
    handleResetFilter,
  } = useProductFilters();

  const { data: categories = [] } = useCategories();

  const maxPrice = 2000000;
  const maxWeight = 2000;

  const categoryFilter = searchParams.get("categoryId") || "";
  const categoryArray = categoryFilter ? categoryFilter.split(",") : [];

  const defaultSort = searchParams.get("sortBy")
    ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}`
    : "";
  const [sortValue, setSortValue] = useState(defaultSort);

  const [checkedCategories, setCheckedCategories] =
    useState<string[]>(categoryArray);

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setCheckedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId),
    );
  };

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
          <Field>
            <FieldLabel className="text-foreground text-sm font-medium">
              Urutkan Berdasarkan
            </FieldLabel>
            <Select value={sortValue} onValueChange={setSortValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Paling Relevan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Paling Relevan</SelectItem>
                <SelectItem value="name-asc">Nama: A - Z</SelectItem>
                <SelectItem value="name-desc">Nama: Z - A</SelectItem>
                <SelectItem value="price-asc">Harga: Termurah</SelectItem>
                <SelectItem value="price-desc">Harga: Termahal</SelectItem>
              </SelectContent>
            </Select>
            {/* Hidden input so FormData still picks up the sort value */}
            <input type="hidden" name="sort" value={sortValue} />
          </Field>

          {/* Jenis Kopi */}
          <FieldGroup>
            <FieldLabel className="text-foreground text-sm font-medium">
              Jenis Kopi
            </FieldLabel>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={checkedCategories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(category.id, !!checked)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
            {/* Hidden inputs so FormData picks up checked categories */}
            {checkedCategories.map((categoryId) => (
              <input
                key={categoryId}
                type="hidden"
                name="categoryId"
                value={categoryId}
              />
            ))}
          </FieldGroup>

          {/* Berat (Gram) Dual Slider */}
          <Field>
            <FieldLabel className="text-foreground text-sm font-medium">
              Berat (Gram)
            </FieldLabel>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={sliders.weightMin.toLocaleString("id-ID")}
                  readOnly
                  className="pointer-events-none w-full rounded-md text-sm"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="text"
                  value={sliders.weightMax.toLocaleString("id-ID")}
                  readOnly
                  className="pointer-events-none w-full rounded-md text-sm"
                />
              </div>
              <Slider
                min={0}
                max={maxWeight}
                step={50}
                value={[sliders.weightMin, sliders.weightMax]}
                onValueChange={handleWeightSliderChange}
              />
            </div>
          </Field>

          {/* Harga (Rp) Dual Slider */}
          <Field>
            <FieldLabel className="text-foreground text-sm font-medium">
              Harga (Rp)
            </FieldLabel>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={sliders.priceMin.toLocaleString("id-ID")}
                  readOnly
                  className="pointer-events-none w-full rounded-md text-sm"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="text"
                  value={sliders.priceMax.toLocaleString("id-ID")}
                  readOnly
                  className="pointer-events-none w-full rounded-md text-sm"
                />
              </div>
              <Slider
                min={0}
                max={maxPrice}
                step={5000}
                value={[sliders.priceMin, sliders.priceMax]}
                onValueChange={handlePriceSliderChange}
              />
            </div>
          </Field>

          <Separator />

          <div className="flex flex-col gap-2">
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
