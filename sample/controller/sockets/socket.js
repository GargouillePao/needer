var path = require("path");
var connection = require(path.resolve("../src","index")).WSConnection();
connection.connect((socket)=>{
    console.log("Connect!!");
    var request = connection.requestParser(socket);
    socket.on("disconnect",(msg)=>{
        console.log("Quit",msg);
    });
    socket.on("message",(msg)=>{
        console.log("Msg",msg);
        socket.emit("msg","pong");
        console.log("send msg");
    });
});
connection.use((socket,next)=>{
    next();
});
module.exports = connection;