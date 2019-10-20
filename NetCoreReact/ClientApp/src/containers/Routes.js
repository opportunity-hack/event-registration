import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Logout from "../components/Logout";
import Login from "../components/Login";
import Home from "../pages/Home";
import CreateEvent from "../pages/CreateEvent";
import EventIntake from "../pages/EventIntake";
import UpcomingEvents from "../pages/UpcomingEvents";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />

      <Route path="/event/create" component={CreateEvent} />
      <Route path="/event/intake/:id" component={EventIntake} />
      <Route path="/event/upcoming" component={UpcomingEvents} />

      <Route component={NotFound} />
    </Switch>
  );
}
