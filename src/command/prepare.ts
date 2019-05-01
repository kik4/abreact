import path from "path";
import fs from "fs-extra";
import { oc } from "ts-optchain";
import { CommonParams } from "../common/types";
import {
  readPagesRecursive,
  readLayoutsRecursive,
} from "../common/utils/readPagesLayoutsRecursive";

const write = async (commonParams: CommonParams) => {
  // pages
  const pageDir = path.join(commonParams.userRoot, "src/pages/");
  const pageResult = await readPagesRecursive(pageDir);

  // layouts
  const layoutDir = path.join(commonParams.userRoot, "src/layouts");
  const layoutResult = await readLayoutsRecursive(layoutDir);

  // plugins
  const pluginsResult = [] as any;
  const plugins = oc(commonParams.userConfig).plugins([]);
  plugins.forEach(pluginPath => {
    const name = path.basename(pluginPath, path.extname(pluginPath));
    pluginsResult.push(`"${name}": require("${pluginPath}"),`);
  });

  const cssResult = [] as any;
  const csses = oc(commonParams.userConfig).css([]);
  csses.forEach(pluginPath => {
    cssResult.push(`require("${pluginPath}"),`);
  });

  // create test
  const modules = [
    ...pageResult.map(
      v => `"${v.moduleName}": () => import("${v.importDir}"),`,
    ),
    `"__error": () => Promise.resolve(layouts["error"])`,
  ].join("\n");
  const routes = pageResult
    .map(
      v => `{
path: "${v.routePath}",
action: (context) => ({page: "${v.moduleName}", context}),
},`,
    )
    .join("\n");
  const layouts = layoutResult
    .map(v => `"${v.routePath.slice(1)}": require("${v.importDir}"),`)
    .join("");

  const resultString = `export const modules = {${modules}}
export const routes = [${routes}];
export const layouts = {${layouts}};
export const plugins = {${pluginsResult.join("")}};
export const csses = [${cssResult.join("")}];
export const config = require("@/abreact.config");
`;

  // output
  await fs.ensureDir(path.resolve(commonParams.abreactRoot, "src/tmp"));
  const outputPath = path.join(commonParams.abreactRoot, `src/tmp/index.js`);
  try {
    const content = await fs.readFile(outputPath, "utf8");
    if (content !== resultString) {
      await fs.writeFile(outputPath, resultString);
    }
  } catch (e) {
    await fs.writeFile(outputPath, resultString);
  }
};

export default async (commonParams: CommonParams) => {
  await write(commonParams);
  console.log("Abreact prepared intermediate data.");
};
