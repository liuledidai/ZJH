var JCBridge = {
    _funcList:{

    },
    
    _isInited:false,
    callNative:function(funcName,params){
        return nati.JCBridge.callNative(funcName,params);
    },
    registerCallback:function(funcName,func){
        if(!this._isInited){
            nati.JCBridge.setJSCallback(this.jsCallback);
            this._isInited = true;
        }
        this._funcList[funcName] = func;
    },
    unregister:function(funcName){
        this._funcList[funcName] = undefined;
    },
    jsCallback:function(funcName,params,isJson){
        if(JCBridge._funcList[funcName]){
            console.log("JCBridge jsCallback",funcName,params);
            if(isJson){
                JCBridge._funcList[funcName](JSON.parse(params));
            }else{
                JCBridge._funcList[funcName](params);
            }
        }
        else{
            console.log("JCBridge function of",funcName," is not register");
        }
    },
};
//JCBridge.init();
module.exports = JCBridge;