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
        console.log("[AlertView][onDestroy] message = " + message);
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
        toggle.node.setLocalZOrder(1);
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
                    element.node.setLocalZOrder(1);
                    panel.active = true;
                } else {
                    element.node.setLocalZOrder(0);
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
                GlobalFun.showAlert(cc.director.getScene(), "金额或密码不能为空!");
                return;
            }
            if (szGoldCount <= 0 || szGoldCount > GlobalUserData.llInsureScore) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出银行的金额限制！");
                GlobalFun.showAlert(cc.director.getScene(), "数值不合法或超出银行的金额限制!");
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
                GlobalFun.showAlert(cc.director.getScene(), "金额不能为空！");
                return;
            }
            if (szGoldCount <= 0 || szGoldCount > GlobalUserData.llGameScore) {
                //todo
                console.log("[BankView][onClickConfirm] 数值不合法或超出身上金额！");
                GlobalFun.showAlert(cc.director.getScene(), "数值不合法或超出身上金额！");
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
                GlobalFun.showAlert(cc.director.getScene(), "密码不能为空！");
                return;
            }
            if (szPassWord == szNewPassWord) {
                console.log("[BankView][onClickConfirm] 新旧密码不能相同!");
                GlobalFun.showAlert(cc.director.getScene(), "新旧密码不能相同!");
                return;
            }
            if (szConfirmPassWord != szNewPassWord) {
                console.log("[BankView][onClickConfirm] 确认密码不一致!");
                GlobalFun.showAlert(cc.director.getScene(), "确认密码不一致!");
                return;
            }
            if (szNewPassWord.length < 6 || szNewPassWord.length > 16) {
                console.log("[BankView][onClickConfirm] 密码长度为6-16位!");
                GlobalFun.showAlert(cc.director.getScene(), "密码长度为6-16位!");
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
                GlobalFun.showAlert(cc.director.getScene(), value.msg);
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

module.exports = zjh_cmd;

cc._RFpop();
},{}],"GameServerItem":[function(require,module,exports){
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
},{}],"GlobalDef":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd85baIYnERFsIqEdSH5SyZY', 'GlobalDef');
// Script/GlobalDef.js

"use strict";

var GlobalDef = {
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
    SOCKET_VER: 0x8C };
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
function showToast(context, message) {
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/ToastView", function (err, ToastPrefab) {
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(ToastPrefab);
            newNode.getComponent("ToastView").onInit({ message: message });
            context.addChild(newNode);
            ActionShowTanChuang(newNode.children[0]);
            console.log("showToast");
        }
    });
}

function showAlert(context, message) {
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

function getsign(params) {
    params = params + "key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x"; //加入key
    return cc.md5Encode(params).toLowerCase();
}

function buildRequestParam(params) {
    var nowTime = Math.floor(Date.now() / 1000);
    params["datetamp"] = nowTime;
    var sort_params = Object.keys(params).sort();
    console.log("[GlobalFun][buildRequestParam] " + JSON.stringify(params));
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
module.exports = {
    ActionShowTanChuang: ActionShowTanChuang,
    showToast: showToast,
    showAlert: showAlert,
    showPopWaiting: showPopWaiting,
    buildRequestParam: buildRequestParam
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
    init: function init() {
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.isOpenIAP = true;
        } else {
            this.isOpenIAP = false;
        }
        cc.loader.loadRes("json/shoppage", function (err, content) {
            console.log(content);
            GlobalUserData.shopData = content;
            console.log("[GlobalUserData][init] " + JSON.stringify(self.shopData));
        });
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
        for (var prop in this) {
            if (typeof this[prop] == "function") continue;
            console.log('this.' + prop, '=', this[prop]);
        }
    }
};

module.exports = GlobalUserData;

cc._RFpop();
},{}],"HelloWorld":[function(require,module,exports){
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
        this.onCreateSocket("122.226.186.38", 9009);
        this.label.string = this.text;
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
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","MD5":"MD5"}],"LogonFrame":[function(require,module,exports){
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
        } else if (sub === plaza_cmd.SUB_GP_LOGON_FINISH_MOBILE) {
            console.log("logonframe login finish");
            this.onCloseSocket();
            cc.director.loadScene("PlazaScene");
            cc.sys.garbageCollect();
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
                for (var prop in pGameServer) {
                    if (typeof pGameServer[prop] == "function") continue;
                    console.log('pGameServer.' + prop, '=', pGameServer[prop]);
                }
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
    onLogon: function onLogon(event) {
        console.log("[LogonScene][onLogon]");
        var szAccount = event.detail.szAccount;
        var szPassword = event.detail.szPassword;
        this._logonFrame.onLogonByAccount(szAccount, szPassword);
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "LogonSuccess",
            callBackFunc: function callBackFunc() {
                console.log("[LogonScene][onLogon] callbackfunc");
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
        var url = GlobalDef.httpUserCenter;
        url += "/Guest/GuestLogin.ashx";
        var params = {};
        params["kindid"] = zjh_cmd.KIND_ID;
        params["versionnum"] = "1.1";
        params["useridentity"] = "2d4d7c95e5df0179af2466f635ca71de";
        params["channelid"] = GlobalDef.CHANNELID_center;
        if (cc.sys.os == cc.sys.OS_IOS) {
            params["os"] = "2";
        } else {
            params["os"] = "1";
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
                    self._logonFrame.onLogonByVisitor(GlobalUserData.szAccounts, GlobalUserData.szPassWord);
                } else {
                    if (value.msg !== undefined) {
                        GlobalFun.showToast(cc.director.getScene(), value.msg);
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
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"LogonView":[function(require,module,exports){
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
},{}],"PlazaView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52d5546nrtCUJireJfeVAhU', 'PlazaView');
// Script/PlazaView.js

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
        m_Image_userFace: {
            default: null,
            type: cc.Sprite
        },
        m_Label_name: {
            default: null,
            type: cc.Label
        },
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
        console.log("Plaza onLoad");
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
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
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
        console.log("[PlazaView][onEnable]");
    },
    onDisable: function onDisable() {
        cc.director.off('onChangeUserFaceSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onChangeNameSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onBankSuccess', this.onBankSuccess, this);
        console.log("[PlazaView][onDisable]");
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
        GlobalFun.showToast(cc.director.getScene(), "客服功能暂未开放,敬请期待!");
    },
    onClickActivity: function onClickActivity(params) {
        console.log("[PlazaView][conClickActivity]");
        GlobalFun.showToast(cc.director.getScene(), "暂未开放,敬请期待!");
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"PopWaitView":[function(require,module,exports){
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
            GlobalFun.showAlert(cc.director.getScene(), "帐号密码等注册信息不能为空");
            return;
        }
        if (szPassword.length < 6 || szPassword.length > 16) {
            console.log("密码长度为6-16位");
            GlobalFun.showAlert(cc.director.getScene(), "密码长度为6-16位");
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
            GlobalFun.showAlert(cc.director.getScene(), "手机号码不合法");
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","MD5":"MD5"}],"SettingView":[function(require,module,exports){
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
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.m_Label_account.string = GlobalUserData.szAccounts;
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
    onClickSwitchAccount: function onClickSwitchAccount() {
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
        _shopID: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        var shopID = params.shopID;
        this._shopID = shopID;
        this.m_Image_shopItem.spriteFrame = this.shopItemAtals.getSpriteFrame("shop_icon_" + shopID);
    },
    onClick: function onClick(params) {
        console.log("[ShopItem][onClick] shopID = " + this._shopID);
        // cc.director.emit('onChangeUserFace',{faceID:this._faceID+1});
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"ShopView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9f64TYV25HYKL062f4Ojzg', 'ShopView');
// Script/plaza/views/plaza/ShopView.js

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
        console.log("[ShopView][onLoad] " + JSON.stringify(GlobalUserData.shopData));
    },
    onEnable: function onEnable() {
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        // console.log("[UserFaceView][onEnable]");
    },
    onDisable: function onDisable() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        // console.log("[UserFaceView][onDisable]");
    },
    onChangeUserFace: function onChangeUserFace(params) {
        // GlobalUserData.wFaceID = params.detail.faceID;
        // this._faceID = params.detail.faceID;
        // this.onClickCloseButton();
        // console.log("[UserFaceView][onChangeUserFace] faceID = "+ JSON.stringify(params.detail));
        // cc.director.emit("onChangeUserFace",params.detail);
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
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"ToastView":[function(require,module,exports){
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
        this.node.destroy();
        console.log("[ToastView][onClickConfirmButton] destroy");
    },
    onInit: function onInit(params) {
        var szText = params.message;
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
},{"GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"UserProfileView":[function(require,module,exports){
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
        m_Button_changeName: {
            default: null,
            type: cc.Button
        },
        m_Button_editName: {
            default: null,
            type: cc.Button
        },
        m_Editbox_userName: {
            default: null,
            type: cc.EditBox
        },
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
        this.m_Button_editName.node.active = false;
        this.refreshUI();
    },
    refreshUI: function refreshUI() {
        var szNickName = GlobalUserData.szNickName;
        var llGameScore = GlobalUserData.llGameScore;
        var dwUserID = GlobalUserData.dwUserID;
        var cbGender = GlobalUserData.cbGender || 1;
        this.m_Button_editName.node.active = true;
        this.m_Button_changeName.node.active = false;
        this.m_Label_userGold.string = llGameScore;
        this.m_Label_userID.string = "ID:" + dwUserID;
        this.m_Label_userName.string = szNickName;
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
                    GlobalFun.showAlert(cc.director.getScene(), value.msg);
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
        this.m_Button_editName.node.active = false;
        this.m_Button_changeName.node.active = true;
        this.m_Label_userName.node.active = false;
        this.m_Editbox_userName.node.active = true;
        this.m_Editbox_userName.setFocus(true);
        // this.m_Button_editName.node.emit(cc.EditBox.editing-did-began);
    },
    onClickChangeName: function onClickChangeName(params) {
        this.m_Button_editName.node.active = true;
        this.m_Button_changeName.node.active = false;
        this.m_Label_userName.node.active = true;
        this.m_Editbox_userName.node.active = false;
        var szNewNickName = this.m_Editbox_userName.string;
        this.m_Editbox_userName.string = "";
        if (szNewNickName.length <= 0 || szNewNickName == GlobalUserData.szNickName) {
            return;
        }
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
                    GlobalFun.showAlert(cc.director.getScene(), value.msg);
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
    },
    onClickConfirmButton: function onClickConfirmButton() {
        var szPassword = this.m_Editbox_originPassword.string;
        var szNewPassword = this.m_Editbox_newPassword.string;
        var szConfirmPassword = this.m_Editbox_confirmPassword.string;
        if (szPassword.length <= 0 || szNewPassword.length <= 0 || szConfirmPassword.length <= 0) {
            console.log("[PlazaView][onClickConfirmButton] 密码不能为空!");
            GlobalFun.showAlert(cc.director.getScene(), "密码不能为空!");
            return;
        }
        if (szPassword == szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 新旧密码不能相同!");
            GlobalFun.showAlert(cc.director.getScene(), "新旧密码不能相同!");
            return;
        }
        if (szConfirmPassword != szNewPassword) {
            console.log("[PlazaView][onClickConfirmButton] 确认密码不一致!");
            GlobalFun.showAlert(cc.director.getScene(), "确认密码不一致!");
            return;
        }
        if (szNewPassword.length < 6 || szNewPassword.length > 16) {
            console.log("[PlazaView][onClickConfirmButton] 密码长度为6-16位!");
            GlobalFun.showAlert(cc.director.getScene(), "密码长度为6-16位!");
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
                    this.m_Panel_userInfo.active = true;
                    this.m_Panel_userChange.active = false;
                    cc.director.emit("onChangePasswordSuccess");
                }
                if (value.msg !== undefined) {
                    GlobalFun.showAlert(cc.director.getScene(), value.msg);
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
},{}]},{},["GameServerItem","GlobalDef","GlobalUserData","HelloWorld","MD5","PlazaView","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","LogonFrame","LogonView","RegisterView","BankView","SettingView","ShopItem","ShopView","UserFaceItem","UserFaceView","UserProfileView"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lU2VydmVySXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvR2xvYmFsRGVmLmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9HbG9iYWxGdW4uanMiLCJhc3NldHMvU2NyaXB0L0dsb2JhbFVzZXJEYXRhLmpzIiwiYXNzZXRzL1NjcmlwdC9IZWxsb1dvcmxkLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS9tb2RlbHMvTG9nb25GcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvTG9nb25TY2VuZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvbG9nb24vTG9nb25WaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9NRDUuanMiLCJhc3NldHMvU2NyaXB0L1BsYXphVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvUG9wV2FpdFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL2xvZ29uL1JlZ2lzdGVyVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2V0dGluZ1ZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1Nob3BJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TaG9wVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvVG9hc3RWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyRmFjZUl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJGYWNlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlclByb2ZpbGVWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9XZWxjb21lVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYUTs7QUFjWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBdkNJOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRnNCO0FBSTFCO0FBQ0k7QUFDQTtBQUZ1QjtBQUkzQjtBQUNJO0FBQ0E7QUFGbUI7QUFJdkI7QUF0Q1E7O0FBeUNaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBWE47QUFhQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUEzTkk7Ozs7Ozs7Ozs7QUNMVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDRTtBQUNEO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUVJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNEO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBQ0Q7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUF2Sm9COztBQTJKekI7Ozs7Ozs7Ozs7QUMzSkE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7OztBQy9hQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ25mQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7QUN4TEE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBakJSO0FBbUJIO0FBQ0o7QUFwRXlCOztBQXVFOUI7Ozs7Ozs7Ozs7QUN2RUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVKO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0o7QUFDSTtBQUVKOzs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUdZO0FBQ0k7QUFDSDtBQUNKO0FBRVo7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMYTs7Ozs7Ozs7OztBQzFGakI7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQWxGZ0I7O0FBcUZyQjs7Ozs7Ozs7OztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFOUTtBQVFaO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQTFGSTs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0U7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0o7QUFDSTtBQWhDUjtBQWtDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFFSDtBQXJOSTs7Ozs7Ozs7OztBQ1JUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRk87QUFJWDtBQUNJO0FBQ0E7QUFGVTtBQWZOOztBQXFCWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTW5EO0FBQ0Q7QUFDRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNEO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0s7QUFDSjtBQUVJO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBeklJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGUTtBQW5CSjs7QUF5Qlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSDtBQTlFSTs7Ozs7Ozs7OztBQ0RUO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOztBQUdEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQVJMO0FBVUg7O0FBS0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDSDs7QUFHRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7Ozs7Ozs7OztBQ2xSRDtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBdkNQOztBQTZDWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQTNMSTs7Ozs7Ozs7OztBQ0hUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZhO0FBZlQ7O0FBcUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUE5REk7Ozs7Ozs7Ozs7QUNBUjtBQUNBO0FBQ0E7QUFDQTtBQUNHOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZVO0FBdkJOOztBQTZCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSjBCO0FBTWpDO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUF0SUs7Ozs7Ozs7Ozs7QUNIVjtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFwQ0k7Ozs7Ozs7Ozs7QUNEVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBbkJROztBQXNCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQXpDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGWTtBQUloQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBbkJROztBQXNCWjtBQUNBOztBQUVJO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQWhFSTs7Ozs7Ozs7OztBQ0ZUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFQTtBQXpDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBSWY7O0FBbkJROztBQXVCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQTFDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQW5CUTs7QUFzQlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0g7QUFqRUk7Ozs7Ozs7Ozs7QUNGVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZpQjtBQUlyQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlk7QUFJaEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGc0I7QUFJMUI7QUFDSTtBQUNBO0FBRnVCO0FBSTNCO0FBQ0k7QUFDQTtBQUZtQjtBQUl2QjtBQUNBO0FBeEVROztBQTJFWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNLO0FBQ0E7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQWxTSzs7Ozs7Ozs7OztBQ0pUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZHO0FBSVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFyQlE7O0FBd0JaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFFSTtBQUVJO0FBQ0E7QUFDSDtBQUNKO0FBR0c7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQTlESSIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfYWxlcnQ6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5pbml0KHttZXNzYWdlOlwidGhpcyBpcyBqdXN0IHRlc3RcIn0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uTG9hZF1cIik7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gcGFyYW1zLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF9hbGVydC5zdHJpbmcgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZmFkZUluKDAuNSksY2MuZGVsYXlUaW1lKDEuMCksY2MuZmFkZU91dCgwLjUpLGNjLnJlbW92ZVNlbGYoKSkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGVzdHJveV0gbWVzc2FnZSA9IFwiICsgbWVzc2FnZSk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByYWRpb0J1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVcbiAgICAgICAgfSxcbiAgICAgICAgcGFuZWxHcm91cDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX2dldF91c2VyR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfZ2V0X2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX3VzZXJHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9FZGl0Ym94X2dldF9nb2xkOiBjYy5FZGl0Qm94LFxuICAgICAgICBtX0VkaXRib3hfZ2V0X2JhbmtQd2Q6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9zYXZlX2dvbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBfc2VsZWN0SW5kZXg6MCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2dldF91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9nZXRfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICByYWRpb0J1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKHRvZ2dsZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJhZGlvQnV0dG9uLmluZGV4T2YodG9nZ2xlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgdG9nZ2xlLm5vZGUuc2V0TG9jYWxaT3JkZXIoMSk7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiUmFkaW9CdXR0b25cIjtcbiAgICAgICAgc3dpdGNoKGluZGV4KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjFcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjJcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjNcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJhZGlvQnV0dG9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMucmFkaW9CdXR0b25baV07XG4gICAgICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsR3JvdXBbaV07XG4gICAgICAgICAgICBpZihjYy5pc1ZhbGlkKGVsZW1lbnQpICYmIGNjLmlzVmFsaWQocGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ub2RlLnNldExvY2FsWk9yZGVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2V0TG9jYWxaT3JkZXIoMCk7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgIC8vIHRoaXMuX3VwZGF0ZVRvZ2dsZUV2ZW50U3RyaW5nKHRpdGxlLCB0aGlzLnJhZGlvQnV0dG9uRXZlbnRTdHJpbmcsIHRvZ2dsZSk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAvLyB1cmwgKz0gXCIvaHovaHpVcGRhdGVGYWNlSWQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdEluZGV4ID09IDApIHtcbiAgICAgICAgICAgIHZhciBzekdvbGRDb3VudCA9IHRoaXMubV9FZGl0Ym94X2dldF9nb2xkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzelBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfZ2V0X2JhbmtQd2Quc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHJlID0gLy4vO1xuICAgICAgICAgICAgaWYoc3pHb2xkQ291bnQubGVuZ3RoIDw9IDAgfHwgc3pQYXNzV29yZC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3miJblr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5oiW5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzekdvbGRDb3VudCA8PSAwIHx8IHN6R29sZENvdW50ID4gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rpk7booYznmoTph5Hpop3pmZDliLbvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66ZO26KGM55qE6YeR6aKd6ZmQ5Yi2IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcImluc3VyZXBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIyXCI7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVzZXJCYW5rTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RJbmRleCA9PSAxKSB7XG4gICAgICAgICAgICB2YXIgc3pHb2xkQ291bnQgPSB0aGlzLm1fRWRpdGJveF9zYXZlX2dvbGQuc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHN6R29sZENvdW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3kuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6R29sZENvdW50IDw9IDAgfHwgc3pHb2xkQ291bnQgPiBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rouqvkuIrph5Hpop3vvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66Lqr5LiK6YeR6aKd77yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjFcIjtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXNlckJhbmtNb2JpbGUuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fc2VsZWN0SW5kZXggPT0gMikge1xuICAgICAgICAgICAgdmFyIHN6UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgc3pOZXdQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzekNvbmZpcm1QYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3pQYXNzV29yZC5sZW5ndGggPD0gMCB8fCBzek5ld1Bhc3NXb3JkLmxlbmd0aCA8PSAwIHx8IHN6Q29uZmlybVBhc3NXb3JkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDlr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6UGFzc1dvcmQgPT0gc3pOZXdQYXNzV29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6Q29uZmlybVBhc3NXb3JkICE9IHN6TmV3UGFzc1dvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzek5ld1Bhc3NXb3JkLmxlbmd0aCA8IDYgfHwgc3pOZXdQYXNzV29yZC5sZW5ndGggPiAxNikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJuZXdwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc1dvcmQpO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVcGRhdGVQYXNzV29yZC5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA9IHZhbHVlLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5pbnN1cmVzY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlID0gdmFsdWUuaW5zdXJlc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQmFua1N1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTYXZlQWxsOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3NhdmVfZ29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tHZXRBbGw6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfZ2V0X2dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5fdmlld0ZyYW1lID0gdmlldztcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWUgb25Mb2FkXCIpO1xuICAgICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm1fdGFiQ2FjaGVNc2cgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcIkJhc2VGcmFtZVwiLFxuICAgIC8vIGN0b3I6IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgLy8gICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgIC8vICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgICAgICBcbiAgICAvLyB9LFxuICAgIHNldENhbGxCYWNrOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrOyAgXG4gICAgfSxcbiAgICBzZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKHZpZXdGcmFtZSl7XG4gICAgICB0aGlzLl92aWV3RnJhbWUgPSB2aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIHNldFNvY2tldEV2ZW50OiBmdW5jdGlvbihzb2NrZXRFdmVudCl7XG4gICAgICAgIHRoaXMuX3NvY2tldEV2ZW50ID0gc29ja2V0RXZlbnQ7XG4gICAgfSxcbiAgICBnZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBpc1NvY2tldFNlcnZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICBpZih0aGlzLl90aHJlYWRpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAge1xuICAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgIC8vdG9kby4uLlxuICAgIH0sXG4gICAgb25DcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKHN6VXJsLG5Qb3J0KXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zelNlcnZlclVybCA9IHN6VXJsO1xuICAgICAgICB0aGlzLl9uU2VydmVyUG9ydCA9IG5Qb3J0O1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgICAgIHNlbGYub25Tb2NrZXRDYWxsQmFjayhwRGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQodGhpcy5fU29ja2V0RnVuKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lKTtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0LkNvbm5lY3RTb2NrZXQodGhpcy5fc3pTZXJ2ZXJVcmwsdGhpcy5fblNlcnZlclBvcnQpID09PSB0cnVlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25DcmVhdGVTb2NrZXQgY2xvc2VcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYodGhpcy5fY2FsbEJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ25vIGNhbGxiYWNrJyk7XG4gICAgICAgIC8vICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2FsbEJhY2sgbWFpbjogXCIgKyBtYWluICsgXCIgI3N1YjogXCIrc3ViKTtcbiAgICAgICAgaWYobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQobWFpbiwgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2VTb2NrZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQucmVsZWFzZVNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHNlbmRTb2NrZXREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kU29ja2V0RGF0YShwRGF0YSk7XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkNvbm5lY3RDb21wZWxldGVkXCIpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vblNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIG9uR2FtZVNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uR2FtZVNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUZyYW1lOyIsInZhciBnYW1lX2NtZCA9IHt9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX0xPR09OID0gMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze055m75b2VXG5cbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9BQ0NPVU5UUyA9IDExICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5oi355m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fVVNFUklEID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fTU9CSUxFID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYZcblxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1NVQ0NFU1MgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leaIkOWKn1xuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0VSUk9SID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9GSU5JU0ggPSA2MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leWujOaIkFxuXG4vLyAvL+aIv+mXtOW4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5QWNjb3VudHNcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1Byb2Nlc3NWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAvL+i/m+eoi+eJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+aJi+acuueZu+mZhlxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklETW9iaWxlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RW5jcnlwdElEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2RlQ2hlY2tJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdXZWlYaW5DaGVja0lEOyAgICAgICAgICAgICAgICAgICAgLy/lvq7kv6Hpqozor4HnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/muLjmiI9BUFDniYjmnKzlj7co5LiO55m76ZmG5aSn5Y6F55u45ZCMKVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOyAgIC8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuXG4vLyAvL+aIv+mXtCBJRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQcm9jZXNzVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgLy/ov5vnqIvniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+eZu+W9leaIkOWKn+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gfTtcblxuLy8gLy/nmbvlvZXlpLHotKVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nlKjmiLfmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX1VTRVIgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TSVRfUkVRID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvor7fmsYJcbmdhbWVfY21kLlNVQl9HUl9VU0VSX0xPT0tPTl9SRVEgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeinguivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBTkRVUF9SRVEgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1t+eri+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTEVGVF9HQU1FX1JFUSA9IDQ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56a75byA5ri45oiPXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0NPTUUgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+i/m+WFpVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBVFVTID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFID0gNjAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbmdhbWVfY21kLlNVQl9HUl9TSVRfRkFJTEVEID0gNjAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1JJR0hUID0gNjA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbmdhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVIgPSA2MDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTEQgPSA2MDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoumHkeixhlxuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX1RSQU4gPSA2MDcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoui9rOW4kFxuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9DSEFUID0gNzAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ogYrlpKnmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1dJU1BFUiA9IDcwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56eB6K+t5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9SVUxFID0gNzAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfop4TliJlcblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFID0gODAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgoDor7fmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0lOVklURV9SRVEgPSA4MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCgOivt+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTkRfUVVFUlkgPSA4MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgeafpeivolxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1IgPSA4MDNcblxuLy8gLy/kvJrlkZjnrYnnuqdcbi8vIHN0cnVjdCBDTURfR1JfTWVtYmVyT3JkZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlck9yZGVyOyAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gfTtcblxuLy8gLy/nlKjmiLfmnYPpmZBcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJpZ2h0XG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VyUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbi8vIH07XG5cbi8vIC8v55So5oi354q25oCBXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTdGF0dXNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L2N572uXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyU3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+WIhuaVsFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxMb3ZlbGluZXNzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4vLyAgICAgLy9MT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOi0uemHkeixhlxuLy8gICAgIC8vTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIHRhZ1VzZXJTY29yZSAgICAgICAgICAgICAgICAgICAgVXNlclNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np6/liIbkv6Hmga9cbi8vIH07XG5cbi8vIC8vc3RydWN0IG9uZVRyYW5SZWNvcmRcbi8vIC8ve1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dO1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VG9Vc2VySUQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUb0FjY291bnRzW05BTUVfTEVOXTtcbi8vIC8vICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuZ29sZDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuRGF0YVsxNV07XG4vLyAvL1xuLy8gLy99O1xuXG4vLyAvL+afpeivoue7k+aenCB3c2wgMjAxNS40LjFcbi8vIHN0cnVjdCBvbmVUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUcmFuR2FtZUlEOyAgICAgICAgICAgICAgICAgLy/ovazluJDmuLjmiI9JRFxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VHJhbkdhbWVJRFszMV07ICAgICAgICAgICAgICAgIC8v6L2s5biQ5ri45oiPSURcbi8vICAgICAvL1RDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRyYW5UeXBlW05BTUVfTEVOXTsgICAgICAgICAgIC8v6L2s5biQ57G75Z6LXG4vLyAgICAgLy9MT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbFByZXNlbnRWYWx1ZTsgICAgICAgICAgICAgICAgICAvL+i1oOmAgemHkeixhlxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblRpbWVbMjBdOyAgICAgICAgICAgICAgICAgLy/ovazluJDml7bpl7RcbiAgICBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgLy/nlKjmiLfmmLXnp7Bcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291bnQ7ICAgICAgICAgICAgICAgICAgICAvL+aVsOmHj1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Rmxvd2VyTmFtZVszMl07ICAgICAgICAgICAvL+ekvOeJqeWQjeensFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblR5cGVbTkFNRV9MRU5dOyAgICAgICAvL+i9rOW4kOexu+Wei1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9UcmFuR29sZFJlY29yZFJcbi8vIHtcbi8vICAgICBCWVRFICAgIG51bTsvL+acieWHoOadoeihqFxuLy8gICAgIG9uZVRyYW5SZWNvcmQgICBvbmV0cmFucmVjb3JkWzEwXTsvL+acgOWkmuWNgeadoeiusOW9leS4gOWPkVxuLy8gfTtcblxuLy8gLy8vLy/nlKjmiLfmn6Xor6Lph5HosYbnu5PmnpwgMjAxMS43LjE1IGJ5IGdhb3NoYW5cbi8vIHN0cnVjdCBDTURfR1JfVXNlclF1aUJhbmtlclxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgLy/pk7booYzph5HosYZcbi8vICAgICBDTURfR1BfVHJhbkdvbGRSZWNvcmRSICAgICAgICAgICAgICBUcmFuUmVjb3JkO1xuLy8gfTtcblxuLy8gLy/or7fmsYLlnZDkuItcbi8vIHN0cnVjdCBDTURfR1JfVXNlclNpdFJlcVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQYXNzTGVuOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplb/luqZcbi8vICAgICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgIGR3QW5zd2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zue562UIEkgRC8v5YW85a6556ev5YiG5ri45oiP5YWl5bqn6Zeu6aKYXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkvY3nva5cbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VGFibGVQYXNzW1BBU1NfTEVOXTsgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlUmVxXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLyAvL+WdkOS4i+Wksei0pVxuLy8gc3RydWN0IENNRF9HUl9TaXRGYWlsZWRcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RmFpbGVkRGVzY3JpYmVbMjU2XTsgICAgICAgICAgICAgIC8v6ZSZ6K+v5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+iBiuWkqee7k+aehFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyQ2hhdFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBDT0xPUlJFRiAgICAgICAgICAgICAgICAgICAgICAgIGNyRm9udENvbG9yOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6aKc6ImyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1NlbmRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeeUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q2hhdE1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAgIC8v6IGK5aSp5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+engeivree7k+aehFxuLy8gc3RydWN0IENNRF9HUl9XaXNwZXJcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgQ09MT1JSRUYgICAgICAgICAgICAgICAgICAgICAgICBjckZvbnRDb2xvcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+minOiJslxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdTZW5kVXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNoYXRNZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgICAvL+iBiuWkqeS/oeaBr1xuLy8gfTtcblxuLy8gLy/nlKjmiLfop4TliJlcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJ1bGVcbi8vIHtcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQYXNzd29yZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5a+G56CBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRXaW47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuiDnOeOh1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0RmxlZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbmlq3nur9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi25YiG5pWwXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQ2hlY2tTYW1lSVA7ICAgICAgICAgICAgICAgICAgICAgICAvL+aViOmqjOWcsOWdgFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpblJhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbog5znjodcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGbGVlUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26YCD6LeRXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOmrmOWIhuaVsFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbExlc3NTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDkvY7liIbmlbBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc3dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/phY3nva7kv6Hmga/mlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX0lORk8gPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mFjee9ruS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfU0VSVkVSX0lORk8gPSA5MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX09SREVSX0lORk8gPSA5MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+mFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9JTkZPID0gOTAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjphY3nva5cbmdhbWVfY21kLlNVQl9HUl9DT0xVTU5fSU5GTyA9IDkwMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSCA9IDkwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5a6M5oiQXG5cbi8vIC8v5ri45oiP5oi/6Ze05L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlcnZlckluZm9cbi8vIHtcbi8vICAgICAvL+aIv+mXtOWxnuaAp1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlyQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdHYW1lR2VucmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnosgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1ZpZGVvQWRkcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+inhumikeWcsOWdgFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIaWRlVXNlckluZm87ICAgICAgICAgICAgICAgICAgICAgLy/pmpDol4/kv6Hmga9cbi8vIH07XG5cbi8vIC8v5YiG5pWw5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1Njb3JlSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0Rlc2NyaWJlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/mj4/ov7DmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdEYXRhRGVzY3JpYmVbMTZdOyAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5qCH5b+XXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOe7k+aehFxuLy8gc3RydWN0IHRhZ09yZGVySXRlbVxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfnp6/liIZcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckRlc2NyaWJlWzE2XTsgICAgICAgICAgICAgICAgIC8v562J57qn5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9PcmRlckluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn5pWw55uuXG4vLyAgICAgdGFnT3JkZXJJdGVtICAgICAgICAgICAgICAgICAgICBPcmRlckl0ZW1bMTI4XTsgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+aPj+i/sFxuLy8gfTtcblxuLy8gLy/liJfooajpobnmj4/ov7Dnu5PmnoRcbi8vIHN0cnVjdCB0YWdDb2x1bW5JdGVtXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uV2lkdGg7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOWuveW6plxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0RhdGFEZXNjcmliZTsgICAgICAgICAgICAgICAgICAgICAgLy/lrZfmrrXnsbvlnotcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q29sdW1uTmFtZVsxNl07ICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5ZCN5a2XXG4vLyB9O1xuXG4vLyAvL+WIl+ihqOaPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9Db2x1bW5JbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOaVsOebrlxuLy8gICAgIHRhZ0NvbHVtbkl0ZW0gICAgICAgICAgICAgICAgICAgQ29sdW1uSXRlbVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/liJfooajmj4/ov7Bcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOeKtuaAgeaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1RBVFVTID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nirbmgIHkv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX0lORk8gPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS/oeaBr1xuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX1NUQVRVUyA9IDYwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q54q25oCBXG5cbi8vIC8v5qGM5a2Q54q25oCB57uT5p6EXG4vLyBzdHJ1Y3QgdGFnVGFibGVTdGF0dXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQbGF5U3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gfTtcblxuLy8gLy/moYzlrZDnirbmgIHmlbDnu4Rcbi8vIHN0cnVjdCBDTURfR1JfVGFibGVJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIHRhZ1RhYmxlU3RhdHVzICAgICAgICAgICAgICAgICAgVGFibGVTdGF0dXNbNTEyXTsgICAgICAgICAgICAgICAgICAgLy/nirbmgIHmlbDnu4Rcbi8vIH07XG5cbi8vIC8v5qGM5a2Q54q25oCB5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlU3RhdHVzXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBsYXlTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nrqHnkIbmlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX01BTkFHRVIgPSA1NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuWRveS7pFxuXG5nYW1lX2NtZC5TVUJfR1JfU0VORF9XQVJOSU5HID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHorablkYpcbmdhbWVfY21kLlNVQl9HUl9TRU5EX01FU1NBR0UgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX0xPT0tfVVNFUl9JUCA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l55yL5Zyw5Z2AXG5nYW1lX2NtZC5TVUJfR1JfS0lMTF9VU0VSID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ouKLlh7rnlKjmiLdcbmdhbWVfY21kLlNVQl9HUl9MSU1JVF9BQ0NPVU5TID0gNTUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npoHnlKjluJDmiLdcbmdhbWVfY21kLlNVQl9HUl9TRVRfVVNFUl9SSUdIVCA9IDY2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p2D6ZmQ6K6+572uXG5nYW1lX2NtZC5TVUJfR1JfT1BUSU9OX1NFUlZFUiA9IDc3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze06K6+572uXG5cbi8vIC8v5Y+R6YCB6K2m5ZGKXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlbmRXYXJuaW5nXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6V2FybmluZ01lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgIC8v6K2m5ZGK5raI5oGvXG4vLyB9O1xuXG4vLyAvL+ezu+e7n+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9TZW5kTWVzc2FnZVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHYW1lOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUm9vbTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5raI5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pTeXN0ZW1NZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgLy/ns7vnu5/mtojmga9cbi8vIH07XG5cbi8vIC8v5p+l55yL5Zyw5Z2AXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvb2tVc2VySVBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+i4ouWHuueUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9LaWxsVXNlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v56aB55So5biQ5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX0xpbWl0QWNjb3VudHNcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+adg+mZkOiuvue9rlxuLy8gc3RydWN0IENNRF9HUl9TZXRVc2VyUmlnaHRcbi8vIHtcbi8vICAgICAvL+e7keWumuWPmOmHj1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JBY2NvdW50c1JpZ2h0OyAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fmnYPpmZBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2FtZVJpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35p2D6ZmQXG4vLyAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0Um9vbUNoYXQ7ICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuLy8gICAgIC8v5p2D6ZmQ5Y+Y5YyWXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0TG9va29uR2FtZTsgICAgICAgICAgICAgICAgICAvL+aXgeinguadg+mZkFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdEdhbWVDaGF0OyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ogYrlpKlcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRTZW5kV2lzcGVyOyAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0UGxheUdhbWU7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+adg+mZkFxuLy8gfTtcblxuLy/orr7nva7moIflv5dcbmdhbWVfY21kLk9TRl9ST09NX0NIQVQgPSAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuZ2FtZV9jbWQuT1NGX0dBTUVfQ0hBVCA9IDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6IGK5aSpXG5nYW1lX2NtZC5PU0ZfUk9PTV9XSVNQRVIgPSAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheengeiBilxuZ2FtZV9jbWQuT1NGX0VOVEVSX0dBTUUgPSA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpea4uOaIj1xuZ2FtZV9jbWQuT1NGX0VOVEVSX1JPT00gPSA1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpeaIv+mXtFxuZ2FtZV9jbWQuT1NGX1NIQUxMX0NMT1NFID0gNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljbPlsIblhbPpl61cblxuLy8gLy/miL/pl7Torr7nva5cbi8vIHN0cnVjdCBDTURfR1JfT3B0aW9uU2VydmVyXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk9wdGlvbkZsYWdzOyAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruagh+W/l1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JPcHRpb25WYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7moIflv5dcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+aVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1lTVEVNID0gNjYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/kv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0UgPSAyMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vL+a2iOaBr+exu+Wei1xuZ2FtZV9jbWQuU01UX0lORk8gPSAweDAwMDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+a2iOaBr1xuZ2FtZV9jbWQuU01UX0VKRUNUID0gMHgwMDAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbmdhbWVfY21kLlNNVF9HTE9CQUwgPSAweDAwMDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xuZ2FtZV9jbWQuU01UX1NDT1JFX05PVEVOT1VHSCA9IDB4MDAwOCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YeR5biB5LiN5aSfXG5nYW1lX2NtZC5TTVRfQ0xPU0VfUk9PTSA9IDB4MTAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5oi/6Ze0XG5nYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSA9IDB4NDAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lit5pat6L+e5o6lXG5cbi8vIC8v5raI5oGv5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX0dSX01lc3NhZ2Vcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNZXNzYWdlVHlwZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TWVzc2FnZUxlbmd0aDsgICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDb250ZW50WzEwMjRdOyAgICAgICAgICAgICAgICAgICAgLy/mtojmga/lhoXlrrlcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU0VSVkVSX0lORk8gPSA3NyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfT05MSU5FX0NPVU5UX0lORk8gPSAxMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WcqOe6v+S/oeaBr1xuXG4vLyAvL+S6uuaVsOS/oeaBr1xuLy8gc3RydWN0IHRhZ09uTGluZUNvdW50SW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovmoIfor4Zcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgIC8v5Zyo57q/5Lq65pWwXG4vLyB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZV9jbWQ7IiwidmFyIHBsYXphX2NtZCA9IHt9O1xuXG4vL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9MT1cgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9ISUdIID0gMTY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIHBsYXphX2NtZC5WRVJfUExBWkFfRlJBTUUgPSBNQUtFTE9ORzsoVkVSX1BMQVpBX0xPVyxWRVJfUExBWkFfSElHSClcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V6ZSZ6K+v5qCH6K+GXG5cbnBsYXphX2NtZC5FUkNfR1BfTE9HT05fU1VDQ0VTUyA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5oiQ5YqfXG5wbGF6YV9jbWQuRVJDX0dQX0FDQ09VTlRTX05PVF9FWElTVCA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35LiN5a2Y5ZyoXG5wbGF6YV9jbWQuRVJDX0dQX0xPTkdfTlVMTElUWSA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56aB5q2i55m75b2VXG5wbGF6YV9jbWQuRVJDX0dQX1BBU1NXT1JEX0VSQ09SID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplJnor69cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfTE9HT04gPSAxMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0FDQ09VTlRTID0gMzAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fnmbvlvZVcbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fVVNFUklEID0gMzAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX0FDQ09VTlRTID0gMzAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfVVBMT0FEX0NVU1RPTV9GQUNFID0gMzA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fUkVDT1JEID0gMzA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xucGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUgPSAxNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuW5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSA9IDE1MDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmGXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX01PQklMRSA9IDE1MTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py65rOo5YaMXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUgPSAyNjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuaIkOWKn1xucGxhemFfY21kLlNVQl9HUF9MT0dPTl9FUlJPUl9NT0JJTEUgPSAyNjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuWksei0pVxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9GSU5JU0hfTU9CSUxFID0gMjYyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYblrozmiJBcblxuLy8gLy/luJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeUFjY291bnRzTW9iaWxlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbldlaVhpbkF1dGhJRDsgICAgICAgICAgICAgICAgICAvL+W+ruS/oemqjOivgSAvL+WFvOWuueS9v+eUqD4xMDAwd+aJq+eggeeZu+mZhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwS2luZDsgICAgICAgICAgICAgICAgLy/miYvmnLpBUFDmuLjmiI9JRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy/miYvmnLpBUFDniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuLy8gLy/ms6jlhozluJDlj7dcbi8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c01vYmxpZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLfmgKfliKtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcEtpbmQ7ICAgICAgICAgICAgICAgIC8vIOW5v+WcuuaJi+acuueJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy8g5bm/5Zy65omL5py654mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvLyDnmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8vIOeZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlcGhvbmVbTU9CSUxFUEhPTkVfTEVOXTsgLy8g5omL5py6XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvLyDmmLXnp7Bcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZUF1dGhbTkFNRV9MRU5dOyAgICAgICAgIC8v5omL5py66aqM6K+B56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbi8vIH07XG5cbi8vIC8v5omL5py655m76ZmG5oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuLy8ge1xuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkJpbmRXZWlYaW47ICAgICAgICAgICAgICAgICAgIC8v57uR5a6a5b6u5L+hIFdTTFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmNyeXB0SUQ7ICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIExXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvZGVDaGVja0lEOyAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0V4cGVyaWVuY2U7ICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxsR2FtZVNjb3JlOyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgIC8v6ZO26KGM6YeR5biBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mmLXnp7Bcbi8vIH07XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIC8v5biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uQnlBY2NvdW50c1xuLy8ge1xuXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyUGhvbmVUYWc7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyB9O1xuXG4vLyAvL0kgRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vIH07XG5cbi8vIC8v5rOo5YaM5biQ5Y+3XG4vLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2l0eU51bTsgICAgICAgICAgICAgICAgICAgICAgIC8v5Z+O5biC57yW56CBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JFbmpveVR5cGU7ICAgICAgICAgICAgICAgICAgICAvL+WKoOWFpeexu+Wei1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6U3ByZWFkZXJbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mjqjlub/kurrlkI1cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8v55So5oi35pi156ewXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pSZWFsTmFtZVtOQU1FX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pJZGVudGl0eVtOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFbmpveUNvZGVbUEFTU19MRU5dOyAgICAgICAgICAvL+aOqOiNkOeggW9y5paw5omL56CBXG4vLyB9O1xuXG4vLyAvL+eZu+mZhuaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdFeHBlcmllbmNlOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuICAgIFxuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcblxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Rm9ydHVuZUNvaW47ICAgICAgICAgICAgICAgICAgLy/npo/luIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LmQ6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAvL+S5kOixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291cG9uOyAgICAgICAgICAgICAgICAgICAgICAgLy/ngavohb9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgIC8v54Gr6IW/XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNYXRjaFRpY2tldDsgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRmlyc3RCYW5rOyAgICAgICAgICAgICAgICAgICAgLy8g6aaW5qyh5L2/55SoXG5cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelVzZXJQaG9uZUluZm9yWzE2XTsgICAgICAgICAgIC8v55So5oi35omL5py6XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAvL+mUmeivr+a2iOaBr1xuLy8gfTtcblxuLy8gLy/nmbvpmYblpLHotKVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxFcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgdGFnQXdhcmRJbmZvXG4vLyB7XG4vLyAgICAgaW50ICAgICBuQXdhcmRHb2xkWzddO1xuLy8gfTtcblxuLy8gdHlwZWRlZiBzdHJ1Y3Rcbi8vIHtcbi8vICAgICB0YWdBd2FyZEluZm8gaW5mbztcbi8vICAgICBCWVRFICAgICAgICBJc0NoZWNrZWQ7XG4vLyAgICAgaW50ICAgICAgICAgbkxvZ29uVGltZTtcbi8vIH1DTURfR1BfQXdhcmRJbmZvO1xuLy8gLy/moKHpqoznlKjmiLfkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1BfQ2hlY2tSZWdpc3RlclxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGF0YVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmxhZzsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vMDrmo4DmtYvotKblj7cgMTrmo4DmtYvmmLXnp7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/muLjmiI/liJfooajlkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9TRVJWRVJfTElTVCA9IDE3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfTElTVF9UWVBFID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9LSU5EID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np43nsbvliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TVEFUSU9OID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nq5nngrnliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TRVJWRVIgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOWIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0ZJTklTSCA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5a6M5oiQXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfQ09ORklHID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajphY3nva5cblxuLy8gLy/liJfooajphY3nva5cbi8vIHN0cnVjdCBDTURfR1BfTGlzdENvbmZpZ1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTaG93T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgLy/mmL7npLrkurrmlbBcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+WRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX1NZU1RFTSA9IDE5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5ZG95LukXG5cbnBsYXphX2NtZC5TVUJfR1BfVkVSU0lPTiA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v54mI5pys6YCa55+lXG5wbGF6YV9jbWQuU1VCX1NQX1NZU1RFTV9NU0cgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vLyAvL+eJiOacrOmAmuefpVxuLy8gc3RydWN0IENNRF9HUF9WZXJzaW9uXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk5ld1ZlcnNpb247ICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOeJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJBbGxvd0Nvbm5lY3Q7ICAgICAgICAgICAgICAgICAgLy/lhYHorrjov57mjqVcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnBsYXphX2NtZC5NRE1fR1BfVVNFUiA9IDIyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfVVNFUl9VUExPQURfRkFDRSA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VTRVJfRE9XTkxPQURfRkFDRSA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiL6L295aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VQTE9BRF9GQUNFX1JFU1VMVCA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0RFTEVURV9GQUNFX1JFU1VMVCA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0NVU1RPTV9GQUNFX0RFTEVURSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX01PRElGWV9JTkRJVklEVUFMID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuKrkurrotYTmlplcbnBsYXphX2NtZC5TVUJfR1BfTU9ESUZZX0lORElWSURVQUxfUkVTVUxUID0gNTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv67mlLnnu5PmnpxcblxucGxhemFfY21kLlNVQl9HUF9TQUZFX0JJTkQgPSA1MDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutue7keWumlxucGxhemFfY21kLlNVQl9HUF9TQUZFX1VOQklORCA9IDUwODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Kej6Zmk57uR5a6aXG5wbGF6YV9jbWQuU1VCX0dQX0NIRUNLX1BTRCA9IDUwOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+G56CB6aqM6K+BIFdTTCAyMDE1LjMuMjdcblxuXG5wbGF6YV9jbWQuTURNX0dQX1JFRyA9IDIzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+azqOWGjFxucGxhemFfY21kLlNVQl9HUF9JTklUX1JFR0lTVEVSID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfQ0FOQ0VMX1JFR0lTVEVSID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflj5bmtojms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfUkVGVVNFX1JFRyA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0NBTl9SRUcgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peazqOWGjFxucGxhemFfY21kLlNVQl9HUF9HRVRfUkVHQ09ERSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERSA9IDUwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERV9FUlJPUiA9IDUwNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xuXG4vLyAvL+S4quS6uui1hOaWmVxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/njqnlrrbmmLXnp7Bcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5HZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625oCn5YirXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQWdlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuW5tOm+hFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBZGRyZXNzWzY0XTsgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrblnLDlnYBcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VW5kZXJXcml0ZVszMl07ICAgICAgICAgICAgICAgICAgIC8v5Liq5oCn562+5ZCNXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3N3b3JkWzMzXTsgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuWvhueggVxuLy8gfTtcblxuLy8gLy/lrprkuYnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkQ3VzdG9tRmFjZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFNpemU7ICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5aSn5bCPXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxhc3RQYWNrZXQ7ICAgICAgICAgICAgICAgICAgICAvL+acgOWQjuagh+ivhlxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGaXJzdFBhY2tldDsgICAgICAgICAgICAgICAgICAgLy/nrKzkuIDkuKrmoIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgIC8v5aS05YOP5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+S4i+i9veaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Eb3dubG9hZEZhY2VTdWNjZXNzXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RvbHRhbFNpemU7ICAgICAgICAgICAgICAgICAgICAgICAvL+aAu+WFseWkp+Wwj1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXJyZW50U2l6ZTsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lpKflsI9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+aVsOaNrlxuLy8gfTtcblxuLy8gLy/kuIvovb3lpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRG93bmxvYWRGYWNlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gfTtcblxuLy8gLy/kuIrkvKDnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfRGVsZXRlRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTmtojmga9cbi8vIHN0cnVjdCBDTURfR1BfQ3VzdG9tRmFjZURlbGV0ZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyB9O1xuLy8gLy/kv67mlLnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEO1xuLy8gfTtcbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVJlc3VsdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JSZXN1bHRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57nu5Pmnpxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOPSURcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVXNlckluZm9cbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5L+d6Zmp566x56aP5biBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgICAgICAvL+S/nemZqeeusei0neWjs1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otJ3lo7PmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TWF0Y2hUaWNrZXQ7ICAgICAgICAgICAgICAgICAgICAgIC8v6Zeo56Wo5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZvcnR1bmVDb2luOyAgICAgICAgICAgICAgICAgICAgICAvL+emj+ixhuaVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npo/luIHmlbBcbi8vIH07XG4vLyAvL+S/ruaUuee7k+aenFxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk9wZXJhdGVTdWNjZXNzOyAgICAgICAgICAgICAgICAgICAgLy/miJDlip/moIfor4Zcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfR2V0TG9nb25Bd2FyZFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgblRpbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lh6DnrYnlpZblirFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635b6X5aWW5YqxXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1JldHVyblxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkNvZGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm55jb2RlXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WAvFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57mj4/ov7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8g6ZO26KGM5pON5L2cKOW8gOWIhuWGmSzlh4/lsJHliKTmlq3lrZfoioIpXG5wbGF6YV9jbWQuTURNX0dQX0JBTksgPSA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpk7booYzkv6Hmga9cblxuLy8g5a6i5oi356uv6K+35rGCXG5wbGF6YV9jbWQuU1VCX0dQX0NIQU5HRV9QQVNTV09SRCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRSA9IDEwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOafpeeci+iusOW9lVxucGxhemFfY21kLlNVQl9HUF9CQU5LX1NUT1JBR0UgPSAxMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19HRVQgPSAxMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0UgPSAxMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjlpZbliLhcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX0dFVCA9IDEwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWlluWIuFxuXG4vLyDor7fmsYLlupTnrZRcbnBsYXphX2NtZC5TVUJfR1BfQ0hBTkdFX1BBU1NXT1JEX1JFUyA9IDExMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRV9SRVMgPSAxMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmn6XnnIvorrDlvZVcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19TVE9SQUdFX1JFUyA9IDExMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOmHkeW4gVxucGxhemFfY21kLlNVQl9HUF9CQU5LX0dFVF9SRVMgPSAxMTM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0VfUkVTID0gMTE0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo5aWW5Yi4XG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9HRVRfUkVTID0gMTE1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5aWW5Yi4XG5cblxuLy8gLy8g5L+u5pS55a+G56CBXG4vLyBzdHJ1Y3QgQ01EX0dQX0NoYW5nZVBhc3NXb3JkXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmtQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDmlrDnmoTlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRCa1Bhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWOn+Wni+WvhueggVxuLy8gfTtcblxuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWtmOWFpeWtmOWCqOe7k+aehFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyB9Q01EX0dQX0JhbmtTdG9yYWdlLCBDTURfR1BfQ291cG9uU3RvcmFnZTtcblxuLy8gLy8g6YeR5biBLOWlluWIuCzlj5blh7rlrZjlgqjnu5PmnoRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi3SURcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFua1Bhc3N3b3JkW1BBU1NfTEVOXTsgICAgICAgICAvLyDnlKjmiLflr4bnoIFcbi8vIH1DTURfR1BfQmFua0dldCwgQ01EX0dQX0NvdXBvbkdldDtcblxuXG4vLyAvLyDkv67mlLnlr4bnoIHlupTnrZRcbi8vIHN0cnVjdCBDTURfR1BfQ2hhbmdlUGFzc1dvcmRSZXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIDDkuLrmiJDlip8o5L+u5pS5aXNGaXJzdClcbi8vIH07XG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5a2Y5YKo5bqU562UXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOmUmeivr+eggSww5Li65oiQ5YqfXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvLyDouqvkuIrpkrFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5rVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOS/nemZqeeusemSsVxuLy8gfUNNRF9HUF9CYW5rU3RvcmFnZVJlcywgQ01EX0dQX0JhbmtHZXRSZXMsIENNRF9HUF9Db3Vwb25TdG9yYWdlUmVzLCBDTURfR1BfQ291cG9uR2V0UmVzO1xuXG5wbGF6YV9jbWQuTURNX0dQX05FVyA9IDY7XG5cbnBsYXphX2NtZC5TVUJfR1BfR0VUX05FV1MgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWFrOWRilxucGxhemFfY21kLlNVQl9HUF9GSU5EX0ZSSUVETiA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9GUklFTkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWlveWPi1xucGxhemFfY21kLlNVQl9HUF9BRERfRlJJRU5EID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lop7liqDlpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfREVMRVRFX0ZSSUVORCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0ZSSUVORF9FUlJPUiA9IDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfTU9ORVkgPSA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgVxucGxhemFfY21kLlNVQl9HUF9TRU5EX1JFQ09SRCA9IDg7XG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfUkVTVUxUID0gOTtcblxuLy8gc3RydWN0IENNRF9HUF9HZXROZXdzXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOZXdzWzI1Nl07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZF9SZWxhdGl2ZSBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgRFdPUkQgICAgICAgICAgIGR3RnJpZW5kSUQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZEVycm9yXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgc3pEZXNjcmliZVsxMjhdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9EZWxldGVGcmllbmRSZXN1bHRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdEZWxldGVJRDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRmluZFVzZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBXT1JEICAgICAgICB3RmFjZUlEO1xuLy8gICAgIGNoYXIgICAgICAgIHN6Tmlja05hbWVbMzJdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GcmllbmRMaXN0XG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICBuQ291bnQ7ICAgICAgICAgICAgIC8v5Liq5pWwXG4vLyAgICAgQ01EX0dQX0ZpbmRVc2VyICAgICBGdXNlclsxMF07ICAvL+acgOWkmlxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9TZW5kTW9uZXlcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBEV09SRCAgICAgICBkd0ZyaWVuZElEO1xuLy8gICAgIExPTkdMT05HICAgIGxTY29yZTtcbi8vIH07XG5cbi8vIHN0cnVjdCB0YWdUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzelNlbmROYW1lWzMyXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6QWNjZXB0TmFtZVszMl07XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICBsVHJhbkdvbGQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1RyYW5SZWNvcmRcbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgIG5Db3VudDtcbi8vICAgICB0YWdUcmFuUmVjb3JkICAgICAgIFJlY29yZFsyMF07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1NlbmRSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6U2VuZE5hbWVbMzJdO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pBY2NlcHROYW1lWzMyXTtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgIGxTY29yZTtcbi8vIH07XG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyAvL+i2o+ivree7k+aehFxuLy8gc3RydWN0IENNRF9HRl9Vc2VyRnVuXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOWPt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNYWluSW5kZXg7ICAgICAgICAgICAgICAgICAgICAgLy/otqPor63mnaHnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3U3ViSW5kZXg7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dGX0xldmVsSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgd0NoYWlySUQ7XG4vLyAgICAgTE9ORyAgICBsR2FtZUxldmVsO1xuLy8gICAgIExPTkcgICAgQXdhcmRUeXBlO1xuLy8gICAgIExPTkcgICAgQXdhcmRWYWx1ZTtcbi8vICAgICBMT05HICAgIGxFeHBlcmllbmNlO1xuLy8gICAgIExPTkdMT05HICAgIGxMZXZlbFVwVmFsdWU7XG4vLyB9O1xuXG4vLyAvL+ivt+axguS7u+WKoVxuLy8gc3RydWN0IENNRF9HRl9NaXNzaW9uUmVxdWVzdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1pc3Npb25UeXBlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyB9O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy/mtojmga/nsbvlnotcbnBsYXphX2NtZC5TTVRfSU5GTyA9IDB4MDAwMTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG5wbGF6YV9jbWQuU01UX0VKRUNUID0gMHgwMDAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbnBsYXphX2NtZC5TTVRfR0xPQkFMID0gMHgwMDA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhajlsYDmtojmga9cbnBsYXphX2NtZC5TTVRfQ0xPU0VfR0FNRSA9IDB4MTAwMDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5ri45oiPXG5cbm1vZHVsZS5leHBvcnRzID0gcGxhemFfY21kOyIsInZhciB6amhfY21kID0ge307XG5cblxuempoX2NtZC5LSU5EX0lEID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuempoX2NtZC5TRVJWRVJfSUQgPSAzMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnI3liqHlmaggSSBEXG56amhfY21kLkdBTUVfUExBWUVSID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5Lq65pWwXG56amhfY21kLkdBTUVfTkFNRSA9IFwi6K+I6YeR6IqxXCI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+WQjeWtl1xuLy8gempoX2NtZC5HQU1FX0dFTlJFICAgICAgICAgICAgICAgICAgICAgIChHQU1FX0dFTlJFX0dPTER8R0FNRV9HRU5SRV9NQVRDSCkgIC8v5ri45oiP57G75Z6LXG56amhfY21kLk1BWF9DT1VOVCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJkeWFi+aVsOebrlxuXG5cbnpqaF9jbWQuU0VSVkVSQUREUkVTUyA9IFwiMTI3LjAuMC4xXCI7XG56amhfY21kLlNFUlZFUl9QT1JUID0gMTY4MDtcblxuLy/nu5PmnZ/ljp/lm6BcbnpqaF9jbWQuR0VSX05PX1BMQVlFUiA9IDB4MTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ayoeacieeOqeWutlxuempoX2NtZC5HRVJfQ09NUEFSRUNBUkQgPSAweDIwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznu5PmnZ9cbnpqaF9jbWQuR0VSX09QRU5DQVJEID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM57uT5p2fXG5cbi8v5ri45oiP54q25oCBXG56amhfY21kLkdTX1RLX0ZSRUUgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5byA5aeLXG56amhfY21kLkdTX1RLX1BMQVlJTkcgPSAxMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ov5vooYxcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5pyN5Yqh5Zmo5ZG95Luk57uT5p6EXG5cbnpqaF9jbWQuU1VCX1NfR0FNRV9TVEFSVCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuempoX2NtZC5TVUJfU19BRERfU0NPUkUgPSAxMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jnu5PmnpxcbnpqaF9jbWQuU1VCX1NfR0lWRV9VUCA9IDEwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+i3n+azqFxuempoX2NtZC5TVUJfU19DT01QQVJFX0NBUkQgPSAxMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzot5/ms6hcbnpqaF9jbWQuU1VCX1NfTE9PS19DQVJEID0gMTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM6Lef5rOoXG56amhfY21kLlNVQl9TX1NFTkRfQ0FSRCA9IDEwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkeeJjOa2iOaBr1xuempoX2NtZC5TVUJfU19HQU1FX0VORCA9IDEwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adn1xuempoX2NtZC5TVUJfU19QTEFZRVJfRVhJVCA9IDEwNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+W8uumAgFxuempoX2NtZC5TVUJfU19PUEVOX0NBUkQgPSAxMDg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYzmtojmga9cbnpqaF9jbWQuU1VCX1NfV0FJVF9DT01QQVJFID0gMTA5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5q+U54mMXG56amhfY21kLlNVQl9TX0xBU1RfQUREID0gMTEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyAvL+a4uOaIj+eKtuaAgVxuLy8gc3RydWN0IENNRF9TX1N0YXR1c0ZyZWVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WfuuehgOenr+WIhlxuLy8gfTtcblxuLy8gLy/muLjmiI/nirbmgIFcbi8vIHN0cnVjdCBDTURfU19TdGF0dXNQbGF5XG4vLyB7XG4vLyAgICAgLy/liqDms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4Q2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WNleWFg+S4iumZkFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v54q25oCB5L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk1pbmdaaHVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgICAgLy/nnIvniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVGFibGVTY29yZVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAvL+S4i+azqOaVsOebrlxuICAgIFxuLy8gICAgIC8v5omR5YWL5L+h5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIYW5kQ2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/miZHlhYvmlbDmja5cbiAgICBcbi8vICAgICAvL+eKtuaAgeS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vIH07XG5cbi8vIC8v5ri45oiP5byA5aeLXG4vLyBzdHJ1Y3QgQ01EX1NfR2FtZVN0YXJ0XG4vLyB7XG4vLyAgICAgLy/kuIvms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOWkp+S4i+azqFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v55So5oi35L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+S4i+azqFxuLy8gc3RydWN0IENNRF9TX0FkZFNjb3JlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QWRkU2NvcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEFkZFNjb3JlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jmlbDnm65cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblraTms6jkuIDmjrdcbi8vIH07XG5cbi8vIC8v55So5oi35pS+5byDXG4vLyBzdHJ1Y3QgQ01EX1NfR2l2ZVVwXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0dpdmVVcFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mlL7lvIPnlKjmiLdcbi8vIH07XG5cbi8vIC8v5q+U54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfQ29tcGFyZUNhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlclsyXTsgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ovpPniYznlKjmiLdcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTG9zdENhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgIC8v6L6T5a6254mM5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+eci+eJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX0xvb2tDYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvb2tDYXJkVXNlcjsgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYznlKjmiLdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkNhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgICAgICAvL+eUqOaIt+aJkeWFi1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyB9O1xuXG4vLyAvL+W8gOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX09wZW5DYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpbm5lcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnlKjmiLdcbi8vIH07XG5cbi8vIC8v5a2k5rOo5LiA5o63XG4vLyBzdHJ1Y3QgQ01EX1NfTGFzdEFkZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGFydExhc3RBZGRVc2VyO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl07XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyW0dBTUVfUExBWUVSXTtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuO1xuLy8gfTtcblxuXG4vLyAvL+a4uOaIj+e7k+adn1xuLy8gc3RydWN0IENNRF9TX0dhbWVFbmRcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZVRheDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eojuaUtlxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lU2NvcmVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgIC8v5ri45oiP5b6X5YiGXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JDYXJkRGF0YVtHQU1FX1BMQVlFUl1bTUFYX0NPVU5UXTsgLy/nlKjmiLfmiZHlhYtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdWzRdOyAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmRTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57uT5p2f54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+mAgOWHulxuLy8gc3RydWN0IENNRF9TX1BsYXllckV4aXRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3UGxheWVySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAgOWHuueUqOaIt1xuLy8gfTtcblxuLy8gLy/nrYnlvoXmr5TniYxcbi8vIHN0cnVjdCBDTURfU19XYWl0Q29tcGFyZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL+WuouaIt+err+WRveS7pOe7k+aehFxuempoX2NtZC5TVUJfQ19BRERfU0NPUkUgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliqDms6hcbnpqaF9jbWQuU1VCX0NfR0lWRV9VUCA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+a2iOaBr1xuempoX2NtZC5TVUJfQ19DT01QQVJFX0NBUkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfTE9PS19DQVJEID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM5raI5oGvXG56amhfY21kLlNVQl9DX09QRU5fQ0FSRCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19XQUlUX0NPTVBBUkUgPSA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXmr5TniYxcbnpqaF9jbWQuU1VCX0NfRklOSVNIX0ZMQVNIID0gNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a6M5oiQ5Yqo55S7XG56amhfY21kLlNVQl9DX0xBU1RfQUREID0gODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG5cbi8vIC8v55So5oi35Yqg5rOoXG4vLyBzdHJ1Y3QgQ01EX0NfQWRkU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN54q25oCBXG4vLyB9O1xuXG4vLyAvL+avlOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9DX0NvbXBhcmVDYXJkXG4vLyB7ICAgXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbm1vZHVsZS5leHBvcnRzID0gempoX2NtZDsiLCJ2YXIgR2FtZVNlcnZlckl0ZW0gPSBjYy5DbGFzcyh7XG4gICAgd1NvcnRJRDogdW5kZWZpbmVkLFxuICAgIHdLaW5kSUQ6IHVuZGVmaW5lZCxcbiAgICB3U2VydmVySUQ6IHVuZGVmaW5lZCxcbiAgICB3U3RhdGlvbklEOiB1bmRlZmluZWQsXG4gICAgd1NlcnZlclBvcnQ6IHVuZGVmaW5lZCxcbiAgICBkd1NlcnZlckFkZHI6IHVuZGVmaW5lZCxcbiAgICBkd09uTGluZUNvdW50OiB1bmRlZmluZWQsXG4gICAgc3pTZXJ2ZXJOYW1lOiB1bmRlZmluZWQsXG4gICAgY3RvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT0qIEdhbWVTZXJ2ZXJJdGVtIGN0b3IgICo9PT09PVwiKVxuICAgICAgICB0aGlzLndTb3J0SUQgPSAwO1xuICAgICAgICB0aGlzLndLaW5kSUQgPSAwO1xuICAgICAgICB0aGlzLndTZXJ2ZXJJRCA9IDA7XG4gICAgICAgIHRoaXMud1N0YXRpb25JRCA9IDA7XG4gICAgICAgIHRoaXMud1NlcnZlclBvcnQgPSAwO1xuICAgICAgICB0aGlzLmR3U2VydmVyQWRkciA9IDA7XG4gICAgICAgIHRoaXMuZHdPbkxpbmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gXCJcIjtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCI9PT09PSogR2FtZVNlcnZlckl0ZW0gb25Jbml0ICAqPT09PT1cIilcbiAgICAgICAgdGhpcy53U29ydElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U2VydmVySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTdGF0aW9uSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTZXJ2ZXJQb3J0ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1NlcnZlckFkZHIgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd09uTGluZUNvdW50ID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibGVuID0gXCIrcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHdoaWxlKHRydWUpe1xuICAgICAgICAgICAgLy/pu5jorqTkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX05VTExcdFx0XHRcdFx0MFx0XHRcdFx0XHRcdFx0XHQvL+aXoOaViOaVsOaNrlxuICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fTEVWRUxcdFx0MzAwMFx0XHRcdFx0XHRcdFx0Ly/miL/pl7TnrYnnuqdcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fQ0VMTFx0XHQzMDAxXHRcdFx0XHRcdFx0XHQvL+aIv+mXtOW6leWIhlxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9NSU5TQ09SRVx0MzAwMlx0XHRcdFx0XHRcdFx0Ly/miL/pl7TmnIDlsI/liIbmlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX0REWl9CT01CX01BWFx0MzAwM1x0XHRcdFx0XHRcdFx0Ly/mlpflnLDkuLvmnIDlpKflgI3mlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fSU5GT1x0XHQzMDA0XHRcdFx0XHRcdFx0XHQvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHZhciBkYXRhU2l6ZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgdmFyIGRhdGFEZXNjcmliZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaXplID0gXCIrZGF0YVNpemUrXCIgZGVzY3JpYmUgPSBcIitkYXRhRGVzY3JpYmUpO1xuICAgICAgICAgICAgaWYgKGRhdGFEZXNjcmliZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHN3aXRjaChkYXRhRGVzY3JpYmUpe1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYlJvb21MZXZlbCA9IHBEYXRhLnJlYWRieXRlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubEJhc2VTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTGltaXRTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTWF4Qm9tYkxpbWl0ID0gcERhdGEucmVhZGludCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN6RGVzY3JpYmVUeHQgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplLHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU2VydmVySXRlbTtcbiIsInZhciBHbG9iYWxEZWYgPSB7XG4gICAgLy/mraPlvI/mnI3liqHlmajlnLDlnYBcbiAgICBodHRwSW5pdFVybDogXCJodHRwOi8vdmVyLmpqaGdhbWUuY29tL0hhbmRsZS9oei9pbml0LmFzaHhcIiwgICAvL2FwcOWIneWni+WMluaOpeWPo+WcsOWdgFxuICAgIGh0dHBCYXNlVXJsOiBcImh0dHA6Ly9pbnRlcmZhY2UuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAvL3dlYuaOpeWPo+WcsOWdgFxuICAgIGh0dHBPcGVuVXJsOiBcImh0dHA6Ly91c2VyLmpqaGdhbWUuY29tL2ZpbmRwYXNzd29yZEhaLmFzcHhcIiwgIC8v5om+5Zue5a+G56CBXG4gICAgaHR0cFVzZXJDZW50ZXI6IFwiaHR0cDovL2YuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkuK3lv4NcbiAgICBMT0dPTl9TRVJWRVJfRE9NQUlOOiBcIm5uYXBwLmpqaGdhbWUuY29tXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgTE9HT05fU0VSVkVSX0lQOiBcIjEyMi4yMjYuMTg2LjM4XCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgUE9SVF9MT0dPTl9TRVJWRVI6IDkwMDksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5pyN5Yqh5ZmoXG5cbi8v56uv5Y+j5a6a5LmJXG4gICAgUE9SVF9WSURFT19TRVJWRVI6IDc2MDAsXHRcdFx0XHRcdFx0XHRcdC8v6KeG6aKR5pyN5Yqh5ZmoXG4gICAgUE9SVF9DRU5URVJfU0VSVkVSOiA5MDkwLFx0XHRcdFx0XHRcdFx0XHQvL+S4reW/g+acjeWKoeWZqFxuXG4gICAgQ0hBTk5FTElEX2luaXQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muKDpgZPlj7dcbiAgICBDSEFOTkVMSURfY2VudGVyOiA3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rig6YGT5Y+3XG4vL+e9kee7nOaVsOaNruWumuS5iVxuICAgIFNPQ0tFVF9WRVI6IDB4OEMsXHRcdFx0XHRcdFx0XHRcdC8v572R57uc54mI5pysXG59XG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbERlZjtcbiIsInJlcXVpcmUoXCJNRDVcIik7XG5mdW5jdGlvbiBBY3Rpb25TaG93VGFuQ2h1YW5nKHdpZGdldCwgY2Ipe1xuICAgIGlmIChjYy5pc1ZhbGlkKHdpZGdldCkgPT09IGZhbHNlICkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxGdW5dW0FjdGlvblNob3dUYW5DaHVhbmddIHdpZGdldCBpcyBpbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHdpZGdldC5vcGFjaXR5ID0gMDtcbiAgICB3aWRnZXQuc2NhbGUgPSAwLjAxO1xuICAgIHdpZGdldC5ydW5BY3Rpb24oY2Muc3Bhd24oXG4gICAgICAgICAgICBjYy5mYWRlSW4oMC4yNSksXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMS4xKSxjYy5zY2FsZVRvKDAuMDUsIDEuMCkpLGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNiKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICApKTtcbn1cbmZ1bmN0aW9uIHNob3dUb2FzdChjb250ZXh0LG1lc3NhZ2UpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9Ub2FzdFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgVG9hc3RQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoVG9hc3RQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJUb2FzdFZpZXdcIikub25Jbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBBY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93VG9hc3RcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0FsZXJ0KGNvbnRleHQsbWVzc2FnZSkge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL0FsZXJ0Vmlld1wiLCBmdW5jdGlvbiAoZXJyLCBBbGVydFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShBbGVydFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkFsZXJ0Vmlld1wiKS5pbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dBbGVydFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLypcbnNob3dQb3BXYWl0aW5nKClcbkBwYXJhbXN7XG4gICAgd2FpdGluZ1RleHQ6IOeVjOmdouaYvuekuueahOaWh+WtlyxcbiAgICB3YWl0aW5nVGltZTog55WM6Z2i5a2Y5Zyo55qE5pe26Ze0LOi2heaXtuWNs+mUgOavgeeVjOmdoixcbiAgICBjbG9zZUV2ZW50OiDlhbPpl63nlYzpnaLnm5HlkKznmoTkuovku7YsIFxuICAgIGNhbGxCYWNrRnVuYzog5pS25Yiw55uR5ZCs5LqL5Lu25omn6KGM55qE5Zue6LCD5Ye95pWwLFxufVxuKi9cbmZ1bmN0aW9uIHNob3dQb3BXYWl0aW5nKGNvbnRleHQscGFyYW1zKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvUG9wV2FpdGluZ1ZpZXdcIiwgZnVuY3Rpb24gKGVyciwgUG9wV2FpdFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShQb3BXYWl0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiUG9wV2FpdFZpZXdcIikub25Jbml0KHBhcmFtcyk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd1BvcFdhaXRpbmdcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0c2lnbihwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgKyBcImtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiOy8v5Yqg5YWla2V5XG4gICAgcmV0dXJuIGNjLm1kNUVuY29kZShwYXJhbXMpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcykge1xuICAgIHZhciBub3dUaW1lID0gTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApO1xuICAgIHBhcmFtc1tcImRhdGV0YW1wXCJdID0gbm93VGltZTtcbiAgICB2YXIgc29ydF9wYXJhbXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpLnNvcnQoKVxuICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbEZ1bl1bYnVpbGRSZXF1ZXN0UGFyYW1dIFwiICsgSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgdmFyIHBhcmFtU3RyaW5nID0gXCJcIjtcbiAgICBmb3IgKHZhciBraSBpbiBzb3J0X3BhcmFtcykge1xuICAgICAgICB2YXIga2V5ID0gc29ydF9wYXJhbXNba2ldO1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBwYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nICsga2V5ICsgXCI9XCIgKyBlbGVtZW50ICsgXCImXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZyArIFwic2lnbj1cIiArIGdldHNpZ24ocGFyYW1TdHJpbmcpO1xuICAgIHJldHVybiBwYXJhbVN0cmluZztcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFjdGlvblNob3dUYW5DaHVhbmc6IEFjdGlvblNob3dUYW5DaHVhbmcsXG4gICAgc2hvd1RvYXN0OiBzaG93VG9hc3QsXG4gICAgc2hvd0FsZXJ0OiBzaG93QWxlcnQsXG4gICAgc2hvd1BvcFdhaXRpbmc6IHNob3dQb3BXYWl0aW5nLFxuICAgIGJ1aWxkUmVxdWVzdFBhcmFtOiBidWlsZFJlcXVlc3RQYXJhbSxcbn07IiwidmFyIEdsb2JhbFVzZXJEYXRhID0ge1xuICAgIHdGYWNlSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICBjYkdlbmRlcjogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgY2JNZW1iZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgIGlzR3Vlc3Q6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+aYr+WQpuaYr+a4uOWuolxuICAgIGlzT3BlblJlZ2lzdGVyOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+azqOWGjOWKn+iDvVxuICAgIGlzT3BlbklBUDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+iLueaenGlhcFxuICAgIHdFbmNyeXB0SUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICB3Q29kZUNoZWNrSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgZHdVc2VySUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICBkd0dhbWVJRDogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgIGR3RXhwZXJpZW5jZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgIHN6TW9iaWxlQXV0aDogdW5kZWZpbmVkLCAgICAgICAgIC8v5rOo5YaM5pe26aqM6K+B56CBXG4gICAgc3pBY2NvdW50czogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5biQ5Y+3XG4gICAgc3pOaWNrTmFtZTogdW5kZWZpbmVkLCAgICAgICAgICAgLy/njqnlrrbmmLXnp7BcbiAgICBzelBhc3NXb3JkOiB1bmRlZmluZWQsXHRcdFx0Ly/nmbvlvZXlr4bnoIFcbiAgICBzekdyb3VwTmFtZTogdW5kZWZpbmVkLFx0XHRcdC8v56S+5Zui5L+h5oGvXG4gICAgc3pVbmRlcldyaXRlOiB1bmRlZmluZWQsXHQvL+S4quaAp+etvuWQjVxuICAgIFxuICAgIC8v5omp5bGV5L+h5oGvXG4gICAgZHdDdXN0b21GYWNlVmVyOiB1bmRlZmluZWQsXHRcdFx0XHQvL+WktOWDj+eJiOacrFxuICAgIC8v6ZKxXG4gICAgZHdGb3J0dW5lQ29pbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v56aP5biBXG4gICAgbGxHYW1lU2NvcmU6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICBsbEluc3VyZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZO26KGM6YeR5biBXG4gICAgZHdDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v6LSd5aOzXG4gICAgZHdJbnN1cmVDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgIC8v6ZO26KGM6LSd5aOzXG4gICAgZHdNYXRjaFRpY2tldDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v5Y+C6LWb5Yi4XG4gICAgaXNGaXJzdEJhbms6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly8g6aaW5qyh5L2/55SoXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwianNvbi9zaG9wcGFnZVwiLCBmdW5jdGlvbiAoZXJyLCBjb250ZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50KTtcbiAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhID0gY29udGVudDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbFVzZXJEYXRhXVtpbml0XSBcIitKU09OLnN0cmluZ2lmeShzZWxmLnNob3BEYXRhKSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25Mb2FkRGF0YTogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICAvL+aJqeWxleS/oeaBr1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdDdXN0b21GYWNlVmVyO1x0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNb29yTWFjaGluZTtcdFx0XHRcdFx0Ly/plIHlrprmnLrlmahcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JCaW5kV2VpWGluO1x0XHRcdFx0XHQvL+e7keWumuW+ruS/oSBXU0xcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdC8v6ZqP5py656CBMVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdFeHBlcmllbmNlO1x0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0Ly/muLjmiI8gSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEdhbWVTY29yZTtcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEluc3VyZVNjb3JlO1x0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pBY2NvdW50c1tOQU1FX0xFTl07XHRcdFx0Ly/nmbvlvZXluJDlj7dcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6Tmlja05hbWVbTkFNRV9MRU5dO1x0XHRcdC8v5pi156ewXG4gICAgICAgIC8vIH07XG4gICAgICAgIHRoaXMuZHdDdXN0b21GYWNlVmVyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuY2JNb29yTWFjaGluZSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JCaW5kV2VpWGluID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy53RmFjZUlEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5jYk1lbWJlciA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JHZW5kZXIgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLndFbmNyeXB0SUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndDb2RlQ2hlY2tJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdFeHBlcmllbmNlID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdHYW1lSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmxsR2FtZVNjb3JlID0gcERhdGEucmVhZGludDY0KCk7XG4gICAgICAgIHRoaXMubGxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpO1xuICAgICAgICB0aGlzLnN6QWNjb3VudHMgPSBwRGF0YS5yZWFkc3RyaW5nKDMyKTtcbiAgICAgICAgdGhpcy5zek5pY2tOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YodGhpc1twcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLicgKyBwcm9wLCAnPScsIHRoaXNbcHJvcF0pO1xuICAgICAgICB9XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsVXNlckRhdGE7IiwicmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlZmF1bHRzLCBzZXQgdmlzdWFsbHkgd2hlbiBhdHRhY2hpbmcgdGhpcyBzY3JpcHQgdG8gdGhlIENhbnZhc1xuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkISdcbiAgICB9LFxuICAgIC8vIG5hbWU6IFwiaGVsbG9GcmFtZVwiLFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBqc2JUZXN0LnRlc3Rsb2coKTtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyB0aGlzLnNvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQoZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2JlZ2luJyk7XG4gICAgICAgIC8vICAgICAvLyB2YXIgbWFpbklEID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICAvLyAgICAgLy8gdmFyIHN1YklEID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhtYWluSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coc3ViSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2VuZCcpO1xuICAgICAgICAvLyAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIC8vIHZhciBwRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgLy8gLy8gcERhdGEuc2V0Y21kaW5mbygyLDMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaHdvcmQoMjMzMzMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoZG91YmxlKDEyMy4zNDM0KTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0bWFpbigpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0c3ViKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkYnl0ZSgpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZHdvcmQoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRkb3VibGUoKSk7XG4gICAgICAgIC8vIHRoaXMuc29ja2V0LkNvbm5lY3RTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KTtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSB0aGlzLnRleHQ7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBvblNvY2tldENhbGxCYWNrOiBmdW5jdGlvbihwRGF0YSkge1xuICAgIC8vICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdmFyIG1haW4gPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgLy8gICAgIHZhciBzdWIgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ21haW4gPSAnK21haW4rJyBzdWIgPSAnK3N1Yik7XG4gICAgLy8gICAgIGlmIChtYWluID09PSAwKSBcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgaWYoc3ViID09PSAwKVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZWxzZVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZWxzZVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQocERhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGVsbG9fb25Db25uZWN0Q29tcGVsZXRlZCcpO1xuICAgIH0sXG4gICAgLy8gb25Tb2NrZXRFcnJvcjpmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdvblNvY2tldEVycm9yJyk7XG4gICAgLy8gfSxcbiAgICAvLyBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwib25Tb2NrZXRFdmVudFwiKTtcbiAgICAvLyB9LFxuICAgIHNlbmRMb2dvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjE3NjAyMTcwMzEzXCIsMzIpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH1cbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xudmFyIGdhbWVfY21kID0gcmVxdWlyZShcIkNNRF9HYW1lXCIpO1xudmFyIHBsYXphX2NtZCA9IHJlcXVpcmUoXCJDTURfUGxhemFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVNlcnZlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVNlcnZlckl0ZW1cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAvLyBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgLy8gfVxuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDEpe1xuICAgICAgICAgIHRoaXMuc2VuZFJlZ2lzdGVyKCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMuX2xvZ29uTW9kZSA9PT0gMil7XG4gICAgICAgICAgdGhpcy5zZW5kVmlzaXRvcigpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuacquefpeeZu+W9leaooeW8j1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmKG1haW4gPT09IHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFKXtcbiAgICAgICAgICAgIHRoaXMub25TdWJMb2dvbkV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NFUlZFUl9MSVNUKXtcbiAgICAgICAgICAgIHRoaXMub25Sb29tTGlzdEV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NZU1RFTSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLns7vnu5/mtojmga9cIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViTG9nb25FdmVudDogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmIChzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUpe1xuICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEub25Mb2FkRGF0YShwRGF0YSk7XG4gICAgICAgICAgICB2YXIgYlJlbWVtYmVyUHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIpO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNHdWVzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChiUmVtZW1iZXJQd2QgPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudCcsIHRoaXMuX3N6QWNjb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGFzc3dvcmQnLCB0aGlzLl9zelBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudCcpO1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Bhc3N3b3JkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ29uIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiTG9nb25TdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1YiA9PT0gcGxhemFfY21kLlNVQl9HUF9MT0dPTl9FUlJPUl9NT0JJTEUpIHtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX0ZJTklTSF9NT0JJTEUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGZpbmlzaFwiKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICAgICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJvb21MaXN0RXZlbnQ6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgb25Sb29tTGlzdEV2ZW50XCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1RZUEU6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9UWVBFXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfS0lORDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX0tJTkRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9TVEFUSU9OOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfU1RBVElPTlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1NFUlZFUjpcbiAgICAgICAgICAgICAgICB2YXIgcEdhbWVTZXJ2ZXIgPSBuZXcgR2FtZVNlcnZlckl0ZW0oKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtOWIl+ihqOe7k+aehFxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdHYW1lU2VydmVyXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTb3J0SUQ7XHRcdFx0XHRcdFx0XHQvL+aOkuW6j+WPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdLaW5kSUQ7XHRcdFx0XHRcdFx0XHQvL+WQjeensOWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTZXJ2ZXJJRDtcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1N0YXRpb25JRDtcdFx0XHRcdFx0XHRcdC8v56uZ54K55Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NlcnZlclBvcnQ7XHRcdFx0XHRcdFx0Ly/miL/pl7Tnq6/lj6NcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdTZXJ2ZXJBZGRyO1x0XHRcdFx0XHRcdC8v5oi/6Ze05Zyw5Z2AXG4gICAgICAgICAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3T25MaW5lQ291bnQ7XHRcdFx0XHRcdFx0Ly/lnKjnur/kurrmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pTZXJ2ZXJOYW1lW1NFUlZFUl9MRU5dO1x0XHRcdC8v5oi/6Ze05ZCN56ewXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICBwR2FtZVNlcnZlci5vbkluaXQocERhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcEdhbWVTZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihwR2FtZVNlcnZlcltwcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BHYW1lU2VydmVyLicgKyBwcm9wLCAnPScsIHBHYW1lU2VydmVyW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocEdhbWVTZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VuZExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6QWNjb3VudCwzMik7XG4gICAgICAgIC8vIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMjVkNTVhZDI4M2FhNDAwYWY0NjRjNzZkNzEzYzA3YWRcIiwzMyk7XG4gICAgICAgIGlmIChHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0KSB7XG4gICAgICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyh0aGlzLl9zelBhc3N3b3JkLDMzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoY2MubWQ1RW5jb2RlKHRoaXMuX3N6UGFzc3dvcmQpLDMzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIlwiLDMzKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH0sXG4gICAgc2VuZFJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgdmFyIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlckRhdGEuc2V0Y21kaW5mbyhwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSxwbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX01PQklMRSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNod29yZCgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hieXRlKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKGR3TW9iaWxlU3lzVHlwZSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoempoX2NtZC5LSU5EX0lEKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pSZWdBY2NvdW50LDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcoY2MubWQ1RW5jb2RlKHRoaXMuX3N6UmVnUGFzc3dvcmQpLDMzKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pNb2JpbGVQaG9uZSwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6Tmlja05hbWUsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek1vYmlsZUF1dGgsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyhcIlwiLDMzKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShyZWdpc3RlckRhdGEpO1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNNb2JsaWVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RmFjZUlEO1x0XHRcdFx0XHRcdC8vIOWktOWDj+agh+ivhlxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHQvLyDnlKjmiLfmgKfliKtcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlU3lzVHlwZTtcdFx0XHRcdC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlQXBwS2luZDtcdFx0XHRcdC8vIOW5v+WcuuaJi+acuueJiOacrFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBWZXJzaW9uO1x0XHRcdFx0Ly8g5bm/5Zy65omL5py654mI5pysXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzekFjY291bnRzW05BTUVfTEVOXTtcdFx0XHQvLyDnmbvlvZXluJDlj7dcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6UGFzc1dvcmRbUEFTU19MRU5dO1x0XHRcdC8vIOeZu+W9leWvhueggVxuICAgICAgICAvLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVwaG9uZVtNT0JJTEVQSE9ORV9MRU5dOyAvLyDmiYvmnLpcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6Tmlja05hbWVbTkFNRV9MRU5dO1x0XHRcdC8vIOaYteensFxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pNb2JpbGVBdXRoW05BTUVfTEVOXTtcdFx0XHQvL+aJi+acuumqjOivgeeggVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbiAgICAgICAgLy8gfTtcbiAgICB9LFxuICAgIHNlbmRWaXNpdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICB9LFxuICAgIG9uTG9nb25CeUFjY291bnQ6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuX3N6QWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBcIjAxMjM0NTY3ODlcIjtcbiAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAwO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XSBcIitzekFjY291bnQrXCIgIyBcIisgc3pQYXNzd29yZCk7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25Mb2dvbkJ5VmlzaXRvcjogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQpIHtcbiAgICAgICAgdGhpcy5fc3pBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelBhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IFwiMDEyMzQ1Njc4OVwiO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAyO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeVZpc2l0b3JdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeVZpc2l0b3JdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkLHN6Tmlja05hbWUsc3pNb2JpbGVBdXRoKSB7XG4gICAgICAgIHRoaXMuX3N6UmVnQWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pSZWdQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6Tmlja05hbWUgPSBzek5pY2tOYW1lO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zek1vYmlsZUF1dGggPSBzek1vYmlsZUF1dGg7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDE7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25SZWdpc3Rlcl1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25SZWdpc3Rlcl1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBsb2dvblZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lzdGVyVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9hZF1cIik7XG4gICAgICAgIEdsb2JhbFVzZXJEYXRhLmluaXQoKTtcbiAgICAgICAgdGhpcy5fbG9nb25GcmFtZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJMb2dvbkZyYW1lXCIpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25Mb2dvbicsdGhpcy5vbkxvZ29uLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25TaG93UmVnaXN0ZXInLHRoaXMub25TaG93UmVnaXN0ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvblJlZ2lzdGVyJyx0aGlzLm9uUmVnaXN0ZXIsdGhpcyk7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uTG9nb24nLHRoaXMub25Mb2dvbix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvblNob3dSZWdpc3RlcicsdGhpcy5vblNob3dSZWdpc3Rlcix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvblJlZ2lzdGVyJyx0aGlzLm9uUmVnaXN0ZXIsdGhpcyk7XG4gICAgfSxcbiAgICBvbkxvZ29uOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvZ29uXVwiKTtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IGV2ZW50LmRldGFpbC5zekFjY291bnQ7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gZXZlbnQuZGV0YWlsLnN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX2xvZ29uRnJhbWUub25Mb2dvbkJ5QWNjb3VudChzekFjY291bnQsc3pQYXNzd29yZCk7XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93UG9wV2FpdGluZyhjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHtcbiAgICAgICAgICAgIGNsb3NlRXZlbnQ6IFwiTG9nb25TdWNjZXNzXCIsXG4gICAgICAgICAgICBjYWxsQmFja0Z1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvZ29uXSBjYWxsYmFja2Z1bmNcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblJlZ2lzdGVyXVwiKTtcbiAgICAgIHZhciBzekFjY291bnQgPSBldmVudC5kZXRhaWwuc3pBY2NvdW50O1xuICAgICAgdmFyIHN6UGFzc3dvcmQgPSBldmVudC5kZXRhaWwuc3pQYXNzd29yZDtcbiAgICAgIHZhciBzek5pY2tOYW1lID0gZXZlbnQuZGV0YWlsLnN6Tmlja05hbWU7XG4gICAgICB2YXIgc3pNb2JpbGVBdXRoID0gZXZlbnQuZGV0YWlsLnN6TW9iaWxlQXV0aDtcbiAgICAgIGlmKHN6QWNjb3VudCA9PT0gdW5kZWZpbmVkIHx8IHN6UGFzc3dvcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uUmVnaXN0ZXJdIHN6QWNjb3VudCBvciBzelBhc3N3b3JkIGlzIHVuZGVmaW5lZFwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9sb2dvbkZyYW1lLm9uUmVnaXN0ZXIoc3pBY2NvdW50LHN6UGFzc3dvcmQsc3pOaWNrTmFtZSxzek1vYmlsZUF1dGgpO1xuICAgIH0sXG4gICAgb25TaG93TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fbG9nb25WaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5sb2dvblZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX2xvZ29uVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fbG9nb25WaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd0xvZ29uXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvblNob3dWaXN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXVwiKTtcbiAgICAgICAgLy8gR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5ri45a6i55m75b2V5pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgIHVybCArPSBcIi9HdWVzdC9HdWVzdExvZ2luLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJraW5kaWRcIl0gPSB6amhfY21kLktJTkRfSUQ7XG4gICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRlbnRpdHlcIl0gPSBcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCI7XG4gICAgICAgIHBhcmFtc1tcImNoYW5uZWxpZFwiXSA9IEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMVwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzID0gdmFsdWUudXNlcm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSB2YWx1ZS5wd2Q7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJQbGF6YVNjZW5lXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9sb2dvbkZyYW1lLm9uTG9nb25CeVZpc2l0b3IoR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyxHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiR3Vlc3RMb2dpbkNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgY2xvc2VFdmVudDogXCJHdWVzdExvZ2luQ29tcGxldGVkXCIsXG4gICAgICAgICAgICBjYWxsQmFja0Z1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdIGNhbGxiYWNrZnVuY1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvblNob3dSZWdpc3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykgPT09IHRydWUpe1xuICAgICAgICAgICAgdGhpcy5fbG9nb25WaWV3LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjYy5pc1ZhbGlkKHRoaXMuX3JlZ2lzdGVyVmlldykgPT09IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMucmVnaXN0ZXJWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9yZWdpc3RlclZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3JlZ2lzdGVyVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dSZWdpc3Rlcl1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX2VkaXRib3hfYWNjb3VudDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3Bhc3N3b3JkOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2NoZWNrYm94OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZih0aGlzLm1fY2hlY2tib3gpIHtcbiAgICAgICAgICAgIHZhciBwd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwd2RcIik7XG4gICAgICAgICAgICB2YXIgYlJlbWVtYmVyUHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gaXMgXCIgKyBiUmVtZW1iZXJQd2QpO1xuICAgICAgICAgICAgaWYgKGJSZW1lbWJlclB3ZCA9PSAndHJ1ZScgfHwgYlJlbWVtYmVyUHdkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIGNoZWNrXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubV9jaGVja2JveC5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHZhciBzekFjY291bnQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50XCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwYXNzd29yZFwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nID0gc3pBY2NvdW50O1xuICAgICAgICAgICAgICAgIHRoaXMubV9lZGl0Ym94X3Bhc3N3b3JkLnN0cmluZyA9IHN6UGFzc3dvcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gdW5jaGVja1wiKVxuICAgICAgICAgICAgICAgIHRoaXMubV9jaGVja2JveC51bmNoZWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkxvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IHRoaXMubV9lZGl0Ym94X3Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvZ29uXSBcIitzekFjY291bnQrXCIgIyBcIitzelBhc3N3b3JkKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uTG9nb25cIix7c3pBY2NvdW50OnN6QWNjb3VudCxzelBhc3N3b3JkOnN6UGFzc3dvcmR9KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTsgIFxuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tSZWdpc3RlckJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvblNob3dSZWdpc3RlclwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tGb3JnZXRQYXNzd29yZDogZnVuY3Rpb24oKXtcbiAgICAgICAgY2Muc3lzLm9wZW5VUkwoR2xvYmFsRGVmLmh0dHBPcGVuVXJsKTtcbiAgICB9LFxuICAgIGNoZWNrQm94Q2xpY2tlZDogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBpZiAodG9nZ2xlLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtjaGVja0JveENsaWNrZWRdIGlzIGNoZWNrZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW2NoZWNrQm94Q2xpY2tlZF0gaXMgdW5jaGVja2VkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJSZW1lbWJlclB3ZFwiLCB0b2dnbGUuaXNDaGVja2VkKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLm1kNUVuY29kZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGZvciB0ZXN0L2RlYnVnXG4gICAgZnVuY3Rpb24gZmZsb2cobXNnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBudW1iZXIgdG8gKHVuc2lnbmVkKSAzMiBiaXQgaGV4LCB6ZXJvIGZpbGxlZCBzdHJpbmdcbiAgICBmdW5jdGlvbiB0b196ZXJvZmlsbGVkX2hleChuKSB7XG4gICAgICAgIHZhciB0MSA9IChuID4+PiAyNCkudG9TdHJpbmcoMTYpO1xuICAgICAgICB2YXIgdDIgPSAobiAmIDB4MDBGRkZGRkYpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgcmV0dXJuIFwiMDBcIi5zdWJzdHIoMCwgMiAtIHQxLmxlbmd0aCkgKyB0MSArXG4gICAgICAgICAgICBcIjAwMDAwMFwiLnN1YnN0cigwLCA2IC0gdDIubGVuZ3RoKSArIHQyO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYXJyYXkgb2YgY2hhcnMgdG8gYXJyYXkgb2YgYnl0ZXMgKG5vdGU6IFVuaWNvZGUgbm90IHN1cHBvcnRlZClcbiAgICBmdW5jdGlvbiBjaGFyc190b19ieXRlcyhhYykge1xuICAgICAgICB2YXIgcmV0dmFsID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJldHZhbCA9IHJldHZhbC5jb25jYXQoc3RyX3RvX2J5dGVzKGFjW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9XG5cblxuICAgIC8vIGNvbnZlcnQgYSA2NCBiaXQgdW5zaWduZWQgbnVtYmVyIHRvIGFycmF5IG9mIGJ5dGVzLiBMaXR0bGUgZW5kaWFuXG4gICAgZnVuY3Rpb24gaW50NjRfdG9fYnl0ZXMobnVtKSB7XG4gICAgICAgIHZhciByZXR2YWwgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgICAgIHJldHZhbC5wdXNoKG51bSAmIDB4RkYpO1xuICAgICAgICAgICAgbnVtID0gbnVtID4+PiA4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfVxuXG4gICAgLy8gIDMyIGJpdCBsZWZ0LXJvdGF0aW9uXG4gICAgZnVuY3Rpb24gcm9sKG51bSwgcGxhY2VzKSB7XG4gICAgICAgIHJldHVybiAoKG51bSA8PCBwbGFjZXMpICYgMHhGRkZGRkZGRikgfCAobnVtID4+PiAoMzIgLSBwbGFjZXMpKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgNCBNRDUgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gZkYoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gKGIgJiBjKSB8ICh+YiAmIGQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZHKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIChkICYgYikgfCAofmQgJiBjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmSChiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiBiIF4gYyBeIGQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkkoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gYyBeIChiIHwgfmQpO1xuICAgIH1cblxuICAgIC8vIHBpY2sgNCBieXRlcyBhdCBzcGVjaWZpZWQgb2Zmc2V0LiBMaXR0bGUtZW5kaWFuIGlzIGFzc3VtZWRcbiAgICBmdW5jdGlvbiBieXRlc190b19pbnQzMihhcnIsIG9mZikge1xuICAgICAgICByZXR1cm4gKGFycltvZmYgKyAzXSA8PCAyNCkgfCAoYXJyW29mZiArIDJdIDw8IDE2KSB8IChhcnJbb2ZmICsgMV0gPDwgOCkgfCAoYXJyW29mZl0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgIENvbnZlciBzdHJpbmcgdG8gYXJyYXkgb2YgYnl0ZXMgaW4gVVRGLTggZW5jb2RpbmdcbiAgICAgU2VlOlxuICAgICBodHRwOi8vd3d3LmRhbmdyb3NzbWFuLmluZm8vMjAwNy8wNS8yNS9oYW5kbGluZy11dGYtOC1pbi1qYXZhc2NyaXB0LXBocC1hbmQtbm9uLXV0ZjgtZGF0YWJhc2VzL1xuICAgICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNDA0MDgvcmVhZGluZy1ieXRlcy1mcm9tLWEtamF2YXNjcmlwdC1zdHJpbmdcbiAgICAgSG93IGFib3V0IGEgU3RyaW5nLmdldEJ5dGVzKDxFTkNPRElORz4pIGZvciBKYXZhc2NyaXB0IT8gSXNuJ3QgaXQgdGltZSB0byBhZGQgaXQ/XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyX3RvX2J5dGVzKHN0cikge1xuICAgICAgICAvLyBhbGVydChcImdvdCBcIiArIHN0ci5sZW5ndGggKyBcIiBjaGFyc1wiKVxuICAgICAgICB2YXIgcmV0dmFsID0gWyBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKSB7XG4gICAgICAgICAgICAgICAgcmV0dmFsLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5jaGFyQXQoaSkpLnN1YnN0cigxKS5zcGxpdCgnJScpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG1wLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKHBhcnNlSW50KHRtcFtqXSwgMHgxMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9O1xuXG5cblxuXG4gICAgLy8gY29udmVydCB0aGUgNCAzMi1iaXQgYnVmZmVycyB0byBhIDEyOCBiaXQgaGV4IHN0cmluZy4gKExpdHRsZS1lbmRpYW4gaXMgYXNzdW1lZClcbiAgICBmdW5jdGlvbiBpbnQxMjhsZV90b19oZXgoYSwgYiwgYywgZCkge1xuICAgICAgICB2YXIgcmEgPSBcIlwiO1xuICAgICAgICB2YXIgdCA9IDA7XG4gICAgICAgIHZhciB0YSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAzOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdGEgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICB0ID0gKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgdGE7XG4gICAgICAgICAgICByYSA9IHJhICsgdG9femVyb2ZpbGxlZF9oZXgodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJhO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlucHV0IGRhdGEgdHlwZSBhbmQgcGVyZm9ybSBjb252ZXJzaW9ucyBpZiBuZWVkZWRcbiAgICB2YXIgZGF0YWJ5dGVzID0gbnVsbDtcbiAgICAvLyBTdHJpbmdcbiAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gY29udmVydCBzdHJpbmcgdG8gYXJyYXkgYnl0ZXNcbiAgICAgICAgZGF0YWJ5dGVzID0gc3RyX3RvX2J5dGVzKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgZW1wdHksIGp1c3QgYXNzdW1lIGFycmF5IG9mIGJ5dGVzXG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBkYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhWzBdID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBjaGFyc190b19ieXRlcyhkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVswXSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZmbG9nKFwiaW5wdXQgZGF0YSB0eXBlIG1pc21hdGNoXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmZmxvZyhcImlucHV0IGRhdGEgdHlwZSBtaXNtYXRjaFwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gc2F2ZSBvcmlnaW5hbCBsZW5ndGhcbiAgICB2YXIgb3JnX2xlbiA9IGRhdGFieXRlcy5sZW5ndGg7XG5cbiAgICAvLyBmaXJzdCBhcHBlbmQgdGhlIFwiMVwiICsgN3ggXCIwXCJcbiAgICBkYXRhYnl0ZXMucHVzaCgweDgwKTtcblxuICAgIC8vIGRldGVybWluZSByZXF1aXJlZCBhbW91bnQgb2YgcGFkZGluZ1xuICAgIHZhciB0YWlsID0gZGF0YWJ5dGVzLmxlbmd0aCAlIDY0O1xuICAgIC8vIG5vIHJvb20gZm9yIG1zZyBsZW5ndGg/XG4gICAgaWYgKHRhaWwgPiA1Nikge1xuICAgICAgICAvLyBwYWQgdG8gbmV4dCA1MTIgYml0IGJsb2NrXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgKDY0IC0gdGFpbCk7IGkrKykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzLnB1c2goMHgwKTtcbiAgICAgICAgfVxuICAgICAgICB0YWlsID0gZGF0YWJ5dGVzLmxlbmd0aCAlIDY0O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgKDU2IC0gdGFpbCk7IGkrKykge1xuICAgICAgICBkYXRhYnl0ZXMucHVzaCgweDApO1xuICAgIH1cbiAgICAvLyBtZXNzYWdlIGxlbmd0aCBpbiBiaXRzIG1vZCA1MTIgc2hvdWxkIG5vdyBiZSA0NDhcbiAgICAvLyBhcHBlbmQgNjQgYml0LCBsaXR0bGUtZW5kaWFuIG9yaWdpbmFsIG1zZyBsZW5ndGggKGluICpiaXRzKiEpXG4gICAgZGF0YWJ5dGVzID0gZGF0YWJ5dGVzLmNvbmNhdChpbnQ2NF90b19ieXRlcyhvcmdfbGVuICogOCkpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSA0eDMyIGJpdCBzdGF0ZVxuICAgIHZhciBoMCA9IDB4Njc0NTIzMDE7XG4gICAgdmFyIGgxID0gMHhFRkNEQUI4OTtcbiAgICB2YXIgaDIgPSAweDk4QkFEQ0ZFO1xuICAgIHZhciBoMyA9IDB4MTAzMjU0NzY7XG5cbiAgICAvLyB0ZW1wIGJ1ZmZlcnNcbiAgICB2YXIgYSA9IDAsXG4gICAgICAgIGIgPSAwLFxuICAgICAgICBjID0gMCxcbiAgICAgICAgZCA9IDA7XG5cblxuICAgIGZ1bmN0aW9uIF9hZGQobjEsIG4yKSB7XG4gICAgICAgIHJldHVybiAweDBGRkZGRkZGRiAmIChuMSArIG4yKVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHVwZGF0ZSBwYXJ0aWFsIHN0YXRlIGZvciBlYWNoIHJ1blxuICAgIHZhciB1cGRhdGVSdW4gPSBmdW5jdGlvbihuZiwgc2luMzIsIGR3MzIsIGIzMikge1xuICAgICAgICB2YXIgdGVtcCA9IGQ7XG4gICAgICAgIGQgPSBjO1xuICAgICAgICBjID0gYjtcbiAgICAgICAgLy9iID0gYiArIHJvbChhICsgKG5mICsgKHNpbjMyICsgZHczMikpLCBiMzIpO1xuICAgICAgICBiID0gX2FkZChiLFxuICAgICAgICAgICAgcm9sKFxuICAgICAgICAgICAgICAgIF9hZGQoYSxcbiAgICAgICAgICAgICAgICAgICAgX2FkZChuZiwgX2FkZChzaW4zMiwgZHczMikpXG4gICAgICAgICAgICAgICAgKSwgYjMyXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGEgPSB0ZW1wO1xuICAgIH07XG5cblxuICAgIC8vIERpZ2VzdCBtZXNzYWdlXG4gICAgZm9yIChpID0gMDsgaSA8IGRhdGFieXRlcy5sZW5ndGggLyA2NDsgaSsrKSB7XG4gICAgICAgIC8vIGluaXRpYWxpemUgcnVuXG4gICAgICAgIGEgPSBoMDtcbiAgICAgICAgYiA9IGgxO1xuICAgICAgICBjID0gaDI7XG4gICAgICAgIGQgPSBoMztcblxuICAgICAgICB2YXIgcHRyID0gaSAqIDY0O1xuXG4gICAgICAgIC8vIGRvIDY0IHJ1bnNcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGQ3NmFhNDc4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZThjN2I3NTYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDI0MjA3MGRiLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhjMWJkY2VlZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGY1N2MwZmFmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg0Nzg3YzYyYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGE4MzA0NjEzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmQ0Njk1MDEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg2OTgwOThkOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4OGI0NGY3YWYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZmZmNWJiMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDg5NWNkN2JlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NmI5MDExMjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZkOTg3MTkzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YTY3OTQzOGUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg0OWI0MDgyMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGY2MWUyNTYyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGMwNDBiMzQwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyNjVlNWE1MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGU5YjZjN2FhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGQ2MmYxMDVkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyNDQxNDUzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhkOGExZTY4MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGU3ZDNmYmM4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjFlMWNkZTYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGMzMzcwN2Q2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmNGQ1MGQ4NywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDQ1NWExNGVkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YTllM2U5MDUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGZjZWZhM2Y4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDY3NmYwMmQ5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4OGQyYTRjOGEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmZmZhMzk0MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ODc3MWY2ODEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg2ZDlkNjEyMiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGZkZTUzODBjLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YTRiZWVhNDQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NGJkZWNmYTksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmNmJiNGI2MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGJlYmZiYzcwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4Mjg5YjdlYzYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGVhYTEyN2ZhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGQ0ZWYzMDg1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NDg4MWQwNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGQ5ZDRkMDM5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhlNmRiOTllNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDFmYTI3Y2Y4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YzRhYzU2NjUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGY0MjkyMjQ0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NDMyYWZmOTcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhhYjk0MjNhNywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZjOTNhMDM5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NjU1YjU5YzMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDhmMGNjYzkyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmZlZmY0N2QsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg4NTg0NWRkMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NmZhODdlNGYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZlMmNlNmUwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YTMwMTQzMTQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg0ZTA4MTFhMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGY3NTM3ZTgyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhiZDNhZjIzNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDJhZDdkMmJiLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhlYjg2ZDM5MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDIxKTtcblxuICAgICAgICAvLyB1cGRhdGUgYnVmZmVyc1xuICAgICAgICBoMCA9IF9hZGQoaDAsIGEpO1xuICAgICAgICBoMSA9IF9hZGQoaDEsIGIpO1xuICAgICAgICBoMiA9IF9hZGQoaDIsIGMpO1xuICAgICAgICBoMyA9IF9hZGQoaDMsIGQpO1xuICAgIH1cbiAgICAvLyBEb25lISBDb252ZXJ0IGJ1ZmZlcnMgdG8gMTI4IGJpdCAoTEUpXG4gICAgcmV0dXJuIGludDEyOGxlX3RvX2hleChoMywgaDIsIGgxLCBoMCkudG9Mb3dlckNhc2UoKTtcbn07XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc2V0dGluZ1ZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJQcm9maWxlVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYmFua1ZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX25hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VyR29sZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF6YSBvbkxvYWRcIik7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoVUldXCIpO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKEdsb2JhbFVzZXJEYXRhW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9uYW1lLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWU7XG4gICAgICAgIHZhciBmYWNlSUQgPSBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICBpZiAoZmFjZUlEIDw9IDAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuICAgIH0sXG4gICAgcmVmcmVzaERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6R2FtZVVzZXJJbmZvLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoRGF0YV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUgPSB2YWx1ZS5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaW5zdXJlc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZSA9IHZhbHVlLmluc3VyZXNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5hY2NvdW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzID0gdmFsdWUuYWNjb3VudHM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmdhbWVpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5kd0dhbWVJRCA9IHZhbHVlLmdhbWVpZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZmFjZWlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLndGYWNlSUQgPSB2YWx1ZS5mYWNlaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmdlbmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5jYkdlbmRlciA9IHZhbHVlLmdlbmRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaXNndWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gdmFsdWUuaXNndWVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubmlja25hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZSA9IHZhbHVlLm5pY2tuYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hEYXRhXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2VTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VOYW1lU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQmFua1N1Y2Nlc3MnLHRoaXMub25CYW5rU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkVuYWJsZV1cIik7XG5cbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VOYW1lU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHZhciBmYWNlSUQgPSBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICAvLyBpZiAoZmFjZUlEIDw9IDAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAvLyAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuICAgICAgICB0aGlzLnJlZnJlc2hEYXRhKCk7XG4gICAgfSxcbiAgICBvbkNoYW5nZU5hbWVTdWNjZXNzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7ICBcbiAgICB9LFxuICAgIG9uQmFua1N1Y2Nlc3M6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTsgIFxuICAgIH0sXG4gICAgb25DbGlja1NldHRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9zZXR0aW5nVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5nVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2V0dGluZ1ZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3NldHRpbmdWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9zZXR0aW5nVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTZXR0aW5nXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvbkNsaWNrVXNlclByb2ZpbGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fdXNlclByb2ZpbGVWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJQcm9maWxlVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlclByb2ZpbGVWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl91c2VyUHJvZmlsZVZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3VzZXJQcm9maWxlVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja0NsaWVudDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDbGllbnRdXCIpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlrqLmnI3lip/og73mmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tBY3Rpdml0eTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW2NvbkNsaWNrQWN0aXZpdHldXCIpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCYW5rOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bY29uQ2xpY2tCYW5rXVwiKTtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fYmFua1ZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fYmFua1ZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJhbmtWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9iYW5rVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fYmFua1ZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQmFua11BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja1Nob3A6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2hvcF1cIik7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3Nob3BWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX3Nob3BWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5zaG9wVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fc2hvcFZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3Nob3BWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1Nob3BdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfY29udGVudDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX3dhaXRJY29uOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uTG9hZF1cIik7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX3dhaXRpbmdUZXh0ID0gcGFyYW1zLndhaXRpbmdUZXh0IHx8IFwi5q2j5Zyo6L+e5o6l5pyN5Yqh5Zmo77yM6K+356iN5YCZLi4uXCI7XG4gICAgICAgIHRoaXMubV93YWl0aW5nVGltZSA9IHBhcmFtcy53YWl0aW5nVGltZSB8fCA4O1xuICAgICAgICB0aGlzLm1fY2xvc2VFdmVudCA9IHBhcmFtcy5jbG9zZUV2ZW50O1xuICAgICAgICB0aGlzLm1fY2FsbEJhY2tGdW5jID0gcGFyYW1zLmNhbGxCYWNrRnVuYztcbiAgICAgICAgY2MuZGlyZWN0b3Iub24odGhpcy5tX2Nsb3NlRXZlbnQsdGhpcy5vbkNsb3NlRXZlbnQsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNjaGVkdWxlKHRoaXMuY2xvc2UsIHRoaXMsIHRoaXMubV93YWl0aW5nVGltZSk7XG4gICAgICAgIHRoaXMubV9MYWJlbF9jb250ZW50LnN0cmluZyA9IHRoaXMubV93YWl0aW5nVGV4dDtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3dhaXRJY29uLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKGNjLnJvdGF0ZUJ5KDIuMCwzNjAuMCkpKTtcbiAgICB9LFxuICAgIG9uQ2xvc2VFdmVudDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBpZiAodHlwZW9mKHRoaXMubV9jYWxsQmFja0Z1bmMpID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubV9jYWxsQmFja0Z1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSxcbiAgICBvbkVtaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcImhlaGVcIik7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQb3BXYWl0Vmlld11bb25EaXNhYmxlXVwiKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKHRoaXMubV9jbG9zZUV2ZW50LHRoaXMub25DbG9zZUV2ZW50LHRoaXMpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGUgKHRoaXMuY2xvc2UsIHRoaXMpO1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCIgcmVxdWlyZShcIk1ENVwiKTtcbiB2YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbiB2YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbiBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX2VkaXRib3hfYWNjb3VudDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3Bhc3N3b3JkOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfbmFtZTp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3l6bTp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzek5pY2tOYW1lID0gdGhpcy5tX2VkaXRib3hfbmFtZS5zdHJpbmc7XG4gICAgICAgIHZhciBzek1vYmlsZUF1dGggPSB0aGlzLm1fZWRpdGJveF95em0uc3RyaW5nO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIitzekFjY291bnQrXCIgIyBcIitzelBhc3N3b3JkKTtcbiAgICAgICAgaWYgKHN6QWNjb3VudC5sZW5ndGggPD0wIHx8IHN6UGFzc3dvcmQubGVuZ3RoIDw9MCB8fCBzek5pY2tOYW1lLmxlbmd0aCA8PSAwIHx8IHN6TW9iaWxlQXV0aC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW4kOWPt+WvhueggeetieazqOWGjOS/oeaBr+S4jeiDveS4uuepulwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuW4kOWPt+WvhueggeetieazqOWGjOS/oeaBr+S4jeiDveS4uuepulwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3pQYXNzd29yZC5sZW5ndGggPCA2IHx8IHN6UGFzc3dvcmQubGVuZ3RoID4gMTYpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLlr4bnoIHplb/luqbkuLo2LTE25L2NXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDpgJrov4fnlKjmiLfkuK3lv4N3ZWLmjqXlj6Pms6jlhoznlKjmiLdcbiAgICAgICAgdmFyIGlzVXNlckNlbnRlciA9IHRydWU7XG4gICAgICAgIGlmKCFpc1VzZXJDZW50ZXIpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvblJlZ2lzdGVyXCIse1xuICAgICAgICAgICAgICAgIHN6QWNjb3VudDpzekFjY291bnQsXG4gICAgICAgICAgICAgICAgc3pQYXNzd29yZDpzelBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIHN6Tmlja05hbWU6c3pOaWNrTmFtZSxcbiAgICAgICAgICAgICAgICBzek1vYmlsZUF1dGg6c3pNb2JpbGVBdXRoLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICAgICAgdXJsICs9IFwiL1VzZXJDZW50ZXIvVXNlckNlbnRlclJlZ2lzdGVyLmFzaHhcIjtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSAnJztcbiAgICAgICAgICAgIHZhciBub3dUaW1lID0gTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gbm93dGltZSBzZWNvbmRzID0gXCIrbm93VGltZSk7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIntcXFwiVXNlcm5hbWVcXFwiOlxcXCJcIiArIHN6QWNjb3VudCArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIlBhc3N3b3JkXFxcIjpcXFwiXCIgKyBjYy5tZDVFbmNvZGUoc3pQYXNzd29yZCkgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJOaWNrbmFtZVxcXCI6XFxcIlwiICsgc3pOaWNrTmFtZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkRhdGV0YW1wXFxcIjpcXFwiXCIgKyBub3dUaW1lICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgLy/nlJ/miJDnrb7lkI1cbiAgICAgICAgICAgIHZhciBzelNpZ24gPSBcIlwiO1xuICAgICAgICAgICAgc3pTaWduICs9IFwiVXNlck5hbWU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8RGF0ZVRhbXA9XCIgKyBub3dUaW1lO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifENoYW5uZWxJRD1cIiArIEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifE1vYmlsZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxDb2RlPVwiICsgc3pNb2JpbGVBdXRoO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifEtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiO1xuXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJTaWduXFxcIjpcXFwiXCIgKyBjYy5tZDVFbmNvZGUoc3pTaWduKSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkNoYW5uZWxJRFxcXCI6XFxcIlwiICsgR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXIgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJNb2JpbGVcXFwiOlxcXCJcIiArIHN6QWNjb3VudCArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIk1hY2hpbmVOdW1iZXJcXFwiOlxcXCJcIiArICcxJyArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkNvZGVcXFwiOlxcXCJcIiArIHN6TW9iaWxlQXV0aCArIFwiXFxcIn1cIjtcblxuICAgICAgICAgICAgLy9cIlVzZXJOYW1lPSVzfERhdGVUYW1wPSVsbGR8Q2hhbm5lbElEPSVkfE1vYmlsZT0lc3xDb2RlPSVzfEtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICB4aHIuc2VuZChwYXJhbXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIgKyBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrU2VuZEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHJlID0gLzFbMzU3OF1bMC05XXs5fS87XG4gICAgICAgIGlmIChyZS5leGVjKHN6QWNjb3VudCkgPT09IG51bGwpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrU2VuZEJ1dHRvbl0g5omL5py65Y+356CB5LiN5ZCI5rOVXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5omL5py65Y+356CB5LiN5ZCI5rOVXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgIHVybCArPSBcIi9oei9DYXB0Y2hhTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IFwiTW9iaWxlPVwiICsgc3pBY2NvdW50O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tTZW5kQnV0dG9uXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1zKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIgKyBwYXJhbXMpO1xuXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2FjY291bnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2FjY291bnQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cztcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2V0dGluZ1ZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2V0dGluZ1ZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTd2l0Y2hBY2NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9JbWFnZV9zaG9wSXRlbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1BdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIF9zaG9wSUQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBzaG9wSUQgPSBwYXJhbXMuc2hvcElEO1xuICAgICAgICB0aGlzLl9zaG9wSUQgPSBzaG9wSUQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV9zaG9wSXRlbS5zcHJpdGVGcmFtZSA9IHRoaXMuc2hvcEl0ZW1BdGFscy5nZXRTcHJpdGVGcmFtZShcInNob3BfaWNvbl9cIiArIChzaG9wSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcEl0ZW1dW29uQ2xpY2tdIHNob3BJRCA9IFwiK3RoaXMuX3Nob3BJRCk7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoJ29uQ2hhbmdlVXNlckZhY2UnLHtmYWNlSUQ6dGhpcy5fZmFjZUlEKzF9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzaG9wSXRlbVByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1MaXN0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlldyxcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1Db3VudDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zaG9wSXRlbUNvdW50OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2hvcEl0ZW1QcmVmYWIpO1xuICAgICAgICAgICAgdmFyIHNob3BJRDtcbiAgICAgICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmlzT3BlbklBUCl7XG4gICAgICAgICAgICAgICAgc2hvcElEID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHNob3BJRCA9IGluZGV4ICsgNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KFwiU2hvcEl0ZW1cIikuaW5pdCh7c2hvcElEOmluZGV4fSk7XG4gICAgICAgICAgICB0aGlzLnNob3BJdGVtTGlzdC5jb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkxvYWRdIFwiK0pTT04uc3RyaW5naWZ5KEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhKSk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gR2xvYmFsVXNlckRhdGEud0ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICAvLyB0aGlzLl9mYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgLy8gdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgSlNPTi5zdHJpbmdpZnkocGFyYW1zLmRldGFpbCkpO1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VVc2VyRmFjZVwiLHBhcmFtcy5kZXRhaWwpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVG9hc3RWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVG9hc3RWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgc3pUZXh0ID0gcGFyYW1zLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF9jb250ZW50LnN0cmluZyA9IHN6VGV4dDtcbiAgICB9XG5cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2VfdXNlckZhY2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICBfZmFjZUlEOiAwLFxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWNlSUQgPSBwYXJhbXMuZmFjZUlEO1xuICAgICAgICB0aGlzLl9mYWNlSUQgPSBmYWNlSUQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRCkpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZUl0ZW1dW29uQ2xpY2tdIGZhY2VJRCA9IFwiK3RoaXMuX2ZhY2VJRCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoJ29uQ2hhbmdlVXNlckZhY2UnLHtmYWNlSUQ6dGhpcy5fZmFjZUlEKzF9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICB1c2VyRmFjZUl0ZW1QcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlTGlzdDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNjcm9sbFZpZXcsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQ291bnQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy51c2VyRmFjZUNvdW50OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlckZhY2VJdGVtUHJlZmFiKTtcbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KFwiVXNlckZhY2VJdGVtXCIpLmluaXQoe2ZhY2VJRDppbmRleH0pO1xuICAgICAgICAgICAgdGhpcy51c2VyRmFjZUxpc3QuY29udGVudC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLndGYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgdGhpcy5fZmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIHRoaXMub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIEpTT04uc3RyaW5naWZ5KHBhcmFtcy5kZXRhaWwpKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VcIixwYXJhbXMuZGV0YWlsKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEZhY2VJRCA9IHRoaXMuX2ZhY2VJRDtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvVXNlclByb2ZpbGVWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJVc2VyUHJvZmlsZVZpZXdcIikuX2ZhY2VJRCA9IEZhY2VJRDtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fQnV0dG9uX2NoYW5nZU5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgIH0sXG4gICAgICAgIG1fQnV0dG9uX2VkaXROYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfdXNlck5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VySUQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlVmlld1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlR3JvdXAsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlck1hbkJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyV29tYW5CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX1BhbmVsX3VzZXJDaGFuZ2U6IGNjLk5vZGUsXG4gICAgICAgIG1fUGFuZWxfdXNlckluZm86IGNjLk5vZGUsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6Tmlja05hbWUgPSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lO1xuICAgICAgICB2YXIgbGxHYW1lU2NvcmUgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdmFyIGR3VXNlcklEID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBjYkdlbmRlciA9IEdsb2JhbFVzZXJEYXRhLmNiR2VuZGVyIHx8IDE7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJHb2xkLnN0cmluZyA9IGxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlcklELnN0cmluZyA9IFwiSUQ6XCIgKyBkd1VzZXJJRDtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLnN0cmluZyA9IHN6Tmlja05hbWU7XG4gICAgICAgIGlmKCB0aGlzLl9mYWNlSUQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZVVzZXJGYWNlKCk7XG4gICAgICAgICAgICBjYkdlbmRlciA9IE1hdGguZmxvb3IoKHRoaXMuX2ZhY2VJRCAtIDEpLzQpICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmFjZUlEID0gdGhpcy5fZmFjZUlEIHx8IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgaWYgKGNiR2VuZGVyID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2sgPSBcIiArIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2tlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyV29tYW5CdXR0b24uaXNDaGVjayA9IFwiICsgdGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5pc0NoZWNrZWQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIC8vIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgZmFjZUlEKTtcbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlRmFjZUlkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1wiZmFjZUlkXCJdID0gZmFjZUlEO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gXCIgKyBwYXJhbVN0cmluZyk7XG5cbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0VkaXROYW1lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgIC8vIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5lbWl0KGNjLkVkaXRCb3guZWRpdGluZy1kaWQtYmVnYW4pO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZU5hbWU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlck5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgc3pOZXdOaWNrTmFtZSA9IHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnN0cmluZztcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHN6TmV3Tmlja05hbWUubGVuZ3RoIDw9IDAgfHwgc3pOZXdOaWNrTmFtZSA9PSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvSFpNb2JpbGUvVXBkYXRlTmlja05hbWUuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJuaWNrbmFtZVwiXSA9IHN6TmV3Tmlja05hbWU7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NoYW5nZU5hbWVdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzek5pY2tOYW1lID0gdmFsdWUubmlja25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1fTGFiZWxfdXNlck5hbWUuc3RyaW5nID0gc3pOaWNrTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSBzek5pY2tOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlTmFtZVN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ2hhbmdlTmFtZV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHVzZXJGYWNlVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlckZhY2VWaWV3UHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5hZGRDaGlsZCh1c2VyRmFjZVZpZXcpO1xuICAgICAgICAvLyB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHVzZXJGYWNlVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVBhc3N3b3JkOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckluZm8uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckNoYW5nZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzek5ld1Bhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pDb25maXJtUGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICBpZihzelBhc3N3b3JkLmxlbmd0aCA8PSAwIHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoIDw9IDAgfHwgc3pDb25maXJtUGFzc3dvcmQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggeS4jeiDveS4uuepuiFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6UGFzc3dvcmQgPT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pDb25maXJtUGFzc3dvcmQgIT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pOZXdQYXNzd29yZC5sZW5ndGggPCA2IHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlUGFzc1dvcmQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIxXCI7XG4gICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzd29yZCk7XG4gICAgICAgIHBhcmFtc1tcIm5ld3Bhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzd29yZCk7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IGNjLm1kNUVuY29kZShzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJJbmZvLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9QYW5lbF91c2VyQ2hhbmdlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VQYXNzd29yZFN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzcGxhc2g6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBfc3RlcDogMCxcbiAgICAgICAgX2NvdW50OiAwLFxuICAgICAgICBrRGVzaWduRnJhbWVSYXRlOiA2MC4wLFxuICAgICAgICBrU3BsYXNoU3RlcExvZ28xU3RpbGw6IDAsXG4gICAgICAgIGtTcGxhc2hTdGVwTG9nbzFGYWRlT3V0OiAxLFxuICAgICAgICBrU3BsYXNoRmFkZVRpbWU6IDAuNSxcbiAgICAgICAga1NwbGFzaFN0aWxsVGltZTogMi4wLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICB0aGlzLl9zdGVwID0gMDtcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgIC8vIH0sIDIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHRoaXMuX2NvdW50ICs9IGR0O1xuICAgICAgICBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xU3RpbGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoU3RpbGxUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGVwICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xRmFkZU91dClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoRmFkZVRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxhc2guYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgICAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG9wID0gMjU1ICogKDEuMCAtIE1hdGguc2luKCh0aGlzLl9jb3VudC8xLjApICogMC41ICogTWF0aC5QSSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsYXNoLm9wYWNpdHkgPSBvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=