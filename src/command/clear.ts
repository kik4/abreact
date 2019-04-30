import fs from "fs-extra";
import path from "path";
import { CommonParams } from "../common/types";

export default (commonParams: CommonParams) => {
  fs.remove(path.join(commonParams.userRoot, ".abreact"), err => {
    if (err) {
      console.error(err);
      return;
    }
  });
  fs.remove(path.join(commonParams.userRoot, "dist"), err => {
    if (err) {
      console.error(err);
      return;
    }
  });
};
