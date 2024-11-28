import { IconButton, Stack } from "@chakra-ui/react";
import { useState } from "react";
import SphereViewer from "./SphereViewer";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Story from "../Story";
import { useGetStory } from "../apiHooks/useStory";

const FloatingStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shopifyProductData = window.product;
  const productMetafields = window.productMetafields;

  const { data: storyData, isError: isStoryDataError } = useGetStory({
    productId: shopifyProductData?.id,
  });

  const firstStoryData = storyData?.story_data?.data[0]?.data[0];

  return (
    <Stack>
      <Stack position={"fixed"} right={20} bottom={20} zIndex={10}>
        {!isOpen && (
          <Stack
            bg={"white"}
            w={65}
            h={120}
            borderRadius={10}
            onClick={() => setIsOpen(!isOpen)}
            cursor={"pointer"}
            borderWidth={3}
            borderColor={"black"}
            position={"relative"}
            overflow={"hidden"}
          >
            <Stack
              h={2}
              w={15}
              position={"absolute"}
              top={5}
              left={"38%"}
              bg={"black"}
              borderRadius={100}
              zIndex={10}
            >
              <p />
            </Stack>

            <SphereViewer
              type={firstStoryData?.type}
              sourceUrl={firstStoryData?.image_url}
            />

            <Stack
              h={7}
              w={60}
              position={"absolute"}
              bottom={0}
              bg={"lightgray"}
              borderRadius={10}
            >
              <p />
            </Stack>
            <p />
          </Stack>
        )}
      </Stack>

      {isOpen && (
        <Stack position={"fixed"} right={50} bottom={15} zIndex={10}>
          <Stack>
            <IconButton
              icon={<IoIosCloseCircleOutline />}
              onClick={() => setIsOpen(!isOpen)}
              alignSelf={"end"}
              fontSize={30}
            />
          </Stack>

          <Story storyData={storyData} isStoryDataError={isStoryDataError} />
        </Stack>
      )}
    </Stack>
  );
};

export default FloatingStory;
