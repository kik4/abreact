import * as webpack from "webpack";
import * as path from "path";

export default (scriptRoot: string) => {
  const compiler = webpack({
    entry: path.join(scriptRoot, "./src/index.ts"),
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
        }
      ]
    }
  } as webpack.Configuration);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true // Shows colors in the console
      })
    );
  });
};
