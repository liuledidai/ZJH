var GlobalFun = require("GlobalFun");
cc.Class({
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
        m_Label_des: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        console.log("[LoadingView][init] params = " + JSON.stringify(params, null, ' '));
        this._closeEvent = params.closeEvent;
        this._loadfunc = params.loadfunc;
        this._closefunc = params.closefunc;
        this._connectDes = params.des || "正在连接游戏服务器...";
        cc.director.on(this._closeEvent,this.close,this);
        cc.director.on("LoadingViewError",this.showMessageBox,this);
        cc.director.on("LoadingViewOnConnect",this.onConnected,this);
        cc.director.on("LoadingViewOnLogonFinish",this.onLogonFinish,this);

        if (typeof(this._loadfunc) === "function") {
            this._loadfunc();
        }
    },
    showMessageBox: function (params) {
        var msg = params.detail.msg;
        var type = params.detail.type;
        var self = this;
        GlobalFun.showToast({
            message:msg,
            confirmfunc: function () {
                self.node.destroy();
            }
        })
    },
    onConnected: function (params) {
        var msg = params.detail.message;
        console.log("[LoadingView][onConnected] msg = " + msg);
        this.m_Label_des.string = msg;
    },
    onLogonFinish: function (params) {
        var msg = params.detail.message;
        console.log("[LoadingView][onLogonFinish] msg = " + msg);
        this.m_Label_des.string = msg;
        this.close();
    },
    close: function () {
        console.log("[LoadingView][close]");
        cc.director.off(this._closeEvent,this.close,this);
        if (typeof(this._closefunc) === "function") {
            this._closefunc();
        }
        // this.node.destroy();
    },
    onEnable: function () {
        
    },
    onDisable: function () {
        cc.director.off("LoadingViewError",this.showMessageBox,this);
        cc.director.off("LoadingViewOnConnect",this.onConnected,this);
        cc.director.off("LoadingViewOnLogonFinish",this.onLogonFinish,this);
    },
    onDestroy: function () {
        console.log("[LoadingView][onDestroy]");
        cc.sys.garbageCollect();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
