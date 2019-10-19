import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Logout from "../components/Logout";
import Login from "../components/Login";
import Home from "../pages/Home";
import SampleComponent from "../components/SampleComponent";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/sample-route" component={SampleComponent} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route component={NotFound} />
    </Switch>
  );
}
