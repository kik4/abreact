import React from "react";
import { renderToString } from "react-dom/server";
import webpack = require("webpack");
import { Helmet } from "react-helmet";
import StyleContext from "isomorphic-style-loader/StyleContext";
import App from "./app";
import router, { ResolvedData } from "../common/app/router";
import * as TmpData from "../tmp/server";
import { oc } from "ts-optchain";

const serverRenderer = ({
  clientStats,
  serverStats
}: {
  clientStats: webpack.Stats;
  serverStats: webpack.Stats;
}) => {
  return async (req: Request, res, next) => {
    const css = new Set(); // CSS for all rendered React components
    const insertCss = (...styles) =>
      styles.forEach(style => css.add(style._getCss()));

    const pathname = req.url;
    const action = (await router.resolve(pathname)) as ResolvedData;
    const body = renderToString(
      <StyleContext.Provider value={{ insertCss }}>
        <Helmet
          titleTemplate={oc(TmpData).config.head.titleTemplate("%s")}
          defaultTitle={oc(TmpData).config.head.defaultTitle("")}
        />
        <App initialState={action} />
      </StyleContext.Provider>
    );
    const helmet = Helmet.renderStatic();

    res.status(200).send(`
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
`);
  };
};
export default serverRenderer;
