import { useQuery } from "@tanstack/react-query";

export const useGetSingleProduct = (productId) => {
  const query = useQuery({
    queryKey: ["single-product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      return await response.json();
    },
  });
  return {
    ...query,
  };
};
