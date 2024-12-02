import React, { useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

const InfoTooltip = ({
  children,
  text,
  position = "left",
  bg = "gray.700",
  color = "white",
  delay = 0,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Tooltip background and text color
  const tooltipBg = useColorModeValue(bg, "gray.200");
  const tooltipColor = useColorModeValue(color, "gray.800");

  // Positioning styles
  const positionStyles = {
    top: {
      bottom: "calc(100% + 5px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottom: {
      top: "calc(100% + 5px)",
      left: "50%",
      transform: "translateX(-50%)",
    },
    left: {
      right: "calc(100% + 5px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
    right: {
      left: "calc(100% + 5px)",
      top: "50%",
      transform: "translateY(-50%)",
    },
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => {
        // Optional delay before showing tooltip
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
      }}
      onMouseLeave={() => setIsVisible(false)}
      {...rest}
    >
      {children}

      {isVisible && (
        <Box
          position="absolute"
          bg={tooltipBg}
          color={tooltipColor}
          p={1.5}
          borderRadius="md"
          boxShadow="md"
          fontSize="xs"
          zIndex={10}
          whiteSpace="nowrap"
          {...positionStyles[position]}
        >
          {text}
        </Box>
      )}
    </Box>
  );
};

export default InfoTooltip;
