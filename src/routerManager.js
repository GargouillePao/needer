
var path = require("path");
var BaseManager = require("./manager").object;
var Manager = function(){
    BaseManager.apply(this,arguments);
    this.setPath = this.setPath.bind(this,"router");
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
            var router = require(src);
            if(expressInst.use){
                if(router.use){
                    router.setApp(this.get("app"));
                    callbackmsg.error = "";
                    callbackmsg.succeed = true;
                    expressInst.use(url, router.use);
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