'use strict';
const path = require("path");
const pankou = require(path.resolve(__dirname,"./pankou"));
const favorite = require(path.resolve(__dirname,"./favorite"));
const stock = require(path.resolve(__dirname,"../lib/stock"));
class app {
    static start(){
        try{
            pankou.loop();
        }catch(err){
            // console.log(err);
        }
    }
    static pankou(){
        try{
            pankou.once();
        }catch(err){
            // console.log(err);
        }

    }

    static pankouLoop(){
        try{
            pankou.loop();
        }catch(err){
            // console.log(err);
        }
    }
    static favorites(){
        try{
            favorite.show();
        }catch(err){
            console.log(err);
        }
    }
    static addFavorite(code){
        return favorite.add(code);
    }
    static removeFavorite(code){
        return favorite.remove(code);
    }

    static favoriteList(){
        return favorite.list();
    }

}
module.exports = app;
