var Emitter = require("events").EventEmitter;
var Controller = require("./controller").object;
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
    Controller.call(this);
    this.requestParser = function(socket){
        return function(info){
            if(info=="query")info="_query";
            var requestInfo = socket.request;
            var item = info||"";
            if(item==""){
                return requestInfo;
            }else{
                return requestInfo[info]||"";
            }
        }
    }
    this.connect = function(callback){
        this.on("connect",(socket)=>{
           callback(socket);
        });
    };
    this.use = function(callback){
        this.on("trying",(socket,next)=>{
            callback(socket,next);
        });
    };
};
util.inherits(Socket, Emitter);