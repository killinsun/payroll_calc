import { createTheme } from "@mui/material";
import { colors } from "./colors";

export const theme = createTheme({
  palette: {
    background: {
      default: colors.white[16],
      card: colors.white.main,
      cardHover: colors.gray[50],
      inputField: colors.gray[50],
      button: colors.gray[100],
      buttonHover: colors.gray[200],
      buttonOpacity: colors.black[8],
      buttonOpacityHover: colors.black[16],
    },
    action: {
      hover: colors.gray[300],
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
    },
    h2: {
      fontSize: 28,
      fontWeight: "bold",
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold",
    },
    h4: {
      fontSize: 18,
      fontWeight: "bold",
    },
    h5: {
      fontSize: 16,
      fontWeight: "bold",
    },
    h6: {
      fontWeight: "bold",
    },
    button: {
      textTransform: "none",
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: "140%",
    },
    body2: {
      fontSize: 13,
    },
    caption: {
      color: colors.gray[500],
      fontSize: 12,
    },
  },
});
