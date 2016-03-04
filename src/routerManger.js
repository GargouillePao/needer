
var stampit = require("stampit");
var path = require("path");
const routerManager = stampit
    .refs({
        routPath:""
    })
    .methods({
        config(appInfo,opt){
            this.routPath = opt.routPath||"";
        },
        use(expressInst,opt){
            /**
             * URL �� src��ͬʱ
             */
            if(typeof opt == "string"){
                expressInst.use(opt,require(path.join(this.routPath,opt)));
            }
            /**
             * URL �� src���ܲ�ͬʱ
             */
            if(typeof opt == "object"){
                var url = opt["url"]||opt["src"];
                var src = opt["src"]||opt["url"];
                if(url&&src){
                    expressInst.use(url,require(path.join(this.routPath,src)));
                }
            }
        }
    });
module.exports = routerManager;