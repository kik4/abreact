import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import { getWebpackConfig as getBase } from "./webpack.config.base";
import { CommonParams } from "./types";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

export const getWebpackConfig = (
  commonParams: CommonParams
): webpack.Configuration => {
  const base = getBase(commonParams);

  return merge(base, {
    name: "client",
    entry: [path.resolve(commonParams.abreactRoot, "src/client/index.tsx")],
    output: {
      path: path.join(commonParams.userRoot, ".abreact", "_client"),
      publicPath: "/",
      filename: "client.bundle.js"
    },
    plugins: [
      commonParams.isDevelopment && new webpack.HotModuleReplacementPlugin()
      // new BundleAnalyzerPlugin()
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
