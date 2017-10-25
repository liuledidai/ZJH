var ViewBase = require("ViewBase");
var GlobalUserData = require("GlobalUserData");
var GlobalDef = require("GlobalDef");
cc.Class({
    extends: ViewBase,

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
        console.log("[GameSelfInfoView] " + JSON.stringify(userItem, null, ' '));
        var szNickName = userItem.szName;
        var szGold = userItem.lScore;
        var szCharm = userItem.lLoveliness;
        var dwGameID = userItem.dwGameID;
        var cbGender = userItem.cbGender;
        var faceID = userItem.wFaceID;
        faceID = GlobalUserData.getUserFaceID(faceID, cbGender);
        var szGenderImgName = "gameuser_man";
        if (cbGender == GlobalDef.GENDER_GIRL) {
            szGenderImgName = "gameuser_woman";
        }
        else {
            szGenderImgName = "gameuser_man";
        }
        this.m_Image_gender.spriteFrame = this.gameUserAtlas.getSpriteFrame(szGenderImgName);
        this.m_Label_name.string = szNickName;
        this.m_Label_gold.string = szGold;
        this.m_Label_charm.string = szCharm;
        this.m_Label_ID.string = dwGameID;
        this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        if (userItem.cbUserType === GlobalDef.USER_TYPE_WEIXIN && GlobalUserData.szWeChatImgURL) {
            this.m_Label_name.string = userItem.szWeChatNickName || szNickName;
            cc.loader.load({ url: userItem.szWeChatImgURL, type: "png" }, (err, tex) => {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                this.m_Image_userface.spriteFrame = spriteFrame;
            })
        }
        else {
            // this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        }


    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
