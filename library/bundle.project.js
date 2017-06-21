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
            if (Number(szGoldCount) <= 0 || Number(szGoldCount) > GlobalUserData.llInsureScore) {
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
            if (Number(szGoldCount) <= 0 || Number(szGoldCount) > Number(GlobalUserData.llGameScore)) {
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
        console.log("[ChoosePayTypeView][init] " + JSON.stringify(this._params));
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0917fhGquREZ5AtcS81ZpEL', 'GameFrame');
// Script/plaza/models/GameFrame.js

"use strict";

var BaseFrame = require("BaseFrame");
require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var zjh_cmd = require("CMD_ZaJinHua");
var GlobalUserData = require("GlobalUserData");
var GameServerItem = require("GameServerItem");
var GlobalDef = require("GlobalDef");
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
        this._userList = {};
        this._tableUserList = {};
        this._tableStatus = {};
        this._wTableID = GlobalDef.INVALID_TABLE;
        this._wChairID = GlobalDef.INVALID_CHAIR;
    },
    onConnectCompeleted: function onConnectCompeleted() {
        this.sendLogonPacket();
    },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        if (main === game_cmd.MDM_GR_LOGON) {
            //登录消息
            this.OnSocketMainLogon(sub, pData);
        } else if (main === game_cmd.MDM_GR_USER) {
            //用户消息
            this.OnSocketMainUser(sub, pData);
        } else if (main === game_cmd.MDM_GR_INFO) {
            //配置消息
            this.OnSocketMainInfo(sub, pData);
            console.log("系统消息");
        } else if (main === game_cmd.MDM_GR_STATUS) {
            //状态消息
            this.OnSocketMainStatus(sub, pData);
            console.log("系统消息");
        } else if (main === game_cmd.MDM_GR_SYSTEM) {
            //系统消息
            this.OnSocketMainSystem(sub, pData);
            console.log("系统消息");
        } else if (main === game_cmd.MDM_GR_SERVER_INFO) {
            //房间消息
            this.OnSocketMainServerInfo(sub, pData);
            console.log("系统消息");
        }
        //游戏消息 框架消息 礼物消息
        else if (main === GlobalDef.MDM_GF_GAME || main === GlobalDef.MDM_GF_FRAME || main === GlobalDef.MDM_GF_PRESENT) {
                this.OnSocketMainGameFrame();
                console.log("系统消息");
            }
    },
    OnSocketMainLogon: function OnSocketMainLogon(sub, pData) {
        console.log("[GameFrame][OnSocketMainLogon]");
        if (sub === game_cmd.SUB_GR_LOGON_SUCCESS) {
            console.log("[GameFrame][OnSocketMainLogon] logon success");
            this._userList = {};
            // cc.director.emit("LogonSuccess");
        } else if (sub === game_cmd.SUB_GR_LOGON_ERROR) {
            this.onCloseSocket();
            console.log("logonframe login error");
        } else if (sub === game_cmd.SUB_GR_LOGON_FINISH) {
            console.log("logonframe login finish");
        }
    },
    OnSocketMainUser: function OnSocketMainUser(sub, pData) {
        console.log("[GameFrame][OnSocketMainUser]");
        switch (sub) {
            case game_cmd.SUB_GR_USER_COME:
                console.log("SUB_GR_USER_COME");
                this.OnSocketSubUserCome(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_STATUS:
                console.log("SUB_GR_USER_STATUS");
                this.OnSocketSubStatus(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_SCORE:
                console.log("SUB_GR_USER_SCORE");
                this.OnSocketSubScore(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_RIGHT:
                console.log("SUB_GR_USER_RIGHT");
                this.OnSocketSubRight(sub, pData);
                break;
            case game_cmd.SUB_GR_MEMBER_ORDER:
                console.log("SUB_GR_MEMBER_ORDER");
                this.OnSocketSubMemberOrder(sub, pData);
                break;
            case game_cmd.SUB_GR_SIT_FAILED:
                console.log("SUB_GR_SIT_FAILED");
                this.OnSocketSubSitFailed(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_CHAT:
                console.log("SUB_GR_USER_CHAT");
                this.OnSocketSubChat(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_WISPER:
                console.log("SUB_GR_USER_WISPER");
                this.OnSocketSubWisper(sub, pData);
                break;
            case game_cmd.SUB_GR_USER_INVITE:
                console.log("SUB_GR_USER_INVITE");
                this.OnSocketSubUserInvite(sub, pData);
                break;
            case game_cmd.SUB_GR_QUERY_GOLD:
                console.log("SUB_GR_QUERY_GOLD");
                this.OnSocketSubQueryGold(sub, pData);
                break;
            case game_cmd.SUB_GR_PRESEND_QUERY:
                console.log("SUB_GR_PRESEND_QUERY");
                this.OnSocketSubPresentQuery(sub, pData);
                break;
            case game_cmd.SUB_GR_PRESENT_ERROR:
                console.log("SUB_GR_PRESENT_ERROR");
                // this.OnSocketSubUserCome(sub,pData);
                break;
            default:
                break;
        }
    },
    OnSocketMainInfo: function OnSocketMainInfo(sub, pData) {
        console.log("[GameFrame][OnSocketMainInfo]");
        switch (sub) {
            case game_cmd.SUB_GR_SERVER_INFO:
                console.log("SUB_GR_SERVER_INFO");
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
                break;
            case game_cmd.SUB_GR_TABLE_STATUS:
                console.log("SUB_GR_TABLE_STATUS");
                break;
            default:
                break;
        }
    },
    OnSocketMainSystem: function OnSocketMainSystem(sub, pData) {
        console.log("[GameFrame][OnSocketMainSystem]");
        switch (sub) {
            case game_cmd.SUB_GR_MESSAGE:
                console.log("SUB_GR_MESSAGE");
                break;
            default:
                break;
        }
    },
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
    },
    //用户进入
    OnSocketSubUserCome: function OnSocketSubUserCome(sub, pData) {
        console.log("[GameFrame][OnSocketSubUserCome]");
        var userItem = new GameUserItem();
        userItem.initDataByUserInfoHead(pData);
        console.log("[GameFrame][OnSocketSubUserCome] " + JSON.stringify(userItem));
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
            this.onUpDataTableUser(userItem.wTableID, userItem.wChairID, userItem);
            cc.director.emit("onEventUserEnter", {
                wTableID: userItem.wTableID,
                wChairID: userItem.wChairID,
                userItem: userItem
            });
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
                this.onUpDataTableUser(oldStatus.wTableID, oldStatus.wChairID, undefined);
            }
        }
        //新桌子记录
        if (userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
            this.onUpDataTableUser(userStatus.wTableID, userStatus.wChairID, userItem);
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
                    cc.director.emit("onExitTable");
                }
                //坐下
                else if (userStatus.cbUserStatus > GlobalDef.US_FREE && oldStatus.cbUserStatus < GlobalDef.US_SIT) {
                        console.log("[GameFrame][OnSocketSubStatus] 自己坐下");
                        cc.director.emit("onEnterTable");
                        cc.director.emit("onEventUserStatus", {
                            userItem: userItem,
                            newStatus: userStatus,
                            oldStatus: oldStatus
                        });
                    }
                    //换位
                    else if (userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
                            console.log("[GameFrame][OnSocketSubStatus] 换位");
                            cc.director.emit("onEnterTable");
                            cc.director.emit("onEventUserStatus", {
                                userItem: userItem,
                                newStatus: userStatus,
                                oldStatus: oldStatus
                            });
                        } else {
                            console.log("[GameFrame][OnSocketSubStatus] 自己新状态 " + JSON.stringify(userStatus));
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
    },
    OnSocketSubRight: function OnSocketSubRight(sub, pData) {
        console.log("[GameFrame][OnSocketSubRight]");
    },
    OnSocketSubMemberOrder: function OnSocketSubMemberOrder(sub, pData) {
        console.log("[GameFrame][OnSocketSubMemberOrder]");
    },
    OnSocketSubSitFailed: function OnSocketSubSitFailed(sub, pData) {
        console.log("[GameFrame][OnSocketSubSitFailed]");
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

    onUpDataTableUser: function onUpDataTableUser(tableid, chairid, useritem) {
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
    getTableUserItem: function getTableUserItem(tableid, chairid) {
        var id = tableid;
        var idex = chairid;
        if (this._tableUserList[id]) {
            return this._tableUserList[id][idex];
        }
    },
    getMeUserItem: function getMeUserItem() {
        return this._userList[GlobalUserData.dwUserID];
    },
    searchUserByUserID: function searchUserByUserID(dwUserID) {
        return this._userList[dwUserID];
    },
    onRemoveUser: function onRemoveUser(dwUserID) {
        this._userList[dwUserID] = undefined;
    }
});

cc._RFpop();
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","CMD_ZaJinHua":"CMD_ZaJinHua","GameServerItem":"GameServerItem","GameUserItem":"GameUserItem","GlobalDef":"GlobalDef","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"GameServerItem":[function(require,module,exports){
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
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("size = " + dataSize + " describe = " + dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch (dataDescribe) {
                case 3:
                    this.szName = "游戏用户";
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szName = pData.readstring(dataSize);
                    }
                    break;
                case 9:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szUnderWrite = pData.readstring(dataSize);
                    }
                    break;
                case 301:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szGroupName = pData.readstring(dataSize);
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
        for (var index = 0; index < 15; index++) {
            var val = pData.readdword();
            userInfoHead.dwPropResidualTime.push(val);
        }
        return userInfoHead;
    }
});

module.exports = GameUserItem;

cc._RFpop();
},{"GlobalUserData":"GlobalUserData"}],"GlobalDef":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd85baIYnERFsIqEdSH5SyZY', 'GlobalDef');
// Script/GlobalDef.js

"use strict";

var GlobalDef = {
    MAX_CHAIR: 100, //◊Ó¥Û“Œ◊”
    MAX_CHAIR_NORMAL: 8, //◊Ó¥Û»À ˝

    INVALID_TABLE: -1, //Œﬁ–ß◊¿◊”∫≈
    INVALID_CHAIR: -1, //Œﬁ–ß“Œ◊”∫≈

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
    MOBILEPHONE_LEN: 32 };
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
            console.log("[GlobalUserData][init] " + JSON.stringify(GlobalUserData.shopData));
        });
        this.roomList = [];
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
},{}],"PlazaRoomItem":[function(require,module,exports){
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
        this.m_Image_back.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_back_" + this._index);
        this.m_Image_col.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_col_" + this._index);
        this.m_Image_title.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_down_" + this._index);
        if (this._roomInfo && this._roomInfo.lLimitScore) {
            this.m_Label_scoreLimit.string = this._roomInfo.lLimitScore;
        }
    },
    onClick: function onClick(params) {
        console.log("[PlazaRoomItem][onClick]");
        if (!this._roomInfo) {
            GlobalFun.showAlert(cc.director.getScene(), "房间暂未开放，请稍后再试");
            return;
        }
        if (GlobalUserData.llGameScore >= this._roomInfo.lLimitScore) {
            GlobalFun.showAlert(cc.director.getScene(), "进入房间");
        } else {
            GlobalFun.showToast(cc.director.getScene(), "进入房间需要" + this._roomInfo.lLimitScore + "金豆,您的金豆不足,请充值!");
        }
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

        this.refreshRoomList();
    },
    refreshRoomList: function refreshRoomList() {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList));
        var roomListPanel = this.node.getChildByName("m_Panel_center");
        roomListPanel.removeAllChildren();
        for (var index = 0; index < 3; index++) {
            var item = cc.instantiate(this.plazaRoomItem);
            item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
            roomListPanel.addChild(item);
        }
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
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"PopWaitView":[function(require,module,exports){
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
        _shopID: 0,
        _goodsID: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(params) {
        var shopID = params.shopID;
        this._shopID = shopID;
        this._goodsID = shopID % 6;
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
},{}],"ShopView":[function(require,module,exports){
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
                                GlobalFun.showAlert(cc.director.getScene(), value.msg);
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
},{}]},{},["GameServerItem","GameUserItem","GlobalDef","GlobalUserData","HelloWorld","MD5","PlazaView","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","GameFrame","LogonFrame","LogonView","RegisterView","BankView","ChoosePayTypeView","PlazaRoomItem","SettingView","ShopItem","ShopView","UserFaceItem","UserFaceView","UserProfileView"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9DaG9vc2VQYXlUeXBlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0dhbWVGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZVNlcnZlckl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L0dhbWVVc2VySXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvR2xvYmFsRGVmLmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9HbG9iYWxGdW4uanMiLCJhc3NldHMvU2NyaXB0L0dsb2JhbFVzZXJEYXRhLmpzIiwiYXNzZXRzL1NjcmlwdC9IZWxsb1dvcmxkLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS9tb2RlbHMvTG9nb25GcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvTG9nb25TY2VuZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvbG9nb24vTG9nb25WaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9NRDUuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1BsYXphUm9vbUl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L1BsYXphVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvUG9wV2FpdFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL2xvZ29uL1JlZ2lzdGVyVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2V0dGluZ1ZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1Nob3BJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TaG9wVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvVG9hc3RWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyRmFjZUl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJGYWNlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlclByb2ZpbGVWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9XZWxjb21lVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYUTs7QUFjWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBdkNJOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRnNCO0FBSTFCO0FBQ0k7QUFDQTtBQUZ1QjtBQUkzQjtBQUNJO0FBQ0E7QUFGbUI7QUFJdkI7QUF0Q1E7O0FBeUNaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBWE47QUFhQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUEzTkk7Ozs7Ozs7Ozs7QUNMVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDRTtBQUNEO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUVJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNEO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBQ0Q7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUF2Sm9COztBQTJKekI7Ozs7Ozs7Ozs7QUMzSkE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7OztBQy9hQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ25mQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYlE7O0FBZ0JaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDSDtBQS9ESTs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7O0FBR0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNBO0FBQ0E7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQW9DO0FBQ2hDO0FBQ0g7QUFDc0M7QUFDbkM7QUFDSDtBQUN1QztBQUNwQztBQUNBO0FBQ0g7QUFDd0M7QUFDckM7QUFDQTtBQUNIO0FBQ3dDO0FBQ3JDO0FBQ0E7QUFDSDtBQUM2QztBQUMxQztBQUNBO0FBQ0g7QUFDRDtBQUpLO0FBTUQ7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFsRFI7QUFvREg7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBWFI7QUFhSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFSUjtBQVVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUxSO0FBT0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBTFI7QUFPSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhnQztBQUt2QztBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBSkE7QUFNSTtBQUNBO0FBQ0g7QUFDRDtBQUpLO0FBTUQ7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBQ0Q7QUFUSztBQVdEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUM7QUFLeEM7QUFDSjtBQUNEO0FBM0NBO0FBNkNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFFSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFsWkk7Ozs7Ozs7Ozs7QUNUVDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFqQlI7QUFtQkg7QUFDSjtBQXBFeUI7O0FBdUU5Qjs7Ozs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNKO0FBQ0k7QUFsQlI7QUFvQkg7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ1k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQS9OdUI7O0FBa081Qjs7Ozs7Ozs7OztBQ25PQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVKO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNSjs7Ozs7Ozs7OztBQ3hGQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFHWTtBQUNJO0FBQ0g7QUFDSjtBQUVaO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEOzs7Ozs7Ozs7QUFTQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTGE7Ozs7Ozs7Ozs7QUMxRmpCO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBL0ZnQjs7QUFrR3JCOzs7Ozs7Ozs7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0k7QUFDQTtBQUZHO0FBSVA7QUFDQTtBQU5RO0FBUVo7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBMUZJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDRTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNGO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBR0c7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFqQ1I7QUFtQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBRUg7QUF0Tkk7Ozs7Ozs7Ozs7QUNSVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDSTtBQUNBO0FBRlU7QUFmTjs7QUFxQlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUoyQztBQU1uRDtBQUNEO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDRDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNLO0FBQ0o7QUFFSTtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUoyQztBQU1oRDtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQXpJSTs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRmU7QUFJbkI7QUFDSTtBQUNBO0FBRlE7QUFuQko7O0FBeUJaO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0g7QUE5RUk7Ozs7Ozs7Ozs7QUNEVDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDs7QUFHRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNHO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFSTDtBQVVIOztBQUtEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBOztBQU1BO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0g7O0FBR0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7Ozs7Ozs7Ozs7QUNsUkQ7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWZROztBQWtCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBakRJOzs7Ozs7Ozs7O0FDSFQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUEzQ1A7O0FBaURaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBN01JOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSTtBQUNBO0FBRmE7QUFmVDs7QUFxQlo7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQTlESTs7Ozs7Ozs7OztBQ0FSO0FBQ0E7QUFDQTtBQUNBO0FBQ0c7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZXO0FBSWY7QUFDSTtBQUNBO0FBRlU7QUF2Qk47O0FBNkJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFKMEI7QUFNakM7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQXRJSzs7Ozs7Ozs7OztBQ0hWO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFYVDs7QUFpQlo7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQXBDSTs7Ozs7Ozs7OztBQ0RUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBSWY7QUFDQTtBQXBCUTs7QUF1Qlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQTNDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZZO0FBSWhCO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFuQlE7O0FBc0JaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUVHO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUoyQztBQU1oRDtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQWxLSTs7Ozs7Ozs7OztBQ0hUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFQTtBQXpDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBSWY7O0FBbkJROztBQXVCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQTFDSzs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQW5CUTs7QUFzQlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0g7QUFqRUk7Ozs7Ozs7Ozs7QUNGVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZpQjtBQUlyQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlk7QUFJaEI7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGZ0I7QUFJcEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGc0I7QUFJMUI7QUFDSTtBQUNBO0FBRnVCO0FBSTNCO0FBQ0k7QUFDQTtBQUZtQjtBQUl2QjtBQUNBO0FBeEVROztBQTJFWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNLO0FBQ0E7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQWxTSzs7Ozs7Ozs7OztBQ0pUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZHO0FBSVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFyQlE7O0FBd0JaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFFSTtBQUVJO0FBQ0E7QUFDSDtBQUNKO0FBR0c7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQTlESSIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfYWxlcnQ6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5pbml0KHttZXNzYWdlOlwidGhpcyBpcyBqdXN0IHRlc3RcIn0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uTG9hZF1cIik7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gcGFyYW1zLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF9hbGVydC5zdHJpbmcgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZmFkZUluKDAuNSksY2MuZGVsYXlUaW1lKDEuMCksY2MuZmFkZU91dCgwLjUpLGNjLnJlbW92ZVNlbGYoKSkpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGVzdHJveV0gbWVzc2FnZSA9IFwiICsgbWVzc2FnZSk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByYWRpb0J1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVcbiAgICAgICAgfSxcbiAgICAgICAgcGFuZWxHcm91cDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX2dldF91c2VyR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfZ2V0X2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX3VzZXJHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9FZGl0Ym94X2dldF9nb2xkOiBjYy5FZGl0Qm94LFxuICAgICAgICBtX0VkaXRib3hfZ2V0X2JhbmtQd2Q6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9zYXZlX2dvbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBfc2VsZWN0SW5kZXg6MCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2dldF91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9nZXRfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICByYWRpb0J1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKHRvZ2dsZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJhZGlvQnV0dG9uLmluZGV4T2YodG9nZ2xlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgdG9nZ2xlLm5vZGUuc2V0TG9jYWxaT3JkZXIoMSk7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiUmFkaW9CdXR0b25cIjtcbiAgICAgICAgc3dpdGNoKGluZGV4KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjFcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjJcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjNcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJhZGlvQnV0dG9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMucmFkaW9CdXR0b25baV07XG4gICAgICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsR3JvdXBbaV07XG4gICAgICAgICAgICBpZihjYy5pc1ZhbGlkKGVsZW1lbnQpICYmIGNjLmlzVmFsaWQocGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ub2RlLnNldExvY2FsWk9yZGVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2V0TG9jYWxaT3JkZXIoMCk7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgIC8vIHRoaXMuX3VwZGF0ZVRvZ2dsZUV2ZW50U3RyaW5nKHRpdGxlLCB0aGlzLnJhZGlvQnV0dG9uRXZlbnRTdHJpbmcsIHRvZ2dsZSk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAvLyB1cmwgKz0gXCIvaHovaHpVcGRhdGVGYWNlSWQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdEluZGV4ID09IDApIHtcbiAgICAgICAgICAgIHZhciBzekdvbGRDb3VudCA9IHRoaXMubV9FZGl0Ym94X2dldF9nb2xkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzelBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfZ2V0X2JhbmtQd2Quc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHJlID0gLy4vO1xuICAgICAgICAgICAgaWYoc3pHb2xkQ291bnQubGVuZ3RoIDw9IDAgfHwgc3pQYXNzV29yZC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3miJblr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5oiW5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihOdW1iZXIoc3pHb2xkQ291bnQpIDw9IDAgfHwgTnVtYmVyKHN6R29sZENvdW50KSA+IChHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlKSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rpk7booYznmoTph5Hpop3pmZDliLbvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66ZO26KGM55qE6YeR6aKd6ZmQ5Yi2IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcImluc3VyZXBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIyXCI7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVzZXJCYW5rTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RJbmRleCA9PSAxKSB7XG4gICAgICAgICAgICB2YXIgc3pHb2xkQ291bnQgPSB0aGlzLm1fRWRpdGJveF9zYXZlX2dvbGQuc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHN6R29sZENvdW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3kuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKE51bWJlcihzekdvbGRDb3VudCkgPD0gMCB8fCBOdW1iZXIoc3pHb2xkQ291bnQpID4gTnVtYmVyKEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlKSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rouqvkuIrph5Hpop3vvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66Lqr5LiK6YeR6aKd77yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjFcIjtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXNlckJhbmtNb2JpbGUuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fc2VsZWN0SW5kZXggPT0gMikge1xuICAgICAgICAgICAgdmFyIHN6UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgc3pOZXdQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzekNvbmZpcm1QYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3pQYXNzV29yZC5sZW5ndGggPD0gMCB8fCBzek5ld1Bhc3NXb3JkLmxlbmd0aCA8PSAwIHx8IHN6Q29uZmlybVBhc3NXb3JkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDlr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6UGFzc1dvcmQgPT0gc3pOZXdQYXNzV29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6Q29uZmlybVBhc3NXb3JkICE9IHN6TmV3UGFzc1dvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzek5ld1Bhc3NXb3JkLmxlbmd0aCA8IDYgfHwgc3pOZXdQYXNzV29yZC5sZW5ndGggPiAxNikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJuZXdwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc1dvcmQpO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVcGRhdGVQYXNzV29yZC5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA9IHZhbHVlLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5pbnN1cmVzY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlID0gdmFsdWUuaW5zdXJlc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQmFua1N1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTYXZlQWxsOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3NhdmVfZ29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tHZXRBbGw6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfZ2V0X2dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5fdmlld0ZyYW1lID0gdmlldztcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWUgb25Mb2FkXCIpO1xuICAgICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm1fdGFiQ2FjaGVNc2cgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcIkJhc2VGcmFtZVwiLFxuICAgIC8vIGN0b3I6IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgLy8gICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgIC8vICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgICAgICBcbiAgICAvLyB9LFxuICAgIHNldENhbGxCYWNrOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrOyAgXG4gICAgfSxcbiAgICBzZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKHZpZXdGcmFtZSl7XG4gICAgICB0aGlzLl92aWV3RnJhbWUgPSB2aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIHNldFNvY2tldEV2ZW50OiBmdW5jdGlvbihzb2NrZXRFdmVudCl7XG4gICAgICAgIHRoaXMuX3NvY2tldEV2ZW50ID0gc29ja2V0RXZlbnQ7XG4gICAgfSxcbiAgICBnZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBpc1NvY2tldFNlcnZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICBpZih0aGlzLl90aHJlYWRpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAge1xuICAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgIC8vdG9kby4uLlxuICAgIH0sXG4gICAgb25DcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKHN6VXJsLG5Qb3J0KXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zelNlcnZlclVybCA9IHN6VXJsO1xuICAgICAgICB0aGlzLl9uU2VydmVyUG9ydCA9IG5Qb3J0O1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgICAgIHNlbGYub25Tb2NrZXRDYWxsQmFjayhwRGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQodGhpcy5fU29ja2V0RnVuKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lKTtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0LkNvbm5lY3RTb2NrZXQodGhpcy5fc3pTZXJ2ZXJVcmwsdGhpcy5fblNlcnZlclBvcnQpID09PSB0cnVlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25DcmVhdGVTb2NrZXQgY2xvc2VcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYodGhpcy5fY2FsbEJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ25vIGNhbGxiYWNrJyk7XG4gICAgICAgIC8vICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2FsbEJhY2sgbWFpbjogXCIgKyBtYWluICsgXCIgI3N1YjogXCIrc3ViKTtcbiAgICAgICAgaWYobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQobWFpbiwgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2VTb2NrZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQucmVsZWFzZVNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHNlbmRTb2NrZXREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kU29ja2V0RGF0YShwRGF0YSk7XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkNvbm5lY3RDb21wZWxldGVkXCIpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vblNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIG9uR2FtZVNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uR2FtZVNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUZyYW1lOyIsInZhciBnYW1lX2NtZCA9IHt9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX0xPR09OID0gMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze055m75b2VXG5cbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9BQ0NPVU5UUyA9IDExICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5oi355m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fVVNFUklEID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fTU9CSUxFID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYZcblxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1NVQ0NFU1MgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leaIkOWKn1xuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0VSUk9SID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9GSU5JU0ggPSA2MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leWujOaIkFxuXG4vLyAvL+aIv+mXtOW4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5QWNjb3VudHNcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1Byb2Nlc3NWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAvL+i/m+eoi+eJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+aJi+acuueZu+mZhlxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklETW9iaWxlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RW5jcnlwdElEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2RlQ2hlY2tJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdXZWlYaW5DaGVja0lEOyAgICAgICAgICAgICAgICAgICAgLy/lvq7kv6Hpqozor4HnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/muLjmiI9BUFDniYjmnKzlj7co5LiO55m76ZmG5aSn5Y6F55u45ZCMKVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOyAgIC8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuXG4vLyAvL+aIv+mXtCBJRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQcm9jZXNzVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgLy/ov5vnqIvniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+eZu+W9leaIkOWKn+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gfTtcblxuLy8gLy/nmbvlvZXlpLHotKVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nlKjmiLfmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX1VTRVIgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TSVRfUkVRID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvor7fmsYJcbmdhbWVfY21kLlNVQl9HUl9VU0VSX0xPT0tPTl9SRVEgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeinguivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBTkRVUF9SRVEgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1t+eri+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTEVGVF9HQU1FX1JFUSA9IDQ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56a75byA5ri45oiPXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0NPTUUgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+i/m+WFpVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBVFVTID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFID0gNjAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbmdhbWVfY21kLlNVQl9HUl9TSVRfRkFJTEVEID0gNjAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1JJR0hUID0gNjA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbmdhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVIgPSA2MDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTEQgPSA2MDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoumHkeixhlxuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX1RSQU4gPSA2MDcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoui9rOW4kFxuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9DSEFUID0gNzAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ogYrlpKnmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1dJU1BFUiA9IDcwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56eB6K+t5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9SVUxFID0gNzAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfop4TliJlcblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFID0gODAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgoDor7fmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0lOVklURV9SRVEgPSA4MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCgOivt+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTkRfUVVFUlkgPSA4MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgeafpeivolxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1IgPSA4MDNcblxuLy8gLy/kvJrlkZjnrYnnuqdcbi8vIHN0cnVjdCBDTURfR1JfTWVtYmVyT3JkZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlck9yZGVyOyAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gfTtcblxuLy8gLy/nlKjmiLfmnYPpmZBcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJpZ2h0XG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VyUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbi8vIH07XG5cbi8vIC8v55So5oi354q25oCBXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTdGF0dXNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L2N572uXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyU3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+WIhuaVsFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxMb3ZlbGluZXNzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4vLyAgICAgLy9MT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOi0uemHkeixhlxuLy8gICAgIC8vTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIHRhZ1VzZXJTY29yZSAgICAgICAgICAgICAgICAgICAgVXNlclNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np6/liIbkv6Hmga9cbi8vIH07XG5cbi8vIC8vc3RydWN0IG9uZVRyYW5SZWNvcmRcbi8vIC8ve1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dO1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VG9Vc2VySUQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUb0FjY291bnRzW05BTUVfTEVOXTtcbi8vIC8vICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuZ29sZDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuRGF0YVsxNV07XG4vLyAvL1xuLy8gLy99O1xuXG4vLyAvL+afpeivoue7k+aenCB3c2wgMjAxNS40LjFcbi8vIHN0cnVjdCBvbmVUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUcmFuR2FtZUlEOyAgICAgICAgICAgICAgICAgLy/ovazluJDmuLjmiI9JRFxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VHJhbkdhbWVJRFszMV07ICAgICAgICAgICAgICAgIC8v6L2s5biQ5ri45oiPSURcbi8vICAgICAvL1RDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRyYW5UeXBlW05BTUVfTEVOXTsgICAgICAgICAgIC8v6L2s5biQ57G75Z6LXG4vLyAgICAgLy9MT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbFByZXNlbnRWYWx1ZTsgICAgICAgICAgICAgICAgICAvL+i1oOmAgemHkeixhlxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblRpbWVbMjBdOyAgICAgICAgICAgICAgICAgLy/ovazluJDml7bpl7RcbiAgICBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgLy/nlKjmiLfmmLXnp7Bcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291bnQ7ICAgICAgICAgICAgICAgICAgICAvL+aVsOmHj1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Rmxvd2VyTmFtZVszMl07ICAgICAgICAgICAvL+ekvOeJqeWQjeensFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblR5cGVbTkFNRV9MRU5dOyAgICAgICAvL+i9rOW4kOexu+Wei1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9UcmFuR29sZFJlY29yZFJcbi8vIHtcbi8vICAgICBCWVRFICAgIG51bTsvL+acieWHoOadoeihqFxuLy8gICAgIG9uZVRyYW5SZWNvcmQgICBvbmV0cmFucmVjb3JkWzEwXTsvL+acgOWkmuWNgeadoeiusOW9leS4gOWPkVxuLy8gfTtcblxuLy8gLy8vLy/nlKjmiLfmn6Xor6Lph5HosYbnu5PmnpwgMjAxMS43LjE1IGJ5IGdhb3NoYW5cbi8vIHN0cnVjdCBDTURfR1JfVXNlclF1aUJhbmtlclxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgLy/pk7booYzph5HosYZcbi8vICAgICBDTURfR1BfVHJhbkdvbGRSZWNvcmRSICAgICAgICAgICAgICBUcmFuUmVjb3JkO1xuLy8gfTtcblxuLy8gLy/or7fmsYLlnZDkuItcbi8vIHN0cnVjdCBDTURfR1JfVXNlclNpdFJlcVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQYXNzTGVuOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplb/luqZcbi8vICAgICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgIGR3QW5zd2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zue562UIEkgRC8v5YW85a6556ev5YiG5ri45oiP5YWl5bqn6Zeu6aKYXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkvY3nva5cbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VGFibGVQYXNzW1BBU1NfTEVOXTsgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlUmVxXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLyAvL+WdkOS4i+Wksei0pVxuLy8gc3RydWN0IENNRF9HUl9TaXRGYWlsZWRcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RmFpbGVkRGVzY3JpYmVbMjU2XTsgICAgICAgICAgICAgIC8v6ZSZ6K+v5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+iBiuWkqee7k+aehFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyQ2hhdFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBDT0xPUlJFRiAgICAgICAgICAgICAgICAgICAgICAgIGNyRm9udENvbG9yOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6aKc6ImyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1NlbmRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeeUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q2hhdE1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAgIC8v6IGK5aSp5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+engeivree7k+aehFxuLy8gc3RydWN0IENNRF9HUl9XaXNwZXJcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgQ09MT1JSRUYgICAgICAgICAgICAgICAgICAgICAgICBjckZvbnRDb2xvcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+minOiJslxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdTZW5kVXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNoYXRNZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgICAvL+iBiuWkqeS/oeaBr1xuLy8gfTtcblxuLy8gLy/nlKjmiLfop4TliJlcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJ1bGVcbi8vIHtcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQYXNzd29yZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5a+G56CBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRXaW47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuiDnOeOh1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0RmxlZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbmlq3nur9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi25YiG5pWwXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQ2hlY2tTYW1lSVA7ICAgICAgICAgICAgICAgICAgICAgICAvL+aViOmqjOWcsOWdgFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpblJhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbog5znjodcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGbGVlUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26YCD6LeRXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOmrmOWIhuaVsFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbExlc3NTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDkvY7liIbmlbBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc3dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/phY3nva7kv6Hmga/mlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX0lORk8gPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mFjee9ruS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfU0VSVkVSX0lORk8gPSA5MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX09SREVSX0lORk8gPSA5MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+mFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9JTkZPID0gOTAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjphY3nva5cbmdhbWVfY21kLlNVQl9HUl9DT0xVTU5fSU5GTyA9IDkwMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSCA9IDkwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5a6M5oiQXG5cbi8vIC8v5ri45oiP5oi/6Ze05L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlcnZlckluZm9cbi8vIHtcbi8vICAgICAvL+aIv+mXtOWxnuaAp1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlyQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdHYW1lR2VucmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnosgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1ZpZGVvQWRkcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+inhumikeWcsOWdgFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIaWRlVXNlckluZm87ICAgICAgICAgICAgICAgICAgICAgLy/pmpDol4/kv6Hmga9cbi8vIH07XG5cbi8vIC8v5YiG5pWw5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1Njb3JlSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0Rlc2NyaWJlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/mj4/ov7DmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdEYXRhRGVzY3JpYmVbMTZdOyAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5qCH5b+XXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOe7k+aehFxuLy8gc3RydWN0IHRhZ09yZGVySXRlbVxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfnp6/liIZcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckRlc2NyaWJlWzE2XTsgICAgICAgICAgICAgICAgIC8v562J57qn5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9PcmRlckluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn5pWw55uuXG4vLyAgICAgdGFnT3JkZXJJdGVtICAgICAgICAgICAgICAgICAgICBPcmRlckl0ZW1bMTI4XTsgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+aPj+i/sFxuLy8gfTtcblxuLy8gLy/liJfooajpobnmj4/ov7Dnu5PmnoRcbi8vIHN0cnVjdCB0YWdDb2x1bW5JdGVtXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uV2lkdGg7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOWuveW6plxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0RhdGFEZXNjcmliZTsgICAgICAgICAgICAgICAgICAgICAgLy/lrZfmrrXnsbvlnotcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q29sdW1uTmFtZVsxNl07ICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5ZCN5a2XXG4vLyB9O1xuXG4vLyAvL+WIl+ihqOaPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9Db2x1bW5JbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOaVsOebrlxuLy8gICAgIHRhZ0NvbHVtbkl0ZW0gICAgICAgICAgICAgICAgICAgQ29sdW1uSXRlbVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/liJfooajmj4/ov7Bcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOeKtuaAgeaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1RBVFVTID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nirbmgIHkv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX0lORk8gPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS/oeaBr1xuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX1NUQVRVUyA9IDYwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q54q25oCBXG5cbi8vIC8v5qGM5a2Q54q25oCB57uT5p6EXG4vLyBzdHJ1Y3QgdGFnVGFibGVTdGF0dXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQbGF5U3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gfTtcblxuLy8gLy/moYzlrZDnirbmgIHmlbDnu4Rcbi8vIHN0cnVjdCBDTURfR1JfVGFibGVJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIHRhZ1RhYmxlU3RhdHVzICAgICAgICAgICAgICAgICAgVGFibGVTdGF0dXNbNTEyXTsgICAgICAgICAgICAgICAgICAgLy/nirbmgIHmlbDnu4Rcbi8vIH07XG5cbi8vIC8v5qGM5a2Q54q25oCB5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlU3RhdHVzXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBsYXlTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nrqHnkIbmlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX01BTkFHRVIgPSA1NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuWRveS7pFxuXG5nYW1lX2NtZC5TVUJfR1JfU0VORF9XQVJOSU5HID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHorablkYpcbmdhbWVfY21kLlNVQl9HUl9TRU5EX01FU1NBR0UgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX0xPT0tfVVNFUl9JUCA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l55yL5Zyw5Z2AXG5nYW1lX2NtZC5TVUJfR1JfS0lMTF9VU0VSID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ouKLlh7rnlKjmiLdcbmdhbWVfY21kLlNVQl9HUl9MSU1JVF9BQ0NPVU5TID0gNTUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npoHnlKjluJDmiLdcbmdhbWVfY21kLlNVQl9HUl9TRVRfVVNFUl9SSUdIVCA9IDY2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p2D6ZmQ6K6+572uXG5nYW1lX2NtZC5TVUJfR1JfT1BUSU9OX1NFUlZFUiA9IDc3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze06K6+572uXG5cbi8vIC8v5Y+R6YCB6K2m5ZGKXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlbmRXYXJuaW5nXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6V2FybmluZ01lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgIC8v6K2m5ZGK5raI5oGvXG4vLyB9O1xuXG4vLyAvL+ezu+e7n+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9TZW5kTWVzc2FnZVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHYW1lOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUm9vbTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5raI5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pTeXN0ZW1NZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgLy/ns7vnu5/mtojmga9cbi8vIH07XG5cbi8vIC8v5p+l55yL5Zyw5Z2AXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvb2tVc2VySVBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+i4ouWHuueUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9LaWxsVXNlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v56aB55So5biQ5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX0xpbWl0QWNjb3VudHNcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+adg+mZkOiuvue9rlxuLy8gc3RydWN0IENNRF9HUl9TZXRVc2VyUmlnaHRcbi8vIHtcbi8vICAgICAvL+e7keWumuWPmOmHj1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JBY2NvdW50c1JpZ2h0OyAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fmnYPpmZBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2FtZVJpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35p2D6ZmQXG4vLyAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0Um9vbUNoYXQ7ICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuLy8gICAgIC8v5p2D6ZmQ5Y+Y5YyWXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0TG9va29uR2FtZTsgICAgICAgICAgICAgICAgICAvL+aXgeinguadg+mZkFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdEdhbWVDaGF0OyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ogYrlpKlcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRTZW5kV2lzcGVyOyAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0UGxheUdhbWU7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+adg+mZkFxuLy8gfTtcblxuLy/orr7nva7moIflv5dcbmdhbWVfY21kLk9TRl9ST09NX0NIQVQgPSAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuZ2FtZV9jbWQuT1NGX0dBTUVfQ0hBVCA9IDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6IGK5aSpXG5nYW1lX2NtZC5PU0ZfUk9PTV9XSVNQRVIgPSAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheengeiBilxuZ2FtZV9jbWQuT1NGX0VOVEVSX0dBTUUgPSA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpea4uOaIj1xuZ2FtZV9jbWQuT1NGX0VOVEVSX1JPT00gPSA1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpeaIv+mXtFxuZ2FtZV9jbWQuT1NGX1NIQUxMX0NMT1NFID0gNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljbPlsIblhbPpl61cblxuLy8gLy/miL/pl7Torr7nva5cbi8vIHN0cnVjdCBDTURfR1JfT3B0aW9uU2VydmVyXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk9wdGlvbkZsYWdzOyAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruagh+W/l1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JPcHRpb25WYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7moIflv5dcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+aVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1lTVEVNID0gNjYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/kv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0UgPSAyMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vL+a2iOaBr+exu+Wei1xuZ2FtZV9jbWQuU01UX0lORk8gPSAweDAwMDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+a2iOaBr1xuZ2FtZV9jbWQuU01UX0VKRUNUID0gMHgwMDAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbmdhbWVfY21kLlNNVF9HTE9CQUwgPSAweDAwMDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xuZ2FtZV9jbWQuU01UX1NDT1JFX05PVEVOT1VHSCA9IDB4MDAwOCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YeR5biB5LiN5aSfXG5nYW1lX2NtZC5TTVRfQ0xPU0VfUk9PTSA9IDB4MTAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5oi/6Ze0XG5nYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSA9IDB4NDAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lit5pat6L+e5o6lXG5cbi8vIC8v5raI5oGv5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX0dSX01lc3NhZ2Vcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNZXNzYWdlVHlwZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TWVzc2FnZUxlbmd0aDsgICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDb250ZW50WzEwMjRdOyAgICAgICAgICAgICAgICAgICAgLy/mtojmga/lhoXlrrlcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU0VSVkVSX0lORk8gPSA3NyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfT05MSU5FX0NPVU5UX0lORk8gPSAxMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WcqOe6v+S/oeaBr1xuXG4vLyAvL+S6uuaVsOS/oeaBr1xuLy8gc3RydWN0IHRhZ09uTGluZUNvdW50SW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovmoIfor4Zcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgIC8v5Zyo57q/5Lq65pWwXG4vLyB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZV9jbWQ7IiwidmFyIHBsYXphX2NtZCA9IHt9O1xuXG4vL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9MT1cgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9ISUdIID0gMTY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIHBsYXphX2NtZC5WRVJfUExBWkFfRlJBTUUgPSBNQUtFTE9ORzsoVkVSX1BMQVpBX0xPVyxWRVJfUExBWkFfSElHSClcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V6ZSZ6K+v5qCH6K+GXG5cbnBsYXphX2NtZC5FUkNfR1BfTE9HT05fU1VDQ0VTUyA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5oiQ5YqfXG5wbGF6YV9jbWQuRVJDX0dQX0FDQ09VTlRTX05PVF9FWElTVCA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35LiN5a2Y5ZyoXG5wbGF6YV9jbWQuRVJDX0dQX0xPTkdfTlVMTElUWSA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56aB5q2i55m75b2VXG5wbGF6YV9jbWQuRVJDX0dQX1BBU1NXT1JEX0VSQ09SID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplJnor69cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfTE9HT04gPSAxMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0FDQ09VTlRTID0gMzAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fnmbvlvZVcbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fVVNFUklEID0gMzAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX0FDQ09VTlRTID0gMzAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfVVBMT0FEX0NVU1RPTV9GQUNFID0gMzA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fUkVDT1JEID0gMzA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xucGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUgPSAxNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuW5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSA9IDE1MDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmGXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX01PQklMRSA9IDE1MTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py65rOo5YaMXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUgPSAyNjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuaIkOWKn1xucGxhemFfY21kLlNVQl9HUF9MT0dPTl9FUlJPUl9NT0JJTEUgPSAyNjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuWksei0pVxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9GSU5JU0hfTU9CSUxFID0gMjYyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYblrozmiJBcblxuLy8gLy/luJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeUFjY291bnRzTW9iaWxlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbldlaVhpbkF1dGhJRDsgICAgICAgICAgICAgICAgICAvL+W+ruS/oemqjOivgSAvL+WFvOWuueS9v+eUqD4xMDAwd+aJq+eggeeZu+mZhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwS2luZDsgICAgICAgICAgICAgICAgLy/miYvmnLpBUFDmuLjmiI9JRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy/miYvmnLpBUFDniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuLy8gLy/ms6jlhozluJDlj7dcbi8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c01vYmxpZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLfmgKfliKtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcEtpbmQ7ICAgICAgICAgICAgICAgIC8vIOW5v+WcuuaJi+acuueJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy8g5bm/5Zy65omL5py654mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvLyDnmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8vIOeZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlcGhvbmVbTU9CSUxFUEhPTkVfTEVOXTsgLy8g5omL5py6XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvLyDmmLXnp7Bcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZUF1dGhbTkFNRV9MRU5dOyAgICAgICAgIC8v5omL5py66aqM6K+B56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbi8vIH07XG5cbi8vIC8v5omL5py655m76ZmG5oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuLy8ge1xuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkJpbmRXZWlYaW47ICAgICAgICAgICAgICAgICAgIC8v57uR5a6a5b6u5L+hIFdTTFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmNyeXB0SUQ7ICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIExXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvZGVDaGVja0lEOyAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0V4cGVyaWVuY2U7ICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxsR2FtZVNjb3JlOyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgIC8v6ZO26KGM6YeR5biBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mmLXnp7Bcbi8vIH07XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIC8v5biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uQnlBY2NvdW50c1xuLy8ge1xuXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyUGhvbmVUYWc7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyB9O1xuXG4vLyAvL0kgRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vIH07XG5cbi8vIC8v5rOo5YaM5biQ5Y+3XG4vLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2l0eU51bTsgICAgICAgICAgICAgICAgICAgICAgIC8v5Z+O5biC57yW56CBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JFbmpveVR5cGU7ICAgICAgICAgICAgICAgICAgICAvL+WKoOWFpeexu+Wei1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6U3ByZWFkZXJbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mjqjlub/kurrlkI1cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8v55So5oi35pi156ewXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pSZWFsTmFtZVtOQU1FX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pJZGVudGl0eVtOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFbmpveUNvZGVbUEFTU19MRU5dOyAgICAgICAgICAvL+aOqOiNkOeggW9y5paw5omL56CBXG4vLyB9O1xuXG4vLyAvL+eZu+mZhuaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdFeHBlcmllbmNlOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuICAgIFxuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcblxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Rm9ydHVuZUNvaW47ICAgICAgICAgICAgICAgICAgLy/npo/luIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LmQ6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAvL+S5kOixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291cG9uOyAgICAgICAgICAgICAgICAgICAgICAgLy/ngavohb9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgIC8v54Gr6IW/XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNYXRjaFRpY2tldDsgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRmlyc3RCYW5rOyAgICAgICAgICAgICAgICAgICAgLy8g6aaW5qyh5L2/55SoXG5cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelVzZXJQaG9uZUluZm9yWzE2XTsgICAgICAgICAgIC8v55So5oi35omL5py6XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAvL+mUmeivr+a2iOaBr1xuLy8gfTtcblxuLy8gLy/nmbvpmYblpLHotKVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxFcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgdGFnQXdhcmRJbmZvXG4vLyB7XG4vLyAgICAgaW50ICAgICBuQXdhcmRHb2xkWzddO1xuLy8gfTtcblxuLy8gdHlwZWRlZiBzdHJ1Y3Rcbi8vIHtcbi8vICAgICB0YWdBd2FyZEluZm8gaW5mbztcbi8vICAgICBCWVRFICAgICAgICBJc0NoZWNrZWQ7XG4vLyAgICAgaW50ICAgICAgICAgbkxvZ29uVGltZTtcbi8vIH1DTURfR1BfQXdhcmRJbmZvO1xuLy8gLy/moKHpqoznlKjmiLfkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1BfQ2hlY2tSZWdpc3RlclxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGF0YVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmxhZzsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vMDrmo4DmtYvotKblj7cgMTrmo4DmtYvmmLXnp7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/muLjmiI/liJfooajlkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9TRVJWRVJfTElTVCA9IDE3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfTElTVF9UWVBFID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9LSU5EID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np43nsbvliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TVEFUSU9OID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nq5nngrnliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TRVJWRVIgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOWIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0ZJTklTSCA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5a6M5oiQXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfQ09ORklHID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajphY3nva5cblxuLy8gLy/liJfooajphY3nva5cbi8vIHN0cnVjdCBDTURfR1BfTGlzdENvbmZpZ1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTaG93T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgLy/mmL7npLrkurrmlbBcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+WRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX1NZU1RFTSA9IDE5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5ZG95LukXG5cbnBsYXphX2NtZC5TVUJfR1BfVkVSU0lPTiA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v54mI5pys6YCa55+lXG5wbGF6YV9jbWQuU1VCX1NQX1NZU1RFTV9NU0cgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vLyAvL+eJiOacrOmAmuefpVxuLy8gc3RydWN0IENNRF9HUF9WZXJzaW9uXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk5ld1ZlcnNpb247ICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOeJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJBbGxvd0Nvbm5lY3Q7ICAgICAgICAgICAgICAgICAgLy/lhYHorrjov57mjqVcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnBsYXphX2NtZC5NRE1fR1BfVVNFUiA9IDIyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfVVNFUl9VUExPQURfRkFDRSA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VTRVJfRE9XTkxPQURfRkFDRSA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiL6L295aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VQTE9BRF9GQUNFX1JFU1VMVCA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0RFTEVURV9GQUNFX1JFU1VMVCA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0NVU1RPTV9GQUNFX0RFTEVURSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX01PRElGWV9JTkRJVklEVUFMID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuKrkurrotYTmlplcbnBsYXphX2NtZC5TVUJfR1BfTU9ESUZZX0lORElWSURVQUxfUkVTVUxUID0gNTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv67mlLnnu5PmnpxcblxucGxhemFfY21kLlNVQl9HUF9TQUZFX0JJTkQgPSA1MDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutue7keWumlxucGxhemFfY21kLlNVQl9HUF9TQUZFX1VOQklORCA9IDUwODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Kej6Zmk57uR5a6aXG5wbGF6YV9jbWQuU1VCX0dQX0NIRUNLX1BTRCA9IDUwOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+G56CB6aqM6K+BIFdTTCAyMDE1LjMuMjdcblxuXG5wbGF6YV9jbWQuTURNX0dQX1JFRyA9IDIzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+azqOWGjFxucGxhemFfY21kLlNVQl9HUF9JTklUX1JFR0lTVEVSID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfQ0FOQ0VMX1JFR0lTVEVSID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflj5bmtojms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfUkVGVVNFX1JFRyA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0NBTl9SRUcgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peazqOWGjFxucGxhemFfY21kLlNVQl9HUF9HRVRfUkVHQ09ERSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERSA9IDUwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERV9FUlJPUiA9IDUwNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xuXG4vLyAvL+S4quS6uui1hOaWmVxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/njqnlrrbmmLXnp7Bcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5HZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625oCn5YirXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQWdlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuW5tOm+hFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBZGRyZXNzWzY0XTsgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrblnLDlnYBcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VW5kZXJXcml0ZVszMl07ICAgICAgICAgICAgICAgICAgIC8v5Liq5oCn562+5ZCNXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3N3b3JkWzMzXTsgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuWvhueggVxuLy8gfTtcblxuLy8gLy/lrprkuYnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkQ3VzdG9tRmFjZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFNpemU7ICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5aSn5bCPXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxhc3RQYWNrZXQ7ICAgICAgICAgICAgICAgICAgICAvL+acgOWQjuagh+ivhlxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGaXJzdFBhY2tldDsgICAgICAgICAgICAgICAgICAgLy/nrKzkuIDkuKrmoIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgIC8v5aS05YOP5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+S4i+i9veaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Eb3dubG9hZEZhY2VTdWNjZXNzXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RvbHRhbFNpemU7ICAgICAgICAgICAgICAgICAgICAgICAvL+aAu+WFseWkp+Wwj1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXJyZW50U2l6ZTsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lpKflsI9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+aVsOaNrlxuLy8gfTtcblxuLy8gLy/kuIvovb3lpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRG93bmxvYWRGYWNlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gfTtcblxuLy8gLy/kuIrkvKDnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfRGVsZXRlRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTmtojmga9cbi8vIHN0cnVjdCBDTURfR1BfQ3VzdG9tRmFjZURlbGV0ZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyB9O1xuLy8gLy/kv67mlLnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEO1xuLy8gfTtcbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVJlc3VsdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JSZXN1bHRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57nu5Pmnpxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOPSURcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVXNlckluZm9cbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5L+d6Zmp566x56aP5biBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgICAgICAvL+S/nemZqeeusei0neWjs1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otJ3lo7PmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TWF0Y2hUaWNrZXQ7ICAgICAgICAgICAgICAgICAgICAgIC8v6Zeo56Wo5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZvcnR1bmVDb2luOyAgICAgICAgICAgICAgICAgICAgICAvL+emj+ixhuaVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npo/luIHmlbBcbi8vIH07XG4vLyAvL+S/ruaUuee7k+aenFxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk9wZXJhdGVTdWNjZXNzOyAgICAgICAgICAgICAgICAgICAgLy/miJDlip/moIfor4Zcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfR2V0TG9nb25Bd2FyZFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgblRpbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lh6DnrYnlpZblirFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635b6X5aWW5YqxXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1JldHVyblxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkNvZGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm55jb2RlXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WAvFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57mj4/ov7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8g6ZO26KGM5pON5L2cKOW8gOWIhuWGmSzlh4/lsJHliKTmlq3lrZfoioIpXG5wbGF6YV9jbWQuTURNX0dQX0JBTksgPSA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpk7booYzkv6Hmga9cblxuLy8g5a6i5oi356uv6K+35rGCXG5wbGF6YV9jbWQuU1VCX0dQX0NIQU5HRV9QQVNTV09SRCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRSA9IDEwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOafpeeci+iusOW9lVxucGxhemFfY21kLlNVQl9HUF9CQU5LX1NUT1JBR0UgPSAxMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19HRVQgPSAxMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0UgPSAxMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjlpZbliLhcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX0dFVCA9IDEwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWlluWIuFxuXG4vLyDor7fmsYLlupTnrZRcbnBsYXphX2NtZC5TVUJfR1BfQ0hBTkdFX1BBU1NXT1JEX1JFUyA9IDExMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRV9SRVMgPSAxMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmn6XnnIvorrDlvZVcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19TVE9SQUdFX1JFUyA9IDExMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOmHkeW4gVxucGxhemFfY21kLlNVQl9HUF9CQU5LX0dFVF9SRVMgPSAxMTM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0VfUkVTID0gMTE0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo5aWW5Yi4XG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9HRVRfUkVTID0gMTE1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5aWW5Yi4XG5cblxuLy8gLy8g5L+u5pS55a+G56CBXG4vLyBzdHJ1Y3QgQ01EX0dQX0NoYW5nZVBhc3NXb3JkXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmtQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDmlrDnmoTlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRCa1Bhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWOn+Wni+WvhueggVxuLy8gfTtcblxuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWtmOWFpeWtmOWCqOe7k+aehFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyB9Q01EX0dQX0JhbmtTdG9yYWdlLCBDTURfR1BfQ291cG9uU3RvcmFnZTtcblxuLy8gLy8g6YeR5biBLOWlluWIuCzlj5blh7rlrZjlgqjnu5PmnoRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi3SURcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFua1Bhc3N3b3JkW1BBU1NfTEVOXTsgICAgICAgICAvLyDnlKjmiLflr4bnoIFcbi8vIH1DTURfR1BfQmFua0dldCwgQ01EX0dQX0NvdXBvbkdldDtcblxuXG4vLyAvLyDkv67mlLnlr4bnoIHlupTnrZRcbi8vIHN0cnVjdCBDTURfR1BfQ2hhbmdlUGFzc1dvcmRSZXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIDDkuLrmiJDlip8o5L+u5pS5aXNGaXJzdClcbi8vIH07XG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5a2Y5YKo5bqU562UXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOmUmeivr+eggSww5Li65oiQ5YqfXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvLyDouqvkuIrpkrFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5rVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOS/nemZqeeusemSsVxuLy8gfUNNRF9HUF9CYW5rU3RvcmFnZVJlcywgQ01EX0dQX0JhbmtHZXRSZXMsIENNRF9HUF9Db3Vwb25TdG9yYWdlUmVzLCBDTURfR1BfQ291cG9uR2V0UmVzO1xuXG5wbGF6YV9jbWQuTURNX0dQX05FVyA9IDY7XG5cbnBsYXphX2NtZC5TVUJfR1BfR0VUX05FV1MgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWFrOWRilxucGxhemFfY21kLlNVQl9HUF9GSU5EX0ZSSUVETiA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9GUklFTkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWlveWPi1xucGxhemFfY21kLlNVQl9HUF9BRERfRlJJRU5EID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lop7liqDlpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfREVMRVRFX0ZSSUVORCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0ZSSUVORF9FUlJPUiA9IDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfTU9ORVkgPSA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgVxucGxhemFfY21kLlNVQl9HUF9TRU5EX1JFQ09SRCA9IDg7XG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfUkVTVUxUID0gOTtcblxuLy8gc3RydWN0IENNRF9HUF9HZXROZXdzXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOZXdzWzI1Nl07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZF9SZWxhdGl2ZSBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgRFdPUkQgICAgICAgICAgIGR3RnJpZW5kSUQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZEVycm9yXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgc3pEZXNjcmliZVsxMjhdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9EZWxldGVGcmllbmRSZXN1bHRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdEZWxldGVJRDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRmluZFVzZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBXT1JEICAgICAgICB3RmFjZUlEO1xuLy8gICAgIGNoYXIgICAgICAgIHN6Tmlja05hbWVbMzJdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GcmllbmRMaXN0XG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICBuQ291bnQ7ICAgICAgICAgICAgIC8v5Liq5pWwXG4vLyAgICAgQ01EX0dQX0ZpbmRVc2VyICAgICBGdXNlclsxMF07ICAvL+acgOWkmlxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9TZW5kTW9uZXlcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBEV09SRCAgICAgICBkd0ZyaWVuZElEO1xuLy8gICAgIExPTkdMT05HICAgIGxTY29yZTtcbi8vIH07XG5cbi8vIHN0cnVjdCB0YWdUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzelNlbmROYW1lWzMyXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6QWNjZXB0TmFtZVszMl07XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICBsVHJhbkdvbGQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1RyYW5SZWNvcmRcbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgIG5Db3VudDtcbi8vICAgICB0YWdUcmFuUmVjb3JkICAgICAgIFJlY29yZFsyMF07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1NlbmRSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6U2VuZE5hbWVbMzJdO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pBY2NlcHROYW1lWzMyXTtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgIGxTY29yZTtcbi8vIH07XG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyAvL+i2o+ivree7k+aehFxuLy8gc3RydWN0IENNRF9HRl9Vc2VyRnVuXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOWPt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNYWluSW5kZXg7ICAgICAgICAgICAgICAgICAgICAgLy/otqPor63mnaHnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3U3ViSW5kZXg7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dGX0xldmVsSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgd0NoYWlySUQ7XG4vLyAgICAgTE9ORyAgICBsR2FtZUxldmVsO1xuLy8gICAgIExPTkcgICAgQXdhcmRUeXBlO1xuLy8gICAgIExPTkcgICAgQXdhcmRWYWx1ZTtcbi8vICAgICBMT05HICAgIGxFeHBlcmllbmNlO1xuLy8gICAgIExPTkdMT05HICAgIGxMZXZlbFVwVmFsdWU7XG4vLyB9O1xuXG4vLyAvL+ivt+axguS7u+WKoVxuLy8gc3RydWN0IENNRF9HRl9NaXNzaW9uUmVxdWVzdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1pc3Npb25UeXBlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyB9O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy/mtojmga/nsbvlnotcbnBsYXphX2NtZC5TTVRfSU5GTyA9IDB4MDAwMTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG5wbGF6YV9jbWQuU01UX0VKRUNUID0gMHgwMDAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbnBsYXphX2NtZC5TTVRfR0xPQkFMID0gMHgwMDA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhajlsYDmtojmga9cbnBsYXphX2NtZC5TTVRfQ0xPU0VfR0FNRSA9IDB4MTAwMDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5ri45oiPXG5cbm1vZHVsZS5leHBvcnRzID0gcGxhemFfY21kOyIsInZhciB6amhfY21kID0ge307XG5cblxuempoX2NtZC5LSU5EX0lEID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuempoX2NtZC5TRVJWRVJfSUQgPSAzMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnI3liqHlmaggSSBEXG56amhfY21kLkdBTUVfUExBWUVSID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5Lq65pWwXG56amhfY21kLkdBTUVfTkFNRSA9IFwi6K+I6YeR6IqxXCI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+WQjeWtl1xuLy8gempoX2NtZC5HQU1FX0dFTlJFICAgICAgICAgICAgICAgICAgICAgIChHQU1FX0dFTlJFX0dPTER8R0FNRV9HRU5SRV9NQVRDSCkgIC8v5ri45oiP57G75Z6LXG56amhfY21kLk1BWF9DT1VOVCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJkeWFi+aVsOebrlxuXG5cbnpqaF9jbWQuU0VSVkVSQUREUkVTUyA9IFwiMTI3LjAuMC4xXCI7XG56amhfY21kLlNFUlZFUl9QT1JUID0gMTY4MDtcblxuLy/nu5PmnZ/ljp/lm6BcbnpqaF9jbWQuR0VSX05PX1BMQVlFUiA9IDB4MTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ayoeacieeOqeWutlxuempoX2NtZC5HRVJfQ09NUEFSRUNBUkQgPSAweDIwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznu5PmnZ9cbnpqaF9jbWQuR0VSX09QRU5DQVJEID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM57uT5p2fXG5cbi8v5ri45oiP54q25oCBXG56amhfY21kLkdTX1RLX0ZSRUUgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5byA5aeLXG56amhfY21kLkdTX1RLX1BMQVlJTkcgPSAxMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ov5vooYxcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5pyN5Yqh5Zmo5ZG95Luk57uT5p6EXG5cbnpqaF9jbWQuU1VCX1NfR0FNRV9TVEFSVCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuempoX2NtZC5TVUJfU19BRERfU0NPUkUgPSAxMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jnu5PmnpxcbnpqaF9jbWQuU1VCX1NfR0lWRV9VUCA9IDEwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+i3n+azqFxuempoX2NtZC5TVUJfU19DT01QQVJFX0NBUkQgPSAxMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzot5/ms6hcbnpqaF9jbWQuU1VCX1NfTE9PS19DQVJEID0gMTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM6Lef5rOoXG56amhfY21kLlNVQl9TX1NFTkRfQ0FSRCA9IDEwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkeeJjOa2iOaBr1xuempoX2NtZC5TVUJfU19HQU1FX0VORCA9IDEwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adn1xuempoX2NtZC5TVUJfU19QTEFZRVJfRVhJVCA9IDEwNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+W8uumAgFxuempoX2NtZC5TVUJfU19PUEVOX0NBUkQgPSAxMDg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYzmtojmga9cbnpqaF9jbWQuU1VCX1NfV0FJVF9DT01QQVJFID0gMTA5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5q+U54mMXG56amhfY21kLlNVQl9TX0xBU1RfQUREID0gMTEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyAvL+a4uOaIj+eKtuaAgVxuLy8gc3RydWN0IENNRF9TX1N0YXR1c0ZyZWVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WfuuehgOenr+WIhlxuLy8gfTtcblxuLy8gLy/muLjmiI/nirbmgIFcbi8vIHN0cnVjdCBDTURfU19TdGF0dXNQbGF5XG4vLyB7XG4vLyAgICAgLy/liqDms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4Q2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WNleWFg+S4iumZkFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v54q25oCB5L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk1pbmdaaHVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgICAgLy/nnIvniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVGFibGVTY29yZVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAvL+S4i+azqOaVsOebrlxuICAgIFxuLy8gICAgIC8v5omR5YWL5L+h5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIYW5kQ2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/miZHlhYvmlbDmja5cbiAgICBcbi8vICAgICAvL+eKtuaAgeS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vIH07XG5cbi8vIC8v5ri45oiP5byA5aeLXG4vLyBzdHJ1Y3QgQ01EX1NfR2FtZVN0YXJ0XG4vLyB7XG4vLyAgICAgLy/kuIvms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOWkp+S4i+azqFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v55So5oi35L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+S4i+azqFxuLy8gc3RydWN0IENNRF9TX0FkZFNjb3JlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QWRkU2NvcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEFkZFNjb3JlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jmlbDnm65cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblraTms6jkuIDmjrdcbi8vIH07XG5cbi8vIC8v55So5oi35pS+5byDXG4vLyBzdHJ1Y3QgQ01EX1NfR2l2ZVVwXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0dpdmVVcFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mlL7lvIPnlKjmiLdcbi8vIH07XG5cbi8vIC8v5q+U54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfQ29tcGFyZUNhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlclsyXTsgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ovpPniYznlKjmiLdcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTG9zdENhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgIC8v6L6T5a6254mM5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+eci+eJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX0xvb2tDYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvb2tDYXJkVXNlcjsgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYznlKjmiLdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkNhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgICAgICAvL+eUqOaIt+aJkeWFi1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyB9O1xuXG4vLyAvL+W8gOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX09wZW5DYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpbm5lcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnlKjmiLdcbi8vIH07XG5cbi8vIC8v5a2k5rOo5LiA5o63XG4vLyBzdHJ1Y3QgQ01EX1NfTGFzdEFkZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGFydExhc3RBZGRVc2VyO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl07XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyW0dBTUVfUExBWUVSXTtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuO1xuLy8gfTtcblxuXG4vLyAvL+a4uOaIj+e7k+adn1xuLy8gc3RydWN0IENNRF9TX0dhbWVFbmRcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZVRheDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eojuaUtlxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lU2NvcmVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgIC8v5ri45oiP5b6X5YiGXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JDYXJkRGF0YVtHQU1FX1BMQVlFUl1bTUFYX0NPVU5UXTsgLy/nlKjmiLfmiZHlhYtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdWzRdOyAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmRTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57uT5p2f54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+mAgOWHulxuLy8gc3RydWN0IENNRF9TX1BsYXllckV4aXRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3UGxheWVySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAgOWHuueUqOaIt1xuLy8gfTtcblxuLy8gLy/nrYnlvoXmr5TniYxcbi8vIHN0cnVjdCBDTURfU19XYWl0Q29tcGFyZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL+WuouaIt+err+WRveS7pOe7k+aehFxuempoX2NtZC5TVUJfQ19BRERfU0NPUkUgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliqDms6hcbnpqaF9jbWQuU1VCX0NfR0lWRV9VUCA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+a2iOaBr1xuempoX2NtZC5TVUJfQ19DT01QQVJFX0NBUkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfTE9PS19DQVJEID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM5raI5oGvXG56amhfY21kLlNVQl9DX09QRU5fQ0FSRCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19XQUlUX0NPTVBBUkUgPSA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXmr5TniYxcbnpqaF9jbWQuU1VCX0NfRklOSVNIX0ZMQVNIID0gNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a6M5oiQ5Yqo55S7XG56amhfY21kLlNVQl9DX0xBU1RfQUREID0gODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG5cbi8vIC8v55So5oi35Yqg5rOoXG4vLyBzdHJ1Y3QgQ01EX0NfQWRkU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN54q25oCBXG4vLyB9O1xuXG4vLyAvL+avlOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9DX0NvbXBhcmVDYXJkXG4vLyB7ICAgXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbm1vZHVsZS5leHBvcnRzID0gempoX2NtZDsiLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9wcm9kdWN0TmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfcHJvZHVjdFByaWNlOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9wYXlQcmljZTogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgaWYodGhpcy5fcGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcHJvZHVjdE5hbWUuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wiZ29vZHNfbmFtZVwiXTtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9wcm9kdWN0UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcGF5UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW2luaXRdIFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5fcGFyYW1zKSk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLndGYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgLy8gdGhpcy5fZmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIC8vIHRoaXMub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgSlNPTi5zdHJpbmdpZnkocGFyYW1zLmRldGFpbCkpO1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VVc2VyRmFjZVwiLHBhcmFtcy5kZXRhaWwpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHZhciBGYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1Nob3BWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkNhbnZhc1wiKS5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdIEFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xudmFyIGdhbWVfY21kID0gcmVxdWlyZShcIkNNRF9HYW1lXCIpO1xudmFyIHBsYXphX2NtZCA9IHJlcXVpcmUoXCJDTURfUGxhemFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVNlcnZlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVNlcnZlckl0ZW1cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciBHYW1lVXNlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVVzZXJJdGVtXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl93VGFibGVDb3VudCA9IDBcblx0ICAgIHRoaXMuX3dDaGFpckNvdW50ID0gMFxuXHQgICAgdGhpcy5fd1NlcnZlclR5cGUgPSAwXG5cdCAgICB0aGlzLl9kd1NlcnZlclJ1bGUgPSAwXG4gICAgICAgIHRoaXMuX3VzZXJMaXN0ID0ge307ICBcbiAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdCA9IHt9O1xuICAgICAgICB0aGlzLl90YWJsZVN0YXR1cyA9IHt9O1xuICAgICAgICB0aGlzLl93VGFibGVJRCA9IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFO1xuICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSO1xuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uUGFja2V0KCk7XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSkge1xuICAgICAgICBpZihtYWluID09PSBnYW1lX2NtZC5NRE1fR1JfTE9HT04peyAvL+eZu+W9lea2iOaBr1xuICAgICAgICAgICAgdGhpcy5PblNvY2tldE1haW5Mb2dvbihzdWIscERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gZ2FtZV9jbWQuTURNX0dSX1VTRVIpey8v55So5oi35raI5oGvXG4gICAgICAgICAgICB0aGlzLk9uU29ja2V0TWFpblVzZXIoc3ViLHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1haW4gPT09IGdhbWVfY21kLk1ETV9HUl9JTkZPKXsgLy/phY3nva7mtojmga9cbiAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRNYWluSW5mbyhzdWIscERhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLns7vnu5/mtojmga9cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBnYW1lX2NtZC5NRE1fR1JfU1RBVFVTKXsvL+eKtuaAgea2iOaBr1xuICAgICAgICAgICAgdGhpcy5PblNvY2tldE1haW5TdGF0dXMoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi57O757uf5raI5oGvXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gZ2FtZV9jbWQuTURNX0dSX1NZU1RFTSl7Ly/ns7vnu5/mtojmga9cbiAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRNYWluU3lzdGVtKHN1YixwRGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuezu+e7n+a2iOaBr1wiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1haW4gPT09IGdhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GTyl7Ly/miL/pl7Tmtojmga9cbiAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRNYWluU2VydmVySW5mbyhzdWIscERhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLns7vnu5/mtojmga9cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy/muLjmiI/mtojmga8g5qGG5p625raI5oGvIOekvOeJqea2iOaBr1xuICAgICAgICBlbHNlIGlmKG1haW4gPT09IEdsb2JhbERlZi5NRE1fR0ZfR0FNRSB8fCBtYWluID09PSBHbG9iYWxEZWYuTURNX0dGX0ZSQU1FIHx8IG1haW4gPT09R2xvYmFsRGVmLk1ETV9HRl9QUkVTRU5UKXtcbiAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRNYWluR2FtZUZyYW1lKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi57O757uf5raI5oGvXCIpOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5Mb2dvbjogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluTG9nb25dXCIpO1xuICAgICAgICBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fU1VDQ0VTUyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBsb2dvbiBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdGhpcy5fdXNlckxpc3QgPSB7fTtcbiAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoXCJMb2dvblN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRVJST1IpIHtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRklOSVNIKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBmaW5pc2hcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpblVzZXI6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ09NRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX0NPTUVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlVzZXJDb21lKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQVRVUzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX1NUQVRVU1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViU3RhdHVzKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfU0NPUkVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlNjb3JlKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1JJR0hUOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfUklHSFRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlJpZ2h0KHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVNQkVSX09SREVSXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJNZW1iZXJPcmRlcihzdWIscERhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfU0lUX0ZBSUxFRDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TSVRfRkFJTEVEXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJTaXRGYWlsZWQoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ0hBVDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX0NIQVRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YkNoYXQoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfV0lTUEVSOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfV0lTUEVSXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJXaXNwZXIoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfSU5WSVRFXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJVc2VySW52aXRlKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9RVUVSWV9HT0xEOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1FVRVJZX0dPTERcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlF1ZXJ5R29sZChzdWIscERhdGEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9QUkVTRU5EX1FVRVJZXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJQcmVzZW50UXVlcnkoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1I6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfUFJFU0VOVF9FUlJPUlwiKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5JbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TRVJWRVJfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX0NPTFVNTl9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9DT05GSUdfRklOSVNIXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU3RhdHVzXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1RBQkxFX0lORk9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9TVEFUVVM6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVEFCTEVfU1RBVFVTXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluU3lzdGVtOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU3lzdGVtXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9NRVNTQUdFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX01FU1NBR0VcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5TZXJ2ZXJJbmZvOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU2VydmVySW5mb11cIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfT05MSU5FX0NPVU5UX0lORk86XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfT05MSU5FX0NPVU5UX0lORk9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5HYW1lRnJhbWU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5HYW1lRnJhbWVdXCIpO1xuICAgIH0sXG4gICAgLy/nlKjmiLfov5vlhaVcbiAgICBPblNvY2tldFN1YlVzZXJDb21lOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJVc2VyQ29tZV1cIik7XG4gICAgICAgIHZhciB1c2VySXRlbSA9IG5ldyBHYW1lVXNlckl0ZW0oKTtcbiAgICAgICAgdXNlckl0ZW0uaW5pdERhdGFCeVVzZXJJbmZvSGVhZChwRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJVc2VyQ29tZV0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VySXRlbSkpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXTtcbiAgICAgICAgLy8gaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXSA9IHVzZXJJdGVtO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8v6K6w5b2V6Ieq5bex55qE5qGM5Y+3XG4gICAgICAgIGlmICh1c2VySXRlbS5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dUYWJsZUlEID0gdXNlckl0ZW0ud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJJdGVtLndDaGFpcklEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VySXRlbS53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgJiYgdXNlckl0ZW0ud0NoYWlySUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRhVGFibGVVc2VyKHVzZXJJdGVtLndUYWJsZUlELHVzZXJJdGVtLndDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlckVudGVyXCIse1xuICAgICAgICAgICAgICAgIHdUYWJsZUlEOnVzZXJJdGVtLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIHdDaGFpcklEOnVzZXJJdGVtLndDaGFpcklELFxuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdXCIpO1xuICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTdGF0dXNcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOS9jee9rlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/mlbDmja7lupMgSURcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgdXNlclN0YXR1cyA9IHt9O1xuICAgICAgICB1c2VyU3RhdHVzLndUYWJsZUlEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdXNlclN0YXR1cy5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHVzZXJTdGF0dXMud0NoYWlySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuXG4gICAgICAgIHZhciB1c2VySXRlbSA9IHRoaXMuc2VhcmNoVXNlckJ5VXNlcklEKHVzZXJTdGF0dXMuZHdVc2VySUQpO1xuICAgICAgICB2YXIgbXlVc2VySXRlbSA9IHRoaXMuZ2V0TWVVc2VySXRlbSgpO1xuICAgICAgICBpZiAoIW15VXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOacquaJvuWIsOiHquW3sVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL+aJvuS4jeWIsOeUqOaIt1xuICAgICAgICBpZiAoIXVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmib7kuI3liLDnlKjmiLdcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy/orrDlvZXml6fnirbmgIFcbiAgICAgICAgdmFyIG9sZFN0YXR1cyA9IHt9O1xuICAgICAgICBvbGRTdGF0dXMud1RhYmxlSUQgPSB1c2VySXRlbS53VGFibGVJRDtcbiAgICAgICAgb2xkU3RhdHVzLndDaGFpcklEID0gdXNlckl0ZW0ud0NoYWlySUQ7XG4gICAgICAgIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPSB1c2VySXRlbS5jYlVzZXJTdGF0dXM7XG5cbiAgICAgICAgLy/mm7TmlrDkv6Hmga9cbiAgICAgICAgdXNlckl0ZW0uY2JVc2VyU3RhdHVzID0gdXNlclN0YXR1cy5jYlVzZXJTdGF0dXM7XG4gICAgICAgIHVzZXJJdGVtLndUYWJsZUlEID0gdXNlclN0YXR1cy53VGFibGVJRDtcbiAgICAgICAgdXNlckl0ZW0ud0NoYWlySUQgPSB1c2VyU3RhdHVzLndDaGFpcklEO1xuXG4gICAgICAgIC8v5riF6Zmk5pen5qGM5a2Q5qSF5a2Q6K6w5b2VXG4gICAgICAgIGlmKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgIC8v5paw5pen5qGM5a2Q5LiN5ZCMIOaWsOaXp+akheWtkOS4jeWQjFxuICAgICAgICAgICAgaWYgKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gdXNlclN0YXR1cy53VGFibGVJRCB8fCBvbGRTdGF0dXMud0NoYWlySUQgIT09IHVzZXJTdGF0dXMud0NoYWlySUQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVXBEYXRhVGFibGVVc2VyKG9sZFN0YXR1cy53VGFibGVJRCwgb2xkU3RhdHVzLndDaGFpcklELCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5paw5qGM5a2Q6K6w5b2VXG4gICAgICAgIGlmICh1c2VyU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgdGhpcy5vblVwRGF0YVRhYmxlVXNlcih1c2VyU3RhdHVzLndUYWJsZUlELCB1c2VyU3RhdHVzLndDaGFpcklELCB1c2VySXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+iHquW3seeKtuaAgVxuICAgICAgICBpZiAobXlVc2VySXRlbS5kd1VzZXJJRCA9PT0gdXNlclN0YXR1cy5kd1VzZXJJRCkge1xuICAgICAgICAgICAgdGhpcy5fd1RhYmxlSUQgPSB1c2VyU3RhdHVzLndUYWJsZUlEO1xuICAgICAgICAgICAgdGhpcy5fd0NoYWlySUQgPSB1c2VyU3RhdHVzLndDaGFpcklEO1xuXG4gICAgICAgICAgICAvL+emu+W8gFxuICAgICAgICAgICAgaWYgKHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID09PSBHbG9iYWxEZWYuVVNfTlVMTCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3seemu+W8gFwiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FeGl0Um9vbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v6LW356uLXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX0ZSRUUgJiYgb2xkU3RhdHVzLmNiVXNlclN0YXR1cyA+IEdsb2JhbERlZi5VU19GUkVFKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex6LW356uLXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV4aXRUYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Z2Q5LiLXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA+IEdsb2JhbERlZi5VU19GUkVFICYmIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPCBHbG9iYWxEZWYuVVNfU0lUKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex5Z2Q5LiLXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkVudGVyVGFibGVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+aNouS9jVxuICAgICAgICAgICAgZWxzZSBpZiAodXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmjaLkvY1cIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJUYWJsZVwiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3seaWsOeKtuaAgSBcIiArIEpTT04uc3RyaW5naWZ5KHVzZXJTdGF0dXMpKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+S7luS6uueKtuaAgVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8v5pu05paw55So5oi3XG4gICAgICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSB8fCB1c2VyU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/liKDpmaTnlKjmiLdcbiAgICAgICAgICAgIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX05VTEwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlVXNlcih1c2VyU3RhdHVzLmR3VXNlcklEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBPblNvY2tldFN1YlNjb3JlOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTY29yZV1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlJpZ2h0OiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJSaWdodF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1Yk1lbWJlck9yZGVyOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJNZW1iZXJPcmRlcl1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlNpdEZhaWxlZDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2l0RmFpbGVkXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViQ2hhdDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViQ2hhdF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1Yldpc3BlcjogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViV2lzcGVyXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViVXNlckludml0ZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckludml0ZV1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlF1ZXJ5R29sZDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViUXVlcnlHb2xkXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViUHJlc2VudFF1ZXJ5OiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJQcmVzZW50UXVlcnldXCIpO1xuICAgIH0sXG4gICAgc2VuZExvZ29uUGFja2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX0xPR09OLGdhbWVfY21kLlNVQl9HUl9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHdvcmQoR2xvYmFsVXNlckRhdGEud0VuY3J5cHRJRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNod29yZChHbG9iYWxVc2VyRGF0YS53Q29kZUNoZWNrSUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEKTtcblxuICAgICAgICB2YXIgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMjtcbiAgICAgICAgfVxuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKGR3TW9iaWxlU3lzVHlwZSk7XG5cbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCwzMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgICAgIC8vIC8v5omL5py655m76ZmGXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRE1vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdXZWlYaW5DaGVja0lEO1x0XHRcdFx0XHQvL+W+ruS/oemqjOivgeeggVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVTeXNUeXBlO1x0XHRcdFx0XHQvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBWZXJzaW9uO1x0XHRcdFx0XHQvL+a4uOaIj0FQUOeJiOacrOWPtyjkuI7nmbvpmYblpKfljoXnm7jlkIwpXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pQYXNzV29yZFtQQVNTX0xFTl07XHRcdFx0XHQvL+eZu+W9leWvhueggVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dO1x0Ly/mnLrlmajluo/liJflj7dcbiAgICAgICAgLy8gfTtcbiAgICB9LFxuXG4gICAgb25VcERhdGFUYWJsZVVzZXI6IGZ1bmN0aW9uICh0YWJsZWlkLGNoYWlyaWQsdXNlcml0ZW0pIHtcbiAgICAgICAgdmFyIGlkID0gdGFibGVpZDtcbiAgICAgICAgdmFyIGlkZXggPSBjaGFpcmlkO1xuICAgICAgICBpZiAoIXRoaXMuX3RhYmxlVXNlckxpc3RbaWRdKSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdFtpZF1baWRleF0gPSB1c2VyaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRUYWJsZVVzZXJJdGVtOiBmdW5jdGlvbiAodGFibGVpZCxjaGFpcmlkKSB7XG4gICAgICAgIHZhciBpZCA9IHRhYmxlaWQ7XG4gICAgICAgIHZhciBpZGV4ID0gY2hhaXJpZDtcbiAgICAgICAgaWYgKHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGVVc2VyTGlzdFtpZF1baWRleF07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldE1lVXNlckl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJMaXN0W0dsb2JhbFVzZXJEYXRhLmR3VXNlcklEXTtcbiAgICB9LFxuICAgIHNlYXJjaFVzZXJCeVVzZXJJRDogZnVuY3Rpb24gKGR3VXNlcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTGlzdFtkd1VzZXJJRF07XG4gICAgfSxcbiAgICBvblJlbW92ZVVzZXI6IGZ1bmN0aW9uIChkd1VzZXJJRCkge1xuICAgICAgICB0aGlzLl91c2VyTGlzdFtkd1VzZXJJRF0gPSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2FtZVNlcnZlckl0ZW0gPSBjYy5DbGFzcyh7XG4gICAgd1NvcnRJRDogdW5kZWZpbmVkLFxuICAgIHdLaW5kSUQ6IHVuZGVmaW5lZCxcbiAgICB3U2VydmVySUQ6IHVuZGVmaW5lZCxcbiAgICB3U3RhdGlvbklEOiB1bmRlZmluZWQsXG4gICAgd1NlcnZlclBvcnQ6IHVuZGVmaW5lZCxcbiAgICBkd1NlcnZlckFkZHI6IHVuZGVmaW5lZCxcbiAgICBkd09uTGluZUNvdW50OiB1bmRlZmluZWQsXG4gICAgc3pTZXJ2ZXJOYW1lOiB1bmRlZmluZWQsXG4gICAgY3RvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT0qIEdhbWVTZXJ2ZXJJdGVtIGN0b3IgICo9PT09PVwiKVxuICAgICAgICB0aGlzLndTb3J0SUQgPSAwO1xuICAgICAgICB0aGlzLndLaW5kSUQgPSAwO1xuICAgICAgICB0aGlzLndTZXJ2ZXJJRCA9IDA7XG4gICAgICAgIHRoaXMud1N0YXRpb25JRCA9IDA7XG4gICAgICAgIHRoaXMud1NlcnZlclBvcnQgPSAwO1xuICAgICAgICB0aGlzLmR3U2VydmVyQWRkciA9IDA7XG4gICAgICAgIHRoaXMuZHdPbkxpbmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gXCJcIjtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCI9PT09PSogR2FtZVNlcnZlckl0ZW0gb25Jbml0ICAqPT09PT1cIilcbiAgICAgICAgdGhpcy53U29ydElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U2VydmVySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTdGF0aW9uSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTZXJ2ZXJQb3J0ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1NlcnZlckFkZHIgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd09uTGluZUNvdW50ID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibGVuID0gXCIrcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHdoaWxlKHRydWUpe1xuICAgICAgICAgICAgLy/pu5jorqTkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX05VTExcdFx0XHRcdFx0MFx0XHRcdFx0XHRcdFx0XHQvL+aXoOaViOaVsOaNrlxuICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fTEVWRUxcdFx0MzAwMFx0XHRcdFx0XHRcdFx0Ly/miL/pl7TnrYnnuqdcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fQ0VMTFx0XHQzMDAxXHRcdFx0XHRcdFx0XHQvL+aIv+mXtOW6leWIhlxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9NSU5TQ09SRVx0MzAwMlx0XHRcdFx0XHRcdFx0Ly/miL/pl7TmnIDlsI/liIbmlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX0REWl9CT01CX01BWFx0MzAwM1x0XHRcdFx0XHRcdFx0Ly/mlpflnLDkuLvmnIDlpKflgI3mlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fSU5GT1x0XHQzMDA0XHRcdFx0XHRcdFx0XHQvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHZhciBkYXRhU2l6ZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgdmFyIGRhdGFEZXNjcmliZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaXplID0gXCIrZGF0YVNpemUrXCIgZGVzY3JpYmUgPSBcIitkYXRhRGVzY3JpYmUpO1xuICAgICAgICAgICAgaWYgKGRhdGFEZXNjcmliZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHN3aXRjaChkYXRhRGVzY3JpYmUpe1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYlJvb21MZXZlbCA9IHBEYXRhLnJlYWRieXRlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubEJhc2VTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTGltaXRTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTWF4Qm9tYkxpbWl0ID0gcERhdGEucmVhZGludCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN6RGVzY3JpYmVUeHQgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplLHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU2VydmVySXRlbTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHYW1lVXNlckl0ZW0gPSBjYy5DbGFzcyh7XG4gICAgLy/nlKjmiLfkv6Hmga/nu5PmnoRcbiAgICAvLyBzdHJ1Y3QgdGFnVXNlckRhdGFcbiAgICAvLyB7XG4gICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdFx0Ly/kuIrkvKDlpLTlg49cbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHcm91cElEO1x0XHRcdFx0XHRcdFx0Ly/npL7lm6LntKLlvJVcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnrYnnuqdcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01hc3RlclJpZ2h0O1x0XHRcdFx0XHRcdC8v566h55CG5p2D6ZmQXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TmFtZVszMl07XHRcdFx0XHRcdC8v55So5oi35ZCN5a2XXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6R3JvdXBOYW1lWzMyXTtcdFx0XHRcdC8v56S+5Zui5ZCN5a2XXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6VW5kZXJXcml0ZVszMl07XHRcdC8v5Liq5oCn562+5ZCNXG4gICAgICAgIFxuICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLfmgKfliKtcbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlck9yZGVyO1x0XHRcdFx0XHRcdC8v5Lya5ZGY562J57qnXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNYXN0ZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+euoeeQhuetiee6p1xuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLfnp6/liIZcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+a2iOi0uemHkeW4gVxuICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxEcmF3Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+WSjOWxgOebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgIFxuICAgIC8vICAgICAvL+eUqOaIt+eKtuaAgVxuICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDlj7fnoIFcbiAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgIFxuICAgIC8vICAgICAvL+WFtuS7luS/oeaBr1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiQ29tcGFuaW9uO1x0XHRcdFx0XHRcdC8v55So5oi35YWz57O7XG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3UHJvcFJlc2lkdWFsVGltZVsxNV07XHQvL+mBk+WFt+aXtumXtFxuICAgIC8vIH07XG4gICAgICAgIC8v55So5oi35bGe5oCnXG4gICAgd0ZhY2VJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4gICAgZHdDdXN0b21GYWNlVmVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG4gICAgZHdVc2VySUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuICAgIGR3R3JvdXBJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ekvuWboue0ouW8lVxuICAgIGR3R2FtZUlEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbiAgICBkd1VzZXJSaWdodDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnrYnnuqdcbiAgICBsTG92ZWxpbmVzczp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbiAgICBkd01hc3RlclJpZ2h0OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbmnYPpmZBcbiAgICBzek5hbWU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WQjeWtl1xuICAgIHN6R3JvdXBOYW1lOnVuZGVmaW5lZCwgICAgICAgICAgICAgLy/npL7lm6LlkI3lrZdcbiAgICBzelVuZGVyV3JpdGU6dW5kZWZpbmVkLCAgICAgIC8v5Liq5oCn562+5ZCNXG4gICAgXG4gICAgLy/nlKjmiLflsZ7mgKdcbiAgICBjYkdlbmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbiAgICBjYk1lbWJlck9yZGVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbiAgICBjYk1hc3Rlck9yZGVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbnrYnnuqdcbiAgICBcbiAgICAvL+eUqOaIt+enr+WIhlxuICAgIGxJbnN1cmVTY29yZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOi0uemHkeW4gVxuICAgIGxHYW1lR29sZDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgIGxTY29yZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgIGxXaW5Db3VudDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeebmOaVsFxuICAgIGxMb3N0Q291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0peebmOaVsFxuICAgIGxEcmF3Q291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+WSjOWxgOebmOaVsFxuICAgIGxGbGVlQ291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+aVsOebrlxuICAgIGxFeHBlcmllbmNlOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuICAgIFxuICAgIC8v55So5oi354q25oCBXG4gICAgd1RhYmxlSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4gICAgd0NoYWlySUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4gICAgY2JVc2VyU3RhdHVzOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG4gICAgXG4gICAgLy8gLy/lhbbku5bkv6Hmga9cbiAgICAvLyBjYkNvbXBhbmlvbjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflhbPns7tcbiAgICAvLyBkd1Byb3BSZXNpZHVhbFRpbWU6dW5kZWZpbmVkLCAvL+mBk+WFt+aXtumXtFxuICAgIGluaXREYXRhQnlVc2VySW5mb0hlYWQ6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICB2YXIgdXNlckluZm9IZWFkID0gdGhpcy5yZWFkVXNlckluZm9IZWFkKHBEYXRhKTtcbiAgICAgICAgdGhpcy5kd1VzZXJJRCA9IHVzZXJJbmZvSGVhZC5kd1VzZXJJRDtcbiAgICAgICAgdGhpcy53VGFibGVJRCA9IHVzZXJJbmZvSGVhZC53VGFibGVJRDtcbiAgICAgICAgdGhpcy53Q2hhaXJJRCA9IHVzZXJJbmZvSGVhZC53Q2hhaXJJRDtcbiAgICAgICAgdGhpcy5jYlVzZXJTdGF0dXMgPSB1c2VySW5mb0hlYWQuY2JVc2VyU3RhdHVzO1xuICAgICAgICB0aGlzLmR3VXNlclJpZ2h0ID0gdXNlckluZm9IZWFkLmR3VXNlclJpZ2h0O1xuICAgICAgICB0aGlzLmR3TWFzdGVyUmlnaHQgPSB1c2VySW5mb0hlYWQuZHdNYXN0ZXJSaWdodDtcbiAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy53RmFjZUlEID0gdXNlckluZm9IZWFkLndGYWNlSUQ7XG4gICAgICAgICAgICB0aGlzLmR3Q3VzdG9tRmFjZVZlciA9IHVzZXJJbmZvSGVhZC5kd0N1c3RvbUZhY2VWZXI7XG4gICAgICAgICAgICB0aGlzLmNiR2VuZGVyID0gdXNlckluZm9IZWFkLmNiR2VuZGVyO1xuICAgICAgICAgICAgdGhpcy5jYk1lbWJlck9yZGVyID0gdXNlckluZm9IZWFkLmNiTWVtYmVyT3JkZXI7XG4gICAgICAgICAgICB0aGlzLmNiTWFzdGVyT3JkZXIgPSB1c2VySW5mb0hlYWQuY2JNYXN0ZXJPcmRlcjtcbiAgICAgICAgICAgIHRoaXMuZHdHYW1lSUQgPSB1c2VySW5mb0hlYWQuZHdHYW1lSUQ7XG4gICAgICAgICAgICB0aGlzLmR3R3JvdXBJRCA9IHVzZXJJbmZvSGVhZC5kd0dyb3VwSUQ7XG4gICAgICAgICAgICB0aGlzLmxMb3ZlbGluZXNzID0gdXNlckluZm9IZWFkLmxMb3ZlbGluZXNzO1xuXG4gICAgICAgICAgICB0aGlzLmxTY29yZSA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxTY29yZTtcbiAgICAgICAgICAgIHRoaXMubEdhbWVHb2xkID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEdhbWVHb2xkO1xuICAgICAgICAgICAgdGhpcy5sSW5zdXJlU2NvcmUgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sSW5zdXJlU2NvcmU7XG4gICAgICAgICAgICB0aGlzLmxXaW5Db3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxXaW5Db3VudDtcbiAgICAgICAgICAgIHRoaXMubExvc3RDb3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxMb3N0Q291bnQ7XG4gICAgICAgICAgICB0aGlzLmxEcmF3Q291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRHJhd0NvdW50O1xuICAgICAgICAgICAgdGhpcy5sRmxlZUNvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEZsZWVDb3VudDtcbiAgICAgICAgICAgIHRoaXMubEV4cGVyaWVuY2UgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRXhwZXJpZW5jZTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSh0cnVlKXtcbiAgICAgICAgICAgIC8v6buY6K6k5L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9OVUxMXHRcdFx0XHRcdDBcdFx0XHRcdFx0XHRcdFx0Ly/ml6DmlYjmlbDmja5cbiAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lXHREVFBfVVNFUl9BQ0NPVU5UU1x0XHRcdDNcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfluJDlj7dcbiAgICAgICAgICAgIC8vICNkZWZpbmVcdERUUF9VTkRFUl9XUklURVx0XHRcdFx0OVx0XHRcdFx0XHRcdFx0XHQvL+S4quaAp+etvuWQjVxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfVVNFUl9HUk9VUF9OQU1FXHRcdFx0MzAxXHRcdFx0XHRcdFx0XHRcdC8v56S+5Zui5ZCN5a2XXG5cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICB2YXIgZGF0YVNpemUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIHZhciBkYXRhRGVzY3JpYmUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZSA9IFwiK2RhdGFTaXplK1wiIGRlc2NyaWJlID0gXCIrZGF0YURlc2NyaWJlKTtcbiAgICAgICAgICAgIGlmIChkYXRhRGVzY3JpYmUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICBzd2l0Y2goZGF0YURlc2NyaWJlKXtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3pOYW1lID0gXCLmuLjmiI/nlKjmiLdcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zek5hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pVbmRlcldyaXRlID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDE6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pHcm91cE5hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVhZFVzZXJJbmZvSGVhZDogZnVuY3Rpb24gKHBEYXRhKSB7XG4gICAgICAgIC8v55So5oi35Z+65pys5L+h5oGv57uT5p6EXG4gICAgICAgIC8vIHN0cnVjdCB0YWdVc2VySW5mb0hlYWRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R3JvdXBJRDtcdFx0XHRcdFx0XHRcdC8v56S+5Zui57Si5byVXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJSaWdodDtcdFx0XHRcdFx0XHQvL+eUqOaIt+etiee6p1xuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNYXN0ZXJSaWdodDtcdFx0XHRcdFx0XHQvL+euoeeQhuadg+mZkFxuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWVtYmVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNYXN0ZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+euoeeQhuetiee6p1xuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5Y+356CBXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIC8vICAgICB0YWdVc2VyU2NvcmVcdFx0XHRcdFx0XHRVc2VyU2NvcmVJbmZvO1x0XHRcdFx0XHRcdC8v56ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy/nlKjmiLfnp6/liIbkv6Hmga9cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ1VzZXJTY29yZVxuICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bFNjb3JlO1x0XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+WIhuaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5a2Y5YKo6YeR5biBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxXaW5Db3VudDtcdFx0XHRcdFx0XHRcdC8v6IOc5Yip55uY5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEZsZWVDb3VudDtcdFx0XHRcdFx0XHRcdC8v5pat57q/5pWw55uuXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v5omp5bGV5L+h5oGvXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5raI6LS56YeR5biBXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdFx0Ly/kuIrkvKDlpLTlg49cbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3UHJvcFJlc2lkdWFsVGltZVsxNV07XHQvL+mBk+WFt+aXtumXtFxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgdXNlckluZm9IZWFkID0ge307XG4gICAgICAgIHVzZXJJbmZvSGVhZC53RmFjZUlEID0gcERhdGEucmVhZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbiAgICAgICAgdXNlckluZm9IZWFkLmR3VXNlcklEID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd0dhbWVJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuICAgICAgICB1c2VySW5mb0hlYWQuZHdHcm91cElEID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ekvuWboue0ouW8lVxuICAgICAgICB1c2VySW5mb0hlYWQuZHdVc2VyUmlnaHQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+etiee6p1xuICAgICAgICB1c2VySW5mb0hlYWQubExvdmVsaW5lc3MgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbiAgICAgICAgdXNlckluZm9IZWFkLmR3TWFzdGVyUmlnaHQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbmnYPpmZBcbiAgICAgICAgXG4gICAgICAgIC8v55So5oi35bGe5oCnXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYkdlbmRlciA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbiAgICAgICAgdXNlckluZm9IZWFkLmNiTWVtYmVyT3JkZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuICAgICAgICB1c2VySW5mb0hlYWQuY2JNYXN0ZXJPcmRlciA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG562J57qnXG4gICAgICAgIFxuICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICB1c2VySW5mb0hlYWQud1RhYmxlSUQgPSBwRGF0YS5yZWFkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4gICAgICAgIHVzZXJJbmZvSGVhZC53Q2hhaXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbiAgICAgICAgdXNlckluZm9IZWFkLmNiVXNlclN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICBcbiAgICAgICAgLy/nlKjmiLfnp6/liIZcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8gPSB7fTtcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFNjb3JlID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sR2FtZUdvbGQgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YeR5biBXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/lrZjlgqjph5HluIFcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFdpbkNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubExvc3RDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubERyYXdDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEZsZWVDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEV4cGVyaWVuY2UgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcblxuICAgICAgICB1c2VySW5mb0hlYWQuZHdDdXN0b21GYWNlVmVyID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWktOWDj1xuICAgICAgICB1c2VySW5mb0hlYWQuZHdQcm9wUmVzaWR1YWxUaW1lID0gW107Ly/pgZPlhbfml7bpl7RcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IDE1OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgICAgICB1c2VySW5mb0hlYWQuZHdQcm9wUmVzaWR1YWxUaW1lLnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlckluZm9IZWFkO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVVc2VySXRlbTsiLCJ2YXIgR2xvYmFsRGVmID0ge1xuICAgIE1BWF9DSEFJUjogMTAwLFx0XHRcdFx0XHRcdFx0XHQvL+KXisOTwqXDm+KAnMWS4peK4oCdXG4gICAgTUFYX0NIQUlSX05PUk1BTDogOCxcdFx0XHRcdFx0XHRcdFx0Ly/il4rDk8Klw5vCu8OAwqDLnVxuXG4gICAgSU5WQUxJRF9UQUJMRTogLTEsXHRcdFx0XHRcdFx0Ly/Fku+sgeKAk8Of4peKwr/il4rigJ3iiKviiYhcbiAgICBJTlZBTElEX0NIQUlSOiAtMSxcdFx0XHRcdFx0XHQvL8WS76yB4oCTw5/igJzFkuKXiuKAneKIq+KJiFxuXG4gICAgSE1BVENIX1BPUlRfTUlOOiAxMDAwMCxcdFx0XHRcdFx0XHRcdC8v4oCTwrDCoMKxwrvCuOKXisOT4oCTwrDiiILDgMO44oGE4oir4omIXG4gICAgSE1BVENIX1BPUlRfTUFYOiAyMDAwMCxcdFx0XHRcdFx0XHRcdC8v4oCTwrDCoMKxwrvCuOKXisOTwqXDm+KIgsOAw7jigYTiiKviiYhcbiAgICBITUFUQ0hfU0lHTl9NQVg6IDk5LFx0XHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjCteKAouKJpcKwwrHCu8K7wrjCscKu4oiay5rCu8OAwqDLneKApsWTxZPvrIFcbiAgICBITUFUQ0hfTUFYT05MSU5FOiA1MDAsXG5cbiAgICBNQVhfQU5EUk9JRDogMTAsXHRcdFx0XHRcdFx0XHRcdC8v5pyA5aSn5py65ZmoXG4gICAgTUFYX0NIQVRfTEVOOiAxMjgsXHRcdFx0XHRcdFx0XHRcdC8v6IGK5aSp6ZW/5bqmXG4gICAgTElNSVRfQ0hBVF9USU1FUzogMTIwMCxcdFx0XHRcdFx0XHRcdC8v6ZmQ5pe26IGK5aSpXG4gICAgLy/mraPlvI/mnI3liqHlmajlnLDlnYBcbiAgICBodHRwSW5pdFVybDogXCJodHRwOi8vdmVyLmpqaGdhbWUuY29tL0hhbmRsZS9oei9pbml0LmFzaHhcIiwgICAvL2FwcOWIneWni+WMluaOpeWPo+WcsOWdgFxuICAgIGh0dHBCYXNlVXJsOiBcImh0dHA6Ly9pbnRlcmZhY2UuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAvL3dlYuaOpeWPo+WcsOWdgFxuICAgIGh0dHBPcGVuVXJsOiBcImh0dHA6Ly91c2VyLmpqaGdhbWUuY29tL2ZpbmRwYXNzd29yZEhaLmFzcHhcIiwgIC8v5om+5Zue5a+G56CBXG4gICAgaHR0cFVzZXJDZW50ZXI6IFwiaHR0cDovL2YuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkuK3lv4NcbiAgICBMT0dPTl9TRVJWRVJfRE9NQUlOOiBcIm5uYXBwLmpqaGdhbWUuY29tXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgTE9HT05fU0VSVkVSX0lQOiBcIjEyMi4yMjYuMTg2LjM4XCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgUE9SVF9MT0dPTl9TRVJWRVI6IDkwMDksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5pyN5Yqh5ZmoXG5cbi8v56uv5Y+j5a6a5LmJXG4gICAgUE9SVF9WSURFT19TRVJWRVI6IDc2MDAsXHRcdFx0XHRcdFx0XHRcdC8v6KeG6aKR5pyN5Yqh5ZmoXG4gICAgUE9SVF9DRU5URVJfU0VSVkVSOiA5MDkwLFx0XHRcdFx0XHRcdFx0XHQvL+S4reW/g+acjeWKoeWZqFxuXG4gICAgQ0hBTk5FTElEX2luaXQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muKDpgZPlj7dcbiAgICBDSEFOTkVMSURfY2VudGVyOiA3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rig6YGT5Y+3XG4vL+e9kee7nOaVsOaNruWumuS5iVxuICAgIFNPQ0tFVF9WRVI6IDB4OEMsXHRcdFx0XHRcdFx0XHRcdC8v572R57uc54mI5pysXG4gICAgU09DS0VUX0JVRkZFUjogODE5MiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc57yT5YayXG4gICAgU09DS0VUX1BBQ0tFVDogODE5MixcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvL+WGheaguOWRveS7pOeggVxuICAgIE1ETV9LTl9DT01NQU5EOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhoXmoLjlkb3ku6RcbiAgICBTVUJfS05fREVURUNUX1NPQ0tFVDogNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qOA5rWL5ZG95LukXG4gICAgU1VCX0tOX1NIVVRfRE9XTl9TT0NLRVQ6IDksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4reaWree9kee7nFxuXG4gICAgLy9JUEMg5pWw5o2u5a6a5LmJXG4gICAgSVBDX1ZFUjogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSVBDIOeJiOacrFxuICAgIElQQ19JREVOVElGSUVSOiAweDAwMDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moIfor4blj7fnoIFcbiAgICBJUENfUEFDS0FHRTogNDA5NiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA5aSnIElQQyDljIVcbiAgICBJUENfQlVGRkVSOiA0MDk2LCAgICAvL+e8k+WGsumVv+W6plxuXG4gICAgVFlQRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8O3w7fCv+KAoeKJpcKn4oiCwrtcbiAgICBLSU5EX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwr/igKHigJPDleKJpcKn4oiCwrtcbiAgICBTVEFUSU9OX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCZw6bCteKAnuKJpcKn4oiCwrtcbiAgICBTRVJWRVJfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiJHDuMK64oCw4omlwqfiiILCu1xuICAgIE1PRFVMRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL86pwq/iiaXDg+KJpcKn4oiCwrtcblxuICAgIC8v4oCT4oCYwrHvo7/iiILCruKAnMOCXG4gICAgR0VOREVSX05VTEw6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8WSwqXDt+KEouKAk+KAmMKx76O/XG4gICAgR0VOREVSX0JPWTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vxpLigJPigJPigJjigJPigJjCse+jv1xuICAgIEdFTkRFUl9HSVJMOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiYjDhuKAk+KAmOKAk+KAmMKx76O/XG5cbiAgICAvL+KAncWSxZPiiJHCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9TQ09SRTogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwrXigJ7Dt8K1wr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfR09MRDogMHgwMDAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwr/Dt+KIgs+Awr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfTUFUQ0g6IDB4MDAwNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8KxwrvCu8K4wr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfRURVQ0FURTogMHgwMDA4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCUwrXCoeKIkcK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX1FUSEVSTUFUQ0g6IDB4MDAxNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iHquWumuS5ieavlOi1m+exu+Wei1xuXG4gICAgLy/igJ3iiJrCqsOf4peKwqXDg8Ko4oiCwq7igJzDglxuICAgIFVTX05VTEw6IDB4MDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ayoeacieeKtuaAgVxuICAgIFVTX0ZSRUU6IDB4MDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ermeeri+eKtuaAgVxuICAgIFVTX1NJVDogMHgwMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z2Q5LiL54q25oCBXG4gICAgVVNfUkVBRFk6IDB4MDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WQjOaEj+eKtuaAgVxuICAgIFVTX0xPT0tPTjogMHgwNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peB6KeC54q25oCBXG4gICAgVVNfUExBWTogMHgwNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4gICAgVVNfT0ZGTElORTogMHgwNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pat57q/54q25oCBXG5cbiAgICAvL+KJpcKn4oiCwrviiKvDjeKIgsKu4oCcw4JcbiAgICBOQU1FX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiay5ril4rDt+KJpcKn4oiCwrtcbiAgICBQQVNTX0xFTjogMzMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oia4oC5wqzDjuKJpcKn4oiCwrtcbiAgICBFTUFJTF9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAncKgxZPigLDiiaXCp+KIgsK7XG4gICAgR1JPVVBfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igKbDgcOV4omI4omlwqfiiILCu1xuICAgIENPTVBVVEVSX0lEX0xFTjogMzMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwqrLmeKIhsuc4oCTw5rCoeKAk1xuICAgIFVOREVSX1dSSVRFX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiPy4bigJPigJjCq8Kp4oiay5pcbiAgICBNT0JJTEVQSE9ORV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KIj8uG4oCT4oCYwqvCqeKImsuaXG5cbiAgICAvL0dsb2JhbEZyYW1lLmhcbiAgICBcblxufVxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxEZWY7XG4iLCJyZXF1aXJlKFwiTUQ1XCIpO1xuZnVuY3Rpb24gQWN0aW9uU2hvd1RhbkNodWFuZyh3aWRnZXQsIGNiKXtcbiAgICBpZiAoY2MuaXNWYWxpZCh3aWRnZXQpID09PSBmYWxzZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2xvYmFsRnVuXVtBY3Rpb25TaG93VGFuQ2h1YW5nXSB3aWRnZXQgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aWRnZXQub3BhY2l0eSA9IDA7XG4gICAgd2lkZ2V0LnNjYWxlID0gMC4wMTtcbiAgICB3aWRnZXQucnVuQWN0aW9uKGNjLnNwYXduKFxuICAgICAgICAgICAgY2MuZmFkZUluKDAuMjUpLFxuICAgICAgICAgICAgY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDEuMSksY2Muc2NhbGVUbygwLjA1LCAxLjApKSxjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgKSk7XG59XG5mdW5jdGlvbiBzaG93VG9hc3QoY29udGV4dCxtZXNzYWdlKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvVG9hc3RWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIFRvYXN0UHJlZmFiKSB7XG4gICAgICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKFRvYXN0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiVG9hc3RWaWV3XCIpLm9uSW5pdCh7bWVzc2FnZTptZXNzYWdlfSk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd1RvYXN0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dBbGVydChjb250ZXh0LG1lc3NhZ2UpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9BbGVydFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgQWxlcnRQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoQWxlcnRQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJBbGVydFZpZXdcIikuaW5pdCh7bWVzc2FnZTptZXNzYWdlfSk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93QWxlcnRcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qXG5zaG93UG9wV2FpdGluZygpXG5AcGFyYW1ze1xuICAgIHdhaXRpbmdUZXh0OiDnlYzpnaLmmL7npLrnmoTmloflrZcsXG4gICAgd2FpdGluZ1RpbWU6IOeVjOmdouWtmOWcqOeahOaXtumXtCzotoXml7bljbPplIDmr4HnlYzpnaIsXG4gICAgY2xvc2VFdmVudDog5YWz6Zet55WM6Z2i55uR5ZCs55qE5LqL5Lu2LCBcbiAgICBjYWxsQmFja0Z1bmM6IOaUtuWIsOebkeWQrOS6i+S7tuaJp+ihjOeahOWbnuiwg+WHveaVsCxcbn1cbiovXG5mdW5jdGlvbiBzaG93UG9wV2FpdGluZyhjb250ZXh0LHBhcmFtcykge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1BvcFdhaXRpbmdWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIFBvcFdhaXRQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoUG9wV2FpdFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIlBvcFdhaXRWaWV3XCIpLm9uSW5pdChwYXJhbXMpO1xuICAgICAgICAgICAgY29udGV4dC5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dQb3BXYWl0aW5nXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldHNpZ24ocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zICsgXCJrZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIjsvL+WKoOWFpWtleVxuICAgIHJldHVybiBjYy5tZDVFbmNvZGUocGFyYW1zKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpIHtcbiAgICB2YXIgbm93VGltZSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKTtcbiAgICBwYXJhbXNbXCJkYXRldGFtcFwiXSA9IG5vd1RpbWU7XG4gICAgdmFyIHNvcnRfcGFyYW1zID0gT2JqZWN0LmtleXMocGFyYW1zKS5zb3J0KClcbiAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxGdW5dW2J1aWxkUmVxdWVzdFBhcmFtXSBcIiArIEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgIHZhciBwYXJhbVN0cmluZyA9IFwiXCI7XG4gICAgZm9yICh2YXIga2kgaW4gc29ydF9wYXJhbXMpIHtcbiAgICAgICAgdmFyIGtleSA9IHNvcnRfcGFyYW1zW2tpXTtcbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZyArIGtleSArIFwiPVwiICsgZWxlbWVudCArIFwiJlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmcgKyBcInNpZ249XCIgKyBnZXRzaWduKHBhcmFtU3RyaW5nKTtcbiAgICByZXR1cm4gcGFyYW1TdHJpbmc7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBY3Rpb25TaG93VGFuQ2h1YW5nOiBBY3Rpb25TaG93VGFuQ2h1YW5nLFxuICAgIHNob3dUb2FzdDogc2hvd1RvYXN0LFxuICAgIHNob3dBbGVydDogc2hvd0FsZXJ0LFxuICAgIHNob3dQb3BXYWl0aW5nOiBzaG93UG9wV2FpdGluZyxcbiAgICBidWlsZFJlcXVlc3RQYXJhbTogYnVpbGRSZXF1ZXN0UGFyYW0sXG59OyIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHtcbiAgICB3RmFjZUlEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgY2JHZW5kZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgIGNiTWVtYmVyOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICBpc0d1ZXN0OiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/mmK/lkKbmmK/muLjlrqJcbiAgICBpc09wZW5SZWdpc3RlcjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/ms6jlhozlip/og71cbiAgICBpc09wZW5JQVA6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/oi7nmnpxpYXBcbiAgICB3RW5jcnlwdElEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgd0NvZGVDaGVja0lEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgIGR3VXNlcklEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgZHdHYW1lSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICBkd0V4cGVyaWVuY2U6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICBzek1vYmlsZUF1dGg6IHVuZGVmaW5lZCwgICAgICAgICAvL+azqOWGjOaXtumqjOivgeeggVxuICAgIHN6QWNjb3VudHM6IHVuZGVmaW5lZCxcdFx0XHQvL+eZu+W9leW4kOWPt1xuICAgIHN6Tmlja05hbWU6IHVuZGVmaW5lZCwgICAgICAgICAgIC8v546p5a625pi156ewXG4gICAgc3pQYXNzV29yZDogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5a+G56CBXG4gICAgc3pHcm91cE5hbWU6IHVuZGVmaW5lZCxcdFx0XHQvL+ekvuWbouS/oeaBr1xuICAgIHN6VW5kZXJXcml0ZTogdW5kZWZpbmVkLFx0Ly/kuKrmgKfnrb7lkI1cbiAgICBcbiAgICAvL+aJqeWxleS/oeaBr1xuICAgIGR3Q3VzdG9tRmFjZVZlcjogdW5kZWZpbmVkLFx0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAvL+mSsVxuICAgIGR3Rm9ydHVuZUNvaW46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+emj+W4gVxuICAgIGxsR2FtZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgbGxJbnN1cmVTY29yZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgIGR3Q291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+i0neWjs1xuICAgIGR3SW5zdXJlQ291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+mTtuihjOi0neWjs1xuICAgIGR3TWF0Y2hUaWNrZXQ6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuICAgIGlzRmlyc3RCYW5rOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8vIOmmluasoeS9v+eUqFxuXG4gICAgcm9vbUxpc3Q6IFtdLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcImpzb24vc2hvcHBhZ2VcIiwgZnVuY3Rpb24gKGVyciwgY29udGVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGVudCk7XG4gICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxVc2VyRGF0YV1baW5pdF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm9vbUxpc3QgPSBbXTtcbiAgICB9LFxuICAgIG9uTG9hZERhdGE6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3NNb2JpbGVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgLy/mianlsZXkv6Hmga9cbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdC8v5aS05YOP54mI5pysXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTW9vck1hY2hpbmU7XHRcdFx0XHRcdC8v6ZSB5a6a5py65ZmoXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiQmluZFdlaVhpbjtcdFx0XHRcdFx0Ly/nu5Hlrprlvq7kv6EgV1NMXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNZW1iZXI7XHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0Ly/nlKjmiLfmgKfliKtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0VuY3J5cHRJRDtcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NvZGVDaGVja0lEO1x0XHRcdFx0XHQvL+maj+acuueggTJcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3RXhwZXJpZW5jZTtcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bGxHYW1lU2NvcmU7XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0Ly/pk7booYzph5HluIFcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6QWNjb3VudHNbTkFNRV9MRU5dO1x0XHRcdC8v55m75b2V5biQ5Y+3XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5pY2tOYW1lW05BTUVfTEVOXTtcdFx0XHQvL+aYteensFxuICAgICAgICAvLyB9O1xuICAgICAgICB0aGlzLmR3Q3VzdG9tRmFjZVZlciA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmNiTW9vck1hY2hpbmUgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLmNiQmluZFdlaVhpbiA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMud0ZhY2VJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuY2JNZW1iZXIgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLmNiR2VuZGVyID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy53RW5jcnlwdElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53Q29kZUNoZWNrSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLmR3RXhwZXJpZW5jZSA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmR3R2FtZUlEID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5sbEdhbWVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpO1xuICAgICAgICB0aGlzLmxsSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTtcbiAgICAgICAgdGhpcy5zekFjY291bnRzID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIHRoaXMuc3pOaWNrTmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoMzIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKHRoaXNbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcy4nICsgcHJvcCwgJz0nLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Um9vbUJ5R2FtZTogZnVuY3Rpb24gKHdLaW5kSUQpIHtcbiAgICAgICAgdmFyIHJvb21MaXN0ID0gW107XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJvb21MaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnJvb21MaXN0W2luZGV4XTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LndLaW5kSUQgPT0gd0tpbmRJRCkge1xuICAgICAgICAgICAgICAgIHJvb21MaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvb21MaXN0O1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbFVzZXJEYXRhOyIsInJlcXVpcmUoXCJNRDVcIik7XG52YXIgZ2FtZV9jbWQgPSByZXF1aXJlKFwiQ01EX0dhbWVcIik7XG52YXIgcGxhemFfY21kID0gcmVxdWlyZShcIkNNRF9QbGF6YVwiKTtcbnZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvLyBkZWZhdWx0cywgc2V0IHZpc3VhbGx5IHdoZW4gYXR0YWNoaW5nIHRoaXMgc2NyaXB0IHRvIHRoZSBDYW52YXNcbiAgICAgICAgdGV4dDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcImhlbGxvRnJhbWVcIixcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8ganNiVGVzdC50ZXN0bG9nKCk7XG4gICAgICAgIC8vIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gdGhpcy5zb2NrZXQgPSBDbGllbnRTb2NrZXQuY3JlYXRlU29ja2V0KGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFja19iZWdpbicpO1xuICAgICAgICAvLyAgICAgLy8gdmFyIG1haW5JRCA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgLy8gICAgIC8vIHZhciBzdWJJRCA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2cobWFpbklEKTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHN1YklEKTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFja19lbmQnKTtcbiAgICAgICAgLy8gICAgIHNlbGYub25Tb2NrZXRDYWxsQmFjayhwRGF0YSk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyAvLyB2YXIgcERhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnNldGNtZGluZm8oMiwzKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaGJ5dGUoMSk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnB1c2h3b3JkKDIzMzMzKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaGRvdWJsZSgxMjMuMzQzNCk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLmdldG1haW4oKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLmdldHN1YigpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZGJ5dGUoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWR3b3JkKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkZG91YmxlKCkpO1xuICAgICAgICAvLyB0aGlzLnNvY2tldC5Db25uZWN0U29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KTtcbiAgICAgICAgdGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSk7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50ZXh0O1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIH0sXG4gICAgLy8gb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAvLyAgICAgaWYocERhdGEgPT09IHVuZGVmaW5lZClcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHZhciBtYWluID0gcERhdGEuZ2V0bWFpbigpO1xuICAgIC8vICAgICB2YXIgc3ViID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdtYWluID0gJyttYWluKycgc3ViID0gJytzdWIpO1xuICAgIC8vICAgICBpZiAobWFpbiA9PT0gMCkgXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIGlmKHN1YiA9PT0gMClcbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdENvbXBlbGV0ZWQoKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGVsc2VcbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLm9uU29ja2V0RXJyb3IocERhdGEpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2VcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgdGhpcy5vblNvY2tldEV2ZW50KHBEYXRhKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvX29uQ29ubmVjdENvbXBlbGV0ZWQnKTtcbiAgICB9LFxuICAgIC8vIG9uU29ja2V0RXJyb3I6ZnVuY3Rpb24ocERhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZygnb25Tb2NrZXRFcnJvcicpO1xuICAgIC8vIH0sXG4gICAgLy8gb25Tb2NrZXRFdmVudDogZnVuY3Rpb24ocERhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0RXZlbnRcIik7XG4gICAgLy8gfSxcbiAgICBzZW5kTG9nb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIxNzYwMjE3MDMxM1wiLDMyKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyNWQ1NWFkMjgzYWE0MDBhZjQ2NGM3NmQ3MTNjMDdhZFwiLDMzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyZDRkN2M5NWU1ZGYwMTc5YWYyNDY2ZjYzNWNhNzFkZVwiLDMzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hieXRlKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICB9XG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdhbWVTZXJ2ZXJJdGVtID0gcmVxdWlyZShcIkdhbWVTZXJ2ZXJJdGVtXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgLy8gZm9yICh2YXIgcHJvcCBpbiBHbG9iYWxVc2VyRGF0YSkge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdHbG9iYWxVc2VyRGF0YS4nICsgcHJvcCwgJz0nLCBHbG9iYWxVc2VyRGF0YVtwcm9wXSk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYodGhpcy5fbG9nb25Nb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5fbG9nb25Nb2RlID09PSAxKXtcbiAgICAgICAgICB0aGlzLnNlbmRSZWdpc3RlcigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDIpe1xuICAgICAgICAgIHRoaXMuc2VuZFZpc2l0b3IoKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLmnKrnn6XnmbvlvZXmqKHlvI9cIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSkge1xuICAgICAgICBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSl7XG4gICAgICAgICAgICB0aGlzLm9uU3ViTG9nb25FdmVudChzdWIscERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gcGxhemFfY21kLk1ETV9HUF9TRVJWRVJfTElTVCl7XG4gICAgICAgICAgICB0aGlzLm9uUm9vbUxpc3RFdmVudChzdWIscERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gcGxhemFfY21kLk1ETV9HUF9TWVNURU0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi57O757uf5raI5oGvXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblN1YkxvZ29uRXZlbnQ6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBpZiAoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX1NVQ0NFU1NfTU9CSUxFKXtcbiAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLm9uTG9hZERhdGEocERhdGEpO1xuICAgICAgICAgICAgdmFyIGJSZW1lbWJlclB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJSZW1lbWJlclB3ZFwiKTtcbiAgICAgICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYlJlbWVtYmVyUHdkID09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY291bnQnLCB0aGlzLl9zekFjY291bnQpO1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bhc3N3b3JkJywgdGhpcy5fc3pQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwYXNzd29yZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dvbiBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIkxvZ29uU3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fRVJST1JfTU9CSUxFKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHN1YiA9PT0gcGxhemFfY21kLlNVQl9HUF9MT0dPTl9GSU5JU0hfTU9CSUxFKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBmaW5pc2hcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlBsYXphU2NlbmVcIik7XG4gICAgICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Sb29tTGlzdEV2ZW50OiBmdW5jdGlvbihzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIG9uUm9vbUxpc3RFdmVudFwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9UWVBFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfVFlQRVwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX0tJTkQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9LSU5EXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfU1RBVElPTjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX1NUQVRJT05cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9TRVJWRVI6XG4gICAgICAgICAgICAgICAgdmFyIHBHYW1lU2VydmVyID0gbmV3IEdhbWVTZXJ2ZXJJdGVtKCk7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/miL/pl7TliJfooajnu5PmnoRcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgdGFnR2FtZVNlcnZlclxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U29ydElEO1x0XHRcdFx0XHRcdFx0Ly/mjpLluo/lj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3S2luZElEO1x0XHRcdFx0XHRcdFx0Ly/lkI3np7Dlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U2VydmVySUQ7XHRcdFx0XHRcdFx0XHQvL+aIv+mXtOWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTdGF0aW9uSUQ7XHRcdFx0XHRcdFx0XHQvL+ermeeCueWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTZXJ2ZXJQb3J0O1x0XHRcdFx0XHRcdC8v5oi/6Ze056uv5Y+jXG4gICAgICAgICAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3U2VydmVyQWRkcjtcdFx0XHRcdFx0XHQvL+aIv+mXtOWcsOWdgFxuICAgICAgICAgICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd09uTGluZUNvdW50O1x0XHRcdFx0XHRcdC8v5Zyo57q/5Lq65pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6U2VydmVyTmFtZVtTRVJWRVJfTEVOXTtcdFx0XHQvL+aIv+mXtOWQjeensFxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgcEdhbWVTZXJ2ZXIub25Jbml0KHBEYXRhKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHBHYW1lU2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YocEdhbWVTZXJ2ZXJbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwR2FtZVNlcnZlci4nICsgcHJvcCwgJz0nLCBwR2FtZVNlcnZlcltwcm9wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnJvb21MaXN0LnB1c2gocEdhbWVTZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBHYW1lU2VydmVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlbmRMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyh0aGlzLl9zekFjY291bnQsMzIpO1xuICAgICAgICAvLyBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBpZiAoR2xvYmFsVXNlckRhdGEuaXNHdWVzdCkge1xuICAgICAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pQYXNzd29yZCwzMyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKGNjLm1kNUVuY29kZSh0aGlzLl9zelBhc3N3b3JkKSwzMyk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCJcIiwzMyk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICB9LFxuICAgIHNlbmRSZWdpc3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWdpc3RlckRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIHZhciBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmVnaXN0ZXJEYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9SRUdJU1RFUl9NT0JJTEUpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHdvcmQoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZChkd01vYmlsZVN5c1R5cGUpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6UmVnQWNjb3VudCwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKGNjLm1kNUVuY29kZSh0aGlzLl9zelJlZ1Bhc3N3b3JkKSwzMyk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6TW9iaWxlUGhvbmUsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek5pY2tOYW1lLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pNb2JpbGVBdXRoLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcoXCJcIiwzMyk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEocmVnaXN0ZXJEYXRhKTtcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUF9SZWdpc3RlckFjY291bnRzTW9ibGllXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHQvLyDlpLTlg4/moIfor4ZcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0Ly8g55So5oi35oCn5YirXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZVN5c1R5cGU7XHRcdFx0XHQvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZUFwcEtpbmQ7XHRcdFx0XHQvLyDlub/lnLrmiYvmnLrniYjmnKxcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlQXBwVmVyc2lvbjtcdFx0XHRcdC8vIOW5v+WcuuaJi+acuueJiOacrFxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pBY2NvdW50c1tOQU1FX0xFTl07XHRcdFx0Ly8g55m75b2V5biQ5Y+3XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelBhc3NXb3JkW1BBU1NfTEVOXTtcdFx0XHQvLyDnmbvlvZXlr4bnoIFcbiAgICAgICAgLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlcGhvbmVbTU9CSUxFUEhPTkVfTEVOXTsgLy8g5omL5py6XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5pY2tOYW1lW05BTUVfTEVOXTtcdFx0XHQvLyDmmLXnp7BcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TW9iaWxlQXV0aFtOQU1FX0xFTl07XHRcdFx0Ly/miYvmnLrpqozor4HnoIFcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4gICAgICAgIC8vIH07XG4gICAgfSxcbiAgICBzZW5kVmlzaXRvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uKCk7XG4gICAgfSxcbiAgICBvbkxvZ29uQnlBY2NvdW50OiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCkge1xuICAgICAgICB0aGlzLl9zekFjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gXCIwMTIzNDU2Nzg5XCI7XG4gICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF0gXCIrc3pBY2NvdW50K1wiICMgXCIrIHN6UGFzc3dvcmQpO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uTG9nb25CeVZpc2l0b3I6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuX3N6QWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBcIjAxMjM0NTY3ODlcIjtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMjtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlWaXNpdG9yXVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlWaXNpdG9yXVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCxzek5pY2tOYW1lLHN6TW9iaWxlQXV0aCkge1xuICAgICAgICB0aGlzLl9zelJlZ0FjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UmVnUGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek5pY2tOYW1lID0gc3pOaWNrTmFtZTtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVBdXRoID0gc3pNb2JpbGVBdXRoO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAxO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uUmVnaXN0ZXJdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uUmVnaXN0ZXJdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbG9nb25WaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICByZWdpc3RlclZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvYWRdXCIpO1xuICAgICAgICBHbG9iYWxVc2VyRGF0YS5pbml0KCk7XG4gICAgICAgIHRoaXMuX2xvZ29uRnJhbWUgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiTG9nb25GcmFtZVwiKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uTG9nb24nLHRoaXMub25Mb2dvbix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uU2hvd1JlZ2lzdGVyJyx0aGlzLm9uU2hvd1JlZ2lzdGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25SZWdpc3RlcicsdGhpcy5vblJlZ2lzdGVyLHRoaXMpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkxvZ29uJyx0aGlzLm9uTG9nb24sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25TaG93UmVnaXN0ZXInLHRoaXMub25TaG93UmVnaXN0ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25SZWdpc3RlcicsdGhpcy5vblJlZ2lzdGVyLHRoaXMpO1xuICAgIH0sXG4gICAgb25Mb2dvbjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2dvbl1cIik7XG4gICAgICAgIHZhciBzekFjY291bnQgPSBldmVudC5kZXRhaWwuc3pBY2NvdW50O1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IGV2ZW50LmRldGFpbC5zelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9sb2dvbkZyYW1lLm9uTG9nb25CeUFjY291bnQoc3pBY2NvdW50LHN6UGFzc3dvcmQpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1BvcFdhaXRpbmcoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx7XG4gICAgICAgICAgICBjbG9zZUV2ZW50OiBcIkxvZ29uU3VjY2Vzc1wiLFxuICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2dvbl0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25SZWdpc3Rlcl1cIik7XG4gICAgICB2YXIgc3pBY2NvdW50ID0gZXZlbnQuZGV0YWlsLnN6QWNjb3VudDtcbiAgICAgIHZhciBzelBhc3N3b3JkID0gZXZlbnQuZGV0YWlsLnN6UGFzc3dvcmQ7XG4gICAgICB2YXIgc3pOaWNrTmFtZSA9IGV2ZW50LmRldGFpbC5zek5pY2tOYW1lO1xuICAgICAgdmFyIHN6TW9iaWxlQXV0aCA9IGV2ZW50LmRldGFpbC5zek1vYmlsZUF1dGg7XG4gICAgICBpZihzekFjY291bnQgPT09IHVuZGVmaW5lZCB8fCBzelBhc3N3b3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblJlZ2lzdGVyXSBzekFjY291bnQgb3Igc3pQYXNzd29yZCBpcyB1bmRlZmluZWRcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbG9nb25GcmFtZS5vblJlZ2lzdGVyKHN6QWNjb3VudCxzelBhc3N3b3JkLHN6Tmlja05hbWUsc3pNb2JpbGVBdXRoKTtcbiAgICB9LFxuICAgIG9uU2hvd0xvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpKTtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2xvZ29uVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9nb25WaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9sb2dvblZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX2xvZ29uVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dMb2dvbl1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25TaG93VmlzdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl1cIik7XG4gICAgICAgIC8vIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIua4uOWuoueZu+W9leaaguacquW8gOaUvizmlazor7fmnJ/lvoUhXCIpO1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvR3Vlc3QvR3Vlc3RMb2dpbi5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1wia2luZGlkXCJdID0gempoX2NtZC5LSU5EX0lEO1xuICAgICAgICBwYXJhbXNbXCJ2ZXJzaW9ubnVtXCJdID0gXCIxLjFcIjtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkZW50aXR5XCJdID0gXCIyZDRkN2M5NWU1ZGYwMTc5YWYyNDY2ZjYzNWNhNzFkZVwiO1xuICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIyXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjFcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyA9IHZhbHVlLnVzZXJuYW1lO1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkID0gdmFsdWUucHdkO1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbG9nb25GcmFtZS5vbkxvZ29uQnlWaXNpdG9yKEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHMsR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIkd1ZXN0TG9naW5Db21wbGV0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93UG9wV2FpdGluZyhjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHtcbiAgICAgICAgICAgIGNsb3NlRXZlbnQ6IFwiR3Vlc3RMb2dpbkNvbXBsZXRlZFwiLFxuICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXSBjYWxsYmFja2Z1bmNcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIFxuICAgIH0sXG4gICAgb25TaG93UmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpID09PSB0cnVlKXtcbiAgICAgICAgICAgIHRoaXMuX2xvZ29uVmlldy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY2MuaXNWYWxpZCh0aGlzLl9yZWdpc3RlclZpZXcpID09PSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlclZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnJlZ2lzdGVyVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fcmVnaXN0ZXJWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9yZWdpc3RlclZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93UmVnaXN0ZXJdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9lZGl0Ym94X2FjY291bnQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9wYXNzd29yZDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9jaGVja2JveDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYodGhpcy5tX2NoZWNrYm94KSB7XG4gICAgICAgICAgICB2YXIgcHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicHdkXCIpO1xuICAgICAgICAgICAgdmFyIGJSZW1lbWJlclB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJSZW1lbWJlclB3ZFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIGlzIFwiICsgYlJlbWVtYmVyUHdkKTtcbiAgICAgICAgICAgIGlmIChiUmVtZW1iZXJQd2QgPT0gJ3RydWUnIHx8IGJSZW1lbWJlclB3ZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSBjaGVja1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fY2hlY2tib3guY2hlY2soKTtcbiAgICAgICAgICAgICAgICB2YXIgc3pBY2NvdW50ID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBzelBhc3N3b3JkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZyA9IHN6QWNjb3VudDtcbiAgICAgICAgICAgICAgICB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmcgPSBzelBhc3N3b3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIHVuY2hlY2tcIilcbiAgICAgICAgICAgICAgICB0aGlzLm1fY2hlY2tib3gudW5jaGVjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25Mb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2dvbl0gXCIrc3pBY2NvdW50K1wiICMgXCIrc3pQYXNzd29yZCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkxvZ29uXCIse3N6QWNjb3VudDpzekFjY291bnQsc3pQYXNzd29yZDpzelBhc3N3b3JkfSk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrUmVnaXN0ZXJCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25TaG93UmVnaXN0ZXJcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrRm9yZ2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNjLnN5cy5vcGVuVVJMKEdsb2JhbERlZi5odHRwT3BlblVybCk7XG4gICAgfSxcbiAgICBjaGVja0JveENsaWNrZWQ6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgaWYgKHRvZ2dsZS5pc0NoZWNrZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bY2hlY2tCb3hDbGlja2VkXSBpcyBjaGVja2VkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtjaGVja0JveENsaWNrZWRdIGlzIHVuY2hlY2tlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiUmVtZW1iZXJQd2RcIiwgdG9nZ2xlLmlzQ2hlY2tlZCk7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5tZDVFbmNvZGUgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAvLyBmb3IgdGVzdC9kZWJ1Z1xuICAgIGZ1bmN0aW9uIGZmbG9nKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgbnVtYmVyIHRvICh1bnNpZ25lZCkgMzIgYml0IGhleCwgemVybyBmaWxsZWQgc3RyaW5nXG4gICAgZnVuY3Rpb24gdG9femVyb2ZpbGxlZF9oZXgobikge1xuICAgICAgICB2YXIgdDEgPSAobiA+Pj4gMjQpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgdmFyIHQyID0gKG4gJiAweDAwRkZGRkZGKS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiBcIjAwXCIuc3Vic3RyKDAsIDIgLSB0MS5sZW5ndGgpICsgdDEgK1xuICAgICAgICAgICAgXCIwMDAwMDBcIi5zdWJzdHIoMCwgNiAtIHQyLmxlbmd0aCkgKyB0MjtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFycmF5IG9mIGNoYXJzIHRvIGFycmF5IG9mIGJ5dGVzIChub3RlOiBVbmljb2RlIG5vdCBzdXBwb3J0ZWQpXG4gICAgZnVuY3Rpb24gY2hhcnNfdG9fYnl0ZXMoYWMpIHtcbiAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXR2YWwgPSByZXR2YWwuY29uY2F0KHN0cl90b19ieXRlcyhhY1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfVxuXG5cbiAgICAvLyBjb252ZXJ0IGEgNjQgYml0IHVuc2lnbmVkIG51bWJlciB0byBhcnJheSBvZiBieXRlcy4gTGl0dGxlIGVuZGlhblxuICAgIGZ1bmN0aW9uIGludDY0X3RvX2J5dGVzKG51bSkge1xuICAgICAgICB2YXIgcmV0dmFsID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgICAgICByZXR2YWwucHVzaChudW0gJiAweEZGKTtcbiAgICAgICAgICAgIG51bSA9IG51bSA+Pj4gODtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH1cblxuICAgIC8vICAzMiBiaXQgbGVmdC1yb3RhdGlvblxuICAgIGZ1bmN0aW9uIHJvbChudW0sIHBsYWNlcykge1xuICAgICAgICByZXR1cm4gKChudW0gPDwgcGxhY2VzKSAmIDB4RkZGRkZGRkYpIHwgKG51bSA+Pj4gKDMyIC0gcGxhY2VzKSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIDQgTUQ1IGZ1bmN0aW9uc1xuICAgIGZ1bmN0aW9uIGZGKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIChiICYgYykgfCAofmIgJiBkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmRyhiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiAoZCAmIGIpIHwgKH5kICYgYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkgoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gYiBeIGMgXiBkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZJKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIGMgXiAoYiB8IH5kKTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIDQgYnl0ZXMgYXQgc3BlY2lmaWVkIG9mZnNldC4gTGl0dGxlLWVuZGlhbiBpcyBhc3N1bWVkXG4gICAgZnVuY3Rpb24gYnl0ZXNfdG9faW50MzIoYXJyLCBvZmYpIHtcbiAgICAgICAgcmV0dXJuIChhcnJbb2ZmICsgM10gPDwgMjQpIHwgKGFycltvZmYgKyAyXSA8PCAxNikgfCAoYXJyW29mZiArIDFdIDw8IDgpIHwgKGFycltvZmZdKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICBDb252ZXIgc3RyaW5nIHRvIGFycmF5IG9mIGJ5dGVzIGluIFVURi04IGVuY29kaW5nXG4gICAgIFNlZTpcbiAgICAgaHR0cDovL3d3dy5kYW5ncm9zc21hbi5pbmZvLzIwMDcvMDUvMjUvaGFuZGxpbmctdXRmLTgtaW4tamF2YXNjcmlwdC1waHAtYW5kLW5vbi11dGY4LWRhdGFiYXNlcy9cbiAgICAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjQwNDA4L3JlYWRpbmctYnl0ZXMtZnJvbS1hLWphdmFzY3JpcHQtc3RyaW5nXG4gICAgIEhvdyBhYm91dCBhIFN0cmluZy5nZXRCeXRlcyg8RU5DT0RJTkc+KSBmb3IgSmF2YXNjcmlwdCE/IElzbid0IGl0IHRpbWUgdG8gYWRkIGl0P1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0cl90b19ieXRlcyhzdHIpIHtcbiAgICAgICAgLy8gYWxlcnQoXCJnb3QgXCIgKyBzdHIubGVuZ3RoICsgXCIgY2hhcnNcIilcbiAgICAgICAgdmFyIHJldHZhbCA9IFsgXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBpZiAoc3RyLmNoYXJDb2RlQXQoaSkgPD0gMHg3Rikge1xuICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuY2hhckF0KGkpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRtcC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICByZXR2YWwucHVzaChwYXJzZUludCh0bXBbal0sIDB4MTApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfTtcblxuXG5cblxuICAgIC8vIGNvbnZlcnQgdGhlIDQgMzItYml0IGJ1ZmZlcnMgdG8gYSAxMjggYml0IGhleCBzdHJpbmcuIChMaXR0bGUtZW5kaWFuIGlzIGFzc3VtZWQpXG4gICAgZnVuY3Rpb24gaW50MTI4bGVfdG9faGV4KGEsIGIsIGMsIGQpIHtcbiAgICAgICAgdmFyIHJhID0gXCJcIjtcbiAgICAgICAgdmFyIHQgPSAwO1xuICAgICAgICB2YXIgdGEgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHRhID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgdCA9ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8IHRhO1xuICAgICAgICAgICAgcmEgPSByYSArIHRvX3plcm9maWxsZWRfaGV4KHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpbnB1dCBkYXRhIHR5cGUgYW5kIHBlcmZvcm0gY29udmVyc2lvbnMgaWYgbmVlZGVkXG4gICAgdmFyIGRhdGFieXRlcyA9IG51bGw7XG4gICAgLy8gU3RyaW5nXG4gICAgaWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc3RyaW5nIHRvIGFycmF5IGJ5dGVzXG4gICAgICAgIGRhdGFieXRlcyA9IHN0cl90b19ieXRlcyhkYXRhKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuY29uc3RydWN0b3IgPT0gQXJyYXkpIHtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGVtcHR5LCBqdXN0IGFzc3VtZSBhcnJheSBvZiBieXRlc1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVswXSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gY2hhcnNfdG9fYnl0ZXMoZGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZmxvZyhcImlucHV0IGRhdGEgdHlwZSBtaXNtYXRjaFwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmZsb2coXCJpbnB1dCBkYXRhIHR5cGUgbWlzbWF0Y2hcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHNhdmUgb3JpZ2luYWwgbGVuZ3RoXG4gICAgdmFyIG9yZ19sZW4gPSBkYXRhYnl0ZXMubGVuZ3RoO1xuXG4gICAgLy8gZmlyc3QgYXBwZW5kIHRoZSBcIjFcIiArIDd4IFwiMFwiXG4gICAgZGF0YWJ5dGVzLnB1c2goMHg4MCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgcmVxdWlyZWQgYW1vdW50IG9mIHBhZGRpbmdcbiAgICB2YXIgdGFpbCA9IGRhdGFieXRlcy5sZW5ndGggJSA2NDtcbiAgICAvLyBubyByb29tIGZvciBtc2cgbGVuZ3RoP1xuICAgIGlmICh0YWlsID4gNTYpIHtcbiAgICAgICAgLy8gcGFkIHRvIG5leHQgNTEyIGJpdCBibG9ja1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICg2NCAtIHRhaWwpOyBpKyspIHtcbiAgICAgICAgICAgIGRhdGFieXRlcy5wdXNoKDB4MCk7XG4gICAgICAgIH1cbiAgICAgICAgdGFpbCA9IGRhdGFieXRlcy5sZW5ndGggJSA2NDtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8ICg1NiAtIHRhaWwpOyBpKyspIHtcbiAgICAgICAgZGF0YWJ5dGVzLnB1c2goMHgwKTtcbiAgICB9XG4gICAgLy8gbWVzc2FnZSBsZW5ndGggaW4gYml0cyBtb2QgNTEyIHNob3VsZCBub3cgYmUgNDQ4XG4gICAgLy8gYXBwZW5kIDY0IGJpdCwgbGl0dGxlLWVuZGlhbiBvcmlnaW5hbCBtc2cgbGVuZ3RoIChpbiAqYml0cyohKVxuICAgIGRhdGFieXRlcyA9IGRhdGFieXRlcy5jb25jYXQoaW50NjRfdG9fYnl0ZXMob3JnX2xlbiAqIDgpKTtcblxuICAgIC8vIGluaXRpYWxpemUgNHgzMiBiaXQgc3RhdGVcbiAgICB2YXIgaDAgPSAweDY3NDUyMzAxO1xuICAgIHZhciBoMSA9IDB4RUZDREFCODk7XG4gICAgdmFyIGgyID0gMHg5OEJBRENGRTtcbiAgICB2YXIgaDMgPSAweDEwMzI1NDc2O1xuXG4gICAgLy8gdGVtcCBidWZmZXJzXG4gICAgdmFyIGEgPSAwLFxuICAgICAgICBiID0gMCxcbiAgICAgICAgYyA9IDAsXG4gICAgICAgIGQgPSAwO1xuXG5cbiAgICBmdW5jdGlvbiBfYWRkKG4xLCBuMikge1xuICAgICAgICByZXR1cm4gMHgwRkZGRkZGRkYgJiAobjEgKyBuMilcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiB1cGRhdGUgcGFydGlhbCBzdGF0ZSBmb3IgZWFjaCBydW5cbiAgICB2YXIgdXBkYXRlUnVuID0gZnVuY3Rpb24obmYsIHNpbjMyLCBkdzMyLCBiMzIpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBkO1xuICAgICAgICBkID0gYztcbiAgICAgICAgYyA9IGI7XG4gICAgICAgIC8vYiA9IGIgKyByb2woYSArIChuZiArIChzaW4zMiArIGR3MzIpKSwgYjMyKTtcbiAgICAgICAgYiA9IF9hZGQoYixcbiAgICAgICAgICAgIHJvbChcbiAgICAgICAgICAgICAgICBfYWRkKGEsXG4gICAgICAgICAgICAgICAgICAgIF9hZGQobmYsIF9hZGQoc2luMzIsIGR3MzIpKVxuICAgICAgICAgICAgICAgICksIGIzMlxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBhID0gdGVtcDtcbiAgICB9O1xuXG5cbiAgICAvLyBEaWdlc3QgbWVzc2FnZVxuICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhYnl0ZXMubGVuZ3RoIC8gNjQ7IGkrKykge1xuICAgICAgICAvLyBpbml0aWFsaXplIHJ1blxuICAgICAgICBhID0gaDA7XG4gICAgICAgIGIgPSBoMTtcbiAgICAgICAgYyA9IGgyO1xuICAgICAgICBkID0gaDM7XG5cbiAgICAgICAgdmFyIHB0ciA9IGkgKiA2NDtcblxuICAgICAgICAvLyBkbyA2NCBydW5zXG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhkNzZhYTQ3OCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGU4YzdiNzU2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHgyNDIwNzBkYiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YzFiZGNlZWUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmNTdjMGZhZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NDc4N2M2MmEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhhODMwNDYxMywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZkNDY5NTAxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4Njk4MDk4ZDgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDhiNDRmN2FmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmZmZjViYjEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg4OTVjZDdiZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDZiOTAxMTIyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZDk4NzE5MywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGE2Nzk0MzhlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NDliNDA4MjEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmNjFlMjU2MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhjMDQwYjM0MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjY1ZTVhNTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhlOWI2YzdhYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhkNjJmMTA1ZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjQ0MTQ1MywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZDhhMWU2ODEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhlN2QzZmJjOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDIxZTFjZGU2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhjMzM3MDdkNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZjRkNTBkODcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg0NTVhMTRlZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGE5ZTNlOTA1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmY2VmYTNmOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg2NzZmMDJkOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDhkMmE0YzhhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZmZmYTM5NDIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDg3NzFmNjgxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NmQ5ZDYxMjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmZGU1MzgwYywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGE0YmVlYTQ0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDRiZGVjZmE5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZjZiYjRiNjAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhiZWJmYmM3MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDI4OWI3ZWM2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhlYWExMjdmYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhkNGVmMzA4NSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDQ4ODFkMDUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhkOWQ0ZDAzOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZTZkYjk5ZTUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHgxZmEyN2NmOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGM0YWM1NjY1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmNDI5MjI0NCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDQzMmFmZjk3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YWI5NDIzYTcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmYzkzYTAzOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDY1NWI1OWMzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg4ZjBjY2M5MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZmZWZmNDdkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ODU4NDVkZDEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDZmYTg3ZTRmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmZTJjZTZlMCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGEzMDE0MzE0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NGUwODExYTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmNzUzN2U4MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YmQzYWYyMzUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHgyYWQ3ZDJiYiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZWI4NmQzOTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCAyMSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGJ1ZmZlcnNcbiAgICAgICAgaDAgPSBfYWRkKGgwLCBhKTtcbiAgICAgICAgaDEgPSBfYWRkKGgxLCBiKTtcbiAgICAgICAgaDIgPSBfYWRkKGgyLCBjKTtcbiAgICAgICAgaDMgPSBfYWRkKGgzLCBkKTtcbiAgICB9XG4gICAgLy8gRG9uZSEgQ29udmVydCBidWZmZXJzIHRvIDEyOCBiaXQgKExFKVxuICAgIHJldHVybiBpbnQxMjhsZV90b19oZXgoaDMsIGgyLCBoMSwgaDApLnRvTG93ZXJDYXNlKCk7XG59O1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2VfYmFjazogY2MuU3ByaXRlLFxuICAgICAgICBtX0ltYWdlX2NvbDogY2MuU3ByaXRlLFxuICAgICAgICBtX0ltYWdlX3RpdGxlOiBjYy5TcHJpdGUsXG4gICAgICAgIG1fTGFiZWxfc2NvcmVMaW1pdDogY2MuTGFiZWwsXG4gICAgICAgIHBsYXphQXRhbGFzOiBjYy5TcHJpdGVBdGxhcyxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gdmFyIGluZGV4ID0gcGFyYW1zLmluZGV4O1xuICAgICAgICB0aGlzLl9pbmRleCA9IHBhcmFtcy5pbmRleDtcbiAgICAgICAgLy8gdmFyIHJvb21JbmZvID0gcGFyYW1zLnJvb21JbmZvO1xuICAgICAgICB0aGlzLl9yb29tSW5mbyA9IHBhcmFtcy5yb29tSW5mbztcbiAgICAgICAgdGhpcy5tX0ltYWdlX2JhY2suc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXphQXRhbGFzLmdldFNwcml0ZUZyYW1lKFwicGxhemFfaW1hZ2Vfcm9vbV9iYWNrX1wiICsgKHRoaXMuX2luZGV4KSk7XG4gICAgICAgIHRoaXMubV9JbWFnZV9jb2wuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXphQXRhbGFzLmdldFNwcml0ZUZyYW1lKFwicGxhemFfaW1hZ2Vfcm9vbV9jb2xfXCIgKyAodGhpcy5faW5kZXgpKTtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3RpdGxlLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fZG93bl9cIiArICh0aGlzLl9pbmRleCkpO1xuICAgICAgICBpZiAodGhpcy5fcm9vbUluZm8gJiYgdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUpIHtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9zY29yZUxpbWl0LnN0cmluZyA9IHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphUm9vbUl0ZW1dW29uQ2xpY2tdXCIpOyAgXG4gICAgICAgIGlmKCF0aGlzLl9yb29tSW5mbykge1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5oi/6Ze05pqC5pyq5byA5pS+77yM6K+356iN5ZCO5YaN6K+VXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID49IHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlKSB7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLov5vlhaXmiL/pl7RcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLov5vlhaXmiL/pl7TpnIDopoFcIisgdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUgKyBcIumHkeixhizmgqjnmoTph5HosYbkuI3otrMs6K+35YWF5YC8IVwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNldHRpbmdWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyUHJvZmlsZVZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGJhbmtWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgcGxhemFSb29tSXRlbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF9uYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLmluaXQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF6YSBvbkxvYWRcIik7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoVUldXCIpO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKEdsb2JhbFVzZXJEYXRhW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9uYW1lLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWU7XG4gICAgICAgIHZhciBmYWNlSUQgPSBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICBpZiAoZmFjZUlEIDw9IDAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaFJvb21MaXN0KCk7XG4gICAgfSxcbiAgICByZWZyZXNoUm9vbUxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJvb21MaXN0ID0gR2xvYmFsVXNlckRhdGEuZ2V0Um9vbUJ5R2FtZSh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hVSV0gXCIgKyBKU09OLnN0cmluZ2lmeShyb29tTGlzdCkpO1xuICAgICAgICB2YXIgcm9vbUxpc3RQYW5lbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm1fUGFuZWxfY2VudGVyXCIpO1xuICAgICAgICByb29tTGlzdFBhbmVsLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAzOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxhemFSb29tSXRlbSk7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlBsYXphUm9vbUl0ZW1cIikuaW5pdCh7aW5kZXg6aW5kZXgrMSxyb29tSW5mbzpyb29tTGlzdFtpbmRleF19KTtcbiAgICAgICAgICAgIHJvb21MaXN0UGFuZWwuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oekdhbWVVc2VySW5mby5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaERhdGFdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID0gdmFsdWUuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluc3VyZXNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUgPSB2YWx1ZS5pbnN1cmVzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuYWNjb3VudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyA9IHZhbHVlLmFjY291bnRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nYW1laWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuZHdHYW1lSUQgPSB2YWx1ZS5nYW1laWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmZhY2VpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gdmFsdWUuZmFjZWlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nZW5kZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuY2JHZW5kZXIgPSB2YWx1ZS5nZW5kZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmlzZ3Vlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IHZhbHVlLmlzZ3Vlc3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSB2YWx1ZS5uaWNrbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoRGF0YV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlTmFtZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2VTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlTmFtZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25CYW5rU3VjY2VzcycsdGhpcy5vbkJhbmtTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB2YXIgZmFjZUlEID0gR2xvYmFsVXNlckRhdGEud0ZhY2VJRDtcbiAgICAgICAgLy8gaWYgKGZhY2VJRCA8PSAwIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoRGF0YSgpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VOYW1lU3VjY2VzczogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpOyAgXG4gICAgfSxcbiAgICBvbkJhbmtTdWNjZXNzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7ICBcbiAgICB9LFxuICAgIG9uQ2xpY2tTZXR0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fc2V0dGluZ1ZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ1ZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNldHRpbmdWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9zZXR0aW5nVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fc2V0dGluZ1ZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2V0dGluZ11BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja1VzZXJQcm9maWxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3VzZXJQcm9maWxlVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl91c2VyUHJvZmlsZVZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJQcm9maWxlVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fdXNlclByb2ZpbGVWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl91c2VyUHJvZmlsZVZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tDbGllbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ2xpZW50XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a6i5pyN5Yqf6IO95pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQWN0aXZpdHk6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtjb25DbGlja0FjdGl2aXR5XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQmFuazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW2NvbkNsaWNrQmFua11cIik7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2JhbmtWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2JhbmtWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYW5rVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fYmFua1ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX2JhbmtWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0JhbmtdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tTaG9wOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1Nob3BdXCIpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9zaG9wVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9zaG9wVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2hvcFZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3Nob3BWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9zaG9wVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTaG9wXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV93YWl0SWNvbjp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkxvYWRdXCIpO1xuICAgIH0sXG4gICAgb25Jbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV93YWl0aW5nVGV4dCA9IHBhcmFtcy53YWl0aW5nVGV4dCB8fCBcIuato+WcqOi/nuaOpeacjeWKoeWZqO+8jOivt+eojeWAmS4uLlwiO1xuICAgICAgICB0aGlzLm1fd2FpdGluZ1RpbWUgPSBwYXJhbXMud2FpdGluZ1RpbWUgfHwgODtcbiAgICAgICAgdGhpcy5tX2Nsb3NlRXZlbnQgPSBwYXJhbXMuY2xvc2VFdmVudDtcbiAgICAgICAgdGhpcy5tX2NhbGxCYWNrRnVuYyA9IHBhcmFtcy5jYWxsQmFja0Z1bmM7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKHRoaXMubV9jbG9zZUV2ZW50LHRoaXMub25DbG9zZUV2ZW50LHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZSh0aGlzLmNsb3NlLCB0aGlzLCB0aGlzLm1fd2FpdGluZ1RpbWUpO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSB0aGlzLm1fd2FpdGluZ1RleHQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV93YWl0SWNvbi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5yb3RhdGVCeSgyLjAsMzYwLjApKSk7XG4gICAgfSxcbiAgICBvbkNsb3NlRXZlbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZih0aGlzLm1fY2FsbEJhY2tGdW5jKSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1fY2FsbEJhY2tGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0sXG4gICAgb25FbWl0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJoZWhlXCIpO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZih0aGlzLm1fY2xvc2VFdmVudCx0aGlzLm9uQ2xvc2VFdmVudCx0aGlzKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlICh0aGlzLmNsb3NlLCB0aGlzKTtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiIHJlcXVpcmUoXCJNRDVcIik7XG4gdmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG4gdmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG4gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9lZGl0Ym94X2FjY291bnQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9wYXNzd29yZDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X25hbWU6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF95em06e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IHRoaXMubV9lZGl0Ym94X25hbWUuc3RyaW5nO1xuICAgICAgICB2YXIgc3pNb2JpbGVBdXRoID0gdGhpcy5tX2VkaXRib3hfeXptLnN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIrc3pBY2NvdW50K1wiICMgXCIrc3pQYXNzd29yZCk7XG4gICAgICAgIGlmIChzekFjY291bnQubGVuZ3RoIDw9MCB8fCBzelBhc3N3b3JkLmxlbmd0aCA8PTAgfHwgc3pOaWNrTmFtZS5sZW5ndGggPD0gMCB8fCBzek1vYmlsZUF1dGgubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN6UGFzc3dvcmQubGVuZ3RoIDwgNiB8fCBzelBhc3N3b3JkLmxlbmd0aCA+IDE2KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY1cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8g6YCa6L+H55So5oi35Lit5b+Dd2Vi5o6l5Y+j5rOo5YaM55So5oi3XG4gICAgICAgIHZhciBpc1VzZXJDZW50ZXIgPSB0cnVlO1xuICAgICAgICBpZighaXNVc2VyQ2VudGVyKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25SZWdpc3RlclwiLHtcbiAgICAgICAgICAgICAgICBzekFjY291bnQ6c3pBY2NvdW50LFxuICAgICAgICAgICAgICAgIHN6UGFzc3dvcmQ6c3pQYXNzd29yZCxcbiAgICAgICAgICAgICAgICBzek5pY2tOYW1lOnN6Tmlja05hbWUsXG4gICAgICAgICAgICAgICAgc3pNb2JpbGVBdXRoOnN6TW9iaWxlQXV0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgICAgIHVybCArPSBcIi9Vc2VyQ2VudGVyL1VzZXJDZW50ZXJSZWdpc3Rlci5hc2h4XCI7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gJyc7XG4gICAgICAgICAgICB2YXIgbm93VGltZSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIG5vd3RpbWUgc2Vjb25kcyA9IFwiK25vd1RpbWUpO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJ7XFxcIlVzZXJuYW1lXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJQYXNzd29yZFxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6UGFzc3dvcmQpICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTmlja25hbWVcXFwiOlxcXCJcIiArIHN6Tmlja05hbWUgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJEYXRldGFtcFxcXCI6XFxcIlwiICsgbm93VGltZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIC8v55Sf5oiQ562+5ZCNXG4gICAgICAgICAgICB2YXIgc3pTaWduID0gXCJcIjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcIlVzZXJOYW1lPVwiICsgc3pBY2NvdW50O1xuICAgICAgICAgICAgc3pTaWduICs9IFwifERhdGVUYW1wPVwiICsgbm93VGltZTtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxDaGFubmVsSUQ9XCIgKyBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxNb2JpbGU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8Q29kZT1cIiArIHN6TW9iaWxlQXV0aDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIjtcblxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiU2lnblxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6U2lnbikgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDaGFubmVsSURcXFwiOlxcXCJcIiArIEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTW9iaWxlXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJNYWNoaW5lTnVtYmVyXFxcIjpcXFwiXCIgKyAnMScgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDb2RlXFxcIjpcXFwiXCIgKyBzek1vYmlsZUF1dGggKyBcIlxcXCJ9XCI7XG5cbiAgICAgICAgICAgIC8vXCJVc2VyTmFtZT0lc3xEYXRlVGFtcD0lbGxkfENoYW5uZWxJRD0lZHxNb2JpbGU9JXN8Q29kZT0lc3xLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIlxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgeGhyLnNlbmQocGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja1NlbmRCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciByZSA9IC8xWzM1NzhdWzAtOV17OX0vO1xuICAgICAgICBpZiAocmUuZXhlYyhzekFjY291bnQpID09PSBudWxsKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja1NlbmRCdXR0b25dIOaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvaHovQ2FwdGNoYU1vYmlsZS5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSBcIk1vYmlsZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrU2VuZEJ1dHRvbl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcblxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hY2NvdW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9MYWJlbF9hY2NvdW50LnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHM7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrU3dpdGNoQWNjb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2Vfc2hvcEl0ZW06IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BJdGVtQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICBfc2hvcElEOiAwLFxuICAgICAgICBfZ29vZHNJRDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHNob3BJRCA9IHBhcmFtcy5zaG9wSUQ7XG4gICAgICAgIHRoaXMuX3Nob3BJRCA9IHNob3BJRDtcbiAgICAgICAgdGhpcy5fZ29vZHNJRCA9IHNob3BJRCAlIDY7XG4gICAgICAgIHRoaXMubV9JbWFnZV9zaG9wSXRlbS5zcHJpdGVGcmFtZSA9IHRoaXMuc2hvcEl0ZW1BdGFscy5nZXRTcHJpdGVGcmFtZShcInNob3BfaWNvbl9cIiArIChzaG9wSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcEl0ZW1dW29uQ2xpY2tdIHNob3BJRCA9IFwiK3RoaXMuX3Nob3BJRCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoJ29uSW5DaGFyZ2UnLHtnb29kc0lEOnRoaXMuX2dvb2RzSUR9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNob3BJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHsgICAgICBcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uTG9hZF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEpKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnNob3BJdGVtTGlzdC5jb250ZW50LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNob3BJdGVtQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5zaG9wSXRlbVByZWZhYik7XG4gICAgICAgICAgICB2YXIgc2hvcElEO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNPcGVuSUFQKXtcbiAgICAgICAgICAgICAgICBzaG9wSUQgPSBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgc2hvcElEID0gaW5kZXggKyA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoXCJTaG9wSXRlbVwiKS5pbml0KHtzaG9wSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMuc2hvcEl0ZW1MaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uSW5DaGFyZ2UnLHRoaXMub25JbkNoYXJnZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25JbkNoYXJnZScsdGhpcy5vbkluQ2hhcmdlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uSW5DaGFyZ2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uSW5DaGFyZ2VdXCIpO1xuICAgICAgICB2YXIgZ29vZHNJRCA9IHBhcmFtcy5kZXRhaWwuZ29vZHNJRDtcbiAgICAgICAgdmFyIHNob3BEYXRhQXJyYXkgPSBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YS5zaG9wLmJhc2U7XG4gICAgICAgIGlmIChnb29kc0lEIDwgMCB8fCBnb29kc0lEID49IHNob3BEYXRhQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gc2hvcERhdGFBcnJheSBsZW5ndGggPSBcIiArIHNob3BEYXRhQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXRlbVZhbCA9IHNob3BEYXRhQXJyYXlbZ29vZHNJRF07XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInByb2R1Y3RpZFwiXSA9IGl0ZW1WYWwuaWQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHBhcmFtc1tcInBheV9hbXRcIl0gPSBpdGVtVmFsLnByaWNlO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1BheUluaXQyXzAuYXNoeFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXJsXCJdID0gdXJsO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInBheV90eXBlXCJdID0gXCI4XCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJwcm9kdWN0aWRcIl0gPSBpdGVtVmFsLmlkO1xuICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVApIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5pb3NwcmljZTtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgICAgIHVybCArPSBcIi9IWk1vYmlsZS9QYXlJbml0Ml8wLmFzaHhcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmVycm9yY29kZSA9PSAxMDAyNikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiU2hvcENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUV2ZW50OiBcIlNob3BDb21wbGV0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5wcmljZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG4gICAgfSxcbiAgICBvbkNob29zZVBheXR5cGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uQ2hvb3NlUGF5dHlwZV1cIilcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvQ2hvb3NlUGF5VHlwZVZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkNob29zZVBheVR5cGVWaWV3XCIpLmluaXQocGFyYW1zKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DaG9vc2VQYXl0eXBlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB9KSAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9jb250ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHN6VGV4dCA9IHBhcmFtcy5tZXNzYWdlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSBzelRleHQ7XG4gICAgfVxuXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICAgICAgX2ZhY2VJRDogMCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgZmFjZUlEID0gcGFyYW1zLmZhY2VJRDtcbiAgICAgICAgdGhpcy5fZmFjZUlEID0gZmFjZUlEO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VJdGVtXVtvbkNsaWNrXSBmYWNlSUQgPSBcIit0aGlzLl9mYWNlSUQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KCdvbkNoYW5nZVVzZXJGYWNlJyx7ZmFjZUlEOnRoaXMuX2ZhY2VJRCsxfSk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgdXNlckZhY2VJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudXNlckZhY2VDb3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJGYWNlSXRlbVByZWZhYik7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlVzZXJGYWNlSXRlbVwiKS5pbml0KHtmYWNlSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMudXNlckZhY2VMaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIHRoaXMuX2ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBKU09OLnN0cmluZ2lmeShwYXJhbXMuZGV0YWlsKSk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlXCIscGFyYW1zLmRldGFpbCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBGYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1VzZXJQcm9maWxlVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiVXNlclByb2ZpbGVWaWV3XCIpLl9mYWNlSUQgPSBGYWNlSUQ7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0J1dHRvbl9jaGFuZ2VOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICB9LFxuICAgICAgICBtX0J1dHRvbl9lZGl0TmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvbixcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X3VzZXJOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VyTmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJHb2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlcklEOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fSW1hZ2VfdXNlckZhY2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZVZpZXdQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlckJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZUdyb3VwLFxuICAgICAgICB9LFxuICAgICAgICBnZW5kZXJNYW5CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGUsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlcldvbWFuQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlLFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfY29uZmlybVBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X25ld1Bhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9QYW5lbF91c2VyQ2hhbmdlOiBjYy5Ob2RlLFxuICAgICAgICBtX1BhbmVsX3VzZXJJbmZvOiBjYy5Ob2RlLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpO1xuICAgIH0sXG4gICAgcmVmcmVzaFVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzek5pY2tOYW1lID0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZTtcbiAgICAgICAgdmFyIGxsR2FtZVNjb3JlID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHZhciBkd1VzZXJJRCA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICB2YXIgY2JHZW5kZXIgPSBHbG9iYWxVc2VyRGF0YS5jYkdlbmRlciB8fCAxO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyR29sZC5zdHJpbmcgPSBsbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJJRC5zdHJpbmcgPSBcIklEOlwiICsgZHdVc2VySUQ7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyTmFtZS5zdHJpbmcgPSBzek5pY2tOYW1lO1xuICAgICAgICBpZiggdGhpcy5fZmFjZUlEICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VVc2VyRmFjZSgpO1xuICAgICAgICAgICAgY2JHZW5kZXIgPSBNYXRoLmZsb29yKCh0aGlzLl9mYWNlSUQgLSAxKS80KSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZhY2VJRCA9IHRoaXMuX2ZhY2VJRCB8fCBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICBpZiAoZmFjZUlEIDw9MCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgICAgICBmYWNlSUQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG4gICAgICAgIGlmIChjYkdlbmRlciA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmRlck1hbkJ1dHRvbi5jaGVjaygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmdlbmRlck1hbkJ1dHRvbi5pc0NoZWNrID0gXCIgKyB0aGlzLmdlbmRlck1hbkJ1dHRvbi5pc0NoZWNrZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5jaGVjaygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmlzQ2hlY2sgPSBcIiArIHRoaXMuZ2VuZGVyV29tYW5CdXR0b24uaXNDaGVja2VkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmFjZUlEID0gdGhpcy5fZmFjZUlEO1xuICAgICAgICAvLyBpZiAoZmFjZUlEIDw9MCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgIC8vICAgICBmYWNlSUQgPSAxO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIGZhY2VJRCk7XG4gICAgICAgIC8vIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZUZhY2VJZC5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHBhcmFtc1tcImZhY2VJZFwiXSA9IGZhY2VJRDtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIFwiICsgcGFyYW1TdHJpbmcpO1xuXG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tFZGl0TmFtZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnNldEZvY3VzKHRydWUpO1xuICAgICAgICAvLyB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuZW1pdChjYy5FZGl0Qm94LmVkaXRpbmctZGlkLWJlZ2FuKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VOYW1lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHN6TmV3Tmlja05hbWUgPSB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5zdHJpbmc7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIGlmIChzek5ld05pY2tOYW1lLmxlbmd0aCA8PSAwIHx8IHN6TmV3Tmlja05hbWUgPT0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZSl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1VwZGF0ZU5pY2tOYW1lLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1wibmlja25hbWVcIl0gPSBzek5ld05pY2tOYW1lO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDaGFuZ2VOYW1lXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5uaWNrbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IHZhbHVlLm5pY2tuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0xhYmVsX3VzZXJOYW1lLnN0cmluZyA9IHN6Tmlja05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lID0gc3pOaWNrTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZU5hbWVTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NoYW5nZU5hbWVdIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB1c2VyRmFjZVZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJGYWNlVmlld1ByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5wYXJlbnQuYWRkQ2hpbGQodXNlckZhY2VWaWV3KTtcbiAgICAgICAgLy8gdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh1c2VyRmFjZVZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJJbmZvLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJDaGFuZ2UuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pOZXdQYXNzd29yZCA9IHRoaXMubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgdmFyIHN6Q29uZmlybVBhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgaWYoc3pQYXNzd29yZC5sZW5ndGggPD0gMCB8fCBzek5ld1Bhc3N3b3JkLmxlbmd0aCA8PSAwIHx8IHN6Q29uZmlybVBhc3N3b3JkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDlr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihzelBhc3N3b3JkID09IHN6TmV3UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6Q29uZmlybVBhc3N3b3JkICE9IHN6TmV3UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6TmV3UGFzc3dvcmQubGVuZ3RoIDwgNiB8fCBzek5ld1Bhc3N3b3JkLmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZVBhc3NXb3JkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMVwiO1xuICAgICAgICBwYXJhbXNbXCJvbGRwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6UGFzc3dvcmQpO1xuICAgICAgICBwYXJhbXNbXCJuZXdwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGFzc3dvcmQnLCBzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubV9FZGl0Ym94X29yaWdpblBhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9QYW5lbF91c2VySW5mby5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckNoYW5nZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlUGFzc3dvcmRTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3BsYXNoOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgX3N0ZXA6IDAsXG4gICAgICAgIF9jb3VudDogMCxcbiAgICAgICAga0Rlc2lnbkZyYW1lUmF0ZTogNjAuMCxcbiAgICAgICAga1NwbGFzaFN0ZXBMb2dvMVN0aWxsOiAwLFxuICAgICAgICBrU3BsYXNoU3RlcExvZ28xRmFkZU91dDogMSxcbiAgICAgICAga1NwbGFzaEZhZGVUaW1lOiAwLjUsXG4gICAgICAgIGtTcGxhc2hTdGlsbFRpbWU6IDIuMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fc3RlcCA9IDA7XG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICAvLyB9LCAyKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICB0aGlzLl9jb3VudCArPSBkdDtcbiAgICAgICAgaWYgKHRoaXMuX3N0ZXAgPT09IHRoaXMua1NwbGFzaFN0ZXBMb2dvMVN0aWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLl9jb3VudCA+IHRoaXMua1NwbGFzaFN0aWxsVGltZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RlcCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0ZXAgPT09IHRoaXMua1NwbGFzaFN0ZXBMb2dvMUZhZGVPdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb3VudCA+IHRoaXMua1NwbGFzaEZhZGVUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsYXNoLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICAgICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBvcCA9IDI1NSAqICgxLjAgLSBNYXRoLnNpbigodGhpcy5fY291bnQvMS4wKSAqIDAuNSAqIE1hdGguUEkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGFzaC5vcGFjaXR5ID0gb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9