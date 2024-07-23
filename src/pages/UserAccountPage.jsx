import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { infos } from "../schemas/infos";
import "../styles/UserAccountPage.scss";

const UserAccountPage = () => {
  return (
    <>
      <Box className="users-main">
        <Box className="users-main__header">
          <Typography className="users-header__title">
            {infos.users_title}
          </Typography>
          <Button className="users-header__button" variant="contained">
            {infos.users_add_button}
          </Button>
        </Box>
        <Box className="users-main__content"></Box>
        <Box className="users-main__footer"></Box>
      </Box>
    </>
  );
};

export default UserAccountPage;
