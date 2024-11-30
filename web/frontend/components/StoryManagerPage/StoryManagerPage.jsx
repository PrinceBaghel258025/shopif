import { HStack, Stack, Switch, Text } from "@chakra-ui/react";
import React from "react";

const StoryManagerPage = () => {
  return (
    <HStack alignItems={"start"} w={"80%"} alignSelf={"center"} mt={"2%"}>
      <Stack w={"65%"}>
        <PageCard />
        <PageCard />
        <PageCard />
        <PageCard />
        <PageCard />
        <PageCard />
      </Stack>

      <Stack
        w={"35%"}
        borderWidth={2}
        borderColor={"red"}
        p={2}
        borderRadius={10}
      >
        <StorySectionCard story={"floating"} />
        <StorySectionCard story={"Carousel"} />
        <StorySectionCard story={"Tag"} />
      </Stack>
    </HStack>
  );
};

export default StoryManagerPage;

const PageCard = () => {
  return (
    <Stack bg={"wheat"} borderRadius={5} h={"80px"}>
      <Text>Card</Text>
    </Stack>
  );
};

const StorySectionCard = ({ story }) => {
  return (
    <HStack borderRadius={5} bg={"wheat"} p={3} justify={"space-between"}>
      <Text>{story}</Text>

      <Switch />
    </HStack>
  );
};
