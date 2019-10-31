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

export default function RemoveEmail({ token }) {
  const classes = useStyles();

  const [success, setSuccess] = useState(false);
  const [removing, setRemoving] = useState(true);
  const { post } = useRequest();

  useEffect(() => {
    async function unsub() {
      let response = await post(config.REMOVE_EMAIL_POST_URL, { Data: token });
      if (response.success) setRemoving(false);
    }
    unsub();
    return () => {};
  }, []);

  return (
    <div>
      <Dialog open={true} fullWidth PaperProps={{ style: { maxWidth: 400 } }}>
        <DialogTitle>Remove Email</DialogTitle>
        <DialogContent align="center">
          <Typography gutterBottom>
            {removing
              ? "Loading"
              : "Your email has successfully been removed from our mailing list."}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
