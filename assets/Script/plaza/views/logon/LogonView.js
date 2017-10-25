var ViewBase = require("ViewBase");
var GlobalDef = require("GlobalDef");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var AudioMng = require("AudioMng");
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
        m_editbox_account:{
            default: null,
            type: cc.EditBox,
        },
        m_editbox_password:{
            default: null,
            type: cc.EditBox,
        },
        m_checkbox: {
            default: null,
            type: cc.Toggle
        },
        m_Button_register: cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        if(this.m_checkbox) {
            var pwd = cc.sys.localStorage.getItem("pwd");
            var bRememberPwd = cc.sys.localStorage.getItem("bRememberPwd");
            
            console.log("[LogonView][onLoad] is " + bRememberPwd);
            if (bRememberPwd == 'true' || bRememberPwd === null) {
                console.log("[LogonView][onLoad] check");
                this.m_checkbox.check();
                var szAccount = cc.sys.localStorage.getItem("account") || "";
                var szPassword = cc.sys.localStorage.getItem("password") || "";
                this.m_editbox_account.string = szAccount;
                this.m_editbox_password.string = szPassword;
            }
            else {
                console.log("[LogonView][onLoad] uncheck")
                this.m_checkbox.uncheck();
            }
        }
    },
    onEnable: function () {
        cc.director.on('appUpdateCompleted',this.onAppUpdateCompleted,this);
    },
    onDisable: function () {
        cc.director.off('appUpdateCompleted',this.onAppUpdateCompleted,this);
    },
    onAppUpdateCompleted: function () {
        this.m_Button_register.node.active = Boolean(GlobalUserData.isOpenRegister);
    },
    onDestroy: function() {
        // cc.sys.garbageCollect();
        this._super();
        console.log("[LogonView][onDestroy]");
    },
    onLogon: function() {
        AudioMng.playButton();
        var szAccount = this.m_editbox_account.string;
        var szPassword = this.m_editbox_password.string;
        console.log("[LogonView][onLogon] "+szAccount+" # "+szPassword);
        if (szAccount.length <= 0 || szPassword.length <= 0) {
            GlobalFun.showToast("账号或密码不能为空");
            return;
        }
        cc.director.emit("onLogon",{szAccount:szAccount,szPassword:szPassword});
    },
    onClickCloseButton: function() {
        // this.node.active = false;  
        this.node.destroy();
        console.log("[LogonView][onClickCloseButton] destroy");
    },
    onClickRegisterButton: function() {
        cc.director.emit("onShowRegister");
    },
    onClickForgetPassword: function(){
        var url = GlobalUserData.serverData[GlobalDef.ACCOUNT]["forgetPassword"];
        cc.sys.openURL(url);
    },
    checkBoxClicked: function (toggle) {
        if (toggle.isChecked) {
            console.log("[LogonView][checkBoxClicked] is checked");
        }
        else {
            console.log("[LogonView][checkBoxClicked] is unchecked");
        }
        cc.sys.localStorage.setItem("bRememberPwd", toggle.isChecked);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
