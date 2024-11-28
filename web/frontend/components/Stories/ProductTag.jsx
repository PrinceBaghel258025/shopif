import {
  Box,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  Tooltip,
} from "@chakra-ui/react";
import { memo } from "react";

const ProductTag = ({
  tag,
  onRemove,
  tagBg,
  tagColor,
  product,
  products,
  shopifyProductList,
}) => {
  const productData = products?.find((pro) => pro?.id === product?.id);
  const findActiveProduct = shopifyProductList?.products?.find(
    (pro) => pro?.id === `gid://shopify/Product/${productData?.source_id}`
  );
  const isActive = findActiveProduct?.status === "ACTIVE";
  return (
    <Tag
      size="sm"
      borderRadius="full"
      variant="subtle"
      bg={tagBg}
      color={tagColor}
      p={1}
      px={3}
    >
      <HStack>
        {shopifyProductList && (
          <Tooltip
            label={isActive ? "Active" : "Inactive"}
            hasArrow
            placement="top"
          >
            <Box
              w={2.5}
              h={2.5}
              borderRadius={"full"}
              bg={isActive ? "green" : "gray"}
            />
          </Tooltip>
        )}
        <TagLabel>{tag}</TagLabel>
      </HStack>

      <TagCloseButton onClick={() => onRemove(tag)} />
    </Tag>
  );
};

export default ProductTag;
