require("MD5");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
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
        m_Editbox_phone: cc.EditBox,
        m_Editbox_secret: cc.EditBox,
        m_Editbox_verify: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {

    },
    onSend: function (params) {
        var szTel = this.m_Editbox_phone.string;
        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onSend] 手机号码不合法");
            GlobalFun.showAlert("手机号码不合法");
            return;
        }

        var url = GlobalDef.httpUserCenter;
        url += "/hz/CaptchaMobile.ashx";
        var params = "Mobile=" + szTel;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                }
                GlobalFun.showAlert(value.Msg);
            }
        };
        xhr.open("POST", url, true);
        xhr.send(params);
        console.log("[GuestBindView][onSend] " + params);
    },
    onConfirm: function (params) {
        var szTel = this.m_Editbox_phone.string;
        var szPwd = this.m_Editbox_secret.string;
        var szVerify = this.m_Editbox_verify.string;
        if (szTel.length <=0 || szPwd.length <=0 || szVerify.length <= 0){
            console.log("帐号密码等信息不能为空");
            GlobalFun.showAlert("帐号密码等信息不能为空");
            return;
        }
        if (szPwd.length < 6 || szPwd.length > 16){
            console.log("密码长度为6-16位");
            GlobalFun.showAlert("密码长度为6-16位");
            return;
        }

        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onConfirm] 手机号码不合法");
            GlobalFun.showAlert("手机号码不合法");
            return;
        }

        var url = GlobalDef.httpUserCenter;
        url += "/Guest/GuestBindMobile.ashx";

        var params = {};
        params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["mobile"] = szTel;
        params["pwd"] = cc.md5Encode(szPwd);
        params["code"] = szVerify;

        var paramString = GlobalFun.buildRequestParam(params);

        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.userid !== undefined) {
                        // 
                    }
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = value.score;
                    }
                    if (value.username !== undefined) {
                        GlobalUserData.szAccounts = value.username;
                    }
                    if (value.nickname !== undefined) {
                        GlobalUserData.szNickName = value.nickname;
                    }
                    GlobalUserData.szPassWord = cc.md5Encode(szPwd);
                    GlobalUserData.isGuest = false;
                    GlobalFun.showAlert("帐号绑定成功，您可以用正式帐号登录游戏了");
                    cc.director.emit("onGuestBindSuccess");
                    self.onClose();
                }
                GlobalFun.showAlert(value.msg);
            }
        };
        xhr.open("POST", url, true);
        xhr.send(paramString);
        console.log("[GuestBindView][onConfirm] " + paramString);
    },
    onClose: function (params) {
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
