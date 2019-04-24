import React from "react";
import { renderToString } from "react-dom/server";
import webpack = require("webpack");
import StyleContext from "isomorphic-style-loader/StyleContext";
import App from "./app";
import router, { ResolvedData } from "../common/app/router";

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
        <App initialState={action} />
      </StyleContext.Provider>
    );

    res.status(200).send(`
<!doctype html>
<html>
<head>
    <title>Abreact</title>
    <style>${[...Array.from(css)].join("")}</style>
</head>
<body>
    <div id="root">${body}</div>
    <script src="/client.bundle.js?${clientStats.hash}"></script>
</body>
</html>
`);
  };
};
export default serverRenderer;
