import * as polyfill from "./polyfill";
polyfill.set();
require("es6-promise").polyfill();

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import router, { ResolvedData } from "../common/app/router";

const pathname = document.location.pathname;
router.resolve(pathname).then((action: ResolvedData) => {
  ReactDOM.hydrate(
    React.createElement(App, { initialState: action }),
    document.getElementById("root")
  );
});

// because this file depends on route depends on pages will hmr
if ((module as any).hot) {
  (module as any).hot.accept(function(err) {
    if (err) {
      console.error(err);
    }
  });
}
