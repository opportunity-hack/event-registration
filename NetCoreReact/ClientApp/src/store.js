import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import signalR from "./reducers/signalRReducer";
import { createLogger } from "redux-logger";
import auth from "./reducers/authReducer";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(
  combineReducers({
    auth,
    signalR
  }),
  {},
  composeEnhancers(applyMiddleware(createLogger(), thunk))
);
