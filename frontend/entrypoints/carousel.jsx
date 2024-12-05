import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "./carousel.css";
import CarouselQueryClientWrapper from "../components/CarouselBlock/CarouselQueryClientWrapper";

ReactDOM.createRoot(document.getElementById("carousel")).render(
  <React.StrictMode>
    <CarouselQueryClientWrapper home={home} />
  </React.StrictMode>
);
