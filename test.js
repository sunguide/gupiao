var ui = require('cliui')()
var chalk = require("chalk");
var shelljs = require('shelljs');
var logUpdate = require("log-update");
var shell = require('shell');
// Initialization
var bash = new shell( { chdir: __dirname } )
var Table = require('cli-table2');

// instantiate
var table = new Table({
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

table.push(
    ['foo', 'bar', 'frob', 'bar', 'frob', 'bar', 'frob', 'bar', 'baz']
);
table.push( ['frob', 'bar', 'frob', 'bar', 'frob', 'bar', '${frame}'])
table.push( ['frob', 'bar', 'frob', 'bar', 'frob', 'bar', '${frame}'])
// console.log(table.toString());return;
const frames = ['-', '\\', '|', '/'];
let i = 0;
setInterval(() => {
    const frame = frames[i = ++i % frames.length];

    logUpdate(eval('`'+ table.toString() + '`')+i);
}, 80);

return;
setInterval(function(){
  // var $p = require('procstreams');
  // $p('pwd').pipe(function(err,res){
  //   console.log(res);
  // })
  shelljs.exec("clear");
  console.log(ui.toString())
},1000)
