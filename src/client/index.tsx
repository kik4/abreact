import * as polyfill from "./polyfill";
polyfill.set();
require("es6-promise").polyfill();

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Helmet } from "react-helmet";
import StyleContext from "isomorphic-style-loader/StyleContext";
import router, { ResolvedData } from "../common/app/router";
import * as TmpData from "../tmp/client";
import { oc } from "ts-optchain";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const pathname = document.location.pathname;
router.resolve(pathname).then((action: ResolvedData) => {
  ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <Helmet
        titleTemplate={oc(TmpData).config.head.titleTemplate("%s")}
        defaultTitle={oc(TmpData).config.head.defaultTitle("")}
      />
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
