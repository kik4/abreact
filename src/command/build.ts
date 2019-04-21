import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config.client";
import clear from "./clear";
import { CommonParams } from "./type";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams, false);
  const compiler = webpack(config);

  clear(commonParams);

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
