import express from "express";
import path from "path";
import { CommonParams } from "../common/types";
import { oc } from "ts-optchain";
import compression from "compression";

export default (commonParams: CommonParams) => {
  const app = express();
  app.use(compression());

  const CLIENT_ASSETS_DIR = path.join(
    commonParams.userRoot,
    ".abreact/_client",
  );
  const CLIENT_STATS_PATH = path.join(
    commonParams.userRoot,
    ".abreact/_server/stats.json",
  );
  const SERVER_RENDERER_PATH = path.join(
    commonParams.userRoot,
    ".abreact/_server/server.bundle.js",
  );
  const serverRenderer = require(SERVER_RENDERER_PATH).default;
  const stats = require(CLIENT_STATS_PATH);
  app.use(express.static(CLIENT_ASSETS_DIR));
  app.use(serverRenderer(stats));

  const port = oc(commonParams.userConfig).server.port(3000);
  app.listen(port);
  console.log(`Starting server on http://localhost:${port}`);
};
