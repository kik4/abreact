import fs from "fs";

export const writeFileOnce = (path: string, data: string) => {
  try {
    const content = fs.readFileSync(path, "utf8");
    if (content !== data) {
      fs.writeFileSync(path, data);
    }
  } catch (e) {
    fs.writeFileSync(path, data);
  }
};
