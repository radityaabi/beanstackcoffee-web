import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "../common/api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/categories");

      if (error) {
        throw new Error("Failed to fetch categories");
      }

      return data;
    },
  });
};
