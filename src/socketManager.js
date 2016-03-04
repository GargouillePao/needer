
var stampit = require("stampit");
var path = require("path");
var initSocketModel = function(model,appInfo){
    var nsp = appInfo.io;
    if(model.nsp&&model.nsp!=""){
        nsp = appInfo.io.of(model.nsp);
    }
    nsp.use((socket, next)=>{
        if(model.filtrate){
            model.filtrate(socket,appInfo,next);
        }else{
            next();
        }
    });
    nsp.on("connection",(socket)=>{
        if(model.connecting){
            model.connecting(socket,appInfo);
        }
    });
};
var socketModelFactory = function(path){
    var baseSocketModel = require("./socketModel");
    baseSocketModel.compose(require(path));
    return baseSocketModel;
};
const socketManager = stampit
    .refs({
        socketPath:""
    })
    .methods({
        config(appInfo,opt){
            this.socketPath = opt.socketPath||"";
        },
        use(appInfo,opt){
            /**
             * nsp 和 src相同时
             */
            if(typeof opt == "string"){
                var absPath = path.join(this.socketPath,opt);
                var conn = socketModelFactory(absPath)(opt);
                initSocketModel(conn,appInfo);
            }
            /**
             * nsp 和 src可能不同时
             */
            if(typeof opt == "object"){
                var nsp = opt["nsp"]||opt["src"];
                var src = opt["src"]||opt["nsp"];
                if(nsp&&src){
                    var absPath = path.join(this.socketPath,src);
                    var conn = socketModelFactory(absPath)(nsp);
                    initSocketModel(conn,appInfo);
                }
            }
        }
    });
module.exports = socketManager;