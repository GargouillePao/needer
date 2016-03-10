var path = require("path");
var model = require(path.resolve("./src","index")).Model();
module.exports = function(){
    return new Entity();
};
var Entity = function(){
    this.uid = "123-432---000";
    this.psw = "0000";
    this.mail = "xxx@qq.com";
    this.config = (cb)=>{
        model.config.call(this,{save:{
            path:"sample/storage",
            id:"uid",
            extra:".json",
            db:"mongodb",
            url:"mongodb://localhost:27017/needer",
            collection:"entity",
            keys:["uid","psw","mail"]
        }},cb);
    };
    this.saveAll = (cb)=>{
        model.saveToFile.call(this,cb)
    };
    this.savepsw = (cb)=>{
        model.updateToFile.call(this,".json","uid",["mail"],cb)
    };
    this.saveInDB = (cb)=>{
        model.insertToDB.call(this,cb);
    };
    this.findThisInBD = (cb)=>{
        model.findInDB.call(this,cb);
    };
    this.updateInDB = (cb)=>{
        model.updateToDB.call(this,cb);
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
