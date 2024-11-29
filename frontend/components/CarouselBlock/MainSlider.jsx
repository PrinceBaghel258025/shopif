/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Stack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Slide from "./Slide";
// import leftNavigation from "./LeftNavigation.png";
// import rightNavigation from "./RightNavigation.png";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  border: 2px solid black;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConstantFrame = styled.div`
  border: 5px solid black;
  width: 17.375em;
  height: 35.6em;
  position: relative;
  border-radius: 55px;
  overflow: hidden;
  box-shadow: lg;
`;
const NavigationButtons = styled.div`
  position: relative;
  display: flex;
  height: 40px;
  margin: 0 auto;
  width: 20%;
  margin-top: 1rem;
  justify-content: space-between;

  img {
    height: 100%;
  }
`;

const DEFAULT_GO_TO_SLIDE_DELAY = 200;

const mod = (a, b) => {
  return ((a % b) + b) % b;
};

const Carousel = React.memo(
  ({
    slides,
    goToSlide: propsGoToSlide,
    showNavigation = false,
    offsetRadius = 2,
    animationConfig = { tension: 120, friction: 14 },
    goToSlideDelay = DEFAULT_GO_TO_SLIDE_DELAY,
    offsetFn,
  }) => {
    const [index, setIndex] = useState(0);
    const [goToSlide, setGoToSlide] = useState(null);
    const [newSlide, setNewSlide] = useState(false);

    const modBySlidesLength = useCallback(
      (idx) => {
        return mod(idx, slides.length);
      },
      [slides.length]
    );

    const moveSlide = useCallback(
      (direction) => {
        setIndex((prev) => modBySlidesLength(prev + direction));
        setGoToSlide(null);
      },
      [modBySlidesLength]
    );

    const getShortestDirection = useCallback(
      (from, to) => {
        if (from > to) {
          if (from - to > slides.length - 1 - from + to) {
            return 1;
          }
          return -1;
        } else if (to > from) {
          if (to - from > from + slides.length - 1 - to) {
            return -1;
          }
          return 1;
        }
        return 0;
      },
      [slides.length]
    );

    const handleGoToSlide = useCallback(() => {
      if (typeof goToSlide !== "number") return;

      const targetSlide = mod(goToSlide, slides.length);

      if (targetSlide !== index) {
        const direction = getShortestDirection(index, targetSlide);
        const isFinished = modBySlidesLength(index + direction) === targetSlide;

        setIndex(modBySlidesLength(index + direction));
        setNewSlide(isFinished);
        setGoToSlide(isFinished ? null : targetSlide);
      }
    }, [
      goToSlide,
      index,
      slides.length,
      getShortestDirection,
      modBySlidesLength,
    ]);

    const clampOffsetRadius = useCallback(
      (offset) => {
        const upperBound = Math.floor((slides.length - 1) / 2);
        return Math.min(Math.max(0, offset), upperBound);
      },
      [slides.length]
    );

    const getPresentableSlides = useCallback(() => {
      const clampedRadius = clampOffsetRadius(offsetRadius);
      const presentableSlides = [];

      for (let i = -clampedRadius; i < 1 + clampedRadius; i++) {
        const slideIndex = modBySlidesLength(index + i);
        const slide = slides[slideIndex];
        presentableSlides.push({
          ...slide,
          originalIndex: slideIndex,
        });
      }

      return presentableSlides;
    }, [offsetRadius, slides, index, modBySlidesLength, clampOffsetRadius]);

    const presentableSlides = useMemo(
      () => getPresentableSlides(),
      [getPresentableSlides]
    );

    useEffect(() => {
      if (propsGoToSlide !== undefined && propsGoToSlide !== goToSlide) {
        setGoToSlide(propsGoToSlide);
        setNewSlide(true);
      }
    }, [propsGoToSlide]);

    useEffect(() => {
      let timeoutId;

      if (typeof goToSlide === "number") {
        if (newSlide) {
          handleGoToSlide();
        } else if (index !== goToSlide) {
          timeoutId = window.setTimeout(handleGoToSlide, goToSlideDelay);
        }
      }

      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }, [goToSlide, newSlide, index, handleGoToSlide, goToSlideDelay]);

    const handleSlideClick = useCallback(
      (index) => {
        if (typeof goToSlide !== "number" || index !== goToSlide) {
          setGoToSlide(index);
          setNewSlide(true);
        }
      },
      [goToSlide]
    );

    // const navigationButtons = showNavigation ? (
    //   <NavigationButtons>
    //     <img
    //       src={leftNavigation}
    //       onClick={() => moveSlide(-1)}
    //       style={{ marginRight: "2rem" }}
    //       alt="Previous"
    //     />
    //     <img
    //       src={rightNavigation}
    //       onClick={() => moveSlide(1)}
    //       style={{ marginLeft: "2rem" }}
    //       alt="Next"
    //     />
    //   </NavigationButtons>
    // ) : null;

    return (
      <>
        <Wrapper>
          <ConstantFrame>
            <Stack
              position={"absolute"}
              top={8}
              left={"50%"}
              transform={"translateX(-50%)"}
              w={"22%"}
              h={2.5}
              bg={"black"}
              borderRadius={100}
              zIndex={10}
            >
              <p></p>
            </Stack>
          </ConstantFrame>
          {presentableSlides.map((slide, presentableIndex) => (
            <Slide
              key={`${slide.key}-${slide.originalIndex}`}
              content={slide.content}
              onClick={() => handleSlideClick(slide.originalIndex)}
              offsetRadius={clampOffsetRadius(offsetRadius)}
              index={presentableIndex}
              animationConfig={animationConfig}
              offsetFn={offsetFn}
            />
          ))}
        </Wrapper>
        {/* {navigationButtons} */}
      </>
    );
  }
);

export default Carousel;
