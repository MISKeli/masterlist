import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "../styles/MainPage.scss";
import PasswordDialog from "../components/layout/password/PasswordDialog";
import { decrypt } from "../utils/encrypt";

const MainPage = () => {
  const [showPasswordDialog, setShowPassword] = useState(false);
  const handleDialog = () => {
    setShowPassword(true);
  };

  const { decryptedData: decryptedUToken } = decrypt(
    sessionStorage.getItem("uToken")
  );
  const { decryptedData: decryptedPToken } = decrypt(
    sessionStorage.getItem("pToken")
  );
  console.log({ decryptedPToken });
  console.log({ decryptedUToken });
  useEffect(() => {
    if (decryptedUToken === decryptedPToken) {
      handleDialog();
    }
  }, [decryptedUToken, decryptedPToken]);
  return (
    <Box className="main-page">
      <PasswordDialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPassword(false);
        }}
      />
      <Box className="main-page__sidebar">
        <Sidebar />
      </Box>
      <Box className="main-page__content">
        <Box>
          <Navbar />
        </Box>

        <Box className="main-page__content-outlet">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
