var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var GlobalUserData = require("GlobalUserData");
var zjh_cmd = require("CMD_ZaJinHua");
// var CmdProduct = require("CmdProduct");
// var Configs = require("Configs");
var MultiPlatform = require("MultiPlatform");
var JCBridge = require("JCBridge");

var MissionWeiXin = {
    onWeixinLoginSuccess:function(WXUserInfo){
        console.log("MissionWeiXin onWeixinLoginSuccess",WXUserInfo);
        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//Configs.getNetworkConfig("userCenter");
        url += "/UserCenter/ThirdLogin.ashx";//Configs.getUrlSuffix("ThirdLogin");
        
        var params = {};
        params["openid"] = WXUserInfo.openid;
        params["token"] = WXUserInfo.token;
        params["thirdtype"] = 2;//GlobalDef.THIRD_TPYE.WX;
        params["machineserial"] = MultiPlatform.getMachineID();//DeviceModule::sharedDeviceModule()->getUserToken();
        params["channelid"] = GlobalDef.CHANNELID_center;//GlobalDef.getChannelID();
        params["kindid"] = zjh_cmd.KIND_ID;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            params["os"] = "1";
        }
        else {
            // todo
            params["os"] = "2";//"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url: url,
            paramString: paramString,
            callback: (value) => {
                if (value.status == 1) {
                    GlobalUserData.szAccounts = value.accounts;
                    GlobalUserData.szPassWord = value.logonpwd;
                    GlobalUserData.szRegAccount = value.unionid;
                    cc.sys.localStorage.setItem("WXaccount",GlobalUserData.szAccount);
                    cc.sys.localStorage.setItem("WXpassword",GlobalUserData.szPassword );
                    cc.sys.localStorage.setItem("WXregAccount",GlobalUserData.szRegAccount);
                    GlobalUserData.cbUserType = GlobalDef.USER_TYPE_WEIXIN;
                    if (this._callback) {
                        this._callback();
                    }
                }
                else {
                    GlobalFun.showToast(value.msg || value.Msg || value.message);
                }
            },
        });
    },
    // == Req_Access_token
    registerByWxCode:function(param){
        console.log("MissionWeiXin registerByWxCode",param);
	    var  params = param.split(":");
        if (params.length != 4){
            console.log("MissionWeiXin registerByWxCode params wrong");
            GlobalFun.showAlert({
                message:"登录失败",
            });
            return ;
        }
        //    //微信登录安卓版 有可能会回调多次，如果接收到相同的授权码 直接屏蔽
        var wxCode = params[2];
        if(wxCode == cc.sys.localStorage.getItem("wxcode")){
            console.log("MissionWeiXin registerByWxCode", wxCode,cc.sys.localStorage.getItem("wxcode"));
            return;
        }
        cc.sys.localStorage.setItem("wxcode",wxCode);
        var url = GlobalUserData.getUserServer(GlobalDef.USERCENTER);//Configs.getNetworkConfig("userCenter");
        url += "/UserCenter/GetThirdLoginInfo.ashx";//Configs.getUrlSuffix("ThirdLogin");
        
        var params = {};
        params["code"] = wxCode;
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["kindid"] = zjh_cmd.KIND_ID;
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString:paramString,
            callback: (value) => {
                if (value.status == 1 || value.Status == 1) {
                    var accessToken = value["token"];
                    var openid = value["openid"];
                    cc.sys.localStorage.setItem("token", accessToken);
                    cc.sys.localStorage.setItem("openid", openid);
                    this.reqWxUserInfo(accessToken, openid);
                }
                else {
                    // console.log("wx login fail");
                    GlobalFun.showAlert({
                        message: value.msg || "微信登录失败",
                    })
                }
            },
        });  
    },
    reqWxUserInfo:function(accessToken,openid){
        console.log("MissionWeiXin reqWxUserInfo",accessToken,openid);
        var url = "https://api.weixin.qq.com/sns/userinfo?";
        var params = {};
        params["access_token"] = accessToken;
        params["openid"] = openid;
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString:paramString,
            callback:(value)=>{
                if(value["errcode"]){
                    cc.sys.localStorage.setItem("token","");
                    cc.sys.localStorage.setItem("openid","");
                    this.doWeiXinLogin();//重新获取授权登录
                }else{
                    var WxUserInfo = {};
                    WxUserInfo.openid = value["openid"];
                    WxUserInfo.nickname = value["nickname"];
                    WxUserInfo.sex = value["sex"];
                    WxUserInfo.province = value["province"];
                    WxUserInfo.city = value["city"];
                    WxUserInfo.country = value["country"];
                    WxUserInfo.headimgurl = value["headimgurl"];
                    WxUserInfo.unionid = value["unionid"];
                    WxUserInfo.token = cc.sys.localStorage.getItem("token");
                    
                    cc.sys.localStorage.setItem("sex",WxUserInfo.sex);
                    cc.sys.localStorage.setItem("headimgurl",WxUserInfo.headimgurl);
                    cc.sys.localStorage.setItem("nickname",WxUserInfo.nickname);
                    this.onWeixinLoginSuccess(WxUserInfo);
                }
            },
            timeountCallback:()=> {
                GlobalFun.showToast("微信登录超时");
            }
        }); 
    },
    doWeiXinLogin: function (callback) {
        this._callback = callback;

        // do register weixin account
        var accessToken = cc.sys.localStorage.getItem("token") || "";
        var openid = cc.sys.localStorage.getItem("openid") || "";
        if (accessToken != "" && openid != "") {
            this.reqWxUserInfo(accessToken, openid);
        } else {
            cc.director.on("WXSuccess", this.jscallback, this);
            JCBridge.registerCallback("WXSuccess", (params) => {
                this.registerByWxCode(params);
            });
            JCBridge.registerCallback("WXFail", (params) => {
                GlobalFun.showAlert({
                    message: params,
                });
            });
            if (JCBridge.callNative("loginWX", "") == "false") {
                GlobalFun.showAlert({
                    message: "登录失败，请检查是否安装微信。",
                });
            }
        }
        console.log("[doWeiXinLogin]");
    },
    shareUrlWeixin: function (url, title, des, shareType) {
        var value = {};
        value.url = url;
        value.title = title;
        value.des = des;
        value.shareType = shareType;

        // cc.director.on("WXShareSuccess", this.jscallback, this);
        JCBridge.registerCallback("WXShareSuccess", (params) => {
            // this.registerByWxCode(params);
            cc.director.emit("WXShareSuccess",params);
        });
        JCBridge.registerCallback("WXShareFail", (params) => {
            cc.director.emit("WXShareFail",params);
        });

        JCBridge.callNative("shareWX",JSON.stringify(value));
    }
};

MissionWeiXin.SHARE_SESSION = 0;
MissionWeiXin.SHARE_MOMENTS = 1;



module.exports = MissionWeiXin;
