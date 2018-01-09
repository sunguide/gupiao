#!/usr/bin/env node
var fs = require("fs"),
    path = require("path");
var program = require("commander");
program
  .version('0.0.1')
  .option('-r, --rocket', '盘中异动实时监控')
  .option('--about', '关于');
program.parse(process.argv);

if (program.rocket) {
    const app = require(path.resolve(__dirname,"../app/index"));
    app.pankouLoop();
}

if(program.about){
    console.log("\n\n专为程序员量身打造的炒股盯盘小工具!\n\n")
}
