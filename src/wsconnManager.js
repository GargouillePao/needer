
var path = require("path");
var BaseManager = require("./manager").object;
var initSocketModel = function(listener,appInfo){
    var nspName = listener.nsp||"";
    var nsp = appInfo.io;
    if(nspName!=""){
        nsp = appInfo.io.of(nspName);
    }
    listener.setApp(appInfo);
    nsp.use((socket, next)=>{
        listener.emit("trying",socket,next);
    });
    nsp.on("connection",(socket)=>{
        listener.emit("connect",socket);
    });
};
var Manager = function(){
    BaseManager.apply(this,arguments);
    this.setPath = this.setPath.bind(this,"ws");
    this.use = (expressInst,opt,cb)=> {
        this.filter(opt,["nsp","src"],(nsp,_src)=>{
            var callback = cb||function(){};
            var src = path.join(this.getPath(), _src);
            var appInfo = this.get("app");
            var callbackmsg = {
                succeed:false,
                error:"not init appInfo/not config",
                nsp:nsp,
                src:src
            };
            if(appInfo!=""){
                if(appInfo.io){
                    var wsconnection = require(src);
                    if(wsconnection){
                        initSocketModel(wsconnection,appInfo);
                        callbackmsg.error = "";
                        callbackmsg.succeed = true;
                    }else{
                        callbackmsg.error = "not a connection controller"
                    }
                }else{
                    callbackmsg.error = "don't have io"
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