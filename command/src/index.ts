#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const program = require("commander");

import build from "./build";
import start from "./start";

const version = "0.0.1";

clear();
console.log(
  chalk.blue(figlet.textSync("abreact", { horizontalLayout: "full" }))
);
console.log(`Version: ${version}`);

program.version(version, "-v, --version");

program
  .command("build")
  .description("build")
  .option("-p, --path <path>", "path")
  .action(function(env, options) {
    console.log("");
    console.log("Build");
    console.log("");
    build(env.path || process.cwd());
  });

program
  .command("start")
  .description("start")
  .option("-p, --path <path>", "path")
  .action(function(env, oprionts) {
    console.log("");
    console.log("Start");
    console.log("");
    start(env.path || process.cwd());
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
