var ViewBase = require("ViewBase");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var MissionWeiXin = require("MissionWeiXin");
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
        radioButton: {
            default: [],
            type: cc.Toggle
        },

        m_Label_gold: cc.Label,
        m_Label_complete: cc.Label,
        m_Label_turn: cc.Label,
        m_Label_time: cc.Label,
        m_Panel_logon: cc.Node,
        m_Button_get: cc.Button,

        m_Label_sharegold: cc.Label,
        m_Panel_share: cc.Node,
        m_Button_share: cc.Button,

        _selectIndex: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.radioButtonClicked(this.radioButton[this._selectIndex]);
        this.refreshUI();
        this.schedule(()=>{
            this.refreshUI();
        },0.5);
    },
    onEnable: function name(params) {
        cc.director.on("WXShareSuccess",this.onWxShareSuccess,this);
        cc.director.on("WXShareFail",this.onWxShareFail,this);
    },
    onDisable: function name(params) {
        cc.director.off("WXShareSuccess",this.onWxShareSuccess,this);
        cc.director.off("WXShareFail",this.onWxShareFail,this);
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    refreshUI: function () {
        // console.log("[ActivityView][refreshUI]");
        var loginData = GlobalUserData.activityData.login;
        var shareData = GlobalUserData.activityData.share;
        if (!loginData || !shareData) {
            return;
        }
        //登录
        var loginNum = parseInt(loginData.number);
        var current = parseInt(loginData.current);
        var gamecount = parseInt(loginData.gamecount);
        var loginTime = parseInt(loginData.time);

        this.m_Label_gold.string = loginData.gold;
        if (current >= gamecount) {
            this.m_Label_turn.string = "已完成";
        }
        else {
            this.m_Label_turn.string = current + "/" + gamecount;
        }
        //时间
        var timeStr = GlobalFun.getTimeStr(loginTime- GlobalFun.getServerTime());
        // console.log(GlobalFun.getServerTime(),GlobalFun.getNowTimeSeconds(),timeStr);
        if (timeStr == "00:00:00") {
            // console.log("已完成");
            this.m_Label_time.string = "已完成";
        }
        else {
            this.m_Label_time.string = timeStr;
        }

        if (loginNum > 0 && current >= gamecount && timeStr == "00:00:00") {
            this.m_Button_get.interactable = true;
        }
        else {
            this.m_Button_get.interactable = false;
        }

        if (loginNum <= 0) {
            this.m_Label_complete.node.active = true;
            this.m_Label_gold.string = "0";
            this.m_Label_turn.string = "今日已完成";
            this.m_Label_time.string = "今日已完成";
        }
        else {
            this.m_Label_complete.node.active = false;
        }

        //分享
        var shareNum = parseInt(shareData.number);
        this.m_Label_sharegold.string = shareData.gold;
        if (shareNum > 0) {
            this.m_Button_share.interactable = true;
        }
        else {
            this.m_Button_share.interactable = false;
        }
    },
    radioButtonClicked: function (toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        if (this._selectIndex == 0) {
            this.m_Panel_logon.active = true;
            this.m_Panel_share.active = false;
        }
        else {
            this.m_Panel_logon.active = false;
            this.m_Panel_share.active = true;
        }
    },
    requestWxShare: function () {
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);
        url += "/hz/hzSendGold.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["kindid"] = zjh_cmd.KIND_ID;
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString: paramString,
            callback:(value)=> {
                if (value.status == 1) {
                    if (value.share !== undefined) {
                        GlobalUserData.activityData.share = value.share;
                    }
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = Number(value.score);
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = Number(value.insurescore);
                    } 
                    if (value.gold !== undefined) {
                        GlobalFun.showAwardView({
                            num: value.gold,
                            callback: () => {
                                cc.director.emit("onPlazaRefreshUI");
                            }
                        })
                    }
                }
                else {
                    GlobalFun.showToast(value.msg);
                }
            },
        })
    },
    requestLoginActivity: function () {
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);
        url += "/hz/hzCheckInSendGold.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["kindid"] = zjh_cmd.KIND_ID;
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString: paramString,
            callback:(value)=> {
                if (value.status == 1) {
                    if (value.login !== undefined) {
                        GlobalUserData.activityData.login = value.login;
                    }
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = Number(value.score);
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = Number(value.insurescore);
                    } 
                    if (value.gold !== undefined) {
                        GlobalFun.showAwardView({
                            num: value.gold,
                            // callback: () => {
                            //     this.close();
                            // }
                        })
                    }
                }
                else {
                    GlobalFun.showToast(value.msg);
                }
            },
        })
    },
    onLoginActivity: function () {
        this.requestLoginActivity();
    },
    onShareActivity: function () {
        // GlobalFun.showToast("微信分享");
        var url = "https://www.jjhgame.com/softdown";
        var title = "《集结号拼三张》:集结号送福利啦，还不快来下载领取！";
        var des = "";
        var shareType = MissionWeiXin.SHARE_MOMENTS;
        MissionWeiXin.shareUrlWeixin(url, title, des, shareType);
    },

    onWxShareSuccess: function () {
        this.scheduleOnce(()=> {
            this.requestWxShare();
        },0.3);
    },

    onWxShareFail: function (params) {
        var error = params.detail || params;
        this.scheduleOnce(()=> {
            GlobalFun.showToast(error || "");
        },0.3);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
