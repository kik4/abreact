import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin = require("html-webpack-plugin");

export const getWebpackConfig = (
  scriptRoot: string
): webpack.Configuration => ({
  resolve: {
    modules: [
      path.join(scriptRoot, "./src"),
      path.join(scriptRoot, "node_modules"),
      path.resolve(__dirname, "node_modules")
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  },
  entry: path.join(scriptRoot, "./src/index.tsx"),
  output: {
    path: path.join(scriptRoot, "dist"),
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader"
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
    })
  ]
});
