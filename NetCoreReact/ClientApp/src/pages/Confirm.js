import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NavigationBar from "../components/NavigationBar";
import useRequest from "../hooks/useRequest";
import config from "../config.json";

const useStyles = makeStyles(theme => ({
  root: {}
}));

export default function Confirm({ token }) {
  const classes = useStyles();

  const [success, setSuccess] = useState(false);
  const [confirming, setConfirming] = useState(true);
  const { post } = useRequest();

  useEffect(() => {
    async function confirm() {
      let response = await post(config.CONFIRM_EMAIL_POST_URL, { Data: token });
      if (response.success) setConfirming(false);
    }
    confirm();

    return () => {};
  }, []);

  return (
    <div>
      <Dialog open={true} fullWidth PaperProps={{ style: { maxWidth: 400 } }}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent align="center">
          <Typography gutterBottom>
            {confirming ? "Loading" : "Your email has been confirmed! Keep an eye out for future emails to stay up to date with our events :)"}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
