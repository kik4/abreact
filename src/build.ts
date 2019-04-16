import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config";
import rimraf from "rimraf";

export default () => {
  const config = getWebpackConfig(false);

  rimraf.sync(config.output!.path!);

  const compiler = webpack(config);

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
