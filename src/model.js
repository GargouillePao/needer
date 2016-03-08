var path = require("path");
var fs = require("fs");
module.exports = function(){
    return new Model();
};
var writerFile = function(name,data,type,cb) {
    switch (type) {
        case ".json":
            var storage = JSON.stringify(data);
            fs.writeFile(name, storage, {
                encoding: 'utf8', mode: 438, flag: 'w'
            }, (err)=> {
                cb(err, storage);
            });
            break;
    }
}
var readFile = function(name,data,type,cb){
    switch (type) {
        case ".json":
            var storage = JSON.stringify(data);
            fs.writeFile(name, storage, {
                encoding: 'utf8', mode: 438, flag: 'w'
            }, (err)=> {
                cb(err, storage);
            });
            break;
    }
}
var Model = function(){
    var saveInfo = {};
    this.config = function(opt){
        var savingInfo = opt["save"];
        if(savingInfo){
            saveInfo["path"] = savingInfo["path"]||"";
            saveInfo["type"] = savingInfo["type"]||"";
            saveInfo["name"] = savingInfo["name"]||"";
            saveInfo["keys"] = savingInfo["keys"]||[];
        }
    }
    this.__readingFilter = function(cb4file,cb4db){
        var type = saveInfo["type"];
        if(type.indexOf(".")==0){
            cb4file(type);
        }else{
            cb4db(type);
        }
    }
    this.__savingFilter = function(cb4file,cb4db){
        var type = saveInfo["type"];
        var storage = {};
        var primaryKey = path.resolve(saveInfo["path"],this[saveInfo["name"]]||"")+type;
        saveInfo["keys"].forEach((key)=>{
            if(this[key]) storage[key] = this[key];
        });
        if(type.indexOf(".")==0){
            cb4file(type,primaryKey,storage);
        }else{
            cb4db(type,primaryKey,storage);
        }
    }
    this.save = function(cb){
        this.__savingFilter(
            (extraName,fileName,data)=>{
                writerFile(fileName,data,extraName,cb);
            },
            (type,primaryKey,data)=>{

            }
        );
    }
    this.find = function(primaryKey,updateKeys,cb){

    }
};
