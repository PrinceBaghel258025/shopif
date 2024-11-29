import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const ProductSelector = ({
  availableProducts,
  onSelect,
  isDisabled,
  shopifyProductList,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on the search query
  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableProducts, searchQuery]);

  return (
    <Menu
      isOpen={isMenuOpen}
      closeOnSelect={false}
      onClose={() => setIsMenuOpen(false)}
    >
      <MenuButton
        as={Button}
        rightIcon={<FaArrowRight />}
        w="full"
        variant="outline"
        textAlign="left"
        isDisabled={isDisabled}
        fontSize="sm"
        className="products-selector"
        color={"#949494"}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {availableProducts.length > 0
          ? "Search products to link this story..."
          : "No more products available"}
      </MenuButton>

      <MenuList overflow="scroll" maxH="50vh" p={1} overflowY={"scroll"}>
        <HStack
          position="sticky"
          top={0}
          bg="white"
          borderColor="gray.200"
          zIndex={1}
          w={"100%"}
          mb={2}
        >
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            borderRadius={"md"}
          />
        </HStack>

        {/* Display filtered products */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const findActiveProduct = shopifyProductList?.products?.find(
              (pro) => pro?.id === `gid://shopify/Product/${product?.source_id}`
            );
            const isActive = findActiveProduct?.status === "ACTIVE";

            return (
              <MenuItem
                className="first-product-selector"
                key={product.id}
                onClick={() => onSelect(product)}
                _hover={{ bg: "gray.100" }}
                gap={2}
              >
                {shopifyProductList && (
                  <Tooltip
                    label={isActive ? "Active" : "Inactive"}
                    hasArrow
                    placement="top"
                  >
                    <Box
                      w={2}
                      h={2}
                      borderRadius={"full"}
                      bg={isActive ? "#2AFF00" : "gray"}
                    />
                  </Tooltip>
                )}
                {product?.name}
              </MenuItem>
            );
          })
        ) : (
          <Box p={4} textAlign="center" color="gray.500">
            No products found
          </Box>
        )}
      </MenuList>
    </Menu>
  );
};

export default ProductSelector;
