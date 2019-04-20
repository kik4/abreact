import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config";
import devMiddleware from "webpack-dev-middleware";
import hotMiddleware from "webpack-hot-middleware";
import express from "express";
import path from "path";
import { CommonParams } from "./type";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams);

  (config.entry as any).client.push(
    "webpack-hot-middleware/client?noInfo=true"
  );

  const compiler = webpack(config);

  console.log("Starting server on http://localhost:8080");

  const app = express();

  app.set("view engine", "ejs");

  const publicPath = config.output!.publicPath!;

  // dev-server
  app.use(
    devMiddleware(compiler, {
      publicPath
    })
  );
  app.use(hotMiddleware(compiler));

  let hash = "";
  compiler.hooks.afterCompile.tap(
    "AbreactGetHook",
    (compilation: webpack.compilation.Compilation) => {
      hash = compilation.hash!;
    }
  );

  // spa fallback
  const templatePath = path.resolve(
    commonParams.abreactRoot,
    "./src/templates/index.ejs"
  );
  app.use("/*", (req, res) => {
    res.render(templatePath, { publicPath, hash });
  });

  app.listen(8080);
};
