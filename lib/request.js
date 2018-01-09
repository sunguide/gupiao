'use strict';

//简单封装的一层请求
const request = require("superagent");

//是否启用代理
// request.enableProxy = false;
// request.proxy = null; //http://localhost:8008


request.enableProxy = false;
request.proxy = "http://127.0.0.1:50351";
request.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36";

request.get = function (url, data, fn){
    if(request.enableProxy && request.proxy){
        require("superagent-proxy")(request);
    }

    let req = request('GET', url);

    if(request.enableProxy && request.proxy){
        req.proxy(request.proxy);
    }

    if ('function' === typeof data) fn = data, data = null;
    if (data) req.query(data);

    if (fn) req.end(fn);
    return req;
};

request.post = function(url, data, fn){
    if(request.enableProxy && request.proxy){
        require("superagent-proxy")(request);
    }
    let req = request('POST', url);

    if(request.enableProxy && request.proxy){
        req.proxy(request.proxy);
    }
    if ('function' === typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
};

request.curl2 = function (url, options){
    if(request.enableProxy && request.proxy){
        require("superagent-proxy")(request);
    }
    return new Promise((resolve, reject ) => {
        let req = request('GET', url);
        if(request.enableProxy && request.proxy){
            req.proxy(request.proxy);
        }

        req.set({"User-Agent":request.userAgent});

        if (options) {
            if(options.dataType){
                req.accept(options.dataType);
            }
            if(options.charset){
                require("superagent-charset")(request);
                req.charset('gbk');
            }
        }
        req.end((err,res) => {
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(res);
            }
        });
    });

};

request.curl = function(url, options){
    const urllib = require('urllib');
    return urllib.request(url, options);
}
module.exports = request;
