/*import { UserIsValid, login } from '../helpers/authHelper';
import { withRouter, Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config.json';

class Login extends Component {

	onFailure = (error) => {
		console.error(error);
	};

	googleResponse = (response) => {
		if (!response.tokenId) {
			console.error("Unable to get tokenId from Google", response)
			return;
		}

		const tokenBlob = new Blob([JSON.stringify({ tokenId: response.tokenId }, null, 2)], { type: 'application/json' });
		const options = {
			method: 'POST',
			body: tokenBlob,
			mode: 'cors',
			cache: 'default'
		};
		fetch(config.GOOGLE_AUTH_CALLBACK_URL, options)
		.then((response) => {
			return response.json();
		})
		.then(data => {
			const token = data.token;
			this.props.login(token);
		})
		.catch(error => {
			console.error(error);
			alert('An error occurred while logging you in. Please try again.');
		});
	};

	render() {
		let content = UserIsValid(this.props.auth) ?
		(
			<div>
				<Redirect to={{
					pathname: this.props.location.state == null ? '/' : this.props.location.state.from.pathname
				}} />
			</div>
		) : (
			<div>
				<GoogleLogin
				clientId={config.GOOGLE_CLIENT_ID}
				buttonText="Google Login"
				onSuccess={this.googleResponse}
				onFailure={this.onFailure}
				/>
			</div>
		);

		return (
			<div className="form-horizontal">

				<h2>Welcome!</h2>

				<br />

				<p>Please login using your <strong>Google</strong> account.</p>

				<hr />

				{content}

			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
        auth: state.auth,
        signalR: state.signalR
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		login: (token) => {
			dispatch(login(token));
		}
	}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
*/
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
import { Formik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
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
