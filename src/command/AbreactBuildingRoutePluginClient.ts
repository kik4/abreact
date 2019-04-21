import path from "path";
import fs from "fs";
import { oc } from "ts-optchain";
import webpack from "webpack";
import { AbreactUserConfig } from "../types";
import { CommonParams } from "./type";
import {
  readPagesRecursive,
  readLayoutsRecursive
} from "../common/utils/readPagesLayoutsRecursive";
import { writeFileOnce } from "../common/utils/writeFileOnce";

const writeData = async (commonParams: CommonParams) => {
  const userConfig = require(path.join(
    commonParams.userRoot,
    "src/abreact.config"
  )) as AbreactUserConfig | undefined;

  // pages
  const pageDir = path.join(commonParams.userRoot, "src/pages/");
  const pageResult = await readPagesRecursive(pageDir);

  // layouts
  const layoutDir = path.join(commonParams.userRoot, "src/layouts");
  const layoutResult = await readLayoutsRecursive(layoutDir);

  // plugins
  const pluginsResult = [] as any;
  const plugins = oc(userConfig).plugins([]);
  plugins.forEach(pluginPath => {
    const name = path.basename(pluginPath, path.extname(pluginPath));
    pluginsResult.push(`"${name}": require("${pluginPath}"),`);
  });

  // create test
  const modules = [
    ...pageResult.map(
      v => `"${v.moduleName}": () => import("${v.importDir}"),`
    ),
    ...layoutResult.map(
      v => `"${v.moduleName}": () => import("${v.importDir}"),`
    )
  ].join("\n");
  const routes = pageResult
    .map(
      v => `{
path: "${v.routePath}",
action: (context) => ({page: "${v.moduleName}", context}),
},`
    )
    .join("\n");
  const layouts = layoutResult
    .map(v => `"${v.routePath.slice(1)}": "${v.moduleName}",`)
    .join("\n");

  const resultString = `export const modules = {${modules}}
export const routes = [${routes}];
export const layouts = {${layouts}};
export const plugins = {${pluginsResult.join("")}};
`;

  // create dir
  fs.mkdir(
    path.resolve(commonParams.abreactRoot, "src/tmp"),
    { recursive: true },
    err => {}
  );

  // no loop
  writeFileOnce(
    path.join(commonParams.abreactRoot, "src/tmp/client.js"),
    resultString
  );
};

class AbreactBuildingRoutePlugin {
  commonParams: CommonParams;
  constructor(commonParams: CommonParams) {
    this.commonParams = commonParams;
  }
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(
      "AbreactBuildingRoutePluginClient",
      async () => writeData(this.commonParams)
    );
  }
}

export default AbreactBuildingRoutePlugin;
