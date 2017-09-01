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
        _selectIndex: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.refreshUI();
    },
    refreshUI: function () {
        if (GlobalUserData.isGuest) {
            this.m_Label_bankPwd.node.active = true;
            //游客隐藏银行密码和魅力抽奖页签
            this.radioButton[2].node.active = false;
            this.radioButton[3].node.active = false;
        }
        else {
            this.m_Label_bankPwd.node.active = false;
            //游客隐藏银行密码和魅力抽奖页签
            this.radioButton[2].node.active = true;
            this.radioButton[3].node.active = true;
        }
        this.m_Label_get_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_save_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_get_bankGold.string = GlobalUserData.llInsureScore;
        this.m_Label_save_bankGold.string = GlobalUserData.llInsureScore;
    },
    onEnable: function () {
        console.log("[BankView][onEnable]");

    },
    onDisable: function () {
        console.log("[BankView][onDisable]");
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
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
        var url = GlobalDef.httpBaseUrl;
        // url += "/hz/hzUpdateFaceId.ashx";
        var params = {};
        if (this._selectIndex == 0) {
            var szGoldCount = this.m_Editbox_get_gold.string;
            var szPassWord = this.m_Editbox_get_bankPwd.string;
            var re = /./;
            if (szGoldCount.length <= 0 || szPassWord.length <= 0) {
                console.log("[BankView][onClickConfirm] 金额或密码不能为空！");
                GlobalFun.showToast("金额或密码不能为空!");
                return;
            }
            if (isNaN(Number(szGoldCount)) || Number(szGoldCount) <= 0 || Number(szGoldCount) > (GlobalUserData.llInsureScore)) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出银行的金额限制！");
                GlobalFun.showToast("数值不合法或超出银行的金额限制!");
                return;
            }

            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["insurepass"] = cc.md5Encode(szPassWord);
            params["type"] = "2";

            url += "/hz/hzUserBankMobile.ashx";
        }
        else if (this._selectIndex == 1) {
            var szGoldCount = this.m_Editbox_save_gold.string;
            if (szGoldCount.length <= 0) {
                console.log("[BankView][onClickConfirm] 金额不能为空！");
                GlobalFun.showToast("金额不能为空！");
                return;
            }
            if (isNaN(Number(szGoldCount)) || Number(szGoldCount) <= 0 || Number(szGoldCount) > Number(GlobalUserData.llGameScore)) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出身上金额！");
                GlobalFun.showToast("数值不合法或超出身上金额！");
                return;
            }
            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["type"] = "1";

            url += "/hz/hzUserBankMobile.ashx";
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

            url += "/hz/hzUpdatePassWord.ashx";
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
                        GlobalUserData.llGameScore = value.score;
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = value.insurescore;
                    }
                    cc.director.emit("onBankSuccess");
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
        var szcharmCount = this.m_Editbox_charm_num.string;
        var szPassWord = this.m_Editbox_charm_pwd.string;
        if (szcharmCount.length <= 0 || szPassWord.length <= 0) {
            GlobalFun.showToast("魅力或密码不能为空!");
            return;
        }
        if (isNaN(Number(szcharmCount)) || Number(szcharmCount) <= 0 /*|| Number(szcharmCount) > (GlobalUserData.llInsureScore)*/) {
            GlobalFun.showToast("数值不合法或超出限制!");
            return;
        }
        var tipText = "<color=#971a01>确定消耗" + szcharmCount + "点魅力值,进行招财进宝？</c>";
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
                        GlobalFun.showToast("抽奖" + szcharmCount);
                    }
                }
            ],
        })
    },
    selectCharmNum: function(event,num) {
        this.m_Editbox_charm_num.string = num;
    },
    onClickSaveAll: function (params) {
        this.m_Editbox_save_gold.string = GlobalUserData.llGameScore;
    },
    onClickGetAll: function (params) {
        this.m_Editbox_get_gold.string = GlobalUserData.llInsureScore;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
