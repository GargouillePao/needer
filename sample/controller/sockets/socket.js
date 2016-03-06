var path = require("path");
var connection = require(path.resolve("../src","index")).WSConnection();
connection.connect((socket,app)=>{
    console.log("Connect!!");
    socket.on("disconnect",(msg)=>{
        console.log("Quit",msg);
    });
    socket.on("message",(msg)=>{
        console.log("Msg",msg);
        socket.emit("msg","pong");
        console.log("send msg");
    });
});
connection.use((socket,app,next)=>{
    next();
});
module.exports = connection;