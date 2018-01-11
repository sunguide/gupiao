#!/usr/bin/env node
var fs = require("fs"),
    path = require("path");
var program = require("commander");
function range(val) {
  console.log(val)
    return val;
}
program
  .version('0.0.1')
  .option('-r, --rocket', '盘中异动实时监控')
  .option('add, --add <items>', '添加股票 例如：gupiao add 600100',range)
  .option('remove, --remove <items>', '删除股票 例如：gupiao remove 600100', range)
  .option('list, --list', '股票列表')
  .option('--about', '关于');
program.parse(process.argv);
const app = require(path.resolve(__dirname,"../app/index"));

if (program.rocket) {
    app.pankouLoop();
    return;
}

if(program.about){
    console.log("\n\n专为程序员量身打造的炒股盯盘小工具!\n\n")
    return;
}


if(program.add){

    if(app.addFavorite(program.add)){
        console.log("添加成功");
    }
    return;
}

if(program.remove){
    if(app.removeFavorite(program.remove)){
        console.log("删除成功");
    }
    return;
}

if(program.list){
    let stocks = app.favoriteList();
    let output = "";
    let keys = Object.keys(stocks);
    if(stocks){
        for(let i = 0; i < keys.length; i++){
            if(stocks[keys[i]]){
                output += stocks[keys[i]];
            }
        }
        console.log(output);
    }
    return;
}
app.favorites();
