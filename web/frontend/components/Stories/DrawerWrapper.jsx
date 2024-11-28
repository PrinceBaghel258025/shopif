import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Stack,
} from "@chakra-ui/react";

const DrawerWrapper = ({ children, modalOptions }) => {
  const { isOpen, onClose } = modalOptions;

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={"sm"}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Stack>{children}</Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerWrapper;
