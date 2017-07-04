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
zjh_cmd.MY_VIEWID = 2; //3;

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
        cardAtlas: cc.SpriteAtlas
    },

    // use this for initialization
    onLoad: function onLoad() {},
    init: function init(cbCardData) {
        this.m_cbCardData = cbCardData;
    },
    setCardData: function setCardData(cbCardData) {
        console.log("[CardItem][setCardData] cbCardData = " + cbCardData);
        this.m_cbCardData = cbCardData;
    },
    showCardBack: function showCardBack() {
        console.log("[CardItem][showCardBack]");
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("card_back");
    },
    showCard: function showCard() {
        console.log("[CardItem][showCard] cardData = " + this.m_cbCardData);
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("big_card_" + GlobalFun.PrefixInteger(this.m_cbCardData, 2));
    }

});

cc._RFpop();
},{"GlobalFun":"GlobalFun"}],"ChoosePayTypeView":[function(require,module,exports){
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
},{"GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameFrame":[function(require,module,exports){
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
            GlobalFun.showToast(cc.director.getScene(), logonError.szErrorDescribe);
            // console.log("logonframe login error");
        } else if (sub === game_cmd.SUB_GR_LOGON_FINISH) {
            cc.director.loadScene("GameScene");
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
                if (bIntermet) {
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
                    cc.director.emit("onExitTable");
                }
                //坐下
                else if (userStatus.cbUserStatus > GlobalDef.US_FREE && oldStatus.cbUserStatus < GlobalDef.US_SIT) {
                        console.log("[GameFrame][OnSocketSubStatus] 自己坐下");
                        cc.director.emit("onEnterTable");
                        this.sendGameOption();
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
        // if (userScore.dwUserID == myUserItem.dwUserID) {
        if (!userItem) {
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
    }
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
    for (var i = 0; i < cardDataTmp.length; i++) {
        for (var j = 0; j < cardDataTmp.length - i; j++) {
            if (cardDataTmp[j] < cardDataTmp[j + 1]) {
                var _ref = [cardDataTmp[j + 1], cardDataTmp[j]];
                cardDataTmp[j] = _ref[0];
                cardDataTmp[j + 1] = _ref[1];
            }
        }
    }
    //再排大小
    for (var i = 0; i < cardDataTmp.length; i++) {
        for (var j = 0; j < cardDataTmp.length - i; j++) {
            if (GameLogic.getCardLogicValue(cardDataTmp[j]) < GameLogic.getCardLogicValue(cardDataTmp[j + 1])) {
                var _ref2 = [cardDataTmp[j + 1], cardDataTmp[j]];
                cardDataTmp[j] = _ref2[0];
                cardDataTmp[j + 1] = _ref2[1];
            }
        }
    }
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
    // 椅子号转视图位置,注意椅子号从0~nChairCount-1,返回的视图位置从1~nChairCount
    switchViewChairID: function switchViewChairID(chair) {
        var viewID = GlobalDef.INVALID_CHAIR;
        var nChairCount = this._gameFrame.getChairCount();
        var nChairID = this.getMeChairID();
        if (chair !== GlobalDef.INVALID_CHAIR && chair < nChairCount) {
            viewID = (chair + Math.floor(nChairCount * 3 / 2) - nChairID) % nChairCount; //+ 1;
        }
        console.log("[GameModel][switchViewChairID] + [nChairCount,nChairID,chair,viewID] = " + [nChairCount, nChairID, chair, viewID]);
        return viewID;
    },
    //是否合法视图ID
    isValidViewID: function isValidViewID(viewID) {
        var nChairCount = this._gameFrame.getChairCount();
        return viewID > 0 && viewID <= nChairCount;
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
    onClockUpdata: function onClockUpdata() {
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
        console.log("[GameModel][onUpdateClockView] clockTime = " + this._ClockTime + " viewChair = " + this._ClockViewChair);
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
        // m_Button_menuOpen: cc.Toggle,
        m_Panel_menu: cc.Node
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
            //this.OnEventGameClockInfo(viewID, id);
        }
    },
    //关闭计时器
    killGameClock: function killGameClock(notView) {
        var viewID = this.getClockViewID();
        if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
            //时间进度条
        }
        this._super();
    },
    //获得当前正在玩的玩家数量
    getPlayingNum: function getPlayingNum() {
        var num = 0;
        for (var index = 1; index <= zjh_cmd.GAME_PLAYER; index++) {
            if (this.m_cbPlayStatus[index] === 1) {
                num++;
            }
        }
        return num;
    },
    //时钟处理
    OnEventGameClockInfo: function OnEventGameClockInfo(chair, time, clockID) {
        console.log("[GameScene][onEventGameClockInfo] chair = " + chair + " time = " + time + " clockID = " + clockID);
        if (clockID === zjh_cmd.IDI_START_GAME) {
            if (time == 0) {
                this.onExitTable();
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
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
            if (userItem) {
                var wViewChairID = this.switchViewChairID(index);
                this._gameView.onUpdateUser(wViewChairID, userItem);
                console.log("[GameScene][onEventGameScene] wViewChairID = " + wViewChairID + " userItem = " + JSON.stringify(userItem, null, ' '));
            }
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
                this.setGameClock(this.getMeChairID(), zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME);
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
                if (!playStatus.bCompareState) {
                    if (this.getMeChairID() === this.m_wCurrentUser) {
                        this.updateControl();
                    }
                    this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
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

        if (addScore.wCompareState === 0 && this.m_wCurrentUser === myChair) {
            this.m_lCurrentTurn = addScore.lCurrentTurn;
            this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
            this.updateControl();
        }
        //设置计时器
        if (addScore.wCompareState === 0) {
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
        }
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
        console.log("[GameScene][onSubLookCard] [lookCard.wLookCardUser,this.getMeChairID()] = " + [lookCard.wLookCardUser, this.getMeChairID()]);
        if (lookCard.wLookCardUser == this.getMeChairID()) {
            var cardIndex = [];
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                cardIndex[i] = lookCard.cbCardData[i]; //GameLogic.getCardColor(lookCard.cbCardData[i]) * 13 + GameLogic.getCardValue(lookCard.cbCardData[i]);
            }
            this._gameView.setUserCard(viewID, cardIndex);
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
            if (this.m_wCurrentUser === this.getMeChairID()) {
                this.updateControl();
            }
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
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
            // this._gameView
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
        for (var i = 0; i < this._gameView.m_nodeBottom.length; i++) {
            var node = this._gameView.m_nodeBottom[i];
            node.active = false;
        }
        // ......

        var endShow;
        var saveType = [];
        //移动筹码
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var viewID = this.switchViewChairID(i);
            if (gameEnd.lGameScore[i] !== 0) {
                if (gameEnd.lGameScore[i] > 0) {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.winTheChip(viewID);
                } else {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                }
                endShow = true;
                // this._gameView.
                //....
                //.....
                saveType[i] = GameLogic.getCardType(gameEnd.cbCardData[i]);
            } else {
                saveType[i] = 0;
                this._gameView.setUserTableScore(viewID);
            }
        }

        for (var i = 0; i < 4; i++) {
            var wUserID = gameEnd.wCompareUser[myChair][i];
            if (wUserID && wUserID !== GlobalDef.INVALID_CHAIR) {
                var viewID = this.switchViewChairID(wUserID);
                var cardIndex = [];
                for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
                    cardIndex[k] = gameEnd.cbCardData[wUserID][k]; //GameLogic.getCardColor(gameEnd.cbCardData[wUserID][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[wUserID][k]);
                }
                this._gameView.setUserCard(viewID, cardIndex);
                this._gameView.setUserCardType(viewID, saveType[wUserID]);
                // this._gameView  ....
            }
        }

        if (gameEnd.wCompareUser[myChair][0] !== GlobalDef.INVALID_CHAIR || this.m_bLookCard[myChair] === true) {
            var cardIndex = [];
            for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
                cardIndex[k] = gameEnd.cbCardData[myChair][k]; //GameLogic.getCardColor(gameEnd.cbCardData[myChair][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[myChair][k]);
            }
            // var myViewID 
            this._gameView.setUserCard(zjh_cmd.MY_VIEWID, cardIndex);
            this._gameView.setUserCardType(zjh_cmd.MY_VIEWID, saveType[myChair]);
            // this._gameView  ....
        }

        if (gameEnd.wEndState == 1) {
            if (this.m_cbPlayStatus[myChair] === 1) {
                for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                    if (this.m_cbPlayStatus[i] === 1) {
                        var cardIndex = [];
                        for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
                            cardIndex[k] = gameEnd.cbCardData[i][k]; //GameLogic.getCardColor(gameEnd.cbCardData[i][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[i][k]);
                        }
                        var viewID = this.switchViewChairID(i);
                        this._gameView.setUserCard(viewID, cardIndex);
                        this._gameView.setUserCardType(viewID, saveType[i]);
                        // this._gameView  ....
                    }
                }
            }
        }

        if (endShow) {
            // ...
        }
        this._gameView.m_Button_ready.node.active = true;
        this.setGameClock(this.getMeChairID(), zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME);
        this.m_cbPlayStatus = [0, 0, 0, 0, 0];
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
    onClickMenuOpen: function onClickMenuOpen(toggle) {
        this.m_Panel_menu.active = toggle.isChecked;
        // toggle.node.setLocalZOrder(2);
        // this.m_Panel_menu.setLocalZOrder(1);
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
    //自动比牌
    onAutoCompareCard: function onAutoCompareCard() {
        var myChair = this.getMeChairID();
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var chair = myChair - i;
            if (chair < 0) {
                chair += zjh_cmd.GAME_PLAYER;
            }
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
            // //发送等待比牌消息
            // var dataBuf = CCmd_Data.create();
            // this.sendData(zjh_cmd.SUB_C_WAIT_COMPARE,dataBuf);
            // this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_COMPARE_CARD, zjh_cmd.TIME_USER_COMPARE_CARD);
        }
    },
    onCompareChoose: function onCompareChoose(index) {
        if (!index || index === GlobalDef.INVALID_CHAIR) {
            console.log("[GameScene][onCompareChoose] index error");
            return;
        }
        var myChair = this.getMeChairID();
        if (this.m_wCurrentUser !== myChair) {
            console.log("[GameScene][onCompareChoose] not m_wCurrentUser (m_wCurrentUser = " + this.m_wCurrentUser + " mychair = " + myChair);
            return;
        }
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (i !== myChair && this.m_cbPlayStatus[i] === 1 && index === this.switchViewChairID(i)) {
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
        //this._gameView ....
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
        //底部按钮
        for (var i = 0; i < this._gameView.m_nodeBottom.length; i++) {
            var node = this._gameView.m_nodeBottom[i];
            node.active = false;
        }
        //....

        //下注金额
        var scoreIndex = !index && 0 || index;
        var addScore = this.m_lCellScore * this.m_lCurrentTimes + this.m_lCellScore * scoreIndex;

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
        for (var i = 0; i < this._gameView.m_nodeBottom.length; i++) {
            var node = this._gameView.m_nodeBottom[i];
            node.active = true;
        }

        //看牌按钮
        if (!this.m_bLookCard[myChair]) {
            this._gameView.m_Button_lookCard.interactable = true;
        } else {
            this._gameView.m_Button_lookCard.interactable = false;
        }
        this._gameView.m_Button_giveUp.interactable = true;
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
        m_Label_cellTurn: cc.Label,
        m_Label_allScore: cc.Label,
        m_nodeBottom: {
            default: [],
            type: cc.Node
        },
        m_Progress_time: cc.ProgressBar,
        m_Label_time: cc.Label,
        cardPrefab: cc.Prefab,
        userInfacePrefab: cc.Prefab,
        m_Button_ready: cc.Button,
        m_Button_lookCard: cc.Button,
        m_Button_giveUp: cc.Button,
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
        m_Image_banker: cc.Node,
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
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userNode = cc.instantiate(this.userInfacePrefab);
            this.node.getChildByName("nodePlayer").addChild(userNode);
            this.m_Node_player[index] = userNode;
            userNode.setPosition(this.ptPlayer[index]);
            userNode.rotation = index * -90 + 180;
            userNode.active = false;
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
                var cardItem = cardNode.getComponent("CardItem");
                cardItem.showCardBack();
                cardNode.active = false;
            }
        }
        //底部按钮
        for (var i = 0; i < this.m_nodeBottom.length; i++) {
            var node = this.m_nodeBottom[i];
            node.active = false;
        }
    },
    onEnable: function onEnable() {},
    onResetView: function onResetView() {
        this.m_Button_ready.node.active = false;

        for (var i = 0; i < this.m_nodeBottom.length; i++) {
            var node = this.m_nodeBottom[i];
            node.active = false;
        }
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
            return;
        } else {
            this.m_Progress_time.node.active = true;
            if (this.ptPlayer[viewID]) {
                this.m_Progress_time.node.setPosition(this.ptPlayer[viewID]);
            } else {
                this.m_Progress_time.node.setPosition(0, 60);
            }
        }
        var progress = 1.0 * time / zjh_cmd.TIME_START_GAME;
        this.m_Progress_time.progress = progress;
        this.m_Label_time.string = time.toString();
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
        } else {
            this.m_flagReady[viewID].active = false;
        }
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function onShowIntroduce(bShow) {},
    //筹码移动
    playerJetton: function playerJetton(wViewChairID, num, notani) {},
    //停止比牌动画
    stopCompareCard: function stopCompareCard() {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function compareCard(firstuser, seconduser, firstcard, secondcard, bfirstwin, callback) {
        this.node.getChildByName("compareView").active = true;
        this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(function () {
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
        if (!viewID || viewID === GlobalDef.INVALID_CHAIR) {
            //todo
            this.m_Image_banker.active = false;
            return;
        }
        this.m_Image_banker.active = true;
        this.m_Image_banker.setPosition(this.ptBanker[viewID]);
    },
    //下注总额
    setAllTableScore: function setAllTableScore(score) {
        if (!score || score === 0) {
            this.m_Label_allScore.node.active = false;
        } else {
            this.m_Label_allScore.node.active = true;
            this.m_Label_allScore.string = score;
        }
    },
    //玩家下注
    setUserTableScore: function setUserTableScore(viewID, score) {
        if (!score || score === 0) {
            // if (viewID !== )
        } else {}
    },
    //发牌
    sendCard: function sendCard(viewID, index, fDelay) {
        console.log("[viewID,index,fDelay] = " + [viewID, index, fDelay]);
        if (!viewID || viewID === GlobalDef.INVALID_CHAIR) {
            return;
        }
        var fInterval = 0.1;
        var nodeCard = this.m_userCard[viewID];
        var spriteCard = nodeCard.card[index];
        var cardItem = spriteCard.getComponent("CardItem");
        spriteCard.active = true;
        spriteCard.setScale(1.0);
        cardItem.showCardBack();
        spriteCard.runAction(cc.sequence(cc.delayTime(fDelay), cc.spawn(cc.scaleTo(0.25, 1.0))));
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
        if (!viewID || viewID === GlobalDef.INVALID_CHAIR) {
            return;
        }
        if (cardData) {
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[i];
                var cardItem = cardNode.getComponent("CardItem");
                cardNode.active = true;
                if (!cardData[i] || cardData[i] === 0 || cardData[i] === 0xff) {
                    cardItem.showCardBack();
                } else {
                    cardItem.setCardData(cardData[i]);
                    cardItem.showCard();
                }
            }
        } else {
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                this.m_userCard[viewID].card[i].active = false;
            }
        }
    },
    //显示牌类型
    setUserCardType: function setUserCardType(viewID, cardtype) {},
    //赢得筹码
    winTheChip: function winTheChip(wWinner) {},
    //清理筹码
    cleanAllJettons: function cleanAllJettons() {},
    //取消比牌选择
    setCompareCard: function setCompareCard(bChoose, status) {
        this.bCompareChoose = bChoose;
        // todo
    },
    //按键响应
    onStartGame: function onStartGame() {
        this._scene.onStartGame(true);
        // this.m_Button_ready.node.active = false;
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
    onAddScore: function onAddScore(event, params) {
        console.log(params);
        this._scene.addScore(params);
    }
});

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GlobalDef":[function(require,module,exports){
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
    PrefixInteger: PrefixInteger
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
            // GlobalFun.showAlert(cc.director.getScene(),"进入房间");
            cc.director.emit("onLogonRoom", { roomInfo: this._roomInfo });
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
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode) {
            console.log("[PlazaView][onLoad] 获取GameFrame 所在节点 并设置为常驻节点");
            cc.game.addPersistRootNode(GameFrameNode);
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
        }

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
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));

        this.refreshRoomList();
    },
    refreshRoomList: function refreshRoomList() {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
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
        cc.director.on('onLogonRoom', this.onLogonRoom, this);
        console.log("[PlazaView][onEnable]");
    },
    onDisable: function onDisable() {
        cc.director.off('onChangeUserFaceSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onChangeNameSuccess', this.onChangeUserFaceSuccess, this);
        cc.director.off('onBankSuccess', this.onBankSuccess, this);
        cc.director.off('onLogonRoom', this.onLogonRoom, this);
        console.log("[PlazaView][onDisable]");
    },
    onLogonRoom: function onLogonRoom(params) {
        console.log("[PlazaView][onLogonRoom]");
        this._gameFrame.onLogonRoom(params.detail.roomInfo);
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
},{}]},{},["GameServerItem","GameUserItem","GlobalDef","GlobalUserData","HelloWorld","MD5","PlazaView","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","CardItem","GameLogic","GameScene","GameView","UserInfaceItem","GameModel","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","GameFrame","LogonFrame","LogonView","RegisterView","BankView","ChoosePayTypeView","PlazaRoomItem","SettingView","ShopItem","ShopView","UserFaceItem","UserFaceView","UserProfileView"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL0NhcmRJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9DaG9vc2VQYXlUeXBlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0dhbWVGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvZ2FtZS9HYW1lTG9naWMuanMiLCJhc3NldHMvU2NyaXB0L2dhbWVNb2RlbC9HYW1lTW9kZWwuanMiLCJhc3NldHMvU2NyaXB0L2dhbWUvR2FtZVNjZW5lLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lU2VydmVySXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZVVzZXJJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL0dhbWVWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9HbG9iYWxEZWYuanMiLCJhc3NldHMvU2NyaXB0L2V4dGVybmFsL0dsb2JhbEZ1bi5qcyIsImFzc2V0cy9TY3JpcHQvR2xvYmFsVXNlckRhdGEuanMiLCJhc3NldHMvU2NyaXB0L0hlbGxvV29ybGQuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL21vZGVscy9Mb2dvbkZyYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS9Mb2dvblNjZW5lLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9sb2dvbi9Mb2dvblZpZXcuanMiLCJhc3NldHMvU2NyaXB0L01ENS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvUGxhemFSb29tSXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvUGxhemFWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9Qb3BXYWl0Vmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvbG9nb24vUmVnaXN0ZXJWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TZXR0aW5nVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2hvcEl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1Nob3BWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9Ub2FzdFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJGYWNlSXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlckZhY2VWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL1VzZXJJbmZhY2VJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyUHJvZmlsZVZpZXcuanMiLCJhc3NldHMvU2NyaXB0L1dlbGNvbWVWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhROztBQWNaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUF2Q0k7Ozs7Ozs7Ozs7QUNBVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGc0I7QUFJMUI7QUFDSTtBQUNBO0FBRnVCO0FBSTNCO0FBQ0k7QUFDQTtBQUZtQjtBQUl2QjtBQXRDUTs7QUF5Q1o7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFYTjtBQWFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQTNOSTs7Ozs7Ozs7OztBQ0xUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNFO0FBQ0Q7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBRUk7QUFDSDs7QUFFRDtBQUNBO0FBQ0Q7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFSTtBQUNBO0FBQ0g7QUFDRDtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIOztBQXZKb0I7O0FBMkp6Qjs7Ozs7Ozs7OztBQzNKQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7O0FDL2FBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDbmZBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQzNNQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJROztBQWdCWjtBQUNBO0FBR0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIOztBQXJDSTs7Ozs7Ozs7OztBQ0RUO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJROztBQWdCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0g7QUEvREk7Ozs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTs7QUFHQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0E7QUFDQTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFBZ0M7O0FBQzVCO0FBT3FEO0FBQzdDO0FBQ0k7QUFDQTtBQUZrQztBQUl6QztBQU1SO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFBbUM7O0FBQy9CO0FBYVE7QUFDQTtBQUNIO0FBRVI7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFwQ1I7QUFzQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFEaUM7QUFHckM7QUFDSjtBQUNJO0FBNUNSO0FBOENIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQTdCUjtBQStCSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUxSO0FBT0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFHQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQztBQUlwQztBQUNKO0FBQ0k7QUFqRFI7QUFtREg7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhnQztBQUt2QztBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFKQTtBQU1JO0FBQ0E7QUFDSDtBQUNEO0FBSks7QUFNRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNEO0FBVks7QUFZRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUM7QUFLeEM7QUFDSjtBQUNEO0FBN0NBO0FBK0NJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVJO0FBQ0k7QUFEZ0M7QUFHdkM7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUF4dEJJOzs7Ozs7Ozs7O0FDVlQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQXlDO0FBQ3BDO0FBQWdCO0FBQ3BCO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQW9HO0FBQy9GO0FBQWdCO0FBQ3BCO0FBQ0o7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNIOztBQUdEOzs7Ozs7Ozs7O0FDeEtBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBR0E7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFFSTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFyUXFCO0FBNlF6Qjs7Ozs7Ozs7Ozs7Ozs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVpROztBQWVaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFFRztBQUNJO0FBQ0g7QUFDSjtBQUVHO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBRUc7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFFRztBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUVHO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNKO0FBQ0k7QUFoS1I7QUFrS0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQXFDOztBQUNqQztBQVlIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFFSjs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7O0FBRUE7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUVKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFFRztBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSTtBQUNIOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUVJO0FBQ0g7QUFDRDtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0g7QUFoL0JJOzs7Ozs7Ozs7O0FDTlQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBakJSO0FBbUJIO0FBQ0o7QUFwRXlCOztBQXVFOUI7Ozs7Ozs7Ozs7QUN2RUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNKO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBbEJSO0FBb0JIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNZO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUEvTnVCOztBQWtPNUI7Ozs7Ozs7Ozs7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNBO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDSTtBQUNBO0FBRk07QUFqREY7O0FBdURaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUdBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUk7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFNSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBSUo7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFLSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUEzVkk7Ozs7Ozs7Ozs7QUNMVDtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUo7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBR0o7Ozs7Ozs7Ozs7QUN6TEE7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBR1k7QUFDSTtBQUNIO0FBQ0o7QUFFWjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDtBQUNDO0FBQ0E7QUFDQztBQUNBO0FBQ0U7QUFDQTtBQUNDO0FBQ0E7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQztBQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJhOzs7Ozs7Ozs7O0FDL0hqQjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQS9GZ0I7O0FBa0dyQjs7Ozs7Ozs7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFOUTtBQVFaO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQTFGSTs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0U7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFqQ1I7QUFtQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBRUg7QUF2Tkk7Ozs7Ozs7Ozs7QUNSVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDSTtBQUNBO0FBRlU7QUFmTjs7QUFxQlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUoyQztBQU1uRDtBQUNEO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDRDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBMUlJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGUTtBQW5CSjs7QUF5Qlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSDtBQTlFSTs7Ozs7Ozs7OztBQ0RUO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOztBQUdEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQVJMO0FBVUg7O0FBS0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDSDs7QUFHRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7Ozs7Ozs7OztBQ2xSRDtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlE7O0FBa0JaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQWxESTs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBM0NQOztBQWlEWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQTNOSTs7Ozs7Ozs7OztBQ0pUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZhO0FBZlQ7O0FBcUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUE5REk7Ozs7Ozs7Ozs7QUNBUjtBQUNBO0FBQ0E7QUFDQTtBQUNHOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZVO0FBdkJOOztBQTZCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSjBCO0FBTWpDO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUF0SUs7Ozs7Ozs7Ozs7QUNIVjtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBekNJOzs7Ozs7Ozs7O0FDRFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNBO0FBcEJROztBQXVCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBM0NLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlk7QUFJaEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQW5CUTs7QUFzQlo7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBbEtJOzs7Ozs7Ozs7O0FDSFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFYVDs7QUFpQlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDs7QUFHRDtBQUNBOztBQUVBO0FBekNLOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjs7QUFuQlE7O0FBdUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBMUNLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBbkJROztBQXNCWjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDSDtBQWpFSTs7Ozs7Ozs7OztBQ0ZUO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNJO0FBQ0E7QUFGUztBQTNCTDs7QUFpQ1o7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGtCO0FBS3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUI7QUFLckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIa0I7QUFLdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIa0I7QUFLdEI7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQWxHSTs7Ozs7Ozs7OztBQ0RUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmlCO0FBSXJCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGWTtBQUloQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZzQjtBQUkxQjtBQUNJO0FBQ0E7QUFGdUI7QUFJM0I7QUFDSTtBQUNBO0FBRm1CO0FBSXZCO0FBQ0E7QUF4RVE7O0FBMkVaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0s7QUFDQTtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBbFNLOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJCUTs7QUF3Qlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBOURJIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hbGVydDogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLmluaXQoe21lc3NhZ2U6XCJ0aGlzIGlzIGp1c3QgdGVzdFwifSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25Mb2FkXVwiKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBwYXJhbXMubWVzc2FnZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2FsZXJ0LnN0cmluZyA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5mYWRlSW4oMC41KSxjYy5kZWxheVRpbWUoMS4wKSxjYy5mYWRlT3V0KDAuNSksY2MucmVtb3ZlU2VsZigpKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EZXN0cm95XSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJhZGlvQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZVxuICAgICAgICB9LFxuICAgICAgICBwYW5lbEdyb3VwOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfZ2V0X3VzZXJHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9nZXRfYmFua0dvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3NhdmVfdXNlckdvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3NhdmVfYmFua0dvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0VkaXRib3hfZ2V0X2dvbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9nZXRfYmFua1B3ZDogY2MuRWRpdEJveCxcbiAgICAgICAgbV9FZGl0Ym94X3NhdmVfZ29sZDogY2MuRWRpdEJveCxcbiAgICAgICAgbV9FZGl0Ym94X29yaWdpblBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9uZXdQYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIF9zZWxlY3RJbmRleDowLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fTGFiZWxfZ2V0X3VzZXJHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfc2F2ZV91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2dldF9iYW5rR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfc2F2ZV9iYW5rR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIHJhZGlvQnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24odG9nZ2xlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMucmFkaW9CdXR0b24uaW5kZXhPZih0b2dnbGUpO1xuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IGluZGV4O1xuICAgICAgICB0b2dnbGUubm9kZS5zZXRMb2NhbFpPcmRlcigxKTtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJSYWRpb0J1dHRvblwiO1xuICAgICAgICBzd2l0Y2goaW5kZXgpIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiMVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiMlwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiM1wiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmFkaW9CdXR0b24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5yYWRpb0J1dHRvbltpXTtcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IHRoaXMucGFuZWxHcm91cFtpXTtcbiAgICAgICAgICAgIGlmKGNjLmlzVmFsaWQoZWxlbWVudCkgJiYgY2MuaXNWYWxpZChwYW5lbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2V0TG9jYWxaT3JkZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubm9kZS5zZXRMb2NhbFpPcmRlcigwKTtcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHRpdGxlKTtcbiAgICAgICAgLy8gdGhpcy5fdXBkYXRlVG9nZ2xlRXZlbnRTdHJpbmcodGl0bGUsIHRoaXMucmFkaW9CdXR0b25FdmVudFN0cmluZywgdG9nZ2xlKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIC8vIHVybCArPSBcIi9oei9oelVwZGF0ZUZhY2VJZC5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgaWYodGhpcy5fc2VsZWN0SW5kZXggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHN6R29sZENvdW50ID0gdGhpcy5tX0VkaXRib3hfZ2V0X2dvbGQuc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHN6UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9nZXRfYmFua1B3ZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgcmUgPSAvLi87XG4gICAgICAgICAgICBpZihzekdvbGRDb3VudC5sZW5ndGggPD0gMCB8fCBzelBhc3NXb3JkLmxlbmd0aCA8PSAwKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOmHkemineaIluWvhueggeS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLph5Hpop3miJblr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKE51bWJlcihzekdvbGRDb3VudCkgPD0gMCB8fCBOdW1iZXIoc3pHb2xkQ291bnQpID4gKEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUpKXtcbiAgICAgICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOaVsOWAvOS4jeWQiOazleaIlui2heWHuumTtuihjOeahOmHkeminemZkOWItu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rpk7booYznmoTph5Hpop3pmZDliLYhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJzY29yZVwiXSA9IHN6R29sZENvdW50O1xuICAgICAgICAgICAgcGFyYW1zW1wiaW5zdXJlcGFzc1wiXSA9IGNjLm1kNUVuY29kZShzelBhc3NXb3JkKTtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjJcIjtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXNlckJhbmtNb2JpbGUuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdEluZGV4ID09IDEpIHtcbiAgICAgICAgICAgIHZhciBzekdvbGRDb3VudCA9IHRoaXMubV9FZGl0Ym94X3NhdmVfZ29sZC5zdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3pHb2xkQ291bnQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOmHkemineS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLph5Hpop3kuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoTnVtYmVyKHN6R29sZENvdW50KSA8PSAwIHx8IE51bWJlcihzekdvbGRDb3VudCkgPiBOdW1iZXIoR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUpKXtcbiAgICAgICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOaVsOWAvOS4jeWQiOazleaIlui2heWHuui6q+S4iumHkemine+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rouqvkuIrph5Hpop3vvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJzY29yZVwiXSA9IHN6R29sZENvdW50O1xuICAgICAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMVwiO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVc2VyQmFua01vYmlsZS5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLl9zZWxlY3RJbmRleCA9PSAyKSB7XG4gICAgICAgICAgICB2YXIgc3pQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X29yaWdpblBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzek5ld1Bhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHN6Q29uZmlybVBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIGlmIChzelBhc3NXb3JkLmxlbmd0aCA8PSAwIHx8IHN6TmV3UGFzc1dvcmQubGVuZ3RoIDw9IDAgfHwgc3pDb25maXJtUGFzc1dvcmQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOWvhueggeS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3pQYXNzV29yZCA9PSBzek5ld1Bhc3NXb3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3pDb25maXJtUGFzc1dvcmQgIT0gc3pOZXdQYXNzV29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6TmV3UGFzc1dvcmQubGVuZ3RoIDwgNiB8fCBzek5ld1Bhc3NXb3JkLmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMlwiO1xuICAgICAgICAgICAgcGFyYW1zW1wib2xkcGFzc1wiXSA9IGNjLm1kNUVuY29kZShzelBhc3NXb3JkKTtcbiAgICAgICAgICAgIHBhcmFtc1tcIm5ld3Bhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzV29yZCk7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZVBhc3NXb3JkLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID0gdmFsdWUuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluc3VyZXNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUgPSB2YWx1ZS5pbnN1cmVzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25CYW5rU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH0sXG4gICAgb25DbGlja1NhdmVBbGw6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfc2F2ZV9nb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgIH0sXG4gICAgb25DbGlja0dldEFsbDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fRWRpdGJveF9nZXRfZ29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLl92aWV3RnJhbWUgPSB2aWV3O1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZSBvbkxvYWRcIik7XG4gICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICB9LFxuICAgIC8vIG5hbWU6IFwiQmFzZUZyYW1lXCIsXG4gICAgLy8gY3RvcjogZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgLy8gdGhpcy5fdmlld0ZyYW1lID0gdmlldztcbiAgICAvLyAgICAgdGhpcy5fdGhyZWFkaWQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMuX3NvY2tldCA9IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgLy8gdGhpcy5fY2FsbEJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgXG4gICAgLy8gICAgIHRoaXMuX2dhbWVGcmFtZSA9IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgdGhpcy5tX3RhYkNhY2hlTXNnID0ge307XG4gICAgICAgIFxuICAgIC8vIH0sXG4gICAgc2V0Q2FsbEJhY2s6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7ICBcbiAgICB9LFxuICAgIHNldFZpZXdGcmFtZTogZnVuY3Rpb24odmlld0ZyYW1lKXtcbiAgICAgIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXdGcmFtZTsgIFxuICAgIH0sXG4gICAgc2V0U29ja2V0RXZlbnQ6IGZ1bmN0aW9uKHNvY2tldEV2ZW50KXtcbiAgICAgICAgdGhpcy5fc29ja2V0RXZlbnQgPSBzb2NrZXRFdmVudDtcbiAgICB9LFxuICAgIGdldFZpZXdGcmFtZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIGlzU29ja2V0U2VydmVyOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fdGhyZWFkaWQgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIG9uU29ja2V0RXJyb3I6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgIGlmKHRoaXMuX3RocmVhZGlkID09PSB1bmRlZmluZWQpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgLy90b2RvLi4uXG4gICAgfSxcbiAgICBvbkNyZWF0ZVNvY2tldDogZnVuY3Rpb24oc3pVcmwsblBvcnQpe1xuICAgICAgICBpZih0aGlzLl9zb2NrZXQgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N6U2VydmVyVXJsID0gc3pVcmw7XG4gICAgICAgIHRoaXMuX25TZXJ2ZXJQb3J0ID0gblBvcnQ7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fU29ja2V0RnVuID0gZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gQ2xpZW50U29ja2V0LmNyZWF0ZVNvY2tldCh0aGlzLl9Tb2NrZXRGdW4pO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUpO1xuICAgICAgICBpZih0aGlzLl9zb2NrZXQuQ29ubmVjdFNvY2tldCh0aGlzLl9zelNlcnZlclVybCx0aGlzLl9uU2VydmVyUG9ydCkgPT09IHRydWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbkNyZWF0ZVNvY2tldCBjbG9zZVwiKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblNvY2tldENhbGxCYWNrOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmKHBEYXRhID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZih0aGlzLl9jYWxsQmFjayA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnbm8gY2FsbGJhY2snKTtcbiAgICAgICAgLy8gICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIHZhciBtYWluID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICB2YXIgc3ViID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25Tb2NrZXRDYWxsQmFjayBtYWluOiBcIiArIG1haW4gKyBcIiAjc3ViOiBcIitzdWIpO1xuICAgICAgICBpZihtYWluID09PSAwKSBcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoc3ViID09PSAwKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RDb21wZWxldGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNvY2tldEVycm9yKHBEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFdmVudChtYWluLCBzdWIsIHBEYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZVNvY2tldDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5yZWxlYXNlU29ja2V0KCk7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fdGhyZWFkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fU29ja2V0RnVuID0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgc2VuZFNvY2tldERhdGE6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc29ja2V0LnNlbmRTb2NrZXREYXRhKHBEYXRhKTtcbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uQ29ubmVjdENvbXBlbGV0ZWRcIik7XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uU29ja2V0RXZlbnRfXCIrbWFpbitcIi1cIitzdWIpO1xuICAgIH0sXG4gICAgb25HYW1lU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWVfb25HYW1lU29ja2V0RXZlbnRfXCIrbWFpbitcIi1cIitzdWIpO1xuICAgIH0sXG4gICAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlRnJhbWU7IiwidmFyIGdhbWVfY21kID0ge307XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eZu+W9leaVsOaNruWMheWumuS5iVxuXG5nYW1lX2NtZC5NRE1fR1JfTE9HT04gPSAxMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7TnmbvlvZVcblxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0FDQ09VTlRTID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDmiLfnmbvlvZVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9VU0VSSUQgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0kgRCDnmbvlvZVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9NT0JJTEUgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhlxuXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fU1VDQ0VTUyA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5oiQ5YqfXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fRVJST1IgPSA2MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leWksei0pVxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0ZJTklTSCA9IDYwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5a6M5oiQXG5cbi8vIC8v5oi/6Ze05biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlBY2NvdW50c1xuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UHJvY2Vzc1ZlcnNpb247ICAgICAgICAgICAgICAgICAgIC8v6L+b56iL54mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIH07XG5cbi8vIC8v5omL5py655m76ZmGXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlVc2VySURNb2JpbGVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmNyeXB0SUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvZGVDaGVja0lEOyAgICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIEyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1dlaVhpbkNoZWNrSUQ7ICAgICAgICAgICAgICAgICAgICAvL+W+ruS/oemqjOivgeeggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcFZlcnNpb247ICAgICAgICAgICAgICAgICAvL+a4uOaIj0FQUOeJiOacrOWPtyjkuI7nmbvpmYblpKfljoXnm7jlkIwpXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07ICAgLy/mnLrlmajluo/liJflj7dcbi8vIH07XG5cbi8vIC8v5oi/6Ze0IElEIOeZu+W9lVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklEXG4vLyB7XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1Byb2Nlc3NWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAvL+i/m+eoi+eJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIH07XG5cbi8vIC8v55m75b2V5oiQ5Yqf5raI5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uU3VjY2Vzc1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLyAvL+eZu+W9leWksei0pVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkVycm9yXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsRXJyb3JDb2RlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUmeivr+S7o+eggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAgICAgLy/plJnor6/mtojmga9cbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eUqOaIt+aVsOaNruWMheWumuS5iVxuXG5nYW1lX2NtZC5NRE1fR1JfVVNFUiA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NJVF9SRVEgPSAxMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTE9PS09OX1JFUSA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peB6KeC6K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFORFVQX1JFUSA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LW356uL6K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9MRUZUX0dBTUVfUkVRID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nprvlvIDmuLjmiI9cblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ09NRSA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36L+b5YWlXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFUVVMgPSA2MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU0NPUkUgPSA2MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuZ2FtZV9jbWQuU1VCX0dSX1NJVF9GQUlMRUQgPSA2MDMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+Wksei0pVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUklHSFQgPSA2MDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+adg+mZkFxuZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9PUkRFUiA9IDYwNSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG5nYW1lX2NtZC5TVUJfR1JfUVVFUllfR09MRCA9IDYwNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6YeR6LGGXG5nYW1lX2NtZC5TVUJfR1JfUVVFUllfVFJBTiA9IDYwNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6L2s5biQXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0NIQVQgPSA3MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iBiuWkqea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfV0lTUEVSID0gNzAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np4Hor63mtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1JVTEUgPSA3MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+inhOWImVxuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9JTlZJVEUgPSA4MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCgOivt+a2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFX1JFUSA9IDgwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKA6K+36K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWSA9IDgwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCB5p+l6K+iXG5nYW1lX2NtZC5TVUJfR1JfUFJFU0VOVF9FUlJPUiA9IDgwM1xuXG4vLyAvL+S8muWRmOetiee6p1xuLy8gc3RydWN0IENNRF9HUl9NZW1iZXJPcmRlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlbDmja7lupMgSURcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyT3JkZXI7ICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+adg+mZkFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUmlnaHRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJSaWdodDsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+adg+mZkFxuLy8gfTtcblxuLy8gLy/nlKjmiLfnirbmgIFcbi8vIHN0cnVjdCBDTURfR1JfVXNlclN0YXR1c1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkvY3nva5cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlVzZXJTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbi8vIH07XG5cbi8vIC8v55So5oi35YiG5pWwXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTY29yZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbExvdmVsaW5lc3M7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbi8vICAgICAvL0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgIGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5raI6LS56YeR6LGGXG4vLyAgICAgLy9MT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZUdvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgdGFnVXNlclNjb3JlICAgICAgICAgICAgICAgICAgICBVc2VyU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+enr+WIhuS/oeaBr1xuLy8gfTtcblxuLy8gLy9zdHJ1Y3Qgb25lVHJhblJlY29yZFxuLy8gLy97XG4vLyAvLyAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07XG4vLyAvLyAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUb1VzZXJJRDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRvQWNjb3VudHNbTkFNRV9MRU5dO1xuLy8gLy8gIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5nb2xkO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5EYXRhWzE1XTtcbi8vIC8vXG4vLyAvL307XG5cbi8vIC8v5p+l6K+i57uT5p6cIHdzbCAyMDE1LjQuMVxuLy8gc3RydWN0IG9uZVRyYW5SZWNvcmRcbi8vIHtcbi8vICAgICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RyYW5HYW1lSUQ7ICAgICAgICAgICAgICAgICAvL+i9rOW4kOa4uOaIj0lEXG4vLyAgICAgLy9UQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUcmFuR2FtZUlEWzMxXTsgICAgICAgICAgICAgICAgLy/ovazluJDmuLjmiI9JRFxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblR5cGVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/ovazluJDnsbvlnotcbi8vICAgICAvL0xPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsUHJlc2VudFZhbHVlOyAgICAgICAgICAgICAgICAgIC8v6LWg6YCB6YeR6LGGXG4vLyAgICAgLy9UQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUcmFuVGltZVsyMF07ICAgICAgICAgICAgICAgICAvL+i9rOW4kOaXtumXtFxuICAgIFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAvL+eUqOaIt+aYteensFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt0lEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3VudDsgICAgICAgICAgICAgICAgICAgIC8v5pWw6YePXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pGbG93ZXJOYW1lWzMyXTsgICAgICAgICAgIC8v56S854mp5ZCN56ewXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUcmFuVHlwZVtOQU1FX0xFTl07ICAgICAgIC8v6L2s5biQ57G75Z6LXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1RyYW5Hb2xkUmVjb3JkUlxuLy8ge1xuLy8gICAgIEJZVEUgICAgbnVtOy8v5pyJ5Yeg5p2h6KGoXG4vLyAgICAgb25lVHJhblJlY29yZCAgIG9uZXRyYW5yZWNvcmRbMTBdOy8v5pyA5aSa5Y2B5p2h6K6w5b2V5LiA5Y+RXG4vLyB9O1xuXG4vLyAvLy8vL+eUqOaIt+afpeivoumHkeixhue7k+aenCAyMDExLjcuMTUgYnkgZ2Fvc2hhblxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUXVpQmFua2VyXG4vLyB7XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgICAvL+mTtuihjOmHkeixhlxuLy8gICAgIENNRF9HUF9UcmFuR29sZFJlY29yZFIgICAgICAgICAgICAgIFRyYW5SZWNvcmQ7XG4vLyB9O1xuXG4vLyAvL+ivt+axguWdkOS4i1xuLy8gc3RydWN0IENNRF9HUl9Vc2VyU2l0UmVxXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlBhc3NMZW47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvhueggemVv+W6plxuLy8gICAgIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgZHdBbnN3ZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lm57nrZQgSSBELy/lhbzlrrnnp6/liIbmuLjmiI/lhaXluqfpl67pophcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS9jee9rlxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUYWJsZVBhc3NbUEFTU19MRU5dOyAgICAgICAgICAgICAgLy/moYzlrZDlr4bnoIFcbi8vIH07XG5cbi8vIC8v6YKA6K+355So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJJbnZpdGVSZXFcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vIH07XG5cbi8vIC8v5Z2Q5LiL5aSx6LSlXG4vLyBzdHJ1Y3QgQ01EX0dSX1NpdEZhaWxlZFxuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pGYWlsZWREZXNjcmliZVsyNTZdOyAgICAgICAgICAgICAgLy/plJnor6/mj4/ov7Bcbi8vIH07XG5cbi8vIC8v6IGK5aSp57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJDaGF0XG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIENPTE9SUkVGICAgICAgICAgICAgICAgICAgICAgICAgY3JGb250Q29sb3I7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/popzoibJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3U2VuZFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB55So5oi3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDaGF0TWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgICAgLy/ogYrlpKnkv6Hmga9cbi8vIH07XG5cbi8vIC8v56eB6K+t57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dSX1dpc3BlclxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBDT0xPUlJFRiAgICAgICAgICAgICAgICAgICAgICAgIGNyRm9udENvbG9yOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6aKc6ImyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1NlbmRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeeUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q2hhdE1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAgIC8v6IGK5aSp5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+inhOWImVxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUnVsZVxuLy8ge1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBhc3N3b3JkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7lr4bnoIFcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdFdpbjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26IOc546HXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRGbGVlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuaWree6v1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbliIbmlbBcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJDaGVja1NhbWVJUDsgICAgICAgICAgICAgICAgICAgICAgIC8v5pWI6aqM5Zyw5Z2AXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3V2luUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuiDnOeOh1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZsZWVSYXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbpgIPot5Fcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA6auY5YiG5pWwXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsTGVzc1Njb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOS9juWIhuaVsFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzd29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/moYzlrZDlr4bnoIFcbi8vIH07XG5cbi8vIC8v6YKA6K+355So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJJbnZpdGVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+mFjee9ruS/oeaBr+aVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfSU5GTyA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTyA9IDkwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze06YWN572uXG5nYW1lX2NtZC5TVUJfR1JfT1JERVJfSU5GTyA9IDkwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfTUVNQkVSX0lORk8gPSA5MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPID0gOTAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajphY3nva5cbmdhbWVfY21kLlNVQl9HUl9DT05GSUdfRklOSVNIID0gOTA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/phY3nva7lrozmiJBcblxuLy8gLy/muLjmiI/miL/pl7Tkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfU2VydmVySW5mb1xuLy8ge1xuLy8gICAgIC8v5oi/6Ze05bGe5oCnXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0dhbWVHZW5yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nsbvlnotcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3S2luZElEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+WeiyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VmlkZW9BZGRyOyAgICAgICAgICAgICAgICAgICAgICAgIC8v6KeG6aKR5Zyw5Z2AXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkhpZGVVc2VySW5mbzsgICAgICAgICAgICAgICAgICAgICAvL+makOiXj+S/oeaBr1xuLy8gfTtcblxuLy8gLy/liIbmlbDmj4/ov7Dkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfU2NvcmVJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RGVzY3JpYmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAvL+aPj+i/sOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0RhdGFEZXNjcmliZVsxNl07ICAgICAgICAgICAgICAgICAgLy/mlbDmja7moIflv5dcbi8vIH07XG5cbi8vIC8v562J57qn5o+P6L+w57uT5p6EXG4vLyBzdHJ1Y3QgdGFnT3JkZXJJdGVtXG4vLyB7XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+enr+WIhlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd09yZGVyRGVzY3JpYmVbMTZdOyAgICAgICAgICAgICAgICAgLy/nrYnnuqfmj4/ov7Bcbi8vIH07XG5cbi8vIC8v562J57qn5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX09yZGVySW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd09yZGVyQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfmlbDnm65cbi8vICAgICB0YWdPcmRlckl0ZW0gICAgICAgICAgICAgICAgICAgIE9yZGVySXRlbVsxMjhdOyAgICAgICAgICAgICAgICAgICAgIC8v562J57qn5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+WIl+ihqOmhueaPj+i/sOe7k+aehFxuLy8gc3RydWN0IHRhZ0NvbHVtbkl0ZW1cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2x1bW5XaWR0aDsgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5a695bqmXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RGF0YURlc2NyaWJlOyAgICAgICAgICAgICAgICAgICAgICAvL+Wtl+auteexu+Wei1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDb2x1bW5OYW1lWzE2XTsgICAgICAgICAgICAgICAgICAgLy/liJfooajlkI3lrZdcbi8vIH07XG5cbi8vIC8v5YiX6KGo5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX0NvbHVtbkluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2x1bW5Db3VudDsgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5pWw55uuXG4vLyAgICAgdGFnQ29sdW1uSXRlbSAgICAgICAgICAgICAgICAgICBDb2x1bW5JdGVtWzMyXTsgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOaPj+i/sFxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5oi/6Ze054q25oCB5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TVEFUVVMgPSA0NCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eKtuaAgeS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfVEFCTEVfSU5GTyA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L+h5oGvXG5nYW1lX2NtZC5TVUJfR1JfVEFCTEVfU1RBVFVTID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIFcblxuLy8gLy/moYzlrZDnirbmgIHnu5PmnoRcbi8vIHN0cnVjdCB0YWdUYWJsZVN0YXR1c1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBsYXlTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJUYWJsZUxvY2s7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a54q25oCBXG4vLyB9O1xuXG4vLyAvL+ahjOWtkOeKtuaAgeaVsOe7hFxuLy8gc3RydWN0IENNRF9HUl9UYWJsZUluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5pWw55uuXG4vLyAgICAgdGFnVGFibGVTdGF0dXMgICAgICAgICAgICAgICAgICBUYWJsZVN0YXR1c1s1MTJdOyAgICAgICAgICAgICAgICAgICAvL+eKtuaAgeaVsOe7hFxuLy8gfTtcblxuLy8gLy/moYzlrZDnirbmgIHkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfVGFibGVTdGF0dXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJUYWJsZUxvY2s7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a54q25oCBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiUGxheVN0YXR1czsgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+euoeeQhuaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfTUFOQUdFUiA9IDU1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5ZG95LukXG5cbmdhbWVfY21kLlNVQl9HUl9TRU5EX1dBUk5JTkcgPSAxMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeitpuWRilxuZ2FtZV9jbWQuU1VCX0dSX1NFTkRfTUVTU0FHRSA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfTE9PS19VU0VSX0lQID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6XnnIvlnLDlnYBcbmdhbWVfY21kLlNVQl9HUl9LSUxMX1VTRVIgPSA0NCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i4ouWHuueUqOaIt1xuZ2FtZV9jbWQuU1VCX0dSX0xJTUlUX0FDQ09VTlMgPSA1NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emgeeUqOW4kOaIt1xuZ2FtZV9jbWQuU1VCX0dSX1NFVF9VU0VSX1JJR0hUID0gNjYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnYPpmZDorr7nva5cbmdhbWVfY21kLlNVQl9HUl9PUFRJT05fU0VSVkVSID0gNzcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7Torr7nva5cblxuLy8gLy/lj5HpgIHorablkYpcbi8vIHN0cnVjdCBDTURfR1JfU2VuZFdhcm5pbmdcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pXYXJuaW5nTWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgLy/orablkYrmtojmga9cbi8vIH07XG5cbi8vIC8v57O757uf5raI5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlbmRNZXNzYWdlXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdhbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+a2iOaBr1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JSb29tOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelN5c3RlbU1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAvL+ezu+e7n+a2iOaBr1xuLy8gfTtcblxuLy8gLy/mn6XnnIvlnLDlnYBcbi8vIHN0cnVjdCBDTURfR1JfTG9va1VzZXJJUFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v6Lii5Ye655So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX0tpbGxVc2VyXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gfTtcblxuLy8gLy/npoHnlKjluJDmiLdcbi8vIHN0cnVjdCBDTURfR1JfTGltaXRBY2NvdW50c1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v5p2D6ZmQ6K6+572uXG4vLyBzdHJ1Y3QgQ01EX0dSX1NldFVzZXJSaWdodFxuLy8ge1xuLy8gICAgIC8v57uR5a6a5Y+Y6YePXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkFjY291bnRzUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+adg+mZkFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHYW1lUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fmnYPpmZBcbi8vICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRSb29tQ2hhdDsgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F6IGK5aSpXG4vLyAgICAgLy/mnYPpmZDlj5jljJZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRMb29rb25HYW1lOyAgICAgICAgICAgICAgICAgIC8v5peB6KeC5p2D6ZmQXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0R2FtZUNoYXQ7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+iBiuWkqVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdFNlbmRXaXNwZXI7ICAgICAgICAgICAgICAgICAgLy/lj5HpgIHmtojmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRQbGF5R2FtZTsgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5p2D6ZmQXG4vLyB9O1xuXG4vL+iuvue9ruagh+W/l1xuZ2FtZV9jbWQuT1NGX1JPT01fQ0hBVCA9IDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F6IGK5aSpXG5nYW1lX2NtZC5PU0ZfR0FNRV9DSEFUID0gMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ogYrlpKlcbmdhbWVfY21kLk9TRl9ST09NX1dJU1BFUiA9IDMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F56eB6IGKXG5nYW1lX2NtZC5PU0ZfRU5URVJfR0FNRSA9IDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+b5YWl5ri45oiPXG5nYW1lX2NtZC5PU0ZfRU5URVJfUk9PTSA9IDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+b5YWl5oi/6Ze0XG5nYW1lX2NtZC5PU0ZfU0hBTExfQ0xPU0UgPSA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WNs+WwhuWFs+mXrVxuXG4vLyAvL+aIv+mXtOiuvue9rlxuLy8gc3RydWN0IENNRF9HUl9PcHRpb25TZXJ2ZXJcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiT3B0aW9uRmxhZ3M7ICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5qCH5b+XXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk9wdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruagh+W/l1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v57O757uf5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TWVNURU0gPSA2NiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+S/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfTUVTU0FHRSA9IDIwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5raI5oGvXG5cbi8v5raI5oGv57G75Z6LXG5nYW1lX2NtZC5TTVRfSU5GTyA9IDB4MDAwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG5nYW1lX2NtZC5TTVRfRUpFQ1QgPSAweDAwMDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xuZ2FtZV9jbWQuU01UX0dMT0JBTCA9IDB4MDAwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWo5bGA5raI5oGvXG5nYW1lX2NtZC5TTVRfU0NPUkVfTk9URU5PVUdIID0gMHgwMDA4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ph5HluIHkuI3lpJ9cbmdhbWVfY21kLlNNVF9DTE9TRV9ST09NID0gMHgxMDAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63miL/pl7RcbmdhbWVfY21kLlNNVF9JTlRFUk1JVF9MSU5FID0gMHg0MDAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuK3mlq3ov57mjqVcblxuLy8gLy/mtojmga/mlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfR1JfTWVzc2FnZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd01lc3NhZ2VUeXBlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mtojmga/nsbvlnotcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNZXNzYWdlTGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv6ZW/5bqmXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNvbnRlbnRbMTAyNF07ICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+WGheWuuVxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5oi/6Ze05pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GTyA9IDc3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GTyA9IDEwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zyo57q/5L+h5oGvXG5cbi8vIC8v5Lq65pWw5L+h5oGvXG4vLyBzdHJ1Y3QgdGFnT25MaW5lQ291bnRJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3S2luZElEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+Wei+agh+ivhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdPbkxpbmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgLy/lnKjnur/kurrmlbBcbi8vIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lX2NtZDsiLCJ2YXIgcGxhemFfY21kID0ge307XG5cbi8v5bm/5Zy654mI5pysXG5wbGF6YV9jbWQuVkVSX1BMQVpBX0xPVyA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG5wbGF6YV9jbWQuVkVSX1BMQVpBX0hJR0ggPSAxNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gcGxhemFfY21kLlZFUl9QTEFaQV9GUkFNRSA9IE1BS0VMT05HOyhWRVJfUExBWkFfTE9XLFZFUl9QTEFaQV9ISUdIKVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXplJnor6/moIfor4ZcblxucGxhemFfY21kLkVSQ19HUF9MT0dPTl9TVUNDRVNTID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvpmYbmiJDlip9cbnBsYXphX2NtZC5FUkNfR1BfQUNDT1VOVFNfTk9UX0VYSVNUID0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fkuI3lrZjlnKhcbnBsYXphX2NtZC5FUkNfR1BfTE9OR19OVUxMSVRZID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npoHmraLnmbvlvZVcbnBsYXphX2NtZC5FUkNfR1BfUEFTU1dPUkRfRVJDT1IgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvhueggemUmeivr1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXlkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9MT0dPTiA9IDEzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy655m75b2VXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fQUNDT1VOVFMgPSAzMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+eZu+W9lVxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9VU0VSSUQgPSAzMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0kgRCDnmbvlvZVcbnBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfQUNDT1VOVFMgPSAzMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+azqOWGjOW4kOWPt1xucGxhemFfY21kLlNVQl9HUF9VUExPQURfQ1VTVE9NX0ZBQ0UgPSAzMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WumuS5ieWktOWDj1xucGxhemFfY21kLlNVQl9HUF9MT0dPTl9SRUNPUkQgPSAzMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WumuS5ieWktOWDj1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5wbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSA9IDE1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py65bm/5Zy655m75b2VXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFID0gMTUwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYZcbnBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfTU9CSUxFID0gMTUxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrms6jlhoxcblxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9TVUNDRVNTX01PQklMRSA9IDI2MDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmG5oiQ5YqfXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0VSUk9SX01PQklMRSA9IDI2MTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmG5aSx6LSlXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0ZJTklTSF9NT0JJTEUgPSAyNjI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuWujOaIkFxuXG4vLyAvL+W4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkJ5QWNjb3VudHNNb2JpbGVcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuV2VpWGluQXV0aElEOyAgICAgICAgICAgICAgICAgIC8v5b6u5L+h6aqM6K+BIC8v5YW85a655L2/55SoPjEwMDB35omr56CB55m76ZmGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBLaW5kOyAgICAgICAgICAgICAgICAvL+aJi+acukFQUOa4uOaIj0lEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAvL+aJi+acukFQUOeJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbi8vIH07XG4vLyAvL+azqOWGjOW4kOWPt1xuLy8gc3RydWN0IENNRF9HUF9SZWdpc3RlckFjY291bnRzTW9ibGllXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpLTlg4/moIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt+aAp+WIq1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZTsgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwS2luZDsgICAgICAgICAgICAgICAgLy8g5bm/5Zy65omL5py654mI5pysXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAvLyDlub/lnLrmiYvmnLrniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8vIOeZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy8g55m75b2V5a+G56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVwaG9uZVtNT0JJTEVQSE9ORV9MRU5dOyAvLyDmiYvmnLpcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8vIOaYteensFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlQXV0aFtOQU1FX0xFTl07ICAgICAgICAgLy/miYvmnLrpqozor4HnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsvL+acuuWZqOW6j+WIl+WPt1xuLy8gfTtcblxuLy8gLy/miYvmnLrnmbvpmYbmiJDlip9cbi8vIHN0cnVjdCBDTURfR1BfTG9nb25TdWNjZXNzTW9iaWxlXG4vLyB7XG4vLyAgICAgLy/mianlsZXkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1c3RvbUZhY2VWZXI7ICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNb29yTWFjaGluZTsgICAgICAgICAgICAgICAgICAvL+mUgeWumuacuuWZqFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQmluZFdlaVhpbjsgICAgICAgICAgICAgICAgICAgLy/nu5Hlrprlvq7kv6EgV1NMXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0VuY3J5cHRJRDsgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29kZUNoZWNrSUQ7ICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RXhwZXJpZW5jZTsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGxHYW1lU2NvcmU7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgLy/pk7booYzph5HluIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvL+aYteensFxuLy8gfTtcblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8gLy/luJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeUFjY291bnRzXG4vLyB7XG5cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlVzZXJQaG9uZVRhZztcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vIH07XG5cbi8vIC8vSSBEIOeZu+W9lVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkJ5VXNlcklEXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gfTtcblxuLy8gLy/ms6jlhozluJDlj7dcbi8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/moIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaXR5TnVtOyAgICAgICAgICAgICAgICAgICAgICAgLy/ln47luILnvJbnoIFcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkVuam95VHlwZTsgICAgICAgICAgICAgICAgICAgIC8v5Yqg5YWl57G75Z6LXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pTcHJlYWRlcltOQU1FX0xFTl07ICAgICAgICAgICAvL+aOqOW5v+S6uuWQjVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nlKjmiLfmmLXnp7Bcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelJlYWxOYW1lW05BTUVfTEVOXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeklkZW50aXR5W05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVuam95Q29kZVtQQVNTX0xFTl07ICAgICAgICAgIC8v5o6o6I2Q56CBb3LmlrDmiYvnoIFcbi8vIH07XG5cbi8vIC8v55m76ZmG5oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNZW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0V4cGVyaWVuY2U7ICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4gICAgXG4vLyAgICAgLy/mianlsZXkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1c3RvbUZhY2VWZXI7ICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNb29yTWFjaGluZTsgICAgICAgICAgICAgICAgICAvL+mUgeWumuacuuWZqFxuXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGb3J0dW5lQ29pbjsgICAgICAgICAgICAgICAgICAvL+emj+W4gVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R29sZDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuZDosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgIC8v5LmQ6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgICAvL+eBq+iFv1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlQ291cG9uOyAgICAgICAgICAgICAgICAgLy/ngavohb9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01hdGNoVGlja2V0OyAgICAgICAgICAgICAgICAgIC8v5Y+C6LWb5Yi4XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGaXJzdEJhbms7ICAgICAgICAgICAgICAgICAgICAvLyDpppbmrKHkvb/nlKhcblxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VXNlclBob25lSW5mb3JbMTZdOyAgICAgICAgICAgLy/nlKjmiLfmiYvmnLpcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLyAvL+eZu+mZhuWksei0pVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkVycm9yXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAvL+mUmeivr+S7o+eggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgLy/plJnor6/mtojmga9cbi8vIH07XG5cbi8vIHN0cnVjdCB0YWdBd2FyZEluZm9cbi8vIHtcbi8vICAgICBpbnQgICAgIG5Bd2FyZEdvbGRbN107XG4vLyB9O1xuXG4vLyB0eXBlZGVmIHN0cnVjdFxuLy8ge1xuLy8gICAgIHRhZ0F3YXJkSW5mbyBpbmZvO1xuLy8gICAgIEJZVEUgICAgICAgIElzQ2hlY2tlZDtcbi8vICAgICBpbnQgICAgICAgICBuTG9nb25UaW1lO1xuLy8gfUNNRF9HUF9Bd2FyZEluZm87XG4vLyAvL+agoemqjOeUqOaIt+S/oeaBr1xuLy8gc3RydWN0IENNRF9HUF9DaGVja1JlZ2lzdGVyXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEYXRhW05BTUVfTEVOXTsgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGbGFnOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8wOuajgOa1i+i0puWPtyAxOuajgOa1i+aYteensFxuLy8gfTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+a4uOaIj+WIl+ihqOWRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX1NFUlZFUl9MSVNUID0gMTc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajkv6Hmga9cblxucGxhemFfY21kLlNVQl9HUF9MSVNUX1RZUEUgPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+Wei+WIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0tJTkQgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+enjeexu+WIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX1NUQVRJT04gPSA1MDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ermeeCueWIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX1NFUlZFUiA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05YiX6KGoXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfRklOSVNIID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHlrozmiJBcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9DT05GSUcgPSA1MDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOmFjee9rlxuXG4vLyAvL+WIl+ihqOmFjee9rlxuLy8gc3RydWN0IENNRF9HUF9MaXN0Q29uZmlnXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlNob3dPbkxpbmVDb3VudDsgICAgICAgICAgICAgICAvL+aYvuekuuS6uuaVsFxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v57O757uf5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfU1lTVEVNID0gMTk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/lkb3ku6RcblxucGxhemFfY21kLlNVQl9HUF9WRVJTSU9OID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/niYjmnKzpgJrnn6VcbnBsYXphX2NtZC5TVUJfU1BfU1lTVEVNX01TRyA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5raI5oGvXG5cbi8vIC8v54mI5pys6YCa55+lXG4vLyBzdHJ1Y3QgQ01EX0dQX1ZlcnNpb25cbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTmV3VmVyc2lvbjsgICAgICAgICAgICAgICAgICAgIC8v5pu05paw54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkFsbG93Q29ubmVjdDsgICAgICAgICAgICAgICAgICAvL+WFgeiuuOi/nuaOpVxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxucGxhemFfY21kLk1ETV9HUF9VU0VSID0gMjI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cblxucGxhemFfY21kLlNVQl9HUF9VU0VSX1VQTE9BRF9GQUNFID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfVVNFUl9ET1dOTE9BRF9GQUNFID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIvovb3lpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfVVBMT0FEX0ZBQ0VfUkVTVUxUID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfREVMRVRFX0ZBQ0VfUkVTVUxUID0gNTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfQ1VTVE9NX0ZBQ0VfREVMRVRFID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfTU9ESUZZX0lORElWSURVQUwgPSA1MDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4quS6uui1hOaWmVxucGxhemFfY21kLlNVQl9HUF9NT0RJRllfSU5ESVZJRFVBTF9SRVNVTFQgPSA1MDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/ruaUuee7k+aenFxuXG5wbGF6YV9jbWQuU1VCX0dQX1NBRkVfQklORCA9IDUwNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a6257uR5a6aXG5wbGF6YV9jbWQuU1VCX0dQX1NBRkVfVU5CSU5EID0gNTA4OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/op6PpmaTnu5HlrppcbnBsYXphX2NtZC5TVUJfR1BfQ0hFQ0tfUFNEID0gNTA5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHpqozor4EgV1NMIDIwMTUuMy4yN1xuXG5cbnBsYXphX2NtZC5NRE1fR1BfUkVHID0gMjM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0lOSVRfUkVHSVNURVIgPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+azqOWGjOW4kOWPt1xucGxhemFfY21kLlNVQl9HUF9DQU5DRUxfUkVHSVNURVIgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WPlua2iOazqOWGjFxucGxhemFfY21kLlNVQl9HUF9SRUZVU0VfUkVHID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3og73ms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfQ0FOX1JFRyA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+v5Lul5rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9SRUdDT0RFID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5wbGF6YV9jbWQuU1VCX0dQX1JFVF9SRUdDT0RFID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5wbGF6YV9jbWQuU1VCX0dQX1JFVF9SRUdDT0RFX0VSUk9SID0gNTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5cbi8vIC8v5Liq5Lq66LWE5paZXG4vLyBzdHJ1Y3QgQ01EX0dQX01vZGlmeUluZGl2aWR1YWxcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgICAgICAvL+eOqeWutuaYteensFxuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrbmgKfliKtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5BZ2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625bm06b6EXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFkZHJlc3NbNjRdOyAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuWcsOWdgFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pVbmRlcldyaXRlWzMyXTsgICAgICAgICAgICAgICAgICAgLy/kuKrmgKfnrb7lkI1cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc3dvcmRbMzNdOyAgICAgICAgICAgICAgICAgICAgIC8v546p5a625a+G56CBXG4vLyB9O1xuXG4vLyAvL+WumuS5ieWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9VcGxvYWRDdXN0b21GYWNlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50U2l6ZTsgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lpKflsI9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGFzdFBhY2tldDsgICAgICAgICAgICAgICAgICAgIC8v5pyA5ZCO5qCH6K+GXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkZpcnN0UGFja2V0OyAgICAgICAgICAgICAgICAgICAvL+esrOS4gOS4quagh+ivhlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGYWNlRGF0YVsyMDQ4XTsgICAgICAgICAgICAgICAgLy/lpLTlg4/mlbDmja5cbi8vIH07XG5cbi8vIC8v5LiL6L295oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0Rvd25sb2FkRmFjZVN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VG9sdGFsU2l6ZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5oC75YWx5aSn5bCPXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1cnJlbnRTaXplOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWkp+Wwj1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGYWNlRGF0YVsyMDQ4XTsgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+S4i+i9veWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9Eb3dubG9hZEZhY2Vcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyB9O1xuXG4vLyAvL+S4iuS8oOe7k+aenFxuLy8gc3RydWN0IENNRF9HUF9VcGxvYWRGYWNlUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJPcGVyYXRlU3VjY2VzczsgICAgICAgICAgICAgICAgICAgIC8v5oiQ5Yqf5qCH6K+GXG4vLyB9O1xuXG4vLyAvL+WIoOmZpOe7k+aenFxuLy8gc3RydWN0IENNRF9HUF9EZWxldGVGYWNlUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJPcGVyYXRlU3VjY2VzczsgICAgICAgICAgICAgICAgICAgIC8v5oiQ5Yqf5qCH6K+GXG4vLyB9O1xuXG4vLyAvL+WIoOmZpOa2iOaBr1xuLy8gc3RydWN0IENNRF9HUF9DdXN0b21GYWNlRGVsZXRlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vIH07XG4vLyAvL+S/ruaUueWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9GYWNlQ2hhbmdlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7XG4vLyB9O1xuLy8gc3RydWN0IENNRF9HUF9GYWNlQ2hhbmdlUmVzdWx0XG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlJlc3VsdElEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnue7k+aenFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg49JRFxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9Vc2VySW5mb1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgICAgLy/kv53pmannrrHnpo/luIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlQ291cG9uOyAgICAgICAgICAgICAgICAgICAgIC8v5L+d6Zmp566x6LSd5aOzXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0NvdXBvbjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i0neWjs+aVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNYXRjaFRpY2tldDsgICAgICAgICAgICAgICAgICAgICAgLy/pl6jnpajmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Rm9ydHVuZUNvaW47ICAgICAgICAgICAgICAgICAgICAgIC8v56aP6LGG5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emj+W4geaVsFxuLy8gfTtcbi8vIC8v5L+u5pS557uT5p6cXG4vLyBzdHJ1Y3QgQ01EX0dQX01vZGlmeUluZGl2aWR1YWxSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGVzY3JpYmVNc2dbMTI4XTsgICAgICAgICAgICAgICAgIC8v5o+P6L+w5L+h5oGvXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9HZXRMb2dvbkF3YXJkXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt0lEXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuVGltZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WHoOetieWlluWKsVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ojrflvpflpZblirFcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfUmV0dXJuXG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQ29kZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnmNvZGVcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxWYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YC8XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlWzMyXTsgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnuaPj+i/sFxuLy8gfTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyDpk7booYzmk43kvZwo5byA5YiG5YaZLOWHj+WwkeWIpOaWreWtl+iKgilcbnBsYXphX2NtZC5NRE1fR1BfQkFOSyA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmTtuihjOS/oeaBr1xuXG4vLyDlrqLmiLfnq6/or7fmsYJcbnBsYXphX2NtZC5TVUJfR1BfQ0hBTkdFX1BBU1NXT1JEID0gMTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5L+u5pS55a+G56CBXG4vL3BsYXphX2NtZC5TVUJfR1BfTE9PS19TQVZFID0gMTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5p+l55yL6K6w5b2VXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfU1RPUkFHRSA9IDEwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOmHkeW4gVxucGxhemFfY21kLlNVQl9HUF9CQU5LX0dFVCA9IDEwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPlumHkeW4gVxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fU1RPUkFHRSA9IDEwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOWlluWIuFxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fR0VUID0gMTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5aWW5Yi4XG5cbi8vIOivt+axguW6lOetlFxucGxhemFfY21kLlNVQl9HUF9DSEFOR0VfUEFTU1dPUkRfUkVTID0gMTEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5L+u5pS55a+G56CBXG4vL3BsYXphX2NtZC5TVUJfR1BfTE9PS19TQVZFX1JFUyA9IDExMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOafpeeci+iusOW9lVxucGxhemFfY21kLlNVQl9HUF9CQU5LX1NUT1JBR0VfUkVTID0gMTEyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo6YeR5biBXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfR0VUX1JFUyA9IDExMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPlumHkeW4gVxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fU1RPUkFHRV9SRVMgPSAxMTQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjlpZbliLhcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX0dFVF9SRVMgPSAxMTU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5blpZbliLhcblxuXG4vLyAvLyDkv67mlLnlr4bnoIFcbi8vIHN0cnVjdCBDTURfR1BfQ2hhbmdlUGFzc1dvcmRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt0lEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCa1Bhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOaWsOeahOWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEJrUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5Y6f5aeL5a+G56CBXG4vLyB9O1xuXG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5a2Y5YWl5a2Y5YKo57uT5p6EXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt0lEXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgLy8g5pON5L2c5pWw6YePXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vIH1DTURfR1BfQmFua1N0b3JhZ2UsIENNRF9HUF9Db3Vwb25TdG9yYWdlO1xuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWPluWHuuWtmOWCqOe7k+aehFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgLy8g5pON5L2c5pWw6YePXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5rUGFzc3dvcmRbUEFTU19MRU5dOyAgICAgICAgIC8vIOeUqOaIt+WvhueggVxuLy8gfUNNRF9HUF9CYW5rR2V0LCBDTURfR1BfQ291cG9uR2V0O1xuXG5cbi8vIC8vIOS/ruaUueWvhueggeW6lOetlFxuLy8gc3RydWN0IENNRF9HUF9DaGFuZ2VQYXNzV29yZFJlc1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgLy8gMOS4uuaIkOWKnyjkv67mlLlpc0ZpcnN0KVxuLy8gfTtcblxuLy8gLy8g6YeR5biBLOWlluWIuCzlrZjlgqjlupTnrZRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgLy8g6ZSZ6K+v56CBLDDkuLrmiJDlip9cbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOi6q+S4iumSsVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmtWYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy8g5L+d6Zmp566x6ZKxXG4vLyB9Q01EX0dQX0JhbmtTdG9yYWdlUmVzLCBDTURfR1BfQmFua0dldFJlcywgQ01EX0dQX0NvdXBvblN0b3JhZ2VSZXMsIENNRF9HUF9Db3Vwb25HZXRSZXM7XG5cbnBsYXphX2NtZC5NRE1fR1BfTkVXID0gNjtcblxucGxhemFfY21kLlNVQl9HUF9HRVRfTkVXUyA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635Y+W5YWs5ZGKXG5wbGF6YV9jbWQuU1VCX0dQX0ZJTkRfRlJJRUROID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6Llpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfR0VUX0ZSSUVORCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635Y+W5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0FERF9GUklFTkQgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WinuWKoOWlveWPi1xucGxhemFfY21kLlNVQl9HUF9ERUxFVEVfRlJJRU5EID0gNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTlpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfRlJJRU5EX0VSUk9SID0gNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfU0VORF9NT05FWSA9IDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCBXG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfUkVDT1JEID0gODtcbnBsYXphX2NtZC5TVUJfR1BfU0VORF9SRVNVTFQgPSA5O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0dldE5ld3Ncbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5ld3NbMjU2XTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRnJpZW5kX1JlbGF0aXZlIFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICBkd1VzZXJJRDtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdGcmllbmRJRDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRnJpZW5kRXJyb3Jcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICBzekRlc2NyaWJlWzEyOF07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0RlbGV0ZUZyaWVuZFJlc3VsdFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICBkd0RlbGV0ZUlEO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GaW5kVXNlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgIGR3VXNlcklEO1xuLy8gICAgIFdPUkQgICAgICAgIHdGYWNlSUQ7XG4vLyAgICAgY2hhciAgICAgICAgc3pOaWNrTmFtZVszMl07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZExpc3Rcbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgIG5Db3VudDsgICAgICAgICAgICAgLy/kuKrmlbBcbi8vICAgICBDTURfR1BfRmluZFVzZXIgICAgIEZ1c2VyWzEwXTsgIC8v5pyA5aSaXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1NlbmRNb25leVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgIGR3VXNlcklEO1xuLy8gICAgIERXT1JEICAgICAgIGR3RnJpZW5kSUQ7XG4vLyAgICAgTE9OR0xPTkcgICAgbFNjb3JlO1xuLy8gfTtcblxuLy8gc3RydWN0IHRhZ1RyYW5SZWNvcmRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6U2VuZE5hbWVbMzJdO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pBY2NlcHROYW1lWzMyXTtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgIGxUcmFuR29sZDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVHJhblJlY29yZFxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgbkNvdW50O1xuLy8gICAgIHRhZ1RyYW5SZWNvcmQgICAgICAgUmVjb3JkWzIwXTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfU2VuZFJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pTZW5kTmFtZVszMl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzekFjY2VwdE5hbWVbMzJdO1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgbFNjb3JlO1xuLy8gfTtcbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIC8v6Laj6K+t57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dGX1VzZXJGdW5cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5Y+3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd01haW5JbmRleDsgICAgICAgICAgICAgICAgICAgICAvL+i2o+ivreadoeebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdWJJbmRleDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR0ZfTGV2ZWxJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICB3Q2hhaXJJRDtcbi8vICAgICBMT05HICAgIGxHYW1lTGV2ZWw7XG4vLyAgICAgTE9ORyAgICBBd2FyZFR5cGU7XG4vLyAgICAgTE9ORyAgICBBd2FyZFZhbHVlO1xuLy8gICAgIExPTkcgICAgbEV4cGVyaWVuY2U7XG4vLyAgICAgTE9OR0xPTkcgICAgbExldmVsVXBWYWx1ZTtcbi8vIH07XG5cbi8vIC8v6K+35rGC5Lu75YqhXG4vLyBzdHJ1Y3QgQ01EX0dGX01pc3Npb25SZXF1ZXN0XG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWlzc2lvblR5cGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL+a2iOaBr+exu+Wei1xucGxhemFfY21kLlNNVF9JTkZPID0gMHgwMDAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/mtojmga9cbnBsYXphX2NtZC5TTVRfRUpFQ1QgPSAweDAwMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xucGxhemFfY21kLlNNVF9HTE9CQUwgPSAweDAwMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xucGxhemFfY21kLlNNVF9DTE9TRV9HQU1FID0gMHgxMDAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63muLjmiI9cblxubW9kdWxlLmV4cG9ydHMgPSBwbGF6YV9jbWQ7IiwidmFyIHpqaF9jbWQgPSB7fTtcblxuXG56amhfY21kLktJTkRfSUQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG56amhfY21kLlNFUlZFUl9JRCA9IDMwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acjeWKoeWZqCBJIERcbnpqaF9jbWQuR0FNRV9QTEFZRVIgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/kurrmlbBcbnpqaF9jbWQuR0FNRV9OQU1FID0gXCLor4jph5HoirFcIjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5ZCN5a2XXG4vLyB6amhfY21kLkdBTUVfR0VOUkUgICAgICAgICAgICAgICAgICAgICAgKEdBTUVfR0VOUkVfR09MRHxHQU1FX0dFTlJFX01BVENIKSAgLy/muLjmiI/nsbvlnotcbnpqaF9jbWQuTUFYX0NPVU5UID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omR5YWL5pWw55uuXG5cblxuempoX2NtZC5TRVJWRVJBRERSRVNTID0gXCIxMjcuMC4wLjFcIjtcbnpqaF9jbWQuU0VSVkVSX1BPUlQgPSAxNjgwO1xuXG4vL+e7k+adn+WOn+WboFxuempoX2NtZC5HRVJfTk9fUExBWUVSID0gMHgxMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rKh5pyJ546p5a62XG56amhfY21kLkdFUl9DT01QQVJFQ0FSRCA9IDB4MjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOe7k+adn1xuempoX2NtZC5HRVJfT1BFTkNBUkQgPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYznu5PmnZ9cblxuLy/muLjmiI/nirbmgIFcbnpqaF9jbWQuR1NfVEtfRlJFRSA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXlvIDlp4tcbnpqaF9jbWQuR1NfVEtfUExBWUlORyA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+i/m+ihjFxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/mnI3liqHlmajlkb3ku6Tnu5PmnoRcblxuempoX2NtZC5TVUJfU19HQU1FX1NUQVJUID0gMTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5byA5aeLXG56amhfY21kLlNVQl9TX0FERF9TQ09SRSA9IDEwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOe7k+aenFxuempoX2NtZC5TVUJfU19HSVZFX1VQID0gMTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pS+5byD6Lef5rOoXG56amhfY21kLlNVQl9TX0NPTVBBUkVfQ0FSRCA9IDEwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOi3n+azqFxuempoX2NtZC5TVUJfU19MT09LX0NBUkQgPSAxMDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYzot5/ms6hcbnpqaF9jbWQuU1VCX1NfU0VORF9DQVJEID0gMTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R54mM5raI5oGvXG56amhfY21kLlNVQl9TX0dBTUVfRU5EID0gMTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57uT5p2fXG56amhfY21kLlNVQl9TX1BMQVlFUl9FWElUID0gMTA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35by66YCAXG56amhfY21kLlNVQl9TX09QRU5fQ0FSRCA9IDEwODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOa2iOaBr1xuempoX2NtZC5TVUJfU19XQUlUX0NPTVBBUkUgPSAxMDk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXmr5TniYxcbnpqaF9jbWQuU1VCX1NfTEFTVF9BREQgPSAxMTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcbi8vIC8v5ri45oiP54q25oCBXG4vLyBzdHJ1Y3QgQ01EX1NfU3RhdHVzRnJlZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z+656GA56ev5YiGXG4vLyB9O1xuXG4vLyAvL+a4uOaIj+eKtuaAgVxuLy8gc3RydWN0IENNRF9TX1N0YXR1c1BsYXlcbi8vIHtcbi8vICAgICAvL+WKoOazqOS/oeaBr1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiK6ZmQXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljZXlhYPkuIvms6hcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxVc2VyTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWw5LiK6ZmQXG4gICAgXG4vLyAgICAgLy/nirbmgIHkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QmFua2VyVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+W6hOWutueUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN546p5a62XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQbGF5U3RhdHVzW0dBTUVfUExBWUVSXTsgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTWluZ1podVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAgICAvL+eci+eJjOeKtuaAgVxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxUYWJsZVNjb3JlW0dBTUVfUExBWUVSXTsgICAgICAgICAgIC8v5LiL5rOo5pWw55uuXG4gICAgXG4vLyAgICAgLy/miZHlhYvkv6Hmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkhhbmRDYXJkRGF0YVtNQVhfQ09VTlRdOyAgICAgICAgICAvL+aJkeWFi+aVsOaNrlxuICAgIFxuLy8gICAgIC8v54q25oCB5L+h5oGvXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkNvbXBhcmVTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gfTtcblxuLy8gLy/muLjmiI/lvIDlp4tcbi8vIHN0cnVjdCBDTURfU19HYW1lU3RhcnRcbi8vIHtcbi8vICAgICAvL+S4i+azqOS/oeaBr1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA5aSn5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljZXlhYPkuIvms6hcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxVc2VyTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5YiG5pWw5LiK6ZmQXG4gICAgXG4vLyAgICAgLy/nlKjmiLfkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QmFua2VyVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+W6hOWutueUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN546p5a62XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQbGF5U3RhdHVzW0dBTUVfUExBWUVSXTsgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vIH07XG5cbi8vIC8v55So5oi35LiL5rOoXG4vLyBzdHJ1Y3QgQ01EX1NfQWRkU2NvcmVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdBZGRTY29yZVVzZXI7ICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQWRkU2NvcmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOaVsOebrlxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VGltZXM7ICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5YCN5pWwXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxhc3RBZGRTY29yZTsgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuWtpOazqOS4gOaOt1xuLy8gfTtcblxuLy8gLy/nlKjmiLfmlL7lvINcbi8vIHN0cnVjdCBDTURfU19HaXZlVXBcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3R2l2ZVVwVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+eUqOaIt1xuLy8gfTtcblxuLy8gLy/mr5TniYzmlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfU19Db21wYXJlQ2FyZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyWzJdOyAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9zdFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i+k+eJjOeUqOaIt1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMb3N0Q2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/ovpPlrrbniYzmlbDmja5cbi8vIH07XG5cbi8vIC8v55yL54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfTG9va0NhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9va0NhcmRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAvL+eci+eJjOeUqOaIt1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQ2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgICAgIC8v55So5oi35omR5YWLXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcbi8vIH07XG5cbi8vIC8v5byA54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfT3BlbkNhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3V2lubmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeeUqOaIt1xuLy8gfTtcblxuLy8gLy/lraTms6jkuIDmjrdcbi8vIHN0cnVjdCBDTURfU19MYXN0QWRkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXJ0TGFzdEFkZFVzZXI7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyW0dBTUVfUExBWUVSXTtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9zdFVzZXJbR0FNRV9QTEFZRVJdO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47XG4vLyB9O1xuXG5cbi8vIC8v5ri45oiP57uT5p2fXG4vLyBzdHJ1Y3QgQ01EX1NfR2FtZUVuZFxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lVGF4OyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP56iO5pS2XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVTY29yZVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAgLy/muLjmiI/lvpfliIZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkNhcmREYXRhW0dBTUVfUExBWUVSXVtNQVhfQ09VTlRdOyAvL+eUqOaIt+aJkeWFi1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl1bNF07ICAgICAgIC8v5q+U54mM55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0VuZFN0YXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nu5PmnZ/nirbmgIFcbi8vIH07XG5cbi8vIC8v55So5oi36YCA5Ye6XG4vLyBzdHJ1Y3QgQ01EX1NfUGxheWVyRXhpdFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdQbGF5ZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YCA5Ye655So5oi3XG4vLyB9O1xuXG4vLyAvL+etieW+heavlOeJjFxuLy8gc3RydWN0IENNRF9TX1dhaXRDb21wYXJlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8v5a6i5oi356uv5ZG95Luk57uT5p6EXG56amhfY21kLk1ZX1ZJRVdJRCA9IDI7Ly8zO1xuXG56amhfY21kLlNVQl9DX0FERF9TQ09SRSA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WKoOazqFxuempoX2NtZC5TVUJfQ19HSVZFX1VQID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pS+5byD5raI5oGvXG56amhfY21kLlNVQl9DX0NPTVBBUkVfQ0FSRCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19MT09LX0NBUkQgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfT1BFTl9DQVJEID0gNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM5raI5oGvXG56amhfY21kLlNVQl9DX1dBSVRfQ09NUEFSRSA9IDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etieW+heavlOeJjFxuempoX2NtZC5TVUJfQ19GSU5JU0hfRkxBU0ggPSA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrozmiJDliqjnlLtcbnpqaF9jbWQuU1VCX0NfTEFTVF9BREQgPSA4OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcblxuLy8gLy/nlKjmiLfliqDms6hcbi8vIHN0cnVjdCBDTURfQ19BZGRTY29yZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nirbmgIFcbi8vIH07XG5cbi8vIC8v5q+U54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX0NfQ29tcGFyZUNhcmRcbi8vIHsgICBcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8qKioqKioqKioqKioqKioq5a6a5pe25Zmo5qCH6K+GKioqKioqKioqKioqKioqKioqLS1cbi8v5byA5aeL5a6a5pe25ZmoXG56amhfY21kLklESV9TVEFSVF9HQU1FICAgXHRcdFx0PSAyMDBcbi8vIOWKoOazqOWumuaXtuWZqFxuempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkVcdFx0XHQ9IDIwMVxuLy8g6YCJ5q+U54mM55So5oi35a6a5pe25ZmoXG56amhfY21kLklESV9VU0VSX0NPTVBBUkVfQ0FSRFx0XHQ9IDIwMlxuLy8g6L+H5ruk5a6a5pe25ZmoXG56amhfY21kLklESV9ESVNBQkxFXHRcdFx0XHRcdD0gMjAzXG4vLyAqKioqKioqKioqKioqKioqKuaXtumXtOagh+ivhioqKioqKioqKioqKioqKioqLS1cbi8vIOW8gOWni+WumuaXtuWZqFxuempoX2NtZC5USU1FX1NUQVJUX0dBTUVcdFx0XHRcdD0gMTBcbi8vIOWKoOazqOWumuaXtuWZqFxuempoX2NtZC5USU1FX1VTRVJfQUREX1NDT1JFXHRcdFx0PSAxMFxuLy8g5q+U54mM5a6a5pe25ZmoXG56amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkRcdFx0PSAxMFxuXG5tb2R1bGUuZXhwb3J0cyA9IHpqaF9jbWQ7IiwidmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBjYXJkU3ByaXRlOiBjYy5TcHJpdGUsXG4gICAgICAgIG1fY2JDYXJkRGF0YTogMCxcbiAgICAgICAgY2FyZEF0bGFzOiBjYy5TcHJpdGVBdGxhcyxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChjYkNhcmREYXRhKSB7XG4gICAgICAgIHRoaXMubV9jYkNhcmREYXRhID0gY2JDYXJkRGF0YTtcbiAgICB9LFxuICAgIHNldENhcmREYXRhOiBmdW5jdGlvbiAoY2JDYXJkRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDYXJkSXRlbV1bc2V0Q2FyZERhdGFdIGNiQ2FyZERhdGEgPSBcIiArIGNiQ2FyZERhdGEpO1xuICAgICAgICB0aGlzLm1fY2JDYXJkRGF0YSA9IGNiQ2FyZERhdGE7XG4gICAgfSxcbiAgICBzaG93Q2FyZEJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2FyZEl0ZW1dW3Nob3dDYXJkQmFja11cIik7XG4gICAgICAgIHRoaXMuY2FyZFNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuY2FyZEF0bGFzLmdldFNwcml0ZUZyYW1lKFwiY2FyZF9iYWNrXCIpO1xuICAgIH0sXG4gICAgc2hvd0NhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2FyZEl0ZW1dW3Nob3dDYXJkXSBjYXJkRGF0YSA9IFwiICsgdGhpcy5tX2NiQ2FyZERhdGEpO1xuICAgICAgICB0aGlzLmNhcmRTcHJpdGUuc3ByaXRlRnJhbWUgPSB0aGlzLmNhcmRBdGxhcy5nZXRTcHJpdGVGcmFtZShcImJpZ19jYXJkX1wiICsgR2xvYmFsRnVuLlByZWZpeEludGVnZXIodGhpcy5tX2NiQ2FyZERhdGEsMikpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9wcm9kdWN0TmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfcHJvZHVjdFByaWNlOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9wYXlQcmljZTogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgaWYodGhpcy5fcGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcHJvZHVjdE5hbWUuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wiZ29vZHNfbmFtZVwiXTtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9wcm9kdWN0UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcGF5UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW2luaXRdIFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5fcGFyYW1zLCBudWxsLCAnICcpKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gR2xvYmFsVXNlckRhdGEud0ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICAvLyB0aGlzLl9mYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgLy8gdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBKU09OLnN0cmluZ2lmeShwYXJhbXMuZGV0YWlsKSk7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlXCIscGFyYW1zLmRldGFpbCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdmFyIEZhY2VJRCA9IHRoaXMuX2ZhY2VJRDtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvU2hvcFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV0gQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgQmFzZUZyYW1lID0gcmVxdWlyZShcIkJhc2VGcmFtZVwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG52YXIgZ2FtZV9jbWQgPSByZXF1aXJlKFwiQ01EX0dhbWVcIik7XG52YXIgcGxhemFfY21kID0gcmVxdWlyZShcIkNNRF9QbGF6YVwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHYW1lU2VydmVySXRlbSA9IHJlcXVpcmUoXCJHYW1lU2VydmVySXRlbVwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2FtZVVzZXJJdGVtID0gcmVxdWlyZShcIkdhbWVVc2VySXRlbVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fd1RhYmxlQ291bnQgPSAwO1xuXHQgICAgdGhpcy5fd0NoYWlyQ291bnQgPSAwO1xuXHQgICAgdGhpcy5fd1NlcnZlclR5cGUgPSAwO1xuXHQgICAgdGhpcy5fZHdTZXJ2ZXJSdWxlID0gMDtcbiAgICAgICAgdGhpcy5fY2JHYW1lU3RhdHVzIFx0PSAwO1xuICAgICAgICB0aGlzLl9jYkFsbG93TG9va29uID0gMDtcbiAgICAgICAgdGhpcy5fY2JIaWRlVXNlckluZm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdXNlckxpc3QgPSB7fTsgIFxuICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0ID0ge307XG4gICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzID0ge307XG4gICAgICAgIHRoaXMuX3dUYWJsZUlEID0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEU7XG4gICAgICAgIHRoaXMuX3dDaGFpcklEID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgfSxcbiAgICBvbkxvZ29uUm9vbTogZnVuY3Rpb24gKHJvb21JbmZvKSB7XG4gICAgICAgIHRoaXMuX3Jvb21JbmZvID0gcm9vbUluZm87XG4gICAgICAgIGlmICghdGhpcy5fcm9vbUluZm8pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dIOiOt+WPluaIv+mXtOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uTG9nb25Sb29tXSDnmbvlvZXmiL/pl7Q6IFwiICsgR2xvYmFsRnVuLm51bWJlclRvSXAodGhpcy5fcm9vbUluZm8uZHdTZXJ2ZXJBZGRyKSArIFwiIyBcIiArIHRoaXMuX3Jvb21JbmZvLndTZXJ2ZXJQb3J0KTtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChHbG9iYWxGdW4ubnVtYmVyVG9JcCh0aGlzLl9yb29tSW5mby5kd1NlcnZlckFkZHIpLHRoaXMuX3Jvb21JbmZvLndTZXJ2ZXJQb3J0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbmRMb2dvblBhY2tldCgpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvblNvY2tldEV2ZW50XSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICBpZiAoIXRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2sgPSB7XG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9MT0dPTl0gOiB0aGlzLk9uU29ja2V0TWFpbkxvZ29uLC8v55m75b2V5raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9VU0VSXSA6IHRoaXMuT25Tb2NrZXRNYWluVXNlciwvL+eUqOaIt+a2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfSU5GT10gOiB0aGlzLk9uU29ja2V0TWFpbkluZm8sLy/phY3nva7mtojmga9cbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX1NUQVRVU10gOiB0aGlzLk9uU29ja2V0TWFpblN0YXR1cywvL+eKtuaAgea2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1lTVEVNXSA6IHRoaXMuT25Tb2NrZXRNYWluU3lzdGVtLC8v57O757uf5raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GT10gOiB0aGlzLk9uU29ja2V0TWFpblNlcnZlckluZm8sLy/miL/pl7Tmtojmga9cbiAgICAgICAgICAgICAgICBbR2xvYmFsRGVmLk1ETV9HRl9HQU1FXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7Ly/muLjmiI/mtojmga9cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjpzdWIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwRGF0YTpwRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX0ZSQU1FXSA6IHRoaXMuT25Tb2NrZXRNYWluR2FtZUZyYW1lLC8v5qGG5p625raI5oGvXG4gICAgICAgICAgICAgICAgW0dsb2JhbERlZi5NRE1fR0ZfUFJFU0VOVF0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrICYmIHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2tbbWFpbl0pIHtcbiAgICAgICAgICAgIHZhciBmdW4gPSB0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrW21haW5dO1xuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uU29ja2V0RXZlbnRdIG1haW4gPSBcIisgbWFpbiArIFwic3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluTG9nb246IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXVwiKTtcbiAgICAgICAgaWYgKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1NVQ0NFU1Mpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Mb2dvbl0gbG9nb24gc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0ID0ge307XG4gICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5lbWl0KFwiTG9nb25TdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0VSUk9SKSB7XG4gICAgICAgICAgICAvL+eZu+W9leWksei0pVxuICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Mb2dvbkVycm9yXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0bEVycm9yQ29kZTtcdFx0XHRcdFx0XHRcdC8v6ZSZ6K+v5Luj56CBXG4gICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6RXJyb3JEZXNjcmliZVsxMjhdO1x0XHRcdFx0Ly/plJnor6/mtojmga9cbiAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICB2YXIgbG9nb25FcnJvciA9IHt9O1xuICAgICAgICAgICAgbG9nb25FcnJvci5sRXJyb3JDb2RlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICAgICAgbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUgPSBwRGF0YS5yZWFkc3RyaW5nKDEyOCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBlcnJvckNvZGUgPSBcIiArIGxvZ29uRXJyb3IubEVycm9yQ29kZSArIFwiIGRlcyA9IFwiICsgbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUpO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRklOSVNIKXtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkdhbWVTY2VuZVwiKTtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRMb2dvbkZpbmlzaCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Mb2dvbl0gTG9nb24gRmluaXNoXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+eZu+W9leWujOaIkFxuICAgIG9uU29ja2V0TG9nb25GaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvblNvY2tldExvZ29uRmluaXNoXVwiKTtcbiAgICAgICAgdmFyIG15VXNlckl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgaWYgKCFteVVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uU29ja2V0TG9nb25GaW5pc2hdIOiOt+WPluiHquW3seeahOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fd1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FbnRlclRhYmxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kR2FtZU9wdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJSb29tXCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kU2l0RG93blBhY2tldChHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSwgR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5Vc2VyOiBmdW5jdGlvbihzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Vc2VyXVwiKTtcbiAgICAgICAgaWYgKCF0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrID0ge1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9DT01FXTogdGhpcy5PblNvY2tldFN1YlVzZXJDb21lLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFUVVNdOiB0aGlzLk9uU29ja2V0U3ViU3RhdHVzLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9TQ09SRV06IHRoaXMuT25Tb2NrZXRTdWJTY29yZSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUklHSFRdOiB0aGlzLk9uU29ja2V0U3ViUmlnaHQsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVJdOiB0aGlzLk9uU29ja2V0U3ViTWVtYmVyT3JkZXIsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9TSVRfRkFJTEVEXTogdGhpcy5PblNvY2tldFN1YlNpdEZhaWxlZCxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ0hBVF06IHRoaXMuT25Tb2NrZXRTdWJDaGF0LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9XSVNQRVJdOiB0aGlzLk9uU29ja2V0U3ViV2lzcGVyLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9JTlZJVEVdOiB0aGlzLk9uU29ja2V0U3ViVXNlckludml0ZSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTERdOiB0aGlzLk9uU29ja2V0U3ViUXVlcnlHb2xkLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWV06IHRoaXMuT25Tb2NrZXRTdWJQcmVzZW50UXVlcnksXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9QUkVTRU5UX0VSUk9SXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfUFJFU0VOVF9FUlJPUlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5PblNvY2tldFN1YlVzZXJDb21lKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc29ja2V0TWFpblVzZXJDYWxsYmFjayAmJiB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrW3N1Yl0pIHtcbiAgICAgICAgICAgIHZhciBmdW4gPSB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrW3N1Yl07XG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdIHN1YiA9IFwiICsgc3ViICsgXCIgbm90IGZpbmRcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5JbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TRVJWRVJfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfU2VydmVySW5mb1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/miL/pl7TlsZ7mgKdcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlyQ291bnQ7XHRcdFx0XHRcdFx0Ly/mpIXlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0dhbWVHZW5yZTtcdFx0XHRcdFx0XHRcdC8v5ri45oiP57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUNvdW50O1x0XHRcdFx0XHRcdC8v5qGM5a2Q5pWw55uuXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdLaW5kSUQ7XHRcdFx0XHRcdFx0XHQvL+exu+WeiyBJIERcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VmlkZW9BZGRyO1x0XHRcdFx0XHRcdC8v6KeG6aKR5Zyw5Z2AXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiSGlkZVVzZXJJbmZvO1x0XHRcdFx0XHRcdC8v6ZqQ6JeP5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgc2VydmVySW5mbyA9IHt9O1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0NoYWlyQ291bnQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0dhbWVHZW5yZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53VGFibGVDb3VudCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLmR3VmlkZW9BZGRyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby5jYkhpZGVVc2VySW5mbyA9IHBEYXRhLnJlYWRieXRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93Q2hhaXJDb3VudCA9IHNlcnZlckluZm8ud0NoYWlyQ291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fd1RhYmxlQ291bnQgPSBzZXJ2ZXJJbmZvLndUYWJsZUNvdW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiSGlkZVVzZXJJbmZvID0gc2VydmVySW5mby5jYkhpZGVVc2VySW5mbztcbiAgICAgICAgICAgICAgICB0aGlzLl93R2FtZUdlbnJlID0gc2VydmVySW5mby53R2FtZUdlbnJlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dLaW5kSUQgPSBzZXJ2ZXJJbmZvLndLaW5kSUQ7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX0NPTFVNTl9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9DT05GSUdfRklOSVNIXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU3RhdHVzXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1RBQkxFX0lORk9cIik7XG4gICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIHmlbDnu4RcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlSW5mb1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlQ291bnQ7XHRcdFx0XHRcdFx0Ly/moYzlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgdGFnVGFibGVTdGF0dXNcdFx0XHRcdFx0VGFibGVTdGF0dXNbNTEyXTtcdFx0XHRcdFx0Ly/nirbmgIHmlbDnu4RcbiAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIHnu5PmnoRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdUYWJsZVN0YXR1c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGJQbGF5U3RhdHVzO1x0XHRcdFx0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlRhYmxlTG9jaztcdFx0XHRcdFx0XHRcdC8v6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgdmFyIHdUYWJsZUNvdW50ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgd1RhYmxlQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW2luZGV4XS5iUGxheVN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW2luZGV4XS5iVGFibGVMb2NrID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9TVEFUVVM6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVEFCTEVfU1RBVFVTXCIpO1xuICAgICAgICAgICAgICAgIC8v5qGM5a2Q54q25oCB5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9UYWJsZVN0YXR1c1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlRhYmxlTG9jaztcdFx0XHRcdFx0XHRcdC8v6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGJQbGF5U3RhdHVzO1x0XHRcdFx0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZVN0YXR1cyA9IHt9O1xuICAgICAgICAgICAgICAgIHRhYmxlU3RhdHVzLmJUYWJsZUxvY2sgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRhYmxlU3RhdHVzLmJQbGF5U3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICB0YWJsZVN0YXR1cy53VGFibGVJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZVN0YXR1c1t0YWJsZVN0YXR1cy53VGFibGVJRF0uYlBsYXlTdGF0dXMgPSB0YWJsZVN0YXR1cy5iUGxheVN0YXR1cztcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZVN0YXR1c1t0YWJsZVN0YXR1cy53VGFibGVJRF0uYlRhYmxlTG9jayA9IHRhYmxlU3RhdHVzLmJUYWJsZUxvY2s7XG5cbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwidXBEYXRlVGFibGVTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOnRhYmxlU3RhdHVzLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/ns7vnu5/mtojmga9cbiAgICBPblNvY2tldE1haW5TeXN0ZW06IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0U6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVTU0FHRVwiKTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+aVsOaNruWMhVxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTWVzc2FnZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VUeXBlO1x0XHRcdFx0XHRcdC8v5raI5oGv57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdNZXNzYWdlTGVuZ3RoO1x0XHRcdFx0XHRcdC8v5raI5oGv6ZW/5bqmXG4gICAgICAgICAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzekNvbnRlbnRbMTAyNF07XHRcdFx0XHRcdC8v5raI5oGv5YaF5a65XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+WkhOeQhlxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge307XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZVR5cGUgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGggPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3pDb250ZW50ID0gcERhdGEucmVhZHN0cmluZyhtZXNzYWdlLndNZXNzYWdlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvL+WFs+mXrei/nuaOpVxuICAgICAgICAgICAgICAgIHZhciBiSW50ZXJtZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBnYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSkge1xuICAgICAgICAgICAgICAgICAgICBiSW50ZXJtZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtZXNzYWdlLndNZXNzYWdlVHlwZSAmIGdhbWVfY21kLlNNVF9DTE9TRV9ST09NKSB7XG4gICAgICAgICAgICAgICAgICAgIGJJbnRlcm1ldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiSW50ZXJtZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dIFwiICsgbWVzc2FnZS5zekNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+aIv+mXtOa2iOaBr1xuICAgIE9uU29ja2V0TWFpblNlcnZlckluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TZXJ2ZXJJbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkdhbWVGcmFtZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkdhbWVGcmFtZV1cIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX09QVElPTjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9PUFRJT05cIik7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/phY3nva5cbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dGX09wdGlvblxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiR2FtZVN0YXR1cztcdFx0XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiQWxsb3dMb29rb247XHRcdFx0XHRcdC8v5YWB6K645peB6KeCXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiQWxsb3dMb29rb24gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1VTRVJfQ0hBVDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9VU0VSX0NIQVRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfTUVTU0FHRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9NRVNTQUdFXCIpO1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9NZXNzYWdlXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3TWVzc2FnZVR5cGU7XHRcdFx0XHRcdFx0Ly/mtojmga/nsbvlnotcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VMZW5ndGg7XHRcdFx0XHRcdFx0Ly/mtojmga/plb/luqZcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6Q29udGVudFsxMDI0XTtcdFx0XHRcdFx0Ly/mtojmga/lhoXlrrlcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5aSE55CGXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7fTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLndNZXNzYWdlVHlwZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZUxlbmd0aCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS5zekNvbnRlbnQgPSBwRGF0YS5yZWFkc3RyaW5nKG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9DTE9TRV9HQU1FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBHbG9iYWxEZWYuU01UX0VKRUNUKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCArIFwiIHR5cGUgPSBcIiArIG1lc3NhZ2Uud01lc3NhZ2VUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9HTE9CQUwpe1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1NDRU5FOlxuICAgICAgICAgICAgICAgIC8v5ri45oiP5Zy65pmvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR0ZfU0NFTkVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lU2NlbmVcIix7XG4gICAgICAgICAgICAgICAgICAgIGNiR2FtZVN0YXR1czp0aGlzLl9jYkdhbWVTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+eUqOaIt+i/m+WFpVxuICAgIE9uU29ja2V0U3ViVXNlckNvbWU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICB2YXIgdXNlckl0ZW0gPSBuZXcgR2FtZVVzZXJJdGVtKCk7XG4gICAgICAgIHVzZXJJdGVtLmluaXREYXRhQnlVc2VySW5mb0hlYWQocERhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckNvbWVdIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlckl0ZW0sIG51bGwsICcgJykpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXTtcbiAgICAgICAgLy8gaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXSA9IHVzZXJJdGVtO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8v6K6w5b2V6Ieq5bex55qE5qGM5Y+3XG4gICAgICAgIGlmICh1c2VySXRlbS5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dUYWJsZUlEID0gdXNlckl0ZW0ud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJJdGVtLndDaGFpcklEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VySXRlbS53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgJiYgdXNlckl0ZW0ud0NoYWlySUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRlVGFibGVVc2VyKHVzZXJJdGVtLndUYWJsZUlELHVzZXJJdGVtLndDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlckVudGVyXCIse1xuICAgICAgICAgICAgICAgIHdUYWJsZUlEOnVzZXJJdGVtLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIHdDaGFpcklEOnVzZXJJdGVtLndDaGFpcklELFxuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJJdGVtLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCl7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0TG9nb25GaW5pc2goKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJTdGF0dXM6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c11cIik7XG4gICAgICAgIC8v55So5oi354q25oCBXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfVXNlclN0YXR1c1xuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+aVsOaNruW6kyBJRFxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB1c2VyU3RhdHVzID0ge307XG4gICAgICAgIHVzZXJTdGF0dXMud1RhYmxlSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB1c2VyU3RhdHVzLmR3VXNlcklEID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdXNlclN0YXR1cy53Q2hhaXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10gbmV3U3RhdHVzID0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VyU3RhdHVzLCBudWxsLCAnICcpKTtcbiAgICAgICAgdmFyIHVzZXJJdGVtID0gdGhpcy5zZWFyY2hVc2VyQnlVc2VySUQodXNlclN0YXR1cy5kd1VzZXJJRCk7XG4gICAgICAgIHZhciBteVVzZXJJdGVtID0gdGhpcy5nZXRNZVVzZXJJdGVtKCk7XG4gICAgICAgIGlmICghbXlVc2VySXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g5pyq5om+5Yiw6Ieq5bexXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8v5om+5LiN5Yiw55So5oi3XG4gICAgICAgIGlmICghdXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOaJvuS4jeWIsOeUqOaIt1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL+iusOW9leaXp+eKtuaAgVxuICAgICAgICB2YXIgb2xkU3RhdHVzID0ge307XG4gICAgICAgIG9sZFN0YXR1cy53VGFibGVJRCA9IHVzZXJJdGVtLndUYWJsZUlEO1xuICAgICAgICBvbGRTdGF0dXMud0NoYWlySUQgPSB1c2VySXRlbS53Q2hhaXJJRDtcbiAgICAgICAgb2xkU3RhdHVzLmNiVXNlclN0YXR1cyA9IHVzZXJJdGVtLmNiVXNlclN0YXR1cztcblxuICAgICAgICAvL+abtOaWsOS/oeaBr1xuICAgICAgICB1c2VySXRlbS5jYlVzZXJTdGF0dXMgPSB1c2VyU3RhdHVzLmNiVXNlclN0YXR1cztcbiAgICAgICAgdXNlckl0ZW0ud1RhYmxlSUQgPSB1c2VyU3RhdHVzLndUYWJsZUlEO1xuICAgICAgICB1c2VySXRlbS53Q2hhaXJJRCA9IHVzZXJTdGF0dXMud0NoYWlySUQ7XG5cbiAgICAgICAgLy/muIXpmaTml6fmoYzlrZDmpIXlrZDorrDlvZVcbiAgICAgICAgaWYob2xkU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgLy/mlrDml6fmoYzlrZDkuI3lkIwg5paw5pen5qSF5a2Q5LiN5ZCMXG4gICAgICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEICE9PSB1c2VyU3RhdHVzLndUYWJsZUlEIHx8IG9sZFN0YXR1cy53Q2hhaXJJRCAhPT0gdXNlclN0YXR1cy53Q2hhaXJJRCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25VcERhdGVUYWJsZVVzZXIob2xkU3RhdHVzLndUYWJsZUlELCBvbGRTdGF0dXMud0NoYWlySUQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/mlrDmoYzlrZDorrDlvZVcbiAgICAgICAgaWYgKHVzZXJTdGF0dXMud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRlVGFibGVVc2VyKHVzZXJTdGF0dXMud1RhYmxlSUQsIHVzZXJTdGF0dXMud0NoYWlySUQsIHVzZXJJdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v6Ieq5bex54q25oCBXG4gICAgICAgIGlmIChteVVzZXJJdGVtLmR3VXNlcklEID09PSB1c2VyU3RhdHVzLmR3VXNlcklEKSB7XG4gICAgICAgICAgICB0aGlzLl93VGFibGVJRCA9IHVzZXJTdGF0dXMud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJTdGF0dXMud0NoYWlySUQ7XG5cbiAgICAgICAgICAgIC8v56a75byAXG4gICAgICAgICAgICBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19OVUxMKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex56a75byAXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV4aXRSb29tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/otbfnq4tcbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID09PSBHbG9iYWxEZWYuVVNfRlJFRSAmJiBvbGRTdGF0dXMuY2JVc2VyU3RhdHVzID4gR2xvYmFsRGVmLlVTX0ZSRUUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7Hotbfnq4tcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXhpdFRhYmxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/lnZDkuItcbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID4gR2xvYmFsRGVmLlVTX0ZSRUUgJiYgb2xkU3RhdHVzLmNiVXNlclN0YXR1cyA8IEdsb2JhbERlZi5VU19TSVQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7HlnZDkuItcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJUYWJsZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRHYW1lT3B0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+aNouS9jVxuICAgICAgICAgICAgZWxzZSBpZiAodXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmjaLkvY1cIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJUYWJsZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRHYW1lT3B0aW9uKCk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7HmlrDnirbmgIEgXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VyU3RhdHVzLCBudWxsLCAnICcpKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+S7luS6uueKtuaAgVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8v5pu05paw55So5oi3XG4gICAgICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSB8fCB1c2VyU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/liKDpmaTnlKjmiLdcbiAgICAgICAgICAgIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX05VTEwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlVXNlcih1c2VyU3RhdHVzLmR3VXNlcklEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJTY29yZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2NvcmVdXCIpO1xuICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTY29yZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/mtojotLnph5HosYZcbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HosYZcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgdGFnVXNlclNjb3JlXHRcdFx0XHRcdFVzZXJTY29yZTtcdFx0XHRcdFx0XHRcdC8v56ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ1VzZXJTY29yZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/lrZjlgqjph5HluIFcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxEcmF3Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+WSjOWxgOebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHVzZXJTY29yZSA9IHt9O1xuICAgICAgICB1c2VyU2NvcmUubExvdmVsaW5lc3MgPSBwRGF0YS5yZWFkaW50KCk7IC8v55So5oi36a2F5YqbXG4gICAgICAgIHVzZXJTY29yZS5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAvL+eUqOaIt0lEXG4gICAgICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUgPSB7fTtcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubEdhbWVHb2xkID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/lrZjlgqjph5HluIFcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sV2luQ291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeebmOaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxMb3N0Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl55uY5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubERyYXdDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sRmxlZUNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+aVsOebrlxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxFeHBlcmllbmNlID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG5cbiAgICAgICAgLy/oh6rlt7Hkv6Hmga9cbiAgICAgICAgdmFyIG15VXNlckl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgdmFyIHVzZXJJdGVtID0gdGhpcy5zZWFyY2hVc2VyQnlVc2VySUQodXNlclNjb3JlLmR3VXNlcklEKTtcbiAgICAgICAgLy8gaWYgKHVzZXJTY29yZS5kd1VzZXJJRCA9PSBteVVzZXJJdGVtLmR3VXNlcklEKSB7XG4gICAgICAgIGlmICghdXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTY29yZV0g5pu05pawIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlclNjb3JlLCBudWxsLCAnICcpKTtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxTY29yZSA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubFNjb3JlO1xuICAgICAgICAgICAgdXNlckl0ZW0ubEdhbWVHb2xkID0gdXNlclNjb3JlLlVzZXJTY29yZS5sR2FtZUdvbGQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sV2luQ291bnQgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxXaW5Db3VudDtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxMb3N0Q291bnQgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxMb3N0Q291bnQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sRHJhd0NvdW50ID0gdXNlclNjb3JlLlVzZXJTY29yZS5sRHJhd0NvdW50O1xuICAgICAgICAgICAgdXNlckl0ZW0ubEZsZWVDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEZsZWVDb3VudDtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxFeHBlcmllbmNlID0gdXNlclNjb3JlLlVzZXJTY29yZS5sRXhwZXJpZW5jZTtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxMb3ZlbGluZXNzID0gdXNlclNjb3JlLmxMb3ZlbGluZXNzO1xuICAgICAgICB9XG4gICAgICAgIC8v6YCa55+l5pu05paw55WM6Z2iXG4gICAgICAgIGlmKHRoaXMuX3dUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU2NvcmVcIix7XG4gICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJSaWdodDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViUmlnaHRdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJNZW1iZXJPcmRlcjogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViTWVtYmVyT3JkZXJdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJTaXRGYWlsZWQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlNpdEZhaWxlZF1cIik7XG4gICAgICAgIC8v5Z2Q5LiL5aSx6LSlXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfU2l0RmFpbGVkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzekZhaWxlZERlc2NyaWJlWzI1Nl07XHRcdFx0XHQvL+mUmeivr+aPj+i/sFxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgc3pGYWlsZWREZXNjcmliZSA9IHBEYXRhLnJlYWRzdHJpbmcoMjU2KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlNpdEZhaWxlZF0gXCIgKyBzekZhaWxlZERlc2NyaWJlKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViQ2hhdDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViQ2hhdF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1Yldpc3BlcjogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViV2lzcGVyXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViVXNlckludml0ZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckludml0ZV1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlF1ZXJ5R29sZDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViUXVlcnlHb2xkXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViUHJlc2VudFF1ZXJ5OiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJQcmVzZW50UXVlcnldXCIpO1xuICAgIH0sXG4gICAgc2VuZExvZ29uUGFja2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtzZW5kTG9nb25QYWNrZXRdXCIpO1xuICAgICAgICB2YXIgbG9nb25EYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBsb2dvbkRhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfTE9HT04sZ2FtZV9jbWQuU1VCX0dSX0xPR09OX01PQklMRSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNod29yZChHbG9iYWxVc2VyRGF0YS53RW5jcnlwdElEKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2h3b3JkKEdsb2JhbFVzZXJEYXRhLndDb2RlQ2hlY2tJRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoR2xvYmFsVXNlckRhdGEuZHdVc2VySUQpO1xuXG4gICAgICAgIHZhciBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoZHdNb2JpbGVTeXNUeXBlKTtcblxuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkLDMzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtzZW5kTG9nb25QYWNrZXRdIHBhc3N3b3JkID0gXCIgKyBHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCJcIiwzMyk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICAgICAgLy8gLy/miYvmnLrnmbvpmYZcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklETW9iaWxlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdFbmNyeXB0SUQ7XHRcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdDb2RlQ2hlY2tJRDtcdFx0XHRcdFx0XHQvL+maj+acuueggTJcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd1dlaVhpbkNoZWNrSUQ7XHRcdFx0XHRcdC8v5b6u5L+h6aqM6K+B56CBXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd01vYmlsZVN5c1R5cGU7XHRcdFx0XHRcdC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd01vYmlsZUFwcFZlcnNpb247XHRcdFx0XHRcdC8v5ri45oiPQVBQ54mI5pys5Y+3KOS4jueZu+mZhuWkp+WOheebuOWQjClcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzelBhc3NXb3JkW1BBU1NfTEVOXTtcdFx0XHRcdC8v55m75b2V5a+G56CBXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07XHQvL+acuuWZqOW6j+WIl+WPt1xuICAgICAgICAvLyB9O1xuICAgIH0sXG4gICAgLy/lnZDkuIvor7fmsYJcbiAgICBzZW5kU2l0RG93blBhY2tldDogZnVuY3Rpb24gKHdUYWJsZUlELCB3Q2hhaXJJRCwgc3pQYXNzV29yZCkge1xuICAgICAgICAvL+ivt+axguWdkOS4i1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTaXRSZXFcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0Y2JQYXNzTGVuO1x0XHRcdFx0XHRcdFx0Ly/lr4bnoIHplb/luqZcbiAgICAgICAgLy8gICAgIC8vRFdPUkRcdFx0XHRcdFx0XHRcdGR3QW5zd2VySUQ7XHRcdFx0XHRcdFx0XHQvL+WbnuetlCBJIEQvL+WFvOWuueenr+WIhua4uOaIj+WFpeW6p+mXrumimFxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOS9jee9rlxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6VGFibGVQYXNzW1BBU1NfTEVOXTtcdFx0XHRcdC8v5qGM5a2Q5a+G56CBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBzaXREYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBzaXREYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX1VTRVIsZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU0lUX1JFUSk7XG4gICAgICAgIHZhciBjYlBhc3NMZW4gPSAwO1xuICAgICAgICBpZiAoc3pQYXNzV29yZCkge1xuICAgICAgICAgICAgY2JQYXNzTGVuID0gc3pQYXNzV29yZC5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBzaXREYXRhLnB1c2hieXRlKGNiUGFzc0xlbik7XG4gICAgICAgIHNpdERhdGEucHVzaHdvcmQod0NoYWlySUQpO1xuICAgICAgICBzaXREYXRhLnB1c2h3b3JkKHdUYWJsZUlEKTtcbiAgICAgICAgc2l0RGF0YS5wdXNoc3RyaW5nKHN6UGFzc1dvcmQsR2xvYmFsRGVmLlBBU1NfTEVOKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJzaXplMSA9IFwiICsgc2l0RGF0YS5nZXREYXRhU2l6ZSgpKTtcbiAgICAgICAgdmFyIHNlbmRTaXplID0gc2l0RGF0YS5nZXREYXRhU2l6ZSgpIC0gR2xvYmFsRGVmLlBBU1NfTEVOICsgY2JQYXNzTGVuO1xuICAgICAgICBjb25zb2xlLmxvZyhcInNpemUyID0gXCIgKyBzZW5kU2l6ZSk7XG4gICAgICAgIHNpdERhdGEuc2V0RGF0YVNpemUoc2VuZFNpemUpO1xuXG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShzaXREYXRhKTtcbiAgICB9LFxuICAgIC8v56uZ6LW35p2lXG4gICAgc2VuZFN0YW5kdXBQYWNrZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfVVNFUiwgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBTkRVUF9SRVEpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICBzZW5kTGVmdEdhbWVQYWNrZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfVVNFUiwgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTEVGVF9HQU1FX1JFUSk7XG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIC8v5Y+R6YCB5YeG5aSHXG4gICAgc2VuZFVzZXJSZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgZGF0YS5zZXRjbWRpbmZvKEdsb2JhbERlZi5NRE1fR0ZfRlJBTUUsIEdsb2JhbERlZi5TVUJfR0ZfVVNFUl9SRUFEWSk7XG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIC8v5Y+R6YCB5ri45oiP5L+h5oGvXG4gICAgc2VuZEdhbWVPcHRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy/niYjmnKzkv6Hmga9cbiAgICAgICAgLy8gc3RydWN0IENNRF9HRl9JbmZvXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0YkFsbG93TG9va29uO1x0XHRcdFx0XHQvL+aXgeinguagh+W/l1xuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgZGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgZGF0YS5zZXRjbWRpbmZvKEdsb2JhbERlZi5NRE1fR0ZfRlJBTUUsIEdsb2JhbERlZi5TVUJfR0ZfSU5GTyk7XG4gICAgICAgIGRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICBvblVwRGF0ZVRhYmxlVXNlcjogZnVuY3Rpb24gKHRhYmxlaWQsY2hhaXJpZCx1c2VyaXRlbSkge1xuICAgICAgICB2YXIgaWQgPSB0YWJsZWlkO1xuICAgICAgICB2YXIgaWRleCA9IGNoYWlyaWQ7XG4gICAgICAgIGlmICghdGhpcy5fdGFibGVVc2VyTGlzdFtpZF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXVtpZGV4XSA9IHVzZXJpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdFtpZF1baWRleF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v6I635Y+W5qGM5a2Q55So5oi3XG4gICAgZ2V0VGFibGVVc2VySXRlbTogZnVuY3Rpb24gKHRhYmxlaWQsY2hhaXJpZCkge1xuICAgICAgICB2YXIgaWQgPSB0YWJsZWlkO1xuICAgICAgICB2YXIgaWRleCA9IGNoYWlyaWQ7XG4gICAgICAgIGlmICh0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRUYWJsZUluZm86IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDaGFpckNvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93Q2hhaXJDb3VudDsgIFxuICAgIH0sXG4gICAgZ2V0VGFibGVDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd1RhYmxlQ291bnQ7ICBcbiAgICB9LFxuICAgIC8v6I635Y+W5qGM5a2QSURcbiAgICBnZXRUYWJsZUlEOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93VGFibGVJRDtcbiAgICB9LFxuICAgIC8v6I635Y+W5qSF5a2QSURcbiAgICBnZXRDaGFpcklEOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93Q2hhaXJJRDsgIFxuICAgIH0sXG4gICAgLy/ojrflj5bmuLjmiI/nirbmgIFcbiAgICBnZXRHYW1lU3RhdHVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYkdhbWVTdGF0dXM7ICBcbiAgICB9LFxuICAgIC8v6K6+572u5ri45oiP54q25oCBXG4gICAgc2V0R2FtZVN0YXR1czogZnVuY3Rpb24gKGNiR2FtZVN0YXR1cykge1xuICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgPSBjYkdhbWVTdGF0dXM7XG4gICAgfSxcbiAgICAvL+iOt+WPluiHquW3sea4uOaIj+S/oeaBr1xuICAgIGdldE1lVXNlckl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJMaXN0W0dsb2JhbFVzZXJEYXRhLmR3VXNlcklEXTtcbiAgICB9LFxuICAgIHNlYXJjaFVzZXJCeVVzZXJJRDogZnVuY3Rpb24gKGR3VXNlcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTGlzdFtkd1VzZXJJRF07XG4gICAgfSxcbiAgICBvblJlbW92ZVVzZXI6IGZ1bmN0aW9uIChkd1VzZXJJRCkge1xuICAgICAgICB0aGlzLl91c2VyTGlzdFtkd1VzZXJJRF0gPSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2FtZUxvZ2ljID0ge307XG4vL+Wuj+WumuS5iVxuR2FtZUxvZ2ljLk1BWF9DT1VOVCA9IDM7XHRcdFx0XHRcdFx0XHRcdFx0Ly/mnIDlpKfmlbDnm65cbkdhbWVMb2dpYy5EUkFXID0gMjtcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgIC8v5ZKM5bGA57G75Z6LXG5cbi8v5pWw5YC85o6p56CBXG5HYW1lTG9naWMuTE9HSUNfTUFTS19DT0xPUiA9IDB4RjA7XHRcdFx0XHRcdFx0XHQvL+iKseiJsuaOqeeggVxuR2FtZUxvZ2ljLkxPR0lDX01BU0tfVkFMVUUgPSAweDBGO1x0XHRcdFx0XHRcdFx0Ly/mlbDlgLzmjqnnoIFcblxuLy/miZHlhYvnsbvlnotcbkdhbWVMb2dpYy5DVF9TSU5HTEUgPSAxO1x0XHRcdFx0XHRcdFx0XHRcdC8v5Y2V54mM57G75Z6LXG5HYW1lTG9naWMuQ1RfRE9VQkxFID0gMjtcdFx0XHRcdFx0XHRcdFx0ICAgIC8v5a+55a2Q57G75Z6LXG5HYW1lTG9naWMuQ1RfU0hVTl9aSSA9IDM7XHRcdFx0XHRcdFx0XHRcdFx0Ly/pobrlrZDnsbvlnotcbkdhbWVMb2dpYy5DVF9KSU5fSFVBID0gNDtcdFx0XHRcdFx0XHRcdFx0XHQvL+mHkeiKseexu+Wei1xuR2FtZUxvZ2ljLkNUX1NIVU5fSklOID0gNTtcdFx0XHRcdFx0XHRcdFx0XHQvL+mhuumHkeexu+Wei1xuR2FtZUxvZ2ljLkNUX0JBT19aSSA9IDY7XHRcdFx0XHRcdFx0XHRcdFx0Ly/osbnlrZDnsbvlnotcbkdhbWVMb2dpYy5DVF9TUEVDSUFMID0gNztcdFx0XHRcdFx0XHRcdFx0XHQvL+eJueauiuexu+Wei1xuXG4vL+iOt+WPluaVsOWAvFxuR2FtZUxvZ2ljLmdldENhcmRWYWx1ZSA9IGZ1bmN0aW9uIChjYkNhcmREYXRhKSB7XG4gICAgcmV0dXJuIChjYkNhcmREYXRhICYgR2FtZUxvZ2ljLkxPR0lDX01BU0tfVkFMVUUpO1xufTtcbi8v6I635Y+W6Iqx6ImyXG5HYW1lTG9naWMuZ2V0Q2FyZENvbG9yID0gZnVuY3Rpb24gKGNiQ2FyZERhdGEpIHtcbiAgICByZXR1cm4gKGNiQ2FyZERhdGEgJiBHYW1lTG9naWMuTE9HSUNfTUFTS19DT0xPUik7XG59O1xuLy/pgLvovpHmlbDlgLxcbkdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZSA9IGZ1bmN0aW9uIChjYkNhcmREYXRhKSB7XG4gICAgdmFyIGNiQ2FyZFZhbHVlID0gR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShjYkNhcmREYXRhKTtcblxuICAgIGlmIChjYkNhcmRWYWx1ZSA9PSAxKSB7XG4gICAgICAgIGNiQ2FyZFZhbHVlID0gY2JDYXJkVmFsdWUgKyAxMztcbiAgICB9XG4gICAgcmV0dXJuIGNiQ2FyZFZhbHVlO1xufTtcbkdhbWVMb2dpYy5zb3J0Q2FyZCA9IGZ1bmN0aW9uIChjYXJkRGF0YSkge1xuICAgIHZhciBjYXJkRGF0YVRtcCA9IFtdO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjYXJkRGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY2FyZERhdGFUbXBbaW5kZXhdID0gY2FyZERhdGFbaW5kZXhdO1xuICAgIH1cbiAgICAvL+WFiOaOkuminOiJslxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZERhdGFUbXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXJkRGF0YVRtcC5sZW5ndGggLSBpOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChjYXJkRGF0YVRtcFtqXSA8IGNhcmREYXRhVG1wW2ogKyAxXSkge1xuICAgICAgICAgICAgICAgIFtjYXJkRGF0YVRtcFtqXSwgY2FyZERhdGFUbXBbaiArIDFdXSA9IFtjYXJkRGF0YVRtcFtqICsgMV0sIGNhcmREYXRhVG1wW2pdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9XG4gICAgLy/lho3mjpLlpKflsI9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhVG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2FyZERhdGFUbXAubGVuZ3RoIC0gaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoR2FtZUxvZ2ljLmdldENhcmRMb2dpY1ZhbHVlKGNhcmREYXRhVG1wW2pdKSA8IEdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZShjYXJkRGF0YVRtcFtqICsgMV0pICkge1xuICAgICAgICAgICAgICAgIFtjYXJkRGF0YVRtcFtqXSwgY2FyZERhdGFUbXBbaiArIDFdXSA9IFtjYXJkRGF0YVRtcFtqICsgMV0sIGNhcmREYXRhVG1wW2pdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FyZERhdGFUbXA7XG59O1xuLy/ojrflvpfniYzlnotcbkdhbWVMb2dpYy5nZXRDYXJkVHlwZSA9IGZ1bmN0aW9uIChjYXJkKSB7XG4gICAgaWYgKGNhcmQubGVuZ3RoICE9PSBHYW1lTG9naWMuTUFYX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGNhcmREYXRhID0gR2FtZUxvZ2ljLnNvcnRDYXJkKGNhcmQpO1xuICAgIHZhciBjYlNhbWVDb2xvciA9IHRydWU7XG4gICAgdmFyIGJMaW5lQ2FyZCA9IHRydWU7XG4gICAgdmFyIGNiRmlyc3RDb2xvciA9IEdhbWVMb2dpYy5nZXRDYXJkQ29sb3IoY2FyZERhdGFbMF0pO1xuICAgIHZhciBjYkZpcnN0VmFsdWUgPSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbMF0pO1xuXG4gICAgLy/niYzlnovliIbmnpBcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgY2FyZERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmIChjYkZpcnN0Q29sb3IgIT09IEdhbWVMb2dpYy5nZXRDYXJkQ29sb3IoY2FyZERhdGFbaW5kZXhdKSkge1xuICAgICAgICAgICAgY2JTYW1lQ29sb3IgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2JGaXJzdFZhbHVlICE9PSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbaW5kZXhdK2luZGV4KSkge1xuICAgICAgICAgICAgYkxpbmVDYXJkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNiU2FtZUNvbG9yID09PSBmYWxzZSAmJiBiTGluZUNhcmQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL+eJueauikEyM1xuICAgIGlmIChmYWxzZSA9PT0gYkxpbmVDYXJkKSB7XG4gICAgICAgIHZhciBiT25lID0gZmFsc2U7XG4gICAgICAgIHZhciBiVHdvID0gZmFsc2U7XG4gICAgICAgIHZhciBiVGhyZWUgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGNhcmREYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoY2FyZERhdGFbaW5kZXhdKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGJPbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShjYXJkRGF0YVtpbmRleF0pID09PSAyKSB7XG4gICAgICAgICAgICAgICAgYlR3byA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBiVGhyZWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYk9uZSAmJiBiVHdvICYmIGJUaHJlZSkge1xuICAgICAgICAgICAgICAgIGJMaW5lQ2FyZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/pobrph5HnsbvlnotcbiAgICBpZiAoY2JTYW1lQ29sb3IgJiYgYkxpbmVDYXJkKSB7XG4gICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU0hVTl9KSU47XG4gICAgfVxuICAgIC8v6aG65a2Q57G75Z6LXG4gICAgaWYgKCAoZmFsc2UgPT09IGNiU2FtZUNvbG9yKSAmJiBiTGluZUNhcmQpIHtcbiAgICAgICAgcmV0dXJuIEdhbWVMb2dpYy5DVF9TSFVOX1pJO1xuICAgIH1cbiAgICAvL+mHkeiKseexu+Wei1xuICAgIGlmIChjYlNhbWVDb2xvciAmJiAoZmFsc2UgPT09IGJMaW5lQ2FyZCkgKSB7XG4gICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfSklOX0hVQTtcbiAgICB9XG4gICAgLy/niYzlnovliIbmnpBcbiAgICB2YXIgYkRvdWJsZSA9IGZhbHNlO1xuICAgIHZhciBiUGFudGhlciA9IHRydWU7XG4gICAgLy/lr7nniYzliIbmnpBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgY2FyZERhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbaV0pID09PSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbal0pKSB7XG4gICAgICAgICAgICAgICAgYkRvdWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJEb3VibGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8v5LiJ5p2hKOixueWtkCnliIbmnpBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChiUGFudGhlciAmJiBjYkZpcnN0VmFsdWUgIT09IEdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZShjYXJkRGF0YVtpXSkpIHtcbiAgICAgICAgICAgIGJQYW50aGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/lr7nlrZDlkozosbnlrZDliKTmlq1cbiAgICBpZiAoYkRvdWJsZSkge1xuICAgICAgICBpZiAoYlBhbnRoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfQkFPX1pJO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVMb2dpYy5DVF9ET1VCTEU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/nibnmrooyMzVcbiAgICB2YXIgYlR3byA9IGZhbHNlO1xuICAgIHZhciBiVGhyZWUgPSBmYWxzZTtcbiAgICB2YXIgYkZpdmUgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgY2FyZERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDIpIHtcbiAgICAgICAgICAgIGJUd28gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoY2FyZERhdGFbaW5kZXhdKSA9PT0gMykge1xuICAgICAgICAgICAgYlRocmVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDUpIHtcbiAgICAgICAgICAgIGJGaXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggYlR3byAmJiBiVGhyZWUgJiYgYkZpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU1BFQ0lBTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU0lOR0xFO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMb2dpYzsiLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuXG52YXIgR2FtZU1vZGVsID0gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25Mb2FkXVwiKTtcbiAgICAgICAgdmFyIEdhbWVGcmFtZU5vZGUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICBpZiAoR2FtZUZyYW1lTm9kZSl7XG4gICAgICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSBHYW1lRnJhbWVOb2RlLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uSW5pdEdhbWVFbmdpbmUoKTtcbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX2NiR2FtZVN0YXR1cyA9IC0xO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkVuYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudEdhbWVNZXNzYWdlXCIsdGhpcy5vbkV2ZW50R2FtZU1lc3NhZ2UsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudEdhbWVTY2VuZVwiLHRoaXMub25FdmVudEdhbWVTY2VuZSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oXCJvbkV2ZW50VXNlckVudGVyXCIsdGhpcy5vbkV2ZW50VXNlckVudGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRVc2VyU3RhdHVzXCIsdGhpcy5vbkV2ZW50VXNlclN0YXR1cyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oXCJvbkV2ZW50VXNlclNjb3JlXCIsdGhpcy5vbkV2ZW50VXNlclNjb3JlLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXhpdFJvb21cIix0aGlzLm9uRXhpdFJvb20sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FeGl0VGFibGVcIix0aGlzLm9uRXhpdFRhYmxlLHRoaXMpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25EaXNhYmxlXVwiKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FdmVudEdhbWVNZXNzYWdlXCIsdGhpcy5vbkV2ZW50R2FtZU1lc3NhZ2UsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lU2NlbmVcIix0aGlzLm9uRXZlbnRHYW1lU2NlbmUsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRVc2VyRW50ZXJcIix0aGlzLm9uRXZlbnRVc2VyRW50ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRVc2VyU3RhdHVzXCIsdGhpcy5vbkV2ZW50VXNlclN0YXR1cyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FdmVudFVzZXJTY29yZVwiLHRoaXMub25FdmVudFVzZXJTY29yZSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FeGl0Um9vbVwiLHRoaXMub25FeGl0Um9vbSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FeGl0VGFibGVcIix0aGlzLm9uRXhpdFRhYmxlLHRoaXMpO1xuICAgIH0sXG4gICAgLy/liJ3lp4vljJbmuLjmiI/mlbDmja5cbiAgICBvbkluaXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25Jbml0R2FtZUVuZ2luZV1cIik7XG4gICAgICAgIHRoaXMuX0Nsb2NrSUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNO1xuICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSAwO1xuICAgICAgICB0aGlzLl9DbG9ja0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgfSxcbiAgICAvL+mHjee9ruahhuaetlxuICAgIG9uUmVzZXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25SZXNldEdhbWVFbmdpbmVdXCIpO1xuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8v6YCA5Ye66K+i6ZeuXG4gICAgb25RdWVyeUV4aXRHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub25FeGl0VGFibGUoKTtcbiAgICB9LFxuICAgIHN0YW5kVXBBbmRRdWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/pgIDlh7rmoYzlrZBcbiAgICBvbkV4aXRUYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uRXhpdFRhYmxlXVwiKTtcbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG5cbiAgICAgICAgdmFyIG15SXRlbSA9IHRoaXMuZ2V0TWVVc2VySXRlbSgpO1xuICAgICAgICBpZiAobXlJdGVtICYmIG15SXRlbS5jYlVzZXJTdGF0dXMgPiBHbG9iYWxEZWYuVVNfRlJFRSkge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTdGFuZHVwUGFja2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRXhpdFJvb206IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7ICBcbiAgICB9LFxuICAgIG9uS2V5QmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uUXVlcnlFeGl0R2FtZSgpO1xuICAgIH0sXG4gICAgLy/ojrflj5boh6rlt7HmpIXlrZBcbiAgICBnZXRNZUNoYWlySUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVGcmFtZS5nZXRDaGFpcklEKCk7XG4gICAgfSxcbiAgICAvL+iOt+WPluiHquW3seahjOWtkFxuICAgIGdldE1lVGFibGVJRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlSUQoKTtcbiAgICB9LFxuICAgIGdldE1lVXNlckl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVGcmFtZS5nZXRNZVVzZXJJdGVtKCk7XG4gICAgfSxcbiAgICAvLyDmpIXlrZDlj7fovazop4blm77kvY3nva4s5rOo5oSP5qSF5a2Q5Y+35LuOMH5uQ2hhaXJDb3VudC0xLOi/lOWbnueahOinhuWbvuS9jee9ruS7jjF+bkNoYWlyQ291bnRcbiAgICBzd2l0Y2hWaWV3Q2hhaXJJRDogZnVuY3Rpb24gKGNoYWlyKSB7XG4gICAgICAgIHZhciB2aWV3SUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgdmFyIG5DaGFpckNvdW50ID0gdGhpcy5fZ2FtZUZyYW1lLmdldENoYWlyQ291bnQoKTsgIFxuICAgICAgICB2YXIgbkNoYWlySUQgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuICAgICAgICBpZiAoY2hhaXIgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSICYmIGNoYWlyIDwgbkNoYWlyQ291bnQpIHtcbiAgICAgICAgICAgIHZpZXdJRCA9ICgoY2hhaXIgKyBNYXRoLmZsb29yKG5DaGFpckNvdW50ICogMy8yKSAtIG5DaGFpcklEKSUobkNoYWlyQ291bnQpKSA7Ly8rIDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtzd2l0Y2hWaWV3Q2hhaXJJRF0gKyBbbkNoYWlyQ291bnQsbkNoYWlySUQsY2hhaXIsdmlld0lEXSA9IFwiKyBbbkNoYWlyQ291bnQsbkNoYWlySUQsY2hhaXIsdmlld0lEXSk7XG4gICAgICAgIHJldHVybiB2aWV3SUQ7XG4gICAgfSxcbiAgICAvL+aYr+WQpuWQiOazleinhuWbvklEXG4gICAgaXNWYWxpZFZpZXdJRDogZnVuY3Rpb24gKHZpZXdJRCkge1xuICAgICAgICB2YXIgbkNoYWlyQ291bnQgPSB0aGlzLl9nYW1lRnJhbWUuZ2V0Q2hhaXJDb3VudCgpO1xuICAgICAgICByZXR1cm4gKHZpZXdJRCA+IDApICYmICh2aWV3SUQgPD0gbkNoYWlyQ291bnQpOyAgXG4gICAgfSxcbiAgICAvL+iuvue9ruiuoeaXtuWZqFxuICAgIHNldEdhbWVDbG9jazogZnVuY3Rpb24gKGNoYWlyLCBpZCwgdGltZSkge1xuICAgICAgICBpZiAoIWNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmlzU2NoZWR1bGVkKHRoaXMub25DbG9ja1VwZGF0YSx0aGlzKSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUodGhpcy5vbkNsb2NrVXBkYXRhLCB0aGlzLCAxLCBjYy5tYWNyby5SRVBFQVRfRk9SRVZFUiwgMCwgZmFsc2UpO1xuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5fQ2xvY2tDaGFpciA9IGNoYWlyO1xuICAgICAgICB0aGlzLl9DbG9ja0lEID0gaWQ7XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IHRpbWU7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChjaGFpcik7XG4gICAgICAgIHRoaXMub25VcGRhdGVDbG9ja1ZpZXcoKTtcbiAgICB9LFxuICAgIC8v5YWz6Zet6K6h5pe25ZmoXG4gICAga2lsbEdhbWVDbG9jazogZnVuY3Rpb24gKG5vdFZpZXcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtraWxsR2FtZUNsb2NrXVwiKTtcbiAgICAgICAgdGhpcy5fQ2xvY2tJRCA9IEdsb2JhbERlZi5JTlZBTElEX0lURU07XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0Nsb2NrQ2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgdGhpcy5fQ2xvY2tWaWV3Q2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgaWYgKGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmlzU2NoZWR1bGVkKHRoaXMub25DbG9ja1VwZGF0YSx0aGlzKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtraWxsR2FtZUNsb2NrXSB1bnNjaGVkdWxlIHRoaXMub25DbG9ja1VwZGF0YVwiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGUodGhpcy5vbkNsb2NrVXBkYXRhLCB0aGlzKTtcbiAgICAgICAgfSAgXG4gICAgICAgIGlmICghIG5vdFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDbG9ja1ZpZXcoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2xvY2tWaWV3SUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0Nsb2NrVmlld0NoYWlyO1xuICAgIH0sXG4gICAgLy/orqHml7blmajmm7TmlrBcbiAgICBvbkNsb2NrVXBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25DbG9ja1VwZGF0YV0gY2hhaXIgPSBcIiArIHRoaXMuX0Nsb2NrQ2hhaXIgKyBcIiB0aW1lID0gXCIgKyB0aGlzLl9DbG9ja1RpbWUgKyBcIiBpZCA9IFwiICsgdGhpcy5fQ2xvY2tJRCk7XG4gICAgICAgIGlmICh0aGlzLl9DbG9ja0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNKSB7XG4gICAgICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSB0aGlzLl9DbG9ja1RpbWUgLSAxO1xuICAgICAgICAgICAgdmFyIHJldCA9IHRoaXMub25FdmVudEdhbWVDbG9ja0luZm8odGhpcy5fQ2xvY2tDaGFpciwgdGhpcy5fQ2xvY2tUaW1lLCB0aGlzLl9DbG9ja0lEKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IHRydWUgfHwgdGhpcy5fQ2xvY2tUaW1lIDwgMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25DbG9ja1VwZGF0YV0gW3JldCxjbG9ja3RpbWVdID0gXCIgKyBbcmV0LHRoaXMuX0Nsb2NrVGltZV0pO1xuICAgICAgICAgICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNsb2NrVmlldygpO1xuICAgIH0sXG4gICAgLy/mm7TmlrDorqHml7blmajmmL7npLpcbiAgICBvblVwZGF0ZUNsb2NrVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBvblVwZGF0ZUNsb2NrVmlld1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uVXBkYXRlQ2xvY2tWaWV3XSBjbG9ja1RpbWUgPSBcIiArIHRoaXMuX0Nsb2NrVGltZSArIFwiIHZpZXdDaGFpciA9IFwiICsgdGhpcy5fQ2xvY2tWaWV3Q2hhaXIpO1xuICAgIH0sXG4gICAgLy/nlKjmiLfnirbmgIEgXG4gICAgb25FdmVudFVzZXJTdGF0dXM6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gcGFyYW1zID0ge3VzZXJJdGVtOixuZXdTdGF0dXMsb2xkU3RhdHVzLH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkV2ZW50VXNlclN0YXR1c11cIik7XG4gICAgICAgIHZhciB1c2VySXRlbSA9IHBhcmFtcy5kZXRhaWwudXNlckl0ZW07XG4gICAgICAgIHZhciBuZXdTdGF0dXMgPSBwYXJhbXMuZGV0YWlsLm5ld1N0YXR1cztcbiAgICAgICAgdmFyIG9sZFN0YXR1cyA9IHBhcmFtcy5kZXRhaWwub2xkU3RhdHVzO1xuICAgICAgICB2YXIgbXlUYWJsZSA9IHRoaXMuZ2V0TWVUYWJsZUlEKCk7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcblxuICAgICAgICBpZiAobXlUYWJsZSA9PT0gdW5kZWZpbmVkIHx8IG15VGFibGUgPT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkV2ZW50VXNlclN0YXR1c10gbXlUYWJsZSA9IFwiICsgbXlUYWJsZSArIFwiIG9sZCA9IFwiICsgSlNPTi5zdHJpbmdpZnkob2xkU3RhdHVzLCBudWxsLCAnICcpICsgXCIgbmV3ID0gXCIgKyBKU09OLnN0cmluZ2lmeShuZXdTdGF0dXMsIG51bGwsICcgJykpO1xuICAgICAgICAvL+aXp+eahOa4hemZpFxuICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEID09PSBteVRhYmxlKSB7XG4gICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChvbGRTdGF0dXMud0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAhPT0gdW5kZWZpbmVkICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uRXZlbnRVc2VyU3RhdHVzXSDml6fnmoTmuIXpmaRcIik7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dhbWVWaWV3ICYmIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcih2aWV3SUQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5pu05paw5paw54q25oCBXG4gICAgICAgIGlmIChuZXdTdGF0dXMud1RhYmxlSUQgPT09IG15VGFibGUpIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKG5ld1N0YXR1cy53Q2hhaXJJRCk7XG4gICAgICAgICAgICBpZiAodmlld0lEICE9PSB1bmRlZmluZWQgJiYgdmlld0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgICAgIC8vIG9uVXBkYXRlVXNlclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25FdmVudFVzZXJTdGF0dXNdIOabtOaWsOaWsOeKtuaAgVwiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2FtZVZpZXcgJiYgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKHZpZXdJRCwgdXNlckl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/nlKjmiLfnp6/liIZcbiAgICBvbkV2ZW50VXNlclNjb3JlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHBhcmFtcyA9IHt1c2VyU2NvcmUsfVxuICAgICAgICB2YXIgdXNlckl0ZW0gPSBwYXJhbXMuZGV0YWlsLnVzZXJJdGVtO1xuICAgICAgICB2YXIgbXlUYWJsZSA9IHRoaXMuZ2V0TWVUYWJsZUlEKCk7XG4gICAgICAgIGlmIChteVRhYmxlID09PSB1bmRlZmluZWQgfHwgbXlUYWJsZSA9PT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXlUYWJsZSA9PT0gdXNlckl0ZW0ud1RhYmxlSUQpIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHVzZXJJdGVtLndDaGFpcklEKTtcbiAgICAgICAgICAgIGlmICh2aWV3SUQgIT09IHVuZGVmaW5lZCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dhbWVWaWV3ICYmIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcih2aWV3SUQsIHVzZXJJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v55So5oi36L+b5YWlXG4gICAgb25FdmVudFVzZXJFbnRlcjogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBwYXJhbXMgPSB7d1RhYmxlSUQsd0NoYWlySUQsdXNlckl0ZW0sfVxuICAgICAgICB2YXIgd1RhYmxlSUQgPSBwYXJhbXMuZGV0YWlsLndUYWJsZUlEO1xuICAgICAgICB2YXIgd0NoYWlySUQgPSBwYXJhbXMuZGV0YWlsLndDaGFpcklEO1xuICAgICAgICB2YXIgdXNlckl0ZW0gPSBwYXJhbXMuZGV0YWlsLnVzZXJJdGVtO1xuXG4gICAgICAgIHZhciBteVRhYmxlID0gdGhpcy5nZXRNZVRhYmxlSUQoKTtcbiAgICAgICAgaWYgKG15VGFibGUgPT09IHVuZGVmaW5lZCB8fCBteVRhYmxlID09PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChteVRhYmxlID09PSB3VGFibGVJRCkge1xuICAgICAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQod0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAhPT0gdW5kZWZpbmVkICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICAvLyBvblVwZGF0ZVVzZXJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2FtZVZpZXcgJiYgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKHZpZXdJRCwgdXNlckl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lj5HpgIHlh4blpIdcbiAgICBzZW5kVXNlclJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kVXNlclJlYWR5KCk7XG4gICAgfSxcbiAgICAvL+WPkemAgeaVsOaNrlxuICAgIHNlbmREYXRhIDogZnVuY3Rpb24gKHN1YiwgZGF0YUJ1Zikge1xuICAgICAgICBpZiAodGhpcy5fZ2FtZUZyYW1lKSB7XG4gICAgICAgICAgICBkYXRhQnVmLnNldGNtZGluZm8oR2xvYmFsRGVmLk1ETV9HRl9HQU1FLCBzdWIpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTb2NrZXREYXRhKGRhdGFCdWYpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v5Zy65pmv5raI5oGvXG4gICAgb25FdmVudEdhbWVTY2VuZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBcbiAgICB9LFxuICAgIC8v5ri45oiP5raI5oGvXG4gICAgb25FdmVudEdhbWVNZXNzYWdlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/orqHml7blmajlk43lupRcbiAgICBvbkV2ZW50R2FtZUNsb2NrSW5mbzogZnVuY3Rpb24gKGNoYWlyLCB0aW1lLCBjbG9ja0lEKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lTW9kZWw7IiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHYW1lTW9kZWwgPSByZXF1aXJlKFwiR2FtZU1vZGVsXCIpO1xudmFyIEdhbWVMb2dpYyA9IHJlcXVpcmUoXCJHYW1lTG9naWNcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogR2FtZU1vZGVsLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyBtX0J1dHRvbl9tZW51T3BlbjogY2MuVG9nZ2xlLFxuICAgICAgICBtX1BhbmVsX21lbnU6Y2MuTm9kZSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgLy8gaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAvLyAgICAgdGhpcy5fZ2FtZUZyYW1lID0gR2FtZUZyYW1lTm9kZS5nZXRDb21wb25lbnQoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tX2xNYXhUdXJuQ291bnQgPSA4O1xuICAgICAgICB0aGlzLl9nYW1lVmlldyA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJHYW1lVmlld1wiKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgb25Jbml0R2FtZUVuZ2luZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uSW5pdEdhbWVFbmdpbmVdXCIpO1xuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/lvZPliY3nlKjmiLdcbiAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/luoTlrrbnlKjmiLdcblxuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzID0gWzAsMCwwLDAsMF07Ly/muLjmiI/nirbmgIFcbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlID0gWzAsMCwwLDAsMF07Ly/kuIvms6jmlbDnm65cblxuICAgICAgICB0aGlzLm1fbE1heENlbGxTY29yZSA9IDA7Ly/ljZXlhYPkuIrpmZBcbiAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSAwOy8v5Y2V5YWD5LiL5rOoXG5cbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VGltZXMgPSAwOy8v5b2T5YmN5YCN5pWwXG4gICAgICAgIHRoaXMubV9sVXNlck1heFNjb3JlID0gMDsvL+acgOWkp+WIhuaVsFxuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUdXJuID0gMDsvL+W9k+WJjei9ruaVsFxuXG4gICAgICAgIHRoaXMubV9iTG9va0NhcmQgPSBbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdOy8v55yL54mM5Yqo5L2cXG5cbiAgICAgICAgdGhpcy5tX3dMb3N0VXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5q+U54mM5aSx6LSlXG4gICAgICAgIHRoaXMubV93V2lubmVyVXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v6IOc5Yip55So5oi3XG5cbiAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG4gICAgICAgIFxuICAgICAgICAvLyB0aGlzLnNldEdhbWVDbG9jayh6amhfY21kLk1ZX1ZJRVdJRCwgempoX2NtZC5JRElfU1RBUlRfR0FNRSwgempoX2NtZC5USU1FX1NUQVJUX0dBTUUpXG4gICAgfSxcbiAgICBvblJlc2V0R2FtZUVuZ2luZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5vblJlc2V0VmlldygpO1xuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/lvZPliY3nlKjmiLdcbiAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/luoTlrrbnlKjmiLdcbiAgICAgICAgdGhpcy5tX2NiUGxheVN0YXR1cyA9IFswLDAsMCwwLDBdOy8v5ri45oiP54q25oCBXG4gICAgICAgIHRoaXMubV9sVGFibGVTY29yZSA9IFswLDAsMCwwLDBdOy8v5LiL5rOo5pWw55uuXG4gICAgICAgIHRoaXMubV9sTWF4Q2VsbFNjb3JlID0gMDsvL+WNleWFg+S4iumZkFxuICAgICAgICB0aGlzLm1fbENlbGxTY29yZSA9IDA7Ly/ljZXlhYPkuIvms6hcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VGltZXMgPSAwOy8v5b2T5YmN5YCN5pWwXG4gICAgICAgIHRoaXMubV9sVXNlck1heFNjb3JlID0gMDsvL+acgOWkp+WIhuaVsFxuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUdXJuID0gMDsvL+W9k+WJjei9ruaVsFxuICAgICAgICB0aGlzLm1fYkxvb2tDYXJkID0gW2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXTsvL+eci+eJjOWKqOS9nFxuICAgICAgICB0aGlzLm1fd0xvc3RVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/mr5TniYzlpLHotKVcbiAgICAgICAgdGhpcy5tX3dXaW5uZXJVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/og5zliKnnlKjmiLdcbiAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG4gICAgICAgIC8vIHRoaXMuc2V0R2FtZUNsb2NrKHpqaF9jbWQuTVlfVklFV0lELCB6amhfY21kLklESV9TVEFSVF9HQU1FLCB6amhfY21kLlRJTUVfU1RBUlRfR0FNRSlcbiAgICB9LFxuICAgIC8v6K6+572u6K6h5pe25ZmoXG4gICAgc2V0R2FtZUNsb2NrOiBmdW5jdGlvbiAoY2hhaXIsIGlkLCB0aW1lKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGNoYWlyLCBpZCwgdGltZSk7XG4gICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLmdldENsb2NrVmlld0lEKCk7XG4gICAgICAgIGlmICh2aWV3SUQgIT09IHVuZGVmaW5lZCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICAvL+aXtumXtOi/m+W6puadoVxuICAgICAgICAgICAgLy90aGlzLk9uRXZlbnRHYW1lQ2xvY2tJbmZvKHZpZXdJRCwgaWQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+WFs+mXreiuoeaXtuWZqFxuICAgIGtpbGxHYW1lQ2xvY2s6IGZ1bmN0aW9uIChub3RWaWV3KSB7XG4gICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLmdldENsb2NrVmlld0lEKCk7XG4gICAgICAgIGlmICh2aWV3SUQgIT09IHVuZGVmaW5lZCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICAvL+aXtumXtOi/m+W6puadoVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcbiAgICAvL+iOt+W+l+W9k+WJjeato+WcqOeOqeeahOeOqeWutuaVsOmHj1xuICAgIGdldFBsYXlpbmdOdW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG51bSA9IDA7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPD0gempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaW5kZXhdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bTtcbiAgICB9LFxuICAgIC8v5pe26ZKf5aSE55CGXG4gICAgT25FdmVudEdhbWVDbG9ja0luZm86IGZ1bmN0aW9uIChjaGFpciwgdGltZSwgY2xvY2tJRCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lQ2xvY2tJbmZvXSBjaGFpciA9IFwiICsgY2hhaXIgKyBcIiB0aW1lID0gXCIgKyB0aW1lICsgXCIgY2xvY2tJRCA9IFwiICsgY2xvY2tJRCk7XG4gICAgICAgIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9TVEFSVF9HQU1FKSB7XG4gICAgICAgICAgICBpZiAodGltZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkV4aXRUYWJsZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNsb2NrSUQgPT09IHpqaF9jbWQuSURJX0RJU0FCTEUpIHtcbiAgICAgICAgICAgIGlmICh0aW1lID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9VU0VSX0FERF9TQ09SRSkge1xuICAgICAgICAgICAgaWYgKHRpbWUgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyID09PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25HaXZlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNsb2NrSUQgPT09IHpqaF9jbWQuSURJX1VTRVJfQ09NUEFSRV9DQVJEKSB7XG4gICAgICAgICAgICBpZiAodGltZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkF1dG9Db21wYXJlQ2FyZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBvblVwZGF0ZUNsb2NrVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBpZiAodGhpcy5fZ2FtZVZpZXcgJiYgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVDbG9ja1ZpZXcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlQ2xvY2tWaWV3KHRoaXMuX0Nsb2NrVmlld0NoYWlyLCB0aGlzLl9DbG9ja1RpbWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+WcuuaZr+a2iOaBr1xuICAgIG9uRXZlbnRHYW1lU2NlbmU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gcGFyYW1zID0ge2NiR2FtZVN0YXR1cyxwRGF0YSx9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25FdmVudEdhbWVTY2VuZV1cIik7XG4gICAgICAgIHZhciBjYkdhbWVTdGF0dXMgPSBwYXJhbXMuZGV0YWlsLmNiR2FtZVN0YXR1cztcbiAgICAgICAgdmFyIHBEYXRhID0gcGFyYW1zLmRldGFpbC5wRGF0YTtcbiAgICAgICAgLy/liJ3lp4vljJblt7LmnInnjqnlrrZcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciB1c2VySXRlbSA9IHRoaXMuX2dhbWVGcmFtZS5nZXRUYWJsZVVzZXJJdGVtKHRoaXMuX2dhbWVGcmFtZS5nZXRUYWJsZUlEKCksIGluZGV4KTtcbiAgICAgICAgICAgIGlmICh1c2VySXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciB3Vmlld0NoYWlySUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5vblVwZGF0ZVVzZXIod1ZpZXdDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lU2NlbmVdIHdWaWV3Q2hhaXJJRCA9IFwiICsgd1ZpZXdDaGFpcklEICsgXCIgdXNlckl0ZW0gPSBcIiArIEpTT04uc3RyaW5naWZ5KHVzZXJJdGVtLG51bGwsICcgJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoY2JHYW1lU3RhdHVzKSB7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5HU19GUkVFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25FdmVudEdhbWVTY2VuZV0gY2JHYW1lU3RhdHVzID0gR1NfRlJFRVwiKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfU19TdGF0dXNGcmVlXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDZWxsU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+WfuuehgOenr+WIhlxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbENlbGxTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsU2NvcmUodGhpcy5tX2xDZWxsU2NvcmUpO1xuICAgICAgICAgICAgICAgIC8vIHNob3dSZWFkeSgpO+aYvuekuuWHhuWkh+aMiemSrlxuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm1fQnV0dG9uX3JlYWR5Lm5vZGUuYWN0aXZlID0gKHRoaXMuZ2V0TWVVc2VySXRlbSgpLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX1NJVCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5nZXRNZUNoYWlySUQoKSwgempoX2NtZC5JRElfU1RBUlRfR0FNRSwgempoX2NtZC5USU1FX1NUQVJUX0dBTUUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5HU19QTEFZSU5HOlxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfU19TdGF0dXNQbGF5XG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICAvL+WKoOazqOS/oeaBr1xuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxNYXhDZWxsU2NvcmU7XHRcdFx0XHRcdFx0Ly/ljZXlhYPkuIrpmZBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ2VsbFNjb3JlO1x0XHRcdFx0XHRcdFx0Ly/ljZXlhYPkuIvms6hcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ3VycmVudFRpbWVzO1x0XHRcdFx0XHRcdC8v5b2T5YmN5YCN5pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFVzZXJNYXhTY29yZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+WIhuaVsOS4iumZkFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/nirbmgIHkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3QmFua2VyVXNlcjtcdFx0XHRcdFx0XHQvL+W6hOWutueUqOaIt1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHQgXHRcdFx0XHR3Q3VycmVudFVzZXI7XHRcdFx0XHRcdFx0Ly/lvZPliY3njqnlrrZcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdO1x0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIGJvb2xcdFx0XHRcdFx0XHRcdFx0Yk1pbmdaaHVbR0FNRV9QTEFZRVJdO1x0XHRcdFx0Ly/nnIvniYznirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsVGFibGVTY29yZVtHQU1FX1BMQVlFUl07XHRcdFx0Ly/kuIvms6jmlbDnm65cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gICAgIC8v5omR5YWL5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JIYW5kQ2FyZERhdGFbTUFYX0NPVU5UXTtcdFx0XHQvL+aJkeWFi+aVsOaNrlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/nirbmgIHkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyAgICAgYm9vbFx0XHRcdFx0XHRcdFx0XHRiQ29tcGFyZVN0YXRlO1x0XHRcdFx0XHRcdC8v5q+U54mM54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgICAgICAgICAgdmFyIHBsYXlTdGF0dXMgPSB7fTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxNYXhDZWxsU2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5sQ2VsbFNjb3JlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMubEN1cnJlbnRUaW1lcyA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxVc2VyTWF4U2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG5cbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLndCYW5rZXJVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5jYlBsYXlTdGF0dXMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmNiUGxheVN0YXR1c1tpbmRleF0gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmJNaW5nWmh1ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheVN0YXR1cy5iTWluZ1podVtpbmRleF0gPSBwRGF0YS5yZWFkYm9vbCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxUYWJsZVNjb3JlID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheVN0YXR1cy5sVGFibGVTY29yZVtpbmRleF0gPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMuY2JIYW5kQ2FyZERhdGEgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLk1BWF9DT1VOVDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmNiSGFuZENhcmREYXRhW2luZGV4XSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMuYkNvbXBhcmVTdGF0ZSA9IHBEYXRhLnJlYWRib29sKCk7XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5sQ3VycmVudFR1cm4gPSBwRGF0YS5yZWFkaW50KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1fbE1heENlbGxTY29yZSA9IHBsYXlTdGF0dXMubE1heENlbGxTY29yZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbENlbGxTY29yZSA9IHBsYXlTdGF0dXMubENlbGxTY29yZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbEN1cnJlbnRUaW1lcyA9IHBsYXlTdGF0dXMubEN1cnJlbnRUaW1lcztcbiAgICAgICAgICAgICAgICB0aGlzLm1fbEN1cnJlbnRUdXJuID0gcGxheVN0YXR1cy5sQ3VycmVudFR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5tX2xVc2VyTWF4U2NvcmUgPSBwbGF5U3RhdHVzLmxVc2VyTWF4U2NvcmU7XG4gICAgICAgICAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gcGxheVN0YXR1cy53QmFua2VyVXNlcjtcbiAgICAgICAgICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gcGxheVN0YXR1cy53Q3VycmVudFVzZXI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX2NiUGxheVN0YXR1c1tpbmRleF0gPSBwbGF5U3RhdHVzLmNiUGxheVN0YXR1c1tpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9iTG9va0NhcmRbaW5kZXhdID0gcGxheVN0YXR1cy5iTWluZ1podVtpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9sVGFibGVTY29yZVtpbmRleF0gPSBwbGF5U3RhdHVzLmxUYWJsZVNjb3JlW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGNhcmREYXRhID0gW11cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5NQVhfQ09VTlQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZERhdGFbaW5kZXhdID0gcGxheVN0YXR1cy5jYkhhbmRDYXJkRGF0YVtpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgPSAwO1xuXG4gICAgICAgICAgICAgICAgLy/lupXms6jkv6Hmga9cbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsU2NvcmUodGhpcy5tX2xDZWxsU2NvcmUpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENlbGxUdXJuKHRoaXMubV9sQ2VsbFNjb3JlLCB0aGlzLm1fbEN1cnJlbnRUdXJuLCB0aGlzLm1fbE1heFR1cm5Db3VudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0TWF4Q2VsbFNjb3JlKHRoaXMubV9sTWF4Q2VsbFNjb3JlKVxuXG4gICAgICAgICAgICAgICAgLy/luoTlrrbkv6Hmga9cbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRCYW5rZXIodGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRCh0aGlzLm1fd0JhbmtlclVzZXIpKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6KeG5Zu+5L2N572uXG4gICAgICAgICAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGkpO1xuICAgICAgICAgICAgICAgICAgICAvL+aJi+eJjOaYvuekulxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tpXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9nYW1lVmlldy5tX3VzZXJDYXJkW3ZpZXdJRF0uYXJlYS5hY3RpdmUgPSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSBteUNoYWlyICYmIHRoaXMubV9iTG9va0NhcmRbbXlDaGFpcl0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FyZEluZGV4ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB6amhfY21kLk1BWF9DT1VOVDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRJbmRleFtrXSA9IGNhcmREYXRhW2tdOy8vR2FtZUxvZ2ljLmdldENhcmRDb2xvcihjYXJkRGF0YVtrXSkgKiAxMyArIEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoY2FyZERhdGFba10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh2aWV3SUQsIGNhcmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh2aWV3SUQsIFsweGZmLDB4ZmYsMHhmZl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcudXNlckNhcmRbdmlld0lEXVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckNhcmQodmlld0lEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL+eci+eJjOaYvuekulxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRMb29rQ2FyZCh2aWV3SUQsIHRoaXMubV9iTG9va0NhcmRbaV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyVGFibGVTY29yZSh2aWV3SUQsIHRoaXMubV9sVGFibGVTY29yZVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgKz0gdGhpcy5tX2xUYWJsZVNjb3JlW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24odmlld0lELCB0aGlzLm1fbFRhYmxlU2NvcmVbaV0sIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5piv5ZCm5byD54mMXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW2ldICE9PSAxICYmIHRoaXMubV9sVGFibGVTY29yZVtpXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3LnVzZXJDYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyR2l2ZVVwKHZpZXdJRCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy/mgLvkuIvms6hcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRBbGxUYWJsZVNjb3JlKHRoaXMubV9sbEFsbFRhYmxlU2NvcmUpO1xuICAgICAgICAgICAgICAgIC8vdG9kb1xuICAgICAgICAgICAgICAgIGlmICggIXBsYXlTdGF0dXMuYkNvbXBhcmVTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRNZUNoYWlySUQoKSA9PT0gdGhpcy5tX3dDdXJyZW50VXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5tX3dDdXJyZW50VXNlciwgempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkUsIHpqaF9jbWQuVElNRV9VU0VSX0FERF9TQ09SRSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRNZUNoYWlySUQoKSA9PT0gdGhpcy5tX3dDdXJyZW50VXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/pgInmi6nnjqnlrrbmr5TniYxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wYXJlU3RhdHVzID0gW2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEgJiYgaSAhPT0gbXlDaGFpcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJlU3RhdHVzW3RoaXMuc3dpdGNoVmlld0NoYWlySUQoaSldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZCh0cnVlLCBjb21wYXJlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9VU0VSX0NPTVBBUkVfQ0FSRCwgempoX2NtZC5USU1FX1VTRVJfQ09NUEFSRV9DQVJEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENvbXBhcmVDYXJkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5pe26Ze0XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9ESVNBQkxFLCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FdmVudEdhbWVNZXNzYWdlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBzdWIgPSBwYXJhbXMuZGV0YWlsLnN1YjtcbiAgICAgICAgdmFyIHBEYXRhID0gcGFyYW1zLmRldGFpbC5wRGF0YTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkV2ZW50R2FtZU1lc3NhZ2VdIHBEYXRhIGxlbiA9IFwiICsgcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIGlmICghdGhpcy5fZXZlbnRHYW1lTWVzc2FnZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9ldmVudEdhbWVNZXNzYWdlQ2FsbGJhY2sgPSB7XG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfR0FNRV9TVEFSVF0gOiB0aGlzLm9uU3ViR2FtZVN0YXJ0LC8v5ri45oiP5byA5aeLXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfQUREX1NDT1JFXSA6IHRoaXMub25TdWJBZGRTY29yZSwvL+eUqOaIt+S4i+azqFxuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0xPT0tfQ0FSRF0gOiB0aGlzLm9uU3ViTG9va0NhcmQsLy/nnIvniYzmtojmga9cbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19DT01QQVJFX0NBUkRdIDogdGhpcy5vblN1YkNvbXBhcmVDYXJkLC8v5q+U54mM5raI5oGvXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfT1BFTl9DQVJEXSA6IHRoaXMub25TdWJPcGVuQ2FyZCwvL+W8gOeJjOa2iOaBr1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0dJVkVfVVBdIDogdGhpcy5vblN1YkdpdmVVcCwvL+eUqOaIt+aUvuW8g1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX1BMQVlFUl9FWElUXSA6IHRoaXMub25TdWJQbGF5ZXJFeGl0LC8v55So5oi35by66YCAXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfR0FNRV9FTkRdIDogdGhpcy5vblN1YkdhbWVFbmQsLy/muLjmiI/nu5PmnZ9cbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19XQUlUX0NPTVBBUkVdIDogdGhpcy5vblN1YldhaXRDb21wYXJlLFxuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0xBU1RfQUREXSA6IHRoaXMub25TdWJMYXN0QWRkLC8vXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFjayAmJiB0aGlzLl9ldmVudEdhbWVNZXNzYWdlQ2FsbGJhY2tbc3ViXSkge1xuICAgICAgICAgICAgdmFyIGZ1biA9IHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFja1tzdWJdO1xuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lTWVzc2FnZV0gc3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJHYW1lU3RhcnQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdXCIpO1xuICAgICAgICAvL+a4uOaIj+W8gOWni1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfR2FtZVN0YXJ0XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIC8v5LiL5rOo5L+h5oGvXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxNYXhTY29yZTtcdFx0XHRcdFx0XHRcdC8v5pyA5aSn5LiL5rOoXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDZWxsU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+WNleWFg+S4i+azqFxuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ3VycmVudFRpbWVzO1x0XHRcdFx0XHRcdC8v5b2T5YmN5YCN5pWwXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxVc2VyTWF4U2NvcmU7XHRcdFx0XHRcdFx0Ly/liIbmlbDkuIrpmZBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLfkv6Hmga9cbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0JhbmtlclVzZXI7XHRcdFx0XHRcdFx0Ly/luoTlrrbnlKjmiLdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdCBcdFx0XHRcdHdDdXJyZW50VXNlcjtcdFx0XHRcdFx0XHQvL+W9k+WJjeeOqeWutlxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdO1x0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBnYW1lU3RhcnQgPSB7fTtcbiAgICAgICAgZ2FtZVN0YXJ0LmxNYXhTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LmxDZWxsU2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgIGdhbWVTdGFydC5sQ3VycmVudFRpbWVzID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBnYW1lU3RhcnQubFVzZXJNYXhTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LndCYW5rZXJVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGdhbWVTdGFydC5jYlBsYXlTdGF0dXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGdhbWVTdGFydC5jYlBsYXlTdGF0dXNbaW5kZXhdID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViR2FtZVN0YXJ0XSBnYW1lU3RhcnQgPSBcIiArIEpTT04uc3RyaW5naWZ5KGdhbWVTdGFydCwgbnVsbCwgJyAnKSk7XG4gICAgICAgIHRoaXMubV9sTWF4U2NvcmUgPSBnYW1lU3RhcnQubE1heFNjb3JlO1xuICAgICAgICB0aGlzLm1fbENlbGxTY29yZSA9IGdhbWVTdGFydC5sQ2VsbFNjb3JlO1xuICAgICAgICB0aGlzLm1fbFVzZXJNYXhTY29yZSA9IGdhbWVTdGFydC5sVXNlck1heFNjb3JlO1xuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gZ2FtZVN0YXJ0LndDdXJyZW50VXNlcjtcbiAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gZ2FtZVN0YXJ0LndCYW5rZXJVc2VyO1xuICAgICAgICB0aGlzLm1faXNGaXJzdEFkZCA9IHRydWU7XG4gICAgICAgIHRoaXMubV9sQ3VycmVudFR1cm4gPSAwO1xuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUaW1lcyA9IDE7XG4gICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgPSAwO1xuICAgICAgICB0aGlzLm1faXNGbGxvd0Fsd2F5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9iTGFzdEFkZE92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSB0cnVlO1xuICAgICAgICAvL+aYvuekuuW6hOWutlxuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRCYW5rZXIodGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRCh0aGlzLm1fd0JhbmtlclVzZXIpKTtcbiAgICAgICAgLy/mmL7npLrlupXliIZcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q2VsbFNjb3JlKHRoaXMubV9sQ2VsbFNjb3JlKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q2VsbFR1cm4odGhpcy5tX2xDZWxsU2NvcmUsIHRoaXMubV9sQ3VycmVudFR1cm4sIHRoaXMubV9sTWF4VHVybkNvdW50KTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0TWF4Q2VsbFNjb3JlKHRoaXMubV9sTWF4Q2VsbFNjb3JlKTtcbiAgICAgICAgLy/mmL7npLrkuIvms6jnirbmgIFcblxuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuY2xlYW5BbGxKZXR0b25zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgd1ZpZXdDaGFpcklEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChpKTtcbiAgICAgICAgICAgIHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPSBnYW1lU3RhcnQuY2JQbGF5U3RhdHVzW2ldO1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlICs9IHRoaXMubV9sQ2VsbFNjb3JlO1xuICAgICAgICAgICAgICAgIHRoaXMubV9sVGFibGVTY29yZVtpXSA9IHRoaXMubV9sQ2VsbFNjb3JlO1xuICAgICAgICAgICAgICAgIC8v55So5oi35LiL5rOoXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUod1ZpZXdDaGFpcklELCB0aGlzLm1fbENlbGxTY29yZSk7XG4gICAgICAgICAgICAgICAgLy/np7vliqjnrbnnoIFcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24od1ZpZXdDaGFpcklELCB0aGlzLm1fbFRhYmxlU2NvcmVbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5oC76K6h5LiL5rOoXG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG4gICAgICAgIC8v5Y+R54mMXG4gICAgICAgIHZhciBkZWxheUNvdW50ID0gMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdIFt0aGlzLm1fd0JhbmtlclVzZXIsaix6amhfY21kLkdBTUVfUExBWUVSXSA9IFwiICsgW3RoaXMubV93QmFua2VyVXNlcixqLHpqaF9jbWQuR0FNRV9QTEFZRVJdKTtcbiAgICAgICAgICAgICAgICB2YXIgY2hhaXIgPSAodGhpcy5tX3dCYW5rZXJVc2VyICsgaikgJSAoempoX2NtZC5HQU1FX1BMQVlFUik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkdhbWVTdGFydF0gY2hhaXIgPSBcIiArIGNoYWlyKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tjaGFpcl0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2VuZENhcmQodGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChjaGFpciksIGksIGRlbGF5Q291bnQgKiAwLjEpO1xuICAgICAgICAgICAgICAgICAgICBkZWxheUNvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9VU0VSX0FERF9TQ09SRSwgempoX2NtZC5USU1FX1VTRVJfQUREX1NDT1JFKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyID09PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICBvblN1YkFkZFNjb3JlOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViQWRkU2NvcmVdXCIpO1xuICAgICAgICAvL+eUqOaIt+S4i+azqFxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfQWRkU2NvcmVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q3VycmVudFVzZXI7XHRcdFx0XHRcdFx0Ly/lvZPliY3nlKjmiLdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0FkZFNjb3JlVXNlcjtcdFx0XHRcdFx0XHQvL+WKoOazqOeUqOaIt1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29tcGFyZVN0YXRlO1x0XHRcdFx0XHRcdC8v5q+U54mM54q25oCBXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxBZGRTY29yZUNvdW50O1x0XHRcdFx0XHRcdC8v5Yqg5rOo5pWw55uuXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDdXJyZW50VGltZXM7XHRcdFx0XHRcdFx0Ly/lvZPliY3lgI3mlbBcbiAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4gICAgICAgIC8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxhc3RBZGRTY29yZTsgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuWtpOazqOS4gOaOt1xuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgYWRkU2NvcmUgPSB7fTtcbiAgICAgICAgYWRkU2NvcmUud0N1cnJlbnRVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgYWRkU2NvcmUud0FkZFNjb3JlVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGFkZFNjb3JlLndDb21wYXJlU3RhdGUgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICBhZGRTY29yZS5sQWRkU2NvcmVDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgYWRkU2NvcmUubEN1cnJlbnRUaW1lcyA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgYWRkU2NvcmUubEN1cnJlbnRUdXJuID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBhZGRTY29yZS5jYkxhc3RBZGRTY29yZSA9IHBEYXRhLnJlYWRieXRlKCk7XG5cbiAgICAgICAgdmFyIG15Q2hhaXIgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChhZGRTY29yZS53QWRkU2NvcmVVc2VyKTtcblxuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gYWRkU2NvcmUud0N1cnJlbnRVc2VyO1xuICAgICAgICBpZiAodGhpcy5tX2xDdXJyZW50VGltZXMgPCBhZGRTY29yZS5sQ3VycmVudFRpbWVzKSB7XG4gICAgICAgICAgICAvLyB0aGlzLl9nYW1lVmlldy5ydW5BZGRUaW1lc0FuaW1hdGUodmlld0lEKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUaW1lcyA9IGFkZFNjb3JlLmxDdXJyZW50VGltZXM7XG5cbiAgICAgICAgaWYgKGFkZFNjb3JlLndBZGRTY29yZVVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkZFNjb3JlLndBZGRTY29yZVVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnBsYXllckpldHRvbih2aWV3SUQsIGFkZFNjb3JlLmxBZGRTY29yZUNvdW50KTtcbiAgICAgICAgICAgIHRoaXMubV9sVGFibGVTY29yZVthZGRTY29yZS53QWRkU2NvcmVVc2VyXSArPSBhZGRTY29yZS5sQWRkU2NvcmVDb3VudDtcbiAgICAgICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgKz0gYWRkU2NvcmUubEFkZFNjb3JlQ291bnQ7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyVGFibGVTY29yZSh2aWV3SUQsIHRoaXMubV9sVGFibGVTY29yZVthZGRTY29yZS53QWRkU2NvcmVVc2VyXSk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRBbGxUYWJsZVNjb3JlKHRoaXMubV9sbEFsbFRhYmxlU2NvcmUpOyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZGRTY29yZS53Q29tcGFyZVN0YXRlID09PSAwICYmIHRoaXMubV93Q3VycmVudFVzZXIgPT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIHRoaXMubV9sQ3VycmVudFR1cm4gPSBhZGRTY29yZS5sQ3VycmVudFR1cm47XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsVHVybih0aGlzLm1fbENlbGxTY29yZSwgdGhpcy5tX2xDdXJyZW50VHVybiwgdGhpcy5tX2xNYXhUdXJuQ291bnQpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy/orr7nva7orqHml7blmahcbiAgICAgICAgaWYgKGFkZFNjb3JlLndDb21wYXJlU3RhdGUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQUREX1NDT1JFLCB6amhfY21kLlRJTUVfVVNFUl9BRERfU0NPUkUpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uU3ViTG9va0NhcmQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMb29rQ2FyZF1cIik7XG4gICAgICAgIC8v55yL54mM5pWw5o2u5YyFXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19Mb29rQ2FyZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdMb29rQ2FyZFVzZXI7XHRcdFx0XHRcdFx0Ly/nnIvniYznlKjmiLdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JDYXJkRGF0YVtNQVhfQ09VTlRdO1x0XHRcdFx0Ly/nlKjmiLfmiZHlhYtcbiAgICAgICAgLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBsb29rQ2FyZCA9IHt9O1xuICAgICAgICBsb29rQ2FyZC53TG9va0NhcmRVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgbG9va0NhcmQuY2JDYXJkRGF0YSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgIGxvb2tDYXJkLmNiQ2FyZERhdGFbaV0gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGxvb2tDYXJkLmNiTGFzdEFkZCA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMb29rQ2FyZF0gbG9va0NhcmQgPSBcIiArIEpTT04uc3RyaW5naWZ5KGxvb2tDYXJkLCBudWxsLCAnICcpKTtcbiAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQobG9va0NhcmQud0xvb2tDYXJkVXNlcik7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldExvb2tDYXJkKHZpZXdJRCwgdHJ1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMb29rQ2FyZF0gW2xvb2tDYXJkLndMb29rQ2FyZFVzZXIsdGhpcy5nZXRNZUNoYWlySUQoKV0gPSBcIiArIFtsb29rQ2FyZC53TG9va0NhcmRVc2VyLHRoaXMuZ2V0TWVDaGFpcklEKCldKTtcbiAgICAgICAgaWYgKGxvb2tDYXJkLndMb29rQ2FyZFVzZXIgPT0gdGhpcy5nZXRNZUNoYWlySUQoKSkge1xuICAgICAgICAgICAgdmFyIGNhcmRJbmRleCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2FyZEluZGV4W2ldID0gbG9va0NhcmQuY2JDYXJkRGF0YVtpXTsvL0dhbWVMb2dpYy5nZXRDYXJkQ29sb3IobG9va0NhcmQuY2JDYXJkRGF0YVtpXSkgKiAxMyArIEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUobG9va0NhcmQuY2JDYXJkRGF0YVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh2aWV3SUQsIGNhcmRJbmRleCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViQ29tcGFyZUNhcmQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJDb21wYXJlQ2FyZF1cIik7XG4gICAgICAgIC8v5q+U54mM5pWw5o2u5YyFXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19Db21wYXJlQ2FyZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDdXJyZW50VXNlcjtcdFx0XHRcdFx0XHQvL+W9k+WJjeeUqOaIt1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29tcGFyZVVzZXJbMl07XHRcdFx0XHRcdC8v5q+U54mM55So5oi3XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdMb3N0VXNlcjtcdFx0XHRcdFx0XHRcdC8v6L6T54mM55So5oi3XG4gICAgICAgIC8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuICAgICAgICAvLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMb3N0Q2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/ovpPlrrbniYzmlbDmja5cbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGNvbXBhcmVDYXJkID0ge307XG4gICAgICAgIGNvbXBhcmVDYXJkLndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGNvbXBhcmVDYXJkLndDb21wYXJlVXNlciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgY29tcGFyZUNhcmQud0NvbXBhcmVVc2VyW2ldID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wYXJlQ2FyZC53TG9zdFVzZXIgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICBjb21wYXJlQ2FyZC5sQ3VycmVudFR1cm4gPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgIGNvbXBhcmVDYXJkLmNiTG9zdENhcmREYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5NQVhfQ09VTlQ7IGkrKykge1xuICAgICAgICAgICAgY29tcGFyZUNhcmQuY2JMb3N0Q2FyZERhdGFbaV0gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tX3dDdXJyZW50VXNlciA9IGNvbXBhcmVDYXJkLndDdXJyZW50VXNlcjtcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IGNvbXBhcmVDYXJkLmxDdXJyZW50VHVybjtcbiAgICAgICAgdGhpcy5tX3dMb3N0VXNlciA9IGNvbXBhcmVDYXJkLndMb3N0VXNlcjtcbiAgICAgICAgdGhpcy5tX3dXaW5uZXJVc2VyID0gY29tcGFyZUNhcmQud0NvbXBhcmVVc2VyWzBdICsgY29tcGFyZUNhcmQud0NvbXBhcmVVc2VyWzFdIC0gdGhpcy5tX3dMb3N0VXNlcjtcbiAgICAgICAgdGhpcy5tX2NiUGxheVN0YXR1c1t0aGlzLm1fd0xvc3RVc2VyXSA9IDA7XG5cbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q29tcGFyZUNhcmQoZmFsc2UpO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsVHVybih0aGlzLm1fbENlbGxTY29yZSwgdGhpcy5tX2xDdXJyZW50VHVybiwgdGhpcy5tX2xNYXhUdXJuQ291bnQpO1xuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBmaXJzdFVzZXIgPSB0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVVc2VySXRlbSh0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVJRCgpLGNvbXBhcmVDYXJkLndDb21wYXJlVXNlclswXSk7XG4gICAgICAgIHZhciBzZWNvbmRVc2VyID0gdGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlVXNlckl0ZW0odGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlSUQoKSxjb21wYXJlQ2FyZC53Q29tcGFyZVVzZXJbMV0pO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5jb21wYXJlQ2FyZChmaXJzdFVzZXIsIHNlY29uZFVzZXIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wYXJlQ2FyZC53Q29tcGFyZVVzZXJbMF0gPT09IHRoaXMubV93V2lubmVyVXNlciwgZnVuY3Rpb24gbmFtZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHNlbGYub25GbHVzaENhcmRGaW5pc2goKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uRmx1c2hDYXJkRmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vdG9kb1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5zdG9wQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgdmFyIGNvdW50ID0gdGhpcy5nZXRQbGF5aW5nTnVtKCk7XG4gICAgICAgIGlmIChjb3VudCA+IDEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyID09PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb250cm9sKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQUREX1NDT1JFLCB6amhfY21kLlRJTUVfVVNFUl9BRERfU0NPUkUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG15Q2hhaXIgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbbXlDaGFpcl0gPT09IDEgfHwgbXlDaGFpciA9PT0gdGhpcy5tX3dMb3N0VXNlcikge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19GSU5JU0hfRkxBU0gsZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViT3BlbkNhcmQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJPcGVuQ2FyZF1cIik7XG4gICAgICAgIC8v5byA54mM5pWw5o2u5YyFXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19PcGVuQ2FyZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdXaW5uZXI7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeeUqOaIt1xuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW215Q2hhaXJdID09PSAxICYmICF0aGlzLm1fYkxhc3RBZGRPdmVyKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19GSU5JU0hfRkxBU0gsZGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViR2l2ZVVwOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViR2l2ZVVwXVwiKTtcbiAgICAgICAgLy/nlKjmiLfmlL7lvINcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0dpdmVVcFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdHaXZlVXBVc2VyO1x0XHRcdFx0XHRcdC8v5pS+5byD55So5oi3XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB3R2l2ZVVwVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHdHaXZlVXBVc2VyKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckdpdmVVcCh2aWV3SUQsIHRydWUpO1xuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzW3dHaXZlVXBVc2VyXSA9IDA7XG5cbiAgICAgICAgLy/otoXml7bmnI3liqHlmajoh6rliqjmlL7lvINcbiAgICAgICAgaWYgKHdHaXZlVXBVc2VyID09PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnN0b3BDb21wYXJlQ2FyZCgpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q29tcGFyZUNhcmQoZmFsc2UsdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViUGxheWVyRXhpdDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YlBsYXllckV4aXRdXCIpO1xuICAgICAgICAvL+eUqOaIt+mAgOWHulxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfUGxheWVyRXhpdFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdQbGF5ZXJJRDtcdFx0XHRcdFx0XHRcdC8v6YCA5Ye655So5oi3XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB3UGxheWVySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB2YXIgd1ZpZXdDaGFpcklEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRCh3UGxheWVySUQpO1xuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzW3dQbGF5ZXJJRF0gPSAwO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5tX05vZGVfcGxheWVyW3dWaWV3Q2hhaXJJRF0uYWN0aXZlID0gZmFsc2U7XG4gICAgfSxcbiAgICBvblN1YkdhbWVFbmQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lRW5kXVwiKTtcbiAgICAgICAgLy/muLjmiI/nu5PmnZ9cbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0dhbWVFbmRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsR2FtZVRheDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP56iO5pS2XG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxHYW1lU2NvcmVbR0FNRV9QTEFZRVJdO1x0XHRcdC8v5ri45oiP5b6X5YiGXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiQ2FyZERhdGFbR0FNRV9QTEFZRVJdW01BWF9DT1VOVF07XHQvL+eUqOaIt+aJkeWFi1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdWzRdO1x0XHQvL+avlOeJjOeUqOaIt1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RW5kU3RhdGU7XHRcdFx0XHRcdFx0XHQvL+e7k+adn+eKtuaAgVxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgd2lubmVyIDtcbiAgICAgICAgdmFyIGdhbWVFbmQgPSB7fTtcbiAgICAgICAgZ2FtZUVuZC5sR2FtZVRheCA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZUVuZC5sR2FtZVNjb3JlID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICBnYW1lRW5kLmxHYW1lU2NvcmVbaV0gPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICBpZiAoZ2FtZUVuZC5sR2FtZVNjb3JlW2ldID4gMCkge1xuICAgICAgICAgICAgICAgIHdpbm5lciA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZUVuZC5jYkNhcmREYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICBnYW1lRW5kLmNiQ2FyZERhdGFbaV0gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgempoX2NtZC5NQVhfQ09VTlQ7IGorKykge1xuICAgICAgICAgICAgICAgIGdhbWVFbmQuY2JDYXJkRGF0YVtpXVtqXSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2FtZUVuZC53Q29tcGFyZVVzZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGdhbWVFbmQud0NvbXBhcmVVc2VyW2ldID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGdhbWVFbmQud0NvbXBhcmVVc2VyW2ldW2pdID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnYW1lRW5kLndFbmRTdGF0ZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG5cbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgLy/muIXnkIbnlYzpnaJcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc3RvcENvbXBhcmVDYXJkKCk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENvbXBhcmVDYXJkKGZhbHNlKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2FtZVZpZXcubV9ub2RlQm90dG9tW2ldO1xuICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyAuLi4uLi5cbiAgICAgICAgXG4gICAgICAgIHZhciBlbmRTaG93O1xuICAgICAgICB2YXIgc2F2ZVR5cGUgPSBbXTtcbiAgICAgICAgLy/np7vliqjnrbnnoIFcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGkpO1xuICAgICAgICAgICAgaWYgKGdhbWVFbmQubEdhbWVTY29yZVtpXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChnYW1lRW5kLmxHYW1lU2NvcmVbaV0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJUYWJsZVNjb3JlKHZpZXdJRCwgZ2FtZUVuZC5sR2FtZVNjb3JlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcud2luVGhlQ2hpcCh2aWV3SUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUodmlld0lELGdhbWVFbmQubEdhbWVTY29yZVtpXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZW5kU2hvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcuXG4gICAgICAgICAgICAgICAgLy8uLi4uXG4gICAgICAgICAgICAgICAgLy8uLi4uLlxuICAgICAgICAgICAgICAgIHNhdmVUeXBlW2ldID0gR2FtZUxvZ2ljLmdldENhcmRUeXBlKGdhbWVFbmQuY2JDYXJkRGF0YVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzYXZlVHlwZVtpXSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUodmlld0lEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgd1VzZXJJRCA9IGdhbWVFbmQud0NvbXBhcmVVc2VyW215Q2hhaXJdW2ldO1xuICAgICAgICAgICAgaWYgKHdVc2VySUQgJiYgd1VzZXJJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRCh3VXNlcklEKTtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZEluZGV4ID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB6amhfY21kLk1BWF9DT1VOVDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRJbmRleFtrXSA9IGdhbWVFbmQuY2JDYXJkRGF0YVt3VXNlcklEXVtrXTsvL0dhbWVMb2dpYy5nZXRDYXJkQ29sb3IoZ2FtZUVuZC5jYkNhcmREYXRhW3dVc2VySURdW2tdKSAqIDEzICsgR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShnYW1lRW5kLmNiQ2FyZERhdGFbd1VzZXJJRF1ba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh2aWV3SUQsIGNhcmRJbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckNhcmRUeXBlKHZpZXdJRCwgc2F2ZVR5cGVbd1VzZXJJRF0pO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3ICAuLi4uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ2FtZUVuZC53Q29tcGFyZVVzZXJbbXlDaGFpcl1bMF0gIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSIHx8IHRoaXMubV9iTG9va0NhcmRbbXlDaGFpcl0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBjYXJkSW5kZXggPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgempoX2NtZC5NQVhfQ09VTlQ7IGsrKykge1xuICAgICAgICAgICAgICAgIGNhcmRJbmRleFtrXSA9IGdhbWVFbmQuY2JDYXJkRGF0YVtteUNoYWlyXVtrXTsvL0dhbWVMb2dpYy5nZXRDYXJkQ29sb3IoZ2FtZUVuZC5jYkNhcmREYXRhW215Q2hhaXJdW2tdKSAqIDEzICsgR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShnYW1lRW5kLmNiQ2FyZERhdGFbbXlDaGFpcl1ba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdmFyIG15Vmlld0lEIFxuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckNhcmQoempoX2NtZC5NWV9WSUVXSUQsIGNhcmRJbmRleCk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZFR5cGUoempoX2NtZC5NWV9WSUVXSUQsIHNhdmVUeXBlW215Q2hhaXJdKTtcbiAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3ICAuLi4uXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ2FtZUVuZC53RW5kU3RhdGUgPT0gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbbXlDaGFpcl0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tpXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhcmRJbmRleCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB6amhfY21kLk1BWF9DT1VOVDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZEluZGV4W2tdID0gZ2FtZUVuZC5jYkNhcmREYXRhW2ldW2tdOy8vR2FtZUxvZ2ljLmdldENhcmRDb2xvcihnYW1lRW5kLmNiQ2FyZERhdGFbaV1ba10pICogMTMgKyBHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGdhbWVFbmQuY2JDYXJkRGF0YVtpXVtrXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkKHZpZXdJRCwgY2FyZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkVHlwZSh2aWV3SUQsIHNhdmVUeXBlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3ICAuLi4uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZFNob3cpIHtcbiAgICAgICAgICAgIC8vIC4uLlxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3Lm1fQnV0dG9uX3JlYWR5Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5nZXRNZUNoYWlySUQoKSwgempoX2NtZC5JRElfU1RBUlRfR0FNRSwgempoX2NtZC5USU1FX1NUQVJUX0dBTUUpO1xuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzID0gWzAsMCwwLDAsMF07XG5cbiAgICB9LFxuICAgIG9uU3ViV2FpdENvbXBhcmU6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJXYWl0Q29tcGFyZV1cIik7XG4gICAgICAgIC8v562J5b6F5q+U54mMXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19XYWl0Q29tcGFyZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb21wYXJlVXNlcjtcdFx0XHRcdFx0XHQvL+avlOeJjOeUqOaIt1xuICAgICAgICAvLyB9OyBcbiAgICAgICAgdmFyIHdDb21wYXJlVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGlmICh3Q29tcGFyZVVzZXIgIT09IHRoaXMubV93Q3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJXYWl0Q29tcGFyZV0gd0NvbXBhcmVVc2VyICE9IG1fd0N1cnJlbnRVc2VyXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyICE9PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgIC8vICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9ESVNBQkxFLCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBvblN1Ykxhc3RBZGQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMYXN0QWRkXVwiKTtcbiAgICAgICAgLy/lraTms6jkuIDmjrdcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0xhc3RBZGRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXJ0TGFzdEFkZFVzZXI7XG4gICAgICAgIC8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdO1xuICAgICAgICAvLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyW0dBTUVfUExBWUVSXTtcbiAgICAgICAgLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjtcbiAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGxhc3RBZGQgPSB7fTtcbiAgICAgICAgbGFzdEFkZC53U3RhcnRMYXN0QWRkVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGxhc3RBZGQud0NvbXBhcmVVc2VyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICBsYXN0QWRkLndDb21wYXJlVXNlcltpXSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdEFkZC53TG9zdFVzZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGxhc3RBZGQud0xvc3RVc2VyW2ldID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0QWRkLndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGxhc3RBZGQubEN1cnJlbnRUdXJuID0gcERhdGEucmVhZGludCgpO1xuXG4gICAgICAgIHRoaXMubV9sQ3VycmVudFR1cm4gPSBsYXN0QWRkLmxDdXJyZW50VHVybjtcblxuICAgIH0sXG4gICAgb25DbGlja01lbnVPcGVuOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMubV9QYW5lbF9tZW51LmFjdGl2ZSA9IHRvZ2dsZS5pc0NoZWNrZWQ7XG4gICAgICAgIC8vIHRvZ2dsZS5ub2RlLnNldExvY2FsWk9yZGVyKDIpO1xuICAgICAgICAvLyB0aGlzLm1fUGFuZWxfbWVudS5zZXRMb2NhbFpPcmRlcigxKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VUYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUuc2VuZFNpdERvd25QYWNrZXQoR2xvYmFsRGVmLklOVkFMSURfVEFCTEUsR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpXG4gICAgfSxcbiAgICBvbkNsaWNrUXVpdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUuc2VuZFN0YW5kdXBQYWNrZXQoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICB9LFxuICAgIC8vIHNlbmREYXRhIDogZnVuY3Rpb24gKHN1YiwgZGF0YUJ1Zikge1xuICAgIC8vICAgICBpZiAodGhpcy5fZ2FtZUZyYW1lKSB7XG4gICAgLy8gICAgICAgICBkYXRhQnVmLnNldGNtZGluZm8oR2xvYmFsRGVmLk1ETV9HRl9HQU1FLCBzdWIpO1xuICAgIC8vICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTb2NrZXREYXRhKGRhdGFCdWYpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSxcbiAgICAvL+WKoOazqFxuICAgIG9uU2VuZEFkZFNjb3JlOiBmdW5jdGlvbiAobEN1cnJlbnRTY29yZSxiQ29tcGFyZUNhcmQpIHtcbiAgICAgICAgLy/nlKjmiLfliqDms6hcbiAgICAgICAgLy8gc3RydWN0IENNRF9DX0FkZFNjb3JlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFNjb3JlO1x0XHRcdFx0XHRcdFx0XHQvL+WKoOazqOaVsOebrlxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U3RhdGU7XHRcdFx0XHRcdFx0XHRcdC8v5b2T5YmN54q25oCBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhQnVmLnB1c2hpbnQobEN1cnJlbnRTY29yZSk7XG4gICAgICAgIGRhdGFCdWYucHVzaHdvcmQoYkNvbXBhcmVDYXJkICYmIDEgfHwgMCk7XG4gICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19BRERfU0NPUkUsZGF0YUJ1Zik7XG4gICAgfSxcbiAgICAvL+WPkemAgeWHhuWkh1xuICAgIG9uU3RhcnRHYW1lOiBmdW5jdGlvbiAoYlJlYWR5KSB7XG4gICAgICAgIHRoaXMub25SZXNldEdhbWVFbmdpbmUoKTtcbiAgICAgICAgaWYgKGJSZWFkeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZW5kVXNlclJlYWR5KCk7XG4gICAgICAgIH0gIFxuICAgIH0sXG4gICAgLy/oh6rliqjmr5TniYxcbiAgICBvbkF1dG9Db21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hhaXIgPSBteUNoYWlyIC0gaTtcbiAgICAgICAgICAgIGlmIChjaGFpciA8IDApIHtcbiAgICAgICAgICAgICAgICBjaGFpciArPSB6amhfY21kLkdBTUVfUExBWUVSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbY2hhaXJdID09IDEpIHtcbiAgICAgICAgICAgICAgICAvL+WPkemAgeavlOeJjOa2iOaBr1xuICAgICAgICAgICAgICAgIC8v5q+U54mM5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9DX0NvbXBhcmVDYXJkXG4gICAgICAgICAgICAgICAgLy8ge1x0XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NvbXBhcmVVc2VyO1x0XHRcdFx0XHRcdC8v5q+U54mM55So5oi3XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhQnVmLnB1c2h3b3JkKGNoYWlyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmREYXRhKHpqaF9jbWQuU1VCX0NfQ09NUEFSRV9DQVJELGRhdGFCdWYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICBcbiAgICB9LFxuICAgIC8v5q+U54mM5pON5L2cXG4gICAgb25Db21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGlmIChteUNoYWlyID09PSB1bmRlZmluZWQgfHwgbXlDaGFpciAhPT0gdGhpcy5tX3dDdXJyZW50VXNlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBsYXllckNvdW50ID0gdGhpcy5nZXRQbGF5aW5nTnVtKCk7XG5cbiAgICAgICAgaWYgKHBsYXllckNvdW50IDwgMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG5cbiAgICAgICAgdmFyIHNjb3JlID0gdGhpcy5tX2xDdXJyZW50VGltZXMgKiB0aGlzLm1fbENlbGxTY29yZSAqICh0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdICYmIDQgfHwgMik7XG5cbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW215Q2hhaXJdICs9IHNjb3JlO1xuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlICs9IHNjb3JlO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24oempoX2NtZC5NWV9WSUVXSUQsIHNjb3JlKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUoempoX2NtZC5NWV9WSUVXSUQsIHRoaXMubV9sVGFibGVTY29yZVtteUNoYWlyXSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG5cbiAgICAgICAgdGhpcy5vblNlbmRBZGRTY29yZShzY29yZSwgdHJ1ZSk7Ly/lj5HpgIHkuIvms6jmtojmga9cblxuICAgICAgICB2YXIgYkF1dG9Db21wYXJlID0gKHRoaXMuZ2V0UGxheWluZ051bSgpID09PSAyKTtcbiAgICAgICAgaWYgKCFiQXV0b0NvbXBhcmUpIHtcbiAgICAgICAgICAgIGJBdXRvQ29tcGFyZSA9ICh0aGlzLm1fd0JhbmtlclVzZXIgPT09IG15Q2hhaXIpICYmICh0aGlzLm1fbFRhYmxlU2NvcmVbbXlDaGFpcl0gLSBzY29yZSkgPT09IHRoaXMubV9sQ2VsbFNjb3JlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiQXV0b0NvbXBhcmUpIHtcbiAgICAgICAgICAgIHRoaXMub25BdXRvQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb21wYXJlU3RhdHVzID0gW2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEgJiYgaSAhPT0gbXlDaGFpcikge1xuICAgICAgICAgICAgICAgICAgICBjb21wYXJlU3RhdHVzW3RoaXMuc3dpdGNoVmlld0NoYWlySUQoaSldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZCh0cnVlLGNvbXBhcmVTdGF0dXMpO1xuICAgICAgICAgICAgLy8gLy/lj5HpgIHnrYnlvoXmr5TniYzmtojmga9cbiAgICAgICAgICAgIC8vIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAgICAgLy8gdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX1dBSVRfQ09NUEFSRSxkYXRhQnVmKTtcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQ09NUEFSRV9DQVJELCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNvbXBhcmVDaG9vc2U6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoIWluZGV4IHx8IGluZGV4ID09PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkNvbXBhcmVDaG9vc2VdIGluZGV4IGVycm9yXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25Db21wYXJlQ2hvb3NlXSBub3QgbV93Q3VycmVudFVzZXIgKG1fd0N1cnJlbnRVc2VyID0gXCIgKyB0aGlzLm1fd0N1cnJlbnRVc2VyICsgXCIgbXljaGFpciA9IFwiICsgbXlDaGFpcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpICE9PSBteUNoYWlyICYmIHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEgJiYgaW5kZXggPT09IHRoaXMuc3dpdGNoVmlld0NoYWlySUQoaSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG4gICAgICAgICAgICAgICAgLy/lj5HpgIHmr5TniYzmtojmga9cbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhQnVmLnB1c2h3b3JkKGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19DT01QQVJFX0NBUkQsZGF0YUJ1Zik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/mlL7lvIPmk43kvZxcbiAgICBvbkdpdmVVcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvL+WIoOmZpOiuoeaXtuWZqFxuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgLy/pmpDol4/mk43kvZzmjInpkq5cbiAgICAgICAgLy90aGlzLl9nYW1lVmlldyAuLi4uXG4gICAgICAgIC8v5Y+R6YCB5pWw5o2uXG4gICAgICAgIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnNlbmREYXRhKHpqaF9jbWQuU1VCX0NfR0lWRV9VUCwgZGF0YUJ1Zik7XG4gICAgfSxcblxuICAgIC8v5o2i5L2N5pON5L2cXG4gICAgb25DaGFuZ2VEZXNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kU2l0RG93blBhY2tldChHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSxHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikgXG4gICAgfSxcblxuICAgIC8v55yL54mM5pON5L2cXG4gICAgb25Mb29rQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25Mb29rQ2FyZF0gdHlwZVtteUNoYWlyLHRoaXMubV93Q3VycmVudFVzZXJdID0gXCIgKyBbdHlwZW9mKG15Q2hhaXIpLHR5cGVvZih0aGlzLm1fd0N1cnJlbnRVc2VyKV0pO1xuICAgICAgICBpZiAobXlDaGFpciA9PT0gdW5kZWZpbmVkfHwgbXlDaGFpciA9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyICE9IG15Q2hhaXIpIFxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX2JMb29rQ2FyZFtteUNoYWlyXSA9IHRydWU7XG4gICAgICAgIC8vIC4uLi5cbiAgICAgICAgLy8gLi4uLlxuICAgICAgICAvL+WPkemAgea2iOaBr1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uTG9va0NhcmRdIHNlbmREYXRhXCIpO1xuICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX0xPT0tfQ0FSRCwgZGF0YUJ1Zik7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/kuIvms6jmk43kvZxcbiAgICBhZGRTY29yZTogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgLy/muIXnkIbnlYzpnaJcbiAgICAgICAgLy/lupXpg6jmjInpkq5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2FtZVZpZXcubV9ub2RlQm90dG9tW2ldO1xuICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLy4uLi5cblxuICAgICAgICAvL+S4i+azqOmHkeminVxuICAgICAgICB2YXIgc2NvcmVJbmRleCA9ICghaW5kZXggJiYgMCB8fCBpbmRleCk7XG4gICAgICAgIHZhciBhZGRTY29yZSA9IHRoaXMubV9sQ2VsbFNjb3JlICogdGhpcy5tX2xDdXJyZW50VGltZXMgKyB0aGlzLm1fbENlbGxTY29yZSAqIHNjb3JlSW5kZXg7XG5cbiAgICAgICAgLy/nnIvniYzliqDlgI1cbiAgICAgICAgaWYgKHRoaXMubV9iTG9va0NhcmRbbXlDaGFpcl0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFkZFNjb3JlID0gYWRkU2NvcmUgKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW215Q2hhaXJdICs9IGFkZFNjb3JlO1xuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlICs9IGFkZFNjb3JlO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24oempoX2NtZC5NWV9WSUVXSUQsIGFkZFNjb3JlKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUoempoX2NtZC5NWV9WSUVXSUQsIHRoaXMubV9sVGFibGVTY29yZVtteUNoYWlyXSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG5cbiAgICAgICAgLy/lj5HpgIHmlbDmja5cbiAgICAgICAgdGhpcy5vblNlbmRBZGRTY29yZShhZGRTY29yZSwgZmFsc2UpO1xuICAgIH0sXG4gICAgLy/mm7TmlrDmjInpkq7mjqfliLZcbiAgICB1cGRhdGVDb250cm9sOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKG15Q2hhaXIgPT09IHVuZGVmaW5lZCB8fCBteUNoYWlyID09PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVt1cGRhdGVDb250cm9sXSBteWNoYWlyIGlzIGludmFsaWQgXCIgKyBteUNoYWlyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2dhbWVWaWV3Lm1fbm9kZUJvdHRvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b21baV07XG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL+eci+eJjOaMiemSrlxuICAgICAgICBpZiAoISB0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdKSB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5tX0J1dHRvbl9sb29rQ2FyZC5pbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcubV9CdXR0b25fbG9va0NhcmQuaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcubV9CdXR0b25fZ2l2ZVVwLmludGVyYWN0YWJsZSA9IHRydWU7XG4gICAgfSxcbiAgICAvLyAvL+eUqOaIt+avlOeJjFxuICAgIC8vIG9uU3ViQ29tcGFyZUNhcmQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgXG4gICAgLy8gfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2FtZVNlcnZlckl0ZW0gPSBjYy5DbGFzcyh7XG4gICAgd1NvcnRJRDogdW5kZWZpbmVkLFxuICAgIHdLaW5kSUQ6IHVuZGVmaW5lZCxcbiAgICB3U2VydmVySUQ6IHVuZGVmaW5lZCxcbiAgICB3U3RhdGlvbklEOiB1bmRlZmluZWQsXG4gICAgd1NlcnZlclBvcnQ6IHVuZGVmaW5lZCxcbiAgICBkd1NlcnZlckFkZHI6IHVuZGVmaW5lZCxcbiAgICBkd09uTGluZUNvdW50OiB1bmRlZmluZWQsXG4gICAgc3pTZXJ2ZXJOYW1lOiB1bmRlZmluZWQsXG4gICAgY3RvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT0qIEdhbWVTZXJ2ZXJJdGVtIGN0b3IgICo9PT09PVwiKVxuICAgICAgICB0aGlzLndTb3J0SUQgPSAwO1xuICAgICAgICB0aGlzLndLaW5kSUQgPSAwO1xuICAgICAgICB0aGlzLndTZXJ2ZXJJRCA9IDA7XG4gICAgICAgIHRoaXMud1N0YXRpb25JRCA9IDA7XG4gICAgICAgIHRoaXMud1NlcnZlclBvcnQgPSAwO1xuICAgICAgICB0aGlzLmR3U2VydmVyQWRkciA9IDA7XG4gICAgICAgIHRoaXMuZHdPbkxpbmVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gXCJcIjtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCI9PT09PSogR2FtZVNlcnZlckl0ZW0gb25Jbml0ICAqPT09PT1cIilcbiAgICAgICAgdGhpcy53U29ydElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U2VydmVySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTdGF0aW9uSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTZXJ2ZXJQb3J0ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1NlcnZlckFkZHIgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd09uTGluZUNvdW50ID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuc3pTZXJ2ZXJOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibGVuID0gXCIrcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHdoaWxlKHRydWUpe1xuICAgICAgICAgICAgLy/pu5jorqTkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX05VTExcdFx0XHRcdFx0MFx0XHRcdFx0XHRcdFx0XHQvL+aXoOaViOaVsOaNrlxuICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fTEVWRUxcdFx0MzAwMFx0XHRcdFx0XHRcdFx0Ly/miL/pl7TnrYnnuqdcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fQ0VMTFx0XHQzMDAxXHRcdFx0XHRcdFx0XHQvL+aIv+mXtOW6leWIhlxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9NSU5TQ09SRVx0MzAwMlx0XHRcdFx0XHRcdFx0Ly/miL/pl7TmnIDlsI/liIbmlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX0REWl9CT01CX01BWFx0MzAwM1x0XHRcdFx0XHRcdFx0Ly/mlpflnLDkuLvmnIDlpKflgI3mlbBcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fSU5GT1x0XHQzMDA0XHRcdFx0XHRcdFx0XHQvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHZhciBkYXRhU2l6ZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgdmFyIGRhdGFEZXNjcmliZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaXplID0gXCIrZGF0YVNpemUrXCIgZGVzY3JpYmUgPSBcIitkYXRhRGVzY3JpYmUpO1xuICAgICAgICAgICAgaWYgKGRhdGFEZXNjcmliZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHN3aXRjaChkYXRhRGVzY3JpYmUpe1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYlJvb21MZXZlbCA9IHBEYXRhLnJlYWRieXRlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubEJhc2VTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTGltaXRTY29yZSA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sTWF4Qm9tYkxpbWl0ID0gcERhdGEucmVhZGludCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN6RGVzY3JpYmVUeHQgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplLHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lU2VydmVySXRlbTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHYW1lVXNlckl0ZW0gPSBjYy5DbGFzcyh7XG4gICAgLy/nlKjmiLfkv6Hmga/nu5PmnoRcbiAgICAvLyBzdHJ1Y3QgdGFnVXNlckRhdGFcbiAgICAvLyB7XG4gICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdFx0Ly/kuIrkvKDlpLTlg49cbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHcm91cElEO1x0XHRcdFx0XHRcdFx0Ly/npL7lm6LntKLlvJVcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnrYnnuqdcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01hc3RlclJpZ2h0O1x0XHRcdFx0XHRcdC8v566h55CG5p2D6ZmQXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TmFtZVszMl07XHRcdFx0XHRcdC8v55So5oi35ZCN5a2XXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6R3JvdXBOYW1lWzMyXTtcdFx0XHRcdC8v56S+5Zui5ZCN5a2XXG4gICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6VW5kZXJXcml0ZVszMl07XHRcdC8v5Liq5oCn562+5ZCNXG4gICAgICAgIFxuICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLfmgKfliKtcbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlck9yZGVyO1x0XHRcdFx0XHRcdC8v5Lya5ZGY562J57qnXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNYXN0ZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+euoeeQhuetiee6p1xuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLfnp6/liIZcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+a2iOi0uemHkeW4gVxuICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxEcmF3Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+WSjOWxgOebmOaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgIFxuICAgIC8vICAgICAvL+eUqOaIt+eKtuaAgVxuICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDlj7fnoIFcbiAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgIFxuICAgIC8vICAgICAvL+WFtuS7luS/oeaBr1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiQ29tcGFuaW9uO1x0XHRcdFx0XHRcdC8v55So5oi35YWz57O7XG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3UHJvcFJlc2lkdWFsVGltZVsxNV07XHQvL+mBk+WFt+aXtumXtFxuICAgIC8vIH07XG4gICAgICAgIC8v55So5oi35bGe5oCnXG4gICAgd0ZhY2VJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4gICAgZHdDdXN0b21GYWNlVmVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG4gICAgZHdVc2VySUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuICAgIGR3R3JvdXBJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ekvuWboue0ouW8lVxuICAgIGR3R2FtZUlEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbiAgICBkd1VzZXJSaWdodDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnrYnnuqdcbiAgICBsTG92ZWxpbmVzczp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbiAgICBkd01hc3RlclJpZ2h0OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbmnYPpmZBcbiAgICBzek5hbWU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WQjeWtl1xuICAgIHN6R3JvdXBOYW1lOnVuZGVmaW5lZCwgICAgICAgICAgICAgLy/npL7lm6LlkI3lrZdcbiAgICBzelVuZGVyV3JpdGU6dW5kZWZpbmVkLCAgICAgIC8v5Liq5oCn562+5ZCNXG4gICAgXG4gICAgLy/nlKjmiLflsZ7mgKdcbiAgICBjYkdlbmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbiAgICBjYk1lbWJlck9yZGVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbiAgICBjYk1hc3Rlck9yZGVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbnrYnnuqdcbiAgICBcbiAgICAvL+eUqOaIt+enr+WIhlxuICAgIGxJbnN1cmVTY29yZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOi0uemHkeW4gVxuICAgIGxHYW1lR29sZDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgIGxTY29yZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgIGxXaW5Db3VudDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeebmOaVsFxuICAgIGxMb3N0Q291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0peebmOaVsFxuICAgIGxEcmF3Q291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+WSjOWxgOebmOaVsFxuICAgIGxGbGVlQ291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+aVsOebrlxuICAgIGxFeHBlcmllbmNlOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuICAgIFxuICAgIC8v55So5oi354q25oCBXG4gICAgd1RhYmxlSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4gICAgd0NoYWlySUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4gICAgY2JVc2VyU3RhdHVzOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG4gICAgXG4gICAgLy8gLy/lhbbku5bkv6Hmga9cbiAgICAvLyBjYkNvbXBhbmlvbjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflhbPns7tcbiAgICAvLyBkd1Byb3BSZXNpZHVhbFRpbWU6dW5kZWZpbmVkLCAvL+mBk+WFt+aXtumXtFxuICAgIGluaXREYXRhQnlVc2VySW5mb0hlYWQ6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICB2YXIgdXNlckluZm9IZWFkID0gdGhpcy5yZWFkVXNlckluZm9IZWFkKHBEYXRhKTtcbiAgICAgICAgdGhpcy5kd1VzZXJJRCA9IHVzZXJJbmZvSGVhZC5kd1VzZXJJRDtcbiAgICAgICAgdGhpcy53VGFibGVJRCA9IHVzZXJJbmZvSGVhZC53VGFibGVJRDtcbiAgICAgICAgdGhpcy53Q2hhaXJJRCA9IHVzZXJJbmZvSGVhZC53Q2hhaXJJRDtcbiAgICAgICAgdGhpcy5jYlVzZXJTdGF0dXMgPSB1c2VySW5mb0hlYWQuY2JVc2VyU3RhdHVzO1xuICAgICAgICB0aGlzLmR3VXNlclJpZ2h0ID0gdXNlckluZm9IZWFkLmR3VXNlclJpZ2h0O1xuICAgICAgICB0aGlzLmR3TWFzdGVyUmlnaHQgPSB1c2VySW5mb0hlYWQuZHdNYXN0ZXJSaWdodDtcbiAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy53RmFjZUlEID0gdXNlckluZm9IZWFkLndGYWNlSUQ7XG4gICAgICAgICAgICB0aGlzLmR3Q3VzdG9tRmFjZVZlciA9IHVzZXJJbmZvSGVhZC5kd0N1c3RvbUZhY2VWZXI7XG4gICAgICAgICAgICB0aGlzLmNiR2VuZGVyID0gdXNlckluZm9IZWFkLmNiR2VuZGVyO1xuICAgICAgICAgICAgdGhpcy5jYk1lbWJlck9yZGVyID0gdXNlckluZm9IZWFkLmNiTWVtYmVyT3JkZXI7XG4gICAgICAgICAgICB0aGlzLmNiTWFzdGVyT3JkZXIgPSB1c2VySW5mb0hlYWQuY2JNYXN0ZXJPcmRlcjtcbiAgICAgICAgICAgIHRoaXMuZHdHYW1lSUQgPSB1c2VySW5mb0hlYWQuZHdHYW1lSUQ7XG4gICAgICAgICAgICB0aGlzLmR3R3JvdXBJRCA9IHVzZXJJbmZvSGVhZC5kd0dyb3VwSUQ7XG4gICAgICAgICAgICB0aGlzLmxMb3ZlbGluZXNzID0gdXNlckluZm9IZWFkLmxMb3ZlbGluZXNzO1xuXG4gICAgICAgICAgICB0aGlzLmxTY29yZSA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxTY29yZTtcbiAgICAgICAgICAgIHRoaXMubEdhbWVHb2xkID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEdhbWVHb2xkO1xuICAgICAgICAgICAgdGhpcy5sSW5zdXJlU2NvcmUgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sSW5zdXJlU2NvcmU7XG4gICAgICAgICAgICB0aGlzLmxXaW5Db3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxXaW5Db3VudDtcbiAgICAgICAgICAgIHRoaXMubExvc3RDb3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxMb3N0Q291bnQ7XG4gICAgICAgICAgICB0aGlzLmxEcmF3Q291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRHJhd0NvdW50O1xuICAgICAgICAgICAgdGhpcy5sRmxlZUNvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEZsZWVDb3VudDtcbiAgICAgICAgICAgIHRoaXMubEV4cGVyaWVuY2UgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRXhwZXJpZW5jZTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSh0cnVlKXtcbiAgICAgICAgICAgIC8v6buY6K6k5L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9OVUxMXHRcdFx0XHRcdDBcdFx0XHRcdFx0XHRcdFx0Ly/ml6DmlYjmlbDmja5cbiAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lXHREVFBfVVNFUl9BQ0NPVU5UU1x0XHRcdDNcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfluJDlj7dcbiAgICAgICAgICAgIC8vICNkZWZpbmVcdERUUF9VTkRFUl9XUklURVx0XHRcdFx0OVx0XHRcdFx0XHRcdFx0XHQvL+S4quaAp+etvuWQjVxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfVVNFUl9HUk9VUF9OQU1FXHRcdFx0MzAxXHRcdFx0XHRcdFx0XHRcdC8v56S+5Zui5ZCN5a2XXG5cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICB2YXIgZGF0YVNpemUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIHZhciBkYXRhRGVzY3JpYmUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZSA9IFwiK2RhdGFTaXplK1wiIGRlc2NyaWJlID0gXCIrZGF0YURlc2NyaWJlKTtcbiAgICAgICAgICAgIGlmIChkYXRhRGVzY3JpYmUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICBzd2l0Y2goZGF0YURlc2NyaWJlKXtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3pOYW1lID0gXCLmuLjmiI/nlKjmiLdcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zek5hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pVbmRlcldyaXRlID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDE6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pHcm91cE5hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVhZFVzZXJJbmZvSGVhZDogZnVuY3Rpb24gKHBEYXRhKSB7XG4gICAgICAgIC8v55So5oi35Z+65pys5L+h5oGv57uT5p6EXG4gICAgICAgIC8vIHN0cnVjdCB0YWdVc2VySW5mb0hlYWRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R3JvdXBJRDtcdFx0XHRcdFx0XHRcdC8v56S+5Zui57Si5byVXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJSaWdodDtcdFx0XHRcdFx0XHQvL+eUqOaIt+etiee6p1xuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNYXN0ZXJSaWdodDtcdFx0XHRcdFx0XHQvL+euoeeQhuadg+mZkFxuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWVtYmVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNYXN0ZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+euoeeQhuetiee6p1xuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5Y+356CBXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIC8vICAgICB0YWdVc2VyU2NvcmVcdFx0XHRcdFx0XHRVc2VyU2NvcmVJbmZvO1x0XHRcdFx0XHRcdC8v56ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy/nlKjmiLfnp6/liIbkv6Hmga9cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ1VzZXJTY29yZVxuICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bFNjb3JlO1x0XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+WIhuaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5a2Y5YKo6YeR5biBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxXaW5Db3VudDtcdFx0XHRcdFx0XHRcdC8v6IOc5Yip55uY5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEZsZWVDb3VudDtcdFx0XHRcdFx0XHRcdC8v5pat57q/5pWw55uuXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v5omp5bGV5L+h5oGvXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5raI6LS56YeR5biBXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdFx0Ly/kuIrkvKDlpLTlg49cbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3UHJvcFJlc2lkdWFsVGltZVsxNV07XHQvL+mBk+WFt+aXtumXtFxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgdXNlckluZm9IZWFkID0ge307XG4gICAgICAgIHVzZXJJbmZvSGVhZC53RmFjZUlEID0gcERhdGEucmVhZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbiAgICAgICAgdXNlckluZm9IZWFkLmR3VXNlcklEID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd0dhbWVJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuICAgICAgICB1c2VySW5mb0hlYWQuZHdHcm91cElEID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ekvuWboue0ouW8lVxuICAgICAgICB1c2VySW5mb0hlYWQuZHdVc2VyUmlnaHQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+etiee6p1xuICAgICAgICB1c2VySW5mb0hlYWQubExvdmVsaW5lc3MgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbiAgICAgICAgdXNlckluZm9IZWFkLmR3TWFzdGVyUmlnaHQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbmnYPpmZBcbiAgICAgICAgXG4gICAgICAgIC8v55So5oi35bGe5oCnXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYkdlbmRlciA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbiAgICAgICAgdXNlckluZm9IZWFkLmNiTWVtYmVyT3JkZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuICAgICAgICB1c2VySW5mb0hlYWQuY2JNYXN0ZXJPcmRlciA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG562J57qnXG4gICAgICAgIFxuICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICB1c2VySW5mb0hlYWQud1RhYmxlSUQgPSBwRGF0YS5yZWFkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4gICAgICAgIHVzZXJJbmZvSGVhZC53Q2hhaXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbiAgICAgICAgdXNlckluZm9IZWFkLmNiVXNlclN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICBcbiAgICAgICAgLy/nlKjmiLfnp6/liIZcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8gPSB7fTtcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFNjb3JlID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sR2FtZUdvbGQgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YeR5biBXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/lrZjlgqjph5HluIFcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFdpbkNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubExvc3RDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubERyYXdDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEZsZWVDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEV4cGVyaWVuY2UgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcblxuICAgICAgICB1c2VySW5mb0hlYWQuZHdDdXN0b21GYWNlVmVyID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWktOWDj1xuICAgICAgICB1c2VySW5mb0hlYWQuZHdQcm9wUmVzaWR1YWxUaW1lID0gW107Ly/pgZPlhbfml7bpl7RcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IDE1OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgICAgICB1c2VySW5mb0hlYWQuZHdQcm9wUmVzaWR1YWxUaW1lLnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlckluZm9IZWFkO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVVc2VySXRlbTsiLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xudmFyIEdhbWVNb2RlbCA9IHJlcXVpcmUoXCJHYW1lTW9kZWxcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NlbGxUdXJuOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9hbGxTY29yZTogY2MuTGFiZWwsXG4gICAgICAgIG1fbm9kZUJvdHRvbToge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX1Byb2dyZXNzX3RpbWU6IGNjLlByb2dyZXNzQmFyLFxuICAgICAgICBtX0xhYmVsX3RpbWU6IGNjLkxhYmVsLFxuICAgICAgICBjYXJkUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgICAgIHVzZXJJbmZhY2VQcmVmYWI6IGNjLlByZWZhYixcbiAgICAgICAgbV9CdXR0b25fcmVhZHk6IGNjLkJ1dHRvbixcbiAgICAgICAgbV9CdXR0b25fbG9va0NhcmQ6IGNjLkJ1dHRvbixcbiAgICAgICAgbV9CdXR0b25fZ2l2ZVVwOiBjYy5CdXR0b24sXG4gICAgICAgIG1fTm9kZV9wbGF5ZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX2ZsYWdSZWFkeToge1xuICAgICAgICAgICAgZGVmYXVsdDpbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fdXNlckNhcmRQYW5lbDoge1xuICAgICAgICAgICAgZGVmYXVsdDpbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIHB0UGxheWVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OltdLFxuICAgICAgICAgICAgdHlwZTogY2MuVmVjMixcbiAgICAgICAgfSxcbiAgICAgICAgcHRCYW5rZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuVmVjMixcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV9iYW5rZXI6IGNjLk5vZGUsXG4gICAgICAgIG1fTG9va0NhcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fR2l2ZVVwOiB7XG4gICAgICAgICAgICBkZWZhdWx0OltdLFxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmUgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiR2FtZVNjZW5lXCIpO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY2VsbFR1cm4ubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NwZWVkID0gMC4xO1xuICAgICAgICAvL+eUqOaIt+WktOWDj1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHVzZXJOb2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VySW5mYWNlUHJlZmFiKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm5vZGVQbGF5ZXJcIikuYWRkQ2hpbGQodXNlck5vZGUpO1xuICAgICAgICAgICAgdGhpcy5tX05vZGVfcGxheWVyW2luZGV4XSA9IHVzZXJOb2RlO1xuICAgICAgICAgICAgdXNlck5vZGUuc2V0UG9zaXRpb24odGhpcy5wdFBsYXllcltpbmRleF0pO1xuICAgICAgICAgICAgdXNlck5vZGUucm90YXRpb24gPSBpbmRleCAqICgtOTApICsgMTgwO1xuICAgICAgICAgICAgdXNlck5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX3VzZXJDYXJkID0gW107XG4gICAgICAgIC8v55So5oi35omL54mMXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLm1fdXNlckNhcmRbaW5kZXhdID0ge307XG4gICAgICAgICAgICB0aGlzLm1fdXNlckNhcmRbaW5kZXhdLmNhcmQgPSBbXTtcbiAgICAgICAgICAgIC8v54mM5Yy65Z+fXG4gICAgICAgICAgICB2YXIgY2FyZFBhbmVsID0gdGhpcy5tX3VzZXJDYXJkUGFuZWxbaW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5tX3VzZXJDYXJkW2luZGV4XS5hcmVhID0gY2FyZFBhbmVsO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB6amhfY21kLk1BWF9DT1VOVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhcmROb2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5jYXJkUHJlZmFiKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fdXNlckNhcmRbaW5kZXhdLmNhcmRbal0gPSBjYXJkTm9kZTtcbiAgICAgICAgICAgICAgICBjYXJkUGFuZWwuYWRkQ2hpbGQoY2FyZE5vZGUpO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSXRlbSA9IGNhcmROb2RlLmdldENvbXBvbmVudChcIkNhcmRJdGVtXCIpO1xuICAgICAgICAgICAgICAgIGNhcmRJdGVtLnNob3dDYXJkQmFjaygpO1xuICAgICAgICAgICAgICAgIGNhcmROb2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5bqV6YOo5oyJ6ZKuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tX25vZGVCb3R0b20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5tX25vZGVCb3R0b21baV07XG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICB9LFxuICAgIG9uUmVzZXRWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fcmVhZHkubm9kZS5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubV9ub2RlQm90dG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMubV9ub2RlQm90dG9tW2ldO1xuICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEJhbmtlcihHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUik7XG4gICAgICAgIHRoaXMuc2V0QWxsVGFibGVTY29yZSgwKTtcbiAgICAgICAgdGhpcy5zZXRDb21wYXJlQ2FyZChmYWxzZSk7XG4gICAgICAgIHRoaXMuY2xlYW5BbGxKZXR0b25zKCk7XG4gICAgICAgIHRoaXMuc3RvcENvbXBhcmVDYXJkKCk7XG4gICAgICAgIHRoaXMuc2V0TWF4Q2VsbFNjb3JlKDApO1xuXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9va0NhcmQoaSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyQ2FyZFR5cGUoaSk7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJUYWJsZVNjb3JlKGksIDApO1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyR2l2ZVVwKGksIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlckNhcmQoaSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJDYXJkKGkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v5pu05paw5pe26ZKfXG4gICAgb25VcGRhdGVDbG9ja1ZpZXc6IGZ1bmN0aW9uICh2aWV3SUQsIHRpbWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVZpZXddW29uVXBkYXRlQ2xvY2tWaWV3XSBbdmlld0lELCB0aW1lXSA9IFwiICsgW3ZpZXdJRCwgdGltZV0pO1xuICAgICAgICBpZiAodGltZSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5wdFBsYXllclt2aWV3SURdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tX1Byb2dyZXNzX3RpbWUubm9kZS5zZXRQb3NpdGlvbih0aGlzLnB0UGxheWVyW3ZpZXdJRF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tX1Byb2dyZXNzX3RpbWUubm9kZS5zZXRQb3NpdGlvbigwLDYwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSAoMS4wKnRpbWUvempoX2NtZC5USU1FX1NUQVJUX0dBTUUpO1xuICAgICAgICB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdGltZS5zdHJpbmcgPSB0aW1lLnRvU3RyaW5nKCk7XG4gICAgfSxcbiAgICAvL+abtOaWsOeUqOaIt+aYvuekulxuICAgIG9uVXBkYXRlVXNlcjogZnVuY3Rpb24gKHZpZXdJRCwgdXNlckl0ZW0pIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh2aWV3SUQgPT09IHVuZGVmaW5lZCB8fCB2aWV3SUQgPT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lVmlld11bb25VcGRhdGVVc2VyXSB2aWV3SUQgaXMgdW5kZWZpbmVkIG9yIGludmFsaWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVZpZXddW29uVXBkYXRlVXNlcl0gdmlld0lEID0gXCIgKyB2aWV3SUQgKyBcIiB1c2VySXRlbSA9IFwiICsgSlNPTi5zdHJpbmdpZnkodXNlckl0ZW0sbnVsbCwgJyAnKSk7XG4gICAgICAgIHRoaXMubV9Ob2RlX3BsYXllclt2aWV3SURdLmFjdGl2ZSA9ICh1c2VySXRlbSAhPT0gdW5kZWZpbmVkKTtcbiAgICAgICAgaWYodXNlckl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMubV9mbGFnUmVhZHlbdmlld0lEXS5hY3RpdmUgPSAoR2xvYmFsRGVmLlVTX1JFQURZID09PSB1c2VySXRlbS5jYlVzZXJTdGF0dXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGlzLm1fZmxhZ1JlYWR5W3ZpZXdJRF0uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v54mM57G75Z6L5LuL57uN55qE5by55Ye65LiO5by55YWlXG4gICAgb25TaG93SW50cm9kdWNlOiBmdW5jdGlvbiAoYlNob3cpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvL+etueeggeenu+WKqFxuICAgIHBsYXllckpldHRvbjogZnVuY3Rpb24gKHdWaWV3Q2hhaXJJRCwgbnVtLCBub3RhbmkpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvL+WBnOatouavlOeJjOWKqOeUu1xuICAgIHN0b3BDb21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJjb21wYXJlVmlld1wiKS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8v5q+U54mMXG4gICAgY29tcGFyZUNhcmQ6IGZ1bmN0aW9uIChmaXJzdHVzZXIsc2Vjb25kdXNlcixmaXJzdGNhcmQsc2Vjb25kY2FyZCxiZmlyc3R3aW4sY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwiY29tcGFyZVZpZXdcIikuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5kZWxheVRpbWUoMS4wKSxjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KSkpO1xuICAgIH0sXG4gICAgLy/lupXms6jmmL7npLpcbiAgICBzZXRDZWxsU2NvcmU6IGZ1bmN0aW9uIChjZWxsU2NvcmUpIHtcbiAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSBjZWxsU2NvcmU7XG4gICAgICAgIGlmICghY2VsbFNjb3JlKSB7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldENlbGxUdXJuOiBmdW5jdGlvbiAoY2VsbFNjb3JlLCB0dXJuQ291bnQsIG1heFR1cm4pIHtcbiAgICAgICAgdmFyIHRleHQgPSBcIuW6leazqDpcIiArIGNlbGxTY29yZSArIFwiIOi9ruaVsDpcIiArICh0dXJuQ291bnQgKyAxKSArIFwiL1wiICsgbWF4VHVybjtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2NlbGxUdXJuLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2NlbGxUdXJuLnN0cmluZyA9IHRleHQ7XG4gICAgfSxcbiAgICAvL+WwgemhtuWIhuaVsFxuICAgIHNldE1heENlbGxTY29yZTogZnVuY3Rpb24gKGNlbGxTY29yZSkge1xuICAgICAgICBpZiAoIWNlbGxTY29yZSkge1xuICAgICAgICAgICAgLy90b2RvXG4gICAgICAgIH0gIFxuICAgICAgICBlbHNlIHtcblxuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+W6hOWutuaYvuekulxuICAgIHNldEJhbmtlcjogZnVuY3Rpb24gKHZpZXdJRCkge1xuICAgICAgICBpZiAoIXZpZXdJRCB8fCB2aWV3SUQgPT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgIHRoaXMubV9JbWFnZV9iYW5rZXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gIFxuICAgICAgICB0aGlzLm1fSW1hZ2VfYmFua2VyLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9JbWFnZV9iYW5rZXIuc2V0UG9zaXRpb24odGhpcy5wdEJhbmtlclt2aWV3SURdKTtcbiAgICB9LFxuICAgIC8v5LiL5rOo5oC76aKdXG4gICAgc2V0QWxsVGFibGVTY29yZTogZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgIGlmICghc2NvcmUgfHwgc2NvcmUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9hbGxTY29yZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX2FsbFNjb3JlLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9hbGxTY29yZS5zdHJpbmcgPSBzY29yZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/njqnlrrbkuIvms6hcbiAgICBzZXRVc2VyVGFibGVTY29yZTogZnVuY3Rpb24gKHZpZXdJRCwgc2NvcmUpIHtcbiAgICAgICAgaWYgKCFzY29yZSB8fCBzY29yZSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gaWYgKHZpZXdJRCAhPT0gKVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5Y+R54mMXG4gICAgc2VuZENhcmQ6IGZ1bmN0aW9uICh2aWV3SUQsIGluZGV4LCBmRGVsYXkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbdmlld0lELGluZGV4LGZEZWxheV0gPSBcIiArIFt2aWV3SUQsaW5kZXgsZkRlbGF5XSk7XG4gICAgICAgIGlmICghdmlld0lEIHx8IHZpZXdJRCA9PT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgXG4gICAgICAgIHZhciBmSW50ZXJ2YWwgPSAwLjE7XG4gICAgICAgIHZhciBub2RlQ2FyZCA9IHRoaXMubV91c2VyQ2FyZFt2aWV3SURdO1xuICAgICAgICB2YXIgc3ByaXRlQ2FyZCA9IG5vZGVDYXJkLmNhcmRbaW5kZXhdO1xuICAgICAgICB2YXIgY2FyZEl0ZW0gPSBzcHJpdGVDYXJkLmdldENvbXBvbmVudChcIkNhcmRJdGVtXCIpO1xuICAgICAgICBzcHJpdGVDYXJkLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHNwcml0ZUNhcmQuc2V0U2NhbGUoMS4wKTtcbiAgICAgICAgY2FyZEl0ZW0uc2hvd0NhcmRCYWNrKCk7XG4gICAgICAgIHNwcml0ZUNhcmQucnVuQWN0aW9uKFxuICAgICAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgY2MuZGVsYXlUaW1lKGZEZWxheSksXG4gICAgICAgICAgICAgICAgY2Muc3Bhd24oXG4gICAgICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oMC4yNSwxLjApLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgfSxcbiAgICAvL+eci+eJjOeKtuaAgVxuICAgIHNldExvb2tDYXJkOiBmdW5jdGlvbiAodmlld0lELCBiTG9vaykge1xuICAgICAgICAvLyBpZiAodmlld0lEID09PSB6amhfY21kLk1ZX1ZJRVdJRCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMubV9Mb29rQ2FyZFt2aWV3SURdLmFjdGl2ZSA9IGJMb29rO1xuICAgIH0sXG4gICAgLy/lvIPniYznirbmgIFcbiAgICBzZXRVc2VyR2l2ZVVwOiBmdW5jdGlvbiAodmlld0lELCBiR2l2ZXVwKSB7XG4gICAgICAgIC8vdG9kb1xuICAgICAgICB2YXIgbm9kZUNhcmQgPSB0aGlzLm1fdXNlckNhcmRbdmlld0lEXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSBub2RlQ2FyZC5jYXJkW2ldO1xuICAgICAgICAgICAgY2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fR2l2ZVVwW3ZpZXdJRF0uYWN0aXZlID0gYkdpdmV1cDtcbiAgICAgICAgaWYgKGJHaXZldXApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9va0NhcmQodmlld0lELCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5riF55CG54mMXG4gICAgY2xlYXJDYXJkOiBmdW5jdGlvbiAodmlld0lEKSB7XG4gICAgICAgIC8vdG9kb1xuICAgICAgICB2YXIgbm9kZUNhcmQgPSB0aGlzLm1fdXNlckNhcmRbdmlld0lEXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSBub2RlQ2FyZC5jYXJkW2ldO1xuICAgICAgICAgICAgY2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0dpdmVVcFt2aWV3SURdLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgLy/mmL7npLrniYzlgLxcbiAgICBzZXRVc2VyQ2FyZDogZnVuY3Rpb24gKHZpZXdJRCwgY2FyZERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVZpZXddW3NldFVzZXJDYXJkXVt2aWV3SUQsY2FyZERhdGFdID0gXCIgKyBbdmlld0lELGNhcmREYXRhXSk7XG4gICAgICAgIGlmICghdmlld0lEIHx8IHZpZXdJRCA9PT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FyZERhdGEpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5NQVhfQ09VTlQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjYXJkTm9kZSA9IHRoaXMubV91c2VyQ2FyZFt2aWV3SURdLmNhcmRbaV07XG4gICAgICAgICAgICAgICAgdmFyIGNhcmRJdGVtID0gY2FyZE5vZGUuZ2V0Q29tcG9uZW50KFwiQ2FyZEl0ZW1cIik7XG4gICAgICAgICAgICAgICAgY2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhcmREYXRhW2ldIHx8IGNhcmREYXRhW2ldID09PSAwIHx8IGNhcmREYXRhW2ldID09PSAweGZmKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRJdGVtLnNob3dDYXJkQmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXJkSXRlbS5zZXRDYXJkRGF0YShjYXJkRGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGNhcmRJdGVtLnNob3dDYXJkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tX3VzZXJDYXJkW3ZpZXdJRF0uY2FyZFtpXS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/mmL7npLrniYznsbvlnotcbiAgICBzZXRVc2VyQ2FyZFR5cGU6IGZ1bmN0aW9uICh2aWV3SUQsIGNhcmR0eXBlKSB7XG5cbiAgICB9LFxuICAgIC8v6LWi5b6X562556CBXG4gICAgd2luVGhlQ2hpcDogZnVuY3Rpb24gKHdXaW5uZXIpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvL+a4heeQhuetueeggVxuICAgIGNsZWFuQWxsSmV0dG9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICB9LFxuICAgIC8v5Y+W5raI5q+U54mM6YCJ5oupXG4gICAgc2V0Q29tcGFyZUNhcmQ6IGZ1bmN0aW9uIChiQ2hvb3NlLCBzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5iQ29tcGFyZUNob29zZSA9IGJDaG9vc2U7XG4gICAgICAgIC8vIHRvZG9cbiAgICB9LFxuICAgIC8v5oyJ6ZSu5ZON5bqUXG4gICAgb25TdGFydEdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmUub25TdGFydEdhbWUodHJ1ZSk7XG4gICAgICAgIC8vIHRoaXMubV9CdXR0b25fcmVhZHkubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uR2l2ZVVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLm9uR2l2ZVVwKCk7ICBcbiAgICB9LFxuICAgIG9uTG9va0NhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmUub25Mb29rQ2FyZCgpO1xuICAgIH0sXG4gICAgb25Db21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zY2VuZS5vbkNvbXBhcmVDYXJkKCk7ICBcbiAgICB9LFxuICAgIG9uQWRkU2NvcmU6IGZ1bmN0aW9uIChldmVudCxwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGFyYW1zKTtcbiAgICAgICAgdGhpcy5fc2NlbmUuYWRkU2NvcmUocGFyYW1zKTsgIFxuICAgIH0sXG4gICAgLy9cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgLy8gICAgIHZhciBwcm9ncmVzcyA9IHRoaXMubV9Qcm9ncmVzc190aW1lLnByb2dyZXNzO1xuICAgIC8vICAgICBpZiAocHJvZ3Jlc3MgPCAxLjAgJiYgdGhpcy5fcGluZykge1xuICAgIC8vICAgICAgICAgcHJvZ3Jlc3MgKz0gZHQgKiB0aGlzLl9zcGVlZDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNlIHtcbiAgICAvLyAgICAgICAgIHByb2dyZXNzIC09IGR0ICogdGhpcy5fc3BlZWQ7XG4gICAgLy8gICAgICAgICB0aGlzLl9waW5nID0gcHJvZ3Jlc3MgPD0gMDtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2YXIgdGltZSA9IE1hdGguY2VpbChwcm9ncmVzcyAqIDEwKTtcbiAgICAvLyAgICAgdGhpcy5tX1Byb2dyZXNzX3RpbWUucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAvLyAgICAgdGhpcy5tX0xhYmVsX3RpbWUuc3RyaW5nID0gdGltZS50b1N0cmluZygpO1xuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxEZWYgPSB7XG4gICAgTUFYX0NIQUlSOiAxMDAsXHRcdFx0XHRcdFx0XHRcdC8v4peKw5PCpcOb4oCcxZLil4rigJ1cbiAgICBNQVhfQ0hBSVJfTk9STUFMOiA4LFx0XHRcdFx0XHRcdFx0XHQvL+KXisOTwqXDm8K7w4DCoMudXG5cbiAgICBJTlZBTElEX1RBQkxFOiAweEZGRkYsXHRcdFx0XHRcdFx0Ly/Fku+sgeKAk8Of4peKwr/il4rigJ3iiKviiYhcbiAgICBJTlZBTElEX0NIQUlSOiAweEZGRkYsXHRcdFx0XHRcdFx0Ly/Fku+sgeKAk8Of4oCcxZLil4rigJ3iiKviiYhcbiAgICBJTlZBTElEX0lURU06IDB4RkZGRixcblxuICAgIEhNQVRDSF9QT1JUX01JTjogMTAwMDAsXHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjil4rDk+KAk8Kw4oiCw4DDuOKBhOKIq+KJiFxuICAgIEhNQVRDSF9QT1JUX01BWDogMjAwMDAsXHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjil4rDk8Klw5viiILDgMO44oGE4oir4omIXG4gICAgSE1BVENIX1NJR05fTUFYOiA5OSxcdFx0XHRcdFx0XHRcdFx0Ly/igJPCsMKgwrHCu8K4wrXigKLiiaXCsMKxwrvCu8K4wrHCruKImsuawrvDgMKgy53igKbFk8WT76yBXG4gICAgSE1BVENIX01BWE9OTElORTogNTAwLFxuXG4gICAgTUFYX0FORFJPSUQ6IDEwLFx0XHRcdFx0XHRcdFx0XHQvL+acgOWkp+acuuWZqFxuICAgIE1BWF9DSEFUX0xFTjogMTI4LFx0XHRcdFx0XHRcdFx0XHQvL+iBiuWkqemVv+W6plxuICAgIExJTUlUX0NIQVRfVElNRVM6IDEyMDAsXHRcdFx0XHRcdFx0XHQvL+mZkOaXtuiBiuWkqVxuICAgIC8v5q2j5byP5pyN5Yqh5Zmo5Zyw5Z2AXG4gICAgaHR0cEluaXRVcmw6IFwiaHR0cDovL3Zlci5qamhnYW1lLmNvbS9IYW5kbGUvaHovaW5pdC5hc2h4XCIsICAgLy9hcHDliJ3lp4vljJbmjqXlj6PlnLDlnYBcbiAgICBodHRwQmFzZVVybDogXCJodHRwOi8vaW50ZXJmYWNlLmpqaGdhbWUuY29tL0hhbmRsZVwiLCAgICAgICAgLy93ZWLmjqXlj6PlnLDlnYBcbiAgICBodHRwT3BlblVybDogXCJodHRwOi8vdXNlci5qamhnYW1lLmNvbS9maW5kcGFzc3dvcmRIWi5hc3B4XCIsICAvL+aJvuWbnuWvhueggVxuICAgIGh0dHBVc2VyQ2VudGVyOiBcImh0dHA6Ly9mLmpqaGdhbWUuY29tL0hhbmRsZVwiLCAgICAgICAgICAgICAgICAgIC8v55So5oi35Lit5b+DXG4gICAgTE9HT05fU0VSVkVSX0RPTUFJTjogXCJubmFwcC5qamhnYW1lLmNvbVwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leacjeWKoeWZqFxuICAgIExPR09OX1NFUlZFUl9JUDogXCIxMjIuMjI2LjE4Ni4zOFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leacjeWKoeWZqFxuICAgIFBPUlRfTE9HT05fU0VSVkVSOiA5MDA5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+mZhuacjeWKoeWZqFxuXG4vL+err+WPo+WumuS5iVxuICAgIFBPUlRfVklERU9fU0VSVkVSOiA3NjAwLFx0XHRcdFx0XHRcdFx0XHQvL+inhumikeacjeWKoeWZqFxuICAgIFBPUlRfQ0VOVEVSX1NFUlZFUjogOTA5MCxcdFx0XHRcdFx0XHRcdFx0Ly/kuK3lv4PmnI3liqHlmahcblxuICAgIENIQU5ORUxJRF9pbml0OiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rig6YGT5Y+3XG4gICAgQ0hBTk5FTElEX2NlbnRlcjogNywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4oOmBk+WPt1xuLy/nvZHnu5zmlbDmja7lrprkuYlcbiAgICBTT0NLRVRfVkVSOiAweDhDLFx0XHRcdFx0XHRcdFx0XHQvL+e9kee7nOeJiOacrFxuICAgIFNPQ0tFVF9CVUZGRVI6IDgxOTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e9kee7nOe8k+WGslxuICAgIFNPQ0tFVF9QQUNLRVQ6IDgxOTIsXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLy/lhoXmoLjlkb3ku6TnoIFcbiAgICBNRE1fS05fQ09NTUFORDogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YaF5qC45ZG95LukXG4gICAgU1VCX0tOX0RFVEVDVF9TT0NLRVQ6IDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ajgOa1i+WRveS7pFxuICAgIFNVQl9LTl9TSFVUX0RPV05fU09DS0VUOiA5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuK3mlq3nvZHnu5xcblxuICAgIC8vSVBDIOaVsOaNruWumuS5iVxuICAgIElQQ19WRVI6IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lQQyDniYjmnKxcbiAgICBJUENfSURFTlRJRklFUjogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qCH6K+G5Y+356CBXG4gICAgSVBDX1BBQ0tBR0U6IDQwOTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOWkpyBJUEMg5YyFXG4gICAgSVBDX0JVRkZFUjogNDA5NiwgICAgLy/nvJPlhrLplb/luqZcblxuICAgIFRZUEVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/Dt8O3wr/igKHiiaXCp+KIgsK7XG4gICAgS0lORF9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K/4oCh4oCTw5XiiaXCp+KIgsK7XG4gICAgU1RBVElPTl9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAmcOmwrXigJ7iiaXCp+KIgsK7XG4gICAgU0VSVkVSX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiRw7jCuuKAsOKJpcKn4oiCwrtcbiAgICBNT0RVTEVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/OqcKv4omlw4PiiaXCp+KIgsK7XG5cbiAgICAvL+KAk+KAmMKx76O/4oiCwq7igJzDglxuICAgIEdFTkRFUl9OVUxMOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/FksKlw7fihKLigJPigJjCse+jv1xuICAgIEdFTkRFUl9CT1k6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8aS4oCT4oCT4oCY4oCT4oCYwrHvo79cbiAgICBHRU5ERVJfR0lSTDogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4omIw4bigJPigJjigJPigJjCse+jv1xuXG4gICAgLy/igJ3FksWT4oiRwr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfU0NPUkU6IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K14oCew7fCtcK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX0dPTEQ6IDB4MDAwMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K/w7fiiILPgMK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX01BVENIOiAweDAwMDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/CscK7wrvCuMK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX0VEVUNBVEU6IDB4MDAwOCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAlMK1wqHiiJHCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9RVEhFUk1BVENIOiAweDAwMTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/oh6rlrprkuYnmr5TotZvnsbvlnotcblxuICAgIC8v4oCd4oiawqrDn+KXisKlw4PCqOKIgsKu4oCcw4JcbiAgICBVU19OVUxMOiAweDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/msqHmnInnirbmgIFcbiAgICBVU19GUkVFOiAweDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nq5nnq4vnirbmgIFcbiAgICBVU19TSVQ6IDB4MDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+eKtuaAgVxuICAgIFVTX1JFQURZOiAweDAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkIzmhI/nirbmgIFcbiAgICBVU19MT09LT046IDB4MDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeingueKtuaAgVxuICAgIFVTX1BMQVk6IDB4MDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuICAgIFVTX09GRkxJTkU6IDB4MDYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+eKtuaAgVxuXG4gICAgLy/iiaXCp+KIgsK74oirw43iiILCruKAnMOCXG4gICAgTkFNRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KImsua4peKw7fiiaXCp+KIgsK7XG4gICAgUEFTU19MRU46IDMzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KImuKAucKsw47iiaXCp+KIgsK7XG4gICAgRU1BSUxfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igJ3CoMWT4oCw4omlwqfiiILCu1xuICAgIEdST1VQX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCmw4HDleKJiOKJpcKn4oiCwrtcbiAgICBDT01QVVRFUl9JRF9MRU46IDMzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8Kqy5niiIbLnOKAk8OawqHigJNcbiAgICBVTkRFUl9XUklURV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KIj8uG4oCT4oCYwqvCqeKImsuaXG4gICAgTU9CSUxFUEhPTkVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiI/LhuKAk+KAmMKrwqniiJrLmlxuXG4gICAgLy9HbG9iYWxGcmFtZS5oXG4gICAgLy/lro/lrprkuYlcblxuICAgIC8v5ri45oiP54q25oCBXG4gICAgR1NfRlJFRTogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nqbrpl7LnirbmgIFcbiAgICBHU19QTEFZSU5HOiAxMDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL0lQQyDnvZHnu5zkuovku7ZcblxuICAgIElQQ19NQUlOX1NPQ0tFVDogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5zmtojmga9cblxuICAgIElQQ19TVUJfU09DS0VUX1NFTkQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc5Y+R6YCBXG4gICAgSVBDX1NVQl9TT0NLRVRfUkVDVjogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5zmjqXmlLZcblxuICAgIElQQ19NQUlOX0NPTkZJRzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/phY3nva7kv6Hmga9cblxuICAgIElQQ19TVUJfU0VSVkVSX0lORk86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgSVBDX1NVQl9DT0xVTU5fSU5GTzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajkv6Hmga9cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy9JUEMg55So5oi35L+h5oGvXG5cbiAgICBJUENfTUFJTl9VU0VSOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG4gICAgSVBDX1NVQl9VU0VSX0NPTUU6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG4gICAgSVBDX1NVQl9VU0VSX1NUQVRVUzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICBJUENfU1VCX1VTRVJfU0NPUkU6IDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi356ev5YiGXG4gICAgSVBDX1NVQl9HQU1FX1NUQVJUOiA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuICAgIElQQ19TVUJfR0FNRV9GSU5JU0g6IDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57uT5p2fXG4gICAgSVBDX1NVQl9VUERBVEVfRkFDRTogNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDlpLTlg49cbiAgICBJUENfU1VCX01FTUJFUk9SREVSOiA3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOWktOWDj1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL0lQQyDmjqfliLbkv6Hmga9cblxuICAgIElQQ19NQUlOX0NPTkNUUk9MOiA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aOp+WItuS/oeaBr1xuXG4gICAgSVBDX1NVQl9TVEFSVF9GSU5JU0g6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZCv5Yqo5a6M5oiQXG4gICAgSVBDX1NVQl9DTE9TRV9GUkFNRTogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63moYbmnrZcbiAgICBJUENfU1VCX0pPSU5fSU5fR0FNRTogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDlhaXmuLjmiI9cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy/nvZHnu5zlkb3ku6TnoIFcblxuICAgIE1ETV9HRl9HQU1FOiA5OSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+a2iOaBr1xuICAgIE1ETV9HRl9GUkFNRTogOTgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYbmnrbmtojmga9cbiAgICBNRE1fR0ZfUFJFU0VOVDogOTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npLznianmtojmga9cbiAgICBNRE1fR0ZfQkFOSzogOTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pk7booYzmtojmga9cblxuICAgIFNVQl9HRl9JTkZPOiAxMTEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+S/oeaBr1xuICAgIFNVQl9HRl9VU0VSX1JFQURZOiAxMTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WQjOaEj1xuICAgIFNVQl9HRl9MT09LT05fQ09OVFJPTDogMTEzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml4Hop4LmjqfliLZcbiAgICBTVUJfR0ZfS0lDS19UQUJMRV9VU0VSOiAxMTQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i4oui1sOeUqOaIt1xuICAgIFNVQl9HRl9XUklURV9NQVRDSF9TQ09SRTogMTE1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhpnmr5TotZvmiJDnu6lcblxuICAgIFNVQl9HRl9PUFRJT046IDExNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YWN572uXG4gICAgU1VCX0dGX1NDRU5FOiAxMTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WcuuaZr+S/oeaBr1xuXG4gICAgU1VCX0dGX1VTRVJfQ0hBVDogMTE4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfogYrlpKlcblxuICAgIFNVQl9HRl9NRVNTQUdFOiAxMTksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4gICAgLy9TVUJfR0ZfR0lGVDogNDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otaDpgIHmtojmga9cblxuICAgIFNVQl9HRl9CQU5LX1NUT1JBR0U6IDI1MCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZO26KGM5a2Y5YKoXG4gICAgU1VCX0dGX0JBTktfR0VUOiAyNTEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mTtuihjOaPkOWPllxuICAgIFNVQl9HRl9CQU5LX1BSRVNFTlQ6IDI1MiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCB6YeR5biBXG4gICAgU1VCX0dGX0JBTktfTU9ESUZZX1BBU1M6IDI1MywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+u5pS55a+G56CBXG4gICAgU1VCX0dGX0JBTktfUVVFUlk6IDI1NCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6YeR5biBXG4gICAgU1VCX0dGX0JBTktfUFJFU0VOVF9RVVJFWTogMjU1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6LnlKjmiLdcbiAgICBTVUJfR0ZfQkFOS19DTE9TRTogMjU2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgIDlh7pcbiAgICBTVUJfR0ZfVFJBTl9SRUNPUkQ6IDI1NywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L2s5biQ6K6w5b2VXG4gICAgU1VCX0dGX1VTRVJfSU5GT19RVVJFWTogMjU4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6LnlKjmiLdcbiAgICBTVUJfR0ZfVVNFUl9SRUNIQVJHRTogMjU5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflhYXlgLxcblxuICAgIFNVQl9HRl9GTE9XRVJfQVRUUklCVVRFOiA1MzAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mynOiKseWxnuaAp1xuICAgIFNVQl9HRl9GTE9XRVI6IDUzMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6bKc6Iqx5raI5oGvXG4gICAgU1VCX0dGX0VYQ0hBTkdFX0NIQVJNOiA1MzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFkeaNoumtheWKm1xuXG4gICAgU1VCX0dGX1BST1BFUlRZOiA1MTAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mBk+WFt+a2iOaBr1xuICAgIFNVQl9HRl9QUk9QRVJUWV9SRVNVTFQ6IDUxMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YGT5YW357uT5p6cXG4gICAgU1VCX0dGX1JFU0lEVUFMX1BST1BFUlRZOiA1MTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WJqeS9memBk+WFt1xuICAgIFNVQl9HRl9QUk9QX0FUVFJJQlVURTogNTEzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgZPlhbflsZ7mgKdcbiAgICBTVUJfR0ZfUFJPUF9CVUdMRTogNTE0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lloflj63pgZPlhbdcbiAgICBTVUJfR0ZfUVVFUllfVVNFUl9JTkZPOiA1MTUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mynOiKsea2iOaBr1xuICAgIFNVQl9HRl9TRU5EX0hPTkdfQkFPOiA1MTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkee6ouWMhVxuICAgIFNVQl9HRl9RSUFOR19IT05HX0JBTzogNTE3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HnuqLljIVcblxuICAgIC8v5raI5oGv57G75Z6LXG4gICAgU01UX0lORk86IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG4gICAgU01UX0VKRUNUOiAweDAwMDIsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xuICAgIFNNVF9HTE9CQUw6IDB4MDAwNCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWo5bGA5raI5oGvXG4gICAgU01UX0NMT1NFX0dBTUU6IDB4MTAwMCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5ri45oiPXG5cbiAgICAvL+WPkemAgeWcuuaJgFxuICAgIExPQ0FUSU9OX0dBTUVfUk9PTTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/miL/pl7RcbiAgICBMT0NBVElPTl9QTEFaQV9ST09NOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheaIv+mXtFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbERlZjtcbiIsInJlcXVpcmUoXCJNRDVcIik7XG5mdW5jdGlvbiBBY3Rpb25TaG93VGFuQ2h1YW5nKHdpZGdldCwgY2Ipe1xuICAgIGlmIChjYy5pc1ZhbGlkKHdpZGdldCkgPT09IGZhbHNlICkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxGdW5dW0FjdGlvblNob3dUYW5DaHVhbmddIHdpZGdldCBpcyBpbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHdpZGdldC5vcGFjaXR5ID0gMDtcbiAgICB3aWRnZXQuc2NhbGUgPSAwLjAxO1xuICAgIHdpZGdldC5ydW5BY3Rpb24oY2Muc3Bhd24oXG4gICAgICAgICAgICBjYy5mYWRlSW4oMC4yNSksXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMS4xKSxjYy5zY2FsZVRvKDAuMDUsIDEuMCkpLGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNiKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICApKTtcbn1cbmZ1bmN0aW9uIHNob3dUb2FzdChjb250ZXh0LG1lc3NhZ2UpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9Ub2FzdFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgVG9hc3RQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoVG9hc3RQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJUb2FzdFZpZXdcIikub25Jbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBBY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93VG9hc3RcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0FsZXJ0KGNvbnRleHQsbWVzc2FnZSkge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL0FsZXJ0Vmlld1wiLCBmdW5jdGlvbiAoZXJyLCBBbGVydFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShBbGVydFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkFsZXJ0Vmlld1wiKS5pbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dBbGVydFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLypcbnNob3dQb3BXYWl0aW5nKClcbkBwYXJhbXN7XG4gICAgd2FpdGluZ1RleHQ6IOeVjOmdouaYvuekuueahOaWh+WtlyxcbiAgICB3YWl0aW5nVGltZTog55WM6Z2i5a2Y5Zyo55qE5pe26Ze0LOi2heaXtuWNs+mUgOavgeeVjOmdoixcbiAgICBjbG9zZUV2ZW50OiDlhbPpl63nlYzpnaLnm5HlkKznmoTkuovku7YsIFxuICAgIGNhbGxCYWNrRnVuYzog5pS25Yiw55uR5ZCs5LqL5Lu25omn6KGM55qE5Zue6LCD5Ye95pWwLFxufVxuKi9cbmZ1bmN0aW9uIHNob3dQb3BXYWl0aW5nKGNvbnRleHQscGFyYW1zKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvUG9wV2FpdGluZ1ZpZXdcIiwgZnVuY3Rpb24gKGVyciwgUG9wV2FpdFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShQb3BXYWl0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiUG9wV2FpdFZpZXdcIikub25Jbml0KHBhcmFtcyk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd1BvcFdhaXRpbmdcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0c2lnbihwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgKyBcImtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiOy8v5Yqg5YWla2V5XG4gICAgcmV0dXJuIGNjLm1kNUVuY29kZShwYXJhbXMpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcykge1xuICAgIHZhciBub3dUaW1lID0gTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApO1xuICAgIHBhcmFtc1tcImRhdGV0YW1wXCJdID0gbm93VGltZTtcbiAgICB2YXIgc29ydF9wYXJhbXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpLnNvcnQoKVxuICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbEZ1bl1bYnVpbGRSZXF1ZXN0UGFyYW1dIFwiICsgSlNPTi5zdHJpbmdpZnkocGFyYW1zLG51bGwsJyAnKSk7XG4gICAgdmFyIHBhcmFtU3RyaW5nID0gXCJcIjtcbiAgICBmb3IgKHZhciBraSBpbiBzb3J0X3BhcmFtcykge1xuICAgICAgICB2YXIga2V5ID0gc29ydF9wYXJhbXNba2ldO1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBwYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nICsga2V5ICsgXCI9XCIgKyBlbGVtZW50ICsgXCImXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZyArIFwic2lnbj1cIiArIGdldHNpZ24ocGFyYW1TdHJpbmcpO1xuICAgIHJldHVybiBwYXJhbVN0cmluZztcbn1cblxuZnVuY3Rpb24gaXBUb051bWJlcihpcCkge1xuXHR2YXIgbnVtID0gMDtcblx0aWYoaXAgPT0gXCJcIikge1xuXHRcdHJldHVybiBudW07XG5cdH0gICAgXG4gICAgdmFyIGFOdW0gPSBpcC5zcGxpdChcIi5cIik7IFxuICAgIGlmKGFOdW0ubGVuZ3RoICE9IDQpIHtcbiAgICBcdHJldHVybiBudW07XG4gICAgfSAgIFxuICAgIG51bSArPSBwYXJzZUludChhTnVtWzBdKSA8PCAyNDtcbiAgICBudW0gKz0gcGFyc2VJbnQoYU51bVsxXSkgPDwgMTY7XG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bMl0pIDw8IDg7XG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bM10pIDw8IDA7XG4gICAgbnVtID0gbnVtID4+PiAwOy8v6L+Z5Liq5b6I5YWz6ZSu77yM5LiN54S25Y+v6IO95Lya5Ye6546w6LSf5pWw55qE5oOF5Ya1XG4gICAgcmV0dXJuIG51bTsgIFxufSAgICBcbiAgXG5mdW5jdGlvbiBudW1iZXJUb0lwKG51bWJlcikgeyAgICBcbiAgICB2YXIgaXAgPSBcIlwiO1xuICAgIGlmKG51bWJlciA8PSAwKSB7XG4gICAgXHRyZXR1cm4gaXA7XG4gICAgfVxuICAgIHZhciBpcDMgPSAobnVtYmVyIDw8IDAgKSA+Pj4gMjQ7XG4gICAgdmFyIGlwMiA9IChudW1iZXIgPDwgOCApID4+PiAyNDtcbiAgICB2YXIgaXAxID0gKG51bWJlciA8PCAxNikgPj4+IDI0O1xuICAgIHZhciBpcDAgPSAobnVtYmVyIDw8IDI0KSA+Pj4gMjRcbiAgICBcbiAgICBpcCArPSBpcDAgKyBcIi5cIiArIGlwMSArIFwiLlwiICsgaXAyICsgXCIuXCIgKyBpcDM7XG4gICAgXG4gICAgcmV0dXJuIGlwOyAgIFxufVxuLy/mlbDlrZfloavlhYXliY3nvIAwXG5mdW5jdGlvbiBQcmVmaXhJbnRlZ2VyKG51bSwgbGVuZ3RoKSB7XG4gICAgcmV0dXJuIChBcnJheShsZW5ndGgpLmpvaW4oJzAnKSArIG51bSkuc2xpY2UoLWxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFjdGlvblNob3dUYW5DaHVhbmc6IEFjdGlvblNob3dUYW5DaHVhbmcsXG4gICAgc2hvd1RvYXN0OiBzaG93VG9hc3QsXG4gICAgc2hvd0FsZXJ0OiBzaG93QWxlcnQsXG4gICAgc2hvd1BvcFdhaXRpbmc6IHNob3dQb3BXYWl0aW5nLFxuICAgIGJ1aWxkUmVxdWVzdFBhcmFtOiBidWlsZFJlcXVlc3RQYXJhbSxcbiAgICBpcFRvTnVtYmVyOmlwVG9OdW1iZXIsXG4gICAgbnVtYmVyVG9JcDpudW1iZXJUb0lwLFxuICAgIFByZWZpeEludGVnZXI6UHJlZml4SW50ZWdlcixcbn07IiwidmFyIEdsb2JhbFVzZXJEYXRhID0ge1xuICAgIHdGYWNlSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICBjYkdlbmRlcjogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgY2JNZW1iZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgIGlzR3Vlc3Q6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+aYr+WQpuaYr+a4uOWuolxuICAgIGlzT3BlblJlZ2lzdGVyOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+azqOWGjOWKn+iDvVxuICAgIGlzT3BlbklBUDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+iLueaenGlhcFxuICAgIHdFbmNyeXB0SUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICB3Q29kZUNoZWNrSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgZHdVc2VySUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICBkd0dhbWVJRDogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgIGR3RXhwZXJpZW5jZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgIHN6TW9iaWxlQXV0aDogdW5kZWZpbmVkLCAgICAgICAgIC8v5rOo5YaM5pe26aqM6K+B56CBXG4gICAgc3pBY2NvdW50czogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5biQ5Y+3XG4gICAgc3pOaWNrTmFtZTogdW5kZWZpbmVkLCAgICAgICAgICAgLy/njqnlrrbmmLXnp7BcbiAgICBzelBhc3NXb3JkOiB1bmRlZmluZWQsXHRcdFx0Ly/nmbvlvZXlr4bnoIFcbiAgICBzekdyb3VwTmFtZTogdW5kZWZpbmVkLFx0XHRcdC8v56S+5Zui5L+h5oGvXG4gICAgc3pVbmRlcldyaXRlOiB1bmRlZmluZWQsXHQvL+S4quaAp+etvuWQjVxuICAgIFxuICAgIC8v5omp5bGV5L+h5oGvXG4gICAgZHdDdXN0b21GYWNlVmVyOiB1bmRlZmluZWQsXHRcdFx0XHQvL+WktOWDj+eJiOacrFxuICAgIC8v6ZKxXG4gICAgZHdGb3J0dW5lQ29pbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v56aP5biBXG4gICAgbGxHYW1lU2NvcmU6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICBsbEluc3VyZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZO26KGM6YeR5biBXG4gICAgZHdDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v6LSd5aOzXG4gICAgZHdJbnN1cmVDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgIC8v6ZO26KGM6LSd5aOzXG4gICAgZHdNYXRjaFRpY2tldDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v5Y+C6LWb5Yi4XG4gICAgaXNGaXJzdEJhbms6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly8g6aaW5qyh5L2/55SoXG5cbiAgICByb29tTGlzdDogW10sXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwianNvbi9zaG9wcGFnZVwiLCBmdW5jdGlvbiAoZXJyLCBjb250ZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50KTtcbiAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhID0gY29udGVudDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW0dsb2JhbFVzZXJEYXRhXVtpbml0XSBcIitKU09OLnN0cmluZ2lmeShHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSwgbnVsbCwgJyAnKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJvb21MaXN0ID0gW107XG4gICAgfSxcbiAgICBvbkxvYWREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1BfTG9nb25TdWNjZXNzTW9iaWxlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIC8v5omp5bGV5L+h5oGvXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0N1c3RvbUZhY2VWZXI7XHRcdFx0XHQvL+WktOWDj+eJiOacrFxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1vb3JNYWNoaW5lO1x0XHRcdFx0XHQvL+mUgeWumuacuuWZqFxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkJpbmRXZWlYaW47XHRcdFx0XHRcdC8v57uR5a6a5b6u5L+hIFdTTFxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RmFjZUlEO1x0XHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWVtYmVyO1x0XHRcdFx0XHRcdC8v5Lya5ZGY562J57qnXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdFbmNyeXB0SUQ7XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb2RlQ2hlY2tJRDtcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0V4cGVyaWVuY2U7XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dhbWVJRDtcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxsR2FtZVNjb3JlO1x0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdC8v6ZO26KGM6YeR5biBXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzekFjY291bnRzW05BTUVfTEVOXTtcdFx0XHQvL+eZu+W9leW4kOWPt1xuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pOaWNrTmFtZVtOQU1FX0xFTl07XHRcdFx0Ly/mmLXnp7BcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdGhpcy5kd0N1c3RvbUZhY2VWZXIgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5jYk1vb3JNYWNoaW5lID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy5jYkJpbmRXZWlYaW4gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLndGYWNlSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLmNiTWVtYmVyID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy5jYkdlbmRlciA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMud0VuY3J5cHRJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud0NvZGVDaGVja0lEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd0V4cGVyaWVuY2UgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd0dhbWVJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmR3VXNlcklEID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMubGxHYW1lU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTtcbiAgICAgICAgdGhpcy5sbEluc3VyZVNjb3JlID0gcERhdGEucmVhZGludDY0KCk7XG4gICAgICAgIHRoaXMuc3pBY2NvdW50cyA9IHBEYXRhLnJlYWRzdHJpbmcoMzIpO1xuICAgICAgICB0aGlzLnN6Tmlja05hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKDMyKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgIC8vIGZvciAodmFyIHByb3AgaW4gdGhpcykge1xuICAgICAgICAvLyAgICAgaWYgKHR5cGVvZih0aGlzW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3RoaXMuJyArIHByb3AsICc9JywgdGhpc1twcm9wXSk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuICAgIGdldFJvb21CeUdhbWU6IGZ1bmN0aW9uICh3S2luZElEKSB7XG4gICAgICAgIHZhciByb29tTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5yb29tTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5yb29tTGlzdFtpbmRleF07XG4gICAgICAgICAgICBpZiAoZWxlbWVudC53S2luZElEID09IHdLaW5kSUQpIHtcbiAgICAgICAgICAgICAgICByb29tTGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb29tTGlzdDtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxVc2VyRGF0YTsiLCJyZXF1aXJlKFwiTUQ1XCIpO1xudmFyIGdhbWVfY21kID0gcmVxdWlyZShcIkNNRF9HYW1lXCIpO1xudmFyIHBsYXphX2NtZCA9IHJlcXVpcmUoXCJDTURfUGxhemFcIik7XG52YXIgQmFzZUZyYW1lID0gcmVxdWlyZShcIkJhc2VGcmFtZVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZGVmYXVsdHMsIHNldCB2aXN1YWxseSB3aGVuIGF0dGFjaGluZyB0aGlzIHNjcmlwdCB0byB0aGUgQ2FudmFzXG4gICAgICAgIHRleHQ6ICdIZWxsbywgV29ybGQhJ1xuICAgIH0sXG4gICAgLy8gbmFtZTogXCJoZWxsb0ZyYW1lXCIsXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGpzYlRlc3QudGVzdGxvZygpO1xuICAgICAgICAvLyB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIHRoaXMuc29ja2V0ID0gQ2xpZW50U29ja2V0LmNyZWF0ZVNvY2tldChmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2tfYmVnaW4nKTtcbiAgICAgICAgLy8gICAgIC8vIHZhciBtYWluSUQgPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgICAgIC8vICAgICAvLyB2YXIgc3ViSUQgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKG1haW5JRCk7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhzdWJJRCk7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2tfZW5kJyk7XG4gICAgICAgIC8vICAgICBzZWxmLm9uU29ja2V0Q2FsbEJhY2socERhdGEpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gLy8gdmFyIHBEYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAvLyAvLyBwRGF0YS5zZXRjbWRpbmZvKDIsMyk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnB1c2hieXRlKDEpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNod29yZCgyMzMzMyk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnB1c2hkb3VibGUoMTIzLjM0MzQpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5nZXRtYWluKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5nZXRzdWIoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRieXRlKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkd29yZCgpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZGRvdWJsZSgpKTtcbiAgICAgICAgLy8gdGhpcy5zb2NrZXQuQ29ubmVjdFNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSk7XG4gICAgICAgIHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpO1xuICAgICAgICB0aGlzLmxhYmVsLnN0cmluZyA9IHRoaXMudGV4dDtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICB9LFxuICAgIC8vIG9uU29ja2V0Q2FsbEJhY2s6IGZ1bmN0aW9uKHBEYXRhKSB7XG4gICAgLy8gICAgIGlmKHBEYXRhID09PSB1bmRlZmluZWQpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAvLyAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgIC8vICAgICBjb25zb2xlLmxvZygnbWFpbiA9ICcrbWFpbisnIHN1YiA9ICcrc3ViKTtcbiAgICAvLyAgICAgaWYgKG1haW4gPT09IDApIFxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBpZihzdWIgPT09IDApXG4gICAgLy8gICAgICAgICB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RDb21wZWxldGVkKCk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBlbHNlXG4gICAgLy8gICAgICAgICB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy5vblNvY2tldEVycm9yKHBEYXRhKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNlXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIHRoaXMub25Tb2NrZXRFdmVudChwRGF0YSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdoZWxsb19vbkNvbm5lY3RDb21wZWxldGVkJyk7XG4gICAgfSxcbiAgICAvLyBvblNvY2tldEVycm9yOmZ1bmN0aW9uKHBEYXRhKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ29uU29ja2V0RXJyb3InKTtcbiAgICAvLyB9LFxuICAgIC8vIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJvblNvY2tldEV2ZW50XCIpO1xuICAgIC8vIH0sXG4gICAgc2VuZExvZ29uOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbG9nb25EYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBsb2dvbkRhdGEuc2V0Y21kaW5mbyhwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSxwbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMTc2MDIxNzAzMTNcIiwzMik7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMjVkNTVhZDI4M2FhNDAwYWY0NjRjNzZkNzEzYzA3YWRcIiwzMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMmQ0ZDdjOTVlNWRmMDE3OWFmMjQ2NmY2MzVjYTcxZGVcIiwzMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hieXRlKDApO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgfVxufSk7XG4iLCJ2YXIgQmFzZUZyYW1lID0gcmVxdWlyZShcIkJhc2VGcmFtZVwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG52YXIgZ2FtZV9jbWQgPSByZXF1aXJlKFwiQ01EX0dhbWVcIik7XG52YXIgcGxhemFfY21kID0gcmVxdWlyZShcIkNNRF9QbGF6YVwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHYW1lU2VydmVySXRlbSA9IHJlcXVpcmUoXCJHYW1lU2VydmVySXRlbVwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8vIGZvciAodmFyIHByb3AgaW4gR2xvYmFsVXNlckRhdGEpIHtcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZygnR2xvYmFsVXNlckRhdGEuJyArIHByb3AsICc9JywgR2xvYmFsVXNlckRhdGFbcHJvcF0pO1xuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmKHRoaXMuX2xvZ29uTW9kZSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuc2VuZExvZ29uKCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMuX2xvZ29uTW9kZSA9PT0gMSl7XG4gICAgICAgICAgdGhpcy5zZW5kUmVnaXN0ZXIoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5fbG9nb25Nb2RlID09PSAyKXtcbiAgICAgICAgICB0aGlzLnNlbmRWaXNpdG9yKCk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi5pyq55+l55m75b2V5qih5byPXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpIHtcbiAgICAgICAgaWYobWFpbiA9PT0gcGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUpe1xuICAgICAgICAgICAgdGhpcy5vblN1YkxvZ29uRXZlbnQoc3ViLHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1haW4gPT09IHBsYXphX2NtZC5NRE1fR1BfU0VSVkVSX0xJU1Qpe1xuICAgICAgICAgICAgdGhpcy5vblJvb21MaXN0RXZlbnQoc3ViLHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1haW4gPT09IHBsYXphX2NtZC5NRE1fR1BfU1lTVEVNKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuezu+e7n+a2iOaBr1wiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJMb2dvbkV2ZW50OiBmdW5jdGlvbihzdWIscERhdGEpIHtcbiAgICAgICAgaWYgKHN1YiA9PT0gcGxhemFfY21kLlNVQl9HUF9MT0dPTl9TVUNDRVNTX01PQklMRSl7XG4gICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5vbkxvYWREYXRhKHBEYXRhKTtcbiAgICAgICAgICAgIHZhciBiUmVtZW1iZXJQd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiUmVtZW1iZXJQd2RcIik7XG4gICAgICAgICAgICBpZihHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IGNjLm1kNUVuY29kZSh0aGlzLl9zelBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICBpZiAoYlJlbWVtYmVyUHdkID09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2FjY291bnQnLCB0aGlzLl9zekFjY291bnQpO1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bhc3N3b3JkJywgdGhpcy5fc3pQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnQnKTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwYXNzd29yZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dvbiBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIkxvZ29uU3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fRVJST1JfTU9CSUxFKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHN1YiA9PT0gcGxhemFfY21kLlNVQl9HUF9MT0dPTl9GSU5JU0hfTU9CSUxFKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBmaW5pc2hcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlBsYXphU2NlbmVcIik7XG4gICAgICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Sb29tTGlzdEV2ZW50OiBmdW5jdGlvbihzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIG9uUm9vbUxpc3RFdmVudFwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9UWVBFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfVFlQRVwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX0tJTkQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9LSU5EXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfU1RBVElPTjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX1NUQVRJT05cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9TRVJWRVI6XG4gICAgICAgICAgICAgICAgdmFyIHBHYW1lU2VydmVyID0gbmV3IEdhbWVTZXJ2ZXJJdGVtKCk7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/miL/pl7TliJfooajnu5PmnoRcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgdGFnR2FtZVNlcnZlclxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U29ydElEO1x0XHRcdFx0XHRcdFx0Ly/mjpLluo/lj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3S2luZElEO1x0XHRcdFx0XHRcdFx0Ly/lkI3np7Dlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U2VydmVySUQ7XHRcdFx0XHRcdFx0XHQvL+aIv+mXtOWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTdGF0aW9uSUQ7XHRcdFx0XHRcdFx0XHQvL+ermeeCueWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTZXJ2ZXJQb3J0O1x0XHRcdFx0XHRcdC8v5oi/6Ze056uv5Y+jXG4gICAgICAgICAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3U2VydmVyQWRkcjtcdFx0XHRcdFx0XHQvL+aIv+mXtOWcsOWdgFxuICAgICAgICAgICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd09uTGluZUNvdW50O1x0XHRcdFx0XHRcdC8v5Zyo57q/5Lq65pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6U2VydmVyTmFtZVtTRVJWRVJfTEVOXTtcdFx0XHQvL+aIv+mXtOWQjeensFxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgcEdhbWVTZXJ2ZXIub25Jbml0KHBEYXRhKTtcbiAgICAgICAgICAgICAgICAvLyBmb3IgKHZhciBwcm9wIGluIHBHYW1lU2VydmVyKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmICh0eXBlb2YocEdhbWVTZXJ2ZXJbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdwR2FtZVNlcnZlci4nICsgcHJvcCwgJz0nLCBwR2FtZVNlcnZlcltwcm9wXSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnJvb21MaXN0LnB1c2gocEdhbWVTZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBHYW1lU2VydmVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNlbmRMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyh0aGlzLl9zekFjY291bnQsMzIpO1xuICAgICAgICAvLyBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBpZiAoR2xvYmFsVXNlckRhdGEuaXNHdWVzdCkge1xuICAgICAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pQYXNzd29yZCwzMyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKGNjLm1kNUVuY29kZSh0aGlzLl9zelBhc3N3b3JkKSwzMyk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCJcIiwzMyk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICB9LFxuICAgIHNlbmRSZWdpc3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZWdpc3RlckRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIHZhciBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmVnaXN0ZXJEYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9SRUdJU1RFUl9NT0JJTEUpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHdvcmQoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZChkd01vYmlsZVN5c1R5cGUpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6UmVnQWNjb3VudCwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKGNjLm1kNUVuY29kZSh0aGlzLl9zelJlZ1Bhc3N3b3JkKSwzMyk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6TW9iaWxlUGhvbmUsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek5pY2tOYW1lLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pNb2JpbGVBdXRoLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcoXCJcIiwzMyk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEocmVnaXN0ZXJEYXRhKTtcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUF9SZWdpc3RlckFjY291bnRzTW9ibGllXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHQvLyDlpLTlg4/moIfor4ZcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0Ly8g55So5oi35oCn5YirXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZVN5c1R5cGU7XHRcdFx0XHQvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZUFwcEtpbmQ7XHRcdFx0XHQvLyDlub/lnLrmiYvmnLrniYjmnKxcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlQXBwVmVyc2lvbjtcdFx0XHRcdC8vIOW5v+WcuuaJi+acuueJiOacrFxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pBY2NvdW50c1tOQU1FX0xFTl07XHRcdFx0Ly8g55m75b2V5biQ5Y+3XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelBhc3NXb3JkW1BBU1NfTEVOXTtcdFx0XHQvLyDnmbvlvZXlr4bnoIFcbiAgICAgICAgLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlcGhvbmVbTU9CSUxFUEhPTkVfTEVOXTsgLy8g5omL5py6XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5pY2tOYW1lW05BTUVfTEVOXTtcdFx0XHQvLyDmmLXnp7BcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TW9iaWxlQXV0aFtOQU1FX0xFTl07XHRcdFx0Ly/miYvmnLrpqozor4HnoIFcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4gICAgICAgIC8vIH07XG4gICAgfSxcbiAgICBzZW5kVmlzaXRvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uKCk7XG4gICAgfSxcbiAgICBvbkxvZ29uQnlBY2NvdW50OiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCkge1xuICAgICAgICB0aGlzLl9zekFjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gXCIwMTIzNDU2Nzg5XCI7XG4gICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMDtcbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF0gXCIrc3pBY2NvdW50K1wiICMgXCIrIHN6UGFzc3dvcmQpO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uTG9nb25CeVZpc2l0b3I6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuX3N6QWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBcIjAxMjM0NTY3ODlcIjtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMjtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlWaXNpdG9yXVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlWaXNpdG9yXVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCxzek5pY2tOYW1lLHN6TW9iaWxlQXV0aCkge1xuICAgICAgICB0aGlzLl9zelJlZ0FjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UmVnUGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek5pY2tOYW1lID0gc3pOaWNrTmFtZTtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVBdXRoID0gc3pNb2JpbGVBdXRoO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAxO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uUmVnaXN0ZXJdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uUmVnaXN0ZXJdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbG9nb25WaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICByZWdpc3RlclZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvYWRdXCIpO1xuICAgICAgICBHbG9iYWxVc2VyRGF0YS5pbml0KCk7XG4gICAgICAgIHRoaXMuX2xvZ29uRnJhbWUgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFwiTG9nb25GcmFtZVwiKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uTG9nb24nLHRoaXMub25Mb2dvbix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uU2hvd1JlZ2lzdGVyJyx0aGlzLm9uU2hvd1JlZ2lzdGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25SZWdpc3RlcicsdGhpcy5vblJlZ2lzdGVyLHRoaXMpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkxvZ29uJyx0aGlzLm9uTG9nb24sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25TaG93UmVnaXN0ZXInLHRoaXMub25TaG93UmVnaXN0ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25SZWdpc3RlcicsdGhpcy5vblJlZ2lzdGVyLHRoaXMpO1xuICAgIH0sXG4gICAgb25Mb2dvbjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2dvbl1cIik7XG4gICAgICAgIHZhciBzekFjY291bnQgPSBldmVudC5kZXRhaWwuc3pBY2NvdW50O1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IGV2ZW50LmRldGFpbC5zelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9sb2dvbkZyYW1lLm9uTG9nb25CeUFjY291bnQoc3pBY2NvdW50LHN6UGFzc3dvcmQpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1BvcFdhaXRpbmcoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx7XG4gICAgICAgICAgICBjbG9zZUV2ZW50OiBcIkxvZ29uU3VjY2Vzc1wiLFxuICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2dvbl0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvblJlZ2lzdGVyOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25SZWdpc3Rlcl1cIik7XG4gICAgICB2YXIgc3pBY2NvdW50ID0gZXZlbnQuZGV0YWlsLnN6QWNjb3VudDtcbiAgICAgIHZhciBzelBhc3N3b3JkID0gZXZlbnQuZGV0YWlsLnN6UGFzc3dvcmQ7XG4gICAgICB2YXIgc3pOaWNrTmFtZSA9IGV2ZW50LmRldGFpbC5zek5pY2tOYW1lO1xuICAgICAgdmFyIHN6TW9iaWxlQXV0aCA9IGV2ZW50LmRldGFpbC5zek1vYmlsZUF1dGg7XG4gICAgICBpZihzekFjY291bnQgPT09IHVuZGVmaW5lZCB8fCBzelBhc3N3b3JkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblJlZ2lzdGVyXSBzekFjY291bnQgb3Igc3pQYXNzd29yZCBpcyB1bmRlZmluZWRcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fbG9nb25GcmFtZS5vblJlZ2lzdGVyKHN6QWNjb3VudCxzelBhc3N3b3JkLHN6Tmlja05hbWUsc3pNb2JpbGVBdXRoKTtcbiAgICB9LFxuICAgIG9uU2hvd0xvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpKTtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2xvZ29uVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9nb25WaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9sb2dvblZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX2xvZ29uVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dMb2dvbl1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25TaG93VmlzdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl1cIik7XG4gICAgICAgIC8vIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIua4uOWuoueZu+W9leaaguacquW8gOaUvizmlazor7fmnJ/lvoUhXCIpO1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvR3Vlc3QvR3Vlc3RMb2dpbi5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1wia2luZGlkXCJdID0gempoX2NtZC5LSU5EX0lEO1xuICAgICAgICBwYXJhbXNbXCJ2ZXJzaW9ubnVtXCJdID0gXCIxLjFcIjtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkZW50aXR5XCJdID0gXCIyZDRkN2M5NWU1ZGYwMTc5YWYyNDY2ZjYzNWNhNzFkZVwiO1xuICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIyXCI7Ly9cIjFcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyA9IHZhbHVlLnVzZXJuYW1lO1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkID0gdmFsdWUucHdkO1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fbG9nb25GcmFtZS5vbkxvZ29uQnlWaXNpdG9yKEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHMsR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIkd1ZXN0TG9naW5Db21wbGV0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93UG9wV2FpdGluZyhjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHtcbiAgICAgICAgICAgIGNsb3NlRXZlbnQ6IFwiR3Vlc3RMb2dpbkNvbXBsZXRlZFwiLFxuICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXSBjYWxsYmFja2Z1bmNcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIFxuICAgIH0sXG4gICAgb25TaG93UmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpID09PSB0cnVlKXtcbiAgICAgICAgICAgIHRoaXMuX2xvZ29uVmlldy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY2MuaXNWYWxpZCh0aGlzLl9yZWdpc3RlclZpZXcpID09PSBmYWxzZSl7XG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlclZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnJlZ2lzdGVyVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fcmVnaXN0ZXJWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9yZWdpc3RlclZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93UmVnaXN0ZXJdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9lZGl0Ym94X2FjY291bnQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9wYXNzd29yZDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9jaGVja2JveDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYodGhpcy5tX2NoZWNrYm94KSB7XG4gICAgICAgICAgICB2YXIgcHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicHdkXCIpO1xuICAgICAgICAgICAgdmFyIGJSZW1lbWJlclB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJSZW1lbWJlclB3ZFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIGlzIFwiICsgYlJlbWVtYmVyUHdkKTtcbiAgICAgICAgICAgIGlmIChiUmVtZW1iZXJQd2QgPT0gJ3RydWUnIHx8IGJSZW1lbWJlclB3ZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSBjaGVja1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fY2hlY2tib3guY2hlY2soKTtcbiAgICAgICAgICAgICAgICB2YXIgc3pBY2NvdW50ID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBzelBhc3N3b3JkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGFzc3dvcmRcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZyA9IHN6QWNjb3VudDtcbiAgICAgICAgICAgICAgICB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmcgPSBzelBhc3N3b3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIHVuY2hlY2tcIilcbiAgICAgICAgICAgICAgICB0aGlzLm1fY2hlY2tib3gudW5jaGVjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25Mb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2dvbl0gXCIrc3pBY2NvdW50K1wiICMgXCIrc3pQYXNzd29yZCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkxvZ29uXCIse3N6QWNjb3VudDpzekFjY291bnQsc3pQYXNzd29yZDpzelBhc3N3b3JkfSk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrUmVnaXN0ZXJCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25TaG93UmVnaXN0ZXJcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrRm9yZ2V0UGFzc3dvcmQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNjLnN5cy5vcGVuVVJMKEdsb2JhbERlZi5odHRwT3BlblVybCk7XG4gICAgfSxcbiAgICBjaGVja0JveENsaWNrZWQ6IGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgaWYgKHRvZ2dsZS5pc0NoZWNrZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bY2hlY2tCb3hDbGlja2VkXSBpcyBjaGVja2VkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtjaGVja0JveENsaWNrZWRdIGlzIHVuY2hlY2tlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJiUmVtZW1iZXJQd2RcIiwgdG9nZ2xlLmlzQ2hlY2tlZCk7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5tZDVFbmNvZGUgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAvLyBmb3IgdGVzdC9kZWJ1Z1xuICAgIGZ1bmN0aW9uIGZmbG9nKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgfSBjYXRjaChlKSB7fVxuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgbnVtYmVyIHRvICh1bnNpZ25lZCkgMzIgYml0IGhleCwgemVybyBmaWxsZWQgc3RyaW5nXG4gICAgZnVuY3Rpb24gdG9femVyb2ZpbGxlZF9oZXgobikge1xuICAgICAgICB2YXIgdDEgPSAobiA+Pj4gMjQpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgdmFyIHQyID0gKG4gJiAweDAwRkZGRkZGKS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiBcIjAwXCIuc3Vic3RyKDAsIDIgLSB0MS5sZW5ndGgpICsgdDEgK1xuICAgICAgICAgICAgXCIwMDAwMDBcIi5zdWJzdHIoMCwgNiAtIHQyLmxlbmd0aCkgKyB0MjtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFycmF5IG9mIGNoYXJzIHRvIGFycmF5IG9mIGJ5dGVzIChub3RlOiBVbmljb2RlIG5vdCBzdXBwb3J0ZWQpXG4gICAgZnVuY3Rpb24gY2hhcnNfdG9fYnl0ZXMoYWMpIHtcbiAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXR2YWwgPSByZXR2YWwuY29uY2F0KHN0cl90b19ieXRlcyhhY1tpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfVxuXG5cbiAgICAvLyBjb252ZXJ0IGEgNjQgYml0IHVuc2lnbmVkIG51bWJlciB0byBhcnJheSBvZiBieXRlcy4gTGl0dGxlIGVuZGlhblxuICAgIGZ1bmN0aW9uIGludDY0X3RvX2J5dGVzKG51bSkge1xuICAgICAgICB2YXIgcmV0dmFsID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgICAgICByZXR2YWwucHVzaChudW0gJiAweEZGKTtcbiAgICAgICAgICAgIG51bSA9IG51bSA+Pj4gODtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH1cblxuICAgIC8vICAzMiBiaXQgbGVmdC1yb3RhdGlvblxuICAgIGZ1bmN0aW9uIHJvbChudW0sIHBsYWNlcykge1xuICAgICAgICByZXR1cm4gKChudW0gPDwgcGxhY2VzKSAmIDB4RkZGRkZGRkYpIHwgKG51bSA+Pj4gKDMyIC0gcGxhY2VzKSk7XG4gICAgfVxuXG4gICAgLy8gVGhlIDQgTUQ1IGZ1bmN0aW9uc1xuICAgIGZ1bmN0aW9uIGZGKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIChiICYgYykgfCAofmIgJiBkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmRyhiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiAoZCAmIGIpIHwgKH5kICYgYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkgoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gYiBeIGMgXiBkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZJKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIGMgXiAoYiB8IH5kKTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIDQgYnl0ZXMgYXQgc3BlY2lmaWVkIG9mZnNldC4gTGl0dGxlLWVuZGlhbiBpcyBhc3N1bWVkXG4gICAgZnVuY3Rpb24gYnl0ZXNfdG9faW50MzIoYXJyLCBvZmYpIHtcbiAgICAgICAgcmV0dXJuIChhcnJbb2ZmICsgM10gPDwgMjQpIHwgKGFycltvZmYgKyAyXSA8PCAxNikgfCAoYXJyW29mZiArIDFdIDw8IDgpIHwgKGFycltvZmZdKTtcbiAgICB9XG5cbiAgICAvKlxuICAgICBDb252ZXIgc3RyaW5nIHRvIGFycmF5IG9mIGJ5dGVzIGluIFVURi04IGVuY29kaW5nXG4gICAgIFNlZTpcbiAgICAgaHR0cDovL3d3dy5kYW5ncm9zc21hbi5pbmZvLzIwMDcvMDUvMjUvaGFuZGxpbmctdXRmLTgtaW4tamF2YXNjcmlwdC1waHAtYW5kLW5vbi11dGY4LWRhdGFiYXNlcy9cbiAgICAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjQwNDA4L3JlYWRpbmctYnl0ZXMtZnJvbS1hLWphdmFzY3JpcHQtc3RyaW5nXG4gICAgIEhvdyBhYm91dCBhIFN0cmluZy5nZXRCeXRlcyg8RU5DT0RJTkc+KSBmb3IgSmF2YXNjcmlwdCE/IElzbid0IGl0IHRpbWUgdG8gYWRkIGl0P1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0cl90b19ieXRlcyhzdHIpIHtcbiAgICAgICAgLy8gYWxlcnQoXCJnb3QgXCIgKyBzdHIubGVuZ3RoICsgXCIgY2hhcnNcIilcbiAgICAgICAgdmFyIHJldHZhbCA9IFsgXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBpZiAoc3RyLmNoYXJDb2RlQXQoaSkgPD0gMHg3Rikge1xuICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuY2hhckF0KGkpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRtcC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICByZXR2YWwucHVzaChwYXJzZUludCh0bXBbal0sIDB4MTApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfTtcblxuXG5cblxuICAgIC8vIGNvbnZlcnQgdGhlIDQgMzItYml0IGJ1ZmZlcnMgdG8gYSAxMjggYml0IGhleCBzdHJpbmcuIChMaXR0bGUtZW5kaWFuIGlzIGFzc3VtZWQpXG4gICAgZnVuY3Rpb24gaW50MTI4bGVfdG9faGV4KGEsIGIsIGMsIGQpIHtcbiAgICAgICAgdmFyIHJhID0gXCJcIjtcbiAgICAgICAgdmFyIHQgPSAwO1xuICAgICAgICB2YXIgdGEgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMzsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHRhID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgdCA9ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8ICh0YSAmIDB4RkYpO1xuICAgICAgICAgICAgdGEgPSB0YSA+Pj4gODtcbiAgICAgICAgICAgIHQgPSB0IDw8IDg7XG4gICAgICAgICAgICB0ID0gdCB8IHRhO1xuICAgICAgICAgICAgcmEgPSByYSArIHRvX3plcm9maWxsZWRfaGV4KHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpbnB1dCBkYXRhIHR5cGUgYW5kIHBlcmZvcm0gY29udmVyc2lvbnMgaWYgbmVlZGVkXG4gICAgdmFyIGRhdGFieXRlcyA9IG51bGw7XG4gICAgLy8gU3RyaW5nXG4gICAgaWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIGNvbnZlcnQgc3RyaW5nIHRvIGFycmF5IGJ5dGVzXG4gICAgICAgIGRhdGFieXRlcyA9IHN0cl90b19ieXRlcyhkYXRhKTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuY29uc3RydWN0b3IgPT0gQXJyYXkpIHtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGVtcHR5LCBqdXN0IGFzc3VtZSBhcnJheSBvZiBieXRlc1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVswXSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gY2hhcnNfdG9fYnl0ZXMoZGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZmxvZyhcImlucHV0IGRhdGEgdHlwZSBtaXNtYXRjaFwiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmZsb2coXCJpbnB1dCBkYXRhIHR5cGUgbWlzbWF0Y2hcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIHNhdmUgb3JpZ2luYWwgbGVuZ3RoXG4gICAgdmFyIG9yZ19sZW4gPSBkYXRhYnl0ZXMubGVuZ3RoO1xuXG4gICAgLy8gZmlyc3QgYXBwZW5kIHRoZSBcIjFcIiArIDd4IFwiMFwiXG4gICAgZGF0YWJ5dGVzLnB1c2goMHg4MCk7XG5cbiAgICAvLyBkZXRlcm1pbmUgcmVxdWlyZWQgYW1vdW50IG9mIHBhZGRpbmdcbiAgICB2YXIgdGFpbCA9IGRhdGFieXRlcy5sZW5ndGggJSA2NDtcbiAgICAvLyBubyByb29tIGZvciBtc2cgbGVuZ3RoP1xuICAgIGlmICh0YWlsID4gNTYpIHtcbiAgICAgICAgLy8gcGFkIHRvIG5leHQgNTEyIGJpdCBibG9ja1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICg2NCAtIHRhaWwpOyBpKyspIHtcbiAgICAgICAgICAgIGRhdGFieXRlcy5wdXNoKDB4MCk7XG4gICAgICAgIH1cbiAgICAgICAgdGFpbCA9IGRhdGFieXRlcy5sZW5ndGggJSA2NDtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8ICg1NiAtIHRhaWwpOyBpKyspIHtcbiAgICAgICAgZGF0YWJ5dGVzLnB1c2goMHgwKTtcbiAgICB9XG4gICAgLy8gbWVzc2FnZSBsZW5ndGggaW4gYml0cyBtb2QgNTEyIHNob3VsZCBub3cgYmUgNDQ4XG4gICAgLy8gYXBwZW5kIDY0IGJpdCwgbGl0dGxlLWVuZGlhbiBvcmlnaW5hbCBtc2cgbGVuZ3RoIChpbiAqYml0cyohKVxuICAgIGRhdGFieXRlcyA9IGRhdGFieXRlcy5jb25jYXQoaW50NjRfdG9fYnl0ZXMob3JnX2xlbiAqIDgpKTtcblxuICAgIC8vIGluaXRpYWxpemUgNHgzMiBiaXQgc3RhdGVcbiAgICB2YXIgaDAgPSAweDY3NDUyMzAxO1xuICAgIHZhciBoMSA9IDB4RUZDREFCODk7XG4gICAgdmFyIGgyID0gMHg5OEJBRENGRTtcbiAgICB2YXIgaDMgPSAweDEwMzI1NDc2O1xuXG4gICAgLy8gdGVtcCBidWZmZXJzXG4gICAgdmFyIGEgPSAwLFxuICAgICAgICBiID0gMCxcbiAgICAgICAgYyA9IDAsXG4gICAgICAgIGQgPSAwO1xuXG5cbiAgICBmdW5jdGlvbiBfYWRkKG4xLCBuMikge1xuICAgICAgICByZXR1cm4gMHgwRkZGRkZGRkYgJiAobjEgKyBuMilcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiB1cGRhdGUgcGFydGlhbCBzdGF0ZSBmb3IgZWFjaCBydW5cbiAgICB2YXIgdXBkYXRlUnVuID0gZnVuY3Rpb24obmYsIHNpbjMyLCBkdzMyLCBiMzIpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBkO1xuICAgICAgICBkID0gYztcbiAgICAgICAgYyA9IGI7XG4gICAgICAgIC8vYiA9IGIgKyByb2woYSArIChuZiArIChzaW4zMiArIGR3MzIpKSwgYjMyKTtcbiAgICAgICAgYiA9IF9hZGQoYixcbiAgICAgICAgICAgIHJvbChcbiAgICAgICAgICAgICAgICBfYWRkKGEsXG4gICAgICAgICAgICAgICAgICAgIF9hZGQobmYsIF9hZGQoc2luMzIsIGR3MzIpKVxuICAgICAgICAgICAgICAgICksIGIzMlxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBhID0gdGVtcDtcbiAgICB9O1xuXG5cbiAgICAvLyBEaWdlc3QgbWVzc2FnZVxuICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhYnl0ZXMubGVuZ3RoIC8gNjQ7IGkrKykge1xuICAgICAgICAvLyBpbml0aWFsaXplIHJ1blxuICAgICAgICBhID0gaDA7XG4gICAgICAgIGIgPSBoMTtcbiAgICAgICAgYyA9IGgyO1xuICAgICAgICBkID0gaDM7XG5cbiAgICAgICAgdmFyIHB0ciA9IGkgKiA2NDtcblxuICAgICAgICAvLyBkbyA2NCBydW5zXG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhkNzZhYTQ3OCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGU4YzdiNzU2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHgyNDIwNzBkYiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YzFiZGNlZWUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmNTdjMGZhZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NDc4N2M2MmEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhhODMwNDYxMywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZkNDY5NTAxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4Njk4MDk4ZDgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDhiNDRmN2FmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmZmZjViYjEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg4OTVjZDdiZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDZiOTAxMTIyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZDk4NzE5MywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGE2Nzk0MzhlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NDliNDA4MjEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmNjFlMjU2MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhjMDQwYjM0MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjY1ZTVhNTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhlOWI2YzdhYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhkNjJmMTA1ZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjQ0MTQ1MywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZDhhMWU2ODEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhlN2QzZmJjOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDIxZTFjZGU2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhjMzM3MDdkNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZjRkNTBkODcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg0NTVhMTRlZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGE5ZTNlOTA1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmY2VmYTNmOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg2NzZmMDJkOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDhkMmE0YzhhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZmZmYTM5NDIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDg3NzFmNjgxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NmQ5ZDYxMjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmZGU1MzgwYywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGE0YmVlYTQ0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDRiZGVjZmE5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZjZiYjRiNjAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhiZWJmYmM3MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDI4OWI3ZWM2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhlYWExMjdmYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhkNGVmMzA4NSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDQ4ODFkMDUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhkOWQ0ZDAzOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZTZkYjk5ZTUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHgxZmEyN2NmOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGM0YWM1NjY1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmNDI5MjI0NCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDQzMmFmZjk3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YWI5NDIzYTcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmYzkzYTAzOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDY1NWI1OWMzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg4ZjBjY2M5MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZmZWZmNDdkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ODU4NDVkZDEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDZmYTg3ZTRmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmZTJjZTZlMCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGEzMDE0MzE0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NGUwODExYTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmNzUzN2U4MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YmQzYWYyMzUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHgyYWQ3ZDJiYiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZWI4NmQzOTEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCAyMSk7XG5cbiAgICAgICAgLy8gdXBkYXRlIGJ1ZmZlcnNcbiAgICAgICAgaDAgPSBfYWRkKGgwLCBhKTtcbiAgICAgICAgaDEgPSBfYWRkKGgxLCBiKTtcbiAgICAgICAgaDIgPSBfYWRkKGgyLCBjKTtcbiAgICAgICAgaDMgPSBfYWRkKGgzLCBkKTtcbiAgICB9XG4gICAgLy8gRG9uZSEgQ29udmVydCBidWZmZXJzIHRvIDEyOCBiaXQgKExFKVxuICAgIHJldHVybiBpbnQxMjhsZV90b19oZXgoaDMsIGgyLCBoMSwgaDApLnRvTG93ZXJDYXNlKCk7XG59O1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2VfYmFjazogY2MuU3ByaXRlLFxuICAgICAgICBtX0ltYWdlX2NvbDogY2MuU3ByaXRlLFxuICAgICAgICBtX0ltYWdlX3RpdGxlOiBjYy5TcHJpdGUsXG4gICAgICAgIG1fTGFiZWxfc2NvcmVMaW1pdDogY2MuTGFiZWwsXG4gICAgICAgIHBsYXphQXRhbGFzOiBjYy5TcHJpdGVBdGxhcyxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gdmFyIGluZGV4ID0gcGFyYW1zLmluZGV4O1xuICAgICAgICB0aGlzLl9pbmRleCA9IHBhcmFtcy5pbmRleDtcbiAgICAgICAgLy8gdmFyIHJvb21JbmZvID0gcGFyYW1zLnJvb21JbmZvO1xuICAgICAgICB0aGlzLl9yb29tSW5mbyA9IHBhcmFtcy5yb29tSW5mbztcbiAgICAgICAgdGhpcy5tX0ltYWdlX2JhY2suc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXphQXRhbGFzLmdldFNwcml0ZUZyYW1lKFwicGxhemFfaW1hZ2Vfcm9vbV9iYWNrX1wiICsgKHRoaXMuX2luZGV4KSk7XG4gICAgICAgIHRoaXMubV9JbWFnZV9jb2wuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXphQXRhbGFzLmdldFNwcml0ZUZyYW1lKFwicGxhemFfaW1hZ2Vfcm9vbV9jb2xfXCIgKyAodGhpcy5faW5kZXgpKTtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3RpdGxlLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fZG93bl9cIiArICh0aGlzLl9pbmRleCkpO1xuICAgICAgICBpZiAodGhpcy5fcm9vbUluZm8gJiYgdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUpIHtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9zY29yZUxpbWl0LnN0cmluZyA9IHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphUm9vbUl0ZW1dW29uQ2xpY2tdXCIpOyAgXG4gICAgICAgIGlmKCF0aGlzLl9yb29tSW5mbykge1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5oi/6Ze05pqC5pyq5byA5pS+77yM6K+356iN5ZCO5YaN6K+VXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID49IHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlKSB7XG4gICAgICAgICAgICAvLyBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLov5vlhaXmiL/pl7RcIik7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25Mb2dvblJvb21cIix7cm9vbUluZm86dGhpcy5fcm9vbUluZm99KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIui/m+WFpeaIv+mXtOmcgOimgVwiKyB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZSArIFwi6YeR6LGGLOaCqOeahOmHkeixhuS4jei2syzor7flhYXlgLwhXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc2V0dGluZ1ZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJQcm9maWxlVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYmFua1ZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBwbGF6YVJvb21JdGVtOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX25hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VyR29sZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gR2xvYmFsVXNlckRhdGEuaW5pdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXphIG9uTG9hZFwiKTtcbiAgICAgICAgdmFyIEdhbWVGcmFtZU5vZGUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICBpZiAoR2FtZUZyYW1lTm9kZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uTG9hZF0g6I635Y+WR2FtZUZyYW1lIOaJgOWcqOiKgueCuSDlubborr7nva7kuLrluLjpqbvoioLngrlcIik7XG4gICAgICAgICAgICBjYy5nYW1lLmFkZFBlcnNpc3RSb290Tm9kZShHYW1lRnJhbWVOb2RlKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVGcmFtZSA9IEdhbWVGcmFtZU5vZGUuZ2V0Q29tcG9uZW50KFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyB0aGlzLl9nYW1lRnJhbWUgPSB0aGlzLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJHYW1lRnJhbWVcIikuZ2V0Q29tcG9uZW50KFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpO1xuICAgIH0sXG4gICAgcmVmcmVzaFVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaFVJXVwiKTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBHbG9iYWxVc2VyRGF0YSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZihHbG9iYWxVc2VyRGF0YVtwcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHbG9iYWxVc2VyRGF0YS4nICsgcHJvcCwgJz0nLCBHbG9iYWxVc2VyRGF0YVtwcm9wXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfbmFtZS5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lO1xuICAgICAgICB2YXIgZmFjZUlEID0gR2xvYmFsVXNlckRhdGEud0ZhY2VJRDtcbiAgICAgICAgaWYgKGZhY2VJRCA8PSAwIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcblxuICAgICAgICB0aGlzLnJlZnJlc2hSb29tTGlzdCgpO1xuICAgIH0sXG4gICAgcmVmcmVzaFJvb21MaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByb29tTGlzdCA9IEdsb2JhbFVzZXJEYXRhLmdldFJvb21CeUdhbWUoempoX2NtZC5LSU5EX0lEKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoVUldIFwiICsgSlNPTi5zdHJpbmdpZnkocm9vbUxpc3QsIG51bGwsICcgJykpO1xuICAgICAgICB2YXIgcm9vbUxpc3RQYW5lbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm1fUGFuZWxfY2VudGVyXCIpO1xuICAgICAgICByb29tTGlzdFBhbmVsLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAzOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxhemFSb29tSXRlbSk7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlBsYXphUm9vbUl0ZW1cIikuaW5pdCh7aW5kZXg6aW5kZXgrMSxyb29tSW5mbzpyb29tTGlzdFtpbmRleF19KTtcbiAgICAgICAgICAgIHJvb21MaXN0UGFuZWwuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oekdhbWVVc2VySW5mby5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaERhdGFdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID0gdmFsdWUuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluc3VyZXNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUgPSB2YWx1ZS5pbnN1cmVzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuYWNjb3VudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyA9IHZhbHVlLmFjY291bnRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nYW1laWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuZHdHYW1lSUQgPSB2YWx1ZS5nYW1laWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmZhY2VpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gdmFsdWUuZmFjZWlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nZW5kZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuY2JHZW5kZXIgPSB2YWx1ZS5nZW5kZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmlzZ3Vlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IHZhbHVlLmlzZ3Vlc3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSB2YWx1ZS5uaWNrbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoRGF0YV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlTmFtZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkxvZ29uUm9vbScsdGhpcy5vbkxvZ29uUm9vbSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkVuYWJsZV1cIik7XG5cbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VOYW1lU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25Mb2dvblJvb20nLHRoaXMub25Mb2dvblJvb20sdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uTG9nb25Sb29tOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25Mb2dvblJvb21dXCIpO1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUub25Mb2dvblJvb20ocGFyYW1zLmRldGFpbC5yb29tSW5mbyk7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB2YXIgZmFjZUlEID0gR2xvYmFsVXNlckRhdGEud0ZhY2VJRDtcbiAgICAgICAgLy8gaWYgKGZhY2VJRCA8PSAwIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoRGF0YSgpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VOYW1lU3VjY2VzczogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpOyAgXG4gICAgfSxcbiAgICBvbkJhbmtTdWNjZXNzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7ICBcbiAgICB9LFxuICAgIG9uQ2xpY2tTZXR0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fc2V0dGluZ1ZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ1ZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNldHRpbmdWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9zZXR0aW5nVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fc2V0dGluZ1ZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2V0dGluZ11BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja1VzZXJQcm9maWxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3VzZXJQcm9maWxlVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl91c2VyUHJvZmlsZVZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJQcm9maWxlVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fdXNlclByb2ZpbGVWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl91c2VyUHJvZmlsZVZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tDbGllbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ2xpZW50XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a6i5pyN5Yqf6IO95pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQWN0aXZpdHk6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtjb25DbGlja0FjdGl2aXR5XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQmFuazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW2NvbkNsaWNrQmFua11cIik7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2JhbmtWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2JhbmtWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYW5rVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fYmFua1ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX2JhbmtWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0JhbmtdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tTaG9wOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1Nob3BdXCIpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9zaG9wVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9zaG9wVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2hvcFZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3Nob3BWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9zaG9wVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTaG9wXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV93YWl0SWNvbjp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkxvYWRdXCIpO1xuICAgIH0sXG4gICAgb25Jbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV93YWl0aW5nVGV4dCA9IHBhcmFtcy53YWl0aW5nVGV4dCB8fCBcIuato+WcqOi/nuaOpeacjeWKoeWZqO+8jOivt+eojeWAmS4uLlwiO1xuICAgICAgICB0aGlzLm1fd2FpdGluZ1RpbWUgPSBwYXJhbXMud2FpdGluZ1RpbWUgfHwgODtcbiAgICAgICAgdGhpcy5tX2Nsb3NlRXZlbnQgPSBwYXJhbXMuY2xvc2VFdmVudDtcbiAgICAgICAgdGhpcy5tX2NhbGxCYWNrRnVuYyA9IHBhcmFtcy5jYWxsQmFja0Z1bmM7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKHRoaXMubV9jbG9zZUV2ZW50LHRoaXMub25DbG9zZUV2ZW50LHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZSh0aGlzLmNsb3NlLCB0aGlzLCB0aGlzLm1fd2FpdGluZ1RpbWUpO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSB0aGlzLm1fd2FpdGluZ1RleHQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV93YWl0SWNvbi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5yb3RhdGVCeSgyLjAsMzYwLjApKSk7XG4gICAgfSxcbiAgICBvbkNsb3NlRXZlbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZih0aGlzLm1fY2FsbEJhY2tGdW5jKSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1fY2FsbEJhY2tGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0sXG4gICAgb25FbWl0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJoZWhlXCIpO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZih0aGlzLm1fY2xvc2VFdmVudCx0aGlzLm9uQ2xvc2VFdmVudCx0aGlzKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlICh0aGlzLmNsb3NlLCB0aGlzKTtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiIHJlcXVpcmUoXCJNRDVcIik7XG4gdmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG4gdmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG4gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9lZGl0Ym94X2FjY291bnQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9wYXNzd29yZDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X25hbWU6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF95em06e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IHRoaXMubV9lZGl0Ym94X25hbWUuc3RyaW5nO1xuICAgICAgICB2YXIgc3pNb2JpbGVBdXRoID0gdGhpcy5tX2VkaXRib3hfeXptLnN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIrc3pBY2NvdW50K1wiICMgXCIrc3pQYXNzd29yZCk7XG4gICAgICAgIGlmIChzekFjY291bnQubGVuZ3RoIDw9MCB8fCBzelBhc3N3b3JkLmxlbmd0aCA8PTAgfHwgc3pOaWNrTmFtZS5sZW5ndGggPD0gMCB8fCBzek1vYmlsZUF1dGgubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN6UGFzc3dvcmQubGVuZ3RoIDwgNiB8fCBzelBhc3N3b3JkLmxlbmd0aCA+IDE2KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY1cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8g6YCa6L+H55So5oi35Lit5b+Dd2Vi5o6l5Y+j5rOo5YaM55So5oi3XG4gICAgICAgIHZhciBpc1VzZXJDZW50ZXIgPSB0cnVlO1xuICAgICAgICBpZighaXNVc2VyQ2VudGVyKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25SZWdpc3RlclwiLHtcbiAgICAgICAgICAgICAgICBzekFjY291bnQ6c3pBY2NvdW50LFxuICAgICAgICAgICAgICAgIHN6UGFzc3dvcmQ6c3pQYXNzd29yZCxcbiAgICAgICAgICAgICAgICBzek5pY2tOYW1lOnN6Tmlja05hbWUsXG4gICAgICAgICAgICAgICAgc3pNb2JpbGVBdXRoOnN6TW9iaWxlQXV0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgICAgIHVybCArPSBcIi9Vc2VyQ2VudGVyL1VzZXJDZW50ZXJSZWdpc3Rlci5hc2h4XCI7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gJyc7XG4gICAgICAgICAgICB2YXIgbm93VGltZSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIG5vd3RpbWUgc2Vjb25kcyA9IFwiK25vd1RpbWUpO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJ7XFxcIlVzZXJuYW1lXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJQYXNzd29yZFxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6UGFzc3dvcmQpICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTmlja25hbWVcXFwiOlxcXCJcIiArIHN6Tmlja05hbWUgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJEYXRldGFtcFxcXCI6XFxcIlwiICsgbm93VGltZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIC8v55Sf5oiQ562+5ZCNXG4gICAgICAgICAgICB2YXIgc3pTaWduID0gXCJcIjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcIlVzZXJOYW1lPVwiICsgc3pBY2NvdW50O1xuICAgICAgICAgICAgc3pTaWduICs9IFwifERhdGVUYW1wPVwiICsgbm93VGltZTtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxDaGFubmVsSUQ9XCIgKyBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxNb2JpbGU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8Q29kZT1cIiArIHN6TW9iaWxlQXV0aDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIjtcblxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiU2lnblxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6U2lnbikgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDaGFubmVsSURcXFwiOlxcXCJcIiArIEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTW9iaWxlXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJNYWNoaW5lTnVtYmVyXFxcIjpcXFwiXCIgKyAnMScgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDb2RlXFxcIjpcXFwiXCIgKyBzek1vYmlsZUF1dGggKyBcIlxcXCJ9XCI7XG5cbiAgICAgICAgICAgIC8vXCJVc2VyTmFtZT0lc3xEYXRlVGFtcD0lbGxkfENoYW5uZWxJRD0lZHxNb2JpbGU9JXN8Q29kZT0lc3xLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIlxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgeGhyLnNlbmQocGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja1NlbmRCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciByZSA9IC8xWzM1NzhdWzAtOV17OX0vO1xuICAgICAgICBpZiAocmUuZXhlYyhzekFjY291bnQpID09PSBudWxsKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja1NlbmRCdXR0b25dIOaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvaHovQ2FwdGNoYU1vYmlsZS5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSBcIk1vYmlsZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrU2VuZEJ1dHRvbl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcblxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hY2NvdW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9MYWJlbF9hY2NvdW50LnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHM7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrU3dpdGNoQWNjb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgR2FtZUZyYW1lTm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIGlmIChHYW1lRnJhbWVOb2RlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkNsaWNrU3dpdGNoQWNjb3VudF0g6I635Y+WR2FtZUZyYW1lIOaJgOWcqOiKgueCuSDlubblj5bmtojkuLrluLjpqbvoioLngrlcIik7XG4gICAgICAgICAgICBjYy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZShHYW1lRnJhbWVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2Vfc2hvcEl0ZW06IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BJdGVtQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICBfc2hvcElEOiAwLFxuICAgICAgICBfZ29vZHNJRDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHNob3BJRCA9IHBhcmFtcy5zaG9wSUQ7XG4gICAgICAgIHRoaXMuX3Nob3BJRCA9IHNob3BJRDtcbiAgICAgICAgdGhpcy5fZ29vZHNJRCA9IHNob3BJRCAlIDY7XG4gICAgICAgIHRoaXMubV9JbWFnZV9zaG9wSXRlbS5zcHJpdGVGcmFtZSA9IHRoaXMuc2hvcEl0ZW1BdGFscy5nZXRTcHJpdGVGcmFtZShcInNob3BfaWNvbl9cIiArIChzaG9wSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcEl0ZW1dW29uQ2xpY2tdIHNob3BJRCA9IFwiK3RoaXMuX3Nob3BJRCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoJ29uSW5DaGFyZ2UnLHtnb29kc0lEOnRoaXMuX2dvb2RzSUR9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNob3BJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHsgICAgICBcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uTG9hZF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEpKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnNob3BJdGVtTGlzdC5jb250ZW50LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNob3BJdGVtQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5zaG9wSXRlbVByZWZhYik7XG4gICAgICAgICAgICB2YXIgc2hvcElEO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNPcGVuSUFQKXtcbiAgICAgICAgICAgICAgICBzaG9wSUQgPSBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgc2hvcElEID0gaW5kZXggKyA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoXCJTaG9wSXRlbVwiKS5pbml0KHtzaG9wSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMuc2hvcEl0ZW1MaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uSW5DaGFyZ2UnLHRoaXMub25JbkNoYXJnZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25JbkNoYXJnZScsdGhpcy5vbkluQ2hhcmdlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uSW5DaGFyZ2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uSW5DaGFyZ2VdXCIpO1xuICAgICAgICB2YXIgZ29vZHNJRCA9IHBhcmFtcy5kZXRhaWwuZ29vZHNJRDtcbiAgICAgICAgdmFyIHNob3BEYXRhQXJyYXkgPSBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YS5zaG9wLmJhc2U7XG4gICAgICAgIGlmIChnb29kc0lEIDwgMCB8fCBnb29kc0lEID49IHNob3BEYXRhQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gc2hvcERhdGFBcnJheSBsZW5ndGggPSBcIiArIHNob3BEYXRhQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXRlbVZhbCA9IHNob3BEYXRhQXJyYXlbZ29vZHNJRF07XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInByb2R1Y3RpZFwiXSA9IGl0ZW1WYWwuaWQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHBhcmFtc1tcInBheV9hbXRcIl0gPSBpdGVtVmFsLnByaWNlO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1BheUluaXQyXzAuYXNoeFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXJsXCJdID0gdXJsO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInBheV90eXBlXCJdID0gXCI4XCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJwcm9kdWN0aWRcIl0gPSBpdGVtVmFsLmlkO1xuICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVApIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5pb3NwcmljZTtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgICAgIHVybCArPSBcIi9IWk1vYmlsZS9QYXlJbml0Ml8wLmFzaHhcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmVycm9yY29kZSA9PSAxMDAyNikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiU2hvcENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUV2ZW50OiBcIlNob3BDb21wbGV0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5wcmljZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG4gICAgfSxcbiAgICBvbkNob29zZVBheXR5cGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uQ2hvb3NlUGF5dHlwZV1cIilcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvQ2hvb3NlUGF5VHlwZVZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkNob29zZVBheVR5cGVWaWV3XCIpLmluaXQocGFyYW1zKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DaG9vc2VQYXl0eXBlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB9KSAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9jb250ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHN6VGV4dCA9IHBhcmFtcy5tZXNzYWdlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSBzelRleHQ7XG4gICAgfVxuXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICAgICAgX2ZhY2VJRDogMCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgZmFjZUlEID0gcGFyYW1zLmZhY2VJRDtcbiAgICAgICAgdGhpcy5fZmFjZUlEID0gZmFjZUlEO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VJdGVtXVtvbkNsaWNrXSBmYWNlSUQgPSBcIit0aGlzLl9mYWNlSUQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KCdvbkNoYW5nZVVzZXJGYWNlJyx7ZmFjZUlEOnRoaXMuX2ZhY2VJRCsxfSk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgdXNlckZhY2VJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudXNlckZhY2VDb3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJGYWNlSXRlbVByZWZhYik7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlVzZXJGYWNlSXRlbVwiKS5pbml0KHtmYWNlSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMudXNlckZhY2VMaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIHRoaXMuX2ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBKU09OLnN0cmluZ2lmeShwYXJhbXMuZGV0YWlsKSk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlXCIscGFyYW1zLmRldGFpbCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBGYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1VzZXJQcm9maWxlVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiVXNlclByb2ZpbGVWaWV3XCIpLl9mYWNlSUQgPSBGYWNlSUQ7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBjaGlwRnJhbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuICAgICAgICB3aW5GcmFtZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG4gICAgICAgIGxvc2VGcmFtZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG4gICAgICAgIGxvb2tGcmFtZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG4gICAgICAgIHBlb3BsZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAxNjsgaW5kZXgrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlwRnJhbWVzW2luZGV4XSA9IHRoaXMucGVvcGxlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJwZW9wbGVfY2hpcF9cIiArIEdsb2JhbEZ1bi5QcmVmaXhJbnRlZ2VyKGluZGV4KzEsMikpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAxODsgaW5kZXgrKykge1xuICAgICAgICAgICAgdGhpcy53aW5GcmFtZXNbaW5kZXhdID0gdGhpcy5wZW9wbGVBdGFscy5nZXRTcHJpdGVGcmFtZShcInBlb3BsZV93aW5fXCIgKyBHbG9iYWxGdW4uUHJlZml4SW50ZWdlcihpbmRleCsxLDIpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMzI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMubG9zZUZyYW1lc1tpbmRleF0gPSB0aGlzLnBlb3BsZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwicGVvcGxlX2xvc2VfXCIgKyBHbG9iYWxGdW4uUHJlZml4SW50ZWdlcihpbmRleCsxLDIpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMjA7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMubG9va0ZyYW1lc1tpbmRleF0gPSB0aGlzLnBlb3BsZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwicGVvcGxlX2xvb2tfXCIgKyBHbG9iYWxGdW4uUHJlZml4SW50ZWdlcihpbmRleCsxLDIpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hpcF9jbGlwID0gY2MuQW5pbWF0aW9uQ2xpcC5jcmVhdGVXaXRoU3ByaXRlRnJhbWVzKHRoaXMuY2hpcEZyYW1lcyx0aGlzLmNoaXBGcmFtZXMubGVuZ3RoKTtcbiAgICAgICAgY2hpcF9jbGlwLm5hbWUgPSBcImNoaXBcIjtcbiAgICAgICAgY2hpcF9jbGlwLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIGZyYW1lOiAxLCAgICAgICAgICAgICAgIC8vIOWHhuehrueahOaXtumXtO+8jOS7peenkuS4uuWNleS9jeOAgui/memHjOihqOekuuWwhuWcqOWKqOeUu+aSreaUvuWIsCAxcyDml7bop6blj5Hkuovku7ZcbiAgICAgICAgICAgIGZ1bmM6IFwicGxheWFuaW1cIiwgICAgIC8vIOWbnuiwg+WHveaVsOWQjeensFxuICAgICAgICAgICAgcGFyYW1zOiBbXCJ3aW5cIl0gICAgLy8g5Zue6LCD5Y+C5pWwXG4gICAgICAgIH0pO1xuICAgICAgICBjaGlwX2NsaXAud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xuICAgICAgICBhbmltYXRpb24uYWRkQ2xpcChjaGlwX2NsaXApO1xuICAgICAgICAvLyBhbmltYXRpb24ucGxheSgnY2hpcCcpO1xuXG4gICAgICAgIHZhciB3aW5fY2xpcCA9IGNjLkFuaW1hdGlvbkNsaXAuY3JlYXRlV2l0aFNwcml0ZUZyYW1lcyh0aGlzLndpbkZyYW1lcyx0aGlzLndpbkZyYW1lcy5sZW5ndGgpO1xuICAgICAgICB3aW5fY2xpcC5uYW1lID0gXCJ3aW5cIjtcbiAgICAgICAgd2luX2NsaXAuZXZlbnRzLnB1c2goe1xuICAgICAgICAgICAgZnJhbWU6IDEsICAgICAgICAgICAgICAgLy8g5YeG56Gu55qE5pe26Ze077yM5Lul56eS5Li65Y2V5L2N44CC6L+Z6YeM6KGo56S65bCG5Zyo5Yqo55S75pKt5pS+5YiwIDFzIOaXtuinpuWPkeS6i+S7tlxuICAgICAgICAgICAgZnVuYzogXCJwbGF5YW5pbVwiLCAgICAgLy8g5Zue6LCD5Ye95pWw5ZCN56ewXG4gICAgICAgICAgICBwYXJhbXM6IFtcImxvc2VcIl0gICAgLy8g5Zue6LCD5Y+C5pWwXG4gICAgICAgIH0pO1xuICAgICAgICB3aW5fY2xpcC53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XG4gICAgICAgIGFuaW1hdGlvbi5hZGRDbGlwKHdpbl9jbGlwKTtcblxuICAgICAgICB2YXIgbG9zZV9jbGlwID0gY2MuQW5pbWF0aW9uQ2xpcC5jcmVhdGVXaXRoU3ByaXRlRnJhbWVzKHRoaXMubG9zZUZyYW1lcyx0aGlzLmxvc2VGcmFtZXMubGVuZ3RoKTtcbiAgICAgICAgbG9zZV9jbGlwLm5hbWUgPSBcImxvc2VcIjtcbiAgICAgICAgbG9zZV9jbGlwLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIGZyYW1lOiAxLCAgICAgICAgICAgICAgIC8vIOWHhuehrueahOaXtumXtO+8jOS7peenkuS4uuWNleS9jeOAgui/memHjOihqOekuuWwhuWcqOWKqOeUu+aSreaUvuWIsCAxcyDml7bop6blj5Hkuovku7ZcbiAgICAgICAgICAgIGZ1bmM6IFwicGxheWFuaW1cIiwgICAgIC8vIOWbnuiwg+WHveaVsOWQjeensFxuICAgICAgICAgICAgcGFyYW1zOiBbXCJsb29rXCJdICAgIC8vIOWbnuiwg+WPguaVsFxuICAgICAgICB9KTtcbiAgICAgICAgbG9zZV9jbGlwLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcbiAgICAgICAgYW5pbWF0aW9uLmFkZENsaXAobG9zZV9jbGlwKTtcblxuICAgICAgICB2YXIgbG9va19jbGlwID0gY2MuQW5pbWF0aW9uQ2xpcC5jcmVhdGVXaXRoU3ByaXRlRnJhbWVzKHRoaXMubG9va0ZyYW1lcyx0aGlzLmxvb2tGcmFtZXMubGVuZ3RoKTtcbiAgICAgICAgbG9va19jbGlwLm5hbWUgPSBcImxvb2tcIjtcbiAgICAgICAgbG9va19jbGlwLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIGZyYW1lOiB0aGlzLmxvb2tGcmFtZXMubGVuZ3RoLzYwLCAgICAgICAgICAgICAgIC8vIOWHhuehrueahOaXtumXtO+8jOS7peenkuS4uuWNleS9jeOAgui/memHjOihqOekuuWwhuWcqOWKqOeUu+aSreaUvuWIsCAxcyDml7bop6blj5Hkuovku7ZcbiAgICAgICAgICAgIGZ1bmM6IFwicGxheWFuaW1cIiwgICAgIC8vIOWbnuiwg+WHveaVsOWQjeensFxuICAgICAgICAgICAgcGFyYW1zOiBbXCJjaGlwXCJdICAgIC8vIOWbnuiwg+WPguaVsFxuICAgICAgICB9KTtcbiAgICAgICAgbG9va19jbGlwLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcbiAgICAgICAgYW5pbWF0aW9uLmFkZENsaXAobG9va19jbGlwKTtcblxuICAgICAgICBhbmltYXRpb24ucGxheShcImxvb2tcIik7XG4gICAgfSxcbiAgICBwbGF5YW5pbTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIltVc2VySW5mYWNlSXRlbV1bcGxheWFuaW1dIFwiICsgcGFyYW1zKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgYW5pbWF0aW9uLnBsYXkocGFyYW1zKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9CdXR0b25fY2hhbmdlTmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvbixcbiAgICAgICAgfSxcbiAgICAgICAgbV9CdXR0b25fZWRpdE5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF91c2VyTmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlck5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VyR29sZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJJRDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VWaWV3UHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBnZW5kZXJCdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVHcm91cCxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyTWFuQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlLFxuICAgICAgICB9LFxuICAgICAgICBnZW5kZXJXb21hbkJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X29yaWdpblBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9uZXdQYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fUGFuZWxfdXNlckNoYW5nZTogY2MuTm9kZSxcbiAgICAgICAgbV9QYW5lbF91c2VySW5mbzogY2MuTm9kZSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWU7XG4gICAgICAgIHZhciBsbEdhbWVTY29yZSA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgICAgICB2YXIgZHdVc2VySUQgPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgdmFyIGNiR2VuZGVyID0gR2xvYmFsVXNlckRhdGEuY2JHZW5kZXIgfHwgMTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlckdvbGQuc3RyaW5nID0gbGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VySUQuc3RyaW5nID0gXCJJRDpcIiArIGR3VXNlcklEO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlck5hbWUuc3RyaW5nID0gc3pOaWNrTmFtZTtcbiAgICAgICAgaWYoIHRoaXMuX2ZhY2VJRCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlVXNlckZhY2UoKTtcbiAgICAgICAgICAgIGNiR2VuZGVyID0gTWF0aC5mbG9vcigodGhpcy5fZmFjZUlEIC0gMSkvNCkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmYWNlSUQgPSB0aGlzLl9mYWNlSUQgfHwgR2xvYmFsVXNlckRhdGEud0ZhY2VJRDtcbiAgICAgICAgaWYgKGZhY2VJRCA8PTAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuICAgICAgICBpZiAoY2JHZW5kZXIgPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5nZW5kZXJNYW5CdXR0b24uY2hlY2soKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5nZW5kZXJNYW5CdXR0b24uaXNDaGVjayA9IFwiICsgdGhpcy5nZW5kZXJNYW5CdXR0b24uaXNDaGVja2VkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZGVyV29tYW5CdXR0b24uY2hlY2soKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5pc0NoZWNrID0gXCIgKyB0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmlzQ2hlY2tlZCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkVuYWJsZV1cIik7XG5cbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZhY2VJRCA9IHRoaXMuX2ZhY2VJRDtcbiAgICAgICAgLy8gaWYgKGZhY2VJRCA8PTAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAvLyAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBmYWNlSUQpO1xuICAgICAgICAvLyB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICB1cmwgKz0gXCIvaHovaHpVcGRhdGVGYWNlSWQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJmYWNlSWRcIl0gPSBmYWNlSUQ7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBcIiArIHBhcmFtU3RyaW5nKTtcblxuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrRWRpdE5hbWU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlck5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5zZXRGb2N1cyh0cnVlKTtcbiAgICAgICAgLy8gdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmVtaXQoY2MuRWRpdEJveC5lZGl0aW5nLWRpZC1iZWdhbik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2hhbmdlTmFtZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBzek5ld05pY2tOYW1lID0gdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc3RyaW5nO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5zdHJpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoc3pOZXdOaWNrTmFtZS5sZW5ndGggPD0gMCB8fCBzek5ld05pY2tOYW1lID09IEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgIHVybCArPSBcIi9IWk1vYmlsZS9VcGRhdGVOaWNrTmFtZS5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHBhcmFtc1tcIm5pY2tuYW1lXCJdID0gc3pOZXdOaWNrTmFtZTtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ2hhbmdlTmFtZV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubmlja25hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN6Tmlja05hbWUgPSB2YWx1ZS5uaWNrbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubV9MYWJlbF91c2VyTmFtZS5zdHJpbmcgPSBzek5pY2tOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZSA9IHN6Tmlja05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VOYW1lU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDaGFuZ2VOYW1lXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgdXNlckZhY2VWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VyRmFjZVZpZXdQcmVmYWIpO1xuICAgICAgICB0aGlzLm5vZGUucGFyZW50LmFkZENoaWxkKHVzZXJGYWNlVmlldyk7XG4gICAgICAgIC8vIHRoaXMub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodXNlckZhY2VWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1VzZXJQcm9maWxlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvbkNsaWNrQ2hhbmdlUGFzc3dvcmQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgIHRoaXMubV9QYW5lbF91c2VySW5mby5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgIHRoaXMubV9QYW5lbF91c2VyQ2hhbmdlLmFjdGl2ZSA9IHRydWU7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IHRoaXMubV9FZGl0Ym94X29yaWdpblBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgdmFyIHN6TmV3UGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9uZXdQYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzekNvbmZpcm1QYXNzd29yZCA9IHRoaXMubV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIGlmKHN6UGFzc3dvcmQubGVuZ3RoIDw9IDAgfHwgc3pOZXdQYXNzd29yZC5sZW5ndGggPD0gMCB8fCBzekNvbmZpcm1QYXNzd29yZC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggeS4jeiDveS4uuepuiFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pQYXNzd29yZCA9PSBzek5ld1Bhc3N3b3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihzekNvbmZpcm1QYXNzd29yZCAhPSBzek5ld1Bhc3N3b3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihzek5ld1Bhc3N3b3JkLmxlbmd0aCA8IDYgfHwgc3pOZXdQYXNzd29yZC5sZW5ndGggPiAxNikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICB1cmwgKz0gXCIvaHovaHpVcGRhdGVQYXNzV29yZC5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjFcIjtcbiAgICAgICAgcGFyYW1zW1wib2xkcGFzc1wiXSA9IGNjLm1kNUVuY29kZShzelBhc3N3b3JkKTtcbiAgICAgICAgcGFyYW1zW1wibmV3cGFzc1wiXSA9IGNjLm1kNUVuY29kZShzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Bhc3N3b3JkJywgc3pOZXdQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZC5zdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1fRWRpdGJveF9uZXdQYXNzd29yZC5zdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckluZm8uYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJDaGFuZ2UuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVBhc3N3b3JkU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNwbGFzaDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIF9zdGVwOiAwLFxuICAgICAgICBfY291bnQ6IDAsXG4gICAgICAgIGtEZXNpZ25GcmFtZVJhdGU6IDYwLjAsXG4gICAgICAgIGtTcGxhc2hTdGVwTG9nbzFTdGlsbDogMCxcbiAgICAgICAga1NwbGFzaFN0ZXBMb2dvMUZhZGVPdXQ6IDEsXG4gICAgICAgIGtTcGxhc2hGYWRlVGltZTogMC41LFxuICAgICAgICBrU3BsYXNoU3RpbGxUaW1lOiAyLjAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9jb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX3N0ZXAgPSAwO1xuICAgICAgICAvLyB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTG9naW5TY2VuZVwiKTtcbiAgICAgICAgLy8gfSwgMik7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgdGhpcy5fY291bnQgKz0gZHQ7XG4gICAgICAgIGlmICh0aGlzLl9zdGVwID09PSB0aGlzLmtTcGxhc2hTdGVwTG9nbzFTdGlsbClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5fY291bnQgPiB0aGlzLmtTcGxhc2hTdGlsbFRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0ZXAgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGVwID09PSB0aGlzLmtTcGxhc2hTdGVwTG9nbzFGYWRlT3V0KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY291bnQgPiB0aGlzLmtTcGxhc2hGYWRlVGltZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGFzaC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTG9naW5TY2VuZVwiKTtcbiAgICAgICAgICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgb3AgPSAyNTUgKiAoMS4wIC0gTWF0aC5zaW4oKHRoaXMuX2NvdW50LzEuMCkgKiAwLjUgKiBNYXRoLlBJKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxhc2gub3BhY2l0eSA9IG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==