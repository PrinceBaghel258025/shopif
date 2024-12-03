import React, { useState, useCallback, useEffect } from "react";
import { Stack, Text, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { ProductDriverContext, ProductStoryContext } from "../services/context";
import { useProducts } from "../apiHooks/useProducts";
import { useStoryTemplate } from "../apiHooks/useStoryTemplate";
import {
  filterCarouselTypes,
  handleSavedOrPublishData,
} from "../components/ProductStoryBuilder/storyUtils";
import { useSearchParams } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useGetShopifyProducts } from "../apiHooks/useShopifyProduct";
import AlertDialogBox from "../components/Stories/AlertDialogBox";
import StoryPreview from "../components/Stories/StoryPreview";
import Card from "../components/Stories/Card";

// Main Stories component
const Stories = () => {
  const {
    data: storyTemplates,
    isLoading: isStoryTemplatesLoading,
    isError: isStoryTemplatesError,
  } = useStoryTemplate();

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  const {
    data: shopifyProductList,
    isLoading: isShopifyProductListLoading,
    isError: isShopifyProductListError,
  } = useGetShopifyProducts();

  const [cardSelections, setCardSelections] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  // Initialize card selections when templates load
  React.useEffect(() => {
    if (storyTemplates?.length) {
      console.log("storyTemplates", storyTemplates);
      // story pre-selected products
      // a dict of id and products from storyTemplates
      const storyPreSelectedProducts = {};
      storyTemplates.map((template) => {
        storyPreSelectedProducts[template.id] = template.products;
      });
      setCardSelections(storyPreSelectedProducts);
    }
  }, [storyTemplates]);
  const driverObj = driver({
    steps: [
      {
        element: ".first-story-card",
        popover: {
          title: "Select the product",
          description: "Click here for more details",
          onNextClick: () => {
            const button = document.querySelector(".first-story-card");
            button?.click();
            return false;
          },
        },
      },
      // {
      //   element: ".preview-experience-btn",
      //   popover: {
      //     title: "Preview Experience",
      //     description: "Click to preview the experience",
      //     onNextClick: () => {
      //       const button = document.querySelector(".preview-experience-btn");
      //       button?.click();
      //       return false;
      //     },
      //   },
      // },
      {
        element: ".preview-experience-card",
        popover: {
          title: "Preview Experience",
          description: "Preview the story",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".products-selector",
        popover: {
          title: "Select Products",
          description: "Select the products for the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".products-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".first-product-selector",
        popover: {
          title: "Attach product",
          description: "Click to attach a product to the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".first-product-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".publish-story-btn",
        popover: {
          title: "Publish Story",
          description: "Click to publish the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".publish-story-btn");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },

      {
        element: ".live-products-accordion-btn",
        popover: {
          title: "Publish Story",
          description: "Click to publish the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(
              ".live-products-accordion-btn"
            );
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },

      {
        element: ".live-product-story",
        popover: {
          title: "Live Product Story",
          description: "Published Product Story in theme",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".edit-theme-icon",
        popover: {
          title: "Edit Theme",
          description: "Edit Product Story Theme",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".qr-code",
        popover: {
          title: "QR Code",
          description: "QR code with copy & download link",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".preview-story",
        popover: {
          title: "Preview",
          description: "Preview Story in store",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".on-off-story-switch",
        popover: {
          title: "ON/OFF Story",
          description: "ON/OFF Switch for product",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".remove-product",
        popover: {
          title: "Remove Product",
          description: "Remove Product from Story template",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
    ],
    allowClose: true,
    overlayClickNext: false,
    keyboardControl: false,
    doneBtnText: "Finish",
  });

  useEffect(() => {
    const hasRunBefore = localStorage.getItem("driverHasRun-storyPage");

    if (products?.length === 1 && !hasRunBefore) {
      localStorage.setItem("driverHasRun-storyPage", "true");

      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [products]);

  console.log("cardSelections", cardSelections);

  // Get all selected products across all cards
  const getAllSelectedProducts = useCallback(() => {
    return Object.values(cardSelections).flat();
  }, [cardSelections]);

  // Get available products for any card
  const getAvailableProducts = useCallback(() => {
    if (!products) return [];
    const selectedProducts = getAllSelectedProducts();
    return products.filter(
      (product) =>
        !selectedProducts.some((selected) => selected.id === product.id)
    );
  }, [cardSelections, products]);

  // Handle product selection
  const handleSelectProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = [...prev[templateId], product];
      return newSelections;
    });
  }, []);

  // Handle product removal
  const handleRemoveProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = prev[templateId].filter(
        (p) => p.id !== product.id
      );
      return newSelections;
    });
  }, []);

  // Create a context value object
  const productStoryContextValue = {
    addInfoPoint: () => {},
    removeInfoPoint: () => {},
    getInfoPoints: () => {},
    updateInfoPointText: () => {},
    isDisabled: true,
    styles: {},
    handleStyleChange: () => {},
  };

  const [contents, setContents] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [templateData, setTemplateData] = useState(null);

  if (isStoryTemplatesLoading || isProductsLoading) {
    return (
      <Stack align="center" justify="center" h="100vh">
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </Stack>
    );
  }

  if (isStoryTemplatesError || isProductsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading data. Please try again later.
      </Alert>
    );
  }
  const handlePreview = (template) => {
    console.log("template", template);
    const contents = template?.description?.data;
    const sheetData = template?.description?.general_sheet;

    setTemplateData(template);

    handleSavedOrPublishData(
      template,
      setContents,
      setSheetData,
      filterCarouselTypes,
      template?.name
    );
    console.log("contents", contents);
    console.log("sheetData", sheetData);
    setTimeout(() => {
      driverObj?.moveNext();
    }, 500);
    // setContents(contents);
    // setSheetData(sheetData);
  };

  const handleEdit = (template) => {
    window.location.href = `/storyBuilder?edit=published&templateId=${template?.id}`;
    console.log("template", template);
  };

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <ProductDriverContext.Provider value={{ driver: driverObj }}>
        <AlertDialogBox products={products} />

        <Stack p={5} direction={{ base: "column", lg: "row" }} h={"100dvh"}>
          <Stack
            spacing={3}
            w={{ base: "100%", lg: "70%" }}
            overflowY={"scroll"}
          >
            {storyTemplates
              ?.sort((a, b) => b?.id - a?.id)
              ?.map((template, index) => (
                <Card
                  className="first-story-card"
                  key={template.id}
                  index={index}
                  template={template}
                  selectedTags={cardSelections?.[template?.id] || []}
                  availableProducts={getAvailableProducts()}
                  onSelectProduct={handleSelectProduct}
                  onRemoveProduct={handleRemoveProduct}
                  onPreview={handlePreview}
                  onEdit={handleEdit}
                  templateId={Number(templateId)}
                  templateData={templateData}
                  contents={contents}
                  sheetData={sheetData}
                  driverObj={driverObj}
                  products={products}
                  shopifyProductList={shopifyProductList}
                  storyTemplates={storyTemplates}
                />
              ))}
          </Stack>

          <Stack
            display={{ base: "none", lg: "flex" }}
            w={{ base: "100%", lg: "30%" }}
          >
            <StoryPreview
              templateData={templateData}
              contents={contents}
              sheetData={sheetData}
              driverObj={driverObj}
            />
          </Stack>
        </Stack>
      </ProductDriverContext.Provider>
    </ProductStoryContext.Provider>
  );
};

export default Stories;
