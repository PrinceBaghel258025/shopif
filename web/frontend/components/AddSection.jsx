import React from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Button, Stack } from "@chakra-ui/react";

//https://admin.shopify.com/store/hellostorexyz/themes/173602373923/editor?template=product&addAppBlockId=483fa771-9c4d-49e4-8c0d-0155f4b872d6/app-stories-block&target=mainSection

const AddSection = () =>
  // { themeId, extensionId }
  {
    const app = useAppBridge();
    console.log("app=>app", app, Redirect);

    const store = "hellostorexyz";
    const themeId = "173602373923";
    const productHandle = "the-collection-snowboard-liquid";
    const productSection = "products";

    const redirectUrl = `${app?.origin}/store/${store}/themes/${themeId}/editor?previewPath=/${productSection}/${productHandle}`;

    return (
      <a href={redirectUrl} target="_blank">
        <Button>Redirect</Button>
      </a>
    );
  };

export default AddSection;
