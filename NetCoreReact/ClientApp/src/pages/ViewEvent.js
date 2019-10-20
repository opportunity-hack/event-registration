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
import { Button, TextField, Grid } from "@material-ui/core";
import ParticipantTable from "../components/ParticipantTable";
import FeedbackTable from "../components/FeedbackTable";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { FilePicker } from "react-file-picker";
import Axios from "axios";
import useAuth from "../hooks/useAuth";

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
  },
  button: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  }
}));

export default function ViewEvent() {
  const classes = useStyles();
  const { id } = useParams();
  const [errors, setErrors] = useState([]);
  const { get, post } = useRequest();
  const [event, setEvent] = useState({ feedback: [], participants: [] });
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [body, setBody] = useState([]);
  const [subject, setSubject] = useState("");
  const { authState } = useAuth();

  const handleBodyChange = e => {
    setBody(e.target.value);
  };

  const handleSubjectChange = e => {
    setSubject(e.target.value);
  };

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

  const handleEmailSubmit = async () => {
    let response = await post(config.SEND_GENERIC_EMAIL_POST_URL, {
      Data: {
        Title_Header: subject,
        Body_Copy: body,
        Signature: "Zuri's Circle"
      },
      EventId: id
    });

    if (response.success) {
      setSubject("");
      setBody("");
    }
  };
  const data = {
    labels: ["Negative", "Positive"],
    datasets: [
      {
        data: [
          event.feedback.filter(e => e.score < 0).length,
          event.feedback.filter(e => e.score > 0).length
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"]
      }
    ]
  };

  const data2 = {
    labels: [
      "Sign ups",
      "Email Confirmation",
      "Surveys Sent",
      "Survey Responses"
    ],
    datasets: [
      {
        label: "Engagement",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [
          event.participants.length,
          event.participants.filter(e => e.confirmation === true).length,
          event.sentFeedback ? event.participants.length : 0,
          event.feedback.length
        ]
      }
    ]
  };

  const handleFileChange = file => {
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      Axios.post(
        config.UPLOAD_EMAILS_POST_URL + "?eventID=" + event.id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + authState.token
          }
        }
      )
        .then(function() {
          console.log("SUCCESS!!");
        })
        .catch(function() {
          console.log("FAILURE!!");
        });
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
          <Tab label={"Email"} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Box display="flex">
            <FilePicker
              extensions={["csv"]}
              onChange={handleFileChange}
              onError={errMsg => {}}
            >
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Upload CSV
              </Button>
            </FilePicker>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              component="a"
              href={
                "/api/Csv/Download?eventID=" +
                event.id +
                "&token=" +
                authState.token
              }
            >
              Download CSV
            </Button>
          </Box>
          {event.participants && (
            <ParticipantTable participants={event.participants} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box>
            {!event.sentFeedback && (
              <Button
                color="primary"
                variant="contained"
                onClick={handleFeedbackSubmit}
              >
                Send Feedback Request Emails
              </Button>
            )}
            {event.feedback && (
              <>
                <Typography variant="h6" gutterBottom>
                  Feedback Data
                </Typography>
                <Grid container>
                  <Grid item xs={6}>
                    <Doughnut data={data} />
                  </Grid>
                  <Grid item xs={6}>
                    <Bar data={data2} />
                  </Grid>
                </Grid>
                <FeedbackTable
                  feedbacks={event.feedback.filter(
                    feedback => feedback.type === 0
                  )}
                  title="Volunteers"
                />
                <FeedbackTable
                  feedbacks={event.feedback.filter(
                    feedback => feedback.type === 1
                  )}
                  title="Attendees"
                />
                <FeedbackTable
                  feedbacks={event.feedback.filter(
                    feedback => feedback.type === 2
                  )}
                  title="Donors"
                />
              </>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Box display="flex" flexDirection="column" className={classes.form}>
            <Typography variant="h6">Send mass email</Typography>
            <TextField
              label="Subject"
              autoFocus
              className={classes.textField}
              error={Boolean(errors["Data.Subject"])}
              helperText={errors["Data.Subject"]}
              margin="normal"
              variant="outlined"
              value={subject}
              onChange={handleSubjectChange}
            />
            <TextField
              id="outlined-multiline-static"
              label="Body"
              multiline
              rows="4"
              className={classes.textField}
              error={Boolean(errors["Data.Body"])}
              helperText={errors["Data.Body"]}
              margin="normal"
              variant="outlined"
              value={body}
              onChange={handleBodyChange}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={handleEmailSubmit}
            >
              Send Email
            </Button>
          </Box>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
