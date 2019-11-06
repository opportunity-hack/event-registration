import React, { useState, useEffect } from "react";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import useAuth from "../hooks/useAuth";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useParams } from "react-router-dom";
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import "react-multi-email/style.css";
import {
	Box,
	Button,
	TextField,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	makeStyles,
	ButtonGroup,
	AppBar,
	Tabs,
	Tab
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from '@material-ui/icons/Close';
import ParticipantTable from "../components/ParticipantTable";
import FeedbackTable from "../components/FeedbackTable";
import { Doughnut, Bar } from "react-chartjs-2";

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
		borderColor: "rgba(0, 0, 0, 0.23) !important",
		maxHeight: "300px",
		overflowY: "scroll"
	}
}));

export default function ViewEmails() {
  const classes = useStyles();
  const { authState } = useAuth();
  const { id } = useParams();
  const [errors, setErrors] = useState([]);
  const { get, post } = useRequest();
  const [events, setEvents] = useState({ feedback: [], participants: [], sentFeedback: false });
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [numberSignUps, setNumberSignUps] = React.useState(0);
  const [numberFeedback, setNumberFeedback] = React.useState(0);
  const [body, setBody] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [failureOpen, setFailureOpen] = React.useState(false);

  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
		let participants = [];
		let feedback = [];
		let numSignUps = 0;
		let numFeedback = 0;

		response.data.forEach(e => {
			e.feedback.forEach(f => {
				feedback.push(f);
			});
			e.participants.forEach(p => {
				++numSignUps;
				if (p.feedbackSent) {
					++numFeedback;
				}
				if (participants.length === 0) {
					participants.push(p);
				}
				else {
					var duplicate = participants.filter(o => o.email.toUpperCase() === p.email.toUpperCase());
					if (duplicate.length === 0) {
						participants.push(p);
					}
					else {
						if (!duplicate[0].isConfirmed && p.isConfirmed) {
							participants.forEach(current => {
								if (current.email.toUpperCase() === p.email.toUpperCase()) {
									current.isConfirmed = true;
								}
							});
						}
					}
				}
			});
		});

		var events = { feedback: feedback, participants: participants, sentFeedback: false };
		setEvents(events);
		setRecipients(participants.map(p => p.email));
		setNumberSignUps(numSignUps);
		setNumberFeedback(numFeedback);
	  } else {
		setErrors(response.errors);
      }
    }
    getEvents();
    return () => {};
  }, []);

	const handleSuccessClose = () => {
		setSuccessOpen(false);
	};

	const handleFailureClose = () => {
		setFailureOpen(false);
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
			setFailureOpen(true);
		}
	};
	const data1 = {
		labels: ["Negative", "Neutral", "Positive"],
		datasets: [
			{
				data: [
					events.feedback.filter(e => e.score <= -0.5).length,
					events.feedback.filter(e => e.score > -0.5 && e.score < 0.5).length,
					events.feedback.filter(e => e.score >= 0.5).length
				],
				backgroundColor: ["#FF6384", "#36A2EB", "#00FF7F"],
				hoverBackgroundColor: ["#FF6384", "#36A2EB", "#00FF7F"]
			}
		]
	};

	const data2 = {
		labels: [
			"Emails",
			"Confirmed Emails",
			"Feedback Sent",
			"Feedback Received"
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
					numberSignUps,
					events.participants.filter(e => e.isConfirmed === true).length,
					numberFeedback,
					events.feedback.length
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
							numberSignUps +
							10 -
							((numberSignUps + 10) % 10)
					}
				}
			]
		}
	};

	return (
		<div className={classes.root}>
			<Typography variant="h4" gutterBottom>
				All Event Emails
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
							"All Participants (" +
							(events.participants ? events.participants.length : "0") +
							")"
						}
					/>
					<Tab
						label={
							"All Feedback (" +
							(events.feedback ? events.feedback.length : "0") +
							")"
						}
					/>
					<Tab label={"Send All Email"} />
				</Tabs>
			</AppBar>
			<SwipeableViews
				axis={theme.direction === "rtl" ? "x-reverse" : "x"}
				index={value}
				onChangeIndex={handleChangeIndex}
			>
				<TabPanel value={value} index={0} dir={theme.direction}>
					{events.participants && (
						<ParticipantTable participants={events.participants} isViewAll={true}/>
					)}
					<Grid item xs={12}>
						<ButtonGroup
							fullWidth
							aria-label="full width outlined button group"
						>
							<Button
								startIcon={<CloudDownloadIcon />}
								component="a"
								href={
									config.DOWNLOAD_ALL_EMAILS_GET_URL + "?token=" + authState.token
								}
							>
								Download Emails (All)
							</Button>
						</ButtonGroup>
					</Grid>
				</TabPanel>
				<TabPanel value={value} index={1} dir={theme.direction}>
					<Box>
						{events.feedback && (
							<>
								<Grid container>
									<Grid item xs={6}>
										<Doughnut data={data1} />
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
								<br />
								<FeedbackTable
									feedbacks={events.feedback}
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
					<Dialog
						onClose={handleFailureClose}
						open={failureOpen}
						fullWidth
						PaperProps={{ style: { maxWidth: 400 } }}
					>
						<DialogTitle align="center">
							<Avatar style={{ backgroundColor: "#ff0000" }}>
								<CloseIcon fontSize="large" />
							</Avatar>
							Failure: {errors["*"]}
						</DialogTitle>
						<DialogContent align="center"></DialogContent>
						<DialogActions>
							<Button onClick={handleFailureClose} variant="contained">
								Close
							</Button>
						</DialogActions>
					</Dialog>
				</TabPanel>
			</SwipeableViews>
		</div>
  );
}