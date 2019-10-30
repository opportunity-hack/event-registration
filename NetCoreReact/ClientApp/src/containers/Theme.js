import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

/**
 * Material UI Theme
 */

const theme = createMuiTheme({
  palette: {
    primary: {
	  light: "rgba(132, 110, 130, 1)",
	  main: "rgba(91, 68, 89, 1)"
    }
  },
  typography: {
    useNextVariants: true
  }
});

export default function CustomTheme(props) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}
