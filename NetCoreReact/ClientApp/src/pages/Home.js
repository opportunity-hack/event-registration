import React, { useState, useEffect } from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import MonthlyEvents from "react-monthly-events";
import useRequest from "../hooks/useRequest";
import config from "../config.json";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  image: {
    marginTop: theme.spacing(5),
    width: "90%",
    maxWidth: "500px"
  }
}));

export default function Home() {
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const { get } = useRequest();
  const classes = useStyles();

  const { getToken, logout, authState } = useAuth();

  const currentMonth = new Date();
  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
        setEvents(response.data);

        let newData = response.data.map(event => ({
          id: event.id,
          start: event.startDate,
          end: event.endDate,
          allDay: "false",
          event: event.description
        }));
        setData(newData);
        const calevents = newData;
      } else {
      }
    }
    getEvents();
    return () => {};
  }, []);
  const series = [
    {
      data: data
    }
  ];
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <Typography variant="h4" gutterBottom>
        Opportunity Hack 2019
      </Typography>
      <Typography gutterBottom color="textSecondary">
        .NET Core 3.0 + React-Redux + ML.NET = Awesomeness
      </Typography>

      {authState.isAuthenticated && (
        <>
          <Typography gutterBottom>
            Welcome, {Cookies.get("User-Email")}
          </Typography>

          <img
            className={classes.image}
            src="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/data_report_bi6l.svg"
          />
        </>
      )}
    </Box>
  );
}
