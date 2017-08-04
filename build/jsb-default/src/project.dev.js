require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AlertView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '18601RzxBJIKIb9IQjkETao', 'AlertView');
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
        m_Label_alert: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        // this.init({message:"this is just test"});
        console.log("[AlertView][onLoad]");
    },
    init: function init(params) {
        var message = params.message;
        this.m_Label_alert.string = message;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(cc.fadeIn(0.5), cc.delayTime(1.0), cc.fadeOut(0.5), cc.removeSelf()));
        console.log("[AlertView][init] message = " + message);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[AlertView][onDestroy]");
    },
    onDisable: function onDisable(params) {
        this.node.destroy();
        console.log("[AlertView][onDisable]");
    },
    onEnable: function onEnable(params) {
        console.log("[AlertView][onEnable]");
    }
});

cc._RFpop();
},{}],"AudioMng":[function(require,module,exports){
"use strict";
cc._RFpush(module, '40facvaPhFNy6Mw7j/9j4sO', 'AudioMng');
// Script/AudioMng.js

"use strict";

var AudioMng = {
    playMusic: function playMusic() {
        cc.audioEngine.playMusic(cc.url.raw("resources/sounds/bgm//bgm_plaza.mp3"), true);
    },
    pauseMusic: function pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function resumeMusic() {
        cc.audioEngine.resumeMusic();
    },
    _playSFX: function _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
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
        },
        _selectIndex: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refreshUI();
    },
    refreshUI: function refreshUI() {
        this.m_Label_get_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_save_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_get_bankGold.string = GlobalUserData.llInsureScore;
        this.m_Label_save_bankGold.string = GlobalUserData.llInsureScore;
    },
    onEnable: function onEnable() {
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[BankView][onEnable]");
    },
    onDisable: function onDisable() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
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
                GlobalFun.showAlert("金额或密码不能为空!");
                return;
            }
            if (Number(szGoldCount) <= 0 || Number(szGoldCount) > GlobalUserData.llInsureScore) {
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
        } else if (this._selectIndex == 1) {
            var szGoldCount = this.m_Editbox_save_gold.string;
            if (szGoldCount.length <= 0) {
                console.log("[BankView][onClickConfirm] 金额不能为空！");
                GlobalFun.showAlert("金额不能为空！");
                return;
            }
            if (Number(szGoldCount) <= 0 || Number(szGoldCount) > Number(GlobalUserData.llGameScore)) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出身上金额！");
                GlobalFun.showAlert("数值不合法或超出身上金额！");
                return;
            }
            params["userid"] = GlobalUserData.dwUserID;
            params["score"] = szGoldCount;
            params["type"] = "1";

            url += "/hz/hzUserBankMobile.ashx";
        } else if (this._selectIndex == 2) {
            var szPassWord = this.m_Editbox_originPassword.string;
            var szNewPassWord = this.m_Editbox_newPassword.string;
            var szConfirmPassWord = this.m_Editbox_confirmPassword.string;
            if (szPassWord.length <= 0 || szNewPassWord.length <= 0 || szConfirmPassWord.length <= 0) {
                console.log("[BankView][onClickConfirm] 密码不能为空！");
                GlobalFun.showAlert("密码不能为空！");
                return;
            }
            if (szPassWord == szNewPassWord) {
                console.log("[BankView][onClickConfirm] 新旧密码不能相同!");
                GlobalFun.showAlert("新旧密码不能相同!");
                return;
            }
            if (szConfirmPassWord != szNewPassWord) {
                console.log("[BankView][onClickConfirm] 确认密码不一致!");
                GlobalFun.showAlert("确认密码不一致!");
                return;
            }
            if (szNewPassWord.length < 6 || szNewPassWord.length > 16) {
                console.log("[BankView][onClickConfirm] 密码长度为6-16位!");
                GlobalFun.showAlert("密码长度为6-16位!");
                return;
            }

            params["userid"] = GlobalUserData.dwUserID;
            params["type"] = "2";
            params["oldpass"] = cc.md5Encode(szPassWord);
            params["newpass"] = cc.md5Encode(szNewPassWord);

            url += "/hz/hzUpdatePassWord.ashx";
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
                GlobalFun.showAlert(value.msg);
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[BankView][onClickConfirm] " + paramString);
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
            return;
        }

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
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[ChoosePayTypeView][onEnable]");
    },
    onDisable: function onDisable() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[ChoosePayTypeView][onDisable]");
    },
    onChangeUserFace: function onChangeUserFace(params) {
        // GlobalUserData.wFaceID = params.detail.faceID;
        // this._faceID = params.detail.faceID;
        // this.onClickCloseButton();
        // console.log("[ChoosePayTypeView][onChangeUserFace] faceID = "+ JSON.stringify(params.detail));
        // cc.director.emit("onChangeUserFace",params.detail);
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
// Scene/CoverView.js

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
},{}],"GameFrame":[function(require,module,exports){
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
            }), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_FRAME, this.OnSocketMainGameFrame), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_PRESENT, function (sub, pData) {}), _socketEventCallback);
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
            // GlobalFun.showToast({message:logonError.szErrorDescribe});
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

                console.log("[GameFrame][OnSocketMainSystem] " + message.szContent);
                if (bIntermet) {
                    if (message.szContent) {
                        cc.director.emit("LoadingViewError", { msg: message.szContent, type: GlobalDef.SMT_CLOSE_GAME });
                    }
                    console.log("[GameFrame][OnSocketMainSystem] " + message.szContent);
                    this.onCloseSocket();
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
            this.onSocketLogonFinish();
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
        }
        if (userItem) {
            console.log("[GameFrame][OnSocketSubScore] 更新 " + JSON.stringify(userScore, null, ' '));
            userItem.lScore = userScore.UserScore.lScore;
            userItem.lGameGold = userScore.UserScore.lGameGold;
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
        this.onExitTable();
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
        this._gameFrame.onCloseSocket();
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
        console.log("---------------------------dt = " + dt);
        console.log("[GameModel][onClockUpdata] chair = " + this._ClockChair + " time = " + this._ClockTime + " id = " + this._ClockID);
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
    //发送准备
    sendUserReady: function sendUserReady() {
        this._gameFrame.sendUserReady();
    },
    sendTextChat: function sendTextChat(msg, tagetUser, color) {
        this._gameFrame.sendTextChat(msg, tagetUser, color);
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameScene":[function(require,module,exports){
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
    onEnable: function onEnable(params) {
        // cc.director.on("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
    },
    onDisable: function onDisable(params) {
        // cc.director.off("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
        // this.onExitRoom();
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
        console.log("[GameScene][onEventGameClockInfo] chair = " + chair + " time = " + time + " clockID = " + clockID);
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
        if (this.m_lCurrentTimes < addScore.lCurrentTimes) {
            // this._gameView.runAddTimesAnimate(viewID);
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
        console.log("[GameScene][onSubLookCard] lookCard = " + JSON.stringify(lookCard, null, ' '));
        var viewID = this.switchViewChairID(lookCard.wLookCardUser);
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
        this._gameView.compareCard(firstUser, secondUser, undefined, undefined, compareCard.wCompareUser[0] === this.m_wWinnerUser, function name(params) {
            self.onFlushCardFinish();
        });
    },
    onFlushCardFinish: function onFlushCardFinish() {
        //todo
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
        console.log("[GameScene][onSubOpenCard]");
        //开牌数据包
        // struct CMD_S_OpenCard
        // {
        //     WORD								wWinner;							//胜利用户
        // };
        var myChair = this.getMeChairID();
        if (this.m_cbPlayStatus[myChair] === 1 && !this.m_bLastAddOver) {
            var data = CCmd_Data.create();
            this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
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
        //移动筹码
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var viewID = this.switchViewChairID(i);
            if (gameEnd.lGameScore[i] !== 0) {
                var viewID = this.switchViewChairID(i);
                saveType[i] = GameLogic.getCardType(gameEnd.cbCardData[i]);
                if (!(i === myChair && this.m_bLookCard[i])) {
                    this._gameView.setUserCard(viewID, gameEnd.cbCardData[i]);
                }
                if (gameEnd.lGameScore[i] > 0) {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.winTheChip(viewID);
                    this._gameView.setUserCardType(viewID, saveType[i], "win_");
                } else {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.setUserCardType(viewID, saveType[i], "lose_");
                }
                // endShow = true;
                // this._gameView.
                //....
                //.....
            } else {
                saveType[i] = 1;
                this._gameView.setUserTableScore(viewID);
            }
        }

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
        console.log("[GameScene][onSubLastAdd]");
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
    },
    onClickChangeTable: function onClickChangeTable(params) {
        this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR);
    },
    onClickQuit: function onClickQuit(params) {
        this._gameFrame.sendStandupPacket();
        cc.director.loadScene("PlazaScene");
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
        this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR);
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
        if (maxAddScore < followScore) {
            this._gameView.m_Button_follow.interactable = false;
        }
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
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GameLogic":"GameLogic","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameServerItem":[function(require,module,exports){
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
},{}],"GameUserItem":[function(require,module,exports){
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
        userInfoHead.UserScoreInfo = {};
        userInfoHead.UserScoreInfo.lScore = pData.readint64(); //用户分数
        userInfoHead.UserScoreInfo.lGameGold = pData.readint64(); //游戏金币
        userInfoHead.UserScoreInfo.lInsureScore = pData.readint64(); //存储金币
        userInfoHead.UserScoreInfo.lWinCount = pData.readint(); //胜利盘数
        userInfoHead.UserScoreInfo.lLostCount = pData.readint(); //失败盘数
        userInfoHead.UserScoreInfo.lDrawCount = pData.readint(); //和局盘数
        userInfoHead.UserScoreInfo.lFleeCount = pData.readint(); //断线数目
        userInfoHead.UserScoreInfo.lExperience = pData.readint(); //用户经验

        userInfoHead.dwCustomFaceVer = pData.readdword(); //上传头像
        userInfoHead.dwPropResidualTime = []; //道具时间
        for (var index = 0; index < 16; index++) {
            var val = pData.readdword();
            userInfoHead.dwPropResidualTime.push(val);
        }
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
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userNode = cc.instantiate(this.userInfacePrefab);
            this.node.getChildByName("nodePlayer").addChild(userNode);
            this.m_Node_player[index] = userNode;
            userNode.setPosition(this.ptPlayer[index]);
            userNode.rotation = index * -90;
            userNode.active = false;

            this.m_userHead[index] = {};
            this.m_userHead[index].name = userHeadList[index].getChildByName("m_Label_username").getComponent(cc.Label);
            this.m_userHead[index].score = userHeadList[index].getChildByName("game_gold_back").children[0].getComponent(cc.Label);
            this.m_userHead[index].bg = userHeadList[index];
            this.m_userHead[index].bg.active = false;

            //计时器
            this.m_timeProgress[index] = userHeadList[index].getComponent(cc.ProgressBar);
            this.m_timeProgress[index].progress = 0;
            this.m_rcCompare[index] = this.node.getChildByName("flagCompare").children[index];
            this.m_rcCompare[index].active = false;
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
        console.log("[GameView][onUpdateClockView] [viewID, time] = " + [viewID, time]);
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
            this.m_flagReady[viewID].active = GlobalDef.US_READY === userItem.cbUserStatus;
            this.m_userHead[viewID].bg.active = true;
            this.m_userHead[viewID].name.string = userItem.szName;
            this.m_userHead[viewID].score.string = userItem.lScore;
        } else {
            this.m_flagReady[viewID].active = false;
            this.m_userHead[viewID].name.string = "";
            this.m_userHead[viewID].score.string = "";
            this.m_userHead[viewID].bg.active = false;
        }
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function onShowIntroduce(bShow) {},
    //筹码移动
    playerJetton: function playerJetton(wViewChairID, num, notani) {
        if (!num || num < 1 /*|| !this.m_lCellScore || this.m_lCellScore < 1*/) {
                console.log("[GameView][playerJetton] num is invalid");
                return;
            }
        // var count = Math.floor(num/this.m_lCellScore);
        // if (count > 10) {
        //     count = 10;
        // }
        // if (count <= 0) {
        //     count = 1;
        // }
        // for (var i = 0; i < count; i++) {
        var chip = cc.instantiate(this.chipPrefab);
        this.nodeChipPool.addChild(chip);
        var chipItem = chip.getComponent("ChipItem");
        chipItem.init(num);
        chip.setPosition(this.ptPlayer[wViewChairID]);
        // chip.setScale(0.5);
        var x = Math.random() * 200 - 100;
        var y = Math.random() * 100 - 50;
        console.log("[GameView][playerJetton] [x,y] = " + [x, y]);
        chip.runAction(cc.moveTo(0.2, cc.p(x, y)));
        // }
    },
    //停止比牌动画
    stopCompareCard: function stopCompareCard() {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function compareCard(firstuser, seconduser, firstcard, secondcard, bfirstwin, callback) {
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
        cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, self.ptCard[viewID].x + (viewID === zjh_cmd.MY_VIEWID && 80 || 35) * index, self.ptCard[viewID].y))));
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
        if (bGiveup) {
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
    //赢得筹码
    winTheChip: function winTheChip(wWinner) {
        var children = this.nodeChipPool.children;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            element.runAction(cc.sequence(cc.delayTime(0.1 * (children.length - i)), cc.moveTo(0.4, this.ptPlayer[wWinner]), cc.callFunc(function (node) {
                node.destroy();
            })));
        }
    },
    //清理筹码
    cleanAllJettons: function cleanAllJettons() {
        this.nodeChipPool.removeAllChildren();
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
    onTouch: function onTouch(params) {
        // console.log(params);
        // if (this.m_bShowMenu) {
        //     this.m_Toggle_menuOpen.uncheck();
        // }
    },
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
        this._scene.sendTextChat('hello world');
    },
    //按键响应
    onStartGame: function onStartGame() {
        this._scene.onStartGame(true);
        // this.m_Button_ready.node.active = false;
        // var delayCount = 1;
        // for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
        //     for (var j = 0; j < zjh_cmd.GAME_PLAYER; j++) {
        //         // console.log("[GameScene][onSubGameStart] [this.m_wBankerUser,j,zjh_cmd.GAME_PLAYER] = " + [this.m_wBankerUser,j,zjh_cmd.GAME_PLAYER]);
        //         var chair = j;
        //         console.log("[GameScene][onSubGameStart] chair = " + chair);
        //         // if (this.m_cbPlayStatus[chair] === 1) {
        //             this.sendCard(chair, i, delayCount * 0.1);
        //             delayCount += 1;
        //         // }
        //     }

        // }
        // this._bBack = !this._bBack;
        // for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
        //     var cardData = [2,3,4];
        //     this.setUserCard(i,this._bBack && cardData || []);

        // }
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
    onAddScore: function onAddScore(event, params) {
        console.log(params);
        this._scene.addScore(params);
        // var arr = [0,1000,10000,100000];
        // this.playerJetton(zjh_cmd.MY_VIEWID,arr[params]);
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GameLogic":"GameLogic","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GlobalDef":[function(require,module,exports){
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
    httpInitUrl: "http://ver.jjhgame.com/Handle/hz/init.ashx", //app初始化接口地址
    httpBaseUrl: "http://interface.jjhgame.com/Handle", //web接口地址
    httpOpenUrl: "http://user.jjhgame.com/findpasswordHZ.aspx", //找回密码
    httpUserCenter: "http://f.jjhgame.com/Handle", //用户中心
    LOGON_SERVER_DOMAIN: "nnapp.jjhgame.com", //登录服务器
    LOGON_SERVER_IP: "122.226.186.38", //登录服务器
    PORT_LOGON_SERVER: 9009, //登陆服务器

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

    SUB_GF_PROPERTY: 510, //道具消息
    SUB_GF_PROPERTY_RESULT: 511, //道具结果
    SUB_GF_RESIDUAL_PROPERTY: 512, //剩余道具
    SUB_GF_PROP_ATTRIBUTE: 513, //道具属性
    SUB_GF_PROP_BUGLE: 514, //喇叭道具
    SUB_GF_QUERY_USER_INFO: 515, //鲜花消息
    SUB_GF_SEND_HONG_BAO: 516, //发红包
    SUB_GF_QIANG_HONG_BAO: 517, //发红包

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
function ActionShowTanChuang(widget, cb) {
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
}
function showToast(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/ToastView", function (err, ToastPrefab) {
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(ToastPrefab);
            newNode.getComponent("ToastView").onInit(params);
            context.addChild(newNode);
            ActionShowTanChuang(newNode.children[0]);
            console.log("showToast");
        }
    });
}

function showAlert(message, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/AlertView", function (err, AlertPrefab) {
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(AlertPrefab);
            newNode.getComponent("AlertView").init({ message: message });
            context.addChild(newNode);
            console.log("showAlert");
        }
    });
}
/*
showPopWaiting()
@params{
    waitingText: 界面显示的文字,
    waitingTime: 界面存在的时间,超时即销毁界面,
    closeEvent: 关闭界面监听的事件, 
    callBackFunc: 收到监听事件执行的回调函数,
}
*/
function showPopWaiting(context, params) {
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/PopWaitingView", function (err, PopWaitPrefab) {
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(PopWaitPrefab);
            newNode.getComponent("PopWaitView").onInit(params);
            context.addChild(newNode);
            ActionShowTanChuang(newNode);
            console.log("showPopWaiting");
        }
    });
}

function showLoadingView(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showLoadingView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/LoadingView", function (err, res) {
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(res);
            newNode.getComponent("LoadingView").init(params);
            context.addChild(newNode);
        }
    });
}

function getsign(params) {
    params = params + "key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x"; //加入key
    return cc.md5Encode(params).toLowerCase();
}

function buildRequestParam(params) {
    var nowTime = Math.floor(Date.now() / 1000);
    params["datetamp"] = nowTime;
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
    paramString = paramString + "sign=" + getsign(paramString);
    return paramString;
}

function ipToNumber(ip) {
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
}

function numberToIp(number) {
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
}
//数字填充前缀0
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

module.exports = {
    ActionShowTanChuang: ActionShowTanChuang,
    showToast: showToast,
    showAlert: showAlert,
    showPopWaiting: showPopWaiting,
    buildRequestParam: buildRequestParam,
    ipToNumber: ipToNumber,
    numberToIp: numberToIp,
    PrefixInteger: PrefixInteger,
    showLoadingView: showLoadingView
};

cc._RFpop();
},{"MD5":"MD5"}],"GlobalUserData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '82fedQuEdFL3YFUwo343EL9', 'GlobalUserData');
// Script/GlobalUserData.js

"use strict";

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
        this.roomList = [];
        var music_setting = JSON.parse(cc.sys.localStorage.getItem('music_setting') || "{}");
        var effect_setting = JSON.parse(cc.sys.localStorage.getItem('effect_setting') || "{}");
        this.bMusicAble = music_setting.musicable === undefined || music_setting.musicable;
        this.nMusic = music_setting.musicvalue === undefined && 1.0 || music_setting.musicvalue;
        this.bEffectAble = effect_setting.effectable === undefined || effect_setting.effectable;
        this.nEffect = effect_setting.effectvalue === undefined && 1.0 || effect_setting.effectvalue;
    },
    setMusicAble: function setMusicAble(able) {
        this.bMusicAble = able;
        if (able) {
            this.nMusic = 1.0;
        } else {
            this.nMusic = 0;
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
        } else {
            this.nEffect = 0;
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
        //     LONGLONG							llGameScore;					//游戏金币
        //     LONGLONG							llInsureScore;					//银行金币
        //     TCHAR								szAccounts[NAME_LEN];			//登录帐号
        //     TCHAR								szNickName[NAME_LEN];			//昵称
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
        this.llGameScore = pData.readint64();
        this.llInsureScore = pData.readint64();
        this.szAccounts = pData.readstring(32);
        this.szNickName = pData.readstring(32);
        // console.log(this);
        // for (var prop in this) {
        //     if (typeof(this[prop]) == "function") continue;
        //     console.log('this.' + prop, '=', this[prop]);
        // }
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
},{}],"GuestBindView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9622c+r5ThJnYo5FBmGVn8W', 'GuestBindView');
// Script/plaza/views/plaza/GuestBindView.js

"use strict";

require("MD5");
var GlobalDef = require("GlobalDef");
var GlobalFun = require("GlobalFun");
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
            GlobalFun.showAlert("手机号码不合法");
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
                GlobalFun.showAlert(value.Msg);
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
            GlobalFun.showAlert("帐号密码等信息不能为空");
            return;
        }
        if (szPwd.length < 6 || szPwd.length > 16) {
            console.log("密码长度为6-16位");
            GlobalFun.showAlert("密码长度为6-16位");
            return;
        }

        var re = /1[3578][0-9]{9}/;
        if (re.exec(szTel) === null) {
            console.log("[GuestBindView][onConfirm] 手机号码不合法");
            GlobalFun.showAlert("手机号码不合法");
            return;
        }

        var url = GlobalDef.httpUserCenter;
        url += "/Guest/GuestBindMobile.ashx";

        var params = {};
        params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["mobile"] = szTel;
        params["pwd"] = cc.md5Encode(szPwd);
        params["code"] = szVerify;

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
                    GlobalFun.showAlert("帐号绑定成功，您可以用正式帐号登录游戏了");
                    cc.director.emit("onGuestBindSuccess");
                    self.onClose();
                }
                GlobalFun.showAlert(value.msg);
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var BaseFrame = require("BaseFrame");
cc.Class({
    extends: BaseFrame,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        tableView: cc.Node
    },
    // name: "helloFrame",
    // use this for initialization
    _getdata: function _getdata(num) {
        var array = [];
        for (var i = 0; i < num; ++i) {
            var obj = {};
            obj.name = 'a' + i;
            array.push(obj);
        }
        return array;
    },
    onLoad: function onLoad() {
        // console.log(navigator);
        // console.log(navigator.connection);
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
        // var data = this._getdata(100);
        // this.tableView.getComponent("tableview").initTableView(data.length, { array: data, target: this });
        this.tableView.getComponent(cc.ScrollView).scrollToLeft(0.1);
    },
    onScrollEvent: function onScrollEvent(event) {
        console.log(event);
        console.log(event.scrollEvents);
        // this.tableView.getComponent("CoverView").scrollToIndex(2);
        var coverView = this.tableView.getComponent("CoverView");
        // coverView.adjustEndScrollView();
        var children = coverView.content.children;
        var curIndex = coverView.getCurIndex();
        // console.log("curIndex = " + curIndex);
        for (var index = 0; index < children.length; index++) {
            var element = children[index];
            var PlazaRoomItem = element.getComponent("PlazaRoomItem");
            if (index === curIndex) {
                PlazaRoomItem.select();
            } else {
                PlazaRoomItem.unselect();
            }
        }
    },
    // called every frame
    update: function update(dt) {},
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
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","MD5":"MD5"}],"LoadingView":[function(require,module,exports){
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
        GlobalFun.showToast({
            message: msg,
            confirmfunc: function confirmfunc() {
                self.node.destroy();
            }
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
        if (this.onCreateSocket("122.226.186.38", 9009) === false) {
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
        if (this.onCreateSocket("122.226.186.38", 9009) === false) {
            console.log("[logonframe][onLogonByVisitor][onCreateSocket] fail");
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
        if (this.onCreateSocket("122.226.186.38", 9009) === false) {
            console.log("[logonframe][onRegister][onCreateSocket] fail");
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
        this._logonFrame = this.node.getComponent("LogonFrame");
    },
    onEnable: function onEnable() {
        cc.director.on('onLogon', this.onLogon, this);
        cc.director.on('onShowRegister', this.onShowRegister, this);
        cc.director.on('onRegister', this.onRegister, this);
    },
    onDisable: function onDisable() {
        cc.director.off('onLogon', this.onLogon, this);
        cc.director.off('onShowRegister', this.onShowRegister, this);
        cc.director.off('onRegister', this.onRegister, this);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
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
        // console.log(cc.isValid(this._logonView));
        if (cc.isValid(this._logonView) === false) {
            this._logonView = cc.instantiate(this.logonView);
            this.node.addChild(this._logonView);
        }
        GlobalFun.ActionShowTanChuang(this._logonView, function () {
            console.log("[LogonScene][onShowLogon]ActionShowTanChuang callback");
        });
    },
    onShowVistor: function onShowVistor() {
        console.log("[LogonScene][onShowVistor]");
        // GlobalFun.showToast(cc.director.getScene(),"游客登录暂未开放,敬请期待!");
        var szMachineID = MultiPlatform.getMachineID();
        GlobalFun.showAlert(szMachineID);
        var url = GlobalDef.httpUserCenter;
        url += "/Guest/GuestLogin.ashx";
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["versionnum"] = "1.1";
        // params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["useridentity"] = szMachineID;
        params["channelid"] = GlobalDef.CHANNELID_center;
        if (cc.sys.os == cc.sys.OS_IOS) {
            params["os"] = "2";
        } else {
            // todo
            params["os"] = "2"; //"1";
        }
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[LogonScene][onShowVistor] " + xhr.getResponseHeader("Content-Type"));
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
                        GlobalFun.showToast({ message: value.msg });
                    }
                }
                cc.director.emit("GuestLoginCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "GuestLoginCompleted",
            callBackFunc: function callBackFunc() {
                console.log("[LogonScene][onShowVistor] callbackfunc");
            }
        });
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
    },
    onShowRegister: function onShowRegister() {
        if (cc.isValid(this._logonView) === true) {
            this._logonView.destroy();
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
        MultiPlatform.showAlert(MultiPlatform.getMachineID(), MultiPlatform.getIpAddress());
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MultiPlatform":"MultiPlatform"}],"LogonView":[function(require,module,exports){
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
},{"GlobalDef":"GlobalDef"}],"MD5":[function(require,module,exports){
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
        var actionNode = this.node.getChildByName("m_Node_back");
        actionNode.setPosition(1000, 0);
        actionNode.runAction(cc.sequence(cc.delayTime(this._index * 0.1), cc.moveTo(0.25, -80, 0), cc.moveTo(0.25, 0, 0)));
    },
    onClick: function onClick(params) {
        console.log("[PlazaRoomItem][onClick]");
        if (!this._roomInfo) {
            GlobalFun.showAlert("房间暂未开放，请稍后再试");
            return;
        }
        if (GlobalUserData.llGameScore >= this._roomInfo.lLimitScore) {
            // GlobalFun.showAlert("进入房间");
            cc.director.emit("onLogonRoom", { roomInfo: this._roomInfo });
        } else {
            GlobalFun.showToast({ message: "进入房间需要" + this._roomInfo.lLimitScore + "金豆,您的金豆不足,请充值!" });
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"PlazaView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52d5546nrtCUJireJfeVAhU', 'PlazaView');
// Script/PlazaView.js

"use strict";

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
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
        m_Label_userGold: {
            default: null,
            type: cc.Label
        },
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
        }
        AudioMng.playMusic();
        // this._gameFrame = this.getScene().getChildByName("GameFrame").getComponent("GameFrame");
        this.refreshUI();
    },
    refreshUI: function refreshUI() {
        console.log("[PlazaView][refreshUI]");
        for (var prop in GlobalUserData) {
            if (typeof GlobalUserData[prop] == "function") continue;
            console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        }
        this.m_Label_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_name.string = GlobalUserData.szNickName;
        this.m_Label_ID.string = "ID" + GlobalUserData.dwUserID;
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));

        this.refreshRoomList();
    },
    refreshRoomList: function refreshRoomList() {
        var _this = this;

        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
        var coverView = cc.find("Canvas/scrollview").getComponent("CoverView");
        var roomListPanel = coverView.content;
        roomListPanel.removeAllChildren();
        for (var index = 0; index < 4; index++) {
            var item = cc.instantiate(this.plazaRoomItem);
            item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
            roomListPanel.addChild(item);
        }
        var scContentSize = coverView.node.getContentSize();
        var padding = roomListPanel.children[1].getPositionX() - roomListPanel.children[0].getPositionX();
        coverView.init({
            paddingLeft: scContentSize.width / 2 - padding / 2,
            paddingRight: scContentSize.width / 2 - padding / 2,
            endCallBack: function endCallBack() {
                _this.onCoverViewEndCallBack();
            }
        });
        // coverView.scrollToLeft(0.1);
        this.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            if (GlobalUserData.llGameScore < 10000) {
                coverView.scrollToIndex(0);
            } else if (GlobalUserData.llGameScore < 100000) {
                coverView.scrollToIndex(1);
            } else {
                coverView.scrollToIndex(2);
            }
        })));
        // this.scheduleOnce(coverView.scrollToLeft(0.1));
        // var roomPageView = cc.find("Canvas/pageview").getComponent(cc.PageView);
        // roomPageView.removeAllPages();
        // for (var index = 0; index < 4; index++) {
        //     var item = cc.instantiate(this.plazaRoomItem);
        //     var PlazaRoomItem = item.getComponent("PlazaRoomItem");
        //     PlazaRoomItem.init({index:index+1,roomInfo:roomList[index]});
        //     // if (index === 0) {
        //     //     PlazaRoomItem.select();
        //     // }
        //     // else {
        //     //     PlazaRoomItem.unselect();
        //     // }
        //     // roomPageView.addPage(item);
        // }
        // roomPageView.scrollToPage(1,0.5);
    },
    onCoverViewEndCallBack: function onCoverViewEndCallBack() {
        var coverView = cc.find("Canvas/scrollview").getComponent("CoverView");
        var children = coverView.content.children;
        var curIndex = coverView.getCurIndex();
        for (var index = 0; index < children.length; index++) {
            var element = children[index];
            var PlazaRoomItem = element.getComponent("PlazaRoomItem");
            if (index === curIndex) {
                PlazaRoomItem.select();
            } else {
                PlazaRoomItem.unselect();
            }
        }
    },
    onScrollViewEvent: function onScrollViewEvent(event) {
        console.log(event);
        // console.log(this.roomItemList.content);
        console.log([this.roomItemList.getMaxScrollOffset(), this.roomItemList.getScrollOffset(), this.roomItemList.getContentPosition()]);
    },
    onPageViewEvent: function onPageViewEvent(event) {
        var roomPageView = cc.find("Canvas/pageview").getComponent(cc.PageView);
        var curIndex = roomPageView.getCurrentPageIndex();
        var allPages = roomPageView.getPages();
        console.log("[PlazaView][onPageViewEvent] curIndex = " + curIndex);
        for (var index = 0; index < allPages.length; index++) {
            var element = allPages[index];
            var PlazaRoomItem = element.getComponent("PlazaRoomItem");
            if (curIndex === index) {
                PlazaRoomItem.select();
            } else {
                // element.color = new cc.Color(170,170,170);
                PlazaRoomItem.unselect();
            }
        }
        // if (curIndex === allPages.length - 1) {
        //     var firstPage = cc.instantiate(allPages[0]);
        //     roomPageView.removePageAtIndex(0);            
        //     roomPageView.insertPage(firstPage,allPages.length);            
        //     // roomPageView.setCurrentPageIndex(allPages.length - 2);

        // }
        // else if (curIndex === 0) {
        //     var lastPage = cc.instantiate(allPages[allPages.length - 1]);
        //     roomPageView.removePageAtIndex(allPages.length -1);
        //     roomPageView.insertPage(lastPage,0);
        //     // roomPageView.setCurrentPageIndex(1);
        // }
    },
    refreshData: function refreshData() {
        var url = GlobalDef.httpBaseUrl;
        url += "/hz/hzGameUserInfo.ashx";
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
                        GlobalUserData.isGuest = value.isguest;
                    }
                    if (value.nickname !== undefined) {
                        GlobalUserData.szNickName = value.nickname;
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
        GlobalFun.showToast({ message: "暂未开放,敬请期待!" });
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
},{"AudioMng":"AudioMng","CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"PopWaitView":[function(require,module,exports){
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
            GlobalFun.showAlert("帐号密码等注册信息不能为空");
            return;
        }
        if (szPassword.length < 6 || szPassword.length > 16) {
            console.log("密码长度为6-16位");
            GlobalFun.showAlert("密码长度为6-16位");
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
            GlobalFun.showAlert("手机号码不合法");
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
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(params);
        console.log("[RegisterView][onClickConfirmButton] " + params);
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","MD5":"MD5"}],"ServiceView":[function(require,module,exports){
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
        this.m_Button_music_switch_off.node.active = !GlobalUserData.bMusicAble;
        this.m_Button_music_switch_on.node.active = GlobalUserData.bMusicAble;
    },
    onRefreshEffect: function onRefreshEffect() {
        this.m_Button_effect_switch_off.node.active = !GlobalUserData.bEffectAble;
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
    },
    onClickSwitchAccount: function onClickSwitchAccount() {
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode) {
            console.log("[SettingView][onClickSwitchAccount] 获取GameFrame 所在节点 并取消为常驻节点");
            cc.game.removePersistRootNode(GameFrameNode);
        }
        cc.director.loadScene("LoginScene");
        cc.sys.garbageCollect();
    }
});

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"ShopItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0332dr8AGZOoahYR3nJs/re', 'ShopItem');
// Script/plaza/views/plaza/ShopItem.js

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
    onClick: function onClick(params) {
        console.log("[ShopItem][onClick] shopID = " + this._shopID);
        cc.director.emit('onInCharge', { goodsID: this._goodsID });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"ShopView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9f64TYV25HYKL062f4Ojzg', 'ShopView');
// Script/plaza/views/plaza/ShopView.js

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
        this.shopItemList.content.removeAllChildren();
        for (var index = 0; index < this.shopItemCount; index++) {
            var item = cc.instantiate(this.shopItemPrefab);
            var shopID;
            if (GlobalUserData.isOpenIAP) {
                shopID = index;
            } else {
                shopID = index + 6;
            }
            item.getComponent("ShopItem").init({ shopID: index });
            this.shopItemList.content.addChild(item);
        }
    },
    onEnable: function onEnable() {
        cc.director.on('onInCharge', this.onInCharge, this);
        console.log("[ShopView][onEnable]");
    },
    onDisable: function onDisable() {
        cc.director.off('onInCharge', this.onInCharge, this);
        console.log("[ShopView][onDisable]");
    },
    onInCharge: function onInCharge(params) {
        console.log("[ShopView][onInCharge]");
        var goodsID = params.detail.goodsID;
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
            params["user_ip"] = "127.0.0.1"; //todo
            params["user_identity"] = "usertoken"; //todo
            params["productid"] = itemVal.id;
            params["os"] = "1";
            params["versionnum"] = "1.1";
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
            params["user_ip"] = "127.0.0.1"; //todo
            params["user_identity"] = "usertoken"; //todo
            params["pay_type"] = "8";
            params["productid"] = itemVal.id;
            params["os"] = "2";
            params["versionnum"] = "1.1";
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
                                GlobalFun.showAlert(value.msg);
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
        this.node.destroy();
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[ShopView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        this.node.destroy();
        console.log("[ShopView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"ToastView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96256eD5t9ERKAMm0bGe6YP', 'ToastView');
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
        m_Label_content: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[ToastView][onDestroy]");
    },
    onClickConfirmButton: function onClickConfirmButton() {
        if (typeof this._confirmfunc === "function") {
            this._confirmfunc();
        }
        this.node.destroy();
        console.log("[ToastView][onClickConfirmButton] destroy");
    },
    onInit: function onInit(params) {
        var szText = params.message;
        this._confirmfunc = params.confirmfunc;
        this.m_Label_content.string = szText;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"UserFaceItem":[function(require,module,exports){
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
    onClick: function onClick(params) {
        console.log("[UserFaceItem][onClick] faceID = " + this._faceID);
        cc.director.emit('onChangeUserFace', { faceID: this._faceID + 1 });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"UserFaceView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3a2b4GP6WJOxJfMBnJgNHQU', 'UserFaceView');
// Script/plaza/views/plaza/UserFaceView.js

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
        userFaceItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        userFaceList: {
            default: null,
            type: cc.ScrollView
        },
        userFaceCount: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        for (var index = 0; index < this.userFaceCount; index++) {
            var item = cc.instantiate(this.userFaceItemPrefab);
            item.getComponent("UserFaceItem").init({ faceID: index });
            this.userFaceList.content.addChild(item);
        }
    },
    onEnable: function onEnable() {
        cc.director.on('onChangeUserFace', this.onChangeUserFace, this);
        console.log("[UserFaceView][onEnable]");
    },
    onDisable: function onDisable() {
        cc.director.off('onChangeUserFace', this.onChangeUserFace, this);
        console.log("[UserFaceView][onDisable]");
    },
    onChangeUserFace: function onChangeUserFace(params) {
        // GlobalUserData.wFaceID = params.detail.faceID;
        this._faceID = params.detail.faceID;
        this.onClickCloseButton();
        console.log("[UserFaceView][onChangeUserFace] faceID = " + JSON.stringify(params.detail));
        cc.director.emit("onChangeUserFace", params.detail);
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[UserFaceView][onDestroy]");
    },
    onClickCloseButton: function onClickCloseButton() {
        var FaceID = this._faceID;
        cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            newNode.getComponent("UserProfileView")._faceID = FaceID;
            cc.director.getScene().getChildByName("Canvas").addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode, function () {
                console.log("[UserFaceView][onClickUserProfile]ActionShowTanChuang callback");
            });
        });
        this.node.destroy();
        console.log("[UserFaceView][onClickCloseButton] destroy");
    }
});

cc._RFpop();
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"UserInfaceItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c4c4ho+FdH6L1IdAB9cthx', 'UserInfaceItem');
// Script/game/UserInfaceItem.js

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
        chipFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        winFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        loseFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        lookFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        peopleAtals: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var animation = this.node.getComponent(cc.Animation);
        for (var index = 0; index < 16; index++) {
            this.chipFrames[index] = this.peopleAtals.getSpriteFrame("people_chip_" + GlobalFun.PrefixInteger(index + 1, 2));
        }
        for (var index = 0; index < 18; index++) {
            this.winFrames[index] = this.peopleAtals.getSpriteFrame("people_win_" + GlobalFun.PrefixInteger(index + 1, 2));
        }
        for (var index = 0; index < 32; index++) {
            this.loseFrames[index] = this.peopleAtals.getSpriteFrame("people_lose_" + GlobalFun.PrefixInteger(index + 1, 2));
        }
        for (var index = 0; index < 20; index++) {
            this.lookFrames[index] = this.peopleAtals.getSpriteFrame("people_look_" + GlobalFun.PrefixInteger(index + 1, 2));
        }
        var chip_clip = cc.AnimationClip.createWithSpriteFrames(this.chipFrames, this.chipFrames.length);
        chip_clip.name = "chip";
        chip_clip.events.push({
            frame: 1, // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim", // 回调函数名称
            params: ["win"] // 回调参数
        });
        chip_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(chip_clip);
        // animation.play('chip');

        var win_clip = cc.AnimationClip.createWithSpriteFrames(this.winFrames, this.winFrames.length);
        win_clip.name = "win";
        win_clip.events.push({
            frame: 1, // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim", // 回调函数名称
            params: ["lose"] // 回调参数
        });
        win_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(win_clip);

        var lose_clip = cc.AnimationClip.createWithSpriteFrames(this.loseFrames, this.loseFrames.length);
        lose_clip.name = "lose";
        lose_clip.events.push({
            frame: 1, // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim", // 回调函数名称
            params: ["look"] // 回调参数
        });
        lose_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(lose_clip);

        var look_clip = cc.AnimationClip.createWithSpriteFrames(this.lookFrames, this.lookFrames.length);
        look_clip.name = "look";
        look_clip.events.push({
            frame: this.lookFrames.length / 60, // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim", // 回调函数名称
            params: ["chip"] // 回调参数
        });
        look_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(look_clip);

        animation.play("look");
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
        },
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
        },
        m_Panel_userChange: cc.Node,
        m_Panel_userInfo: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.refreshUI();
    },
    refreshUI: function refreshUI() {
        var szNickName = GlobalUserData.szNickName;
        var llGameScore = GlobalUserData.llGameScore;
        var dwUserID = GlobalUserData.dwUserID;
        var cbGender = GlobalUserData.cbGender || 1;
        var isGuest = GlobalUserData.isGuest;
        this.m_Label_userGold.string = llGameScore;
        this.m_Label_userID.string = dwUserID;
        this.m_Label_userName.string = szNickName;
        if (isGuest) {
            this.m_Button_binding.node.active = true;
            this.m_Button_changepwd.node.active = false;
        } else {
            this.m_Button_binding.node.active = false;
            this.m_Button_changepwd.node.active = true;
        }
        if (this._faceID !== undefined) {
            this.onChangeUserFace();
            cbGender = Math.floor((this._faceID - 1) / 4) + 1;
        }
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
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[UserProfileView][onEnable]");
    },
    onDisable: function onDisable() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[UserProfileView][onDisable]");
    },
    onDestroy: function onDestroy() {
        cc.sys.garbageCollect();
        console.log("[UserProfileView][onDestroy]");
    },
    onChangeUserFace: function onChangeUserFace() {
        var faceID = this._faceID;
        // if (faceID <=0 || faceID > 8) {
        //     faceID = 1;
        // }
        // console.log("[UserProfileView][onChangeUserFace] faceID = "+ faceID);
        // this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));
        var url = GlobalDef.httpBaseUrl;
        url += "/hz/hzUpdateFaceId.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["faceId"] = faceID;
        var paramString = GlobalFun.buildRequestParam(params);
        // "datetamp=1497411512&faceId=2&userid=27142649&sign=909c47b530c68c8e97ebe407c212c7de"
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("[UserProfileView][onChangeUserFace] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                console.log(response);
                cc.director.emit("onChangeUserFaceSuccess");
                var value = JSON.parse(response);
                if (value.msg !== undefined) {
                    GlobalFun.showAlert(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserProfileView][onChangeUserFace] " + paramString);
    },
    onClickCloseButton: function onClickCloseButton() {
        this.node.destroy();
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
                    GlobalFun.showAlert(value.msg);
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
        this.m_Panel_userInfo.active = false;
        this.m_Panel_userChange.active = true;
        GlobalFun.ActionShowTanChuang(this.m_Panel_userChange, function () {
            console.log("[PlazaView][onClickChangePassword]ActionShowTanChuang callback");
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
    },
    onClickConfirmButton: function onClickConfirmButton() {
        var szPassword = this.m_Editbox_originPassword.string;
        var szNewPassword = this.m_Editbox_newPassword.string;
        var szConfirmPassword = this.m_Editbox_confirmPassword.string;
        if (szPassword.length <= 0 || szNewPassword.length <= 0 || szConfirmPassword.length <= 0) {
            console.log("[PlazaView][onClickConfirmButton] 密码不能为空!");
            GlobalFun.showAlert("密码不能为空!");
            return;
        }
        if (szPassword == szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 新旧密码不能相同!");
            GlobalFun.showAlert("新旧密码不能相同!");
            return;
        }
        if (szConfirmPassword != szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 确认密码不一致!");
            GlobalFun.showAlert("确认密码不一致!");
            return;
        }
        if (szNewPassword.length < 6 || szNewPassword.length > 16) {
            console.log("[PlazaView][onClickConfirmButton] 密码长度为6-16位!");
            GlobalFun.showAlert("密码长度为6-16位!");
            return;
        }
        var url = GlobalDef.httpBaseUrl;
        url += "/hz/hzUpdatePassWord.ashx";
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
            console.log("[UserProfileView][onClickConfirmButton] " + xhr.getResponseHeader("Content-Type"));
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
                    self.m_Panel_userInfo.active = true;
                    self.m_Panel_userChange.active = false;
                    GlobalFun.ActionShowTanChuang(self.m_Panel_userInfo, function () {
                        console.log("[PlazaView][onClickConfirmButton]ActionShowTanChuang callback");
                    });
                    cc.director.emit("onChangePasswordSuccess");
                }
                if (value.msg !== undefined) {
                    GlobalFun.showAlert(value.msg);
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserProfileView][onClickConfirmButton] " + paramString);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"WelcomeView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a0e2y7VopBJYbq+UQRna/j', 'WelcomeView');
// Script/WelcomeView.js

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
                cc.sys.garbageCollect();
            } else {
                var op = 255 * (1.0 - Math.sin(this._count / 1.0 * 0.5 * Math.PI));
                this.splash.opacity = op;
            }
        }
    }
});

cc._RFpop();
},{}],"labelCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a6527xMI35HwY9ELBXxJ3eR', 'labelCell');
// userCell/labelCell.js

'use strict';

cc.Class({
    extends: require('viewCell'),

    properties: {
        index: cc.Label,
        group: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(index, data, reload, group) {
        if (index >= data.array.length) {
            this.index.string = '越界';
            this.group.string = group.toString();
            return;
        }
        this._target = data.target;
        this._data = data.array[index];
        this.index.string = index;
        this.group.string = group.toString();
    },
    clicked: function clicked() {
        this._target.show('下标:' + this.index.string + ',组:' + this.group.string);
    }
});

cc._RFpop();
},{"viewCell":"viewCell"}],"tableview":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd7b0d7G9NFOHqFDEfigaFIC', 'tableview');
// tableView/tableview.js

"use strict";

var ScrollModel = cc.Enum({ Horizontal: 0, Vertical: 1 });
var ScrollDirection = cc.Enum({ None: 0, Up: 1, Down: 2, Left: 3, Rigth: 4 });
var Direction = cc.Enum({ LEFT_TO_RIGHT__TOP_TO_BOTTOM: 0, TOP_TO_BOTTOM__LEFT_TO_RIGHT: 1 });
var ViewType = cc.Enum({ Scroll: 0, Flip: 1 });

var _searchMaskParent = function _searchMaskParent(node) {
    if (cc.Mask) {
        var index = 0;
        var mask = null;
        for (var curr = node; curr && curr instanceof cc.Node; curr = curr.parent, ++index) {
            mask = curr.getComponent(cc.Mask);
            if (mask) {
                return {
                    index: index,
                    node: curr
                };
            }
        }
    }

    return null;
};

//返回一个有序数组(对象,排序字段,[0-正序,1-倒序])
var orderBy = function orderBy(o, key, desc) {
    var a = [];
    for (var k in o) {
        for (var i = 0; i < a.length; i++) {
            if (desc) {
                if (o[k][key] > a[i][key]) {
                    a.splice(i, 0, o[k]);
                    break;
                }
            } else {
                if (o[k][key] < a[i][key]) {
                    a.splice(i, 0, o[k]);
                    break;
                }
            }
        }
        if (a.length === i) {
            a.push(o[k]);
        }
    }
    return a;
};

var tableView = cc.Class({
    extends: cc.ScrollView,
    editor: CC_EDITOR && {
        menu: "添加 UI 组件/tableView(自定义)",
        help: "https://github.com/a1076559139/creator_tableView",
        inspector: 'packages://tableView/inspector.js'
    },
    properties: {
        _data: null,
        _minCellIndex: 0, //cell的最小下标
        _maxCellIndex: 0, //cell的最大下标
        _paramCount: 0,
        _count: 0, //一共有多少节点
        _cellCount: 0, //scroll下有多少节点
        _showCellCount: 0, //scroll一个屏幕能显示多少节点
        //GRID模式下，对cell进行分组管理
        _groupCellCount: null, //每组有几个节点

        _scrollDirection: ScrollDirection.None,

        _cellPool: null,
        _view: null,

        _page: 0, //当前处于那一页
        _pageTotal: 0, //总共有多少页

        _touchLayer: cc.Node,

        _loadSuccess: false,
        _initSuccess: false, //是否初始化成功
        _scheduleInit: false,

        cell: {
            default: null,
            type: cc.Prefab,
            notify: function notify(oldValue) {}
        },

        ScrollModel: {
            default: 0,
            type: ScrollModel,
            notify: function notify(oldValue) {
                if (this.ScrollModel === ScrollModel.Horizontal) {
                    this.horizontal = true;
                    this.vertical = false;
                    this.verticalScrollBar = null;
                } else {
                    this.vertical = true;
                    this.horizontal = false;
                    this.horizontalScrollBar = null;
                }
            },
            tooltip: '横向纵向滑动'
        },
        ViewType: {
            default: 0,
            type: ViewType,
            notify: function notify(oldValue) {
                if (this.ViewType === ViewType.Flip) {
                    this.inertia = false;
                } else {
                    this.inertia = true;
                }
            },
            tooltip: '为Scroll时,不做解释\n为Flipw时，在Scroll的基础上增加翻页的行为'
        },
        isFill: {
            default: false,
            tooltip: '当节点不能铺满一页时，选择isFill为true会填充节点铺满整个view'
        },
        Direction: {
            default: 0,
            type: Direction,
            tooltip: '规定cell的排列方向'
        },
        pageChangeEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: '仅当ViewType为pageView时有效，初始化或翻页时触发回调，向回调传入两个参数，参数一为当前处于哪一页，参数二为一共多少页'
        }
    },
    statics: {
        _cellPoolCache: {}
    },
    onLoad: function onLoad() {
        window.s = this;
        var self = this;
        tableView._tableView.push(this);

        //当销毁tableView的时候，回收cell
        var destroy = this.node.destroy;
        this.node.destroy = function () {
            self.clear();
            destroy.call(self.node);
        };

        var _onPreDestroy = this.node._onPreDestroy;
        this.node._onPreDestroy = function () {
            self.clear();
            _onPreDestroy.call(self.node);
        };
    },
    onDestroy: function onDestroy() {
        cc.eventManager.removeListener(this._touchListener);
        if (CC_JSB) {
            this._touchListener.release();
        }
        for (var key in tableView._tableView) {
            if (tableView._tableView[key] === this) {
                tableView._tableView.splice(key);
                return;
            }
        }
    },
    _addListenerToTouchLayer: function _addListenerToTouchLayer() {
        this._touchLayer = new cc.Node();
        var widget = this._touchLayer.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        widget.isAlignOnce = false;
        this._touchLayer.parent = this._view;

        var self = this;
        // 添加单点触摸事件监听器
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            ower: this._touchLayer,
            mask: _searchMaskParent(this._touchLayer),
            onTouchBegan: function onTouchBegan(touch, event) {
                var pos = touch.getLocation();
                var node = this.ower;

                if (node._hitTest(pos, this)) {
                    self._touchstart(touch);
                    return true;
                }
                return false;
            },
            onTouchMoved: function onTouchMoved(touch, event) {
                self._touchmove(touch);
            },
            onTouchEnded: function onTouchEnded(touch, event) {
                self._touchend(touch);
            }
        });
        if (CC_JSB) {
            this._touchListener.retain();
        }
        cc.eventManager.addListener(this._touchListener, this._touchLayer);
    },
    _setStopPropagation: function _setStopPropagation() {
        this.node.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchmove', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchend', function (event) {
            event.stopPropagation();
        });
        this.node.on('touchcancel', function (event) {
            event.stopPropagation();
        });
    },
    //初始化cell
    _initCell: function _initCell(cell, reload) {
        if (this.ScrollModel === ScrollModel.Horizontal && this.Direction === Direction.TOP_TO_BOTTOM__LEFT_TO_RIGHT || this.ScrollModel === ScrollModel.Vertical && this.Direction === Direction.LEFT_TO_RIGHT__TOP_TO_BOTTOM) {
            var tag = cell.tag * cell.childrenCount;
            for (var index = 0; index < cell.childrenCount; ++index) {
                var node = cell.children[index];
                var viewCell = node.getComponent('viewCell');
                if (viewCell) {
                    viewCell._cellInit_(this);
                    // viewCell.init(tag + index, this._data, cell.tag);
                    viewCell.init(tag + index, this._data, reload, [cell.tag, index]);
                }
            }
        } else {
            if (this.ViewType === ViewType.Flip) {
                var tag = Math.floor(cell.tag / this._showCellCount);
                var tagnum = tag * this._showCellCount * cell.childrenCount;
                for (var index = 0; index < cell.childrenCount; ++index) {
                    var node = cell.children[index];
                    var viewCell = node.getComponent('viewCell');
                    if (viewCell) {
                        viewCell._cellInit_(this);
                        // viewCell.init(this._showCellCount * index + cell.tag % this._showCellCount + tagnum, this._data, index + tag * cell.childrenCount);
                        viewCell.init(this._showCellCount * index + cell.tag % this._showCellCount + tagnum, this._data, reload, [index + tag * cell.childrenCount, index]);
                    }
                }
            } else {
                for (var index = 0; index < cell.childrenCount; ++index) {
                    var node = cell.children[index];
                    var viewCell = node.getComponent('viewCell');
                    if (viewCell) {
                        viewCell._cellInit_(this);
                        // viewCell.init(index * this._count + cell.tag, this._data, index);
                        viewCell.init(index * this._count + cell.tag, this._data, reload, [index, index]);
                    }
                }
            }
        }
    },
    //设置cell的位置
    _setCellPosition: function _setCellPosition(node, index) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (index === 0) {
                node.x = -this.content.width * this.content.anchorX + node.width * node.anchorX;
            } else {
                node.x = this.content.getChildByTag(index - 1).x + node.width;
            }
            node.y = (node.anchorY - this.content.anchorY) * node.height;
        } else {
            if (index === 0) {
                node.y = this.content.height * (1 - this.content.anchorY) - node.height * (1 - node.anchorY);
            } else {
                node.y = this.content.getChildByTag(index - 1).y - node.height;
            }
            node.x = (node.anchorX - this.content.anchorX) * node.width;
        }
    },
    _addCell: function _addCell(index) {
        var cell = this._getCell();
        this._setCellAttr(cell, index);
        this._setCellPosition(cell, index);
        cell.parent = this.content;
        this._initCell(cell);
    },
    _setCellAttr: function _setCellAttr(cell, index) {
        cell.tag = index;
        cell.zIndex = index;
    },
    _addCellsToView: function _addCellsToView() {
        for (var index = 0; index <= this._maxCellIndex; ++index) {
            this._addCell(index);
        }
    },
    _getCell: function _getCell() {
        if (this._cellPool.size() === 0) {
            var cell = cc.instantiate(this.cell);

            var node = new cc.Node();
            node.anchorX = 0.5;
            node.anchorY = 0.5;

            var length = 0;
            if (this.ScrollModel === ScrollModel.Horizontal) {
                node.width = cell.width;
                var childrenCount = Math.floor(this.content.height / cell.height);
                node.height = this.content.height;

                for (var index = 0; index < childrenCount; ++index) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.x = (cell.anchorX - 0.5) * cell.width;
                    cell.y = node.height / 2 - cell.height * (1 - cell.anchorY) - length;
                    length += cell.height;
                    cell.parent = node;
                    cell = null;
                }
            } else {
                node.height = cell.height;
                var childrenCount = Math.floor(this.content.width / cell.width);
                node.width = this.content.width;

                for (var index = 0; index < childrenCount; ++index) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.y = (cell.anchorY - 0.5) * cell.height;
                    cell.x = -node.width / 2 + cell.width * cell.anchorX + length;
                    length += cell.width;
                    cell.parent = node;
                    cell = null;
                }
            }
            this._cellPool.put(node);
        }
        var cell = this._cellPool.get();
        return cell;
    },
    _getCellSize: function _getCellSize() {
        var cell = this._getCell();
        var cellSize = cell.getContentSize();
        this._cellPool.put(cell);
        return cellSize;
    },
    _getGroupCellCount: function _getGroupCellCount() {
        var cell = this._getCell();
        var groupCellCount = cell.childrenCount;
        this._cellPool.put(cell);
        return groupCellCount;
    },
    clear: function clear() {
        for (var index = this.content.childrenCount - 1; index >= 0; --index) {
            this._cellPool.put(this.content.children[index]);
        }
        this._cellCount = 0;
        this._showCellCount = 0;
    },
    reload: function reload(data) {
        if (data !== undefined) {
            this._data = data;
        }
        for (var index = this.content.childrenCount - 1; index >= 0; --index) {
            this._initCell(this.content.children[index], true);
        }
    },
    _getCellPoolCacheName: function _getCellPoolCacheName() {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            return this.cell.name + 'h' + this.content.height;
        } else {
            return this.cell.name + 'w' + this.content.width;
        }
    },
    _initTableView: function _initTableView() {
        this._scheduleInit = false;

        if (this._cellPool) {
            this.clear();
        }

        var name = this._getCellPoolCacheName();
        if (!tableView._cellPoolCache[name]) {
            tableView._cellPoolCache[name] = new cc.NodePool('viewCell');
        }
        this._cellPool = tableView._cellPoolCache[name];

        this._cellSize = this._getCellSize();
        this._groupCellCount = this._getGroupCellCount();

        this._count = Math.ceil(this._paramCount / this._groupCellCount);

        if (this.ScrollModel === ScrollModel.Horizontal) {
            this._view.width = this.node.width;
            this._view.x = (this._view.anchorX - this.node.anchorX) * this._view.width;

            this._cellCount = Math.ceil(this._view.width / this._cellSize.width) + 1;
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._view.width / this._cellSize.width);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                    this._showCellCount = this._cellCount - 1;
                }
            } else {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._view.width / this._cellSize.width);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                } else {
                    this._showCellCount = this._cellCount - 1;
                }
            }

            this.content.width = this._count * this._cellSize.width;
            // if (this.content.width <= this._view.width) {
            //     this.content.width = this._view.width + 1;
            // }

            //停止_scrollView滚动
            this.stopAutoScroll();
            this.scrollToLeft();
        } else {
            this._view.height = this.node.height;
            this._view.y = (this._view.anchorY - this.node.anchorY) * this._view.height;

            this._cellCount = Math.ceil(this._view.height / this._cellSize.height) + 1;
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._view.height / this._cellSize.height);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                    this._showCellCount = this._cellCount - 1;
                }
            } else {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._view.height / this._cellSize.height);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                } else {
                    this._showCellCount = this._cellCount - 1;
                }
            }

            this.content.height = this._count * this._cellSize.height;
            // if (this.content.height <= this._view.height) {
            //     this.content.height = this._view.height + 1;
            // }

            //停止_scrollView滚动
            this.stopAutoScroll();
            this.scrollToTop();
        }

        this._changePageNum(1 - this._page);

        this._lastOffset = this.getScrollOffset();
        this._minCellIndex = 0;
        this._maxCellIndex = this._cellCount - 1;

        this._addCellsToView();

        this._initSuccess = true;
    },
    //count:cell的总个数  data:要向cell传递的数据
    initTableView: function initTableView(paramCount, data) {
        this._paramCount = paramCount;
        this._data = data;

        if (!this._loadSuccess) {
            if (this.ScrollModel === ScrollModel.Horizontal) {
                this.horizontal = true;
                this.vertical = false;
            } else {
                this.vertical = true;
                this.horizontal = false;
            }
            this._view = this.content.parent;
            //为scrollBar添加size改变的监听
            this.verticalScrollBar && this.verticalScrollBar.node.on('size-changed', function () {
                this._updateScrollBar(this._getHowMuchOutOfBoundary());
            }, this);
            this.horizontalScrollBar && this.horizontalScrollBar.node.on('size-changed', function () {
                this._updateScrollBar(this._getHowMuchOutOfBoundary());
            }, this);
            //给触摸层添加时间
            this._addListenerToTouchLayer();
            //禁止tableView点击事件向父级传递
            this._setStopPropagation();
            //存在Widget则在下一帧进行初始化
            if (this.node.getComponent(cc.Widget) || this._view.getComponent(cc.Widget) || this.content.getComponent(cc.Widget)) {
                this.scheduleOnce(this._initTableView);
                this._scheduleInit = true;
            } else {
                this._initTableView();
            }
            this._loadSuccess = true;
        } else {
            if (!this._scheduleInit) {
                this._initTableView();
            }
        }
    },
    //*************************************************重写ScrollView方法*************************************************//
    stopAutoScroll: function stopAutoScroll() {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.stopAutoScroll();
            });
            return;
        }
        this._scrollDirection = ScrollDirection.None;
        this._super();
    },
    scrollToBottom: function scrollToBottom(timeInSecond, attenuated) {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.scrollToBottom(timeInSecond, attenuated);
            });
            return;
        }
        this._scrollDirection = ScrollDirection.Up;
        this._super(timeInSecond, attenuated);
    },
    scrollToTop: function scrollToTop(timeInSecond, attenuated) {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.scrollToTop(timeInSecond, attenuated);
            });
            return;
        }
        this._scrollDirection = ScrollDirection.Down;
        this._super(timeInSecond, attenuated);
    },
    scrollToLeft: function scrollToLeft(timeInSecond, attenuated) {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.scrollToLeft(timeInSecond, attenuated);
            });
            return;
        }
        this._scrollDirection = ScrollDirection.Rigth;
        this._super(timeInSecond, attenuated);
    },
    scrollToRight: function scrollToRight(timeInSecond, attenuated) {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.scrollToRight(timeInSecond, attenuated);
            });
            return;
        }
        this._scrollDirection = ScrollDirection.Left;
        this._super(timeInSecond, attenuated);
    },
    scrollToOffset: function scrollToOffset(offset, timeInSecond, attenuated) {
        if (this._scheduleInit) {
            this.scheduleOnce(function () {
                this.scrollToOffset(offset, timeInSecond, attenuated);
            });
            return;
        }
        var nowoffset = this.getScrollOffset();
        var p = cc.pSub(offset, nowoffset);
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (p.x > 0) {
                this._scrollDirection = ScrollDirection.Left;
            } else if (p.x < 0) {
                this._scrollDirection = ScrollDirection.Rigth;
            }
        } else {
            if (p.y > 0) {
                this._scrollDirection = ScrollDirection.Up;
            } else if (p.y < 0) {
                this._scrollDirection = ScrollDirection.Down;
            }
        }

        this._super(offset, timeInSecond, attenuated);
    },
    //*******************************************************END*********************************************************//

    addScrollEvent: function addScrollEvent(target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        this.scrollEvents.push(eventHandler);
    },
    removeScrollEvent: function removeScrollEvent(target) {
        for (var key in this.scrollEvents) {
            var eventHandler = this.scrollEvents[key];
            if (eventHandler.target === target) {
                this.scrollEvents.splice(key, 1);
                return;
            }
        }
    },
    clearScrollEvent: function clearScrollEvent() {
        this.scrollEvents = [];
    },
    addPageEvent: function addPageEvent(target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        this.pageChangeEvents.push(eventHandler);
    },
    removePageEvent: function removePageEvent(target) {
        for (var key in this.pageChangeEvents) {
            var eventHandler = this.pageChangeEvents[key];
            if (eventHandler.target === target) {
                this.pageChangeEvents.splice(key, 1);
                return;
            }
        }
    },
    clearPageEvent: function clearPageEvent() {
        this.pageChangeEvents = [];
    },
    scrollToNextPage: function scrollToNextPage() {
        this.scrollToPage(this._page + 1);
    },
    scrollToLastPage: function scrollToLastPage() {
        this.scrollToPage(this._page - 1);
    },
    scrollToPage: function scrollToPage(page) {
        if (this.ViewType !== ViewType.Flip || page === this._page) {
            return;
        }

        if (page < 1 || page > this._pageTotal) {
            return;
        }

        var time = 0.3 * Math.abs(page - this._page);

        this._changePageNum(page - this._page);

        if (this._initSuccess) {
            var x = this._view.width;
            var y = this._view.height;
            x = (this._page - 1) * x;
            y = (this._page - 1) * y;
            this.scrollToOffset({ x: x, y: y }, time);
        } else {
            this.scheduleOnce(function () {
                var x = this._view.width;
                var y = this._view.height;
                x = (this._page - 1) * x;
                y = (this._page - 1) * y;
                this.scrollToOffset({ x: x, y: y }, time);
            });
        }
    },
    getCells: function getCells(callback) {
        var self = this;
        var f = function f() {
            var cells = [];
            var nodes = orderBy(self.content.children, 'tag');
            for (var key in nodes) {
                var node = nodes[key];
                for (var k in node.children) {
                    cells.push(node.children[k]);
                }
            }
            callback(cells);
        };

        if (this._initSuccess) {
            f();
        } else {
            this.scheduleOnce(f);
        }
    },
    getData: function getData() {
        return this._data;
    },
    getGroupsRange: function getGroupsRange(callback) {
        var self = this;
        var f = function f() {
            var arr = [];
            for (var i = self._minCellIndex; i <= self._maxCellIndex; i++) {
                arr.push(i);
            }
            callback(arr);
        };

        if (this._initSuccess) {
            f();
        } else {
            this.scheduleOnce(f);
        }
    },
    _changePageNum: function _changePageNum(num) {
        this._page += num;

        if (this._page <= 0) {
            this._page = 1;
        } else if (this._page > this._pageTotal) {
            this._page = this._pageTotal;
        }

        for (var key in this.pageChangeEvents) {
            var event = this.pageChangeEvents[key];
            event.emit([this._page, this._pageTotal]);
        }
    },
    _touchstart: function _touchstart(event) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = false;
        } else {
            this.vertical = false;
        }
    },
    _touchmove: function _touchmove(event) {
        if (this.horizontal === this.vertical) {
            var startL = event.getStartLocation();
            var l = event.getLocation();
            if (this.ScrollModel === ScrollModel.Horizontal) {
                if (Math.abs(l.x - startL.x) <= 7) {
                    return;
                }
            } else {
                if (Math.abs(l.y - startL.y) <= 7) {
                    return;
                }
            }

            if (this.ScrollModel === ScrollModel.Horizontal) {
                this.horizontal = true;
            } else {
                this.vertical = true;
            }
        }
    },
    _touchend: function _touchend(event) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = true;
        } else {
            this.vertical = true;
        }

        if (this.ViewType === ViewType.Flip && this._pageTotal > 1) {
            this._pageMove(event);
        }

        // this._ckickCell(event);
    },
    _ckickCell: function _ckickCell(event) {
        var srartp = event.getStartLocation();
        var p = event.getLocation();

        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (Math.abs(p.x - srartp.x) > 7) {
                return;
            }
        } else {
            if (Math.abs(p.y - srartp.y) > 7) {
                return;
            }
        }

        var convertp = this.content.convertToNodeSpaceAR(p);
        for (var key in this.content.children) {
            var node = this.content.children[key];
            var nodebox = node.getBoundingBox();
            if (nodebox.contains(convertp)) {
                convertp = node.convertToNodeSpaceAR(p);
                for (var k in node.children) {
                    var cell = node.children[k];
                    var cellbox = cell.getBoundingBox();
                    if (cellbox.contains(convertp)) {
                        if (cell.activeInHierarchy && cell.opacity !== 0) {
                            cell.clicked();
                        }
                        return;
                    }
                }
                return;
            }
        }
    },
    //移动距离小于25%则不翻页
    _pageMove: function _pageMove(event) {
        var x = this._view.width;
        var y = this._view.height;

        if (this.ViewType === ViewType.Flip) {
            var offset = this.getScrollOffset();
            var offsetMax = this.getMaxScrollOffset();

            if (this.ScrollModel === ScrollModel.Horizontal) {
                if (offset.x >= 0 || offset.x <= -offsetMax.x) {
                    return;
                }
                y = 0;
                if (Math.abs(event.getLocation().x - event.getStartLocation().x) > this._view.width / 4) {
                    if (this._scrollDirection === ScrollDirection.Left) {
                        if (this._page < this._pageTotal) {
                            this._changePageNum(1);
                        } else {
                            return;
                        }
                    } else if (this._scrollDirection === ScrollDirection.Rigth) {
                        if (this._page > 1) {
                            this._changePageNum(-1);
                        } else {
                            return;
                        }
                    }
                }
            } else {
                if (offset.y >= offsetMax.y || offset.y <= 0) {
                    return;
                }
                x = 0;
                if (Math.abs(event.getLocation().y - event.getStartLocation().y) > this._view.height / 4) {
                    if (this._scrollDirection === ScrollDirection.Up) {
                        if (this._page < this._pageTotal) {
                            this._changePageNum(1);
                        } else {
                            return;
                        }
                    } else if (this._scrollDirection === ScrollDirection.Down) {
                        if (this._page > 1) {
                            this._changePageNum(-1);
                        } else {
                            return;
                        }
                    }
                }
            }

            x = (this._page - 1) * x;
            y = (this._page - 1) * y;

            this.scrollToOffset({ x: x, y: y }, 0.3);
        }
    },
    _getBoundingBoxToWorld: function _getBoundingBoxToWorld(node) {
        var p = node.convertToWorldSpace(cc.p(0, 0));
        return cc.rect(p.x, p.y, node.width, node.height);
    },
    _updateCells: function _updateCells() {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (this._scrollDirection === ScrollDirection.Left) {
                if (this._maxCellIndex < this._count - 1) {
                    var viewBox = this._getBoundingBoxToWorld(this._view);
                    do {
                        var node = this.content.getChildByTag(this._minCellIndex);
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.xMax <= viewBox.xMin) {
                            node.x = this.content.getChildByTag(this._maxCellIndex).x + node.width;
                            this._minCellIndex++;
                            this._maxCellIndex++;
                            // this._setCellAttr(node, this._maxCellIndex);
                            // this._initCell(node);
                            node.tag = this._maxCellIndex;
                            if (nodeBox.xMax + (this._maxCellIndex - this._minCellIndex + 1) * node.width > viewBox.xMin) {
                                node.zIndex = this._maxCellIndex;
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._maxCellIndex !== this._count - 1);
                }
            } else if (this._scrollDirection === ScrollDirection.Rigth) {
                if (this._minCellIndex > 0) {
                    var viewBox = this._getBoundingBoxToWorld(this._view);
                    do {
                        var node = this.content.getChildByTag(this._maxCellIndex);
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.xMin >= viewBox.xMax) {
                            node.x = this.content.getChildByTag(this._minCellIndex).x - node.width;
                            this._minCellIndex--;
                            this._maxCellIndex--;
                            // this._setCellAttr(node, this._minCellIndex);
                            // this._initCell(node);
                            node.tag = this._minCellIndex;
                            if (nodeBox.xMin - (this._maxCellIndex - this._minCellIndex + 1) * node.width < viewBox.xMax) {
                                node.zIndex = this._minCellIndex;
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._minCellIndex !== 0);
                }
            }
        } else {
            if (this._scrollDirection === ScrollDirection.Up) {
                if (this._maxCellIndex < this._count - 1) {
                    var viewBox = this._getBoundingBoxToWorld(this._view);
                    do {
                        var node = this.content.getChildByTag(this._minCellIndex);
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.yMin >= viewBox.yMax) {
                            node.y = this.content.getChildByTag(this._maxCellIndex).y - node.height;
                            this._minCellIndex++;
                            this._maxCellIndex++;
                            // this._setCellAttr(node, this._maxCellIndex);
                            // this._initCell(node);
                            node.tag = this._maxCellIndex;
                            if (nodeBox.yMin - (this._maxCellIndex - this._minCellIndex + 1) * node.height < viewBox.yMax) {
                                node.zIndex = this._maxCellIndex;
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._maxCellIndex !== this._count - 1);
                }
            } else if (this._scrollDirection === ScrollDirection.Down) {
                if (this._minCellIndex > 0) {
                    var viewBox = this._getBoundingBoxToWorld(this._view);
                    do {
                        var node = this.content.getChildByTag(this._maxCellIndex);
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.yMax <= viewBox.yMin) {
                            node.y = this.content.getChildByTag(this._minCellIndex).y + node.height;
                            this._minCellIndex--;
                            this._maxCellIndex--;
                            // this._setCellAttr(node, this._minCellIndex);
                            // this._initCell(node);
                            node.tag = this._minCellIndex;
                            if (nodeBox.yMax + (this._maxCellIndex - this._minCellIndex + 1) * node.width > viewBox.yMin) {
                                node.zIndex = this._minCellIndex;
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._minCellIndex !== 0);
                }
            }
        }
    },
    _getScrollDirection: function _getScrollDirection() {
        var offset = this.getScrollOffset();
        // var offsetMax = this.getMaxScrollOffset();
        // if (this.ScrollModel === ScrollModel.Horizontal) {
        //     if (offset.x >= 0 || offset.x <= -offsetMax.x) {
        //         return;
        //     }
        // } else {
        //     if (offset.y >= offsetMax.y || offset.y <= 0) {
        //         return;
        //     }
        // }

        var lastOffset = this._lastOffset;
        this._lastOffset = offset;
        offset = cc.pSub(offset, lastOffset);

        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (offset.x > 0) {
                this._scrollDirection = ScrollDirection.Rigth;
            } else if (offset.x < 0) {
                this._scrollDirection = ScrollDirection.Left;
            } else {
                this._scrollDirection = ScrollDirection.None;
            }
        } else {
            if (offset.y < 0) {

                this._scrollDirection = ScrollDirection.Down;
            } else if (offset.y > 0) {
                this._scrollDirection = ScrollDirection.Up;
            } else {
                this._scrollDirection = ScrollDirection.None;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this._super(dt);

        if (!this._initSuccess || this._cellCount === this._showCellCount || this._pageTotal === 1) {
            return;
        }
        this._getScrollDirection();
        this._updateCells();
    }
});
tableView._tableView = [];
tableView.reload = function () {
    for (var key in tableView._tableView) {
        tableView._tableView[key].reload();
    }
};
tableView.clear = function () {
    for (var key in tableView._tableView) {
        tableView._tableView[key].clear();
    }
};

cc.tableView = module.export = tableView;

cc._RFpop();
},{}],"viewCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd1dfablitpJ5rXHxnkR6CpH', 'viewCell');
// tableView/viewCell.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        tableView: {
            default: null,
            visible: false
        },
        _isCellInit_: false,
        _longClicked_: false
    },

    //不可以重写
    _cellAddMethodToNode_: function _cellAddMethodToNode_() {
        this.node.clicked = this.clicked.bind(this);
    },
    _cellAddTouch_: function _cellAddTouch_() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (this.node.active === true && this.node.opacity !== 0) {
                if (!this._longClicked_) {
                    this._longClicked_ = true;
                    this.scheduleOnce(this._longClicked, 1.5);
                }
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.clicked();
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
    },
    _cellInit_: function _cellInit_(tableView) {
        this.tableView = tableView;
        if (!this._isCellInit_) {
            this._cellAddMethodToNode_();
            this._cellAddTouch_();
            this._isCellInit_ = true;
        }
    },
    _longClicked: function _longClicked() {
        this._longClicked_ = false;
        this.node.emit(cc.Node.EventType.TOUCH_CANCEL);
        this.longClicked();
    },
    //可以重写的方法

    //需要重写的方法
    longClicked: function longClicked() {},
    //被点击时相应的方法
    clicked: function clicked() {},

    //加载需要初始化数据时调用
    init: function init(index, data, reload, group) {}
});

cc._RFpop();
},{}]},{},["CoverView","AudioMng","Bridge_android","Bridge_ios","GameServerItem","GameUserItem","GlobalDef","GlobalUserData","HelloWorld","LoadingView","MD5","MultiPlatform","PlazaView","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","CardItem","ChipItem","GameLogic","GameScene","GameView","UserInfaceItem","GameModel","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","GameFrame","LogonFrame","LogonView","RegisterView","BankView","ChoosePayTypeView","GuestBindView","PlazaRoomItem","ServiceView","SettingView","ShopItem","ShopView","UserFaceItem","UserFaceView","UserProfileView","tableview","viewCell","labelCell"]);
