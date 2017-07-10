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
        m_Label_alert: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        // this.init({message:"this is just test"});
        console.log("[AlertView][onLoad]");
    },
    init: function (params) {
        var message = params.message;
        this.m_Label_alert.string = message;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.fadeIn(0.5),cc.delayTime(1.0),cc.fadeOut(0.5),cc.removeSelf()));
        console.log("[AlertView][init] message = " + message);
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[AlertView][onDestroy]");
    },
    onDisable: function (params) {
        this.node.destroy();
        console.log("[AlertView][onDisable]");
    },
    onEnable: function (params) {
        console.log("[AlertView][onEnable]");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
