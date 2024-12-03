import { useContext } from "react";
import { AuthContext } from "../services/context";
import { makeRequest } from "../services/networkRequest";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./baseURL";

export const SHOPIFY_HOME_STATS_QUERY_KEY = "shopify-home-stats";

export const useShopifyHomePageStats = () => {
  const { getToken, getShop } = useContext(AuthContext);

  const endPoint =
    BASE_URL + `kvk/story_template/stats/?shop_name=` + getShop();

  const query = useQuery({
    queryKey: [SHOPIFY_HOME_STATS_QUERY_KEY],
    queryFn: async () => {
      const statsData = await makeRequest(endPoint, "GET", getToken());
      return statsData;
    },
  });

  return {
    ...query,
  };
};
