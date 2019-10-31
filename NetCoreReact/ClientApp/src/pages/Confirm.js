import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from "@material-ui/core";
import useRequest from "../hooks/useRequest";
import config from "../config.json";

export default function Confirm({ token }) {
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
        <DialogTitle>Success!</DialogTitle>
        <DialogContent align="center">
          <Typography gutterBottom>
            {confirming ? "Loading" : "Your email has been confirmed! Keep an eye out for future emails to stay up to date with our events :)"}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
