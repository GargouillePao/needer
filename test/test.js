
var assert = require("assert");
var path = require("path");
//var mocha  = require("mocha");
var app;
suite("app", ()=>{
    setup(()=>{
        app = require("../src/index")();
        console.log("setup app");
    });
    suite("routers",()=>{
        setup(()=>{
            app.configure({
                controllers:"test/sample/controller",
                routers:"routers"
            });
            app.useRouter({
                url:"/index",
                src:"router"
            });
            console.log("setup routers");
        });
        test("should return {}", ()=>{
            assert.equal(0,0);
        });
    });
    suite("models",()=>{
        setup(()=>{
            app.configure({
                models:"test/sample/models"
            });
            console.log("setup models");
        });
        test("should return {}", ()=>{
            assert.equal(0,0);
        });
    });
    suite("sockets",()=>{
        setup(()=>{
            app.configure({
                controllers:"test/sample/controller",
                sockets:"sockets"
            });
            app.useSocket({
                nsp:"/index",
                src:"socket"
            });
            console.log("setup sockets");
        });
        test("should return {}", ()=>{
            assert.equal(0,0);
        });
    });
    teardown(()=>{
        console.log("teardown...");
    });
});