import React from "react";
import ReactDOM from "react-dom";
import Conference from "./components/conference";
import { Provider } from "react-redux";
import store from "./store";
import "./i18n";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Conference />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
