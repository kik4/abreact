import rimraf from "rimraf";
import path from "path";

const userRoot = process.cwd();

export default () => {
  rimraf(path.join(userRoot, "dist"), err => console.error(err));
};
