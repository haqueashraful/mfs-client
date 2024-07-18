import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Route from "./Routes/Route.jsx";
import { MyContext } from "./Context/MyContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MyContext>
      <RouterProvider router={Route}></RouterProvider>
    </MyContext>
  </React.StrictMode>
);
