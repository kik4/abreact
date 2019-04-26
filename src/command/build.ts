import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config.client";
import { getWebpackConfig as getWebpackConfigServer } from "./webpack.config.server";
import clear from "./clear";
import { CommonParams } from "./types";
import fs from "fs";
import path from "path";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams);
  const configServer = getWebpackConfigServer(commonParams);
  const compiler = webpack([config, configServer]);

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

    const statsData = {
      clientStats: {
        hash: ((stats as any).stats as webpack.Stats[])[0].hash
      }
    };
    fs.writeFileSync(
      path.join(commonParams.userRoot, ".abreact/_server/stats.json"),
      JSON.stringify(statsData)
    );
  });
};
