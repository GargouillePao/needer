var app = require("../src/index")();

app.view.config({
    path:"view",
    template:"ejs",
    static:["static","bower_components"]
});
app.model.config({
    path:"models"
});
app.controller.config({
    port:8000
});
app.controller.config({
    path:{root:"controller",router:"routers",ws:"sockets"},
});
app.controller.config({
    plugin:[
        require("body-parser").json(),
        require("body-parser").urlencoded({extended:true}),
        require("multer")({ dest: "upload"})
    ]
})
app.controller.use("router",{src:"router",url:"/index"});
app.controller.use("ws",{src:"socket",nsp:""});
app.start();