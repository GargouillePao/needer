
var express = require("express");
var expressInst = express();
var http = require("http").Server(expressInst);
var io = require("socket.io")(http);
var path = require("path");
var Base = require("./base").object;

var routerManager = require("./routerManager")();
var wsconnManager = require("./wsconnManager")();
var modelManager = require("./modelManager")();

var AppInfo = function(){
    Base.call(this);
    this.model = {};
    this.model.factory = function(){};
}

var Initializer = function(){
    Base.call(this);

    var appInfo = new AppInfo();
    appInfo.store("io",io);
    this.store("app",appInfo);
    modelManager.init(appInfo);
    routerManager.init(appInfo);
    wsconnManager.init(appInfo);

    /**
     * model管理器
     */
    this.model = modelManager;

    /**
     * view管理器
     */
    this.view = new Base();
    this.view.config = opt=>{
        this.view.searchAndSet("path","path",opt,(viewPath)=>{
            expressInst.set("views",viewPath);
        });
        this.view.searchAndSet("template","template",opt,(template)=>{
            expressInst.engine(".html",require(template).__express);
            expressInst.set("view engine",template);
        });
    };

    /**
     * controller管理器
     */
    this.controller = new Base();
    this.controller.config = opt=>{
        if(opt["path"]){
            routerManager.setPath(opt["path"]);
            wsconnManager.setPath(opt["path"]);
        }
        if(opt["port"]){
            this.controller.searchAndSet("http","http",opt["port"]);
            this.controller.searchAndSet("ws","ws",opt["port"],(wsPort)=>{
                if(this.controller.get("http")!=wsPort){
                    if(this.get("app")==""){
                        this.init();
                    }
                    this.get("app").io = require("socket.io")(wsPort);
                }
            });
        }
    }
    this.controller.use = (type,opts)=>{
        if(type == "router"){
            routerManager.use(expressInst,opts,(data)=>{
                if(!data.succeed){
                    console.error("Use Router Error",data);
                }
            });
        }
        if(type == "ws"){
            wsconnManager.use(this.get("app"),opts,(data)=>{
                if(!data.succeed){
                    console.error("Use WS Error",data);
                }
            });
        }
    }

    this.start = (callback)=>{
        var port = this.controller.get("http");
        http.listen(port,()=>{
            console.log("Server start at",port);
            if(callback){
                callback(this.get("app"));
            }
        });
    }
};

module.exports = function(){
    return new Initializer();
};
module.exports.Router = require("./router");
module.exports.WSConnection = require("./wsconnection");
module.exports.Model = require("./model");