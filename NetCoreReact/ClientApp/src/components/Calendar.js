import React, { useState, useEffect } from "react";
import {
  Calendar as ReactBigCalendar,
  momentLocalizer
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    height: "100%",
    width: "100%"
  }
}));

export default function Calendar() {
  const classes = useStyles();
  const { get } = useRequest();
  const [events, setEvents] = useState([]);
  let history = useHistory();
  const handleSelectEvent = e => {
    history.push("/event/" + e.id);
  };

  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
        setEvents(
          response.data.map(e => {
            return {
              start: new Date(e.startDate),
              end: new Date(e.endDate),
              title: e.title,
              id: e.id
            };
          })
        );
      }
    }
    getEvents();
    return () => {};
  }, []);

  return (
    <div className={classes.root}>
      <ReactBigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
}
