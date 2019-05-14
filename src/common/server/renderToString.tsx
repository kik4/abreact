import React from "react";
import { renderToString } from "react-dom/server";
import webpack from "webpack";
import { oc } from "ts-optchain";
const StyleContext = require("isomorphic-style-loader/StyleContext");
import { Helmet } from "react-helmet";
import router, { ResolvedData } from "../app/router";
import App from "../app/App";
import * as TmpData from "@@/.abreact/_tmp";

export default async (pathname: string, clientStats: webpack.Stats) => {
  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles: any[]) =>
    styles.forEach((style: any) => css.add(style._getCss()));

  const action = (await router.resolve(pathname)) as ResolvedData;
  const body = renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <Helmet
        titleTemplate={oc(TmpData).config.head.titleTemplate("%s")}
        defaultTitle={oc(TmpData).config.head.defaultTitle("")}
      />
      <App initialState={action} />
    </StyleContext.Provider>,
  );
  const helmet = Helmet.renderStatic();

  return `
<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
<head>
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${helmet.link.toString()}
  <style>${[...Array.from(css)].join("")}</style>
</head>
<body ${helmet.bodyAttributes.toString()}>
  <div id="root">${body}</div>
  <script src="/client.bundle.js?${clientStats.hash}"></script>
</body>
</html>
`;
};
