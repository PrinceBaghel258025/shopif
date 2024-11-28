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
import { memo, useMemo, useState } from "react";
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
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {availableProducts.length > 0
          ? "Select products..."
          : "No more products available"}
      </MenuButton>

      <MenuList overflow="scroll" maxH="80vh" p={1}>
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
            borderRadius={"full"}
          />
        </HStack>
        {/* <IconButton
            size="sm"
            variant="ghost"
            onClick={() => setIsMenuOpen(false)}
            icon={<IoClose />}
            position={"absolute"}
            right={-1}
            top={1}
          /> */}

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
                      w={3}
                      h={3}
                      borderRadius={"full"}
                      bg={isActive ? "green" : "gray"}
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
