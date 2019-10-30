import React from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ZurisCircleLogo from "../resources/images/ZurisCircleLogo.PNG";

const useStyles = makeStyles(theme => ({
  root: {
    textDecoration: "none",
    color: "white",
	  marginRight: theme.spacing(2),
	  [theme.breakpoints.down("sm")]: {
		display: "none"
	  }
  },
  logo: {
	height: 30,
	width: 30,
	marginRight: theme.spacing(0.5),
	float: "left"
  }
}));

export default function Logo({ className }) {
  const classes = useStyles();
  return (
    <div className={className}>
	  <Typography variant="h6" component={Link} to="/" className={classes.root}>
		<img src={ZurisCircleLogo} alt="Zuri's" className={classes.logo} />
		Dashboard
      </Typography>
    </div>
  );
}
