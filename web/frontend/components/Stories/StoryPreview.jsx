import { HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { MdOutlineTour } from "react-icons/md";
import CarouselComponent from "../ProductStoryVisualizer/CarouselComponent";
import AddAppBlock from "./AddAppBlock";

const StoryPreview = ({ templateData, contents, sheetData, driverObj }) => {
  return (
    <Stack alignItems="center" spacing={0.5}>
      <HStack w={"70%"} alignSelf={"center"} justifyContent={"space-between"}>
        <Text fontSize={"sm"} fontWeight={"semibold"}>
          {templateData && templateData?.name}
        </Text>

        <HStack>
          <AddAppBlock icon />
          <IconButton
            icon={<MdOutlineTour color="blue" fontSize={20} />}
            onClick={() => {
              driverObj.drive();
            }}
            borderRadius={"full"}
            bg={"gray.200"}
          />
        </HStack>
      </HStack>

      <Stack
        className="preview-experience-card"
        w="277.4px"
        h="572.85px"
        borderWidth={5}
        borderColor="black"
        borderRadius={50}
        overflow="hidden"
        boxShadow="lg"
        position="relative"
      >
        {!templateData ? (
          <Stack alignSelf={"center"} mt={250} textAlign={"center"} spacing={0}>
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              Select one of the stories 
            </Text>
            <Text fontWeight={"semibold"} fontSize={"lg"}>
              for a preview
            </Text>
          </Stack>
        ) : (
          <CarouselComponent
            productData={contents || []}
            defaultSheetData={sheetData || []}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default StoryPreview;
