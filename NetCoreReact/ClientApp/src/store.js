import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import auth from "./reducers/authReducer";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(combineReducers({ auth }), {}, composeEnhancers(applyMiddleware(createLogger(), thunk)));