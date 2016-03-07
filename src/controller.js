var Emitter = require("events").EventEmitter;
var util = require("util");
var Controller = function(){
    Emitter.call(this);
    var appInfo = {};
    this.setApp = (app)=>{
        appInfo = app;
    }
    this.getApp = ()=>{
        return appInfo;
    }
};
util.inherits(Controller, Emitter);
module.exports = function(){
    return new Controller();
};
module.exports.object = Controller;
module.exports.create = function(){
    return new Controller();
};