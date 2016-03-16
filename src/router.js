var Emitter = require("events").EventEmitter;
var Controller = require("./controller").object;
var util = require("util");
var urlUtil = require('url');
module.exports = function(){
    return new Router();
};
var Router = function(){
    Emitter.call(this);
    Controller.call(this);
    var methods = {
        get:"GET",push:"PUSH",put:"PUT",set:"SET",post:"POST"
    };

    this.emitters = {};
    this.emitters[methods.get] = (data)=>{
        this.emit(methods.get,data);
    };
    this.emitters[methods.post] = (data)=>{
        this.emit(methods.post,data);
    }
    this.emitters[methods.put] = (data)=>{
        this.emit(methods.put,data);
    }

    var onRequrest = (method,url,callbacks)=>{
        this.on(method,(data)=>{
            var urlEmitted = urlUtil.parse(data["url"]||"").pathname ;
            if(urlEmitted==urlUtil.parse(url).pathname){
                var req = data["request"]||{};
                var res = data["response"]||{};
                var nextReq = data["next"]||function(){};
                var cbIndex = 0;
                var next = function(){
                    if(cbIndex<callbacks.length){
                        callbacks[cbIndex](req,res,next);
                        cbIndex++;
                    }else{
                        nextReq();
                    }
                };
                next();
            }
        })
    };
    this.get = function(){
        var url = arguments[0]||"/";
        var callbacks = [].slice.call(arguments,1);
        onRequrest(methods.get,url,callbacks);
    };
    this.post = function(){
        var url = arguments[0]||"/";
        var callbacks = [].slice.call(arguments,1);
        onRequrest(methods.post,url,callbacks);
    };
    this.put = function(){
        var url = arguments[0]||"/";
        var callbacks = [].slice.call(arguments,1);
        onRequrest(methods.put,url,callbacks);
    };
    this.use = (req,res,next)=>{
        if( typeof this.emitters[req.method] == "function"){
            this.emitters[req.method]({
                url:req.url,
                request:req,
                response:res,
                next:next
            });
        }else{
            console.error("no method handle",req.method);
            if(typeof next == "function")next();
        }
    };
};
util.inherits(Router, Emitter);





