var ViewBase = require("ViewBase");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
require("MD5");

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
        m_Label_bankPwd: cc.Label,
        radioButton: {
            default: [],
            type: cc.Toggle
        },
        panelGroup: {
            default: [],
            type: cc.Node,
        },
        m_Label_get_userGold: cc.Label,
        m_Label_get_bankGold: cc.Label,
        m_Label_save_userGold: cc.Label,
        m_Label_save_bankGold: cc.Label,
        m_Editbox_get_gold: cc.EditBox,
        m_Editbox_get_bankPwd: cc.EditBox,
        m_Editbox_save_gold: cc.EditBox,
        m_Editbox_originPassword: cc.EditBox,
        m_Editbox_confirmPassword: cc.EditBox,
        m_Editbox_newPassword: cc.EditBox,

        m_Editbox_charm_num: cc.EditBox,
        m_Editbox_charm_pwd: cc.EditBox,
        m_Label_lottery_gold: cc.Label,
        m_Label_lottery_charm: cc.Label,
        m_Label_lottery_num: cc.RichText,
        _selectIndex: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.refreshUI();
        //默认选中选择第一个
        this.radioButtonClicked(this.radioButton[this._selectIndex]);
    },
    refreshUI: function () {
        //账号登陆用户隐藏初始密码 & 魅力抽奖界面不显示密码
        if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_ACCOUNT || this._selectIndex == 3) {
            this.m_Label_bankPwd.node.active = false;
        }
        else {
            this.m_Label_bankPwd.node.active = true;
        }

        //游客隐藏银行密码和魅力抽奖页签
        if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_GUEST) {
            this.radioButton[2].node.active = false;
            this.radioButton[3].node.active = false;
        }
        else {
            this.radioButton[2].node.active = true;
            this.radioButton[3].node.active = true;
        }
        var szGoldCount = GlobalUserData.llGameScore;
        var szCharmCount = GlobalUserData.dwLoveLiness;
        var szInsureCount = GlobalUserData.llInsureScore;
        var wExchangenum = GlobalUserData.wExchangenum || 0;
        var szLottryNum = "<color=#4e0c01>当日抽奖剩余次数</c><color=#ff0000> " + wExchangenum + "</color>"
        this.m_Label_get_userGold.string = szGoldCount;
        this.m_Label_save_userGold.string = szGoldCount;
        this.m_Label_get_bankGold.string = szInsureCount;
        this.m_Label_save_bankGold.string = szInsureCount;

        this.m_Label_lottery_gold.string = szInsureCount;
        this.m_Label_lottery_charm.string = szCharmCount;
        this.m_Label_lottery_num.string = szLottryNum;

        //魅力抽奖
        this.m_Editbox_charm_num.string = "";
        this.m_Editbox_charm_pwd.string = "";
        //修改密码
        this.m_Editbox_originPassword.string = "";
        this.m_Editbox_newPassword.string = "";
        this.m_Editbox_confirmPassword.string = "";
        //取款
        this.m_Editbox_get_gold.string = "";
        this.m_Editbox_get_bankPwd.string = "";
        //存款
        this.m_Editbox_save_gold.string = "";

    },
    onEnable: function () {
        console.log("[BankView][onEnable]");

    },
    onDisable: function () {
        console.log("[BankView][onDisable]");
    },
    onDestroy: function () {
        this._super();
        console.log("[BankView][onDestroy]");
    },
    onClickCloseButton: function () {
        this.node.destroy();
        console.log("[BankView][onClickCloseButton] destroy");
    },
    radioButtonClicked: function (toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        // toggle.node.setLocalZOrder(1);
        var title = "RadioButton";
        //账号登陆用户隐藏初始密码
        this.m_Label_bankPwd.node.active = !(GlobalUserData.cbUserType === GlobalDef.USER_TYPE_ACCOUNT || this._selectIndex == 3);
        switch (index) {
            case 0:
                title += "1";
                break;
            case 1:
                title += "2";
                break;
            case 2:
                title += "3";
                break;
            case 3:
                title += "4";
                //抽奖界面隐藏初始密码
                // this.m_Label_bankPwd.node.active = false;
                break;

            default:
                break;
        }
        for (var i = 0; i < this.radioButton.length; i++) {
            var element = this.radioButton[i];
            var panel = this.panelGroup[i];
            if (cc.isValid(element) && cc.isValid(panel)) {
                if (i == index) {
                    // element.node.setLocalZOrder(1);
                    panel.active = true;
                }
                else {
                    // element.node.setLocalZOrder(0);
                    panel.active = false;
                }
            }
        }
        console.log(title);
        // this._updateToggleEventString(title, this.radioButtonEventString, toggle);
    },
    onClickConfirm: function (params) {
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        var params = {};
        var re = /\./;
        if (this._selectIndex == 0) {
            var szGoldCount = this.m_Editbox_get_gold.string;
            var szPassWord = this.m_Editbox_get_bankPwd.string;
            // var re = /\./;
            if (szGoldCount.length <= 0 || szPassWord.length <= 0) {
                console.log("[BankView][onClickConfirm] 金额或密码不能为空！");
                GlobalFun.showToast("金额或密码不能为空!");
                return;
            }
            if (re.exec(szGoldCount) != null || isNaN(Number(szGoldCount)) || Number(szGoldCount) <= 0 || Number(szGoldCount) > (GlobalUserData.llInsureScore)) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出银行的金额限制！");
                GlobalFun.showToast("数值不合法或超出银行的金额限制!");
                return;
            }

            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["insurepass"] = cc.md5Encode(szPassWord);
            params["type"] = "2";

            // url += "/hz/hzUserBankMobile.ashx";
            url += "/hz/hzUserBankMobile3_0.ashx";

        }
        else if (this._selectIndex == 1) {
            var szGoldCount = this.m_Editbox_save_gold.string;
            if (szGoldCount.length <= 0) {
                console.log("[BankView][onClickConfirm] 金额不能为空！");
                GlobalFun.showToast("金额不能为空！");
                return;
            }
            if (re.exec(szGoldCount) != null || isNaN(Number(szGoldCount)) || Number(szGoldCount) <= 0 || Number(szGoldCount) > Number(GlobalUserData.llGameScore)) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出身上金额！");
                GlobalFun.showToast("数值不合法或超出身上金额！");
                return;
            }
            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["type"] = "1";

            // url += "/hz/hzUserBankMobile.ashx";
            url += "/hz/hzUserBankMobile3_0.ashx";
        }
        else if (this._selectIndex == 2) {
            var szPassWord = this.m_Editbox_originPassword.string;
            var szNewPassWord = this.m_Editbox_newPassword.string;
            var szConfirmPassWord = this.m_Editbox_confirmPassword.string;
            if (szPassWord.length <= 0 || szNewPassWord.length <= 0 || szConfirmPassWord.length <= 0) {
                console.log("[BankView][onClickConfirm] 密码不能为空！");
                GlobalFun.showToast("密码不能为空！");
                return;
            }
            if (szPassWord == szNewPassWord) {
                console.log("[BankView][onClickConfirm] 新旧密码不能相同!");
                GlobalFun.showToast("新旧密码不能相同!");
                return;
            }
            if (szConfirmPassWord != szNewPassWord) {
                console.log("[BankView][onClickConfirm] 确认密码不一致!");
                GlobalFun.showToast("确认密码不一致!");
                return;
            }
            if (szNewPassWord.length < 6 || szNewPassWord.length > 16) {
                console.log("[BankView][onClickConfirm] 密码长度为6-16位!");
                GlobalFun.showToast("密码长度为6-16位!");
                return;
            }

            params["userid"] = GlobalUserData.dwUserID;
            params["type"] = "2";
            params["oldpass"] = cc.md5Encode(szPassWord);
            params["newpass"] = cc.md5Encode(szNewPassWord);

            // url += "/hz/hzUpdatePassWord.ashx";
            url += "/hz/hzUpdatePassWord3_0.ashx";
        }
        else {
            return;
        }
        var self = this;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("[BankView][onClickConfirm] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = Number(value.score);
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = Number(value.insurescore);
                    }
                    cc.director.emit("onPlazaRefreshUI");
                    self.refreshUI();
                }
                GlobalFun.showToast(value.msg);
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[BankView][onClickConfirm] " + paramString);
    },
    onClickReward: function () {
        // GlobalFun.showLotteryView({num:10000});
        // return;
        var szcharmCount = this.m_Editbox_charm_num.string;
        var szPassWord = this.m_Editbox_charm_pwd.string;
        var re = /\./;
        if (re.exec(szcharmCount) != null || isNaN(Number(szcharmCount)) || Number(szcharmCount) <= 0 || Number(szcharmCount) > (100)) {
            GlobalFun.showToast("您输入的魅力值不符合规定!");
            return;
        }
        if (szPassWord.length <= 0) {
            GlobalFun.showToast("密码不能为空!");
            return;
        }
        if (Number(szcharmCount) > GlobalUserData.dwLoveLiness) {
            GlobalFun.showToast("您的魅力值不足!");
            return;
        }
        var tipText = "<color=#971a01>确定消耗" + szcharmCount + "点魅力值,进行魅力抽奖？</c>";
        GlobalFun.showAlert({
            message: tipText,
            // textAlignment: cc.TextAlignment.LEFT,
            btn: [
                {
                    name: "取消",
                },
                {
                    name: "确定",
                    callback: () => {
                        // GlobalFun.showToast("抽奖" + szcharmCount);
                        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
                        url += "/hz/hzCharmExChange.ashx";
                        var params = {};
                        params["userid"] = GlobalUserData.dwUserID;
                        params["kindid"] = zjh_cmd.KIND_ID;
                        params["loveline"] = szcharmCount;
                        params["pwd"] = cc.md5Encode(szPassWord);
                        var paramString = GlobalFun.buildRequestParam(params);
                        var self = this;
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                                var response = xhr.responseText;
                                console.log(response);
                                var value = JSON.parse(response);
                                if (value.status == 1) {
                                    if (value.score !== undefined) {
                                        GlobalUserData.llGameScore = Number(value.score);
                                    }
                                    if (value.insurescore !== undefined) {
                                        GlobalUserData.llInsureScore = Number(value.insurescore);
                                    }
                                    if (value.exchangenum !== undefined) {
                                        GlobalUserData.wExchangenum = Number(value.exchangenum);
                                    }
                                    if (value.loveline !== undefined) {
                                        GlobalUserData.dwLoveLiness = Number(value.loveline);
                                    }
                                    if (value.exchange !== undefined) {
                                        GlobalFun.showLotteryView({
                                            num: Number(value.exchange),
                                        })
                                    }
                                    cc.director.emit("onPlazaRefreshUI");
                                    self.refreshUI();
                                }
                                else {
                                    GlobalFun.showToast(value.msg);
                                }

                            }
                        };
                        xhr.open("POST", url, true);
                        xhr.send(paramString);
                        console.log("[BankView][onClickReward] " + paramString);
                    }
                }
            ],
        })
    },
    selectCharmNum: function (event, num) {
        this.m_Editbox_charm_num.string = num;
    },
    onClickSaveAll: function (params) {
        if (Number(GlobalUserData.llGameScore) > 2000.0) {
            this.m_Editbox_save_gold.string = GlobalUserData.llGameScore - 2000.0;
        }
        else {
            GlobalFun.showToast("随身金币至少保留2000");
        }  
    },
    onClickGetAll: function (params) {
        this.m_Editbox_get_gold.string = GlobalUserData.llInsureScore;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
