import webpack from "webpack";
import path from "path";
import ExtraWatchWebpackPlugin from "extra-watch-webpack-plugin";
import AbreactBuildingRoutePluginServer from "./AbreactBuildingRoutePluginServer";
import { CommonParams } from "./type";
import nodeExternals from "webpack-node-externals";

export const getWebpackConfig = (
  commonParams: CommonParams,
  isDevelopment = true
): webpack.Configuration => {
  return {
    name: "server",
    target: "node",
    externals: [nodeExternals()],
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
    entry: path.resolve(commonParams.abreactRoot, "src/server/index.ts"),
    output: {
      path: path.join(commonParams.userRoot, "dist"),
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
    plugins: [
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const stdout = process.stdout as any;
        stdout.clearLine();
        stdout.cursorTo(0);
        stdout.write((percentage * 100).toFixed(2) + "%");
        stdout.write(" " + message);
      }),
      isDevelopment &&
        new ExtraWatchWebpackPlugin({
          dirs: [path.resolve(commonParams.userRoot, "src")]
        }),
      new AbreactBuildingRoutePluginServer(commonParams)
    ].filter(v => v)
  };
};
