import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Routes from "./Routes";
import Sidebar from "../components/Sidebar";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import useAuth from "../hooks/useAuth";
import Login from "../components/Login";
import { useLocation } from "react-router";
import queryString from "query-string";
import Confirm from "../pages/Confirm";
import Feedback from "../pages/Feedback";
import RemoveEmail from "../pages/RemoveEmail";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  root: {
    padding: theme.spacing(2)
  }
}));

export default function Template() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { authState, getToken } = useAuth();
  const location = useLocation();
  const values = queryString.parse(location.search);

  getToken();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {location.pathname === "/remove-email" ? (
        <>
          <NavigationBar />
          <div className={classes.toolbar} />
          <RemoveEmail token={values.token} />
        </>
      ) : (
        <>
          {location.pathname === "/feedback" ? (
            <>
              <NavigationBar />
              <div className={classes.toolbar} />
              <Feedback token={values.token} />
            </>
          ) : (
            <>
              {location.pathname === "/confirm" ? (
                <>
                  <NavigationBar />
                  <div className={classes.toolbar} />
                  <Confirm token={values.token} />
                </>
              ) : (
                <>
                  {authState.isAuthenticated ? (
                    <>
                      <NavigationBar
                        open={open}
                        handleDrawerOpen={handleDrawerOpen}
                      />
                      <Sidebar
                        open={open}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose}
                      />
                      <div className={classes.toolbar} />
                      <main
                        className={clsx(classes.content, {
                          [classes.contentShift]: open
                        })}
                      >
                        <div className={classes.root}>
                          <Routes />
                        </div>
                      </main>
                    </>
                  ) : (
                    <Login open={true} />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
