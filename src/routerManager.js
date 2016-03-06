
var path = require("path");
var ControllerManager = require("./controllerManager").object;
var Manager = function(){
    ControllerManager.apply(this,arguments);
    this.setPath = (_path)=>{
        if(typeof _path == "string"){
            this.set("path",path.resolve(_path));
        }
        if(typeof _path == "object"){
            var cpath = _path["root"] || "";
            var rpath = _path["router"] || "";
            this.set("path",path.resolve(cpath,rpath))
        }
    };
    this.use = (expressInst,opt,cb)=> {
        this.filter(opt,["url","src"],(url,_src)=>{
            var callback = cb||function(){};
            var src = path.join(this.getPath(), _src);
            var callbackmsg = {
                succeed:false,
                error:"not init express/not config",
                url:url,
                src:src
            };
            if(expressInst.use){
                if(require(src).use){
                    callbackmsg.error = "";
                    callbackmsg.succeed = true;
                    expressInst.use(url, require(src).use);
                }else{
                    callbackmsg.error = "not a router controller";
                }
            }
            callback(callbackmsg);
        });
    }
};

module.exports = function(){
    return new Manager();
};
module.exports.object = Manager;
module.exports.create = function(){
    return new Manager();
};