import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
]);
