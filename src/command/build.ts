import webpack from "webpack";
import { getWebpackConfig } from "./webpack.config.client";
import { getWebpackConfig as getWebpackConfigServer } from "./webpack.config.server";
import clear from "./clear";
import { CommonParams } from "../common/types";
import fs from "fs-extra";
import path from "path";
import prepare from "./prepare";

export default async (commonParams: CommonParams) => {
  await prepare(commonParams);

  const config = getWebpackConfig(commonParams);
  const configServer = getWebpackConfigServer(commonParams);
  const compiler = webpack([config, configServer]);

  clear(commonParams);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    const statsData = {
      clientStats: {
        hash: ((stats as any).stats as webpack.Stats[])[0].hash
      }
    };
    fs.writeFile(
      path.join(commonParams.userRoot, ".abreact/_server/stats.json"),
      JSON.stringify(statsData)
    );
  });
};
