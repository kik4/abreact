import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import nodeExternals from "webpack-node-externals";
import { getWebpackConfig as getBase } from "./webpack.config.base";
import { CommonParams } from "./types";
import AbreactBuildingRoutePlugin from "./AbreactBuildingRoutePlugin";

export const getWebpackConfig = (
  commonParams: CommonParams,
  isDevelopment = true
): webpack.Configuration => {
  const base = getBase(commonParams);

  return merge(base, {
    name: "server",
    target: "node",
    externals: [nodeExternals()],
    mode: isDevelopment ? "development" : "production",
    entry: path.resolve(commonParams.abreactRoot, "src/server/index.ts"),
    output: {
      path: path.join(commonParams.userRoot, "dist", "server"),
      publicPath: "/",
      filename: "server.bundle.js",
      libraryTarget: "commonjs2"
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                configFile: path.resolve(commonParams.userRoot, "tsconfig.json")
              }
            }
          ].filter(v => v)
        }
      ]
    },
    plugins: [new AbreactBuildingRoutePlugin(commonParams, false)].filter(
      v => v
    )
  });
};
