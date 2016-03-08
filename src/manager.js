var Base = require("./base").object;
var path = require("path");
var Manager = function(){
    Base.apply(this,arguments);

    /**
     * ����appInfo
     * @param appInfo
     */
    this.init = (appinfo)=>{
        this.store("app",appinfo);
    }
    this.setPath = (_key,_path)=>{
        if(typeof _path == "string"){
            this.set("path",path.resolve(_path));
        }
        if(typeof _path == "object"){
            var cpath = _path["root"] || "";
            var rpath = _path[_key] || "";
            if(rpath == ""){cpath = ""};
            this.set("path",path.resolve(cpath,rpath))
        }
    };
    this.getPath = ()=>{
        return this.get("path");
    };

    /**
     * ���˺��� ����opt��ֵ�ԣ�����opt��keys��ɵĶ��󴫵ݸ�cb,���opt��ֱֵ�Ӵ���cb
     * @param opt
     * @param keys
     * @param cb
     */
    this.filter = (opt,keys,cb)=> {
        if(typeof cb == "function"){
            if (typeof opt == "string") {
                if(keys.map){
                    var value = keys.map((v)=>{
                        return opt;
                    });
                    cb.apply(null,value)
                }else{
                    cb(opt);
                }
            }
            if (typeof opt == "object" && keys.map) {
                var values = keys.map((v)=>{
                    return opt[v]||"";
                });
                cb.apply(null,values);
            }
        }
    }
};

module.exports = function(){
    return new Manager();
};
module.exports.object = Manager;
module.exports.create = function(){
    return new Manager();
};