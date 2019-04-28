#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";
import path from "path";
import build from "./build";
import dev from "./dev";
import start from "./start";
import generate from "./generate";
import { AbreactUserConfig } from "../common/types";
import { CommonParams } from "./types";
import packageJson from "../../package.json";

const version = packageJson.version;

const abreactRoot = path.join(__dirname, "../../../");
const userRoot = process.cwd();
const userConfig = require(path.join(userRoot, "src/abreact.config")) as
  | AbreactUserConfig
  | undefined;
const commonParams: CommonParams = {
  abreactRoot,
  userRoot,
  userConfig,
  isDevelopment: true
};

console.log(
  chalk.blue(figlet.textSync("abreact", { horizontalLayout: "full" }))
);

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
  dev(commonParams);
} else if (cmdValue === "build") {
  commonParams.isDevelopment = false;
  build(commonParams);
} else if (cmdValue === "start") {
  commonParams.isDevelopment = false;
  start(commonParams);
} else if (cmdValue === "generate") {
  commonParams.isDevelopment = false;
  generate(commonParams);
} else {
  console.log(`
Usage: index [options] [command]
Options:
  -v, --version  output the version number

Commands:
  (default)      start development server
  build          build production code
  start          start production server (after running build).
  generate       generate static site.
`);
}
