import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../services/context";

const AlertDialogBox = ({ products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    if (products?.length === 0) {
      onOpen();
    }
  }, [products]);

  const { getShop } = useContext(AuthContext);

  const store = getShop()?.split(".")[0];

  const addProductUrl = `https://admin.shopify.com/store/${store}/products`;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Continue with Adding Product
          </AlertDialogHeader>

          <AlertDialogBody>
            Please first add atleast one product to assigning story template
          </AlertDialogBody>

          <AlertDialogFooter>
            <a href={addProductUrl} target="_blank">
              <Button
                colorScheme="blue"
                onClick={() => {
                  onClose();
                }}
                ml={3}
              >
                Continue
              </Button>
            </a>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogBox;
