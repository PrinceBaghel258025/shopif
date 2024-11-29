import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "./tag.css";
import StoryTagBlock from "../components/StoryTagBlock/StoryTagBlock";

ReactDOM.createRoot(document.getElementById("tag")).render(
  <React.StrictMode>
    <StoryTagBlock home={home} />
  </React.StrictMode>
);
