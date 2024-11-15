import React from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Button, Stack } from "@chakra-ui/react";

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
      <Stack>
        <a href={redirectUrl} target="_blank">
          <Button>Redirect</Button>
        </a>
      </Stack>
    );
  };

export default AddSection;
