/**
 * Created by qs on 2016/3/4.
 */
var path = require("path");
var router = require(path.resolve("../src","index")).Router();
router.get("/",(req,res)=>{
    var app = router.getApp();
    //console.log(app);
    var entity = app.model.factory("entity")();
    entity.config({save:{
        path:"storage",
        name:"uid",
        type:".json",
        keys:["uid","psw"]
    }})
    entity.save((err,data)=>{
        if(err){
            console.error(err);
            throw err;
        }
        console.log(data);
    });
    res.render("index");
});
module.exports = router;