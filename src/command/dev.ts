import webpack, { Compiler } from "webpack";
import { getWebpackConfig } from "./webpack.config.client";
import { getWebpackConfig as getWebpackConfigServer } from "./webpack.config.server";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import hotServerMiddleware from "webpack-hot-server-middleware";
import express from "express";
import { CommonParams } from "./types";
import { oc } from "ts-optchain";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams);
  const configServer = getWebpackConfigServer(commonParams);

  (config.entry as any).client.push(
    "webpack-hot-middleware/client?noInfo=true"
  );

  const compiler = webpack([config, configServer]);

  const app = express();

  // dev-server
  app.use(
    devMiddleware(compiler, {
      publicPath: config.output!.publicPath!,
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

  const port = oc(commonParams.userConfig).server.port(3000);
  app.listen(port);
  console.log(`Starting server on http://localhost:${port}`);
};
