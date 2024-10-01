import "@mui/material/styles";
import { TypeBackground } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    card: string;
    cardHover: string;
    inputField: string;
    button: string;
    buttonHover: string;
    buttonOpacity: string;
    buttonOpacityHover: string;
    pale: string;
  }
}
