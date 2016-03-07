
var BaseManager = require("./manager").object;
var path = require("path");
var Manager = function(){
    BaseManager.apply(this,arguments);
    /**
     * ÅäÖÃappInfo
     * @param appInfo
     */
    this.config = (appInfo)=>{
        appInfo.factory = this.factory;
        this.store("app",appInfo);
    };
    this.setPath = this.setPath.bind(this,"model");
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