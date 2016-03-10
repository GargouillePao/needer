var MongoClient = require('mongodb').MongoClient;
var dbConnection;
var dbUrl;
module.exports.getInstance = function(url,cb){
    if(!dbConnection || dbUrl!=url){
        dbUrl = url;
        MongoClient.connect(dbUrl, function(err, db) {
            if(err){
                console.error("mongoDB error",err);
                return;
            }
            console.log("Connected correctly to MongoDB at",dbUrl);
            dbConnection = db;
            cb(dbConnection);
        });
    }else{
        cb(dbConnection);
    }
};
