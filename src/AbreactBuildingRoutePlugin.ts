import path from "path";
import fs from "fs";
import util from "util";
import { oc } from "ts-optchain";

const readdirAsync = util.promisify(fs.readdir);
const userRoot = process.cwd();

class AbreactBuildingroutePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("AbreactBuildingroutePlugin", async () => {
      const userConfig = require(path.join(userRoot, "src/abreact.config"));

      // pages
      const pageDir = path.join(userRoot, "src/pages/");
      const pageFiles = await readdirAsync(pageDir);
      const pageResult = [] as any;
      pageFiles.forEach(file => {
        const stat = fs.statSync(path.join(pageDir, file));
        if (stat.isFile) {
          const name = path.basename(file, path.extname(file));
          const dir = path.join(pageDir, file);
          pageResult.push(`{
  path: "${"/" + (name === "index" ? "" : name)}",
  action: (context) => ({page: import("${dir}"), context}),
},`);
        }
      });

      // layourts
      const layoutDir = path.join(userRoot, "src/layouts");
      const layoutFiles = await readdirAsync(layoutDir);
      const layoutResult = [] as any;
      layoutFiles.forEach(file => {
        const stat = fs.statSync(path.join(layoutDir, file));
        if (stat.isFile) {
          const name = path.basename(file, path.extname(file));
          const dir = path.join(layoutDir, file);
          layoutResult.push(`"${name}": import("${dir}"),`);
        }
      });

      // plugins
      const pluginsResult = [] as any;
      if ((oc(userConfig) as any).plugins) {
        userConfig.plugins.forEach(pluginPath => {
          const name = path.basename(pluginPath, path.extname(pluginPath));
          pluginsResult.push(`"${name}": import("${pluginPath}"),`);
        });
      }

      const resultString = `export default [${pageResult.join("")}];
export const layouts = {${layoutResult.join("")}};
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
