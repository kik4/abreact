import path from "path";
import fs from "fs";
import util from "util";
import { oc } from "ts-optchain";

const readdirAsync = util.promisify(fs.readdir);
const userRoot = process.cwd();

const readPagesRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<string[]> => {
  const result = [] as string[];
  const baseDir = path.join(originPath, additionalPath);
  const files = await readdirAsync(baseDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stat = fs.statSync(path.join(baseDir, file));
    if (stat.isFile()) {
      const filename = path.basename(file, path.extname(file));
      const routePath = path.join(
        additionalPath,
        filename === "index" ? "" : filename
      );
      const importDir = path.join("@/pages", additionalPath, file);
      result.push(`{
path: "${routePath}",
action: (context) => ({page: import("${importDir}"), context}),
},`);
    } else if (stat.isDirectory()) {
      const children = await readPagesRecursive(
        originPath,
        path.join(additionalPath, file)
      );
      result.push(...children);
    }
  }
  return result;
};

const readLyoutsRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<string[]> => {
  const result = [] as string[];
  const baseDir = path.join(originPath, additionalPath);
  const files = await readdirAsync(baseDir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stat = fs.statSync(path.join(baseDir, file));
    if (stat.isFile()) {
      const filename = path.basename(file, path.extname(file));
      const routePath = path.join(additionalPath, filename);
      const importDir = path.join("@/layouts", additionalPath, file);
      result.push(`"${routePath.slice(1)}": () => import("${importDir}"),`);
    } else if (stat.isDirectory()) {
      const children = await readLyoutsRecursive(
        originPath,
        path.join(additionalPath, file)
      );
      result.push(...children);
    }
  }
  return result;
};

class AbreactBuildingroutePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("AbreactBuildingroutePlugin", async () => {
      const userConfig = require(path.join(userRoot, "src/abreact.config"));

      // pages
      const pageDir = path.join(userRoot, "src/pages/");
      const pageResult = await readPagesRecursive(pageDir);

      // layouts
      const layoutDir = path.join(userRoot, "src/layouts");
      const layoutResult = await readLyoutsRecursive(layoutDir);

      // plugins
      const pluginsResult = [] as any;
      if ((oc(userConfig) as any).plugins) {
        userConfig.plugins.forEach(pluginPath => {
          const name = path.basename(pluginPath, path.extname(pluginPath));
          pluginsResult.push(`"${name}": require("${pluginPath}"),`);
        });
      }

      const resultString = `export default [${pageResult.join("")}];
export const layouts = {${layoutResult.join("\n")}};
export const plugins = {${pluginsResult.join("")}};
`;

      // create dir
      fs.mkdir(path.resolve(__dirname, "tmp"), { recursive: true }, err => {});

      // no loop
      const outputPath = path.join(__dirname, "tmp/routes.js");
      try {
        fs.statSync(outputPath);
        const content = fs.readFileSync(outputPath, "utf8");
        if (content === resultString) {
          return;
        }
      } catch (e) {}

      // output
      fs.writeFileSync(outputPath, resultString);
    });
  }
}

export default AbreactBuildingroutePlugin;
