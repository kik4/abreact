import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";
import { getWebpackConfig as getServer } from "./webpack.config.server";
import { CommonParams } from "../common/types";

export const getWebpackConfig = (
  commonParams: CommonParams,
): webpack.Configuration => {
  const base = getServer(commonParams);

  return merge(base, {
    entry: path.resolve(commonParams.abreactRoot, "src/generate/index.ts"),
    output: {
      path: path.join(commonParams.userRoot, ".abreact", "_generate"),
      publicPath: "/",
      filename: "generate.bundle.js",
      libraryTarget: "commonjs2",
    },
  });
};
