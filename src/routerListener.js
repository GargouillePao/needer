var router = require("./router")();
router.get("/",(req,res)=>{
    console.log("!!!",req,res);
});
module.exports = router;
