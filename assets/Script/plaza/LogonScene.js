var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var GlobalUserData = require("GlobalUserData");
var zjh_cmd = require("CMD_ZaJinHua");
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
        this._logonFrame = this.node.getComponent("LogonFrame");
    },
    onEnable: function() {
        cc.director.on('onLogon',this.onLogon,this);
        cc.director.on('onShowRegister',this.onShowRegister,this);
        cc.director.on('onRegister',this.onRegister,this);
    },
    onDisable: function() {
        cc.director.off('onLogon',this.onLogon,this);
        cc.director.off('onShowRegister',this.onShowRegister,this);
        cc.director.off('onRegister',this.onRegister,this);
    },
    onLogon: function(event) {
        console.log("[LogonScene][onLogon]");
        var szAccount = event.detail.szAccount;
        var szPassword = event.detail.szPassword;
        this._logonFrame.onLogonByAccount(szAccount,szPassword);
        GlobalFun.showPopWaiting(cc.director.getScene(),{
            closeEvent: "LogonSuccess",
            callBackFunc: function () {
                console.log("[LogonScene][onLogon] callbackfunc");
            },
        });
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
        // console.log(cc.isValid(this._logonView));
        if( cc.isValid(this._logonView) === false ){
            this._logonView = cc.instantiate(this.logonView);
            this.node.addChild(this._logonView);
        }
        GlobalFun.ActionShowTanChuang(this._logonView,function () {
            console.log("[LogonScene][onShowLogon]ActionShowTanChuang callback");
        })
    },
    onShowVistor: function () {
        console.log("[LogonScene][onShowVistor]");
        // GlobalFun.showToast(cc.director.getScene(),"游客登录暂未开放,敬请期待!");
        var url = GlobalDef.httpUserCenter;
        url += "/Guest/GuestLogin.ashx";
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["versionnum"] = "1.1";
        params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        if(cc.sys.os == cc.sys.OS_IOS){
             params["os"] = "2";
        }
        else {
             params["os"] = "1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][onShowVistor] "+xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    GlobalUserData.szAccounts = value.username;
                    GlobalUserData.szPassWord = value.pwd;
                    GlobalUserData.isGuest = true;
                    // cc.director.loadScene("PlazaScene");
                    self._logonFrame.onLogonByVisitor(GlobalUserData.szAccounts,GlobalUserData.szPassWord);
                }
                else {
                    if(value.msg !== undefined) {
                        GlobalFun.showToast(cc.director.getScene(),value.msg);
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
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        
    },
    onShowRegister: function() {
        if( cc.isValid(this._logonView) === true){
            this._logonView.destroy();
        }
        if(cc.isValid(this._registerView) === false){
            this._registerView = cc.instantiate(this.registerView);
            this.node.addChild(this._registerView);
        }
        GlobalFun.ActionShowTanChuang(this._registerView,function () {
            console.log("[LogonScene][onShowRegister]ActionShowTanChuang callback");
        })
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
