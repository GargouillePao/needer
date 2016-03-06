
var ControllerManager = require("./controllerManager").object;
var path = require("path");
var Manager = function(){
    ControllerManager.apply(this,arguments);

    /**
     * ÅäÖÃappInfo
     * @param appInfo
     */
    this.config = (appInfo)=>{
        appInfo.factory = this.factory;
        this.store("app",appInfo);
    };
    this.setPath = (_path)=>{
        if(typeof _path == "string"){
            this.set("path",path.resolve(_path));
        }
        if(typeof _path == "object"){
            var cpath = _path["model"] || "";
            this.set("path",path.resolve(cpath))
        }
    };
    this.factory = (modelName)=>{
        return require(path.join(this.getPath(),modelName));
    }
};

module.exports = function(){
    return new Manager();
};
module.exports.object = Manager;
module.exports.create = function(){
    return new Manager();
};