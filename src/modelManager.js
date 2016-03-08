
var BaseManager = require("./manager").object;
var path = require("path");
var BaseModel = require("./model");
var combine = function(base,obj){
    for(var p in base){
        if(base.hasOwnProperty(p) && !obj.hasOwnProperty(p)){
            if(typeof base[p] == "function"){
                obj[p] = base[p].bind(obj);
            }else{
                obj[p]=base[p];
            }
        }
    }
    return obj;
}
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
    }
    this.factory = (modelName)=>{
        var Model = require(path.join(this.getPath(),modelName));
        return function(){
            var base = BaseModel();
            var model = Model();
            return combine(base,model);
        };
    }
};

module.exports = function(){
    return new Manager();
};
module.exports.object = Manager;
module.exports.create = function(){
    return new Manager();
};