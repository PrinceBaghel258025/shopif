import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Scene } from '../ProductStoryVisualizer/Scene'
import ImageScreen from '../ProductStoryVisualizer/ImageScreen'
import VideoScreen from '../ProductStoryVisualizer/VideoScreen'
import Carousel from './MainSlider'
import { config } from "react-spring";
import { Stack } from '@chakra-ui/react'
import { ProductStoryContext } from '../context'

function SliderComponent({ productData, defaultSheetdata }) {
  const setIsInteracting = () => { }
  const isBottomSheetOpen = false
  const setIsBottomSheetOpen = () => { }
  const updateLoadingStatus = () => { }
  console.log("from slider component", productData)
  // Cache for mounted components
  const slideComponentsCache = useRef(new Map());

  const slides = useMemo(() => {
    return productData?.map((dataset, index) => {
      const commonStackProps = {
        w: '272px',
        h: '562px',
        // borderWidth: 5,
        // borderColor: 'black',
        borderRadius: "50px",
        overflow: 'hidden',
        boxShadow: 'lg',
        position: 'relative'
      };

      const slideKey = dataset.id || index;

      // Check if we already have this component cached
      if (!slideComponentsCache.current.has(slideKey)) {
        let slideContent;

        if (dataset?.type === "carousel_360_image" || dataset?.type === "carousel_360_video") {
          slideContent = (
            <Stack {...commonStackProps}>
              <Scene
                key={slideKey}
                zoom={dataset?.zoom || 1}
                targetRotation={dataset?.targetRotation}
                fov={dataset?.fov}
                header={dataset?.header}
                setIsInteracting={setIsInteracting}
                data={dataset?.data}
                isBottomSheetOpen={isBottomSheetOpen}
                setIsBottomSheetOpen={setIsBottomSheetOpen}
                slideId={dataset?.id}
                updateLoadingStatus={index === 0 ? updateLoadingStatus : undefined}
              />
            </Stack>
          );
        } else if (dataset?.type === "carousel_2d_image") {
          slideContent = (
            <Stack {...commonStackProps}>
              <ImageScreen
                key={slideKey}
                header={dataset?.header}
                setIsInteracting={setIsInteracting}
                data={dataset?.data}
                slideId={dataset?.id}
                updateLoadingStatus={index === 0 ? updateLoadingStatus : undefined}
              />
            </Stack>
          );
        } else if (dataset?.type === "carousel_2d_video") {
          slideContent = (
            <Stack {...commonStackProps}>
              <VideoScreen
                key={slideKey}
                header={dataset?.header}
                setIsInteracting={setIsInteracting}
                data={dataset?.data}
                slideId={dataset?.id}
                updateLoadingStatus={index === 0 ? updateLoadingStatus : undefined}
              />
            </Stack>
          );
        }

        // Cache the created component
        slideComponentsCache.current.set(slideKey, slideContent);
      }

      return {
        key: slideKey,
        content: slideComponentsCache.current.get(slideKey)
      };
    }).map((slide, index) => ({
      ...slide,
      onClick: () => {
        if (state.goToSlide !== index) {
          setState(prev => ({ ...prev, goToSlide: index }));
        }
      }
    }));
  }, [productData]);

  // Clean up cache when productData changes
  useEffect(() => {
    const currentKeys = new Set(productData?.map(dataset => dataset.id || productData.indexOf(dataset)));

    // Remove cached components that are no longer needed
    for (const key of slideComponentsCache.current.keys()) {
      if (!currentKeys.has(key)) {
        slideComponentsCache.current.delete(key);
      }
    }
  }, [productData]);

  const [state, setState] = useState({
    goToSlide: 0,
    offsetRadius: 2,
    showNavigation: true,
    config: config.gentle,
    goToSlideDelay: 20,
  });

  return (
    <div style={{ width: "100%", height: "100dvh" }}>
      <ProductStoryContext.Provider value={{
        isBottomSheetOpen,
        setIsBottomSheetOpen,
        setIsInteracting,
        updateLoadingStatus,
        addInfoPoint: () => { },
        getInfoPoints: () => { }
      }}>
        <Carousel
          {...state}
          slides={slides} />
      </ProductStoryContext.Provider>
    </div>
  );
}

export default React.memo(SliderComponent);