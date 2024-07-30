import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import palette from "../styles/__palette.module.scss";
import { paletteSchema } from "../schemas/paletteSchema";

const ProvidesTheme = ({ children }) => {
  const theme = createTheme({
    palette: { ...paletteSchema },
    typography: {
      fontFamily: ["Poppins"],
    },

    components: {
      MuiTable: {
        styleOverrides: {
          root: {
           // tableLayout: "auto",
            //height: "100%",
            //overflow: "auto",
          },
        },
      },
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
