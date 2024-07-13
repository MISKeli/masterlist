import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import ProvidesTheme from "./theme/ProvidesTheme";

function App() {
  return (
    <>
      <ProvidesTheme>
        <RouterProvider router={router} />
      </ProvidesTheme>
    </>
  );
}

export default App;
