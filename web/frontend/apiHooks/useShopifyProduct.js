import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../services/context";
import { makeRequest } from "../services/networkRequest";
import { BASE_URL } from "./baseURL";

export const useGetShopifyProducts = () => {
  const query = useQuery({
    queryKey: ["shopify-products"],
    queryFn: async () => {
      const response = await fetch(`/api/products`);
      return await response.json();
    },
  });
  return {
    ...query,
  };
};

export const useGetSingleProduct = (productId) => {
  const query = useQuery({
    queryKey: ["single-shopify-product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      return await response.json();
    },
    enabled: !!productId,
  });
  return {
    ...query,
  };
};

export const useUpdatePublishProductMetaData = () => {
  const { getToken, getShop } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutateFun = async ({ productId, formData }) => {
    try {
      const data = await makeRequest(
        BASE_URL + `kvk/product/${productId}/?shop=${getShop()}`,
        "PATCH",
        getToken(),
        formData
      );
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const mutation = useMutation({
    mutationFn: mutateFun,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [SHOPIFY_HOME_STATS_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Edit error:", error);
    },
  });

  return mutation;
};
