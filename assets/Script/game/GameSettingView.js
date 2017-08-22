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
        m_Button_music_switch_off: cc.Button,
        m_Button_music_switch_on: cc.Button,
        m_Button_effect_switch_off: cc.Button,
        m_Button_effect_switch_on: cc.Button,

    },

    // use this for initialization
    onLoad: function () {
        this.onRefreshEffect();
        this.onRefreshMusic();
    },
    onRefreshMusic: function () {
        this.m_Button_music_switch_off.node.active = !GlobalUserData.bMusicAble;
        this.m_Button_music_switch_on.node.active = GlobalUserData.bMusicAble;
    },
    onRefreshEffect: function () {
        this.m_Button_effect_switch_off.node.active = !GlobalUserData.bEffectAble;
        this.m_Button_effect_switch_on.node.active = GlobalUserData.bEffectAble;
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
    onClickMusicSwitch: function () {
        GlobalUserData.setMusicAble(!GlobalUserData.bMusicAble);
        this.onRefreshMusic();
    },
    onClickEffectSwitch: function () {
        GlobalUserData.setEffectAble(!GlobalUserData.bEffectAble);
        this.onRefreshEffect();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
