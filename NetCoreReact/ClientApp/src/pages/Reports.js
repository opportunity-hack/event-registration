import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Box, Button } from "@material-ui/core";
import ReactApexChart from "react-apexcharts";
import useRequest from "../hooks/useRequest";
import config from "../config.json";

function median(values) {
  if (values.length === 0) return 0;

  values.sort(function(a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

export default function Reports() {
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const { get } = useRequest();

  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
        setEvents(response.data);

        let newData = response.data.map(event => ({
          x: event.title,
          y: [
            Math.min(event.feedback.map(f => f.score)),
            median(
              event.feedback
                .map(f => f.score)
                .splice(
                  0,
                  Math.ceil(event.feedback.map(f => f.score).lenght / 2)
                )
            ),
            median(
              event.feedback
                .map(f => f.score)
                .splice(
                  1,
                  Math.ceil(event.feedback.map(f => f.score).lenght / 2)
                )
            ),
            Math.max(event.feedback.map(f => f.score))
          ]
        }));
        setData(newData);
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
    <div>
      <Box>
        <Button variant="contained">Export All Emails</Button>
        <ReactApexChart
          options={{
            title: {
              text: "CandleStick Chart",
              align: "left"
            },
            xaxis: {
              type: "datetime"
            },
            yaxis: {
              tooltip: {
                enabled: true
              }
            }
          }}
          series={series}
          type="candlestick"
          height="350"
          className={classes.candleStick}
        />
      </Box>
    </div>
  );
}
