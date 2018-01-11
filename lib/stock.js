'use strict';
const path = require("path");
const request = require(path.resolve(__dirname,"./request"));
class stock {
    static async getQuote(stock_code) {
        let result = await request.curl("http://hq.sinajs.cn/list=" + stock_code.toLowerCase() , {charset:"GBK",dataType:"text"});
        if(result.status == 200){
            let data = result.data.replace("\"\;\n",'').split("=\"")[1].split(",");
            // console.log(data);
            return data;
        }
        return false;
    }
};

module.exports = stock;
