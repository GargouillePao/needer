
var stampit = require("stampit");
const connection = stampit()
    .refs({
        nsp: ""
    })
    .init((nsp)=>{
        this.nsp = nsp;
    });
module.exports = connection;