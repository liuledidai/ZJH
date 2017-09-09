var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
require("MD5");
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
        m_Button_changepwd: cc.Button,
        m_Button_binding: cc.Button,
        m_Label_userName: {
            default: null,
            type: cc.Label,
        },
        m_Label_userGold: {
            default: null,
            type: cc.Label,
        },
        m_Label_userCharm: cc.Label,
        m_Label_userID: {
            default: null,
            type: cc.Label,
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite,
        },
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas,
        },
        userFaceViewPrefab: {
            default: null,
            type: cc.Prefab,
        },
        genderButton: {
            default: null,
            type: cc.ToggleGroup,
        },
        genderManButton: {
            default: null,
            type: cc.Toggle,
        },
        genderWomanButton: {
            default: null,
            type: cc.Toggle,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.refreshUI();
    },
    refreshUI: function () {
        var szNickName = GlobalUserData.szNickName;
        var llGameScore = GlobalUserData.llGameScore;
        var dwLoveLiness = GlobalUserData.dwLoveLiness;
        var dwUserID = GlobalUserData.dwUserID;
        var cbGender = GlobalUserData.cbGender || 1;
        var isGuest = GlobalUserData.isGuest;
        this.m_Label_userGold.string = llGameScore;
        this.m_Label_userCharm.string = dwLoveLiness;
        this.m_Label_userID.string = dwUserID;
        this.m_Label_userName.string = szNickName;
        if (isGuest) {
            this.m_Button_binding.node.active = true;
            this.m_Button_changepwd.node.active = false;
        }
        else {
            this.m_Button_binding.node.active = false;
            this.m_Button_changepwd.node.active = true;
        }
        // if( this._faceID !== undefined) {
        //     this.onChangeUserFace();
        //     cbGender = Math.floor((this._faceID - 1)/4) + 1;
        // }
        var faceID = this._faceID || GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        if (cbGender == 1) {
            this.genderManButton.check();
            console.log("this.genderManButton.isCheck = " + this.genderManButton.isChecked);
        }
        else {
            this.genderWomanButton.check();
            console.log("this.genderWomanButton.isCheck = " + this.genderWomanButton.isChecked);
        }
    },
    onEnable: function () {
        console.log("[UserProfileView][onEnable]");
    },
    onDisable: function () {
        console.log("[UserProfileView][onDisable]");
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[UserProfileView][onDestroy]");
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickCloseButton: function () {
        this.close();
        console.log("[UserProfileView][onClickCloseButton] destroy");
    },
    onClickEditName: function (params) {
        this.m_Label_userName.node.active = false;
    },
    onClickChangeName: function (params) {
        this.m_Label_userName.node.active = true;
        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//GlobalDef.httpUserCenter;
        url += "/HZMobile/UpdateNickName.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["nickname"] = szNewNickName;
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[UserProfileView][onClickChangeName] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.nickname !== undefined) {
                        var szNickName = value.nickname;
                        self.m_Label_userName.string = szNickName;
                        GlobalUserData.szNickName = szNickName;
                        cc.director.emit("onChangeNameSuccess");
                    }
                }
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserProfileView][onClickChangeName] " + paramString);
    },
    onClickChangeUserFace: function (params) {
        var userFaceView = cc.instantiate(this.userFaceViewPrefab);
        this.node.parent.addChild(userFaceView);
        // this.onClickCloseButton();
        var self = this;
        self.onClickCloseButton();
        GlobalFun.ActionShowTanChuang(userFaceView, function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        })
    },
    onClickChangePassword: function (params) {
        var self = this;
        self.onClickCloseButton();
        cc.loader.loadRes("prefab/UserChangePwdView", function (err, prefab) {
            var context = cc.Canvas.instance.node;
            if (cc.isValid(context)) {
                var newNode = cc.instantiate(prefab);
                context.addChild(newNode);
                GlobalFun.ActionShowTanChuang(newNode);
            }
        });
    },
    onClickGuestBind: function (params) {
        var self = this;
        self.onClickCloseButton();
        cc.loader.loadRes("prefab/GuestBindView", function (err, prefab) {
            var context = cc.Canvas.instance.node;
            if (cc.isValid(context)) {
                var newNode = cc.instantiate(prefab);
                context.addChild(newNode);
                GlobalFun.ActionShowTanChuang(newNode);
            }
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
