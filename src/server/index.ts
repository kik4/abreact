import React from "react";
import { renderToString } from "react-dom/server";
import webpack = require("webpack");
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
    const pathname = req.url;
    const action = (await router.resolve(pathname)) as ResolvedData;

    res.status(200).send(`
<!doctype html>
<html>
<head>
    <title>App</title>
</head>
<body>
    <div id="root">${renderToString(
      React.createElement(App, { initialState: action })
    )}</div>
    <script src="/client.bundle.js?${clientStats.hash}"></script>
</body>
</html>
`);
  };
};
export default serverRenderer;
