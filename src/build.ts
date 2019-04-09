import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config";

export default () => {
  const compiler = webpack(getWebpackConfig());

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
