import React, { useEffect, useState } from "react";
import EventTable from "../components/EventTable";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import { Typography } from "@material-ui/core";

export default function ViewEvents() {
  const { get } = useRequest();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
        setEvents(response.data);
      } else {
      }
      setLoading(false);
    }
    getEvents();
    return () => {};
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <EventTable events={events} setEvents={setEvents} loading={loading} />
    </div>
  );
}
