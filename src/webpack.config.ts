import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ExtraWatchWebpackPlugin from "extra-watch-webpack-plugin";
import AbreactBuildingRoutePlugin from "./AbreactBuildingRoutePlugin";

const userRoot = process.cwd();

export const getWebpackConfig = (): webpack.Configuration => ({
  resolve: {
    modules: [
      path.resolve(__dirname, "app"),
      path.resolve(userRoot, "src"),
      path.resolve(userRoot, "node_modules")
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    alias: {
      "@": path.join(userRoot, "src")
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
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          "react-hot-loader/webpack",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: path.resolve(userRoot, "tsconfig.json")
            }
          }
        ]
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      const stdout = process.stdout as any;
      stdout.clearLine();
      stdout.cursorTo(0);
      stdout.write((percentage * 100).toFixed(2) + "%");
      stdout.write(" " + message);
    }),
    new ExtraWatchWebpackPlugin({
      dirs: [path.resolve(userRoot, "src")]
    }),
    new AbreactBuildingRoutePlugin()
  ],
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
});
