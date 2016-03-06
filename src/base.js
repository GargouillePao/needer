var Base = function(){
    var opts  = {};
    this.set = function(){
        var key = arguments[0];
        var value = JSON.parse(JSON.stringify(arguments[1]||""));
        if(key && typeof key == "string"){
            opts[key] = value;
        }
        if(key && typeof key == "object"){
            opts = JSON.parse(JSON.stringify(key||{}));
        }
    };
    /**
     * 从_value中搜索keys4search的所有键然后加入key所对应的对象中,没找到则不作任何处理
     * @param key 设置键值对的键名
     * @param keys4search 需要搜索的键名
     * @param _value 设置键值对的值
     * @param cb 设置完成后的回调
     */
    this.searchAndSet = function(key,keys4search,_value,cb){

        var callback = cb || function(){};
        if(_value && typeof _value != "object"){
            this.set(key,_value);
            callback(_value);
        }
        if(_value && typeof _value == "object"){
            if(typeof keys4search == "string"){
                var value = _value[keys4search];
                if(value){
                    this.set(key,value);
                    callback(value);
                }
            }
            if(keys4search.forEach){
                var value = {};
                keys4search.forEach((v)=>{
                    if(_value[v]){
                        value[v]=_value[v];
                    }
                });
                if(value!={}){
                    this.set(key,value);
                    callback(value);
                }
            }
        }
    };
    this.store = function(key,value){
        opts[key] = value;
    };
    this.get = function(key){
        return opts[key]||"";
    }
};
module.exports = function(){
    return new Base();
};
module.exports.object = Base;
module.exports.create = function(){
    return new Base();
};