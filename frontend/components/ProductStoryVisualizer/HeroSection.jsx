import {
  Box,
  Fade,
  Flex,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DrawerInfo } from "./DrawerInfo";
import { FiExternalLink } from "react-icons/fi";
import DraggableDrawer from "./generic/DraggableDrawer";
import { TbView360Number } from "react-icons/tb";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import ScreenInfoCard from "./generic/ScreenInfoCard";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const IconWithAnimation = styled(Icon)`
  animation: ${blink} 1.3s linear infinite;
  animation-delay: 2s;
`;

export const HeroSection = ({
  data,
  isImage = false,
  isVideo = false,
  is360Slide = false,
  setIsBottomSheetOpen,
  header,
}) => {
  // const [showIcon, setShowIcon] = useState(true);

  const imageScreen = data?.find((info) => info?.type === "2d_image");
  const videoScreen = data?.find((info) => info?.type === "2d_video");

  const redirect_url = data?.find((info) => info?.type === "redirect_url");

  const [show360Gif, setShow360Gif] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow360Gif(false);
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {header ? (
        <Text
          position={"absolute"}
          top={"3.5rem"}
          left={"1.5rem"}
          paddingX={3}
          borderRadius={100}
          fontWeight={500}
          bg={"lightcyan"}
          fontSize={16}
        >
          {header}
        </Text>
      ) : null}
      <VStack position={"absolute"} top={10} right={5} spacing={3}>
        <a
          href={redirect_url ? redirect_url?.link?.url : "https://agspert.com/"}
          target="_blank"
        >
          <IconButton
            icon={<FiExternalLink size={20} />}
            color={"black"}
            borderRadius={50}
            bg={"whiteAlpha.800"}
          />
        </a>
      </VStack>

      {is360Slide && (
        <Fade
          in={show360Gif}
          transition={{ enter: { duration: 0.5 }, exit: { duration: 0.5 } }}
        >
          <Stack
            position={"absolute"}
            top={"200px"}
            left={"85px"}
            translateX={"-50%"}
            translateY={"-50%"}
            w={100}
            h={100}
            borderRadius={100}
          >
            <Image
              src="https://360-images-v1.s3.ap-south-1.amazonaws.com/360-gif.gif"
              alt="360 gif"
              borderRadius={100}
            />
          </Stack>
        </Fade>
      )}

      {isImage && (
        <Stack
          position={"absolute"}
          bottom={imageScreen?.screen_info?.y_axis}
          left={imageScreen?.screen_info?.x_axis}
        >
          <ScreenInfoCard
            left={imageScreen?.screen_info?.x_axis}
            data={imageScreen?.screen_info}
          />
        </Stack>
      )}

      {isVideo && (
        <Stack
          position={"absolute"}
          bottom={videoScreen?.screen_info?.y_axis}
          left={videoScreen?.screen_info?.x_axis}
        >
          <ScreenInfoCard
            left={videoScreen?.screen_info?.x_axis}
            data={videoScreen?.screen_info}
          />
        </Stack>
      )}

      {/* {showIcon && (
        <IconWithAnimation
          as={TbView360Number}
          color={"#ffffff"}
          position={"absolute"}
          top={"20%"}
          right={"25%"}
          fontSize={"12rem"}
          zIndex={"100000000"}
        />
      )} */}

      {/* <DraggableDrawer data={data} setIsBottomSheetOpen={setIsBottomSheetOpen}>
        <DrawerInfo data={data} />
      </DraggableDrawer> */}
    </>
  );
};
