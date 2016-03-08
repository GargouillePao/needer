var app = require("../src/index")();

app.view.config({
    path:"view",
    template:"ejs"
});
app.model.config({
    path:"models"
});
app.controller.config({
    port:{http:8000,ws:8080}
});
app.controller.config({
    path:{root:"controller",router:"routers",ws:"sockets"},
});
app.controller.use("router",{src:"router",url:"/"});
app.controller.use("ws",{src:"socket",nsp:""});
app.start();