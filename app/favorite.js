const chalk = require("chalk");
const moment = require("moment");
const path = require("path");
const logUpdate = require("log-update");
const Table = require('cli-table2');
//cunstom libs
const request = require(path.resolve(__dirname, "./../lib/request"));
const helper = require(path.resolve(__dirname, "./../lib/helper"));
const cache = require(path.resolve(__dirname, "./../lib/cache"));
const stock = require(path.resolve(__dirname, "./../lib/stock"));
let output = "";
class favorite {
    static async show(){
        output = await favorite.getTable();
        // console.log(table);return;
        setInterval(() => {
            favorite.getTable().then(function(data){
               output = data;
            });
            logUpdate(output);
        }, 1000);
    }
    static async getTable(){
        let quotes = await favorite.getQuotes();
        // console.log(quotes);
        var table = new Table({
          // chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
          //        , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
          //        , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
          //        , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
        let tables = [];
        let collums = [];
        if(quotes){
            collums.push("股票名称");
            collums.push("当前价格");
            collums.push("价格变动");
            collums.push("涨幅");
            collums.push("最高价");
            collums.push("最低价");
            collums.push("开盘价");
            collums.push("收盘价");
            collums.push("成交量");
            table = new Table({
                style:{border:[]}
                // chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
                // colWidths: [100,200,200]
            });
            table.push(collums);
            for(let i = 0;i< quotes.length;i++){
                let item = quotes[i];
                let changes = item.change > 0 ? 1:(item.change<0?-1:0);
                switch (changes) {
                    case 1:
                        item.name = chalk.red(item.name);
                        item.current = chalk.red(item.current);
                        item.change = chalk.red(item.change.toFixed(2));
                        item.percentage = chalk.red(item.percentage.toFixed(2));
                        break;
                    case -1:
                        item.name = chalk.green(item.name);
                        item.current = chalk.green(item.current);
                        item.change = chalk.green(item.change);
                        item.percentage = chalk.green(item.percentage);
                        break;
                  default:

                }

                item.high = item.high - item.pre_close ? chalk.red(item.high):chalk.green(item.high);
                item.low = item.low - item.pre_close ? chalk.red(item.low):chalk.green(item.low);
                item.open = item.open - item.pre_close ? chalk.red(item.open):chalk.green(item.open);
                item.close = item.close - item.pre_close ? chalk.red(item.close):chalk.green(item.close);
                collums = [];
                collums.push(item.name);
                collums.push(item.current);
                collums.push(item.change);
                collums.push(item.percentage);
                collums.push(item.high);
                collums.push(item.low);
                collums.push(item.open);
                collums.push(Math.random());
                collums.push((item.volume / 10000).toFixed(0) + "万");
                // console.log(collums.length)
                table.push(collums);

            }
        }
        // console.log(tables);
        // table.push(tables);
        return table.toString();
    }
    static async getQuotes(){
        let current = Date.now();
        let stocks = favorite.list();
        let hours = new Date().getHours();
        let keys = Object.keys(stocks);
        let quotes = [];
        if(stocks && keys.length > 0){
            let message = "";
            for(let i = 0;i< keys.length;i++){
                let item = stocks[keys[i]];
                if(!item){
                    continue;
                }
                let quote = await stock.getQuote(helper.getFullStockCode(item));
                quote = {
                    "name":quote[0],
                    "current":quote[3],
                    "pre_close":quote[2],
                    "change":quote[3] - quote[2],
                    "percentage":(quote[3] - quote[2]) / (100 * quote[2]),
                    "open":quote[1],
                    "high":quote[4],
                    "low":quote[5],
                    "close": hours > 15 ? quote[3] :"交易中",
                    "volume": quote[9]
                }
                quotes.push(quote);
            }
        }
        return quotes;
    }
    static list(){
        return cache.get("stock_favorites");
    }
    static add(stock_code){
        let stocks = cache.get("stock_favorites");
        if(stocks){
            stocks[stock_code] = stock_code;
        }else {
            stocks = {};
            stocks[stock_code] = stock_code;
        }
        return cache.set("stock_favorites", stocks);
    }
    static remove(stock_code){
        let stocks = cache.get("stock_favorites");
        if(stocks){
            stocks[stock_code] = false;
        }
        return cache.set("stock_favorites", stocks);
    }
}

function getCurrentPrice(quote){
    if(quote[0].length == 3){
        quote[0] += "  ";
    }
    quote[3] = parseFloat(quote[3]).toFixed(2).padStart(6);
    let title = quote[0] + " " + quote[3];
    let diff = parseFloat(quote[3]) - parseFloat(quote[2]);
    if(diff > 0){
        return chalk.red(title);
    }else if(diff < 0){
        return chalk.green(title);
    }else{
        return title;
    }
}
function getTradeType(id){
    let pankou = {1:{name:"顶级买单",color:"red",direction:1,pair:2,id:1},2:{name:"顶级卖单",color:"green",direction:-1,pair:1,id:2},4:{name:"封涨停板",color:"red",direction:1,pair:8,id:4},8:{name:"封跌停板",color:"green",direction:-1,pair:4,id:8},16:{name:"打开涨停板",color:"green",direction:-1,pair:32,id:16},32:{name:"打开跌停板",color:"red",direction:1,pair:16,id:32},64:{name:"有大买盘",color:"red",direction:1,pair:128,id:64},128:{name:"有大卖盘",color:"green",direction:-1,pair:64,id:128},256:{name:"机构买单",color:"red",direction:1,pair:512,id:256},512:{name:"机构卖单",color:"green",direction:-1,pair:256,id:512},8193:{name:"大笔买入",color:"red",direction:1,pair:8194,id:8193},8194:{name:"大笔卖出",color:"green",direction:-1,pair:8193,id:8194},8195:{name:"拖拉机买",color:"red",direction:1,pair:8196,id:8195},8196:{name:"拖拉机卖",color:"green",direction:-1,pair:8195,id:8196},8201:{name:"火箭发射",color:"red",direction:1,pair:8204,id:8201},8202:{name:"快速反弹",color:"red",direction:1,pair:8203,id:8202},8203:{name:"高台跳水",color:"green",direction:-1,pair:8202,id:8203},8204:{name:"加速下跌",color:"green",direction:-1,pair:8201,id:8204},8205:{name:"买入撤单",color:"green",direction:-1,pair:8026,id:8205},8206:{name:"卖出撤单",color:"red",direction:1,pair:8205,id:8206},8207:{name:"竞价上涨",color:"red",direction:1,pair:8208,id:8207},8208:{name:"竞价下跌",color:"green",direction:-1,pair:8207,id:8208},8209:{name:"高开5日线",color:"red",direction:1,pair:8210,id:8209},8210:{name:"低开5日线",color:"green",direction:-1,pair:8209,id:8210},8211:{name:"向上缺口",color:"red",direction:1,pair:8212,id:8211},8212:{name:"向下缺口",color:"green",direction:-1,pair:8211,id:8212},8213:{name:"60日新高",color:"red",direction:1,pair:8214,id:8213},8214:{name:"60日新低",color:"green",direction:-1,pair:8213,id:8214},8215:{name:"60日大幅上涨",color:"red",direction:1,pair:8216,id:8215},8216:{name:"60日大幅下跌",color:"green",direction:-1,pair:8215,id:8216}}
    if(pankou[id]){
        return pankou[id];
    }else{
        return "";
    }
}

module.exports = favorite;
