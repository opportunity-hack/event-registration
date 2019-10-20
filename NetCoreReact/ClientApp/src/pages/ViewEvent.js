import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import { Button } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}
const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: 500,
    marginTop: theme.spacing(2)
  },
  submit: {
    marginTop: theme.spacing(2)
  },
  formControl: {
    marginTop: theme.spacing(2)
  },
  root: {
    backgroundColor: theme.palette.background.paper
  }
}));

export default function ViewEvent() {
  const classes = useStyles();
  const { id } = useParams();
  const [errors, setErrors] = useState([]);
  const { get, post } = useRequest();
  const [event, setEvent] = useState({});
  const theme = useTheme();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };
  useEffect(() => {
    async function getEvent() {
      let response = await get(config.GET_EVENT_GET_URL, { eventID: id });
      if (response.success) {
        setEvent(response.data[0]);
      } else {
        setErrors(response.errors);
      }
    }
    getEvent();

    return () => {};
  }, []);

  const handleFeedbackSubmit = async () => {
    let response = await get(config.SEND_FEEDBACK_EMAIL_GET_URL, {
      eventID: id
    });

    if (response.success) {
      let tempEvent = { ...event };
      tempEvent.sentFeedback = true;
      setEvent(tempEvent);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {event.title}
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label={
              "Participants (" +
              (event.participants ? event.participants.length : "0") +
              ")"
            }
          />
          <Tab
            label={
              "Feedback (" +
              (event.feedback ? event.feedback.length : "0") +
              ")"
            }
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box>
            <Button
              color="primary"
              variant="contained"
              disabled={event.sentFeedback}
              onClick={handleFeedbackSubmit}
            >
              Send Feedback Request Emails
            </Button>
          </Box>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
