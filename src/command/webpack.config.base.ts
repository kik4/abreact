import webpack from "webpack";
import path from "path";
import ExtraWatchWebpackPlugin from "extra-watch-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { CommonParams } from "../common/types";

export const getWebpackConfig = (
  commonParams: CommonParams
): webpack.Configuration => {
  const mode = commonParams.isDevelopment ? "development" : "production";
  return {
    mode,
    resolve: {
      modules: [
        path.resolve(commonParams.abreactRoot, "src/client"),
        path.resolve(commonParams.abreactRoot, "node_modules"),
        path.resolve(commonParams.userRoot, "src"),
        path.resolve(commonParams.userRoot, "node_modules")
      ],
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      alias: {
        "@": path.join(commonParams.userRoot, "src"),
        "@kik4/abreact": path.resolve(commonParams.abreactRoot, "src/export")
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "isomorphic-style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({ "process.env.NODE_ENV": `"${mode}"` }),
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const stdout = process.stdout as any;
        stdout.clearLine();
        stdout.cursorTo(0);
        stdout.write((percentage * 100).toFixed(2) + "%");
        stdout.write(" " + message);
      }),
      new ForkTsCheckerWebpackPlugin({
        logger: {
          info: () => {},
          warn: console.warn,
          error: console.error
        }
      }),
      commonParams.isDevelopment && new webpack.NamedModulesPlugin(),
      commonParams.isDevelopment &&
        new ExtraWatchWebpackPlugin({
          dirs: [path.resolve(commonParams.userRoot, "src")]
        })
    ].filter(v => v)
  };
};
