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
        m_Editbox_originPassword: {
            default: null,
            type: cc.EditBox,
        },
        m_Editbox_confirmPassword: {
            default: null,
            type: cc.EditBox,
        },
        m_Editbox_newPassword: {
            default: null,
            type: cc.EditBox,
        },
        _selectIndex:0,
    },

    // use this for initialization
    onLoad: function () {
        this.refreshUI();
    },
    refreshUI: function () {
        this.m_Label_get_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_save_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_get_bankGold.string = GlobalUserData.llInsureScore;
        this.m_Label_save_bankGold.string = GlobalUserData.llInsureScore;
    },
    onEnable: function() {
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[BankView][onEnable]");

    },
    onDisable: function() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[BankView][onDisable]");
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[BankView][onDestroy]");
    },
    onClickCloseButton: function() {
        this.node.destroy();
        console.log("[BankView][onClickCloseButton] destroy");
    },
    radioButtonClicked: function(toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        // toggle.node.setLocalZOrder(1);
        var title = "RadioButton";
        switch(index) {
          case 0:
              title += "1";
              break;
          case 1:
              title += "2";
              break;
          case 2:
              title += "3";
              break;
          default:
              break;
        }
        for (var i = 0; i < this.radioButton.length; i++) {
            var element = this.radioButton[i];
            var panel = this.panelGroup[i];
            if(cc.isValid(element) && cc.isValid(panel)) {
                if (i == index) {
                    // element.node.setLocalZOrder(1);
                    panel.active = true;
                }
                else{
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
        if(this._selectIndex == 0) {
            var szGoldCount = this.m_Editbox_get_gold.string;
            var szPassWord = this.m_Editbox_get_bankPwd.string;
            var re = /./;
            if(szGoldCount.length <= 0 || szPassWord.length <= 0){
                console.log("[BankView][onClickConfirm] 金额或密码不能为空！");
                GlobalFun.showAlert("金额或密码不能为空!");
                return;
            }
            if(Number(szGoldCount) <= 0 || Number(szGoldCount) > (GlobalUserData.llInsureScore)){
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出银行的金额限制！");
                GlobalFun.showAlert("数值不合法或超出银行的金额限制!");
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
                GlobalFun.showAlert("金额不能为空！");
                return;
            }
            if(Number(szGoldCount) <= 0 || Number(szGoldCount) > Number(GlobalUserData.llGameScore)){
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出身上金额！");
                GlobalFun.showAlert("数值不合法或超出身上金额！");
                return;
            }
            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["type"] = "1";

            url += "/hz/hzUserBankMobile.ashx";
        }
        else if(this._selectIndex == 2) {
            var szPassWord = this.m_Editbox_originPassword.string;
            var szNewPassWord = this.m_Editbox_newPassword.string;
            var szConfirmPassWord = this.m_Editbox_confirmPassword.string;
            if (szPassWord.length <= 0 || szNewPassWord.length <= 0 || szConfirmPassWord.length <= 0) {
                console.log("[BankView][onClickConfirm] 密码不能为空！");
                GlobalFun.showAlert("密码不能为空！");
                return;
            }
            if(szPassWord == szNewPassWord) {
                console.log("[BankView][onClickConfirm] 新旧密码不能相同!");
                GlobalFun.showAlert("新旧密码不能相同!");
                return;
            }
            if(szConfirmPassWord != szNewPassWord) {
                console.log("[BankView][onClickConfirm] 确认密码不一致!");
                GlobalFun.showAlert("确认密码不一致!");
                return;
            }
            if(szNewPassWord.length < 6 || szNewPassWord.length > 16) {
                console.log("[BankView][onClickConfirm] 密码长度为6-16位!");
                GlobalFun.showAlert("密码长度为6-16位!");
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
            console.log("[BankView][onClickConfirm] "+xhr.getResponseHeader("Content-Type"));
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
                GlobalFun.showAlert(value.msg);
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[BankView][onClickConfirm] " + paramString);
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
