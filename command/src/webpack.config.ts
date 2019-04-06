import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin = require("html-webpack-plugin");

export const getWebpackConfig = (
  scriptRoot: string
): webpack.Configuration => ({
  resolve: {
    modules: [
      path.resolve(__dirname, "../app"),
      path.resolve(__dirname, "../node_modules"),
      path.resolve(scriptRoot, "src")
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    alias: {
      user: path.join(scriptRoot, "src")
    }
  },
  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:8080",
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, "../app/index.tsx")
    ]
  },
  output: {
    path: path.join(scriptRoot, "dist"),
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
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(scriptRoot, "./src/static/index.html"),
      hash: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
});