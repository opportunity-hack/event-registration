import React from "react";
import { Typography, Box } from "@material-ui/core";
import Help0 from "../resources/images/0.PNG";
import { makeStyles } from "@material-ui/styles";
import Help1 from "../resources/images/1.PNG";
import Help2 from "../resources/images/2.PNG";

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: 800
  },
  section: {
    marginTop: theme.spacing(2)
  }
}));

export default function Help() {
  const classes = useStyles();
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Help Center
      </Typography>

      <Typography variant="h6">How to create an event</Typography>
      <Typography color="textSecondary" gutterBottom>
        Navigate to the event page and fill out the form.
      </Typography>
      <img src={Help0} className={classes.image} />

      <Typography variant="h6" className={classes.section}>
        How to collect emails
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        Find the event in the 'upcoming events' page and click on the intake
        button. This will take you to an intake form where people can start
        signing up to the event.
      </Typography>
      <img src={Help1} className={classes.image} />
      <img src={Help2} className={classes.image} />
    </Box>
  );
}
