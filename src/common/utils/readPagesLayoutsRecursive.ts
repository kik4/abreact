import path from "path";
import fs from "fs";
import util from "util";

const readdirAsync = util.promisify(fs.readdir);

export type readData = {
  moduleName: string;
  importDir: string;
  routePath: string;
};

export const readPagesRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<readData[]> => {
  const result = [] as readData[];
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
      result.push({ moduleName, importDir, routePath });
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

export const readLayoutsRecursive = async (
  originPath: string,
  additionalPath: string = "/"
): Promise<readData[]> => {
  const result = [] as readData[];
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
      result.push({ moduleName, importDir, routePath });
    } else if (stat.isDirectory()) {
      const children = await readLayoutsRecursive(
        originPath,
        path.join(additionalPath, file)
      );
      result.push(...children);
    }
  }
  return result;
};
