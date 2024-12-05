import { useContext, useEffect } from "react";
import { AuthContext } from "../../services/context";
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";

const AddAppBlock = ({ icon = false }) => {
  const { getShop } = useContext(AuthContext);
  console.log(
    "env var",
    import.meta.env.MODE,
    import.meta.env.SHOPIFY_KODEX_EXTENSION,
    import.meta.env?.VITE_SHOPIFY_KODEX_EXTENSION_ID
  );

  // const appBlockId = "0828473a-1a91-4fa8-a806-7f65c8871ca2";
  const appBlockId = import.meta.env?.VITE_SHOPIFY_KODEX_EXTENSION_ID;
  const extensionHandle = "floating";

  const addExtUrl = `https://${getShop()}/admin/themes/current/editor?template=product&addAppBlockId=${appBlockId}/${extensionHandle}&target=newAppsSection`;

  return (
    <>
      {icon ? (
        <Tooltip
          placement="auto-end"
          aria-label="Add Extension Block"
          label="Add Extension Block, To access story features, ensure that your theme includes an
      extension. Without it, these features won't be visible."
        >
          <a href={addExtUrl} target="_blank" style={{ width: "fit-content" }}>
            <IconButton
              icon={<FiPlusCircle color="green" fontSize={20} />}
              borderRadius={"full"}
              bg={"gray.200"}
            />
          </a>
        </Tooltip>
      ) : (
        <HStack position={"relative"} w={"fit-content"}>
          <a href={addExtUrl} target="_blank" style={{ width: "fit-content" }}>
            <Button px={7} py={5}>
              Add Section
            </Button>
          </a>
        </HStack>
      )}

      <AddAppBlockModal addExtUrl={addExtUrl} />
    </>
  );
};

export default AddAppBlock;

export const AddAppBlockModal = ({ addExtUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Check if the modal has been shown before
    const hasModalBeenShown = localStorage.getItem("appBlockModalShown");

    // If modal hasn't been shown before, open it and mark as shown
    if (!hasModalBeenShown) {
      onOpen();
      localStorage.setItem("appBlockModalShown", "true");
    }
  }, [onOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Extension Block</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            To access story features, ensure that your theme includes an
            extension. Without it, these features won't be visible.
          </Text>
        </ModalBody>

        <ModalFooter>
          <a
            href={addExtUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "fit-content" }}
          >
            <Button colorScheme="blue">Add Section</Button>
          </a>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
