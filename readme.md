# Needer
### IM backend MVC framework based on express and socket.io
# Install
npm install needer
# Usage

#### app init:
```javascript
var app = require("needer")();
app.view.config({
    path:"view",//your views path
    template:"ejs" //the template your use,you need require(template)
});
app.model.config({
    path:"models"//your models path
});
app.controller.config({
    port:{http:8000,ws:8080},//your controllers port
    path:{root:"controller",router:"routers",ws:"sockets"}//your controllers rootPath,routerPath,socketsPath
});
app.controller.use("router",{src:"router",url:"/"}); //add a router controller (and its moduleName,url)
app.controller.use("ws",{src:"socket",nsp:""});//add a ws controller (and its moduleName,nsp)
app.start();
```
all these path config is not necessary, It's depends on you.

like this
```javascript
app.view.config({
    template:"ejs" //template is must,and then app will search views file in the root path
});
```
#### models:
```javascript
var model = require("needer").Model();
module.exports = function(){
    return new Entity(); // you need export a factory
};
var Entity = function(){
    this.uid = "123-432---000";
    this.psw = "1111";
    this.config = (cb)=>{
    //the config is not necessary but it will help you handle save action easier
    //id is the primary key of this model,now id:"uid" means the primary key or the store filename is 123-432---000
    //keys is the keys you want to save,now will save the uid and the psw,if there is no keys field,It will save all of your model
        model.config.call(this,{
            file:{
                path:"sample/storage",
                id:"uid",
                extra:".json",
                keys:["uid","psw"]
            },
            db:{
                id:"uid",
                type:"mongodb",
                url:"mongodb://localhost:27017/needer",
                collection:"entity",
                keys:["uid","psw"]
            }
        },cb);
    };
    this.saveAll = (cb)=>{
        model.saveToFile.call(this,{},cb)
    };
    this.savepsw = (cb)=>{
        model.updateToFile.call(this,{
            extra:".json",
            id:"uid",
            keys:["mail"]
        },cb)
    };
    this.saveInDB = (cb)=>{
        model.insertToDB.call(this,{},cb);
    };
    // all of these model function like saveToFile,updateToDB should change the context to your model you can use call(this)
};
```
#### router controller:
```javascript
//just like express router
var router = require("needer").Router();
router.get("/",(req,res)=>{
    var app = router.getApp(); // you will get the app information
    var entity = app.model.factory("entity")(); // you can create a model what you have,now we have entity
    res.render("index"); // you can render view
});
module.exports = router;
```

#### ws controller
```javascript
//just like socket.io
var connection = require("needer").WSConnection();
connection.connect((socket)=>{
    console.log("Connect!!");
    var request = connection.requestParser(socket); // you can get the http request information
    socket.on("disconnect",(msg)=>{
        console.log("Quit",msg);
    });
    socket.on("message",(msg)=>{
    });
});
connection.use((socket,next)=>{
    next();
});
module.exports = connection;
```

now I don't write the doc so....

but you can know more about needer in the [sample](https://github.com/GargouillePao/needer/tree/master/sample)

by the way,this framework is developing,so you know....

anyway,you're welcome to use needer.