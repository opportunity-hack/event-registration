import React, { useState } from "react";
import { Box, Typography, Button, TextField, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useRequest from "../hooks/useRequest";
import CheckIcon from "@material-ui/icons/Check";
import config from "../config.json";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3)
  },
  textField: {
    width: 500,
    maxWidth: "100%"
  }
}));

export default function Feedback({ token }) {
  const classes = useStyles();
  const { post } = useRequest();
  const [body, setBody] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleBodyChange = e => {
    setBody(e.target.value);
  };

  const handleFeedbackSubmit = async () => {
    let response = await post(config.POST_FEEDBACK_RESPONSE_POST_URL, {
      Data: {
        Body: body,
        DateEntered: new Date(),
        Token: token
      }
    });
    if (response.success) {
      setSuccess(true);
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <div>
      {success ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          alignContent="center"
          justifyContent="center"
          p={2}
          className={classes.root}
        >
          <Avatar style={{ backgroundColor: "#00cc00" }}>
            <CheckIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4">Response Sent</Typography>
        </Box>
      ) : (
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          className={classes.root}
        >
          <Typography variant="h4" align="center">Give us some feedback!</Typography>
          <Typography color="textSecondary" gutterBottom align="center">
            How was your experience at Zuri's Circle?
          </Typography>
          <TextField
            id="outlined-multiline-static"
            label="Feedback"
            autoFocus
            multiline
            fullWidth
            rows="5"
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
            onClick={handleFeedbackSubmit}
            className={classes.textField}
          >
            Submit
          </Button>
        </Box>
      )}
    </div>
  );
}
