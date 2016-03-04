/**
 * Created by qs on 2016/3/4.
 */
var stampit = require("stampit");
const connection = stampit()
    .methods({
        connecting(socket,app){
            socket.on("disconnect",(msg)=>{
                console.log("Quit",msg);
            });
            socket.on("message",(msg)=>{
                console.log("Msg",msg);
                socket.emit("msg","pong");
                console.log("send msg");
            });
        },
        filtrate(socket,app,next){
            var userFactory = app.factory("user");
            var username = socket.request._query["username"];
            var password = socket.request._query["password"];
            var user = userFactory({
                username:username,
                password:password,
                phone:"18861822596",
                socket:socket
            });
            if(user.validate()){
                console.log("!!!");
                next();
            }else{
                next(new Error('Authentication error'));
            }
        }
    });
module.exports = connection;