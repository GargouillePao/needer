var path = require("path");
var fs = require("fs");
var updateFile = function(name,data,extra,cb){
    fs.exists(name,(exists)=>{
        console.log("obj",exists);
        if(!exists){
            writerFile(name,data,extra,cb);
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
                        writerFile(name,data,extra,cb);
                    });
                    break;
            }
        }
    });
};
var writerFile = function(name,data,extra,cb) {
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
        }
        if(cb){
            cb(saveInfo);
        }
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
        var arcLen = arguments.length;
        var extra = (typeof arguments[0] == "string") ? arguments[0] : saveInfo["extra"];
        var id = (typeof arguments[1] == "string") ? arguments[1] : saveInfo["id"];
        var keys = saveInfo["keys"];
        if(arguments[2] instanceof Array){
            keys = arguments[2];
        }
        var cb = (typeof arguments[arcLen-1] == "function") ? arguments[arcLen-1] : function(){};

        var pKey = id;
        var pVal = this[pKey]||"";
        var fileName = path.resolve(saveInfo["path"],pVal)+extra;

        return {
            file:fileName,
            keys:keys,
            extra:extra,
            cb:cb
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
        writerFile(info.file,storage,info.extra,info.cb);
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

    this.updateToDB = function(){

    };
    this.saveToDB = function(){

    };

    this.findInDB = function(){

    }
};

module.exports = function(){
    return new Model();
};