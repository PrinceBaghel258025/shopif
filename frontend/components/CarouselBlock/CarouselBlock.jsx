import React from "react";
import { Scene } from "../ProductStoryVisualizer/Scene";
import SliderComponent from "./SliderComponent";

const CarouselBlock = ({ message }) => {
  return (
    <div className="tw-w-full tw-h-full ">
      <SliderComponent
        productData={[
          {
            id: "egs3ylR9PwX5U_qBVHXPV",
            data: [
              {
                id: "_b4EiFyuLSoLAc5J2J8dW",
                type: "carousel_360_image",
                image_url:
                  "https://agspert-weatherstation1.s3.amazonaws.com/media/12258/sngurofalvynbxosggaqotokszpqli",
              },
            ],
            type: "carousel_360_image",
            header: "360 img",
            isActive: true,
            infoPoints: {},
          },
          {
            id: "_WFNnXT0n9TIcQ0QuFerQ",
            data: [
              {
                id: "v2IISboi4KyG9J9sRS6Gg",
                type: "carousel_360_video",
                image_url:
                  "https://agspert-weatherstation1.s3.amazonaws.com/media/12258/pmrevbuzfdgfhzeshmluakxnrslnbd",
              },
            ],
            type: "carousel_360_video",
            header: "360 vid",
            isActive: true,
            infoPoints: {},
          },
          {
            id: "lC1XswNWSLFZjAyMD7L5Y",
            data: [
              {
                id: "q3i2oJdqFhtYtRyYaz-gS",
                type: "carousel_2d_image",
                image_url:
                  "https://agspert-weatherstation1.s3.amazonaws.com/media/12258/wrpnjpzmkyxzewncnreizcjdgfuxxl",
              },
            ],
            type: "carousel_2d_image",
            header: "2d img",
            isActive: true,
            infoPoints: {},
          },
          {
            id: "Vl90h3gwmJ4TVQs1K3AiA",
            data: [
              {
                id: "EQovWu0X33EIZv7eHx65-",
                type: "carousel_2d_video",
                image_url:
                  "https://agspert-weatherstation1.s3.amazonaws.com/media/12258/mgvhgrmqlejtghvbdbcczwrsbpvcnd",
              },
            ],
            type: "carousel_2d_video",
            header: "2d vid",
            isActive: true,
            infoPoints: {},
          },
          {
            id: "egs3ylR9PwX5U_qBVHXPV",
            data: [
              {
                id: "_b4EiFyuLSoLAc5J2J8dW",
                type: "carousel_360_image",
                image_url:
                  "https://agspert-weatherstation1.s3.amazonaws.com/media/12258/sngurofalvynbxosggaqotokszpqli",
              },
            ],
            type: "carousel_360_image",
            header: "360 img",
            isActive: true,
            infoPoints: {},
          }
        ]}
        defaultSheetdata={[]}
      />
    </div>
  );
};

export default CarouselBlock;
