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
                primary[primaryKey] = primaryValue;
                collection.find(primary).toArray((err,result)=>{
                    cb(err,result);
                });
            });
            return
    }
};
var Model = function(){
    var saveInfo = {};

    /**
     * @description config the model
     * @param {Object} opt = {save:{
     *      path:"xxx",
     *      extra:".xxx",
     *      id:"xxx",
     *      keys:[xx,xx,xx]
     *  }
     * }
     * @param {function} cb
     */
    this.config = function(opt,cb){
        var savingInfo = opt["save"];
        if(savingInfo){
            saveInfo["path"] = savingInfo["path"]||"";
            saveInfo["extra"] = savingInfo["extra"]||"";
            saveInfo["id"] = savingInfo["id"]||"";
            saveInfo["keys"] = savingInfo["keys"]||[];
            saveInfo["db"] = savingInfo["db"]||"";
            saveInfo["url"] = savingInfo["url"]||"";
            saveInfo["collection"] = savingInfo["collection"]||"";
        }
        if(typeof cb == "function"){
            cb(saveInfo);
        }
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

    /**
     * filter for file
     * @param {String} extraName = ["xx"|null]
     * @param {String} fileNameKey = ["xx"|null]
     * @param {Array(String)} savingKeys = [[]|null]
     * @param {function} callback = [function(){}|null] return the errs or saved data
     * @returns {Object} = [{
            file:fileName,
            keys:keys,
            extra:extra,
            cb:cb
        }]
     */
    var fileFilter = function(){
        var extra = (typeof arguments[0] == "string") ? arguments[0] : saveInfo["extra"];
        var arg = [].slice.call(arguments,0);
        if(arg.length>1){
            arg.shift();
        }
        var info = filter.apply(this,arg);
        var pKey = info.id;
        var pVal = this[pKey]||"";
        var fileName = path.resolve(saveInfo["path"],pVal)+extra;
        return {
            file:fileName,
            keys:info.keys,
            extra:extra,
            cb:info.cb
        }
    };

    /**
     * save or update to file
     * @param {String} extraName = ["xx"|null]
     * @param {String} fileNameKey = ["xx"|null]
     * @param {Array(String)} savingKeys = [[]|null]
     * @param {function} callback = [function(){}|null] return the errs or saved data
     */
    this.saveToFile = function(){
        var info = fileFilter.apply(this,arguments);
        var storage = {};
        info.keys.forEach((key)=>{
            if(this[key]) storage[key] = this[key];
        });
        writeFile(info.file,storage,info.extra,info.cb);
    };
    this.updateToFile = function(){
        var info = fileFilter.apply(this,arguments);
        var storage = {};
        info.keys.forEach((key)=>{
            if(this[key]) storage[key] = this[key];
        });
        updateFile(info.file,storage,info.extra,info.cb);
    };
    /**
     * find model from file
     * @param {String} extraName = ["xx"|null]
     * @param {String} fileNameKey = ["xx"|null]
     * @param {function} callback = [function(){}|null] return the errs or saved data
     */
    this.findInFile = function(){
        var info = fileFilter.apply(this,arguments);
        readFile(info.file,info.extra,(err,obj)=>{
            info.cb(err,obj);
        })
    };

    /**
     * filter for db
     * @param {String} db = ["xx"|null]
     * @param {String} url = ["xx"|null]
     * @param {String} collection = ["xx"|null]
     * @param {String} primaryKey = ["xx"|null]
     * @param {Array(String)} savingKeys = [[]|null]
     * @param {function} callback = [function(){}|null] return the errs or saved data
     * @returns {Object} = [{
            db:dbType,
            url:dbUrl,
            collection:dbCollection,
            keys:keys,
            primary:primaryKey{key,value},
            cb:cb
        }]
     */
    var dbFilter = function(){
        var dbType = (typeof arguments[0] == "string") ? arguments[0] : saveInfo["db"];
        var dbUrl = (typeof arguments[1] == "string") ? arguments[1] : saveInfo["url"];
        var dbCollection = (typeof arguments[2] == "string") ? arguments[2] : saveInfo["collection"];
        var arg = [].slice.call(arguments,0);
        if(arg.length>1){
            arg.shift();
        }
        var info = filter.apply(this,arg);
        var pKey = info.id;
        var pVal = this[pKey]||"";
        return {
            db:dbType,
            url:dbUrl,
            collection:dbCollection,
            keys:info.keys,
            primary:{key:pKey,value:pVal},
            cb:info.cb
        }
    };

    this.updateToDB = function(){
        var info = dbFilter.apply(this,arguments);
        var storage = {};
        info.keys.forEach((key)=>{
            if(this[key]) storage[key] = this[key];
        });
        updateDB(info.db,info.url,info.collection,storage,info.primary.key,info.primary.value,info.cb);
    };
    this.insertToDB = function(){
        var info = dbFilter.apply(this,arguments);
        var storage = {};
        info.keys.forEach((key)=>{
            if(this[key]) storage[key] = this[key];
        });
        insertDB(info.db,info.url,info.collection,storage,info.primary.key,info.primary.value,info.cb);
    };

    this.findInDB = function(){
        var info = dbFilter.apply(this,arguments);
        readDB(info.db,info.url,info.collection,info.primary.key,info.primary.value,info.cb);
    };
};

module.exports = function(){
    return new Model();
};