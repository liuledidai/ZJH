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
        m_Label_account: {
            default: null,
            type: cc.Label,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.m_Label_account.string = GlobalUserData.szAccounts;
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[SettingView][onDestroy]");
    },
    onClickCloseButton: function() {
        // this.node.active = false;  
        this.node.destroy();
        console.log("[SettingView][onClickCloseButton] destroy");
    },
    onClickSwitchAccount: function () {
        cc.director.loadScene("LoginScene");
        cc.sys.garbageCollect();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
