var GlobalUserData = require("GlobalUserData");
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
        m_Label_nickname: cc.Label,
        m_Label_id: cc.Label,
        m_Label_presentname: cc.Label,
        m_Label_num: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_des: cc.Label,

    },

    // use this for initialization
    onLoad: function () {

    },
    onDestroy: function () {

    },
    close: function (callback) {
        if (callback && typeof (callback) == "function") {
            callback();
        }
        this.node.removeFromParent();
        this.node.destroy();
    },
    init: function (params) {
        var itemInfo = params.itemInfo;
        var userItem = params.userItem;
        var sendNum = params.sendNum;
        var szNickName = userItem.szName;
        var dwUserID = userItem.dwUserID;

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
