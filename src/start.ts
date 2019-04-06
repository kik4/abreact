import * as webpack from "webpack";
import * as path from "path";
import * as webpackDevServer from "webpack-dev-server";
import { getWebpackConfig } from "./webpack.config";

const scriptRoot = process.cwd();

export default () => {
  const compiler = webpack(getWebpackConfig(scriptRoot));

  const server = new webpackDevServer(compiler, {
    contentBase: path.join(scriptRoot, "./dist"),
    hot: true,
    noInfo: true,
    open: true,
    clientLogLevel: "none"
  });

  server.listen(8080, "localhost", error => {
    console.log("Starting server on http://localhost:8080");
  });
};
