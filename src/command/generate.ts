import webpack from "webpack";
import path from "path";
import fs from "fs-extra";
import { getWebpackConfig } from "./webpack.config.client";
import { getWebpackConfig as getWebpackConfigGenerate } from "./webpack.config.generate";
import { CommonParams } from "./types";
import clear from "./clear";

export default (commonParams: CommonParams) => {
  const config = getWebpackConfig(commonParams);
  const configGenerate = getWebpackConfigGenerate(commonParams);
  const compiler = webpack([config, configGenerate]);

  clear(commonParams);

  compiler.run(async (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    const clientStats = {
      hash: ((stats as any).stats as webpack.Stats[])[0].hash
    };

    const SERVER_RENDERER_PATH = path.join(
      commonParams.userRoot,
      ".abreact/_generate/generate.bundle.js"
    );
    const serverRenderer = require(SERVER_RENDERER_PATH).default;
    serverRenderer(commonParams, clientStats);

    fs.copySync(
      path.join(commonParams.userRoot, ".abreact/_client"),
      path.join(commonParams.userRoot, "dist/_client")
    );
  });
};
