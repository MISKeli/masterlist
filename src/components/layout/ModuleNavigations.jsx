import { Box, Typography } from "@mui/material";
import React from "react";
import "../../styles/ModuleNavigations.scss";

const ModuleNavigations = ({
  icon,
  name,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Box
      className={`module-nav ${selected ? "module-nav--active" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box className="module-nav__icon-container">{icon}</Box>
      <Box className="module-nav__name-container">
        <Typography variant="button">{name}</Typography>
      </Box>
    </Box>
  );
};

export default ModuleNavigations;
