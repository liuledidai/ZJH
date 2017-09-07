require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AlertView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96256eD5t9ERKAMm0bGe6YP', 'AlertView');
// Script/external/AlertView.js

"use strict";

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
        m_Label_content: {
            default: null,
            type: cc.RichText
        },
        m_Layout_btnSet: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //初始隐藏所有按钮
        console.log("[AlertView][onLoad]");
        var btnArray = this.m_Layout_btnSet.children;
        for (var i = 0; i < btnArray.length; i++) {
            btnArray[i].active = false;
        }
    },
    onDestroy: function onDestroy() {
        // cc.sys.garbageCollect();
        console.log("[AlertView][onDestroy]");
    },
    close: function close(callback) {
        if (typeof callback === "function") {
            callback();
        }
        this.node.destroy();
    },
    init: function init(params) {
        var _this = this;

        var szText = params.message || "";
        console.log("[AlertView]", this.m_Label_content.horizontalAlign);
        var textAlignment;
        if (params.textAlignment !== undefined) {
            textAlignment = params.textAlignment;
        } else {
            textAlignment = cc.TextAlignment.CENTER;
        }
        this.m_Label_content.horizontalAlign = textAlignment;
        console.log("[AlertView]", this.m_Label_content.horizontalAlign);
        this.m_Label_content.string = szText;
        var btnNumber = 0;
        if (params.btn && params.btn.length > 0) {
            btnNumber = params.btn.length;
        } else {
            params.btn = [{ name: "确定" }];
            btnNumber = 1;
        }

        var _loop = function _loop() {
            console.log("[AlertView] btn ", i, params.btn[i].name);
            var btn = _this.m_Layout_btnSet.children[i];
            var btn_callback = params.btn[i].callback;
            if (!cc.isValid(btn)) return "break";
            btn.active = true;
            // TOUCH_START = 0,
            // TOUCH_MOVE = 0,
            // TOUCH_END = 0,
            // TOUCH_CANCEL = 0,
            var label = btn.getComponentInChildren(cc.Label);
            label.string = params.btn[i].name;
            btn.on(cc.Node.EventType.TOUCH_START, function () {
                label.node.opacity = 175;
            }, _this);
            btn.on(cc.Node.EventType.TOUCH_CANCEL, function () {
                label.node.opacity = 255;
            }, _this);
            btn.on(cc.Node.EventType.TOUCH_END, function () {
                label.node.opacity = 255;
                _this.close(btn_callback);
            }, _this);
        };

        for (var i = 0; i < btnNumber; i++) {
            var _ret = _loop();

            if (_ret === "break") break;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"AudioMng":[function(require,module,exports){
"use strict";
cc._RFpush(module, '40facvaPhFNy6Mw7j/9j4sO', 'AudioMng');
// Script/AudioMng.js

"use strict";

var AudioMng = {
    _soundData: undefined,
    _currentBgm: undefined,
    playMusic: function playMusic(szKey) {
        szKey = szKey || this._currentBgm;
        if (szKey === undefined || szKey === "" || this._soundData === undefined) {
            return;
        }
        var szPath = "resources/" + this._soundData["base"]["base"]["background_music"][szKey];
        console.log("[AudioMng][playMusic] " + szPath);
        this._currentBgm = szKey;
        cc.audioEngine.playMusic(cc.url.raw(szPath), true);
    },
    pauseMusic: function pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function resumeMusic() {
        cc.audioEngine.resumeMusic();
    },
    stopMusic: function stopMusic() {
        this._currentBgm = "";
        cc.audioEngine.stopMusic();
    },
    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    },
    playSFX: function playSFX(szKey) {
        if (szKey === undefined || szKey === "" || this._soundData === undefined) {
            return;
        }
        var szPath = "resources/" + this._soundData["base"]["base"]["effect"][szKey];
        console.log("[AudioMng][playSFX] " + szPath);
        var clip = cc.url.raw(szPath);
        this._playSFX(clip);
    },
    playButton: function playButton() {
        this.playSFX("sfx_button_click");
    },
    setMusicVolume: function setMusicVolume(volume) {
        cc.audioEngine.setMusicVolume(volume);
    },
    setEffectsVolume: function setEffectsVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },
    loadSoundData: function loadSoundData() {
        cc.loader.loadRes("json/sound", function (err, content) {
            console.log(content);
            AudioMng._soundData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.shopData, null, ' '));
        });
    }

};

module.exports = AudioMng;

cc._RFpop();
},{}],"BankView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '410a7nO15hDoIjILc0HWRRU', 'BankView');
// Script/plaza/views/plaza/BankView.js

"use strict";

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
            type: cc.Node
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
        _selectIndex: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refreshUI();
        //默认选中选择第一个
        this.radioButtonClicked(this.radioButton[this._selectIndex]);
    },
    refreshUI: function refreshUI() {
        // if (GlobalUserData.isGuest) {
        //     this.m_Label_bankPwd.node.active = true;
        //     //游客隐藏银行密码和魅力抽奖页签
        //     this.radioButton[2].node.active = false;
        //     this.radioButton[3].node.active = false;
        // }
        // else {
        //     this.m_Label_bankPwd.node.active = false;
        //     //游客隐藏银行密码和魅力抽奖页签
        //     this.radioButton[2].node.active = true;
        //     this.radioButton[3].node.active = true;
        // }
        var szGoldCount = GlobalUserData.llGameScore;
        var szCharmCount = GlobalUserData.dwLoveLiness;
        var szInsureCount = GlobalUserData.llInsureScore;
        var wExchangenum = GlobalUserData.wExchangenum || 0;
        var szLottryNum = "<color=#4e0c01>当日抽奖剩余次数</c><color=#ff0000> " + wExchangenum + "</color>";
        this.m_Label_get_userGold.string = szGoldCount;
        this.m_Label_save_userGold.string = szGoldCount;
        this.m_Label_get_bankGold.string = szInsureCount;
        this.m_Label_save_bankGold.string = szInsureCount;

        this.m_Label_lottery_gold.string = szGoldCount;
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
    onEnable: function onEnable() {
        console.log("[BankView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[BankView][onDisable]");
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[BankView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        this.node.destroy();
        console.log("[BankView][onClickCloseButton] destroy");
    },
    radioButtonClicked: function radioButtonClicked(toggle) {
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
                } else {
                    // element.node.setLocalZOrder(0);
                    panel.active = false;
                }
            }
        }
        console.log(title);
        // this._updateToggleEventString(title, this.radioButtonEventString, toggle);
    },
    onClickConfirm: function onClickConfirm(params) {
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
            if (isNaN(Number(szGoldCount)) || Number(szGoldCount) <= 0 || Number(szGoldCount) > GlobalUserData.llInsureScore) {
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
        } else if (this._selectIndex == 1) {
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

            // url += "/hz/hzUserBankMobile.ashx";
            url += "/hz/hzUserBankMobile3_0.ashx";
        } else if (this._selectIndex == 2) {
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
        } else {
            return;
        }
        var self = this;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("[BankView][onClickConfirm] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
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
    onClickReward: function onClickReward() {
        var szcharmCount = this.m_Editbox_charm_num.string;
        var szPassWord = this.m_Editbox_charm_pwd.string;

        if (isNaN(Number(szcharmCount)) || Number(szcharmCount) <= 0 || Number(szcharmCount) > 100) {
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
        var tipText = "<color=#971a01>确定消耗" + szcharmCount + "点魅力值,进行招财进宝？</c>";
        GlobalFun.showAlert({
            message: tipText,
            // textAlignment: cc.TextAlignment.LEFT,
            btn: [{
                name: "取消"
            }, {
                name: "确定",
                callback: function callback() {
                    GlobalFun.showToast("抽奖" + szcharmCount);
                }
            }]
        });
    },
    selectCharmNum: function selectCharmNum(event, num) {
        this.m_Editbox_charm_num.string = num;
    },
    onClickSaveAll: function onClickSaveAll(params) {
        this.m_Editbox_save_gold.string = GlobalUserData.llGameScore;
    },
    onClickGetAll: function onClickGetAll(params) {
        this.m_Editbox_get_gold.string = GlobalUserData.llInsureScore;
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"BaseFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f9300AoJB1ASp1uITlO+9z1', 'BaseFrame');
// Script/plaza/models/BaseFrame.js

"use strict";

var GlobalDef = require("GlobalDef");
var BaseFrame = cc.Class({
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
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this._viewFrame = view;
        console.log("BaseFrame onLoad");
        this._threadid = undefined;
        this._socket = undefined;
        // this._callBack = callback;

        this._gameFrame = undefined;
        this.m_tabCacheMsg = {};
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {},
    // name: "BaseFrame",
    // ctor: function(){
    //     // this._viewFrame = view;
    //     this._threadid = undefined;
    //     this._socket = undefined;
    //     // this._callBack = callback;

    //     this._gameFrame = undefined;
    //     this.m_tabCacheMsg = {};

    // },
    setCallBack: function setCallBack(callback) {
        this._callBack = callback;
    },
    setViewFrame: function setViewFrame(viewFrame) {
        this._viewFrame = viewFrame;
    },
    setSocketEvent: function setSocketEvent(socketEvent) {
        this._socketEvent = socketEvent;
    },
    getViewFrame: function getViewFrame() {
        return this._viewFrame;
    },
    isSocketServer: function isSocketServer() {
        return this._socket !== undefined && this._threadid !== undefined;
    },
    onSocketError: function onSocketError(pData) {
        if (this._threadid === undefined) {
            console.log("[BaseFrame][onSocketError] _threadid undefined");
            return;
        }
        console.log("[BaseFrame][onSocketError] 服务器连接异常，请稍后重试");
        this.onCloseSocket();
        cc.director.emit("LoadingViewError", { msg: "服务器连接异常，请稍后重试", type: GlobalDef.SMT_CLOSE_GAME });
        //todo...
    },
    onCreateSocket: function onCreateSocket(szUrl, nPort) {
        if (this._socket !== undefined) {
            return false;
        }
        this._szServerUrl = szUrl;
        this._nServerPort = nPort;
        var self = this;
        this._SocketFun = function (pData) {
            self.onSocketCallBack(pData);
        };
        this._socket = ClientSocket.createSocket(this._SocketFun);
        console.log(this.name);
        if (this._socket.ConnectSocket(this._szServerUrl, this._nServerPort) === true) {
            this._threadid = 0;
            return true;
        } else {
            console.log("onCreateSocket close");
            this.onCloseSocket();
            return false;
        }
    },
    onSocketCallBack: function onSocketCallBack(pData) {
        if (pData === undefined) {
            return;
        }
        // if(this._callBack === undefined)
        // {
        //     console.log('no callback');
        //     this.onCloseSocket();
        //     return;
        // }
        var main = pData.getmain();
        var sub = pData.getsub();
        console.log("onSocketCallBack main: " + main + " #sub: " + sub);
        if (main === 0) {
            if (sub === 0) {
                this._threadid = 1;
                this.onConnectCompeleted();
            } else {
                this.onSocketError(pData);
                this.onCloseSocket();
            }
        } else {
            this.onSocketEvent(main, sub, pData);
        }
    },
    onCloseSocket: function onCloseSocket() {
        if (this._socket !== undefined) {
            this._socket.releaseSocket();
            this._socket = undefined;
        }
        if (this._threadid !== undefined) {
            this._threadid = undefined;
        }
        this._SocketFun = undefined;
    },
    sendSocketData: function sendSocketData(pData) {
        if (this._socket === undefined) {
            return false;
        }
        console.log("[BaseFrame][sendSocketData] main = " + pData.getmain() + " sub = " + pData.getsub() + " dataLen = " + pData.getDataSize());
        this._socket.sendSocketData(pData);
    },
    onConnectCompeleted: function onConnectCompeleted() {
        console.log("BaseFrame_onConnectCompeleted");
    },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        console.log("BaseFrame_onSocketEvent_" + main + "-" + sub);
    },
    onGameSocketEvent: function onGameSocketEvent(main, sub, pData) {
        console.log("BaseFrame_onGameSocketEvent_" + main + "-" + sub);
    }

});

module.exports = BaseFrame;

cc._RFpop();
},{"GlobalDef":"GlobalDef"}],"Bridge_android":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0226bpzjnlCBoxeOTFg0Oh3', 'Bridge_android');
// Script/Bridge_android.js

"use strict";

var Bridge_android = {};
var BRIDGE_CLASS = "org/cocos2dx/javascript/AppActivity";
var DEVICE_MODULE = "org/cocos2dx/javascript/DeviceModule";
//获取设备id
Bridge_android.getMachineID = function () {
    var sigs = "()Ljava/lang/String;";
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getMachineID", sigs);
    return ret;
};

//获取设备ip
Bridge_android.getIpAddress = function () {
    var sigs = "()Ljava/lang/String;";
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getUserIP", sigs);
    return ret;
};

//获取游戏version
Bridge_android.getAppVersion = function () {
    var sigs = "()Ljava/lang/String;";
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getAppVersion", sigs);
    return ret;
};

//获取设备电量信息
Bridge_android.getBatteryLevel = function () {
    var sigs = "()F";
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getBatteryLevel", sigs);
    return ret;
};

//获取设备网络类型
Bridge_android.getNetconnType = function () {
    var sigs = "()Ljava/lang/String;";
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getNetconnType", sigs);
    return ret;
};

Bridge_android.showAlert = function (title, message) {
    var sigs = "(Ljava/lang/String;Ljava/lang/String;)V";
    var ret = jsb.reflection.callStaticMethod(BRIDGE_CLASS, "showAlert", sigs, title, message);
    return ret;
};
module.exports = Bridge_android;

cc._RFpop();
},{}],"Bridge_ios":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1aa3e2KSxtNpahV6QgpbFnF', 'Bridge_ios');
// Script/Bridge_ios.js

"use strict";

var Bridge_ios = {};
var BRIDGE_CLASS = "AppController";
var DEVICE_MODULE = "DeviceModule";

//获取设备id
Bridge_ios.getMachineID = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getUserToken");
    return ret;
};

//获取设备ip
Bridge_ios.getIpAddress = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getUserIP");
    return ret;
};

//获取游戏version
Bridge_ios.getAppVersion = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getAppVersion");
    return ret;
};

//获取设备电量信息
Bridge_ios.getBatteryLevel = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getBatteryLevel");
    return ret;
};

//获取设备网络类型
Bridge_ios.getNetconnType = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE, "getNetconnType");
    return ret;
};

Bridge_ios.showAlert = function (title, message) {
    var ret = jsb.reflection.callStaticMethod(BRIDGE_CLASS, "showAlert:andContent:", title, message);
    return ret;
};

module.exports = Bridge_ios;

cc._RFpop();
},{}],"CMD_Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5dedbM6DshJ4ZT3nEswj6Sp', 'CMD_Game');
// Script/header/CMD_Game.js

"use strict";

var game_cmd = {};

//////////////////////////////////////////////////////////////////////////
//登录数据包定义

game_cmd.MDM_GR_LOGON = 11; //房间登录

game_cmd.SUB_GR_LOGON_ACCOUNTS = 11; //帐户登录
game_cmd.SUB_GR_LOGON_USERID = 22; //I D 登录
game_cmd.SUB_GR_LOGON_MOBILE = 33; //手机登陆

game_cmd.SUB_GR_LOGON_SUCCESS = 600; //登录成功
game_cmd.SUB_GR_LOGON_ERROR = 601; //登录失败
game_cmd.SUB_GR_LOGON_FINISH = 602; //登录完成

// //房间帐号登录
// struct CMD_GR_LogonByAccounts
// {
//     TCHAR                           szAccounts[NAME_LEN];               //登录帐号
//     DWORD                           dwProcessVersion;                   //进程版本
//     TCHAR                           szPassWord[PASS_LEN];               //登录密码
//     DWORD                           dwPlazaVersion;                     //广场版本
// };

// //手机登陆
// struct CMD_GR_LogonByUserIDMobile
// {
//     WORD                            wEncryptID;                         //随机码1
//     WORD                            wCodeCheckID;                       //随机码2
//     DWORD                           dwWeiXinCheckID;                    //微信验证码
//     DWORD                           dwUserID;                           //用户 I D
//     DWORD                           dwMobileSysType;                    //手机操作系统类型(1苹果系统 2安卓系统)
//     DWORD                           dwMobileAppVersion;                 //游戏APP版本号(与登陆大厅相同)
//     TCHAR                           szPassWord[PASS_LEN];               //登录密码
//     TCHAR                           szMobileMachine[COMPUTER_ID_LEN];   //机器序列号
// };

// //房间 ID 登录
// struct CMD_GR_LogonByUserID
// {
//     TCHAR                           szPassWord[PASS_LEN];               //登录密码
//     DWORD                           dwUserID;                           //用户 I D
//     DWORD                           dwProcessVersion;                   //进程版本
//     DWORD                           dwPlazaVersion;                     //广场版本
// };

// //登录成功消息
// struct CMD_GR_LogonSuccess
// {
//     DWORD                           dwUserID;                           //用户 I D
// };

// //登录失败
// struct CMD_GR_LogonError
// {
//     LONG                            lErrorCode;                         //错误代码
//     TCHAR                           szErrorDescribe[128];               //错误消息
// };

//////////////////////////////////////////////////////////////////////////
//用户数据包定义

game_cmd.MDM_GR_USER = 22; //用户信息

game_cmd.SUB_GR_USER_SIT_REQ = 11; //坐下请求
game_cmd.SUB_GR_USER_LOOKON_REQ = 22; //旁观请求
game_cmd.SUB_GR_USER_STANDUP_REQ = 33; //起立请求
game_cmd.SUB_GR_USER_LEFT_GAME_REQ = 44; //离开游戏

game_cmd.SUB_GR_USER_COME = 600; //用户进入
game_cmd.SUB_GR_USER_STATUS = 601; //用户状态
game_cmd.SUB_GR_USER_SCORE = 602; //用户分数
game_cmd.SUB_GR_SIT_FAILED = 603; //坐下失败
game_cmd.SUB_GR_USER_RIGHT = 604; //用户权限
game_cmd.SUB_GR_MEMBER_ORDER = 605; //会员等级
game_cmd.SUB_GR_QUERY_GOLD = 606; //查询金豆
game_cmd.SUB_GR_QUERY_TRAN = 607; //查询转帐

game_cmd.SUB_GR_USER_CHAT = 700; //聊天消息
game_cmd.SUB_GR_USER_WISPER = 701; //私语消息
game_cmd.SUB_GR_USER_RULE = 702; //用户规则

game_cmd.SUB_GR_USER_INVITE = 800; //邀请消息
game_cmd.SUB_GR_USER_INVITE_REQ = 801; //邀请请求
game_cmd.SUB_GR_PRESEND_QUERY = 802; //赠送查询
game_cmd.SUB_GR_PRESENT_ERROR = 803;

// //会员等级
// struct CMD_GR_MemberOrder
// {
//     DWORD                           dwUserID;                           //数据库 ID
//     BYTE                            cbMemberOrder;                      //会员等级
// };

// //用户权限
// struct CMD_GR_UserRight
// {
//     DWORD                           dwUserID;                           //数据库 ID
//     DWORD                           dwUserRight;                        //用户权限
// };

// //用户状态
// struct CMD_GR_UserStatus
// {
//     WORD                            wTableID;                           //桌子位置
//     DWORD                           dwUserID;                           //数据库 ID
//     BYTE                            cbUserStatus;                       //用户状态
//     WORD                            wChairID;                           //椅子位置
// };

// //用户分数
// struct CMD_GR_UserScore
// {
//     LONG                            lLoveliness;                        //用户魅力
//     //LONG                          lInsureScore;                       //消费金豆
//     //LONG                          lGameGold;                          //游戏金豆
//     DWORD                           dwUserID;                           //用户 I D
//     tagUserScore                    UserScore;                          //积分信息
// };

// //struct oneTranRecord
// //{
// //  //DWORD                             dwUserID;
// //  TCHAR                               szAccounts[NAME_LEN];
// //  //DWORD                             dwToUserID;
// //  TCHAR                               szToAccounts[NAME_LEN];
// //  LONGLONG                            trangold;
// //  TCHAR                               tranData[15];
// //
// //};

// //查询结果 wsl 2015.4.1
// struct oneTranRecord
// {
//     //DWORD                             dwTranGameID;                 //转帐游戏ID
//     //TCHAR                             dwTranGameID[31];                //转帐游戏ID
//     //TCHAR                             szTranType[NAME_LEN];           //转帐类型
//     //LONGLONG                          lPresentValue;                  //赠送金豆
//     //TCHAR                             szTranTime[20];                 //转帐时间

//     TCHAR                               szNickName[NAME_LEN];       //用户昵称
//     DWORD                               dwGameID;                   //用户ID
//     DWORD                               dwCount;                    //数量
//     TCHAR                               szFlowerName[32];           //礼物名称
//     TCHAR                               szTranType[NAME_LEN];       //转帐类型
// };

// struct CMD_GP_TranGoldRecordR
// {
//     BYTE    num;//有几条表
//     oneTranRecord   onetranrecord[10];//最多十条记录一发
// };

// /////用户查询金豆结果 2011.7.15 by gaoshan
// struct CMD_GR_UserQuiBanker
// {
//     LONGLONG                            lInsureScore;                   //银行金豆
//     CMD_GP_TranGoldRecordR              TranRecord;
// };

// //请求坐下
// struct CMD_GR_UserSitReq
// {
//     BYTE                            cbPassLen;                          //密码长度
//     //DWORD                         dwAnswerID;                         //回答 I D//兼容积分游戏入座问题
//     WORD                            wChairID;                           //椅子位置
//     WORD                            wTableID;                           //桌子位置
//     TCHAR                           szTablePass[PASS_LEN];              //桌子密码
// };

// //邀请用户
// struct CMD_GR_UserInviteReq
// {
//     WORD                            wTableID;                           //桌子号码
//     DWORD                           dwUserID;                           //用户 I D
// };

// //坐下失败
// struct CMD_GR_SitFailed
// {
//     TCHAR                           szFailedDescribe[256];              //错误描述
// };

// //聊天结构
// struct CMD_GR_UserChat
// {
//     WORD                            wChatLength;                        //信息长度
//     COLORREF                        crFontColor;                        //信息颜色
//     DWORD                           dwSendUserID;                       //发送用户
//     DWORD                           dwTargetUserID;                     //目标用户
//     TCHAR                           szChatMessage[MAX_CHAT_LEN];        //聊天信息
// };

// //私语结构
// struct CMD_GR_Wisper
// {
//     WORD                            wChatLength;                        //信息长度
//     COLORREF                        crFontColor;                        //信息颜色
//     DWORD                           dwSendUserID;                       //发送用户
//     DWORD                           dwTargetUserID;                     //目标用户
//     TCHAR                           szChatMessage[MAX_CHAT_LEN];        //聊天信息
// };

// //用户规则
// struct CMD_GR_UserRule
// {
//     bool                            bPassword;                          //设置密码
//     bool                            bLimitWin;                          //限制胜率
//     bool                            bLimitFlee;                         //限制断线
//     bool                            bLimitScore;                        //限制分数
//     bool                            bCheckSameIP;                       //效验地址
//     WORD                            wWinRate;                           //限制胜率
//     WORD                            wFleeRate;                          //限制逃跑
//     LONGLONG                        lMaxScore;                          //最高分数
//     LONGLONG                        lLessScore;                         //最低分数
//     TCHAR                           szPassword[PASS_LEN];               //桌子密码
// };

// //邀请用户
// struct CMD_GR_UserInvite
// {
//     WORD                            wTableID;                           //桌子号码
//     DWORD                           dwUserID;                           //用户 I D
// };

//////////////////////////////////////////////////////////////////////////
//配置信息数据包

game_cmd.MDM_GR_INFO = 33; //配置信息

game_cmd.SUB_GR_SERVER_INFO = 900; //房间配置
game_cmd.SUB_GR_ORDER_INFO = 901; //等级配置
game_cmd.SUB_GR_MEMBER_INFO = 902; //会员配置
game_cmd.SUB_GR_COLUMN_INFO = 903; //列表配置
game_cmd.SUB_GR_CONFIG_FINISH = 904; //配置完成

// //游戏房间信息
// struct CMD_GR_ServerInfo
// {
//     //房间属性
//     WORD                            wChairCount;                        //椅子数目
//     WORD                            wGameGenre;                         //游戏类型
//     WORD                            wTableCount;                        //桌子数目
//     WORD                            wKindID;                            //类型 I D
//     DWORD                           dwVideoAddr;                        //视频地址
//     BYTE                            cbHideUserInfo;                     //隐藏信息
// };

// //分数描述信息
// struct CMD_GR_ScoreInfo
// {
//     WORD                            wDescribeCount;                     //描述数目
//     WORD                            wDataDescribe[16];                  //数据标志
// };

// //等级描述结构
// struct tagOrderItem
// {
//     LONGLONG                        lScore;                             //等级积分
//     WORD                            wOrderDescribe[16];                 //等级描述
// };

// //等级描述信息
// struct CMD_GR_OrderInfo
// {
//     WORD                            wOrderCount;                        //等级数目
//     tagOrderItem                    OrderItem[128];                     //等级描述
// };

// //列表项描述结构
// struct tagColumnItem
// {
//     WORD                            wColumnWidth;                       //列表宽度
//     WORD                            wDataDescribe;                      //字段类型
//     TCHAR                           szColumnName[16];                   //列表名字
// };

// //列表描述信息
// struct CMD_GR_ColumnInfo
// {
//     WORD                            wColumnCount;                       //列表数目
//     tagColumnItem                   ColumnItem[32];                     //列表描述
// };

//////////////////////////////////////////////////////////////////////////
//房间状态数据包

game_cmd.MDM_GR_STATUS = 44; //状态信息

game_cmd.SUB_GR_TABLE_INFO = 600; //桌子信息
game_cmd.SUB_GR_TABLE_STATUS = 601; //桌子状态

// //桌子状态结构
// struct tagTableStatus
// {
//     BYTE                            bPlayStatus;                        //游戏状态
//     BYTE                            bTableLock;                         //锁定状态
// };

// //桌子状态数组
// struct CMD_GR_TableInfo
// {
//     WORD                            wTableCount;                        //桌子数目
//     tagTableStatus                  TableStatus[512];                   //状态数组
// };

// //桌子状态信息
// struct CMD_GR_TableStatus
// {
//     BYTE                            bTableLock;                         //锁定状态
//     BYTE                            bPlayStatus;                        //游戏状态
//     WORD                            wTableID;                           //桌子号码
// };

//////////////////////////////////////////////////////////////////////////
//管理数据包

game_cmd.MDM_GR_MANAGER = 55; //管理命令

game_cmd.SUB_GR_SEND_WARNING = 11; //发送警告
game_cmd.SUB_GR_SEND_MESSAGE = 22; //发送消息
game_cmd.SUB_GR_LOOK_USER_IP = 33; //查看地址
game_cmd.SUB_GR_KILL_USER = 44; //踢出用户
game_cmd.SUB_GR_LIMIT_ACCOUNS = 55; //禁用帐户
game_cmd.SUB_GR_SET_USER_RIGHT = 66; //权限设置
game_cmd.SUB_GR_OPTION_SERVER = 77; //房间设置

// //发送警告
// struct CMD_GR_SendWarning
// {
//     WORD                            wChatLength;                        //信息长度
//     DWORD                           dwTargetUserID;                     //目标用户
//     TCHAR                           szWarningMessage[MAX_CHAT_LEN];     //警告消息
// };

// //系统消息
// struct CMD_GR_SendMessage
// {
//     BYTE                            cbGame;                             //游戏消息
//     BYTE                            cbRoom;                             //游戏消息
//     WORD                            wChatLength;                        //信息长度
//     TCHAR                           szSystemMessage[MAX_CHAT_LEN];      //系统消息
// };

// //查看地址
// struct CMD_GR_LookUserIP
// {
//     DWORD                           dwTargetUserID;                     //目标用户
// };

// //踢出用户
// struct CMD_GR_KillUser
// {
//     DWORD                           dwTargetUserID;                     //目标用户
// };

// //禁用帐户
// struct CMD_GR_LimitAccounts
// {
//     DWORD                           dwTargetUserID;                     //目标用户
// };

// //权限设置
// struct CMD_GR_SetUserRight
// {
//     //绑定变量
//     BYTE                            cbAccountsRight;                    //帐号权限
//     BYTE                            cbGameRight;                        //帐号权限
//     //目标用户
//     DWORD                           dwTargetUserID;                     //目标用户
//     BYTE                            cbLimitRoomChat;                    //大厅聊天
//     //权限变化
//     BYTE                            cbLimitLookonGame;                  //旁观权限
//     BYTE                            cbLimitGameChat;                    //游戏聊天
//     BYTE                            cbLimitSendWisper;                  //发送消息
//     BYTE                            cbLimitPlayGame;                    //游戏权限
// };

//设置标志
game_cmd.OSF_ROOM_CHAT = 1; //大厅聊天
game_cmd.OSF_GAME_CHAT = 2; //游戏聊天
game_cmd.OSF_ROOM_WISPER = 3; //大厅私聊
game_cmd.OSF_ENTER_GAME = 4; //进入游戏
game_cmd.OSF_ENTER_ROOM = 5; //进入房间
game_cmd.OSF_SHALL_CLOSE = 6; //即将关闭

// //房间设置
// struct CMD_GR_OptionServer
// {
//     BYTE                            cbOptionFlags;                      //设置标志
//     BYTE                            cbOptionValue;                      //设置标志
// };

//////////////////////////////////////////////////////////////////////////
//系统数据包

game_cmd.MDM_GR_SYSTEM = 66; //系统信息

game_cmd.SUB_GR_MESSAGE = 200; //系统消息

//消息类型
game_cmd.SMT_INFO = 0x0001; //信息消息
game_cmd.SMT_EJECT = 0x0002; //弹出消息
game_cmd.SMT_GLOBAL = 0x0004; //全局消息
game_cmd.SMT_SCORE_NOTENOUGH = 0x0008; //金币不够
game_cmd.SMT_CLOSE_ROOM = 0x1000; //关闭房间
game_cmd.SMT_INTERMIT_LINE = 0x4000; //中断连接

// //消息数据包
// struct CMD_GR_Message
// {
//     WORD                            wMessageType;                       //消息类型
//     WORD                            wMessageLength;                     //消息长度
//     TCHAR                           szContent[1024];                    //消息内容
// };

//////////////////////////////////////////////////////////////////////////
//房间数据包

game_cmd.MDM_GR_SERVER_INFO = 77; //房间信息

game_cmd.SUB_GR_ONLINE_COUNT_INFO = 100; //在线信息

// //人数信息
// struct tagOnLineCountInfo
// {
//     WORD                            wKindID;                            //类型标识
//     DWORD                           dwOnLineCount;                      //在线人数
// };


module.exports = game_cmd;

cc._RFpop();
},{}],"CMD_Plaza":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ba91/b95dCkqTHTXYfvNjt', 'CMD_Plaza');
// Script/header/CMD_Plaza.js

"use strict";

var plaza_cmd = {};

//广场版本
plaza_cmd.VER_PLAZA_LOW = 1; //广场版本
plaza_cmd.VER_PLAZA_HIGH = 16; //广场版本
// plaza_cmd.VER_PLAZA_FRAME = MAKELONG;(VER_PLAZA_LOW,VER_PLAZA_HIGH)

//////////////////////////////////////////////////////////////////////////
//登录错误标识

plaza_cmd.ERC_GP_LOGON_SUCCESS = 0; //登陆成功
plaza_cmd.ERC_GP_ACCOUNTS_NOT_EXIST = 1; //帐号不存在
plaza_cmd.ERC_GP_LONG_NULLITY = 2; //禁止登录
plaza_cmd.ERC_GP_PASSWORD_ERCOR = 3; //密码错误

//////////////////////////////////////////////////////////////////////////
//登录命令码

plaza_cmd.MDM_GP_LOGON = 13; //广场登录

plaza_cmd.SUB_GP_LOGON_ACCOUNTS = 301; //帐号登录
plaza_cmd.SUB_GP_LOGON_USERID = 302; //I D 登录
plaza_cmd.SUB_GP_REGISTER_ACCOUNTS = 303; //注册帐号
plaza_cmd.SUB_GP_UPLOAD_CUSTOM_FACE = 304; //定义头像
plaza_cmd.SUB_GP_LOGON_RECORD = 305; //定义头像


//////////////////////////////////////////////////////////////////////////
plaza_cmd.MDM_GP_LOGON_MOBILE = 15; //手机广场登录

plaza_cmd.SUB_GP_LOGON_MOBILE = 150; //手机登陆
plaza_cmd.SUB_GP_REGISTER_MOBILE = 151; //手机注册

plaza_cmd.SUB_GP_LOGON_SUCCESS_MOBILE = 260; //手机登陆成功
plaza_cmd.SUB_GP_LOGON_ERROR_MOBILE = 261; //手机登陆失败
plaza_cmd.SUB_GP_LOGON_FINISH_MOBILE = 262; //手机登陆完成
plaza_cmd.DTP_SEND_MOBILE_GUID = 2013; //手机GUID

// //帐号登录
// struct CMD_GP_LogonByAccountsMobile
// {
//     DWORD                               dwMobileSysType;                //手机操作系统类型(1苹果系统 2安卓系统)
//     DWORD                               nWeiXinAuthID;                  //微信验证 //兼容使用>1000w扫码登陆
//     DWORD                               dwMobileAppKind;                //手机APP游戏ID
//     DWORD                               dwMobileAppVersion;             //手机APP版本
//     TCHAR                               szAccounts[NAME_LEN];           //登录帐号
//     TCHAR                               szPassWord[PASS_LEN];           //登录密码
//     TCHAR                               szMobileMachine[COMPUTER_ID_LEN];//机器序列号
// };
// //注册帐号
// struct CMD_GP_RegisterAccountsMoblie
// {
//     WORD                                wFaceID;                        // 头像标识
//     BYTE                                cbGender;                       // 用户性别
//     DWORD                               dwMobileSysType;                //手机操作系统类型(1苹果系统 2安卓系统)
//     DWORD                               dwMobileAppKind;                // 广场手机版本
//     DWORD                               dwMobileAppVersion;             // 广场手机版本
//     TCHAR                               szAccounts[NAME_LEN];           // 登录帐号
//     TCHAR                               szPassWord[PASS_LEN];           // 登录密码
//     TCHAR                               szMobilephone[MOBILEPHONE_LEN]; // 手机
//     TCHAR                               szNickName[NAME_LEN];           // 昵称
//     TCHAR                               szMobileAuth[NAME_LEN];         //手机验证码
//     TCHAR                               szMobileMachine[COMPUTER_ID_LEN];//机器序列号
// };

// //手机登陆成功
// struct CMD_GP_LogonSuccessMobile
// {
//     //扩展信息
//     DWORD                               dwCustomFaceVer;                //头像版本
//     BYTE                                cbMoorMachine;                  //锁定机器
//     BYTE                                cbBindWeiXin;                   //绑定微信 WSL
//     WORD                                wFaceID;                        //头像索引
//     BYTE                                cbMember;                       //会员等级
//     BYTE                                cbGender;                       //用户性别
//     WORD                                wEncryptID;                     //随机码1
//     WORD                                wCodeCheckID;                   //随机码2
//     DWORD                               dwExperience;                   //用户经验
//     DWORD                               dwGameID;                       //游戏 I D
//     DWORD                               dwUserID;                       //用户 I D
//     LONGLONG                            llGameScore;                    //游戏金币
//     LONGLONG                            llInsureScore;                  //银行金币
//     TCHAR                               szAccounts[NAME_LEN];           //登录帐号
//     TCHAR                               szNickName[NAME_LEN];           //昵称
// };

// //////////////////////////////////////////////////////////////////////////

// //帐号登录
// struct CMD_GP_LogonByAccounts
// {

//     BYTE                                cbUserPhoneTag;
//     DWORD                               dwPlazaVersion;                 //广场版本
//     char                                szAccounts[NAME_LEN];           //登录帐号
//     char                                szPassWord[PASS_LEN];           //登录密码
// };

// //I D 登录
// struct CMD_GP_LogonByUserID
// {
//     DWORD                               dwPlazaVersion;                 //广场版本
//     DWORD                               dwUserID;                       //用户 I D
//     char                                szPassWord[PASS_LEN];           //登录密码
// };

// //注册帐号
// struct CMD_GP_RegisterAccounts
// {
//     WORD                                wFaceID;                        //头像标识
//     BYTE                                cbGender;                       //用户性别
//     DWORD                               dwPlazaVersion;                 //广场版本
//     WORD                                wCityNum;                       //城市编码
//     BYTE                                cbEnjoyType;                    //加入类型
//     char                                szSpreader[NAME_LEN];           //推广人名
//     char                                szAccounts[NAME_LEN];           //登录帐号
//     char                               szNickName[NAME_LEN];           //用户昵称
//     char                                szPassWord[PASS_LEN];
//     char                                szRealName[NAME_LEN];
//     char                                szIdentity[NAME_LEN];           //登录密码
//     char                               szEnjoyCode[PASS_LEN];          //推荐码or新手码
// };

// //登陆成功
// struct CMD_GP_LogonSuccess
// {
//     WORD                                wFaceID;                        //头像索引
//     BYTE                                cbGender;                       //用户性别
//     BYTE                                cbMember;                       //会员等级
//     DWORD                               dwUserID;                       //用户 I D
//     DWORD                               dwGameID;                       //游戏 I D
//     DWORD                               dwExperience;                   //用户经验

//     //扩展信息
//     DWORD                               dwCustomFaceVer;                //头像版本
//     BYTE                                cbMoorMachine;                  //锁定机器

//     DWORD                               dwFortuneCoin;                  //福币
//     DWORD                               dwGold;                         //乐豆
//     DWORD                               dwInsureScore;                  //乐豆
//     DWORD                               dwCoupon;                       //火腿
//     DWORD                               dwInsureCoupon;                 //火腿
//     DWORD                               dwMatchTicket;                  //参赛券
//     BYTE                                isFirstBank;                    // 首次使用

//     char                                szUserPhoneInfor[16];           //用户手机
//     char                                szErrorDescribe[128];           //错误消息
// };

// //登陆失败
// struct CMD_GP_LogonError
// {
//     LONG                                lErrorCode;                     //错误代码
//     char                                szErrorDescribe[128];           //错误消息
// };

// struct tagAwardInfo
// {
//     int     nAwardGold[7];
// };

// typedef struct
// {
//     tagAwardInfo info;
//     BYTE        IsChecked;
//     int         nLogonTime;
// }CMD_GP_AwardInfo;
// //校验用户信息
// struct CMD_GP_CheckRegister
// {
//     char                                szData[NAME_LEN];               //用户信息
//     WORD                                wFlag;                          //0:检测账号 1:检测昵称
// };
//////////////////////////////////////////////////////////////////////////
//游戏列表命令码

plaza_cmd.MDM_GP_SERVER_LIST = 17; //列表信息

plaza_cmd.SUB_GP_LIST_TYPE = 500; //类型列表
plaza_cmd.SUB_GP_LIST_KIND = 501; //种类列表
plaza_cmd.SUB_GP_LIST_STATION = 502; //站点列表
plaza_cmd.SUB_GP_LIST_SERVER = 503; //房间列表
plaza_cmd.SUB_GP_LIST_FINISH = 504; //发送完成
plaza_cmd.SUB_GP_LIST_CONFIG = 505; //列表配置

// //列表配置
// struct CMD_GP_ListConfig
// {
//     BYTE                                bShowOnLineCount;               //显示人数
// };

//////////////////////////////////////////////////////////////////////////
//系统命令码

plaza_cmd.MDM_GP_SYSTEM = 19; //系统命令

plaza_cmd.SUB_GP_VERSION = 500; //版本通知
plaza_cmd.SUB_SP_SYSTEM_MSG = 501; //系统消息

// //版本通知
// struct CMD_GP_Version
// {
//     BYTE                                bNewVersion;                    //更新版本
//     BYTE                                bAllowConnect;                  //允许连接
// };

//////////////////////////////////////////////////////////////////////////

plaza_cmd.MDM_GP_USER = 22; //用户信息

plaza_cmd.SUB_GP_USER_UPLOAD_FACE = 500; //上传头像
plaza_cmd.SUB_GP_USER_DOWNLOAD_FACE = 501; //下载头像
plaza_cmd.SUB_GP_UPLOAD_FACE_RESULT = 502; //上传结果
plaza_cmd.SUB_GP_DELETE_FACE_RESULT = 503; //删除结果
plaza_cmd.SUB_GP_CUSTOM_FACE_DELETE = 504; //删除头像
plaza_cmd.SUB_GP_MODIFY_INDIVIDUAL = 505; //个人资料
plaza_cmd.SUB_GP_MODIFY_INDIVIDUAL_RESULT = 506; //修改结果

plaza_cmd.SUB_GP_SAFE_BIND = 507; //玩家绑定
plaza_cmd.SUB_GP_SAFE_UNBIND = 508; //解除绑定
plaza_cmd.SUB_GP_CHECK_PSD = 509; //密码验证 WSL 2015.3.27


plaza_cmd.MDM_GP_REG = 23; //用户注册
plaza_cmd.SUB_GP_INIT_REGISTER = 500; //注册帐号
plaza_cmd.SUB_GP_CANCEL_REGISTER = 501; //用户取消注册
plaza_cmd.SUB_GP_REFUSE_REG = 502; //不能注册
plaza_cmd.SUB_GP_CAN_REG = 503; //可以注册
plaza_cmd.SUB_GP_GET_REGCODE = 504; //申请注册码 wsl 2015.4.3
plaza_cmd.SUB_GP_RET_REGCODE = 505; //申请注册码 wsl 2015.4.3
plaza_cmd.SUB_GP_RET_REGCODE_ERROR = 506; //申请注册码 wsl 2015.4.3

// //个人资料
// struct CMD_GP_ModifyIndividual
// {
//     DWORD                           dwUserID;                           //玩家 ID
//     char                            szNickName[NAME_LEN];               //玩家昵称
//     int                             nGender;                            //玩家性别
//     int                             nAge;                               //玩家年龄
//     char                            szAddress[64];                      //玩家地址
//     char                            szUnderWrite[32];                   //个性签名
//     char                            szPassword[33];                     //玩家密码
// };

// //定义头像
// struct CMD_GP_UploadCustomFace
// {
//     DWORD                               dwUserID;                       //玩家 ID
//     WORD                                wCurrentSize;                   //当前大小
//     bool                                bLastPacket;                    //最后标识
//     bool                                bFirstPacket;                   //第一个标识
//     BYTE                                bFaceData[2048];                //头像数据
// };

// //下载成功
// struct CMD_GP_DownloadFaceSuccess
// {
//     DWORD                           dwToltalSize;                       //总共大小
//     DWORD                           dwCurrentSize;                      //当前大小
//     DWORD                           dwUserID;                           //玩家 ID
//     BYTE                            bFaceData[2048];                    //头像数据
// };

// //下载头像
// struct CMD_GP_DownloadFace
// {
//     DWORD                           dwUserID;                           //玩家 ID
// };

// //上传结果
// struct CMD_GP_UploadFaceResult
// {
//     char                            szDescribeMsg[128];                 //描述信息
//     DWORD                           dwFaceVer;                          //头像版本
//     bool                            bOperateSuccess;                    //成功标识
// };

// //删除结果
// struct CMD_GP_DeleteFaceResult
// {
//     char                            szDescribeMsg[128];                 //描述信息
//     DWORD                           dwFaceVer;                          //头像版本
//     bool                            bOperateSuccess;                    //成功标识
// };

// //删除消息
// struct CMD_GP_CustomFaceDelete
// {
//     DWORD                           dwUserID;                           //玩家 ID
//     DWORD                           dwFaceVer;                          //头像版本
// };
// //修改头像
// struct CMD_GP_FaceChange
// {
//     DWORD                           dwUserID;
//     WORD                            wFaceID;
// };
// struct CMD_GP_FaceChangeResult
// {
//     BYTE                            cbResultID;                         //返回结果
//     WORD                            wFaceID;                            //头像ID
// };

// struct CMD_GP_UserInfo
// {
//     DWORD                           dwInsureScore;                      //保险箱福币
//     DWORD                           dwInsureCoupon;                     //保险箱贝壳
//     DWORD                           dwCoupon;                           //贝壳数
//     DWORD                           dwMatchTicket;                      //门票数
//     DWORD                           dwFortuneCoin;                      //福豆数
//     DWORD                           dwGold;                             //福币数
// };
// //修改结果
// struct CMD_GP_ModifyIndividualResult
// {
//     char                            szDescribeMsg[128];                 //描述信息
//     bool                            bOperateSuccess;                    //成功标识
// };

// struct CMD_GP_GetLogonAward
// {
//     DWORD                           dwUserID;                           //用户ID
//     int                             nTime;                              //几等奖励
//     LONGLONG                        lScore;                             //获得奖励
// };

// struct CMD_GP_Return
// {
//     int                             nCode;                              //返回code
//     LONGLONG                        lValue;                             //值
//     char                            szDescribe[32];                     //返回描述
// };
//////////////////////////////////////////////////////////////////////////
// 银行操作(开分写,减少判断字节)
plaza_cmd.MDM_GP_BANK = 5; // 银行信息

// 客户端请求
plaza_cmd.SUB_GP_CHANGE_PASSWORD = 100; // 修改密码
//plaza_cmd.SUB_GP_LOOK_SAVE = 101;                             // 查看记录
plaza_cmd.SUB_GP_BANK_STORAGE = 102; // 存储金币
plaza_cmd.SUB_GP_BANK_GET = 103; // 获取金币
plaza_cmd.SUB_GP_COUPON_STORAGE = 104; // 存储奖券
plaza_cmd.SUB_GP_COUPON_GET = 105; // 获取奖券

// 请求应答
plaza_cmd.SUB_GP_CHANGE_PASSWORD_RES = 110; // 修改密码
//plaza_cmd.SUB_GP_LOOK_SAVE_RES = 111;                             // 查看记录
plaza_cmd.SUB_GP_BANK_STORAGE_RES = 112; // 存储金币
plaza_cmd.SUB_GP_BANK_GET_RES = 113; // 获取金币
plaza_cmd.SUB_GP_COUPON_STORAGE_RES = 114; // 存储奖券
plaza_cmd.SUB_GP_COUPON_GET_RES = 115; // 获取奖券


// // 修改密码
// struct CMD_GP_ChangePassWord
// {
//     DWORD                               userID;                         // 用户ID
//     char                                loginPassWord[PASS_LEN];        // 大厅密码
//     char                                newBkPassWord[PASS_LEN];        // 新的密码
//     char                                oldBkPassWord[PASS_LEN];        // 原始密码
// };


// // 金币,奖券,存入存储结构
// typedef struct 
// {
//     DWORD                               userID;                         // 用户ID
//     LONGLONG                                operationValue;                 // 操作数量
//     char                                loginPassWord[PASS_LEN];        // 大厅密码
// }CMD_GP_BankStorage, CMD_GP_CouponStorage;

// // 金币,奖券,取出存储结构
// typedef struct 
// {
//     DWORD                               userID;                         // 用户ID
//     LONGLONG                            operationValue;                 // 操作数量
//     char                                loginPassWord[PASS_LEN];        // 大厅密码
//     char                                bankPassword[PASS_LEN];         // 用户密码
// }CMD_GP_BankGet, CMD_GP_CouponGet;


// // 修改密码应答
// struct CMD_GP_ChangePassWordRes
// {
//     BYTE                                errorCode;                      // 0为成功(修改isFirst)
// };

// // 金币,奖券,存储应答
// typedef struct 
// {
//     BYTE                                errorCode;                      // 错误码,0为成功
//     LONGLONG                            selfValue;                      // 身上钱
//     LONGLONG                            bankValue;                      // 保险箱钱
// }CMD_GP_BankStorageRes, CMD_GP_BankGetRes, CMD_GP_CouponStorageRes, CMD_GP_CouponGetRes;

plaza_cmd.MDM_GP_NEW = 6;

plaza_cmd.SUB_GP_GET_NEWS = 1; //获取公告
plaza_cmd.SUB_GP_FIND_FRIEDN = 2; //查询好友
plaza_cmd.SUB_GP_GET_FRIEND = 3; //获取好友
plaza_cmd.SUB_GP_ADD_FRIEND = 4; //增加好友
plaza_cmd.SUB_GP_DELETE_FRIEND = 5; //删除好友
plaza_cmd.SUB_GP_FRIEND_ERROR = 6; //失败结果
plaza_cmd.SUB_GP_SEND_MONEY = 7; //赠送
plaza_cmd.SUB_GP_SEND_RECORD = 8;
plaza_cmd.SUB_GP_SEND_RESULT = 9;

// struct CMD_GP_GetNews
// {
//     char                                szNews[256];
// };

// struct CMD_GP_Friend_Relative 
// {
//     DWORD           dwUserID;
//     DWORD           dwFriendID;
// };

// struct CMD_GP_FriendError
// {
//     char        szDescribe[128];
// };

// struct CMD_GP_DeleteFriendResult
// {
//     DWORD           dwDeleteID;
// };

// struct CMD_GP_FindUser
// {
//     DWORD       dwUserID;
//     WORD        wFaceID;
//     char        szNickName[32];
// };

// struct CMD_GP_FriendList
// {
//     int                 nCount;             //个数
//     CMD_GP_FindUser     Fuser[10];  //最多
// };

// struct CMD_GP_SendMoney
// {
//     DWORD       dwUserID;
//     DWORD       dwFriendID;
//     LONGLONG    lScore;
// };

// struct tagTranRecord
// {
//     char                szSendName[32];
//     char                szAcceptName[32];
//     LONGLONG            lTranGold;
// };

// struct CMD_GP_TranRecord
// {
//     int                 nCount;
//     tagTranRecord       Record[20];
// };

// struct CMD_GP_SendResult
// {
//     char                szSendName[32];
//     char                szAcceptName[32];
//     LONGLONG            lScore;
// };
// //////////////////////////////////////////////////////////////////////////

// //趣语结构
// struct CMD_GF_UserFun
// {
//     WORD                                wChairID;                       //椅子号
//     WORD                                wMainIndex;                     //趣语条目
//     WORD                                wSubIndex;
// };

// struct CMD_GF_LevelInfo
// {
//     WORD    wChairID;
//     LONG    lGameLevel;
//     LONG    AwardType;
//     LONG    AwardValue;
//     LONG    lExperience;
//     LONGLONG    lLevelUpValue;
// };

// //请求任务
// struct CMD_GF_MissionRequest
// {
//     BYTE                                                            cbMissionType;                                      
// };
//////////////////////////////////////////////////////////////////////////

//消息类型
plaza_cmd.SMT_INFO = 0x0001; //信息消息
plaza_cmd.SMT_EJECT = 0x0002; //弹出消息
plaza_cmd.SMT_GLOBAL = 0x0004; //全局消息
plaza_cmd.SMT_CLOSE_GAME = 0x1000; //关闭游戏

module.exports = plaza_cmd;

cc._RFpop();
},{}],"CMD_ZaJinHua":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6d963SiRSZMA7jDB+dGPKqc', 'CMD_ZaJinHua');
// Script/header/CMD_ZaJinHua.js

"use strict";

var zjh_cmd = {};

zjh_cmd.KIND_ID = 3; //游戏 I D
zjh_cmd.SERVER_ID = 301; //服务器 I D
zjh_cmd.GAME_PLAYER = 4; //游戏人数
zjh_cmd.GAME_NAME = "诈金花"; //游戏名字
// zjh_cmd.GAME_GENRE                      (GAME_GENRE_GOLD|GAME_GENRE_MATCH)  //游戏类型
zjh_cmd.MAX_COUNT = 3; //扑克数目


zjh_cmd.SERVERADDRESS = "127.0.0.1";
zjh_cmd.SERVER_PORT = 1680;

//结束原因
zjh_cmd.GER_NO_PLAYER = 0x10; //没有玩家
zjh_cmd.GER_COMPARECARD = 0x20; //比牌结束
zjh_cmd.GER_OPENCARD = 0x30; //开牌结束

//游戏状态
zjh_cmd.GS_TK_FREE = 0; //等待开始
zjh_cmd.GS_TK_PLAYING = 100; //游戏进行

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

zjh_cmd.SUB_S_GAME_START = 100; //游戏开始
zjh_cmd.SUB_S_ADD_SCORE = 101; //加注结果
zjh_cmd.SUB_S_GIVE_UP = 102; //放弃跟注
zjh_cmd.SUB_S_COMPARE_CARD = 105; //比牌跟注
zjh_cmd.SUB_S_LOOK_CARD = 106; //看牌跟注
zjh_cmd.SUB_S_SEND_CARD = 103; //发牌消息
zjh_cmd.SUB_S_GAME_END = 104; //游戏结束
zjh_cmd.SUB_S_PLAYER_EXIT = 107; //用户强退
zjh_cmd.SUB_S_OPEN_CARD = 108; //开牌消息
zjh_cmd.SUB_S_WAIT_COMPARE = 109; //等待比牌
zjh_cmd.SUB_S_LAST_ADD = 110; //孤注一掷
// //游戏状态
// struct CMD_S_StatusFree
// {
//     LONG                                lCellScore;                         //基础积分
// };

// //游戏状态
// struct CMD_S_StatusPlay
// {
//     //加注信息
//     LONG                                lMaxCellScore;                      //单元上限
//     LONG                                lCellScore;                         //单元下注
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lUserMaxScore;                      //用户分数上限

//     //状态信息
//     WORD                                wBankerUser;                        //庄家用户
//     WORD                                wCurrentUser;                       //当前玩家
//     BYTE                                cbPlayStatus[GAME_PLAYER];          //游戏状态
//     bool                                bMingZhu[GAME_PLAYER];              //看牌状态
//     LONG                                lTableScore[GAME_PLAYER];           //下注数目

//     //扑克信息
//     BYTE                                cbHandCardData[MAX_COUNT];          //扑克数据

//     //状态信息
//     bool                                bCompareState;                      //比牌状态
//     LONG                                lCurrentTurn;                       //当前轮数
// };

// //游戏开始
// struct CMD_S_GameStart
// {
//     //下注信息
//     LONG                                lMaxScore;                          //最大下注
//     LONG                                lCellScore;                         //单元下注
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lUserMaxScore;                      //分数上限

//     //用户信息
//     WORD                                wBankerUser;                        //庄家用户
//     WORD                                wCurrentUser;                       //当前玩家
//     BYTE                                cbPlayStatus[GAME_PLAYER];          //游戏状态
// };

// //用户下注
// struct CMD_S_AddScore
// {
//     WORD                                wCurrentUser;                       //当前用户
//     WORD                                wAddScoreUser;                      //加注用户
//     WORD                                wCompareState;                      //比牌状态
//     LONG                                lAddScoreCount;                     //加注数目
//     LONG                                lCurrentTimes;                      //当前倍数
//     LONG                                lCurrentTurn;                       //当前轮数
//     BYTE                                cbLastAddScore;                     //是否孤注一掷
// };

// //用户放弃
// struct CMD_S_GiveUp
// {
//     WORD                                wGiveUpUser;                        //放弃用户
// };

// //比牌数据包
// struct CMD_S_CompareCard
// {
//     WORD                                wCurrentUser;                       //当前用户
//     WORD                                wCompareUser[2];                    //比牌用户
//     WORD                                wLostUser;                          //输牌用户
//     LONG                                lCurrentTurn;                       //当前轮数
//     BYTE                                cbLostCardData[MAX_COUNT];          //输家牌数据
// };

// //看牌数据包
// struct CMD_S_LookCard
// {
//     WORD                                wLookCardUser;                      //看牌用户
//     BYTE                                cbCardData[MAX_COUNT];              //用户扑克
//     BYTE                                cbLastAdd;                          //孤注一掷
// };

// //开牌数据包
// struct CMD_S_OpenCard
// {
//     WORD                                wWinner;                            //胜利用户
// };

// //孤注一掷
// struct CMD_S_LastAdd
// {
//     WORD                                wStartLastAddUser;
//     WORD                                wCompareUser[GAME_PLAYER];
//     WORD                                wLostUser[GAME_PLAYER];
//     WORD                                wCurrentUser;
//     LONG                                lCurrentTurn;
// };


// //游戏结束
// struct CMD_S_GameEnd
// {
//     LONG                                lGameTax;                           //游戏税收
//     LONG                                lGameScore[GAME_PLAYER];            //游戏得分
//     BYTE                                cbCardData[GAME_PLAYER][MAX_COUNT]; //用户扑克
//     WORD                                wCompareUser[GAME_PLAYER][4];       //比牌用户
//     WORD                                wEndState;                          //结束状态
// };

// //用户退出
// struct CMD_S_PlayerExit
// {
//     WORD                                wPlayerID;                          //退出用户
// };

// //等待比牌
// struct CMD_S_WaitCompare
// {
//     WORD                                wCompareUser;                       //比牌用户
// };

//////////////////////////////////////////////////////////////////////////

//客户端命令结构
zjh_cmd.MY_VIEWID = 0; //3;

zjh_cmd.SUB_C_ADD_SCORE = 1; //用户加注
zjh_cmd.SUB_C_GIVE_UP = 2; //放弃消息
zjh_cmd.SUB_C_COMPARE_CARD = 3; //比牌消息
zjh_cmd.SUB_C_LOOK_CARD = 4; //看牌消息
zjh_cmd.SUB_C_OPEN_CARD = 5; //开牌消息
zjh_cmd.SUB_C_WAIT_COMPARE = 6; //等待比牌
zjh_cmd.SUB_C_FINISH_FLASH = 7; //完成动画
zjh_cmd.SUB_C_LAST_ADD = 8; //孤注一掷

// //用户加注
// struct CMD_C_AddScore
// {
//     LONG                                lScore;                             //加注数目
//     WORD                                wState;                             //当前状态
// };

// //比牌数据包
// struct CMD_C_CompareCard
// {   
//     WORD                                wCompareUser;                       //比牌用户
// };

//////////////////////////////////////////////////////////////////////////

//****************定时器标识******************--
//开始定时器
zjh_cmd.IDI_START_GAME = 200;
// 加注定时器
zjh_cmd.IDI_USER_ADD_SCORE = 201;
// 选比牌用户定时器
zjh_cmd.IDI_USER_COMPARE_CARD = 202;
// 过滤定时器
zjh_cmd.IDI_DISABLE = 203;
// *****************时间标识*****************--
// 开始定时器
zjh_cmd.TIME_START_GAME = 10;
// 加注定时器
zjh_cmd.TIME_USER_ADD_SCORE = 10;
// 比牌定时器
zjh_cmd.TIME_USER_COMPARE_CARD = 10;

module.exports = zjh_cmd;

cc._RFpop();
},{}],"CardItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd5dc6jV7wRCsIhygVF3MWUi', 'CardItem');
// Script/game/CardItem.js

"use strict";

var GlobalFun = require("GlobalFun");
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
        cardSprite: cc.Sprite,
        m_cbCardData: 0,
        cardAtlas: cc.SpriteAtlas,
        m_turnTime: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._skewDegree = 10;
    },
    init: function init(cbCardData) {
        this.m_cbCardData = cbCardData;
    },
    setCardData: function setCardData(cbCardData) {
        console.log("[CardItem][setCardData] cbCardData = " + cbCardData);
        this.m_cbCardData = cbCardData;
    },
    getCardData: function getCardData() {
        return this.m_cbCardData;
    },
    showCardBack: function showCardBack(bAnim) {
        console.log("[CardItem][showCardBack]");
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("card_back");
    },
    showCard: function showCard() {
        // this.m_turnTime = 0.5;
        console.log("[CardItem][showCard] cardData = " + this.m_cbCardData);
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("big_card_" + GlobalFun.PrefixInteger(this.m_cbCardData, 2));
    },
    setTurnCallback: function setTurnCallback(callBack) {
        this._callBack = callBack;
    },
    setTurnTime: function setTurnTime(t) {
        this.m_turnTime = t;
    },
    turnCard: function turnCard() {
        var self = this;
        this.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(this.m_turnTime / 2, 0, self.node.scaleY), cc.skewTo(this.m_turnTime / 2, 0, -this._skewDegree)), cc.callFunc(function () {
            self.showCard();
        }), cc.spawn(cc.scaleTo(this.m_turnTime / 2, self.node.scaleY, self.node.scaleY), cc.skewTo(this.m_turnTime / 2, 0, 0)), cc.callFunc(function () {
            if (self._callBack && typeof self._callBack === "function") {
                self._callBack();
            }
        })));
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"ChipItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd5ddb7Xc5tP1pbH8DdcZqv3', 'ChipItem');
// Script/game/ChipItem.js

"use strict";

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
        chipSprite: cc.Sprite,
        chipLabel: cc.Label,
        chipnum: 0,
        chipAtlas: cc.SpriteAtlas
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(chipnum) {
        var chipColorLevel = [1, 1000, 10000, 100000, 1000000];
        this.chipnum = chipnum;
        this.chipLabel.string = chipnum;
        for (var i = chipColorLevel.length - 1; i >= 0; i--) {
            var chipLevel = chipColorLevel[i];
            if (this.chipnum >= chipLevel) {
                this.chipSprite.spriteFrame = this.chipAtlas.getSpriteFrame("bigchip_" + (i + 1));
                break;
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"ChoosePayTypeView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '272a7LNBahFsobsZA3ESISQ', 'ChoosePayTypeView');
// Script/plaza/views/plaza/ChoosePayTypeView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
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
        m_Label_productName: cc.Label,
        m_Label_productPrice: cc.Label,
        m_Label_payPrice: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        this._params = params;
        if (this._params) {
            this.m_Label_productName.string = this._params["goods_name"];
            this.m_Label_productPrice.string = this._params["pay_amt"] + "元";
            this.m_Label_payPrice.string = this._params["pay_amt"] + "元";
        }
        console.log("[ChoosePayTypeView][init] " + JSON.stringify(this._params, null, ' '));
    },
    onEnable: function onEnable() {
        console.log("[ChoosePayTypeView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[ChoosePayTypeView][onDisable]");
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[ChoosePayTypeView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        // var FaceID = this._faceID;
        cc.loader.loadRes("prefab/ShopView", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            cc.director.getScene().getChildByName("Canvas").addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode, function () {
                console.log("[ChoosePayTypeView][onClickUserProfile] ActionShowTanChuang callback");
            });
        });
        this.node.destroy();
        console.log("[ChoosePayTypeView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"CoverView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a5920m13KdNGL114wFtOW7i', 'CoverView');
// Script/CoverView.js

"use strict";

cc.Class({
    extends: cc.ScrollView,

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this._scrollView = this.node.getComponent("cc.ScrollView");
        this._sPosition = cc.Vec2.ZERO;
        var scContentSize = this.node.getContentSize();
        var content = this.content.getComponent(cc.Layout);
        content.paddingLeft = scContentSize.width / 2;
        content.paddingRight = scContentSize.width / 2;
        var childItem = this.content.children[0];
        // this.init({
        //     paddingLeft:childItem.getContentSize().width/2,
        //     paddingRight:childItem.getContentSize().width/2,
        // })
        this.bInit = false;
    },
    init: function init(params) {
        if (this.bInit) {
            return;
        }
        this.bInit = true;
        var scContentSize = this.node.getContentSize();
        var paddingLeft = params.paddingLeft || scContentSize.width / 2;
        var paddingRight = params.paddingRight || scContentSize.width / 2;
        this.content.getComponent(cc.Layout).paddingLeft = paddingLeft;
        this.content.getComponent(cc.Layout).paddingRight = paddingRight;
        this._endCallBack = params.endCallBack;
        console.log("[CoverView][init] [paddingLeft,paddingRight] = " + [paddingLeft, paddingRight]);
    },
    onEnable: function onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on("scrolling", this.onScrolling, this.node);
        this.node.on("bounce-left", this.onBounceLeft, this.node);
        this.node.on("bounce-right", this.onBounceRight, this.node);
        this.node.on("scroll-ended", this.onScrollEnded, this.node);
    },
    onDisable: function onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off("scrolling", this.onScrolling, this.node);
        this.node.off("bounce-left", this.onBounceLeft, this.node);
        this.node.off("bounce-right", this.onBounceRight, this.node);
        this.node.off("scroll-ended", this.onScrollEnded, this.node);
    },
    onScrolling: function onScrolling(params) {
        console.log(params);
    },
    onScrollEnded: function onScrollEnded(params) {
        // console.log(params);
        this.getComponent("CoverView").stopAutoScroll();
        this.getComponent("CoverView").adjustEndScrollView();
    },
    onBounceLeft: function onBounceLeft(params) {
        // console.log(params);
    },
    onBounceRight: function onBounceRight(params) {
        // console.log(params);
    },
    onTouchStart: function onTouchStart(param) {
        // console.log(param);
    },
    onTouchMove: function onTouchMove(param) {
        var prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var movePoint = new cc.Vec2(param.touch.getLocation());
        var adjustPoint = movePoint.sub(prevPoint);
        // console.log("onTouchMove = " + [prevPoint,movePoint,adjustPoint]);
        this.getComponent("CoverView").adjustScrollView(adjustPoint);
        this.getComponent("CoverView").adjustItemScale(adjustPoint);
    },
    onTouchEnd: function onTouchEnd(param) {
        // console.log(param);
        console.log("[CoverView][onTouchEnd]" + cc.ScrollView.EventType.BOUNCE_LEFT);
        var touch_prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var touch_endPoint = new cc.Vec2(param.touch.getLocation());
        touch_endPoint.y = 0;
        // touch_endPoint = this.convertToWorldSpace(touch_endPoint);

        // touch_endPoint = this.getComponent("CoverView").content.convertToNodeSpaceAR(touch_endPoint);
        // var disx = touch_prevPoint.x - touch_endPoint.x;
        this.getComponent("CoverView").adjustEndScrollView();
        var curPos = this.getComponent("CoverView").getContentPosition();
        var sPos = this.getComponent("CoverView")._sPosition;
        var distance = cc.pDistance(curPos, sPos);
        var bMove = true;
        if (distance < 5.0) bMove = false;
        if (!bMove) {
            var curIndex = this.getComponent("CoverView").getCurIndex();
            var endPoint = touch_endPoint.sub(curPos);
            var children = this.getComponent("CoverView").content.children;
            for (var index = 0; index < children.length; index++) {
                var element = children[index];
                var rect = element.getBoundingBox();
                // console.log("[CoverView][onTouchEnd] rect " + rect + "endpoint " + endPoint);
                if (rect.contains(endPoint)) {
                    // console.log("[CoverView][onTouchEnd] " + endPoint);
                    if (curIndex !== index) {
                        this.getComponent("CoverView").scrollToIndex(index);
                    }
                    return;
                }
            }
        }
    },
    onTouchCancel: function onTouchCancel(param) {
        // console.log(param);
    },
    adjustScrollView: function adjustScrollView(adjustPoint) {
        var scroll_contentPositon = this.getContentPosition();
        var addPoint = new cc.Vec2(adjustPoint.x, 0);
        scroll_contentPositon = scroll_contentPositon.add(addPoint);
        this.setContentPosition(scroll_contentPositon);
    },
    adjustItemScale: function adjustItemScale(adjustPoint) {
        var children = this.content.children;
        var scContentSize = this.node.getContentSize();
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = Math.abs(scContentSize.width / 2 - posX);
            var scale = 1 - disMid / dist * 0.25;
            element.setScale(scale);
        }
    },
    adjustEndScrollView: function adjustEndScrollView(params) {
        var _this = this;

        console.log("[CoverView][adjustEndScrollView]");
        this._sPosition = this.getContentPosition();

        var midX = this.node.getContentSize().width / 2;
        var children = this.content.children;
        var minX = midX - children[0].getPositionX() - this.getContentPosition().x; //this.node.getContentSize().width;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = midX - posX;
            if (Math.abs(disMid) < Math.abs(minX)) {
                minX = disMid;
            }
        }
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = Math.abs(midX - posX - minX);
            var scale = 1 - disMid / dist * 0.25;
            element.runAction(cc.scaleTo(0.2, scale));
        }
        this.stopAutoScroll();
        this.content.stopAllActions();
        this.content.runAction(cc.sequence(cc.moveBy(0.2, minX, 0), cc.callFunc(function () {
            // console.log("[CoverView][adjustEndScrollView] curIndex = " + this.getCurIndex());
            if (typeof _this._endCallBack === "function") {
                _this._endCallBack();
            }
        })));
    },
    scrollToIndex: function scrollToIndex(index) {
        var _this2 = this;

        var children = this.content.children;
        // console.log("[CoverView][scrollToIndex] " + index);
        if (index >= children.length || index < 0) {
            return;
        }
        var curIndex = this.getCurIndex();
        var curObj = children[curIndex];
        var scrollObj = children[index];
        var sc_prePoint = curObj.getPosition();
        var sc_movePoint = scrollObj.getPosition();
        var adjustPoint = sc_prePoint.sub(sc_movePoint);

        var scroll_contentPositon = this.getContentPosition();
        var addPoint = new cc.Vec2(adjustPoint.x, 0);
        scroll_contentPositon = scroll_contentPositon.add(addPoint);
        this.scrollToOffset(cc.Vec2.ZERO.sub(scroll_contentPositon), 0.15);
        // console.log("[CoverView][scrollToIndex] " + scroll_contentPositon + " offset " + this.getScrollOffset());
        // this.adjustItemScale();
        // this.adjustEndScrollView();
        this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            _this2.adjustItemScale(adjustPoint);
            _this2.adjustEndScrollView();
        })));
    },
    getCurIndex: function getCurIndex() {
        var children = this.content.children;
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        var dis1 = -this.getContentPosition().x;
        var dis2 = 0;
        var index = Math.floor((dis1 + dis2 + 5) / dist);
        if (index < 0) {
            index = 0;
        } else if (index >= children.length) {
            index = children.length - 1;
        }
        // console.log("getCurIndex [dist,dis1,dis2] = " + [dist,dis1,dis2]);
        return index;
    }
});

cc._RFpop();
},{}],"GameChatView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '84fc5v6srpG2I37eB9lHeKX', 'GameChatView');
// Script/game/GameChatView.js

"use strict";

var GlobalFun = require("GlobalFun");
var ChatType = cc.Enum({
    Face: 0,
    Text: 1
});
var chatTextList = ["快点啊，都等到我花儿都谢了！", "怎么又断线了，网络怎么这么差啊！", "不要走决战到天亮！", "你的牌打得也太好了！", "你是妹妹还是哥哥啊！", "和你合作真是愉快了！", "大家好，很高兴见到各位！", "各位，真是不好意思我得离开一会。", "不要吵了,吵啥嘛吵,专心玩游戏吧！"];
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
        m_scrollView: cc.ScrollView,
        textPrefab: cc.Node,
        facePrefab: cc.Node,
        chatAtlas: cc.SpriteAtlas,
        radioButton: {
            default: [],
            type: cc.Toggle
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._selectIndex = 0;
        this.refreshList(this._selectIndex);
        var bgNode = this.node.getChildByName("game_chat_bg");
        bgNode.opacity = 0;
        bgNode.runAction(cc.sequence(cc.moveBy(0, 600, 0), cc.spawn(cc.moveBy(0.3, -600, 0), cc.fadeIn(0.3))));
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
    },
    refreshList: function refreshList(index) {
        var contentList = this.m_scrollView.content;
        contentList.removeAllChildren();
        if (this._selectIndex === ChatType.Text) {
            for (var i = 0; i < chatTextList.length; i++) {
                var text = chatTextList[i];
                var textNode = cc.instantiate(this.textPrefab);
                textNode.active = true;
                var textLabel = textNode.getChildByName("m_Label_chat").getComponent(cc.Label).string = text;
                contentList.addChild(textNode);
            }
        } else if (this._selectIndex === ChatType.Face) {
            for (var i = 0; i < 12; i++) {
                var faceNode = cc.instantiate(this.facePrefab);
                faceNode.active = true;
                var faceSprite = faceNode.getChildByName("m_Image_chatFace").getComponent(cc.Sprite);
                faceSprite.spriteFrame = this.chatAtlas.getSpriteFrame("chat_emoticon_" + GlobalFun.PrefixInteger(i + 1, 2));
                contentList.addChild(faceNode);
            }
        }
    },
    radioButtonClicked: function radioButtonClicked(toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        this.refreshList(this._selectIndex);
    },
    close: function close() {
        var self = this;
        var bgNode = this.node.getChildByName("game_chat_bg");
        // bgNode.opacity = 0;
        bgNode.runAction(cc.sequence(cc.spawn(cc.moveBy(0.3, 600, 0), cc.fadeOut(0.3)), cc.callFunc(function () {
            self.node.destroy();
        })));
        // this.node.destroy();
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"GameFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0917fhGquREZ5AtcS81ZpEL', 'GameFrame');
// Script/plaza/models/GameFrame.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseFrame = require("BaseFrame");
require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var zjh_cmd = require("CMD_ZaJinHua");
var GlobalUserData = require("GlobalUserData");
var GameServerItem = require("GameServerItem");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
var GameUserItem = require("GameUserItem");
cc.Class({
    extends: BaseFrame,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.init();
    },
    init: function init(params) {
        this._wTableCount = 0;
        this._wChairCount = 0;
        this._wServerType = 0;
        this._dwServerRule = 0;
        this._cbGameStatus = 0;
        this._cbAllowLookon = 0;
        this._cbHideUserInfo = false;
        this.bChangeDesk = false;
        this._userList = {};
        this._tableUserList = {};
        this._tableStatus = {};
        this._wTableID = GlobalDef.INVALID_TABLE;
        this._wChairID = GlobalDef.INVALID_CHAIR;
    },
    onLogonRoom: function onLogonRoom(roomInfo) {
        this._roomInfo = roomInfo;
        if (!this._roomInfo) {
            console.log("[GameFrame][onLogonRoom] 获取房间信息失败");
            return;
        }
        console.log("[GameFrame][onLogonRoom] 登录房间: " + GlobalFun.numberToIp(this._roomInfo.dwServerAddr) + "# " + this._roomInfo.wServerPort);
        if (this._socket) {
            this.onCloseSocket();
        }
        if (this.onCreateSocket(GlobalFun.numberToIp(this._roomInfo.dwServerAddr), this._roomInfo.wServerPort) === false) {
            console.log("[GameFrame][onLogonRoom][onCreateSocket] fail");
            return false;
        }
        console.log("[GameFrame][onLogonRoom][onCreateSocket] success");
        return true;
    },
    onConnectCompeleted: function onConnectCompeleted() {
        //初始化参数
        this.init();
        cc.director.emit("LoadingViewOnConnect", { message: "正在连接游戏房间..." });
        this.sendLogonPacket();
    },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        console.log("[GameFrame][onSocketEvent] pData len = " + pData.getDataSize());
        if (!this._socketEventCallback) {
            var _socketEventCallback;

            this._socketEventCallback = (_socketEventCallback = {}, _defineProperty(_socketEventCallback, game_cmd.MDM_GR_LOGON, this.OnSocketMainLogon), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_USER, this.OnSocketMainUser), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_INFO, this.OnSocketMainInfo), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_STATUS, this.OnSocketMainStatus), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_SYSTEM, this.OnSocketMainSystem), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_SERVER_INFO, this.OnSocketMainServerInfo), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_GAME, function (sub, pData) {
                //游戏消息
                cc.director.emit("onEventGameMessage", {
                    sub: sub,
                    pData: pData
                });
            }), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_FRAME, this.OnSocketMainGameFrame), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_PRESENT, this.OnGamePresentMessage), _socketEventCallback);
        }
        if (this._socketEventCallback && this._socketEventCallback[main]) {
            var fun = this._socketEventCallback[main];
            fun.call(this, sub, pData);
        } else {
            console.log("[GameFrame][onSocketEvent] main = " + main + "sub = " + sub + " not find");
        }
    },
    OnSocketMainLogon: function OnSocketMainLogon(sub, pData) {
        console.log("[GameFrame][OnSocketMainLogon]");
        if (sub === game_cmd.SUB_GR_LOGON_SUCCESS) {
            console.log("[GameFrame][OnSocketMainLogon] logon success");
            this._userList = {};
            // cc.director.emit("LogonSuccess");
        } else if (sub === game_cmd.SUB_GR_LOGON_ERROR) {
            //登录失败
            // struct CMD_GR_LogonError
            // {
            //     LONG							lErrorCode;							//错误代码
            //     TCHAR							szErrorDescribe[128];				//错误消息
            // };
            var logonError = {};
            logonError.lErrorCode = pData.readint();
            logonError.szErrorDescribe = pData.readstring(128);
            console.log("[GameFrame][OnSocketMainLogon] errorCode = " + logonError.lErrorCode + " des = " + logonError.szErrorDescribe);
            this.onCloseSocket();
            // GlobalFun.showAlert({message:logonError.szErrorDescribe});
            if (logonError.szErrorDescribe) {
                cc.director.emit("LoadingViewError", { msg: logonError.szErrorDescribe, type: GlobalDef.SMT_CLOSE_GAME });
            }
            // console.log("logonframe login error");
        } else if (sub === game_cmd.SUB_GR_LOGON_FINISH) {
            // cc.director.loadScene("GameScene");
            cc.director.emit("LoadingViewOnLogonFinish", { message: "正在进入游戏..." });
            this.onSocketLogonFinish();
            console.log("[GameFrame][OnSocketMainLogon] Logon Finish");
        }
    },
    //登录完成
    onSocketLogonFinish: function onSocketLogonFinish() {
        console.log("[GameFrame][onSocketLogonFinish]");
        var myUserItem = this.getMeUserItem();
        if (!myUserItem) {
            console.log("[GameFrame][onSocketLogonFinish] 获取自己的信息失败");
            return;
        }
        if (this._wTableID !== GlobalDef.INVALID_TABLE) {
            cc.director.emit("onEnterTable");
            this.sendGameOption();
        } else {
            cc.director.emit("onEnterRoom");
            this.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR);
        }
    },
    OnSocketMainUser: function OnSocketMainUser(sub, pData) {
        console.log("[GameFrame][OnSocketMainUser]");
        if (!this._socketMainUserCallback) {
            var _socketMainUserCallba;

            this._socketMainUserCallback = (_socketMainUserCallba = {}, _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_COME, this.OnSocketSubUserCome), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_STATUS, this.OnSocketSubStatus), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_SCORE, this.OnSocketSubScore), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_RIGHT, this.OnSocketSubRight), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_MEMBER_ORDER, this.OnSocketSubMemberOrder), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_SIT_FAILED, this.OnSocketSubSitFailed), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_CHAT, this.OnSocketSubChat), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_WISPER, this.OnSocketSubWisper), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_INVITE, this.OnSocketSubUserInvite), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_QUERY_GOLD, this.OnSocketSubQueryGold), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_PRESEND_QUERY, this.OnSocketSubPresentQuery), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_PRESENT_ERROR, function (sub, pData) {
                console.log("SUB_GR_PRESENT_ERROR");
                // this.OnSocketSubUserCome(sub,pData);
            }), _socketMainUserCallba);
        }
        if (this._socketMainUserCallback && this._socketMainUserCallback[sub]) {
            var fun = this._socketMainUserCallback[sub];
            fun.call(this, sub, pData);
        } else {
            console.log("[GameFrame][OnSocketMainUser] sub = " + sub + " not find");
        }
    },
    OnSocketMainInfo: function OnSocketMainInfo(sub, pData) {
        console.log("[GameFrame][OnSocketMainInfo]");
        switch (sub) {
            case game_cmd.SUB_GR_SERVER_INFO:
                console.log("SUB_GR_SERVER_INFO");
                //游戏房间信息
                // struct CMD_GR_ServerInfo
                // {
                //     //房间属性
                //     WORD							wChairCount;						//椅子数目
                //     WORD							wGameGenre;							//游戏类型
                //     WORD							wTableCount;						//桌子数目
                //     WORD							wKindID;							//类型 I D
                //     DWORD							dwVideoAddr;						//视频地址
                //     BYTE							cbHideUserInfo;						//隐藏信息
                // };
                var serverInfo = {};
                serverInfo.wChairCount = pData.readword();
                serverInfo.wGameGenre = pData.readword();
                serverInfo.wTableCount = pData.readword();
                serverInfo.wKindID = pData.readword();
                serverInfo.dwVideoAddr = pData.readdword();
                serverInfo.cbHideUserInfo = pData.readbyte();

                this._wChairCount = serverInfo.wChairCount;
                this._wTableCount = serverInfo.wTableCount;
                this._cbHideUserInfo = serverInfo.cbHideUserInfo;
                this._wGameGenre = serverInfo.wGameGenre;
                this._wKindID = serverInfo.wKindID;

                break;
            case game_cmd.SUB_GR_COLUMN_INFO:
                console.log("SUB_GR_COLUMN_INFO");
                break;
            case game_cmd.SUB_GR_CONFIG_FINISH:
                console.log("SUB_GR_CONFIG_FINISH");
                break;
            default:
                break;
        }
    },
    OnSocketMainStatus: function OnSocketMainStatus(sub, pData) {
        console.log("[GameFrame][OnSocketMainStatus]");
        switch (sub) {
            case game_cmd.SUB_GR_TABLE_INFO:
                console.log("SUB_GR_TABLE_INFO");
                //桌子状态数组
                // struct CMD_GR_TableInfo
                // {
                //     WORD							wTableCount;						//桌子数目
                //     tagTableStatus					TableStatus[512];					//状态数组
                //桌子状态结构
                // struct tagTableStatus
                // {
                //     BYTE							bPlayStatus;						//游戏状态
                //     BYTE							bTableLock;							//锁定状态
                // };
                // };
                var wTableCount = pData.readword();
                for (var index = 0; index < wTableCount; index++) {
                    this._tableStatus[index] = {};
                    this._tableStatus[index].bPlayStatus = pData.readbyte();
                    this._tableStatus[index].bTableLock = pData.readbyte();
                }
                break;
            case game_cmd.SUB_GR_TABLE_STATUS:
                console.log("SUB_GR_TABLE_STATUS");
                //桌子状态信息
                // struct CMD_GR_TableStatus
                // {
                //     BYTE							bTableLock;							//锁定状态
                //     BYTE							bPlayStatus;						//游戏状态
                //     WORD							wTableID;							//桌子号码
                // };
                var tableStatus = {};
                tableStatus.bTableLock = pData.readbyte();
                tableStatus.bPlayStatus = pData.readbyte();
                tableStatus.wTableID = pData.readword();

                this._tableStatus[tableStatus.wTableID].bPlayStatus = tableStatus.bPlayStatus;
                this._tableStatus[tableStatus.wTableID].bTableLock = tableStatus.bTableLock;

                cc.director.emit("upDateTableStatus", {
                    wTableID: tableStatus.wTableID
                });
                break;
            default:
                break;
        }
    },
    //系统消息
    OnSocketMainSystem: function OnSocketMainSystem(sub, pData) {
        console.log("[GameFrame][OnSocketMainSystem]");
        switch (sub) {
            case game_cmd.SUB_GR_MESSAGE:
                console.log("SUB_GR_MESSAGE");
                //消息数据包
                // struct CMD_GR_Message
                // {
                //     WORD							wMessageType;						//消息类型
                //     WORD							wMessageLength;						//消息长度
                //     TCHAR							szContent[1024];					//消息内容
                // };
                //消息处理
                var message = {};
                message.wMessageType = pData.readword();
                message.wMessageLength = pData.readword();
                message.szContent = pData.readstring(message.wMessageLength);
                //关闭连接
                var bIntermet = false;
                if (message.wMessageType & game_cmd.SMT_INTERMIT_LINE) {
                    bIntermet = true;
                } else if (message.wMessageType & game_cmd.SMT_CLOSE_ROOM) {
                    bIntermet = true;
                }

                console.log("[GameFrame][OnSocketMainSystem] message = " + message.szContent + " type = " + message.wMessageType);
                if (bIntermet) {
                    if (message.szContent) {
                        cc.director.emit("LoadingViewError", { msg: message.szContent, type: GlobalDef.SMT_CLOSE_GAME });
                    }
                    console.log("[GameFrame][OnSocketMainSystem] " + message.szContent);
                    this.onCloseSocket();
                }
                if (message.wMessageType & GlobalDef.SMT_EJECT) {
                    // console.log("[GameFrame][OnSocketMainSystem] message = " + message.szContent + " type = " + message.wMessageType);
                    GlobalFun.showAlert({
                        message: message.szContent
                    });
                }
                break;
            default:
                break;
        }
    },
    //房间消息
    OnSocketMainServerInfo: function OnSocketMainServerInfo(sub, pData) {
        console.log("[GameFrame][OnSocketMainServerInfo]");
        switch (sub) {
            case game_cmd.SUB_GR_ONLINE_COUNT_INFO:
                console.log("SUB_GR_ONLINE_COUNT_INFO");
                break;
            default:
                break;
        }
    },
    OnSocketMainGameFrame: function OnSocketMainGameFrame(sub, pData) {
        console.log("[GameFrame][OnSocketMainGameFrame]");
        switch (sub) {
            case GlobalDef.SUB_GF_OPTION:
                console.log("SUB_GF_OPTION");
                //游戏配置
                // struct CMD_GF_Option
                // {
                //     BYTE								bGameStatus;					//游戏状态
                //     BYTE								bAllowLookon;					//允许旁观
                // };
                this._cbGameStatus = pData.readbyte();
                this._cbAllowLookon = pData.readbyte();
                break;
            case GlobalDef.SUB_GF_USER_CHAT:
                console.log("SUB_GF_USER_CHAT");
                break;
            case GlobalDef.SUB_GF_MESSAGE:
                console.log("SUB_GF_MESSAGE");
                //消息数据包
                // struct CMD_GR_Message
                // {
                //     WORD							wMessageType;						//消息类型
                //     WORD							wMessageLength;						//消息长度
                //     TCHAR							szContent[1024];					//消息内容
                // };
                //消息处理
                var message = {};
                message.wMessageType = pData.readword();
                message.wMessageLength = pData.readword();
                message.szContent = pData.readstring(message.wMessageLength);
                console.log("[GameFrame][OnSocketMainGameFrame] message = " + message.szContent);
                if (message.wMessageType & GlobalDef.SMT_CLOSE_GAME) {
                    this.onCloseSocket();
                }
                if (message.wMessageType & GlobalDef.SMT_EJECT) {
                    console.log("[GameFrame][OnSocketMainGameFrame] message = " + message.szContent + " type = " + message.wMessageType);
                    GlobalFun.showAlert({
                        message: message.szContent,
                        btn: [{
                            name: "确定",
                            callback: function callback() {
                                cc.director.emit("onExitRoom");
                            }
                        }]
                    });
                }
                if (message.wMessageType & GlobalDef.SMT_GLOBAL) {}
                break;
            case GlobalDef.SUB_GF_SCENE:
                //游戏场景
                console.log("SUB_GF_SCENE");
                cc.director.emit("onEventGameScene", {
                    cbGameStatus: this._cbGameStatus,
                    pData: pData
                });
                break;
            default:
                break;
        }
    },
    //用户进入
    OnSocketSubUserCome: function OnSocketSubUserCome(sub, pData) {
        console.log("[GameFrame][OnSocketSubUserCome]");
        console.log("[GameFrame][OnSocketSubUserCome] pData len = " + pData.getDataSize());
        var userItem = new GameUserItem();
        userItem.initDataByUserInfoHead(pData);
        console.log("[GameFrame][OnSocketSubUserCome] " + JSON.stringify(userItem, null, ' '));
        var item = this._userList[userItem.dwUserID];
        // if (item) {
        this._userList[userItem.dwUserID] = userItem;
        // }
        //记录自己的桌号
        if (userItem.dwUserID === GlobalUserData.dwUserID) {
            this._wTableID = userItem.wTableID;
            this._wChairID = userItem.wChairID;
        }
        if (userItem.wTableID !== GlobalDef.INVALID_TABLE && userItem.wChairID !== GlobalDef.INVALID_CHAIR) {
            this.onUpDateTableUser(userItem.wTableID, userItem.wChairID, userItem);
            cc.director.emit("onEventUserEnter", {
                wTableID: userItem.wTableID,
                wChairID: userItem.wChairID,
                userItem: userItem
            });
        }
        if (userItem.dwUserID === GlobalUserData.dwUserID) {
            // this.onSocketLogonFinish();
        }
    },
    OnSocketSubStatus: function OnSocketSubStatus(sub, pData) {
        console.log("[GameFrame][OnSocketSubStatus]");
        //用户状态
        // struct CMD_GR_UserStatus
        // {
        //     WORD							wTableID;							//桌子位置
        //     DWORD							dwUserID;							//数据库 ID
        //     BYTE							cbUserStatus;						//用户状态
        //     WORD							wChairID;							//椅子位置
        // };
        var userStatus = {};
        userStatus.wTableID = pData.readword();
        userStatus.dwUserID = pData.readdword();
        userStatus.cbUserStatus = pData.readbyte();
        userStatus.wChairID = pData.readword();

        console.log("[GameFrame][OnSocketSubStatus] newStatus = " + JSON.stringify(userStatus, null, ' '));
        var userItem = this.searchUserByUserID(userStatus.dwUserID);
        var myUserItem = this.getMeUserItem();
        if (!myUserItem) {
            console.log("[GameFrame][OnSocketSubStatus] 未找到自己");
            return;
        }
        //找不到用户
        if (!userItem) {
            console.log("[GameFrame][OnSocketSubStatus] 找不到用户");
            return;
        }
        //记录旧状态
        var oldStatus = {};
        oldStatus.wTableID = userItem.wTableID;
        oldStatus.wChairID = userItem.wChairID;
        oldStatus.cbUserStatus = userItem.cbUserStatus;

        //更新信息
        userItem.cbUserStatus = userStatus.cbUserStatus;
        userItem.wTableID = userStatus.wTableID;
        userItem.wChairID = userStatus.wChairID;

        //清除旧桌子椅子记录
        if (oldStatus.wTableID !== GlobalDef.INVALID_TABLE) {
            //新旧桌子不同 新旧椅子不同
            if (oldStatus.wTableID !== userStatus.wTableID || oldStatus.wChairID !== userStatus.wChairID) {
                this.onUpDateTableUser(oldStatus.wTableID, oldStatus.wChairID, undefined);
            }
        }
        //新桌子记录
        if (userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
            this.onUpDateTableUser(userStatus.wTableID, userStatus.wChairID, userItem);
        }

        //自己状态
        if (myUserItem.dwUserID === userStatus.dwUserID) {
            this._wTableID = userStatus.wTableID;
            this._wChairID = userStatus.wChairID;

            //离开
            if (userStatus.cbUserStatus === GlobalDef.US_NULL) {
                console.log("[GameFrame][OnSocketSubStatus] 自己离开");
                cc.director.emit("onExitRoom");
            }
            //起立
            else if (userStatus.cbUserStatus === GlobalDef.US_FREE && oldStatus.cbUserStatus > GlobalDef.US_FREE) {
                    console.log("[GameFrame][OnSocketSubStatus] 自己起立");
                    if (!this.bChangeDesk) {
                        cc.director.emit("onExitTable");
                    } else {
                        this.bChangeDesk = false;
                        this.onResetGameEngine();
                    }
                }
                //坐下
                else if (userStatus.cbUserStatus > GlobalDef.US_FREE && oldStatus.cbUserStatus < GlobalDef.US_SIT) {
                        console.log("[GameFrame][OnSocketSubStatus] 自己坐下");
                        this.bChangeDesk = false;
                        cc.director.emit("onEnterTable");
                        this.sendGameOption();
                        cc.director.emit("onEventUserStatus", {
                            userItem: userItem,
                            newStatus: userStatus,
                            oldStatus: oldStatus
                        });
                    }
                    //换位
                    else if (userStatus.wTableID !== GlobalDef.INVALID_TABLE && this.bChangeDesk) {
                            console.log("[GameFrame][OnSocketSubStatus] 换位");
                            cc.director.emit("onEnterTable");
                            this.sendGameOption();
                            cc.director.emit("onEventUserStatus", {
                                userItem: userItem,
                                newStatus: userStatus,
                                oldStatus: oldStatus
                            });
                        } else {
                            console.log("[GameFrame][OnSocketSubStatus] 自己新状态 " + JSON.stringify(userStatus, null, ' '));
                            cc.director.emit("onEventUserStatus", {
                                userItem: userItem,
                                newStatus: userStatus,
                                oldStatus: oldStatus
                            });
                        }
        }
        //他人状态
        else {
                //更新用户
                if (oldStatus.wTableID !== GlobalDef.INVALID_TABLE || userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
                    cc.director.emit("onEventUserStatus", {
                        userItem: userItem,
                        newStatus: userStatus,
                        oldStatus: oldStatus
                    });
                }
                //删除用户
                if (userStatus.cbUserStatus === GlobalDef.US_NULL) {
                    this.onRemoveUser(userStatus.dwUserID);
                }
            }
    },
    OnSocketSubScore: function OnSocketSubScore(sub, pData) {
        console.log("[GameFrame][OnSocketSubScore]");
        //用户分数
        // struct CMD_GR_UserScore
        // {
        //     LONG							lLoveliness;						//用户魅力
        //     //LONG							lInsureScore;						//消费金豆
        //     //LONG							lGameGold;							//游戏金豆
        //     DWORD							dwUserID;							//用户 I D
        //     tagUserScore					UserScore;							//积分信息
        // struct tagUserScore
        // {
        //     LONGLONG							lScore;								//用户分数
        //     LONGLONG							lGameGold;							//游戏金币
        //     LONGLONG							lInsureScore;						//存储金币
        //     LONG								lWinCount;							//胜利盘数
        //     LONG								lLostCount;							//失败盘数
        //     LONG								lDrawCount;							//和局盘数
        //     LONG								lFleeCount;							//断线数目
        //     LONG								lExperience;						//用户经验
        // };
        // };
        var userScore = {};
        userScore.lLoveliness = pData.readint(); //用户魅力
        userScore.dwUserID = pData.readdword(); //用户ID
        //用户积分
        userScore.UserScore = {};
        userScore.UserScore.lScore = pData.readint64(); //用户分数
        userScore.UserScore.lGameGold = pData.readint64(); //游戏金币
        userScore.UserScore.lInsureScore = pData.readint64(); //存储金币
        userScore.UserScore.lWinCount = pData.readint(); //胜利盘数
        userScore.UserScore.lLostCount = pData.readint(); //失败盘数
        userScore.UserScore.lDrawCount = pData.readint(); //和局盘数
        userScore.UserScore.lFleeCount = pData.readint(); //断线数目
        userScore.UserScore.lExperience = pData.readint(); //用户经验

        //自己信息
        var myUserItem = this.getMeUserItem();
        var userItem = this.searchUserByUserID(userScore.dwUserID);
        if (userScore.dwUserID == myUserItem.dwUserID) {
            //更新自己全局分数
            GlobalUserData.llGameScore = userScore.UserScore.lGameGold;
            GlobalUserData.llInsureScore = userScore.UserScore.lInsureScore;
            GlobalUserData.dwLoveLiness = userScore.lLoveliness;
        }
        if (userItem) {
            console.log("[GameFrame][OnSocketSubScore] 更新 " + JSON.stringify(userScore, null, ' '));
            userItem.lScore = userScore.UserScore.lScore;
            userItem.lGameGold = userScore.UserScore.lGameGold;
            userItem.lInsureScore = userScore.UserScore.lInsureScore;
            userItem.lWinCount = userScore.UserScore.lWinCount;
            userItem.lLostCount = userScore.UserScore.lLostCount;
            userItem.lDrawCount = userScore.UserScore.lDrawCount;
            userItem.lFleeCount = userScore.UserScore.lFleeCount;
            userItem.lExperience = userScore.UserScore.lExperience;
            userItem.lLoveliness = userScore.lLoveliness;
        }
        //通知更新界面
        if (this._wTableID !== GlobalDef.INVALID_TABLE) {
            cc.director.emit("onEventUserScore", {
                userItem: userItem
            });
        }
    },
    OnSocketSubRight: function OnSocketSubRight(sub, pData) {
        console.log("[GameFrame][OnSocketSubRight]");
    },
    OnSocketSubMemberOrder: function OnSocketSubMemberOrder(sub, pData) {
        console.log("[GameFrame][OnSocketSubMemberOrder]");
    },
    OnSocketSubSitFailed: function OnSocketSubSitFailed(sub, pData) {
        console.log("[GameFrame][OnSocketSubSitFailed]");
        //坐下失败
        // struct CMD_GR_SitFailed
        // {
        //     TCHAR							szFailedDescribe[256];				//错误描述
        // };
        var szFailedDescribe = pData.readstring(256);
        console.log("[GameFrame][OnSocketSubSitFailed] " + szFailedDescribe);
    },
    OnSocketSubChat: function OnSocketSubChat(sub, pData) {
        console.log("[GameFrame][OnSocketSubChat]");
    },
    OnSocketSubWisper: function OnSocketSubWisper(sub, pData) {
        console.log("[GameFrame][OnSocketSubWisper]");
    },
    OnSocketSubUserInvite: function OnSocketSubUserInvite(sub, pData) {
        console.log("[GameFrame][OnSocketSubUserInvite]");
    },
    OnSocketSubQueryGold: function OnSocketSubQueryGold(sub, pData) {
        console.log("[GameFrame][OnSocketSubQueryGold]");
    },
    OnSocketSubPresentQuery: function OnSocketSubPresentQuery(sub, pData) {
        console.log("[GameFrame][OnSocketSubPresentQuery]");
    },
    OnGamePresentMessage: function OnGamePresentMessage(sub, pData) {
        console.log("[GameFrame][OnGamePresentMessage]");
        if (sub == GlobalDef.SUB_GF_PRESENT_RESULT) {
            this.OnSubMoblieGift(sub, pData);
        }
    },
    OnSubMoblieGift: function OnSubMoblieGift(sub, pData) {
        //赠送人气值(服务器消息)
        // struct CMD_GF_PresentMB
        // {
        //     BYTE								cbGiftID;                       //礼物ID
        //     WORD								wSendChairID;					//发送用户
        //     WORD                                wRecvChairID;					//接收用户
        //     WORD                                wGiftCount;                     //数量
        // };
        var present = {};
        present.cbGiftID = pData.readbyte();
        present.wSendChairID = pData.readword();
        present.wRecvChairID = pData.readword();
        present.wGiftCount = pData.readword();

        cc.director.emit("OnSubMoblieGift", { present: present });
        console.log("[GameFrame][OnSubMoblieGift] present = " + JSON.stringify(present, null, ' '));
    },
    sendLogonPacket: function sendLogonPacket() {
        console.log("[GameFrame][sendLogonPacket]");
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(game_cmd.MDM_GR_LOGON, game_cmd.SUB_GR_LOGON_MOBILE);
        logonData.pushword(GlobalUserData.wEncryptID);
        logonData.pushword(GlobalUserData.wCodeCheckID);
        logonData.pushdword(0);
        logonData.pushdword(GlobalUserData.dwUserID);

        var dwMobileSysType = 1;
        if (cc.sys.os == cc.sys.OS_IOS) {
            dwMobileSysType = 1;
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            dwMobileSysType = 2;
        }
        logonData.pushdword(dwMobileSysType);

        logonData.pushdword(1);
        logonData.pushstring(GlobalUserData.szPassWord, 33);
        console.log("[GameFrame][sendLogonPacket] password = " + GlobalUserData.szPassWord);
        logonData.pushstring("", 33);
        this.sendSocketData(logonData);
        // //手机登陆
        // struct CMD_GR_LogonByUserIDMobile
        // {
        //     WORD							wEncryptID;							//随机码1
        //     WORD							wCodeCheckID;						//随机码2
        //     DWORD							dwWeiXinCheckID;					//微信验证码
        //     DWORD							dwUserID;							//用户 I D
        //     DWORD							dwMobileSysType;					//手机操作系统类型(1苹果系统 2安卓系统)
        //     DWORD							dwMobileAppVersion;					//游戏APP版本号(与登陆大厅相同)
        //     TCHAR							szPassWord[PASS_LEN];				//登录密码
        //     TCHAR							szMobileMachine[COMPUTER_ID_LEN];	//机器序列号
        // };
    },
    //坐下请求
    sendSitDownPacket: function sendSitDownPacket(wTableID, wChairID, szPassWord) {
        //请求坐下
        // struct CMD_GR_UserSitReq
        // {
        //     BYTE							cbPassLen;							//密码长度
        //     //DWORD							dwAnswerID;							//回答 I D//兼容积分游戏入座问题
        //     WORD							wChairID;							//椅子位置
        //     WORD							wTableID;							//桌子位置
        //     TCHAR							szTablePass[PASS_LEN];				//桌子密码
        // };
        this.bChangeDesk = true;
        var sitData = CCmd_Data.create();
        sitData.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_SIT_REQ);
        var cbPassLen = 0;
        if (szPassWord) {
            cbPassLen = szPassWord.length;
        }

        sitData.pushbyte(cbPassLen);
        sitData.pushword(wChairID);
        sitData.pushword(wTableID);
        sitData.pushstring(szPassWord, GlobalDef.PASS_LEN);
        console.log("size1 = " + sitData.getDataSize());
        var sendSize = sitData.getDataSize() - GlobalDef.PASS_LEN + cbPassLen;
        console.log("size2 = " + sendSize);
        sitData.setDataSize(sendSize);

        this.sendSocketData(sitData);
    },
    //站起来
    sendStandupPacket: function sendStandupPacket() {
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_STANDUP_REQ);

        this.sendSocketData(data);
    },
    sendLeftGamePacket: function sendLeftGamePacket() {
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_LEFT_GAME_REQ);

        this.sendSocketData(data);
    },
    //发送准备
    sendUserReady: function sendUserReady() {
        var data = CCmd_Data.create();
        data.setcmdinfo(GlobalDef.MDM_GF_FRAME, GlobalDef.SUB_GF_USER_READY);

        this.sendSocketData(data);
    },
    //发送游戏信息
    sendGameOption: function sendGameOption() {
        //版本信息
        // struct CMD_GF_Info
        // {
        //     BYTE								bAllowLookon;					//旁观标志
        // };
        var data = CCmd_Data.create();
        data.setcmdinfo(GlobalDef.MDM_GF_FRAME, GlobalDef.SUB_GF_INFO);
        data.pushbyte(0);
        this.sendSocketData(data);
    },
    sendTextChat: function sendTextChat(msg, tagetUser, color) {
        //聊天结构
        // struct CMD_GR_UserChat
        // {
        //     WORD							wChatLength;						//信息长度
        //     COLORREF	dword					crFontColor;						//信息颜色
        //     DWORD							dwSendUserID;						//发送用户
        //     DWORD							dwTargetUserID;						//目标用户
        //     TCHAR							szChatMessage[128];		//聊天信息
        // };
        var msgLen = msg.length;
        tagetUser = tagetUser || 0;
        color = color || 16777215; //RGB(255,255,255)
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_CHAT);
        data.pushword(msgLen);
        data.pushdword(color);
        data.pushdword(GlobalUserData.dwUserID);
        data.pushdword(tagetUser);
        data.pushstring(msg, GlobalDef.MAX_CHAT_LEN);

        console.log("size1 = " + data.getDataSize());
        var sendSize = data.getDataSize() - GlobalDef.MAX_CHAT_LEN + msgLen;
        console.log("size2 = " + sendSize);
        data.setDataSize(sendSize);

        // this.sendSocketData(sitData);

        this.sendSocketData(data);
    },
    sendGift: function sendGift(wRecvChairID, cbGiftID, count, password) {
        //赠送结构
        // struct CMD_GF_Gift_MB
        // {
        //     WORD								wChairID;                       //接受者ID
        //     WORD								wGiftID;						//礼物	ID
        //     WORD                                wGiftCount;                     //礼物数量
        //     TCHAR                               szPassword[PASS_LEN];           //密码
        // };
        var data = CCmd_Data.create();
        data.setcmdinfo(GlobalDef.MDM_GF_PRESENT, GlobalDef.SUB_GF_FLOWER_MB);
        data.pushword(wRecvChairID);
        data.pushword(cbGiftID);
        data.pushword(count);
        data.pushstring(password, GlobalDef.PASS_LEN);

        this.sendSocketData(data);
    },
    onUpDateTableUser: function onUpDateTableUser(tableid, chairid, useritem) {
        var id = tableid;
        var idex = chairid;
        if (!this._tableUserList[id]) {
            this._tableUserList[id] = {};
        }
        if (useritem) {
            this._tableUserList[id][idex] = useritem;
        } else {
            this._tableUserList[id][idex] = undefined;
        }
    },
    //获取桌子用户
    getTableUserItem: function getTableUserItem(tableid, chairid) {
        var id = tableid;
        var idex = chairid;
        if (this._tableUserList[id]) {
            return this._tableUserList[id][idex];
        }
    },
    getTableInfo: function getTableInfo(index) {
        if (index > 0) {
            return this._tableStatus[index];
        }
    },
    getChairCount: function getChairCount() {
        return this._wChairCount;
    },
    getTableCount: function getTableCount() {
        return this._wTableCount;
    },
    //获取桌子ID
    getTableID: function getTableID() {
        return this._wTableID;
    },
    //获取椅子ID
    getChairID: function getChairID() {
        return this._wChairID;
    },
    //获取游戏状态
    getGameStatus: function getGameStatus() {
        return this._cbGameStatus;
    },
    //设置游戏状态
    setGameStatus: function setGameStatus(cbGameStatus) {
        this._cbGameStatus = cbGameStatus;
    },
    //获取自己游戏信息
    getMeUserItem: function getMeUserItem() {
        return this._userList[GlobalUserData.dwUserID];
    },
    searchUserByUserID: function searchUserByUserID(dwUserID) {
        return this._userList[dwUserID];
    },
    onRemoveUser: function onRemoveUser(dwUserID) {
        this._userList[dwUserID] = undefined;
    },
    onResetGameEngine: function onResetGameEngine() {}
});

cc._RFpop();
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","CMD_ZaJinHua":"CMD_ZaJinHua","GameServerItem":"GameServerItem","GameUserItem":"GameUserItem","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"GameLogic":[function(require,module,exports){
"use strict";
cc._RFpush(module, '585cbDgznFPJ6wkcN1FVK5u', 'GameLogic');
// Script/game/GameLogic.js

"use strict";

var GameLogic = {};
//宏定义
GameLogic.MAX_COUNT = 3; //最大数目
GameLogic.DRAW = 2; //和局类型

//数值掩码
GameLogic.LOGIC_MASK_COLOR = 0xF0; //花色掩码
GameLogic.LOGIC_MASK_VALUE = 0x0F; //数值掩码

//扑克类型
GameLogic.CT_SINGLE = 1; //单牌类型
GameLogic.CT_DOUBLE = 2; //对子类型
GameLogic.CT_SHUN_ZI = 3; //顺子类型
GameLogic.CT_JIN_HUA = 4; //金花类型
GameLogic.CT_SHUN_JIN = 5; //顺金类型
GameLogic.CT_BAO_ZI = 6; //豹子类型
GameLogic.CT_SPECIAL = 7; //特殊类型

//获取数值
GameLogic.getCardValue = function (cbCardData) {
    return cbCardData & GameLogic.LOGIC_MASK_VALUE;
};
//获取花色
GameLogic.getCardColor = function (cbCardData) {
    return cbCardData & GameLogic.LOGIC_MASK_COLOR;
};
//逻辑数值
GameLogic.getCardLogicValue = function (cbCardData) {
    var cbCardValue = GameLogic.getCardValue(cbCardData);

    if (cbCardValue == 1) {
        cbCardValue = cbCardValue + 13;
    }
    return cbCardValue;
};
GameLogic.sortCard = function (cardData) {
    var cardDataTmp = [];
    for (var index = 0; index < cardData.length; index++) {
        cardDataTmp[index] = cardData[index];
    }
    //先排颜色
    // for (var i = 0; i < cardDataTmp.length; i++) {
    //     for (var j = 0; j < cardDataTmp.length - i; j++) {
    //         if (cardDataTmp[j] < cardDataTmp[j + 1]) {
    //             [cardDataTmp[j], cardDataTmp[j + 1]] = [cardDataTmp[j + 1], cardDataTmp[j]];
    //         }
    //     } 
    // }
    cardDataTmp.sort(function (a, b) {
        return a < b;
    });
    //再排大小
    // for (var i = 0; i < cardDataTmp.length; i++) {
    //     for (var j = 0; j < cardDataTmp.length - i; j++) {
    //         if (GameLogic.getCardLogicValue(cardDataTmp[j]) < GameLogic.getCardLogicValue(cardDataTmp[j + 1]) ) {
    //             [cardDataTmp[j], cardDataTmp[j + 1]] = [cardDataTmp[j + 1], cardDataTmp[j]];
    //         }
    //     }
    // }
    cardDataTmp.sort(function (a, b) {
        return GameLogic.getCardLogicValue(a) < GameLogic.getCardLogicValue(b);
    });
    return cardDataTmp;
};
//获得牌型
GameLogic.getCardType = function (card) {
    if (card.length !== GameLogic.MAX_COUNT) {
        return false;
    }
    var cardData = GameLogic.sortCard(card);
    var cbSameColor = true;
    var bLineCard = true;
    var cbFirstColor = GameLogic.getCardColor(cardData[0]);
    var cbFirstValue = GameLogic.getCardLogicValue(cardData[0]);

    //牌型分析
    for (var index = 0; index < cardData.length; index++) {
        if (cbFirstColor !== GameLogic.getCardColor(cardData[index])) {
            cbSameColor = false;
        }
        if (cbFirstValue !== GameLogic.getCardLogicValue(cardData[index] + index)) {
            bLineCard = false;
        }
        if (cbSameColor === false && bLineCard === false) {
            break;
        }
    }
    //特殊A23
    if (false === bLineCard) {
        var bOne = false;
        var bTwo = false;
        var bThree = false;
        for (var index = 0; index < cardData.length; index++) {
            if (GameLogic.getCardValue(cardData[index]) === 1) {
                bOne = true;
            } else if (GameLogic.getCardValue(cardData[index]) === 2) {
                bTwo = true;
            } else if (GameLogic.getCardValue(cardData[index]) === 3) {
                bThree = true;
            }

            if (bOne && bTwo && bThree) {
                bLineCard = true;
            }
        }
    }
    //顺金类型
    if (cbSameColor && bLineCard) {
        return GameLogic.CT_SHUN_JIN;
    }
    //顺子类型
    if (false === cbSameColor && bLineCard) {
        return GameLogic.CT_SHUN_ZI;
    }
    //金花类型
    if (cbSameColor && false === bLineCard) {
        return GameLogic.CT_JIN_HUA;
    }
    //牌型分析
    var bDouble = false;
    var bPanther = true;
    //对牌分析
    for (var i = 0; i < cardData.length - 1; i++) {
        for (var j = i + 1; j < cardData.length; j++) {
            if (GameLogic.getCardLogicValue(cardData[i]) === GameLogic.getCardLogicValue(cardData[j])) {
                bDouble = true;
                break;
            }
        }
        if (bDouble) {
            break;
        }
    }
    //三条(豹子)分析
    for (var i = 0; i < cardData.length; i++) {
        if (bPanther && cbFirstValue !== GameLogic.getCardLogicValue(cardData[i])) {
            bPanther = false;
        }
    }
    //对子和豹子判断
    if (bDouble) {
        if (bPanther) {
            return GameLogic.CT_BAO_ZI;
        } else {
            return GameLogic.CT_DOUBLE;
        }
    }
    //特殊235
    var bTwo = false;
    var bThree = false;
    var bFive = false;
    for (var index = 0; index < cardData.length; index++) {
        if (GameLogic.getCardValue(cardData[index]) === 2) {
            bTwo = true;
        } else if (GameLogic.getCardValue(cardData[index]) === 3) {
            bThree = true;
        } else if (GameLogic.getCardValue(cardData[index]) === 5) {
            bFive = true;
        }

        if (bTwo && bThree && bFive) {
            return GameLogic.CT_SPECIAL;
        }
    }

    return GameLogic.CT_SINGLE;
};

module.exports = GameLogic;

cc._RFpop();
},{}],"GameModel":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7cbc6uBjwNDxLohz5dvmQIV', 'GameModel');
// Script/gameModel/GameModel.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");

var AudioMng = require("AudioMng");
var GameModel = cc.Class({
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
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("[GameModel][onLoad]");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode) {
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
        }
        this.onInitGameEngine();
        this.m_bOnGame = false;
        this.m_cbGameStatus = -1;
        AudioMng.playMusic("bgm_room");
    },
    onDestroy: function onDestroy() {
        AudioMng.stopMusic();
        this._gameFrame.onCloseSocket();
        cc.sys.garbageCollect();
    },
    onEnable: function onEnable(params) {
        console.log("[GameModel][onEnable]");
        cc.director.on("onEventGameMessage", this.onEventGameMessage, this);
        cc.director.on("onEventGameScene", this.onEventGameScene, this);
        cc.director.on("onEventUserEnter", this.onEventUserEnter, this);
        cc.director.on("onEventUserStatus", this.onEventUserStatus, this);
        cc.director.on("onEventUserScore", this.onEventUserScore, this);
        cc.director.on("onExitRoom", this.onExitRoom, this);
        cc.director.on("onExitTable", this.onExitTable, this);
        cc.director.on("OnSubMoblieGift", this.OnSubMoblieGift, this);
    },
    onDisable: function onDisable(params) {
        console.log("[GameModel][onDisable]");
        cc.director.off("onEventGameMessage", this.onEventGameMessage, this);
        cc.director.off("onEventGameScene", this.onEventGameScene, this);
        cc.director.off("onEventUserEnter", this.onEventUserEnter, this);
        cc.director.off("onEventUserStatus", this.onEventUserStatus, this);
        cc.director.off("onEventUserScore", this.onEventUserScore, this);
        cc.director.off("onExitRoom", this.onExitRoom, this);
        cc.director.off("onExitTable", this.onExitTable, this);
        cc.director.off("OnSubMoblieGift", this.OnSubMoblieGift, this);
    },
    //初始化游戏数据
    onInitGameEngine: function onInitGameEngine() {
        console.log("[GameModel][onInitGameEngine]");
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
    },
    //重置框架
    onResetGameEngine: function onResetGameEngine() {
        console.log("[GameModel][onResetGameEngine]");
        this.killGameClock();
        this.m_bOnGame = false;
    },
    //退出询问
    onQueryExitGame: function onQueryExitGame() {
        // this.onExitTable();
        if (this.m_bOnGame) {
            GlobalFun.showAlert({
                message: "陛下，打算临战退缩吗？强退将会被笨笨的机器人托管，确定离开？",
                btn: [{
                    name: "取消"
                }, {
                    name: "确定",
                    callback: function callback() {
                        cc.director.emit("onExitRoom");
                    }
                }]
            });
        } else {
            this.onExitRoom();
        }
    },
    standUpAndQuit: function standUpAndQuit() {},
    //退出桌子
    onExitTable: function onExitTable() {
        console.log("[GameModel][onExitTable]");
        this.killGameClock();

        var myItem = this.getMeUserItem();
        if (myItem && myItem.cbUserStatus > GlobalDef.US_FREE) {
            this._gameFrame.sendStandupPacket();
            return;
        }
    },
    onExitRoom: function onExitRoom() {
        this._gameFrame.sendStandupPacket();
        this._gameFrame.sendLeftGamePacket();
        // this._gameFrame.onCloseSocket();
        this.killGameClock();
    },
    onKeyBack: function onKeyBack() {
        this.onQueryExitGame();
    },
    //获取自己椅子
    getMeChairID: function getMeChairID() {
        return this._gameFrame.getChairID();
    },
    //获取自己桌子
    getMeTableID: function getMeTableID() {
        return this._gameFrame.getTableID();
    },
    getMeUserItem: function getMeUserItem() {
        return this._gameFrame.getMeUserItem();
    },
    // 椅子号转视图位置,注意椅子号从0~nChairCount-1,返回的视图位置从0~nChairCount-1
    switchViewChairID: function switchViewChairID(chair) {
        var viewID = GlobalDef.INVALID_CHAIR;
        var nChairCount = this._gameFrame.getChairCount();
        var nChairID = this.getMeChairID();
        if (chair !== GlobalDef.INVALID_CHAIR && chair < nChairCount) {
            viewID = (chair + nChairCount - nChairID) % nChairCount; //+ 1;
        }
        console.log("[GameModel][switchViewChairID] + [nChairCount,nChairID,chair,viewID] = " + [nChairCount, nChairID, chair, viewID]);
        return viewID;
    },
    //是否合法视图ID
    isValidViewID: function isValidViewID(viewID) {
        var nChairCount = this._gameFrame.getChairCount();
        return viewID >= 0 && viewID < nChairCount;
    },
    //设置计时器
    setGameClock: function setGameClock(chair, id, time) {
        if (!cc.director.getScheduler().isScheduled(this.onClockUpdata, this)) {
            cc.director.getScheduler().schedule(this.onClockUpdata, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
        }
        this._ClockChair = chair;
        this._ClockID = id;
        this._ClockTime = time;
        this._ClockViewChair = this.switchViewChairID(chair);
        this.onUpdateClockView();
    },
    //关闭计时器
    killGameClock: function killGameClock(notView) {
        console.log("[GameModel][killGameClock]");
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
        if (cc.director.getScheduler().isScheduled(this.onClockUpdata, this)) {
            console.log("[GameModel][killGameClock] unschedule this.onClockUpdata");
            cc.director.getScheduler().unschedule(this.onClockUpdata, this);
        }
        if (!notView) {
            this.onUpdateClockView();
        }
    },
    getClockViewID: function getClockViewID() {
        return this._ClockViewChair;
    },
    //计时器更新
    onClockUpdata: function onClockUpdata(dt) {
        // console.log("---------------------------dt = " + dt);
        // console.log("[GameModel][onClockUpdata] chair = " + this._ClockChair + " time = " + this._ClockTime + " id = " + this._ClockID);
        if (this._ClockID !== GlobalDef.INVALID_ITEM) {
            this._ClockTime = this._ClockTime - 1;
            var ret = this.onEventGameClockInfo(this._ClockChair, this._ClockTime, this._ClockID);
            if (ret === true || this._ClockTime < 1) {
                console.log("[GameModel][onClockUpdata] [ret,clocktime] = " + [ret, this._ClockTime]);
                this.killGameClock();
            }
        }
        this.onUpdateClockView();
    },
    //更新计时器显示
    onUpdateClockView: function onUpdateClockView() {
        // onUpdateClockView
        // console.log("[GameModel][onUpdateClockView] clockTime = " + this._ClockTime + " viewChair = " + this._ClockViewChair);
    },
    //用户状态 
    onEventUserStatus: function onEventUserStatus(params) {
        // params = {userItem:,newStatus,oldStatus,}
        console.log("[GameModel][onEventUserStatus]");
        var userItem = params.detail.userItem;
        var newStatus = params.detail.newStatus;
        var oldStatus = params.detail.oldStatus;
        var myTable = this.getMeTableID();
        var myChair = this.getMeChairID();

        if (myTable === undefined || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        console.log("[GameModel][onEventUserStatus] myTable = " + myTable + " old = " + JSON.stringify(oldStatus, null, ' ') + " new = " + JSON.stringify(newStatus, null, ' '));
        //旧的清除
        if (oldStatus.wTableID === myTable) {
            var viewID = this.switchViewChairID(oldStatus.wChairID);
            if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
                console.log("[GameModel][onEventUserStatus] 旧的清除");
                // onUpdateUser
                if (this._gameView && this._gameView.onUpdateUser) {
                    this._gameView.onUpdateUser(viewID, undefined);
                }
            }
        }
        //更新新状态
        if (newStatus.wTableID === myTable) {
            var viewID = this.switchViewChairID(newStatus.wChairID);
            if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
                console.log("[GameModel][onEventUserStatus] 更新新状态");
                if (this._gameView && this._gameView.onUpdateUser) {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //用户积分
    onEventUserScore: function onEventUserScore(params) {
        // params = {userScore,}
        var userItem = params.detail.userItem;
        var myTable = this.getMeTableID();
        console.log("[GameModel][onEventUserScore] myTable = " + myTable + " useritem = " + JSON.stringify(userItem, null, ' '));
        if (myTable === undefined || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        if (myTable === userItem.wTableID) {
            var viewID = this.switchViewChairID(userItem.wChairID);
            if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
                if (this._gameView && this._gameView.onUpdateUser) {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //用户进入
    onEventUserEnter: function onEventUserEnter(params) {
        // params = {wTableID,wChairID,userItem,}
        var wTableID = params.detail.wTableID;
        var wChairID = params.detail.wChairID;
        var userItem = params.detail.userItem;

        var myTable = this.getMeTableID();
        if (myTable === undefined || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        if (myTable === wTableID) {
            var viewID = this.switchViewChairID(wChairID);
            if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
                if (this._gameView && this._gameView.onUpdateUser) {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //魅力赠送
    OnSubMoblieGift: function OnSubMoblieGift(params) {
        // present.cbGiftID 
        // present.wSendChairID 
        // present.wRecvChairID
        // present.wGiftCount
        var present = params.detail.present;
        if (present && this._gameView && this._gameView.showSendPresent) {
            this._gameView.showSendPresent(present.wSendChairID, present.wRecvChairID, present.cbGiftID, present.wGiftCount);
        }
    },
    //发送准备
    sendUserReady: function sendUserReady() {
        this._gameFrame.sendUserReady();
    },
    sendTextChat: function sendTextChat(msg, tagetUser, color) {
        this._gameFrame.sendTextChat(msg, tagetUser, color);
    },
    sendGift: function sendGift(wRecvChairID, cbGiftID, count, password) {
        this._gameFrame.sendGift(wRecvChairID, cbGiftID, count, password);
    },
    //发送数据
    sendData: function sendData(sub, dataBuf) {
        if (this._gameFrame) {
            dataBuf.setcmdinfo(GlobalDef.MDM_GF_GAME, sub);
            this._gameFrame.sendSocketData(dataBuf);
        }
    },

    //场景消息
    onEventGameScene: function onEventGameScene(params) {},
    //游戏消息
    onEventGameMessage: function onEventGameMessage(params) {},
    //计时器响应
    onEventGameClockInfo: function onEventGameClockInfo(chair, time, clockID) {}
});
module.exports = GameModel;

cc._RFpop();
},{"AudioMng":"AudioMng","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GamePresentConfirmView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f660cUpTU9CKI3tKBjUc/h4', 'GamePresentConfirmView');
// Script/game/GamePresentConfirmView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
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
        m_Label_nickname: cc.Label,
        m_Label_id: cc.Label,
        m_Label_presentname: cc.Label,
        m_Label_num: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_des: cc.Label

    },

    // use this for initialization
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {},
    close: function close(callback) {
        if (callback && typeof callback == "function") {
            callback();
        }
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickConfirm: function onClickConfirm() {
        this.close(this.callback);
    },
    init: function init(params) {
        this.callback = params.callback;
        var itemInfo = params.itemInfo;
        var userItem = params.userItem;
        var sendNum = params.sendNum;
        var szNickName = userItem.szName;
        var dwUserID = userItem.dwUserID;
        var goldVal = itemInfo.gold;
        var costGold = goldVal * sendNum;
        var llInsureScore = GlobalUserData.llInsureScore;
        var leftGold = llInsureScore - costGold;

        this.m_Label_nickname.string = szNickName;
        this.m_Label_id.string = dwUserID;
        this.m_Label_presentname.string = itemInfo.name;
        this.m_Label_num.string = sendNum;
        this.m_Label_gold.string = costGold;
        this.m_Label_charm.string = itemInfo.charm * sendNum + "魅力";

        var szDes = "说明：您的银行存款" + llInsureScore + ",购买礼物后存款剩余" + leftGold + ".";
        this.m_Label_des.string = szDes;
    }
});

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"GameScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6ad91+qsMxCQ6GFQhDN2oXK', 'GameScene');
// Script/game/GameScene.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
var GameLogic = require("GameLogic");
var AudioMng = require("AudioMng");
var SoundEffectType = cc.Enum({
    kSoundEffectXiaZhu: 1,
    kSoundEffectGenZhu: 2,
    kSoundEffectJiaZhu: 3,
    kSoundEffectKanPai: 4,
    kSoundEffectFaQiBiPai: 5,
    kSoundEffectBiPaiShiBai: 6,
    kSoundEffectQiPai: 7
});
cc.Class({
    extends: GameModel,

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        // var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        // if (GameFrameNode){
        //     this._gameFrame = GameFrameNode.getComponent("GameFrame");
        // }
        this._super();
        this.m_lMaxTurnCount = 8;
        this._gameView = this.node.getComponent("GameView");
    },
    onDestroy: function onDestroy() {
        this._super();
    },
    onEnable: function onEnable(params) {
        cc.director.on("sendGift", this.onSendGift, this);
        this._super();
    },
    onDisable: function onDisable(params) {
        cc.director.off("sendGift", this.onSendGift, this);
        this._super();
        // this.onExitRoom();
    },
    onSendGift: function onSendGift(params) {
        params = params.detail || params;
        var userItem = params.userItem;
        var cbGiftID = params.cbGiftID;
        var count = params.count;
        var szPassword = params.szPassword;
        if (userItem && userItem.wTableID === this.getMeTableID()) {
            this.sendGift(userItem.wChairID, cbGiftID, count, cc.md5Encode(szPassword));
        } else {
            GlobalFun.showToast("玩家已离开当前桌位，无法发送礼物！");
        }
    },
    onExitRoom: function onExitRoom() {
        this._super();
        cc.director.loadScene("PlazaScene");
    },
    onInitGameEngine: function onInitGameEngine() {
        this._super();
        console.log("[GameScene][onInitGameEngine]");
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR; //当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR; //庄家用户

        this.m_cbPlayStatus = [0, 0, 0, 0, 0]; //游戏状态
        this.m_lTableScore = [0, 0, 0, 0, 0]; //下注数目

        this.m_lMaxCellScore = 0; //单元上限
        this.m_lCellScore = 0; //单元下注

        this.m_lCurrentTimes = 0; //当前倍数
        this.m_lUserMaxScore = 0; //最大分数
        this.m_lCurrentTurn = 0; //当前轮数

        this.m_bLookCard = [false, false, false, false, false]; //看牌动作

        this.m_wLostUser = GlobalDef.INVALID_CHAIR; //比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR; //胜利用户

        this.m_llAllTableScore = 0;
        this.m_bLastAddOver = false; //是否孤注一掷结束

        // this.setGameClock(zjh_cmd.MY_VIEWID, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
    },
    onResetGameEngine: function onResetGameEngine() {
        this._super();
        this._gameView.onResetView();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR; //当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR; //庄家用户
        this.m_cbPlayStatus = [0, 0, 0, 0, 0]; //游戏状态
        this.m_lTableScore = [0, 0, 0, 0, 0]; //下注数目
        this.m_lMaxCellScore = 0; //单元上限
        this.m_lCellScore = 0; //单元下注
        this.m_lCurrentTimes = 0; //当前倍数
        this.m_lUserMaxScore = 0; //最大分数
        this.m_lCurrentTurn = 0; //当前轮数
        this.m_bLookCard = [false, false, false, false, false]; //看牌动作
        this.m_wLostUser = GlobalDef.INVALID_CHAIR; //比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR; //胜利用户
        this.m_llAllTableScore = 0;
        this.m_bLastAddOver = false; //是否孤注一掷结束
        // this.setGameClock(zjh_cmd.MY_VIEWID, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
    },
    //设置计时器
    setGameClock: function setGameClock(chair, id, time) {
        this._super(chair, id, time);
        var viewID = this.getClockViewID();
        if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
            //时间进度条
            // this.onEventGameClockInfo(viewID, id);
            var progressTime = time;
            var self = this;
            var progressBar = this._gameView.m_timeProgress[viewID];
            progressBar.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.05), cc.callFunc(function () {
                progressTime -= 0.05;
                var progress = 1.0 * progressTime / zjh_cmd.TIME_START_GAME;
                // console.log("[setGameClock][scheduleUpdate] ->" + [progressTime]);
                progressBar.progress = progress;
            }))));
        }
    },
    //关闭计时器
    killGameClock: function killGameClock(notView) {
        var viewID = this.getClockViewID();
        if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
            if (this._gameView.m_timeProgress[viewID]) {
                this._gameView.m_timeProgress[viewID].progress = 0;
                this._gameView.m_timeProgress[viewID].node.stopAllActions();
            }
        }
        this._super(notView);
    },
    //获得当前正在玩的玩家数量
    getPlayingNum: function getPlayingNum() {
        var num = 0;
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            if (this.m_cbPlayStatus[index] === 1) {
                num++;
            }
        }
        return num;
    },
    //时钟处理
    onEventGameClockInfo: function onEventGameClockInfo(chair, time, clockID) {
        // console.log("[GameScene][onEventGameClockInfo] chair = " + chair + " time = " + time + " clockID = " + clockID);
        if (chair !== GlobalDef.INVALID_CHAIR && chair !== this.getMeChairID()) {
            return;
        }
        if (clockID === zjh_cmd.IDI_START_GAME) {
            if (time == 0) {
                // this.onExitTable();
                this.onStartGame(true);
                return true;
            }
        } else if (clockID === zjh_cmd.IDI_DISABLE) {
            if (time == 0) {
                return true;
            }
        } else if (clockID === zjh_cmd.IDI_USER_ADD_SCORE) {
            if (time == 0) {
                if (this.m_wCurrentUser === this.getMeChairID()) {
                    this.onGiveUp();
                    return true;
                }
            }
        } else if (clockID === zjh_cmd.IDI_USER_COMPARE_CARD) {
            if (time == 0) {
                this.onAutoCompareCard();
                return true;
            }
        }
    },
    onUpdateClockView: function onUpdateClockView() {
        this._super();
        if (this._gameView && this._gameView.onUpdateClockView) {
            this._gameView.onUpdateClockView(this._ClockViewChair, this._ClockTime);
        }
    },
    //场景消息
    onEventGameScene: function onEventGameScene(params) {
        // params = {cbGameStatus,pData,}
        console.log("[GameScene][onEventGameScene]");
        var cbGameStatus = params.detail.cbGameStatus;
        var pData = params.detail.pData;
        //初始化已有玩家
        // this.onResetGameEngine();
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
            // if (userItem) {
            var wViewChairID = this.switchViewChairID(index);
            this._gameView.onUpdateUser(wViewChairID, userItem);
            console.log("[GameScene][onEventGameScene] wViewChairID = " + wViewChairID + " userItem = " + JSON.stringify(userItem, null, ' '));
            // }
        }
        switch (cbGameStatus) {
            case GlobalDef.GS_FREE:
                console.log("[GameScene][onEventGameScene] cbGameStatus = GS_FREE");
                //游戏状态
                // struct CMD_S_StatusFree
                // {
                //     LONG								lCellScore;							//基础积分
                // };
                this.m_bOnGame = false;
                this.m_lCellScore = pData.readint();
                this._gameView.setCellScore(this.m_lCellScore);
                // showReady();显示准备按钮
                this._gameView.m_Button_ready.node.active = this.getMeUserItem().cbUserStatus === GlobalDef.US_SIT;
                this.setGameClock(GlobalDef.INVALID_CHAIR, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME);
                break;
            case GlobalDef.GS_PLAYING:
                // struct CMD_S_StatusPlay
                // {
                //     //加注信息
                //     LONG								lMaxCellScore;						//单元上限
                //     LONG								lCellScore;							//单元下注
                //     LONG								lCurrentTimes;						//当前倍数
                //     LONG								lUserMaxScore;						//用户分数上限

                //     //状态信息
                //     WORD								wBankerUser;						//庄家用户
                //     WORD				 				wCurrentUser;						//当前玩家
                //     BYTE								cbPlayStatus[GAME_PLAYER];			//游戏状态
                //     bool								bMingZhu[GAME_PLAYER];				//看牌状态
                //     LONG								lTableScore[GAME_PLAYER];			//下注数目

                //     //扑克信息
                //     BYTE								cbHandCardData[MAX_COUNT];			//扑克数据

                //     //状态信息
                //     bool								bCompareState;						//比牌状态
                //     LONG                                lCurrentTurn;                       //当前轮数
                // };
                var myChair = this.getMeChairID();
                var playStatus = {};
                playStatus.lMaxCellScore = pData.readint();
                playStatus.lCellScore = pData.readint();
                playStatus.lCurrentTimes = pData.readint();
                playStatus.lUserMaxScore = pData.readint();

                playStatus.wBankerUser = pData.readword();
                playStatus.wCurrentUser = pData.readword();
                playStatus.cbPlayStatus = [];
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    playStatus.cbPlayStatus[index] = pData.readbyte();
                }
                playStatus.bMingZhu = [];
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    playStatus.bMingZhu[index] = pData.readbool();
                }
                playStatus.lTableScore = [];
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    playStatus.lTableScore[index] = pData.readint();
                }
                playStatus.cbHandCardData = pData.readword();
                for (var index = 0; index < zjh_cmd.MAX_COUNT; index++) {
                    playStatus.cbHandCardData[index] = pData.readbyte();
                }
                playStatus.bCompareState = pData.readbool();
                playStatus.lCurrentTurn = pData.readint();

                this.m_lMaxCellScore = playStatus.lMaxCellScore;
                this.m_lCellScore = playStatus.lCellScore;
                this.m_lCurrentTimes = playStatus.lCurrentTimes;
                this.m_lCurrentTurn = playStatus.lCurrentTurn;
                this.m_lUserMaxScore = playStatus.lUserMaxScore;
                this.m_wBankerUser = playStatus.wBankerUser;
                this.m_wCurrentUser = playStatus.wCurrentUser;
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    this.m_cbPlayStatus[index] = playStatus.cbPlayStatus[index];
                }
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    this.m_bLookCard[index] = playStatus.bMingZhu[index];
                }
                for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
                    this.m_lTableScore[index] = playStatus.lTableScore[index];
                }
                var cardData = [];
                for (var index = 0; index < zjh_cmd.MAX_COUNT; index++) {
                    cardData[index] = playStatus.cbHandCardData[index];
                }
                this.m_llAllTableScore = 0;

                //底注信息
                this._gameView.setCellScore(this.m_lCellScore);
                this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
                this._gameView.setMaxCellScore(this.m_lMaxCellScore);

                //庄家信息
                this._gameView.setBanker(this.switchViewChairID(this.m_wBankerUser));

                for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                    //视图位置
                    var viewID = this.switchViewChairID(i);
                    //手牌显示
                    if (this.m_cbPlayStatus[i] === 1) {
                        //todo
                        // this._gameView.m_userCard[viewID].area.active = 
                        if (i === myChair && this.m_bLookCard[myChair] === true) {
                            var cardIndex = [];
                            for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
                                cardIndex[k] = cardData[k]; //GameLogic.getCardColor(cardData[k]) * 13 + GameLogic.getCardValue(cardData[k]);
                            }
                            this._gameView.setUserCard(viewID, cardIndex);
                        } else {
                            this._gameView.setUserCard(viewID, [0xff, 0xff, 0xff]);
                        }
                    } else {
                        // this._gameView.userCard[viewID]
                        this._gameView.setUserCard(viewID);
                    }
                    //看牌显示
                    this._gameView.setLookCard(viewID, this.m_bLookCard[i]);
                    this._gameView.setUserTableScore(viewID, this.m_lTableScore[i]);
                    this.m_llAllTableScore += this.m_lTableScore[i];
                    this._gameView.playerJetton(viewID, this.m_lTableScore[i], true);

                    //是否弃牌
                    if (this.m_cbPlayStatus[i] !== 1 && this.m_lTableScore[i] > 0) {
                        // this._gameView.userCard
                        this._gameView.setUserGiveUp(viewID, true);
                    }
                }
                //总下注
                this._gameView.setAllTableScore(this.m_llAllTableScore);
                //todo
                //控件信息
                this._gameView.m_nodeBottom.active = false;
                if (!playStatus.bCompareState) {
                    this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);

                    if (this.getMeChairID() === this.m_wCurrentUser) {
                        this.updateControl();
                    }
                } else {
                    if (this.getMeChairID() === this.m_wCurrentUser) {
                        //选择玩家比牌
                        var compareStatus = [false, false, false, false, false];
                        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                            if (this.m_cbPlayStatus[i] === 1 && i !== myChair) {
                                compareStatus[this.switchViewChairID(i)] = true;
                            }
                        }
                        this._gameView.setCompareCard(true, compareStatus);
                        //设置时间
                        this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_COMPARE_CARD, zjh_cmd.TIME_USER_COMPARE_CARD);
                    } else {
                        this._gameView.setCompareCard(false);
                        //设置时间
                        this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_DISABLE, zjh_cmd.TIME_USER_COMPARE_CARD);
                    }
                }
                break;
            default:
                break;
        }
    },
    onEventGameMessage: function onEventGameMessage(params) {
        var sub = params.detail.sub;
        var pData = params.detail.pData;
        console.log("[GameScene][onEventGameMessage] pData len = " + pData.getDataSize());
        if (!this._eventGameMessageCallback) {
            var _eventGameMessageCall;

            this._eventGameMessageCallback = (_eventGameMessageCall = {}, _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GAME_START, this.onSubGameStart), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_ADD_SCORE, this.onSubAddScore), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_LOOK_CARD, this.onSubLookCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_COMPARE_CARD, this.onSubCompareCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_OPEN_CARD, this.onSubOpenCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GIVE_UP, this.onSubGiveUp), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_PLAYER_EXIT, this.onSubPlayerExit), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GAME_END, this.onSubGameEnd), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_WAIT_COMPARE, this.onSubWaitCompare), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_LAST_ADD, this.onSubLastAdd), _eventGameMessageCall);
        }
        if (this._eventGameMessageCallback && this._eventGameMessageCallback[sub]) {
            var fun = this._eventGameMessageCallback[sub];
            fun.call(this, sub, pData);
        } else {
            console.log("[GameScene][onEventGameMessage] sub = " + sub + " not find");
        }
    },
    onSubGameStart: function onSubGameStart(sub, pData) {
        console.log("[GameScene][onSubGameStart]");
        //游戏开始
        // struct CMD_S_GameStart
        // {
        //     //下注信息
        //     LONG								lMaxScore;							//最大下注
        //     LONG								lCellScore;							//单元下注
        //     LONG								lCurrentTimes;						//当前倍数
        //     LONG								lUserMaxScore;						//分数上限

        //     //用户信息
        //     WORD								wBankerUser;						//庄家用户
        //     WORD				 				wCurrentUser;						//当前玩家
        //     BYTE								cbPlayStatus[GAME_PLAYER];			//游戏状态
        // };
        var gameStart = {};
        gameStart.lMaxScore = pData.readint();
        gameStart.lCellScore = pData.readint();
        gameStart.lCurrentTimes = pData.readint();
        gameStart.lUserMaxScore = pData.readint();
        gameStart.wBankerUser = pData.readword();
        gameStart.wCurrentUser = pData.readword();
        gameStart.cbPlayStatus = [];
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            gameStart.cbPlayStatus[index] = pData.readbyte();
        }
        console.log("[GameScene][onSubGameStart] gameStart = " + JSON.stringify(gameStart, null, ' '));
        this.m_lMaxScore = gameStart.lMaxScore;
        this.m_lCellScore = gameStart.lCellScore;
        this.m_lUserMaxScore = gameStart.lUserMaxScore;
        this.m_wCurrentUser = gameStart.wCurrentUser;
        this.m_wBankerUser = gameStart.wBankerUser;
        this.m_isFirstAdd = true;
        this.m_lCurrentTurn = 0;
        this.m_lCurrentTimes = 1;
        this.m_llAllTableScore = 0;
        this.m_isFllowAlway = false;
        this.m_bLastAddOver = false;
        this.m_bOnGame = true;
        //显示庄家
        this._gameView.setBanker(this.switchViewChairID(this.m_wBankerUser));
        //显示底分
        this._gameView.setCellScore(this.m_lCellScore);
        this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
        this._gameView.setMaxCellScore(this.m_lMaxCellScore);
        //显示下注状态

        this.m_llAllTableScore = 0;
        this._gameView.cleanAllJettons();
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var wViewChairID = this.switchViewChairID(i);
            this.m_cbPlayStatus[i] = gameStart.cbPlayStatus[i];
            if (this.m_cbPlayStatus[i] === 1) {
                this.m_llAllTableScore += this.m_lCellScore;
                this.m_lTableScore[i] = this.m_lCellScore;
                //用户下注
                this._gameView.setUserTableScore(wViewChairID, this.m_lCellScore);
                //移动筹码
                this._gameView.playerJetton(wViewChairID, this.m_lTableScore[i]);
                //加注动作
                // this._gameView.playUserAnim("chip",viewID);
            }
        }
        //总计下注
        this._gameView.setAllTableScore(this.m_llAllTableScore);
        //发牌
        var delayCount = 1;
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            for (var j = 0; j < zjh_cmd.GAME_PLAYER; j++) {
                console.log("[GameScene][onSubGameStart] [this.m_wBankerUser,j,zjh_cmd.GAME_PLAYER] = " + [this.m_wBankerUser, j, zjh_cmd.GAME_PLAYER]);
                var chair = (this.m_wBankerUser + j) % zjh_cmd.GAME_PLAYER;
                console.log("[GameScene][onSubGameStart] chair = " + chair);
                if (this.m_cbPlayStatus[chair] === 1) {
                    this._gameView.sendCard(this.switchViewChairID(chair), i, delayCount * 0.1);
                    delayCount += 1;
                }
            }
        }

        this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);

        if (this.m_wCurrentUser === this.getMeChairID()) {
            this.updateControl();
        }
        AudioMng.playSFX("sfx_addscore");
    },
    onSubAddScore: function onSubAddScore(sub, pData) {
        console.log("[GameScene][onSubAddScore]");
        //用户下注
        // struct CMD_S_AddScore
        // {
        //     WORD								wCurrentUser;						//当前用户
        //     WORD								wAddScoreUser;						//加注用户
        //     WORD								wCompareState;						//比牌状态
        //     LONG								lAddScoreCount;						//加注数目
        //     LONG								lCurrentTimes;						//当前倍数
        //     LONG                                lCurrentTurn;                       //当前轮数
        //     BYTE                                cbLastAddScore;                     //是否孤注一掷
        // };
        var addScore = {};
        addScore.wCurrentUser = pData.readword();
        addScore.wAddScoreUser = pData.readword();
        addScore.wCompareState = pData.readword();
        addScore.lAddScoreCount = pData.readint();
        addScore.lCurrentTimes = pData.readint();
        addScore.lCurrentTurn = pData.readint();
        addScore.cbLastAddScore = pData.readbyte();

        var myChair = this.getMeChairID();
        var viewID = this.switchViewChairID(addScore.wAddScoreUser);

        this.m_wCurrentUser = addScore.wCurrentUser;
        if (this.m_lCurrentTimes < addScore.lCurrentTimes) {}
        // this._gameView.runAddTimesAnimate(viewID);


        //播放音效
        if (addScore.wCompareState === 0 && this.m_cbPlayStatus[addScore.wAddScoreUser]) {
            AudioMng.playSFX("sfx_addscore");
            var sfxType = SoundEffectType.kSoundEffectJiaZhu;
            if (this.m_isFirstAdd) {
                sfxType = SoundEffectType.kSoundEffectXiaZhu;
            } else if (this.m_lCurrentTimes === addScore.lCurrentTimes) {
                sfxType = SoundEffectType.kSoundEffectGenZhu;
            }
            this.playSound(sfxType, addScore.wAddScoreUser);
        }

        this.m_lCurrentTimes = addScore.lCurrentTimes;

        if (addScore.wAddScoreUser !== myChair) {
            this.killGameClock();
        }

        if (addScore.wAddScoreUser !== myChair) {
            this._gameView.playerJetton(viewID, addScore.lAddScoreCount);
            this.m_lTableScore[addScore.wAddScoreUser] += addScore.lAddScoreCount;
            this.m_llAllTableScore += addScore.lAddScoreCount;
            this._gameView.setUserTableScore(viewID, this.m_lTableScore[addScore.wAddScoreUser]);
            this._gameView.setAllTableScore(this.m_llAllTableScore);
        }
        //设置计时器
        if (addScore.wCompareState === 0 && this.m_wCurrentUser !== GlobalDef.INVALID_CHAIR) {
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
        }

        if (addScore.wCompareState === 0 && this.m_wCurrentUser === myChair) {
            this.m_lCurrentTurn = addScore.lCurrentTurn;
            this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
            this.updateControl();
        }
        this.m_isFirstAdd = false;
    },
    onSubLookCard: function onSubLookCard(sub, pData) {
        AudioMng.playSFX("sfx_lookcard");
        console.log("[GameScene][onSubLookCard]");
        //看牌数据包
        // struct CMD_S_LookCard
        // {
        //     WORD								wLookCardUser;						//看牌用户
        //     BYTE								cbCardData[MAX_COUNT];				//用户扑克
        //     BYTE                                cbLastAdd;                          //孤注一掷
        // };
        var lookCard = {};
        lookCard.wLookCardUser = pData.readword();
        lookCard.cbCardData = [];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            lookCard.cbCardData[i] = pData.readbyte();
        }
        lookCard.cbLastAdd = pData.readbyte();

        //看牌音效 
        this.playSound(SoundEffectType.kSoundEffectKanPai, lookCard.wLookCardUser);

        console.log("[GameScene][onSubLookCard] lookCard = " + JSON.stringify(lookCard, null, ' '));
        var viewID = this.switchViewChairID(lookCard.wLookCardUser);
        //看牌动作
        this._gameView.playUserAnim("chip", viewID);

        this._gameView.setLookCard(viewID, true);
        if (this.getMeChairID() === this.m_wCurrentUser) {
            this.updateControl();
        }
        console.log("[GameScene][onSubLookCard] [lookCard.wLookCardUser,this.getMeChairID()] = " + [lookCard.wLookCardUser, this.getMeChairID()]);
        if (lookCard.wLookCardUser == this.getMeChairID()) {
            var cardIndex = [];
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                cardIndex[i] = lookCard.cbCardData[i]; //GameLogic.getCardColor(lookCard.cbCardData[i]) * 13 + GameLogic.getCardValue(lookCard.cbCardData[i]);
            }
            this._gameView.setUserCard(viewID, cardIndex);
            this._gameView.setUserCardType(viewID, GameLogic.getCardType(cardIndex));
        }
    },
    onSubCompareCard: function onSubCompareCard(sub, pData) {
        console.log("[GameScene][onSubCompareCard]");
        //比牌数据包
        // struct CMD_S_CompareCard
        // {
        //     WORD								wCurrentUser;						//当前用户
        //     WORD								wCompareUser[2];					//比牌用户
        //     WORD								wLostUser;							//输牌用户
        //     LONG                                lCurrentTurn;                       //当前轮数
        //     BYTE                                cbLostCardData[MAX_COUNT];          //输家牌数据
        // };
        var compareCard = {};
        compareCard.wCurrentUser = pData.readword();
        compareCard.wCompareUser = [];
        for (var i = 0; i < 2; i++) {
            compareCard.wCompareUser[i] = pData.readword();
        }
        compareCard.wLostUser = pData.readword();
        compareCard.lCurrentTurn = pData.readint();
        compareCard.cbLostCardData = [];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            compareCard.cbLostCardData[i] = pData.readbyte();
        }

        this.m_wCurrentUser = compareCard.wCurrentUser;
        this.m_lCurrentTurn = compareCard.lCurrentTurn;
        this.m_wLostUser = compareCard.wLostUser;
        this.m_wWinnerUser = compareCard.wCompareUser[0] + compareCard.wCompareUser[1] - this.m_wLostUser;
        this.m_cbPlayStatus[this.m_wLostUser] = 0;

        this._gameView.setCompareCard(false);
        this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
        this.killGameClock();

        var self = this;
        var firstUser = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), compareCard.wCompareUser[0]);
        var secondUser = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), compareCard.wCompareUser[1]);
        this._gameView.compareCard(firstUser, secondUser, undefined, undefined, compareCard.wCompareUser[0] === this.m_wWinnerUser, function (params) {
            self.onFlushCardFinish();
            self.playSound(SoundEffectType.kSoundEffectBiPaiShiBai, self.m_wLostUser);
        });
        this.playSound(SoundEffectType.kSoundEffectFaQiBiPai, compareCard.wCompareUser[0]);
        AudioMng.playSFX("sfx_comparecard");
    },
    onFlushCardFinish: function onFlushCardFinish() {
        console.log("[onFlushCardFinish]time = ", Date.now());
        //todo
        var viewID = this.switchViewChairID(this.m_wLostUser);
        this._gameView.setUserLose(viewID, true);
        this._gameView.stopCompareCard();
        var count = this.getPlayingNum();
        if (count > 1) {
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
            if (this.m_wCurrentUser === this.getMeChairID()) {
                this.updateControl();
            }
        } else {
            var myChair = this.getMeChairID();
            if (this.m_cbPlayStatus[myChair] === 1 || myChair === this.m_wLostUser) {
                var data = CCmd_Data.create();
                this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
            }
        }
    },
    onSubOpenCard: function onSubOpenCard(sub, pData) {
        var _this = this;

        console.log("[GameScene][onSubOpenCard]");
        //开牌数据包
        // struct CMD_S_OpenCard
        // {
        //     WORD								wWinner;							//胜利用户
        // };
        var myChair = this.getMeChairID();
        //8轮结束开牌发送
        if (this.m_cbPlayStatus[myChair] === 1 && !this.m_bLastAddOver) {
            this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(function () {
                var data = CCmd_Data.create();
                //比牌结束定时器
                _this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
            })));
        }
    },
    onSubGiveUp: function onSubGiveUp(sub, pData) {
        console.log("[GameScene][onSubGiveUp]");
        //用户放弃
        // struct CMD_S_GiveUp
        // {
        //     WORD								wGiveUpUser;						//放弃用户
        // };
        var wGiveUpUser = pData.readword();
        var viewID = this.switchViewChairID(wGiveUpUser);
        this._gameView.setUserGiveUp(viewID, true);
        this.m_cbPlayStatus[wGiveUpUser] = 0;
        //弃牌音效
        this.playSound(SoundEffectType.kSoundEffectQiPai, wGiveUpUser);
        //弃牌动作
        this._gameView.playUserAnim("chip", viewID);
        //超时服务器自动放弃
        if (wGiveUpUser === this.getMeChairID()) {
            this.killGameClock();
            this._gameView.stopCompareCard();
            this._gameView.setCompareCard(false, undefined);
            this._gameView.m_chipBG.active = false;
            this._gameView.m_nodeBottom.active = false;
        }
    },
    onSubPlayerExit: function onSubPlayerExit(sub, pData) {
        console.log("[GameScene][onSubPlayerExit]");
        //用户退出
        // struct CMD_S_PlayerExit
        // {
        //     WORD								wPlayerID;							//退出用户
        // };
        var wPlayerID = pData.readword();
        var wViewChairID = this.switchViewChairID(wPlayerID);
        this.m_cbPlayStatus[wPlayerID] = 0;
        this._gameView.m_Node_player[wViewChairID].active = false;
    },
    onSubGameEnd: function onSubGameEnd(sub, pData) {
        var _this2 = this;

        console.log("[onSubGameEnd]time = ", Date.now());
        console.log("[GameScene][onSubGameEnd]");
        //游戏结束
        // struct CMD_S_GameEnd
        // {
        //     LONG								lGameTax;							//游戏税收
        //     LONG								lGameScore[GAME_PLAYER];			//游戏得分
        //     BYTE								cbCardData[GAME_PLAYER][MAX_COUNT];	//用户扑克
        //     WORD								wCompareUser[GAME_PLAYER][4];		//比牌用户
        //     WORD								wEndState;							//结束状态
        // };
        var winner;
        var gameEnd = {};
        gameEnd.lGameTax = pData.readint();
        gameEnd.lGameScore = [];
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            gameEnd.lGameScore[i] = pData.readint();
            if (gameEnd.lGameScore[i] > 0) {
                winner = i;
            }
        }
        gameEnd.cbCardData = [];
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            gameEnd.cbCardData[i] = [];
            for (var j = 0; j < zjh_cmd.MAX_COUNT; j++) {
                gameEnd.cbCardData[i][j] = pData.readbyte();
            }
        }
        gameEnd.wCompareUser = [];
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            gameEnd.wCompareUser[i] = [];
            for (var j = 0; j < 4; j++) {
                gameEnd.wCompareUser[i][j] = pData.readword();
            }
        }
        gameEnd.wEndState = pData.readword();

        this.m_bOnGame = false;
        this.killGameClock();
        var myChair = this.getMeChairID();
        //清理界面
        this._gameView.stopCompareCard();
        this._gameView.setCompareCard(false);
        this._gameView.m_chipBG.active = false;
        this._gameView.m_nodeBottom.active = false;
        // ......

        // var endShow;
        var saveType = [];
        //亮牌
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var viewID = this.switchViewChairID(i);
            if (gameEnd.lGameScore[i] !== 0) {
                saveType[i] = GameLogic.getCardType(gameEnd.cbCardData[i]);
                if (!(i === myChair && this.m_bLookCard[i])) {
                    this._gameView.setUserCard(viewID, gameEnd.cbCardData[i]);
                }
                if (gameEnd.lGameScore[i] > 0) {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.setUserCardType(viewID, saveType[i], "win_");
                } else {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.setUserCardType(viewID, saveType[i], "lose_");
                }
            } else {
                saveType[i] = 0;
                this._gameView.setUserTableScore(viewID);
            }
        }
        var delayTime = 1.0;
        //移动筹码
        var winViewID = this.switchViewChairID(winner);
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
            _this2._gameView.winTheChip(winViewID, gameEnd.lGameScore[winner]);
        })));
        //牌型动画，胜利失败动画&音效
        this._gameView.showCardTypeAnim(saveType[winner], function () {
            if (winner === myChair) {
                AudioMng.playSFX("sfx_gamewin");
                GlobalFun.playEffects(_this2.node, {
                    fileName: "yx_wlg3",
                    anim: "yx_win",
                    loop: false
                });
            } else {
                AudioMng.playSFX("sfx_gamelose");
                GlobalFun.playEffects(_this2.node, {
                    fileName: "yx_wlg3",
                    anim: "yx_lose",
                    loop: false
                });
            }
        });

        // for (var i = 0; i < 4; i++) {
        //     var wUserID = gameEnd.wCompareUser[myChair][i];
        //     if (wUserID && wUserID !== GlobalDef.INVALID_CHAIR) {
        //         var viewID = this.switchViewChairID(wUserID);
        //         var cardIndex = [];
        //         for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //             cardIndex[k] = gameEnd.cbCardData[wUserID][k];//GameLogic.getCardColor(gameEnd.cbCardData[wUserID][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[wUserID][k]);
        //         }
        //         this._gameView.setUserCard(viewID, cardIndex);
        //         this._gameView.setUserCardType(viewID, saveType[wUserID]);
        //         // this._gameView  ....
        //     }
        // }

        // if (gameEnd.wCompareUser[myChair][0] !== GlobalDef.INVALID_CHAIR || this.m_bLookCard[myChair] === true) {
        //     var cardIndex = [];
        //     for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //         cardIndex[k] = gameEnd.cbCardData[myChair][k];//GameLogic.getCardColor(gameEnd.cbCardData[myChair][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[myChair][k]);
        //     }
        //     // var myViewID 
        //     this._gameView.setUserCard(zjh_cmd.MY_VIEWID, cardIndex);
        //     this._gameView.setUserCardType(zjh_cmd.MY_VIEWID, saveType[myChair]);
        //     // this._gameView  ....
        // }

        // if (gameEnd.wEndState == 1) {
        //     if (this.m_cbPlayStatus[myChair] === 1) {
        //         for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
        //             if (this.m_cbPlayStatus[i] === 1) {
        //                 var cardIndex = [];
        //                 for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //                     cardIndex[k] = gameEnd.cbCardData[i][k];//GameLogic.getCardColor(gameEnd.cbCardData[i][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[i][k]);
        //                 }
        //                 var viewID = this.switchViewChairID(i);
        //                 this._gameView.setUserCard(viewID, cardIndex);
        //                 this._gameView.setUserCardType(viewID, saveType[i]);
        //                 // this._gameView  ....
        //             }

        //         }
        //     }
        // }

        // if (endShow) {
        //     // ...
        // }
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(function () {
            self.onResetGameEngine();
            self._gameView.m_Button_ready.node.active = true;
            self.setGameClock(GlobalDef.INVALID_CHAIR, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME);
            self.m_cbPlayStatus = [0, 0, 0, 0, 0];
        })));
    },
    onSubWaitCompare: function onSubWaitCompare(sub, pData) {
        console.log("[GameScene][onSubWaitCompare]");
        //等待比牌
        // struct CMD_S_WaitCompare
        // {
        //     WORD								wCompareUser;						//比牌用户
        // }; 
        var wCompareUser = pData.readword();
        if (wCompareUser !== this.m_wCurrentUser) {
            console.log("[GameScene][onSubWaitCompare] wCompareUser != m_wCurrentUser");
        }
        // if (this.m_wCurrentUser !== this.getMeChairID()) {
        //     this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_DISABLE, zjh_cmd.TIME_USER_COMPARE_CARD);
        // }
    },
    onSubLastAdd: function onSubLastAdd(sub, pData) {
        var _this3 = this;

        console.log("[GameScene][onSubLastAdd]");
        console.log("[onSubLastAdd]time = ", Date.now());

        //孤注一掷
        // struct CMD_S_LastAdd
        // {
        //     WORD                                wStartLastAddUser;
        //     WORD                                wCompareUser[GAME_PLAYER];
        //     WORD                                wLostUser[GAME_PLAYER];
        //     WORD                                wCurrentUser;
        //     LONG                                lCurrentTurn;
        // };
        var lastAdd = {};
        lastAdd.wStartLastAddUser = pData.readword();
        lastAdd.wCompareUser = [];
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            lastAdd.wCompareUser[i] = pData.readword();
        }
        lastAdd.wLostUser = [];
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            lastAdd.wLostUser[i] = pData.readword();
        }
        lastAdd.wCurrentUser = pData.readword();
        lastAdd.lCurrentTurn = pData.readint();

        this.m_lCurrentTurn = lastAdd.lCurrentTurn;
        this.m_wCurrentUser = lastAdd.wCurrentUser;

        var wStartLastAddUser = lastAdd.wStartLastAddUser;

        //播放孤注一掷动画
        GlobalFun.playEffects(this.node, {
            fileName: "yx_wlg3",
            anim: "yx_gzyz",
            loop: false
        });

        var delayTime = 1.6;
        //播放比牌动画
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (lastAdd.wCompareUser[i] !== GlobalDef.INVALID_CHAIR && lastAdd.wLostUser[i] !== GlobalDef.INVALID_CHAIR) {
                var self;

                (function () {
                    var wCompareUser = lastAdd.wCompareUser[i];
                    var wLostUser = lastAdd.wLostUser[i];
                    self = _this3;

                    var firstUser = _this3._gameFrame.getTableUserItem(_this3._gameFrame.getTableID(), wStartLastAddUser);
                    var secondUser = _this3._gameFrame.getTableUserItem(_this3._gameFrame.getTableID(), wCompareUser);
                    _this3.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
                        _this3.playSound(SoundEffectType.kSoundEffectFaQiBiPai, wStartLastAddUser);
                        AudioMng.playSFX("sfx_comparecard");
                        _this3._gameView.compareCard(firstUser, secondUser, undefined, undefined, wStartLastAddUser !== wLostUser, function name(params) {
                            console.log("[onSubLastAdd][onFlushCardFinish]time = ", Date.now());
                            self.onFlushCardFinish();
                            self.playSound(SoundEffectType.kSoundEffectBiPaiShiBai, wLostUser);
                        });
                    })));
                    delayTime += 1.5;
                })();
            }
        }
        //找到被淘汰的玩家
        if (this.m_wCurrentUser !== GlobalDef.INVALID_CHAIR) {
            for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                if (lastAdd.wCompareUser[i] !== GlobalDef.INVALID_CHAIR && lastAdd.wLostUser[i] !== GlobalDef.INVALID_CHAIR) {
                    var wLostUser = lastAdd.wLostUser[i];
                    this.m_cbPlayStatus[wLostUser] = 0;
                    //如果自己被淘汰
                    if (wLostUser === this.getMeChairID()) {
                        this.updateControl();
                    }
                    // this._gameView.setUserCard()
                }
            }
            this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
                if (_this3.m_wCurrentUser === _this3.getMeChairID()) {
                    _this3.updateControl();
                }
                _this3.setGameClock(_this3.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
            })));
        } else {
            this.m_bLastAddOver = true;
            if (this.m_cbPlayStatus[this.getMeChairID()]) {
                this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
                    var data = CCmd_Data.create();
                    _this3.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
                })));
            }
        }
    },
    // onClickChangeTable: function (params) {
    //     this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR)
    // },
    onClickQuit: function onClickQuit(params) {
        // this._gameFrame.sendStandupPacket();
        // cc.director.loadScene("PlazaScene");
        this.onQueryExitGame();
    },
    // sendData : function (sub, dataBuf) {
    //     if (this._gameFrame) {
    //         dataBuf.setcmdinfo(GlobalDef.MDM_GF_GAME, sub);
    //         this._gameFrame.sendSocketData(dataBuf);
    //     }
    // },
    //加注
    onSendAddScore: function onSendAddScore(lCurrentScore, bCompareCard) {
        //用户加注
        // struct CMD_C_AddScore
        // {
        //     LONG								lScore;								//加注数目
        //     WORD								wState;								//当前状态
        // };
        var dataBuf = CCmd_Data.create();
        dataBuf.pushint(lCurrentScore);
        dataBuf.pushword(bCompareCard && 1 || 0);
        this.sendData(zjh_cmd.SUB_C_ADD_SCORE, dataBuf);
    },
    //发送准备
    onStartGame: function onStartGame(bReady) {
        this.onResetGameEngine();
        if (bReady === true) {
            this.sendUserReady();
        }
    },
    onAutoFollow: function onAutoFollow() {
        if (this.getMeChairID() !== this.m_wCurrentUser) {
            return false;
        }
        if (!(this._gameView && this._gameView.bAutoFollow)) {
            return false;
        }
        var myChair = this.getMeChairID();
        var maxAddScore = this.m_lUserMaxScore - this.m_lTableScore[myChair];
        var followScore = this.m_lCurrentTimes * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
        if (maxAddScore < followScore) {
            this._gameView.onClickAutoFollowButton();
            return false;
        } else {
            //跟注
            this.addScore(0);
            return true;
        }
    },
    //自动比牌
    onAutoCompareCard: function onAutoCompareCard() {
        var myChair = this.getMeChairID();
        for (var i = 1; i < zjh_cmd.GAME_PLAYER; i++) {
            var chair = myChair - i;
            if (chair < 0) {
                chair += zjh_cmd.GAME_PLAYER;
            }
            console.log("[GameScene][onAutoCompareCard] [myChair,chair] = " + [myChair, chair]);
            if (this.m_cbPlayStatus[chair] == 1) {
                //发送比牌消息
                //比牌数据包
                // struct CMD_C_CompareCard
                // {	
                //     WORD								wCompareUser;						//比牌用户
                // };
                var dataBuf = CCmd_Data.create();
                dataBuf.pushword(chair);
                this.sendData(zjh_cmd.SUB_C_COMPARE_CARD, dataBuf);
                break;
            }
        }
    },
    //比牌操作
    onCompareCard: function onCompareCard() {
        var myChair = this.getMeChairID();
        if (myChair === undefined || myChair !== this.m_wCurrentUser) {
            return;
        }
        this._gameView.m_nodeBottom.active = false;
        var playerCount = this.getPlayingNum();

        if (playerCount < 2) {
            return;
        }

        this.killGameClock();

        var score = this.m_lCurrentTimes * this.m_lCellScore * (this.m_bLookCard[myChair] && 4 || 2);

        this.m_lTableScore[myChair] += score;
        this.m_llAllTableScore += score;
        this._gameView.playerJetton(zjh_cmd.MY_VIEWID, score);
        this._gameView.setUserTableScore(zjh_cmd.MY_VIEWID, this.m_lTableScore[myChair]);
        this._gameView.setAllTableScore(this.m_llAllTableScore);

        this.onSendAddScore(score, true); //发送下注消息

        var bAutoCompare = this.getPlayingNum() === 2;
        if (!bAutoCompare) {
            bAutoCompare = this.m_wBankerUser === myChair && this.m_lTableScore[myChair] - score === this.m_lCellScore;
        }
        if (bAutoCompare) {
            this.onAutoCompareCard();
        } else {
            var compareStatus = [false, false, false, false, false];
            for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                if (this.m_cbPlayStatus[i] === 1 && i !== myChair) {
                    compareStatus[this.switchViewChairID(i)] = true;
                }
            }
            this._gameView.setCompareCard(true, compareStatus);
            //发送等待比牌消息
            var dataBuf = CCmd_Data.create();
            this.sendData(zjh_cmd.SUB_C_WAIT_COMPARE, dataBuf);
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_COMPARE_CARD, zjh_cmd.TIME_USER_COMPARE_CARD);
        }
    },
    onCompareChoose: function onCompareChoose(index) {
        if (index === undefined || index === GlobalDef.INVALID_CHAIR) {
            console.log("[GameScene][onCompareChoose] index error");
            return;
        }
        var myChair = this.getMeChairID();
        if (this.m_wCurrentUser !== myChair) {
            console.log("[GameScene][onCompareChoose] not m_wCurrentUser (m_wCurrentUser = " + this.m_wCurrentUser + " mychair = " + myChair);
            return;
        }
        console.log("[GameScene][onCompareChoose] index = " + index);
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (i !== myChair && this.m_cbPlayStatus[i] === 1 && index == this.switchViewChairID(i)) {
                this._gameView.setCompareCard(false);
                this.killGameClock();
                //发送比牌消息
                var dataBuf = CCmd_Data.create();
                dataBuf.pushword(i);
                this.sendData(zjh_cmd.SUB_C_COMPARE_CARD, dataBuf);
                break;
            }
        }
    },
    //放弃操作
    onGiveUp: function onGiveUp() {
        //删除计时器
        this.killGameClock();
        //隐藏操作按钮
        this._gameView.m_nodeBottom.active = false;
        //发送数据
        var dataBuf = CCmd_Data.create();
        this.sendData(zjh_cmd.SUB_C_GIVE_UP, dataBuf);
    },

    //换位操作
    onChangeDesk: function onChangeDesk() {
        if (this.m_bOnGame) {
            GlobalFun.showAlert({
                message: "陛下，游戏中无法切换座位。"
            });
        } else {
            this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR);
        }
    },

    //看牌操作
    onLookCard: function onLookCard() {
        var myChair = this.getMeChairID();
        console.log("[GameScene][onLookCard] type[myChair,this.m_wCurrentUser] = " + [typeof myChair === "undefined" ? "undefined" : _typeof(myChair), _typeof(this.m_wCurrentUser)]);
        if (myChair === undefined || myChair == GlobalDef.INVALID_CHAIR) {
            return;
        }
        if (this.m_wCurrentUser != myChair) {
            return;
        }
        this.m_bLookCard[myChair] = true;
        // ....
        // ....
        //发送消息
        console.log("[GameScene][onLookCard] sendData");
        var dataBuf = CCmd_Data.create();
        this.sendData(zjh_cmd.SUB_C_LOOK_CARD, dataBuf);
    },
    //下注操作
    addScore: function addScore(index) {
        var myChair = this.getMeChairID();
        if (this.m_wCurrentUser !== myChair) {
            return;
        }
        this.killGameClock();
        //清理界面
        this._gameView.m_chipBG.active = false;
        //底部按钮
        this._gameView.m_nodeBottom.active = false;
        //....

        //下注金额
        var array = [this.m_lCurrentTimes, 3, 6, 10];
        var scoreIndex = !index && 0 || index;
        var addScore = this.m_lCellScore * (array[scoreIndex] || this.m_lCurrentTimes);

        //看牌加倍
        if (this.m_bLookCard[myChair] === true) {
            addScore = addScore * 2;
        }

        this.m_lTableScore[myChair] += addScore;
        this.m_llAllTableScore += addScore;
        this._gameView.playerJetton(zjh_cmd.MY_VIEWID, addScore);
        this._gameView.setUserTableScore(zjh_cmd.MY_VIEWID, this.m_lTableScore[myChair]);
        this._gameView.setAllTableScore(this.m_llAllTableScore);

        //发送数据
        this.onSendAddScore(addScore, false);
    },
    //孤注一掷
    onLastAdd: function onLastAdd() {
        var dataBuf = CCmd_Data.create();
        this.sendData(zjh_cmd.SUB_C_LAST_ADD, dataBuf);
        this.killGameClock();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;
    },
    onShowUserInfo: function onShowUserInfo(index) {
        var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
    },
    //更新按钮控制
    updateControl: function updateControl() {

        var myChair = this.getMeChairID();
        if (myChair === undefined || myChair === GlobalDef.INVALID_CHAIR) {
            console.log("[GameScene][updateControl] mychair is invalid " + myChair);
            return;
        }
        //自动跟注
        if (this.onAutoFollow()) {
            return;
        }
        this._gameView.m_nodeBottom.active = true;
        this._gameView.m_chipBG.active = false;

        //看牌按钮
        if (!this.m_bLookCard[myChair]) {
            this._gameView.m_Button_lookCard.node.active = true;
        } else {
            this._gameView.m_Button_lookCard.node.active = false;
        }
        this._gameView.m_Button_giveUp.interactable = true;

        //跟注按钮
        var maxAddScore = this.m_lUserMaxScore - this.m_lTableScore[myChair];
        var followScore = this.m_lCurrentTimes * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
        var followLabel = this._gameView.m_Button_follow.node.children[0].getComponent(cc.Label);
        followLabel.string = followScore;
        // if (maxAddScore < followScore) {
        // console.log("[GameScene][updateControl] [this.m_lUserMaxScore, this.m_lTableScore[myChair], followScore]" + [this.m_lUserMaxScore, this.m_lTableScore[myChair], followScore])
        this._gameView.m_Button_follow.interactable = !(maxAddScore < followScore);
        // }
        // //是否第一次下注

        // var textLabel = children[0].children[0].getComponent(cc.Label);
        // if (this.m_isFirstAdd) {
        //     textLabel.string = "下注";
        // }
        // else {
        //     textLabel.string = "跟注";
        // }
        // 更新比牌按钮分数
        var compareScore = this.m_lCellScore * this.m_lCurrentTimes * (this.m_bLookCard[myChair] && 4 || 2);
        var bLastAdd = false;
        if (maxAddScore <= compareScore) {
            bLastAdd = true;
        }
        //孤注一掷
        this._gameView.m_Button_lastadd.interactable = bLastAdd;

        var bCompare = this.m_lCurrentTurn >= 1 && !bLastAdd;
        this._gameView.m_Button_compareCard.interactable = bCompare;
        var compareLabel = this._gameView.m_Button_compareCard.node.children[0].getComponent(cc.Label);
        // compareLabel.node.active = bCompare;
        compareLabel.string = compareScore;
        //加注按钮
        var bCanAdd = false;
        var children = this._gameView.m_chipBG.children;
        var array = [3, 6, 10];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var bHide = !bLastAdd && element > this.m_lCurrentTimes;
            var lScore = element * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
            var scoreLabel = children[i].children[0].getComponent(cc.Label);
            scoreLabel.string = lScore;
            children[i].getComponent(cc.Button).enableAutoGrayEffect = true;
            children[i].getComponent(cc.Button).interactable = bHide;
            bCanAdd = bCanAdd || bHide && maxAddScore >= lScore;
            if (maxAddScore < lScore) {
                children[i].getComponent(cc.Button).interactable = false;
            }
            if (children[i].getComponent(cc.Button).interactable) {
                children[i].color = new cc.Color(255, 255, 255);
            } else {
                children[i].color = new cc.Color(170, 170, 170);
            }
        }
        this._gameView.m_Button_addscore.interactable = bCanAdd;
    },
    playSound: function playSound(sfxType, chair) {
        var szKey = "";
        var userItem = this._gameFrame.getTableUserItem(this.getMeTableID(), chair);
        var cbGender = 1;
        if (userItem) {
            cbGender = userItem.cbGender;
        }
        if (cbGender === 1) {
            szKey += "male_yuyin_";
        } else {
            szKey += "female_yuyin_";
        }
        switch (sfxType) {
            case SoundEffectType.kSoundEffectXiaZhu:
                szKey += "xiazhu";
                break;
            case SoundEffectType.kSoundEffectGenZhu:
                szKey += "genzhu_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectJiaZhu:
                szKey += "jiazhu_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectKanPai:
                szKey += "kanpai_";
                var randNum = GlobalFun.getRandomInt(1, 4);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectFaQiBiPai:
                szKey += "faqibipai";
                break;
            case SoundEffectType.kSoundEffectBiPaiShiBai:
                szKey += "bipaishibai_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectQiPai:
                szKey += "qipai_";
                var randNum = GlobalFun.getRandomInt(1, 4);
                szKey += randNum;
                break;
            default:
                break;
        }
        AudioMng.playSFX(szKey);
    }
});

cc._RFpop();
},{"AudioMng":"AudioMng","CMD_ZaJinHua":"CMD_ZaJinHua","GameLogic":"GameLogic","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameSelfInfoView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '97fb1nxKNJK3L+FfCMDoZRu', 'GameSelfInfoView');
// Script/game/GameSelfInfoView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
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
        m_Label_name: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_ID: cc.Label,
        m_Image_userface: cc.Sprite,
        m_Image_gender: cc.Sprite,
        gameUserAtlas: cc.SpriteAtlas,
        userFaceAtals: cc.SpriteAtlas

    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(userItem) {
        if (userItem === undefined) {
            console.log("[GameSelfInfoView][init] userItem is undefined");
            return;
        }
        console.log("[GameSelfInfoView] " + JSON.stringify(userItem, null, ' '));
        var szNickName = userItem.szName;
        var szGold = userItem.lScore;
        var szCharm = userItem.lLoveliness;
        var dwUserID = userItem.dwUserID;
        var cbGender = userItem.cbGender;

        this.m_Label_name.string = szNickName;
        this.m_Label_gold.string = szGold;
        this.m_Label_charm.string = szCharm;
        this.m_Label_ID.string = dwUserID;

        var faceID = userItem.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        var szGenderImgName = "gameuser_man";
        if (cbGender == 1) {
            szGenderImgName = "gameuser_man";
        } else {
            szGenderImgName = "gameuser_woman";
        }
        this.m_Image_gender.spriteFrame = this.gameUserAtlas.getSpriteFrame(szGenderImgName);
        this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
    },
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    }
});

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"GameServerItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c2e88fJn+RCy7BT7oSlWT7S', 'GameServerItem');
// Script/GameServerItem.js

"use strict";

var GameServerItem = cc.Class({
    wSortID: undefined,
    wKindID: undefined,
    wServerID: undefined,
    wStationID: undefined,
    wServerPort: undefined,
    dwServerAddr: undefined,
    dwOnLineCount: undefined,
    szServerName: undefined,
    ctor: function ctor() {
        console.log("=====* GameServerItem ctor  *=====");
        this.wSortID = 0;
        this.wKindID = 0;
        this.wServerID = 0;
        this.wStationID = 0;
        this.wServerPort = 0;
        this.dwServerAddr = 0;
        this.dwOnLineCount = 0;
        this.szServerName = "";
    },
    onInit: function onInit(pData) {
        console.log("=====* GameServerItem onInit  *=====");
        this.wSortID = pData.readword();
        this.wKindID = pData.readword();
        this.wServerID = pData.readword();
        this.wStationID = pData.readword();
        this.wServerPort = pData.readword();
        this.dwServerAddr = pData.readdword();
        this.dwOnLineCount = pData.readdword();
        this.szServerName = pData.readstring(32);
        console.log("len = " + pData.getDataSize());
        while (true) {
            //默认信息
            // #define DTP_NULL					0								//无效数据
            //房间信息
            // #define DTP_LOGON_MB_ROOM_LEVEL		3000							//房间等级
            // #define DTP_LOGON_MB_ROOM_CELL		3001							//房间底分
            // #define DTP_LOGON_MB_ROOM_MINSCORE	3002							//房间最小分数
            // #define DTP_LOGON_MB_DDZ_BOMB_MAX	3003							//斗地主最大倍数
            // #define DTP_LOGON_MB_ROOM_INFO		3004							//房间信息
            // pData.setmaxsize(1);
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("size = " + dataSize + " describe = " + dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch (dataDescribe) {
                case 3000:
                    this.cbRoomLevel = pData.readbyte(true);
                    break;
                case 3001:
                    this.lBaseScore = pData.readint(true);
                    break;
                case 3002:
                    this.lLimitScore = pData.readint(true);
                    break;
                case 3003:
                    this.lMaxBombLimit = pData.readint(true);
                    break;
                case 3004:
                    this.szDescribeTxt = pData.readstring(dataSize, true);
                    break;
                default:
                    break;
            }
        }
    }
});

module.exports = GameServerItem;

cc._RFpop();
},{}],"GameSettingView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96571oGxqNCebmK4+Z21RpZ', 'GameSettingView');
// Script/game/GameSettingView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
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
        m_Button_music_switch_off: cc.Button,
        m_Button_music_switch_on: cc.Button,
        m_Button_effect_switch_off: cc.Button,
        m_Button_effect_switch_on: cc.Button

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.onRefreshEffect();
        this.onRefreshMusic();
    },
    onRefreshMusic: function onRefreshMusic() {
        // this.m_Button_music_switch_off.node.active = !GlobalUserData.bMusicAble;
        this.m_Button_music_switch_on.node.active = GlobalUserData.bMusicAble;
    },
    onRefreshEffect: function onRefreshEffect() {
        // this.m_Button_effect_switch_off.node.active = !GlobalUserData.bEffectAble;
        this.m_Button_effect_switch_on.node.active = GlobalUserData.bEffectAble;
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[SettingView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        // this.node.active = false;  
        this.node.destroy();
        console.log("[SettingView][onClickCloseButton] destroy");
    },
    onClickMusicSwitch: function onClickMusicSwitch() {
        GlobalUserData.setMusicAble(!GlobalUserData.bMusicAble);
        this.onRefreshMusic();
    },
    onClickEffectSwitch: function onClickEffectSwitch() {
        GlobalUserData.setEffectAble(!GlobalUserData.bEffectAble);
        this.onRefreshEffect();
    }
});

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"GameUserInfoView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5424bJsbxtLEIg0l86reKQF', 'GameUserInfoView');
// Script/game/GameUserInfoView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
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
        scroll_offset: 0,
        m_Label_name: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_ID: cc.Label,
        m_scrollView: cc.ScrollView,
        m_toggle_all: cc.Toggle,
        m_Image_userface: cc.Sprite,
        m_Image_gender: cc.Sprite,
        gameUserAtlas: cc.SpriteAtlas,
        facePrefab: cc.Prefab,
        userFaceAtals: cc.SpriteAtlas,
        m_Editbox_num: cc.EditBox,
        m_Editbox_secret: cc.EditBox,
        _selectIndex: -1

    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(userItem) {
        if (userItem === undefined) {
            console.log("[GameUserInfoView][init] userItem is undefined");
            return;
        }
        console.log("[GameUserInfoView] " + JSON.stringify(userItem, null, ' '));
        this.userItem = userItem;
        var szNickName = userItem.szName;
        var szGold = userItem.lScore;
        var szCharm = userItem.lLoveliness;
        var dwUserID = userItem.dwUserID;
        var cbGender = userItem.cbGender;

        this.m_Label_name.string = szNickName;
        this.m_Label_gold.string = szGold;
        this.m_Label_charm.string = szCharm;
        this.m_Label_ID.string = dwUserID;

        var faceID = userItem.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        var szGenderImgName = "gameuser_man";
        if (cbGender == 1) {
            szGenderImgName = "gameuser_man";
        } else {
            szGenderImgName = "gameuser_woman";
        }
        this.m_Image_gender.spriteFrame = this.gameUserAtlas.getSpriteFrame(szGenderImgName);
        this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));

        this._presentData = GlobalUserData.presentData;
        this.refreshPresentList();
    },
    refreshPresentList: function refreshPresentList() {
        var _this = this;

        var itemList = this._presentData['present']['base'];
        var contentList = this.m_scrollView.content;
        contentList.removeAllChildren();

        var _loop = function _loop() {
            element = itemList[i];
            newNode = cc.instantiate(_this.facePrefab);

            newNode.active = true;
            contentList.addChild(newNode);
            newNode.getComponent("PresentNode").init(element);
            var idx = i;
            newNode.on(cc.Node.EventType.TOUCH_END, function () {
                _this.onPresentTouch(idx);
            }, _this);
        };

        for (var i = 0; i < itemList.length; i++) {
            var element;
            var newNode;

            _loop();
        }
    },
    onPresentTouch: function onPresentTouch(idx) {
        if (idx == this._selectIndex) return;
        var children = this.m_scrollView.content.children;
        if (this._selectIndex >= 0 && cc.isValid(children[this._selectIndex])) {
            children[this._selectIndex].getComponent("PresentNode").setSelect(false);
        }
        this._selectIndex = idx;
        if (idx >= 0 && cc.isValid(children[idx])) {
            children[idx].getComponent("PresentNode").setSelect(true);
        }
    },
    onArrowLeft: function onArrowLeft(params) {
        var offset = new cc.Vec2(this.scroll_offset, 0);
        this.scrollOffsetBy(offset);
    },
    onArrowRight: function onArrowRight(params) {
        var offset = new cc.Vec2(-this.scroll_offset, 0);
        this.scrollOffsetBy(offset);
    },
    scrollOffsetBy: function scrollOffsetBy(offset) {
        var curOffset = this.m_scrollView.getScrollOffset();
        var endOffset = curOffset.add(offset);
        console.log("[curOffset,offset,endOffset] = " + [curOffset, offset, endOffset]);
        this.m_scrollView.scrollToOffset(cc.pSub(cc.Vec2.ZERO, endOffset), 0.2);
    },
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickConfirm: function onClickConfirm() {
        if (this._selectIndex < 0) {
            GlobalFun.showToast("请选择您要赠送的礼物");
            return;
        }
        var szNum = this.m_Editbox_num.string;
        if (isNaN(Number(szNum)) || Number(szNum) <= 0 || Number(szNum) > 100) {
            GlobalFun.showToast("赠送的数目必须大于0且小于等于100！");
            return;
        }
        var szPassword = this.m_Editbox_secret.string;
        if (szPassword.length <= 0) {
            GlobalFun.showToast("密码不能为空");
            return;
        }
        var itemList = this._presentData['present']['base'];
        var itemInfo = itemList[this._selectIndex];
        if (!itemInfo) {
            GlobalFun.showToast("礼物出差，重新选择");
            return;
        }
        var goldVal = itemInfo.gold;
        if (goldVal * szNum > GlobalUserData.llInsureScore) {
            GlobalFun.showToast("赠送的礼物价值超过银行存款，请重新选择");
            return;
        }

        var self = this;
        if (cc.isValid(self._confirmView) === false) {
            cc.loader.loadRes("prefab/GamePresentConfirmView", function (err, prefab) {
                if (cc.isValid(self.node)) {
                    self._confirmView = cc.instantiate(prefab);
                    self.node.addChild(self._confirmView);
                    self._confirmView.getComponent("GamePresentConfirmView").init({
                        userItem: self.userItem,
                        itemInfo: itemInfo,
                        sendNum: szNum,
                        callback: function callback() {
                            cc.director.emit("sendGift", {
                                userItem: self.userItem,
                                cbGiftID: self._selectIndex,
                                count: szNum,
                                szPassword: szPassword
                            });
                            self.close();
                        }
                    });
                    GlobalFun.ActionShowTanChuang(self._confirmView, function () {
                        console.log("[GameView][onClickSetting]ActionShowTanChuang callback");
                    });
                }
            });
        }
    }

});

cc._RFpop();
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameUserItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a4e148RJJ9PfYCgtqaAeCye', 'GameUserItem');
// Script/GameUserItem.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GameUserItem = cc.Class({
    //用户信息结构
    // struct tagUserData
    // {
    //     //用户属性
    //     WORD								wFaceID;							//头像索引
    //     DWORD								dwCustomFaceVer;					//上传头像
    //     DWORD								dwUserID;							//用户 I D
    //     DWORD								dwGroupID;							//社团索引
    //     DWORD								dwGameID;							//用户 I D
    //     DWORD								dwUserRight;						//用户等级
    //     LONG								lLoveliness;						//用户魅力
    //     DWORD								dwMasterRight;						//管理权限
    //     TCHAR								szName[32];					//用户名字
    //     TCHAR								szGroupName[32];				//社团名字
    //     TCHAR								szUnderWrite[32];		//个性签名

    //     //用户属性
    //     BYTE								cbGender;							//用户性别
    //     BYTE								cbMemberOrder;						//会员等级
    //     BYTE								cbMasterOrder;						//管理等级

    //     //用户积分
    //     LONGLONG							lInsureScore;						//消费金币
    //     LONGLONG							lGameGold;							//游戏金币
    //     LONGLONG							lScore;								//用户分数
    //     LONG								lWinCount;							//胜利盘数
    //     LONG								lLostCount;							//失败盘数
    //     LONG								lDrawCount;							//和局盘数
    //     LONG								lFleeCount;							//断线数目
    //     LONG								lExperience;						//用户经验

    //     //用户状态
    //     WORD								wTableID;							//桌子号码
    //     WORD								wChairID;							//椅子位置
    //     BYTE								cbUserStatus;						//用户状态

    //     //其他信息
    //     BYTE								cbCompanion;						//用户关系
    //     DWORD								dwPropResidualTime[15];	//道具时间
    // };
    //用户属性
    wFaceID: undefined, //头像索引
    dwCustomFaceVer: undefined, //上传头像
    dwUserID: undefined, //用户 I D
    dwGroupID: undefined, //社团索引
    dwGameID: undefined, //用户 I D
    dwUserRight: undefined, //用户等级
    lLoveliness: undefined, //用户魅力
    dwMasterRight: undefined, //管理权限
    szName: undefined, //用户名字
    szGroupName: undefined, //社团名字
    szUnderWrite: undefined, //个性签名

    //用户属性
    cbGender: undefined, //用户性别
    cbMemberOrder: undefined, //会员等级
    cbMasterOrder: undefined, //管理等级

    //用户积分
    lInsureScore: undefined, //消费金币
    lGameGold: undefined, //游戏金币
    lScore: undefined, //用户分数
    lWinCount: undefined, //胜利盘数
    lLostCount: undefined, //失败盘数
    lDrawCount: undefined, //和局盘数
    lFleeCount: undefined, //断线数目
    lExperience: undefined, //用户经验

    //用户状态
    wTableID: undefined, //桌子号码
    wChairID: undefined, //椅子位置
    cbUserStatus: undefined, //用户状态

    // //其他信息
    // cbCompanion:undefined,                        //用户关系
    // dwPropResidualTime:undefined, //道具时间
    initDataByUserInfoHead: function initDataByUserInfoHead(pData) {
        var userInfoHead = this.readUserInfoHead(pData);
        this.dwUserID = userInfoHead.dwUserID;
        this.wTableID = userInfoHead.wTableID;
        this.wChairID = userInfoHead.wChairID;
        this.cbUserStatus = userInfoHead.cbUserStatus;
        this.dwUserRight = userInfoHead.dwUserRight;
        this.dwMasterRight = userInfoHead.dwMasterRight;
        if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
            this.wFaceID = userInfoHead.wFaceID;
            this.dwCustomFaceVer = userInfoHead.dwCustomFaceVer;
            this.cbGender = userInfoHead.cbGender;
            this.cbMemberOrder = userInfoHead.cbMemberOrder;
            this.cbMasterOrder = userInfoHead.cbMasterOrder;
            this.dwGameID = userInfoHead.dwGameID;
            this.dwGroupID = userInfoHead.dwGroupID;
            this.lLoveliness = userInfoHead.lLoveliness;

            this.lScore = userInfoHead.UserScoreInfo.lScore;
            this.lGameGold = userInfoHead.UserScoreInfo.lGameGold;
            this.lInsureScore = userInfoHead.UserScoreInfo.lInsureScore;
            this.lWinCount = userInfoHead.UserScoreInfo.lWinCount;
            this.lLostCount = userInfoHead.UserScoreInfo.lLostCount;
            this.lDrawCount = userInfoHead.UserScoreInfo.lDrawCount;
            this.lFleeCount = userInfoHead.UserScoreInfo.lFleeCount;
            this.lExperience = userInfoHead.UserScoreInfo.lExperience;
        }
        pData.blockEnd();
        while (true) {
            //默认信息
            // #define DTP_NULL					0								//无效数据
            //房间信息
            // #define	DTP_USER_ACCOUNTS			3								//用户帐号
            // #define	DTP_UNDER_WRITE				9								//个性签名
            // #define DTP_USER_GROUP_NAME			301								//社团名字

            // pData.setmaxsize(1);
            console.log("[GameUserItem][initDataByUserInfoHead] [offset,datasize] = " + [pData.getReadOffset(), pData.getDataSize()]);
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("[GameUserItem][initDataByUserInfoHead]size = " + dataSize + " describe = " + dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch (dataDescribe) {
                case 3:
                    this.szName = "游戏用户";
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szName = pData.readstring(dataSize, true);
                    }
                    break;
                case 9:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szUnderWrite = pData.readstring(dataSize, true);
                    }
                    break;
                case 301:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szGroupName = pData.readstring(dataSize, true);
                    }
                    break;
                default:
                    break;
            }
        }
    },
    readUserInfoHead: function readUserInfoHead(pData) {
        //用户基本信息结构
        // struct tagUserInfoHead
        // {
        //     //用户属性
        //     WORD								wFaceID;							//头像索引
        //     DWORD								dwUserID;							//用户 I D
        //     DWORD								dwGameID;							//游戏 I D
        //     DWORD								dwGroupID;							//社团索引
        //     DWORD								dwUserRight;						//用户等级
        //     LONG								lLoveliness;						//用户魅力
        //     DWORD								dwMasterRight;						//管理权限

        //     //用户属性
        //     BYTE								cbGender;							//用户性别
        //     BYTE								cbMemberOrder;						//会员等级
        //     BYTE								cbMasterOrder;						//管理等级

        //     //用户状态
        //     WORD								wTableID;							//桌子号码
        //     WORD								wChairID;							//椅子位置
        //     BYTE								cbUserStatus;						//用户状态

        //     //用户积分
        //     tagUserScore						UserScoreInfo;						//积分信息
        //         //用户积分信息
        // struct tagUserScore
        // {
        //     LONGLONG							lScore;								//用户分数
        //     LONGLONG							lGameGold;							//游戏金币
        //     LONGLONG							lInsureScore;						//存储金币
        //     LONG								lWinCount;							//胜利盘数
        //     LONG								lLostCount;							//失败盘数
        //     LONG								lDrawCount;							//和局盘数
        //     LONG								lFleeCount;							//断线数目
        //     LONG								lExperience;						//用户经验
        // };

        //     //扩展信息
        //     //LONG								lInsureScore;						//消费金币
        //     //LONG								lGameGold;							//游戏金币
        //     DWORD								dwCustomFaceVer;					//上传头像
        //     DWORD								dwPropResidualTime[15];	//道具时间
        // BYTE                                cbUserType;                     //用户类型
        // TCHAR								szWeChatImgURL[256];			// 微信头相
        // TCHAR								szWeChatNickName[NAME_LEN];		// 微信昵称
        // };
        var userInfoHead = {};
        userInfoHead.wFaceID = pData.readword(); //头像索引
        userInfoHead.dwUserID = pData.readdword(); //用户 I D
        userInfoHead.dwGameID = pData.readdword(); //游戏 I D
        userInfoHead.dwGroupID = pData.readdword(); //社团索引
        userInfoHead.dwUserRight = pData.readdword(); //用户等级
        userInfoHead.lLoveliness = pData.readint(); //用户魅力
        userInfoHead.dwMasterRight = pData.readdword(); //管理权限

        //用户属性
        userInfoHead.cbGender = pData.readbyte(); //用户性别
        userInfoHead.cbMemberOrder = pData.readbyte(); //会员等级
        userInfoHead.cbMasterOrder = pData.readbyte(); //管理等级

        //用户状态
        userInfoHead.wTableID = pData.readword(); //桌子号码
        userInfoHead.wChairID = pData.readword(); //椅子位置
        userInfoHead.cbUserStatus = pData.readbyte(); //用户状态

        //用户积分
        pData.blockBegin("tagUserScore", 8);
        userInfoHead.UserScoreInfo = {};
        userInfoHead.UserScoreInfo.lScore = pData.readint64(); //用户分数
        userInfoHead.UserScoreInfo.lGameGold = pData.readint64(); //游戏金币
        userInfoHead.UserScoreInfo.lInsureScore = pData.readint64(); //存储金币
        userInfoHead.UserScoreInfo.lWinCount = pData.readint(); //胜利盘数
        userInfoHead.UserScoreInfo.lLostCount = pData.readint(); //失败盘数
        userInfoHead.UserScoreInfo.lDrawCount = pData.readint(); //和局盘数
        userInfoHead.UserScoreInfo.lFleeCount = pData.readint(); //断线数目
        userInfoHead.UserScoreInfo.lExperience = pData.readint(); //用户经验
        pData.blockEnd();
        userInfoHead.dwCustomFaceVer = pData.readdword(); //上传头像
        userInfoHead.dwPropResidualTime = []; //道具时间
        for (var index = 0; index < 15; index++) {
            var val = pData.readdword();
            userInfoHead.dwPropResidualTime.push(val);
        }
        userInfoHead.cbUserType = pData.readbyte();
        userInfoHead.szWeChatImgURL = pData.readstring(256);
        userInfoHead.szWeChatNickName = pData.readstring(32);
        console.log("[GameUserItem][userInfoHead] = " + JSON.stringify(userInfoHead, null, ' '));
        return userInfoHead;
    }
});

module.exports = GameUserItem;

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"GameView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c5fc5lgSmBGv59xW2EOpvDk', 'GameView');
// Script/game/GameView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
var GameLogic = require("GameLogic");
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
        //label
        m_Label_cellTurn: cc.Label,
        m_Label_allScore: cc.Label,
        m_Label_time: cc.Label,
        //prefab
        cardPrefab: cc.Prefab,
        userInfacePrefab: cc.Prefab,
        chipPrefab: cc.Prefab,
        cardTypePrefab: cc.Prefab,
        //button
        m_Button_ready: cc.Button,
        m_Button_lookCard: cc.Button,
        m_Button_giveUp: cc.Button,
        m_Button_compareCard: cc.Button,
        m_Button_follow: cc.Button,
        m_Button_lastadd: cc.Button,
        m_Button_addscore: cc.Button,
        m_Button_autofollow: cc.Button,
        m_Button_cancelfollow: cc.Button,
        //other
        m_nodeBottom: cc.Node,
        m_chipBG: cc.Node,
        m_Image_banker: cc.Node,
        m_Progress_time: cc.ProgressBar,
        //atlas
        gameAtlas: cc.SpriteAtlas,
        //array
        m_Node_player: {
            default: [],
            type: cc.Node
        },
        m_flagReady: {
            default: [],
            type: cc.Node
        },
        m_userCardPanel: {
            default: [],
            type: cc.Node
        },
        ptPlayer: {
            default: [],
            type: cc.Vec2
        },
        ptBanker: {
            default: [],
            type: cc.Vec2
        },
        ptCard: {
            default: [],
            type: cc.Vec2
        },
        m_LookCard: {
            default: [],
            type: cc.Node
        },
        m_GiveUp: {
            default: [],
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var _this = this;

        this._scene = this.node.getComponent("GameScene");
        this.m_Label_cellTurn.node.active = false;
        this._ping = true;
        this._speed = 0.1;
        //用户头像
        this.m_userHead = [];
        //计时器
        this.m_timeProgress = [];
        this.m_rcCompare = [];
        var userHeadList = this.node.getChildByName("m_Panel_center").getChildByName("m_userhead").children;

        var _loop = function _loop() {
            userNode = cc.instantiate(_this.userInfacePrefab);

            _this.node.getChildByName("nodePlayer").addChild(userNode);
            _this.m_Node_player[index] = userNode;
            userNode.setPosition(_this.ptPlayer[index]);
            userNode.rotation = index * -90;
            // userNode.getComponentInChildren("UserInfaceItem").playerAnimate("wait",index,{cbGender:(Math.floor(index/2) + 1)});
            // userNode.setScale(1.5);
            userNode.active = false;

            _this.m_userHead[index] = {};
            _this.m_userHead[index].name = userHeadList[index].getChildByName("m_Label_username").getComponent(cc.Label);
            _this.m_userHead[index].score = userHeadList[index].getChildByName("game_gold_back").children[0].getComponent(cc.Label);
            _this.m_userHead[index].bg = userHeadList[index];
            _this.m_userHead[index].bg.active = false;
            var idx = index;
            userNode.on(cc.Node.EventType.TOUCH_END, function () {
                _this.onShowUserInfo(idx, true);
            }, _this);
            _this.m_userHead[index].bg.on(cc.Node.EventType.TOUCH_END, function () {
                _this.onShowUserInfo(idx, false);
            }, _this);

            //计时器
            _this.m_timeProgress[index] = userHeadList[index].getComponent(cc.ProgressBar);
            _this.m_timeProgress[index].progress = 0;
            _this.m_rcCompare[index] = _this.node.getChildByName("flagCompare").children[index];
            _this.m_rcCompare[index].active = false;
        };

        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userNode;

            _loop();
        }
        this.m_userCard = [];
        //用户手牌
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            this.m_userCard[index] = {};
            this.m_userCard[index].card = [];
            //牌区域
            var cardPanel = this.m_userCardPanel[index];
            this.m_userCard[index].area = cardPanel;
            for (var j = 0; j < zjh_cmd.MAX_COUNT; j++) {
                var cardNode = cc.instantiate(this.cardPrefab);
                this.m_userCard[index].card[j] = cardNode;
                cardPanel.addChild(cardNode);
                cardNode.setPosition(this.ptCard[index].x + (index === zjh_cmd.MY_VIEWID && 80 || 35) * j, this.ptCard[index].y);
                cardNode.setScale(index === zjh_cmd.MY_VIEWID && 1.0 || 0.7);
                var cardItem = cardNode.getComponent("CardItem");
                cardItem.showCardBack();
                cardNode.active = false;
            }
            var cardType = cc.instantiate(this.cardTypePrefab);
            cardPanel.addChild(cardType);
            this.m_userCard[index].cardType = cardType;
            cardType.setPosition(this.ptCard[index].x + (index === zjh_cmd.MY_VIEWID && 80 || 35), this.ptCard[index].y - (index === zjh_cmd.MY_VIEWID && 50 || 60));
            cardType.active = false;
        }

        //底部按钮
        this.m_nodeBottom.active = false;
        this.nodeChipPool = this.node.getChildByName("nodeChipPool");
        this.bAutoFollow = false;
    },
    onEnable: function onEnable() {},
    onResetView: function onResetView() {
        this.bAutoFollow = false;
        this.m_Button_autofollow.node.active = !this.bAutoFollow;
        this.m_Button_cancelfollow.node.active = this.bAutoFollow;
        this.m_Button_ready.node.active = false;
        this.m_nodeBottom.active = false;
        this.m_chipBG.active = false;
        this.setBanker(GlobalDef.INVALID_CHAIR);
        this.setAllTableScore(0);
        this.setCompareCard(false);
        this.cleanAllJettons();
        this.stopCompareCard();
        this.setMaxCellScore(0);

        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            this.setLookCard(i, false);
            this.setUserCardType(i);
            this.setUserTableScore(i, 0);
            this.setUserGiveUp(i, false);
            this.setUserCard(i, undefined);
            this.clearCard(i);
        }
    },

    //更新时钟
    onUpdateClockView: function onUpdateClockView(viewID, time) {
        // console.log("[GameView][onUpdateClockView] [viewID, time] = " + [viewID, time]);
        if (time <= 0) {
            this.m_Progress_time.node.active = false;
            if (this.m_timeProgress[viewID]) {
                this.m_timeProgress[viewID].progress = 0;
            }
            return;
        } else {
            var progress = 1.0 * time / zjh_cmd.TIME_START_GAME;
            // this.m_Progress_time.node.active = true;
            if (this.m_timeProgress[viewID]) {
                // this.m_timeProgress[viewID].progress = progress;
            } else {
                this.m_Progress_time.node.active = true;
                this.m_Progress_time.node.setPosition(0, 60);
                // this.m_Progress_time.progress = progress;
                this.m_Label_time.string = time.toString();
            }
        }
    },
    //更新用户显示
    onUpdateUser: function onUpdateUser(viewID, userItem) {

        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            console.log("[GameView][onUpdateUser] viewID is undefined or invalid");
            return;
        }
        console.log("[GameView][onUpdateUser] viewID = " + viewID + " userItem = " + JSON.stringify(userItem, null, ' '));
        this.m_Node_player[viewID].active = userItem !== undefined;
        if (userItem) {
            this.playUserAnim("wait", viewID, userItem);
            this.m_flagReady[viewID].active = GlobalDef.US_READY === userItem.cbUserStatus;
            this.m_userHead[viewID].bg.active = true;
            this.m_userHead[viewID].name.string = userItem.szName;
            this.m_userHead[viewID].score.string = userItem.lScore;
            this.m_userHead[viewID].userItem = userItem;
        } else {
            this.m_flagReady[viewID].active = false;
            this.m_userHead[viewID].name.string = "";
            this.m_userHead[viewID].score.string = "";
            this.m_userHead[viewID].bg.active = false;
            this.m_userHead[viewID].userItem = undefined;
        }
    },
    playUserAnim: function playUserAnim(szAnim, viewID, userItem) {
        this.m_Node_player[viewID].getComponentInChildren("UserInfaceItem").playerAnimate(szAnim, viewID, userItem);
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function onShowIntroduce(bShow) {},
    //筹码移动
    playerJetton: function playerJetton(wViewChairID, num, notani) {
        if (!num || num < 1 /*|| !this.m_lCellScore || this.m_lCellScore < 1*/) {
                console.log("[GameView][playerJetton] num is invalid");
                return;
            }
        //加注动作
        this.playUserAnim("chip", wViewChairID);
        var chip = cc.instantiate(this.chipPrefab);
        this.nodeChipPool.addChild(chip);
        var chipItem = chip.getComponent("ChipItem");
        chipItem.init(num);
        chip.setPosition(this.ptPlayer[wViewChairID]);
        var x = Math.random() * 200 - 100;
        var y = Math.random() * 100 - 50;
        console.log("[GameView][playerJetton] [x,y] = " + [x, y]);
        chip.runAction(cc.moveTo(0.4, cc.p(x, y)).easing(cc.easeOut(0.5)));
        // }
    },
    //停止比牌动画
    stopCompareCard: function stopCompareCard() {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function compareCard(firstuser, seconduser, firstcard, secondcard, bfirstwin, callback) {
        // AudioMng.playSFX("sfx_comparecard");
        var compareView = this.node.getChildByName("compareView");
        compareView.active = true;
        compareView.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(function () {
            callback();
        })));
    },
    //底注显示
    setCellScore: function setCellScore(cellScore) {
        this.m_lCellScore = cellScore;
        if (!cellScore) {} else {}
    },
    setCellTurn: function setCellTurn(cellScore, turnCount, maxTurn) {
        var text = "底注:" + cellScore + " 轮数:" + (turnCount + 1) + "/" + maxTurn;
        this.m_Label_cellTurn.node.active = true;
        this.m_Label_cellTurn.string = text;
    },
    //封顶分数
    setMaxCellScore: function setMaxCellScore(cellScore) {
        if (!cellScore) {
            //todo
        } else {}
    },
    //庄家显示
    setBanker: function setBanker(viewID) {
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            //todo
            this.m_Image_banker.active = false;
            return;
        }
        this.m_Image_banker.active = true;
        this.m_Image_banker.setPosition(this.ptBanker[viewID]);
    },
    //下注总额
    setAllTableScore: function setAllTableScore(score) {
        if (score === undefined || score === 0) {
            this.m_Label_allScore.node.active = false;
            this.m_Label_allScore.node.parent.active = false;
        } else {
            this.m_Label_allScore.node.active = true;
            this.m_Label_allScore.node.parent.active = true;
            this.m_Label_allScore.string = score;
        }
    },
    //玩家下注
    setUserTableScore: function setUserTableScore(viewID, score) {
        if (score === undefined || score === 0) {
            // if (viewID !== )
        } else {}
    },
    //发牌
    sendCard: function sendCard(viewID, index, fDelay) {
        console.log("[viewID,index,fDelay] = " + [viewID, index, fDelay]);
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            return;
        }
        var self = this;
        var fInterval = 0.1;
        var nodeCard = this.m_userCard[viewID];
        var spriteCard = nodeCard.card[index];
        var cardItem = spriteCard.getComponent("CardItem");
        spriteCard.active = true;
        spriteCard.opacity = 0;
        spriteCard.stopAllActions();
        spriteCard.setScale(viewID === zjh_cmd.MY_VIEWID && 1.0 || 0.7);
        spriteCard.setPosition(0, 0);
        cardItem.showCardBack();
        spriteCard.runAction(cc.sequence(cc.delayTime(fDelay),
        // cc.fadeIn(0),
        cc.callFunc(function () {
            AudioMng.playSFX("sfx_sendcard");
        }), cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, self.ptCard[viewID].x + (viewID === zjh_cmd.MY_VIEWID && 80 || 35) * index, self.ptCard[viewID].y))));
    },
    //看牌状态
    setLookCard: function setLookCard(viewID, bLook) {
        // if (viewID === zjh_cmd.MY_VIEWID) {
        //     return;
        // }
        this.m_LookCard[viewID].active = bLook;
    },
    //弃牌状态
    setUserGiveUp: function setUserGiveUp(viewID, bGiveup) {
        //todo
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = true;
        }
        this.m_GiveUp[viewID].active = bGiveup;
        this.m_GiveUp[viewID].getComponentInChildren(cc.Label).string = "弃牌";
        if (bGiveup) {
            this.setLookCard(viewID, false);
        }
    },
    //比牌输状态
    setUserLose: function setUserLose(viewID, bLose) {
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = true;
        }
        this.m_GiveUp[viewID].active = bLose;
        this.m_GiveUp[viewID].getComponentInChildren(cc.Label).string = "比牌输";
        if (bLose) {
            this.setLookCard(viewID, false);
        }
    },
    //清理牌
    clearCard: function clearCard(viewID) {
        //todo
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = false;
        }
        this.m_GiveUp[viewID].active = false;
    },
    //显示牌值
    setUserCard: function setUserCard(viewID, cardData) {
        console.log("[GameView][setUserCard][viewID,cardData] = " + [viewID, cardData]);
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            return;
        }
        if (cardData) {
            cardData = GameLogic.sortCard(cardData);
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[zjh_cmd.MAX_COUNT - i - 1];
                var cardItem = cardNode.getComponent("CardItem");
                cardNode.active = true;
                if (!cardData[i] || cardData[i] === 0 || cardData[i] === 0xff) {
                    cardItem.showCardBack();
                } else {
                    cardItem.setCardData(cardData[i]);
                    cardItem.setTurnTime(0.5);
                    cardItem.setTurnCallback(function (params) {
                        console.log("[GameView][setUserCard][setTurnCallback]");
                    });
                    cardItem.turnCard();
                    // cardItem.showCard();
                }
            }
        } else {
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[i];
                cardNode.skewX = 0;
                cardNode.skewY = 0;
                cardNode.active = false;
            }
        }
    },
    //显示牌类型
    setUserCardType: function setUserCardType(viewID, cardtype, state) {
        var nodeCardType = this.m_userCard[viewID].cardType;
        var cardTypeState = "card_type_" + (state || "");
        console.log("[GameView][setUserCardType] [viewID,cardtype] = " + [viewID, cardtype]);
        if (cardtype && cardtype >= 1 && cardtype <= 6) {
            var spCardType = nodeCardType.getComponent(cc.Sprite);
            nodeCardType.active = true;
            console.log("[GameView][setUserCardType] cardTypeState = " + cardTypeState);
            spCardType.spriteFrame = this.gameAtlas.getSpriteFrame(cardTypeState + cardtype);
        } else {
            nodeCardType.active = false;
        }
    },
    showCardTypeAnim: function showCardTypeAnim(cardType, callback) {
        switch (cardType) {
            case GameLogic.CT_JIN_HUA:
                AudioMng.playSFX("sfx_jinhua");
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_tonghua",
                    loop: false,
                    callback: callback
                });
                break;
            case GameLogic.CT_SHUN_JIN:
                AudioMng.playSFX("sfx_shunjin");
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_tonghuashun",
                    loop: false,
                    callback: callback
                });
                break;
            case GameLogic.CT_BAO_ZI:
                AudioMng.playSFX("sfx_baozi");
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_baozi",
                    loop: false,
                    callback: callback
                });
                break;

            default:
                if (typeof callback == "function") {
                    callback();
                }
                break;
        }
    },
    winScore: function name(params) {
        // for (var index = 0; index < 4; index++) {
        //     this.winTheChip(index,index + 2000);
        // }
        // this.showSendPresent(0,0,1,1);
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            // for (var j = i + 1; j < zjh_cmd.GAME_PLAYER; j++) {
            this.showSendPresent(0, i, i, 1);
            // }
        }
    },
    //赢得筹码
    winTheChip: function winTheChip(wWinner, score) {
        this.playUserAnim("collect", wWinner);
        var children = this.nodeChipPool.children;
        var delayTime = 0.1 * children.length + 0.4;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            element.runAction(cc.sequence(cc.delayTime(0.1 * (children.length - i)), cc.moveTo(0.4, this.ptPlayer[wWinner]).easing(cc.easeOut(0.4)), cc.callFunc(function (node) {
                AudioMng.playSFX("sfx_addscore");
                node.destroy();
            })));
        }
        //显示赢家积分
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
            cc.loader.loadRes("prefab/winScoreLabel", function (err, prefab) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var label = cc.instantiate(prefab);
                label.setPosition(self.ptCard[wWinner].x + (wWinner === zjh_cmd.MY_VIEWID && 80 || 35), self.ptCard[wWinner].y);
                self.node.getChildByName("nodePlayer").addChild(label);
                label.getComponent(cc.Label).string = "+" + score;
                label.opacity = 0;
                label.runAction(cc.sequence(cc.spawn(cc.moveBy(0.4, 0, 90), cc.fadeIn(0.2)), cc.delayTime(0.4), cc.spawn(cc.moveBy(0.2, 0, 20), cc.fadeOut(0.2)), cc.callFunc(function (node) {
                    node.destroy();
                })));
            });
        })));
    },
    //清理筹码
    cleanAllJettons: function cleanAllJettons() {
        this.nodeChipPool.removeAllChildren();
    },
    showSendPresent: function showSendPresent(wSendChairID, wRecvChairID, cbGiftID, wGiftCount) {
        if (wSendChairID === GlobalDef.INVALID_CHAIR) {
            //送全场
        } else {
            var sendViewID = this._scene.switchViewChairID(wSendChairID);
            var recvViewID = this._scene.switchViewChairID(wRecvChairID);
            var sendPoint = this.ptPlayer[sendViewID];
            var recvPoint = this.ptPlayer[recvViewID];
            var presentData = GlobalUserData.presentData['present']['base'];
            var icon = presentData[cbGiftID].icon;
            var charm = presentData[cbGiftID].charm * wGiftCount;
            var presentView = cc.find("Canvas/presentView");
            var fileName = "jjh_liwu1_10";
            var animName = "jjh_liwu_" + GlobalFun.PrefixInteger(cbGiftID + 1, 2);
            cc.loader.loadRes("res/gameUserInfo", cc.SpriteAtlas, function (err, atlas) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var node = new cc.Node("present");
                var sprite = node.addComponent(cc.Sprite);
                var frame = atlas.getSpriteFrame(icon.split('.')[0]);
                sprite.spriteFrame = frame;
                presentView.addChild(node);
                node.setPosition(sendPoint);
                node.runAction(cc.sequence(cc.delayTime(1.0), cc.moveTo(0.5, recvPoint), cc.callFunc(function (pnode) {
                    AudioMng.playSFX("sfx_present_" + GlobalFun.PrefixInteger(cbGiftID + 1, 2));
                    GlobalFun.playEffects(presentView, {
                        fileName: fileName,
                        anim: animName,
                        tag: fileName + animName,
                        loop: false,
                        x: recvPoint.x,
                        y: recvPoint.y,
                        callback: function callback() {
                            // 显示魅力
                            cc.loader.loadRes("prefab/charmLabel", function (err, prefab) {
                                if (err) {
                                    console.log(err.message || err);
                                    return;
                                }
                                var label = cc.instantiate(prefab);
                                label.setPosition(recvPoint.x, recvPoint.y - 90);
                                presentView.addChild(label);
                                label.getComponent(cc.Label).string = "魅力+" + charm;
                                label.opacity = 0;
                                label.runAction(cc.sequence(cc.spawn(cc.moveBy(0.4, 0, 90), cc.fadeIn(0.2)), cc.delayTime(0.4), cc.spawn(cc.moveBy(0.2, 0, 20), cc.fadeOut(0.2)), cc.callFunc(function (labelnode) {
                                    labelnode.removeFromParent();
                                    labelnode.destroy();
                                })));
                            });
                        }
                    });
                    pnode.removeFromParent();
                    pnode.destroy();
                })));
            });
        }
    },
    //取消比牌选择
    setCompareCard: function setCompareCard(bChoose, status) {
        this.bCompareChoose = bChoose;
        // todo
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (bChoose && status && status[i]) {
                this.m_rcCompare[i].active = true;
            } else {
                this.m_rcCompare[i].active = false;
            }
        }
    },
    onTouch: function onTouch(params) {},
    onClickAddScoreButton: function onClickAddScoreButton() {
        // this.m_nodeBottom.active = false;
        this.m_chipBG.active = !this.m_chipBG.active;
    },
    onClickAutoFollowButton: function onClickAutoFollowButton() {
        this.bAutoFollow = !this.bAutoFollow;
        this.m_Button_autofollow.node.active = !this.bAutoFollow;
        this.m_Button_cancelfollow.node.active = this.bAutoFollow;
        this._scene.onAutoFollow();
    },
    onClickChat: function onClickChat() {
        // this._scene.sendTextChat('hello world');
        console.log("[GameView][onClickChat]");
        var self = this;
        if (cc.isValid(self._chatView) === false) {
            cc.loader.loadRes("prefab/GameChatView", function (err, chatPrefab) {
                if (cc.isValid(self.node)) {
                    self._chatView = cc.instantiate(chatPrefab);
                    self.node.addChild(self._chatView);
                }
            });
        }
    },
    onClickSetting: function onClickSetting() {
        console.log("[GameView][onClickSetting]");
        var self = this;
        if (cc.isValid(self._settingView) === false) {
            cc.loader.loadRes("prefab/GameSettingView", function (err, settingPrefab) {
                if (cc.isValid(self.node)) {
                    self._settingView = cc.instantiate(settingPrefab);
                    self.node.addChild(self._settingView);
                    // self._chatView.getComponent("GameChatView")
                    GlobalFun.ActionShowTanChuang(self._settingView, function () {
                        console.log("[GameView][onClickSetting]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    //按键响应
    onStartGame: function onStartGame() {
        this._scene.onStartGame(true);
    },
    onGiveUp: function onGiveUp() {
        this._scene.onGiveUp();
    },
    onLookCard: function onLookCard() {
        this._scene.onLookCard();
    },
    onCompareCard: function onCompareCard() {
        this._scene.onCompareCard();
    },
    onCompareChoose: function onCompareChoose(event, index) {
        this._scene.onCompareChoose(index);
    },
    onLastAdd: function onLastAdd() {
        this._scene.onLastAdd();
    },
    onAddScore: function onAddScore(event, params) {
        console.log(params);
        this._scene.addScore(params);
    },
    onShowUserInfo: function onShowUserInfo(index, isSelf) {
        console.log("[GameView][onShowUserInfo] index = " + index);
        // this._scene.onShowUserInfo(index);
        var userItem = this.m_userHead[index].userItem;
        var self = this;
        var ViewName = "GameUserInfoView";
        if (isSelf) {
            ViewName = "GameSelfInfoView";
        }
        if (cc.isValid(self._gameUserInfoView) === false) {
            cc.loader.loadRes("prefab/" + ViewName, function (err, UserInfoPrefab) {
                if (cc.isValid(self.node)) {
                    self._gameUserInfoView = cc.instantiate(UserInfoPrefab);
                    self.node.addChild(self._gameUserInfoView);
                    var gameUserInfoView = self._gameUserInfoView.getComponent(ViewName);
                    gameUserInfoView.init(userItem);
                    GlobalFun.ActionShowTanChuang(self._gameUserInfoView, function () {
                        console.log("[GameView][onShowUserInfo]ActionShowTanChuang callback");
                    });
                }
            });
        }
    }
});

cc._RFpop();
},{"AudioMng":"AudioMng","CMD_ZaJinHua":"CMD_ZaJinHua","GameLogic":"GameLogic","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GlobalDef":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd85baIYnERFsIqEdSH5SyZY', 'GlobalDef');
// Script/GlobalDef.js

"use strict";

var GlobalDef = {
    MAX_CHAIR: 100, //◊Ó¥Û“Œ◊”
    MAX_CHAIR_NORMAL: 8, //◊Ó¥Û»À ˝

    INVALID_TABLE: 0xFFFF, //Œﬁ–ß◊¿◊”∫≈
    INVALID_CHAIR: 0xFFFF, //Œﬁ–ß“Œ◊”∫≈
    INVALID_ITEM: 0xFFFF,

    HMATCH_PORT_MIN: 10000, //–° ±»¸◊Ó–°∂Àø⁄∫≈
    HMATCH_PORT_MAX: 20000, //–° ±»¸◊Ó¥Û∂Àø⁄∫≈
    HMATCH_SIGN_MAX: 99, //–° ±»¸µ•≥°±»»¸±®√˚»À ˝…œœﬁ
    HMATCH_MAXONLINE: 500,

    MAX_ANDROID: 10, //最大机器
    MAX_CHAT_LEN: 128, //聊天长度
    LIMIT_CHAT_TIMES: 1200, //限时聊天
    //正式服务器地址
    httpInitUrl: "http://tver.jjhgame.com/Handle/hz/init.ashx", //app初始化接口地址
    // httpBaseUrl: "http://interface.jjhgame.com/Handle",        //web接口地址
    // httpBaseUrl:"http://thzinterface.jjhgame.com/Handle",
    httpBaseUrl: "http://thzguest.jjhgame.com/Handle",
    // httpOpenUrl: "http://user.jjhgame.com/findpasswordHZ.aspx",  //找回密码
    httpOpenUrl: "http://thzguestu.jjhgame.com", //找回密码
    // httpUserCenter: "http://f.jjhgame.com/Handle",                  //用户中心
    httpUserCenter: "http://thzguest.jjhgame.com/Handle",
    LOGON_SERVER_DOMAIN: "nnapp.jjhgame.com", //登录服务器
    // LOGON_SERVER_IP: "122.226.186.38",                               //登录服务器
    // PORT_LOGON_SERVER: 9009,                                           //登陆服务器
    LOGON_SERVER_IP: "183.146.209.139", // 测试登录服务器
    PORT_LOGON_SERVER: 9008, //测试登陆服务器


    //端口定义
    PORT_VIDEO_SERVER: 7600, //视频服务器
    PORT_CENTER_SERVER: 9090, //中心服务器

    CHANNELID_init: 1, //渠道号
    CHANNELID_center: 7, //渠道号
    //网络数据定义
    SOCKET_VER: 0x8C, //网络版本
    SOCKET_BUFFER: 8192, //网络缓冲
    SOCKET_PACKET: 8192,

    /////////////////////////////////////////////////////////////////////////////////////////

    //内核命令码
    MDM_KN_COMMAND: 3, //内核命令
    SUB_KN_DETECT_SOCKET: 5, //检测命令
    SUB_KN_SHUT_DOWN_SOCKET: 9, //中断网络

    //IPC 数据定义
    IPC_VER: 0x0001, //IPC 版本
    IPC_IDENTIFIER: 0x0001, //标识号码
    IPC_PACKAGE: 4096, //最大 IPC 包
    IPC_BUFFER: 4096, //缓冲长度

    TYPE_LEN: 32, //÷÷¿‡≥§∂»
    KIND_LEN: 32, //¿‡–Õ≥§∂»
    STATION_LEN: 32, //’æµ„≥§∂»
    SERVER_LEN: 32, //∑øº‰≥§∂»
    MODULE_LEN: 32, //Ω¯≥Ã≥§∂»

    //–‘±∂®“Â
    GENDER_NULL: 0, //Œ¥÷™–‘±
    GENDER_BOY: 1, //ƒ––‘–‘±
    GENDER_GIRL: 2, //≈Æ–‘–‘±

    //”Œœ∑¿‡–Õ
    GAME_GENRE_SCORE: 0x0001, //µ„÷µ¿‡–Õ
    GAME_GENRE_GOLD: 0x0002, //¿÷∂π¿‡–Õ
    GAME_GENRE_MATCH: 0x0004, //±»»¸¿‡–Õ
    GAME_GENRE_EDUCATE: 0x0008, //—µ¡∑¿‡–Õ
    GAME_GENRE_QTHERMATCH: 0x0016, //自定义比赛类型

    //”√ªß◊¥Ã¨∂®“Â
    US_NULL: 0x00, //没有状态
    US_FREE: 0x01, //站立状态
    US_SIT: 0x02, //坐下状态
    US_READY: 0x03, //同意状态
    US_LOOKON: 0x04, //旁观状态
    US_PLAY: 0x05, //游戏状态
    US_OFFLINE: 0x06, //断线状态

    //≥§∂»∫Í∂®“Â
    NAME_LEN: 32, //√˚◊÷≥§∂»
    PASS_LEN: 33, //√‹¬Î≥§∂»
    EMAIL_LEN: 32, //” œ‰≥§∂»
    GROUP_LEN: 32, //…ÁÕ≈≥§∂»
    COMPUTER_ID_LEN: 33, //ª˙∆˜–Ú¡–
    UNDER_WRITE_LEN: 32, //∏ˆ–‘«©√˚
    MOBILEPHONE_LEN: 32, //∏ˆ–‘«©√˚

    //GlobalFrame.h
    //宏定义

    //游戏状态
    GS_FREE: 0, //空闲状态
    GS_PLAYING: 100, //游戏状态

    //////////////////////////////////////////////////////////////////////////
    //IPC 网络事件

    IPC_MAIN_SOCKET: 1, //网络消息

    IPC_SUB_SOCKET_SEND: 1, //网络发送
    IPC_SUB_SOCKET_RECV: 2, //网络接收

    IPC_MAIN_CONFIG: 2, //配置信息

    IPC_SUB_SERVER_INFO: 1, //房间信息
    IPC_SUB_COLUMN_INFO: 2, //列表信息

    //////////////////////////////////////////////////////////////////////////
    //IPC 用户信息

    IPC_MAIN_USER: 3, //用户信息

    IPC_SUB_USER_COME: 1, //用户信息
    IPC_SUB_USER_STATUS: 2, //用户状态
    IPC_SUB_USER_SCORE: 3, //用户积分
    IPC_SUB_GAME_START: 4, //游戏开始
    IPC_SUB_GAME_FINISH: 5, //游戏结束
    IPC_SUB_UPDATE_FACE: 6, //更新头像
    IPC_SUB_MEMBERORDER: 7, //更新头像

    //////////////////////////////////////////////////////////////////////////
    //IPC 控制信息

    IPC_MAIN_CONCTROL: 4, //控制信息

    IPC_SUB_START_FINISH: 1, //启动完成
    IPC_SUB_CLOSE_FRAME: 2, //关闭框架
    IPC_SUB_JOIN_IN_GAME: 3, //加入游戏

    //////////////////////////////////////////////////////////////////////////
    //网络命令码

    MDM_GF_GAME: 99, //游戏消息
    MDM_GF_FRAME: 98, //框架消息
    MDM_GF_PRESENT: 97, //礼物消息
    MDM_GF_BANK: 96, //银行消息

    SUB_GF_INFO: 111, //游戏信息
    SUB_GF_USER_READY: 112, //用户同意
    SUB_GF_LOOKON_CONTROL: 113, //旁观控制
    SUB_GF_KICK_TABLE_USER: 114, //踢走用户
    SUB_GF_WRITE_MATCH_SCORE: 115, //写比赛成绩

    SUB_GF_OPTION: 116, //游戏配置
    SUB_GF_SCENE: 117, //场景信息

    SUB_GF_USER_CHAT: 118, //用户聊天

    SUB_GF_MESSAGE: 119, //系统消息

    //SUB_GF_GIFT: 400,                             //赠送消息

    SUB_GF_BANK_STORAGE: 250, //银行存储
    SUB_GF_BANK_GET: 251, //银行提取
    SUB_GF_BANK_PRESENT: 252, //赠送金币
    SUB_GF_BANK_MODIFY_PASS: 253, //修改密码
    SUB_GF_BANK_QUERY: 254, //查询金币
    SUB_GF_BANK_PRESENT_QUREY: 255, //查询用户
    SUB_GF_BANK_CLOSE: 256, //退出
    SUB_GF_TRAN_RECORD: 257, //转帐记录
    SUB_GF_USER_INFO_QUREY: 258, //查询用户
    SUB_GF_USER_RECHARGE: 259, //用户充值

    SUB_GF_FLOWER_ATTRIBUTE: 530, //鲜花属性
    SUB_GF_FLOWER: 531, //鲜花消息
    SUB_GF_EXCHANGE_CHARM: 532, //兑换魅力

    SUB_GF_FLOWER_MB: 533, //手机端送人气值

    SUB_GF_PROPERTY: 510, //道具消息
    SUB_GF_PROPERTY_RESULT: 511, //道具结果
    SUB_GF_RESIDUAL_PROPERTY: 512, //剩余道具
    SUB_GF_PROP_ATTRIBUTE: 513, //道具属性
    SUB_GF_PROP_BUGLE: 514, //喇叭道具
    SUB_GF_QUERY_USER_INFO: 515, //鲜花消息
    SUB_GF_SEND_HONG_BAO: 516, //发红包
    SUB_GF_QIANG_HONG_BAO: 517, //发红包

    SUB_GF_PRESENT_RESULT: 519, //送人气值结果

    //消息类型
    SMT_INFO: 0x0001, //信息消息
    SMT_EJECT: 0x0002, //弹出消息
    SMT_GLOBAL: 0x0004, //全局消息
    SMT_CLOSE_GAME: 0x1000, //关闭游戏

    //发送场所
    LOCATION_GAME_ROOM: 1, //游戏房间
    LOCATION_PLAZA_ROOM: 2 };
module.exports = GlobalDef;

cc._RFpop();
},{}],"GlobalFun":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b14e7zGx6xFk7bWtN1oxErw', 'GlobalFun');
// Script/external/GlobalFun.js

"use strict";

require("MD5");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = {};
var ZORDER = cc.Enum({
    LoadingOrder: 1000,
    AlertOrder: 1001,
    ToastOrder: 1002
});

GlobalFun.ActionShowTanChuang = function ActionShowTanChuang(widget, cb) {
    if (cc.isValid(widget) === false) {
        console.log("[GlobalFun][ActionShowTanChuang] widget is invalid");
        return;
    }
    widget.opacity = 0;
    widget.scale = 0.01;
    widget.runAction(cc.spawn(cc.fadeIn(0.25), cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.05, 1.0)), cc.callFunc(function () {
        if (typeof cb === "function") {
            cb();
        }
    })));
};
/**
 * 
 * @param {*} params 
 * {
 *  message:对话框显示的文本,
 *  textAlignment:文本对齐模式，默认居中
 *  btn: [
 *      {
 *          name:按钮显示的文本，
 *          callback: 按钮回调，
 *      }
 *      ]
 * }
 * @param {*} context 
 */
GlobalFun.showAlert = function showAlert(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/AlertView", function (err, AlertPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(AlertPrefab);
            context.addChild(newNode, ZORDER.AlertOrder);
            newNode.getComponent("AlertView").init(params);
            GlobalFun.ActionShowTanChuang(cc.find("commonBg", newNode));
            console.log("showAlert");
        }
    });
};

GlobalFun.showToast = function showToast(message, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/ToastView", function (err, ToastPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(ToastPrefab);
            newNode.getComponent("ToastView").init({ message: message });
            context.addChild(newNode, ZORDER.ToastOrder);
            console.log("showToast");
        }
    });
};
/*
showPopWaiting()
@params{
    waitingText: 界面显示的文字,
    waitingTime: 界面存在的时间,超时即销毁界面,
    closeEvent: 关闭界面监听的事件, 
    callBackFunc: 收到监听事件执行的回调函数,
}
*/
GlobalFun.showPopWaiting = function showPopWaiting(context, params) {
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/PopWaitingView", function (err, PopWaitPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(PopWaitPrefab);
            newNode.getComponent("PopWaitView").onInit(params);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
            console.log("showPopWaiting");
        }
    });
};

GlobalFun.showLoadingView = function showLoadingView(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showLoadingView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/LoadingView", function (err, res) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(res);
            newNode.getComponent("LoadingView").init(params);
            context.addChild(newNode, ZORDER.LoadingOrder);
        }
    });
};

GlobalFun.showBindView = function showBindView(context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showBindView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/GuestBindView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showShopView = function showShopView(context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showShopView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/ShopView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.getsign = function getsign(params) {
    params = params + "key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x"; //加入key
    return cc.md5Encode(params).toLowerCase();
};

GlobalFun.buildRequestParam = function buildRequestParam(params) {
    var nowTime = Math.floor(Date.now() / 1000);
    //加入时间戳
    params["datetamp"] = nowTime;
    //加入GUID
    if (GlobalUserData.szUserGUID && GlobalUserData.szUserGUID.length > 0) {
        params["token"] = GlobalUserData.szUserGUID;
    }
    var sort_params = Object.keys(params).sort();
    console.log("[GlobalFun][buildRequestParam] " + JSON.stringify(params, null, ' '));
    var paramString = "";
    for (var ki in sort_params) {
        var key = sort_params[ki];
        if (params.hasOwnProperty(key)) {
            var element = params[key];
            paramString = paramString + key + "=" + element + "&";
        }
    }
    paramString = paramString + "sign=" + GlobalFun.getsign(paramString);
    return paramString;
};

GlobalFun.ipToNumber = function ipToNumber(ip) {
    var num = 0;
    if (ip == "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length != 4) {
        return num;
    }
    num += parseInt(aNum[0]) << 24;
    num += parseInt(aNum[1]) << 16;
    num += parseInt(aNum[2]) << 8;
    num += parseInt(aNum[3]) << 0;
    num = num >>> 0; //这个很关键，不然可能会出现负数的情况
    return num;
};

GlobalFun.numberToIp = function numberToIp(number) {
    var ip = "";
    if (number <= 0) {
        return ip;
    }
    var ip3 = number << 0 >>> 24;
    var ip2 = number << 8 >>> 24;
    var ip1 = number << 16 >>> 24;
    var ip0 = number << 24 >>> 24;

    ip += ip0 + "." + ip1 + "." + ip2 + "." + ip3;

    return ip;
};
//数字填充前缀0
GlobalFun.PrefixInteger = function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
};

//获得(min,max)之间的随机整数，（min<= x <= max）
GlobalFun.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/* args {
    fileName,
    *anim,
    *loop,
    *remove,
    *callback,
    *x,
    *y,
    *scale,
    *tag,
} */
GlobalFun.playEffects = function playEffects(parent, args) {
    if (cc.isValid(parent) == false) {
        return;
    }
    var fileName = args.fileName;
    var tag = args.tag || fileName;
    var anim = args.anim;
    var loop = args.loop;
    var node;
    if (parent.getChildByName(tag)) {
        node = parent.getChildByName(tag);
        console.log("node exist ", tag);
    } else {
        node = new cc.Node(tag);
        node.parent = parent;
        console.log("node create ", tag);
    }
    node.setPosition(cc.p(args.x || 0, args.y || 0));
    if (args.remove === undefined) {
        args.remove = true;
    }
    var filePath = "anim/";
    var ske = filePath + fileName + "_ske";
    var tex = filePath + fileName + "_tex";
    var display = node.getComponent(dragonBones.ArmatureDisplay) || node.addComponent(dragonBones.ArmatureDisplay);
    display.removeEventListener(dragonBones.EventObject.COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.FRAME_EVENT, display.eventHandler, display);
    display.eventHandler = function (event) {
        console.log("[playEffects]", fileName, event.type);
        if (event.type === dragonBones.EventObject.COMPLETE) {
            if (typeof args.callback === "function") {
                args.callback(node);
            }
            if (args.remove) {
                node.destroy();
            }
        }
    };

    cc.loader.loadRes(ske, function (err, dragonBonesAsset) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (dragonBonesAsset instanceof dragonBones.DragonBonesAsset) {
            display.dragonAsset = dragonBonesAsset;
            cc.loader.loadRes(tex, dragonBones.DragonBonesAtlasAsset, function (err, dragonBonesAtlasAsset) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                if (dragonBonesAtlasAsset instanceof dragonBones.DragonBonesAtlasAsset) {
                    display.dragonAtlasAsset = dragonBonesAtlasAsset;
                    var armatureNames = display.getArmatureNames();
                    if (armatureNames.length <= 0) {
                        console.log("[playEffects][armatureNames] " + fileName + " is empty");
                        return;
                    }
                    var armatureName = armatureNames[0];
                    // // display.buildArmature(armatureName);
                    display.armatureName = armatureName;
                    var animationNames = display.getAnimationNames(armatureName);
                    if (animationNames.length <= 0) {
                        console.log("[playEffects][animationNames] " + fileName + " is empty");
                        return;
                    }
                    var animationName = animationNames.indexOf(anim) !== -1 && anim || animationNames[0];
                    var times = loop && -1 || 1;
                    display.addEventListener(dragonBones.EventObject.COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.FRAME_EVENT, display.eventHandler, display);
                    display.playAnimation(animationName, times);
                    console.log(animationName);
                } else {}
            });
        } else {}
    });
};

module.exports = GlobalFun;
// {
//     ActionShowTanChuang: ActionShowTanChuang,
//     showAlert: showAlert,
//     showToast: showToast,
//     showPopWaiting: showPopWaiting,
//     buildRequestParam: buildRequestParam,
//     ipToNumber: ipToNumber,
//     numberToIp: numberToIp,
//     PrefixInteger: PrefixInteger,
//     showLoadingView: showLoadingView,
//     getRandomInt: getRandomInt,
//     playEffects: playEffects,
//     showBindView: showBindView,
//     showShopView: showShopView,
// };

cc._RFpop();
},{"GlobalUserData":"GlobalUserData","MD5":"MD5"}],"GlobalUserData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '82fedQuEdFL3YFUwo343EL9', 'GlobalUserData');
// Script/GlobalUserData.js

"use strict";

var AudioMng = require("AudioMng");
var plaza_cmd = require("CMD_Plaza");
var GlobalUserData = {
    wFaceID: undefined, //头像索引
    cbGender: undefined, //用户性别
    cbMember: undefined, //会员等级
    isGuest: undefined, //是否是游客
    isOpenRegister: undefined, //是否开启注册功能
    isOpenIAP: undefined, //是否开启苹果iap
    wEncryptID: undefined, //随机码1
    wCodeCheckID: undefined, //随机码2
    dwUserID: undefined, //用户 I D
    dwGameID: undefined, //游戏 I D
    dwExperience: undefined, //用户经验
    szMobileAuth: undefined, //注册时验证码
    szAccounts: undefined, //登录帐号
    szNickName: undefined, //玩家昵称
    szPassWord: undefined, //登录密码
    szGroupName: undefined, //社团信息
    szUnderWrite: undefined, //个性签名

    //扩展信息
    dwCustomFaceVer: undefined, //头像版本
    //钱
    dwFortuneCoin: undefined, //福币
    llGameScore: undefined, //游戏金币
    llInsureScore: undefined, //银行金币
    dwCoupon: undefined, //贝壳
    dwInsureCoupon: undefined, //银行贝壳
    dwMatchTicket: undefined, //参赛券
    isFirstBank: undefined, // 首次使用
    bServerIndex: undefined, //进入服务器的index
    wExchangenum: undefined, //魅力兑换次数

    roomList: [],
    init: function init() {
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.isOpenIAP = true;
        } else {
            this.isOpenIAP = false;
        }
        cc.loader.loadRes("json/shoppage", function (err, content) {
            console.log(content);
            GlobalUserData.shopData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.shopData, null, ' '));
        });
        cc.loader.loadRes("json/present", function (err, content) {
            console.log(content);
            GlobalUserData.presentData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.presentData, null, ' '));
        });
        this.roomList = [];
        var music_setting = JSON.parse(cc.sys.localStorage.getItem('music_setting') || "{}");
        var effect_setting = JSON.parse(cc.sys.localStorage.getItem('effect_setting') || "{}");
        this.bMusicAble = music_setting.musicable === undefined || music_setting.musicable;
        this.nMusic = music_setting.musicvalue === undefined && 1.0 || music_setting.musicvalue;
        this.bEffectAble = effect_setting.effectable === undefined || effect_setting.effectable;
        this.nEffect = effect_setting.effectvalue === undefined && 1.0 || effect_setting.effectvalue;

        if (GlobalUserData.bMusicAble) {
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
        } else {
            AudioMng.setMusicVolume(0);
        }
        if (GlobalUserData.bEffectAble) {
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        } else {
            AudioMng.setEffectsVolume(0);
        }
    },
    setMusicAble: function setMusicAble(able) {
        this.bMusicAble = able;
        if (able) {
            this.nMusic = 1.0;
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
            AudioMng.resumeMusic();
        } else {
            this.nMusic = 0;
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
            AudioMng.pauseMusic();
        }
        var music_setting = {
            musicable: able,
            musicvalue: this.nMusic
        };
        cc.sys.localStorage.setItem("music_setting", JSON.stringify(music_setting));
    },
    setEffectAble: function setEffectAble(able) {
        this.bEffectAble = able;
        if (able) {
            this.nEffect = 1.0;
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        } else {
            this.nEffect = 0;
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        }
        var effect_setting = {
            effectable: able,
            effectvalue: this.nEffect
        };
        cc.sys.localStorage.setItem("effect_setting", JSON.stringify(effect_setting));
    },
    onLoadData: function onLoadData(pData) {
        // struct CMD_GP_LogonSuccessMobile
        // {
        //     //扩展信息
        //     DWORD								dwCustomFaceVer;				//头像版本
        //     BYTE								cbMoorMachine;					//锁定机器
        //     BYTE								cbBindWeiXin;					//绑定微信 WSL
        //     WORD								wFaceID;						//头像索引
        //     BYTE								cbMember;						//会员等级
        //     BYTE								cbGender;						//用户性别
        //     WORD								wEncryptID;						//随机码1
        //     WORD								wCodeCheckID;					//随机码2
        //     DWORD								dwExperience;					//用户经验
        //     DWORD								dwGameID;						//游戏 I D
        //     DWORD								dwUserID;						//用户 I D
        //---- DWORD                               dwLoveLiness;                   //用户魅力值
        //     LONGLONG							llGameScore;					//游戏金币
        //     LONGLONG							llInsureScore;					//银行金币
        //     TCHAR								szAccounts[NAME_LEN];			//登录帐号
        //     TCHAR								szNickName[NAME_LEN];			//昵称
        //-----------新增
        // BYTE                                cbUserType;                     //用户类型
        // TCHAR								szWeChatImgURL[256];			// 微信头相
        // TCHAR								szWeChatNickName[NAME_LEN];		// 微信昵称
        // };
        this.dwCustomFaceVer = pData.readdword();
        this.cbMoorMachine = pData.readbyte();
        this.cbBindWeiXin = pData.readbyte();
        this.wFaceID = pData.readword();
        this.cbMember = pData.readbyte();
        this.cbGender = pData.readbyte();
        this.wEncryptID = pData.readword();
        this.wCodeCheckID = pData.readword();
        this.dwExperience = pData.readdword();
        this.dwGameID = pData.readdword();
        this.dwUserID = pData.readdword();
        this.dwLoveLiness = pData.readdword();
        this.llGameScore = pData.readint64();
        this.llInsureScore = pData.readint64();
        this.szAccounts = pData.readstring(32);
        this.szNickName = pData.readstring(32);

        this.cbUserType = pData.readbyte();
        this.szWeChatImgURL = pData.readstring(256);
        this.szWeChatNickName = pData.readstring(32);
        pData.blockEnd();
        while (true) {
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("[GlobalUserData]size = " + dataSize + " describe = " + dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch (dataDescribe) {
                case plaza_cmd.DTP_SEND_MOBILE_GUID:
                    this.szUserGUID = pData.readstring(dataSize);
                default:
                    break;
            }
        }
    },
    getRoomByGame: function getRoomByGame(wKindID) {
        var roomList = [];
        for (var index = 0; index < this.roomList.length; index++) {
            var element = this.roomList[index];
            if (element.wKindID == wKindID) {
                roomList.push(element);
            }
        }
        return roomList;
    }
};

module.exports = GlobalUserData;

cc._RFpop();
},{"AudioMng":"AudioMng","CMD_Plaza":"CMD_Plaza"}],"GuestBindView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9622c+r5ThJnYo5FBmGVn8W', 'GuestBindView');
// Script/plaza/views/plaza/GuestBindView.js

"use strict";

require("MD5");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
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
        m_Editbox_phone: cc.EditBox,
        m_Editbox_secret: cc.EditBox,
        m_Editbox_verify: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onSend: function onSend(params) {
        var szTel = this.m_Editbox_phone.string;
        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onSend] 手机号码不合法");
            GlobalFun.showToast("手机号码不合法");
            return;
        }

        var url = GlobalDef.httpUserCenter;
        url += "/hz/CaptchaMobile.ashx";
        var params = "Mobile=" + szTel;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {}
                GlobalFun.showToast(value.Msg);
            }
        };
        xhr.open("POST", url, true);
        xhr.send(params);
        console.log("[GuestBindView][onSend] " + params);
    },
    onConfirm: function onConfirm(params) {
        var szTel = this.m_Editbox_phone.string;
        var szPwd = this.m_Editbox_secret.string;
        var szVerify = this.m_Editbox_verify.string;
        if (szTel.length <= 0 || szPwd.length <= 0 || szVerify.length <= 0) {
            console.log("帐号密码等信息不能为空");
            GlobalFun.showToast("帐号密码等信息不能为空");
            return;
        }
        if (szPwd.length < 6 || szPwd.length > 16) {
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

        var url = GlobalDef.httpUserCenter;
        // url += "/Guest/GuestBindMobile.ashx";
        url += "/HZMobile/GuestBindMobile.ashx";

        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["mobile"] = szTel;
        params["pwd"] = cc.md5Encode(szPwd);
        params["code"] = szVerify;
        params["kindid"] = zjh_cmd.KIND_ID;
        params["nickname"] = GlobalUserData.szNickName;

        var paramString = GlobalFun.buildRequestParam(params);

        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
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
                    GlobalFun.showToast("帐号绑定成功，您可以用正式帐号登录游戏了");
                    cc.director.emit("onGuestBindSuccess");
                    self.onClose();
                }
                GlobalFun.showToast(value.msg || value.Msg);
            }
        };
        xhr.open("POST", url, true);
        xhr.send(paramString);
        console.log("[GuestBindView][onConfirm] " + paramString);
    },
    onClose: function onClose(params) {
        this.node.destroy();
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var BaseFrame = require("BaseFrame");
var GlobalFun = require("GlobalFun");
cc.Class({
    extends: BaseFrame,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },
    // name: "helloFrame",
    // use this for initialization
    onLoad: function onLoad() {
        // jsbTest.testlog();
        // var self = this;
        // this.socket = ClientSocket.createSocket(function(pData){
        //     // console.log('callback_begin');
        //     // var mainID = pData.getmain();
        //     // var subID = pData.getsub();
        //     // console.log(mainID);
        //     // console.log(subID);
        //     // console.log('callback_end');
        //     self.onSocketCallBack(pData);
        // });
        // // var pData = CCmd_Data.create();
        // // pData.setcmdinfo(2,3);
        // // pData.pushbyte(1);
        // // pData.pushword(23333);
        // // pData.pushdouble(123.3434);
        // // console.log(pData.getmain());
        // // console.log(pData.getsub());
        // // console.log(pData.readbyte());
        // // console.log(pData.readword());
        // // console.log(pData.readdouble());
        // this.socket.ConnectSocket("122.226.186.38",9009);
        // this.onCreateSocket("122.226.186.38",9009);
        // this.label.string = this.text;
        console.log("[HelloWorld][onLoad]");
    },
    onEnable: function onEnable(params) {
        console.log("[HelloWorld][onEnable]");
    },
    start: function start(params) {
        console.log("[HelloWorld][start]");
    },
    // called every frame
    update: function update(dt) {},
    play: function play(params) {
        console.log("play");
        // var node = new cc.Node();
        // this.node.addChild(node,9999);
        var bDate = Date.now();
        GlobalFun.playEffects(this.node, {
            fileName: "yx_wlg3",
            anim: "yx_gzyz",
            loop: false,
            // x: 200,
            // y: 200,
            callback: function callback() {
                var eDate = Date.now();
                console.log("time = ", eDate - bDate);
            }
        });
        // node.runAction(cc.sequence(
        //     cc.delayTime(2),
        //     cc.callFunc(function (node) {
        //         node.destroy();
        //     })
        // )
        // )
    },
    // onSocketCallBack: function(pData) {
    //     if(pData === undefined)
    //     {
    //         return;
    //     }
    //     var main = pData.getmain();
    //     var sub = pData.getsub();
    //     console.log('main = '+main+' sub = '+sub);
    //     if (main === 0) 
    //     {
    //         if(sub === 0)
    //         {
    //             this.onConnectCompeleted();
    //         }
    //         else
    //         {
    //             this.onSocketError(pData);
    //         }
    //     }
    //     else
    //     {
    //         this.onSocketEvent(pData);
    //     }
    // },
    onConnectCompeleted: function onConnectCompeleted() {
        this.sendLogon();
        console.log('hello_onConnectCompeleted');
    },
    // onSocketError:function(pData){
    //     console.log('onSocketError');
    // },
    // onSocketEvent: function(pData){
    //     console.log("onSocketEvent");
    // },
    sendLogon: function sendLogon() {
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE, plaza_cmd.SUB_GP_LOGON_MOBILE);
        logonData.pushdword(1);
        logonData.pushdword(0);
        logonData.pushdword(3);
        logonData.pushdword(1);
        logonData.pushstring("17602170313", 32);
        logonData.pushstring("25d55ad283aa400af464c76d713c07ad", 33);
        logonData.pushstring("2d4d7c95e5df0179af2466f635ca71de", 33);
        logonData.pushbyte(0);
        logonData.pushbyte(0);
        this.sendSocketData(logonData);
    }
});

cc._RFpop();
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","GlobalFun":"GlobalFun","MD5":"MD5"}],"LoadingView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8ad8eeapDBLD7IzFVMMTYu2', 'LoadingView');
// Script/LoadingView.js

"use strict";

var GlobalFun = require("GlobalFun");
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
        m_Label_des: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        console.log("[LoadingView][init] params = " + JSON.stringify(params, null, ' '));
        this._closeEvent = params.closeEvent;
        this._loadfunc = params.loadfunc;
        this._closefunc = params.closefunc;
        this._connectDes = params.des || "正在连接游戏服务器...";
        cc.director.on(this._closeEvent, this.close, this);
        cc.director.on("LoadingViewError", this.showMessageBox, this);
        cc.director.on("LoadingViewOnConnect", this.onConnected, this);
        cc.director.on("LoadingViewOnLogonFinish", this.onLogonFinish, this);

        if (typeof this._loadfunc === "function") {
            this._loadfunc();
        }
    },
    showMessageBox: function showMessageBox(params) {
        var msg = params.detail.msg;
        var type = params.detail.type;
        var self = this;
        GlobalFun.showAlert({
            message: msg,
            btn: [{
                name: "确认",
                callback: function callback() {
                    self.node.destroy();
                }
            }]
        });
    },
    onConnected: function onConnected(params) {
        var msg = params.detail.message;
        console.log("[LoadingView][onConnected] msg = " + msg);
        this.m_Label_des.string = msg;
    },
    onLogonFinish: function onLogonFinish(params) {
        var msg = params.detail.message;
        console.log("[LoadingView][onLogonFinish] msg = " + msg);
        this.m_Label_des.string = msg;
        this.close();
    },
    close: function close() {
        console.log("[LoadingView][close]");
        cc.director.off(this._closeEvent, this.close, this);
        if (typeof this._closefunc === "function") {
            this._closefunc();
        }
        // this.node.destroy();
    },
    onEnable: function onEnable() {},
    onDisable: function onDisable() {
        cc.director.off("LoadingViewError", this.showMessageBox, this);
        cc.director.off("LoadingViewOnConnect", this.onConnected, this);
        cc.director.off("LoadingViewOnLogonFinish", this.onLogonFinish, this);
    },
    onDestroy: function onDestroy() {
        console.log("[LoadingView][onDestroy]");
        cc.sys.garbageCollect();
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"LogonFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd88c4RIaBJFFL8HEyKmKgcg', 'LogonFrame');
// Script/plaza/models/LogonFrame.js

"use strict";

var BaseFrame = require("BaseFrame");
require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var zjh_cmd = require("CMD_ZaJinHua");
var GlobalUserData = require("GlobalUserData");
var GameServerItem = require("GameServerItem");
var GlobalDef = require("GlobalDef");
cc.Class({
    extends: BaseFrame,

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        // for (var prop in GlobalUserData) {
        //   console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        // }
    },
    onConnectCompeleted: function onConnectCompeleted() {
        cc.director.emit("LoadingViewOnConnect", { message: "正在登录游戏服务器..." });
        if (this._logonMode === 0) {
            this.sendLogon();
        } else if (this._logonMode === 1) {
            this.sendRegister();
        } else if (this._logonMode === 2) {
            this.sendVisitor();
        } else {
            this.onCloseSocket();
            console.log("未知登录模式");
        }
    },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        if (main === plaza_cmd.MDM_GP_LOGON_MOBILE) {
            this.onSubLogonEvent(sub, pData);
        } else if (main === plaza_cmd.MDM_GP_SERVER_LIST) {
            this.onRoomListEvent(sub, pData);
        } else if (main === plaza_cmd.MDM_GP_SYSTEM) {
            console.log("系统消息");
        }
    },
    onSubLogonEvent: function onSubLogonEvent(sub, pData) {
        if (sub === plaza_cmd.SUB_GP_LOGON_SUCCESS_MOBILE) {
            GlobalUserData.onLoadData(pData);
            var bRememberPwd = cc.sys.localStorage.getItem("bRememberPwd");
            if (GlobalUserData.isGuest !== true) {
                GlobalUserData.szPassWord = cc.md5Encode(this._szPassword);
                if (bRememberPwd == 'true') {
                    cc.sys.localStorage.setItem('account', this._szAccount);
                    cc.sys.localStorage.setItem('password', this._szPassword);
                } else {
                    cc.sys.localStorage.removeItem('account');
                    cc.sys.localStorage.removeItem('password');
                }
            }
            console.log("logonframe logon success");
            cc.director.emit("LogonSuccess");
        } else if (sub === plaza_cmd.SUB_GP_LOGON_ERROR_MOBILE) {
            this.onCloseSocket();
            console.log("logonframe login error");
            //登陆失败
            // struct CMD_GP_LogonError
            // {
            //     LONG								lErrorCode;						//错误代码
            //     char								szErrorDescribe[128];			//错误消息
            // };
            var logonError = {};
            logonError.lErrorCode = pData.readint();
            logonError.szErrorDescribe = pData.readstring();
            if (logonError.szErrorDescribe) {
                cc.director.emit("LoadingViewError", { msg: logonError.szErrorDescribe, type: GlobalDef.SMT_CLOSE_GAME });
            }
        } else if (sub === plaza_cmd.SUB_GP_LOGON_FINISH_MOBILE) {
            console.log("logonframe login finish");
            this.onCloseSocket();
            cc.director.emit("LoadingViewOnLogonFinish", { message: "正在进入游戏大厅..." });
            // cc.director.loadScene("PlazaScene");
            // cc.sys.garbageCollect();
        }
    },
    onRoomListEvent: function onRoomListEvent(sub, pData) {
        console.log("logonframe onRoomListEvent");
        switch (sub) {
            case plaza_cmd.SUB_GP_LIST_TYPE:
                console.log("SUB_GP_LIST_TYPE");
                break;
            case plaza_cmd.SUB_GP_LIST_KIND:
                console.log("SUB_GP_LIST_KIND");
                break;
            case plaza_cmd.SUB_GP_LIST_STATION:
                console.log("SUB_GP_LIST_STATION");
                break;
            case plaza_cmd.SUB_GP_LIST_SERVER:
                var pGameServer = new GameServerItem();
                //游戏房间列表结构
                // struct tagGameServer
                // {
                //     WORD								wSortID;							//排序号码
                //     WORD								wKindID;							//名称号码
                //     WORD								wServerID;							//房间号码
                //     WORD								wStationID;							//站点号码
                //     WORD								wServerPort;						//房间端口
                //     DWORD								dwServerAddr;						//房间地址
                //     DWORD								dwOnLineCount;						//在线人数
                //     TCHAR								szServerName[SERVER_LEN];			//房间名称
                // };
                pGameServer.onInit(pData);
                // for (var prop in pGameServer) {
                //     if (typeof(pGameServer[prop]) == "function") continue;
                //     console.log('pGameServer.' + prop, '=', pGameServer[prop]);
                // }
                GlobalUserData.roomList.push(pGameServer);
                // console.log(pGameServer);
                break;
            default:
                break;
        }
    },
    sendLogon: function sendLogon() {
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE, plaza_cmd.SUB_GP_LOGON_MOBILE);
        logonData.pushdword(1);
        logonData.pushdword(0);
        logonData.pushdword(zjh_cmd.KIND_ID);
        logonData.pushdword(1);
        logonData.pushstring(this._szAccount, 32);
        // logonData.pushstring("25d55ad283aa400af464c76d713c07ad",33);
        if (GlobalUserData.isGuest) {
            logonData.pushstring(this._szPassword, 33);
        } else {
            logonData.pushstring(cc.md5Encode(this._szPassword), 33);
        }
        logonData.pushstring("", 33);
        logonData.pushstring("", 32);
        this.sendSocketData(logonData);
    },
    sendRegister: function sendRegister() {
        var registerData = CCmd_Data.create();
        var dwMobileSysType = 1;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            dwMobileSysType = 2;
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            dwMobileSysType = 1;
        }
        registerData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE, plaza_cmd.SUB_GP_REGISTER_MOBILE);
        registerData.pushword(1);
        registerData.pushbyte(1);
        registerData.pushdword(dwMobileSysType);
        registerData.pushdword(zjh_cmd.KIND_ID);
        registerData.pushdword(1);
        registerData.pushstring(this._szRegAccount, 32);
        registerData.pushstring(cc.md5Encode(this._szRegPassword), 33);
        registerData.pushstring(this._szMobilePhone, 32);
        registerData.pushstring(this._szNickName, 32);
        registerData.pushstring(this._szMobileAuth, 32);
        registerData.pushstring("", 33);
        this.sendSocketData(registerData);
        // struct CMD_GP_RegisterAccountsMoblie
        // {
        //     WORD								wFaceID;						// 头像标识
        //     BYTE								cbGender;						// 用户性别
        //     DWORD								dwMobileSysType;				//手机操作系统类型(1苹果系统 2安卓系统)
        //     DWORD								dwMobileAppKind;				// 广场手机版本
        //     DWORD								dwMobileAppVersion;				// 广场手机版本
        //     TCHAR								szAccounts[NAME_LEN];			// 登录帐号
        //     TCHAR								szPassWord[PASS_LEN];			// 登录密码
        //     TCHAR                               szMobilephone[MOBILEPHONE_LEN]; // 手机
        //     TCHAR								szNickName[NAME_LEN];			// 昵称
        //     TCHAR								szMobileAuth[NAME_LEN];			//手机验证码
        //     TCHAR								szMobileMachine[COMPUTER_ID_LEN];//机器序列号
        // };
    },
    sendVisitor: function sendVisitor() {
        this.sendLogon();
    },
    onLogonByAccount: function onLogonByAccount(szAccount, szPassword) {
        this._szAccount = szAccount;
        this._szPassword = szPassword;
        this._szMobilePhone = "0123456789";
        GlobalUserData.isGuest = false;
        this._logonMode = 0;
        console.log("[logonframe][onLogonByAccount] " + szAccount + " # " + szPassword);
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
        //     return false;
        // }
        if (this.onCreateSocket(GlobalDef.LOGON_SERVER_IP, GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onLogonByAccount][onCreateSocket] success");
        return true;
    },
    onLogonByVisitor: function onLogonByVisitor(szAccount, szPassword) {
        this._szAccount = szAccount;
        this._szPassword = szPassword;
        this._szMobilePhone = "0123456789";
        this._logonMode = 2;
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onLogonByVisitor][onCreateSocket] fail");
        //     return false;
        // }
        if (this.onCreateSocket(GlobalDef.LOGON_SERVER_IP, GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onLogonByVisitor][onCreateSocket] success");
        return true;
    },
    onRegister: function onRegister(szAccount, szPassword, szNickName, szMobileAuth) {
        this._szRegAccount = szAccount;
        this._szRegPassword = szPassword;
        this._szNickName = szNickName;
        this._szMobilePhone = szAccount;
        this._szMobileAuth = szMobileAuth;
        this._logonMode = 1;
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onRegister][onCreateSocket] fail");
        //     return false;
        // }
        if (this.onCreateSocket(GlobalDef.LOGON_SERVER_IP, GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onRegister][onCreateSocket] success");
        return true;
    }
});

cc._RFpop();
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","CMD_ZaJinHua":"CMD_ZaJinHua","GameServerItem":"GameServerItem","GlobalDef":"GlobalDef","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"LogonScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9ffa3yy2StDRrsfOQSqSbEA', 'LogonScene');
// Script/plaza/LogonScene.js

"use strict";

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
            type: cc.Prefab
        },
        registerView: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("[LogonScene][onLoad]");
        GlobalUserData.init();
        AudioMng.playMusic("bgm_plaza");
        this._logonFrame = this.node.getComponent("LogonFrame");
        this._logonView = cc.find("Canvas/LogonView");
        this.appUpdate();
    },
    onEnable: function onEnable() {
        cc.director.on('onLogon', this.onLogon, this);
        cc.director.on('onShowRegister', this.onShowRegister, this);
        cc.director.on('onShowLogon', this.onShowLogon, this);
        cc.director.on('onRegister', this.onRegister, this);
    },
    onDisable: function onDisable() {
        cc.director.off('onLogon', this.onLogon, this);
        cc.director.off('onShowRegister', this.onShowRegister, this);
        cc.director.off('onShowLogon', this.onShowLogon, this);
        cc.director.off('onRegister', this.onRegister, this);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
    },
    appUpdate: function appUpdate() {
        var szMachineID = MultiPlatform.getMachineID();
        var url = GlobalDef.httpInitUrl;
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["version"] = "1.1";
        // params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["mobilemachine"] = szMachineID || "2d4d7c95e5df0179af2466f635ca71de";
        params["schannelid"] = "AppStore";
        // params["channelid"] = GlobalDef.CHANNELID_center;
        if (cc.sys.os == cc.sys.OS_IOS) {
            params["os"] = "2";
        } else {
            // todo
            params["os"] = "2"; //"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        console.log("[LogonScene][appUpdate] params ", paramString);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][appUpdate] " + xhr.readyState);
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                response = response.replace(/[\b\f\n\r\t]/g, '');
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    var version = parseFloat(value.version);
                    var curVersion = parseFloat(MultiPlatform.getAppVersion() || "1.0");
                    var IsMaintained = parseInt(value.ismaintained);
                    if (IsMaintained) {
                        GlobalFun.showAlert({
                            message: value.maintaintime,
                            btn: [{
                                name: "确定",
                                callback: function callback() {
                                    self.appUpdate();
                                }
                            }]
                        });
                    } else if (version > curVersion) {
                        var isForceUpdate = parseInt(value.isforceupdate);
                        var description = value.description;
                        var szUrl = value.url;
                        if (isForceUpdate) {
                            GlobalFun.showAlert({
                                message: description,
                                btn: [{
                                    name: "更新",
                                    callback: function callback() {
                                        cc.sys.openURL(szUrl);
                                    }
                                }]
                            });
                        } else {
                            GlobalFun.showAlert({
                                message: description,
                                btn: [{
                                    name: "暂不更新"
                                }, {
                                    name: "去更新",
                                    callback: function callback() {
                                        cc.sys.openURL(szUrl);
                                    }
                                }]
                            });
                        }
                    }
                    if (value.isopenregister !== undefined) {
                        var isOpenRegister = parseInt(value.isopenregister);
                        GlobalUserData.isOpenRegister = !isOpenRegister;
                    }
                    if (value.systemmessage !== undefined) {
                        if (value.systemmessage.length > 0) {
                            cc.sys.localStorage.setItem("systemmessage", value.systemmessage);
                        }
                    }
                    if (value.config !== undefined) {
                        self.requestServerCfg(value.config);
                    }
                } else {
                    GlobalFun.showAlert({
                        message: value.msg || "服务器开小差了，请稍后重试",
                        btn: [{
                            name: "确定",
                            callback: function callback() {
                                self.appUpdate();
                            }
                        }]
                    });
                }
                cc.director.emit("appUpdateCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "appUpdateCompleted",
            callBackFunc: function callBackFunc() {
                console.log("[LogonScene][appUpdate] callbackfunc");
            },
            waitingTime: 8
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showAlert({
                message: "服务器连接失败，请检查网络后重试",
                btn: [{
                    name: "确定",
                    callback: function callback() {
                        self.appUpdate();
                    }
                }]
            });
            cc.director.emit("appUpdateCompleted");
            xhr.abort();
        };
        xhr.send(paramString);
    },
    requestServerCfg: function requestServerCfg(url) {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][appUpdate] " + xhr.readyState);
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                response = response.replace(/[\b\f\n\r\t]/g, '');
                console.log(response);
                var value = JSON.parse(response);
                if (value.server !== undefined) {
                    GlobalUserData.serverData = value;
                    console.log(JSON.stringify(GlobalUserData.serverData, null, ' '));
                }
                cc.director.emit("configCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "configCompleted",
            callBackFunc: function callBackFunc() {
                console.log("[LogonScene][requestServerCfg] callbackfunc");
            },
            waitingTime: 8
        });
        xhr.open("GET", url, true);
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showToast("服务器开小差了，请稍后重试");
            xhr.abort();
        };
        xhr.send();
    },
    onLogon: function onLogon(event) {
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
            loadfunc: function loadfunc() {
                cc.director.preloadScene("PlazaScene", function () {
                    cc.log("PlazaScene scene preloaded");
                    self._logonFrame.onLogonByAccount(szAccount, szPassword);
                });
            },
            closefunc: function closefunc() {
                cc.director.loadScene("PlazaScene");
                // cc.sys.garbageCollect();
            }
        });
    },
    onRegister: function onRegister(event) {
        console.log("[LogonScene][onRegister]");
        var szAccount = event.detail.szAccount;
        var szPassword = event.detail.szPassword;
        var szNickName = event.detail.szNickName;
        var szMobileAuth = event.detail.szMobileAuth;
        if (szAccount === undefined || szPassword === undefined) {
            console.log("[LogonScene][onRegister] szAccount or szPassword is undefined");
            return;
        }
        this._logonFrame.onRegister(szAccount, szPassword, szNickName, szMobileAuth);
    },
    onShowLogon: function onShowLogon() {
        // AudioMng.playButton();
        // console.log(cc.isValid(this._logonView));
        if (cc.isValid(this._logonView)) {
            // this._logonView = cc.instantiate(this.logonView);
            // this.node.addChild(this._logonView);
            this._logonView.active = true;
        }
        // GlobalFun.ActionShowTanChuang(this._logonView,function () {
        //     console.log("[LogonScene][onShowLogon]ActionShowTanChuang callback");
        // })
    },
    onShowVistor: function onShowVistor() {
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
        if (cc.sys.os == cc.sys.OS_IOS) {
            params["os"] = "2";
        } else {
            // todo
            params["os"] = "2"; //"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        console.log("[LogonScene][onShowVistor] params ", paramString);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][onShowVistor] " + xhr.readyState);
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
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
                        loadfunc: function loadfunc() {
                            cc.director.preloadScene("PlazaScene", function () {
                                cc.log("PlazaScene scene preloaded");
                                self._logonFrame.onLogonByVisitor(GlobalUserData.szAccounts, GlobalUserData.szPassWord);
                            });
                        },
                        closefunc: function closefunc() {
                            cc.director.loadScene("PlazaScene");
                            // cc.sys.garbageCollect();
                        }
                    });
                } else {
                    if (value.msg !== undefined) {
                        GlobalFun.showAlert({ message: value.msg });
                    }
                }
                cc.director.emit("GuestLoginCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "GuestLoginCompleted",
            callBackFunc: function callBackFunc() {
                console.log("[LogonScene][onShowVistor] callbackfunc");
            },
            waitingTime: 8
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.timeout = 8000;
        xhr.ontimeout = function (e) {
            GlobalFun.showToast("服务器连接超时，请稍候重试");
            cc.director.emit("GuestLoginCompleted");
            xhr.abort();
        };
        xhr.send(paramString);
    },
    onShowRegister: function onShowRegister() {
        AudioMng.playButton();
        if (cc.isValid(this._logonView) === true) {
            // this._logonView.destroy();
            this._logonView.active = false;
        }
        if (cc.isValid(this._registerView) === false) {
            this._registerView = cc.instantiate(this.registerView);
            this.node.addChild(this._registerView);
        }
        GlobalFun.ActionShowTanChuang(this._registerView, function () {
            console.log("[LogonScene][onShowRegister]ActionShowTanChuang callback");
        });
    },

    onShowWxLogon: function onShowWxLogon() {
        AudioMng.playButton();
        MultiPlatform.showAlert(MultiPlatform.getAppVersion(), MultiPlatform.getIpAddress());
    }
});

cc._RFpop();
},{"AudioMng":"AudioMng","CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MultiPlatform":"MultiPlatform"}],"LogonView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6408fGx9nxB45qz0RIhtVt6', 'LogonView');
// Script/plaza/views/logon/LogonView.js

"use strict";

var GlobalDef = require("GlobalDef");
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
        m_editbox_account: {
            default: null,
            type: cc.EditBox
        },
        m_editbox_password: {
            default: null,
            type: cc.EditBox
        },
        m_checkbox: {
            default: null,
            type: cc.Toggle
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (this.m_checkbox) {
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
            } else {
                console.log("[LogonView][onLoad] uncheck");
                this.m_checkbox.uncheck();
            }
        }
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[LogonView][onDestroy]");
    },
    onLogon: function onLogon() {
        var szAccount = this.m_editbox_account.string;
        var szPassword = this.m_editbox_password.string;
        console.log("[LogonView][onLogon] " + szAccount + " # " + szPassword);
        cc.director.emit("onLogon", { szAccount: szAccount, szPassword: szPassword });
    },
    onClickCloseButton: function onClickCloseButton() {
        // this.node.active = false;  
        this.node.destroy();
        console.log("[LogonView][onClickCloseButton] destroy");
    },
    onClickRegisterButton: function onClickRegisterButton() {
        cc.director.emit("onShowRegister");
    },
    onClickForgetPassword: function onClickForgetPassword() {
        cc.sys.openURL(GlobalDef.httpOpenUrl);
    },
    checkBoxClicked: function checkBoxClicked(toggle) {
        if (toggle.isChecked) {
            console.log("[LogonView][checkBoxClicked] is checked");
        } else {
            console.log("[LogonView][checkBoxClicked] is unchecked");
        }
        cc.sys.localStorage.setItem("bRememberPwd", toggle.isChecked);
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef"}],"LotteryView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ac3d57NFRVGgqKX5dVqJsms', 'LotteryView');
// Script/plaza/views/plaza/LotteryView.js

"use strict";

var GlobalFun = require("GlobalFun");
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
        m_arrow: cc.Node,
        arrow_times: 6,
        arrow_rounds: 10
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {},
    onDisable: function onDisable() {},
    onEnable: function onEnable() {},
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickStart: function onClickStart() {
        var ang = GlobalFun.getRandomInt(0, 360);
        var rotate = cc.rotateBy(this.arrow_times, ang + 360 * this.arrow_rounds);
        this.m_arrow.runAction(rotate.easing(cc.easeCubicActionOut(this.arrow_times)));
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"MD5":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e0a12eDSeNI/YjpYPcqGtrL', 'MD5');
// Script/MD5.js

"use strict";

cc.md5Encode = function (data) {
    // for test/debug
    function fflog(msg) {
        try {
            console.log(msg);
        } catch (e) {}
    }

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {
        var t1 = (n >>> 24).toString(16);
        var t2 = (n & 0x00FFFFFF).toString(16);
        return "00".substr(0, 2 - t1.length) + t1 + "000000".substr(0, 6 - t2.length) + t2;
    }

    // convert array of chars to array of bytes (note: Unicode not supported)
    function chars_to_bytes(ac) {
        var retval = [];
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]));
        }
        return retval;
    }

    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = [];
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF);
            num = num >>> 8;
        }
        return retval;
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return num << places & 0xFFFFFFFF | num >>> 32 - places;
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return b & c | ~b & d;
    }

    function fG(b, c, d) {
        return d & b | ~d & c;
    }

    function fH(b, c, d) {
        return b ^ c ^ d;
    }

    function fI(b, c, d) {
        return c ^ (b | ~d);
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return arr[off + 3] << 24 | arr[off + 2] << 16 | arr[off + 1] << 8 | arr[off];
    }

    /*
     Conver string to array of bytes in UTF-8 encoding
     See:
     http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
     http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
     How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
     */
    function str_to_bytes(str) {
        // alert("got " + str.length + " chars")
        var retval = [];
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i));
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%');
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10));
                }
            }
        }return retval;
    };

    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = "";
        var t = 0;
        var ta = 0;
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i];
            t = ta & 0xFF;
            ta = ta >>> 8;
            t = t << 8;
            t = t | ta & 0xFF;
            ta = ta >>> 8;
            t = t << 8;
            t = t | ta & 0xFF;
            ta = ta >>> 8;
            t = t << 8;
            t = t | ta;
            ra = ra + to_zerofilled_hex(t);
        }
        return ra;
    }

    // check input data type and perform conversions if needed
    var databytes = null;
    // String
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data);
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data;
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data);
        } else if (typeof data[0] == 'number') {
            databytes = data;
        } else {
            fflog("input data type mismatch");
            return null;
        }
    } else {
        fflog("input data type mismatch");
        return null;
    }

    // save original length
    var org_len = databytes.length;

    // first append the "1" + 7x "0"
    databytes.push(0x80);

    // determine required amount of padding
    var tail = databytes.length % 64;
    // no room for msg length?
    if (tail > 56) {
        // pad to next 512 bit block
        for (var i = 0; i < 64 - tail; i++) {
            databytes.push(0x0);
        }
        tail = databytes.length % 64;
    }
    for (i = 0; i < 56 - tail; i++) {
        databytes.push(0x0);
    }
    // message length in bits mod 512 should now be 448
    // append 64 bit, little-endian original msg length (in *bits*!)
    databytes = databytes.concat(int64_to_bytes(org_len * 8));

    // initialize 4x32 bit state
    var h0 = 0x67452301;
    var h1 = 0xEFCDAB89;
    var h2 = 0x98BADCFE;
    var h3 = 0x10325476;

    // temp buffers
    var a = 0,
        b = 0,
        c = 0,
        d = 0;

    function _add(n1, n2) {
        return 0x0FFFFFFFF & n1 + n2;
    }

    // function update partial state for each run
    var updateRun = function updateRun(nf, sin32, dw32, b32) {
        var temp = d;
        d = c;
        c = b;
        //b = b + rol(a + (nf + (sin32 + dw32)), b32);
        b = _add(b, rol(_add(a, _add(nf, _add(sin32, dw32))), b32));
        a = temp;
    };

    // Digest message
    for (i = 0; i < databytes.length / 64; i++) {
        // initialize run
        a = h0;
        b = h1;
        c = h2;
        d = h3;

        var ptr = i * 64;

        // do 64 runs
        updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7);
        updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12);
        updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17);
        updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22);
        updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7);
        updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12);
        updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17);
        updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22);
        updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7);
        updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12);
        updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17);
        updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22);
        updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7);
        updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12);
        updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17);
        updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22);
        updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5);
        updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9);
        updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14);
        updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20);
        updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5);
        updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9);
        updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14);
        updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20);
        updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5);
        updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9);
        updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14);
        updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20);
        updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5);
        updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9);
        updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14);
        updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20);
        updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4);
        updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11);
        updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16);
        updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23);
        updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4);
        updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11);
        updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16);
        updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23);
        updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4);
        updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11);
        updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16);
        updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23);
        updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4);
        updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11);
        updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16);
        updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23);
        updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6);
        updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10);
        updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15);
        updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21);
        updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6);
        updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10);
        updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15);
        updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21);
        updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6);
        updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10);
        updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15);
        updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21);
        updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6);
        updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10);
        updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15);
        updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21);

        // update buffers
        h0 = _add(h0, a);
        h1 = _add(h1, b);
        h2 = _add(h2, c);
        h3 = _add(h3, d);
    }
    // Done! Convert buffers to 128 bit (LE)
    return int128le_to_hex(h3, h2, h1, h0).toLowerCase();
};

cc._RFpop();
},{}],"MultiPlatform":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a461J76ytMnK+gY7JQD8Yq', 'MultiPlatform');
// Script/MultiPlatform.js

"use strict";

var MultiPlatform = {};
var PLATFORM = {};
PLATFORM[cc.sys.OS_IOS] = require("Bridge_ios");
PLATFORM[cc.sys.OS_ANDROID] = require("Bridge_android");

MultiPlatform.getMachineID = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getMachineID) {
        return PLATFORM[cc.sys.os].getMachineID();
    } else {
        console.log("[MultiPlatform][getMachineID] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

MultiPlatform.getIpAddress = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getIpAddress) {
        return PLATFORM[cc.sys.os].getIpAddress();
    } else {
        console.log("[MultiPlatform][getIpAddress] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

MultiPlatform.getAppVersion = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getIpAddress) {
        return PLATFORM[cc.sys.os].getAppVersion();
    } else {
        console.log("[MultiPlatform][getAppVersion] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

MultiPlatform.getBatteryLevel = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getBatteryLevel) {
        return PLATFORM[cc.sys.os].getBatteryLevel();
    } else {
        console.log("[MultiPlatform][getBatteryLevel] unsupport platform -> " + cc.sys.os);
        return 0;
    }
};

MultiPlatform.getNetconnType = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getNetconnType) {
        return PLATFORM[cc.sys.os].getNetconnType();
    } else {
        console.log("[MultiPlatform][getNetconnType] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

MultiPlatform.showAlert = function (title, message) {
    title = title || cc.sys.os;
    message = message || cc.sys.os;
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].showAlert) {
        return PLATFORM[cc.sys.os].showAlert(title, message);
    } else {
        console.log("[MultiPlatform][showAlert] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

module.exports = MultiPlatform;

cc._RFpop();
},{"Bridge_android":"Bridge_android","Bridge_ios":"Bridge_ios"}],"PlazaRoomItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '621c5iAlGtM0puy21Gwuy3w', 'PlazaRoomItem');
// Script/plaza/views/plaza/PlazaRoomItem.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
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
        m_Image_back: cc.Sprite,
        m_Image_col: cc.Sprite,
        m_Image_title: cc.Sprite,
        m_Label_scoreLimit: cc.Label,
        plazaAtalas: cc.SpriteAtlas
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        // var index = params.index;
        this._index = params.index;
        // var roomInfo = params.roomInfo;
        this._roomInfo = params.roomInfo;
        // this.m_Image_back.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_back_" + (this._index));
        this.m_Image_col.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_back_" + this._index);
        this.m_Image_title.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_down_" + this._index);
        if (this._roomInfo && this._roomInfo.lLimitScore) {
            this.m_Label_scoreLimit.string = this._roomInfo.lLimitScore;
        }
        // var actionNode = this.node.getChildByName("m_Node_back");
        // actionNode.setPosition(1000,0);
        // actionNode.runAction(cc.sequence(
        //     cc.delayTime(this._index * 0.1),
        //     cc.moveTo(0.25,-80,0),
        //     cc.moveTo(0.25,0,0)
        // ))
    },
    onClick: function onClick(params) {
        console.log("[PlazaRoomItem][onClick]");
        if (!this._roomInfo) {
            GlobalFun.showToast("房间暂未开放，请稍后再试");
            return;
        }
        if (GlobalUserData.llGameScore >= this._roomInfo.lLimitScore) {
            // GlobalFun.showToast("进入房间");
            cc.director.emit("onLogonRoom", { roomInfo: this._roomInfo });
        } else {
            var tipText = "进入房间需要" + this._roomInfo.lLimitScore + "金豆,您的金豆不足,请充值!";
            GlobalFun.showAlert({
                message: tipText,
                // textAlignment: cc.TextAlignment.LEFT,
                btn: [{
                    name: "取消"
                }, {
                    name: "充值",
                    callback: function callback() {
                        GlobalFun.showShopView();
                    }
                }]
            });
        }
    },
    select: function select() {
        var nodeBack = this.node.getChildByName("m_Node_back");
        // nodeBack.setScale(1.0,1.0);
        this.m_Image_col.node.runAction(cc.tintTo(0.5, 255, 255, 255));
        this.m_Image_title.node.runAction(cc.tintTo(0.5, 255, 255, 255));
        this.node.getComponent(cc.Button).interactable = true;
    },
    unselect: function unselect() {
        var nodeBack = this.node.getChildByName("m_Node_back");
        // nodeBack.setScale(1.0,1.0);
        this.m_Image_col.node.runAction(cc.tintTo(0.5, 170, 170, 170));
        this.m_Image_title.node.runAction(cc.tintTo(0.5, 170, 170, 170));
        this.node.getComponent(cc.Button).interactable = false;
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"PlazaScrollRing":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7f4baNXUN9CnYfnpUhR2OLT', 'PlazaScrollRing');
// Script/PlazaScrollRing.js

"use strict";

var ScrollRing = require("ScrollRing");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
cc.Class({
    extends: ScrollRing,

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
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },
    addItem: function addItem(itemNode) {
        var layout = this.node.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = true;
        }
        this.node.addChild(itemNode);
        // if (layout) {
        //     layout.enabled = false;
        // }
    },
    clearItem: function clearItem() {
        this.node.removeAllChildren();
    },
    // start:function(){
    //     this._super();
    //     //
    // },
    refreshRoomList: function refreshRoomList(roomList) {
        var itemidx = { "item1": 0, "item2": 1, "item3": 2 };
        this.roominfos = {};
        for (var i = 0; i < this.node.childrenCount; i++) {
            var ch = this.node.children[i];
            console.log("item", ch.name, roomList[itemidx[ch.name]]);
            var lab = ch.getChildByName("label").getComponent(cc.Label);
            if (roomList[itemidx[ch.name]]) {
                this.roominfos[ch.name] = roomList[itemidx[ch.name]];
                lab.string = "财富：" + this.roominfos[ch.name].lLimitScore;
            } else {
                lab.string = "未开放";
            }
        }
    },
    onFocusChange: function onFocusChange(evName, itemNode) {
        console.log("onFocusChange", evName);
        for (var i = 0; i < itemNode.childrenCount; i++) {
            var node = itemNode.children[i];
            if (node.name == "dragon") {
                if (evName == "loseFocus") {
                    node.script.stop();
                } else if (evName == "focused") {
                    node.script.play();
                }
            }
        }
    },
    /*
    roominfo://游戏房间列表结构
    struct tagMobileGameServer
    {
        BYTE                                cbRoomLevel;                        //房间等级
        LONG                                lBaseScore;                         //房间底分
        LONG                                lLimitScore;                        //进入限制
        LONG                                lMaxBombLimit;                      //最大倍数限制
        WORD								wSortID;							//排序号码
        WORD								wKindID;							//名称号码
        WORD								wServerID;							//房间号码
        WORD								wStationID;							//站点号码
        WORD								wServerPort;						//房间端口
        DWORD								dwServerAddr;						//房间地址
        DWORD								dwOnLineCount;						//在线人数
        TCHAR								szServerName[SERVER_LEN];			//房间名称
        TCHAR								szDescribeTxt[128];                 //房间信息
    };
    */
    onClickItem: function onClickItem(itemNode) {
        itemNode.getComponent("PlazaRoomItem").onClick();
        // var roominfo = this.roominfos[itemNode.name];

        // console.log("[PlazaRoomItem][onClick]");  
        // if(!roominfo) {
        //     console.log("error:not found roominfo");
        //     // GlobalFun.showAlert(cc.director.getScene(),"房间暂未开放，请稍后再试");
        //     return;
        // }
        // if(GlobalUserData.llGameScore >= roominfo.lLimitScore) {
        //     // GlobalFunc.showAlert(cc.director.getScene(),"进入房间");
        //     cc.director.emit("onLogonRoom",{roomInfo:roominfo});
        // }
        // else {
        //     // GlobalFun.showToast("进入房间需要"+ roominfo.lLimitScore + "金豆,您的金豆不足,请充值!");
        // }
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","ScrollRing":"ScrollRing"}],"PlazaView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52d5546nrtCUJireJfeVAhU', 'PlazaView');
// Script/PlazaView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var AudioMng = require("AudioMng");
var MultiPlatform = require("MultiPlatform");
var bindText = "<size=32><color=#B35B1B>尊敬的用户，你当前为【游客模式】<br/>\
1.绑定账号后，体验币无法转换为金币。<br/>\
2.游客账号购买的金币，注册后等值赠送<br/>\
3.游客账号会不定期重置，对此造成的损失，本公司概不负责。<br/>\
为了保障你的虚拟财产安全，以及您获得更好的游戏体验，我们建议你绑定账号。<br/>\
                                                        《集结号拼三张》团队</c></size>\
";
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
        settingView: {
            default: null,
            type: cc.Prefab
        },
        userProfileView: {
            default: null,
            type: cc.Prefab
        },
        bankView: {
            default: null,
            type: cc.Prefab
        },
        shopView: {
            default: null,
            type: cc.Prefab
        },
        roomItemList: {
            default: null,
            type: cc.ScrollView
        },
        plazaRoomItem: {
            default: null,
            type: cc.Prefab
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite
        },
        m_Label_name: {
            default: null,
            type: cc.Label
        },
        m_Label_ID: cc.Label,
        m_Label_userCharm: cc.Label,
        m_Label_userGold: {
            default: null,
            type: cc.Label
        },
        m_Label_notice: cc.RichText,
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // GlobalUserData.init();
        console.log("Plaza onLoad");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode) {
            console.log("[PlazaView][onLoad] 获取GameFrame 所在节点 并设置为常驻节点");
            cc.game.addPersistRootNode(GameFrameNode);
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
            // this._gameFrame.onCloseSocket();
        }

        //显示滚动消息
        var noticeMsg = cc.sys.localStorage.getItem("systemmessage") || "测试通知";

        if (noticeMsg && noticeMsg.length > 0) {
            this.m_Label_notice.string = noticeMsg;
            var fLabelWidth = this.m_Label_notice.node.getContentSize().width;
            var fParenWidth = this.m_Label_notice.node.parent.getContentSize().width;
            var runDis = fLabelWidth + fParenWidth + 30;
            var runTime = runDis / 80;
            this.m_Label_notice.node.stopAllActions();
            this.m_Label_notice.node.runAction(cc.repeatForever(cc.sequence(cc.place((fParenWidth + 30) / 2, 0), cc.moveBy(runTime, -runDis, 0))));
        }

        AudioMng.playMusic("bgm_plaza");
        if (GlobalUserData.isGuest) {
            GlobalFun.showAlert({
                message: bindText,
                textAlignment: cc.TextAlignment.LEFT,
                btn: [{
                    name: "继续游戏"
                }, {
                    name: "绑定账号",
                    callback: function callback() {
                        GlobalFun.showBindView();
                    }
                }]
            });
        }
        // this._gameFrame = this.getScene().getChildByName("GameFrame").getComponent("GameFrame");
        this.refreshUI();
        this.refreshRoomList();
        this.refreshData();
        // this.m_Label_time = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_time");
        // this.m_Label_networkState = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_networkState");
        // if (this.m_Label_time) {
        //     console.log("[PlazaView][schedule]");
        //     cc.director.getScheduler().schedule(this.refreshTimeAndNetworkInfo, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
        // }
        // this.refreshTimeAndNetworkInfo();
    },
    onDestroy: function onDestroy() {
        cc.director.getScheduler().unschedule(this.refreshTimeAndNetworkInfo, this);
        AudioMng.stopMusic();
        cc.sys.garbageCollect();
    },
    refreshTimeAndNetworkInfo: function refreshTimeAndNetworkInfo() {
        var date = new Date(Date.now());
        var timeStr = date.toTimeString().slice(0, 8);
        var batteryLevel = MultiPlatform.getBatteryLevel();
        var netWorkType = MultiPlatform.getNetconnType();
        this.m_Label_time.getComponent(cc.Label).string = timeStr;
        this.m_Label_networkState.getComponent(cc.Label).string = netWorkType;
    },
    refreshUI: function refreshUI() {
        console.log("[PlazaView][refreshUI]");
        for (var prop in GlobalUserData) {
            if (typeof GlobalUserData[prop] == "function") continue;
            console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        }
        this.m_Label_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_userCharm.string = GlobalUserData.dwLoveLiness;
        this.m_Label_name.string = GlobalUserData.szNickName;
        this.m_Label_ID.string = "ID" + GlobalUserData.dwUserID;
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));

        // this.refreshRoomList();
    },
    refreshRoomList: function refreshRoomList() {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
        var PlazaScrollRing = cc.find("Canvas/PlazaScrollRing").getComponent("PlazaScrollRing");
        var beginx = -PlazaScrollRing.node.getContentSize().width / 2;
        var space = 600;
        if (PlazaScrollRing) {
            PlazaScrollRing.clearItem();
            // PlazaScrollRing.node.getComponent(cc.Layout).enabled = true;
            for (var index = 0; index < 3; index++) {
                var item = cc.instantiate(this.plazaRoomItem);
                item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
                item.setPositionX(beginx + space * index);
                PlazaScrollRing.addItem(item);
            }
            for (var index = 0; index < 3; index++) {
                var item = cc.instantiate(this.plazaRoomItem);
                item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
                item.setPositionX(beginx + space * (index + 3));
                PlazaScrollRing.addItem(item);
            }
            PlazaScrollRing.init();
            PlazaScrollRing._updateToFocus("init");
        }
    },
    refreshData: function refreshData() {
        var url = GlobalDef.httpBaseUrl;
        // url += "/hz/hzGameUserInfo.ashx";
        url += "/hz/hzGameUserInfo3_0.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[PlazaView][refreshData] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
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
                    if (value.accounts !== undefined) {
                        GlobalUserData.szAccounts = value.accounts;
                    }
                    if (value.gameid !== undefined) {
                        GlobalUserData.dwGameID = value.gameid;
                    }
                    if (value.faceid !== undefined) {
                        GlobalUserData.wFaceID = value.faceid;
                    }
                    if (value.gender !== undefined) {
                        GlobalUserData.cbGender = value.gender;
                    }
                    if (value.isguest !== undefined) {
                        GlobalUserData.isGuest = Number(value.isguest) && true || false;
                    }
                    if (value.nickname !== undefined) {
                        GlobalUserData.szNickName = value.nickname;
                    }
                    if (value.loveliness !== undefined) {
                        GlobalUserData.dwLoveLiness = value.loveliness;
                    }
                    //抽奖次数
                    if (value.counteLoveliness !== undefined) {
                        GlobalUserData.wExchangenum = value.counteLoveliness;
                    }
                }
                self.refreshUI();
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[PlazaView][refreshData] " + paramString);
    },
    onEnable: function onEnable() {
        cc.director.on('onChangeUserFaceSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.on('onChangeNameSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.on('onBankSuccess', this.onBankSuccess, this);
        cc.director.on('onGuestBindSuccess', this.onGuestBindSuccess, this);
        cc.director.on('onLogonRoom', this.onLogonRoom, this);
        console.log("[PlazaView][onEnable]");
    },
    onDisable: function onDisable() {
        cc.director.off('onChangeUserFaceSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onChangeNameSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onBankSuccess', this.onBankSuccess, this);
        cc.director.off('onGuestBindSuccess', this.onGuestBindSuccess, this);
        cc.director.off('onLogonRoom', this.onLogonRoom, this);
        console.log("[PlazaView][onDisable]");
    },
    onLogonRoom: function onLogonRoom(params) {
        console.log("[PlazaView][onLogonRoom]");
        var self = this;
        // this._gameFrame.onLogonRoom(params.detail.roomInfo);
        var roomInfo = params.detail.roomInfo;
        GlobalFun.showLoadingView({
            closeEvent: "LogonRoomFinish",
            loadfunc: function loadfunc() {
                cc.director.preloadScene("GameScene", function () {
                    cc.log("GameScene scene preloaded");
                    self._gameFrame.onLogonRoom(roomInfo);
                });
            },
            closefunc: function closefunc() {
                cc.director.loadScene("GameScene");
                // cc.sys.garbageCollect();
            }
        });
    },
    onChangeUserFaceSuccess: function onChangeUserFaceSuccess() {
        // var faceID = GlobalUserData.wFaceID;
        // if (faceID <= 0 || faceID > 8) {
        //     faceID = 1;
        // }
        // this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));
        this.refreshData();
    },
    onChangeNameSuccess: function onChangeNameSuccess(params) {
        this.refreshUI();
    },
    onBankSuccess: function onBankSuccess(params) {
        this.refreshUI();
    },
    onGuestBindSuccess: function onGuestBindSuccess(params) {
        this.refreshUI();
    },
    onClickSetting: function onClickSetting() {
        if (cc.isValid(this._settingView) === false) {
            this._settingView = cc.instantiate(this.settingView);
            this.node.addChild(this._settingView);
        }
        GlobalFun.ActionShowTanChuang(this._settingView, function () {
            console.log("[PlazaView][onClickSetting]ActionShowTanChuang callback");
        });
    },
    onClickUserProfile: function onClickUserProfile(params) {
        if (cc.isValid(this._userProfileView) === false) {
            this._userProfileView = cc.instantiate(this.userProfileView);
            this.node.addChild(this._userProfileView);
        }
        GlobalFun.ActionShowTanChuang(this._userProfileView, function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        });
    },
    onClickClient: function onClickClient(params) {
        console.log("[PlazaView][onClickClient]");
        var self = this;
        if (cc.isValid(self._serviceView) === false) {
            cc.loader.loadRes("prefab/ServiceView", function (err, ServicePrefab) {
                if (cc.isValid(self.node)) {
                    self._serviceView = cc.instantiate(ServicePrefab);
                    self.node.addChild(self._serviceView);
                    GlobalFun.ActionShowTanChuang(self._serviceView, function () {
                        console.log("[PlazaView][onClickClient]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    onClickActivity: function onClickActivity(params) {
        console.log("[PlazaView][conClickActivity]");
        GlobalFun.showAlert({ message: "暂未开放,敬请期待!" });
    },
    onClickRankList: function name(params) {
        console.log("[PlazaView][onClickRankList]");
        GlobalFun.showAlert({ message: "暂未开放,敬请期待!" });
    },
    onClickRule: function onClickRule(params) {
        console.log("[PlazaView][onClickRule]");
        var self = this;
        if (cc.isValid(self._ruleView) === false) {
            cc.loader.loadRes("prefab/RuleView", function (err, Prefab) {
                if (cc.isValid(self.node)) {
                    self._ruleView = cc.instantiate(Prefab);
                    self.node.addChild(self._ruleView);
                    GlobalFun.ActionShowTanChuang(self._ruleView, function () {
                        console.log("[PlazaView][onClickRule]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    onClickBank: function onClickBank(params) {
        console.log("[PlazaView][conClickBank]");
        if (cc.isValid(this._bankView) === false) {
            this._bankView = cc.instantiate(this.bankView);
            this.node.addChild(this._bankView);
        }
        GlobalFun.ActionShowTanChuang(this._bankView, function () {
            console.log("[PlazaView][onClickBank]ActionShowTanChuang callback");
        });
    },
    onClickShop: function onClickShop(params) {
        console.log("[PlazaView][onClickShop]");
        if (cc.isValid(this._shopView) === false) {
            this._shopView = cc.instantiate(this.shopView);
            this.node.addChild(this._shopView);
        }
        GlobalFun.ActionShowTanChuang(this._shopView, function () {
            console.log("[PlazaView][onClickShop]ActionShowTanChuang callback");
        });
    }
});

cc._RFpop();
},{"AudioMng":"AudioMng","CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MultiPlatform":"MultiPlatform"}],"PopWaitView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b62aboUA7hHj6uWOgxgWCqy', 'PopWaitView');
// Script/external/PopWaitView.js

"use strict";

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
        m_Label_content: {
            default: null,
            type: cc.Label
        },
        m_Image_waitIcon: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        console.log("[PopWaitView][onLoad]");
    },
    onInit: function onInit(params) {
        this.m_waitingText = params.waitingText || "正在连接服务器，请稍候...";
        this.m_waitingTime = params.waitingTime || 8;
        this.m_closeEvent = params.closeEvent;
        this.m_callBackFunc = params.callBackFunc;
        cc.director.on(this.m_closeEvent, this.onCloseEvent, this);
        cc.director.getScheduler().schedule(this.close, this, this.m_waitingTime);
        this.m_Label_content.string = this.m_waitingText;
        this.m_Image_waitIcon.runAction(cc.repeatForever(cc.rotateBy(2.0, 360.0)));
    },
    onCloseEvent: function onCloseEvent(params) {
        if (typeof this.m_callBackFunc === "function") {
            this.m_callBackFunc();
        }
        this.close();
    },
    onEmit: function onEmit(params) {
        cc.director.emit("hehe");
    },
    close: function close(params) {
        this.node.destroy();
    },
    onEnable: function onEnable() {
        console.log("[PopWaitView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[PopWaitView][onDisable]");
        cc.director.off(this.m_closeEvent, this.onCloseEvent, this);
    },
    onDestroy: function onDestroy() {
        cc.director.getScheduler().unschedule(this.close, this);
        cc.sys.garbageCollect();
        console.log("[PopWaitView][onDestroy]");
    }
});

cc._RFpop();
},{}],"PresentNode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5ef96bG/GdO6YvNykCQmfER', 'PresentNode');
// Script/game/PresentNode.js

"use strict";

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
        m_Image_select: cc.Node,
        m_Image_present: cc.Sprite,
        presentAtlas: cc.SpriteAtlas,
        m_Label_charm: cc.Label,
        m_Label_price: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        var icon = params.icon;
        var gold = params.gold;
        var charm = params.charm;
        this.m_Image_present.spriteFrame = this.presentAtlas.getSpriteFrame(icon.split('.')[0]);
        this.m_Label_charm.string = "魅力" + charm;
        this.m_Label_price.string = gold;
    },
    setSelect: function setSelect(bSelect) {
        this.m_Image_select.active = bSelect;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"RegisterView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8f2b26mcj1Ig675dVb8++wU', 'RegisterView');
// Script/plaza/views/logon/RegisterView.js

"use strict";

require("MD5");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
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
        m_editbox_account: {
            default: null,
            type: cc.EditBox
        },
        m_editbox_password: {
            default: null,
            type: cc.EditBox
        },
        m_editbox_name: {
            default: null,
            type: cc.EditBox
        },
        m_editbox_yzm: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[RegisterView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        // this.node.active = false;  
        cc.director.emit("onShowLogon");
        this.node.destroy();
        console.log("[RegisterView][onClickCloseButton] destroy");
    },
    onClickConfirmButton: function onClickConfirmButton() {
        var szAccount = this.m_editbox_account.string;
        var szPassword = this.m_editbox_password.string;
        var szNickName = this.m_editbox_name.string;
        var szMobileAuth = this.m_editbox_yzm.string;
        console.log("[RegisterView][onClickConfirmButton] " + szAccount + " # " + szPassword);
        if (szAccount.length <= 0 || szPassword.length <= 0 || szNickName.length <= 0 || szMobileAuth.length <= 0) {
            console.log("帐号密码等注册信息不能为空");
            GlobalFun.showToast("帐号密码等注册信息不能为空");
            return;
        }
        if (szPassword.length < 6 || szPassword.length > 16) {
            console.log("密码长度为6-16位");
            GlobalFun.showToast("密码长度为6-16位");
            return;
        }
        // 通过用户中心web接口注册用户
        var isUserCenter = true;
        if (!isUserCenter) {
            cc.director.emit("onRegister", {
                szAccount: szAccount,
                szPassword: szPassword,
                szNickName: szNickName,
                szMobileAuth: szMobileAuth
            });
        } else {
            var url = GlobalDef.httpUserCenter;
            url += "/UserCenter/UserCenterRegister.ashx";
            var params = '';
            var nowTime = Math.floor(Date.now() / 1000);
            console.log("[RegisterView][onClickConfirmButton] nowtime seconds = " + nowTime);
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
            params = params + "\"MachineNumber\":\"" + '1' + "\",";
            params = params + "\"Code\":\"" + szMobileAuth + "\"}";

            //"UserName=%s|DateTamp=%lld|ChannelID=%d|Mobile=%s|Code=%s|Key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x"
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    console.log(response);
                    var value = JSON.parse(response);
                    if (value.status == 1) {}
                    GlobalFun.showToast(value.msg || value.Msg);
                }
            };
            xhr.open("POST", url, true);
            // xhr.setRequestHeader("Content-Type","application/json");
            xhr.send(params);
            console.log("[RegisterView][onClickConfirmButton] " + params);
        }
    },
    onClickSendButton: function onClickSendButton() {
        var szAccount = this.m_editbox_account.string;
        var re = /1[3578][0-9]{9}/;
        if (re.exec(szAccount) === null) {
            console.log("[RegisterView][onClickSendButton] 手机号码不合法");
            GlobalFun.showToast("手机号码不合法");
            return;
        }
        var url = GlobalDef.httpUserCenter;
        url += "/hz/CaptchaMobile.ashx";
        var params = "Mobile=" + szAccount;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("[RegisterView][onClickSendButton] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {}
                GlobalFun.showToast(value.msg || value.Msg);
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(params);
        console.log("[RegisterView][onClickConfirmButton] " + params);
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","MD5":"MD5"}],"ScrollRing":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8e4e5iUpKhH74bskijCiPQ2', 'ScrollRing');
// Script/ScrollRing.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        isFocusMode: true,
        isVertival: false,
        speedLimit: 1
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.init();
    },
    init: function init() {
        this._bIsInit = true;
        this._acceleration = 1.5;
        this._farLeftIdx = 0;
        this.speedLimit = 1;
        this._minScale = 0.8;
        this._totalMoveDist = 0;
        this._clickAbleDist = 10;
        this._touchState = undefined;
        this._initFocusId = 0;
        var spacecount = 0;
        var layout = this.node.getComponent(cc.Layout);
        if (layout) layout.enabled = false;
        if (this.node.childrenCount > 1) {
            for (var i = 0; i < this.node.childrenCount; i++) {
                this.node.children[i].tag = i;
            }

            if (this.isVertival) {
                spacecount = Math.abs(this.node.children[0].getPositionY() - this.node.children[this.node.childrenCount - 1].getPositionY());
            } else {
                spacecount = Math.abs(this.node.children[0].getPositionX() - this.node.children[this.node.childrenCount - 1].getPositionX());
            }
            this._space = spacecount / (this.node.childrenCount - 1);

            console.log("this.speedLimit", this.speedLimit);
            if (this.speedLimit < 3) {
                this._calcSpeed = this.calcSpeedForDist(this.speedLimit * this._space / 2, this._acceleration);
            }
        } else {
            console.log("error:no children");
            this._space = 0;
        }
    },
    start: function start() {
        console.log("_updateToFocus start");
        if (this.isFocusMode && this._bIsInit) {
            this._updateToFocus("init");
        }
        // this._updateToFocus(0);
        // this._updatePostion();
    },
    onEnable: function onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    onDisable: function onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    onTouchStart: function onTouchStart(param) {
        if (this.node.childrenCount < 1) {
            return false;
        }
        if (this._isMoving) return;
        //if(this._touchState != undefined){return false;}

        this._touchState = "start";
        this._totalMoveDist = 0;
        this._touchStartNode = undefined;
        this._moveDirection = 0;
        this._speed = 0;
        this._startFocusid = this._focusid;
        var pt = new cc.Vec2(param.touch.getLocation());
        for (var i = 0; i < this.node.childrenCount; i++) {
            if (this.node.children[i].getBoundingBoxToWorld().contains(pt)) {
                this._touchStartNode = this.node.children[i];
                this.setItemClickState(this._touchStartNode, "pressed");
                break;
            }
        }
    },

    onTouchMove: function onTouchMove(param) {
        if (this._isMoving) return;
        this._touchState = "move";
        var prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var movePoint = new cc.Vec2(param.touch.getLocation());
        var adjustPoint = movePoint.sub(prevPoint);

        var speed = undefined;
        if (this.isVertival) {
            speed = adjustPoint.y;
        } else {
            speed = adjustPoint.x;
        }
        if (this._moveDirection != speed > 0 ? 1 : -1) {
            //changed direction
            this._moveDirection = speed > 0 ? 1 : -1;
            this._speed = 0;
        }
        if (Math.abs(this._speed) < Math.abs(speed)) {
            this._speed = speed;
        }

        this._totalMoveDist += Math.abs(adjustPoint.x);
        if (this._totalMoveDist >= this._clickAbleDist && this._touchStartNode) {
            this.setItemClickState(this._touchStartNode, "normal");
        }
        // console.log("adjustPoint",adjustPoint);
        for (var i = 0; i < this.node.childrenCount; i++) {
            var pt = this.node.children[i].getPosition();
            if (this.isVertival) {
                pt.y += adjustPoint.y;
            } else {
                pt.x += adjustPoint.x;
            }
            this.node.children[i].setPosition(pt);
        }
        this._updatePostion();
        this._updateToFocus("stateOnly");
    },
    calcSpeedForDist: function calcSpeedForDist(dist, accele) {
        var speed = accele + 1;
        while (true) {
            var tmpdist = 0,
                tmpspeed = speed;
            while (tmpspeed > accele) {
                tmpdist += tmpspeed;
                tmpspeed -= accele;
            }

            if (tmpdist >= dist) {
                return speed - 1;
            }
            speed++;
        }
    },
    onTouchEnd: function onTouchEnd(param) {
        if (this._isMoving) return;
        this._touchState = "touchend";

        if (this.speedLimit == 1) {
            if (Math.abs(this._speed) > 10) {
                if (this._startFocusid == this._focusid) {
                    this._updateToFocus((this._focusid + (this._speed > 0 ? this.node.childrenCount - 1 : 1)) % this.node.childrenCount);
                } else {
                    this._updateToFocus();
                }
                this._speed = undefined;
                // console.log("this._calcSpeed",this._calcSpeed);
                // var tmpnode = this.node.children[this._focusid];
                // var tmpdist = Math.abs(this.isVertival?tmpnode.getPositionY():tmpnode.getPositionX());
                // this._speed = this.calcSpeedForDist(tmpdist,this._acceleration)*(this._speed<0?-1:1);
            }
        } else if (this.speedLimit) {
            if (this.speedLimit < 3) {
                this._speed = this._calcSpeed * (this._speed < 0 ? -1 : 1);
            } else {
                this._speed = Math.min(this._speed, this.speedLimit * (this._speed < 0 ? -1 : 1));
            }
        }

        if (this._totalMoveDist < this._clickAbleDist && this._touchStartNode) {
            //check click able;
            var endPoint = new cc.Vec2(param.touch.getLocation());
            if (this._touchStartNode.getBoundingBoxToWorld().contains(endPoint)) {
                if (this.isFocusMode && this._touchStartNode.tag != this._focusid) {
                    this._updateToFocus(this._touchStartNode.tag);
                } else {
                    this.onClickItem(this._touchStartNode);
                    this.setItemClickState(this._touchStartNode, "normal");
                }
            }
        }
    },
    setItemFocusState: function setItemFocusState(itemNode, bFocus) {
        this.setItemColor(itemNode, bFocus ? "normal" : "gray");
    },
    setItemColor: function setItemColor(itemNode, clr) {
        if (clr == "gray") {
            clr = cc.color(125, 125, 125, 125);
        } else if (clr == "normal") {
            clr = cc.color(255, 255, 255, 255);
        } else if (typeof clr == "string") {
            console.log("not buidin color:", clr);
            return;
        }
        itemNode.color = clr;
        for (var i = 0; i < itemNode.childrenCount; i++) {
            itemNode.children[i].color = clr;
        }
    },
    setItemClickState: function setItemClickState(itemNode, state) {
        if (this.isFocusMode) {
            if (itemNode != this.node.children[this._focusid]) {
                return;
            }
        }
        this.setItemColor(itemNode, state == "pressed" ? "gray" : "normal");
    },

    _updateFocusScale: function _updateFocusScale() {
        for (var i = 0; i < this.node.childrenCount; i++) {
            var ch = this.node.children[i];
            var tmpdist = Math.abs(this.isVertival ? ch.getPositionY() : ch.getPositionX());
            if (tmpdist > this._space) {
                ch.setScale(this._minScale);
            } else {
                var scale = this._minScale + (1 - this._minScale) * ((this._space - tmpdist) / this._space);
                ch.setScale(scale);
            }
        }
    },
    _updatePostion: function _updatePostion(mdir) {
        if (this._moveDirection == 1) {
            //1:right ||top
            var node = this.node.children[this._farLeftIdx];
            var pt = node.getPosition();
            var size = node.getContentSize();
            var beyondline = undefined,
                moveTail = undefined;

            if (this.isVertival) {
                beyondline = this.node.getPositionY() - this.node.getContentSize().height / 2;
                if (pt.y - size.height / 2 > beyondline) {
                    moveTail = (this._farLeftIdx + this.node.childrenCount - 1) % this.node.childrenCount;
                }
            } else {
                beyondline = this.node.getPositionX() - this.node.getContentSize().width / 2;
                //console.log("update postion",beyondline,pt.x - size.width/2);
                if (pt.x - size.width / 2 > beyondline) {
                    moveTail = (this._farLeftIdx + this.node.childrenCount - 1) % this.node.childrenCount;
                }
            }
            if (moveTail != undefined) {
                var tail = this.node.children[moveTail];
                if (this.isVertival) {
                    tail.setPositionY(this.node.children[this._farLeftIdx].getPositionY() - this._space);
                } else {
                    tail.setPositionX(this.node.children[this._farLeftIdx].getPositionX() - this._space);
                }
                this._farLeftIdx = moveTail;
            }
        } else {
            var tailidx = (this._farLeftIdx + this.node.childrenCount - 1) % this.node.childrenCount;
            var node = this.node.children[tailidx];
            var pt = node.getPosition();
            var size = node.getContentSize();
            var beyondline = undefined,
                moveHead = undefined;
            if (this.isVertival) {
                beyondline = this.node.getPositionY() + this.node.getContentSize().height / 2;
                if (pt.y + size.height / 2 < beyondline) {
                    moveHead = this._farLeftIdx;
                }
            } else {
                beyondline = this.node.getPositionX() + this.node.getContentSize().width / 2;
                //console.log("update postion",beyondline,pt.x + size.width/2,this._farLeftIdx);
                if (pt.x + size.width / 2 < beyondline) {
                    moveHead = this._farLeftIdx;
                }
            }

            if (moveHead != undefined) {
                // console.log("move postion",moveHead,tailidx);
                var head = this.node.children[moveHead];
                if (this.isVertival) {
                    head.setPositionY(this.node.children[tailidx].getPositionY() + this._space);
                } else {
                    head.setPositionX(this.node.children[tailidx].getPositionX() + this._space);
                }
                this._farLeftIdx = (moveHead + 1) % this.node.childrenCount;
            }
        }
    },
    _updateToFocus: function _updateToFocus(focusid) {
        var _this = this;

        if (!this.isFocusMode) return;
        if (this._isMoving) {
            this.node.stopAllActions();
            for (var i = 0; i < this.node.childrenCount; i++) {
                this.node.children[i].stopAllActions();
            }
            this._focusid = undefined;
        }
        var focusChanged = false,
            tmpfocusid = this._focusid;
        if (focusid == undefined || focusid == "stateOnly" || focusid == "init") {
            var dist = 1000;
            for (var i = 0; i < this.node.childrenCount; i++) {
                var tmpdist = Math.abs(this.node.children[i].getPositionX());
                if (this.isVertival) {
                    if (Math.abs(this.node.children[i].getPositionY()) < dist) {
                        tmpfocusid = i;
                        dist = Math.abs(this.node.children[i].getPositionY());
                    }
                } else {
                    if (Math.abs(this.node.children[i].getPositionX()) < dist) {
                        tmpfocusid = i;
                        dist = Math.abs(this.node.children[i].getPositionX());
                    }
                }
                if (focusid == "init") {
                    this.onFocusChange("loseFocus", this.node.children[i]);
                }
            }
            if (focusid == "init") {
                tmpfocusid = this._initFocusId != undefined ? this._initFocusId : tmpfocusid;
            }
            focusChanged = this._focusid != tmpfocusid;
            if (focusChanged) {
                if (this._focusid) {
                    this.onFocusChange("loseFocus", this.node.children[this._focusid]);
                }
                this._focusid = tmpfocusid;
            }
        } else {
            focusChanged = this._focusid != focusid;
            if (focusChanged) this.onFocusChange("loseFocus", this.node.children[this._focusid]);
            this._focusid = focusid;
        }

        var movesub = this.node.children[this._focusid].getPosition();
        var time = Math.abs(this.isVertival ? movesub.y : movesub.x) / 1000;
        if (time > 0.4) time = 0.4;

        if (focusid == "stateOnly" || time == 0) {
            for (var i = 0; i < this.node.childrenCount; i++) {
                this.setItemFocusState(this.node.children[i], i == this._focusid);
            }
            this._updateFocusScale();
            if (focusChanged) {
                this.onFocusChange("focused", this.node.children[this._focusid]);
            }
        } else if (time != 0) {
            this._isMoving = true;
            this.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
                _this._touchState = undefined;
                _this._isMoving = undefined;
                for (var i = 0; i < _this.node.childrenCount; i++) {
                    _this.setItemFocusState(_this.node.children[i], i == _this._focusid);
                }
                if (focusChanged) {
                    _this.onFocusChange("focused", _this.node.children[_this._focusid]);
                }
            })));
            for (var i = 0; i < this.node.childrenCount; i++) {
                var movedist = this.node.children[i].getPosition().sub(movesub);
                var move = cc.moveTo(time, movedist); //
                move.easing(cc.easeOut(3.0));
                this.node.children[i].runAction(move);
            }
            this._touchState = "focusing";
            if (this.isVertival) {
                this._moveDirection = this.node.children[this._focusid].getPositionY() < 0 ? 1 : -1;
            } else {
                this._moveDirection = this.node.children[this._focusid].getPositionX() < 0 ? 1 : -1;
            }
        }
    },
    update: function update(dt) {
        //console.log("update",dt);

        if (!this._bIsInit) return;

        if (this._touchState == "focusing") {
            this._updatePostion();
            this._updateFocusScale();
        }
        if (this._speed != undefined && this._touchState == "touchend") {
            // console.log("update",this._speed,this._space,this._touchState);

            if (this.isFocusMode && Math.abs(this._speed) < 5) {
                this._updateToFocus();
                this._speed = undefined;
            } else if (this._speed != 0) {
                var dist = this._speed;
                if (Math.abs(this._speed) <= this._acceleration) {
                    this._speed = undefined;
                    this._touchState = undefined;
                }
                this._speed -= this._speed < 0 ? -this._acceleration : this._acceleration;
                for (var i = 0; i < this.node.childrenCount; i++) {
                    var pt = this.node.children[i].getPosition();

                    if (this.isVertival) {
                        pt.y += dist;
                    } else {
                        pt.x += dist;
                    }
                    this.node.children[i].setPosition(pt);
                }
                this._updatePostion();
                this._updateFocusScale();
            } else {
                this._speed = undefined;
            }
        }
    },
    addChild: function addChild(child) {
        var tailidx = (this._farLeftIdx + this.node.childrenCount - 1) % this.node.childrenCount;
        this.node.addChild(child);
        var pt = this.node.children[tailidx].getPosition();
        if (this.isVertival) {
            pt.y += this._space;
        } else {
            pt.x += this._space;
        }
        child.setPosition(pt);
    },
    setFocusid: function setFocusid(focusid) {
        this._updateToFocus(focusid);
    },
    onClickItem: function onClickItem(itemNode) {
        console.log("clicked itemnode", itemNode.name);
    },
    onFocusChange: function onFocusChange(evName, itemNode) {
        console.log("onFocusChange", itemNode.tag, evName);
        itemNode.emit(evName, { event: evName, name: itemNode.name });
    }
});

cc._RFpop();
},{}],"ServiceView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a775eLbcw9NwqbV0pFztLLF', 'ServiceView');
// Script/plaza/views/plaza/ServiceView.js

"use strict";

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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onClickCloseButton: function onClickCloseButton() {
        // this.node.active = false;  
        this.node.removeFromParent();
        this.node.destroy();
        console.log("[ServiceView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{}],"SettingView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '57ed4FNWZNA8on9xWn39UIJ', 'SettingView');
// Script/plaza/views/plaza/SettingView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
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
        m_Label_account: {
            default: null,
            type: cc.Label
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite
        },
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas
        },
        m_Button_music_switch_off: cc.Button,
        m_Button_music_switch_on: cc.Button,
        m_Button_effect_switch_off: cc.Button,
        m_Button_effect_switch_on: cc.Button

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.m_Label_account.string = GlobalUserData.szAccounts;
        var faceID = this._faceID || GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        this.onRefreshEffect();
        this.onRefreshMusic();
    },
    onRefreshMusic: function onRefreshMusic() {
        // this.m_Button_music_switch_off.node.active = !GlobalUserData.bMusicAble;
        this.m_Button_music_switch_on.node.active = GlobalUserData.bMusicAble;
    },
    onRefreshEffect: function onRefreshEffect() {
        // this.m_Button_effect_switch_off.node.active = !GlobalUserData.bEffectAble;
        this.m_Button_effect_switch_on.node.active = GlobalUserData.bEffectAble;
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[SettingView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        // this.node.active = false;  
        this.node.removeFromParent();
        this.node.destroy();
        console.log("[SettingView][onClickCloseButton] destroy");
    },
    onClickMusicSwitch: function onClickMusicSwitch() {
        GlobalUserData.setMusicAble(!GlobalUserData.bMusicAble);
        this.onRefreshMusic();
    },
    onClickEffectSwitch: function onClickEffectSwitch() {
        GlobalUserData.setEffectAble(!GlobalUserData.bEffectAble);
        this.onRefreshEffect();
    },
    onClickSwitchAccount: function onClickSwitchAccount() {
        GlobalFun.showAlert({
            message: "是否退出当前账号，重新登录？",
            // textAlignment: cc.TextAlignment.LEFT,
            btn: [{
                name: "取消"
            }, {
                name: "确定",
                callback: function callback() {
                    var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
                    if (GameFrameNode) {
                        console.log("[SettingView][onClickSwitchAccount] 获取GameFrame 所在节点 并取消为常驻节点");
                        cc.game.removePersistRootNode(GameFrameNode);
                    }
                    cc.director.loadScene("LoginScene");
                }
            }]
        });
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"ShopItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0332dr8AGZOoahYR3nJs/re', 'ShopItem');
// Script/plaza/views/plaza/ShopItem.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
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
        m_Image_shopItem: {
            default: null,
            type: cc.Sprite
        },
        shopItemAtals: {
            default: null,
            type: cc.SpriteAtlas
        },
        m_Label_des: cc.Label,
        m_Label_price: cc.Label,
        _shopID: 0,
        _goodsID: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        var shopID = params.shopID;
        this._shopID = shopID;
        this._goodsID = shopID % 6;
        var shopDataArray = GlobalUserData.shopData.shop.base;
        if (this._goodsID < 0 || this._goodsID >= shopDataArray.length) {
            console.log("[ShopItem][init] shopDataArray length = " + shopDataArray.length);
            return;
        }
        var itemVal = shopDataArray[this._goodsID];
        var des = itemVal.name || "";
        var price = 0;
        if (GlobalUserData.isOpenIAP) {
            price = itemVal.iosprice;
        } else {
            price = itemVal.price;
        }
        this.m_Label_des.string = des;
        this.m_Label_price.string = price;
        this.m_Image_shopItem.spriteFrame = this.shopItemAtals.getSpriteFrame("shop_icon_" + shopID);
    },
    onClick: function onClick(params) {}
    // console.log("[ShopItem][onClick] shopID = " + this._shopID);
    // if (GlobalUserData.isGuest) {
    //     GlobalFun.showAlert({
    //         message: "<color=#000000>为了您的账号安全,充值前请绑定手机号!<br/> (绑定就送<color=#FF0000>2000</c>金币,账号和手机号均限领一次)</c>",
    //         btn: [
    //             {
    //                 name: "去绑定",
    //                 callback: function () {
    //                     GlobalFun.showBindView();
    //                 }
    //             },
    //             {
    //                 name: "继续",
    //                 callback: () => {
    //                     cc.director.emit('onInCharge', { goodsID: this._goodsID });
    //                 }
    //             }
    //         ],
    //     })
    // }
    // else {
    //     cc.director.emit('onInCharge', { goodsID: this._goodsID });
    // }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"ShopView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9f64TYV25HYKL062f4Ojzg', 'ShopView');
// Script/plaza/views/plaza/ShopView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var MultiPlatform = require("MultiPlatform");
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
        shopItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        shopItemList: {
            default: null,
            type: cc.ScrollView
        },
        shopItemCount: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refreshUI();
        console.log("[ShopView][onLoad] " + JSON.stringify(GlobalUserData.shopData));
    },
    refreshUI: function refreshUI(params) {
        var _this = this;

        this.shopItemList.content.removeAllChildren();

        var _loop = function _loop() {
            item = cc.instantiate(_this.shopItemPrefab);

            var shopID = void 0;
            var goodsID = index;
            if (GlobalUserData.isOpenIAP) {
                shopID = index;
            } else {
                shopID = index + 6;
            }
            item.on(cc.Node.EventType.TOUCH_END, function () {
                _this.onShopItemClick(goodsID);
            }, item);
            item.getComponent("ShopItem").init({ shopID: goodsID });
            _this.shopItemList.content.addChild(item);
        };

        for (var index = 0; index < this.shopItemCount; index++) {
            var item;

            _loop();
        }
    },
    onEnable: function onEnable() {
        // cc.director.on('onInCharge',this.onInCharge,this);
        console.log("[ShopView][onEnable]");
    },
    onDisable: function onDisable() {
        // cc.director.off('onInCharge',this.onInCharge,this);
        console.log("[ShopView][onDisable]");
    },
    onShopItemClick: function onShopItemClick(goodsID) {
        var _this2 = this;

        console.log("[ShopView][onShopItemClick] goodsID = ", goodsID);
        if (GlobalUserData.isGuest) {
            GlobalFun.showAlert({
                message: "<color=#000000>为了您的账号安全,充值前请绑定手机号!<br/> (绑定就送<color=#FF0000>2000</c>金币,账号和手机号均限领一次)</c>",
                btn: [{
                    name: "去绑定",
                    callback: function callback() {
                        GlobalFun.showBindView();
                        _this2.close();
                    }
                }, {
                    name: "继续",
                    callback: function callback() {
                        _this2.onInCharge({ goodsID: goodsID });
                    }
                }]
            });
        } else {
            this.onInCharge({ goodsID: goodsID });
        }
    },
    onInCharge: function onInCharge(args) {
        console.log("[ShopView][onInCharge]");
        var goodsID = args.goodsID;
        var shopDataArray = GlobalUserData.shopData.shop.base;
        if (goodsID < 0 || goodsID >= shopDataArray.length) {
            console.log("[ShopView][onInCharge] shopDataArray length = " + shopDataArray.length);
            return;
        }
        var itemVal = shopDataArray[goodsID];
        var params = {};

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            params["userid"] = GlobalUserData.dwUserID;
            params["goods_name"] = itemVal.name;
            params["goods_num"] = "1";
            params["remark"] = "zhajinhuaGame";
            params["goods_note"] = "集结号拼三张";
            params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1"; //todo
            params["user_identity"] = MultiPlatform.getMachineID() || "usertoken"; //todo
            params["productid"] = itemVal.id;
            params["os"] = "1";
            params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
            params["channelid"] = GlobalDef.CHANNELID_center;
            params["pay_amt"] = itemVal.price;

            var url = GlobalDef.httpBaseUrl;
            url += "/HZMobile/PayInit2_0.ashx";
            params["url"] = url;

            this.onChoosePaytype(params);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            params["userid"] = GlobalUserData.dwUserID;
            params["goods_name"] = itemVal.name;
            params["goods_num"] = "1";
            params["remark"] = "zhajinhuaGame";
            params["goods_note"] = "集结号拼三张";
            params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1"; //todo
            params["user_identity"] = MultiPlatform.getMachineID() || "usertoken"; //todo
            params["pay_type"] = "8";
            params["productid"] = itemVal.id;
            params["os"] = "2";
            params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
            params["channelid"] = GlobalDef.CHANNELID_center;

            if (GlobalUserData.isOpenIAP) {
                params["pay_amt"] = itemVal.iosprice;
                var url = GlobalDef.httpBaseUrl;
                url += "/HZMobile/PayInit2_0.ashx";
                var paramString = GlobalFun.buildRequestParam(params);
                var xhr = new XMLHttpRequest();
                var self = this;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                        var response = xhr.responseText;
                        console.log(response);
                        var value = JSON.parse(response);
                        if (value.status == 1) {
                            if (value.errorcode == 10026) {
                                GlobalUserData.isOpenIAP = false;
                                self.refreshUI();
                            }
                        } else {
                            if (value.msg !== undefined) {
                                GlobalFun.showToast(value.msg);
                            }
                        }
                        cc.director.emit("ShopCompleted");
                    }
                };
                GlobalFun.showPopWaiting(cc.director.getScene(), {
                    closeEvent: "ShopCompleted",
                    callBackFunc: function callBackFunc() {
                        console.log("[ShopView][onInCharge] callbackfunc");
                    }
                });
                xhr.open("POST", url, true);
                // xhr.setRequestHeader("Content-Type","application/json");
                xhr.send(paramString);
                // this.onChoosePaytype(params);
            } else {
                params["pay_amt"] = itemVal.price;
                this.onChoosePaytype(params);
            }
        }
        // this.onChoosePaytype(params);
    },
    onChoosePaytype: function onChoosePaytype(params) {
        console.log("[ShopView][onChoosePaytype]");
        cc.loader.loadRes("prefab/ChoosePayTypeView", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            newNode.getComponent("ChoosePayTypeView").init(params);
            cc.director.getScene().getChildByName("Canvas").addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode, function () {
                console.log("[ShopView][onChoosePaytype]ActionShowTanChuang callback");
            });
        });
        this.close();
    },
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[ShopView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        this.close();
        console.log("[ShopView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MultiPlatform":"MultiPlatform"}],"ToastView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '18601RzxBJIKIb9IQjkETao', 'ToastView');
// Script/external/ToastView.js

"use strict";

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
        m_Label_alert: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.init({message:"this is just test"});
        console.log("[ToastView][onLoad]");
    },
    init: function init(params) {
        var message = params.message;
        this.m_Label_alert.string = message;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(1.0), cc.fadeOut(0.5), cc.removeSelf()));
        console.log("[ToastView][init] message = " + message);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[ToastView][onDestroy]");
    },
    onDisable: function onDisable(params) {
        this.node.destroy();
        console.log("[ToastView][onDisable]");
    },
    onEnable: function onEnable(params) {
        console.log("[ToastView][onEnable]");
    }
});

cc._RFpop();
},{}],"UserChangePwdView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e22d2s+t9hJW6yh21QyOcbQ', 'UserChangePwdView');
// Script/plaza/views/plaza/UserChangePwdView.js

"use strict";

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
        m_Editbox_originPassword: {
            default: null,
            type: cc.EditBox
        },
        m_Editbox_confirmPassword: {
            default: null,
            type: cc.EditBox
        },
        m_Editbox_newPassword: {
            default: null,
            type: cc.EditBox
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onEnable: function onEnable() {
        console.log("[UserChangePwdView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[UserChangePwdView][onDisable]");
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[UserChangePwdView][onDestroy]");
    },
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickCloseButton: function onClickCloseButton() {
        this.close();
        console.log("[UserChangePwdView][onClickCloseButton] destroy");
    },
    onClickEditName: function onClickEditName(params) {
        this.m_Label_userName.node.active = false;
    },
    onClickConfirmButton: function onClickConfirmButton() {
        var szPassword = this.m_Editbox_originPassword.string;
        var szNewPassword = this.m_Editbox_newPassword.string;
        var szConfirmPassword = this.m_Editbox_confirmPassword.string;
        if (szPassword.length <= 0 || szNewPassword.length <= 0 || szConfirmPassword.length <= 0) {
            console.log("[UserChangePwdView][onClickConfirmButton] 密码不能为空!");
            GlobalFun.showToast("密码不能为空!");
            return;
        }
        if (szPassword == szNewPassword) {
            console.log("[UserChangePwdView][onClickConfirmButton] 新旧密码不能相同!");
            GlobalFun.showToast("新旧密码不能相同!");
            return;
        }
        if (szConfirmPassword != szNewPassword) {
            console.log("[UserChangePwdView][onClickConfirmButton] 确认密码不一致!");
            GlobalFun.showToast("确认密码不一致!");
            return;
        }
        if (szNewPassword.length < 6 || szNewPassword.length > 16) {
            console.log("[UserChangePwdView][onClickConfirmButton] 密码长度为6-16位!");
            GlobalFun.showToast("密码长度为6-16位!");
            return;
        }
        var url = GlobalDef.httpBaseUrl;
        // url += "/hz/hzUpdatePassWord.ashx";
        url += "/hz/hzUpdatePassWord3_0.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["type"] = "1";
        params["oldpass"] = cc.md5Encode(szPassword);
        params["newpass"] = cc.md5Encode(szNewPassword);
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    GlobalUserData.szPassWord = cc.md5Encode(szNewPassword);
                    cc.sys.localStorage.setItem('password', szNewPassword);
                    self.m_Editbox_confirmPassword.string = "";
                    self.m_Editbox_newPassword.string = "";
                    self.m_Editbox_originPassword.string = "";
                    self.showUserProfileView();
                    self.close();
                    cc.director.emit("onChangePasswordSuccess");
                }
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserChangePwdView][onClickConfirmButton] " + paramString);
    },
    showUserProfileView: function showUserProfileView() {
        var self = this;
        cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
            var context = cc.Canvas.instance.node;
            if (cc.isValid(context)) {
                var newNode = cc.instantiate(prefab);
                context.addChild(newNode);
                GlobalFun.ActionShowTanChuang(newNode);
            }
        });
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"UserFaceItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2bd3fFOAp9PNrRljOXgyZDB', 'UserFaceItem');
// Script/plaza/views/plaza/UserFaceItem.js

"use strict";

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
        m_Image_userFace: {
            default: null,
            type: cc.Sprite
        },
        m_Image_select: cc.Sprite,
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas
        },
        _faceID: 0

    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        var faceID = params.faceID;
        this._faceID = faceID;
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + faceID);
    },
    setSelect: function setSelect(bSelect) {
        this.m_Image_select.node.active = bSelect;
    }
});

cc._RFpop();
},{}],"UserFaceView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3a2b4GP6WJOxJfMBnJgNHQU', 'UserFaceView');
// Script/plaza/views/plaza/UserFaceView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
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
        userFaceItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        userFaceList: {
            default: null,
            type: cc.ScrollView
        },
        userFaceCount: 0,
        _selectIndex: -1
    },

    // use this for initialization
    onLoad: function onLoad() {
        var _this = this;

        var _loop = function _loop() {
            item = cc.instantiate(_this.userFaceItemPrefab);

            var idx = index;
            item.getComponent("UserFaceItem").init({ faceID: index });
            item.on(cc.Node.EventType.TOUCH_END, function () {
                _this.onFaceItemClick(idx);
            });
            _this.userFaceList.content.addChild(item);
        };

        for (var index = 0; index < this.userFaceCount; index++) {
            var item;

            _loop();
        }
        this.onFaceItemClick(GlobalUserData.wFaceID - 1);
    },
    onEnable: function onEnable() {
        console.log("[UserFaceView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[UserFaceView][onDisable]");
    },
    close: function close(params) {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onFaceItemClick: function onFaceItemClick(idx) {
        if (idx === this._selectIndex) {
            return;
        }
        var children = this.userFaceList.content.children;
        if (this._selectIndex >= 0 && cc.isValid(children[this._selectIndex])) {
            children[this._selectIndex].getComponent("UserFaceItem").setSelect(false);
        }
        this._selectIndex = idx;
        if (idx >= 0 && cc.isValid(children[idx])) {
            children[idx].getComponent("UserFaceItem").setSelect(true);
        }
    },
    onClickConfirm: function onClickConfirm() {
        this.onChangeUserFace({ faceID: this._selectIndex + 1 });
    },
    onChangeUserFace: function onChangeUserFace(params) {
        this._faceID = params.faceID;
        var faceID = this._faceID;
        var url = GlobalDef.httpBaseUrl;
        // url += "/hz/hzUpdateFaceId.ashx";
        url += "/hz/hzUpdateFaceId3_0.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["faceId"] = faceID;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                cc.director.emit("onChangeUserFaceSuccess");
                var value = JSON.parse(response);
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
                if (value.status == 1) {
                    self.close();
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserFaceView][onChangeUserFace] " + paramString);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[UserFaceView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        // var FaceID = this._faceID;
        // cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
        //     var newNode = cc.instantiate(prefab);
        //     newNode.getComponent("UserProfileView")._faceID = FaceID;
        //     cc.director.getScene().getChildByName("Canvas").addChild(newNode);
        //     GlobalFun.ActionShowTanChuang(newNode, function () {
        //         console.log("[UserFaceView][onClickUserProfile]ActionShowTanChuang callback");
        //     })

        // });
        this.close();
        console.log("[UserFaceView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"UserInfaceItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c4c4ho+FdH6L1IdAB9cthx', 'UserInfaceItem');
// Script/game/UserInfaceItem.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GlobalFun = require("GlobalFun");
var people = {
    "base": [[{
        "wait1": {
            "image": "res/people/people_1_1",
            "frame": 17
        },
        "wait2": {
            "image": "res/people/people_1_5",
            "frame": 16
        },
        "wait3": {
            "image": "res/people/people_1_6",
            "frame": 31
        },
        "chip": {
            "image": "res/people/people_1_2",
            "frame": 24
        },
        "lose": {
            "image": "res/people/people_1_3",
            "frame": 20
        },
        "win": {
            "image": "res/people/people_1_4",
            "frame": 15
        },
        "collect": {
            "image": "res/people/people_1_7",
            "frame": 21
        }
    }, {
        "wait1": {
            "image": "res/people/people_2_1",
            "frame": 17
        },
        "wait2": {
            "image": "res/people/people_2_5",
            "frame": 20
        },
        "wait3": {
            "image": "res/people/people_2_6",
            "frame": 30
        },
        "chip": {
            "image": "res/people/people_2_2",
            "frame": 24
        },
        "lose": {
            "image": "res/people/people_2_3",
            "frame": 24
        },
        "win": {
            "image": "res/people/people_2_4",
            "frame": 28
        },
        "collect": {
            "image": "res/people/people_2_7",
            "frame": 23
        }
    }], [{
        "wait1": {
            "image": "res/people/people_3_1",
            "frame": 17
        },
        "wait2": {
            "image": "res/people/people_3_5",
            "frame": 45
        },
        "wait3": {
            "image": "res/people/people_3_6",
            "frame": 33
        },
        "chip": {
            "image": "res/people/people_3_2",
            "frame": 21
        },
        "lose": {
            "image": "res/people/people_3_3",
            "frame": 37
        },
        "win": {
            "image": "res/people/people_3_4",
            "frame": 28
        },
        "collect": {
            "image": "res/people/people_3_7",
            "frame": 26
        }
    }, {
        "wait1": {
            "image": "res/people/people_4_1",
            "frame": 17
        },
        "wait2": {
            "image": "res/people/people_4_5",
            "frame": 15
        },
        "wait3": {
            "image": "res/people/people_4_6",
            "frame": 30
        },
        "chip": {
            "image": "res/people/people_4_2",
            "frame": 22
        },
        "lose": {
            "image": "res/people/people_4_3",
            "frame": 33
        },
        "win": {
            "image": "res/people/people_4_4",
            "frame": 19
        },
        "collect": {
            "image": "res/people/people_4_7",
            "frame": 19
        }
    }]]
};
cc.Class({
    extends: cc.Component,
    editor: _defineProperty({
        requireComponent: cc.Sprite
    }, "requireComponent", cc.Animation),
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
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.playerAnimate("win",0);
    },
    playerAnimate: function playerAnimate(szAnim, viewID, userItem) {
        var _this = this;

        console.log("play_______", szAnim);
        var animation = this.node.getComponent(cc.Animation);
        var gender = 0;
        this.m_userItem = userItem || this.m_userItem;
        if (this.m_userItem && this.m_userItem.cbGender) {
            gender = this.m_userItem.cbGender - 1;
        }
        var index = viewID % 2;
        if (szAnim == "wait") {
            szAnim = szAnim + GlobalFun.getRandomInt(1, 3);
        }
        var animName = "";
        if (gender == 0) {
            animName = "male_" + index + "_" + szAnim;
        } else {
            animName = "female_" + index + "_" + szAnim;
        }
        var pVal = people["base"][gender][index][szAnim];
        if (pVal == null) {
            console.log("people is null", gender, index, szAnim);
            return;
        }
        var urls = [];
        for (var i = 0; i < pVal.frame; i++) {
            var str = pVal.image + "_" + GlobalFun.PrefixInteger(i + 1, 2);
            urls.push(str);
        }
        if (animation.getAnimationState(animName)) {
            animation.play(animName);
            console.log("anim is exist", animName);
        } else {
            this.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrames = assets;
                var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, spriteFrames.length);
                clip.name = animName;
                clip.wrapMode = cc.WrapMode.Default;
                console.log(animation.addClip(clip));
                animation.play(animName);
                // clip.events.push({
                //     frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
                //     func: "playanim",     // 回调函数名称
                //     params: ["win"]    // 回调参数
                // });
            });
        }
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(GlobalFun.getRandomInt(5, 10)), cc.callFunc(function () {
            _this.playerAnimate("wait", viewID, userItem);
        })));
    },
    loadResArray: function loadResArray(urls, type, completeCallback) {
        if (!completeCallback && type && !cc.isChildClassOf(type, cc.RawAsset)) {
            completeCallback = type;
            type = null;
        }
        var self = this;
        var uuids = [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var uuid = cc.loader._getResUuid(url, type);
            if (uuid) {
                uuids.push(uuid);
            }
        }
        var remain = uuids.length;
        if (remain > 0) {
            var res = [];
            for (var i = 0, len = remain; i < len; ++i) {
                var uuid = uuids[i];
                res.push({
                    type: 'uuid',
                    uuid: uuid
                });
            }
            cc.loader.load(res, function (errors, items) {
                var results = [];
                for (var i = 0; i < res.length; ++i) {
                    var uuid = res[i].uuid;
                    var id = this._getReferenceKey(uuid);
                    var item = items.getContent(id);
                    if (item) {
                        // should not release these assets, even if they are static referenced in the scene.
                        this.setAutoReleaseRecursively(uuid, false);
                        results.push(item);
                    }
                }
                if (completeCallback) {
                    completeCallback(errors, results);
                }
            });
        } else {
            this.scheduleOnce(function () {
                if (completeCallback) {
                    completeCallback(null, []);
                }
            });
        }
    },
    playanim: function playanim(params) {
        // console.log("[UserInfaceItem][playanim] " + params);
        var animation = this.node.getComponent(cc.Animation);
        animation.play(params);
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"UserProfileView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7372ddUwNdBdpRBIPPcim9/', 'UserProfileView');
// Script/plaza/views/plaza/UserProfileView.js

"use strict";

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
        m_Button_changepwd: cc.Button,
        m_Button_binding: cc.Button,
        m_Label_userName: {
            default: null,
            type: cc.Label
        },
        m_Label_userGold: {
            default: null,
            type: cc.Label
        },
        m_Label_userCharm: cc.Label,
        m_Label_userID: {
            default: null,
            type: cc.Label
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite
        },
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas
        },
        userFaceViewPrefab: {
            default: null,
            type: cc.Prefab
        },
        genderButton: {
            default: null,
            type: cc.ToggleGroup
        },
        genderManButton: {
            default: null,
            type: cc.Toggle
        },
        genderWomanButton: {
            default: null,
            type: cc.Toggle
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refreshUI();
    },
    refreshUI: function refreshUI() {
        var szNickName = GlobalUserData.szNickName;
        var llGameScore = GlobalUserData.llGameScore;
        var dwLoveLiness = GlobalUserData.dwLoveLiness;
        var dwUserID = GlobalUserData.dwUserID;
        var cbGender = GlobalUserData.cbGender || 1;
        var isGuest = GlobalUserData.isGuest;
        this.m_Label_userGold.string = llGameScore;
        this.m_Label_userCharm.string = dwLoveLiness;
        this.m_Label_userID.string = dwUserID;
        this.m_Label_userName.string = szNickName;
        if (isGuest) {
            this.m_Button_binding.node.active = true;
            this.m_Button_changepwd.node.active = false;
        } else {
            this.m_Button_binding.node.active = false;
            this.m_Button_changepwd.node.active = true;
        }
        // if( this._faceID !== undefined) {
        //     this.onChangeUserFace();
        //     cbGender = Math.floor((this._faceID - 1)/4) + 1;
        // }
        var faceID = this._faceID || GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        if (cbGender == 1) {
            this.genderManButton.check();
            console.log("this.genderManButton.isCheck = " + this.genderManButton.isChecked);
        } else {
            this.genderWomanButton.check();
            console.log("this.genderWomanButton.isCheck = " + this.genderWomanButton.isChecked);
        }
    },
    onEnable: function onEnable() {
        console.log("[UserProfileView][onEnable]");
    },
    onDisable: function onDisable() {
        console.log("[UserProfileView][onDisable]");
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[UserProfileView][onDestroy]");
    },
    close: function close() {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickCloseButton: function onClickCloseButton() {
        this.close();
        console.log("[UserProfileView][onClickCloseButton] destroy");
    },
    onClickEditName: function onClickEditName(params) {
        this.m_Label_userName.node.active = false;
    },
    onClickChangeName: function onClickChangeName(params) {
        this.m_Label_userName.node.active = true;
        var url = GlobalDef.httpUserCenter;
        url += "/HZMobile/UpdateNickName.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["nickname"] = szNewNickName;
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[UserProfileView][onClickChangeName] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.nickname !== undefined) {
                        var szNickName = value.nickname;
                        self.m_Label_userName.string = szNickName;
                        GlobalUserData.szNickName = szNickName;
                        cc.director.emit("onChangeNameSuccess");
                    }
                }
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserProfileView][onClickChangeName] " + paramString);
    },
    onClickChangeUserFace: function onClickChangeUserFace(params) {
        var userFaceView = cc.instantiate(this.userFaceViewPrefab);
        this.node.parent.addChild(userFaceView);
        // this.onClickCloseButton();
        var self = this;
        self.onClickCloseButton();
        GlobalFun.ActionShowTanChuang(userFaceView, function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        });
    },
    onClickChangePassword: function onClickChangePassword(params) {
        var self = this;
        self.onClickCloseButton();
        cc.loader.loadRes("prefab/UserChangePwdView", function (err, prefab) {
            var context = cc.Canvas.instance.node;
            if (cc.isValid(context)) {
                var newNode = cc.instantiate(prefab);
                context.addChild(newNode);
                GlobalFun.ActionShowTanChuang(newNode);
            }
        });
    },
    onClickGuestBind: function onClickGuestBind(params) {
        var self = this;
        self.onClickCloseButton();
        cc.loader.loadRes("prefab/GuestBindView", function (err, prefab) {
            var context = cc.Canvas.instance.node;
            if (cc.isValid(context)) {
                var newNode = cc.instantiate(prefab);
                context.addChild(newNode);
                GlobalFun.ActionShowTanChuang(newNode);
            }
        });
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"WelcomeView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a0e2y7VopBJYbq+UQRna/j', 'WelcomeView');
// Script/WelcomeView.js

"use strict";

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
        splash: {
            default: null,
            type: cc.Node
        },
        _step: 0,
        _count: 0,
        kDesignFrameRate: 60.0,
        kSplashStepLogo1Still: 0,
        kSplashStepLogo1FadeOut: 1,
        kSplashFadeTime: 0.5,
        kSplashStillTime: 2.0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._count = 0;
        this._step = 0;
        // this.scheduleOnce(function(){
        //     cc.director.loadScene("LoginScene");
        // }, 2);
        AudioMng.loadSoundData();
        cc.loader.loadRes("prefab/PopWaitingView", function (err, res) {});
    },
    onDestroy: function onDestroy(params) {
        console.log("[WelcomeView][onDestroy]");
        cc.sys.garbageCollect();
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this._count += dt;
        if (this._step === this.kSplashStepLogo1Still) {
            if (this._count > this.kSplashStillTime) {
                this._count = 0;
                this._step += 1;
            }
        } else if (this._step === this.kSplashStepLogo1FadeOut) {
            if (this._count > this.kSplashFadeTime) {
                this.splash.active = false;
                this._count = 0;
                cc.director.loadScene("LoginScene");
            } else {
                var op = 255 * (1.0 - Math.sin(this._count / 1.0 * 0.5 * Math.PI));
                this.splash.opacity = op;
            }
        }
    }
});

cc._RFpop();
},{"AudioMng":"AudioMng"}]},{},["AudioMng","Bridge_android","Bridge_ios","CoverView","GameServerItem","GameUserItem","GlobalDef","GlobalUserData","HelloWorld","LoadingView","MD5","MultiPlatform","PlazaScrollRing","PlazaView","ScrollRing","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","CardItem","ChipItem","GameChatView","GameLogic","GamePresentConfirmView","GameScene","GameSelfInfoView","GameSettingView","GameUserInfoView","GameView","PresentNode","UserInfaceItem","GameModel","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","GameFrame","LogonFrame","LogonView","RegisterView","BankView","ChoosePayTypeView","GuestBindView","LotteryView","PlazaRoomItem","ServiceView","SettingView","ShopItem","ShopView","UserChangePwdView","UserFaceItem","UserFaceView","UserProfileView"]);
