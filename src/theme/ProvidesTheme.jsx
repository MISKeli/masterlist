import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import palette from "../styles/__palette.module.scss";
import { paletteSchema } from "../schemas/peletteSchema";

const ProvidesTheme = ({ children }) => {
  const theme = createTheme({
    palette: { ...paletteSchema },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ProvidesTheme;
