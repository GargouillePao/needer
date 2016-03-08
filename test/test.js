
var assert = require("assert");
var path = require("path");
var log4js = require('log4js');
log4js.replaceConsole();
//var mocha  = require("mocha");
var app;
suite("app", ()=>{
    setup(()=>{
        console.log("start")
    });
    suite("base",()=>{
        setup(()=>{
            this.base = require("../src/base")();
            console.log("start base");
        });
        test("should return hello",()=>{
            this.base.set("A","hello");
            assert.equal("hello",this.base.get("A"));
        });
        test("should return 123",()=>{
            this.base.set("B",123);
            assert.equal(123,this.base.get("B"));
        });
        test("should return AAA When setV",()=>{
            this.base.searchAndSet("V","a",{a:"AAA",b:"BBB"},(value)=>{
                assert.equal("AAA",value);
            });
        });
        test("should return AAA After setV",()=>{
            this.base.searchAndSet("V","a",{a:"AAA",b:"BBB"},(value)=>{});
            assert.equal("AAA",this.base.get("V"));
        });
        test("should return AAA When setM",()=>{
            this.base.searchAndSet("M","a",{b:"BBB"},(value)=>{
                assert.equal("AAA",value);
            });
        });
        test("should return AAA After setM",()=>{
            this.base.searchAndSet("M","a",{b:"BBB"},(value)=>{});
            assert.equal("AAA",this.base.get("M"));
        });
        test("should return AAA When setS",()=>{
            this.base.searchAndSet("S","a","AAA",(value)=>{
                assert.equal("AAA",value);
            });
        });
        test("should return AAA After setS",()=>{
            this.base.searchAndSet("S","a","AAA",(value)=>{});
            assert.equal("AAA",this.base.get("S"));
        });
        test("should return AAA When setF with a,b",()=>{
            this.base.searchAndSet("F",["a","b"],"AAA",(value)=>{
                assert.equal("AAA",value);
            });
        });
        test("should return AAA After setF with a,b",()=>{
            this.base.searchAndSet("F",["a","b"],"AAA",(value)=>{});
            assert.equal("AAA",this.base.get("F"));
        });
        test("should return AAA When setG with a,b",()=>{
            this.base.searchAndSet("G",["a","b"],{a:"AAA",c:"CCC"},(value)=>{
                assert.equal({a:"AAA"},value);
            });
        });
        test("should return AAA After setG with a,b",()=>{
            this.base.searchAndSet("G",["a","b"],{a:"AAA",c:"CCC"},(value)=>{});
            //assert.equal({a:"AAA"},this.base.get("G"));
            assert.deepEqual({a:"AAA"},this.base.get("G"));
        });
        teardown(()=>{
            console.log("tear down base ...");
        });
    });
    suite("controllerManager",()=>{
        setup(()=>{
            this.manager = require("../src/manager")();
            console.log("start m");
        });
        test("should return hello",()=>{
            this.manager.set("A","hello");
            assert.equal("hello",this.manager.get("A"));
        });
        test("should return index",()=>{
            this.manager.config({});
            this.manager.setPath("index");
            assert.equal("/index",this.manager.getPath());
        });
        teardown(()=>{
            console.log("tear down m ...");
        });
    });
    suite("routerManager",()=>{
        setup(()=>{
            this.manager = require("../src/routerManager")();
            console.log("start routerM");
        });
        test("should return {false,/index,index}",()=>{
            this.manager.setPath("index");
            this.manager.use({},{url:"/index","src":"index"},(opts)=>{
                assert.equal(false,opts.succeed);
                assert.equal("/index",opts.url);
                assert.equal("index",opts.src);
            })
        });
        test("should return {false,/index,/index}",()=>{
            this.manager.setPath({
                controller:"controller",
                router:"router"
            });
            this.manager.use({},"/index",(opts)=>{
                assert.equal(false,opts.succeed);
                assert.equal("/index",opts.url);
                assert.equal("/index",opts.src);
            });
        });
        test("should return routers",()=>{
            this.manager.setPath({
                controller:"controller",
                router:"router"
            });
            assert.equal("/index",this.manager.getPath());
        });
        teardown(()=>{
            console.log("tear down routerM ...");
        });
    });
    suite("wsconnManager",()=>{
        setup(()=>{
            this.manager = require("../src/wsconnManager")();
            console.log("start routerM");
        });
        test("should return {false,/index,index}",()=>{
            this.manager.setPath("index");
            this.manager.use({},{nsp:"/index","src":"index"},(opts)=>{
                assert.equal(false,opts.succeed);
                assert.equal("/index",opts.nsp);
                assert.equal("index",opts.src);
            })
        });
        test("should return {false,/index,/index}",()=>{
            this.manager.setPath({
                controller:"controller",
                ws:"ws"
            });
            this.manager.use({},"/index",(opts)=>{
                assert.equal(false,opts.succeed);
                assert.equal("/index",opts.nsp);
                assert.equal("index",opts.src);
            })
        });
        test("should return routers",()=>{
            this.manager.setPath({
                controller:"controller",
                ws:"ws"
            });
            assert.equal(path.resolve(__dirname),this.manager.getPath());
        });
        teardown(()=>{
            console.log("tear down routerM ...");
        });
    });
    suite("model",()=>{
        setup(()=>{
            var app = require("../src/index")();
            app.model.config({path:{model:"models",root:"sample"}});
            this.model = app.get("app").model;
            console.log("start model");
        });
        test("should return saving",()=>{
            var model1 = this.model.factory("entity")();
            assert.equal("saving",model1.find("saving"));
        });
        test("should return succeed}",()=>{
            var model2 = this.model.factory("entity")();
            model2.config({save:{
                path:"sample/storage",
                name:"uid",
                type:".json",
                keys:["uid","psw"]
            }})
            model2.save((err,data)=>{
                if(err){
                    console.error(err);
                    throw err;
                }
                assert.deepEqual("{\"uid\":\"12345\",\"psw\":\"xxxxx\"}",data);
            });
        });
        teardown(()=>{
            console.log("tear down model ...");
        });
    });
    teardown(()=>{
        console.log("tear down...");
    });
});