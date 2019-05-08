import express from "express";
import path from "path";
import fs from "fs-extra";
import { CommonParams } from "../common/types";
import { oc } from "ts-optchain";
import compression from "compression";

export default async (commonParams: CommonParams) => {
  const app = express();
  app.use(compression());

  const distDir = path.join(commonParams.userRoot, "dist");

  let generated = false;
  try {
    const stat = await fs.stat(distDir);
    if (stat.isDirectory) {
      generated = true;
    }
  } catch (err) {}

  if (!generated) {
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
  } else {
    const errorFile = path.join(distDir, "_error.html");
    app.use(express.static(distDir, { extensions: ["html"] }));
    app.use((req, res, next) => {
      res.sendFile(errorFile);
    });
  }

  const port = oc(commonParams.userConfig).server.port(3000);
  app.listen(port);
  console.log(`Starting server on http://localhost:${port}`);
};
