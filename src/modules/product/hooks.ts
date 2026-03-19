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
  wMin: 0,
  wMax: 2000,
  pMin: 0,
  pMax: 2000000,
} as const;

type SliderState = { wMin: number; wMax: number; pMin: number; pMax: number };

function parseSlidersFromParams(params: URLSearchParams): SliderState {
  return {
    wMin: parseInt(params.get("minWeight") || "0", 10),
    wMax: parseInt(params.get("maxWeight") || "2000", 10),
    pMin: parseInt(params.get("minPrice") || "0", 10),
    pMax: parseInt(params.get("maxPrice") || "2000000", 10),
  };
}

type FilterAction =
  | { type: "SET_SLIDER"; name: keyof SliderState; value: number }
  | { type: "RESET_SLIDERS" }
  | { type: "SYNC_FROM_PARAMS"; params: URLSearchParams }
  | { type: "TOGGLE_FILTER_OPEN" };

type FilterState = SliderState & { isFilterOpen: boolean };

const filterInitialState: FilterState = {
  ...SLIDER_DEFAULTS,
  isFilterOpen: false,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SLIDER": {
      const { name, value: n } = action;
      let { wMin, wMax, pMin, pMax } = state;
      if (name === "wMin") wMin = Math.min(n, wMax - 50);
      else if (name === "wMax") wMax = Math.max(n, wMin + 50);
      else if (name === "pMin") pMin = Math.min(n, pMax - 5000);
      else if (name === "pMax") pMax = Math.max(n, pMin + 5000);
      return { ...state, wMin, wMax, pMin, pMax };
    }
    case "RESET_SLIDERS":
      return { ...state, ...SLIDER_DEFAULTS };
    case "SYNC_FROM_PARAMS":
      return { ...state, ...parseSlidersFromParams(action.params) };
    case "TOGGLE_FILTER_OPEN":
      return { ...state, isFilterOpen: !state.isFilterOpen };
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "SET_SLIDER",
        name: e.target.name as keyof SliderState,
        value: parseInt(e.target.value, 10),
      });
    },
    [],
  );

  const handleApplyFilter = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
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

      const { wMin, wMax, pMin, pMax } = filterState;
      if (wMin !== SLIDER_DEFAULTS.wMin)
        newParams.set("minWeight", wMin.toString());
      if (wMax !== SLIDER_DEFAULTS.wMax)
        newParams.set("maxWeight", wMax.toString());
      if (pMin !== SLIDER_DEFAULTS.pMin)
        newParams.set("minPrice", pMin.toString());
      if (pMax !== SLIDER_DEFAULTS.pMax)
        newParams.set("maxPrice", pMax.toString());

      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, filterState, setSearchParams],
  );

  const handleResetFilter = useCallback(() => {
    dispatch({ type: "RESET_SLIDERS" });
    const newParams = new URLSearchParams();
    const searchVal = searchParams.get("search");
    if (searchVal) newParams.set("search", searchVal);
    setSearchParams(newParams);
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
