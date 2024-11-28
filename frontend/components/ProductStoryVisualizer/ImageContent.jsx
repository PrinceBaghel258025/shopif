import { HStack, Image } from "@chakra-ui/react";
import React from "react";
import Slider from "react-slick";
import GenericCarousel from "./generic/GenericCarousel";

export const ImageContent = ({ media }) => {
  const splitMedia = (media) => {
    const images = media?.filter((item) => !item.endsWith(".mp4"));
    return { images };
  };
  // const { images } = splitMedia(media);
  const images = media;

  console.log("images: ", media);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <>
      {images?.length === 1 && images?.[0]?.image_url ? (
        <Image
          w={"100%"}
          borderRadius={8}
          src={images[0]?.image_url}
          alt="image"
        />
      ) : images?.[0]?.image_url ? (
        <GenericCarousel
          SliderContainerProps={{ my: 3, mb: 8 }}
          autoPlay
          infinite
        >
          {images?.map((img) => (
            <Image
              key={img?.id}
              src={img?.image_url}
              alt="image"
              w={"100%"}
              h={"100%"}
              borderRadius={8}
            />
          ))}
        </GenericCarousel>
      ) : null}
    </>
  );
};
