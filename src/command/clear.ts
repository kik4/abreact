import rimraf from "rimraf";
import path from "path";
import { CommonParams } from "./type";

export default (commonParams: CommonParams) => {
  rimraf(path.join(commonParams.userRoot, "dist"), err => console.error(err));
};
