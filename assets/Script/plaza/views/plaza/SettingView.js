var GlobalUserData = require("GlobalUserData");
var GlobalDef = require("GlobalDef");
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
        m_Label_account: {
            default: null,
            type: cc.Label,
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite,
        },
        userFaceAtals: {
            default:null,
            type: cc.SpriteAtlas,
        },
        m_Button_music_switch_off: cc.Button,
        m_Button_music_switch_on: cc.Button,
        m_Button_effect_switch_off: cc.Button,
        m_Button_effect_switch_on: cc.Button,

    },

    // use this for initialization
    onLoad: function () {
        var faceID = GlobalUserData.getUserFaceID();
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));

        if (GlobalUserData.cbUserType == GlobalDef.USER_TYPE_WEIXIN && GlobalUserData.szWeChatImgURL) {
            this.m_Label_account.string = GlobalUserData.szWeChatNickName;
            cc.loader.load({url:GlobalUserData.szWeChatImgURL,type:"png"},(err,tex)=>{
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0,0,tex.width,tex.height));
                this.m_Image_userFace.spriteFrame = spriteFrame;
            })
        }
        else {
            this.m_Label_account.string = GlobalUserData.szNickName || GlobalUserData.szAccounts;
        }
        
        this.onRefreshEffect();
        this.onRefreshMusic();
    },
    onRefreshMusic: function () {
        // this.m_Button_music_switch_off.node.active = !GlobalUserData.bMusicAble;
        this.m_Button_music_switch_on.node.active = GlobalUserData.bMusicAble;
    },
    onRefreshEffect: function () {
        // this.m_Button_effect_switch_off.node.active = !GlobalUserData.bEffectAble;
        this.m_Button_effect_switch_on.node.active = GlobalUserData.bEffectAble;
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[SettingView][onDestroy]");
    },
    onClickCloseButton: function() {
        // this.node.active = false;  
        this.node.removeFromParent();
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
    onClickSwitchAccount: function () {
        GlobalFun.showAlert({
            message: "是否退出当前账号，重新登录？",
            // textAlignment: cc.TextAlignment.LEFT,
            btn: [
                {
                    name: "取消",
                },
                {
                    name: "确定",
                    callback: () => {
                        GlobalUserData.szUserGUID = undefined;
                        //清空微信授权登录数据
                        cc.sys.localStorage.setItem("WXaccount","");
                        cc.sys.localStorage.setItem("WXpassword","");
                        cc.sys.localStorage.setItem("WXregAccount","");

                        cc.sys.localStorage.setItem("token", "");
                        cc.sys.localStorage.setItem("openid", "");

                        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
                        if (GameFrameNode) {
                            console.log("[SettingView][onClickSwitchAccount] 获取GameFrame 所在节点 并取消为常驻节点");
                            cc.game.removePersistRootNode(GameFrameNode);
                        }
                        cc.director.loadScene("LoginScene");
                    }
                }
            ],
        })

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
