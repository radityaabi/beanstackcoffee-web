import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "../common/api";
import type { components } from "@/schema";

type AddToCartDto = components["schemas"]["AddToCart"];
type UpdateCartItemDto = components["schemas"]["UpdateCartItem"];

export const useCart = (isAuthenticated: boolean = false) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/cart");

      if (error) {
        throw new Error("Failed to fetch cart");
      }

      return data;
    },
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddToCartDto) => {
      const { data, error } = await fetchClient.POST("/cart/items", {
        body: payload,
      });

      if (error) {
        const message = (error as { message?: string })?.message;
        throw new Error(message || "Failed to add to cart");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCartItemDto;
    }) => {
      const { data, error } = await fetchClient.PUT("/cart/items/{id}", {
        params: {
          path: { id },
        },
        body: payload,
      });

      if (error) {
        throw new Error("Failed to update cart item");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await fetchClient.DELETE("/cart/items/{id}", {
        params: {
          path: { id },
        },
      });

      if (error) {
        throw new Error("Failed to remove cart item");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
