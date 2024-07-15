import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "../styles/MainPage.scss";

const MainPage = () => {
  return (
    <Box className="main-page">
      <Box className="main-page__sidebar">
        <Sidebar />
      </Box>
      <Box className="main-page__content">
        <Box className="main-page__content-header">
          <Navbar />{" "}
        </Box>
        <Box className="main-page__content-outlet">
          {/* <Outlet /> */}
          error
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
