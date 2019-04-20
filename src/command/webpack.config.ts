import webpack from "webpack";
import path from "path";
import ExtraWatchWebpackPlugin from "extra-watch-webpack-plugin";
import AbreactBuildingRoutePlugin from "./AbreactBuildingRoutePlugin";

const userRoot = process.cwd();

export const getWebpackConfig = (
  isDevelopment = true
): webpack.Configuration => {
  return {
    mode: isDevelopment ? "development" : "production",
    resolve: {
      modules: [
        path.resolve(__dirname, "../client"),
        path.resolve(__dirname, "../node_modules"),
        path.resolve(userRoot, "src"),
        path.resolve(userRoot, "node_modules")
      ],
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      alias: {
        "@": path.join(userRoot, "src"),
        abreact: path.resolve(__dirname, "../export")
      }
    },
    entry: {
      client: [path.resolve(__dirname, "../client/index.js")],
      server: [path.resolve(__dirname, "../server/index.js")]
    },
    output: {
      path: path.join(userRoot, "dist"),
      publicPath: "/",
      filename: "[name].bundle.js"
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
                configFile: path.resolve(userRoot, "tsconfig.json")
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
          dirs: [path.resolve(userRoot, "src")]
        }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      new AbreactBuildingRoutePlugin()
    ].filter(v => v),
    node: {
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty"
    }
  };
};