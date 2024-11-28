import { Image } from "@chakra-ui/react";
import React from "react";

export const BrandBanner = ({ data }) => {
  const brandBanner = data?.find((info) => info.type === "brand_banner");

  return (
    <>
      {brandBanner?.data[0]?.image_url && brandBanner?.isActive ? (
        <Image
          src={brandBanner?.data[0]?.image_url}
          height="6rem"
          width="100%"
          position="absolute"
          top={0}
          left={0}
          zIndex={10}
          pointerEvents={"none"}
        />
      ) : null}
    </>
  );
};
