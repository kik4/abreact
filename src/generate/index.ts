import fs from "fs-extra";
import path from "path";
import * as tmpData from "../../src/tmp/server";
import renderToString from "../common/server/renderToString";
import webpack from "webpack";
import { CommonParams } from "../command/types";

export default async (commonParams: CommonParams, statsData: webpack.Stats) => {
  const pathnames = tmpData.routes
    .map(route => route.path)
    .filter(pathname => (pathname as string).indexOf("/:") === -1) as string[];

  for (let i = 0; i < pathnames.length; i++) {
    const pathname = pathnames[i];
    const result = await renderToString(pathname, statsData as webpack.Stats);
    const name = pathname.slice(1) || "index";
    const file = path.join(commonParams.userRoot, "dist", `${name}.html`);
    const dir = path.dirname(file);
    fs.ensureDirSync(dir);
    fs.writeFileSync(file, result);
  }
};
