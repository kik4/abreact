import webpack, { Compiler } from "webpack";
import { getWebpackConfig } from "./webpack.config";
import { getWebpackConfig as getWebpackConfigServer } from "./webpack.server.config";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import hotServerMiddleware from "webpack-hot-server-middleware";
import express from "express";
import path from "path";
import { CommonParams } from "./type";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams);
  const configServer = getWebpackConfigServer(commonParams);

  (config.entry as any).client.push(
    "webpack-hot-middleware/client?noInfo=true"
  );

  const compiler = webpack([config, configServer]);

  console.log("Starting server on http://localhost:8080");

  const app = express();

  app.set("view engine", "ejs");

  const publicPath = config.output!.publicPath!;

  // dev-server
  app.use(
    devMiddleware(compiler, {
      publicPath,
      serverSideRender: true
    })
  );
  app.use(
    hotMiddleware(compiler.compilers.find(
      compiler => compiler.name === "client"
    ) as Compiler)
  );
  app.use(hotServerMiddleware(compiler));

  let hash = "";
  compiler.compilers[0].hooks.afterCompile.tap(
    "AbreactGetHook",
    (compilation: webpack.compilation.Compilation) => {
      hash = compilation.hash!;
    }
  );

  app.listen(8080);
};
