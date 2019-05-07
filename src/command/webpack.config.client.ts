import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import CopyPlugin from "copy-webpack-plugin";
import { getWebpackConfig as getBase } from "./webpack.config.base";
import { CommonParams } from "../common/types";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

export const getWebpackConfig = (
  commonParams: CommonParams,
): webpack.Configuration => {
  const base = getBase(commonParams);

  return merge(base, {
    name: "client",
    entry: [path.resolve(commonParams.abreactRoot, "src/client/index.tsx")],
    output: {
      path: path.join(commonParams.userRoot, ".abreact", "_client"),
      publicPath: "/",
      filename: "client.bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          use: [
            commonParams.isDevelopment ? "react-hot-loader/webpack" : "",
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                configFile: path.resolve(
                  commonParams.userRoot,
                  "tsconfig.json",
                ),
              },
            },
          ].filter(v => v),
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const stdout = process.stdout as any;
        stdout.clearLine();
        stdout.cursorTo(0);
        stdout.write((percentage * 100).toFixed(2) + "%");
        stdout.write(" client " + message);
        if (percentage === 1) {
          stdout.clearLine();
          stdout.cursorTo(0);
        }
      }),
      new CopyPlugin([
        {
          from: path.join(commonParams.userRoot, "src/static"),
          to: path.join(commonParams.userRoot, ".abreact/_client"),
        },
      ]),
      commonParams.isDevelopment && new webpack.HotModuleReplacementPlugin(),
      // new BundleAnalyzerPlugin()
    ].filter(v => v) as webpack.Plugin[],
    node: {
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
  });
};
