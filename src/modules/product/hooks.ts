import { useState, useCallback, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "../common/api";
import type { paths } from "@/schema";

type GetProductsQuery = NonNullable<
  paths["/products"]["get"]["parameters"]["query"]
>;

export const useProducts = (query?: GetProductsQuery) => {
  return useQuery({
    queryKey: [
      "products",
      query?.search,
      query?.type,
      query?.sortBy,
      query?.sortOrder,
      query?.minWeight,
      query?.maxWeight,
      query?.minPrice,
      query?.maxPrice,
      query?.limit,
      query?.page,
    ],
    queryFn: async () => {
      const { data, error, response } = await fetchClient.GET("/products", {
        params: { query },
      });

      if (error) {
        throw new Error("Failed to fetch products");
      }

      const totalCount = parseInt(
        response.headers.get("x-total-count") || "0",
        10,
      );
      const totalPages = parseInt(
        response.headers.get("x-total-pages") || "1",
        10,
      );

      return { data, totalCount, totalPages };
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/products/{slug}", {
        params: { path: { slug } },
      });

      if (error) {
        throw new Error("Failed to fetch product");
      }

      return data;
    },
    enabled: !!slug,
  });
};

const SLIDER_DEFAULTS = {
  weightMin: 0,
  weightMax: 2000,
  priceMin: 0,
  priceMax: 2000000,
} as const;

type SliderState = {
  weightMin: number;
  weightMax: number;
  priceMin: number;
  priceMax: number;
};

function parseSlidersFromParams(params: URLSearchParams): SliderState {
  return {
    weightMin: parseInt(params.get("minWeight") || "0", 10),
    weightMax: parseInt(params.get("maxWeight") || "2000", 10),
    priceMin: parseInt(params.get("minPrice") || "0", 10),
    priceMax: parseInt(params.get("maxPrice") || "2000000", 10),
  };
}

type FilterAction =
  | { type: "SET_SLIDER"; name: keyof SliderState; value: number }
  | { type: "RESET_SLIDERS" }
  | { type: "SYNC_FROM_PARAMS"; params: URLSearchParams }
  | { type: "TOGGLE_FILTER_OPEN" }
  | { type: "CLOSE_FILTER" };

type FilterState = SliderState & { isFilterOpen: boolean };

const filterInitialState: FilterState = {
  ...SLIDER_DEFAULTS,
  isFilterOpen: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SLIDER": {
      const { name, value: n } = action;
      let {
        weightMin: weightMin,
        weightMax: weightMax,
        priceMin: priceMin,
        priceMax: priceMax,
      } = state;
      if (name === "weightMin") weightMin = Math.min(n, weightMax - 50);
      else if (name === "weightMax") weightMax = Math.max(n, weightMin + 50);
      else if (name === "priceMin") priceMin = Math.min(n, priceMax - 5000);
      else if (name === "priceMax") priceMax = Math.max(n, priceMin + 5000);
      return {
        ...state,
        weightMin: weightMin,
        weightMax: weightMax,
        priceMin: priceMin,
        priceMax: priceMax,
      };
    }
    case "RESET_SLIDERS":
      return { ...state, ...SLIDER_DEFAULTS };
    case "SYNC_FROM_PARAMS":
      return { ...state, ...parseSlidersFromParams(action.params) };
    case "TOGGLE_FILTER_OPEN":
      return { ...state, isFilterOpen: !state.isFilterOpen };
    case "CLOSE_FILTER":
      return { ...state, isFilterOpen: false };
    default:
      return state;
  }
}

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterState, dispatch] = useReducer(
    filterReducer,
    filterInitialState,
    () => ({
      ...filterInitialState,
      ...parseSlidersFromParams(searchParams),
    }),
  );

  const [prevParams, setPrevParams] = useState(searchParams);
  if (searchParams !== prevParams) {
    setPrevParams(searchParams);
    dispatch({ type: "SYNC_FROM_PARAMS", params: searchParams });
  }

  const handleSliderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "SET_SLIDER",
        name: event.target.name as keyof SliderState,
        value: parseInt(event.target.value, 10),
      });
    },
    [],
  );

  const handleApplyFilter = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newParams = new URLSearchParams();

      const searchVal = searchParams.get("search");
      if (searchVal) newParams.set("search", searchVal);

      const sort = formData.get("sort") as string;
      if (sort) {
        const [sortBy, sortOrder] = sort.split("-");
        if (sortBy) newParams.set("sortBy", sortBy);
        if (sortOrder) newParams.set("sortOrder", sortOrder);
      }

      const types = formData.getAll("type") as string[];
      if (types.length > 0) newParams.set("type", types.join(","));

      const {
        weightMin: weightMin,
        weightMax: weightMax,
        priceMin: priceMin,
        priceMax: priceMax,
      } = filterState;
      if (weightMin !== SLIDER_DEFAULTS.weightMin)
        newParams.set("minWeight", weightMin.toString());
      if (weightMax !== SLIDER_DEFAULTS.weightMax)
        newParams.set("maxWeight", weightMax.toString());
      if (priceMin !== SLIDER_DEFAULTS.priceMin)
        newParams.set("minPrice", priceMin.toString());
      if (priceMax !== SLIDER_DEFAULTS.priceMax)
        newParams.set("maxPrice", priceMax.toString());

      newParams.set("page", "1");
      setSearchParams(newParams);
      dispatch({ type: "CLOSE_FILTER" });
    },
    [searchParams, filterState, setSearchParams],
  );

  const handleResetFilter = useCallback(() => {
    dispatch({ type: "RESET_SLIDERS" });
    const newParams = new URLSearchParams();
    const searchVal = searchParams.get("search");
    if (searchVal) newParams.set("search", searchVal);
    setSearchParams(newParams);
    dispatch({ type: "CLOSE_FILTER" });
  }, [searchParams, setSearchParams]);

  return {
    searchParams,
    setSearchParams,
    sliders: filterState,
    isFilterOpen: filterState.isFilterOpen,
    toggleFilterOpen: () => dispatch({ type: "TOGGLE_FILTER_OPEN" }),
    handleSliderChange,
    handleApplyFilter,
    handleResetFilter,
  };
};
