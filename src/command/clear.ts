import fs from "fs-extra";
import path from "path";
import { CommonParams } from "../common/types";

export default async (commonParams: CommonParams) => {
  await Promise.all([
    fs.remove(path.join(commonParams.userRoot, ".abreact")),
    fs.remove(path.join(commonParams.userRoot, "dist")),
  ]);
};
