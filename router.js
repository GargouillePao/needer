/**
 * Created by qs on 2016/3/4.
 */
var stampit = require("stampit");
var path = require("path")
var expressRouter = require("express").Router;
const router = stampit
    .refs({
        routPath:"",
    })
    .methods({
        use(app,opt){
            if(typeof opt == "string"){
                app.use(opt,require(path.join(this.routPath,opt)));
            }
            if(typeof opt == "object"){
                var url = opt["url"]||opt["src"];
                var src = opt["src"]||opt["url"];
                if(url&&src){
                    app.use(url,require(path.join(this.routPath,src)));
                }
            }
        },
        router(){
            return expressRouter;
        }
    })