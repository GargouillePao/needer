var path = require("path");
var fs = require("fs");
var updateFile = function(name,data,extra,cb){
    fs.exists(name,(exists)=>{
        console.log("obj",exists);
        if(!exists){
            writeFile(name,data,extra,cb);
        }else{
            switch (extra) {
                case ".json":
                    console.log("obj");
                    fs.readFile(name,'utf-8',(err,_data)=>{
                        if(err){
                            console.err("read file "+name+" error",err);
                            cb(err);
                            return;
                        }
                        var objread = JSON.parse(_data);
                        console.log("obj",objread);
                        for(_k in objread){
                            if(!data.hasOwnProperty(_k)){
                                data[_k] = objread[_k];
                            }
                        }
                        writeFile(name,data,extra,cb);
                    });
                    break;
            }
        }
    });
};
var writeFile = function(name,data,extra,cb) {
    switch (extra) {
        case ".json":
            var storage = JSON.stringify(data);
            fs.writeFile(name, storage, {
                encoding: 'utf8', mode: 438, flag: 'w'
            }, (err)=> {
                cb(err, storage);
            });
            break;
    }
};
var readFile = function(name,extra,cb){
    switch (extra) {
        case ".json":
            fs.readFile(name, 'utf8', (err,data)=> {
                cb(err, JSON.parse(data));
            });
            break;
    }
};

var insertDB = function(dbType,dbUrl,dbCollection,data,primaryKey,primaryValue,cb){
    switch (dbType) {
        case "mongodb":
            require("./mongoClient").getInstance(dbUrl,(db)=>{
                var collection = db.collection(dbCollection);
                collection.insertOne(data,(err,result)=>{
                    cb(err,result);
                });
            });
            return
    }
};
var updateDB = function(dbType,dbUrl,dbCollection,data,primaryKey,primaryValue,cb){
    switch (dbType) {
        case "mongodb":
            require("./mongoClient").getInstance(dbUrl,(db)=>{
                var collection = db.collection(dbCollection);
                var primary = {};
                primary[primaryKey] = primaryValue;
                collection.updateOne(primary,{ $set: data },(err,result)=>{
                    cb(err,result);
                });
            });
            return
    }
};
var readDB = function(dbType,dbUrl,dbCollection,primaryKey,primaryValue,cb){
    switch (dbType) {
        case "mongodb":
            require("./mongoClient").getInstance(dbUrl,(db)=>{
                var collection = db.collection(dbCollection);
                var primary = {};
                if(primaryValue && primaryValue!=""){
                    primary[primaryKey] = primaryValue;
                }
                collection.find(primary).toArray((err,result)=>{
                    if(err){
                        cb(err,[]);
                    }else{
                        cb(err,result);
                    }
                });
            });
            return
    }
};
var Model = function(){
    var fileInfo = {};
    var dbInfo = {};

    var setFile = function(opt) {
        var info = {};
        typeof opt["path"] == "string" ? info["path"] = opt["path"] : info["path"] = fileInfo["path"];
        typeof opt["extra"] == "string" ? info["extra"]  = opt["extra"] : info["extra"] = fileInfo["extra"];
        typeof opt["id"] == "string" ? info["id"] = opt["id"] : info["id"] = fileInfo["id"];
        typeof opt["keys"] == "object" && opt["keys"] instanceof Array ? info["keys"] = opt["keys"] : info["keys"] = fileInfo["keys"];
        return info;
    };
    var setDB = function(opt){
        var info = {};
        typeof opt["type"] == "string" ? info["type"] = opt["type"] : info["type"] = dbInfo["type"];
        typeof opt["url"] == "string" ? info["url"]  = opt["url"] : info["url"] = dbInfo["url"];
        typeof opt["id"] == "string" ? info["id"] = opt["id"] : info["id"] = dbInfo["id"];
        typeof opt["keys"] == "object" && opt["keys"] instanceof Array ? info["keys"] = opt["keys"] : info["keys"] = dbInfo["keys"];
        typeof opt["collection"] == "string" ? info["collection"] = opt["collection"] : info["collection"] = dbInfo["collection"];
        return info;
    };

    /**
     * @description config the model
     * @param {Object} opt = {
     * file:{
     *      path:"xxx",
     *      extra:".xxx",
     *      id:"xxx",
     *      keys:[xx,xx,xx]
     *      }
     * db:{
     *      type:"xxx",
     *      id:"xxx",
     *      keys:[xx,xx,xx]
     *      }
     * }
     * @param {function} cb
     */
    this.config = function(opt,cb){
        if(opt["file"]) fileInfo = setFile(opt["file"]);
        if(opt["db"]) dbInfo = setDB(opt["db"]);
        if(typeof cb == "function") cb({file:fileInfo,db:dbInfo});
    };

    /**
     * filter
     * @param {String} primaryKey = ["xx"|null]
     * @param {Array(String)} savingKeys = [[]|null]
     * @param {function} callback = [function(){}|null] return the errs or saved data
     * @returns {Object} = [{
            id:id
            keys:keys,
            cb:cb
        }]
     */
    var filter = function(){
        var arcLen = arguments.length;
        var id = (typeof arguments[0] == "string") ? arguments[0] : saveInfo["id"];
        var keys = saveInfo["keys"];
        if(arguments[1] instanceof Array){
            keys = arguments[1];
        }
        var cb = (typeof arguments[arcLen-1] == "function") ? arguments[arcLen-1] : function(){};
        var info =  {
            id:id,
            keys:keys,
            cb:cb
        };
        console.log(info);
        return info
    };

    this.getInfo = function(type){
        if(type == "db")return dbInfo;
        if(type == "file")return fileInfo;
    }
    var getStorage = function(info){
        var storage = {};
        if(info.keys && info.keys.forEach){
            info.keys.forEach((key)=>{
                if(this[key]) storage[key] = this[key];
            });
        }else{
            storage = this;
        }
        return storage;
    }

    var fileFilter = function(opt){
        var info = setFile(opt);
        info["idValue"] = this[info.id];
        info["file"] = path.resolve(info["path"],info.idValue||"")+info.extra;
        return info;
    };
    this.saveToFile = function(opt,cb){
        var info = fileFilter.call(this,opt);
        var storage = getStorage.call(this,info);
        if(info.idValue){
            writeFile(info.file,storage,info.extra,cb);
        }else{
            cb("this primary key has no value error");
        }
    };
    this.updateToFile = function(opt,cb){
        var info = fileFilter.call(this,opt);
        var storage = getStorage.call(this,info);
        if(info.idValue){
            updateFile(info.file,storage,info.extra,cb);
        }else{
            cb("this primary key has no value");
        }

    };
    this.findInFile = function(opt,cb){
        var info = fileFilter.call(this,opt);
        readFile(info.file,info.extra,cb);
    };

    var dbFilter = function(opt){
        var info = setDB(opt);
        var pKey = info.id;
        var pVal = this[info.id];
        info["primary"] = {key:pKey,value:pVal};
        return info;
    };
    this.updateToDB = function(opt,cb){
        var info = dbFilter.call(this,opt);
        var storage = getStorage.call(this,info);
        if(info.primary){
            updateDB(info.type,info.url,info.collection,storage,info.primary.key,info.primary.value,cb);
        }else{
            cb("no primary error");
        }
    };
    this.insertToDB = function(opt,cb){
        var info = dbFilter.call(this,opt);
        var storage = getStorage.call(this,info);
        if(info.primary){
            insertDB(info.type,info.url,info.collection,storage,info.primary.key,info.primary.value,cb);
        }else{
            cb("no primary error");
        }
    };
    this.findInDB = function(opt,cb){
        var info = dbFilter.call(this,opt);
        readDB(info.type,info.url,info.collection,info.primary.key,info.primary.value,cb);
    };
};

module.exports = function(){
    return new Model();
};