'use strict';
const fs = require("fs");
const path = require("path");
const filePath = path.resolve(__dirname,"../data/cache.db");
class cache {
    static get(key) {
        let data = {};
        try {
            fs.accessSync(filePath);
        }catch(err){
            return false;
        }
        data = fs.readFileSync(filePath, "utf-8");
        if(data.length !== 0){
            data = JSON.parse(data);
            if(data[key] != undefined && data[key].ttl != undefined){
                if(Date.now() > data[key].ttl){
                    return false;
                }else{
                    return data[key]['value'];
                }
            }else if(data[key] != undefined){
                return data[key]['value'];
            }
        }
        return false;
    }
    static set(key, value, ttl){
        let data = {}
        let access = true;
        try {
            fs.accessSync(filePath);
        }catch(err){
            access = false;
        }
        if(access){
            data = fs.readFileSync(filePath, "utf-8");
        }
        if(typeof data == "string" && data.length != 0){
            data = JSON.parse(data);
        }else{
            data = {};
        }
        data[key] = {value,ttl};
        let result = fs.writeFileSync(filePath, JSON.stringify(data));
    }
};
module.exports = cache;
