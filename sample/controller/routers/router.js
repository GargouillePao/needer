/**
 * Created by qs on 2016/3/4.
 */
var path = require("path");
var router = require(path.resolve("../src","index")).Router();


router.get("/",
    (req,res,next)=>{
        var app = router.getApp();
        console.log("get",req.params.tag);
        app.store("need",app.model.factory("need")());
        app.get("need").config();
        app.get("need").findAll((err,needs)=>{
            if(err){
                console.log(err);
            }
            app.store("needs_all",needs);
            next();
        });
    },
    (req,res,next)=>{
        var app = router.getApp();
        console.log("get",req.query,req.query);
        if(req.query.tag){
            app.get("need").tag1 = req.query.tag+"";
        }
        app.get("need").findByTag1((err,needs)=>{
            if(err){
                console.log(err);
            }
            app.store("needs_live",needs);
            var allNeed = app.get("needs_all");
            var liveNeed = app.get("needs_live");
            res.render("dbhandle",{allNeeds:allNeed,liveNeeds:liveNeed});
        });
    }
);
router.post("/",(req,res,next)=>{
    var app = router.getApp();
    var need = app.model.factory("need")();
    need.config();
    need.tag = "help";
    console.log("Post",req.body);
    need.init(req.body);
    need.saveOne((err,data)=>{
        if(err){
            res.send(404);
        }else{
            res.send(200);
        }
    })
});
module.exports = router;