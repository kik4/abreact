import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import { getWebpackConfig as getBase } from "./webpack.config.base";
import { CommonParams } from "./types";
import AbreactBuildingRoutePlugin from "./AbreactBuildingRoutePlugin";

export const getWebpackConfig = (
  commonParams: CommonParams,
  isDevelopment = true
): webpack.Configuration => {
  const base = getBase(commonParams);

  return merge(base, {
    name: "client",
    entry: {
      client: [path.resolve(commonParams.abreactRoot, "src/client/index.tsx")]
    },
    output: {
      path: path.join(commonParams.userRoot, "dist", "client"),
      publicPath: "/",
      filename: "[name].bundle.js"
    },
    plugins: [
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      new AbreactBuildingRoutePlugin(commonParams, true)
    ].filter(v => v) as webpack.Plugin[],
    node: {
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty"
    }
  });
};
