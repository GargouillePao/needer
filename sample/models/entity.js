var path = require("path");
var model = require(path.resolve("./src","index")).Model();
module.exports = function(){
    return new Entity();
};
var Entity = function(){
    this.uid = "12345";
    this.psw = "xxxxx!!!!";
    this.mail = "123456@qq.com";
    this.config = (cb)=>{
        model.config.call(this,{save:{
            path:"sample/storage",
            id:"uid",
            extra:".json",
            keys:["uid","psw","mail"]
        }},cb);
    };
    this.saveAll = (cb)=>{
        model.saveToFile.call(this,cb)
    };
    this.savepsw = (cb)=>{
        model.updateToFile.call(this,".json","uid",["mail"],cb)
    };
    this.setPsw = function(psw){
        this.psw = psw;
    };
    this.find = (cb)=>{
        model.findInFile.call(this,(err,data)=>{
            cb(err,data);
        })
    }
};
