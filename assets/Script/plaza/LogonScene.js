var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var GlobalUserData = require("GlobalUserData");
var zjh_cmd = require("CMD_ZaJinHua");
var MultiPlatform = require("MultiPlatform");
var AudioMng = require("AudioMng");
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
        logonView: {
            default: null,
            type: cc.Prefab,
        },
        registerView: {
            default: null,
            type: cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        console.log("[LogonScene][onLoad]");
        GlobalUserData.init();
        AudioMng.playMusic("bgm_plaza");
        this._logonFrame = this.node.getComponent("LogonFrame");
        this._logonView = cc.find("Canvas/LogonView");
        this.appUpdate();
    },
    onEnable: function() {
        cc.director.on('onLogon',this.onLogon,this);
        cc.director.on('onShowRegister',this.onShowRegister,this);
        cc.director.on('onShowLogon',this.onShowLogon,this);
        cc.director.on('onRegister',this.onRegister,this);
    },
    onDisable: function() {
        cc.director.off('onLogon',this.onLogon,this);
        cc.director.off('onShowRegister',this.onShowRegister,this);
        cc.director.off('onShowLogon',this.onShowLogon,this);
        cc.director.off('onRegister',this.onRegister,this);
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
    },
    appUpdate: function () {
        var szMachineID = MultiPlatform.getMachineID();
        var url = GlobalDef.httpInitUrl;
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["version"] = "1.1";
        // params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["mobilemachine"] = szMachineID || "2d4d7c95e5df0179af2466f635ca71de";
        params["schannelid"] = "AppStore";
        // params["channelid"] = GlobalDef.CHANNELID_center;
        if(cc.sys.os == cc.sys.OS_IOS){
            params["os"] = "2";
        }
        else {
            // todo
            params["os"] = "2";//"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        console.log("[LogonScene][appUpdate] params ",paramString);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][appUpdate] "+xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                response =  response.replace(/[\b\f\n\r\t]/g, '');
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    var version = parseFloat(value.version);
                    var curVersion = parseFloat(MultiPlatform.getAppVersion() || "1.0");
                    var IsMaintained = parseInt(value.ismaintained);
                    if (IsMaintained) {
                        GlobalFun.showAlert({
                            message: value.maintaintime,
                            btn: [
                                {
                                    name: "确定",
                                    callback: () => {
                                        self.appUpdate();
                                    }
                                },
                            ]
                        })
                    }
                    else if (version > curVersion) {
                        var isForceUpdate = parseInt(value.isforceupdate);
                        var description = value.description;
                        var szUrl = value.url;
                        if (isForceUpdate) {
                            GlobalFun.showAlert({
                                message: description,
                                btn: [
                                    {
                                        name: "更新",
                                        callback: () => {
                                            cc.sys.openURL(szUrl);
                                        }
                                    },
                                ]
                            })
                        }
                        else {
                            GlobalFun.showAlert({
                                message: description,
                                btn: [
                                    {
                                        name: "暂不更新",
                                    },
                                    {
                                        name: "去更新",
                                        callback: () => {
                                            cc.sys.openURL(szUrl);
                                        }
                                    }
                                ]
                            })
                        }
                    }
                    if (value.isopenregister !== undefined) {
                        var isOpenRegister = parseInt(value.isopenregister);
                        GlobalUserData.isOpenRegister = ! isOpenRegister;
                    }
                    if (value.systemmessage !== undefined) {
                        if (value.systemmessage.length > 0) {
                            cc.sys.localStorage.setItem("systemmessage",value.systemmessage);
                        }
                    }
                    if (value.config !== undefined) {
                        self.requestServerCfg(value.config);
                    }
                }
                else {
                    GlobalFun.showAlert({
                        message: value.msg || "服务器开小差了，请稍后重试",
                        btn: [
                            {
                                name: "确定",
                                callback: () => {
                                    self.appUpdate();
                                }
                            },
                        ]
                    })
                }
                cc.director.emit("appUpdateCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(),{
            closeEvent: "appUpdateCompleted",
            callBackFunc: function () {
                console.log("[LogonScene][appUpdate] callbackfunc");
            },
            waitingTime:8,
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showAlert({
                message: "服务器连接失败，请检查网络后重试",
                btn: [
                    {
                        name: "确定",
                        callback: () => {
                            self.appUpdate();
                        }
                    },
                ]
            })
            cc.director.emit("appUpdateCompleted");
            xhr.abort();
        }
        xhr.send(paramString);
    },
    requestServerCfg: function (url) {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][appUpdate] "+xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                response =  response.replace(/[\b\f\n\r\t]/g, '');
                console.log(response);
                var value = JSON.parse(response);
                if (value.server !== undefined) {
                    GlobalUserData.serverData = value;
                    console.log(JSON.stringify(GlobalUserData.serverData,null,' '));
                }
                cc.director.emit("configCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(),{
            closeEvent: "configCompleted",
            callBackFunc: function () {
                console.log("[LogonScene][requestServerCfg] callbackfunc");
            },
            waitingTime:8,
        });
        xhr.open("GET", url, true);
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showToast("服务器开小差了，请稍后重试");
            xhr.abort();
        }
        xhr.send();
    },
    onLogon: function(event) {
        console.log("[LogonScene][onLogon]");
        var szAccount = event.detail.szAccount;
        var szPassword = event.detail.szPassword;
        // this._logonFrame.onLogonByAccount(szAccount,szPassword);
        // GlobalFun.showPopWaiting(cc.director.getScene(),{
        //     closeEvent: "LogonSuccess",
        //     callBackFunc: function () {
        //         console.log("[LogonScene][onLogon] callbackfunc");
        //     },
        // });
        var self = this;
        GlobalFun.showLoadingView({
            closeEvent: "LogonFinish",
            loadfunc: function () {
                cc.director.preloadScene("PlazaScene", function () {
                    cc.log("PlazaScene scene preloaded");
                    self._logonFrame.onLogonByAccount(szAccount,szPassword);
                });
            },
            closefunc: function () {
                cc.director.loadScene("PlazaScene");
                // cc.sys.garbageCollect();
            },
        })
    },
    onRegister: function(event) {
      console.log("[LogonScene][onRegister]");
      var szAccount = event.detail.szAccount;
      var szPassword = event.detail.szPassword;
      var szNickName = event.detail.szNickName;
      var szMobileAuth = event.detail.szMobileAuth;
      if(szAccount === undefined || szPassword === undefined) {
          console.log("[LogonScene][onRegister] szAccount or szPassword is undefined");
          return;
      }
      this._logonFrame.onRegister(szAccount,szPassword,szNickName,szMobileAuth);
    },
    onShowLogon: function() {
        // AudioMng.playButton();
        // console.log(cc.isValid(this._logonView));
        if( cc.isValid(this._logonView)){
            // this._logonView = cc.instantiate(this.logonView);
            // this.node.addChild(this._logonView);
            this._logonView.active = true;
        }
        // GlobalFun.ActionShowTanChuang(this._logonView,function () {
        //     console.log("[LogonScene][onShowLogon]ActionShowTanChuang callback");
        // })
    },
    onShowVistor: function () {
        AudioMng.playButton();
        console.log("[LogonScene][onShowVistor]");
        // GlobalFun.showAlert(cc.director.getScene(),"游客登录暂未开放,敬请期待!");
        var szMachineID = MultiPlatform.getMachineID();
        // GlobalFun.showToast(szMachineID);
        var url = GlobalDef.httpUserCenter;
        // url += "/Guest/GuestLogin.ashx";
        url += "/HZMobile/GuestLogin.ashx";
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["versionnum"] = "1.1";
        // params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["useridentity"] = szMachineID || "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        if(cc.sys.os == cc.sys.OS_IOS){
            params["os"] = "2";
        }
        else {
            // todo
            params["os"] = "2";//"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        console.log("[LogonScene][onShowVistor] params ",paramString);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][onShowVistor] "+xhr.readyState);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    GlobalUserData.szAccounts = value.username;
                    GlobalUserData.szPassWord = value.pwd;
                    GlobalUserData.isGuest = true;
                    // cc.director.loadScene("PlazaScene");
                    // self._logonFrame.onLogonByVisitor(GlobalUserData.szAccounts,GlobalUserData.szPassWord);
                    GlobalFun.showLoadingView({
                        closeEvent: "LogonFinish",
                        loadfunc: function () {
                            cc.director.preloadScene("PlazaScene", function () {
                                cc.log("PlazaScene scene preloaded");
                                self._logonFrame.onLogonByVisitor(GlobalUserData.szAccounts,GlobalUserData.szPassWord);
                            });
                        },
                        closefunc: function () {
                            cc.director.loadScene("PlazaScene");
                            // cc.sys.garbageCollect();
                        },
                    })
                }
                else {
                    if(value.msg !== undefined) {
                        GlobalFun.showAlert({message:value.msg});
                    }
                }
                cc.director.emit("GuestLoginCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(),{
            closeEvent: "GuestLoginCompleted",
            callBackFunc: function () {
                console.log("[LogonScene][onShowVistor] callbackfunc");
            },
            waitingTime:8,
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showToast("服务器连接超时，请稍候重试");
            cc.director.emit("GuestLoginCompleted");
            xhr.abort();
        }
        xhr.send(paramString);
        
    },
    onShowRegister: function() {
        AudioMng.playButton();
        if( cc.isValid(this._logonView) === true){
            // this._logonView.destroy();
            this._logonView.active = false;
        }
        if(cc.isValid(this._registerView) === false){
            this._registerView = cc.instantiate(this.registerView);
            this.node.addChild(this._registerView);
        }
        GlobalFun.ActionShowTanChuang(this._registerView,function () {
            console.log("[LogonScene][onShowRegister]ActionShowTanChuang callback");
        })
    },

    onShowWxLogon: function () {
        AudioMng.playButton();
        MultiPlatform.showAlert(MultiPlatform.getAppVersion(),MultiPlatform.getIpAddress());
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
