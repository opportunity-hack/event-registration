import "date-fns";
import React, { useState } from "react";
import {
  Typography,
  TextField,
  makeStyles,
  Box,
  Button,
  Avatar
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import CheckIcon from "@material-ui/icons/Check";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: 500
  },
  margin: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  },
  submit: {
    marginTop: theme.spacing(2)
  },
  avatar: {
    backgroundColor: "green",
    marginRight: theme.spacing(1)
  }
}));

export default function CreateEvent() {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errors, setErrors] = useState([]);
  const { post } = useRequest();
  const [success, setSuccess] = useState(false);
  const [eventId, setEventId] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleStartDateChange = date => {
	date.setHours(0, 0, 0, 0);
	setStartDate(date);
  };

  const handleEndDateChange = date => {
	date.setHours(23, 59, 59, 999);
	setEndDate(date);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSuccess(false);
    setEventId(0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const response = await post(config.CREATE_EVENT_POST_URL, {
      Data: {
        Title: title,
        Description: description,
        StartDate: startDate,
        EndDate: endDate
      }
    });
    if (response.success) {
      setSuccess(true);
      setEventId(response.data[0].id);
    } else {
      setErrors(response.errors);
    }
    setSubmitting(false);
  };

  return (
    <Box display="flex" flexDirection="column" className={classes.form}>
      {success ? (
        <>
          <Box display="flex">
            <Avatar className={classes.avatar}>
              <CheckIcon />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              Event Created!
            </Typography>
          </Box>
          <Box className={classes.submit}>
            <Button
              color="primary"
              variant="contained"
              className={classes.margin}
              component={Link}
			  to={`/event/add-email/${eventId}`}
            >
              Go to event
            </Button>
            <Button
              color="default"
              variant="contained"
              className={classes.margin}
              onClick={resetForm}
            >
              Create another
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Create an Event
          </Typography>
          <Typography color="textSecondary">
            Fill out the form below to create an event.
          </Typography>
          <TextField
            autoFocus
            label="Title *"
            className={classes.textField}
            value={title}
            onChange={handleTitleChange}
            margin="normal"
            variant="outlined"
            error={Boolean(errors["Data.Title"])}
            helperText={errors["Data.Title"]}
          />
          <TextField
            label="Description *"
            className={classes.textField}
            value={description}
            onChange={handleDescriptionChange}
            margin="normal"
            variant="outlined"
            multiline
            rows="4"
            error={Boolean(errors["Data.Description"])}
            helperText={errors["Data.Description"]}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Start Date *"
                value={startDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
                className={classes.margin}
                error={Boolean(errors["Data.StartDate"])}
                helperText={errors["Data.StartDate"]}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="End Date *"
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
                className={classes.margin}
                error={Boolean(errors["Data.EndDate"])}
                helperText={errors["Data.EndDate"]}
              />
            </Box>
          </MuiPickersUtilsProvider>
          <Button
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={submitting}
          >
            Submit
          </Button>
        </>
      )}
    </Box>
  );
}
