/**
 * Created by qs on 2016/3/4.
 */
var path = require("path");
var router = require(path.resolve("../src","index")).Router();
router.get("/",(req,res)=>{
    res.render("index");
});
module.exports = router;