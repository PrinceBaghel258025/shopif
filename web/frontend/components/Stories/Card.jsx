import { useSearchParams } from "react-router-dom";
import {
  STORY_TEMPLATE_QUERY_KEY,
  useStoryTemplate,
  useUpdateStoryTemplate,
} from "../../apiHooks/useStoryTemplate";
import { useProductMetafields } from "../../apiHooks/useThemes";
import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useState } from "react";
import ProductSelector from "./ProductSelector";
import ProductTag from "./ProductTag";
import CardAccordion from "./CardAccordion";
import ProductCard from "./ProductCard";
import StoryPreview from "./StoryPreview";
import DrawerWrapper from "./DrawerWrapper";
import { PRODUCT_LIST_QUERY_KEY } from "../../apiHooks/ApiHooksQueryKeys";

const Card = ({
  index,
  selectedTags,
  availableProducts,
  onSelectProduct,
  onRemoveProduct,
  template,
  onPreview,
  onEdit,
  templateId,
  className = "",
  templateData,
  contents,
  sheetData,
  driverObj,
  products,
  shopifyProductList,
  storyTemplates,
}) => {
  const { mutate: productMetafileds } = useProductMetafields();

  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const tagBg = useColorModeValue("blue.50", "blue.900");
  const tagColor = useColorModeValue("blue.600", "blue.200");
  const queryClient = useQueryClient();

  const modalOptions = useDisclosure();
  const { onOpen } = modalOptions;

  const isMobile = useBreakpointValue({ base: true, lg: false });

  const [publishedIds, setPublishedIds] = useState(
    template?.products?.map((pro) => pro?.id) || []
  );

  const calculateProductChanges = useCallback(() => {
    const publishedProductIds = publishedIds;
    const newSelectedProducts = selectedTags?.map((pro) => pro?.id) || [];

    const filterNewAddedProducts = newSelectedProducts?.filter(
      (pro) => !publishedProductIds?.includes(pro)
    );

    const removedProducts = publishedProductIds?.filter(
      (pro) => !newSelectedProducts?.includes(pro)
    );

    return {
      publishedProductIds,
      newSelectedProducts,
      filterNewAddedProducts,
      removedProducts,
      hasChanges:
        // Modify this condition to consider removal of all products as a change
        removedProducts?.length === publishedProductIds?.length ||
        !publishedProductIds?.every((id) =>
          newSelectedProducts?.includes(id)
        ) ||
        !newSelectedProducts?.every((id) => publishedProductIds?.includes(id)),
    };
  }, [selectedTags, publishedIds]);

  const {
    publishedProductIds,
    newSelectedProducts,
    filterNewAddedProducts,
    removedProducts,
    hasChanges,
  } = calculateProductChanges();

  const {
    mutate: updateStoryTemplate,
    isPending: isUpdatingStoryTemplate,
    isError: isUpdatingStoryTemplateError,
  } = useUpdateStoryTemplate();

  const handleUpdateStoryTemplate = async () => {
    const updatedStoryTemplate = {
      product_ids: selectedTags?.map((product) => product?.id),
    };

    // Added Product List
    const addProductMetaData = selectedTags
      ?.filter((pro) => pro && pro.source_id)
      .map((pro) => ({
        id: Number(pro.source_id),
        story: true,
      }));

    const productList = products?.filter((pro) =>
      publishedIds?.includes(pro?.id)
    );

    const removedProductList = productList?.filter(
      (pro) => !selectedTags?.map((s) => s?.id)?.includes(pro?.id)
    );

    // Removed Product List
    const removeProductMetaData = removedProductList
      ?.filter((pro) => pro && pro.source_id)
      ?.map((pro) => ({
        id: Number(pro?.source_id),
        story: false,
      }));

    const productMetaData = [
      ...(addProductMetaData || []),
      ...(removeProductMetaData || []),
    ];

    updateStoryTemplate(
      { id: template?.id, formData: updatedStoryTemplate },
      {
        onSuccess: () => {
          // Update the publishedIds with the new selection
          setPublishedIds(selectedTags?.map((pro) => pro?.id));

          queryClient.invalidateQueries({
            queryKey: [STORY_TEMPLATE_QUERY_KEY],
          });

          queryClient.invalidateQueries({
            queryKey: [PRODUCT_LIST_QUERY_KEY],
          });

          const isRepublish = publishedIds?.length !== 0;
          toast({
            title:
              selectedTags.length === 0
                ? "Products Removed"
                : isRepublish
                ? "Story Republished"
                : "Story Published",
            description:
              selectedTags.length === 0
                ? "All products have been successfully removed from the story."
                : isRepublish
                ? "Your story has been successfully republished with the updated products."
                : "Your story has been successfully published.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          productMetafileds(productMetaData, {
            onSuccess: () => {
              console.log("Add Meta filed Successfully");

              toast({
                title: "Story Added to Product Page",
                description:
                  "Your story has been successfully added to product page.",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });

              queryClient.invalidateQueries({
                queryKey: ["single-shopify-product"],
              });
            },
            onError: (error) => {
              console.log("Error while adding meta fields", error);

              toast({
                title: "Error while story removing from product page",
                description: error?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
            },
          });
        },

        onError: (error) => {
          console.log("PUBLISH ERROR==>", error);
          toast({
            title: "Operation Failed",
            description:
              "There was an error updating your story. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        },
      }
    );
  };

  const handleRemoveAll = async () => {
    const updatedStoryTemplate = {
      product_ids: [],
    };

    const filterTemplate = storyTemplates
      ?.find((temp) => temp?.id === template?.id)
      ?.products?.map((pro) => pro?.id);

    const productList = products?.filter((pro) =>
      filterTemplate?.includes(pro?.id)
    );

    const removeProductMetaData = productList?.map((pro) => ({
      id: Number(pro?.source_id),
      story: false,
    }));

    updateStoryTemplate(
      { id: template?.id, formData: updatedStoryTemplate },
      {
        onSuccess: () => {
          // Clear publishedIds
          setPublishedIds([]);

          // Clear selected tags by calling onRemoveProduct for each tag
          selectedTags.forEach((product) => {
            onRemoveProduct(template?.id, product);
          });

          queryClient.invalidateQueries({
            queryKey: [STORY_TEMPLATE_QUERY_KEY],
          });

          queryClient.invalidateQueries({
            queryKey: [PRODUCT_LIST_QUERY_KEY],
          });

          toast({
            title: "Products Removed",
            description:
              "All products have been successfully removed from the story.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          productList?.length !== 0 &&
            productMetafileds(removeProductMetaData, {
              onSuccess: () => {
                console.log("Remove Meta filed Successfully");

                toast({
                  title: "Story's Removed from Product Page",
                  description:
                    "Your story's has been successfully removed from product page.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "top-right",
                });
              },
              onError: (error) => {
                console.log("Error while removing meta fields", error);

                toast({
                  title: "Error while story's removing from product page",
                  description: error?.message,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top-right",
                });
              },
            });
        },
        onError: (error) => {
          console.log("ERROR MESSAGE:", error);
          toast({
            title: "Remove All Failed",
            description:
              "There was an error removing products. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        },
      }
    );
  };

  const isRepublishMode = useCallback(() => {
    // If all products were removed from a previously published state
    if (publishedProductIds?.length > 0 && newSelectedProducts?.length === 0) {
      return true;
    }

    // If there are published products and we're adding new ones, it's a republish
    if (publishedProductIds?.length > 0 && filterNewAddedProducts?.length > 0) {
      return true;
    }

    // If all products were removed and new ones added, it's a publish
    if (
      removedProducts?.length === publishedProductIds?.length &&
      filterNewAddedProducts?.length > 0
    ) {
      return false;
    }

    // If there are published products and we're just removing some (not all), it's a republish
    if (
      publishedProductIds?.length > 0 &&
      removedProducts?.length > 0 &&
      removedProducts?.length < publishedProductIds?.length
    ) {
      return true;
    }

    return false;
  }, [
    publishedProductIds,
    newSelectedProducts,
    filterNewAddedProducts,
    removedProducts,
  ]);

  // Check if any products are selected
  const hasSelectedProducts = newSelectedProducts?.length > 0;

  // Determine if the button should be disabled
  const isButtonDisabled =
    // Allow button when all products are removed from a previously published template
    !(publishedIds?.length > 0 && newSelectedProducts?.length === 0) &&
    (!hasSelectedProducts ||
      !hasChanges ||
      (publishedIds?.length !== 0 && selectedTags?.length === 0));

  const buttonText = isRepublishMode() ? "Republish" : "Publish";

  return (
    <>
      <Stack
        bg={templateId === template?.id ? "#f5fffe" : "white"}
        borderRadius="xl"
        borderLeftWidth={4}
        borderLeftColor={
          !isButtonDisabled
            ? "orange"
            : templateId === template?.id
            ? "green"
            : "white"
        }
        className={className}
        onClick={() => {
          searchParams.set("templateId", template?.id);
          setSearchParams(searchParams.toString());

          onPreview(template);
        }}
      >
        <Stack p={3}>
          <HStack justifyContent="space-between">
            <Text size="sm" fontWeight="semibold">
              {template?.name}
            </Text>
            <HStack>
              <Button
                onClick={() => {
                  onEdit(template);
                }}
                fontSize="xs"
                size={"sm"}
                p={2}
                px={4}
              >
                Edit
              </Button>

              <Button
                onClick={() => {
                  isMobile && onOpen();
                }}
                fontSize="xs"
                size={"sm"}
                p={2}
                px={4}
                display={{ base: "flex", lg: "none" }}
              >
                Preview
              </Button>

              <Button
                className="publish-story-btn"
                fontSize="xs"
                p={2}
                px={4}
                isLoading={isUpdatingStoryTemplate}
                onClick={handleUpdateStoryTemplate}
                isDisabled={isButtonDisabled}
                size={"sm"}
              >
                {buttonText}
              </Button>

              <Button
                className="remove-all-btn"
                fontSize="xs"
                p={2}
                px={4}
                isLoading={isUpdatingStoryTemplate}
                onClick={handleRemoveAll}
                isDisabled={selectedTags.length === 0}
                size={"sm"}
              >
                Remove All
              </Button>
            </HStack>
          </HStack>

          <Stack spacing={1}>
            <Box>
              <ProductSelector
                availableProducts={availableProducts}
                onSelect={(product) => onSelectProduct(template?.id, product)}
                isDisabled={availableProducts.length === 0}
                shopifyProductList={shopifyProductList}
              />
            </Box>

            <Stack direction="row" flexWrap="wrap" spacing={2}>
              {selectedTags.map((product) => (
                <ProductTag
                  key={product?.id}
                  tag={product?.name}
                  onRemove={() => onRemoveProduct(template?.id, product)}
                  tagBg={tagBg}
                  tagColor={tagColor}
                  product={product}
                  products={products}
                  shopifyProductList={shopifyProductList}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        {selectedTags?.length !== 0 && (
          <CardAccordion
            label={
              <Text fontWeight={"semibold"}>
                {hasChanges && filterNewAddedProducts?.length !== 0
                  ? "Products"
                  : "Live Products"}
              </Text>
            }
            body={
              <>
                {selectedTags?.map((product) => {
                  return (
                    <ProductCard
                      key={product?.id}
                      product={product}
                      onRemove={() => onRemoveProduct(template?.id, product)}
                      filterNewAddedProducts={filterNewAddedProducts}
                      products={products}
                      shopifyProductList={shopifyProductList}
                      template={template}
                    />
                  );
                })}
              </>
            }
          />
        )}
      </Stack>

      <Stack display={{ base: "flex", lg: "none" }}>
        <DrawerWrapper modalOptions={modalOptions}>
          <StoryPreview
            templateData={templateData}
            contents={contents}
            sheetData={sheetData}
            driverObj={driverObj}
          />
        </DrawerWrapper>
      </Stack>
    </>
  );
};

export default Card;
