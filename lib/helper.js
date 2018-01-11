module.exports = helper = {
    getFullStockCode(stock_code) {
        if (stock_code < "600000") {
            return "SZ" + stock_code;
        } else {
            return "SH" + stock_code;
        }
    },
    getStockAnchor(stock_code, stock_name){
        return "$" + stock_name + "(" + helper.getFullStockCode(stock_code) + ")$";
    },
    md5(str){
        let crypto = require("crypto");
        let md5 = crypto.createHash("md5");
        md5.update(str);
        str = md5.digest('hex');
        return str.toUpperCase();
    },

    datetime(format, timestamp){
        const moment = require("moment");
        if(timestamp){
            return moment(timestamp).format(format);
        }
        return moment().format(format);
    },
    isTradeTime(){
        if(new Date().getDay() === 0 || new Date().getDay() === 6 || new Date().getHours() > 15 || new Date().getHours() < 9){
            return false;
        }

        if(new Date().getHours() > 10 && new Date().getMinutes() < 15){
            return false;
        }

        if(new Date().getHours() > 11 && new Date().getHours() > 12 && new Date().getMinutes() > 30){
            return false;
        }
        if(new Date().getHours() >= 12 && new Date().getHours() > 13){
            return false;
        }
        return true;
    },
    async sleep(timeout){
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(true);
            }, timeout);
        });
    },
    JSON:{
        parse(str){
            try {
                str = JSON.parse(str);
            } catch (e) {
                return false;
            }
            return str;
        }
    }
};
