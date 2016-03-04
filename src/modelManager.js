
var stampit = require("stampit");
var path = require("path");
const modelManager = stampit
    .refs({
        modelPath:""
    })
    .methods({
        config(appInfo,opt){
            this.modelPath = opt.modelPath||"";
            appInfo.factory = this.factory;
        },
        factory(modelName){
            return require(path.join(this.modelPath,modelName));
        }
    });
module.exports = modelManager;