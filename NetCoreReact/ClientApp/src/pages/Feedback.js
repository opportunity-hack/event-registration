import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
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
    width: 300
  }
}));

export default function Feedback({ token }) {
  const classes = useStyles();
  const { post } = useRequest();
  const [body, setBody] = useState("");
  const [success, setSuccess] = useState(true);
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
          <Typography variant="h4">Feedback</Typography>
          <Typography color="textSecondary" gutterBottom>
            How was your experience?
          </Typography>
          <TextField
            id="outlined-multiline-static"
            label="Feedback"
            autoFocus
            multiline
            rows="4"
            defaultValue="Default Value"
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
          >
            Send
          </Button>
        </Box>
      )}
    </div>
  );
}
