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
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import CheckIcon from "@material-ui/icons/Check";

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

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleStartDateChange = date => {
    setStartDate(date);
  };

  const handleEndDateChange = date => {
    setEndDate(date);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSuccess(false);
  };

  const handleSubmit = async () => {
    const response = await post(config.CREATE_EVENT_POST_URL, {
      Title: title,
      Description: description,
      StartDate: startDate,
      EndDate: endDate
    });
    if (response.success) {
      setSuccess(true);
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <div>
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
            <TextField
              autoFocus
              label="Title *"
              className={classes.textField}
              value={title}
              onChange={handleTitleChange}
              margin="normal"
              variant="outlined"
              error={Boolean(errors["Title"])}
              helperText={errors["Title"]}
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
              error={Boolean(errors["Description"])}
              helperText={errors["Description"]}
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
                  disablePast
                  error={Boolean(errors["StartDate"])}
                  helperText={errors["StartDate"]}
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
                  disablePast
                  error={Boolean(errors["EndDate"])}
                  helperText={errors["EndDate"]}
                />
              </Box>
            </MuiPickersUtilsProvider>
            <Button
              color="primary"
              variant="contained"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </div>
  );
}
