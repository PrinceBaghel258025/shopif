import { useQuery } from "@tanstack/react-query";

export const useGetThemes = () => {
  const query = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const response = await fetch("/api/themes");
      return await response.json();
    },
  });
  return {
    ...query,
  };
};
