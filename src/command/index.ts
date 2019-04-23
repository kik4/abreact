#!/usr/bin/env node
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";
import path from "path";
import build from "./build";
import start from "./start";

const version = "0.0.1";

const abreactRoot = path.join(__dirname, "../../");
const userRoot = process.cwd();
const commonParams = { abreactRoot, userRoot };

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
  start(commonParams);
} else if (cmdValue === "build") {
  build(commonParams);
} else {
  console.log(`
Usage: index [options] [command]
Options:
  -v, --version  output the version number
  -s, --spa      run as SPA mode

Commands:
  (default)      start development server
  build          build production code
`);
}
