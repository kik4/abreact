import path from "path";
import fs from "fs";

const scriptRoot = process.cwd();

class AbreactBuildingroutePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("AbreactBuildingroutePlugin", () => {
      const pageDir = path.join(scriptRoot, "src/pages/");

      const result = [] as any;

      fs.readdir(pageDir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
          const stat = fs.statSync(path.join(pageDir, file));
          if (stat.isFile) {
            const name = path.basename(file, path.extname(file));
            result.push(`{
              path: "${"/" + (name === "index" ? "" : name)}",
              action: () => () => import("${path.join(pageDir, file)}")
            },`);
          }
        });

        const resultString = `export default [${result.join("")}];`;

        // create dir
        fs.mkdir(
          path.resolve(__dirname, "tmp"),
          { recursive: true },
          err => {}
        );

        // no loop
        const outputPath = path.join(__dirname, "tmp/routes.js");
        try {
          fs.statSync(outputPath);
          const content = fs.readFileSync(outputPath, "utf8");
          if (content === resultString) {
            return;
          }
        } catch (e) {}

        fs.writeFileSync(outputPath, resultString);
      });
    });
  }
}

export default AbreactBuildingroutePlugin;
