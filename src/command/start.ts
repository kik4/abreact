import express from "express";
import path from "path";
import { CommonParams } from "./type";

export default (commonParams: CommonParams) => {
  console.log("Starting server on http://localhost:8080");

  const app = express();

  const CLIENT_ASSETS_DIR = path.join(commonParams.userRoot, "dist/client");
  const CLIENT_STATS_PATH = path.join(
    commonParams.userRoot,
    "dist/server/stats.json"
  );
  const SERVER_RENDERER_PATH = path.join(
    commonParams.userRoot,
    "dist/server/server.bundle.js"
  );
  const serverRenderer = require(SERVER_RENDERER_PATH).default;
  const stats = require(CLIENT_STATS_PATH);
  app.use(express.static(CLIENT_ASSETS_DIR));
  app.use(serverRenderer(stats));

  app.listen(8080);
};
