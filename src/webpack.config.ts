import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
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
        path.resolve(__dirname, "app"),
        path.resolve(__dirname, "../node_modules"),
        path.resolve(userRoot, "src"),
        path.resolve(userRoot, "node_modules")
      ],
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      alias: {
        "@": path.join(userRoot, "src"),
        abreact: path.resolve(__dirname, "export")
      }
    },
    entry: {
      app: [path.resolve(__dirname, "app/index.js")]
    },
    output: {
      path: path.join(userRoot, "dist"),
      publicPath: "/",
      filename: "bundle.js"
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
      new HtmlWebpackPlugin({
        template: path.join(userRoot, "./src/static/index.html"),
        hash: true
      }),
      new webpack.ProgressPlugin((percentage, message, ...args) => {
        const stdout = process.stdout as any;
        stdout.clearLine();
        stdout.cursorTo(0);
        stdout.write((percentage * 100).toFixed(2) + "%");
        stdout.write(" " + message);
      }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment &&
        new ExtraWatchWebpackPlugin({
          dirs: [path.resolve(userRoot, "src")]
        }),
      new AbreactBuildingRoutePlugin()
    ].filter(v => v),
    devServer: {
      contentBase: path.join(userRoot, "./dist"),
      hot: true,
      // noInfo: true,
      clientLogLevel: "none",
      historyApiFallback: true,
      disableHostCheck: true,
      host: "0.0.0.0"
    },
    node: {
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty"
    }
  };
};
