import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import "./floating.css";
import FloatingBlock from "../components/FloatingBlock/FloatingBlock";

ReactDOM.createRoot(document.getElementById("floating")).render(
  <React.StrictMode>
    <FloatingBlock home={home} />
  </React.StrictMode>
);
