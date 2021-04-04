import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/layout/App";
import { Provider } from "react-redux";
import { ReduxStore } from "./app/stores/reduxStore";
import { Router } from "react-router-dom";
import {createBrowserHistory} from 'history';
import 'semantic-ui-css/semantic.min.css'

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={ReduxStore}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
