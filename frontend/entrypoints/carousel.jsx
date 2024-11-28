import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "./carousel.css";
import CarouselBlock from "../components/CarouselBlock/CarouselBlock";

ReactDOM.createRoot(document.getElementById("carousel")).render(
  <React.StrictMode>
    <CarouselBlock home={home} />
  </React.StrictMode>
);
