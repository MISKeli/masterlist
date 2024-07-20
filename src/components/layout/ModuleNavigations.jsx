import { Box, Typography } from "@mui/material";
import React from "react";
import "../../styles/ModuleNavigations.scss";

const ModuleNavigations = ({ icon, name, selected, onClick}) => {


  return (
    <Box className="module-nav" onClick={onClick}>
      <Box className="module-nav__icon-container">{icon}</Box>
      <Box className="module-nav__name-container">
        <Typography variant="button">{name}</Typography>
      </Box>
    </Box>
  );
};

export default ModuleNavigations;
