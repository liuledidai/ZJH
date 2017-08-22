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
        m_Button_changepwd:cc.Button,
        m_Button_binding:cc.Button,
        m_Label_userName: {
            default: null,
            type: cc.Label,
        },
        m_Label_userGold: {
            default: null,
            type: cc.Label,
        },
        m_Label_userID: {
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
        m_Editbox_originPassword: {
            default: null,
            type: cc.EditBox,
        },
        m_Editbox_confirmPassword: {
            default: null,
            type: cc.EditBox,
        },
        m_Editbox_newPassword: {
            default: null,
            type: cc.EditBox,
        },
        m_Panel_userChange: cc.Node,
        m_Panel_userInfo: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.refreshUI();
    },
    refreshUI: function () {
        var szNickName = GlobalUserData.szNickName;
        var llGameScore = GlobalUserData.llGameScore;
        var dwUserID = GlobalUserData.dwUserID;
        var cbGender = GlobalUserData.cbGender || 1;
        var isGuest = GlobalUserData.isGuest;
        this.m_Label_userGold.string = llGameScore;
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
        if (faceID <=0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));
        if (cbGender == 1) {
            this.genderManButton.check();
            console.log("this.genderManButton.isCheck = " + this.genderManButton.isChecked);
        }
        else {
            this.genderWomanButton.check();
            console.log("this.genderWomanButton.isCheck = " + this.genderWomanButton.isChecked);
        }
    },
    onEnable: function() {
        console.log("[UserProfileView][onEnable]");

    },
    onDisable: function() {
        console.log("[UserProfileView][onDisable]");
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[UserProfileView][onDestroy]");
    },
    onClickCloseButton: function() {
        this.node.destroy();
        console.log("[UserProfileView][onClickCloseButton] destroy");
    },
    onClickEditName: function (params) {
        this.m_Label_userName.node.active = false;
    },
    onClickChangeName: function (params) {
        this.m_Label_userName.node.active = true;
        var url = GlobalDef.httpUserCenter;
        url += "/HZMobile/UpdateNickName.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["nickname"] = szNewNickName;
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[UserProfileView][onClickChangeName] "+xhr.getResponseHeader("Content-Type"));
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
                if(value.msg !== undefined) {
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
        GlobalFun.ActionShowTanChuang(userFaceView,function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        })
    },
    onClickChangePassword: function (params) {
        this.m_Panel_userInfo.active = false;
        this.m_Panel_userChange.active = true;
        GlobalFun.ActionShowTanChuang(this.m_Panel_userChange,function () {
            console.log("[PlazaView][onClickChangePassword]ActionShowTanChuang callback");
        })
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
    onClickConfirmButton: function () {
        var szPassword = this.m_Editbox_originPassword.string;
        var szNewPassword = this.m_Editbox_newPassword.string;
        var szConfirmPassword = this.m_Editbox_confirmPassword.string;
        if(szPassword.length <= 0 || szNewPassword.length <= 0 || szConfirmPassword.length <= 0) {
            console.log("[PlazaView][onClickConfirmButton] 密码不能为空!");
            GlobalFun.showToast("密码不能为空!");
            return;
        }
        if(szPassword == szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 新旧密码不能相同!");
            GlobalFun.showToast("新旧密码不能相同!");
            return;
        }
        if(szConfirmPassword != szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 确认密码不一致!");
            GlobalFun.showToast("确认密码不一致!");
            return;
        }
        if(szNewPassword.length < 6 || szNewPassword.length > 16) {
            console.log("[PlazaView][onClickConfirmButton] 密码长度为6-16位!");
            GlobalFun.showToast("密码长度为6-16位!");
            return;
        }
        var url = GlobalDef.httpBaseUrl;
        url += "/hz/hzUpdatePassWord.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["type"] = "1";
        params["oldpass"] = cc.md5Encode(szPassword);
        params["newpass"] = cc.md5Encode(szNewPassword);
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[UserProfileView][onClickConfirmButton] "+xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    GlobalUserData.szPassWord = cc.md5Encode(szNewPassword);
                    cc.sys.localStorage.setItem('password', szNewPassword);
                    self.m_Editbox_confirmPassword.string = "";
                    self.m_Editbox_newPassword.string = "";
                    self.m_Editbox_originPassword.string = "";
                    self.m_Panel_userInfo.active = true;
                    self.m_Panel_userChange.active = false;
                    GlobalFun.ActionShowTanChuang(self.m_Panel_userInfo,function () {
                        console.log("[PlazaView][onClickConfirmButton]ActionShowTanChuang callback");
                    })
                    cc.director.emit("onChangePasswordSuccess");
                }
                if(value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserProfileView][onClickConfirmButton] " + paramString);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
