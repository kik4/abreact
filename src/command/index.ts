#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";
import path from "path";
import build from "./build";
import dev from "./dev";
import start from "./start";
import { AbreactUserConfig } from "../common/types";

const version = "0.0.1";

const abreactRoot = path.join(__dirname, "../../");
const userRoot = process.cwd();
const userConfig = require(path.join(userRoot, "src/abreact.config")) as
  | AbreactUserConfig
  | undefined;
const commonParams = { abreactRoot, userRoot, userConfig };

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
  build(commonParams);
} else if (cmdValue === "start") {
  start(commonParams);
} else {
  console.log(`
Usage: index [options] [command]
Options:
  -v, --version  output the version number

Commands:
  (default)      start development server
  build          build production code
  start          start production server (after running build).
`);
}
