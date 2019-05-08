import fs from "fs-extra";
import path from "path";
import webpack from "webpack";
import renderToString from "../common/server/renderToString";
import { CommonParams } from "../common/types";
import * as TmpData from "@@/.abreact/_tmp";

export default async (commonParams: CommonParams, statsData: webpack.Stats) => {
  const pathnames = TmpData.routes
    .map(route => route.path)
    .filter(pathname => (pathname as string).indexOf("/:") === -1) as string[];

  pathnames.push("_404");

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
