import webpack from "webpack";
import renderToString from "../common/server/renderToString";

const serverRenderer = ({
  clientStats,
  serverStats
}: {
  clientStats: webpack.Stats;
  serverStats: webpack.Stats;
}) => {
  return async (req: Request, res, next) => {
    const result = await renderToString(req.url, clientStats);
    res.status(200).send(result);
  };
};
export default serverRenderer;
