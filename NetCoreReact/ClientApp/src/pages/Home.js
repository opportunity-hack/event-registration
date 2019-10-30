import React from "react";
import { Typography, Box } from "@material-ui/core";
import Calendar from "../components/Calendar";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        Zuri's Dashboard
      </Typography>

      <Calendar />
    </Box>
  );
}
