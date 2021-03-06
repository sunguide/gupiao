const chalk = require("chalk");
const moment = require("moment");
const path = require("path");
//cunstom libs
const request = require(path.resolve(__dirname, "./../lib/request"));
const helper = require(path.resolve(__dirname, "./../lib/helper"));
const cache = require(path.resolve(__dirname, "./../lib/cache"));
const stock = require(path.resolve(__dirname, "./../lib/stock"));
class pankou {
    static async once(){
        let current = Date.now();
        if (new Date().getDay() === 0 || new Date().getDay() === 6) {
            console.log("今日为休市日，阁下不妨等开市再来。");
            return;
        }
        if(new Date().getHours() < 9){
            console.log("当日尚未开市，可稍等一下。");
            return;
        }
        if(new Date().getHours() > 15){
            console.log("当日已经休市，不妨休息一下。");
            return;
        }
        let results = await request.curl(`http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?dtformat=HH:mm:ss&js=[(x)]&rows=10&cb=&page=1&_=${current}`,{dataType: 'json' });

        if(results && results.data.length > 0){
            results = results.data;
            results = results.reverse();
            let message = "";
            let last_time = cache.get("last_time");
            let last_stock = cache.get("last_stock");
            for(let i = 0;i< results.length;i++){
                let item = results[i];
                let date = helper.datetime("YYYY-MM-DD");
                item = item.split(",");
                let id = helper.md5(date + item[0]+item[2]+item[3]+item[4]);
                let itemTime = Date.parse(date + " " + item[1]);
                //超过60s,就失效
                if(itemTime < (Date.now() -60000)){
                    // continue;
                }
                if(itemTime < last_time || (itemTime == last_time && last_stock == item[4].substr(0,6))){
                    continue;
                }
                let quote = await stock.getQuote(helper.getFullStockCode(item[4].substr(0,6)));

                let stock_name = getCurrentPrice(quote);
                // console.log(stock_name.length);
                stock_name = (stock_name + "  ");

                let stock_trade = getTradeType(item[3]);
                let stock_trade_description = "";
                let stock_trade_direction = "";
                switch (stock_trade.direction) {
                    case 1:
                        stock_trade_direction = " ↑ "
                        break;
                    case -1:
                        stock_trade_direction = " ↓ "
                        break;
                    default:
                        stock_trade_direction = "   "
                }
                switch (stock_trade.color) {
                    case "red":
                        stock_trade_description = chalk.red(stock_trade.name + stock_trade_direction + item[2])
                        break;
                    case "green":
                        stock_trade_description = chalk.green(stock_trade.name + stock_trade_direction + item[2])
                    break;
                    default:
                      stock_trade_description = stock_trade.name + stock_trade_direction + item[2]
                }
                console.log(item[1] + " " + stock_name + stock_trade_description);
                cache.set("last_time", itemTime);
                cache.set("last_stock", item[4].substr(0,6));
            }
        }else{
            console.log("暂无盘中异动信息");
            console.log(results);
        }
    }

    static loop(){
        setInterval(() => {
            pankou.once();
        },2000)
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

module.exports = pankou;
