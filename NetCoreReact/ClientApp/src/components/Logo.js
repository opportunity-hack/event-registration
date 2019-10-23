import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: "none",
    color: "white",
	  marginRight: theme.spacing(2),
	  [theme.breakpoints.down("sm")]: {
		display: "none"
	  }
	}
}));

export default function Logo({ className }) {
  const classes = useStyles();
  return (
    <div className={className}>
      <Typography variant="h6" component={Link} to="/" className={classes.root}>
        Dashboard
      </Typography>
    </div>
  );
}
