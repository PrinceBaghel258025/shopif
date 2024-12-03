import React, { useContext } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Button, HStack } from "@chakra-ui/react";
import { useGetThemes } from "../../apiHooks/useThemes";
import { AuthContext } from "../../services/context";
import { FaRegEye } from "react-icons/fa";
import SpreadIcon from "../../assets/Icon/SpreadIcon";

//https://admin.shopify.com/store/hellostorexyz/themes/173602373923/editor?template=product&addAppBlockId=483fa771-9c4d-49e4-8c0d-0155f4b872d6/app-stories-block&target=mainSection

const EditAndPreviewButton = ({ shopifyProductData }) => {
  const app = useAppBridge();

  const { getShop } = useContext(AuthContext);

  const { data: themeData } = useGetThemes();

  const currentTheme = themeData?.find((theme) => theme?.role === "MAIN");

  const store = getShop()?.split(".")[0]; //"hellostorexyz"
  const themeId = currentTheme?.id.split("/").pop(); // "173602373923"
  const productHandle = shopifyProductData?.product?.handle; // "the-collection-snowboard-liquid"
  const productSection = "products";

  const redirectUrl = `${app?.origin}/store/${store}/themes/${themeId}/editor?previewPath=/${productSection}/${productHandle}`;

  //https://hellostorexyz.myshopify.com/products/the-collection-snowboard-liquid
  const previewStoreUrl = `https://${getShop()}/${productSection}/${
    shopifyProductData?.product?.handle
  }`;

  if (!productHandle) return;

  return (
    <HStack>
      <a href={redirectUrl} target="_blank" className="edit-theme-icon">
        <SpreadIcon />
      </a>

      {/* <a href={previewStoreUrl} target="_blank">
        <FaRegEye fontSize={22} color="#3688FF" />
      </a> */}
    </HStack>
  );
};

export default EditAndPreviewButton;
