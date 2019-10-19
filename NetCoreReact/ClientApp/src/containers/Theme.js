import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

/**
 * Material UI Theme
 */

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "rgb(101, 108, 224)",
      main: "rgb(83, 93, 216)"
    }
  },
  typography: {
    useNextVariants: true
  }
});

export default function CustomTheme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}
