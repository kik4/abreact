import React from "react";
import { renderToString } from "react-dom/server";
import webpack = require("webpack");
import App from ".//app";

const serverRenderer = ({
  clientStats,
  serverStats
}: {
  clientStats: webpack.Stats;
  serverStats: webpack.Stats;
}) => {
  return (req: Request, res, next) => {
    res.status(200).send(`
<!doctype html>
<html>
<head>
    <title>App</title>
</head>
<body>
    <div id="root">${renderToString(
      React.createElement(App, { pathname: req.url })
    )}</div>
    <script src="/client.bundle.js?${clientStats.hash}"></script>
</body>
</html>
`);
  };
};
export default serverRenderer;
