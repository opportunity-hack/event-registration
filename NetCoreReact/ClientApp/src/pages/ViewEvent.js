import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import SendIcon from "@material-ui/icons/Send";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Box from "@material-ui/core/Box";
import { useParams, Link } from "react-router-dom";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import "react-multi-email/style.css";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import ParticipantTable from "../components/ParticipantTable";
import FeedbackTable from "../components/FeedbackTable";
import { formatDate } from '../helpers/dateHelper';
import { Doughnut, Bar } from "react-chartjs-2";
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
  },
  label: {
	backgroundColor: "white"
  },
  recipients: {
	marginTop: 16,
	marginBottom: 8,
	borderColor: "rgba(0, 0, 0, 0.23) !important"
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
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const { authState } = useAuth();
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleBodyChange = e => {
    setBody(e.target.value);
  };

  const handleRecipientsChange = e => {
	setRecipients(e);
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
		  setRecipients(response.data[0].participants.map(p => p.email));
      } else {
        setErrors(response.errors);
      }
    }
    getEvent();

    return () => {};
  }, []);

  const handleFeedbackSubmit = async () => {
    let response = await post(config.SEND_FEEDBACK_EMAIL_POST_URL, {
      EventId: id,
      Data: ""
    });

    if (response.success) {
      let tempEvent = { ...event };
      tempEvent.sentFeedback = true;
      setEvent(tempEvent);
      setSuccessOpen(true);
    }
  };

  const handleEmailSubmit = async () => {
    let response = await post(config.SEND_GENERIC_EMAIL_POST_URL, {
	  Data: {
		Recipient_List: recipients,
        Title_Header: subject,
        Body_Copy: body
      },
      EventId: id
    });

    if (response.success) {
      setSuccessOpen(true);
      setSubject("");
      setBody("");
    } else {
      setErrors(response.errors);
    }
  };
  const data = {
    labels: ["Negative", "Neutral", "Positive"],
    datasets: [
      {
        data: [
          event.feedback.filter(e => e.score <= -0.5).length,
          event.feedback.filter(e => e.score > -0.5 && e.score < 0.5).length,
          event.feedback.filter(e => e.score >= 0.5).length
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#00FF7F"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#00FF7F"]
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
        backgroundColor: "rgba(121,7,242,0.3)",
        borderColor: "rgba(121,7,242,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(121,7,242,0.5)",
        hoverBorderColor: "rgba(121,7,242,1)",
        data: [
          event.participants.length,
		  event.participants.filter(e => e.isConfirmed === true).length,
		  event.participants.filter(e => e.feedbackSent === true).length,
          event.feedback.length
        ]
      }
    ]
  };

  const options = {
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            steps: 10,
            max:
              event.participants.length +
              10 -
              ((event.participants.length + 10) % 10)
          }
        }
      ]
    }
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
          setSuccessOpen(true);
        })
        .catch(function() {});
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {event.title}
	  </Typography>
	  <Typography variant="subtitle1" gutterBottom>
		<b>Date:</b> {formatDate(event.startDate)} - {formatDate(event.endDate)}
	  </Typography>
	  <Typography variant="subtitle1" gutterBottom>
		<b>Description:</b> {event.description}
	  </Typography>
	  <br />
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
          <Tab label={"Send Email"} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {event.participants && (
			<ParticipantTable participants={event.participants} isViewAll={false} />
          )}
          <Grid item xs={12}>
            <ButtonGroup
              fullWidth
              aria-label="full width outlined button group"
            >
              <Button startIcon={<CloudUploadIcon />}>
                <FilePicker
                  extensions={["csv"]}
                  onChange={handleFileChange}
                  onError={errMsg => {}}
                >
                  <div>Upload Emails</div>
                </FilePicker>
              </Button>
              <Button
                startIcon={<CloudDownloadIcon />}
                component="a"
                href={
                  "/api/Csv/Download?eventID=" +
                  event.id +
                  "&token=" +
                  authState.token
                }
              >
                Download Emails
              </Button>
              <Button
                startIcon={<BorderColorIcon />}
                component={Link}
                to={`/event/add-email/${event.id}`}
              >
                Add Emails
              </Button>
              <Button
                startIcon={<SendIcon />}
                disabled={event.sentFeedback ? true : false}
                onClick={handleFeedbackSubmit}
              >
                Send Feedback Email (All)
              </Button>
            </ButtonGroup>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box>
            {event.feedback && (
              <>
                <Grid container>
                  <Grid item xs={6}>
                    <Doughnut data={data} />
                  </Grid>
                  <Grid item xs={6}>
                    <Bar
                      data={data2}
                      width={100}
                      height={50}
                      options={options}
                    />
                  </Grid>
				</Grid>
				<br/>
                <FeedbackTable
                  feedbacks={event.feedback}
                />
              </>
            )}
          </Box>
        </TabPanel>
		<TabPanel value={value} index={2} dir={theme.direction}>
		  <Box display="flex" flexDirection="column">
			  <ReactMultiEmail
				className={classes.recipients}
				placeholder={
						<div style={{ color: 'rgba(0, 0, 0, 0.54)' }}>To *</div>
				}
				emails={recipients}
				value={recipients}
				onChange={handleRecipientsChange}
				validateEmail={email => {
					return isEmail(email);
				}}
				getLabel={(
					email: string,
					index: number,
					removeEmail: (index: number) => void,
				) => {
					return (
						<div data-tag key={index}>
							{email}
							<span data-tag-handle onClick={() => removeEmail(index)}>
								x
							</span>
						</div>
					);
				}}
			/>
            <TextField
              autoFocus
              label="Subject *"
              className={classes.textField}
              value={subject}
              onChange={handleSubjectChange}
              InputLabelProps={{
                classes: {
                  root: classes.label
                }
              }}
              margin="normal"
              variant="outlined"
              error={Boolean(errors["Data.Subject"])}
              helperText={errors["Data.Subject"]}
            />
            <TextField
              id="outlined-multiline-static"
              label="Body *"
              className={classes.textField}
              value={body}
              onChange={handleBodyChange}
              InputLabelProps={{
                classes: {
                  root: classes.label
                }
              }}
              margin="normal"
              variant="outlined"
              multiline
              rows="10"
              error={Boolean(errors["Data.Body"])}
              helperText={errors["Data.Body"]}
            />
            <br />
            <Button
              color="primary"
              variant="contained"
              onClick={handleEmailSubmit}
            >
              Send Email
            </Button>
          </Box>
          <Dialog
            onClose={handleSuccessClose}
            open={successOpen}
            fullWidth
            PaperProps={{ style: { maxWidth: 400 } }}
          >
            <DialogTitle align="center">
              <Avatar style={{ backgroundColor: "#00cc00" }}>
                <CheckIcon fontSize="large" />
              </Avatar>
              Success!
            </DialogTitle>
            <DialogContent align="center"></DialogContent>
            <DialogActions>
              <Button onClick={handleSuccessClose} variant="contained">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
