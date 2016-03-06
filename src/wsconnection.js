var Emitter = require("events").EventEmitter;
var util = require("util");
module.exports = function(){
    return SocketFactory();
};
var SocketFactory  = function(){
    var socket = new Socket();
    return socket;
};
var Socket = function(){
    Emitter.call(this);
    this.connect = function(callback){
        this.on("connect",(socket,app)=>{
           callback(socket,app);
        });
    };
    this.use = function(callback){
        this.on("trying",(socket,app,next)=>{
            callback(socket,app,next);
        });
    };
};
util.inherits(Socket, Emitter);