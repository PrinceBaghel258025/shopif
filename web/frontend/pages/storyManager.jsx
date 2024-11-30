import React from "react";
import StoryManagerPage from "../components/StoryManagerPage/StoryManagerPage";
import { Stack } from "@chakra-ui/react";

const StoryManager = () => {
  return (
    <Stack p={3}>
      <StoryManagerPage />
    </Stack>
  );
};

export default StoryManager;
