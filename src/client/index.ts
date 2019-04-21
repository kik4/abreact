import * as polyfill from "./polyfill";
polyfill.set();
require("es6-promise").polyfill();

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

ReactDOM.hydrate(React.createElement(App), document.getElementById("root"));
