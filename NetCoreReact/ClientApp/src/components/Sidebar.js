import React, { useState } from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import DataIcon from "@material-ui/icons/DataUsage";
import HelpIcon from "@material-ui/icons/Help";
import SettingsIcon from "@material-ui/icons/Settings";
import { Collapse } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/FormatListBulleted";
import CreateIcon from "@material-ui/icons/Create";
import HistoryIcon from "@material-ui/icons/History";
import { useLocation } from "react-router";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    border: "none",
    backgroundColor: "rgb(41,45,62)",
    color: "white"
  },
  title: {
    paddingLeft: theme.spacing(1)
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.light,
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  icon: {
    color: "white"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default function Sidebar({ open, handleDrawerOpen, handleDrawerClose }) {
  const classes = useStyles();

  const [surveyOpen, setSurveyOpen] = useState(true);
  const location = useLocation();

  const toggleSurveys = () => {
    setSurveyOpen(!surveyOpen);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <Logo className={classes.title} />
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon className={classes.icon} />
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          selected={location.pathname === "/"}
        >
          <ListItemIcon className={classes.icon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem button onClick={toggleSurveys}>
          <ListItemIcon className={classes.icon}>
            <DataIcon />
          </ListItemIcon>
          <ListItemText primary={"Events"} />
          {surveyOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={surveyOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to="/event/create"
              selected={location.pathname === "/event/create"}
            >
              <ListItemIcon>
                <CreateIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText primary="Create" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to="/event/upcoming"
              selected={location.pathname === "/event/upcoming"}
            >
              <ListItemIcon>
                <ListIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText primary="Upcoming" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to="/event/past"
              selected={location.pathname === "/event/past"}
            >
              <ListItemIcon>
                <HistoryIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText primary="Past" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button component={Link} to="/">
          <ListItemIcon className={classes.icon}>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary={"Reports"} />
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemIcon className={classes.icon}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemIcon className={classes.icon}>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary={"Help"} />
        </ListItem>
      </List>
    </Drawer>
  );
}
