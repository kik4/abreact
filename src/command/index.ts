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
console.log(`Version: ${version}`);

program.version(version, "-v, --version");

program
  .command("build")
  .description("build")
  .action(function(env, options) {
    console.log("");
    console.log("Build");
    console.log("");
    build(commonParams);
  });

program
  .command("start")
  .description("start")
  .action(function(env, oprionts) {
    console.log("");
    console.log("Start");
    console.log("");
    start(commonParams);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
