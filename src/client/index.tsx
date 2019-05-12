import * as polyfill from "./polyfill";
polyfill.set();

import React from "react";
import { hydrate } from "react-dom";
import App from "../common/app/App";
import { Helmet } from "react-helmet";
import StyleContext from "isomorphic-style-loader/StyleContext";
import router, { ResolvedData } from "../common/app/router";
import { oc } from "ts-optchain";
import * as TmpData from "@@/.abreact/_tmp";

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

const pathname = document.location.pathname;
router.resolve(pathname).then((action: ResolvedData) => {
  hydrate(
    <StyleContext.Provider value={{ insertCss }}>
      <Helmet
        titleTemplate={oc(TmpData).config.head.titleTemplate("%s")}
        defaultTitle={oc(TmpData).config.head.defaultTitle("")}
      />
      <App initialState={action} />
    </StyleContext.Provider>,
    document.getElementById("root"),
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
