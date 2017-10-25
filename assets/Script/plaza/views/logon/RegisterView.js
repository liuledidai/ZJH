 require("MD5");
 var ViewBase = require("ViewBase");
 var GlobalDef = require("GlobalDef");
 var GlobalFun = require("GlobalFun");
 var GlobalUserData = require("GlobalUserData");
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
        m_editbox_account:{
            default: null,
            type: cc.EditBox,
        },
        m_editbox_password:{
            default: null,
            type: cc.EditBox,
        },
        m_editbox_name:{
            default: null,
            type: cc.EditBox,
        },
        m_editbox_yzm:{
            default: null,
            type: cc.EditBox,
        },
        m_Label_verifyTime: cc.Label,
        m_Button_verify: cc.Button,
        verifyCodeTime:60,
    },

    // use this for initialization
    onLoad: function () {
        this._verifyTime = 0;
    },
    onDestroy: function() {
        // cc.sys.garbageCollect();
        this._super();
        console.log("[RegisterView][onDestroy]");
    },
    onClickCloseButton: function() {
        // this.node.active = false;  
        cc.director.emit("onShowLogon");
        this.node.destroy();
        console.log("[RegisterView][onClickCloseButton] destroy");
    },
    onClickConfirmButton: function() {
        var szAccount = this.m_editbox_account.string;
        var szPassword = this.m_editbox_password.string;
        var szNickName = this.m_editbox_name.string;
        var szMobileAuth = this.m_editbox_yzm.string;
        var szMachineID = MultiPlatform.getMachineID();
        console.log("[RegisterView][onClickConfirmButton] "+szAccount+" # "+szPassword);
        if (szAccount.length <=0 || szPassword.length <=0 || szNickName.length <= 0 || szMobileAuth.length <= 0){
            console.log("账号密码等注册信息不能为空");
            GlobalFun.showToast("账号密码等注册信息不能为空");
            return;
        }
        if (szPassword.length < 6 || szPassword.length > 16){
            console.log("密码长度为6-16位");
            GlobalFun.showToast("密码长度为6-16位");
            return;
        }
        // 通过用户中心web接口注册用户
        var isUserCenter = true;
        if(!isUserCenter) {
            cc.director.emit("onRegister",{
                szAccount:szAccount,
                szPassword:szPassword,
                szNickName:szNickName,
                szMobileAuth:szMobileAuth,
            });
        }
        else {
            var url = GlobalUserData.serverData[GlobalDef.ACCOUNT][GlobalDef.USERCENTER]; //GlobalDef.httpUserCenter;
            url += "/UserCenter/UserCenterRegister.ashx";
            var params = '';
            var nowTime = Math.floor(Date.now()/1000);
            console.log("[RegisterView][onClickConfirmButton] nowtime seconds = "+nowTime);
            params = params + "{\"Username\":\"" + szAccount + "\",";
            params = params + "\"Password\":\"" + cc.md5Encode(szPassword) + "\",";
            params = params + "\"Nickname\":\"" + szNickName + "\",";
            params = params + "\"Datetamp\":\"" + nowTime + "\",";
            //生成签名
            var szSign = "";
            szSign += "UserName=" + szAccount;
            szSign += "|DateTamp=" + nowTime;
            szSign += "|ChannelID=" + GlobalDef.CHANNELID_center;
            szSign += "|Mobile=" + szAccount;
            szSign += "|Code=" + szMobileAuth;
            szSign += "|Key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x";

            params = params + "\"Sign\":\"" + cc.md5Encode(szSign) + "\",";
            params = params + "\"ChannelID\":\"" + GlobalDef.CHANNELID_center + "\",";
            params = params + "\"Mobile\":\"" + szAccount + "\",";
            params = params + "\"MachineNumber\":\"" + szMachineID + "\",";
            params = params + "\"Code\":\"" + szMobileAuth + "\"}";

            //"UserName=%s|DateTamp=%lld|ChannelID=%d|Mobile=%s|Code=%s|Key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x"
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(response);
                    var value = JSON.parse(response);
                    value.status = value.status || value.Status;
                    value.msg = value.msg || value.Msg;
                    if (value.status == 1 || value.Status == 1) {
                        cc.director.emit("onLogon",{szAccount:szAccount,szPassword:szPassword});
                        self.onClickCloseButton();
                    }
                    else {
                        GlobalFun.showToast(value.msg || value.Msg);
                    }
                }
            };
            xhr.open("POST", url, true);
            // xhr.setRequestHeader("Content-Type","application/json");
            xhr.send(params);
            console.log("[RegisterView][onClickConfirmButton] " + params);
        }
    },
    onClickSendButton: function() {
        var szAccount = this.m_editbox_account.string;
        var szPassword = this.m_editbox_password.string;
        var szNickName = this.m_editbox_name.string;
        var re = /1[3578][0-9]{9}/;
        if (re.exec(szAccount) === null){
            console.log("[RegisterView][onClickSendButton] 手机号码不合法");
            GlobalFun.showToast("手机号码不合法");
            return;
        }
        if (szAccount.length <=0 || szPassword.length <=0 || szNickName.length <= 0 ){
            console.log("账号密码等注册信息不能为空");
            GlobalFun.showToast("账号密码等注册信息不能为空");
            return;
        }
        this._verifyTime = this.verifyCodeTime;
        var url = GlobalUserData.serverData[GlobalDef.ACCOUNT][GlobalDef.USERCENTER];//GlobalDef.httpUserCenter;
        url += "/hz/CaptchaMobile.ashx";
        var params = "Mobile=" + szAccount;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("[RegisterView][onClickSendButton] "+xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                }
                GlobalFun.showToast(value.msg || value.Msg);
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(params);
        console.log("[RegisterView][onClickConfirmButton] " + params);

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
