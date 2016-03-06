
var path = require("path");
var ControllerManager = require("./controllerManager").object;
var initSocketModel = function(listener,appInfo){
    var nsp = appInfo.io;
    if(listener.nsp&&listener.nsp!=""){
        nsp = appInfo.io.of(listener.nsp);
    }
    nsp.use((socket, next)=>{
        console.log(socket.request.headers.host,"trying to connect");
        listener.emit("trying",socket,appInfo,next);
    });
    nsp.on("connection",(socket)=>{
        console.log(socket.request.headers.host,"connected");
        listener.emit("connect",socket,appInfo);
    });
};
var Manager = function(){
    ControllerManager.apply(this,arguments);
    this.setPath = (_path)=>{
        if(typeof _path == "string"){
            this.set("path",path.resolve(_path));
        }
        if(typeof _path == "object"){
            var cpath = _path["root"] || "";
            var rpath = _path["ws"] || "";
            this.set("path",path.resolve(cpath,rpath))
        }
    };
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
                    if(require(src)){
                        initSocketModel(require(src),appInfo);
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