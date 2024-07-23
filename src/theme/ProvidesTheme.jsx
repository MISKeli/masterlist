import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import palette from "../styles/__palette.module.scss";
import { paletteSchema } from "../schemas/paletteSchema";

const ProvidesTheme = ({ children }) => {
  const theme = createTheme({
    palette: { ...paletteSchema },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ProvidesTheme;
