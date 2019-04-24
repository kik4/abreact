import * as polyfill from "./polyfill";
polyfill.set();
require("es6-promise").polyfill();

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import StyleContext from "isomorphic-style-loader/StyleContext";
import router, { ResolvedData } from "../common/app/router";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const pathname = document.location.pathname;
router.resolve(pathname).then((action: ResolvedData) => {
  ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <App initialState={action} />
    </StyleContext.Provider>,
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