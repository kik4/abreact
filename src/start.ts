import * as webpack from "webpack";
import * as path from "path";
import * as webpackDevServer from "webpack-dev-server";
import { getWebpackConfig } from "./webpack.config";

const scriptRoot = process.cwd();

export default () => {
  const config = getWebpackConfig(scriptRoot);
  const compiler = webpack(config);

  console.log("Starting server on http://localhost:8080");

  const server = new webpackDevServer(compiler, config.devServer as any);

  server.listen(8080, "localhost", error => {});
};
