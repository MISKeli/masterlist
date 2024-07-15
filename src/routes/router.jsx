import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import PrivateRoutes from "../pages/PrivateRoutes";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
    ],
  },
]);
