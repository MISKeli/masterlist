import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import ProvidesTheme from "./theme/ProvidesTheme";
import { Provider } from "react-redux";
import store from "./app/store";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Provider store={store}>
        <ProvidesTheme>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" richColors />
        </ProvidesTheme>
      </Provider>
    </>
  );
}

export default App;
