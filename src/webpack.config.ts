import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const scriptRoot = process.cwd();

export const getWebpackConfig = (): webpack.Configuration => ({
  resolve: {
    modules: [
      path.resolve(__dirname, "app"),
      path.resolve(__dirname, "../node_modules"),
      path.resolve(scriptRoot, "src"),
      path.resolve(scriptRoot, "node_modules")
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    alias: {
      __user: path.join(scriptRoot, "src"),
      abreact: path.resolve(__dirname, "export") // for development
    }
  },
  entry: {
    app: [
      // "webpack-dev-server/client?http://localhost:8080",
      // "webpack/hot/only-dev-server",
      path.resolve(__dirname, "app/index.js")
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
              transpileOnly: true,
              configFile: path.resolve(scriptRoot, "tsconfig.json"),
              compilerOptions: {
                declaration: false,
                allowJs: true,
                resolveJsonModule: true,
                isolatedModules: true
              }
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
    }),
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      const stdout = process.stdout as any;
      stdout.clearLine();
      stdout.cursorTo(0);
      stdout.write((percentage * 100).toFixed(2) + "%");
      stdout.write(" " + message);
    })
  ],
  devServer: {
    contentBase: path.join(scriptRoot, "./dist"),
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
