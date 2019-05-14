import webpack from "webpack";
import renderToString from "../common/server/renderToString";
import express from "express";

const serverRenderer = ({
  clientStats,
  serverStats,
}: {
  clientStats: webpack.Stats;
  serverStats: webpack.Stats;
}) => {
  return async (req: express.Request, res: express.Response) => {
    const result = await renderToString(req.url, clientStats);
    res.status(200).send(result);
  };
};
export default serverRenderer;
