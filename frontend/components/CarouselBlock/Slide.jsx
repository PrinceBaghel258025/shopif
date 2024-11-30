/* eslint-disable react/display-name */
import React from "react";
import styled from "@emotion/styled";
import { animated, useSpring } from "@react-spring/web";

// Todo: Adjusting size of 2d & 360 screens according to carousel
const SlideContainer = styled(animated.div)`
  position: absolute;
  height: 100%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 50% 50%;
  // background-color: red;
  width: 16.75em !important;
  height: 35.25em !important;

  canvas {
    // width: 100% !important;
    // height: 100% !important;
    width: 16.87em !important;
    height: 35.25em !important;
    background-color: blue;
  }

  img,
  video {
    // width: 100% !important;
    // height: 100% !important;
    // min-width: 300px !important;
    // max-width: 300px !important;
    object-fit: fill;
  }
`;

const getDefaultTranslateX = (offsetFromCenter, offsetRadius, index) => {
  const totalPresentables = 2 * offsetRadius + 1;
  const translateXoffset =
    50 * (Math.abs(offsetFromCenter) / (offsetRadius + 1));
  let translateX = -50;

  if (offsetRadius !== 0) {
    if (index === 0) {
      translateX = 0;
    } else if (index === totalPresentables - 1) {
      translateX = -100;
    }
  }

  if (offsetFromCenter > 0) {
    translateX += translateXoffset;
  } else if (offsetFromCenter < 0) {
    translateX -= translateXoffset;
  }
  return translateX;
};

const Slide = React.memo(
  ({ content, offsetRadius, index, animationConfig, onClick, offsetFn }) => {
    const offsetFromCenter = index - offsetRadius;
    const distanceFactor = 1 - Math.abs(offsetFromCenter / (offsetRadius + 1));

    const isVisible = Math.abs(offsetFromCenter) <= offsetRadius;

    let springConfig = {};

    if (offsetFn) {
      springConfig = offsetFn(offsetFromCenter, index);
    } else {
      const translateX = getDefaultTranslateX(
        offsetFromCenter,
        offsetRadius,
        index
      );

      springConfig = {
        transform: `translateY(-50%) translateX(${translateX}%) scale(${distanceFactor})`,
        left: `${
          offsetRadius === 0 ? 50 : 50 + (offsetFromCenter * 50) / offsetRadius
        }%`,
        opacity: distanceFactor * distanceFactor,
      };
    }

    const springs = useSpring({
      to: springConfig,
      config: animationConfig,
    });

    // Extract scale from transform string using a ref to avoid re-renders
    const scaleRef = React.useRef(distanceFactor);
    React.useEffect(() => {
      if (typeof springs.transform === "string") {
        const scaleMatch = springs.transform
          .toString()
          .match(/scale\(([\d.]+)\)/);
        scaleRef.current = scaleMatch
          ? parseFloat(scaleMatch[1])
          : distanceFactor;
      }
    }, [springs.transform, distanceFactor]);

    const contentWithScale = React.isValidElement(content)
      ? React.cloneElement(content, { slideScale: scaleRef.current })
      : content;

    return (
      <SlideContainer
        style={{
          ...springs,
          zIndex: Math.abs(Math.abs(offsetFromCenter) - offsetRadius),
          display: isVisible ? "flex" : "none",
        }}
        onClick={onClick}
      >
        {contentWithScale}
      </SlideContainer>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.index === nextProps.index &&
      prevProps.offsetRadius === nextProps.offsetRadius &&
      prevProps.content === nextProps.content &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

Slide.displayName = "Slide";
export default Slide;
