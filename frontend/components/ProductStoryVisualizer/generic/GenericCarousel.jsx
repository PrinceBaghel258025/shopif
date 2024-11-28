import { Box, Button, Flex, IconButton, Progress } from "@chakra-ui/react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const GenericCarousel = ({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = false,
  showDots = false,
  infinite = false,
  sliderContainerProps,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef(null);
  const slideRef = useRef(null);
  const progressInterval = useRef(null);

  // Convert children to array for easier handling
  const slides = React.Children.toArray(children);

  // Create extended array for infinite loop
  const extendedSlides = infinite
    ? [...slides, ...slides, ...slides, ...slides, ...slides]
    : slides;

  // Function to start progress animation with smoother updates
  const startProgressAnimation = useCallback(() => {
    if (!autoPlay || isHovered) return;

    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Reset progress
    setProgress(0);

    // Start new progress animation with more frequent updates
    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / autoPlayInterval) * 100;

      if (newProgress >= 100) {
        setProgress(0);
      } else {
        setProgress(newProgress);
      }
    }, 32); // Reduced from 16ms to 32ms for better performance while still smooth
  }, [autoPlay, autoPlayInterval, isHovered]);

  // Navigation functions with infinite loop logic
  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    if (infinite) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }

    // Restart progress animation
    startProgressAnimation();
  }, [infinite, slides.length, isTransitioning, startProgressAnimation]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    if (infinite) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
    }

    // Restart progress animation
    startProgressAnimation();
  }, [infinite, slides.length, isTransitioning, startProgressAnimation]);

  // Handle infinite loop transitions
  useEffect(() => {
    if (!infinite) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);

      if (currentIndex === 0) {
        slideRef.current.style.transition = "none";
        setCurrentIndex(slides.length);
        slideRef.current.offsetHeight;
        slideRef.current.style.transition = "transform 0.3s ease-in-out";
      } else if (currentIndex === extendedSlides.length - 1) {
        slideRef.current.style.transition = "none";
        setCurrentIndex(1);
        slideRef.current.offsetHeight;
        slideRef.current.style.transition = "transform 0.3s ease-in-out";
      }
    };

    const slideElement = slideRef.current;
    if (slideElement) {
      slideElement.addEventListener("transitionend", handleTransitionEnd);
      return () => {
        slideElement.removeEventListener("transitionend", handleTransitionEnd);
      };
    }
  }, [infinite, currentIndex, slides.length]);

  const goToSlide = (slideIndex) => {
    if (infinite) {
      setCurrentIndex(slideIndex + 1);
    } else {
      setCurrentIndex(slideIndex);
    }
    startProgressAnimation();
  };

  // Auto play functionality with progress and debounce
  useEffect(() => {
    let interval;
    if (autoPlay && !isHovered) {
      startProgressAnimation();
      interval = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    } else {
      // Clear progress interval when hover or autoPlay is false
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        setProgress(0);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, goToNext, startProgressAnimation]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  // Early return if no slides
  if (!slides || slides.length === 0) {
    return null;
  }

  // Single slide display
  if (slides.length === 1) {
    return <Box>{slides[0]}</Box>;
  }

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      // my={3}
      // mb={8}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar */}
      {/* {autoPlay && (
        <Progress
          value={progress}
          size="xs"
          colorScheme="blue"
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex={3}
          borderRadius="1rem 1rem 0 0"
          transition="none"
        />
      )} */}

      {/* Main carousel container */}
      <Flex
        ref={slideRef}
        position="relative"
        width="100%"
        height="100%"
        overflow="hidden"
        borderRadius="1rem"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides container */}
        <Flex
          transform={`translateX(-${currentIndex * 100}%)`}
          transition="transform 0.3s ease-in-out"
          width="100%"
          height="100%"
          {...sliderContainerProps}
        >
          {extendedSlides.map((slide, index) => (
            <Box
              key={index}
              flexShrink={0}
              width="100%"
              height="100%"
              position="relative"
            >
              {slide}
            </Box>
          ))}
        </Flex>
      </Flex>

      {/* Navigation arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <IconButton
            icon={<IoIosArrowBack fontSize={15} />}
            position="absolute"
            left="4"
            top="40%"
            transform="translateY(-50%)"
            onClick={goToPrevious}
            bg="whiteAlpha.700"
            _hover={{ bg: "whiteAlpha.900" }}
            size="md"
            borderRadius="full"
            display={
              // Hide if not hovered OR if we're at the start
              !isHovered
                ? "none"
                : infinite
                ? "flex" // Always show for infinite carousel
                : currentIndex === 0
                ? "none" // Hide on first slide for non-infinite
                : "flex"
            }
            zIndex={2}
          />
          <IconButton
            icon={<IoIosArrowForward fontSize={15} />}
            position="absolute"
            right="4"
            top="40%"
            transform="translateY(-50%)"
            onClick={goToNext}
            bg="whiteAlpha.700"
            _hover={{ bg: "whiteAlpha.900" }}
            size="md"
            borderRadius="full"
            display={
              // Hide if not hovered OR if we're at the end
              !isHovered
                ? "none"
                : infinite
                ? "flex" // Always show for infinite carousel
                : currentIndex === slides.length - 1
                ? "none" // Hide on last slide for non-infinite
                : "flex"
            }
            zIndex={2}
          />
        </>
      )}

      {/* Dots navigation */}
      {showDots && slides.length > 1 && (
        <Flex justify="center" mt={4} gap={2}>
          {slides.map((_, index) => (
            <Box
              key={index}
              h="2"
              w="2"
              borderRadius="full"
              bg={
                (infinite ? currentIndex - 1 : currentIndex) === index
                  ? "blue.500"
                  : "gray.300"
              }
              cursor="pointer"
              onClick={() => goToSlide(index)}
              transition="background-color 0.2s"
              _hover={{ bg: currentIndex === index ? "blue.600" : "gray.400" }}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default GenericCarousel;
