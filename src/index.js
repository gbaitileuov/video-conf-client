import React from "react";
import ReactDOM from "react-dom";
import Conference from "./components/conference";
import { Provider } from "react-redux";
import store from "./store";
import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Conference />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
