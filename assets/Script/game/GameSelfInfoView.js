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
        m_Label_name: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_ID: cc.Label,
        m_Image_userface: cc.Sprite,
        m_Image_gender: cc.Sprite,
        gameUserAtlas: cc.SpriteAtlas,
        userFaceAtals: cc.SpriteAtlas,
        
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (userItem) {
        if (userItem === undefined) {
            console.log("[GameSelfInfoView][init] userItem is undefined");
            return;
        }
        console.log("[GameSelfInfoView] " + JSON.stringify(userItem,null,' '));
        var szNickName = userItem.szName;
        var szGold = userItem.lScore;
        var szCharm = 0;
        var dwUserID = userItem.dwUserID;
        var cbGender = userItem.cbGender;

        this.m_Label_name.string = szNickName;
        this.m_Label_gold.string = szGold;
        this.m_Label_charm.string = szCharm;
        this.m_Label_ID.string = dwUserID;

        var faceID = userItem.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        var szGenderImgName = "gameuser_man";
        if (cbGender == 1) {
            szGenderImgName = "gameuser_man";
        }
        else {
            szGenderImgName = "gameuser_woman";
        }
        this.m_Image_gender.spriteFrame = this.gameUserAtlas.getSpriteFrame(szGenderImgName);
        this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();  
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
