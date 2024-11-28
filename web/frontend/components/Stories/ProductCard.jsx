import { useEffect, useState } from "react";
import { useGetSingleProduct } from "../../apiHooks/useShopifyProduct";
import { useProductMetafields } from "../../apiHooks/useThemes";
import {
  HStack,
  IconButton,
  Stack,
  Switch,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import QRModal from "./QRModal";
import { MdRemoveCircleOutline } from "react-icons/md";
import EditAndPreviewButton from "./EditAndPreviewButton";

const ProductCard = ({
  product,
  onRemove,
  filterNewAddedProducts,
  products,
  shopifyProductList,
  template,
}) => {
  const { mutate: productMetafileds } = useProductMetafields();

  const isNewProduct = filterNewAddedProducts?.includes(product?.id);

  const productData = products?.find((pro) => pro?.id === product?.id);

  const { data: shopifyProductData } = useGetSingleProduct(
    productData?.source_id
  );

  const metaData = shopifyProductData?.product?.metafields?.edges?.find(
    (meta) => meta?.node?.key === "show_product_story"
  );

  const isMetaData = metaData?.node?.value === "true";
  console.log("templatetemplatetemplatetemplate==>", template);

  const [isPublished, setIsPublished] = useState(false);

  const toast = useToast();

  const findActiveProduct = shopifyProductList?.products?.find(
    (pro) => pro?.id === `gid://shopify/Product/${productData?.source_id}`
  );
  const isActive = findActiveProduct?.status === "ACTIVE";

  // Update isPublished state when publishedIds changes
  useEffect(() => {
    setIsPublished(metaData?.node?.value === "true");
  }, [shopifyProductData]);

  const handleSwitchChange = (e) => {
    const newState = e.target.checked;
    setIsPublished(newState);

    const productMetaData = [
      {
        id: Number(productData?.source_id),
        story: newState,
      },
    ];

    productMetafileds(productMetaData, {
      onSuccess: () => {
        console.log("Add Meta filed Successfully");
        setIsPublished(newState);

        toast({
          title: newState
            ? "Story Added in Product theme"
            : "Story Removed in Product theme",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.log("Error while adding meta fields", error);
        setIsPublished(!newState);
      },
    });
  };

  const productStory = template?.products?.find(
    (pro) => pro?.id === product?.id
  );

  return (
    <HStack
      justifyContent={"space-between"}
      boxShadow={"md"}
      p={1}
      px={3}
      borderRadius={10}
      bg={"gray.100"}
    >
      <HStack>
        <Tooltip
          label={isNewProduct ? "UnPublished" : "Published"}
          hasArrow
          placement="top"
        >
          <Stack
            bg={isNewProduct ? "orange.400" : "green.400"}
            w={3}
            h={3}
            borderRadius={100}
          />
        </Tooltip>
        <Text fontWeight={"semibold"}>
          {product?.name}{" "}
          {shopifyProductList && !isActive && "(Inactive Product)"}
        </Text>
      </HStack>

      <HStack>
        <Switch
          isChecked={isPublished}
          onChange={handleSwitchChange}
          colorScheme="green"
        />

        {isActive && (
          <>
            <EditAndPreviewButton shopifyProductData={shopifyProductData} />

            {!isNewProduct && productStory && (
              <QRModal storyUrl={productStory?.story_url} />
            )}
          </>
        )}
        <IconButton
          icon={<MdRemoveCircleOutline fontSize={24} color="red" />}
          onClick={() => onRemove(product?.id)}
        />
      </HStack>
    </HStack>
  );
};

export default ProductCard;
