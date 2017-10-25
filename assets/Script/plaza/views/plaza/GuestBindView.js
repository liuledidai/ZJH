require("MD5");
var ViewBase = require("ViewBase");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
var GlobalUserData = require("GlobalUserData");
var zjh_cmd = require("CMD_ZaJinHua");
var MultiPlatform = require("MultiPlatform");
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
        m_Editbox_phone: cc.EditBox,
        m_Editbox_nickname: cc.EditBox,
        m_Editbox_secret: cc.EditBox,
        m_Editbox_verify: cc.EditBox,

        m_Label_verifyTime: cc.Label,
        m_Button_verify: cc.Button,
        verifyCodeTime:60,
    },

    // use this for initialization
    onLoad: function () {
        this._verifyTime = 0;
    },
    onSend: function (params) {
        var szTel = this.m_Editbox_phone.string;
        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onSend] 手机号码不合法");
            GlobalFun.showToast("手机号码不合法");
            return;
        }
        this._verifyTime = this.verifyCodeTime;
        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//GlobalDef.httpUserCenter;
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
                GlobalFun.showToast(value.Msg);
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
        var szNickName = this.m_Editbox_nickname.string;
        if (szTel.length <=0 || szPwd.length <=0 || szNickName.length <= 0 || szVerify.length <= 0){
            console.log("账号密码等信息不能为空");
            GlobalFun.showToast("账号密码等信息不能为空");
            return;
        }
        if (szPwd.length < 6 || szPwd.length > 16){
            console.log("密码长度为6-16位");
            GlobalFun.showToast("密码长度为6-16位");
            return;
        }

        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onConfirm] 手机号码不合法");
            GlobalFun.showToast("手机号码不合法");
            return;
        }

        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//GlobalDef.httpUserCenter;
        // url += "/Guest/GuestBindMobile.ashx";
        url += "/HZMobile/GuestBindMobile.ashx";
        var szMachineID = MultiPlatform.getMachineID() || "2d4d7c95e5df0179af2466f635ca7123";

        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["useridentity"] = szMachineID;
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["mobile"] = szTel;
        params["pwd"] = cc.md5Encode(szPwd);
        params["code"] = szVerify;
        params["kindid"] = zjh_cmd.KIND_ID;
        params["nickname"] = szNickName;

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
                    // GlobalFun.showToast("账号绑定成功，您可以用正式账号登录游戏了");
                    cc.director.emit("onPlazaRefreshUI");
                    self.onClose();
                    GlobalFun.showAlert({
                        message: "账号绑定成功，您可以用正式账号登录游戏了",
                        // textAlignment: cc.TextAlignment.LEFT,
                        btn: [
                            {
                                name: "确定",
                                callback: () => {
                                    GlobalUserData.szUserGUID = undefined;
                                    var bRememberPwd = cc.sys.localStorage.getItem("bRememberPwd");
                                    if (bRememberPwd == 'true') {
                                        cc.sys.localStorage.setItem('account', szTel);
                                        cc.sys.localStorage.setItem('password', szPwd);
                                    }
                                    var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
                                    if (GameFrameNode) {
                                        console.log("[GuestBindView] 获取GameFrame 所在节点 并取消为常驻节点");
                                        cc.game.removePersistRootNode(GameFrameNode);
                                    }
                                    // cc.director.loadScene("LoginScene");
                                    GlobalFun.showLoadingView({
                                        closeEvent: "LoginSceneFinish",
                                        des: "正在加载资源，请等待...",
                                        loadfunc: function () {
                                            cc.director.preloadScene("LoginScene", function () {
                                                cc.log("LoginScene scene preloaded");
                                                cc.director.emit("LoginSceneFinish");
                                            });
                                        },
                                        closefunc: function () {
                                            cc.director.loadScene("LoginScene");
                                            // cc.sys.garbageCollect();
                                        },
                                    })
                                }
                            }
                        ],
                    })
                }
                GlobalFun.showToast(value.msg || value.Msg);
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
    update: function (dt) {
        if (this._verifyTime <= 0) {
            this.m_Button_verify.interactable = true;
            this.m_Label_verifyTime.node.active = false;
            return;
        }
        else {
            this.m_Button_verify.interactable = false;
            this.m_Label_verifyTime.node.active = true;
            var str = Math.ceil(this._verifyTime) + "s";
            this.m_Label_verifyTime.string = str;
            this._verifyTime -= dt;
        }
    },
});
