import React, { Component, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogContentText,
  Typography,
  Box
} from "@material-ui/core";
import useAuth from "../hooks/useAuth";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import { GoogleLogin } from "react-google-login";
import config from "../config.json";
import useRequest from "../hooks/useRequest";

const useStyles = makeStyles(theme => ({
  root: {}
}));

export default function Login({ open, close }) {
  const classes = useStyles();
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { post } = useRequest();

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setErrors([]);
    }
  }, [open]);

  const responseGoogle = async googleResponse => {
    if (googleResponse.tokenId) {
      setSubmitting(true);
      setErrors([]);

      let response = await post(config.GOOGLE_AUTH_CALLBACK_URL, {
        tokenId: googleResponse.tokenId
      });

      if (response.success) {
        login(response.data[0]);
        setSuccess(true);
      } else {
        setErrors(response.errors);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        onClose={close}
        open={open}
        fullWidth
        PaperProps={{ style: { maxWidth: 400 } }}
      >
        {!success && (
          <>
            <DialogTitle>Sign in</DialogTitle>
            <DialogContent align="center">
              <Typography gutterBottom>
                Only Google sign in is currently supported.
              </Typography>
              <GoogleLogin
                clientId={config.GOOGLE_CLIENT_ID}
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                theme="dark"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={close} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
        {success && (
          <>
            <DialogTitle align="center">Successfully Signed in</DialogTitle>
            <DialogContent align="center">
              <Avatar style={{ backgroundColor: "#00cc00" }}>
                <CheckIcon fontSize="large" />
              </Avatar>
            </DialogContent>
            <DialogActions>
              <Button onClick={close} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
