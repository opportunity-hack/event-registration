import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  image: {
    marginTop: theme.spacing(5),
    width: "90%",
    maxWidth: "500px"
  }
}));

export default function Home() {
  const classes = useStyles();

  const { getToken, logout, authState } = useAuth();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <Typography variant="h4" gutterBottom>
        Opportunity Hack 2019
      </Typography>
      <Typography gutterBottom color="textSecondary">
        .NET Core 3.0 + React-Redux + ML.NET = Awesomeness
      </Typography>

      {authState.isAuthenticated && (
        <>
          <Typography gutterBottom>
            Welcome, {Cookies.get("User-Email")}
          </Typography>

          <img
            className={classes.image}
            src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/data_report_bi6l.svg"
          />
        </>
      )}
    </Box>
  );
}
