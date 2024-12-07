import { useContext, useEffect, useState } from "react";
import {
  useGetSingleProduct,
  useUpdatePublishProductMetaData,
} from "../../apiHooks/useShopifyProduct";
import { useProductMetafields } from "../../apiHooks/useThemes";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import QRModal from "./QRModal";
import EditAndPreviewButton from "./EditAndPreviewButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AuthContext } from "../../services/context";
import { FaRegEye } from "react-icons/fa";
import InfoTooltip from "../Generic/Tooltip";

const ProductCard = ({
  product,
  onRemove,
  filterNewAddedProducts,
  products,
  shopifyProductList,
  template,
}) => {
  const { mutate: productMetafileds } = useProductMetafields();
  const { mutate: updateProductMetaData } = useUpdatePublishProductMetaData();

  const isNewProduct = filterNewAddedProducts?.includes(product?.id);

  const productData = products?.find((pro) => pro?.id === product?.id);

  const { data: shopifyProductData } = useGetSingleProduct(
    productData?.source_id
  );

  const metaData = shopifyProductData?.product?.metafields?.edges?.find(
    (meta) => meta?.node?.key === "show_product_story"
  );

  const isMetaData = metaData?.node?.value === "true";

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

        const updateData = { live_status: newState };

        updateProductMetaData(
          { productId: product?.id, formData: updateData },
          {
            onSuccess: async (data) => {
              await queryClient.invalidateQueries({
                queryKey: [SHOPIFY_HOME_STATS_QUERY_KEY],
              });

              toast({
                title: newState
                  ? "Story Added in Product theme"
                  : "Story Removed in Product theme",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right",
              });

              console.log("Successfully updated metadata in crm", data);
            },
            onError: (error) => {
              console.log(
                "Error While updateing meta data in crm backend: ",
                error
              );
            },
          }
        );
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

  // Theme Preview & Redirect
  const { getShop } = useContext(AuthContext);
  const productSection = "products";

  const previewStoreUrl = `https://${getShop()}/${productSection}/${
    shopifyProductData?.product?.handle
  }`;

  return (
    <HStack
      className="live-product-story"
      justifyContent={"space-between"}
      boxShadow={"md"}
      p={3}
      px={4}
      borderRadius={5}
      bg={"#F0FFFC"}
    >
      <HStack>
        <Tooltip
          label={isNewProduct ? "UnPublished" : "Published"}
          hasArrow
          placement="top"
        >
          <Stack
            bg={isNewProduct ? "orange.400" : "#2AFF00"}
            w={2}
            h={2}
            borderRadius={100}
          />
        </Tooltip>
        <Text fontWeight={"semibold"}>
          {product?.name}{" "}
          {shopifyProductList && !isActive && "(Inactive Product)"}
        </Text>
      </HStack>

      <HStack spacing={5}>
        {isActive && (
          <InfoTooltip text={"Edit Theme"}>
            <EditAndPreviewButton shopifyProductData={shopifyProductData} />
          </InfoTooltip>
        )}

        {/* {isActive && (
          <>
            {!isNewProduct && productStory && ( */}
        <InfoTooltip
          text={
            productData?.story_url
              ? "QR Code"
              : "Publish or Republish to get QR code"
          }
        >
          <QRModal storyUrl={productData?.story_url} />
        </InfoTooltip>
        {/* )}
          </>
        )} */}

        <InfoTooltip text={"Preview"}>
          <a href={previewStoreUrl} target="_blank" className="preview-story">
            <FaRegEye fontSize={22} color="#3688FF" />
          </a>
        </InfoTooltip>

        <InfoTooltip
          text={
            productData?.story_url
              ? "ON/OFF Story"
              : "Publish or Republish to Activate Switch"
          }
        >
          <Switch
            className="on-off-story-switch"
            isChecked={isPublished}
            onChange={handleSwitchChange}
            colorScheme="green"
            isDisabled={!productData?.story_url}
          />
        </InfoTooltip>

        <InfoTooltip text={"Remove"}>
          <DeleteAlertDialog
            onConfirm={() => onRemove(product?.id)}
            productName={product?.name}
          />
        </InfoTooltip>
      </HStack>
    </HStack>
  );
};

export default ProductCard;

const DeleteAlertDialog = ({ onConfirm, productName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <RiDeleteBin6Line
        className="remove-product"
        fontSize={22}
        color="red"
        cursor={"pointer"}
        onClick={() => {
          onOpen();
        }}
      />

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {productName}?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await onConfirm();
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
