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
     * ��_value������keys4search�����м�Ȼ�����key����Ӧ�Ķ�����,û�ҵ������κδ���
     * @param key ���ü�ֵ�Եļ���
     * @param keys4search ��Ҫ�����ļ���
     * @param _value ���ü�ֵ�Ե�ֵ
     * @param cb ������ɺ�Ļص�
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