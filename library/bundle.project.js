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
    // _socketEventCallback: {
    //     [game_cmd.MDM_GR_LOGON] : this.OnSocketMainLogon,//登录消息
    //     [game_cmd.MDM_GR_USER] : this.OnSocketMainUser,//用户消息
    //     [game_cmd.MDM_GR_INFO] : this.OnSocketMainInfo,
    //     [game_cmd.MDM_GR_STATUS] : this.OnSocketMainStatus,
    //     [game_cmd.MDM_GR_SYSTEM] : this.OnSocketMainSystem,
    //     [game_cmd.MDM_GR_SERVER_INFO] : this.OnSocketMainServerInfo,
    //     [GlobalDef.MDM_GF_GAME] : function (sub, pData) {
    //         cc.director.emit("onEventGameMessage",{
    //             sub:sub,
    //             pData:pData,
    //         })
    //     },
    //     [GlobalDef.MDM_GF_FRAME] : this.OnSocketMainGameFrame,
    //     [GlobalDef.MDM_GF_PRESENT] : function (sub, pData) {

    //     },
    // },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        var self = this;
        console.log("[GameFrame][onSocketEvent] pData len = " + pData.getDataSize());
        if (!this._socketEventCallback) {
            var _socketEventCallback;

            this._socketEventCallback = (_socketEventCallback = {}, _defineProperty(_socketEventCallback, game_cmd.MDM_GR_LOGON, this.OnSocketMainLogon), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_USER, this.OnSocketMainUser), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_INFO, this.OnSocketMainInfo), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_STATUS, this.OnSocketMainStatus), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_SYSTEM, this.OnSocketMainSystem), _defineProperty(_socketEventCallback, game_cmd.MDM_GR_SERVER_INFO, this.OnSocketMainServerInfo), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_GAME, function (sub, pData) {
                cc.director.emit("onEventGameMessage", {
                    sub: sub,
                    pData: pData
                });
            }), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_FRAME, this.OnSocketMainGameFrame), _defineProperty(_socketEventCallback, GlobalDef.MDM_GF_PRESENT, function (sub, pData) {}), _socketEventCallback);
        }
        // if (!this._socketEventCallback) {
        //     this._socketEventCallback = {
        //         [game_cmd.MDM_GR_LOGON] : function (sub, pData) {//登录消息
        //             self.OnSocketMainLogon(sub,pData);
        //         },
        //         [game_cmd.MDM_GR_USER] : function (sub, pData) {//用户消息
        //             console.log("[GameFrame][onSocketEvent][MDM_GR_USER] pData len = " + pData.getDataSize());
        //             self.OnSocketMainUser(sub,pData);
        //         },
        //         [game_cmd.MDM_GR_INFO] : function (sub, pData) {
        //             self.OnSocketMainInfo(sub,pData);
        //         },
        //         [game_cmd.MDM_GR_STATUS] : function (sub, pData) {
        //             self.OnSocketMainStatus(sub,pData);
        //         },
        //         [game_cmd.MDM_GR_SYSTEM] : function (sub, pData) {
        //             self.OnSocketMainSystem(sub,pData);
        //         },
        //         [game_cmd.MDM_GR_SERVER_INFO] : function (sub, pData) {
        //             self.OnSocketMainServerInfo(sub,pData);
        //         },
        //         [GlobalDef.MDM_GF_GAME] : function (sub, pData) {
        //             cc.director.emit("onEventGameMessage",{
        //                 sub:sub,
        //                 pData:pData,
        //             })
        //         },
        //         [GlobalDef.MDM_GF_FRAME] : function (sub, pData) {
        //             self.OnSocketMainGameFrame(sub,pData);
        //         },
        //         [GlobalDef.MDM_GF_PRESENT] : function (sub, pData) {

        //         },
        //     }
        // }
        if (this._socketEventCallback && this._socketEventCallback[main]) {
            var fun = this._socketEventCallback[main];
            fun.call(this, sub, pData);
            // Function.call(this,func);
        } else {
            console.log("[GameFrame][onSocketEvent] main = " + main + "sub = " + sub + " not find");
        }
        // if(main === game_cmd.MDM_GR_LOGON){ //登录消息
        //     this.OnSocketMainLogon(sub,pData);
        // }
        // else if(main === game_cmd.MDM_GR_USER){//用户消息
        //     this.OnSocketMainUser(sub,pData);
        // }  
        // else if(main === game_cmd.MDM_GR_INFO){ //配置消息
        //     this.OnSocketMainInfo(sub,pData);
        // }
        // else if(main === game_cmd.MDM_GR_STATUS){//状态消息
        //     this.OnSocketMainStatus(sub,pData);
        // }
        // else if(main === game_cmd.MDM_GR_SYSTEM){//系统消息
        //     this.OnSocketMainSystem(sub,pData);
        // }
        // else if(main === game_cmd.MDM_GR_SERVER_INFO){//房间消息
        //     this.OnSocketMainServerInfo(sub,pData);
        // }
        // //游戏消息 框架消息 礼物消息
        // else if(main === GlobalDef.MDM_GF_GAME) {//游戏消息
        //     cc.director.emit("onEventGameMessage",{
        //         sub:sub,
        //         pData:pData,
        //     })
        // }
        // else if(main === GlobalDef.MDM_GF_FRAME){//框架消息
        //     this.OnSocketMainGameFrame(sub,pData);
        // }
        // else if(main ===GlobalDef.MDM_GF_PRESENT) {

        // }
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
            // console.log("logonframe login error");
        } else if (sub === game_cmd.SUB_GR_LOGON_FINISH) {
            console.log("[GameFrame][OnSocketMainLogon] Logon Finish");
        }
    },
    OnSocketMainUser: function OnSocketMainUser(sub, pData) {
        console.log("[GameFrame][OnSocketMainUser]");
        console.log("[GameFrame][OnSocketMainUser] pData len = " + pData.getDataSize());
        var self = this;
        if (!this._socketMainUserCallback) {
            var _socketMainUserCallba;

            this._socketMainUserCallback = (_socketMainUserCallba = {}, _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_COME, function (sub, pData) {
                console.log("SUB_GR_USER_COME");
                this.OnSocketSubUserCome(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_STATUS, function (sub, pData) {
                console.log("SUB_GR_USER_STATUS");
                this.OnSocketSubStatus(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_SCORE, function (sub, pData) {
                console.log("SUB_GR_USER_SCORE");
                this.OnSocketSubScore(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_RIGHT, function (sub, pData) {
                console.log("SUB_GR_USER_RIGHT");
                this.OnSocketSubRight(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_MEMBER_ORDER, function (sub, pData) {
                console.log("SUB_GR_MEMBER_ORDER");
                this.OnSocketSubMemberOrder(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_SIT_FAILED, function (sub, pData) {
                console.log("SUB_GR_SIT_FAILED");
                this.OnSocketSubSitFailed(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_CHAT, function (sub, pData) {
                console.log("SUB_GR_USER_CHAT");
                this.OnSocketSubChat(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_WISPER, function (sub, pData) {
                console.log("SUB_GR_USER_WISPER");
                this.OnSocketSubWisper(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_USER_INVITE, function (sub, pData) {
                console.log("SUB_GR_USER_INVITE");
                this.OnSocketSubUserInvite(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_QUERY_GOLD, function (sub, pData) {
                console.log("SUB_GR_QUERY_GOLD");
                this.OnSocketSubQueryGold(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_PRESEND_QUERY, function (sub, pData) {
                console.log("SUB_GR_PRESEND_QUERY");
                this.OnSocketSubPresentQuery(sub, pData);
            }), _defineProperty(_socketMainUserCallba, game_cmd.SUB_GR_PRESENT_ERROR, function (sub, pData) {
                console.log("SUB_GR_PRESENT_ERROR");
                // this.OnSocketSubUserCome(sub,pData);
            }), _socketMainUserCallba);
        }
        if (this._socketMainUserCallback && this._socketMainUserCallback[sub]) {
            var fun = this._socketMainUserCallback[sub];
            // fun(sub, pData);
            fun.call(this, sub, pData);
        } else {
            console.log("[GameFrame][OnSocketMainUser] sub = " + sub + " not find");
        }
        // switch(sub){
        //     case game_cmd.SUB_GR_USER_COME:
        //         console.log("SUB_GR_USER_COME");
        //         this.OnSocketSubUserCome(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_STATUS:
        //         console.log("SUB_GR_USER_STATUS");
        //         this.OnSocketSubStatus(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_SCORE:
        //         console.log("SUB_GR_USER_SCORE");
        //         this.OnSocketSubScore(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_RIGHT:
        //         console.log("SUB_GR_USER_RIGHT");
        //         this.OnSocketSubRight(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_MEMBER_ORDER:
        //         console.log("SUB_GR_MEMBER_ORDER");
        //         this.OnSocketSubMemberOrder(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_SIT_FAILED:
        //         console.log("SUB_GR_SIT_FAILED");
        //         this.OnSocketSubSitFailed(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_CHAT:
        //         console.log("SUB_GR_USER_CHAT");
        //         this.OnSocketSubChat(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_WISPER:
        //         console.log("SUB_GR_USER_WISPER");
        //         this.OnSocketSubWisper(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_USER_INVITE:
        //         console.log("SUB_GR_USER_INVITE");
        //         this.OnSocketSubUserInvite(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_QUERY_GOLD:
        //         console.log("SUB_GR_QUERY_GOLD");
        //         this.OnSocketSubQueryGold(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_PRESEND_QUERY:
        //         console.log("SUB_GR_PRESEND_QUERY");
        //         this.OnSocketSubPresentQuery(sub,pData);
        //         break;
        //     case game_cmd.SUB_GR_PRESENT_ERROR:
        //         console.log("SUB_GR_PRESENT_ERROR");
        //         // this.OnSocketSubUserCome(sub,pData);
        //         break;
        //     default:
        //         break;
        // }
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
                break;
            case game_cmd.SUB_GR_TABLE_STATUS:
                console.log("SUB_GR_TABLE_STATUS");
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
        if (userScore.dwUserID == myUserItem.dwUserID) {
            console.log("[GameFrame][OnSocketSubScore] 更新 " + JSON.stringify(userScore));
            myUserItem.lScore = userScore.UserScore.lScore;
            myUserItem.lGameGold = userScore.UserScore.lGameGold;
            myUserItem.lWinCount = userScore.UserScore.lWinCount;
            myUserItem.lLostCount = userScore.UserScore.lLostCount;
            myUserItem.lDrawCount = userScore.UserScore.lDrawCount;
            myUserItem.lFleeCount = userScore.UserScore.lFleeCount;
            myUserItem.lExperience = userScore.UserScore.lExperience;
            myUserItem.lLoveliness = userScore.lLoveliness;
        }
        //通知更新界面
        if (myUserItem.wTableID !== GlobalDef.INVALID_TABLE) {
            cc.director.emit("onEventUserScore", {
                userScore: userScore
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
        if (szPassWord) {
            sitData.pushbyte(szPassWord.length);
        } else {
            sitData.pushbyte(0);
        }
        sitData.pushword(wChairID);
        sitData.pushword(wTableID);
        sitData.pushstring(szPassWord, GlobalDef.PASS_LEN);

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
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","CMD_ZaJinHua":"CMD_ZaJinHua","GameServerItem":"GameServerItem","GameUserItem":"GameUserItem","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"GameServerItem":[function(require,module,exports){
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
module.exports = {
    ActionShowTanChuang: ActionShowTanChuang,
    showToast: showToast,
    showAlert: showAlert,
    showPopWaiting: showPopWaiting,
    buildRequestParam: buildRequestParam,
    ipToNumber: ipToNumber,
    numberToIp: numberToIp
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9DaG9vc2VQYXlUeXBlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0dhbWVGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZVNlcnZlckl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L0dhbWVVc2VySXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvR2xvYmFsRGVmLmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9HbG9iYWxGdW4uanMiLCJhc3NldHMvU2NyaXB0L0dsb2JhbFVzZXJEYXRhLmpzIiwiYXNzZXRzL1NjcmlwdC9IZWxsb1dvcmxkLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS9tb2RlbHMvTG9nb25GcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvTG9nb25TY2VuZS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvbG9nb24vTG9nb25WaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9NRDUuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1BsYXphUm9vbUl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L1BsYXphVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvUG9wV2FpdFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL2xvZ29uL1JlZ2lzdGVyVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2V0dGluZ1ZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1Nob3BJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TaG9wVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvVG9hc3RWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyRmFjZUl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJGYWNlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlclByb2ZpbGVWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9XZWxjb21lVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYUTs7QUFjWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBdkNJOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGUTtBQUlaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRnNCO0FBSTFCO0FBQ0k7QUFDQTtBQUZ1QjtBQUkzQjtBQUNJO0FBQ0E7QUFGbUI7QUFJdkI7QUF0Q1E7O0FBeUNaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBWE47QUFhQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUEzTkk7Ozs7Ozs7Ozs7QUNMVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDRTtBQUNEO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUNEO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDRTtBQUVJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNEO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBQ0Q7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUF2Sm9COztBQTJKekI7Ozs7Ozs7Ozs7QUMzSkE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7OztBQy9hQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ25mQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBYlE7O0FBZ0JaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDSDtBQS9ESTs7Ozs7Ozs7Ozs7O0FDSFQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBOztBQUdBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDQTtBQUNBO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFBZ0M7O0FBQzVCO0FBUVE7QUFDSTtBQUNBO0FBRmtDO0FBSXpDO0FBTVI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBR0c7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQW1DOztBQUMvQjtBQUVRO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVSO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUdHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQXBDUjtBQXNDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFSUjtBQVVIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQTdCUjtBQStCSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUxSO0FBT0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFHQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQztBQUlwQztBQUNKO0FBQ0k7QUFqRFI7QUFtREg7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhnQztBQUt2QztBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBSkE7QUFNSTtBQUNBO0FBQ0g7QUFDRDtBQUpLO0FBTUQ7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBQ0Q7QUFUSztBQVdEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUM7QUFLeEM7QUFDSjtBQUNEO0FBM0NBO0FBNkNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBRUk7QUFDSTtBQURnQztBQUd2QztBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBcnhCSTs7Ozs7Ozs7OztBQ1ZUO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQWpCUjtBQW1CSDtBQUNKO0FBcEV5Qjs7QUF1RTlCOzs7Ozs7Ozs7O0FDdkVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNKO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQWxCUjtBQW9CSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDWTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBL051Qjs7QUFrTzVCOzs7Ozs7Ozs7O0FDbk9BO0FBQ0k7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUo7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBR0o7Ozs7Ozs7Ozs7QUN4TEE7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBR1k7QUFDSTtBQUNIO0FBQ0o7QUFFWjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDtBQUNDO0FBQ0E7QUFDQztBQUNBO0FBQ0U7QUFDQTtBQUNDO0FBQ0E7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQztBQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQYTs7Ozs7Ozs7OztBQzFIakI7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUEvRmdCOztBQWtHckI7Ozs7Ozs7Ozs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBTlE7QUFRWjtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUExRkk7Ozs7Ozs7Ozs7QUNKVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNFO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0Y7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSjtBQUNJO0FBakNSO0FBbUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVIO0FBdk5JOzs7Ozs7Ozs7O0FDUlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0k7QUFDQTtBQUZVO0FBZk47O0FBcUJaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFKMkM7QUFNbkQ7QUFDRDtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0Q7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSztBQUNKO0FBRUk7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFKMkM7QUFNaEQ7QUFDQTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUF6SUk7Ozs7Ozs7Ozs7QUNKVDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZRO0FBbkJKOztBQXlCWjtBQUNBO0FBQ0k7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNIO0FBOUVJOzs7Ozs7Ozs7O0FDRFQ7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUVIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7O0FBR0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRztBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBUkw7QUFVSDs7QUFLRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDQTtBQUNIO0FBQ0o7QUFDRztBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUFBO0FBQUE7QUFBQTs7QUFNQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNIOztBQUdEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIOzs7Ozs7Ozs7O0FDbFJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFmUTs7QUFrQlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBbERJOzs7Ozs7Ozs7O0FDSFQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUEzQ1A7O0FBaURaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBM05JOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSTtBQUNBO0FBRmE7QUFmVDs7QUFxQlo7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQTlESTs7Ozs7Ozs7OztBQ0FSO0FBQ0E7QUFDQTtBQUNBO0FBQ0c7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZXO0FBSWY7QUFDSTtBQUNBO0FBRlU7QUF2Qk47O0FBNkJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFKMEI7QUFNakM7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQXRJSzs7Ozs7Ozs7OztBQ0hWO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFYVDs7QUFpQlo7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUF6Q0k7Ozs7Ozs7Ozs7QUNEVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0E7QUFwQlE7O0FBdUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUEzQ0s7Ozs7Ozs7Ozs7QUNBVDtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGWTtBQUloQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBbkJROztBQXNCWjtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFFRztBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFKMkM7QUFNaEQ7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFsS0k7Ozs7Ozs7Ozs7QUNIVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYTtBQVhUOztBQWlCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIOztBQUdEO0FBQ0E7O0FBRUE7QUF6Q0s7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmOztBQW5CUTs7QUF1Qlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUExQ0s7Ozs7Ozs7Ozs7QUNBVDtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmdCO0FBSXBCO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFuQlE7O0FBc0JaO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVKO0FBQ0Q7QUFDQTtBQUNIO0FBakVJOzs7Ozs7Ozs7O0FDRlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGaUI7QUFJckI7QUFDSTtBQUNBO0FBRmU7QUFJbkI7QUFDSTtBQUNBO0FBRmdCO0FBSXBCO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZZO0FBSWhCO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBSWY7QUFDSTtBQUNBO0FBRmdCO0FBSXBCO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSTtBQUNBO0FBRmU7QUFJbkI7QUFDSTtBQUNBO0FBRnNCO0FBSTFCO0FBQ0k7QUFDQTtBQUZ1QjtBQUkzQjtBQUNJO0FBQ0E7QUFGbUI7QUFJdkI7QUFDQTtBQXhFUTs7QUEyRVo7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSztBQUNBO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUFsU0s7Ozs7Ozs7Ozs7QUNKVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBckJROztBQXdCWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFFSTtBQUNBO0FBQ0g7QUFDSjtBQUdHO0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUE5REkiLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2FsZXJ0OiBjYy5MYWJlbCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMuaW5pdCh7bWVzc2FnZTpcInRoaXMgaXMganVzdCB0ZXN0XCJ9KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkxvYWRdXCIpO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHBhcmFtcy5tZXNzYWdlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfYWxlcnQuc3RyaW5nID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmZhZGVJbigwLjUpLGNjLmRlbGF5VGltZSgxLjApLGNjLmZhZGVPdXQoMC41KSxjYy5yZW1vdmVTZWxmKCkpKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkRlc3Ryb3ldIG1lc3NhZ2UgPSBcIiArIG1lc3NhZ2UpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgcmFkaW9CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlXG4gICAgICAgIH0sXG4gICAgICAgIHBhbmVsR3JvdXA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF9nZXRfdXNlckdvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX2dldF9iYW5rR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfc2F2ZV91c2VyR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfc2F2ZV9iYW5rR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fRWRpdGJveF9nZXRfZ29sZDogY2MuRWRpdEJveCxcbiAgICAgICAgbV9FZGl0Ym94X2dldF9iYW5rUHdkOiBjYy5FZGl0Qm94LFxuICAgICAgICBtX0VkaXRib3hfc2F2ZV9nb2xkOiBjYy5FZGl0Qm94LFxuICAgICAgICBtX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfY29uZmlybVBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X25ld1Bhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgX3NlbGVjdEluZGV4OjAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpO1xuICAgIH0sXG4gICAgcmVmcmVzaFVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9MYWJlbF9nZXRfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9zYXZlX3VzZXJHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfZ2V0X2JhbmtHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9zYXZlX2JhbmtHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmU7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkVuYWJsZV1cIik7XG5cbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgcmFkaW9CdXR0b25DbGlja2VkOiBmdW5jdGlvbih0b2dnbGUpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5yYWRpb0J1dHRvbi5pbmRleE9mKHRvZ2dsZSk7XG4gICAgICAgIHRoaXMuX3NlbGVjdEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRvZ2dsZS5ub2RlLnNldExvY2FsWk9yZGVyKDEpO1xuICAgICAgICB2YXIgdGl0bGUgPSBcIlJhZGlvQnV0dG9uXCI7XG4gICAgICAgIHN3aXRjaChpbmRleCkge1xuICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgdGl0bGUgKz0gXCIxXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgdGl0bGUgKz0gXCIyXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgdGl0bGUgKz0gXCIzXCI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yYWRpb0J1dHRvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnJhZGlvQnV0dG9uW2ldO1xuICAgICAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5wYW5lbEdyb3VwW2ldO1xuICAgICAgICAgICAgaWYoY2MuaXNWYWxpZChlbGVtZW50KSAmJiBjYy5pc1ZhbGlkKHBhbmVsKSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubm9kZS5zZXRMb2NhbFpPcmRlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ub2RlLnNldExvY2FsWk9yZGVyKDApO1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGl0bGUpO1xuICAgICAgICAvLyB0aGlzLl91cGRhdGVUb2dnbGVFdmVudFN0cmluZyh0aXRsZSwgdGhpcy5yYWRpb0J1dHRvbkV2ZW50U3RyaW5nLCB0b2dnbGUpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm06IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgLy8gdXJsICs9IFwiL2h6L2h6VXBkYXRlRmFjZUlkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBpZih0aGlzLl9zZWxlY3RJbmRleCA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgc3pHb2xkQ291bnQgPSB0aGlzLm1fRWRpdGJveF9nZXRfZ29sZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgc3pQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X2dldF9iYW5rUHdkLnN0cmluZztcbiAgICAgICAgICAgIHZhciByZSA9IC8uLztcbiAgICAgICAgICAgIGlmKHN6R29sZENvdW50Lmxlbmd0aCA8PSAwIHx8IHN6UGFzc1dvcmQubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g6YeR6aKd5oiW5a+G56CB5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIumHkemineaIluWvhueggeS4jeiDveS4uuepuiFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoTnVtYmVyKHN6R29sZENvdW50KSA8PSAwIHx8IE51bWJlcihzekdvbGRDb3VudCkgPiAoR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZSkpe1xuICAgICAgICAgICAgICAgIC8vdG9kb1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66ZO26KGM55qE6YeR6aKd6ZmQ5Yi277yBXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaVsOWAvOS4jeWQiOazleaIlui2heWHuumTtuihjOeahOmHkeminemZkOWItiFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcInNjb3JlXCJdID0gc3pHb2xkQ291bnQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJpbnN1cmVwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6UGFzc1dvcmQpO1xuICAgICAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMlwiO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVc2VyQmFua01vYmlsZS5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc2VsZWN0SW5kZXggPT0gMSkge1xuICAgICAgICAgICAgdmFyIHN6R29sZENvdW50ID0gdGhpcy5tX0VkaXRib3hfc2F2ZV9nb2xkLnN0cmluZztcbiAgICAgICAgICAgIGlmIChzekdvbGRDb3VudC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g6YeR6aKd5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIumHkemineS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihOdW1iZXIoc3pHb2xkQ291bnQpIDw9IDAgfHwgTnVtYmVyKHN6R29sZENvdW50KSA+IE51bWJlcihHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSkpe1xuICAgICAgICAgICAgICAgIC8vdG9kb1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66Lqr5LiK6YeR6aKd77yBXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaVsOWAvOS4jeWQiOazleaIlui2heWHuui6q+S4iumHkemine+8gVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcInNjb3JlXCJdID0gc3pHb2xkQ291bnQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIxXCI7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVzZXJCYW5rTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuX3NlbGVjdEluZGV4ID09IDIpIHtcbiAgICAgICAgICAgIHZhciBzelBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHN6TmV3UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9uZXdQYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgc3pDb25maXJtUGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHN6UGFzc1dvcmQubGVuZ3RoIDw9IDAgfHwgc3pOZXdQYXNzV29yZC5sZW5ndGggPD0gMCB8fCBzekNvbmZpcm1QYXNzV29yZC5sZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5a+G56CB5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggeS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzelBhc3NXb3JkID09IHN6TmV3UGFzc1dvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzekNvbmZpcm1QYXNzV29yZCAhPSBzek5ld1Bhc3NXb3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3pOZXdQYXNzV29yZC5sZW5ndGggPCA2IHx8IHN6TmV3UGFzc1dvcmQubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIyXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJvbGRwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6UGFzc1dvcmQpO1xuICAgICAgICAgICAgcGFyYW1zW1wibmV3cGFzc1wiXSA9IGNjLm1kNUVuY29kZShzek5ld1Bhc3NXb3JkKTtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlUGFzc1dvcmQuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUgPSB2YWx1ZS5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaW5zdXJlc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZSA9IHZhbHVlLmluc3VyZXNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkJhbmtTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hVSSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkNsaWNrU2F2ZUFsbDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fRWRpdGJveF9zYXZlX2dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgfSxcbiAgICBvbkNsaWNrR2V0QWxsOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X2dldF9nb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmU7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgQmFzZUZyYW1lID0gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lIG9uTG9hZFwiKTtcbiAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gdGhpcy5fY2FsbEJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5tX3RhYkNhY2hlTXNnID0ge307XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIH0sXG4gICAgLy8gbmFtZTogXCJCYXNlRnJhbWVcIixcbiAgICAvLyBjdG9yOiBmdW5jdGlvbigpe1xuICAgIC8vICAgICAvLyB0aGlzLl92aWV3RnJhbWUgPSB2aWV3O1xuICAgIC8vICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICAvLyB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBcbiAgICAvLyAgICAgdGhpcy5fZ2FtZUZyYW1lID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICB0aGlzLm1fdGFiQ2FjaGVNc2cgPSB7fTtcbiAgICAgICAgXG4gICAgLy8gfSxcbiAgICBzZXRDYWxsQmFjazogZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgdGhpcy5fY2FsbEJhY2sgPSBjYWxsYmFjazsgIFxuICAgIH0sXG4gICAgc2V0Vmlld0ZyYW1lOiBmdW5jdGlvbih2aWV3RnJhbWUpe1xuICAgICAgdGhpcy5fdmlld0ZyYW1lID0gdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBzZXRTb2NrZXRFdmVudDogZnVuY3Rpb24oc29ja2V0RXZlbnQpe1xuICAgICAgICB0aGlzLl9zb2NrZXRFdmVudCA9IHNvY2tldEV2ZW50O1xuICAgIH0sXG4gICAgZ2V0Vmlld0ZyYW1lOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuX3ZpZXdGcmFtZTsgIFxuICAgIH0sXG4gICAgaXNTb2NrZXRTZXJ2ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9zb2NrZXQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl90aHJlYWRpZCAhPT0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFcnJvcjogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgaWYodGhpcy5fdGhyZWFkaWQgPT09IHVuZGVmaW5lZClcbiAgICAgIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAvL3RvZG8uLi5cbiAgICB9LFxuICAgIG9uQ3JlYXRlU29ja2V0OiBmdW5jdGlvbihzelVybCxuUG9ydCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3pTZXJ2ZXJVcmwgPSBzelVybDtcbiAgICAgICAgdGhpcy5fblNlcnZlclBvcnQgPSBuUG9ydDtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLl9Tb2NrZXRGdW4gPSBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgICAgICBzZWxmLm9uU29ja2V0Q2FsbEJhY2socERhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSBDbGllbnRTb2NrZXQuY3JlYXRlU29ja2V0KHRoaXMuX1NvY2tldEZ1bik7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSk7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldC5Db25uZWN0U29ja2V0KHRoaXMuX3N6U2VydmVyVXJsLHRoaXMuX25TZXJ2ZXJQb3J0KSA9PT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uQ3JlYXRlU29ja2V0IGNsb3NlXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU29ja2V0Q2FsbEJhY2s6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgaWYocERhdGEgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmKHRoaXMuX2NhbGxCYWNrID09PSB1bmRlZmluZWQpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdubyBjYWxsYmFjaycpO1xuICAgICAgICAvLyAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgIC8vIH1cbiAgICAgICAgdmFyIG1haW4gPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgICAgIHZhciBzdWIgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJvblNvY2tldENhbGxCYWNrIG1haW46IFwiICsgbWFpbiArIFwiICNzdWI6IFwiK3N1Yik7XG4gICAgICAgIGlmKG1haW4gPT09IDApIFxuICAgICAgICB7XG4gICAgICAgICAgICBpZihzdWIgPT09IDApIFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdENvbXBlbGV0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU29ja2V0RXJyb3IocERhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5vblNvY2tldEV2ZW50KG1haW4sIHN1YiwgcERhdGEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlU29ja2V0OiBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLl9zb2NrZXQgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0LnJlbGVhc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLl90aHJlYWRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9Tb2NrZXRGdW4gPSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBzZW5kU29ja2V0RGF0YTogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZiAodGhpcy5fc29ja2V0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zb2NrZXQuc2VuZFNvY2tldERhdGEocERhdGEpO1xuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWVfb25Db25uZWN0Q29tcGVsZXRlZFwiKTtcbiAgICB9LFxuICAgIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWVfb25Tb2NrZXRFdmVudF9cIittYWluK1wiLVwiK3N1Yik7XG4gICAgfSxcbiAgICBvbkdhbWVTb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkdhbWVTb2NrZXRFdmVudF9cIittYWluK1wiLVwiK3N1Yik7XG4gICAgfSxcbiAgICBcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VGcmFtZTsiLCJ2YXIgZ2FtZV9jbWQgPSB7fTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V5pWw5o2u5YyF5a6a5LmJXG5cbmdhbWVfY21kLk1ETV9HUl9MT0dPTiA9IDExOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOeZu+W9lVxuXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fQUNDT1VOVFMgPSAxMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W4kOaIt+eZu+W9lVxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1VTRVJJRCA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSSBEIOeZu+W9lVxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX01PQklMRSA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmGXG5cbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9TVUNDRVNTID0gNjAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXmiJDlip9cbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9FUlJPUiA9IDYwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5aSx6LSlXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fRklOSVNIID0gNjAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXlrozmiJBcblxuLy8gLy/miL/pl7TluJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25CeUFjY291bnRzXG4vLyB7XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQcm9jZXNzVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgLy/ov5vnqIvniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gfTtcblxuLy8gLy/miYvmnLrnmbvpmYZcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRE1vYmlsZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0VuY3J5cHRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIExXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29kZUNoZWNrSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3V2VpWGluQ2hlY2tJRDsgICAgICAgICAgICAgICAgICAgIC8v5b6u5L+h6aqM6K+B56CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZTsgICAgICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgICAgIC8v5ri45oiPQVBQ54mI5pys5Y+3KOS4jueZu+mZhuWkp+WOheebuOWQjClcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsgICAvL+acuuWZqOW6j+WIl+WPt1xuLy8gfTtcblxuLy8gLy/miL/pl7QgSUQg55m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlVc2VySURcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UHJvY2Vzc1ZlcnNpb247ICAgICAgICAgICAgICAgICAgIC8v6L+b56iL54mI5pysXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gfTtcblxuLy8gLy/nmbvlvZXmiJDlip/mtojmga9cbi8vIHN0cnVjdCBDTURfR1JfTG9nb25TdWNjZXNzXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vIH07XG5cbi8vIC8v55m75b2V5aSx6LSlXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uRXJyb3Jcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxFcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZSZ6K+v5Luj56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgICAgICAvL+mUmeivr+a2iOaBr1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55So5oi35pWw5o2u5YyF5a6a5LmJXG5cbmdhbWVfY21kLk1ETV9HUl9VU0VSID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU0lUX1JFUSA9IDExICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z2Q5LiL6K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9MT09LT05fUkVRID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml4Hop4Lor7fmsYJcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQU5EVVBfUkVRID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otbfnq4vor7fmsYJcbmdhbWVfY21kLlNVQl9HUl9VU0VSX0xFRlRfR0FNRV9SRVEgPSA0NCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emu+W8gOa4uOaIj1xuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9DT01FID0gNjAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfov5vlhaVcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQVRVUyA9IDYwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TQ09SRSA9IDYwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWwXG5nYW1lX2NtZC5TVUJfR1JfU0lUX0ZBSUxFRCA9IDYwMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z2Q5LiL5aSx6LSlXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9SSUdIVCA9IDYwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35p2D6ZmQXG5nYW1lX2NtZC5TVUJfR1JfTUVNQkVSX09SREVSID0gNjA1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbmdhbWVfY21kLlNVQl9HUl9RVUVSWV9HT0xEID0gNjA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6Lph5HosYZcbmdhbWVfY21kLlNVQl9HUl9RVUVSWV9UUkFOID0gNjA3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6LovazluJBcblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ0hBVCA9IDcwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IGK5aSp5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9XSVNQRVIgPSA3MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+engeivrea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUlVMRSA9IDcwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36KeE5YiZXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0lOVklURSA9IDgwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKA6K+35raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9JTlZJVEVfUkVRID0gODAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgoDor7for7fmsYJcbmdhbWVfY21kLlNVQl9HUl9QUkVTRU5EX1FVRVJZID0gODAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otaDpgIHmn6Xor6JcbmdhbWVfY21kLlNVQl9HUl9QUkVTRU5UX0VSUk9SID0gODAzXG5cbi8vIC8v5Lya5ZGY562J57qnXG4vLyBzdHJ1Y3QgQ01EX0dSX01lbWJlck9yZGVyXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNZW1iZXJPcmRlcjsgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vIH07XG5cbi8vIC8v55So5oi35p2D6ZmQXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJSaWdodFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlbDmja7lupMgSURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlclJpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35p2D6ZmQXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+eKtuaAgVxuLy8gc3RydWN0IENNRF9HUl9Vc2VyU3RhdHVzXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS9jee9rlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlbDmja7lupMgSURcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiVXNlclN0YXR1czsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuLy8gfTtcblxuLy8gLy/nlKjmiLfliIbmlbBcbi8vIHN0cnVjdCBDTURfR1JfVXNlclNjb3JlXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTG92ZWxpbmVzczsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+mtheWKm1xuLy8gICAgIC8vTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mtojotLnph5HosYZcbi8vICAgICAvL0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lR29sZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YeR6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICB0YWdVc2VyU2NvcmUgICAgICAgICAgICAgICAgICAgIFVzZXJTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56ev5YiG5L+h5oGvXG4vLyB9O1xuXG4vLyAvL3N0cnVjdCBvbmVUcmFuUmVjb3JkXG4vLyAvL3tcbi8vIC8vICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTtcbi8vIC8vICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RvVXNlcklEO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VG9BY2NvdW50c1tOQU1FX0xFTl07XG4vLyAvLyAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbmdvbGQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbkRhdGFbMTVdO1xuLy8gLy9cbi8vIC8vfTtcblxuLy8gLy/mn6Xor6Lnu5Pmnpwgd3NsIDIwMTUuNC4xXG4vLyBzdHJ1Y3Qgb25lVHJhblJlY29yZFxuLy8ge1xuLy8gICAgIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VHJhbkdhbWVJRDsgICAgICAgICAgICAgICAgIC8v6L2s5biQ5ri45oiPSURcbi8vICAgICAvL1RDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RyYW5HYW1lSURbMzFdOyAgICAgICAgICAgICAgICAvL+i9rOW4kOa4uOaIj0lEXG4vLyAgICAgLy9UQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUcmFuVHlwZVtOQU1FX0xFTl07ICAgICAgICAgICAvL+i9rOW4kOexu+Wei1xuLy8gICAgIC8vTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgIGxQcmVzZW50VmFsdWU7ICAgICAgICAgICAgICAgICAgLy/otaDpgIHph5HosYZcbi8vICAgICAvL1RDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRyYW5UaW1lWzIwXTsgICAgICAgICAgICAgICAgIC8v6L2s5biQ5pe26Ze0XG4gICAgXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgIC8v55So5oi35pi156ewXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgIC8v55So5oi3SURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0NvdW50OyAgICAgICAgICAgICAgICAgICAgLy/mlbDph49cbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekZsb3dlck5hbWVbMzJdOyAgICAgICAgICAgLy/npLznianlkI3np7Bcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRyYW5UeXBlW05BTUVfTEVOXTsgICAgICAgLy/ovazluJDnsbvlnotcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVHJhbkdvbGRSZWNvcmRSXG4vLyB7XG4vLyAgICAgQllURSAgICBudW07Ly/mnInlh6DmnaHooahcbi8vICAgICBvbmVUcmFuUmVjb3JkICAgb25ldHJhbnJlY29yZFsxMF07Ly/mnIDlpJrljYHmnaHorrDlvZXkuIDlj5Fcbi8vIH07XG5cbi8vIC8vLy8v55So5oi35p+l6K+i6YeR6LGG57uT5p6cIDIwMTEuNy4xNSBieSBnYW9zaGFuXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJRdWlCYW5rZXJcbi8vIHtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgIC8v6ZO26KGM6YeR6LGGXG4vLyAgICAgQ01EX0dQX1RyYW5Hb2xkUmVjb3JkUiAgICAgICAgICAgICAgVHJhblJlY29yZDtcbi8vIH07XG5cbi8vIC8v6K+35rGC5Z2Q5LiLXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTaXRSZXFcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGFzc0xlbjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+G56CB6ZW/5bqmXG4vLyAgICAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICBkd0Fuc3dlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WbnuetlCBJIEQvL+WFvOWuueenr+WIhua4uOaIj+WFpeW6p+mXrumimFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L2N572uXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRhYmxlUGFzc1tQQVNTX0xFTl07ICAgICAgICAgICAgICAvL+ahjOWtkOWvhueggVxuLy8gfTtcblxuLy8gLy/pgoDor7fnlKjmiLdcbi8vIHN0cnVjdCBDTURfR1JfVXNlckludml0ZVJlcVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gfTtcblxuLy8gLy/lnZDkuIvlpLHotKVcbi8vIHN0cnVjdCBDTURfR1JfU2l0RmFpbGVkXG4vLyB7XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekZhaWxlZERlc2NyaWJlWzI1Nl07ICAgICAgICAgICAgICAvL+mUmeivr+aPj+i/sFxuLy8gfTtcblxuLy8gLy/ogYrlpKnnu5PmnoRcbi8vIHN0cnVjdCBDTURfR1JfVXNlckNoYXRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgQ09MT1JSRUYgICAgICAgICAgICAgICAgICAgICAgICBjckZvbnRDb2xvcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+minOiJslxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdTZW5kVXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNoYXRNZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgICAvL+iBiuWkqeS/oeaBr1xuLy8gfTtcblxuLy8gLy/np4Hor63nu5PmnoRcbi8vIHN0cnVjdCBDTURfR1JfV2lzcGVyXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIENPTE9SUkVGICAgICAgICAgICAgICAgICAgICAgICAgY3JGb250Q29sb3I7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/popzoibJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3U2VuZFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB55So5oi3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDaGF0TWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgICAgLy/ogYrlpKnkv6Hmga9cbi8vIH07XG5cbi8vIC8v55So5oi36KeE5YiZXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJSdWxlXG4vLyB7XG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiUGFzc3dvcmQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruWvhueggVxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0V2luOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbog5znjodcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdEZsZWU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi25pat57q/XG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuWIhuaVsFxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkNoZWNrU2FtZUlQOyAgICAgICAgICAgICAgICAgICAgICAgLy/mlYjpqozlnLDlnYBcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdXaW5SYXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26IOc546HXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmxlZVJhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItumAg+i3kVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbE1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDpq5jliIbmlbBcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxMZXNzU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA5L2O5YiG5pWwXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3N3b3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+ahjOWtkOWvhueggVxuLy8gfTtcblxuLy8gLy/pgoDor7fnlKjmiLdcbi8vIHN0cnVjdCBDTURfR1JfVXNlckludml0ZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v6YWN572u5L+h5oGv5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9JTkZPID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/phY3nva7kv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX1NFUlZFUl9JTkZPID0gOTAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7TphY3nva5cbmdhbWVfY21kLlNVQl9HUl9PUkRFUl9JTkZPID0gOTAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfphY3nva5cbmdhbWVfY21kLlNVQl9HUl9NRU1CRVJfSU5GTyA9IDkwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfQ09MVU1OX0lORk8gPSA5MDMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX0NPTkZJR19GSU5JU0ggPSA5MDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mFjee9ruWujOaIkFxuXG4vLyAvL+a4uOaIj+aIv+mXtOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9TZXJ2ZXJJbmZvXG4vLyB7XG4vLyAgICAgLy/miL/pl7TlsZ7mgKdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpckNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3R2FtZUdlbnJlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+exu+Wei1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdLaW5kSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57G75Z6LIEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdWaWRlb0FkZHI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/op4bpopHlnLDlnYBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiSGlkZVVzZXJJbmZvOyAgICAgICAgICAgICAgICAgICAgIC8v6ZqQ6JeP5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+WIhuaVsOaPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9TY29yZUluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdEZXNjcmliZUNvdW50OyAgICAgICAgICAgICAgICAgICAgIC8v5o+P6L+w5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RGF0YURlc2NyaWJlWzE2XTsgICAgICAgICAgICAgICAgICAvL+aVsOaNruagh+W/l1xuLy8gfTtcblxuLy8gLy/nrYnnuqfmj4/ov7Dnu5PmnoRcbi8vIHN0cnVjdCB0YWdPcmRlckl0ZW1cbi8vIHtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn56ev5YiGXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3T3JkZXJEZXNjcmliZVsxNl07ICAgICAgICAgICAgICAgICAvL+etiee6p+aPj+i/sFxuLy8gfTtcblxuLy8gLy/nrYnnuqfmj4/ov7Dkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfT3JkZXJJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3T3JkZXJDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+aVsOebrlxuLy8gICAgIHRhZ09yZGVySXRlbSAgICAgICAgICAgICAgICAgICAgT3JkZXJJdGVtWzEyOF07ICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfmj4/ov7Bcbi8vIH07XG5cbi8vIC8v5YiX6KGo6aG55o+P6L+w57uT5p6EXG4vLyBzdHJ1Y3QgdGFnQ29sdW1uSXRlbVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbHVtbldpZHRoOyAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajlrr3luqZcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdEYXRhRGVzY3JpYmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5a2X5q6157G75Z6LXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNvbHVtbk5hbWVbMTZdOyAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOWQjeWtl1xuLy8gfTtcblxuLy8gLy/liJfooajmj4/ov7Dkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfQ29sdW1uSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbHVtbkNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajmlbDnm65cbi8vICAgICB0YWdDb2x1bW5JdGVtICAgICAgICAgICAgICAgICAgIENvbHVtbkl0ZW1bMzJdOyAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5o+P6L+wXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/miL/pl7TnirbmgIHmlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX1NUQVRVUyA9IDQ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v54q25oCB5L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9UQUJMRV9JTkZPID0gNjAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkv6Hmga9cbmdhbWVfY21kLlNVQl9HUl9UQUJMRV9TVEFUVVMgPSA2MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOeKtuaAgVxuXG4vLyAvL+ahjOWtkOeKtuaAgee7k+aehFxuLy8gc3RydWN0IHRhZ1RhYmxlU3RhdHVzXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiUGxheVN0YXR1czsgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlRhYmxlTG9jazsgICAgICAgICAgICAgICAgICAgICAgICAgLy/plIHlrprnirbmgIFcbi8vIH07XG5cbi8vIC8v5qGM5a2Q54q25oCB5pWw57uEXG4vLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDmlbDnm65cbi8vICAgICB0YWdUYWJsZVN0YXR1cyAgICAgICAgICAgICAgICAgIFRhYmxlU3RhdHVzWzUxMl07ICAgICAgICAgICAgICAgICAgIC8v54q25oCB5pWw57uEXG4vLyB9O1xuXG4vLyAvL+ahjOWtkOeKtuaAgeS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9UYWJsZVN0YXR1c1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlRhYmxlTG9jazsgICAgICAgICAgICAgICAgICAgICAgICAgLy/plIHlrprnirbmgIFcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQbGF5U3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v566h55CG5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9NQU5BR0VSID0gNTUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIblkb3ku6RcblxuZ2FtZV9jbWQuU1VCX0dSX1NFTkRfV0FSTklORyA9IDExICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB6K2m5ZGKXG5nYW1lX2NtZC5TVUJfR1JfU0VORF9NRVNTQUdFID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHmtojmga9cbmdhbWVfY21kLlNVQl9HUl9MT09LX1VTRVJfSVAgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeeci+WcsOWdgFxuZ2FtZV9jbWQuU1VCX0dSX0tJTExfVVNFUiA9IDQ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Lii5Ye655So5oi3XG5nYW1lX2NtZC5TVUJfR1JfTElNSVRfQUNDT1VOUyA9IDU1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56aB55So5biQ5oi3XG5nYW1lX2NtZC5TVUJfR1JfU0VUX1VTRVJfUklHSFQgPSA2NiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+adg+mZkOiuvue9rlxuZ2FtZV9jbWQuU1VCX0dSX09QVElPTl9TRVJWRVIgPSA3NyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOiuvue9rlxuXG4vLyAvL+WPkemAgeitpuWRilxuLy8gc3RydWN0IENNRF9HUl9TZW5kV2FybmluZ1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzeldhcm5pbmdNZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAvL+itpuWRiua2iOaBr1xuLy8gfTtcblxuLy8gLy/ns7vnu5/mtojmga9cbi8vIHN0cnVjdCBDTURfR1JfU2VuZE1lc3NhZ2Vcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2FtZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5raI5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlJvb207ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+a2iOaBr1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6U3lzdGVtTWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgIC8v57O757uf5raI5oGvXG4vLyB9O1xuXG4vLyAvL+afpeeci+WcsOWdgFxuLy8gc3RydWN0IENNRF9HUl9Mb29rVXNlcklQXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gfTtcblxuLy8gLy/ouKLlh7rnlKjmiLdcbi8vIHN0cnVjdCBDTURfR1JfS2lsbFVzZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+emgeeUqOW4kOaIt1xuLy8gc3RydWN0IENNRF9HUl9MaW1pdEFjY291bnRzXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gfTtcblxuLy8gLy/mnYPpmZDorr7nva5cbi8vIHN0cnVjdCBDTURfR1JfU2V0VXNlclJpZ2h0XG4vLyB7XG4vLyAgICAgLy/nu5Hlrprlj5jph49cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQWNjb3VudHNSaWdodDsgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35p2D6ZmQXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdhbWVSaWdodDsgICAgICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+adg+mZkFxuLy8gICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdFJvb21DaGF0OyAgICAgICAgICAgICAgICAgICAgLy/lpKfljoXogYrlpKlcbi8vICAgICAvL+adg+mZkOWPmOWMllxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdExvb2tvbkdhbWU7ICAgICAgICAgICAgICAgICAgLy/ml4Hop4LmnYPpmZBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRHYW1lQ2hhdDsgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6IGK5aSpXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0U2VuZFdpc3BlcjsgICAgICAgICAgICAgICAgICAvL+WPkemAgea2iOaBr1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdFBsYXlHYW1lOyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mnYPpmZBcbi8vIH07XG5cbi8v6K6+572u5qCH5b+XXG5nYW1lX2NtZC5PU0ZfUk9PTV9DSEFUID0gMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpKfljoXogYrlpKlcbmdhbWVfY21kLk9TRl9HQU1FX0NIQVQgPSAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+iBiuWkqVxuZ2FtZV9jbWQuT1NGX1JPT01fV0lTUEVSID0gMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpKfljoXnp4HogYpcbmdhbWVfY21kLk9TRl9FTlRFUl9HQU1FID0gNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5vlhaXmuLjmiI9cbmdhbWVfY21kLk9TRl9FTlRFUl9ST09NID0gNSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5vlhaXmiL/pl7RcbmdhbWVfY21kLk9TRl9TSEFMTF9DTE9TRSA9IDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2z5bCG5YWz6ZetXG5cbi8vIC8v5oi/6Ze06K6+572uXG4vLyBzdHJ1Y3QgQ01EX0dSX09wdGlvblNlcnZlclxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JPcHRpb25GbGFnczsgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7moIflv5dcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiT3B0aW9uVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5qCH5b+XXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/ns7vnu5/mlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX1NZU1RFTSA9IDY2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9NRVNTQUdFID0gMjAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/mtojmga9cblxuLy/mtojmga/nsbvlnotcbmdhbWVfY21kLlNNVF9JTkZPID0gMHgwMDAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/mtojmga9cbmdhbWVfY21kLlNNVF9FSkVDVCA9IDB4MDAwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5by55Ye65raI5oGvXG5nYW1lX2NtZC5TTVRfR0xPQkFMID0gMHgwMDA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhajlsYDmtojmga9cbmdhbWVfY21kLlNNVF9TQ09SRV9OT1RFTk9VR0ggPSAweDAwMDggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mHkeW4geS4jeWkn1xuZ2FtZV9jbWQuU01UX0NMT1NFX1JPT00gPSAweDEwMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFs+mXreaIv+mXtFxuZ2FtZV9jbWQuU01UX0lOVEVSTUlUX0xJTkUgPSAweDQwMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4reaWrei/nuaOpVxuXG4vLyAvL+a2iOaBr+aVsOaNruWMhVxuLy8gc3RydWN0IENNRF9HUl9NZXNzYWdlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TWVzc2FnZVR5cGU7ICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+exu+Wei1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd01lc3NhZ2VMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgLy/mtojmga/plb/luqZcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q29udGVudFsxMDI0XTsgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv5YaF5a65XG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/miL/pl7TmlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX1NFUlZFUl9JTkZPID0gNzcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX09OTElORV9DT1VOVF9JTkZPID0gMTAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnKjnur/kv6Hmga9cblxuLy8gLy/kurrmlbDkv6Hmga9cbi8vIHN0cnVjdCB0YWdPbkxpbmVDb3VudEluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdLaW5kSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57G75Z6L5qCH6K+GXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd09uTGluZUNvdW50OyAgICAgICAgICAgICAgICAgICAgICAvL+WcqOe6v+S6uuaVsFxuLy8gfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVfY21kOyIsInZhciBwbGF6YV9jbWQgPSB7fTtcblxuLy/lub/lnLrniYjmnKxcbnBsYXphX2NtZC5WRVJfUExBWkFfTE9XID0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbnBsYXphX2NtZC5WRVJfUExBWkFfSElHSCA9IDE2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyBwbGF6YV9jbWQuVkVSX1BMQVpBX0ZSQU1FID0gTUFLRUxPTkc7KFZFUl9QTEFaQV9MT1csVkVSX1BMQVpBX0hJR0gpXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eZu+W9lemUmeivr+agh+ivhlxuXG5wbGF6YV9jbWQuRVJDX0dQX0xPR09OX1NVQ0NFU1MgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+mZhuaIkOWKn1xucGxhemFfY21kLkVSQ19HUF9BQ0NPVU5UU19OT1RfRVhJU1QgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+S4jeWtmOWcqFxucGxhemFfY21kLkVSQ19HUF9MT05HX05VTExJVFkgPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emgeatoueZu+W9lVxucGxhemFfY21kLkVSQ19HUF9QQVNTV09SRF9FUkNPUiA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+G56CB6ZSZ6K+vXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eZu+W9leWRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX0xPR09OID0gMTM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrnmbvlvZVcblxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9BQ0NPVU5UUyA9IDMwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+355m75b2VXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX1VTRVJJRCA9IDMwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSSBEIOeZu+W9lVxucGxhemFfY21kLlNVQl9HUF9SRUdJU1RFUl9BQ0NPVU5UUyA9IDMwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rOo5YaM5biQ5Y+3XG5wbGF6YV9jbWQuU1VCX0dQX1VQTE9BRF9DVVNUT01fRkFDRSA9IDMwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a6a5LmJ5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX1JFQ09SRCA9IDMwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a6a5LmJ5aS05YOPXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFID0gMTU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrlub/lnLrnmbvlvZVcblxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUgPSAxNTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhlxucGxhemFfY21kLlNVQl9HUF9SRUdJU1RFUl9NT0JJTEUgPSAxNTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuazqOWGjFxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX1NVQ0NFU1NfTU9CSUxFID0gMjYwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYbmiJDlip9cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fRVJST1JfTU9CSUxFID0gMjYxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYblpLHotKVcbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fRklOSVNIX01PQklMRSA9IDI2MjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmG5a6M5oiQXG5cbi8vIC8v5biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uQnlBY2NvdW50c01vYmlsZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZTsgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5XZWlYaW5BdXRoSUQ7ICAgICAgICAgICAgICAgICAgLy/lvq7kv6Hpqozor4EgLy/lhbzlrrnkvb/nlKg+MTAwMHfmiavnoIHnmbvpmYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcEtpbmQ7ICAgICAgICAgICAgICAgIC8v5omL5py6QVBQ5ri45oiPSURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcFZlcnNpb247ICAgICAgICAgICAgIC8v5omL5py6QVBQ54mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsvL+acuuWZqOW6j+WIl+WPt1xuLy8gfTtcbi8vIC8v5rOo5YaM5biQ5Y+3XG4vLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNNb2JsaWVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWktOWDj+agh+ivhlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2VuZGVyOyAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi35oCn5YirXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBLaW5kOyAgICAgICAgICAgICAgICAvLyDlub/lnLrmiYvmnLrniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcFZlcnNpb247ICAgICAgICAgICAgIC8vIOW5v+WcuuaJi+acuueJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy8g55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvLyDnmbvlvZXlr4bnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZXBob25lW01PQklMRVBIT05FX0xFTl07IC8vIOaJi+aculxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy8g5pi156ewXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVBdXRoW05BTUVfTEVOXTsgICAgICAgICAvL+aJi+acuumqjOivgeeggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuXG4vLyAvL+aJi+acuueZu+mZhuaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3NNb2JpbGVcbi8vIHtcbi8vICAgICAvL+aJqeWxleS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q3VzdG9tRmFjZVZlcjsgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1vb3JNYWNoaW5lOyAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a5py65ZmoXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JCaW5kV2VpWGluOyAgICAgICAgICAgICAgICAgICAvL+e7keWumuW+ruS/oSBXU0xcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNZW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2VuZGVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RW5jcnlwdElEOyAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2RlQ2hlY2tJRDsgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIEyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdFeHBlcmllbmNlOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbEdhbWVTY29yZTsgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YeR5biBXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAvL+mTtuihjOmHkeW4gVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8v5pi156ewXG4vLyB9O1xuXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyAvL+W4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkJ5QWNjb3VudHNcbi8vIHtcblxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiVXNlclBob25lVGFnO1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gfTtcblxuLy8gLy9JIEQg55m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uQnlVc2VySURcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyB9O1xuXG4vLyAvL+azqOWGjOW4kOWPt1xuLy8gc3RydWN0IENNRF9HUF9SZWdpc3RlckFjY291bnRzXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+agh+ivhlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2VuZGVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NpdHlOdW07ICAgICAgICAgICAgICAgICAgICAgICAvL+WfjuW4gue8lueggVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiRW5qb3lUeXBlOyAgICAgICAgICAgICAgICAgICAgLy/liqDlhaXnsbvlnotcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelNwcmVhZGVyW05BTUVfTEVOXTsgICAgICAgICAgIC8v5o6o5bm/5Lq65ZCNXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvL+eUqOaIt+aYteensFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UmVhbE5hbWVbTkFNRV9MRU5dO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6SWRlbnRpdHlbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RW5qb3lDb2RlW1BBU1NfTEVOXTsgICAgICAgICAgLy/mjqjojZDnoIFvcuaWsOaJi+eggVxuLy8gfTtcblxuLy8gLy/nmbvpmYbmiJDlip9cbi8vIHN0cnVjdCBDTURfR1BfTG9nb25TdWNjZXNzXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2VuZGVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmgKfliKtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RXhwZXJpZW5jZTsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcbiAgICBcbi8vICAgICAvL+aJqeWxleS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q3VzdG9tRmFjZVZlcjsgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1vb3JNYWNoaW5lOyAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a5py65ZmoXG5cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZvcnR1bmVDb2luOyAgICAgICAgICAgICAgICAgIC8v56aP5biBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+S5kOixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgLy/kuZDosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0NvdXBvbjsgICAgICAgICAgICAgICAgICAgICAgIC8v54Gr6IW/XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVDb3Vwb247ICAgICAgICAgICAgICAgICAvL+eBq+iFv1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TWF0Y2hUaWNrZXQ7ICAgICAgICAgICAgICAgICAgLy/lj4LotZvliLhcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0QmFuazsgICAgICAgICAgICAgICAgICAgIC8vIOmmluasoeS9v+eUqFxuXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pVc2VyUGhvbmVJbmZvclsxNl07ICAgICAgICAgICAvL+eUqOaIt+aJi+aculxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgLy/plJnor6/mtojmga9cbi8vIH07XG5cbi8vIC8v55m76ZmG5aSx6LSlXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uRXJyb3Jcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsRXJyb3JDb2RlOyAgICAgICAgICAgICAgICAgICAgIC8v6ZSZ6K+v5Luj56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAvL+mUmeivr+a2iOaBr1xuLy8gfTtcblxuLy8gc3RydWN0IHRhZ0F3YXJkSW5mb1xuLy8ge1xuLy8gICAgIGludCAgICAgbkF3YXJkR29sZFs3XTtcbi8vIH07XG5cbi8vIHR5cGVkZWYgc3RydWN0XG4vLyB7XG4vLyAgICAgdGFnQXdhcmRJbmZvIGluZm87XG4vLyAgICAgQllURSAgICAgICAgSXNDaGVja2VkO1xuLy8gICAgIGludCAgICAgICAgIG5Mb2dvblRpbWU7XG4vLyB9Q01EX0dQX0F3YXJkSW5mbztcbi8vIC8v5qCh6aqM55So5oi35L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dQX0NoZWNrUmVnaXN0ZXJcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRhdGFbTkFNRV9MRU5dOyAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZsYWc7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLzA65qOA5rWL6LSm5Y+3IDE65qOA5rWL5pi156ewXG4vLyB9O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5ri45oiP5YiX6KGo5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfU0VSVkVSX0xJU1QgPSAxNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOS/oeaBr1xuXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfVFlQRSA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57G75Z6L5YiX6KGoXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfS0lORCA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56eN57G75YiX6KGoXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfU1RBVElPTiA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56uZ54K55YiX6KGoXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfU0VSVkVSID0gNTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7TliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9GSU5JU0ggPSA1MDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeWujOaIkFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0NPTkZJRyA9IDUwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo6YWN572uXG5cbi8vIC8v5YiX6KGo6YWN572uXG4vLyBzdHJ1Y3QgQ01EX0dQX0xpc3RDb25maWdcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiU2hvd09uTGluZUNvdW50OyAgICAgICAgICAgICAgIC8v5pi+56S65Lq65pWwXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/ns7vnu5/lkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9TWVNURU0gPSAxOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+WRveS7pFxuXG5wbGF6YV9jbWQuU1VCX0dQX1ZFUlNJT04gPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eJiOacrOmAmuefpVxucGxhemFfY21kLlNVQl9TUF9TWVNURU1fTVNHID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/mtojmga9cblxuLy8gLy/niYjmnKzpgJrnn6Vcbi8vIHN0cnVjdCBDTURfR1BfVmVyc2lvblxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJOZXdWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDniYjmnKxcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQWxsb3dDb25uZWN0OyAgICAgICAgICAgICAgICAgIC8v5YWB6K646L+e5o6lXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5wbGF6YV9jbWQuTURNX0dQX1VTRVIgPSAyMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG5wbGF6YV9jbWQuU1VCX0dQX1VTRVJfVVBMT0FEX0ZBQ0UgPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWktOWDj1xucGxhemFfY21kLlNVQl9HUF9VU0VSX0RPV05MT0FEX0ZBQ0UgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4i+i9veWktOWDj1xucGxhemFfY21kLlNVQl9HUF9VUExPQURfRkFDRV9SRVNVTFQgPSA1MDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOe7k+aenFxucGxhemFfY21kLlNVQl9HUF9ERUxFVEVfRkFDRV9SRVNVTFQgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIoOmZpOe7k+aenFxucGxhemFfY21kLlNVQl9HUF9DVVNUT01fRkFDRV9ERUxFVEUgPSA1MDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIoOmZpOWktOWDj1xucGxhemFfY21kLlNVQl9HUF9NT0RJRllfSU5ESVZJRFVBTCA9IDUwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Liq5Lq66LWE5paZXG5wbGF6YV9jbWQuU1VCX0dQX01PRElGWV9JTkRJVklEVUFMX1JFU1VMVCA9IDUwNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+u5pS557uT5p6cXG5cbnBsYXphX2NtZC5TVUJfR1BfU0FGRV9CSU5EID0gNTA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrbnu5HlrppcbnBsYXphX2NtZC5TVUJfR1BfU0FGRV9VTkJJTkQgPSA1MDg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ino+mZpOe7keWumlxucGxhemFfY21kLlNVQl9HUF9DSEVDS19QU0QgPSA1MDk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvhueggemqjOivgSBXU0wgMjAxNS4zLjI3XG5cblxucGxhemFfY21kLk1ETV9HUF9SRUcgPSAyMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfSU5JVF9SRUdJU1RFUiA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rOo5YaM5biQ5Y+3XG5wbGF6YV9jbWQuU1VCX0dQX0NBTkNFTF9SRUdJU1RFUiA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35Y+W5raI5rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX1JFRlVTRV9SRUcgPSA1MDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4jeiDveazqOWGjFxucGxhemFfY21kLlNVQl9HUF9DQU5fUkVHID0gNTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6/ku6Xms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfR0VUX1JFR0NPREUgPSA1MDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUs+ivt+azqOWGjOeggSB3c2wgMjAxNS40LjNcbnBsYXphX2NtZC5TVUJfR1BfUkVUX1JFR0NPREUgPSA1MDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUs+ivt+azqOWGjOeggSB3c2wgMjAxNS40LjNcbnBsYXphX2NtZC5TVUJfR1BfUkVUX1JFR0NPREVfRVJST1IgPSA1MDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUs+ivt+azqOWGjOeggSB3c2wgMjAxNS40LjNcblxuLy8gLy/kuKrkurrotYTmlplcbi8vIHN0cnVjdCBDTURfR1BfTW9kaWZ5SW5kaXZpZHVhbFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgICAgIC8v546p5a625pi156ewXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuR2VuZGVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuaAp+WIq1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkFnZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrblubTpvoRcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWRkcmVzc1s2NF07ICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625Zyw5Z2AXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelVuZGVyV3JpdGVbMzJdOyAgICAgICAgICAgICAgICAgICAvL+S4quaAp+etvuWQjVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzd29yZFszM107ICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrblr4bnoIFcbi8vIH07XG5cbi8vIC8v5a6a5LmJ5aS05YOPXG4vLyBzdHJ1Y3QgQ01EX0dQX1VwbG9hZEN1c3RvbUZhY2Vcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRTaXplOyAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWkp+Wwj1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMYXN0UGFja2V0OyAgICAgICAgICAgICAgICAgICAgLy/mnIDlkI7moIfor4Zcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmlyc3RQYWNrZXQ7ICAgICAgICAgICAgICAgICAgIC8v56ys5LiA5Liq5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkZhY2VEYXRhWzIwNDhdOyAgICAgICAgICAgICAgICAvL+WktOWDj+aVsOaNrlxuLy8gfTtcblxuLy8gLy/kuIvovb3miJDlip9cbi8vIHN0cnVjdCBDTURfR1BfRG93bmxvYWRGYWNlU3VjY2Vzc1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUb2x0YWxTaXplOyAgICAgICAgICAgICAgICAgICAgICAgLy/mgLvlhbHlpKflsI9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q3VycmVudFNpemU7ICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5aSn5bCPXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkZhY2VEYXRhWzIwNDhdOyAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/mlbDmja5cbi8vIH07XG5cbi8vIC8v5LiL6L295aS05YOPXG4vLyBzdHJ1Y3QgQ01EX0dQX0Rvd25sb2FkRmFjZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vIH07XG5cbi8vIC8v5LiK5Lyg57uT5p6cXG4vLyBzdHJ1Y3QgQ01EX0dQX1VwbG9hZEZhY2VSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGVzY3JpYmVNc2dbMTI4XTsgICAgICAgICAgICAgICAgIC8v5o+P6L+w5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZhY2VWZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk9wZXJhdGVTdWNjZXNzOyAgICAgICAgICAgICAgICAgICAgLy/miJDlip/moIfor4Zcbi8vIH07XG5cbi8vIC8v5Yig6Zmk57uT5p6cXG4vLyBzdHJ1Y3QgQ01EX0dQX0RlbGV0ZUZhY2VSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGVzY3JpYmVNc2dbMTI4XTsgICAgICAgICAgICAgICAgIC8v5o+P6L+w5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZhY2VWZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk9wZXJhdGVTdWNjZXNzOyAgICAgICAgICAgICAgICAgICAgLy/miJDlip/moIfor4Zcbi8vIH07XG5cbi8vIC8v5Yig6Zmk5raI5oGvXG4vLyBzdHJ1Y3QgQ01EX0dQX0N1c3RvbUZhY2VEZWxldGVcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZhY2VWZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gfTtcbi8vIC8v5L+u5pS55aS05YOPXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZhY2VDaGFuZ2Vcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDtcbi8vIH07XG4vLyBzdHJ1Y3QgQ01EX0dQX0ZhY2VDaGFuZ2VSZXN1bHRcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUmVzdWx0SUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+U5Zue57uT5p6cXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj0lEXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1VzZXJJbmZvXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+S/nemZqeeuseemj+W4gVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgLy/kv53pmannrrHotJ3lo7Ncbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291cG9uOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LSd5aOz5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01hdGNoVGlja2V0OyAgICAgICAgICAgICAgICAgICAgICAvL+mXqOelqOaVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGb3J0dW5lQ29pbjsgICAgICAgICAgICAgICAgICAgICAgLy/npo/osYbmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R29sZDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56aP5biB5pWwXG4vLyB9O1xuLy8gLy/kv67mlLnnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfTW9kaWZ5SW5kaXZpZHVhbFJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJPcGVyYXRlU3VjY2VzczsgICAgICAgICAgICAgICAgICAgIC8v5oiQ5Yqf5qCH6K+GXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0dldExvZ29uQXdhcmRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3SURcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5UaW1lOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yeg562J5aWW5YqxXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+W+l+WlluWKsVxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9SZXR1cm5cbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5Db2RlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+U5ZueY29kZVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lgLxcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGVzY3JpYmVbMzJdOyAgICAgICAgICAgICAgICAgICAgIC8v6L+U5Zue5o+P6L+wXG4vLyB9O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIOmTtuihjOaTjeS9nCjlvIDliIblhpks5YeP5bCR5Yik5pat5a2X6IqCKVxucGxhemFfY21kLk1ETV9HUF9CQU5LID0gNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6ZO26KGM5L+h5oGvXG5cbi8vIOWuouaIt+err+ivt+axglxucGxhemFfY21kLlNVQl9HUF9DSEFOR0VfUEFTU1dPUkQgPSAxMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkv67mlLnlr4bnoIFcbi8vcGxhemFfY21kLlNVQl9HUF9MT09LX1NBVkUgPSAxMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmn6XnnIvorrDlvZVcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19TVE9SQUdFID0gMTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo6YeR5biBXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfR0VUID0gMTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W6YeR5biBXG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9TVE9SQUdFID0gMTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo5aWW5Yi4XG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9HRVQgPSAxMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5blpZbliLhcblxuLy8g6K+35rGC5bqU562UXG5wbGF6YV9jbWQuU1VCX0dQX0NIQU5HRV9QQVNTV09SRF9SRVMgPSAxMTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDkv67mlLnlr4bnoIFcbi8vcGxhemFfY21kLlNVQl9HUF9MT09LX1NBVkVfUkVTID0gMTExOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5p+l55yL6K6w5b2VXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfU1RPUkFHRV9SRVMgPSAxMTI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19HRVRfUkVTID0gMTEzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W6YeR5biBXG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9TVE9SQUdFX1JFUyA9IDExNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOWlluWIuFxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fR0VUX1JFUyA9IDExNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWlluWIuFxuXG5cbi8vIC8vIOS/ruaUueWvhueggVxuLy8gc3RydWN0IENNRF9HUF9DaGFuZ2VQYXNzV29yZFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi3SURcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpblBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWkp+WOheWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0JrUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5paw55qE5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkQmtQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDljp/lp4vlr4bnoIFcbi8vIH07XG5cblxuLy8gLy8g6YeR5biBLOWlluWIuCzlrZjlhaXlrZjlgqjnu5PmnoRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi3SURcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uVmFsdWU7ICAgICAgICAgICAgICAgICAvLyDmk43kvZzmlbDph49cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpblBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWkp+WOheWvhueggVxuLy8gfUNNRF9HUF9CYW5rU3RvcmFnZSwgQ01EX0dQX0NvdXBvblN0b3JhZ2U7XG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5Y+W5Ye65a2Y5YKo57uT5p6EXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt0lEXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uVmFsdWU7ICAgICAgICAgICAgICAgICAvLyDmk43kvZzmlbDph49cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpblBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWkp+WOheWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmtQYXNzd29yZFtQQVNTX0xFTl07ICAgICAgICAgLy8g55So5oi35a+G56CBXG4vLyB9Q01EX0dQX0JhbmtHZXQsIENNRF9HUF9Db3Vwb25HZXQ7XG5cblxuLy8gLy8g5L+u5pS55a+G56CB5bqU562UXG4vLyBzdHJ1Y3QgQ01EX0dQX0NoYW5nZVBhc3NXb3JkUmVzXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb2RlOyAgICAgICAgICAgICAgICAgICAgICAvLyAw5Li65oiQ5YqfKOS/ruaUuWlzRmlyc3QpXG4vLyB9O1xuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWtmOWCqOW6lOetlFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb2RlOyAgICAgICAgICAgICAgICAgICAgICAvLyDplJnor6/noIEsMOS4uuaIkOWKn1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZWYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy8g6Lqr5LiK6ZKxXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFua1ZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvLyDkv53pmannrrHpkrFcbi8vIH1DTURfR1BfQmFua1N0b3JhZ2VSZXMsIENNRF9HUF9CYW5rR2V0UmVzLCBDTURfR1BfQ291cG9uU3RvcmFnZVJlcywgQ01EX0dQX0NvdXBvbkdldFJlcztcblxucGxhemFfY21kLk1ETV9HUF9ORVcgPSA2O1xuXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9ORVdTID0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ojrflj5blhazlkYpcbnBsYXphX2NtZC5TVUJfR1BfRklORF9GUklFRE4gPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivouWlveWPi1xucGxhemFfY21kLlNVQl9HUF9HRVRfRlJJRU5EID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ojrflj5blpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfQUREX0ZSSUVORCA9IDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aKe5Yqg5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0RFTEVURV9GUklFTkQgPSA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIoOmZpOWlveWPi1xucGxhemFfY21kLlNVQl9HUF9GUklFTkRfRVJST1IgPSA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0pee7k+aenFxucGxhemFfY21kLlNVQl9HUF9TRU5EX01PTkVZID0gNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otaDpgIFcbnBsYXphX2NtZC5TVUJfR1BfU0VORF9SRUNPUkQgPSA4O1xucGxhemFfY21kLlNVQl9HUF9TRU5EX1JFU1VMVCA9IDk7XG5cbi8vIHN0cnVjdCBDTURfR1BfR2V0TmV3c1xuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TmV3c1syNTZdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GcmllbmRfUmVsYXRpdmUgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgIGR3VXNlcklEO1xuLy8gICAgIERXT1JEICAgICAgICAgICBkd0ZyaWVuZElEO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GcmllbmRFcnJvclxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgIHN6RGVzY3JpYmVbMTI4XTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRGVsZXRlRnJpZW5kUmVzdWx0XG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgIGR3RGVsZXRlSUQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZpbmRVc2VyXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgV09SRCAgICAgICAgd0ZhY2VJRDtcbi8vICAgICBjaGFyICAgICAgICBzek5pY2tOYW1lWzMyXTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRnJpZW5kTGlzdFxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgbkNvdW50OyAgICAgICAgICAgICAvL+S4quaVsFxuLy8gICAgIENNRF9HUF9GaW5kVXNlciAgICAgRnVzZXJbMTBdOyAgLy/mnIDlpJpcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfU2VuZE1vbmV5XG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgRFdPUkQgICAgICAgZHdGcmllbmRJRDtcbi8vICAgICBMT05HTE9ORyAgICBsU2NvcmU7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgdGFnVHJhblJlY29yZFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pTZW5kTmFtZVszMl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzekFjY2VwdE5hbWVbMzJdO1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgbFRyYW5Hb2xkO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9UcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICBuQ291bnQ7XG4vLyAgICAgdGFnVHJhblJlY29yZCAgICAgICBSZWNvcmRbMjBdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9TZW5kUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzelNlbmROYW1lWzMyXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6QWNjZXB0TmFtZVszMl07XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICBsU2NvcmU7XG4vLyB9O1xuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8gLy/otqPor63nu5PmnoRcbi8vIHN0cnVjdCBDTURfR0ZfVXNlckZ1blxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDlj7dcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TWFpbkluZGV4OyAgICAgICAgICAgICAgICAgICAgIC8v6Laj6K+t5p2h55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N1YkluZGV4O1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HRl9MZXZlbEluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgIHdDaGFpcklEO1xuLy8gICAgIExPTkcgICAgbEdhbWVMZXZlbDtcbi8vICAgICBMT05HICAgIEF3YXJkVHlwZTtcbi8vICAgICBMT05HICAgIEF3YXJkVmFsdWU7XG4vLyAgICAgTE9ORyAgICBsRXhwZXJpZW5jZTtcbi8vICAgICBMT05HTE9ORyAgICBsTGV2ZWxVcFZhbHVlO1xuLy8gfTtcblxuLy8gLy/or7fmsYLku7vliqFcbi8vIHN0cnVjdCBDTURfR0ZfTWlzc2lvblJlcXVlc3Rcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNaXNzaW9uVHlwZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gfTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8v5raI5oGv57G75Z6LXG5wbGF6YV9jbWQuU01UX0lORk8gPSAweDAwMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+a2iOaBr1xucGxhemFfY21kLlNNVF9FSkVDVCA9IDB4MDAwMjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5by55Ye65raI5oGvXG5wbGF6YV9jbWQuU01UX0dMT0JBTCA9IDB4MDAwNDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWo5bGA5raI5oGvXG5wbGF6YV9jbWQuU01UX0NMT1NFX0dBTUUgPSAweDEwMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFs+mXrea4uOaIj1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYXphX2NtZDsiLCJ2YXIgempoX2NtZCA9IHt9O1xuXG5cbnpqaF9jbWQuS0lORF9JRCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbnpqaF9jbWQuU0VSVkVSX0lEID0gMzAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyN5Yqh5ZmoIEkgRFxuempoX2NtZC5HQU1FX1BMQVlFUiA9IDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+S6uuaVsFxuempoX2NtZC5HQU1FX05BTUUgPSBcIuiviOmHkeiKsVwiOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/lkI3lrZdcbi8vIHpqaF9jbWQuR0FNRV9HRU5SRSAgICAgICAgICAgICAgICAgICAgICAoR0FNRV9HRU5SRV9HT0xEfEdBTUVfR0VOUkVfTUFUQ0gpICAvL+a4uOaIj+exu+Wei1xuempoX2NtZC5NQVhfQ09VTlQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miZHlhYvmlbDnm65cblxuXG56amhfY21kLlNFUlZFUkFERFJFU1MgPSBcIjEyNy4wLjAuMVwiO1xuempoX2NtZC5TRVJWRVJfUE9SVCA9IDE2ODA7XG5cbi8v57uT5p2f5Y6f5ZugXG56amhfY21kLkdFUl9OT19QTEFZRVIgPSAweDEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/msqHmnInnjqnlrrZcbnpqaF9jbWQuR0VSX0NPTVBBUkVDQVJEID0gMHgyMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM57uT5p2fXG56amhfY21kLkdFUl9PUEVOQ0FSRCA9IDB4MzA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOe7k+adn1xuXG4vL+a4uOaIj+eKtuaAgVxuempoX2NtZC5HU19US19GUkVFID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etieW+heW8gOWni1xuempoX2NtZC5HU19US19QTEFZSU5HID0gMTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6L+b6KGMXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+acjeWKoeWZqOWRveS7pOe7k+aehFxuXG56amhfY21kLlNVQl9TX0dBTUVfU1RBUlQgPSAxMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/lvIDlp4tcbnpqaF9jbWQuU1VCX1NfQUREX1NDT1JFID0gMTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo57uT5p6cXG56amhfY21kLlNVQl9TX0dJVkVfVVAgPSAxMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlL7lvIPot5/ms6hcbnpqaF9jbWQuU1VCX1NfQ09NUEFSRV9DQVJEID0gMTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM6Lef5rOoXG56amhfY21kLlNVQl9TX0xPT0tfQ0FSRCA9IDEwNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eci+eJjOi3n+azqFxuempoX2NtZC5TVUJfU19TRU5EX0NBUkQgPSAxMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HniYzmtojmga9cbnpqaF9jbWQuU1VCX1NfR0FNRV9FTkQgPSAxMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nu5PmnZ9cbnpqaF9jbWQuU1VCX1NfUExBWUVSX0VYSVQgPSAxMDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflvLrpgIBcbnpqaF9jbWQuU1VCX1NfT1BFTl9DQVJEID0gMTA4OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM5raI5oGvXG56amhfY21kLlNVQl9TX1dBSVRfQ09NUEFSRSA9IDEwOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etieW+heavlOeJjFxuempoX2NtZC5TVUJfU19MQVNUX0FERCA9IDExMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WtpOazqOS4gOaOt1xuLy8gLy/muLjmiI/nirbmgIFcbi8vIHN0cnVjdCBDTURfU19TdGF0dXNGcmVlXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ln7rnoYDnp6/liIZcbi8vIH07XG5cbi8vIC8v5ri45oiP54q25oCBXG4vLyBzdHJ1Y3QgQ01EX1NfU3RhdHVzUGxheVxuLy8ge1xuLy8gICAgIC8v5Yqg5rOo5L+h5oGvXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbE1heENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgLy/ljZXlhYPkuIrpmZBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WNleWFg+S4i+azqFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VGltZXM7ICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5YCN5pWwXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbFVzZXJNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbDkuIrpmZBcbiAgICBcbi8vICAgICAvL+eKtuaAgeS/oeaBr1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdCYW5rZXJVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5bqE5a6255So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3njqnlrrZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdOyAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJNaW5nWmh1W0dBTUVfUExBWUVSXTsgICAgICAgICAgICAgIC8v55yL54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbFRhYmxlU2NvcmVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgLy/kuIvms6jmlbDnm65cbiAgICBcbi8vICAgICAvL+aJkeWFi+S/oeaBr1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiSGFuZENhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgIC8v5omR5YWL5pWw5o2uXG4gICAgXG4vLyAgICAgLy/nirbmgIHkv6Hmga9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQ29tcGFyZVN0YXRlOyAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeKtuaAgVxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyB9O1xuXG4vLyAvL+a4uOaIj+W8gOWni1xuLy8gc3RydWN0IENNRF9TX0dhbWVTdGFydFxuLy8ge1xuLy8gICAgIC8v5LiL5rOo5L+h5oGvXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbE1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDlpKfkuIvms6hcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WNleWFg+S4i+azqFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VGltZXM7ICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5YCN5pWwXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbFVzZXJNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgLy/liIbmlbDkuIrpmZBcbiAgICBcbi8vICAgICAvL+eUqOaIt+S/oeaBr1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdCYW5rZXJVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5bqE5a6255So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3njqnlrrZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdOyAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuLy8gfTtcblxuLy8gLy/nlKjmiLfkuIvms6hcbi8vIHN0cnVjdCBDTURfU19BZGRTY29yZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0FkZFNjb3JlVXNlcjsgICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVN0YXRlOyAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeKtuaAgVxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxBZGRTY29yZUNvdW50OyAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo5pWw55uuXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZFNjb3JlOyAgICAgICAgICAgICAgICAgICAgIC8v5piv5ZCm5a2k5rOo5LiA5o63XG4vLyB9O1xuXG4vLyAvL+eUqOaIt+aUvuW8g1xuLy8gc3RydWN0IENNRF9TX0dpdmVVcFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdHaXZlVXBVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5pS+5byD55So5oi3XG4vLyB9O1xuXG4vLyAvL+avlOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX0NvbXBhcmVDYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbMl07ICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdMb3N0VXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L6T54mM55So5oi3XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxvc3RDYXJkRGF0YVtNQVhfQ09VTlRdOyAgICAgICAgICAvL+i+k+WutueJjOaVsOaNrlxuLy8gfTtcblxuLy8gLy/nnIvniYzmlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfU19Mb29rQ2FyZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdMb29rQ2FyZFVzZXI7ICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM55So5oi3XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JDYXJkRGF0YVtNQVhfQ09VTlRdOyAgICAgICAgICAgICAgLy/nlKjmiLfmiZHlhYtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxhc3RBZGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WtpOazqOS4gOaOt1xuLy8gfTtcblxuLy8gLy/lvIDniYzmlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfU19PcGVuQ2FyZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdXaW5uZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IOc5Yip55So5oi3XG4vLyB9O1xuXG4vLyAvL+WtpOazqOS4gOaOt1xuLy8gc3RydWN0IENNRF9TX0xhc3RBZGRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3U3RhcnRMYXN0QWRkVXNlcjtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdMb3N0VXNlcltHQU1FX1BMQVlFUl07XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyO1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjtcbi8vIH07XG5cblxuLy8gLy/muLjmiI/nu5PmnZ9cbi8vIHN0cnVjdCBDTURfU19HYW1lRW5kXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVUYXg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nqI7mlLZcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZVNjb3JlW0dBTUVfUExBWUVSXTsgICAgICAgICAgICAvL+a4uOaIj+W+l+WIhlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQ2FyZERhdGFbR0FNRV9QTEFZRVJdW01BWF9DT1VOVF07IC8v55So5oi35omR5YWLXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyW0dBTUVfUExBWUVSXVs0XTsgICAgICAgLy/mr5TniYznlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RW5kU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e7k+adn+eKtuaAgVxuLy8gfTtcblxuLy8gLy/nlKjmiLfpgIDlh7pcbi8vIHN0cnVjdCBDTURfU19QbGF5ZXJFeGl0XG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1BsYXllcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgIDlh7rnlKjmiLdcbi8vIH07XG5cbi8vIC8v562J5b6F5q+U54mMXG4vLyBzdHJ1Y3QgQ01EX1NfV2FpdENvbXBhcmVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy/lrqLmiLfnq6/lkb3ku6Tnu5PmnoRcbnpqaF9jbWQuU1VCX0NfQUREX1NDT1JFID0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35Yqg5rOoXG56amhfY21kLlNVQl9DX0dJVkVfVVAgPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlL7lvIPmtojmga9cbnpqaF9jbWQuU1VCX0NfQ09NUEFSRV9DQVJEID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM5raI5oGvXG56amhfY21kLlNVQl9DX0xPT0tfQ0FSRCA9IDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eci+eJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19PUEVOX0NBUkQgPSA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfV0FJVF9DT01QQVJFID0gNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5q+U54mMXG56amhfY21kLlNVQl9DX0ZJTklTSF9GTEFTSCA9IDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WujOaIkOWKqOeUu1xuempoX2NtZC5TVUJfQ19MQVNUX0FERCA9IDg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WtpOazqOS4gOaOt1xuXG4vLyAvL+eUqOaIt+WKoOazqFxuLy8gc3RydWN0IENNRF9DX0FkZFNjb3JlXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3U3RhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeKtuaAgVxuLy8gfTtcblxuLy8gLy/mr5TniYzmlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfQ19Db21wYXJlQ2FyZFxuLy8geyAgIFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHpqaF9jbWQ7IiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfcHJvZHVjdE5hbWU6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3Byb2R1Y3RQcmljZTogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfcGF5UHJpY2U6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIGlmKHRoaXMuX3BhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX3Byb2R1Y3ROYW1lLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcImdvb2RzX25hbWVcIl07XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcHJvZHVjdFByaWNlLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcInBheV9hbXRcIl0gKyBcIuWFg1wiO1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX3BheVByaWNlLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcInBheV9hbXRcIl0gKyBcIuWFg1wiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtpbml0XSBcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuX3BhcmFtcykpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIC8vIHRoaXMuX2ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICAvLyB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIEpTT04uc3RyaW5naWZ5KHBhcmFtcy5kZXRhaWwpKTtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VcIixwYXJhbXMuZGV0YWlsKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB2YXIgRmFjZUlEID0gdGhpcy5fZmFjZUlEO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9TaG9wVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25DbGlja1VzZXJQcm9maWxlXSBBY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdhbWVTZXJ2ZXJJdGVtID0gcmVxdWlyZShcIkdhbWVTZXJ2ZXJJdGVtXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHYW1lVXNlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVVzZXJJdGVtXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl93VGFibGVDb3VudCA9IDA7XG5cdCAgICB0aGlzLl93Q2hhaXJDb3VudCA9IDA7XG5cdCAgICB0aGlzLl93U2VydmVyVHlwZSA9IDA7XG5cdCAgICB0aGlzLl9kd1NlcnZlclJ1bGUgPSAwO1xuICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgXHQ9IDA7XG4gICAgICAgIHRoaXMuX2NiQWxsb3dMb29rb24gPSAwO1xuICAgICAgICB0aGlzLl9jYkhpZGVVc2VySW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl91c2VyTGlzdCA9IHt9OyAgXG4gICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3QgPSB7fTtcbiAgICAgICAgdGhpcy5fdGFibGVTdGF0dXMgPSB7fTtcbiAgICAgICAgdGhpcy5fd1RhYmxlSUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRTtcbiAgICAgICAgdGhpcy5fd0NoYWlySUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICB9LFxuICAgIG9uTG9nb25Sb29tOiBmdW5jdGlvbiAocm9vbUluZm8pIHtcbiAgICAgICAgdGhpcy5fcm9vbUluZm8gPSByb29tSW5mbztcbiAgICAgICAgaWYgKCF0aGlzLl9yb29tSW5mbykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV0g6I635Y+W5oi/6Ze05L+h5oGv5aSx6LSlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dIOeZu+W9leaIv+mXtDogXCIgKyBHbG9iYWxGdW4ubnVtYmVyVG9JcCh0aGlzLl9yb29tSW5mby5kd1NlcnZlckFkZHIpICsgXCIjIFwiICsgdGhpcy5fcm9vbUluZm8ud1NlcnZlclBvcnQpO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KEdsb2JhbEZ1bi5udW1iZXJUb0lwKHRoaXMuX3Jvb21JbmZvLmR3U2VydmVyQWRkciksdGhpcy5fcm9vbUluZm8ud1NlcnZlclBvcnQpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uUGFja2V0KCk7XG4gICAgfSxcbiAgICAvLyBfc29ja2V0RXZlbnRDYWxsYmFjazoge1xuICAgIC8vICAgICBbZ2FtZV9jbWQuTURNX0dSX0xPR09OXSA6IHRoaXMuT25Tb2NrZXRNYWluTG9nb24sLy/nmbvlvZXmtojmga9cbiAgICAvLyAgICAgW2dhbWVfY21kLk1ETV9HUl9VU0VSXSA6IHRoaXMuT25Tb2NrZXRNYWluVXNlciwvL+eUqOaIt+a2iOaBr1xuICAgIC8vICAgICBbZ2FtZV9jbWQuTURNX0dSX0lORk9dIDogdGhpcy5PblNvY2tldE1haW5JbmZvLFxuICAgIC8vICAgICBbZ2FtZV9jbWQuTURNX0dSX1NUQVRVU10gOiB0aGlzLk9uU29ja2V0TWFpblN0YXR1cyxcbiAgICAvLyAgICAgW2dhbWVfY21kLk1ETV9HUl9TWVNURU1dIDogdGhpcy5PblNvY2tldE1haW5TeXN0ZW0sXG4gICAgLy8gICAgIFtnYW1lX2NtZC5NRE1fR1JfU0VSVkVSX0lORk9dIDogdGhpcy5PblNvY2tldE1haW5TZXJ2ZXJJbmZvLFxuICAgIC8vICAgICBbR2xvYmFsRGVmLk1ETV9HRl9HQU1FXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgLy8gICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudEdhbWVNZXNzYWdlXCIse1xuICAgIC8vICAgICAgICAgICAgIHN1YjpzdWIsXG4gICAgLy8gICAgICAgICAgICAgcERhdGE6cERhdGEsXG4gICAgLy8gICAgICAgICB9KVxuICAgIC8vICAgICB9LFxuICAgIC8vICAgICBbR2xvYmFsRGVmLk1ETV9HRl9GUkFNRV0gOiB0aGlzLk9uU29ja2V0TWFpbkdhbWVGcmFtZSxcbiAgICAvLyAgICAgW0dsb2JhbERlZi5NRE1fR0ZfUFJFU0VOVF0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgXG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Tb2NrZXRFdmVudF0gcERhdGEgbGVuID0gXCIgKyBwRGF0YS5nZXREYXRhU2l6ZSgpKTtcbiAgICAgICAgaWYgKCF0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrID0ge1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfTE9HT05dIDogdGhpcy5PblNvY2tldE1haW5Mb2dvbiwvL+eZu+W9lea2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfVVNFUl0gOiB0aGlzLk9uU29ja2V0TWFpblVzZXIsLy/nlKjmiLfmtojmga9cbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX0lORk9dIDogdGhpcy5PblNvY2tldE1haW5JbmZvLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1RBVFVTXSA6IHRoaXMuT25Tb2NrZXRNYWluU3RhdHVzLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1lTVEVNXSA6IHRoaXMuT25Tb2NrZXRNYWluU3lzdGVtLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU0VSVkVSX0lORk9dIDogdGhpcy5PblNvY2tldE1haW5TZXJ2ZXJJbmZvLFxuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX0dBTUVdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjpzdWIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwRGF0YTpwRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX0ZSQU1FXSA6IHRoaXMuT25Tb2NrZXRNYWluR2FtZUZyYW1lLFxuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX1BSRVNFTlRdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoIXRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2spIHtcbiAgICAgICAgLy8gICAgIHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2sgPSB7XG4gICAgICAgIC8vICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9MT0dPTl0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkgey8v55m75b2V5raI5oGvXG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuT25Tb2NrZXRNYWluTG9nb24oc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfVVNFUl0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkgey8v55So5oi35raI5oGvXG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Tb2NrZXRFdmVudF1bTURNX0dSX1VTRVJdIHBEYXRhIGxlbiA9IFwiICsgcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuT25Tb2NrZXRNYWluVXNlcihzdWIscERhdGEpO1xuICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9JTkZPXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuT25Tb2NrZXRNYWluSW5mbyhzdWIscERhdGEpO1xuICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9TVEFUVVNdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc2VsZi5PblNvY2tldE1haW5TdGF0dXMoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1lTVEVNXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuT25Tb2NrZXRNYWluU3lzdGVtKHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX1NFUlZFUl9JTkZPXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHNlbGYuT25Tb2NrZXRNYWluU2VydmVySW5mbyhzdWIscERhdGEpO1xuICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgW0dsb2JhbERlZi5NRE1fR0ZfR0FNRV0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudEdhbWVNZXNzYWdlXCIse1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3ViOnN1YixcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAvLyAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgW0dsb2JhbERlZi5NRE1fR0ZfRlJBTUVdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgc2VsZi5PblNvY2tldE1haW5HYW1lRnJhbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICB9LFxuICAgICAgICAvLyAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX1BSRVNFTlRdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICBpZiAodGhpcy5fc29ja2V0RXZlbnRDYWxsYmFjayAmJiB0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrW21haW5dKSB7XG4gICAgICAgICAgICB2YXIgZnVuID0gdGhpcy5fc29ja2V0RXZlbnRDYWxsYmFja1ttYWluXTtcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsIHN1YiwgcERhdGEpO1xuICAgICAgICAgICAgLy8gRnVuY3Rpb24uY2FsbCh0aGlzLGZ1bmMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvblNvY2tldEV2ZW50XSBtYWluID0gXCIrIG1haW4gKyBcInN1YiA9IFwiICsgc3ViICsgXCIgbm90IGZpbmRcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYobWFpbiA9PT0gZ2FtZV9jbWQuTURNX0dSX0xPR09OKXsgLy/nmbvlvZXmtojmga9cbiAgICAgICAgLy8gICAgIHRoaXMuT25Tb2NrZXRNYWluTG9nb24oc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNlIGlmKG1haW4gPT09IGdhbWVfY21kLk1ETV9HUl9VU0VSKXsvL+eUqOaIt+a2iOaBr1xuICAgICAgICAvLyAgICAgdGhpcy5PblNvY2tldE1haW5Vc2VyKHN1YixwRGF0YSk7XG4gICAgICAgIC8vIH0gIFxuICAgICAgICAvLyBlbHNlIGlmKG1haW4gPT09IGdhbWVfY21kLk1ETV9HUl9JTkZPKXsgLy/phY3nva7mtojmga9cbiAgICAgICAgLy8gICAgIHRoaXMuT25Tb2NrZXRNYWluSW5mbyhzdWIscERhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2UgaWYobWFpbiA9PT0gZ2FtZV9jbWQuTURNX0dSX1NUQVRVUyl7Ly/nirbmgIHmtojmga9cbiAgICAgICAgLy8gICAgIHRoaXMuT25Tb2NrZXRNYWluU3RhdHVzKHN1YixwRGF0YSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gZWxzZSBpZihtYWluID09PSBnYW1lX2NtZC5NRE1fR1JfU1lTVEVNKXsvL+ezu+e7n+a2iOaBr1xuICAgICAgICAvLyAgICAgdGhpcy5PblNvY2tldE1haW5TeXN0ZW0oc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNlIGlmKG1haW4gPT09IGdhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GTyl7Ly/miL/pl7Tmtojmga9cbiAgICAgICAgLy8gICAgIHRoaXMuT25Tb2NrZXRNYWluU2VydmVySW5mbyhzdWIscERhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8v5ri45oiP5raI5oGvIOahhuaetua2iOaBryDnpLznianmtojmga9cbiAgICAgICAgLy8gZWxzZSBpZihtYWluID09PSBHbG9iYWxEZWYuTURNX0dGX0dBTUUpIHsvL+a4uOaIj+a2iOaBr1xuICAgICAgICAvLyAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHtcbiAgICAgICAgLy8gICAgICAgICBzdWI6c3ViLFxuICAgICAgICAvLyAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNlIGlmKG1haW4gPT09IEdsb2JhbERlZi5NRE1fR0ZfRlJBTUUpey8v5qGG5p625raI5oGvXG4gICAgICAgIC8vICAgICB0aGlzLk9uU29ja2V0TWFpbkdhbWVGcmFtZShzdWIscERhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2UgaWYobWFpbiA9PT1HbG9iYWxEZWYuTURNX0dGX1BSRVNFTlQpIHtcblxuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5Mb2dvbjogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluTG9nb25dXCIpO1xuICAgICAgICBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fU1VDQ0VTUyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBsb2dvbiBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdGhpcy5fdXNlckxpc3QgPSB7fTtcbiAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoXCJMb2dvblN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRVJST1IpIHtcbiAgICAgICAgICAgIC8v55m75b2V5aSx6LSlXG4gICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uRXJyb3JcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRsRXJyb3JDb2RlO1x0XHRcdFx0XHRcdFx0Ly/plJnor6/ku6PnoIFcbiAgICAgICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pFcnJvckRlc2NyaWJlWzEyOF07XHRcdFx0XHQvL+mUmeivr+a2iOaBr1xuICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIHZhciBsb2dvbkVycm9yID0ge307XG4gICAgICAgICAgICBsb2dvbkVycm9yLmxFcnJvckNvZGUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICBsb2dvbkVycm9yLnN6RXJyb3JEZXNjcmliZSA9IHBEYXRhLnJlYWRzdHJpbmcoMTI4KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluTG9nb25dIGVycm9yQ29kZSA9IFwiICsgbG9nb25FcnJvci5sRXJyb3JDb2RlICsgXCIgZGVzID0gXCIgKyBsb2dvbkVycm9yLnN6RXJyb3JEZXNjcmliZSk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0ZJTklTSCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBMb2dvbiBGaW5pc2hcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpblVzZXI6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdIHBEYXRhIGxlbiA9IFwiICsgcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrID0ge1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9DT01FXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVVNFUl9DT01FXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFUVVNdOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX1NUQVRVU1wiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlN0YXR1cyhzdWIscERhdGEpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVVNFUl9TQ09SRVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5PblNvY2tldFN1YlNjb3JlKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUklHSFRdOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX1JJR0hUXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViUmlnaHQoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfTUVNQkVSX09SREVSXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVNQkVSX09SREVSXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViTWVtYmVyT3JkZXIoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfU0lUX0ZBSUxFRF06IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1NJVF9GQUlMRURcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJTaXRGYWlsZWQoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9DSEFUXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVVNFUl9DSEFUXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViQ2hhdChzdWIscERhdGEpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX1dJU1BFUl06IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfV0lTUEVSXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViV2lzcGVyKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVVNFUl9JTlZJVEVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJVc2VySW52aXRlKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTERdOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9RVUVSWV9HT0xEXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViUXVlcnlHb2xkKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTkRfUVVFUlldOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9QUkVTRU5EX1FVRVJZXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9uU29ja2V0U3ViUHJlc2VudFF1ZXJ5KHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1JdOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9QUkVTRU5UX0VSUk9SXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrICYmIHRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2tbc3ViXSkge1xuICAgICAgICAgICAgdmFyIGZ1biA9IHRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2tbc3ViXTtcbiAgICAgICAgICAgIC8vIGZ1bihzdWIsIHBEYXRhKTtcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsc3ViLHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluVXNlcl0gc3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzd2l0Y2goc3ViKXtcbiAgICAgICAgLy8gICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ09NRTpcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX0NPTUVcIik7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5PblNvY2tldFN1YlVzZXJDb21lKHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQVRVUzpcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX1NUQVRVU1wiKTtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLk9uU29ja2V0U3ViU3RhdHVzKHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFOlxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfU0NPUkVcIik7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5PblNvY2tldFN1YlNjb3JlKHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9VU0VSX1JJR0hUOlxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfUklHSFRcIik7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5PblNvY2tldFN1YlJpZ2h0KHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVI6XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVNQkVSX09SREVSXCIpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJNZW1iZXJPcmRlcihzdWIscERhdGEpO1xuICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfU0lUX0ZBSUxFRDpcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TSVRfRkFJTEVEXCIpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJTaXRGYWlsZWQoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ0hBVDpcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9VU0VSX0NIQVRcIik7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5PblNvY2tldFN1YkNoYXQoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfV0lTUEVSOlxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfV0lTUEVSXCIpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJXaXNwZXIoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFOlxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1VTRVJfSU5WSVRFXCIpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJVc2VySW52aXRlKHN1YixwRGF0YSk7XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9RVUVSWV9HT0xEOlxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1FVRVJZX0dPTERcIik7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5PblNvY2tldFN1YlF1ZXJ5R29sZChzdWIscERhdGEpO1xuICAgICAgICAvLyAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWTpcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9QUkVTRU5EX1FVRVJZXCIpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuT25Tb2NrZXRTdWJQcmVzZW50UXVlcnkoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1I6XG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfUFJFU0VOVF9FUlJPUlwiKTtcbiAgICAgICAgLy8gICAgICAgICAvLyB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgLy8gICAgICAgICBicmVhaztcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5JbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TRVJWRVJfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfU2VydmVySW5mb1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/miL/pl7TlsZ7mgKdcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlyQ291bnQ7XHRcdFx0XHRcdFx0Ly/mpIXlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0dhbWVHZW5yZTtcdFx0XHRcdFx0XHRcdC8v5ri45oiP57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUNvdW50O1x0XHRcdFx0XHRcdC8v5qGM5a2Q5pWw55uuXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdLaW5kSUQ7XHRcdFx0XHRcdFx0XHQvL+exu+WeiyBJIERcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VmlkZW9BZGRyO1x0XHRcdFx0XHRcdC8v6KeG6aKR5Zyw5Z2AXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiSGlkZVVzZXJJbmZvO1x0XHRcdFx0XHRcdC8v6ZqQ6JeP5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgc2VydmVySW5mbyA9IHt9O1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0NoYWlyQ291bnQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0dhbWVHZW5yZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53VGFibGVDb3VudCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLmR3VmlkZW9BZGRyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby5jYkhpZGVVc2VySW5mbyA9IHBEYXRhLnJlYWRieXRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93Q2hhaXJDb3VudCA9IHNlcnZlckluZm8ud0NoYWlyQ291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fd1RhYmxlQ291bnQgPSBzZXJ2ZXJJbmZvLndUYWJsZUNvdW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiSGlkZVVzZXJJbmZvID0gc2VydmVySW5mby5jYkhpZGVVc2VySW5mbztcbiAgICAgICAgICAgICAgICB0aGlzLl93R2FtZUdlbnJlID0gc2VydmVySW5mby53R2FtZUdlbnJlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dLaW5kSUQgPSBzZXJ2ZXJJbmZvLndLaW5kSUQ7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX0NPTFVNTl9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9DT05GSUdfRklOSVNIXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU3RhdHVzXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1RBQkxFX0lORk9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9TVEFUVVM6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVEFCTEVfU1RBVFVTXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/ns7vnu5/mtojmga9cbiAgICBPblNvY2tldE1haW5TeXN0ZW06IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0U6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVTU0FHRVwiKTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+aVsOaNruWMhVxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTWVzc2FnZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VUeXBlO1x0XHRcdFx0XHRcdC8v5raI5oGv57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdNZXNzYWdlTGVuZ3RoO1x0XHRcdFx0XHRcdC8v5raI5oGv6ZW/5bqmXG4gICAgICAgICAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzekNvbnRlbnRbMTAyNF07XHRcdFx0XHRcdC8v5raI5oGv5YaF5a65XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+WkhOeQhlxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge307XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZVR5cGUgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGggPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3pDb250ZW50ID0gcERhdGEucmVhZHN0cmluZyhtZXNzYWdlLndNZXNzYWdlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvL+WFs+mXrei/nuaOpVxuICAgICAgICAgICAgICAgIHZhciBiSW50ZXJtZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBnYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSkge1xuICAgICAgICAgICAgICAgICAgICBiSW50ZXJtZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtZXNzYWdlLndNZXNzYWdlVHlwZSAmIGdhbWVfY21kLlNNVF9DTE9TRV9ST09NKSB7XG4gICAgICAgICAgICAgICAgICAgIGJJbnRlcm1ldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiSW50ZXJtZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dIFwiICsgbWVzc2FnZS5zekNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+aIv+mXtOa2iOaBr1xuICAgIE9uU29ja2V0TWFpblNlcnZlckluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TZXJ2ZXJJbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkdhbWVGcmFtZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkdhbWVGcmFtZV1cIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX09QVElPTjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9PUFRJT05cIik7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/phY3nva5cbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dGX09wdGlvblxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiR2FtZVN0YXR1cztcdFx0XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiQWxsb3dMb29rb247XHRcdFx0XHRcdC8v5YWB6K645peB6KeCXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiQWxsb3dMb29rb24gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1VTRVJfQ0hBVDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9VU0VSX0NIQVRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfTUVTU0FHRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9NRVNTQUdFXCIpO1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9NZXNzYWdlXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3TWVzc2FnZVR5cGU7XHRcdFx0XHRcdFx0Ly/mtojmga/nsbvlnotcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VMZW5ndGg7XHRcdFx0XHRcdFx0Ly/mtojmga/plb/luqZcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6Q29udGVudFsxMDI0XTtcdFx0XHRcdFx0Ly/mtojmga/lhoXlrrlcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5aSE55CGXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7fTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLndNZXNzYWdlVHlwZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZUxlbmd0aCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS5zekNvbnRlbnQgPSBwRGF0YS5yZWFkc3RyaW5nKG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9DTE9TRV9HQU1FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBHbG9iYWxEZWYuU01UX0VKRUNUKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCArIFwiIHR5cGUgPSBcIiArIG1lc3NhZ2Uud01lc3NhZ2VUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9HTE9CQUwpe1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1NDRU5FOlxuICAgICAgICAgICAgICAgIC8v5ri45oiP5Zy65pmvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR0ZfU0NFTkVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lU2NlbmVcIix7XG4gICAgICAgICAgICAgICAgICAgIGNiR2FtZVN0YXR1czp0aGlzLl9jYkdhbWVTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+eUqOaIt+i/m+WFpVxuICAgIE9uU29ja2V0U3ViVXNlckNvbWU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICB2YXIgdXNlckl0ZW0gPSBuZXcgR2FtZVVzZXJJdGVtKCk7XG4gICAgICAgIHVzZXJJdGVtLmluaXREYXRhQnlVc2VySW5mb0hlYWQocERhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckNvbWVdIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlckl0ZW0pKTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl91c2VyTGlzdFt1c2VySXRlbS5kd1VzZXJJRF07XG4gICAgICAgIC8vIGlmIChpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl91c2VyTGlzdFt1c2VySXRlbS5kd1VzZXJJRF0gPSB1c2VySXRlbTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvL+iusOW9leiHquW3seeahOahjOWPt1xuICAgICAgICBpZiAodXNlckl0ZW0uZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEKSB7XG4gICAgICAgICAgICB0aGlzLl93VGFibGVJRCA9IHVzZXJJdGVtLndUYWJsZUlEO1xuICAgICAgICAgICAgdGhpcy5fd0NoYWlySUQgPSB1c2VySXRlbS53Q2hhaXJJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlckl0ZW0ud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFICYmIHVzZXJJdGVtLndDaGFpcklEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5vblVwRGF0YVRhYmxlVXNlcih1c2VySXRlbS53VGFibGVJRCx1c2VySXRlbS53Q2hhaXJJRCx1c2VySXRlbSk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJFbnRlclwiLHtcbiAgICAgICAgICAgICAgICB3VGFibGVJRDp1c2VySXRlbS53VGFibGVJRCxcbiAgICAgICAgICAgICAgICB3Q2hhaXJJRDp1c2VySXRlbS53Q2hhaXJJRCxcbiAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlN0YXR1czogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXVwiKTtcbiAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Vc2VyU3RhdHVzXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v5pWw5o2u5bqTIElEXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRjYlVzZXJTdGF0dXM7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnirbmgIFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHVzZXJTdGF0dXMgPSB7fTtcbiAgICAgICAgdXNlclN0YXR1cy53VGFibGVJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHVzZXJTdGF0dXMuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB1c2VyU3RhdHVzLndDaGFpcklEID0gcERhdGEucmVhZHdvcmQoKTtcblxuICAgICAgICB2YXIgdXNlckl0ZW0gPSB0aGlzLnNlYXJjaFVzZXJCeVVzZXJJRCh1c2VyU3RhdHVzLmR3VXNlcklEKTtcbiAgICAgICAgdmFyIG15VXNlckl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgaWYgKCFteVVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmnKrmib7liLDoh6rlt7FcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy/mib7kuI3liLDnlKjmiLdcbiAgICAgICAgaWYgKCF1c2VySXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g5om+5LiN5Yiw55So5oi3XCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8v6K6w5b2V5pen54q25oCBXG4gICAgICAgIHZhciBvbGRTdGF0dXMgPSB7fTtcbiAgICAgICAgb2xkU3RhdHVzLndUYWJsZUlEID0gdXNlckl0ZW0ud1RhYmxlSUQ7XG4gICAgICAgIG9sZFN0YXR1cy53Q2hhaXJJRCA9IHVzZXJJdGVtLndDaGFpcklEO1xuICAgICAgICBvbGRTdGF0dXMuY2JVc2VyU3RhdHVzID0gdXNlckl0ZW0uY2JVc2VyU3RhdHVzO1xuXG4gICAgICAgIC8v5pu05paw5L+h5oGvXG4gICAgICAgIHVzZXJJdGVtLmNiVXNlclN0YXR1cyA9IHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzO1xuICAgICAgICB1c2VySXRlbS53VGFibGVJRCA9IHVzZXJTdGF0dXMud1RhYmxlSUQ7XG4gICAgICAgIHVzZXJJdGVtLndDaGFpcklEID0gdXNlclN0YXR1cy53Q2hhaXJJRDtcblxuICAgICAgICAvL+a4hemZpOaXp+ahjOWtkOakheWtkOiusOW9lVxuICAgICAgICBpZihvbGRTdGF0dXMud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICAvL+aWsOaXp+ahjOWtkOS4jeWQjCDmlrDml6fmpIXlrZDkuI3lkIxcbiAgICAgICAgICAgIGlmIChvbGRTdGF0dXMud1RhYmxlSUQgIT09IHVzZXJTdGF0dXMud1RhYmxlSUQgfHwgb2xkU3RhdHVzLndDaGFpcklEICE9PSB1c2VyU3RhdHVzLndDaGFpcklEKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblVwRGF0YVRhYmxlVXNlcihvbGRTdGF0dXMud1RhYmxlSUQsIG9sZFN0YXR1cy53Q2hhaXJJRCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+aWsOahjOWtkOiusOW9lVxuICAgICAgICBpZiAodXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgIHRoaXMub25VcERhdGFUYWJsZVVzZXIodXNlclN0YXR1cy53VGFibGVJRCwgdXNlclN0YXR1cy53Q2hhaXJJRCwgdXNlckl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/oh6rlt7HnirbmgIFcbiAgICAgICAgaWYgKG15VXNlckl0ZW0uZHdVc2VySUQgPT09IHVzZXJTdGF0dXMuZHdVc2VySUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dUYWJsZUlEID0gdXNlclN0YXR1cy53VGFibGVJRDtcbiAgICAgICAgICAgIHRoaXMuX3dDaGFpcklEID0gdXNlclN0YXR1cy53Q2hhaXJJRDtcblxuICAgICAgICAgICAgLy/nprvlvIBcbiAgICAgICAgICAgIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX05VTEwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7HnprvlvIBcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXhpdFJvb21cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+i1t+eri1xuICAgICAgICAgICAgZWxzZSBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19GUkVFICYmIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPiBHbG9iYWxEZWYuVVNfRlJFRSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3sei1t+eri1wiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FeGl0VGFibGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+WdkOS4i1xuICAgICAgICAgICAgZWxzZSBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPiBHbG9iYWxEZWYuVVNfRlJFRSAmJiBvbGRTdGF0dXMuY2JVc2VyU3RhdHVzIDwgR2xvYmFsRGVmLlVTX1NJVCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3seWdkOS4i1wiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FbnRlclRhYmxlXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/mjaLkvY1cbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXJTdGF0dXMud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g5o2i5L2NXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkVudGVyVGFibGVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7HmlrDnirbmgIEgXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VyU3RhdHVzKSk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/ku5bkurrnirbmgIFcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL+abtOaWsOeUqOaIt1xuICAgICAgICAgICAgaWYgKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgfHwgdXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Yig6Zmk55So5oi3XG4gICAgICAgICAgICBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19OVUxMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlbW92ZVVzZXIodXNlclN0YXR1cy5kd1VzZXJJRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU2NvcmU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlNjb3JlXVwiKTtcbiAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Vc2VyU2NvcmVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5raI6LS56YeR6LGGXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR6LGGXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIHRhZ1VzZXJTY29yZVx0XHRcdFx0XHRVc2VyU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+enr+WIhuS/oeaBr1xuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdVc2VyU2NvcmVcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsU2NvcmU7XHRcdFx0XHRcdFx0XHRcdC8v55So5oi35YiG5pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5a2Y5YKo6YeR5biBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFdpbkNvdW50O1x0XHRcdFx0XHRcdFx0Ly/og5zliKnnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRmxlZUNvdW50O1x0XHRcdFx0XHRcdFx0Ly/mlq3nur/mlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB1c2VyU2NvcmUgPSB7fTtcbiAgICAgICAgdXNlclNjb3JlLmxMb3ZlbGluZXNzID0gcERhdGEucmVhZGludCgpOyAvL+eUqOaIt+mtheWKm1xuICAgICAgICB1c2VyU2NvcmUuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgLy/nlKjmiLdJRFxuICAgICAgICAvL+eUqOaIt+enr+WIhlxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlID0ge307XG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubFNjb3JlID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxHYW1lR29sZCA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo6YeR5biBXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubFdpbkNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sTG9zdENvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0peebmOaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxEcmF3Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZKM5bGA55uY5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubEZsZWVDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sRXhwZXJpZW5jZSA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuXG4gICAgICAgIC8v6Ieq5bex5L+h5oGvXG4gICAgICAgIHZhciBteVVzZXJJdGVtID0gdGhpcy5nZXRNZVVzZXJJdGVtKCk7XG4gICAgICAgIGlmICh1c2VyU2NvcmUuZHdVc2VySUQgPT0gbXlVc2VySXRlbS5kd1VzZXJJRCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlNjb3JlXSDmm7TmlrAgXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VyU2NvcmUpKTtcbiAgICAgICAgICAgIG15VXNlckl0ZW0ubFNjb3JlID0gdXNlclNjb3JlLlVzZXJTY29yZS5sU2NvcmU7XG4gICAgICAgICAgICBteVVzZXJJdGVtLmxHYW1lR29sZCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEdhbWVHb2xkO1xuICAgICAgICAgICAgbXlVc2VySXRlbS5sV2luQ291bnQgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxXaW5Db3VudDtcbiAgICAgICAgICAgIG15VXNlckl0ZW0ubExvc3RDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubExvc3RDb3VudDtcbiAgICAgICAgICAgIG15VXNlckl0ZW0ubERyYXdDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubERyYXdDb3VudDtcbiAgICAgICAgICAgIG15VXNlckl0ZW0ubEZsZWVDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEZsZWVDb3VudDtcbiAgICAgICAgICAgIG15VXNlckl0ZW0ubEV4cGVyaWVuY2UgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxFeHBlcmllbmNlO1xuICAgICAgICAgICAgbXlVc2VySXRlbS5sTG92ZWxpbmVzcyA9IHVzZXJTY29yZS5sTG92ZWxpbmVzcztcbiAgICAgICAgfVxuICAgICAgICAvL+mAmuefpeabtOaWsOeVjOmdolxuICAgICAgICBpZihteVVzZXJJdGVtLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSlcbiAgICAgICAge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU2NvcmVcIix7XG4gICAgICAgICAgICAgICAgdXNlclNjb3JlOnVzZXJTY29yZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlJpZ2h0OiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJSaWdodF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1Yk1lbWJlck9yZGVyOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJNZW1iZXJPcmRlcl1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlNpdEZhaWxlZDogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2l0RmFpbGVkXVwiKTtcbiAgICAgICAgLy/lnZDkuIvlpLHotKVcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9TaXRGYWlsZWRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6RmFpbGVkRGVzY3JpYmVbMjU2XTtcdFx0XHRcdC8v6ZSZ6K+v5o+P6L+wXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBzekZhaWxlZERlc2NyaWJlID0gcERhdGEucmVhZHN0cmluZygyNTYpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2l0RmFpbGVkXSBcIiArIHN6RmFpbGVkRGVzY3JpYmUpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJDaGF0OiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJDaGF0XVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViV2lzcGVyOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJXaXNwZXJdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJVc2VySW52aXRlOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJVc2VySW52aXRlXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViUXVlcnlHb2xkOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJRdWVyeUdvbGRdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJQcmVzZW50UXVlcnk6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlByZXNlbnRRdWVyeV1cIik7XG4gICAgfSxcbiAgICBzZW5kTG9nb25QYWNrZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW3NlbmRMb2dvblBhY2tldF1cIik7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKGdhbWVfY21kLk1ETV9HUl9MT0dPTixnYW1lX2NtZC5TVUJfR1JfTE9HT05fTU9CSUxFKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2h3b3JkKEdsb2JhbFVzZXJEYXRhLndFbmNyeXB0SUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHdvcmQoR2xvYmFsVXNlckRhdGEud0NvZGVDaGVja0lEKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZChHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCk7XG5cbiAgICAgICAgdmFyIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2Muc3lzLm9zID09IGNjLnN5cy5PU19BTkRST0lEKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZChkd01vYmlsZVN5c1R5cGUpO1xuXG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQsMzMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW3NlbmRMb2dvblBhY2tldF0gcGFzc3dvcmQgPSBcIiArIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIlwiLDMzKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgICAgICAvLyAvL+aJi+acuueZu+mZhlxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlVc2VySURNb2JpbGVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0VuY3J5cHRJRDtcdFx0XHRcdFx0XHRcdC8v6ZqP5py656CBMVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NvZGVDaGVja0lEO1x0XHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3V2VpWGluQ2hlY2tJRDtcdFx0XHRcdFx0Ly/lvq7kv6Hpqozor4HnoIFcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlU3lzVHlwZTtcdFx0XHRcdFx0Ly/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlQXBwVmVyc2lvbjtcdFx0XHRcdFx0Ly/muLjmiI9BUFDniYjmnKzlj7co5LiO55m76ZmG5aSn5Y6F55u45ZCMKVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6UGFzc1dvcmRbUEFTU19MRU5dO1x0XHRcdFx0Ly/nmbvlvZXlr4bnoIFcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTtcdC8v5py65Zmo5bqP5YiX5Y+3XG4gICAgICAgIC8vIH07XG4gICAgfSxcbiAgICAvL+WdkOS4i+ivt+axglxuICAgIHNlbmRTaXREb3duUGFja2V0OiBmdW5jdGlvbiAod1RhYmxlSUQsIHdDaGFpcklELCBzelBhc3NXb3JkKSB7XG4gICAgICAgIC8v6K+35rGC5Z2Q5LiLXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfVXNlclNpdFJlcVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRjYlBhc3NMZW47XHRcdFx0XHRcdFx0XHQvL+WvhueggemVv+W6plxuICAgICAgICAvLyAgICAgLy9EV09SRFx0XHRcdFx0XHRcdFx0ZHdBbnN3ZXJJRDtcdFx0XHRcdFx0XHRcdC8v5Zue562UIEkgRC8v5YW85a6556ev5YiG5ri45oiP5YWl5bqn6Zeu6aKYXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pUYWJsZVBhc3NbUEFTU19MRU5dO1x0XHRcdFx0Ly/moYzlrZDlr4bnoIFcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHNpdERhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIHNpdERhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfVVNFUixnYW1lX2NtZC5TVUJfR1JfVVNFUl9TSVRfUkVRKTtcbiAgICAgICAgaWYgKHN6UGFzc1dvcmQpIHtcbiAgICAgICAgICAgIHNpdERhdGEucHVzaGJ5dGUoc3pQYXNzV29yZC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2l0RGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgfVxuICAgICAgICBzaXREYXRhLnB1c2h3b3JkKHdDaGFpcklEKTtcbiAgICAgICAgc2l0RGF0YS5wdXNod29yZCh3VGFibGVJRCk7XG4gICAgICAgIHNpdERhdGEucHVzaHN0cmluZyhzelBhc3NXb3JkLEdsb2JhbERlZi5QQVNTX0xFTik7XG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShzaXREYXRhKTtcbiAgICB9LFxuICAgIC8v56uZ6LW35p2lXG4gICAgc2VuZFN0YW5kdXBQYWNrZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfVVNFUiwgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBTkRVUF9SRVEpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICBzZW5kTGVmdEdhbWVQYWNrZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhnYW1lX2NtZC5NRE1fR1JfVVNFUiwgZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTEVGVF9HQU1FX1JFUSk7XG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIC8v5Y+R6YCB5YeG5aSHXG4gICAgc2VuZFVzZXJSZWFkeTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgZGF0YS5zZXRjbWRpbmZvKEdsb2JhbERlZi5NRE1fR0ZfRlJBTUUsIEdsb2JhbERlZi5TVUJfR0ZfVVNFUl9SRUFEWSk7XG5cbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIG9uVXBEYXRhVGFibGVVc2VyOiBmdW5jdGlvbiAodGFibGVpZCxjaGFpcmlkLHVzZXJpdGVtKSB7XG4gICAgICAgIHZhciBpZCA9IHRhYmxlaWQ7XG4gICAgICAgIHZhciBpZGV4ID0gY2hhaXJpZDtcbiAgICAgICAgaWYgKCF0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSkge1xuICAgICAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdFtpZF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlcml0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdID0gdXNlcml0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXVtpZGV4XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VGFibGVVc2VySXRlbTogZnVuY3Rpb24gKHRhYmxlaWQsY2hhaXJpZCkge1xuICAgICAgICB2YXIgaWQgPSB0YWJsZWlkO1xuICAgICAgICB2YXIgaWRleCA9IGNoYWlyaWQ7XG4gICAgICAgIGlmICh0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRNZVVzZXJJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTGlzdFtHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRF07XG4gICAgfSxcbiAgICBzZWFyY2hVc2VyQnlVc2VySUQ6IGZ1bmN0aW9uIChkd1VzZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxpc3RbZHdVc2VySURdO1xuICAgIH0sXG4gICAgb25SZW1vdmVVc2VyOiBmdW5jdGlvbiAoZHdVc2VySUQpIHtcbiAgICAgICAgdGhpcy5fdXNlckxpc3RbZHdVc2VySURdID0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdhbWVTZXJ2ZXJJdGVtID0gY2MuQ2xhc3Moe1xuICAgIHdTb3J0SUQ6IHVuZGVmaW5lZCxcbiAgICB3S2luZElEOiB1bmRlZmluZWQsXG4gICAgd1NlcnZlcklEOiB1bmRlZmluZWQsXG4gICAgd1N0YXRpb25JRDogdW5kZWZpbmVkLFxuICAgIHdTZXJ2ZXJQb3J0OiB1bmRlZmluZWQsXG4gICAgZHdTZXJ2ZXJBZGRyOiB1bmRlZmluZWQsXG4gICAgZHdPbkxpbmVDb3VudDogdW5kZWZpbmVkLFxuICAgIHN6U2VydmVyTmFtZTogdW5kZWZpbmVkLFxuICAgIGN0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09KiBHYW1lU2VydmVySXRlbSBjdG9yICAqPT09PT1cIilcbiAgICAgICAgdGhpcy53U29ydElEID0gMDtcbiAgICAgICAgdGhpcy53S2luZElEID0gMDtcbiAgICAgICAgdGhpcy53U2VydmVySUQgPSAwO1xuICAgICAgICB0aGlzLndTdGF0aW9uSUQgPSAwO1xuICAgICAgICB0aGlzLndTZXJ2ZXJQb3J0ID0gMDtcbiAgICAgICAgdGhpcy5kd1NlcnZlckFkZHIgPSAwO1xuICAgICAgICB0aGlzLmR3T25MaW5lQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnN6U2VydmVyTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uKHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT0qIEdhbWVTZXJ2ZXJJdGVtIG9uSW5pdCAgKj09PT09XCIpXG4gICAgICAgIHRoaXMud1NvcnRJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud0tpbmRJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud1NlcnZlcklEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U3RhdGlvbklEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U2VydmVyUG9ydCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdTZXJ2ZXJBZGRyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdPbkxpbmVDb3VudCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLnN6U2VydmVyTmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoMzIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImxlbiA9IFwiK3BEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICB3aGlsZSh0cnVlKXtcbiAgICAgICAgICAgIC8v6buY6K6k5L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9OVUxMXHRcdFx0XHRcdDBcdFx0XHRcdFx0XHRcdFx0Ly/ml6DmlYjmlbDmja5cbiAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0xFVkVMXHRcdDMwMDBcdFx0XHRcdFx0XHRcdC8v5oi/6Ze0562J57qnXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0NFTExcdFx0MzAwMVx0XHRcdFx0XHRcdFx0Ly/miL/pl7TlupXliIZcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fTUlOU0NPUkVcdDMwMDJcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05pyA5bCP5YiG5pWwXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ERFpfQk9NQl9NQVhcdDMwMDNcdFx0XHRcdFx0XHRcdC8v5paX5Zyw5Li75pyA5aSn5YCN5pWwXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0lORk9cdFx0MzAwNFx0XHRcdFx0XHRcdFx0Ly/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICB2YXIgZGF0YVNpemUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIHZhciBkYXRhRGVzY3JpYmUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZSA9IFwiK2RhdGFTaXplK1wiIGRlc2NyaWJlID0gXCIrZGF0YURlc2NyaWJlKTtcbiAgICAgICAgICAgIGlmIChkYXRhRGVzY3JpYmUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICBzd2l0Y2goZGF0YURlc2NyaWJlKXtcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDA6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2JSb29tTGV2ZWwgPSBwRGF0YS5yZWFkYnl0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDAxOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxCYXNlU2NvcmUgPSBwRGF0YS5yZWFkaW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubExpbWl0U2NvcmUgPSBwRGF0YS5yZWFkaW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubE1heEJvbWJMaW1pdCA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwNDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zekRlc2NyaWJlVHh0ID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSx0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVNlcnZlckl0ZW07XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVVzZXJJdGVtID0gY2MuQ2xhc3Moe1xuICAgIC8v55So5oi35L+h5oGv57uT5p6EXG4gICAgLy8gc3RydWN0IHRhZ1VzZXJEYXRhXG4gICAgLy8ge1xuICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0N1c3RvbUZhY2VWZXI7XHRcdFx0XHRcdC8v5LiK5Lyg5aS05YOPXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R3JvdXBJRDtcdFx0XHRcdFx0XHRcdC8v56S+5Zui57Si5byVXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlclJpZ2h0O1x0XHRcdFx0XHRcdC8v55So5oi3562J57qnXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNYXN0ZXJSaWdodDtcdFx0XHRcdFx0XHQvL+euoeeQhuadg+mZkFxuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5hbWVbMzJdO1x0XHRcdFx0XHQvL+eUqOaIt+WQjeWtl1xuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzekdyb3VwTmFtZVszMl07XHRcdFx0XHQvL+ekvuWbouWQjeWtl1xuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelVuZGVyV3JpdGVbMzJdO1x0XHQvL+S4quaAp+etvuWQjVxuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNZW1iZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWFzdGVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/nrqHnkIbnrYnnuqdcbiAgICAgICAgXG4gICAgLy8gICAgIC8v55So5oi356ev5YiGXG4gICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/mtojotLnph5HluIFcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsU2NvcmU7XHRcdFx0XHRcdFx0XHRcdC8v55So5oi35YiG5pWwXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFdpbkNvdW50O1x0XHRcdFx0XHRcdFx0Ly/og5zliKnnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRmxlZUNvdW50O1x0XHRcdFx0XHRcdFx0Ly/mlq3nur/mlbDnm65cbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5Y+356CBXG4gICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICBcbiAgICAvLyAgICAgLy/lhbbku5bkv6Hmga9cbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkNvbXBhbmlvbjtcdFx0XHRcdFx0XHQvL+eUqOaIt+WFs+ezu1xuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1Byb3BSZXNpZHVhbFRpbWVbMTVdO1x0Ly/pgZPlhbfml7bpl7RcbiAgICAvLyB9O1xuICAgICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIHdGYWNlSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuICAgIGR3Q3VzdG9tRmFjZVZlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWktOWDj1xuICAgIGR3VXNlcklEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbiAgICBkd0dyb3VwSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npL7lm6LntKLlvJVcbiAgICBkd0dhbWVJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4gICAgZHdVc2VyUmlnaHQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3562J57qnXG4gICAgbExvdmVsaW5lc3M6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4gICAgZHdNYXN0ZXJSaWdodDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5p2D6ZmQXG4gICAgc3pOYW1lOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflkI3lrZdcbiAgICBzekdyb3VwTmFtZTp1bmRlZmluZWQsICAgICAgICAgICAgIC8v56S+5Zui5ZCN5a2XXG4gICAgc3pVbmRlcldyaXRlOnVuZGVmaW5lZCwgICAgICAvL+S4quaAp+etvuWQjVxuICAgIFxuICAgIC8v55So5oi35bGe5oCnXG4gICAgY2JHZW5kZXI6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4gICAgY2JNZW1iZXJPcmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4gICAgY2JNYXN0ZXJPcmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG562J57qnXG4gICAgXG4gICAgLy/nlKjmiLfnp6/liIZcbiAgICBsSW5zdXJlU2NvcmU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgLy/mtojotLnph5HluIFcbiAgICBsR2FtZUdvbGQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbiAgICBsU2NvcmU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICBsV2luQ291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICBsTG9zdENvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnm5jmlbBcbiAgICBsRHJhd0NvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICBsRmxlZUNvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICBsRXhwZXJpZW5jZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcbiAgICBcbiAgICAvL+eUqOaIt+eKtuaAgVxuICAgIHdUYWJsZUlEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuICAgIHdDaGFpcklEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuICAgIGNiVXNlclN0YXR1czp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgIFxuICAgIC8vIC8v5YW25LuW5L+h5oGvXG4gICAgLy8gY2JDb21wYW5pb246dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YWz57O7XG4gICAgLy8gZHdQcm9wUmVzaWR1YWxUaW1lOnVuZGVmaW5lZCwgLy/pgZPlhbfml7bpl7RcbiAgICBpbml0RGF0YUJ5VXNlckluZm9IZWFkOiBmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgdmFyIHVzZXJJbmZvSGVhZCA9IHRoaXMucmVhZFVzZXJJbmZvSGVhZChwRGF0YSk7XG4gICAgICAgIHRoaXMuZHdVc2VySUQgPSB1c2VySW5mb0hlYWQuZHdVc2VySUQ7XG4gICAgICAgIHRoaXMud1RhYmxlSUQgPSB1c2VySW5mb0hlYWQud1RhYmxlSUQ7XG4gICAgICAgIHRoaXMud0NoYWlySUQgPSB1c2VySW5mb0hlYWQud0NoYWlySUQ7XG4gICAgICAgIHRoaXMuY2JVc2VyU3RhdHVzID0gdXNlckluZm9IZWFkLmNiVXNlclN0YXR1cztcbiAgICAgICAgdGhpcy5kd1VzZXJSaWdodCA9IHVzZXJJbmZvSGVhZC5kd1VzZXJSaWdodDtcbiAgICAgICAgdGhpcy5kd01hc3RlclJpZ2h0ID0gdXNlckluZm9IZWFkLmR3TWFzdGVyUmlnaHQ7XG4gICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMud0ZhY2VJRCA9IHVzZXJJbmZvSGVhZC53RmFjZUlEO1xuICAgICAgICAgICAgdGhpcy5kd0N1c3RvbUZhY2VWZXIgPSB1c2VySW5mb0hlYWQuZHdDdXN0b21GYWNlVmVyO1xuICAgICAgICAgICAgdGhpcy5jYkdlbmRlciA9IHVzZXJJbmZvSGVhZC5jYkdlbmRlcjtcbiAgICAgICAgICAgIHRoaXMuY2JNZW1iZXJPcmRlciA9IHVzZXJJbmZvSGVhZC5jYk1lbWJlck9yZGVyO1xuICAgICAgICAgICAgdGhpcy5jYk1hc3Rlck9yZGVyID0gdXNlckluZm9IZWFkLmNiTWFzdGVyT3JkZXI7XG4gICAgICAgICAgICB0aGlzLmR3R2FtZUlEID0gdXNlckluZm9IZWFkLmR3R2FtZUlEO1xuICAgICAgICAgICAgdGhpcy5kd0dyb3VwSUQgPSB1c2VySW5mb0hlYWQuZHdHcm91cElEO1xuICAgICAgICAgICAgdGhpcy5sTG92ZWxpbmVzcyA9IHVzZXJJbmZvSGVhZC5sTG92ZWxpbmVzcztcblxuICAgICAgICAgICAgdGhpcy5sU2NvcmUgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sU2NvcmU7XG4gICAgICAgICAgICB0aGlzLmxHYW1lR29sZCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxHYW1lR29sZDtcbiAgICAgICAgICAgIHRoaXMubEluc3VyZVNjb3JlID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEluc3VyZVNjb3JlO1xuICAgICAgICAgICAgdGhpcy5sV2luQ291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sV2luQ291bnQ7XG4gICAgICAgICAgICB0aGlzLmxMb3N0Q291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sTG9zdENvdW50O1xuICAgICAgICAgICAgdGhpcy5sRHJhd0NvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubERyYXdDb3VudDtcbiAgICAgICAgICAgIHRoaXMubEZsZWVDb3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxGbGVlQ291bnQ7XG4gICAgICAgICAgICB0aGlzLmxFeHBlcmllbmNlID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEV4cGVyaWVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUodHJ1ZSl7XG4gICAgICAgICAgICAvL+m7mOiupOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTlVMTFx0XHRcdFx0XHQwXHRcdFx0XHRcdFx0XHRcdC8v5peg5pWI5pWw5o2uXG4gICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZVx0RFRQX1VTRVJfQUNDT1VOVFNcdFx0XHQzXHRcdFx0XHRcdFx0XHRcdC8v55So5oi35biQ5Y+3XG4gICAgICAgICAgICAvLyAjZGVmaW5lXHREVFBfVU5ERVJfV1JJVEVcdFx0XHRcdDlcdFx0XHRcdFx0XHRcdFx0Ly/kuKrmgKfnrb7lkI1cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX1VTRVJfR1JPVVBfTkFNRVx0XHRcdDMwMVx0XHRcdFx0XHRcdFx0XHQvL+ekvuWbouWQjeWtl1xuXG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgdmFyIGRhdGFTaXplID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgZGF0YURlc2NyaWJlID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNpemUgPSBcIitkYXRhU2l6ZStcIiBkZXNjcmliZSA9IFwiK2RhdGFEZXNjcmliZSk7XG4gICAgICAgICAgICBpZiAoZGF0YURlc2NyaWJlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgc3dpdGNoKGRhdGFEZXNjcmliZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN6TmFtZSA9IFwi5ri45oiP55So5oi3XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pOYW1lID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN6VW5kZXJXcml0ZSA9IHBEYXRhLnJlYWRzdHJpbmcoZGF0YVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN6R3JvdXBOYW1lID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlYWRVc2VySW5mb0hlYWQ6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAvL+eUqOaIt+WfuuacrOS/oeaBr+e7k+aehFxuICAgICAgICAvLyBzdHJ1Y3QgdGFnVXNlckluZm9IZWFkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI8gSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dyb3VwSUQ7XHRcdFx0XHRcdFx0XHQvL+ekvuWboue0ouW8lVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnrYnnuqdcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TWFzdGVyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nrqHnkIbmnYPpmZBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlck9yZGVyO1x0XHRcdFx0XHRcdC8v5Lya5ZGY562J57qnXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWFzdGVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/nrqHnkIbnrYnnuqdcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOWPt+eggVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+enr+WIhlxuICAgICAgICAvLyAgICAgdGFnVXNlclNjb3JlXHRcdFx0XHRcdFx0VXNlclNjb3JlSW5mbztcdFx0XHRcdFx0XHQvL+enr+WIhuS/oeaBr1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8v55So5oi356ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdVc2VyU2NvcmVcbiAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+WtmOWCqOmHkeW4gVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bERyYXdDb3VudDtcdFx0XHRcdFx0XHRcdC8v5ZKM5bGA55uY5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+aJqeWxleS/oeaBr1xuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+a2iOi0uemHkeW4gVxuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0N1c3RvbUZhY2VWZXI7XHRcdFx0XHRcdC8v5LiK5Lyg5aS05YOPXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1Byb3BSZXNpZHVhbFRpbWVbMTVdO1x0Ly/pgZPlhbfml7bpl7RcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHVzZXJJbmZvSGVhZCA9IHt9O1xuICAgICAgICB1c2VySW5mb0hlYWQud0ZhY2VJRCA9IHBEYXRhLnJlYWR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuICAgICAgICB1c2VySW5mb0hlYWQuZHdHYW1lSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbiAgICAgICAgdXNlckluZm9IZWFkLmR3R3JvdXBJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npL7lm6LntKLlvJVcbiAgICAgICAgdXNlckluZm9IZWFkLmR3VXNlclJpZ2h0ID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnrYnnuqdcbiAgICAgICAgdXNlckluZm9IZWFkLmxMb3ZlbGluZXNzID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd01hc3RlclJpZ2h0ID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5p2D6ZmQXG4gICAgICAgIFxuICAgICAgICAvL+eUqOaIt+WxnuaAp1xuICAgICAgICB1c2VySW5mb0hlYWQuY2JHZW5kZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYk1lbWJlck9yZGVyID0gcERhdGEucmVhZGJ5dGUoKTsgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbiAgICAgICAgdXNlckluZm9IZWFkLmNiTWFzdGVyT3JkZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuetiee6p1xuICAgICAgICBcbiAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgdXNlckluZm9IZWFkLndUYWJsZUlEID0gcERhdGEucmVhZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuICAgICAgICB1c2VySW5mb0hlYWQud0NoYWlySUQgPSBwRGF0YS5yZWFkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYlVzZXJTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgXG4gICAgICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvID0ge307XG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEdhbWVHb2xkID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo6YeR5biBXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxXaW5Db3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IOc5Yip55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxMb3N0Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxEcmF3Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZKM5bGA55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxGbGVlQ291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pat57q/5pWw55uuXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxFeHBlcmllbmNlID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG5cbiAgICAgICAgdXNlckluZm9IZWFkLmR3Q3VzdG9tRmFjZVZlciA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDlpLTlg49cbiAgICAgICAgdXNlckluZm9IZWFkLmR3UHJvcFJlc2lkdWFsVGltZSA9IFtdOy8v6YGT5YW35pe26Ze0XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAxNTsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICAgICAgdXNlckluZm9IZWFkLmR3UHJvcFJlc2lkdWFsVGltZS5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJJbmZvSGVhZDtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lVXNlckl0ZW07IiwidmFyIEdsb2JhbERlZiA9IHtcbiAgICBNQVhfQ0hBSVI6IDEwMCxcdFx0XHRcdFx0XHRcdFx0Ly/il4rDk8Klw5vigJzFkuKXiuKAnVxuICAgIE1BWF9DSEFJUl9OT1JNQUw6IDgsXHRcdFx0XHRcdFx0XHRcdC8v4peKw5PCpcObwrvDgMKgy51cblxuICAgIElOVkFMSURfVEFCTEU6IC0xLFx0XHRcdFx0XHRcdC8vxZLvrIHigJPDn+KXisK/4peK4oCd4oir4omIXG4gICAgSU5WQUxJRF9DSEFJUjogLTEsXHRcdFx0XHRcdFx0Ly/Fku+sgeKAk8Of4oCcxZLil4rigJ3iiKviiYhcblxuICAgIEhNQVRDSF9QT1JUX01JTjogMTAwMDAsXHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjil4rDk+KAk8Kw4oiCw4DDuOKBhOKIq+KJiFxuICAgIEhNQVRDSF9QT1JUX01BWDogMjAwMDAsXHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjil4rDk8Klw5viiILDgMO44oGE4oir4omIXG4gICAgSE1BVENIX1NJR05fTUFYOiA5OSxcdFx0XHRcdFx0XHRcdFx0Ly/igJPCsMKgwrHCu8K4wrXigKLiiaXCsMKxwrvCu8K4wrHCruKImsuawrvDgMKgy53igKbFk8WT76yBXG4gICAgSE1BVENIX01BWE9OTElORTogNTAwLFxuXG4gICAgTUFYX0FORFJPSUQ6IDEwLFx0XHRcdFx0XHRcdFx0XHQvL+acgOWkp+acuuWZqFxuICAgIE1BWF9DSEFUX0xFTjogMTI4LFx0XHRcdFx0XHRcdFx0XHQvL+iBiuWkqemVv+W6plxuICAgIExJTUlUX0NIQVRfVElNRVM6IDEyMDAsXHRcdFx0XHRcdFx0XHQvL+mZkOaXtuiBiuWkqVxuICAgIC8v5q2j5byP5pyN5Yqh5Zmo5Zyw5Z2AXG4gICAgaHR0cEluaXRVcmw6IFwiaHR0cDovL3Zlci5qamhnYW1lLmNvbS9IYW5kbGUvaHovaW5pdC5hc2h4XCIsICAgLy9hcHDliJ3lp4vljJbmjqXlj6PlnLDlnYBcbiAgICBodHRwQmFzZVVybDogXCJodHRwOi8vaW50ZXJmYWNlLmpqaGdhbWUuY29tL0hhbmRsZVwiLCAgICAgICAgLy93ZWLmjqXlj6PlnLDlnYBcbiAgICBodHRwT3BlblVybDogXCJodHRwOi8vdXNlci5qamhnYW1lLmNvbS9maW5kcGFzc3dvcmRIWi5hc3B4XCIsICAvL+aJvuWbnuWvhueggVxuICAgIGh0dHBVc2VyQ2VudGVyOiBcImh0dHA6Ly9mLmpqaGdhbWUuY29tL0hhbmRsZVwiLCAgICAgICAgICAgICAgICAgIC8v55So5oi35Lit5b+DXG4gICAgTE9HT05fU0VSVkVSX0RPTUFJTjogXCJubmFwcC5qamhnYW1lLmNvbVwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leacjeWKoeWZqFxuICAgIExPR09OX1NFUlZFUl9JUDogXCIxMjIuMjI2LjE4Ni4zOFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leacjeWKoeWZqFxuICAgIFBPUlRfTE9HT05fU0VSVkVSOiA5MDA5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+mZhuacjeWKoeWZqFxuXG4vL+err+WPo+WumuS5iVxuICAgIFBPUlRfVklERU9fU0VSVkVSOiA3NjAwLFx0XHRcdFx0XHRcdFx0XHQvL+inhumikeacjeWKoeWZqFxuICAgIFBPUlRfQ0VOVEVSX1NFUlZFUjogOTA5MCxcdFx0XHRcdFx0XHRcdFx0Ly/kuK3lv4PmnI3liqHlmahcblxuICAgIENIQU5ORUxJRF9pbml0OiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rig6YGT5Y+3XG4gICAgQ0hBTk5FTElEX2NlbnRlcjogNywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4oOmBk+WPt1xuLy/nvZHnu5zmlbDmja7lrprkuYlcbiAgICBTT0NLRVRfVkVSOiAweDhDLFx0XHRcdFx0XHRcdFx0XHQvL+e9kee7nOeJiOacrFxuICAgIFNPQ0tFVF9CVUZGRVI6IDgxOTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e9kee7nOe8k+WGslxuICAgIFNPQ0tFVF9QQUNLRVQ6IDgxOTIsXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgLy/lhoXmoLjlkb3ku6TnoIFcbiAgICBNRE1fS05fQ09NTUFORDogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YaF5qC45ZG95LukXG4gICAgU1VCX0tOX0RFVEVDVF9TT0NLRVQ6IDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ajgOa1i+WRveS7pFxuICAgIFNVQl9LTl9TSFVUX0RPV05fU09DS0VUOiA5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuK3mlq3nvZHnu5xcblxuICAgIC8vSVBDIOaVsOaNruWumuS5iVxuICAgIElQQ19WRVI6IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0lQQyDniYjmnKxcbiAgICBJUENfSURFTlRJRklFUjogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qCH6K+G5Y+356CBXG4gICAgSVBDX1BBQ0tBR0U6IDQwOTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOWkpyBJUEMg5YyFXG4gICAgSVBDX0JVRkZFUjogNDA5NiwgICAgLy/nvJPlhrLplb/luqZcblxuICAgIFRZUEVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/Dt8O3wr/igKHiiaXCp+KIgsK7XG4gICAgS0lORF9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K/4oCh4oCTw5XiiaXCp+KIgsK7XG4gICAgU1RBVElPTl9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAmcOmwrXigJ7iiaXCp+KIgsK7XG4gICAgU0VSVkVSX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiRw7jCuuKAsOKJpcKn4oiCwrtcbiAgICBNT0RVTEVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/OqcKv4omlw4PiiaXCp+KIgsK7XG5cbiAgICAvL+KAk+KAmMKx76O/4oiCwq7igJzDglxuICAgIEdFTkRFUl9OVUxMOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/FksKlw7fihKLigJPigJjCse+jv1xuICAgIEdFTkRFUl9CT1k6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8aS4oCT4oCT4oCY4oCT4oCYwrHvo79cbiAgICBHRU5ERVJfR0lSTDogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4omIw4bigJPigJjigJPigJjCse+jv1xuXG4gICAgLy/igJ3FksWT4oiRwr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfU0NPUkU6IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K14oCew7fCtcK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX0dPTEQ6IDB4MDAwMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8K/w7fiiILPgMK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX01BVENIOiAweDAwMDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/CscK7wrvCuMK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX0VEVUNBVEU6IDB4MDAwOCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAlMK1wqHiiJHCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9RVEhFUk1BVENIOiAweDAwMTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/oh6rlrprkuYnmr5TotZvnsbvlnotcblxuICAgIC8v4oCd4oiawqrDn+KXisKlw4PCqOKIgsKu4oCcw4JcbiAgICBVU19OVUxMOiAweDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/msqHmnInnirbmgIFcbiAgICBVU19GUkVFOiAweDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nq5nnq4vnirbmgIFcbiAgICBVU19TSVQ6IDB4MDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+eKtuaAgVxuICAgIFVTX1JFQURZOiAweDAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkIzmhI/nirbmgIFcbiAgICBVU19MT09LT046IDB4MDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeingueKtuaAgVxuICAgIFVTX1BMQVk6IDB4MDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuICAgIFVTX09GRkxJTkU6IDB4MDYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+eKtuaAgVxuXG4gICAgLy/iiaXCp+KIgsK74oirw43iiILCruKAnMOCXG4gICAgTkFNRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KImsua4peKw7fiiaXCp+KIgsK7XG4gICAgUEFTU19MRU46IDMzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KImuKAucKsw47iiaXCp+KIgsK7XG4gICAgRU1BSUxfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igJ3CoMWT4oCw4omlwqfiiILCu1xuICAgIEdST1VQX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCmw4HDleKJiOKJpcKn4oiCwrtcbiAgICBDT01QVVRFUl9JRF9MRU46IDMzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8Kqy5niiIbLnOKAk8OawqHigJNcbiAgICBVTkRFUl9XUklURV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KIj8uG4oCT4oCYwqvCqeKImsuaXG4gICAgTU9CSUxFUEhPTkVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiI/LhuKAk+KAmMKrwqniiJrLmlxuXG4gICAgLy9HbG9iYWxGcmFtZS5oXG4gICAgLy/lro/lrprkuYlcblxuICAgIC8v5ri45oiP54q25oCBXG4gICAgR1NfRlJFRTogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nqbrpl7LnirbmgIFcbiAgICBHU19QTEFZSU5HOiAxMDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL0lQQyDnvZHnu5zkuovku7ZcblxuICAgIElQQ19NQUlOX1NPQ0tFVDogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5zmtojmga9cblxuICAgIElQQ19TVUJfU09DS0VUX1NFTkQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc5Y+R6YCBXG4gICAgSVBDX1NVQl9TT0NLRVRfUkVDVjogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5zmjqXmlLZcblxuICAgIElQQ19NQUlOX0NPTkZJRzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/phY3nva7kv6Hmga9cblxuICAgIElQQ19TVUJfU0VSVkVSX0lORk86IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgSVBDX1NVQl9DT0xVTU5fSU5GTzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajkv6Hmga9cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy9JUEMg55So5oi35L+h5oGvXG5cbiAgICBJUENfTUFJTl9VU0VSOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG4gICAgSVBDX1NVQl9VU0VSX0NPTUU6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG4gICAgSVBDX1NVQl9VU0VSX1NUQVRVUzogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICBJUENfU1VCX1VTRVJfU0NPUkU6IDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi356ev5YiGXG4gICAgSVBDX1NVQl9HQU1FX1NUQVJUOiA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuICAgIElQQ19TVUJfR0FNRV9GSU5JU0g6IDUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57uT5p2fXG4gICAgSVBDX1NVQl9VUERBVEVfRkFDRTogNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDlpLTlg49cbiAgICBJUENfU1VCX01FTUJFUk9SREVSOiA3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOWktOWDj1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL0lQQyDmjqfliLbkv6Hmga9cblxuICAgIElQQ19NQUlOX0NPTkNUUk9MOiA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aOp+WItuS/oeaBr1xuXG4gICAgSVBDX1NVQl9TVEFSVF9GSU5JU0g6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZCv5Yqo5a6M5oiQXG4gICAgSVBDX1NVQl9DTE9TRV9GUkFNRTogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63moYbmnrZcbiAgICBJUENfU1VCX0pPSU5fSU5fR0FNRTogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDlhaXmuLjmiI9cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy/nvZHnu5zlkb3ku6TnoIFcblxuICAgIE1ETV9HRl9HQU1FOiA5OSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+a2iOaBr1xuICAgIE1ETV9HRl9GUkFNRTogOTgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYbmnrbmtojmga9cbiAgICBNRE1fR0ZfUFJFU0VOVDogOTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npLznianmtojmga9cbiAgICBNRE1fR0ZfQkFOSzogOTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pk7booYzmtojmga9cblxuICAgIFNVQl9HRl9JTkZPOiAxMTEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+S/oeaBr1xuICAgIFNVQl9HRl9VU0VSX1JFQURZOiAxMTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WQjOaEj1xuICAgIFNVQl9HRl9MT09LT05fQ09OVFJPTDogMTEzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml4Hop4LmjqfliLZcbiAgICBTVUJfR0ZfS0lDS19UQUJMRV9VU0VSOiAxMTQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i4oui1sOeUqOaIt1xuICAgIFNVQl9HRl9XUklURV9NQVRDSF9TQ09SRTogMTE1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhpnmr5TotZvmiJDnu6lcblxuICAgIFNVQl9HRl9PUFRJT046IDExNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YWN572uXG4gICAgU1VCX0dGX1NDRU5FOiAxMTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WcuuaZr+S/oeaBr1xuXG4gICAgU1VCX0dGX1VTRVJfQ0hBVDogMTE4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfogYrlpKlcblxuICAgIFNVQl9HRl9NRVNTQUdFOiAxMTksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4gICAgLy9TVUJfR0ZfR0lGVDogNDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otaDpgIHmtojmga9cblxuICAgIFNVQl9HRl9CQU5LX1NUT1JBR0U6IDI1MCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZO26KGM5a2Y5YKoXG4gICAgU1VCX0dGX0JBTktfR0VUOiAyNTEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mTtuihjOaPkOWPllxuICAgIFNVQl9HRl9CQU5LX1BSRVNFTlQ6IDI1MiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCB6YeR5biBXG4gICAgU1VCX0dGX0JBTktfTU9ESUZZX1BBU1M6IDI1MywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+u5pS55a+G56CBXG4gICAgU1VCX0dGX0JBTktfUVVFUlk6IDI1NCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6YeR5biBXG4gICAgU1VCX0dGX0JBTktfUFJFU0VOVF9RVVJFWTogMjU1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6LnlKjmiLdcbiAgICBTVUJfR0ZfQkFOS19DTE9TRTogMjU2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgIDlh7pcbiAgICBTVUJfR0ZfVFJBTl9SRUNPUkQ6IDI1NywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L2s5biQ6K6w5b2VXG4gICAgU1VCX0dGX1VTRVJfSU5GT19RVVJFWTogMjU4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6LnlKjmiLdcbiAgICBTVUJfR0ZfVVNFUl9SRUNIQVJHRTogMjU5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflhYXlgLxcblxuICAgIFNVQl9HRl9GTE9XRVJfQVRUUklCVVRFOiA1MzAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mynOiKseWxnuaAp1xuICAgIFNVQl9HRl9GTE9XRVI6IDUzMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6bKc6Iqx5raI5oGvXG4gICAgU1VCX0dGX0VYQ0hBTkdFX0NIQVJNOiA1MzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFkeaNoumtheWKm1xuXG4gICAgU1VCX0dGX1BST1BFUlRZOiA1MTAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mBk+WFt+a2iOaBr1xuICAgIFNVQl9HRl9QUk9QRVJUWV9SRVNVTFQ6IDUxMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YGT5YW357uT5p6cXG4gICAgU1VCX0dGX1JFU0lEVUFMX1BST1BFUlRZOiA1MTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WJqeS9memBk+WFt1xuICAgIFNVQl9HRl9QUk9QX0FUVFJJQlVURTogNTEzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgZPlhbflsZ7mgKdcbiAgICBTVUJfR0ZfUFJPUF9CVUdMRTogNTE0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lloflj63pgZPlhbdcbiAgICBTVUJfR0ZfUVVFUllfVVNFUl9JTkZPOiA1MTUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mynOiKsea2iOaBr1xuICAgIFNVQl9HRl9TRU5EX0hPTkdfQkFPOiA1MTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkee6ouWMhVxuICAgIFNVQl9HRl9RSUFOR19IT05HX0JBTzogNTE3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HnuqLljIVcblxuICAgIC8v5raI5oGv57G75Z6LXG4gICAgU01UX0lORk86IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG4gICAgU01UX0VKRUNUOiAweDAwMDIsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xuICAgIFNNVF9HTE9CQUw6IDB4MDAwNCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWo5bGA5raI5oGvXG4gICAgU01UX0NMT1NFX0dBTUU6IDB4MTAwMCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5ri45oiPXG5cbiAgICAvL+WPkemAgeWcuuaJgFxuICAgIExPQ0FUSU9OX0dBTUVfUk9PTTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/miL/pl7RcbiAgICBMT0NBVElPTl9QTEFaQV9ST09NOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheaIv+mXtFxuXG59XG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbERlZjtcbiIsInJlcXVpcmUoXCJNRDVcIik7XG5mdW5jdGlvbiBBY3Rpb25TaG93VGFuQ2h1YW5nKHdpZGdldCwgY2Ipe1xuICAgIGlmIChjYy5pc1ZhbGlkKHdpZGdldCkgPT09IGZhbHNlICkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxGdW5dW0FjdGlvblNob3dUYW5DaHVhbmddIHdpZGdldCBpcyBpbnZhbGlkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHdpZGdldC5vcGFjaXR5ID0gMDtcbiAgICB3aWRnZXQuc2NhbGUgPSAwLjAxO1xuICAgIHdpZGdldC5ydW5BY3Rpb24oY2Muc3Bhd24oXG4gICAgICAgICAgICBjYy5mYWRlSW4oMC4yNSksXG4gICAgICAgICAgICBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKDAuMiwgMS4xKSxjYy5zY2FsZVRvKDAuMDUsIDEuMCkpLGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mKGNiKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICApKTtcbn1cbmZ1bmN0aW9uIHNob3dUb2FzdChjb250ZXh0LG1lc3NhZ2UpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9Ub2FzdFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgVG9hc3RQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoVG9hc3RQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJUb2FzdFZpZXdcIikub25Jbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBBY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUuY2hpbGRyZW5bMF0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93VG9hc3RcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc2hvd0FsZXJ0KGNvbnRleHQsbWVzc2FnZSkge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL0FsZXJ0Vmlld1wiLCBmdW5jdGlvbiAoZXJyLCBBbGVydFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShBbGVydFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkFsZXJ0Vmlld1wiKS5pbml0KHttZXNzYWdlOm1lc3NhZ2V9KTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dBbGVydFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLypcbnNob3dQb3BXYWl0aW5nKClcbkBwYXJhbXN7XG4gICAgd2FpdGluZ1RleHQ6IOeVjOmdouaYvuekuueahOaWh+WtlyxcbiAgICB3YWl0aW5nVGltZTog55WM6Z2i5a2Y5Zyo55qE5pe26Ze0LOi2heaXtuWNs+mUgOavgeeVjOmdoixcbiAgICBjbG9zZUV2ZW50OiDlhbPpl63nlYzpnaLnm5HlkKznmoTkuovku7YsIFxuICAgIGNhbGxCYWNrRnVuYzog5pS25Yiw55uR5ZCs5LqL5Lu25omn6KGM55qE5Zue6LCD5Ye95pWwLFxufVxuKi9cbmZ1bmN0aW9uIHNob3dQb3BXYWl0aW5nKGNvbnRleHQscGFyYW1zKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvUG9wV2FpdGluZ1ZpZXdcIiwgZnVuY3Rpb24gKGVyciwgUG9wV2FpdFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShQb3BXYWl0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiUG9wV2FpdFZpZXdcIikub25Jbml0KHBhcmFtcyk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd1BvcFdhaXRpbmdcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0c2lnbihwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgKyBcImtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiOy8v5Yqg5YWla2V5XG4gICAgcmV0dXJuIGNjLm1kNUVuY29kZShwYXJhbXMpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcykge1xuICAgIHZhciBub3dUaW1lID0gTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApO1xuICAgIHBhcmFtc1tcImRhdGV0YW1wXCJdID0gbm93VGltZTtcbiAgICB2YXIgc29ydF9wYXJhbXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpLnNvcnQoKVxuICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbEZ1bl1bYnVpbGRSZXF1ZXN0UGFyYW1dIFwiICsgSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgdmFyIHBhcmFtU3RyaW5nID0gXCJcIjtcbiAgICBmb3IgKHZhciBraSBpbiBzb3J0X3BhcmFtcykge1xuICAgICAgICB2YXIga2V5ID0gc29ydF9wYXJhbXNba2ldO1xuICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBwYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nICsga2V5ICsgXCI9XCIgKyBlbGVtZW50ICsgXCImXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZyArIFwic2lnbj1cIiArIGdldHNpZ24ocGFyYW1TdHJpbmcpO1xuICAgIHJldHVybiBwYXJhbVN0cmluZztcbn1cblxuZnVuY3Rpb24gaXBUb051bWJlcihpcCkge1xuXHR2YXIgbnVtID0gMDtcblx0aWYoaXAgPT0gXCJcIikge1xuXHRcdHJldHVybiBudW07XG5cdH0gICAgXG4gICAgdmFyIGFOdW0gPSBpcC5zcGxpdChcIi5cIik7IFxuICAgIGlmKGFOdW0ubGVuZ3RoICE9IDQpIHtcbiAgICBcdHJldHVybiBudW07XG4gICAgfSAgIFxuICAgIG51bSArPSBwYXJzZUludChhTnVtWzBdKSA8PCAyNDtcbiAgICBudW0gKz0gcGFyc2VJbnQoYU51bVsxXSkgPDwgMTY7XG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bMl0pIDw8IDg7XG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bM10pIDw8IDA7XG4gICAgbnVtID0gbnVtID4+PiAwOy8v6L+Z5Liq5b6I5YWz6ZSu77yM5LiN54S25Y+v6IO95Lya5Ye6546w6LSf5pWw55qE5oOF5Ya1XG4gICAgcmV0dXJuIG51bTsgIFxufSAgICBcbiAgXG5mdW5jdGlvbiBudW1iZXJUb0lwKG51bWJlcikgeyAgICBcbiAgICB2YXIgaXAgPSBcIlwiO1xuICAgIGlmKG51bWJlciA8PSAwKSB7XG4gICAgXHRyZXR1cm4gaXA7XG4gICAgfVxuICAgIHZhciBpcDMgPSAobnVtYmVyIDw8IDAgKSA+Pj4gMjQ7XG4gICAgdmFyIGlwMiA9IChudW1iZXIgPDwgOCApID4+PiAyNDtcbiAgICB2YXIgaXAxID0gKG51bWJlciA8PCAxNikgPj4+IDI0O1xuICAgIHZhciBpcDAgPSAobnVtYmVyIDw8IDI0KSA+Pj4gMjRcbiAgICBcbiAgICBpcCArPSBpcDAgKyBcIi5cIiArIGlwMSArIFwiLlwiICsgaXAyICsgXCIuXCIgKyBpcDM7XG4gICAgXG4gICAgcmV0dXJuIGlwOyAgIFxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQWN0aW9uU2hvd1RhbkNodWFuZzogQWN0aW9uU2hvd1RhbkNodWFuZyxcbiAgICBzaG93VG9hc3Q6IHNob3dUb2FzdCxcbiAgICBzaG93QWxlcnQ6IHNob3dBbGVydCxcbiAgICBzaG93UG9wV2FpdGluZzogc2hvd1BvcFdhaXRpbmcsXG4gICAgYnVpbGRSZXF1ZXN0UGFyYW06IGJ1aWxkUmVxdWVzdFBhcmFtLFxuICAgIGlwVG9OdW1iZXI6aXBUb051bWJlcixcbiAgICBudW1iZXJUb0lwOm51bWJlclRvSXAsXG59OyIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHtcbiAgICB3RmFjZUlEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgY2JHZW5kZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgIGNiTWVtYmVyOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICBpc0d1ZXN0OiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/mmK/lkKbmmK/muLjlrqJcbiAgICBpc09wZW5SZWdpc3RlcjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/ms6jlhozlip/og71cbiAgICBpc09wZW5JQVA6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/oi7nmnpxpYXBcbiAgICB3RW5jcnlwdElEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgd0NvZGVDaGVja0lEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgIGR3VXNlcklEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgZHdHYW1lSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICBkd0V4cGVyaWVuY2U6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICBzek1vYmlsZUF1dGg6IHVuZGVmaW5lZCwgICAgICAgICAvL+azqOWGjOaXtumqjOivgeeggVxuICAgIHN6QWNjb3VudHM6IHVuZGVmaW5lZCxcdFx0XHQvL+eZu+W9leW4kOWPt1xuICAgIHN6Tmlja05hbWU6IHVuZGVmaW5lZCwgICAgICAgICAgIC8v546p5a625pi156ewXG4gICAgc3pQYXNzV29yZDogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5a+G56CBXG4gICAgc3pHcm91cE5hbWU6IHVuZGVmaW5lZCxcdFx0XHQvL+ekvuWbouS/oeaBr1xuICAgIHN6VW5kZXJXcml0ZTogdW5kZWZpbmVkLFx0Ly/kuKrmgKfnrb7lkI1cbiAgICBcbiAgICAvL+aJqeWxleS/oeaBr1xuICAgIGR3Q3VzdG9tRmFjZVZlcjogdW5kZWZpbmVkLFx0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAvL+mSsVxuICAgIGR3Rm9ydHVuZUNvaW46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+emj+W4gVxuICAgIGxsR2FtZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgbGxJbnN1cmVTY29yZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgIGR3Q291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+i0neWjs1xuICAgIGR3SW5zdXJlQ291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+mTtuihjOi0neWjs1xuICAgIGR3TWF0Y2hUaWNrZXQ6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuICAgIGlzRmlyc3RCYW5rOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8vIOmmluasoeS9v+eUqFxuXG4gICAgcm9vbUxpc3Q6IFtdLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcImpzb24vc2hvcHBhZ2VcIiwgZnVuY3Rpb24gKGVyciwgY29udGVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGVudCk7XG4gICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxVc2VyRGF0YV1baW5pdF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucm9vbUxpc3QgPSBbXTtcbiAgICB9LFxuICAgIG9uTG9hZERhdGE6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3NNb2JpbGVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgLy/mianlsZXkv6Hmga9cbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3Q3VzdG9tRmFjZVZlcjtcdFx0XHRcdC8v5aS05YOP54mI5pysXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTW9vck1hY2hpbmU7XHRcdFx0XHRcdC8v6ZSB5a6a5py65ZmoXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiQmluZFdlaVhpbjtcdFx0XHRcdFx0Ly/nu5Hlrprlvq7kv6EgV1NMXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNZW1iZXI7XHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0Ly/nlKjmiLfmgKfliKtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0VuY3J5cHRJRDtcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NvZGVDaGVja0lEO1x0XHRcdFx0XHQvL+maj+acuueggTJcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3RXhwZXJpZW5jZTtcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bGxHYW1lU2NvcmU7XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0Ly/pk7booYzph5HluIFcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6QWNjb3VudHNbTkFNRV9MRU5dO1x0XHRcdC8v55m75b2V5biQ5Y+3XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5pY2tOYW1lW05BTUVfTEVOXTtcdFx0XHQvL+aYteensFxuICAgICAgICAvLyB9O1xuICAgICAgICB0aGlzLmR3Q3VzdG9tRmFjZVZlciA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmNiTW9vck1hY2hpbmUgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLmNiQmluZFdlaVhpbiA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMud0ZhY2VJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuY2JNZW1iZXIgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLmNiR2VuZGVyID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy53RW5jcnlwdElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53Q29kZUNoZWNrSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLmR3RXhwZXJpZW5jZSA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmR3R2FtZUlEID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5sbEdhbWVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpO1xuICAgICAgICB0aGlzLmxsSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTtcbiAgICAgICAgdGhpcy5zekFjY291bnRzID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIHRoaXMuc3pOaWNrTmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoMzIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKHRoaXNbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcy4nICsgcHJvcCwgJz0nLCB0aGlzW3Byb3BdKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Um9vbUJ5R2FtZTogZnVuY3Rpb24gKHdLaW5kSUQpIHtcbiAgICAgICAgdmFyIHJvb21MaXN0ID0gW107XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJvb21MaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnJvb21MaXN0W2luZGV4XTtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LndLaW5kSUQgPT0gd0tpbmRJRCkge1xuICAgICAgICAgICAgICAgIHJvb21MaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvb21MaXN0O1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdsb2JhbFVzZXJEYXRhOyIsInJlcXVpcmUoXCJNRDVcIik7XG52YXIgZ2FtZV9jbWQgPSByZXF1aXJlKFwiQ01EX0dhbWVcIik7XG52YXIgcGxhemFfY21kID0gcmVxdWlyZShcIkNNRF9QbGF6YVwiKTtcbnZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvLyBkZWZhdWx0cywgc2V0IHZpc3VhbGx5IHdoZW4gYXR0YWNoaW5nIHRoaXMgc2NyaXB0IHRvIHRoZSBDYW52YXNcbiAgICAgICAgdGV4dDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcImhlbGxvRnJhbWVcIixcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8ganNiVGVzdC50ZXN0bG9nKCk7XG4gICAgICAgIC8vIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gdGhpcy5zb2NrZXQgPSBDbGllbnRTb2NrZXQuY3JlYXRlU29ja2V0KGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFja19iZWdpbicpO1xuICAgICAgICAvLyAgICAgLy8gdmFyIG1haW5JRCA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgLy8gICAgIC8vIHZhciBzdWJJRCA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2cobWFpbklEKTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKHN1YklEKTtcbiAgICAgICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFja19lbmQnKTtcbiAgICAgICAgLy8gICAgIHNlbGYub25Tb2NrZXRDYWxsQmFjayhwRGF0YSk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyAvLyB2YXIgcERhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnNldGNtZGluZm8oMiwzKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaGJ5dGUoMSk7XG4gICAgICAgIC8vIC8vIHBEYXRhLnB1c2h3b3JkKDIzMzMzKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaGRvdWJsZSgxMjMuMzQzNCk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLmdldG1haW4oKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLmdldHN1YigpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZGJ5dGUoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWR3b3JkKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkZG91YmxlKCkpO1xuICAgICAgICAvLyB0aGlzLnNvY2tldC5Db25uZWN0U29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KTtcbiAgICAgICAgdGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSk7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50ZXh0O1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIH0sXG4gICAgLy8gb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAvLyAgICAgaWYocERhdGEgPT09IHVuZGVmaW5lZClcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHZhciBtYWluID0gcERhdGEuZ2V0bWFpbigpO1xuICAgIC8vICAgICB2YXIgc3ViID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdtYWluID0gJyttYWluKycgc3ViID0gJytzdWIpO1xuICAgIC8vICAgICBpZiAobWFpbiA9PT0gMCkgXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIGlmKHN1YiA9PT0gMClcbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdENvbXBlbGV0ZWQoKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGVsc2VcbiAgICAvLyAgICAgICAgIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLm9uU29ja2V0RXJyb3IocERhdGEpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2VcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgdGhpcy5vblNvY2tldEV2ZW50KHBEYXRhKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2hlbGxvX29uQ29ubmVjdENvbXBlbGV0ZWQnKTtcbiAgICB9LFxuICAgIC8vIG9uU29ja2V0RXJyb3I6ZnVuY3Rpb24ocERhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZygnb25Tb2NrZXRFcnJvcicpO1xuICAgIC8vIH0sXG4gICAgLy8gb25Tb2NrZXRFdmVudDogZnVuY3Rpb24ocERhdGEpe1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0RXZlbnRcIik7XG4gICAgLy8gfSxcbiAgICBzZW5kTG9nb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIxNzYwMjE3MDMxM1wiLDMyKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyNWQ1NWFkMjgzYWE0MDBhZjQ2NGM3NmQ3MTNjMDdhZFwiLDMzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyZDRkN2M5NWU1ZGYwMTc5YWYyNDY2ZjYzNWNhNzFkZVwiLDMzKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hieXRlKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICB9XG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdhbWVTZXJ2ZXJJdGVtID0gcmVxdWlyZShcIkdhbWVTZXJ2ZXJJdGVtXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgLy8gZm9yICh2YXIgcHJvcCBpbiBHbG9iYWxVc2VyRGF0YSkge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdHbG9iYWxVc2VyRGF0YS4nICsgcHJvcCwgJz0nLCBHbG9iYWxVc2VyRGF0YVtwcm9wXSk7XG4gICAgICAgIC8vIH1cbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYodGhpcy5fbG9nb25Nb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5fbG9nb25Nb2RlID09PSAxKXtcbiAgICAgICAgICB0aGlzLnNlbmRSZWdpc3RlcigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDIpe1xuICAgICAgICAgIHRoaXMuc2VuZFZpc2l0b3IoKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLmnKrnn6XnmbvlvZXmqKHlvI9cIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSkge1xuICAgICAgICBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSl7XG4gICAgICAgICAgICB0aGlzLm9uU3ViTG9nb25FdmVudChzdWIscERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gcGxhemFfY21kLk1ETV9HUF9TRVJWRVJfTElTVCl7XG4gICAgICAgICAgICB0aGlzLm9uUm9vbUxpc3RFdmVudChzdWIscERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobWFpbiA9PT0gcGxhemFfY21kLk1ETV9HUF9TWVNURU0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi57O757uf5raI5oGvXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblN1YkxvZ29uRXZlbnQ6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBpZiAoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX1NVQ0NFU1NfTU9CSUxFKXtcbiAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLm9uTG9hZERhdGEocERhdGEpO1xuICAgICAgICAgICAgdmFyIGJSZW1lbWJlclB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImJSZW1lbWJlclB3ZFwiKTtcbiAgICAgICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkID0gY2MubWQ1RW5jb2RlKHRoaXMuX3N6UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIGlmIChiUmVtZW1iZXJQd2QgPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudCcsIHRoaXMuX3N6QWNjb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGFzc3dvcmQnLCB0aGlzLl9zelBhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudCcpO1xuICAgICAgICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Bhc3N3b3JkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ29uIHN1Y2Nlc3NcIik7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiTG9nb25TdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1YiA9PT0gcGxhemFfY21kLlNVQl9HUF9MT0dPTl9FUlJPUl9NT0JJTEUpIHtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX0ZJTklTSF9NT0JJTEUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGZpbmlzaFwiKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICAgICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblJvb21MaXN0RXZlbnQ6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgb25Sb29tTGlzdEV2ZW50XCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1RZUEU6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9UWVBFXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfS0lORDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX0tJTkRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9TVEFUSU9OOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfU1RBVElPTlwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1NFUlZFUjpcbiAgICAgICAgICAgICAgICB2YXIgcEdhbWVTZXJ2ZXIgPSBuZXcgR2FtZVNlcnZlckl0ZW0oKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtOWIl+ihqOe7k+aehFxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdHYW1lU2VydmVyXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTb3J0SUQ7XHRcdFx0XHRcdFx0XHQvL+aOkuW6j+WPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdLaW5kSUQ7XHRcdFx0XHRcdFx0XHQvL+WQjeensOWPt+eggVxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdTZXJ2ZXJJRDtcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1N0YXRpb25JRDtcdFx0XHRcdFx0XHRcdC8v56uZ54K55Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NlcnZlclBvcnQ7XHRcdFx0XHRcdFx0Ly/miL/pl7Tnq6/lj6NcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdTZXJ2ZXJBZGRyO1x0XHRcdFx0XHRcdC8v5oi/6Ze05Zyw5Z2AXG4gICAgICAgICAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3T25MaW5lQ291bnQ7XHRcdFx0XHRcdFx0Ly/lnKjnur/kurrmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pTZXJ2ZXJOYW1lW1NFUlZFUl9MRU5dO1x0XHRcdC8v5oi/6Ze05ZCN56ewXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICBwR2FtZVNlcnZlci5vbkluaXQocERhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcEdhbWVTZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZihwR2FtZVNlcnZlcltwcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BHYW1lU2VydmVyLicgKyBwcm9wLCAnPScsIHBHYW1lU2VydmVyW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEucm9vbUxpc3QucHVzaChwR2FtZVNlcnZlcik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocEdhbWVTZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2VuZExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6QWNjb3VudCwzMik7XG4gICAgICAgIC8vIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMjVkNTVhZDI4M2FhNDAwYWY0NjRjNzZkNzEzYzA3YWRcIiwzMyk7XG4gICAgICAgIGlmIChHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0KSB7XG4gICAgICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyh0aGlzLl9zelBhc3N3b3JkLDMzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoY2MubWQ1RW5jb2RlKHRoaXMuX3N6UGFzc3dvcmQpLDMzKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIlwiLDMzKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH0sXG4gICAgc2VuZFJlZ2lzdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlZ2lzdGVyRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgdmFyIGR3TW9iaWxlU3lzVHlwZSA9IDE7XG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlckRhdGEuc2V0Y21kaW5mbyhwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSxwbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX01PQklMRSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNod29yZCgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hieXRlKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKGR3TW9iaWxlU3lzVHlwZSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoempoX2NtZC5LSU5EX0lEKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pSZWdBY2NvdW50LDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcoY2MubWQ1RW5jb2RlKHRoaXMuX3N6UmVnUGFzc3dvcmQpLDMzKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pNb2JpbGVQaG9uZSwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6Tmlja05hbWUsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek1vYmlsZUF1dGgsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyhcIlwiLDMzKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShyZWdpc3RlckRhdGEpO1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNNb2JsaWVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RmFjZUlEO1x0XHRcdFx0XHRcdC8vIOWktOWDj+agh+ivhlxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHQvLyDnlKjmiLfmgKfliKtcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlU3lzVHlwZTtcdFx0XHRcdC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TW9iaWxlQXBwS2luZDtcdFx0XHRcdC8vIOW5v+WcuuaJi+acuueJiOacrFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBWZXJzaW9uO1x0XHRcdFx0Ly8g5bm/5Zy65omL5py654mI5pysXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzekFjY291bnRzW05BTUVfTEVOXTtcdFx0XHQvLyDnmbvlvZXluJDlj7dcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6UGFzc1dvcmRbUEFTU19MRU5dO1x0XHRcdC8vIOeZu+W9leWvhueggVxuICAgICAgICAvLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVwaG9uZVtNT0JJTEVQSE9ORV9MRU5dOyAvLyDmiYvmnLpcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6Tmlja05hbWVbTkFNRV9MRU5dO1x0XHRcdC8vIOaYteensFxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pNb2JpbGVBdXRoW05BTUVfTEVOXTtcdFx0XHQvL+aJi+acuumqjOivgeeggVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbiAgICAgICAgLy8gfTtcbiAgICB9LFxuICAgIHNlbmRWaXNpdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICB9LFxuICAgIG9uTG9nb25CeUFjY291bnQ6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkKSB7XG4gICAgICAgIHRoaXMuX3N6QWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBcIjAxMjM0NTY3ODlcIjtcbiAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAwO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XSBcIitzekFjY291bnQrXCIgIyBcIisgc3pQYXNzd29yZCk7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5QWNjb3VudF1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25Mb2dvbkJ5VmlzaXRvcjogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQpIHtcbiAgICAgICAgdGhpcy5fc3pBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelBhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IFwiMDEyMzQ1Njc4OVwiO1xuICAgICAgICB0aGlzLl9sb2dvbk1vZGUgPSAyO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeVZpc2l0b3JdW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeVZpc2l0b3JdW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uKHN6QWNjb3VudCxzelBhc3N3b3JkLHN6Tmlja05hbWUsc3pNb2JpbGVBdXRoKSB7XG4gICAgICAgIHRoaXMuX3N6UmVnQWNjb3VudCA9IHN6QWNjb3VudDtcbiAgICAgICAgdGhpcy5fc3pSZWdQYXNzd29yZCA9IHN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX3N6Tmlja05hbWUgPSBzek5pY2tOYW1lO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zek1vYmlsZUF1dGggPSBzek1vYmlsZUF1dGg7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDE7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25SZWdpc3Rlcl1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25SZWdpc3Rlcl1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBsb2dvblZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lzdGVyVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9hZF1cIik7XG4gICAgICAgIEdsb2JhbFVzZXJEYXRhLmluaXQoKTtcbiAgICAgICAgdGhpcy5fbG9nb25GcmFtZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJMb2dvbkZyYW1lXCIpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25Mb2dvbicsdGhpcy5vbkxvZ29uLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25TaG93UmVnaXN0ZXInLHRoaXMub25TaG93UmVnaXN0ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvblJlZ2lzdGVyJyx0aGlzLm9uUmVnaXN0ZXIsdGhpcyk7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uTG9nb24nLHRoaXMub25Mb2dvbix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvblNob3dSZWdpc3RlcicsdGhpcy5vblNob3dSZWdpc3Rlcix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvblJlZ2lzdGVyJyx0aGlzLm9uUmVnaXN0ZXIsdGhpcyk7XG4gICAgfSxcbiAgICBvbkxvZ29uOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvZ29uXVwiKTtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IGV2ZW50LmRldGFpbC5zekFjY291bnQ7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gZXZlbnQuZGV0YWlsLnN6UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuX2xvZ29uRnJhbWUub25Mb2dvbkJ5QWNjb3VudChzekFjY291bnQsc3pQYXNzd29yZCk7XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93UG9wV2FpdGluZyhjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHtcbiAgICAgICAgICAgIGNsb3NlRXZlbnQ6IFwiTG9nb25TdWNjZXNzXCIsXG4gICAgICAgICAgICBjYWxsQmFja0Z1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvbkxvZ29uXSBjYWxsYmFja2Z1bmNcIik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIG9uUmVnaXN0ZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblJlZ2lzdGVyXVwiKTtcbiAgICAgIHZhciBzekFjY291bnQgPSBldmVudC5kZXRhaWwuc3pBY2NvdW50O1xuICAgICAgdmFyIHN6UGFzc3dvcmQgPSBldmVudC5kZXRhaWwuc3pQYXNzd29yZDtcbiAgICAgIHZhciBzek5pY2tOYW1lID0gZXZlbnQuZGV0YWlsLnN6Tmlja05hbWU7XG4gICAgICB2YXIgc3pNb2JpbGVBdXRoID0gZXZlbnQuZGV0YWlsLnN6TW9iaWxlQXV0aDtcbiAgICAgIGlmKHN6QWNjb3VudCA9PT0gdW5kZWZpbmVkIHx8IHN6UGFzc3dvcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uUmVnaXN0ZXJdIHN6QWNjb3VudCBvciBzelBhc3N3b3JkIGlzIHVuZGVmaW5lZFwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLl9sb2dvbkZyYW1lLm9uUmVnaXN0ZXIoc3pBY2NvdW50LHN6UGFzc3dvcmQsc3pOaWNrTmFtZSxzek1vYmlsZUF1dGgpO1xuICAgIH0sXG4gICAgb25TaG93TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9sb2dvblZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fbG9nb25WaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5sb2dvblZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX2xvZ29uVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fbG9nb25WaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd0xvZ29uXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvblNob3dWaXN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXVwiKTtcbiAgICAgICAgLy8gR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5ri45a6i55m75b2V5pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgIHVybCArPSBcIi9HdWVzdC9HdWVzdExvZ2luLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJraW5kaWRcIl0gPSB6amhfY21kLktJTkRfSUQ7XG4gICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRlbnRpdHlcIl0gPSBcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCI7XG4gICAgICAgIHBhcmFtc1tcImNoYW5uZWxpZFwiXSA9IEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMVwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzID0gdmFsdWUudXNlcm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSB2YWx1ZS5wd2Q7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJQbGF6YVNjZW5lXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9sb2dvbkZyYW1lLm9uTG9nb25CeVZpc2l0b3IoR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyxHbG9iYWxVc2VyRGF0YS5zelBhc3NXb3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiR3Vlc3RMb2dpbkNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgY2xvc2VFdmVudDogXCJHdWVzdExvZ2luQ29tcGxldGVkXCIsXG4gICAgICAgICAgICBjYWxsQmFja0Z1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdIGNhbGxiYWNrZnVuY1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvblNob3dSZWdpc3RlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykgPT09IHRydWUpe1xuICAgICAgICAgICAgdGhpcy5fbG9nb25WaWV3LmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBpZihjYy5pc1ZhbGlkKHRoaXMuX3JlZ2lzdGVyVmlldykgPT09IGZhbHNlKXtcbiAgICAgICAgICAgIHRoaXMuX3JlZ2lzdGVyVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMucmVnaXN0ZXJWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9yZWdpc3RlclZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3JlZ2lzdGVyVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dSZWdpc3Rlcl1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX2VkaXRib3hfYWNjb3VudDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3Bhc3N3b3JkOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2NoZWNrYm94OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZih0aGlzLm1fY2hlY2tib3gpIHtcbiAgICAgICAgICAgIHZhciBwd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwd2RcIik7XG4gICAgICAgICAgICB2YXIgYlJlbWVtYmVyUHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gaXMgXCIgKyBiUmVtZW1iZXJQd2QpO1xuICAgICAgICAgICAgaWYgKGJSZW1lbWJlclB3ZCA9PSAndHJ1ZScgfHwgYlJlbWVtYmVyUHdkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvYWRdIGNoZWNrXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubV9jaGVja2JveC5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHZhciBzekFjY291bnQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50XCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwYXNzd29yZFwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nID0gc3pBY2NvdW50O1xuICAgICAgICAgICAgICAgIHRoaXMubV9lZGl0Ym94X3Bhc3N3b3JkLnN0cmluZyA9IHN6UGFzc3dvcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gdW5jaGVja1wiKVxuICAgICAgICAgICAgICAgIHRoaXMubV9jaGVja2JveC51bmNoZWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkxvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IHRoaXMubV9lZGl0Ym94X3Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtvbkxvZ29uXSBcIitzekFjY291bnQrXCIgIyBcIitzelBhc3N3b3JkKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uTG9nb25cIix7c3pBY2NvdW50OnN6QWNjb3VudCxzelBhc3N3b3JkOnN6UGFzc3dvcmR9KTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTsgIFxuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tSZWdpc3RlckJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvblNob3dSZWdpc3RlclwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tGb3JnZXRQYXNzd29yZDogZnVuY3Rpb24oKXtcbiAgICAgICAgY2Muc3lzLm9wZW5VUkwoR2xvYmFsRGVmLmh0dHBPcGVuVXJsKTtcbiAgICB9LFxuICAgIGNoZWNrQm94Q2xpY2tlZDogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICBpZiAodG9nZ2xlLmlzQ2hlY2tlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25WaWV3XVtjaGVja0JveENsaWNrZWRdIGlzIGNoZWNrZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW2NoZWNrQm94Q2xpY2tlZF0gaXMgdW5jaGVja2VkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImJSZW1lbWJlclB3ZFwiLCB0b2dnbGUuaXNDaGVja2VkKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLm1kNUVuY29kZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIC8vIGZvciB0ZXN0L2RlYnVnXG4gICAgZnVuY3Rpb24gZmZsb2cobXNnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBudW1iZXIgdG8gKHVuc2lnbmVkKSAzMiBiaXQgaGV4LCB6ZXJvIGZpbGxlZCBzdHJpbmdcbiAgICBmdW5jdGlvbiB0b196ZXJvZmlsbGVkX2hleChuKSB7XG4gICAgICAgIHZhciB0MSA9IChuID4+PiAyNCkudG9TdHJpbmcoMTYpO1xuICAgICAgICB2YXIgdDIgPSAobiAmIDB4MDBGRkZGRkYpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgcmV0dXJuIFwiMDBcIi5zdWJzdHIoMCwgMiAtIHQxLmxlbmd0aCkgKyB0MSArXG4gICAgICAgICAgICBcIjAwMDAwMFwiLnN1YnN0cigwLCA2IC0gdDIubGVuZ3RoKSArIHQyO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYXJyYXkgb2YgY2hhcnMgdG8gYXJyYXkgb2YgYnl0ZXMgKG5vdGU6IFVuaWNvZGUgbm90IHN1cHBvcnRlZClcbiAgICBmdW5jdGlvbiBjaGFyc190b19ieXRlcyhhYykge1xuICAgICAgICB2YXIgcmV0dmFsID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJldHZhbCA9IHJldHZhbC5jb25jYXQoc3RyX3RvX2J5dGVzKGFjW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9XG5cblxuICAgIC8vIGNvbnZlcnQgYSA2NCBiaXQgdW5zaWduZWQgbnVtYmVyIHRvIGFycmF5IG9mIGJ5dGVzLiBMaXR0bGUgZW5kaWFuXG4gICAgZnVuY3Rpb24gaW50NjRfdG9fYnl0ZXMobnVtKSB7XG4gICAgICAgIHZhciByZXR2YWwgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgICAgIHJldHZhbC5wdXNoKG51bSAmIDB4RkYpO1xuICAgICAgICAgICAgbnVtID0gbnVtID4+PiA4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR2YWw7XG4gICAgfVxuXG4gICAgLy8gIDMyIGJpdCBsZWZ0LXJvdGF0aW9uXG4gICAgZnVuY3Rpb24gcm9sKG51bSwgcGxhY2VzKSB7XG4gICAgICAgIHJldHVybiAoKG51bSA8PCBwbGFjZXMpICYgMHhGRkZGRkZGRikgfCAobnVtID4+PiAoMzIgLSBwbGFjZXMpKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgNCBNRDUgZnVuY3Rpb25zXG4gICAgZnVuY3Rpb24gZkYoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gKGIgJiBjKSB8ICh+YiAmIGQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZHKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIChkICYgYikgfCAofmQgJiBjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmSChiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiBiIF4gYyBeIGQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkkoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gYyBeIChiIHwgfmQpO1xuICAgIH1cblxuICAgIC8vIHBpY2sgNCBieXRlcyBhdCBzcGVjaWZpZWQgb2Zmc2V0LiBMaXR0bGUtZW5kaWFuIGlzIGFzc3VtZWRcbiAgICBmdW5jdGlvbiBieXRlc190b19pbnQzMihhcnIsIG9mZikge1xuICAgICAgICByZXR1cm4gKGFycltvZmYgKyAzXSA8PCAyNCkgfCAoYXJyW29mZiArIDJdIDw8IDE2KSB8IChhcnJbb2ZmICsgMV0gPDwgOCkgfCAoYXJyW29mZl0pO1xuICAgIH1cblxuICAgIC8qXG4gICAgIENvbnZlciBzdHJpbmcgdG8gYXJyYXkgb2YgYnl0ZXMgaW4gVVRGLTggZW5jb2RpbmdcbiAgICAgU2VlOlxuICAgICBodHRwOi8vd3d3LmRhbmdyb3NzbWFuLmluZm8vMjAwNy8wNS8yNS9oYW5kbGluZy11dGYtOC1pbi1qYXZhc2NyaXB0LXBocC1hbmQtbm9uLXV0ZjgtZGF0YWJhc2VzL1xuICAgICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNDA0MDgvcmVhZGluZy1ieXRlcy1mcm9tLWEtamF2YXNjcmlwdC1zdHJpbmdcbiAgICAgSG93IGFib3V0IGEgU3RyaW5nLmdldEJ5dGVzKDxFTkNPRElORz4pIGZvciBKYXZhc2NyaXB0IT8gSXNuJ3QgaXQgdGltZSB0byBhZGQgaXQ/XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3RyX3RvX2J5dGVzKHN0cikge1xuICAgICAgICAvLyBhbGVydChcImdvdCBcIiArIHN0ci5sZW5ndGggKyBcIiBjaGFyc1wiKVxuICAgICAgICB2YXIgcmV0dmFsID0gWyBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKSB7XG4gICAgICAgICAgICAgICAgcmV0dmFsLnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5jaGFyQXQoaSkpLnN1YnN0cigxKS5zcGxpdCgnJScpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdG1wLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHZhbC5wdXNoKHBhcnNlSW50KHRtcFtqXSwgMHgxMCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9O1xuXG5cblxuXG4gICAgLy8gY29udmVydCB0aGUgNCAzMi1iaXQgYnVmZmVycyB0byBhIDEyOCBiaXQgaGV4IHN0cmluZy4gKExpdHRsZS1lbmRpYW4gaXMgYXNzdW1lZClcbiAgICBmdW5jdGlvbiBpbnQxMjhsZV90b19oZXgoYSwgYiwgYywgZCkge1xuICAgICAgICB2YXIgcmEgPSBcIlwiO1xuICAgICAgICB2YXIgdCA9IDA7XG4gICAgICAgIHZhciB0YSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAzOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdGEgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICB0ID0gKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgKHRhICYgMHhGRik7XG4gICAgICAgICAgICB0YSA9IHRhID4+PiA4O1xuICAgICAgICAgICAgdCA9IHQgPDwgODtcbiAgICAgICAgICAgIHQgPSB0IHwgdGE7XG4gICAgICAgICAgICByYSA9IHJhICsgdG9femVyb2ZpbGxlZF9oZXgodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJhO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlucHV0IGRhdGEgdHlwZSBhbmQgcGVyZm9ybSBjb252ZXJzaW9ucyBpZiBuZWVkZWRcbiAgICB2YXIgZGF0YWJ5dGVzID0gbnVsbDtcbiAgICAvLyBTdHJpbmdcbiAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gY29udmVydCBzdHJpbmcgdG8gYXJyYXkgYnl0ZXNcbiAgICAgICAgZGF0YWJ5dGVzID0gc3RyX3RvX2J5dGVzKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5jb25zdHJ1Y3RvciA9PSBBcnJheSkge1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIGlmIGl0J3MgZW1wdHksIGp1c3QgYXNzdW1lIGFycmF5IG9mIGJ5dGVzXG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBkYXRhO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhWzBdID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBjaGFyc190b19ieXRlcyhkYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVswXSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzID0gZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZmbG9nKFwiaW5wdXQgZGF0YSB0eXBlIG1pc21hdGNoXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBmZmxvZyhcImlucHV0IGRhdGEgdHlwZSBtaXNtYXRjaFwiKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gc2F2ZSBvcmlnaW5hbCBsZW5ndGhcbiAgICB2YXIgb3JnX2xlbiA9IGRhdGFieXRlcy5sZW5ndGg7XG5cbiAgICAvLyBmaXJzdCBhcHBlbmQgdGhlIFwiMVwiICsgN3ggXCIwXCJcbiAgICBkYXRhYnl0ZXMucHVzaCgweDgwKTtcblxuICAgIC8vIGRldGVybWluZSByZXF1aXJlZCBhbW91bnQgb2YgcGFkZGluZ1xuICAgIHZhciB0YWlsID0gZGF0YWJ5dGVzLmxlbmd0aCAlIDY0O1xuICAgIC8vIG5vIHJvb20gZm9yIG1zZyBsZW5ndGg/XG4gICAgaWYgKHRhaWwgPiA1Nikge1xuICAgICAgICAvLyBwYWQgdG8gbmV4dCA1MTIgYml0IGJsb2NrXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgKDY0IC0gdGFpbCk7IGkrKykge1xuICAgICAgICAgICAgZGF0YWJ5dGVzLnB1c2goMHgwKTtcbiAgICAgICAgfVxuICAgICAgICB0YWlsID0gZGF0YWJ5dGVzLmxlbmd0aCAlIDY0O1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgKDU2IC0gdGFpbCk7IGkrKykge1xuICAgICAgICBkYXRhYnl0ZXMucHVzaCgweDApO1xuICAgIH1cbiAgICAvLyBtZXNzYWdlIGxlbmd0aCBpbiBiaXRzIG1vZCA1MTIgc2hvdWxkIG5vdyBiZSA0NDhcbiAgICAvLyBhcHBlbmQgNjQgYml0LCBsaXR0bGUtZW5kaWFuIG9yaWdpbmFsIG1zZyBsZW5ndGggKGluICpiaXRzKiEpXG4gICAgZGF0YWJ5dGVzID0gZGF0YWJ5dGVzLmNvbmNhdChpbnQ2NF90b19ieXRlcyhvcmdfbGVuICogOCkpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSA0eDMyIGJpdCBzdGF0ZVxuICAgIHZhciBoMCA9IDB4Njc0NTIzMDE7XG4gICAgdmFyIGgxID0gMHhFRkNEQUI4OTtcbiAgICB2YXIgaDIgPSAweDk4QkFEQ0ZFO1xuICAgIHZhciBoMyA9IDB4MTAzMjU0NzY7XG5cbiAgICAvLyB0ZW1wIGJ1ZmZlcnNcbiAgICB2YXIgYSA9IDAsXG4gICAgICAgIGIgPSAwLFxuICAgICAgICBjID0gMCxcbiAgICAgICAgZCA9IDA7XG5cblxuICAgIGZ1bmN0aW9uIF9hZGQobjEsIG4yKSB7XG4gICAgICAgIHJldHVybiAweDBGRkZGRkZGRiAmIChuMSArIG4yKVxuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHVwZGF0ZSBwYXJ0aWFsIHN0YXRlIGZvciBlYWNoIHJ1blxuICAgIHZhciB1cGRhdGVSdW4gPSBmdW5jdGlvbihuZiwgc2luMzIsIGR3MzIsIGIzMikge1xuICAgICAgICB2YXIgdGVtcCA9IGQ7XG4gICAgICAgIGQgPSBjO1xuICAgICAgICBjID0gYjtcbiAgICAgICAgLy9iID0gYiArIHJvbChhICsgKG5mICsgKHNpbjMyICsgZHczMikpLCBiMzIpO1xuICAgICAgICBiID0gX2FkZChiLFxuICAgICAgICAgICAgcm9sKFxuICAgICAgICAgICAgICAgIF9hZGQoYSxcbiAgICAgICAgICAgICAgICAgICAgX2FkZChuZiwgX2FkZChzaW4zMiwgZHczMikpXG4gICAgICAgICAgICAgICAgKSwgYjMyXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICAgIGEgPSB0ZW1wO1xuICAgIH07XG5cblxuICAgIC8vIERpZ2VzdCBtZXNzYWdlXG4gICAgZm9yIChpID0gMDsgaSA8IGRhdGFieXRlcy5sZW5ndGggLyA2NDsgaSsrKSB7XG4gICAgICAgIC8vIGluaXRpYWxpemUgcnVuXG4gICAgICAgIGEgPSBoMDtcbiAgICAgICAgYiA9IGgxO1xuICAgICAgICBjID0gaDI7XG4gICAgICAgIGQgPSBoMztcblxuICAgICAgICB2YXIgcHRyID0gaSAqIDY0O1xuXG4gICAgICAgIC8vIGRvIDY0IHJ1bnNcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGQ3NmFhNDc4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZThjN2I3NTYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDI0MjA3MGRiLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhjMWJkY2VlZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGY1N2MwZmFmLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg0Nzg3YzYyYSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGE4MzA0NjEzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmQ0Njk1MDEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg2OTgwOThkOCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4OGI0NGY3YWYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZmZmNWJiMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDg5NWNkN2JlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4NmI5MDExMjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZkOTg3MTkzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YTY3OTQzOGUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg0OWI0MDgyMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGY2MWUyNTYyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGMwNDBiMzQwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyNjVlNWE1MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGU5YjZjN2FhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGQ2MmYxMDVkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyNDQxNDUzLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhkOGExZTY4MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA2MCksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGU3ZDNmYmM4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4MjFlMWNkZTYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGMzMzcwN2Q2LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgOSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhmNGQ1MGQ4NywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxMiksIDE0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDQ1NWExNGVkLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YTllM2U5MDUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGZjZWZhM2Y4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDY3NmYwMmQ5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4OGQyYTRjOGEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmZmZhMzk0MiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyMCksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ODc3MWY2ODEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg2ZDlkNjEyMiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGZkZTUzODBjLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YTRiZWVhNDQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NGJkZWNmYTksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCAxMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhmNmJiNGI2MCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDE2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGJlYmZiYzcwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4Mjg5YjdlYzYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGVhYTEyN2ZhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGQ0ZWYzMDg1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4NDg4MWQwNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGQ5ZDRkMDM5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhlNmRiOTllNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDFmYTI3Y2Y4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YzRhYzU2NjUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDIzKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGY0MjkyMjQ0LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NDMyYWZmOTcsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhhYjk0MjNhNywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZjOTNhMDM5LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NjU1YjU5YzMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDgpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDhmMGNjYzkyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmZlZmY0N2QsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg4NTg0NWRkMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4NmZhODdlNGYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGZlMmNlNmUwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4YTMwMTQzMTQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg0ZTA4MTFhMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDIxKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGY3NTM3ZTgyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDE2KSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhiZDNhZjIzNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0NCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDJhZDdkMmJiLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDgpLCAxNSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhlYjg2ZDM5MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDIxKTtcblxuICAgICAgICAvLyB1cGRhdGUgYnVmZmVyc1xuICAgICAgICBoMCA9IF9hZGQoaDAsIGEpO1xuICAgICAgICBoMSA9IF9hZGQoaDEsIGIpO1xuICAgICAgICBoMiA9IF9hZGQoaDIsIGMpO1xuICAgICAgICBoMyA9IF9hZGQoaDMsIGQpO1xuICAgIH1cbiAgICAvLyBEb25lISBDb252ZXJ0IGJ1ZmZlcnMgdG8gMTI4IGJpdCAoTEUpXG4gICAgcmV0dXJuIGludDEyOGxlX3RvX2hleChoMywgaDIsIGgxLCBoMCkudG9Mb3dlckNhc2UoKTtcbn07XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9JbWFnZV9iYWNrOiBjYy5TcHJpdGUsXG4gICAgICAgIG1fSW1hZ2VfY29sOiBjYy5TcHJpdGUsXG4gICAgICAgIG1fSW1hZ2VfdGl0bGU6IGNjLlNwcml0ZSxcbiAgICAgICAgbV9MYWJlbF9zY29yZUxpbWl0OiBjYy5MYWJlbCxcbiAgICAgICAgcGxhemFBdGFsYXM6IGNjLlNwcml0ZUF0bGFzLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyB2YXIgaW5kZXggPSBwYXJhbXMuaW5kZXg7XG4gICAgICAgIHRoaXMuX2luZGV4ID0gcGFyYW1zLmluZGV4O1xuICAgICAgICAvLyB2YXIgcm9vbUluZm8gPSBwYXJhbXMucm9vbUluZm87XG4gICAgICAgIHRoaXMuX3Jvb21JbmZvID0gcGFyYW1zLnJvb21JbmZvO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfYmFjay5zcHJpdGVGcmFtZSA9IHRoaXMucGxhemFBdGFsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF6YV9pbWFnZV9yb29tX2JhY2tfXCIgKyAodGhpcy5faW5kZXgpKTtcbiAgICAgICAgdGhpcy5tX0ltYWdlX2NvbC5zcHJpdGVGcmFtZSA9IHRoaXMucGxhemFBdGFsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF6YV9pbWFnZV9yb29tX2NvbF9cIiArICh0aGlzLl9pbmRleCkpO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfdGl0bGUuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXphQXRhbGFzLmdldFNwcml0ZUZyYW1lKFwicGxhemFfaW1hZ2Vfcm9vbV9kb3duX1wiICsgKHRoaXMuX2luZGV4KSk7XG4gICAgICAgIGlmICh0aGlzLl9yb29tSW5mbyAmJiB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZSkge1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX3Njb3JlTGltaXQuc3RyaW5nID0gdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFSb29tSXRlbV1bb25DbGlja11cIik7ICBcbiAgICAgICAgaWYoIXRoaXMuX3Jvb21JbmZvKSB7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmiL/pl7TmmoLmnKrlvIDmlL7vvIzor7fnqI3lkI7lho3or5VcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUgPj0gdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUpIHtcbiAgICAgICAgICAgIC8vIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIui/m+WFpeaIv+mXtFwiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkxvZ29uUm9vbVwiLHtyb29tSW5mbzp0aGlzLl9yb29tSW5mb30pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6L+b5YWl5oi/6Ze06ZyA6KaBXCIrIHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlICsgXCLph5HosYYs5oKo55qE6YeR6LGG5LiN6LazLOivt+WFheWAvCFcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzZXR0aW5nVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgdXNlclByb2ZpbGVWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiYW5rVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcFZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHBsYXphUm9vbUl0ZW06IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIG1fSW1hZ2VfdXNlckZhY2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfbmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJHb2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS5pbml0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGxhemEgb25Mb2FkXCIpO1xuICAgICAgICB2YXIgR2FtZUZyYW1lTm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIGlmIChHYW1lRnJhbWVOb2RlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25Mb2FkXSDojrflj5ZHYW1lRnJhbWUg5omA5Zyo6IqC54K5IOW5tuiuvue9ruS4uuW4uOmpu+iKgueCuVwiKTtcbiAgICAgICAgICAgIGNjLmdhbWUuYWRkUGVyc2lzdFJvb3ROb2RlKEdhbWVGcmFtZU5vZGUpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gR2FtZUZyYW1lTm9kZS5nZXRDb21wb25lbnQoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHRoaXMuX2dhbWVGcmFtZSA9IHRoaXMuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKS5nZXRDb21wb25lbnQoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoVUldXCIpO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKEdsb2JhbFVzZXJEYXRhW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9uYW1lLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWU7XG4gICAgICAgIHZhciBmYWNlSUQgPSBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICBpZiAoZmFjZUlEIDw9IDAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuXG4gICAgICAgIHRoaXMucmVmcmVzaFJvb21MaXN0KCk7XG4gICAgfSxcbiAgICByZWZyZXNoUm9vbUxpc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJvb21MaXN0ID0gR2xvYmFsVXNlckRhdGEuZ2V0Um9vbUJ5R2FtZSh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hVSV0gXCIgKyBKU09OLnN0cmluZ2lmeShyb29tTGlzdCkpO1xuICAgICAgICB2YXIgcm9vbUxpc3RQYW5lbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm1fUGFuZWxfY2VudGVyXCIpO1xuICAgICAgICByb29tTGlzdFBhbmVsLnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAzOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxhemFSb29tSXRlbSk7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlBsYXphUm9vbUl0ZW1cIikuaW5pdCh7aW5kZXg6aW5kZXgrMSxyb29tSW5mbzpyb29tTGlzdFtpbmRleF19KTtcbiAgICAgICAgICAgIHJvb21MaXN0UGFuZWwuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlZnJlc2hEYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oekdhbWVVc2VySW5mby5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaERhdGFdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID0gdmFsdWUuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluc3VyZXNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUgPSB2YWx1ZS5pbnN1cmVzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuYWNjb3VudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cyA9IHZhbHVlLmFjY291bnRzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nYW1laWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuZHdHYW1lSUQgPSB2YWx1ZS5nYW1laWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmZhY2VpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gdmFsdWUuZmFjZWlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5nZW5kZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuY2JHZW5kZXIgPSB2YWx1ZS5nZW5kZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmlzZ3Vlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IHZhbHVlLmlzZ3Vlc3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSB2YWx1ZS5uaWNrbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hVSSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoRGF0YV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlTmFtZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkxvZ29uUm9vbScsdGhpcy5vbkxvZ29uUm9vbSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkVuYWJsZV1cIik7XG5cbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VOYW1lU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkJhbmtTdWNjZXNzJyx0aGlzLm9uQmFua1N1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25Mb2dvblJvb20nLHRoaXMub25Mb2dvblJvb20sdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uTG9nb25Sb29tOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25Mb2dvblJvb21dXCIpO1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUub25Mb2dvblJvb20ocGFyYW1zLmRldGFpbC5yb29tSW5mbyk7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB2YXIgZmFjZUlEID0gR2xvYmFsVXNlckRhdGEud0ZhY2VJRDtcbiAgICAgICAgLy8gaWYgKGZhY2VJRCA8PSAwIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoRGF0YSgpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VOYW1lU3VjY2VzczogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpOyAgXG4gICAgfSxcbiAgICBvbkJhbmtTdWNjZXNzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7ICBcbiAgICB9LFxuICAgIG9uQ2xpY2tTZXR0aW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fc2V0dGluZ1ZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ1ZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNldHRpbmdWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9zZXR0aW5nVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fc2V0dGluZ1ZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2V0dGluZ11BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja1VzZXJQcm9maWxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3VzZXJQcm9maWxlVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl91c2VyUHJvZmlsZVZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJQcm9maWxlVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fdXNlclByb2ZpbGVWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl91c2VyUHJvZmlsZVZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tDbGllbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ2xpZW50XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a6i5pyN5Yqf6IO95pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQWN0aXZpdHk6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtjb25DbGlja0FjdGl2aXR5XVwiKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dUb2FzdChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pqC5pyq5byA5pS+LOaVrOivt+acn+W+hSFcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQmFuazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW2NvbkNsaWNrQmFua11cIik7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2JhbmtWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX2JhbmtWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYW5rVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fYmFua1ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX2JhbmtWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0JhbmtdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tTaG9wOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1Nob3BdXCIpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9zaG9wVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9zaG9wVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2hvcFZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3Nob3BWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9zaG9wVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTaG9wXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV93YWl0SWNvbjp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkxvYWRdXCIpO1xuICAgIH0sXG4gICAgb25Jbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV93YWl0aW5nVGV4dCA9IHBhcmFtcy53YWl0aW5nVGV4dCB8fCBcIuato+WcqOi/nuaOpeacjeWKoeWZqO+8jOivt+eojeWAmS4uLlwiO1xuICAgICAgICB0aGlzLm1fd2FpdGluZ1RpbWUgPSBwYXJhbXMud2FpdGluZ1RpbWUgfHwgODtcbiAgICAgICAgdGhpcy5tX2Nsb3NlRXZlbnQgPSBwYXJhbXMuY2xvc2VFdmVudDtcbiAgICAgICAgdGhpcy5tX2NhbGxCYWNrRnVuYyA9IHBhcmFtcy5jYWxsQmFja0Z1bmM7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKHRoaXMubV9jbG9zZUV2ZW50LHRoaXMub25DbG9zZUV2ZW50LHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS5zY2hlZHVsZSh0aGlzLmNsb3NlLCB0aGlzLCB0aGlzLm1fd2FpdGluZ1RpbWUpO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSB0aGlzLm1fd2FpdGluZ1RleHQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV93YWl0SWNvbi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5yb3RhdGVCeSgyLjAsMzYwLjApKSk7XG4gICAgfSxcbiAgICBvbkNsb3NlRXZlbnQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZih0aGlzLm1fY2FsbEJhY2tGdW5jKSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1fY2FsbEJhY2tGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0sXG4gICAgb25FbWl0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJoZWhlXCIpO1xuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZih0aGlzLm1fY2xvc2VFdmVudCx0aGlzLm9uQ2xvc2VFdmVudCx0aGlzKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlICh0aGlzLmNsb3NlLCB0aGlzKTtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiIHJlcXVpcmUoXCJNRDVcIik7XG4gdmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG4gdmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG4gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9lZGl0Ym94X2FjY291bnQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9wYXNzd29yZDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X25hbWU6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF95em06e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IHRoaXMubV9lZGl0Ym94X25hbWUuc3RyaW5nO1xuICAgICAgICB2YXIgc3pNb2JpbGVBdXRoID0gdGhpcy5tX2VkaXRib3hfeXptLnN0cmluZztcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIrc3pBY2NvdW50K1wiICMgXCIrc3pQYXNzd29yZCk7XG4gICAgICAgIGlmIChzekFjY291bnQubGVuZ3RoIDw9MCB8fCBzelBhc3N3b3JkLmxlbmd0aCA8PTAgfHwgc3pOaWNrTmFtZS5sZW5ndGggPD0gMCB8fCBzek1vYmlsZUF1dGgubGVuZ3RoIDw9IDApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLluJDlj7flr4bnoIHnrYnms6jlhozkv6Hmga/kuI3og73kuLrnqbpcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN6UGFzc3dvcmQubGVuZ3RoIDwgNiB8fCBzelBhc3N3b3JkLmxlbmd0aCA+IDE2KXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY1cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8g6YCa6L+H55So5oi35Lit5b+Dd2Vi5o6l5Y+j5rOo5YaM55So5oi3XG4gICAgICAgIHZhciBpc1VzZXJDZW50ZXIgPSB0cnVlO1xuICAgICAgICBpZighaXNVc2VyQ2VudGVyKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25SZWdpc3RlclwiLHtcbiAgICAgICAgICAgICAgICBzekFjY291bnQ6c3pBY2NvdW50LFxuICAgICAgICAgICAgICAgIHN6UGFzc3dvcmQ6c3pQYXNzd29yZCxcbiAgICAgICAgICAgICAgICBzek5pY2tOYW1lOnN6Tmlja05hbWUsXG4gICAgICAgICAgICAgICAgc3pNb2JpbGVBdXRoOnN6TW9iaWxlQXV0aCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgICAgIHVybCArPSBcIi9Vc2VyQ2VudGVyL1VzZXJDZW50ZXJSZWdpc3Rlci5hc2h4XCI7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gJyc7XG4gICAgICAgICAgICB2YXIgbm93VGltZSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIG5vd3RpbWUgc2Vjb25kcyA9IFwiK25vd1RpbWUpO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJ7XFxcIlVzZXJuYW1lXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJQYXNzd29yZFxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6UGFzc3dvcmQpICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTmlja25hbWVcXFwiOlxcXCJcIiArIHN6Tmlja05hbWUgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJEYXRldGFtcFxcXCI6XFxcIlwiICsgbm93VGltZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIC8v55Sf5oiQ562+5ZCNXG4gICAgICAgICAgICB2YXIgc3pTaWduID0gXCJcIjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcIlVzZXJOYW1lPVwiICsgc3pBY2NvdW50O1xuICAgICAgICAgICAgc3pTaWduICs9IFwifERhdGVUYW1wPVwiICsgbm93VGltZTtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxDaGFubmVsSUQ9XCIgKyBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxNb2JpbGU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8Q29kZT1cIiArIHN6TW9iaWxlQXV0aDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIjtcblxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiU2lnblxcXCI6XFxcIlwiICsgY2MubWQ1RW5jb2RlKHN6U2lnbikgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDaGFubmVsSURcXFwiOlxcXCJcIiArIEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTW9iaWxlXFxcIjpcXFwiXCIgKyBzekFjY291bnQgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJNYWNoaW5lTnVtYmVyXFxcIjpcXFwiXCIgKyAnMScgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJDb2RlXFxcIjpcXFwiXCIgKyBzek1vYmlsZUF1dGggKyBcIlxcXCJ9XCI7XG5cbiAgICAgICAgICAgIC8vXCJVc2VyTmFtZT0lc3xEYXRlVGFtcD0lbGxkfENoYW5uZWxJRD0lZHxNb2JpbGU9JXN8Q29kZT0lc3xLZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIlxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgeGhyLnNlbmQocGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGlja1NlbmRCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciByZSA9IC8xWzM1NzhdWzAtOV17OX0vO1xuICAgICAgICBpZiAocmUuZXhlYyhzekFjY291bnQpID09PSBudWxsKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja1NlbmRCdXR0b25dIOaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaJi+acuuWPt+eggeS4jeWQiOazlVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvaHovQ2FwdGNoYU1vYmlsZS5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSBcIk1vYmlsZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrU2VuZEJ1dHRvbl0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1zKTtcblxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hY2NvdW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubV9MYWJlbF9hY2NvdW50LnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHM7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrU3dpdGNoQWNjb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgR2FtZUZyYW1lTm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIGlmIChHYW1lRnJhbWVOb2RlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1NldHRpbmdWaWV3XVtvbkNsaWNrU3dpdGNoQWNjb3VudF0g6I635Y+WR2FtZUZyYW1lIOaJgOWcqOiKgueCuSDlubblj5bmtojkuLrluLjpqbvoioLngrlcIik7XG4gICAgICAgICAgICBjYy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZShHYW1lRnJhbWVOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2Vfc2hvcEl0ZW06IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BJdGVtQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICBfc2hvcElEOiAwLFxuICAgICAgICBfZ29vZHNJRDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHNob3BJRCA9IHBhcmFtcy5zaG9wSUQ7XG4gICAgICAgIHRoaXMuX3Nob3BJRCA9IHNob3BJRDtcbiAgICAgICAgdGhpcy5fZ29vZHNJRCA9IHNob3BJRCAlIDY7XG4gICAgICAgIHRoaXMubV9JbWFnZV9zaG9wSXRlbS5zcHJpdGVGcmFtZSA9IHRoaXMuc2hvcEl0ZW1BdGFscy5nZXRTcHJpdGVGcmFtZShcInNob3BfaWNvbl9cIiArIChzaG9wSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcEl0ZW1dW29uQ2xpY2tdIHNob3BJRCA9IFwiK3RoaXMuX3Nob3BJRCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoJ29uSW5DaGFyZ2UnLHtnb29kc0lEOnRoaXMuX2dvb2RzSUR9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNob3BJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHsgICAgICBcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uTG9hZF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEpKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnNob3BJdGVtTGlzdC5jb250ZW50LnJlbW92ZUFsbENoaWxkcmVuKCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnNob3BJdGVtQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5zaG9wSXRlbVByZWZhYik7XG4gICAgICAgICAgICB2YXIgc2hvcElEO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNPcGVuSUFQKXtcbiAgICAgICAgICAgICAgICBzaG9wSUQgPSBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgc2hvcElEID0gaW5kZXggKyA2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoXCJTaG9wSXRlbVwiKS5pbml0KHtzaG9wSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMuc2hvcEl0ZW1MaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uSW5DaGFyZ2UnLHRoaXMub25JbkNoYXJnZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25JbkNoYXJnZScsdGhpcy5vbkluQ2hhcmdlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uSW5DaGFyZ2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uSW5DaGFyZ2VdXCIpO1xuICAgICAgICB2YXIgZ29vZHNJRCA9IHBhcmFtcy5kZXRhaWwuZ29vZHNJRDtcbiAgICAgICAgdmFyIHNob3BEYXRhQXJyYXkgPSBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YS5zaG9wLmJhc2U7XG4gICAgICAgIGlmIChnb29kc0lEIDwgMCB8fCBnb29kc0lEID49IHNob3BEYXRhQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gc2hvcERhdGFBcnJheSBsZW5ndGggPSBcIiArIHNob3BEYXRhQXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXRlbVZhbCA9IHNob3BEYXRhQXJyYXlbZ29vZHNJRF07XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInByb2R1Y3RpZFwiXSA9IGl0ZW1WYWwuaWQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcbiAgICAgICAgICAgIHBhcmFtc1tcInBheV9hbXRcIl0gPSBpdGVtVmFsLnByaWNlO1xuXG4gICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1BheUluaXQyXzAuYXNoeFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXJsXCJdID0gdXJsO1xuXG4gICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19uYW1lXCJdID0gaXRlbVZhbC5uYW1lO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbnVtXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJyZW1hcmtcIl0gPSBcInpoYWppbmh1YUdhbWVcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25vdGVcIl0gPSBcIumbhue7k+WPt+aLvOS4ieW8oFwiO1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pcFwiXSA9IFwiMTI3LjAuMC4xXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lkZW50aXR5XCJdID0gXCJ1c2VydG9rZW5cIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInBheV90eXBlXCJdID0gXCI4XCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJwcm9kdWN0aWRcIl0gPSBpdGVtVmFsLmlkO1xuICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG5cbiAgICAgICAgICAgIGlmIChHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVApIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5pb3NwcmljZTtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAgICAgICAgIHVybCArPSBcIi9IWk1vYmlsZS9QYXlJbml0Ml8wLmFzaHhcIjtcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmVycm9yY29kZSA9PSAxMDAyNikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiU2hvcENvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgICAgICAgICBjbG9zZUV2ZW50OiBcIlNob3BDb21wbGV0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2tGdW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICAgICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5wcmljZTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG4gICAgfSxcbiAgICBvbkNob29zZVBheXR5cGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uQ2hvb3NlUGF5dHlwZV1cIilcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvQ2hvb3NlUGF5VHlwZVZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIkNob29zZVBheVR5cGVWaWV3XCIpLmluaXQocGFyYW1zKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DaG9vc2VQYXl0eXBlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB9KSAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9jb250ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1RvYXN0Vmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHN6VGV4dCA9IHBhcmFtcy5tZXNzYWdlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY29udGVudC5zdHJpbmcgPSBzelRleHQ7XG4gICAgfVxuXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX3VzZXJGYWNlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICAgICAgX2ZhY2VJRDogMCxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgZmFjZUlEID0gcGFyYW1zLmZhY2VJRDtcbiAgICAgICAgdGhpcy5fZmFjZUlEID0gZmFjZUlEO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQpKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VJdGVtXVtvbkNsaWNrXSBmYWNlSUQgPSBcIit0aGlzLl9mYWNlSUQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KCdvbkNoYW5nZVVzZXJGYWNlJyx7ZmFjZUlEOnRoaXMuX2ZhY2VJRCsxfSk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgdXNlckZhY2VJdGVtUHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUxpc3Q6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TY3JvbGxWaWV3LFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZUNvdW50OiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudXNlckZhY2VDb3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJGYWNlSXRlbVByZWZhYik7XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlVzZXJGYWNlSXRlbVwiKS5pbml0KHtmYWNlSUQ6aW5kZXh9KTtcbiAgICAgICAgICAgIHRoaXMudXNlckZhY2VMaXN0LmNvbnRlbnQuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIHRoaXMuX2ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBKU09OLnN0cmluZ2lmeShwYXJhbXMuZGV0YWlsKSk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlXCIscGFyYW1zLmRldGFpbCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBGYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1VzZXJQcm9maWxlVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiVXNlclByb2ZpbGVWaWV3XCIpLl9mYWNlSUQgPSBGYWNlSUQ7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0J1dHRvbl9jaGFuZ2VOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICB9LFxuICAgICAgICBtX0J1dHRvbl9lZGl0TmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvbixcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X3VzZXJOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VyTmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJHb2xkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlcklEOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fSW1hZ2VfdXNlckZhY2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyRmFjZVZpZXdQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlckJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZUdyb3VwLFxuICAgICAgICB9LFxuICAgICAgICBnZW5kZXJNYW5CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGUsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlcldvbWFuQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlLFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfY29uZmlybVBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X25ld1Bhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9QYW5lbF91c2VyQ2hhbmdlOiBjYy5Ob2RlLFxuICAgICAgICBtX1BhbmVsX3VzZXJJbmZvOiBjYy5Ob2RlLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpO1xuICAgIH0sXG4gICAgcmVmcmVzaFVJOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzek5pY2tOYW1lID0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZTtcbiAgICAgICAgdmFyIGxsR2FtZVNjb3JlID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHZhciBkd1VzZXJJRCA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICB2YXIgY2JHZW5kZXIgPSBHbG9iYWxVc2VyRGF0YS5jYkdlbmRlciB8fCAxO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyR29sZC5zdHJpbmcgPSBsbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJJRC5zdHJpbmcgPSBcIklEOlwiICsgZHdVc2VySUQ7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyTmFtZS5zdHJpbmcgPSBzek5pY2tOYW1lO1xuICAgICAgICBpZiggdGhpcy5fZmFjZUlEICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VVc2VyRmFjZSgpO1xuICAgICAgICAgICAgY2JHZW5kZXIgPSBNYXRoLmZsb29yKCh0aGlzLl9mYWNlSUQgLSAxKS80KSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZhY2VJRCA9IHRoaXMuX2ZhY2VJRCB8fCBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICBpZiAoZmFjZUlEIDw9MCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgICAgICBmYWNlSUQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG4gICAgICAgIGlmIChjYkdlbmRlciA9PSAxKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmRlck1hbkJ1dHRvbi5jaGVjaygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmdlbmRlck1hbkJ1dHRvbi5pc0NoZWNrID0gXCIgKyB0aGlzLmdlbmRlck1hbkJ1dHRvbi5pc0NoZWNrZWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5jaGVjaygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmlzQ2hlY2sgPSBcIiArIHRoaXMuZ2VuZGVyV29tYW5CdXR0b24uaXNDaGVja2VkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmFjZUlEID0gdGhpcy5fZmFjZUlEO1xuICAgICAgICAvLyBpZiAoZmFjZUlEIDw9MCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgIC8vICAgICBmYWNlSUQgPSAxO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIGZhY2VJRCk7XG4gICAgICAgIC8vIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZUZhY2VJZC5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHBhcmFtc1tcImZhY2VJZFwiXSA9IGZhY2VJRDtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIFwiICsgcGFyYW1TdHJpbmcpO1xuXG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tFZGl0TmFtZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnNldEZvY3VzKHRydWUpO1xuICAgICAgICAvLyB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuZW1pdChjYy5FZGl0Qm94LmVkaXRpbmctZGlkLWJlZ2FuKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VOYW1lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHN6TmV3Tmlja05hbWUgPSB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5zdHJpbmc7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIGlmIChzek5ld05pY2tOYW1lLmxlbmd0aCA8PSAwIHx8IHN6TmV3Tmlja05hbWUgPT0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZSl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1VwZGF0ZU5pY2tOYW1lLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1wibmlja25hbWVcIl0gPSBzek5ld05pY2tOYW1lO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDaGFuZ2VOYW1lXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5uaWNrbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3pOaWNrTmFtZSA9IHZhbHVlLm5pY2tuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0xhYmVsX3VzZXJOYW1lLnN0cmluZyA9IHN6Tmlja05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lID0gc3pOaWNrTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZU5hbWVTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NoYW5nZU5hbWVdIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB1c2VyRmFjZVZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJGYWNlVmlld1ByZWZhYik7XG4gICAgICAgIHRoaXMubm9kZS5wYXJlbnQuYWRkQ2hpbGQodXNlckZhY2VWaWV3KTtcbiAgICAgICAgLy8gdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh1c2VyRmFjZVZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrVXNlclByb2ZpbGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VQYXNzd29yZDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJJbmZvLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJDaGFuZ2UuYWN0aXZlID0gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pOZXdQYXNzd29yZCA9IHRoaXMubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgdmFyIHN6Q29uZmlybVBhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgaWYoc3pQYXNzd29yZC5sZW5ndGggPD0gMCB8fCBzek5ld1Bhc3N3b3JkLmxlbmd0aCA8PSAwIHx8IHN6Q29uZmlybVBhc3N3b3JkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDlr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihzelBhc3N3b3JkID09IHN6TmV3UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6Q29uZmlybVBhc3N3b3JkICE9IHN6TmV3UGFzc3dvcmQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6TmV3UGFzc3dvcmQubGVuZ3RoIDwgNiB8fCBzek5ld1Bhc3N3b3JkLmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSDlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZVBhc3NXb3JkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMVwiO1xuICAgICAgICBwYXJhbXNbXCJvbGRwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6UGFzc3dvcmQpO1xuICAgICAgICBwYXJhbXNbXCJuZXdwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGFzc3dvcmQnLCBzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubV9FZGl0Ym94X29yaWdpblBhc3N3b3JkLnN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9QYW5lbF91c2VySW5mby5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckNoYW5nZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlUGFzc3dvcmRTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5tc2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksdmFsdWUubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc3BsYXNoOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgX3N0ZXA6IDAsXG4gICAgICAgIF9jb3VudDogMCxcbiAgICAgICAga0Rlc2lnbkZyYW1lUmF0ZTogNjAuMCxcbiAgICAgICAga1NwbGFzaFN0ZXBMb2dvMVN0aWxsOiAwLFxuICAgICAgICBrU3BsYXNoU3RlcExvZ28xRmFkZU91dDogMSxcbiAgICAgICAga1NwbGFzaEZhZGVUaW1lOiAwLjUsXG4gICAgICAgIGtTcGxhc2hTdGlsbFRpbWU6IDIuMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fc3RlcCA9IDA7XG4gICAgICAgIC8vIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICAvLyB9LCAyKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICB0aGlzLl9jb3VudCArPSBkdDtcbiAgICAgICAgaWYgKHRoaXMuX3N0ZXAgPT09IHRoaXMua1NwbGFzaFN0ZXBMb2dvMVN0aWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLl9jb3VudCA+IHRoaXMua1NwbGFzaFN0aWxsVGltZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RlcCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0ZXAgPT09IHRoaXMua1NwbGFzaFN0ZXBMb2dvMUZhZGVPdXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb3VudCA+IHRoaXMua1NwbGFzaEZhZGVUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsYXNoLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJMb2dpblNjZW5lXCIpO1xuICAgICAgICAgICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBvcCA9IDI1NSAqICgxLjAgLSBNYXRoLnNpbigodGhpcy5fY291bnQvMS4wKSAqIDAuNSAqIE1hdGguUEkpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGFzaC5vcGFjaXR5ID0gb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9