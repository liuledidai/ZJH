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
        m_arrow: cc.Node,
        arrow_times: 6,
        arrow_rounds: 10,
    },

    // use this for initialization
    onLoad: function () {

    },
    onDestroy: function () {
        
    },
    onDisable: function () {
        
    },
    onEnable: function () {
        
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickStart: function () {
        var ang = GlobalFun.getRandomInt(0,360);
        var rotate = cc.rotateBy(this.arrow_times,ang + 360 * this.arrow_rounds);
        this.m_arrow.runAction(rotate.easing(cc.easeCubicActionOut(this.arrow_times)));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
