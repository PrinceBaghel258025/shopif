import React, { useRef } from "react";
import QRCode from "react-qr-code";
import {
  Box,
  Button,
  VStack,
  HStack,
  useToast,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon, ExternalLinkIcon, DownloadIcon } from "@chakra-ui/icons";

const QRCodeGenerator = ({ url }) => {
  const qrCodeRef = useRef(null);
  const toast = useToast();
  const { onCopy } = useClipboard(url);

  // Handle QR code download
  const handleDownload = () => {
    if (!qrCodeRef?.current) return;

    const svg = qrCodeRef.current;
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, 200, 200);

      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(link.href);
      }, "image/png");
    };

    img.src = url;
  };

  // Handle URL copy
  const handleCopy = () => {
    onCopy();
    toast({
      title: "Copied to Clipboard",
      description: `'${url}' is copied to clipboard!`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <VStack spacing={4} align="center" p={4}>
      <Box
        maxWidth={"12.5rem"}
        padding={1}
        borderWidth={4}
        borderRadius={10}
        borderColor={"#00B894"}
      >
        <QRCode
          ref={qrCodeRef}
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={url}
          viewBox={`0 0 256 256`}
        />
      </Box>

      <HStack spacing={3}>
        <Button size={"sm"} rightIcon={<CopyIcon />} onClick={handleCopy}>
          Copy
        </Button>

        <Button
          as="a"
          href={url}
          target="_blank"
          size={"sm"}
          rightIcon={<ExternalLinkIcon />}
        >
          Open
        </Button>

        <Button
          size={"sm"}
          rightIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download
        </Button>
      </HStack>
    </VStack>
  );
};

export default QRCodeGenerator;
