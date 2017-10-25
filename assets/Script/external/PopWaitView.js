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
        m_Label_content: {
            default: null,
            type: cc.Label,
        },
        m_Image_waitCircle:{
            default: null,
            type: cc.Node,
        },
        m_Image_waitIcon: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        console.log("[PopWaitView][onLoad]");
    },
    init: function (params) {
        this.m_waitingText = params.waitingText || "正在连接服务器，请稍候...";
        this.m_waitingTime = params.waitingTime || 15;
        this.m_closeEvent = params.closeEvent;
        this.m_callBackFunc = params.callBackFunc;
        cc.director.on(this.m_closeEvent,this.onCloseEvent,this);
        cc.director.getScheduler().schedule(this.close, this, this.m_waitingTime);
        this.m_Label_content.string = this.m_waitingText;
        this.m_Image_waitCircle.runAction(cc.repeatForever(cc.rotateBy(2.0, 360.0)));
        this.m_Image_waitIcon.runAction(cc.repeatForever(cc.sequence(
            cc.spawn(cc.skewTo(1.0, 0, -10),cc.scaleTo(1.0,0,1)),
            cc.spawn(cc.skewTo(1.0, 0, 0),cc.scaleTo(1.0,1,1))
        )))
    },
    onCloseEvent: function (params) {
        if (typeof(this.m_callBackFunc) === "function")
        {
            this.m_callBackFunc();
        }
        this.close();
    },
    onEmit: function (params) {
        cc.director.emit("hehe");
    },
    close: function (params) {
        this.node.destroy();
    },
    onEnable: function () {
        console.log("[PopWaitView][onEnable]");
    },
    onDisable: function () {
        console.log("[PopWaitView][onDisable]");
        cc.director.off(this.m_closeEvent,this.onCloseEvent,this);
    },
    onDestroy: function () {
        cc.director.getScheduler().unschedule (this.close, this);
        cc.sys.garbageCollect();
        console.log("[PopWaitView][onDestroy]");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
