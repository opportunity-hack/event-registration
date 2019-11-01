import React, { Component } from "react";
import Theme from "./containers/Theme";
import { CssBaseline } from "@material-ui/core";
import Template from "./containers/Template";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
class App extends Component {
  static displayName = "Zuri's Dashboard";

  render() {
    return (
      <Provider store={store}>
        <Theme>
          <CssBaseline />
          <Router>
            <Template />
          </Router>
        </Theme>
      </Provider>
    );
  }
}

export default App;
