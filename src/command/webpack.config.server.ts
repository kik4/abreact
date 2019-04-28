import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import nodeExternals from "webpack-node-externals";
import { getWebpackConfig as getBase } from "./webpack.config.base";
import { CommonParams } from "./types";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

export const getWebpackConfig = (
  commonParams: CommonParams
): webpack.Configuration => {
  const base = getBase(commonParams);

  return merge(base, {
    name: "server",
    target: "node",
    externals: [nodeExternals()],
    mode: commonParams.isDevelopment ? "development" : "production",
    entry: path.resolve(commonParams.abreactRoot, "src/server/index.tsx"),
    output: {
      path: path.join(commonParams.userRoot, ".abreact", "_server"),
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
                configFile: path.resolve(
                  commonParams.userRoot,
                  "tsconfig.json"
                ),
                compilerOptions: {
                  module: "commonjs",
                  moduleResolution: "node"
                }
              }
            }
          ].filter(v => v)
        }
      ]
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ].filter(v => v)
  });
};
