import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin = require("html-webpack-plugin");

export const getWebpackConfig = (
  scriptRoot: string
): webpack.Configuration => ({
  resolve: {
    modules: [
      path.resolve(__dirname, "../app"),
      path.resolve(__dirname, "../node_modules")
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  },
  entry: {
    app: [
      "webpack-dev-server/client?http://localhost:8080",
      "webpack/hot/only-dev-server",
      path.resolve(__dirname, "../app/index.tsx"),
      path.join(scriptRoot, "src/Page.tsx")
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
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
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
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.USER_SCRIPT_ROOT": JSON.stringify(
        path.join(scriptRoot, "src")
      )
    })
  ]
});
