var Emitter = require("events").EventEmitter;
var Controller = require("./controller").object;
var util = require("util");
module.exports = function(){
    return RouterFactory();
};
var RouterFactory  = function(){
    var router = new Router();
    //console.log(router)
    return router;
};
var Router = function(){
    Emitter.call(this);
    Controller.call(this);
    var methods = {
        get:"GET",push:"PUSH",put:"PUT",set:"SET"
    };
    var listenerMid = (arg,callback)=>{
        var urlListened = arg[0]||"/";
        var callbacks = [].slice.call(arg,1);
        callbacks.forEach((v)=>{
            callback(urlListened,v)
        });
    };
    var emitterMid = (arg,callback)=>{
        var data = arg[0];
        var next = arg[1]||function(){};
        if(data){
            callback(data);
            next(true);
        }else{
            next(false);
        }
    };
    var dataMid = (url,data,callback)=>{
        var urlEmited = data["url"]||"";
        if(urlEmited==url){
            var req = data["request"]||{};
            var res = data["response"]||{};
            callback(req,res);
        }
    };

    var listener = (method)=>{
        return function(){
            listenerMid(arguments,(urlListened,v)=>{
                this.on(method,(data)=>{
                    dataMid(urlListened,data,v);
                })
            });
        }
    };
    var emitter = (method)=>{
        var _emitter = function(){
            emitterMid(arguments,(data)=>{
                this.emit(method,data);
            });
        };
        return _emitter.bind(this);
    };

    this.emitters = {};
    this.emitters[methods.get] = emitter(methods.get);
    this.emitters[methods.push] = emitter(methods.push);
    this.emitters[methods.put] = emitter(methods.put);

    this.get = listener(methods.get);
    this.push = listener(methods.push);
    this.put = listener(methods.put);
    this.use = (req,res,next)=>{
        this.emitters[req.method]({
            url:req.url,
            request:req,
            response:res
        });
        next();
    }
};
util.inherits(Router, Emitter);





