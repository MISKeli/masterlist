import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { infos } from "../schemas/infos";
import "../styles/UserAccountPage.scss";

const UserAccountPage = () => {
  return (
    <>
      <Box className="masterlist-main">
        <Box className="masterlist-main__header">
          <Typography
            className="masterlist-header__title"
            variant="h6"
            color={"primary"}
          >
            {infos.users_title}
          </Typography>
          <Button className="masterlist-header__button" variant="contained">
            {infos.users_add_button}
          </Button>
        </Box>
        <Box className="masterlist-main__content"></Box>
        <Box className="masterlist-main__footer"></Box>
      </Box>
    </>
  );
};

export default UserAccountPage;
