/**
 * Created by qs on 2016/3/2.
 */
var stampit = require("stampit");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

const initailizer = stampit()
    .refs({
        routerPath:"",
        socketPath:"",
        modelPath:"",
        port:80,
        appInfo:{io:io} //全局传播的变量，保存一个工厂方法和，内存缓存变量
    })
    .methods({
        /**
         * 初始化配置
         */
        configure(config){
            if(config.port){
                this.port = config.port;
            }
            if(config.models){
                //设置模块生成工厂
                this.modelPath = path.resolve(config.models);
                var modelPath = this.modelPath;
                this.appInfo.factory = function(modelName){
                    return require(path.join(modelPath,modelName));
                }
            }
            if(config.template){
                app.engine(".html",require(config.template).__express);
                app.set("view engine",config.template);
            }
            if(config.views){
                app.set("views",config.views);
            }
            if(config.routers){
                this.routerPath = path.resolve(config.routers);
                if(config.controllers){
                    this.routerPath = path.resolve(config.controllers,config.routers);
                }
            }
            if(config.sockets){
                this.socketPath = path.resolve(config.routers);
                if(config.controllers){
                    this.socketPath = path.resolve(config.controllers,config.sockets);
                }
            }
        },

        /**
         * 初始化路由,router为路由地址/router控制器
         */
        initRouter(router){
            app.use(router,require(path.join(this.routerPath,router)));
        },

        /**
         * 初始化SocketIO，connection为socket控制器
         */
        initSocket(connection){
            var conn = (require(path.join(this.socketPath,connection)))();
            var nsp = io;
            if(conn.nsp&&conn.nsp!=""){
                nsp = io.of(conn.nsp);
            }
            nsp.use((socket, next)=>{
                if(conn.filtrate){
                    conn.filtrate(socket,this.appInfo,next);
                }else{
                    next();
                }
            });
            nsp.on("connection",(socket)=>{
                if(conn.connecting){
                    conn.connecting(socket,this.appInfo);
                }
            });
        },

        /**
         * 初始化服务器,开启http服务器
         */
        initServer(){
            http.listen(this.port,()=>{
                console.log("Server start at",this.port);
            });
        }
    });
module.exports = initailizer;