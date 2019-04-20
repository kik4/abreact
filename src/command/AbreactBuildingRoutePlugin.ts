import path from "path";
import fs from "fs";
import util from "util";
import { oc } from "ts-optchain";
import { AbreactUserConfig } from "../types";
import webpack from "webpack";

const readdirAsync = util.promisify(fs.readdir);
const userRoot = process.cwd();

const readPagesRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<[string[], string[]]> => {
  const result = [[], []] as [string[], string[]];
  const baseDir = path.join(originPath, additionalPath);
  const files = await readdirAsync(baseDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stat = fs.statSync(path.join(baseDir, file));
    if (stat.isFile()) {
      const filename = path.basename(file, path.extname(file));
      const routePath = path
        .join(additionalPath, filename === "index" ? "" : filename)
        .replace(/\/_/g, "/:");
      const importDir = path.join("@/pages", additionalPath, file);
      const moduleName = "page" + routePath.replace(/\//g, "_");
      result[0].push(`"${moduleName}": () => import("${importDir}"),`);
      result[1].push(`{
path: "${routePath}",
action: (context) => ({page: "${moduleName}", context}),
},`);
    } else if (stat.isDirectory()) {
      const children = await readPagesRecursive(
        originPath,
        path.join(additionalPath, file)
      );
      result[0].push(...children[0]);
      result[1].push(...children[1]);
    }
  }
  return result;
};

const readLyoutsRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<[string[], string[]]> => {
  const result = [[], []] as [string[], string[]];
  const baseDir = path.join(originPath, additionalPath);
  const files = await readdirAsync(baseDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stat = fs.statSync(path.join(baseDir, file));
    if (stat.isFile()) {
      const filename = path.basename(file, path.extname(file));
      const routePath = path.join(additionalPath, filename);
      const importDir = path.join("@/layouts", additionalPath, file);
      const moduleName = "layout" + routePath.replace(/\//g, "_");
      result[0].push(`"${moduleName}": () => import("${importDir}"),`);
      result[1].push(`"${routePath.slice(1)}": "${moduleName}",`);
    } else if (stat.isDirectory()) {
      const children = await readLyoutsRecursive(
        originPath,
        path.join(additionalPath, file)
      );
      result[0].push(...children[0]);
      result[1].push(...children[1]);
    }
  }
  return result;
};

class AbreactBuildingroutePlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap("AbreactBuildingroutePlugin", async () => {
      const userConfig = require(path.join(userRoot, "src/abreact.config")) as
        | AbreactUserConfig
        | undefined;

      // pages
      const pageDir = path.join(userRoot, "src/pages/");
      const pageResult = await readPagesRecursive(pageDir);

      // layouts
      const layoutDir = path.join(userRoot, "src/layouts");
      const layoutResult = await readLyoutsRecursive(layoutDir);

      // plugins
      const pluginsResult = [] as any;
      const plugins = oc(userConfig).plugins([]);
      plugins.forEach(pluginPath => {
        const name = path.basename(pluginPath, path.extname(pluginPath));
        pluginsResult.push(`"${name}": require("${pluginPath}"),`);
      });

      const resultString = `export const modules = {${[
        ...pageResult[0],
        ...layoutResult[0]
      ].join("\n")}}
export const routes = [${pageResult[1].join("\n")}];
export const layouts = {${layoutResult[1].join("\n")}};
export const plugins = {${pluginsResult.join("")}};
`;

      // create dir
      fs.mkdir(
        path.resolve(__dirname, "../tmp"),
        { recursive: true },
        err => {}
      );

      // no loop
      const outputPath = path.join(__dirname, "../tmp/index.js");
      try {
        const content = fs.readFileSync(outputPath, "utf8");
        if (content !== resultString) {
          fs.writeFileSync(outputPath, resultString);
        }
      } catch (e) {
        fs.writeFileSync(outputPath, resultString);
      }
    });
  }
}

export default AbreactBuildingroutePlugin;
