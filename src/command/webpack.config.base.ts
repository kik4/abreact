import webpack from "webpack";
import path from "path";
import ExtraWatchWebpackPlugin from "extra-watch-webpack-plugin";
import { CommonParams } from "./type";

export const getWebpackConfig = (
  commonParams: CommonParams,
  isDevelopment = true
): webpack.Configuration => {
  return {
    mode: isDevelopment ? "development" : "production",
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
        abreact: path.resolve(commonParams.abreactRoot, "src/export")
      }
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          use: [
            isDevelopment ? "react-hot-loader/webpack" : "",
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                configFile: path.resolve(commonParams.userRoot, "tsconfig.json")
              }
            }
          ].filter(v => v)
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "postcss-loader"]
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const stdout = process.stdout as any;
        stdout.clearLine();
        stdout.cursorTo(0);
        stdout.write((percentage * 100).toFixed(2) + "%");
        stdout.write(" " + message);
      }),
      isDevelopment && new webpack.NamedModulesPlugin(),
      isDevelopment &&
        new ExtraWatchWebpackPlugin({
          dirs: [path.resolve(commonParams.userRoot, "src")]
        })
    ].filter(v => v)
  };
};
