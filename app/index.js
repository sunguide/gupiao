'use strict';
const pankou = require("./pankou");
class app {
    static start(){
        try{
            pankou.loop();
        }catch(err){
            console.log(err);
        }
    }
    static pankou(){
        try{
            pankou.once();
        }catch(err){
            console.log(err);
        }

    }

    static pankouLoop(){
        try{
            pankou.loop();
        }catch(err){
            console.log(err);
        }
    }

}
module.exports = app;
