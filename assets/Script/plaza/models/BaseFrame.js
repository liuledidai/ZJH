var GlobalDef = require("GlobalDef");
var BaseFrame = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        // this._viewFrame = view;
        console.log("BaseFrame onLoad");
        this._threadid = undefined;
        this._socket = undefined;
        // this._callBack = callback;
        
        this._gameFrame = undefined;
        this.m_tabCacheMsg = {};
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
    // name: "BaseFrame",
    // ctor: function(){
    //     // this._viewFrame = view;
    //     this._threadid = undefined;
    //     this._socket = undefined;
    //     // this._callBack = callback;
        
    //     this._gameFrame = undefined;
    //     this.m_tabCacheMsg = {};
        
    // },
    setCallBack: function(callback){
      this._callBack = callback;  
    },
    setViewFrame: function(viewFrame){
      this._viewFrame = viewFrame;  
    },
    setSocketEvent: function(socketEvent){
        this._socketEvent = socketEvent;
    },
    getViewFrame: function(){
      return this._viewFrame;  
    },
    isSocketServer: function(){
        return this._socket !== undefined && this._threadid !== undefined;
    },
    onSocketError: function(pData){
      if(this._threadid === undefined)
      {
          return
      }
      
      this.onCloseSocket();
      cc.director.emit("LoadingViewError",{msg:"服务器连接异常，请稍后重试",type:GlobalDef.SMT_CLOSE_GAME});
      //todo...
    },
    onCreateSocket: function(szUrl,nPort){
        if(this._socket !== undefined)
        {
            return false;
        }
        this._szServerUrl = szUrl;
        this._nServerPort = nPort;
        var self = this;
        this._SocketFun = function(pData){
            self.onSocketCallBack(pData);
        };
        this._socket = ClientSocket.createSocket(this._SocketFun);
        console.log(this.name);
        if(this._socket.ConnectSocket(this._szServerUrl,this._nServerPort) === true)
        {
            this._threadid = 0;
            return true;
        }
        else
        {
            console.log("onCreateSocket close");
            this.onCloseSocket();
            return false;
        }
    },
    onSocketCallBack: function(pData){
        if(pData === undefined)
        {
            return;
        }
        // if(this._callBack === undefined)
        // {
        //     console.log('no callback');
        //     this.onCloseSocket();
        //     return;
        // }
        var main = pData.getmain();
        var sub = pData.getsub();
        console.log("onSocketCallBack main: " + main + " #sub: "+sub);
        if(main === 0) 
        {
            if(sub === 0) 
            {
                this._threadid = 1;
                this.onConnectCompeleted();
            }
            else
            {
                this.onSocketError(pData);
                this.onCloseSocket();
            }
        }
        else
        {
            this.onSocketEvent(main, sub, pData);
        }
    },
    onCloseSocket: function(){
        if(this._socket !== undefined)
        {
            this._socket.releaseSocket();
            this._socket = undefined;
        }
        if(this._threadid !== undefined)
        {
            this._threadid = undefined;
        }
        this._SocketFun = undefined;
    },
    sendSocketData: function(pData){
        if (this._socket === undefined)
        {
            return false;
        }
        this._socket.sendSocketData(pData);
    },
    onConnectCompeleted: function(){
        console.log("BaseFrame_onConnectCompeleted");
    },
    onSocketEvent: function(main,sub,pData){
        console.log("BaseFrame_onSocketEvent_"+main+"-"+sub);
    },
    onGameSocketEvent: function(main,sub,pData){
        console.log("BaseFrame_onGameSocketEvent_"+main+"-"+sub);
    },
    
});

module.exports = BaseFrame;