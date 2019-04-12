import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import { getWebpackConfig } from "./webpack.config";

export default () => {
  const config = getWebpackConfig();
  const compiler = webpack(config);

  console.log("Starting server on http://localhost:8080");

  const server = new webpackDevServer(compiler, config.devServer as any);

  server.listen(8080, "0.0.0.0", error => {});
};
