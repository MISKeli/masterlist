import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/LoginPage";
import MainPage from "../pages/MainPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainPage />,
  },
]);
