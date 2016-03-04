
var stampit = require("stampit");
var express = require("express");
var expressInst = express();
var http = require("http").Server(expressInst);
var io = require("socket.io")(http);
var path = require("path");

var routerManager = require("./routerManger")();
var socketManager = require("./socketManager")();
var modelManager = require("./modelManager")();

const initailizer = stampit()
    .methods({
        /**
         * 初始化配置 /port/models/template/views/routers/sockets
         */
        configure(config){
            if(!this.appInfo){
                this.appInfo = {};
                this.appInfo["io"] = io;
            }
            if(config.port){
                this.port = config.port;
            }
            if(config.models){
                config.modelPath = path.resolve(config.models);
                modelManager.config(this.appInfo,config);
            }
            if(config.template){
                expressInst.engine(".html",require(config.template).__express);
                expressInst.set("view engine",config.template);
            }
            if(config.views){
                expressInst.set("views",config.views);
            }
            if(config.routers){
                config.routPath = path.resolve(config.routers);
                if(config.controllers){
                    config.routPath = path.resolve(config.controllers,config.routers);
                }
                routerManager.config(this.appInfo,config);
            }
            if(config.sockets){
                config.socketPath = path.resolve(config.sockets);
                if(config.controllers){
                    config.socketPath = path.resolve(config.controllers,config.sockets);
                }
                socketManager.config(this.appInfo,config);
            }
        },
        /**
         * 初始化路由,opt[url,src] url(路由)/src(文件路径)
         */
        useRouter(opt){
            routerManager.use(expressInst,opt);
        },
        /**
         * 初始化SocketIO，opt[nsp,src] nsp(路由)/src(文件路径)
         */
        useSocket(opt){
            socketManager.use(this.appInfo,opt);
        },
        /**
         * 初始化服务器,开启http服务器
         */
        start(callback){
            http.listen(this.port,()=>{
                console.log("Server start at",this.port);
                callback(this.appInfo);
            });
        }
    });

module.exports = initailizer;
module.exports.Router = express.Router;