import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import useRequest from "../hooks/useRequest";
import config from "../config.json";
import useAuth from "../hooks/useAuth";
import { Line, Bar } from "react-chartjs-2";

const useStyles = makeStyles(theme => ({
  graph: {
    marginTop: theme.spacing(2)
  }
}));

export default function Reports() {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const { get } = useRequest();
  const { authState } = useAuth();
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    async function getEvents() {
      let response = await get(config.GET_ALL_EVENTS_GET_URL, {});
      if (response.success) {
        setEvents(response.data);

        let scores = [];
        let labels = [];
        let positives = [];
        let negatives = [];

        response.data.forEach(e => {
          let total = 0;
          let totalPositive = 0;
          let totalNegative = 0;
          e.feedback.forEach(f => {
            total += f.score;
            if (f.score > 0) totalPositive++;
            else totalNegative++;
          });
          scores.push(total / e.feedback.length);
          labels.push(e.title);
          positives.push(totalPositive);
          negatives.push(totalNegative);
        });

        let newData = {
          labels: labels,
          datasets: [
            {
              label: "Positive Feedback Score Average Over Time",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: scores
            }
          ]
        };
        setData(newData);

        const barData = {
          labels: labels,
          datasets: [
            {
              label: "Positive Feedback Responses",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              data: positives
            },
            {
              label: "Negative Feedback Responses",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.4)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: negatives
            }
          ]
        };
        setBarData(barData);
      } else {
      }
    }
    getEvents();
    return () => {};
  }, []);

  return (
    <div>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Button
          variant="contained"
          component="a"
          href={
            config.DOWNLOAD_ALL_EMAILS_GET_URL + "?token=" + authState.token
          }
        >
          Export All Emails
        </Button>
        <div className={classes.graph} />
        <Line data={data} />

        <div className={classes.graph} />
        <Bar data={barData} className={classes.graph} />
      </Box>
    </div>
  );
}
