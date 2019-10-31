import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from "@material-ui/core";
import useRequest from "../hooks/useRequest";
import config from "../config.json";

export default function RemoveEmail({ token }) {
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
        <DialogTitle>Email Removed</DialogTitle>
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
