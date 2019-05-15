#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";
import path from "path";
import build from "./build";
import dev from "./dev";
import start from "./start";
import generate from "./generate";
import { UserConfig } from "../export";
import { CommonParams } from "../common/types";
import packageJson from "../../package.json";

const createCommonParams = ({
  isDevelopment,
  isFast,
}: {
  isDevelopment: boolean;
  isFast: boolean;
}): CommonParams => {
  const abreactRoot = path.join(__dirname, "../../../");
  const userRoot = process.cwd();

  require("ts-node").register({
    transpileOnly: isFast,
    project: path.join(userRoot, "tsconfig.json"),
    compilerOptions: {
      module: "commonjs",
    },
  });

  const userConfig = require(path.join(userRoot, "src/abreact.config.ts")) as
    | UserConfig
    | undefined;
  const commonParams: CommonParams = {
    abreactRoot,
    userRoot,
    userConfig,
    isDevelopment: isDevelopment,
  };
  return commonParams;
};

console.log(
  chalk.blue(figlet.textSync("abreact", { horizontalLayout: "full" })),
);

const version = packageJson.version;
let cmdValue, isSpa;
program
  .version("Version: " + version, "-v, --version")
  .option("-s, --spa")
  .action(function(cmd, options) {
    cmdValue = cmd;
    if (options) {
      isSpa = options.spa;
    }
  });

program.parse(process.argv);

if (typeof cmdValue !== "string") {
  const commonParams = createCommonParams({
    isDevelopment: true,
    isFast: false,
  });
  dev(commonParams);
} else if (cmdValue === "build") {
  const commonParams = createCommonParams({
    isDevelopment: false,
    isFast: false,
  });
  build(commonParams);
} else if (cmdValue === "start") {
  const commonParams = createCommonParams({
    isDevelopment: false,
    isFast: true,
  });
  start(commonParams);
} else if (cmdValue === "generate") {
  const commonParams = createCommonParams({
    isDevelopment: false,
    isFast: false,
  });
  generate(commonParams);
} else {
  console.log(`
Usage: index [options] [command]
Options:
  -v, --version  output the version number

Commands:
  (default)      start development server
  build          build production code
  start          start production server (after running build or generate).
  generate       generate static site.
`);
}
