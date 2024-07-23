import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import PrivateRoutes from "../pages/PrivateRoutes";
import DashboardPage from "../pages/DashboardPage";
import UserManagementPage from "../pages/UserManagementPage";
import UserAccountPage from "../pages/UserAccountPage";
import RoleManagementPage from "../pages/RoleManagementPage";

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
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          {
            path: "users_management",
            element: <UserManagementPage />,
            children: [
              {
                path: "users_account",
                element: <UserAccountPage />,
              },
              {
                path: "role_management",
                element: <RoleManagementPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
