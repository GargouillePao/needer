
var express = require("express");
var expressInst = express();
var http = require("http").Server(expressInst);
var io = require("socket.io")(http);
var path = require("path");
var Base = require("./base").object;

var routerManager = require("./routerManager")();
var wsconnManager = require("./wsconnManager")();
var modelManager = require("./modelManager")();

var Initializer = function(){
    Base.call(this);
    /**
     * 配置port{http,ws},path{modal,view},controller{root,ws,router},template
     * @param config
     */
    this.configure = (config)=>{
        /**
         * 配置app到所有Manager
         */
        if(this.get("app")==""){
            var appInfo = {io:io};
            this.store("app",appInfo);
            modelManager.config(appInfo);
            routerManager.config(appInfo);
            wsconnManager.config(appInfo);
        }
        var _port = config.port||{http:80,ws:80};
        var _path = config.path||{model:__dirname,view:__dirname};
        if(config.port){
            this.searchAndSet("httpPort","http",_port);
            this.searchAndSet("wsPort","ws",_port);
        }
        if(config.path){
            this.searchAndSet("modelPath","model",_path,(modelPath)=>{
                modelManager.setPath(modelPath);
            });
            this.searchAndSet("viewPath","view",_path,(viewPath)=>{
                expressInst.set("views",viewPath);
            });
            if(config.path.controller){
                var _controller = config.path.controller||{root:__dirname,router:"",ws:""};
                routerManager.setPath(_controller);
                wsconnManager.setPath(_controller);
            }
        }
        if(config.template){
            expressInst.engine(".html",require(config.template).__express);
            expressInst.set("view engine",config.template);
        }
    };
    this.use = (opt)=>{
        if(opt["router"]){
            routerManager.use(expressInst,opt["router"],(data)=>{
                if(!data.succeed){
                    console.error("Use Router Error",data);
                }
            });
        }
        if(opt["ws"]){
            wsconnManager.use(this.get("app"),opt["ws"],(data)=>{
                if(!data.succeed){
                    console.error("Use WS Error",data);
                }
            });
        }
    };
    this.start = (callback)=>{
        http.listen(this.get("httpPort"),()=>{
            console.log("Server start at",this.get("httpPort"));
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