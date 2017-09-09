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
    },

    // use this for initialization
    onLoad: function () {

    },
    onEnable: function () {
        console.log("[UserChangePwdView][onEnable]");
    },
    onDisable: function () {
        console.log("[UserChangePwdView][onDisable]");
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[UserChangePwdView][onDestroy]");
    },
    close: function() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickCloseButton: function () {
        this.close();
        console.log("[UserChangePwdView][onClickCloseButton] destroy");
    },
    onClickEditName: function (params) {
        this.m_Label_userName.node.active = false;
    },
    onClickConfirmButton: function () {
        var szPassword = this.m_Editbox_originPassword.string;
        var szNewPassword = this.m_Editbox_newPassword.string;
        var szConfirmPassword = this.m_Editbox_confirmPassword.string;
        if (szPassword.length <= 0 || szNewPassword.length <= 0 || szConfirmPassword.length <= 0) {
            console.log("[UserChangePwdView][onClickConfirmButton] 密码不能为空!");
            GlobalFun.showToast("密码不能为空!");
            return;
        }
        if (szPassword == szNewPassword) {
            console.log("[UserChangePwdView][onClickConfirmButton] 新旧密码不能相同!");
            GlobalFun.showToast("新旧密码不能相同!");
            return;
        }
        if (szConfirmPassword != szNewPassword) {
            console.log("[UserChangePwdView][onClickConfirmButton] 确认密码不一致!");
            GlobalFun.showToast("确认密码不一致!");
            return;
        }
        if (szNewPassword.length < 6 || szNewPassword.length > 16) {
            console.log("[UserChangePwdView][onClickConfirmButton] 密码长度为6-16位!");
            GlobalFun.showToast("密码长度为6-16位!");
            return;
        }
        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//GlobalDef.httpBaseUrl;
        // url += "/hz/hzUpdatePassWord.ashx";
        url += "/hz/hzUpdatePassWord3_0.ashx";
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
                    self.showUserProfileView();
                    self.close();
                    cc.director.emit("onChangePasswordSuccess");
                }
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserChangePwdView][onClickConfirmButton] " + paramString);
    },
    showUserProfileView: function() {
        var self = this;
        cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
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
