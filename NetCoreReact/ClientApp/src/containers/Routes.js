import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import CreateEvent from "../pages/CreateEvent";
import EventIntake from "../pages/EventIntake";
import ViewEvents from "../pages/ViewEvents";
import ViewEvent from "../pages/ViewEvent";
import ViewEmails from "../pages/ViewEmails";
import Help from "../pages/Help";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/event/create" component={CreateEvent} />
	  <Route path="/event/add-email/:id" component={EventIntake} />
      <Route path="/event/view-events" component={ViewEvents} />
      <Route path="/event/:id" component={ViewEvent} />

      <Route path="/view-emails" component={ViewEmails} />

      <Route path="/help" component={Help} />

      <Route component={NotFound} />
    </Switch>
  );
}
