#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
const program = require("commander");

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
  .action(function() {
    console.log("build");
  });

program
  .command("start")
  .description("start")
  .action(function() {
    console.log("start");
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
