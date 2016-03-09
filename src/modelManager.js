
var BaseManager = require("./manager").object;
var path = require("path");
var BaseModel = require("./model");
var Manager = function(){
    BaseManager.apply(this,arguments);
    /**
     * ÅäÖÃappInfo
     * @param appInfo
     */
    this.init = (appInfo)=>{
        appInfo.model.factory = this.factory;
        this.store("app",appInfo);
    };
    this.setPath = this.setPath.bind(this,"model");
    this.config = (opt)=>{
        if(opt["path"]){
            this.setPath(opt["path"]);
        }
    };
    this.factory = (modelName)=>{
        var _Model = require(path.join(this.getPath(),modelName));
        return _Model;
    }
};

module.exports = function(){
    return new Manager();
};
module.exports.object = Manager;
module.exports.create = function(){
    return new Manager();
};