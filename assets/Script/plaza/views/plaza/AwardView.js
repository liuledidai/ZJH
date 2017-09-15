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
        m_Label_num: cc.Label,
        m_backline: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.m_backline.runAction(cc.repeatForever(cc.rotateBy(12.0,360.0)));
    },
    init: function (params) {
        var szNum = params.num;
        this.m_Label_num.string = "x" + szNum;
        this.m_callback = params.callback;
    },
    close: function () {
        if (this.m_callback && typeof(this.m_callback) == "function") {
            this.m_callback();
        }
        this.node.removeFromParent();
        this.node.destroy();  
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
