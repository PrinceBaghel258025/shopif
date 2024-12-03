import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BsQrCodeScan } from "react-icons/bs";
import QRCodeGenerator from "../Generic/QRCodeGenerator";

const QRModal = ({ storyUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <BsQrCodeScan
        className="qr-code"
        onClick={onOpen}
        cursor={"pointer"}
        fontSize={20}
        color="#3688FF"
      />

      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <QRCodeGenerator url={storyUrl} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QRModal;
