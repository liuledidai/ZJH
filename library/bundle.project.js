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
zjh_cmd.TIME_START_GAME = 20;
// 加注定时器
zjh_cmd.TIME_USER_ADD_SCORE = 25;
// 比牌定时器
zjh_cmd.TIME_USER_COMPARE_CARD = 25;

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
            // console.log("logonframe login error");
        } else if (sub === game_cmd.SUB_GR_LOGON_FINISH) {
            cc.director.loadScene("GameScene");
            console.log("[GameFrame][OnSocketMainLogon] Logon Finish");
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

                cc.director.emit("upDataTableStatus", {
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
        var userItem = this.searchUserByUserID(userScore.dwUserID);
        // if (userScore.dwUserID == myUserItem.dwUserID) {
        if (!userItem) {
            console.log("[GameFrame][OnSocketSubScore] 更新 " + JSON.stringify(userScore));
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
        this._wTableID;
    },
    //获取椅子ID
    getChairID: function getChairID() {
        this._wChairID;
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
},{"BaseFrame":"BaseFrame","CMD_Game":"CMD_Game","CMD_Plaza":"CMD_Plaza","CMD_ZaJinHua":"CMD_ZaJinHua","GameServerItem":"GameServerItem","GameUserItem":"GameUserItem","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData","MD5":"MD5"}],"GameModel":[function(require,module,exports){
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
    },
    onDisable: function onDisable(params) {
        console.log("[GameModel][onDisable]");
        cc.director.off("onEventGameMessage", this.onEventGameMessage, this);
        cc.director.off("onEventGameScene", this.onEventGameScene, this);
        cc.director.off("onEventUserEnter", this.onEventUserEnter, this);
        cc.director.off("onEventUserStatus", this.onEventUserStatus, this);
        cc.director.off("onEventUserScore", this.onEventUserScore, this);
    },
    //初始化游戏数据
    onInitGameEngine: function onInitGameEngine() {
        console.log("[GameModel][onInitGameEngine]");
        this._ClockFun = undefined;
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
    },
    //重置框架
    onResetGameEngine: function onResetGameEngine() {
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
            viewID = (chair + Math.floor(nChairCount * 3 / 2) - nChairID) % nChairCount + 1;
        }
        return viewID;
    },
    //是否合法视图ID
    isValidViewID: function isValidViewID(viewID) {
        var nChairCount = this._gameFrame.getChairCount();
        return viewID > 0 && viewID <= nChairCount;
    },
    //设置计时器
    setGameClock: function setGameClock(chair, id, time) {
        if (!this._ClockFun) {
            var self = this;
            this._ClockFun = cc.director.getScheduler().schedule(this.onClockUpdata, this, 1, false);
        }
        this._ClockChair = chair;
        this._ClockID = id;
        this._ClockTime = time;
        this._ClockViewChair = this.switchViewChairID(chair);
        this.onUpdataClockView();
    },
    //关闭计时器
    killGameClock: function killGameClock(notView) {
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
        if (this._ClockFun) {
            cc.director.getScheduler().unschedule(this.onClockUpdata, this);
            this._ClockFun = undefined;
        }
        if (!notView) {
            this.onUpdataClockView();
        }
    },
    getClockViewID: function getClockViewID() {
        return this._ClockViewChair;
    },
    //计时器更新
    onClockUpdata: function onClockUpdata() {
        if (this._ClockID !== GlobalDef.INVALID_ITEM) {
            this._ClockTime = this._ClockTime - 1;
            var ret = this.onEventGameClockInfo(this._ClockChair, this._ClockTime, this._ClockID);
            if (ret === true || this._ClockTime < 1) {
                this.killGameClock();
            }
        }
        this.onUpdataClockView();
    },
    //更新计时器显示
    onUpdataClockView: function onUpdataClockView() {
        // onUpdataClockView
    },
    //用户状态 
    onEventUserStatus: function onEventUserStatus(params) {
        // params = {userItem:,newStatus,oldStatus,}
        var userItem = params.userItem;
        var newStatus = params.newStatus;
        var oldStatus = params.oldStatus;
        var myTable = this.getMeTableID();
        var myChair = this.getMeChairID();

        if (!myTable || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        //旧的清除
        if (oldStatus.wTableID === myTable) {
            var viewID = this.switchViewChairID(oldStatus.wChairID);
            if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
            }
        }
        //更新新状态
        if (newStatus.wTableID === myTable) {
            var viewID = this.switchViewChairID(newStatus.wChairID);
            if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
            }
        }
    },
    //用户积分
    onEventUserScore: function onEventUserScore(params) {
        // params = {userScore,}
        var userItem = params.userItem;
        var myTable = this.getMeTableID();
        if (!myTable || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        if (myTable === userItem.wTableID) {
            var viewID = this.switchViewChairID(userItem.wChairID);
            if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
            }
        }
    },
    //用户进入
    onEventUserEnter: function onEventUserEnter(params) {
        // params = {wTableID,wChairID,userItem,}
        var wTableID = params.wTableID;
        var wChairID = params.wChairID;
        var userItem = params.userItem;

        var myTable = this.getMeTableID();
        if (!myTable || myTable === GlobalDef.INVALID_TABLE) {
            return;
        }
        if (myTable === wTableID) {
            var viewID = this.switchViewChairID(wChairID);
            if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
                // onUpdateUser
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
cc.Class(_defineProperty({
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

        this.m_bLookCard = [false, false, false, false, false]; //看牌动作

        this.m_wLostUser = GlobalDef.INVALID_CHAIR; //比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR; //胜利用户

        this.m_llAllTableScore = 0;
    },
    onResetGameEngine: function onResetGameEngine() {
        this._super();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR; //当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR; //庄家用户
        this.m_cbPlayStatus = [0, 0, 0, 0, 0]; //游戏状态
        this.m_lTableScore = [0, 0, 0, 0, 0]; //下注数目
        this.m_lMaxCellScore = 0; //单元上限
        this.m_lCellScore = 0; //单元下注
        this.m_lCurrentTimes = 0; //当前倍数
        this.m_lUserMaxScore = 0; //最大分数
        this.m_bLookCard = [false, false, false, false, false]; //看牌动作
        this.m_wLostUser = GlobalDef.INVALID_CHAIR; //比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR; //胜利用户
        this.m_llAllTableScore = 0;
    },
    //设置计时器
    setGameClock: function setGameClock(chair, id, time) {
        this._super();
        var viewID = this.getClockViewID();
        if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
            //时间进度条
            //this.OnEventGameClockInfo(viewID, id);
        }
    },
    //关闭计时器
    killGameClock: function killGameClock(notView) {
        var viewID = this.getClockViewID();
        if (viewID && viewID !== GlobalDef.INVALID_CHAIR) {
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
                    // this.onGiveUp();
                    return true;
                }
            }
        } else if (clockID === zjh_cmd.IDI_USER_COMPARE_CARD) {
            if (time == 0) {
                // this.onAutoCompareCard();
                return true;
            }
        }
    },
    //场景消息
    onEventGameScene: function onEventGameScene(params) {
        // params = {cbGameStatus,pData,}
        var cbGameStatus = params.cbGameStatus;
        var pData = params.pData;
        //初始化已有玩家
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
            if (!userItem) {
                var wViewChairID = this.switchViewChairID(index);
                // OnUpdateUser(wViewChairID,userItem);
                console.log("[GameScene][onEventGameScene] wViewChairID = " + wViewChairID + " userItem = " + JSON.stringify(userItem));
            }
        }
        switch (cbGameStatus) {
            case GlobalDef.GS_FREE:
                //游戏状态
                // struct CMD_S_StatusFree
                // {
                //     LONG								lCellScore;							//基础积分
                // };
                this.m_lCellScore = pData.readint();
                // setCellScore(this.m_lCellScore);
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

            this._eventGameMessageCallback = (_eventGameMessageCall = {}, _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GAME_START, this.onSubGameStart), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_ADD_SCORE, this.onSubAddScore), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_LOOK_CARD, this.onSubLookCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_COMPARE_CARD, this.onSubCompareCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_OPEN_CARD, this.onSubOpenCard), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GIVE_UP, this.onSubGiveUp), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_PLAYER_EXIT, this.onSubPlayerExit), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_GAME_END, this.onSubGameEnd), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_WAIT_COMPARE, function (sub, pData) {
                //等待比牌
                console.log("[GameScene][onEventGameMessage] SUB_S_WAIT_COMPARE");
            }), _defineProperty(_eventGameMessageCall, zjh_cmd.SUB_S_LAST_ADD, this.onSubLastAdd), _eventGameMessageCall);
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
            var status = pData.readbyte();
            gameStart.cbPlayStatus.push(status);
        }

        this.m_lMaxScore = gameStart.lMaxScore;
        this.m_lCellScore = gameStart.lCellScore;
        this.m_lUserMaxScore = gameStart.lUserMaxScore;
        this.m_wCurrentUser = gameStart.m_wCurrentUser;
        this.m_wBankerUser = gameStart.m_wBankerUser;
        this.m_isFirstAdd = true;
        this.m_lCurrentTurn = 0;
        this.m_lCurrentTimes = 1;
        this.m_llAllTableScore = 0;
        this.m_isFllowAlway = false;
        this.m_bLastAddOver = false;
        //显示庄家
        //显示底分
        //显示下注状态
    },
    onSubAddScore: function onSubAddScore(sub, pData) {
        console.log("[GameScene][onSubAddScore]");
    },
    onSubLookCard: function onSubLookCard(sub, pData) {
        console.log("[GameScene][onSubLookCard]");
    },
    onSubCompareCard: function onSubCompareCard(sub, pData) {
        console.log("[GameScene][onSubCompareCard]");
    },
    onSubOpenCard: function onSubOpenCard(sub, pData) {
        console.log("[GameScene][onSubOpenCard]");
    },
    onSubGiveUp: function onSubGiveUp(sub, pData) {
        console.log("[GameScene][onSubGiveUp]");
    },
    onSubPlayerExit: function onSubPlayerExit(sub, pData) {
        console.log("[GameScene][onSubPlayerExit]");
    },
    onSubGameEnd: function onSubGameEnd(sub, pData) {
        console.log("[GameScene][onSubGameEnd]");
    },
    onSubLastAdd: function onSubLastAdd(sub, pData) {
        console.log("[GameScene][onSubLastAdd]");
    },
    onClickMenuOpen: function onClickMenuOpen(toggle) {
        this.m_Panel_menu.active = toggle.isChecked;
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
    onSendAddScore: function onSendAddScore(lCurrentScore) {
        //用户加注
        // struct CMD_C_AddScore
        // {
        //     LONG								lScore;								//加注数目
        //     WORD								wState;								//当前状态
        // };
        var dataBuf = CCmd_Data.create();
        dataBuf.pushint(lCurrentScore);
        dataBuf.pushword(0);
        this.sendData(zjh_cmd.SUB_C_ADD_SCORE, dataBuf);
    }
}, "onSubCompareCard", function onSubCompareCard(params) {}));

cc._RFpop();
},{"CMD_ZaJinHua":"CMD_ZaJinHua","GameModel":"GameModel","GlobalDef":"GlobalDef","GlobalFun":"GlobalFun","GlobalUserData":"GlobalUserData"}],"GameServerItem":[function(require,module,exports){
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
},{}]},{},["GameServerItem","GameUserItem","GlobalDef","GlobalUserData","HelloWorld","MD5","PlazaView","WelcomeView","AlertView","GlobalFun","PopWaitView","ToastView","GameScene","GameModel","CMD_Game","CMD_Plaza","CMD_ZaJinHua","LogonScene","BaseFrame","GameFrame","LogonFrame","LogonView","RegisterView","BankView","ChoosePayTypeView","PlazaRoomItem","SettingView","ShopItem","ShopView","UserFaceItem","UserFaceView","UserProfileView"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9DaG9vc2VQYXlUeXBlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0dhbWVGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvZ2FtZU1vZGVsL0dhbWVNb2RlbC5qcyIsImFzc2V0cy9TY3JpcHQvZ2FtZS9HYW1lU2NlbmUuanMiLCJhc3NldHMvU2NyaXB0L0dhbWVTZXJ2ZXJJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lVXNlckl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L0dsb2JhbERlZi5qcyIsImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvR2xvYmFsRnVuLmpzIiwiYXNzZXRzL1NjcmlwdC9HbG9iYWxVc2VyRGF0YS5qcyIsImFzc2V0cy9TY3JpcHQvSGVsbG9Xb3JsZC5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0xvZ29uRnJhbWUuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL0xvZ29uU2NlbmUuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL2xvZ29uL0xvZ29uVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvTUQ1LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9QbGF6YVJvb21JdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9QbGF6YVZpZXcuanMiLCJhc3NldHMvU2NyaXB0L2V4dGVybmFsL1BvcFdhaXRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9sb2dvbi9SZWdpc3RlclZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1NldHRpbmdWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TaG9wSXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2hvcFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L2V4dGVybmFsL1RvYXN0Vmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlckZhY2VJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyRmFjZVZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJQcm9maWxlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvV2VsY29tZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWFE7O0FBY1o7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQXZDSTs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZTO0FBSWI7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZzQjtBQUkxQjtBQUNJO0FBQ0E7QUFGdUI7QUFJM0I7QUFDSTtBQUNBO0FBRm1CO0FBSXZCO0FBdENROztBQXlDWjtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQVhOO0FBYUE7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBM05JOzs7Ozs7Ozs7O0FDTFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0U7QUFDRDtBQUNEO0FBQ0U7QUFDRDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0U7QUFDRDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0U7QUFFSTtBQUNIOztBQUVEO0FBQ0E7QUFDRDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDSDtBQUNKO0FBR0c7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUVJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7O0FBdkpvQjs7QUEySnpCOzs7Ozs7Ozs7O0FDM0pBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7Ozs7Ozs7Ozs7QUMvYUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNuZkE7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJROztBQWdCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0g7QUEvREk7Ozs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTs7QUFHQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0E7QUFDQTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFBZ0M7O0FBQzVCO0FBT3FEO0FBQzdDO0FBQ0k7QUFDQTtBQUZrQztBQUl6QztBQU1SO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFBbUM7O0FBQy9CO0FBYVE7QUFDQTtBQUNIO0FBRVI7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFwQ1I7QUFzQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFEaUM7QUFHckM7QUFDSjtBQUNJO0FBNUNSO0FBOENIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQTdCUjtBQStCSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUxSO0FBT0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFHQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQztBQUlwQztBQUNKO0FBQ0k7QUFqRFI7QUFtREg7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhnQztBQUt2QztBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBSkE7QUFNSTtBQUNBO0FBQ0g7QUFDRDtBQUpLO0FBTUQ7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBQ0Q7QUFUSztBQVdEO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUM7QUFLeEM7QUFDSjtBQUNEO0FBM0NBO0FBNkNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUVJO0FBQ0k7QUFEZ0M7QUFHdkM7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFockJJOzs7Ozs7Ozs7O0FDVlQ7QUFDQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBR0E7QUFDQTtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBQ0E7QUF4T3FCO0FBZ1B6Qjs7Ozs7Ozs7Ozs7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWlE7O0FBZVo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7O0FBRUk7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFFRztBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUVHO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQXBDUjtBQXNDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFBcUM7O0FBQ2pDO0FBUzBEO0FBQ2xEO0FBQ0g7QUFHUjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBR0c7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBcFRMOzs7Ozs7Ozs7O0FDTEE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBakJSO0FBbUJIO0FBQ0o7QUFwRXlCOztBQXVFOUI7Ozs7Ozs7Ozs7QUN2RUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNKO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBbEJSO0FBb0JIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNZO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUEvTnVCOztBQWtPNUI7Ozs7Ozs7Ozs7QUNuT0E7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVKO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdKOzs7Ozs7Ozs7O0FDekxBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUdZO0FBQ0k7QUFDSDtBQUNKO0FBRVo7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7O0FBRUQ7QUFDQztBQUNBO0FBQ0M7QUFDQTtBQUNFO0FBQ0E7QUFDQztBQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNBO0FBQ0M7QUFDQTtBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUGE7Ozs7Ozs7Ozs7QUMxSGpCO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBL0ZnQjs7QUFrR3JCOzs7Ozs7Ozs7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0k7QUFDQTtBQUZHO0FBSVA7QUFDQTtBQU5RO0FBUVo7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBMUZJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDRTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUNGO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBR0c7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQWpDUjtBQW1DSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFFSDtBQXZOSTs7Ozs7Ozs7OztBQ1JUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRk87QUFJWDtBQUNJO0FBQ0E7QUFGVTtBQWZOOztBQXFCWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTW5EO0FBQ0Q7QUFDRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNEO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0s7QUFDSjtBQUVJO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBeklJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGUTtBQW5CSjs7QUF5Qlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSDtBQTlFSTs7Ozs7Ozs7OztBQ0RUO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOztBQUdEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQVJMO0FBVUg7O0FBS0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDSDs7QUFHRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7Ozs7Ozs7OztBQ2xSRDtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlE7O0FBa0JaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQWxESTs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBM0NQOztBQWlEWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQTNOSTs7Ozs7Ozs7OztBQ0pUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZhO0FBZlQ7O0FBcUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUE5REk7Ozs7Ozs7Ozs7QUNBUjtBQUNBO0FBQ0E7QUFDQTtBQUNHOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZVO0FBdkJOOztBQTZCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSjBCO0FBTWpDO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUF0SUs7Ozs7Ozs7Ozs7QUNIVjtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBekNJOzs7Ozs7Ozs7O0FDRFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNBO0FBcEJROztBQXVCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBM0NLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlk7QUFJaEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQW5CUTs7QUFzQlo7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBbEtJOzs7Ozs7Ozs7O0FDSFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFYVDs7QUFpQlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDs7QUFHRDtBQUNBOztBQUVBO0FBekNLOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjs7QUFuQlE7O0FBdUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBMUNLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBbkJROztBQXNCWjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDSDtBQWpFSTs7Ozs7Ozs7OztBQ0ZUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmlCO0FBSXJCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGWTtBQUloQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZzQjtBQUkxQjtBQUNJO0FBQ0E7QUFGdUI7QUFJM0I7QUFDSTtBQUNBO0FBRm1CO0FBSXZCO0FBQ0E7QUF4RVE7O0FBMkVaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0s7QUFDQTtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBbFNLOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJCUTs7QUF3Qlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBOURJIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hbGVydDogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLmluaXQoe21lc3NhZ2U6XCJ0aGlzIGlzIGp1c3QgdGVzdFwifSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25Mb2FkXVwiKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBwYXJhbXMubWVzc2FnZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2FsZXJ0LnN0cmluZyA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5mYWRlSW4oMC41KSxjYy5kZWxheVRpbWUoMS4wKSxjYy5mYWRlT3V0KDAuNSksY2MucmVtb3ZlU2VsZigpKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EZXN0cm95XSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQWxlcnRWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHJhZGlvQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZVxuICAgICAgICB9LFxuICAgICAgICBwYW5lbEdyb3VwOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfZ2V0X3VzZXJHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9nZXRfYmFua0dvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3NhdmVfdXNlckdvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3NhdmVfYmFua0dvbGQ6IGNjLkxhYmVsLFxuICAgICAgICBtX0VkaXRib3hfZ2V0X2dvbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9nZXRfYmFua1B3ZDogY2MuRWRpdEJveCxcbiAgICAgICAgbV9FZGl0Ym94X3NhdmVfZ29sZDogY2MuRWRpdEJveCxcbiAgICAgICAgbV9FZGl0Ym94X29yaWdpblBhc3N3b3JkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9uZXdQYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIF9zZWxlY3RJbmRleDowLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fTGFiZWxfZ2V0X3VzZXJHb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfc2F2ZV91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2dldF9iYW5rR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfc2F2ZV9iYW5rR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIHJhZGlvQnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24odG9nZ2xlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMucmFkaW9CdXR0b24uaW5kZXhPZih0b2dnbGUpO1xuICAgICAgICB0aGlzLl9zZWxlY3RJbmRleCA9IGluZGV4O1xuICAgICAgICB0b2dnbGUubm9kZS5zZXRMb2NhbFpPcmRlcigxKTtcbiAgICAgICAgdmFyIHRpdGxlID0gXCJSYWRpb0J1dHRvblwiO1xuICAgICAgICBzd2l0Y2goaW5kZXgpIHtcbiAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiMVwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiMlwiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIHRpdGxlICs9IFwiM1wiO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmFkaW9CdXR0b24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5yYWRpb0J1dHRvbltpXTtcbiAgICAgICAgICAgIHZhciBwYW5lbCA9IHRoaXMucGFuZWxHcm91cFtpXTtcbiAgICAgICAgICAgIGlmKGNjLmlzVmFsaWQoZWxlbWVudCkgJiYgY2MuaXNWYWxpZChwYW5lbCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2V0TG9jYWxaT3JkZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubm9kZS5zZXRMb2NhbFpPcmRlcigwKTtcbiAgICAgICAgICAgICAgICAgICAgcGFuZWwuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHRpdGxlKTtcbiAgICAgICAgLy8gdGhpcy5fdXBkYXRlVG9nZ2xlRXZlbnRTdHJpbmcodGl0bGUsIHRoaXMucmFkaW9CdXR0b25FdmVudFN0cmluZywgdG9nZ2xlKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgIC8vIHVybCArPSBcIi9oei9oelVwZGF0ZUZhY2VJZC5hc2h4XCI7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgaWYodGhpcy5fc2VsZWN0SW5kZXggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHN6R29sZENvdW50ID0gdGhpcy5tX0VkaXRib3hfZ2V0X2dvbGQuc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHN6UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9nZXRfYmFua1B3ZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgcmUgPSAvLi87XG4gICAgICAgICAgICBpZihzekdvbGRDb3VudC5sZW5ndGggPD0gMCB8fCBzelBhc3NXb3JkLmxlbmd0aCA8PSAwKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOmHkemineaIluWvhueggeS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLph5Hpop3miJblr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKE51bWJlcihzekdvbGRDb3VudCkgPD0gMCB8fCBOdW1iZXIoc3pHb2xkQ291bnQpID4gKEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUpKXtcbiAgICAgICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOaVsOWAvOS4jeWQiOazleaIlui2heWHuumTtuihjOeahOmHkeminemZkOWItu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rpk7booYznmoTph5Hpop3pmZDliLYhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJzY29yZVwiXSA9IHN6R29sZENvdW50O1xuICAgICAgICAgICAgcGFyYW1zW1wiaW5zdXJlcGFzc1wiXSA9IGNjLm1kNUVuY29kZShzelBhc3NXb3JkKTtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjJcIjtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXNlckJhbmtNb2JpbGUuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3NlbGVjdEluZGV4ID09IDEpIHtcbiAgICAgICAgICAgIHZhciBzekdvbGRDb3VudCA9IHRoaXMubV9FZGl0Ym94X3NhdmVfZ29sZC5zdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3pHb2xkQ291bnQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOmHkemineS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLph5Hpop3kuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoTnVtYmVyKHN6R29sZENvdW50KSA8PSAwIHx8IE51bWJlcihzekdvbGRDb3VudCkgPiBOdW1iZXIoR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUpKXtcbiAgICAgICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOaVsOWAvOS4jeWQiOazleaIlui2heWHuui6q+S4iumHkemine+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rouqvkuIrph5Hpop3vvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyYW1zW1widXNlcmlkXCJdID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJzY29yZVwiXSA9IHN6R29sZENvdW50O1xuICAgICAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMVwiO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVc2VyQmFua01vYmlsZS5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0aGlzLl9zZWxlY3RJbmRleCA9PSAyKSB7XG4gICAgICAgICAgICB2YXIgc3pQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X29yaWdpblBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzek5ld1Bhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHN6Q29uZmlybVBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfY29uZmlybVBhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIGlmIChzelBhc3NXb3JkLmxlbmd0aCA8PSAwIHx8IHN6TmV3UGFzc1dvcmQubGVuZ3RoIDw9IDAgfHwgc3pDb25maXJtUGFzc1dvcmQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOWvhueggeS4jeiDveS4uuepuu+8gVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3pQYXNzV29yZCA9PSBzek5ld1Bhc3NXb3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3pDb25maXJtUGFzc1dvcmQgIT0gc3pOZXdQYXNzV29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLnoa7orqTlr4bnoIHkuI3kuIDoh7QhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6TmV3UGFzc1dvcmQubGVuZ3RoIDwgNiB8fCBzek5ld1Bhc3NXb3JkLmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHplb/luqbkuLo2LTE25L2NIVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1widHlwZVwiXSA9IFwiMlwiO1xuICAgICAgICAgICAgcGFyYW1zW1wib2xkcGFzc1wiXSA9IGNjLm1kNUVuY29kZShzelBhc3NXb3JkKTtcbiAgICAgICAgICAgIHBhcmFtc1tcIm5ld3Bhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzV29yZCk7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVwZGF0ZVBhc3NXb3JkLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlID0gdmFsdWUuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmluc3VyZXNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmxsSW5zdXJlU2NvcmUgPSB2YWx1ZS5pbnN1cmVzY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25CYW5rU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH0sXG4gICAgb25DbGlja1NhdmVBbGw6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfc2F2ZV9nb2xkLnN0cmluZyA9IEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlO1xuICAgIH0sXG4gICAgb25DbGlja0dldEFsbDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fRWRpdGJveF9nZXRfZ29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLl92aWV3RnJhbWUgPSB2aWV3O1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZSBvbkxvYWRcIik7XG4gICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICB9LFxuICAgIC8vIG5hbWU6IFwiQmFzZUZyYW1lXCIsXG4gICAgLy8gY3RvcjogZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgLy8gdGhpcy5fdmlld0ZyYW1lID0gdmlldztcbiAgICAvLyAgICAgdGhpcy5fdGhyZWFkaWQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMuX3NvY2tldCA9IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgLy8gdGhpcy5fY2FsbEJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgXG4gICAgLy8gICAgIHRoaXMuX2dhbWVGcmFtZSA9IHVuZGVmaW5lZDtcbiAgICAvLyAgICAgdGhpcy5tX3RhYkNhY2hlTXNnID0ge307XG4gICAgICAgIFxuICAgIC8vIH0sXG4gICAgc2V0Q2FsbEJhY2s6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7ICBcbiAgICB9LFxuICAgIHNldFZpZXdGcmFtZTogZnVuY3Rpb24odmlld0ZyYW1lKXtcbiAgICAgIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXdGcmFtZTsgIFxuICAgIH0sXG4gICAgc2V0U29ja2V0RXZlbnQ6IGZ1bmN0aW9uKHNvY2tldEV2ZW50KXtcbiAgICAgICAgdGhpcy5fc29ja2V0RXZlbnQgPSBzb2NrZXRFdmVudDtcbiAgICB9LFxuICAgIGdldFZpZXdGcmFtZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLl92aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIGlzU29ja2V0U2VydmVyOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fdGhyZWFkaWQgIT09IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIG9uU29ja2V0RXJyb3I6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgIGlmKHRoaXMuX3RocmVhZGlkID09PSB1bmRlZmluZWQpXG4gICAgICB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgLy90b2RvLi4uXG4gICAgfSxcbiAgICBvbkNyZWF0ZVNvY2tldDogZnVuY3Rpb24oc3pVcmwsblBvcnQpe1xuICAgICAgICBpZih0aGlzLl9zb2NrZXQgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N6U2VydmVyVXJsID0gc3pVcmw7XG4gICAgICAgIHRoaXMuX25TZXJ2ZXJQb3J0ID0gblBvcnQ7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5fU29ja2V0RnVuID0gZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gQ2xpZW50U29ja2V0LmNyZWF0ZVNvY2tldCh0aGlzLl9Tb2NrZXRGdW4pO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUpO1xuICAgICAgICBpZih0aGlzLl9zb2NrZXQuQ29ubmVjdFNvY2tldCh0aGlzLl9zelNlcnZlclVybCx0aGlzLl9uU2VydmVyUG9ydCkgPT09IHRydWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbkNyZWF0ZVNvY2tldCBjbG9zZVwiKTtcbiAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblNvY2tldENhbGxCYWNrOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmKHBEYXRhID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZih0aGlzLl9jYWxsQmFjayA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnbm8gY2FsbGJhY2snKTtcbiAgICAgICAgLy8gICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIHZhciBtYWluID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICB2YXIgc3ViID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib25Tb2NrZXRDYWxsQmFjayBtYWluOiBcIiArIG1haW4gKyBcIiAjc3ViOiBcIitzdWIpO1xuICAgICAgICBpZihtYWluID09PSAwKSBcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoc3ViID09PSAwKSBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RDb21wZWxldGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNvY2tldEVycm9yKHBEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFdmVudChtYWluLCBzdWIsIHBEYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZVNvY2tldDogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldC5yZWxlYXNlU29ja2V0KCk7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fdGhyZWFkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fU29ja2V0RnVuID0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgc2VuZFNvY2tldERhdGE6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc29ja2V0LnNlbmRTb2NrZXREYXRhKHBEYXRhKTtcbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uQ29ubmVjdENvbXBlbGV0ZWRcIik7XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uU29ja2V0RXZlbnRfXCIrbWFpbitcIi1cIitzdWIpO1xuICAgIH0sXG4gICAgb25HYW1lU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWVfb25HYW1lU29ja2V0RXZlbnRfXCIrbWFpbitcIi1cIitzdWIpO1xuICAgIH0sXG4gICAgXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlRnJhbWU7IiwidmFyIGdhbWVfY21kID0ge307XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eZu+W9leaVsOaNruWMheWumuS5iVxuXG5nYW1lX2NtZC5NRE1fR1JfTE9HT04gPSAxMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7TnmbvlvZVcblxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0FDQ09VTlRTID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDmiLfnmbvlvZVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9VU0VSSUQgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0kgRCDnmbvlvZVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9NT0JJTEUgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhlxuXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fU1VDQ0VTUyA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5oiQ5YqfXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fRVJST1IgPSA2MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leWksei0pVxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0ZJTklTSCA9IDYwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5a6M5oiQXG5cbi8vIC8v5oi/6Ze05biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlBY2NvdW50c1xuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UHJvY2Vzc1ZlcnNpb247ICAgICAgICAgICAgICAgICAgIC8v6L+b56iL54mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIH07XG5cbi8vIC8v5omL5py655m76ZmGXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uQnlVc2VySURNb2JpbGVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmNyeXB0SUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvZGVDaGVja0lEOyAgICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIEyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1dlaVhpbkNoZWNrSUQ7ICAgICAgICAgICAgICAgICAgICAvL+W+ruS/oemqjOivgeeggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcFZlcnNpb247ICAgICAgICAgICAgICAgICAvL+a4uOaIj0FQUOeJiOacrOWPtyjkuI7nmbvpmYblpKfljoXnm7jlkIwpXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07ICAgLy/mnLrlmajluo/liJflj7dcbi8vIH07XG5cbi8vIC8v5oi/6Ze0IElEIOeZu+W9lVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklEXG4vLyB7XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1Byb2Nlc3NWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAvL+i/m+eoi+eJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIH07XG5cbi8vIC8v55m75b2V5oiQ5Yqf5raI5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uU3VjY2Vzc1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLyAvL+eZu+W9leWksei0pVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkVycm9yXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsRXJyb3JDb2RlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUmeivr+S7o+eggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAgICAgLy/plJnor6/mtojmga9cbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+eUqOaIt+aVsOaNruWMheWumuS5iVxuXG5nYW1lX2NtZC5NRE1fR1JfVVNFUiA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NJVF9SRVEgPSAxMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTE9PS09OX1JFUSA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peB6KeC6K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFORFVQX1JFUSA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LW356uL6K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9MRUZUX0dBTUVfUkVRID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nprvlvIDmuLjmiI9cblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ09NRSA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36L+b5YWlXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFUVVMgPSA2MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU0NPUkUgPSA2MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuZ2FtZV9jbWQuU1VCX0dSX1NJVF9GQUlMRUQgPSA2MDMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WdkOS4i+Wksei0pVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUklHSFQgPSA2MDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+adg+mZkFxuZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9PUkRFUiA9IDYwNSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG5nYW1lX2NtZC5TVUJfR1JfUVVFUllfR09MRCA9IDYwNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6YeR6LGGXG5nYW1lX2NtZC5TVUJfR1JfUVVFUllfVFJBTiA9IDYwNyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i6L2s5biQXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0NIQVQgPSA3MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iBiuWkqea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfV0lTUEVSID0gNzAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np4Hor63mtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1JVTEUgPSA3MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+inhOWImVxuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9JTlZJVEUgPSA4MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCgOivt+a2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFX1JFUSA9IDgwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YKA6K+36K+35rGCXG5nYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWSA9IDgwMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCB5p+l6K+iXG5nYW1lX2NtZC5TVUJfR1JfUFJFU0VOVF9FUlJPUiA9IDgwM1xuXG4vLyAvL+S8muWRmOetiee6p1xuLy8gc3RydWN0IENNRF9HUl9NZW1iZXJPcmRlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlbDmja7lupMgSURcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyT3JkZXI7ICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+adg+mZkFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUmlnaHRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJSaWdodDsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+adg+mZkFxuLy8gfTtcblxuLy8gLy/nlKjmiLfnirbmgIFcbi8vIHN0cnVjdCBDTURfR1JfVXNlclN0YXR1c1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkvY3nva5cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlVzZXJTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbi8vIH07XG5cbi8vIC8v55So5oi35YiG5pWwXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTY29yZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbExvdmVsaW5lc3M7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfprYXliptcbi8vICAgICAvL0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgIGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5raI6LS56YeR6LGGXG4vLyAgICAgLy9MT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZUdvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgdGFnVXNlclNjb3JlICAgICAgICAgICAgICAgICAgICBVc2VyU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+enr+WIhuS/oeaBr1xuLy8gfTtcblxuLy8gLy9zdHJ1Y3Qgb25lVHJhblJlY29yZFxuLy8gLy97XG4vLyAvLyAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07XG4vLyAvLyAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUb1VzZXJJRDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRvQWNjb3VudHNbTkFNRV9MRU5dO1xuLy8gLy8gIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5nb2xkO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5EYXRhWzE1XTtcbi8vIC8vXG4vLyAvL307XG5cbi8vIC8v5p+l6K+i57uT5p6cIHdzbCAyMDE1LjQuMVxuLy8gc3RydWN0IG9uZVRyYW5SZWNvcmRcbi8vIHtcbi8vICAgICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RyYW5HYW1lSUQ7ICAgICAgICAgICAgICAgICAvL+i9rOW4kOa4uOaIj0lEXG4vLyAgICAgLy9UQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUcmFuR2FtZUlEWzMxXTsgICAgICAgICAgICAgICAgLy/ovazluJDmuLjmiI9JRFxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblR5cGVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/ovazluJDnsbvlnotcbi8vICAgICAvL0xPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsUHJlc2VudFZhbHVlOyAgICAgICAgICAgICAgICAgIC8v6LWg6YCB6YeR6LGGXG4vLyAgICAgLy9UQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUcmFuVGltZVsyMF07ICAgICAgICAgICAgICAgICAvL+i9rOW4kOaXtumXtFxuICAgIFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAvL+eUqOaIt+aYteensFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt0lEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3VudDsgICAgICAgICAgICAgICAgICAgIC8v5pWw6YePXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pGbG93ZXJOYW1lWzMyXTsgICAgICAgICAgIC8v56S854mp5ZCN56ewXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUcmFuVHlwZVtOQU1FX0xFTl07ICAgICAgIC8v6L2s5biQ57G75Z6LXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1RyYW5Hb2xkUmVjb3JkUlxuLy8ge1xuLy8gICAgIEJZVEUgICAgbnVtOy8v5pyJ5Yeg5p2h6KGoXG4vLyAgICAgb25lVHJhblJlY29yZCAgIG9uZXRyYW5yZWNvcmRbMTBdOy8v5pyA5aSa5Y2B5p2h6K6w5b2V5LiA5Y+RXG4vLyB9O1xuXG4vLyAvLy8vL+eUqOaIt+afpeivoumHkeixhue7k+aenCAyMDExLjcuMTUgYnkgZ2Fvc2hhblxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUXVpQmFua2VyXG4vLyB7XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgICAvL+mTtuihjOmHkeixhlxuLy8gICAgIENNRF9HUF9UcmFuR29sZFJlY29yZFIgICAgICAgICAgICAgIFRyYW5SZWNvcmQ7XG4vLyB9O1xuXG4vLyAvL+ivt+axguWdkOS4i1xuLy8gc3RydWN0IENNRF9HUl9Vc2VyU2l0UmVxXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlBhc3NMZW47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvhueggemVv+W6plxuLy8gICAgIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgZHdBbnN3ZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lm57nrZQgSSBELy/lhbzlrrnnp6/liIbmuLjmiI/lhaXluqfpl67pophcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS9jee9rlxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUYWJsZVBhc3NbUEFTU19MRU5dOyAgICAgICAgICAgICAgLy/moYzlrZDlr4bnoIFcbi8vIH07XG5cbi8vIC8v6YKA6K+355So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJJbnZpdGVSZXFcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vIH07XG5cbi8vIC8v5Z2Q5LiL5aSx6LSlXG4vLyBzdHJ1Y3QgQ01EX0dSX1NpdEZhaWxlZFxuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pGYWlsZWREZXNjcmliZVsyNTZdOyAgICAgICAgICAgICAgLy/plJnor6/mj4/ov7Bcbi8vIH07XG5cbi8vIC8v6IGK5aSp57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJDaGF0XG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIENPTE9SUkVGICAgICAgICAgICAgICAgICAgICAgICAgY3JGb250Q29sb3I7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/popzoibJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3U2VuZFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB55So5oi3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDaGF0TWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgICAgLy/ogYrlpKnkv6Hmga9cbi8vIH07XG5cbi8vIC8v56eB6K+t57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dSX1dpc3BlclxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBDT0xPUlJFRiAgICAgICAgICAgICAgICAgICAgICAgIGNyRm9udENvbG9yOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6aKc6ImyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1NlbmRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeeUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q2hhdE1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAgIC8v6IGK5aSp5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+inhOWImVxuLy8gc3RydWN0IENNRF9HUl9Vc2VyUnVsZVxuLy8ge1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBhc3N3b3JkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7lr4bnoIFcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdFdpbjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26IOc546HXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRGbGVlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuaWree6v1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbliIbmlbBcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJDaGVja1NhbWVJUDsgICAgICAgICAgICAgICAgICAgICAgIC8v5pWI6aqM5Zyw5Z2AXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3V2luUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuiDnOeOh1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZsZWVSYXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbpgIPot5Fcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA6auY5YiG5pWwXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsTGVzc1Njb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOS9juWIhuaVsFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzd29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/moYzlrZDlr4bnoIFcbi8vIH07XG5cbi8vIC8v6YKA6K+355So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJJbnZpdGVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+mFjee9ruS/oeaBr+aVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfSU5GTyA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTyA9IDkwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze06YWN572uXG5nYW1lX2NtZC5TVUJfR1JfT1JERVJfSU5GTyA9IDkwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfTUVNQkVSX0lORk8gPSA5MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPID0gOTAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajphY3nva5cbmdhbWVfY21kLlNVQl9HUl9DT05GSUdfRklOSVNIID0gOTA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/phY3nva7lrozmiJBcblxuLy8gLy/muLjmiI/miL/pl7Tkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfU2VydmVySW5mb1xuLy8ge1xuLy8gICAgIC8v5oi/6Ze05bGe5oCnXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0dhbWVHZW5yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nsbvlnotcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3S2luZElEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+WeiyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VmlkZW9BZGRyOyAgICAgICAgICAgICAgICAgICAgICAgIC8v6KeG6aKR5Zyw5Z2AXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkhpZGVVc2VySW5mbzsgICAgICAgICAgICAgICAgICAgICAvL+makOiXj+S/oeaBr1xuLy8gfTtcblxuLy8gLy/liIbmlbDmj4/ov7Dkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfU2NvcmVJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RGVzY3JpYmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAvL+aPj+i/sOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0RhdGFEZXNjcmliZVsxNl07ICAgICAgICAgICAgICAgICAgLy/mlbDmja7moIflv5dcbi8vIH07XG5cbi8vIC8v562J57qn5o+P6L+w57uT5p6EXG4vLyBzdHJ1Y3QgdGFnT3JkZXJJdGVtXG4vLyB7XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+enr+WIhlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd09yZGVyRGVzY3JpYmVbMTZdOyAgICAgICAgICAgICAgICAgLy/nrYnnuqfmj4/ov7Bcbi8vIH07XG5cbi8vIC8v562J57qn5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX09yZGVySW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd09yZGVyQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfmlbDnm65cbi8vICAgICB0YWdPcmRlckl0ZW0gICAgICAgICAgICAgICAgICAgIE9yZGVySXRlbVsxMjhdOyAgICAgICAgICAgICAgICAgICAgIC8v562J57qn5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+WIl+ihqOmhueaPj+i/sOe7k+aehFxuLy8gc3RydWN0IHRhZ0NvbHVtbkl0ZW1cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2x1bW5XaWR0aDsgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5a695bqmXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RGF0YURlc2NyaWJlOyAgICAgICAgICAgICAgICAgICAgICAvL+Wtl+auteexu+Wei1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDb2x1bW5OYW1lWzE2XTsgICAgICAgICAgICAgICAgICAgLy/liJfooajlkI3lrZdcbi8vIH07XG5cbi8vIC8v5YiX6KGo5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX0NvbHVtbkluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2x1bW5Db3VudDsgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5pWw55uuXG4vLyAgICAgdGFnQ29sdW1uSXRlbSAgICAgICAgICAgICAgICAgICBDb2x1bW5JdGVtWzMyXTsgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOaPj+i/sFxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5oi/6Ze054q25oCB5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TVEFUVVMgPSA0NCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eKtuaAgeS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfVEFCTEVfSU5GTyA9IDYwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L+h5oGvXG5nYW1lX2NtZC5TVUJfR1JfVEFCTEVfU1RBVFVTID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIFcblxuLy8gLy/moYzlrZDnirbmgIHnu5PmnoRcbi8vIHN0cnVjdCB0YWdUYWJsZVN0YXR1c1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBsYXlTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJUYWJsZUxvY2s7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a54q25oCBXG4vLyB9O1xuXG4vLyAvL+ahjOWtkOeKtuaAgeaVsOe7hFxuLy8gc3RydWN0IENNRF9HUl9UYWJsZUluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5pWw55uuXG4vLyAgICAgdGFnVGFibGVTdGF0dXMgICAgICAgICAgICAgICAgICBUYWJsZVN0YXR1c1s1MTJdOyAgICAgICAgICAgICAgICAgICAvL+eKtuaAgeaVsOe7hFxuLy8gfTtcblxuLy8gLy/moYzlrZDnirbmgIHkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1JfVGFibGVTdGF0dXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJUYWJsZUxvY2s7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZSB5a6a54q25oCBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiUGxheVN0YXR1czsgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eKtuaAgVxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+euoeeQhuaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfTUFOQUdFUiA9IDU1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5ZG95LukXG5cbmdhbWVfY21kLlNVQl9HUl9TRU5EX1dBUk5JTkcgPSAxMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeitpuWRilxuZ2FtZV9jbWQuU1VCX0dSX1NFTkRfTUVTU0FHRSA9IDIyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfTE9PS19VU0VSX0lQID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6XnnIvlnLDlnYBcbmdhbWVfY21kLlNVQl9HUl9LSUxMX1VTRVIgPSA0NCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i4ouWHuueUqOaIt1xuZ2FtZV9jbWQuU1VCX0dSX0xJTUlUX0FDQ09VTlMgPSA1NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emgeeUqOW4kOaIt1xuZ2FtZV9jbWQuU1VCX0dSX1NFVF9VU0VSX1JJR0hUID0gNjYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnYPpmZDorr7nva5cbmdhbWVfY21kLlNVQl9HUl9PUFRJT05fU0VSVkVSID0gNzcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7Torr7nva5cblxuLy8gLy/lj5HpgIHorablkYpcbi8vIHN0cnVjdCBDTURfR1JfU2VuZFdhcm5pbmdcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pXYXJuaW5nTWVzc2FnZVtNQVhfQ0hBVF9MRU5dOyAgICAgLy/orablkYrmtojmga9cbi8vIH07XG5cbi8vIC8v57O757uf5raI5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlbmRNZXNzYWdlXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdhbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+a2iOaBr1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JSb29tOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzelN5c3RlbU1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAvL+ezu+e7n+a2iOaBr1xuLy8gfTtcblxuLy8gLy/mn6XnnIvlnLDlnYBcbi8vIHN0cnVjdCBDTURfR1JfTG9va1VzZXJJUFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v6Lii5Ye655So5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX0tpbGxVc2VyXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RhcmdldFVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAvL+ebruagh+eUqOaIt1xuLy8gfTtcblxuLy8gLy/npoHnlKjluJDmiLdcbi8vIHN0cnVjdCBDTURfR1JfTGltaXRBY2NvdW50c1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v5p2D6ZmQ6K6+572uXG4vLyBzdHJ1Y3QgQ01EX0dSX1NldFVzZXJSaWdodFxuLy8ge1xuLy8gICAgIC8v57uR5a6a5Y+Y6YePXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkFjY291bnRzUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+adg+mZkFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHYW1lUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fmnYPpmZBcbi8vICAgICAvL+ebruagh+eUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRSb29tQ2hhdDsgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F6IGK5aSpXG4vLyAgICAgLy/mnYPpmZDlj5jljJZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRMb29rb25HYW1lOyAgICAgICAgICAgICAgICAgIC8v5peB6KeC5p2D6ZmQXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0R2FtZUNoYXQ7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+iBiuWkqVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdFNlbmRXaXNwZXI7ICAgICAgICAgICAgICAgICAgLy/lj5HpgIHmtojmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRQbGF5R2FtZTsgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5p2D6ZmQXG4vLyB9O1xuXG4vL+iuvue9ruagh+W/l1xuZ2FtZV9jbWQuT1NGX1JPT01fQ0hBVCA9IDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F6IGK5aSpXG5nYW1lX2NtZC5PU0ZfR0FNRV9DSEFUID0gMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ogYrlpKlcbmdhbWVfY21kLk9TRl9ST09NX1dJU1BFUiA9IDMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F56eB6IGKXG5nYW1lX2NtZC5PU0ZfRU5URVJfR0FNRSA9IDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+b5YWl5ri45oiPXG5nYW1lX2NtZC5PU0ZfRU5URVJfUk9PTSA9IDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6L+b5YWl5oi/6Ze0XG5nYW1lX2NtZC5PU0ZfU0hBTExfQ0xPU0UgPSA2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WNs+WwhuWFs+mXrVxuXG4vLyAvL+aIv+mXtOiuvue9rlxuLy8gc3RydWN0IENNRF9HUl9PcHRpb25TZXJ2ZXJcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiT3B0aW9uRmxhZ3M7ICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5qCH5b+XXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk9wdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruagh+W/l1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v57O757uf5pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TWVNURU0gPSA2NiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+S/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfTUVTU0FHRSA9IDIwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5raI5oGvXG5cbi8v5raI5oGv57G75Z6LXG5nYW1lX2NtZC5TTVRfSU5GTyA9IDB4MDAwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG5nYW1lX2NtZC5TTVRfRUpFQ1QgPSAweDAwMDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xuZ2FtZV9jbWQuU01UX0dMT0JBTCA9IDB4MDAwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWo5bGA5raI5oGvXG5nYW1lX2NtZC5TTVRfU0NPUkVfTk9URU5PVUdIID0gMHgwMDA4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ph5HluIHkuI3lpJ9cbmdhbWVfY21kLlNNVF9DTE9TRV9ST09NID0gMHgxMDAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63miL/pl7RcbmdhbWVfY21kLlNNVF9JTlRFUk1JVF9MSU5FID0gMHg0MDAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuK3mlq3ov57mjqVcblxuLy8gLy/mtojmga/mlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfR1JfTWVzc2FnZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd01lc3NhZ2VUeXBlOyAgICAgICAgICAgICAgICAgICAgICAgLy/mtojmga/nsbvlnotcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNZXNzYWdlTGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv6ZW/5bqmXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNvbnRlbnRbMTAyNF07ICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+WGheWuuVxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5oi/6Ze05pWw5o2u5YyFXG5cbmdhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GTyA9IDc3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG5cbmdhbWVfY21kLlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GTyA9IDEwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zyo57q/5L+h5oGvXG5cbi8vIC8v5Lq65pWw5L+h5oGvXG4vLyBzdHJ1Y3QgdGFnT25MaW5lQ291bnRJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3S2luZElEOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+Wei+agh+ivhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdPbkxpbmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgLy/lnKjnur/kurrmlbBcbi8vIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lX2NtZDsiLCJ2YXIgcGxhemFfY21kID0ge307XG5cbi8v5bm/5Zy654mI5pysXG5wbGF6YV9jbWQuVkVSX1BMQVpBX0xPVyA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG5wbGF6YV9jbWQuVkVSX1BMQVpBX0hJR0ggPSAxNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gcGxhemFfY21kLlZFUl9QTEFaQV9GUkFNRSA9IE1BS0VMT05HOyhWRVJfUExBWkFfTE9XLFZFUl9QTEFaQV9ISUdIKVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXplJnor6/moIfor4ZcblxucGxhemFfY21kLkVSQ19HUF9MT0dPTl9TVUNDRVNTID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvpmYbmiJDlip9cbnBsYXphX2NtZC5FUkNfR1BfQUNDT1VOVFNfTk9UX0VYSVNUID0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fkuI3lrZjlnKhcbnBsYXphX2NtZC5FUkNfR1BfTE9OR19OVUxMSVRZID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npoHmraLnmbvlvZVcbnBsYXphX2NtZC5FUkNfR1BfUEFTU1dPUkRfRVJDT1IgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvhueggemUmeivr1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXlkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9MT0dPTiA9IDEzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy655m75b2VXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fQUNDT1VOVFMgPSAzMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W4kOWPt+eZu+W9lVxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9VU0VSSUQgPSAzMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0kgRCDnmbvlvZVcbnBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfQUNDT1VOVFMgPSAzMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+azqOWGjOW4kOWPt1xucGxhemFfY21kLlNVQl9HUF9VUExPQURfQ1VTVE9NX0ZBQ0UgPSAzMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WumuS5ieWktOWDj1xucGxhemFfY21kLlNVQl9HUF9MT0dPTl9SRUNPUkQgPSAzMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WumuS5ieWktOWDj1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5wbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSA9IDE1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py65bm/5Zy655m75b2VXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fTU9CSUxFID0gMTUwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYZcbnBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfTU9CSUxFID0gMTUxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrms6jlhoxcblxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9TVUNDRVNTX01PQklMRSA9IDI2MDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmG5oiQ5YqfXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0VSUk9SX01PQklMRSA9IDI2MTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmG5aSx6LSlXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0ZJTklTSF9NT0JJTEUgPSAyNjI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuWujOaIkFxuXG4vLyAvL+W4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkJ5QWNjb3VudHNNb2JpbGVcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuV2VpWGluQXV0aElEOyAgICAgICAgICAgICAgICAgIC8v5b6u5L+h6aqM6K+BIC8v5YW85a655L2/55SoPjEwMDB35omr56CB55m76ZmGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBLaW5kOyAgICAgICAgICAgICAgICAvL+aJi+acukFQUOa4uOaIj0lEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAvL+aJi+acukFQUOeJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbi8vIH07XG4vLyAvL+azqOWGjOW4kOWPt1xuLy8gc3RydWN0IENNRF9HUF9SZWdpc3RlckFjY291bnRzTW9ibGllXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpLTlg4/moIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt+aAp+WIq1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZTsgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwS2luZDsgICAgICAgICAgICAgICAgLy8g5bm/5Zy65omL5py654mI5pysXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAvLyDlub/lnLrmiYvmnLrniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8vIOeZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy8g55m75b2V5a+G56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVwaG9uZVtNT0JJTEVQSE9ORV9MRU5dOyAvLyDmiYvmnLpcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8vIOaYteensFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlQXV0aFtOQU1FX0xFTl07ICAgICAgICAgLy/miYvmnLrpqozor4HnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsvL+acuuWZqOW6j+WIl+WPt1xuLy8gfTtcblxuLy8gLy/miYvmnLrnmbvpmYbmiJDlip9cbi8vIHN0cnVjdCBDTURfR1BfTG9nb25TdWNjZXNzTW9iaWxlXG4vLyB7XG4vLyAgICAgLy/mianlsZXkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1c3RvbUZhY2VWZXI7ICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNb29yTWFjaGluZTsgICAgICAgICAgICAgICAgICAvL+mUgeWumuacuuWZqFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQmluZFdlaVhpbjsgICAgICAgICAgICAgICAgICAgLy/nu5Hlrprlvq7kv6EgV1NMXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0VuY3J5cHRJRDsgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29kZUNoZWNrSUQ7ICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RXhwZXJpZW5jZTsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGxHYW1lU2NvcmU7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgLy/pk7booYzph5HluIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvL+aYteensFxuLy8gfTtcblxuLy8gLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8gLy/luJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeUFjY291bnRzXG4vLyB7XG5cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlVzZXJQaG9uZVRhZztcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1BsYXphVmVyc2lvbjsgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vIH07XG5cbi8vIC8vSSBEIOeZu+W9lVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkJ5VXNlcklEXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gfTtcblxuLy8gLy/ms6jlhozluJDlj7dcbi8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/moIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaXR5TnVtOyAgICAgICAgICAgICAgICAgICAgICAgLy/ln47luILnvJbnoIFcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkVuam95VHlwZTsgICAgICAgICAgICAgICAgICAgIC8v5Yqg5YWl57G75Z6LXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pTcHJlYWRlcltOQU1FX0xFTl07ICAgICAgICAgICAvL+aOqOW5v+S6uuWQjVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nlKjmiLfmmLXnp7Bcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelJlYWxOYW1lW05BTUVfTEVOXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeklkZW50aXR5W05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVuam95Q29kZVtQQVNTX0xFTl07ICAgICAgICAgIC8v5o6o6I2Q56CBb3LmlrDmiYvnoIFcbi8vIH07XG5cbi8vIC8v55m76ZmG5oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNZW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0V4cGVyaWVuY2U7ICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4gICAgXG4vLyAgICAgLy/mianlsZXkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1c3RvbUZhY2VWZXI7ICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JNb29yTWFjaGluZTsgICAgICAgICAgICAgICAgICAvL+mUgeWumuacuuWZqFxuXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGb3J0dW5lQ29pbjsgICAgICAgICAgICAgICAgICAvL+emj+W4gVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R29sZDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuZDosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgIC8v5LmQ6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgICAvL+eBq+iFv1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlQ291cG9uOyAgICAgICAgICAgICAgICAgLy/ngavohb9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01hdGNoVGlja2V0OyAgICAgICAgICAgICAgICAgIC8v5Y+C6LWb5Yi4XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGaXJzdEJhbms7ICAgICAgICAgICAgICAgICAgICAvLyDpppbmrKHkvb/nlKhcblxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VXNlclBob25lSW5mb3JbMTZdOyAgICAgICAgICAgLy/nlKjmiLfmiYvmnLpcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLyAvL+eZu+mZhuWksei0pVxuLy8gc3RydWN0IENNRF9HUF9Mb2dvbkVycm9yXG4vLyB7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAvL+mUmeivr+S7o+eggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgLy/plJnor6/mtojmga9cbi8vIH07XG5cbi8vIHN0cnVjdCB0YWdBd2FyZEluZm9cbi8vIHtcbi8vICAgICBpbnQgICAgIG5Bd2FyZEdvbGRbN107XG4vLyB9O1xuXG4vLyB0eXBlZGVmIHN0cnVjdFxuLy8ge1xuLy8gICAgIHRhZ0F3YXJkSW5mbyBpbmZvO1xuLy8gICAgIEJZVEUgICAgICAgIElzQ2hlY2tlZDtcbi8vICAgICBpbnQgICAgICAgICBuTG9nb25UaW1lO1xuLy8gfUNNRF9HUF9Bd2FyZEluZm87XG4vLyAvL+agoemqjOeUqOaIt+S/oeaBr1xuLy8gc3RydWN0IENNRF9HUF9DaGVja1JlZ2lzdGVyXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEYXRhW05BTUVfTEVOXTsgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGbGFnOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8wOuajgOa1i+i0puWPtyAxOuajgOa1i+aYteensFxuLy8gfTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+a4uOaIj+WIl+ihqOWRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX1NFUlZFUl9MSVNUID0gMTc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajkv6Hmga9cblxucGxhemFfY21kLlNVQl9HUF9MSVNUX1RZUEUgPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+exu+Wei+WIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0tJTkQgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+enjeexu+WIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX1NUQVRJT04gPSA1MDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ermeeCueWIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX1NFUlZFUiA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze05YiX6KGoXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfRklOSVNIID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHlrozmiJBcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9DT05GSUcgPSA1MDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOmFjee9rlxuXG4vLyAvL+WIl+ihqOmFjee9rlxuLy8gc3RydWN0IENNRF9HUF9MaXN0Q29uZmlnXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlNob3dPbkxpbmVDb3VudDsgICAgICAgICAgICAgICAvL+aYvuekuuS6uuaVsFxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v57O757uf5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfU1lTVEVNID0gMTk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/lkb3ku6RcblxucGxhemFfY21kLlNVQl9HUF9WRVJTSU9OID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/niYjmnKzpgJrnn6VcbnBsYXphX2NtZC5TVUJfU1BfU1lTVEVNX01TRyA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5raI5oGvXG5cbi8vIC8v54mI5pys6YCa55+lXG4vLyBzdHJ1Y3QgQ01EX0dQX1ZlcnNpb25cbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTmV3VmVyc2lvbjsgICAgICAgICAgICAgICAgICAgIC8v5pu05paw54mI5pysXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkFsbG93Q29ubmVjdDsgICAgICAgICAgICAgICAgICAvL+WFgeiuuOi/nuaOpVxuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxucGxhemFfY21kLk1ETV9HUF9VU0VSID0gMjI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cblxucGxhemFfY21kLlNVQl9HUF9VU0VSX1VQTE9BRF9GQUNFID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfVVNFUl9ET1dOTE9BRF9GQUNFID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIvovb3lpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfVVBMT0FEX0ZBQ0VfUkVTVUxUID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfREVMRVRFX0ZBQ0VfUkVTVUxUID0gNTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfQ1VTVE9NX0ZBQ0VfREVMRVRFID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfTU9ESUZZX0lORElWSURVQUwgPSA1MDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4quS6uui1hOaWmVxucGxhemFfY21kLlNVQl9HUF9NT0RJRllfSU5ESVZJRFVBTF9SRVNVTFQgPSA1MDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/ruaUuee7k+aenFxuXG5wbGF6YV9jbWQuU1VCX0dQX1NBRkVfQklORCA9IDUwNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a6257uR5a6aXG5wbGF6YV9jbWQuU1VCX0dQX1NBRkVfVU5CSU5EID0gNTA4OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/op6PpmaTnu5HlrppcbnBsYXphX2NtZC5TVUJfR1BfQ0hFQ0tfUFNEID0gNTA5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHpqozor4EgV1NMIDIwMTUuMy4yN1xuXG5cbnBsYXphX2NtZC5NRE1fR1BfUkVHID0gMjM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0lOSVRfUkVHSVNURVIgPSA1MDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+azqOWGjOW4kOWPt1xucGxhemFfY21kLlNVQl9HUF9DQU5DRUxfUkVHSVNURVIgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WPlua2iOazqOWGjFxucGxhemFfY21kLlNVQl9HUF9SRUZVU0VfUkVHID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3og73ms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfQ0FOX1JFRyA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+v5Lul5rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9SRUdDT0RFID0gNTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5wbGF6YV9jbWQuU1VCX0dQX1JFVF9SRUdDT0RFID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5wbGF6YV9jbWQuU1VCX0dQX1JFVF9SRUdDT0RFX0VSUk9SID0gNTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlLPor7fms6jlhoznoIEgd3NsIDIwMTUuNC4zXG5cbi8vIC8v5Liq5Lq66LWE5paZXG4vLyBzdHJ1Y3QgQ01EX0dQX01vZGlmeUluZGl2aWR1YWxcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgICAgICAvL+eOqeWutuaYteensFxuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkdlbmRlcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrbmgKfliKtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5BZ2U7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625bm06b6EXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFkZHJlc3NbNjRdOyAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuWcsOWdgFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pVbmRlcldyaXRlWzMyXTsgICAgICAgICAgICAgICAgICAgLy/kuKrmgKfnrb7lkI1cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc3dvcmRbMzNdOyAgICAgICAgICAgICAgICAgICAgIC8v546p5a625a+G56CBXG4vLyB9O1xuXG4vLyAvL+WumuS5ieWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9VcGxvYWRDdXN0b21GYWNlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50U2l6ZTsgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lpKflsI9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGFzdFBhY2tldDsgICAgICAgICAgICAgICAgICAgIC8v5pyA5ZCO5qCH6K+GXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkZpcnN0UGFja2V0OyAgICAgICAgICAgICAgICAgICAvL+esrOS4gOS4quagh+ivhlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGYWNlRGF0YVsyMDQ4XTsgICAgICAgICAgICAgICAgLy/lpLTlg4/mlbDmja5cbi8vIH07XG5cbi8vIC8v5LiL6L295oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0Rvd25sb2FkRmFjZVN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VG9sdGFsU2l6ZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5oC75YWx5aSn5bCPXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0N1cnJlbnRTaXplOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWkp+Wwj1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGYWNlRGF0YVsyMDQ4XTsgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+S4i+i9veWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9Eb3dubG9hZEZhY2Vcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyB9O1xuXG4vLyAvL+S4iuS8oOe7k+aenFxuLy8gc3RydWN0IENNRF9HUF9VcGxvYWRGYWNlUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJPcGVyYXRlU3VjY2VzczsgICAgICAgICAgICAgICAgICAgIC8v5oiQ5Yqf5qCH6K+GXG4vLyB9O1xuXG4vLyAvL+WIoOmZpOe7k+aenFxuLy8gc3RydWN0IENNRF9HUF9EZWxldGVGYWNlUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJPcGVyYXRlU3VjY2VzczsgICAgICAgICAgICAgICAgICAgIC8v5oiQ5Yqf5qCH6K+GXG4vLyB9O1xuXG4vLyAvL+WIoOmZpOa2iOaBr1xuLy8gc3RydWN0IENNRF9HUF9DdXN0b21GYWNlRGVsZXRlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdGYWNlVmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/niYjmnKxcbi8vIH07XG4vLyAvL+S/ruaUueWktOWDj1xuLy8gc3RydWN0IENNRF9HUF9GYWNlQ2hhbmdlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7XG4vLyB9O1xuLy8gc3RydWN0IENNRF9HUF9GYWNlQ2hhbmdlUmVzdWx0XG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYlJlc3VsdElEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnue7k+aenFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0ZhY2VJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg49JRFxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9Vc2VySW5mb1xuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgICAgLy/kv53pmannrrHnpo/luIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlQ291cG9uOyAgICAgICAgICAgICAgICAgICAgIC8v5L+d6Zmp566x6LSd5aOzXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0NvdXBvbjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i0neWjs+aVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNYXRjaFRpY2tldDsgICAgICAgICAgICAgICAgICAgICAgLy/pl6jnpajmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Rm9ydHVuZUNvaW47ICAgICAgICAgICAgICAgICAgICAgIC8v56aP6LGG5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+emj+W4geaVsFxuLy8gfTtcbi8vIC8v5L+u5pS557uT5p6cXG4vLyBzdHJ1Y3QgQ01EX0dQX01vZGlmeUluZGl2aWR1YWxSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGVzY3JpYmVNc2dbMTI4XTsgICAgICAgICAgICAgICAgIC8v5o+P6L+w5L+h5oGvXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9HZXRMb2dvbkF3YXJkXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt0lEXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuVGltZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WHoOetieWlluWKsVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ojrflvpflpZblirFcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfUmV0dXJuXG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQ29kZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnmNvZGVcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxWYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YC8XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlWzMyXTsgICAgICAgICAgICAgICAgICAgICAvL+i/lOWbnuaPj+i/sFxuLy8gfTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyDpk7booYzmk43kvZwo5byA5YiG5YaZLOWHj+WwkeWIpOaWreWtl+iKgilcbnBsYXphX2NtZC5NRE1fR1BfQkFOSyA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmTtuihjOS/oeaBr1xuXG4vLyDlrqLmiLfnq6/or7fmsYJcbnBsYXphX2NtZC5TVUJfR1BfQ0hBTkdFX1BBU1NXT1JEID0gMTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5L+u5pS55a+G56CBXG4vL3BsYXphX2NtZC5TVUJfR1BfTE9PS19TQVZFID0gMTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5p+l55yL6K6w5b2VXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfU1RPUkFHRSA9IDEwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOmHkeW4gVxucGxhemFfY21kLlNVQl9HUF9CQU5LX0dFVCA9IDEwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPlumHkeW4gVxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fU1RPUkFHRSA9IDEwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOWlluWIuFxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fR0VUID0gMTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5aWW5Yi4XG5cbi8vIOivt+axguW6lOetlFxucGxhemFfY21kLlNVQl9HUF9DSEFOR0VfUEFTU1dPUkRfUkVTID0gMTEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5L+u5pS55a+G56CBXG4vL3BsYXphX2NtZC5TVUJfR1BfTE9PS19TQVZFX1JFUyA9IDExMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOafpeeci+iusOW9lVxucGxhemFfY21kLlNVQl9HUF9CQU5LX1NUT1JBR0VfUkVTID0gMTEyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo6YeR5biBXG5wbGF6YV9jbWQuU1VCX0dQX0JBTktfR0VUX1JFUyA9IDExMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPlumHkeW4gVxucGxhemFfY21kLlNVQl9HUF9DT1VQT05fU1RPUkFHRV9SRVMgPSAxMTQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjlpZbliLhcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX0dFVF9SRVMgPSAxMTU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5blpZbliLhcblxuXG4vLyAvLyDkv67mlLnlr4bnoIFcbi8vIHN0cnVjdCBDTURfR1BfQ2hhbmdlUGFzc1dvcmRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt0lEXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdCa1Bhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOaWsOeahOWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEJrUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5Y6f5aeL5a+G56CBXG4vLyB9O1xuXG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5a2Y5YWl5a2Y5YKo57uT5p6EXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUqOaIt0lEXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgLy8g5pON5L2c5pWw6YePXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vIH1DTURfR1BfQmFua1N0b3JhZ2UsIENNRF9HUF9Db3Vwb25TdG9yYWdlO1xuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWPluWHuuWtmOWCqOe7k+aehFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvblZhbHVlOyAgICAgICAgICAgICAgICAgLy8g5pON5L2c5pWw6YePXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5QYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDlpKfljoXlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5rUGFzc3dvcmRbUEFTU19MRU5dOyAgICAgICAgIC8vIOeUqOaIt+WvhueggVxuLy8gfUNNRF9HUF9CYW5rR2V0LCBDTURfR1BfQ291cG9uR2V0O1xuXG5cbi8vIC8vIOS/ruaUueWvhueggeW6lOetlFxuLy8gc3RydWN0IENNRF9HUF9DaGFuZ2VQYXNzV29yZFJlc1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgLy8gMOS4uuaIkOWKnyjkv67mlLlpc0ZpcnN0KVxuLy8gfTtcblxuLy8gLy8g6YeR5biBLOWlluWIuCzlrZjlgqjlupTnrZRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgLy8g6ZSZ6K+v56CBLDDkuLrmiJDlip9cbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOi6q+S4iumSsVxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmtWYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy8g5L+d6Zmp566x6ZKxXG4vLyB9Q01EX0dQX0JhbmtTdG9yYWdlUmVzLCBDTURfR1BfQmFua0dldFJlcywgQ01EX0dQX0NvdXBvblN0b3JhZ2VSZXMsIENNRF9HUF9Db3Vwb25HZXRSZXM7XG5cbnBsYXphX2NtZC5NRE1fR1BfTkVXID0gNjtcblxucGxhemFfY21kLlNVQl9HUF9HRVRfTkVXUyA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635Y+W5YWs5ZGKXG5wbGF6YV9jbWQuU1VCX0dQX0ZJTkRfRlJJRUROID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6Llpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfR0VUX0ZSSUVORCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635Y+W5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0FERF9GUklFTkQgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WinuWKoOWlveWPi1xucGxhemFfY21kLlNVQl9HUF9ERUxFVEVfRlJJRU5EID0gNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liKDpmaTlpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfRlJJRU5EX0VSUk9SID0gNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnu5PmnpxcbnBsYXphX2NtZC5TVUJfR1BfU0VORF9NT05FWSA9IDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCBXG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfUkVDT1JEID0gODtcbnBsYXphX2NtZC5TVUJfR1BfU0VORF9SRVNVTFQgPSA5O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0dldE5ld3Ncbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5ld3NbMjU2XTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRnJpZW5kX1JlbGF0aXZlIFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICBkd1VzZXJJRDtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdGcmllbmRJRDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRnJpZW5kRXJyb3Jcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICBzekRlc2NyaWJlWzEyOF07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0RlbGV0ZUZyaWVuZFJlc3VsdFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICBkd0RlbGV0ZUlEO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GaW5kVXNlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgIGR3VXNlcklEO1xuLy8gICAgIFdPUkQgICAgICAgIHdGYWNlSUQ7XG4vLyAgICAgY2hhciAgICAgICAgc3pOaWNrTmFtZVszMl07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZExpc3Rcbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgIG5Db3VudDsgICAgICAgICAgICAgLy/kuKrmlbBcbi8vICAgICBDTURfR1BfRmluZFVzZXIgICAgIEZ1c2VyWzEwXTsgIC8v5pyA5aSaXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1NlbmRNb25leVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgIGR3VXNlcklEO1xuLy8gICAgIERXT1JEICAgICAgIGR3RnJpZW5kSUQ7XG4vLyAgICAgTE9OR0xPTkcgICAgbFNjb3JlO1xuLy8gfTtcblxuLy8gc3RydWN0IHRhZ1RyYW5SZWNvcmRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6U2VuZE5hbWVbMzJdO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pBY2NlcHROYW1lWzMyXTtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgIGxUcmFuR29sZDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVHJhblJlY29yZFxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgbkNvdW50O1xuLy8gICAgIHRhZ1RyYW5SZWNvcmQgICAgICAgUmVjb3JkWzIwXTtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfU2VuZFJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pTZW5kTmFtZVszMl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzekFjY2VwdE5hbWVbMzJdO1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgbFNjb3JlO1xuLy8gfTtcbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIC8v6Laj6K+t57uT5p6EXG4vLyBzdHJ1Y3QgQ01EX0dGX1VzZXJGdW5cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5Y+3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd01haW5JbmRleDsgICAgICAgICAgICAgICAgICAgICAvL+i2o+ivreadoeebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdWJJbmRleDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR0ZfTGV2ZWxJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICB3Q2hhaXJJRDtcbi8vICAgICBMT05HICAgIGxHYW1lTGV2ZWw7XG4vLyAgICAgTE9ORyAgICBBd2FyZFR5cGU7XG4vLyAgICAgTE9ORyAgICBBd2FyZFZhbHVlO1xuLy8gICAgIExPTkcgICAgbEV4cGVyaWVuY2U7XG4vLyAgICAgTE9OR0xPTkcgICAgbExldmVsVXBWYWx1ZTtcbi8vIH07XG5cbi8vIC8v6K+35rGC5Lu75YqhXG4vLyBzdHJ1Y3QgQ01EX0dGX01pc3Npb25SZXF1ZXN0XG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWlzc2lvblR5cGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL+a2iOaBr+exu+Wei1xucGxhemFfY21kLlNNVF9JTkZPID0gMHgwMDAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/mtojmga9cbnBsYXphX2NtZC5TTVRfRUpFQ1QgPSAweDAwMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8ueWHuua2iOaBr1xucGxhemFfY21kLlNNVF9HTE9CQUwgPSAweDAwMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xucGxhemFfY21kLlNNVF9DTE9TRV9HQU1FID0gMHgxMDAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63muLjmiI9cblxubW9kdWxlLmV4cG9ydHMgPSBwbGF6YV9jbWQ7IiwidmFyIHpqaF9jbWQgPSB7fTtcblxuXG56amhfY21kLktJTkRfSUQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG56amhfY21kLlNFUlZFUl9JRCA9IDMwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acjeWKoeWZqCBJIERcbnpqaF9jbWQuR0FNRV9QTEFZRVIgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/kurrmlbBcbnpqaF9jbWQuR0FNRV9OQU1FID0gXCLor4jph5HoirFcIjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5ZCN5a2XXG4vLyB6amhfY21kLkdBTUVfR0VOUkUgICAgICAgICAgICAgICAgICAgICAgKEdBTUVfR0VOUkVfR09MRHxHQU1FX0dFTlJFX01BVENIKSAgLy/muLjmiI/nsbvlnotcbnpqaF9jbWQuTUFYX0NPVU5UID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omR5YWL5pWw55uuXG5cblxuempoX2NtZC5TRVJWRVJBRERSRVNTID0gXCIxMjcuMC4wLjFcIjtcbnpqaF9jbWQuU0VSVkVSX1BPUlQgPSAxNjgwO1xuXG4vL+e7k+adn+WOn+WboFxuempoX2NtZC5HRVJfTk9fUExBWUVSID0gMHgxMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rKh5pyJ546p5a62XG56amhfY21kLkdFUl9DT01QQVJFQ0FSRCA9IDB4MjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOe7k+adn1xuempoX2NtZC5HRVJfT1BFTkNBUkQgPSAweDMwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYznu5PmnZ9cblxuLy/muLjmiI/nirbmgIFcbnpqaF9jbWQuR1NfVEtfRlJFRSA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXlvIDlp4tcbnpqaF9jbWQuR1NfVEtfUExBWUlORyA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+i/m+ihjFxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/mnI3liqHlmajlkb3ku6Tnu5PmnoRcblxuempoX2NtZC5TVUJfU19HQU1FX1NUQVJUID0gMTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5byA5aeLXG56amhfY21kLlNVQl9TX0FERF9TQ09SRSA9IDEwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOe7k+aenFxuempoX2NtZC5TVUJfU19HSVZFX1VQID0gMTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pS+5byD6Lef5rOoXG56amhfY21kLlNVQl9TX0NPTVBBUkVfQ0FSRCA9IDEwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOi3n+azqFxuempoX2NtZC5TVUJfU19MT09LX0NBUkQgPSAxMDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYzot5/ms6hcbnpqaF9jbWQuU1VCX1NfU0VORF9DQVJEID0gMTAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R54mM5raI5oGvXG56amhfY21kLlNVQl9TX0dBTUVfRU5EID0gMTA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57uT5p2fXG56amhfY21kLlNVQl9TX1BMQVlFUl9FWElUID0gMTA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35by66YCAXG56amhfY21kLlNVQl9TX09QRU5fQ0FSRCA9IDEwODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOa2iOaBr1xuempoX2NtZC5TVUJfU19XQUlUX0NPTVBBUkUgPSAxMDk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXmr5TniYxcbnpqaF9jbWQuU1VCX1NfTEFTVF9BREQgPSAxMTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcbi8vIC8v5ri45oiP54q25oCBXG4vLyBzdHJ1Y3QgQ01EX1NfU3RhdHVzRnJlZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z+656GA56ev5YiGXG4vLyB9O1xuXG4vLyAvL+a4uOaIj+eKtuaAgVxuLy8gc3RydWN0IENNRF9TX1N0YXR1c1BsYXlcbi8vIHtcbi8vICAgICAvL+WKoOazqOS/oeaBr1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiK6ZmQXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljZXlhYPkuIvms6hcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxVc2VyTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWw5LiK6ZmQXG4gICAgXG4vLyAgICAgLy/nirbmgIHkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QmFua2VyVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+W6hOWutueUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN546p5a62XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQbGF5U3RhdHVzW0dBTUVfUExBWUVSXTsgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTWluZ1podVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAgICAvL+eci+eJjOeKtuaAgVxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxUYWJsZVNjb3JlW0dBTUVfUExBWUVSXTsgICAgICAgICAgIC8v5LiL5rOo5pWw55uuXG4gICAgXG4vLyAgICAgLy/miZHlhYvkv6Hmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkhhbmRDYXJkRGF0YVtNQVhfQ09VTlRdOyAgICAgICAgICAvL+aJkeWFi+aVsOaNrlxuICAgIFxuLy8gICAgIC8v54q25oCB5L+h5oGvXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkNvbXBhcmVTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gfTtcblxuLy8gLy/muLjmiI/lvIDlp4tcbi8vIHN0cnVjdCBDTURfU19HYW1lU3RhcnRcbi8vIHtcbi8vICAgICAvL+S4i+azqOS/oeaBr1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxNYXhTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA5aSn5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbENlbGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljZXlhYPkuIvms6hcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxVc2VyTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5YiG5pWw5LiK6ZmQXG4gICAgXG4vLyAgICAgLy/nlKjmiLfkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QmFua2VyVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+W6hOWutueUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN546p5a62XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQbGF5U3RhdHVzW0dBTUVfUExBWUVSXTsgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vIH07XG5cbi8vIC8v55So5oi35LiL5rOoXG4vLyBzdHJ1Y3QgQ01EX1NfQWRkU2NvcmVcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdBZGRTY29yZVVzZXI7ICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQWRkU2NvcmVDb3VudDsgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOaVsOebrlxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VGltZXM7ICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5YCN5pWwXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxhc3RBZGRTY29yZTsgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuWtpOazqOS4gOaOt1xuLy8gfTtcblxuLy8gLy/nlKjmiLfmlL7lvINcbi8vIHN0cnVjdCBDTURfU19HaXZlVXBcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3R2l2ZVVwVXNlcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+eUqOaIt1xuLy8gfTtcblxuLy8gLy/mr5TniYzmlbDmja7ljIVcbi8vIHN0cnVjdCBDTURfU19Db21wYXJlQ2FyZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyWzJdOyAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9zdFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i+k+eJjOeUqOaIt1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMb3N0Q2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/ovpPlrrbniYzmlbDmja5cbi8vIH07XG5cbi8vIC8v55yL54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfTG9va0NhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9va0NhcmRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAvL+eci+eJjOeUqOaIt1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiQ2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgICAgIC8v55So5oi35omR5YWLXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcbi8vIH07XG5cbi8vIC8v5byA54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfT3BlbkNhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3V2lubmVyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeeUqOaIt1xuLy8gfTtcblxuLy8gLy/lraTms6jkuIDmjrdcbi8vIHN0cnVjdCBDTURfU19MYXN0QWRkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXJ0TGFzdEFkZFVzZXI7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyW0dBTUVfUExBWUVSXTtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TG9zdFVzZXJbR0FNRV9QTEFZRVJdO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47XG4vLyB9O1xuXG5cbi8vIC8v5ri45oiP57uT5p2fXG4vLyBzdHJ1Y3QgQ01EX1NfR2FtZUVuZFxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lVGF4OyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP56iO5pS2XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVTY29yZVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAgLy/muLjmiI/lvpfliIZcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkNhcmREYXRhW0dBTUVfUExBWUVSXVtNQVhfQ09VTlRdOyAvL+eUqOaIt+aJkeWFi1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl1bNF07ICAgICAgIC8v5q+U54mM55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0VuZFN0YXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nu5PmnZ/nirbmgIFcbi8vIH07XG5cbi8vIC8v55So5oi36YCA5Ye6XG4vLyBzdHJ1Y3QgQ01EX1NfUGxheWVyRXhpdFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdQbGF5ZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YCA5Ye655So5oi3XG4vLyB9O1xuXG4vLyAvL+etieW+heavlOeJjFxuLy8gc3RydWN0IENNRF9TX1dhaXRDb21wYXJlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8v5a6i5oi356uv5ZG95Luk57uT5p6EXG56amhfY21kLlNVQl9DX0FERF9TQ09SRSA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WKoOazqFxuempoX2NtZC5TVUJfQ19HSVZFX1VQID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pS+5byD5raI5oGvXG56amhfY21kLlNVQl9DX0NPTVBBUkVfQ0FSRCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19MT09LX0NBUkQgPSA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfT1BFTl9DQVJEID0gNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM5raI5oGvXG56amhfY21kLlNVQl9DX1dBSVRfQ09NUEFSRSA9IDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etieW+heavlOeJjFxuempoX2NtZC5TVUJfQ19GSU5JU0hfRkxBU0ggPSA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrozmiJDliqjnlLtcbnpqaF9jbWQuU1VCX0NfTEFTVF9BREQgPSA4OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcblxuLy8gLy/nlKjmiLfliqDms6hcbi8vIHN0cnVjdCBDTURfQ19BZGRTY29yZVxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5rOo5pWw55uuXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXRlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nirbmgIFcbi8vIH07XG5cbi8vIC8v5q+U54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX0NfQ29tcGFyZUNhcmRcbi8vIHsgICBcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gfTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8qKioqKioqKioqKioqKioq5a6a5pe25Zmo5qCH6K+GKioqKioqKioqKioqKioqKioqLS1cbi8v5byA5aeL5a6a5pe25ZmoXG56amhfY21kLklESV9TVEFSVF9HQU1FICAgXHRcdFx0PSAyMDBcbi8vIOWKoOazqOWumuaXtuWZqFxuempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkVcdFx0XHQ9IDIwMVxuLy8g6YCJ5q+U54mM55So5oi35a6a5pe25ZmoXG56amhfY21kLklESV9VU0VSX0NPTVBBUkVfQ0FSRFx0XHQ9IDIwMlxuLy8g6L+H5ruk5a6a5pe25ZmoXG56amhfY21kLklESV9ESVNBQkxFXHRcdFx0XHRcdD0gMjAzXG4vLyAqKioqKioqKioqKioqKioqKuaXtumXtOagh+ivhioqKioqKioqKioqKioqKioqLS1cbi8vIOW8gOWni+WumuaXtuWZqFxuempoX2NtZC5USU1FX1NUQVJUX0dBTUVcdFx0XHRcdD0gMjBcbi8vIOWKoOazqOWumuaXtuWZqFxuempoX2NtZC5USU1FX1VTRVJfQUREX1NDT1JFXHRcdFx0PSAyNVxuLy8g5q+U54mM5a6a5pe25ZmoXG56amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkRcdFx0PSAyNVxuXG5tb2R1bGUuZXhwb3J0cyA9IHpqaF9jbWQ7IiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfcHJvZHVjdE5hbWU6IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX3Byb2R1Y3RQcmljZTogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfcGF5UHJpY2U6IGNjLkxhYmVsLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIGlmKHRoaXMuX3BhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX3Byb2R1Y3ROYW1lLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcImdvb2RzX25hbWVcIl07XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcHJvZHVjdFByaWNlLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcInBheV9hbXRcIl0gKyBcIuWFg1wiO1xuICAgICAgICAgICAgdGhpcy5tX0xhYmVsX3BheVByaWNlLnN0cmluZyA9IHRoaXMuX3BhcmFtc1tcInBheV9hbXRcIl0gKyBcIuWFg1wiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtpbml0XSBcIiArIEpTT04uc3RyaW5naWZ5KHRoaXMuX3BhcmFtcykpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBHbG9iYWxVc2VyRGF0YS53RmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIC8vIHRoaXMuX2ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICAvLyB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIEpTT04uc3RyaW5naWZ5KHBhcmFtcy5kZXRhaWwpKTtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VcIixwYXJhbXMuZGV0YWlsKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB2YXIgRmFjZUlEID0gdGhpcy5fZmFjZUlEO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9TaG9wVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25DbGlja1VzZXJQcm9maWxlXSBBY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIHpqaF9jbWQgPSByZXF1aXJlKFwiQ01EX1phSmluSHVhXCIpO1xudmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdhbWVTZXJ2ZXJJdGVtID0gcmVxdWlyZShcIkdhbWVTZXJ2ZXJJdGVtXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHYW1lVXNlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVVzZXJJdGVtXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl93VGFibGVDb3VudCA9IDA7XG5cdCAgICB0aGlzLl93Q2hhaXJDb3VudCA9IDA7XG5cdCAgICB0aGlzLl93U2VydmVyVHlwZSA9IDA7XG5cdCAgICB0aGlzLl9kd1NlcnZlclJ1bGUgPSAwO1xuICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgXHQ9IDA7XG4gICAgICAgIHRoaXMuX2NiQWxsb3dMb29rb24gPSAwO1xuICAgICAgICB0aGlzLl9jYkhpZGVVc2VySW5mbyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl91c2VyTGlzdCA9IHt9OyAgXG4gICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3QgPSB7fTtcbiAgICAgICAgdGhpcy5fdGFibGVTdGF0dXMgPSB7fTtcbiAgICAgICAgdGhpcy5fd1RhYmxlSUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRTtcbiAgICAgICAgdGhpcy5fd0NoYWlySUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICB9LFxuICAgIG9uTG9nb25Sb29tOiBmdW5jdGlvbiAocm9vbUluZm8pIHtcbiAgICAgICAgdGhpcy5fcm9vbUluZm8gPSByb29tSW5mbztcbiAgICAgICAgaWYgKCF0aGlzLl9yb29tSW5mbykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV0g6I635Y+W5oi/6Ze05L+h5oGv5aSx6LSlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dIOeZu+W9leaIv+mXtDogXCIgKyBHbG9iYWxGdW4ubnVtYmVyVG9JcCh0aGlzLl9yb29tSW5mby5kd1NlcnZlckFkZHIpICsgXCIjIFwiICsgdGhpcy5fcm9vbUluZm8ud1NlcnZlclBvcnQpO1xuICAgICAgICBpZih0aGlzLm9uQ3JlYXRlU29ja2V0KEdsb2JhbEZ1bi5udW1iZXJUb0lwKHRoaXMuX3Jvb21JbmZvLmR3U2VydmVyQWRkciksdGhpcy5fcm9vbUluZm8ud1NlcnZlclBvcnQpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvbkxvZ29uUm9vbV1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uUGFja2V0KCk7XG4gICAgfSxcbiAgICBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uU29ja2V0RXZlbnRdIHBEYXRhIGxlbiA9IFwiICsgcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIGlmICghdGhpcy5fc29ja2V0RXZlbnRDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0RXZlbnRDYWxsYmFjayA9IHtcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX0xPR09OXSA6IHRoaXMuT25Tb2NrZXRNYWluTG9nb24sLy/nmbvlvZXmtojmga9cbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX1VTRVJdIDogdGhpcy5PblNvY2tldE1haW5Vc2VyLC8v55So5oi35raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9JTkZPXSA6IHRoaXMuT25Tb2NrZXRNYWluSW5mbywvL+mFjee9rua2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1RBVFVTXSA6IHRoaXMuT25Tb2NrZXRNYWluU3RhdHVzLC8v54q25oCB5raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9TWVNURU1dIDogdGhpcy5PblNvY2tldE1haW5TeXN0ZW0sLy/ns7vnu5/mtojmga9cbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX1NFUlZFUl9JTkZPXSA6IHRoaXMuT25Tb2NrZXRNYWluU2VydmVySW5mbywvL+aIv+mXtOa2iOaBr1xuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX0dBTUVdIDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHsvL+a4uOaIj+a2iOaBr1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudEdhbWVNZXNzYWdlXCIse1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViOnN1YixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW0dsb2JhbERlZi5NRE1fR0ZfRlJBTUVdIDogdGhpcy5PblNvY2tldE1haW5HYW1lRnJhbWUsLy/moYbmnrbmtojmga9cbiAgICAgICAgICAgICAgICBbR2xvYmFsRGVmLk1ETV9HRl9QUkVTRU5UXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2sgJiYgdGhpcy5fc29ja2V0RXZlbnRDYWxsYmFja1ttYWluXSkge1xuICAgICAgICAgICAgdmFyIGZ1biA9IHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2tbbWFpbl07XG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLCBzdWIsIHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Tb2NrZXRFdmVudF0gbWFpbiA9IFwiKyBtYWluICsgXCJzdWIgPSBcIiArIHN1YiArIFwiIG5vdCBmaW5kXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5Mb2dvbjogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluTG9nb25dXCIpO1xuICAgICAgICBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fU1VDQ0VTUyl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBsb2dvbiBzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdGhpcy5fdXNlckxpc3QgPSB7fTtcbiAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoXCJMb2dvblN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRVJST1IpIHtcbiAgICAgICAgICAgIC8v55m75b2V5aSx6LSlXG4gICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX0xvZ29uRXJyb3JcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRsRXJyb3JDb2RlO1x0XHRcdFx0XHRcdFx0Ly/plJnor6/ku6PnoIFcbiAgICAgICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pFcnJvckRlc2NyaWJlWzEyOF07XHRcdFx0XHQvL+mUmeivr+a2iOaBr1xuICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIHZhciBsb2dvbkVycm9yID0ge307XG4gICAgICAgICAgICBsb2dvbkVycm9yLmxFcnJvckNvZGUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICBsb2dvbkVycm9yLnN6RXJyb3JEZXNjcmliZSA9IHBEYXRhLnJlYWRzdHJpbmcoMTI4KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluTG9nb25dIGVycm9yQ29kZSA9IFwiICsgbG9nb25FcnJvci5sRXJyb3JDb2RlICsgXCIgZGVzID0gXCIgKyBsb2dvbkVycm9yLnN6RXJyb3JEZXNjcmliZSk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBsb2dpbiBlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0ZJTklTSCl7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJHYW1lU2NlbmVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBMb2dvbiBGaW5pc2hcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpblVzZXI6IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdXCIpO1xuICAgICAgICBpZiAoIXRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2sgPSB7XG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX0NPTUVdOiB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX1NUQVRVU106IHRoaXMuT25Tb2NrZXRTdWJTdGF0dXMsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFXTogdGhpcy5PblNvY2tldFN1YlNjb3JlLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9SSUdIVF06IHRoaXMuT25Tb2NrZXRTdWJSaWdodCxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9PUkRFUl06IHRoaXMuT25Tb2NrZXRTdWJNZW1iZXJPcmRlcixcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1NJVF9GQUlMRURdOiB0aGlzLk9uU29ja2V0U3ViU2l0RmFpbGVkLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9DSEFUXTogdGhpcy5PblNvY2tldFN1YkNoYXQsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX1dJU1BFUl06IHRoaXMuT25Tb2NrZXRTdWJXaXNwZXIsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9VU0VSX0lOVklURV06IHRoaXMuT25Tb2NrZXRTdWJVc2VySW52aXRlLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfUVVFUllfR09MRF06IHRoaXMuT25Tb2NrZXRTdWJRdWVyeUdvbGQsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9QUkVTRU5EX1FVRVJZXTogdGhpcy5PblNvY2tldFN1YlByZXNlbnRRdWVyeSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1JdOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9QUkVTRU5UX0VSUk9SXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLk9uU29ja2V0U3ViVXNlckNvbWUoc3ViLHBEYXRhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrICYmIHRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2tbc3ViXSkge1xuICAgICAgICAgICAgdmFyIGZ1biA9IHRoaXMuX3NvY2tldE1haW5Vc2VyQ2FsbGJhY2tbc3ViXTtcbiAgICAgICAgICAgIGZ1bi5jYWxsKHRoaXMsc3ViLHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluVXNlcl0gc3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluSW5mbzogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkluZm9dXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1NFUlZFUl9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1NFUlZFUl9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIC8v5ri45oiP5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9TZXJ2ZXJJbmZvXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICAvL+aIv+mXtOWxnuaAp1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q2hhaXJDb3VudDtcdFx0XHRcdFx0XHQvL+akheWtkOaVsOebrlxuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3R2FtZUdlbnJlO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/nsbvlnotcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlQ291bnQ7XHRcdFx0XHRcdFx0Ly/moYzlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0tpbmRJRDtcdFx0XHRcdFx0XHRcdC8v57G75Z6LIEkgRFxuICAgICAgICAgICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdWaWRlb0FkZHI7XHRcdFx0XHRcdFx0Ly/op4bpopHlnLDlnYBcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0Y2JIaWRlVXNlckluZm87XHRcdFx0XHRcdFx0Ly/pmpDol4/kv6Hmga9cbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHZhciBzZXJ2ZXJJbmZvID0ge307XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53Q2hhaXJDb3VudCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53R2FtZUdlbnJlID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLndUYWJsZUNvdW50ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLndLaW5kSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8uZHdWaWRlb0FkZHIgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLmNiSGlkZVVzZXJJbmZvID0gcERhdGEucmVhZGJ5dGUoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3dDaGFpckNvdW50ID0gc2VydmVySW5mby53Q2hhaXJDb3VudDtcbiAgICAgICAgICAgICAgICB0aGlzLl93VGFibGVDb3VudCA9IHNlcnZlckluZm8ud1RhYmxlQ291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2JIaWRlVXNlckluZm8gPSBzZXJ2ZXJJbmZvLmNiSGlkZVVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dHYW1lR2VucmUgPSBzZXJ2ZXJJbmZvLndHYW1lR2VucmU7XG4gICAgICAgICAgICAgICAgdGhpcy5fd0tpbmRJRCA9IHNlcnZlckluZm8ud0tpbmRJRDtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfQ09MVU1OX0lORk86XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfQ09MVU1OX0lORk9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9DT05GSUdfRklOSVNIOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX0NPTkZJR19GSU5JU0hcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5TdGF0dXM6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TdGF0dXNdXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX0lORk86XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVEFCTEVfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICAvL+ahjOWtkOeKtuaAgeaVsOe7hFxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfVGFibGVJbmZvXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3VGFibGVDb3VudDtcdFx0XHRcdFx0XHQvL+ahjOWtkOaVsOebrlxuICAgICAgICAgICAgICAgIC8vICAgICB0YWdUYWJsZVN0YXR1c1x0XHRcdFx0XHRUYWJsZVN0YXR1c1s1MTJdO1x0XHRcdFx0XHQvL+eKtuaAgeaVsOe7hFxuICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOeKtuaAgee7k+aehFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ1RhYmxlU3RhdHVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlBsYXlTdGF0dXM7XHRcdFx0XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRiVGFibGVMb2NrO1x0XHRcdFx0XHRcdFx0Ly/plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgd1RhYmxlQ291bnQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB3VGFibGVDb3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YWJsZVN0YXR1c1tpbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdLmJQbGF5U3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdLmJUYWJsZUxvY2sgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX1NUQVRVUzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9UQUJMRV9TVEFUVVNcIik7XG4gICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIHkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlU3RhdHVzXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRiVGFibGVMb2NrO1x0XHRcdFx0XHRcdFx0Ly/plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlBsYXlTdGF0dXM7XHRcdFx0XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOWPt+eggVxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlU3RhdHVzID0ge307XG4gICAgICAgICAgICAgICAgdGFibGVTdGF0dXMuYlRhYmxlTG9jayA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgdGFibGVTdGF0dXMuYlBsYXlTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRhYmxlU3RhdHVzLndUYWJsZUlEID0gcERhdGEucmVhZHdvcmQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW3RhYmxlU3RhdHVzLndUYWJsZUlEXS5iUGxheVN0YXR1cyA9IHRhYmxlU3RhdHVzLmJQbGF5U3RhdHVzO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW3RhYmxlU3RhdHVzLndUYWJsZUlEXS5iVGFibGVMb2NrID0gdGFibGVTdGF0dXMuYlRhYmxlTG9jaztcblxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJ1cERhdGFUYWJsZVN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ6dGFibGVTdGF0dXMud1RhYmxlSUQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+ezu+e7n+a2iOaBr1xuICAgIE9uU29ja2V0TWFpblN5c3RlbTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblN5c3RlbV1cIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfTUVTU0FHRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9NRVNTQUdFXCIpO1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9NZXNzYWdlXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3TWVzc2FnZVR5cGU7XHRcdFx0XHRcdFx0Ly/mtojmga/nsbvlnotcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VMZW5ndGg7XHRcdFx0XHRcdFx0Ly/mtojmga/plb/luqZcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6Q29udGVudFsxMDI0XTtcdFx0XHRcdFx0Ly/mtojmga/lhoXlrrlcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5aSE55CGXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7fTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLndNZXNzYWdlVHlwZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZUxlbmd0aCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS5zekNvbnRlbnQgPSBwRGF0YS5yZWFkc3RyaW5nKG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGgpO1xuICAgICAgICAgICAgICAgIC8v5YWz6Zet6L+e5o6lXG4gICAgICAgICAgICAgICAgdmFyIGJJbnRlcm1ldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLndNZXNzYWdlVHlwZSAmIGdhbWVfY21kLlNNVF9JTlRFUk1JVF9MSU5FKSB7XG4gICAgICAgICAgICAgICAgICAgIGJJbnRlcm1ldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgZ2FtZV9jbWQuU01UX0NMT1NFX1JPT00pIHtcbiAgICAgICAgICAgICAgICAgICAgYkludGVybWV0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJJbnRlcm1ldCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblN5c3RlbV0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5oi/6Ze05raI5oGvXG4gICAgT25Tb2NrZXRNYWluU2VydmVySW5mbzogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblNlcnZlckluZm9dXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX09OTElORV9DT1VOVF9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX09OTElORV9DT1VOVF9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluR2FtZUZyYW1lOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfT1BUSU9OOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dGX09QVElPTlwiKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+mFjee9rlxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR0ZfT3B0aW9uXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGJHYW1lU3RhdHVzO1x0XHRcdFx0XHQvL+a4uOaIj+eKtuaAgVxuICAgICAgICAgICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGJBbGxvd0xvb2tvbjtcdFx0XHRcdFx0Ly/lhYHorrjml4Hop4JcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiR2FtZVN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2JBbGxvd0xvb2tvbiA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfVVNFUl9DSEFUOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dGX1VTRVJfQ0hBVFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR2xvYmFsRGVmLlNVQl9HRl9NRVNTQUdFOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dGX01FU1NBR0VcIik7XG4gICAgICAgICAgICAgICAgLy/mtojmga/mlbDmja7ljIVcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX01lc3NhZ2VcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdNZXNzYWdlVHlwZTtcdFx0XHRcdFx0XHQvL+a2iOaBr+exu+Wei1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3TWVzc2FnZUxlbmd0aDtcdFx0XHRcdFx0XHQvL+a2iOaBr+mVv+W6plxuICAgICAgICAgICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pDb250ZW50WzEwMjRdO1x0XHRcdFx0XHQvL+a2iOaBr+WGheWuuVxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgLy/mtojmga/lpITnkIZcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHt9O1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uud01lc3NhZ2VUeXBlID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLndNZXNzYWdlTGVuZ3RoID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLnN6Q29udGVudCA9IHBEYXRhLnJlYWRzdHJpbmcobWVzc2FnZS53TWVzc2FnZUxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5HYW1lRnJhbWVdIG1lc3NhZ2UgPSBcIiArIG1lc3NhZ2Uuc3pDb250ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBHbG9iYWxEZWYuU01UX0NMT1NFX0dBTUUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLndNZXNzYWdlVHlwZSAmIEdsb2JhbERlZi5TTVRfRUpFQ1QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5HYW1lRnJhbWVdIG1lc3NhZ2UgPSBcIiArIG1lc3NhZ2Uuc3pDb250ZW50ICsgXCIgdHlwZSA9IFwiICsgbWVzc2FnZS53TWVzc2FnZVR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBHbG9iYWxEZWYuU01UX0dMT0JBTCl7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfU0NFTkU6XG4gICAgICAgICAgICAgICAgLy/muLjmiI/lnLrmma9cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9TQ0VORVwiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudEdhbWVTY2VuZVwiLHtcbiAgICAgICAgICAgICAgICAgICAgY2JHYW1lU3RhdHVzOnRoaXMuX2NiR2FtZVN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgcERhdGE6cERhdGEsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v55So5oi36L+b5YWlXG4gICAgT25Tb2NrZXRTdWJVc2VyQ29tZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckNvbWVdXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckNvbWVdIHBEYXRhIGxlbiA9IFwiICsgcERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHZhciB1c2VySXRlbSA9IG5ldyBHYW1lVXNlckl0ZW0oKTtcbiAgICAgICAgdXNlckl0ZW0uaW5pdERhdGFCeVVzZXJJbmZvSGVhZChwRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJVc2VyQ29tZV0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VySXRlbSkpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXTtcbiAgICAgICAgLy8gaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXSA9IHVzZXJJdGVtO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8v6K6w5b2V6Ieq5bex55qE5qGM5Y+3XG4gICAgICAgIGlmICh1c2VySXRlbS5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dUYWJsZUlEID0gdXNlckl0ZW0ud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJJdGVtLndDaGFpcklEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VySXRlbS53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgJiYgdXNlckl0ZW0ud0NoYWlySUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRhVGFibGVVc2VyKHVzZXJJdGVtLndUYWJsZUlELHVzZXJJdGVtLndDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlckVudGVyXCIse1xuICAgICAgICAgICAgICAgIHdUYWJsZUlEOnVzZXJJdGVtLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIHdDaGFpcklEOnVzZXJJdGVtLndDaGFpcklELFxuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdXCIpO1xuICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTdGF0dXNcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOS9jee9rlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/mlbDmja7lupMgSURcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgdXNlclN0YXR1cyA9IHt9O1xuICAgICAgICB1c2VyU3RhdHVzLndUYWJsZUlEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdXNlclN0YXR1cy5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHVzZXJTdGF0dXMud0NoYWlySUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuXG4gICAgICAgIHZhciB1c2VySXRlbSA9IHRoaXMuc2VhcmNoVXNlckJ5VXNlcklEKHVzZXJTdGF0dXMuZHdVc2VySUQpO1xuICAgICAgICB2YXIgbXlVc2VySXRlbSA9IHRoaXMuZ2V0TWVVc2VySXRlbSgpO1xuICAgICAgICBpZiAoIW15VXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOacquaJvuWIsOiHquW3sVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL+aJvuS4jeWIsOeUqOaIt1xuICAgICAgICBpZiAoIXVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmib7kuI3liLDnlKjmiLdcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy/orrDlvZXml6fnirbmgIFcbiAgICAgICAgdmFyIG9sZFN0YXR1cyA9IHt9O1xuICAgICAgICBvbGRTdGF0dXMud1RhYmxlSUQgPSB1c2VySXRlbS53VGFibGVJRDtcbiAgICAgICAgb2xkU3RhdHVzLndDaGFpcklEID0gdXNlckl0ZW0ud0NoYWlySUQ7XG4gICAgICAgIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPSB1c2VySXRlbS5jYlVzZXJTdGF0dXM7XG5cbiAgICAgICAgLy/mm7TmlrDkv6Hmga9cbiAgICAgICAgdXNlckl0ZW0uY2JVc2VyU3RhdHVzID0gdXNlclN0YXR1cy5jYlVzZXJTdGF0dXM7XG4gICAgICAgIHVzZXJJdGVtLndUYWJsZUlEID0gdXNlclN0YXR1cy53VGFibGVJRDtcbiAgICAgICAgdXNlckl0ZW0ud0NoYWlySUQgPSB1c2VyU3RhdHVzLndDaGFpcklEO1xuXG4gICAgICAgIC8v5riF6Zmk5pen5qGM5a2Q5qSF5a2Q6K6w5b2VXG4gICAgICAgIGlmKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgIC8v5paw5pen5qGM5a2Q5LiN5ZCMIOaWsOaXp+akheWtkOS4jeWQjFxuICAgICAgICAgICAgaWYgKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gdXNlclN0YXR1cy53VGFibGVJRCB8fCBvbGRTdGF0dXMud0NoYWlySUQgIT09IHVzZXJTdGF0dXMud0NoYWlySUQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVXBEYXRhVGFibGVVc2VyKG9sZFN0YXR1cy53VGFibGVJRCwgb2xkU3RhdHVzLndDaGFpcklELCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5paw5qGM5a2Q6K6w5b2VXG4gICAgICAgIGlmICh1c2VyU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgdGhpcy5vblVwRGF0YVRhYmxlVXNlcih1c2VyU3RhdHVzLndUYWJsZUlELCB1c2VyU3RhdHVzLndDaGFpcklELCB1c2VySXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+iHquW3seeKtuaAgVxuICAgICAgICBpZiAobXlVc2VySXRlbS5kd1VzZXJJRCA9PT0gdXNlclN0YXR1cy5kd1VzZXJJRCkge1xuICAgICAgICAgICAgdGhpcy5fd1RhYmxlSUQgPSB1c2VyU3RhdHVzLndUYWJsZUlEO1xuICAgICAgICAgICAgdGhpcy5fd0NoYWlySUQgPSB1c2VyU3RhdHVzLndDaGFpcklEO1xuXG4gICAgICAgICAgICAvL+emu+W8gFxuICAgICAgICAgICAgaWYgKHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID09PSBHbG9iYWxEZWYuVVNfTlVMTCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3seemu+W8gFwiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FeGl0Um9vbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v6LW356uLXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX0ZSRUUgJiYgb2xkU3RhdHVzLmNiVXNlclN0YXR1cyA+IEdsb2JhbERlZi5VU19GUkVFKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex6LW356uLXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV4aXRUYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Z2Q5LiLXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA+IEdsb2JhbERlZi5VU19GUkVFICYmIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPCBHbG9iYWxEZWYuVVNfU0lUKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex5Z2Q5LiLXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkVudGVyVGFibGVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+aNouS9jVxuICAgICAgICAgICAgZWxzZSBpZiAodXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDmjaLkvY1cIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJUYWJsZVwiKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOiHquW3seaWsOeKtuaAgSBcIiArIEpTT04uc3RyaW5naWZ5KHVzZXJTdGF0dXMpKTtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+S7luS6uueKtuaAgVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8v5pu05paw55So5oi3XG4gICAgICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSB8fCB1c2VyU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/liKDpmaTnlKjmiLdcbiAgICAgICAgICAgIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA9PT0gR2xvYmFsRGVmLlVTX05VTEwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlVXNlcih1c2VyU3RhdHVzLmR3VXNlcklEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJTY29yZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2NvcmVdXCIpO1xuICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTY29yZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRsTG92ZWxpbmVzcztcdFx0XHRcdFx0XHQvL+eUqOaIt+mtheWKm1xuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/mtojotLnph5HosYZcbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HosYZcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgICAgICAvLyAgICAgdGFnVXNlclNjb3JlXHRcdFx0XHRcdFVzZXJTY29yZTtcdFx0XHRcdFx0XHRcdC8v56ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ1VzZXJTY29yZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/lrZjlgqjph5HluIFcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3N0Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+Wksei0peebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxEcmF3Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+WSjOWxgOebmOaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxFeHBlcmllbmNlO1x0XHRcdFx0XHRcdC8v55So5oi357uP6aqMXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHVzZXJTY29yZSA9IHt9O1xuICAgICAgICB1c2VyU2NvcmUubExvdmVsaW5lc3MgPSBwRGF0YS5yZWFkaW50KCk7IC8v55So5oi36a2F5YqbXG4gICAgICAgIHVzZXJTY29yZS5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAvL+eUqOaIt0lEXG4gICAgICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUgPSB7fTtcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubEdhbWVHb2xkID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/lrZjlgqjph5HluIFcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sV2luQ291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeebmOaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxMb3N0Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl55uY5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubERyYXdDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sRmxlZUNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+aVsOebrlxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxFeHBlcmllbmNlID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG5cbiAgICAgICAgLy/oh6rlt7Hkv6Hmga9cbiAgICAgICAgdmFyIG15VXNlckl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgdmFyIHVzZXJJdGVtID0gdGhpcy5zZWFyY2hVc2VyQnlVc2VySUQodXNlclNjb3JlLmR3VXNlcklEKTtcbiAgICAgICAgLy8gaWYgKHVzZXJTY29yZS5kd1VzZXJJRCA9PSBteVVzZXJJdGVtLmR3VXNlcklEKSB7XG4gICAgICAgIGlmICghdXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTY29yZV0g5pu05pawIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlclNjb3JlKSk7XG4gICAgICAgICAgICB1c2VySXRlbS5sU2NvcmUgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxTY29yZTtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxHYW1lR29sZCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEdhbWVHb2xkO1xuICAgICAgICAgICAgdXNlckl0ZW0ubFdpbkNvdW50ID0gdXNlclNjb3JlLlVzZXJTY29yZS5sV2luQ291bnQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sTG9zdENvdW50ID0gdXNlclNjb3JlLlVzZXJTY29yZS5sTG9zdENvdW50O1xuICAgICAgICAgICAgdXNlckl0ZW0ubERyYXdDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubERyYXdDb3VudDtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxGbGVlQ291bnQgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxGbGVlQ291bnQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sRXhwZXJpZW5jZSA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEV4cGVyaWVuY2U7XG4gICAgICAgICAgICB1c2VySXRlbS5sTG92ZWxpbmVzcyA9IHVzZXJTY29yZS5sTG92ZWxpbmVzcztcbiAgICAgICAgfVxuICAgICAgICAvL+mAmuefpeabtOaWsOeVjOmdolxuICAgICAgICBpZih0aGlzLl93VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclNjb3JlXCIse1xuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViUmlnaHQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlJpZ2h0XVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViTWVtYmVyT3JkZXI6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1Yk1lbWJlck9yZGVyXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU2l0RmFpbGVkOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTaXRGYWlsZWRdXCIpO1xuICAgICAgICAvL+WdkOS4i+Wksei0pVxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1NpdEZhaWxlZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pGYWlsZWREZXNjcmliZVsyNTZdO1x0XHRcdFx0Ly/plJnor6/mj4/ov7BcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHN6RmFpbGVkRGVzY3JpYmUgPSBwRGF0YS5yZWFkc3RyaW5nKDI1Nik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTaXRGYWlsZWRdIFwiICsgc3pGYWlsZWREZXNjcmliZSk7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YkNoYXQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YkNoYXRdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJXaXNwZXI6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1Yldpc3Blcl1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlVzZXJJbnZpdGU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJJbnZpdGVdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJRdWVyeUdvbGQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlF1ZXJ5R29sZF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlByZXNlbnRRdWVyeTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViUHJlc2VudFF1ZXJ5XVwiKTtcbiAgICB9LFxuICAgIHNlbmRMb2dvblBhY2tldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bc2VuZExvZ29uUGFja2V0XVwiKTtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX0xPR09OLGdhbWVfY21kLlNVQl9HUl9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHdvcmQoR2xvYmFsVXNlckRhdGEud0VuY3J5cHRJRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNod29yZChHbG9iYWxVc2VyRGF0YS53Q29kZUNoZWNrSUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEKTtcblxuICAgICAgICB2YXIgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMjtcbiAgICAgICAgfVxuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKGR3TW9iaWxlU3lzVHlwZSk7XG5cbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCwzMyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bc2VuZExvZ29uUGFja2V0XSBwYXNzd29yZCA9IFwiICsgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgICAgIC8vIC8v5omL5py655m76ZmGXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRE1vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdXZWlYaW5DaGVja0lEO1x0XHRcdFx0XHQvL+W+ruS/oemqjOivgeeggVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVTeXNUeXBlO1x0XHRcdFx0XHQvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBWZXJzaW9uO1x0XHRcdFx0XHQvL+a4uOaIj0FQUOeJiOacrOWPtyjkuI7nmbvpmYblpKfljoXnm7jlkIwpXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pQYXNzV29yZFtQQVNTX0xFTl07XHRcdFx0XHQvL+eZu+W9leWvhueggVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dO1x0Ly/mnLrlmajluo/liJflj7dcbiAgICAgICAgLy8gfTtcbiAgICB9LFxuICAgIC8v5Z2Q5LiL6K+35rGCXG4gICAgc2VuZFNpdERvd25QYWNrZXQ6IGZ1bmN0aW9uICh3VGFibGVJRCwgd0NoYWlySUQsIHN6UGFzc1dvcmQpIHtcbiAgICAgICAgLy/or7fmsYLlnZDkuItcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Vc2VyU2l0UmVxXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiUGFzc0xlbjtcdFx0XHRcdFx0XHRcdC8v5a+G56CB6ZW/5bqmXG4gICAgICAgIC8vICAgICAvL0RXT1JEXHRcdFx0XHRcdFx0XHRkd0Fuc3dlcklEO1x0XHRcdFx0XHRcdFx0Ly/lm57nrZQgSSBELy/lhbzlrrnnp6/liIbmuLjmiI/lhaXluqfpl67pophcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzelRhYmxlUGFzc1tQQVNTX0xFTl07XHRcdFx0XHQvL+ahjOWtkOWvhueggVxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgc2l0RGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgc2l0RGF0YS5zZXRjbWRpbmZvKGdhbWVfY21kLk1ETV9HUl9VU0VSLGdhbWVfY21kLlNVQl9HUl9VU0VSX1NJVF9SRVEpO1xuICAgICAgICB2YXIgY2JQYXNzTGVuID0gMDtcbiAgICAgICAgaWYgKHN6UGFzc1dvcmQpIHtcbiAgICAgICAgICAgIGNiUGFzc0xlbiA9IHN6UGFzc1dvcmQubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgc2l0RGF0YS5wdXNoYnl0ZShjYlBhc3NMZW4pO1xuICAgICAgICBzaXREYXRhLnB1c2h3b3JkKHdDaGFpcklEKTtcbiAgICAgICAgc2l0RGF0YS5wdXNod29yZCh3VGFibGVJRCk7XG4gICAgICAgIHNpdERhdGEucHVzaHN0cmluZyhzelBhc3NXb3JkLEdsb2JhbERlZi5QQVNTX0xFTik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZTEgPSBcIiArIHNpdERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHZhciBzZW5kU2l6ZSA9IHNpdERhdGEuZ2V0RGF0YVNpemUoKSAtIEdsb2JhbERlZi5QQVNTX0xFTiArIGNiUGFzc0xlbjtcbiAgICAgICAgY29uc29sZS5sb2coXCJzaXplMiA9IFwiICsgc2VuZFNpemUpO1xuICAgICAgICBzaXREYXRhLnNldERhdGFTaXplKHNlbmRTaXplKTtcblxuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoc2l0RGF0YSk7XG4gICAgfSxcbiAgICAvL+ermei1t+adpVxuICAgIHNlbmRTdGFuZHVwUGFja2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX1VTRVIsIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQU5EVVBfUkVRKTtcblxuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGRhdGEpO1xuICAgIH0sXG4gICAgc2VuZExlZnRHYW1lUGFja2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX1VTRVIsIGdhbWVfY21kLlNVQl9HUl9VU0VSX0xFRlRfR0FNRV9SRVEpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICAvL+WPkemAgeWHhuWkh1xuICAgIHNlbmRVc2VyUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhHbG9iYWxEZWYuTURNX0dGX0ZSQU1FLCBHbG9iYWxEZWYuU1VCX0dGX1VTRVJfUkVBRFkpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICBvblVwRGF0YVRhYmxlVXNlcjogZnVuY3Rpb24gKHRhYmxlaWQsY2hhaXJpZCx1c2VyaXRlbSkge1xuICAgICAgICB2YXIgaWQgPSB0YWJsZWlkO1xuICAgICAgICB2YXIgaWRleCA9IGNoYWlyaWQ7XG4gICAgICAgIGlmICghdGhpcy5fdGFibGVVc2VyTGlzdFtpZF0pIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXVtpZGV4XSA9IHVzZXJpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdFtpZF1baWRleF0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v6I635Y+W5qGM5a2Q55So5oi3XG4gICAgZ2V0VGFibGVVc2VySXRlbTogZnVuY3Rpb24gKHRhYmxlaWQsY2hhaXJpZCkge1xuICAgICAgICB2YXIgaWQgPSB0YWJsZWlkO1xuICAgICAgICB2YXIgaWRleCA9IGNoYWlyaWQ7XG4gICAgICAgIGlmICh0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRUYWJsZUluZm86IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDaGFpckNvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93Q2hhaXJDb3VudDsgIFxuICAgIH0sXG4gICAgZ2V0VGFibGVDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd1RhYmxlQ291bnQ7ICBcbiAgICB9LFxuICAgIC8v6I635Y+W5qGM5a2QSURcbiAgICBnZXRUYWJsZUlEOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3dUYWJsZUlEO1xuICAgIH0sXG4gICAgLy/ojrflj5bmpIXlrZBJRFxuICAgIGdldENoYWlySUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fd0NoYWlySUQ7ICBcbiAgICB9LFxuICAgIC8v6I635Y+W5ri45oiP54q25oCBXG4gICAgZ2V0R2FtZVN0YXR1czogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2JHYW1lU3RhdHVzOyAgXG4gICAgfSxcbiAgICAvL+iuvue9rua4uOaIj+eKtuaAgVxuICAgIHNldEdhbWVTdGF0dXM6IGZ1bmN0aW9uIChjYkdhbWVTdGF0dXMpIHtcbiAgICAgICAgdGhpcy5fY2JHYW1lU3RhdHVzID0gY2JHYW1lU3RhdHVzO1xuICAgIH0sXG4gICAgLy/ojrflj5boh6rlt7HmuLjmiI/kv6Hmga9cbiAgICBnZXRNZVVzZXJJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTGlzdFtHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRF07XG4gICAgfSxcbiAgICBzZWFyY2hVc2VyQnlVc2VySUQ6IGZ1bmN0aW9uIChkd1VzZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxpc3RbZHdVc2VySURdO1xuICAgIH0sXG4gICAgb25SZW1vdmVVc2VyOiBmdW5jdGlvbiAoZHdVc2VySUQpIHtcbiAgICAgICAgdGhpcy5fdXNlckxpc3RbZHdVc2VySURdID0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcblxudmFyIEdhbWVNb2RlbCA9IGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uTG9hZF1cIik7XG4gICAgICAgIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gR2FtZUZyYW1lTm9kZS5nZXRDb21wb25lbnQoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vbkluaXRHYW1lRW5naW5lKCk7XG4gICAgICAgIHRoaXMubV9iT25HYW1lID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9jYkdhbWVTdGF0dXMgPSAtMTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25FbmFibGVdXCIpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRHYW1lU2NlbmVcIix0aGlzLm9uRXZlbnRHYW1lU2NlbmUsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudFVzZXJFbnRlclwiLHRoaXMub25FdmVudFVzZXJFbnRlcix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oXCJvbkV2ZW50VXNlclN0YXR1c1wiLHRoaXMub25FdmVudFVzZXJTdGF0dXMsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudFVzZXJTY29yZVwiLHRoaXMub25FdmVudFVzZXJTY29yZSx0aGlzKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uRGlzYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoXCJvbkV2ZW50R2FtZVNjZW5lXCIsdGhpcy5vbkV2ZW50R2FtZVNjZW5lLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoXCJvbkV2ZW50VXNlckVudGVyXCIsdGhpcy5vbkV2ZW50VXNlckVudGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHRoaXMub25FdmVudFVzZXJTdGF0dXMsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRVc2VyU2NvcmVcIix0aGlzLm9uRXZlbnRVc2VyU2NvcmUsdGhpcyk7XG4gICAgfSxcbiAgICAvL+WIneWni+WMlua4uOaIj+aVsOaNrlxuICAgIG9uSW5pdEdhbWVFbmdpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkluaXRHYW1lRW5naW5lXVwiKTtcbiAgICAgICAgdGhpcy5fQ2xvY2tGdW4gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX0Nsb2NrSUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNO1xuICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSAwO1xuICAgICAgICB0aGlzLl9DbG9ja0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgfSxcbiAgICAvL+mHjee9ruahhuaetlxuICAgIG9uUmVzZXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICB0aGlzLm1fYk9uR2FtZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgLy/pgIDlh7ror6Lpl65cbiAgICBvblF1ZXJ5RXhpdEdhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vbkV4aXRUYWJsZSgpO1xuICAgIH0sXG4gICAgc3RhbmRVcEFuZFF1aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvL+mAgOWHuuahjOWtkFxuICAgIG9uRXhpdFRhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuXG4gICAgICAgIHZhciBteUl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgaWYgKG15SXRlbSAmJiBteUl0ZW0uY2JVc2VyU3RhdHVzID4gR2xvYmFsRGVmLlVTX0ZSRUUpIHtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kU3RhbmR1cFBhY2tldCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkV4aXRSb29tOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpOyAgXG4gICAgfSxcbiAgICBvbktleUJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vblF1ZXJ5RXhpdEdhbWUoKTtcbiAgICB9LFxuICAgIC8v6I635Y+W6Ieq5bex5qSF5a2QXG4gICAgZ2V0TWVDaGFpcklEOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lRnJhbWUuZ2V0Q2hhaXJJRCgpO1xuICAgIH0sXG4gICAgLy/ojrflj5boh6rlt7HmoYzlrZBcbiAgICBnZXRNZVRhYmxlSUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVGcmFtZS5nZXRUYWJsZUlEKCk7XG4gICAgfSxcbiAgICBnZXRNZVVzZXJJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lRnJhbWUuZ2V0TWVVc2VySXRlbSgpO1xuICAgIH0sXG4gICAgLy8g5qSF5a2Q5Y+36L2s6KeG5Zu+5L2N572uLOazqOaEj+akheWtkOWPt+S7jjB+bkNoYWlyQ291bnQtMSzov5Tlm57nmoTop4blm77kvY3nva7ku44xfm5DaGFpckNvdW50XG4gICAgc3dpdGNoVmlld0NoYWlySUQ6IGZ1bmN0aW9uIChjaGFpcikge1xuICAgICAgICB2YXIgdmlld0lEID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgICAgIHZhciBuQ2hhaXJDb3VudCA9IHRoaXMuX2dhbWVGcmFtZS5nZXRDaGFpckNvdW50KCk7ICBcbiAgICAgICAgdmFyIG5DaGFpcklEID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKGNoYWlyICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUiAmJiBjaGFpciA8IG5DaGFpckNvdW50KSB7XG4gICAgICAgICAgICB2aWV3SUQgPSAoKGNoYWlyICsgTWF0aC5mbG9vcihuQ2hhaXJDb3VudCAqIDMvMikgLSBuQ2hhaXJJRCklKG5DaGFpckNvdW50KSkgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2aWV3SUQ7XG4gICAgfSxcbiAgICAvL+aYr+WQpuWQiOazleinhuWbvklEXG4gICAgaXNWYWxpZFZpZXdJRDogZnVuY3Rpb24gKHZpZXdJRCkge1xuICAgICAgICB2YXIgbkNoYWlyQ291bnQgPSB0aGlzLl9nYW1lRnJhbWUuZ2V0Q2hhaXJDb3VudCgpO1xuICAgICAgICByZXR1cm4gKHZpZXdJRCA+IDApICYmICh2aWV3SUQgPD0gbkNoYWlyQ291bnQpOyAgXG4gICAgfSxcbiAgICAvL+iuvue9ruiuoeaXtuWZqFxuICAgIHNldEdhbWVDbG9jazogZnVuY3Rpb24gKGNoYWlyLCBpZCwgdGltZSkge1xuICAgICAgICBpZiAoIXRoaXMuX0Nsb2NrRnVuKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLl9DbG9ja0Z1biA9IGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNjaGVkdWxlKHRoaXMub25DbG9ja1VwZGF0YSwgdGhpcywgMSwgZmFsc2UpO1xuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5fQ2xvY2tDaGFpciA9IGNoYWlyO1xuICAgICAgICB0aGlzLl9DbG9ja0lEID0gaWQ7XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IHRpbWU7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChjaGFpcik7XG4gICAgICAgIHRoaXMub25VcGRhdGFDbG9ja1ZpZXcoKTtcbiAgICB9LFxuICAgIC8v5YWz6Zet6K6h5pe25ZmoXG4gICAga2lsbEdhbWVDbG9jazogZnVuY3Rpb24gKG5vdFZpZXcpIHtcbiAgICAgICAgdGhpcy5fQ2xvY2tJRCA9IEdsb2JhbERlZi5JTlZBTElEX0lURU07XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0Nsb2NrQ2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgdGhpcy5fQ2xvY2tWaWV3Q2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgaWYgKHRoaXMuX0Nsb2NrRnVuKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2hlZHVsZXIoKS51bnNjaGVkdWxlKHRoaXMub25DbG9ja1VwZGF0YSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9DbG9ja0Z1biA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSAgXG4gICAgICAgIGlmICghIG5vdFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGFDbG9ja1ZpZXcoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2xvY2tWaWV3SUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0Nsb2NrVmlld0NoYWlyO1xuICAgIH0sXG4gICAgLy/orqHml7blmajmm7TmlrBcbiAgICBvbkNsb2NrVXBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9DbG9ja0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNKSB7XG4gICAgICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSB0aGlzLl9DbG9ja1RpbWUgLSAxO1xuICAgICAgICAgICAgdmFyIHJldCA9IHRoaXMub25FdmVudEdhbWVDbG9ja0luZm8odGhpcy5fQ2xvY2tDaGFpciwgdGhpcy5fQ2xvY2tUaW1lLCB0aGlzLl9DbG9ja0lEKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IHRydWUgfHwgdGhpcy5fQ2xvY2tUaW1lIDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5vblVwZGF0YUNsb2NrVmlldygpO1xuICAgIH0sXG4gICAgLy/mm7TmlrDorqHml7blmajmmL7npLpcbiAgICBvblVwZGF0YUNsb2NrVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBvblVwZGF0YUNsb2NrVmlld1xuICAgIH0sXG4gICAgLy/nlKjmiLfnirbmgIEgXG4gICAgb25FdmVudFVzZXJTdGF0dXM6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gcGFyYW1zID0ge3VzZXJJdGVtOixuZXdTdGF0dXMsb2xkU3RhdHVzLH1cbiAgICAgICAgdmFyIHVzZXJJdGVtID0gcGFyYW1zLnVzZXJJdGVtO1xuICAgICAgICB2YXIgbmV3U3RhdHVzID0gcGFyYW1zLm5ld1N0YXR1cztcbiAgICAgICAgdmFyIG9sZFN0YXR1cyA9IHBhcmFtcy5vbGRTdGF0dXM7XG4gICAgICAgIHZhciBteVRhYmxlID0gdGhpcy5nZXRNZVRhYmxlSUQoKTtcbiAgICAgICAgdmFyIG15Q2hhaXIgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuXG4gICAgICAgIGlmICghbXlUYWJsZSB8fCBteVRhYmxlID09PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8v5pen55qE5riF6ZmkXG4gICAgICAgIGlmIChvbGRTdGF0dXMud1RhYmxlSUQgPT09IG15VGFibGUpIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKG9sZFN0YXR1cy53Q2hhaXJJRCk7XG4gICAgICAgICAgICBpZiAodmlld0lEICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICAvLyBvblVwZGF0ZVVzZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+abtOaWsOaWsOeKtuaAgVxuICAgICAgICBpZiAobmV3U3RhdHVzLndUYWJsZUlEID09PSBteVRhYmxlKSB7XG4gICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChuZXdTdGF0dXMud0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v55So5oi356ev5YiGXG4gICAgb25FdmVudFVzZXJTY29yZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBwYXJhbXMgPSB7dXNlclNjb3JlLH1cbiAgICAgICAgdmFyIHVzZXJJdGVtID0gcGFyYW1zLnVzZXJJdGVtO1xuICAgICAgICB2YXIgbXlUYWJsZSA9IHRoaXMuZ2V0TWVUYWJsZUlEKCk7XG4gICAgICAgIGlmICghbXlUYWJsZSB8fCBteVRhYmxlID09PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChteVRhYmxlID09PSB1c2VySXRlbS53VGFibGVJRCkge1xuICAgICAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQodXNlckl0ZW0ud0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v55So5oi36L+b5YWlXG4gICAgb25FdmVudFVzZXJFbnRlcjogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBwYXJhbXMgPSB7d1RhYmxlSUQsd0NoYWlySUQsdXNlckl0ZW0sfVxuICAgICAgICB2YXIgd1RhYmxlSUQgPSBwYXJhbXMud1RhYmxlSUQ7XG4gICAgICAgIHZhciB3Q2hhaXJJRCA9IHBhcmFtcy53Q2hhaXJJRDtcbiAgICAgICAgdmFyIHVzZXJJdGVtID0gcGFyYW1zLnVzZXJJdGVtO1xuXG4gICAgICAgIHZhciBteVRhYmxlID0gdGhpcy5nZXRNZVRhYmxlSUQoKTtcbiAgICAgICAgaWYgKCFteVRhYmxlIHx8IG15VGFibGUgPT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG15VGFibGUgPT09IHdUYWJsZUlEKSB7XG4gICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRCh3Q2hhaXJJRCk7XG4gICAgICAgICAgICBpZiAodmlld0lEICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICAvLyBvblVwZGF0ZVVzZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lj5HpgIHlh4blpIdcbiAgICBzZW5kVXNlclJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kVXNlclJlYWR5KCk7XG4gICAgfSxcbiAgICAvL+WPkemAgeaVsOaNrlxuICAgIHNlbmREYXRhIDogZnVuY3Rpb24gKHN1YiwgZGF0YUJ1Zikge1xuICAgICAgICBpZiAodGhpcy5fZ2FtZUZyYW1lKSB7XG4gICAgICAgICAgICBkYXRhQnVmLnNldGNtZGluZm8oR2xvYmFsRGVmLk1ETV9HRl9HQU1FLCBzdWIpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTb2NrZXREYXRhKGRhdGFCdWYpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v5Zy65pmv5raI5oGvXG4gICAgb25FdmVudEdhbWVTY2VuZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBcbiAgICB9LFxuICAgIC8v5ri45oiP5raI5oGvXG4gICAgb25FdmVudEdhbWVNZXNzYWdlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/orqHml7blmajlk43lupRcbiAgICBvbkV2ZW50R2FtZUNsb2NrSW5mbzogZnVuY3Rpb24gKGNoYWlyLCB0aW1lLCBjbG9ja0lEKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lTW9kZWw7IiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHYW1lTW9kZWwgPSByZXF1aXJlKFwiR2FtZU1vZGVsXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEdhbWVNb2RlbCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgLy8gbV9CdXR0b25fbWVudU9wZW46IGNjLlRvZ2dsZSxcbiAgICAgICAgbV9QYW5lbF9tZW51OmNjLk5vZGUsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB2YXIgR2FtZUZyYW1lTm9kZSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIC8vIGlmIChHYW1lRnJhbWVOb2RlKXtcbiAgICAgICAgLy8gICAgIHRoaXMuX2dhbWVGcmFtZSA9IEdhbWVGcmFtZU5vZGUuZ2V0Q29tcG9uZW50KFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgb25Jbml0R2FtZUVuZ2luZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uSW5pdEdhbWVFbmdpbmVdXCIpO1xuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/lvZPliY3nlKjmiLdcbiAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7Ly/luoTlrrbnlKjmiLdcblxuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzID0gWzAsMCwwLDAsMF07Ly/muLjmiI/nirbmgIFcbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlID0gWzAsMCwwLDAsMF07Ly/kuIvms6jmlbDnm65cblxuICAgICAgICB0aGlzLm1fbE1heENlbGxTY29yZSA9IDA7Ly/ljZXlhYPkuIrpmZBcbiAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSAwOy8v5Y2V5YWD5LiL5rOoXG5cbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VGltZXMgPSAwOy8v5b2T5YmN5YCN5pWwXG4gICAgICAgIHRoaXMubV9sVXNlck1heFNjb3JlID0gMDsvL+acgOWkp+WIhuaVsFxuXG4gICAgICAgIHRoaXMubV9iTG9va0NhcmQgPSBbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdOy8v55yL54mM5Yqo5L2cXG5cbiAgICAgICAgdGhpcy5tX3dMb3N0VXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5q+U54mM5aSx6LSlXG4gICAgICAgIHRoaXMubV93V2lubmVyVXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v6IOc5Yip55So5oi3XG5cbiAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG5cbiAgICB9LFxuICAgIG9uUmVzZXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubV93Q3VycmVudFVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+W9k+WJjeeUqOaIt1xuICAgICAgICB0aGlzLm1fd0JhbmtlclVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+W6hOWutueUqOaIt1xuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzID0gWzAsMCwwLDAsMF07Ly/muLjmiI/nirbmgIFcbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlID0gWzAsMCwwLDAsMF07Ly/kuIvms6jmlbDnm65cbiAgICAgICAgdGhpcy5tX2xNYXhDZWxsU2NvcmUgPSAwOy8v5Y2V5YWD5LiK6ZmQXG4gICAgICAgIHRoaXMubV9sQ2VsbFNjb3JlID0gMDsvL+WNleWFg+S4i+azqFxuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUaW1lcyA9IDA7Ly/lvZPliY3lgI3mlbBcbiAgICAgICAgdGhpcy5tX2xVc2VyTWF4U2NvcmUgPSAwOy8v5pyA5aSn5YiG5pWwXG4gICAgICAgIHRoaXMubV9iTG9va0NhcmQgPSBbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdOy8v55yL54mM5Yqo5L2cXG4gICAgICAgIHRoaXMubV93TG9zdFVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+avlOeJjOWksei0pVxuICAgICAgICB0aGlzLm1fd1dpbm5lclVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+iDnOWIqeeUqOaIt1xuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlID0gMDtcbiAgICB9LFxuICAgIC8v6K6+572u6K6h5pe25ZmoXG4gICAgc2V0R2FtZUNsb2NrOiBmdW5jdGlvbiAoY2hhaXIsIGlkLCB0aW1lKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLmdldENsb2NrVmlld0lEKCk7XG4gICAgICAgIGlmICh2aWV3SUQgJiYgdmlld0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgLy/ml7bpl7Tov5vluqbmnaFcbiAgICAgICAgICAgIC8vdGhpcy5PbkV2ZW50R2FtZUNsb2NrSW5mbyh2aWV3SUQsIGlkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhbPpl63orqHml7blmahcbiAgICBraWxsR2FtZUNsb2NrOiBmdW5jdGlvbiAobm90Vmlldykge1xuICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5nZXRDbG9ja1ZpZXdJRCgpO1xuICAgICAgICBpZiAodmlld0lEICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8v5pe26Ze06L+b5bqm5p2hXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICB9LFxuICAgIC8v6I635b6X5b2T5YmN5q2j5Zyo546p55qE546p5a625pWw6YePXG4gICAgZ2V0UGxheWluZ051bTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbnVtID0gMDtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8PSB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tpbmRleF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICBudW0rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVtO1xuICAgIH0sXG4gICAgLy/ml7bpkp/lpITnkIZcbiAgICBPbkV2ZW50R2FtZUNsb2NrSW5mbzogZnVuY3Rpb24gKGNoYWlyLCB0aW1lLCBjbG9ja0lEKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoY2xvY2tJRCA9PT0gempoX2NtZC5JRElfU1RBUlRfR0FNRSkge1xuICAgICAgICAgICAgaWYgKHRpbWUgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FeGl0VGFibGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9ESVNBQkxFKSB7XG4gICAgICAgICAgICBpZiAodGltZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2xvY2tJRCA9PT0gempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkUpIHtcbiAgICAgICAgICAgIGlmICh0aW1lID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tX3dDdXJyZW50VXNlciA9PT0gdGhpcy5nZXRNZUNoYWlySUQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLm9uR2l2ZVVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9VU0VSX0NPTVBBUkVfQ0FSRCkge1xuICAgICAgICAgICAgaWYgKHRpbWUgPT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMub25BdXRvQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lnLrmma/mtojmga9cbiAgICBvbkV2ZW50R2FtZVNjZW5lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHBhcmFtcyA9IHtjYkdhbWVTdGF0dXMscERhdGEsfVxuICAgICAgICB2YXIgY2JHYW1lU3RhdHVzID0gcGFyYW1zLmNiR2FtZVN0YXR1cztcbiAgICAgICAgdmFyIHBEYXRhID0gcGFyYW1zLnBEYXRhO1xuICAgICAgICAvL+WIneWni+WMluW3suacieeOqeWutlxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHVzZXJJdGVtID0gdGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlVXNlckl0ZW0odGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlSUQoKSwgaW5kZXgpO1xuICAgICAgICAgICAgaWYgKCF1c2VySXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciB3Vmlld0NoYWlySUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGluZGV4KTtcbiAgICAgICAgICAgICAgICAvLyBPblVwZGF0ZVVzZXIod1ZpZXdDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lU2NlbmVdIHdWaWV3Q2hhaXJJRCA9IFwiICsgd1ZpZXdDaGFpcklEICsgXCIgdXNlckl0ZW0gPSBcIiArIEpTT04uc3RyaW5naWZ5KHVzZXJJdGVtKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChjYkdhbWVTdGF0dXMpIHtcbiAgICAgICAgICAgIGNhc2UgR2xvYmFsRGVmLkdTX0ZSRUU6XG4gICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfU3RhdHVzRnJlZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ2VsbFNjb3JlO1x0XHRcdFx0XHRcdFx0Ly/ln7rnoYDnp6/liIZcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHRoaXMubV9sQ2VsbFNjb3JlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICAgICAgICAgIC8vIHNldENlbGxTY29yZSh0aGlzLm1fbENlbGxTY29yZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5nZXRNZUNoYWlySUQoKSwgempoX2NtZC5JRElfU1RBUlRfR0FNRSwgempoX2NtZC5USU1FX1NUQVJUX0dBTUUpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5HU19QTEFZSU5HOlxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfU19TdGF0dXNQbGF5XG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICAvL+WKoOazqOS/oeaBr1xuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxNYXhDZWxsU2NvcmU7XHRcdFx0XHRcdFx0Ly/ljZXlhYPkuIrpmZBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ2VsbFNjb3JlO1x0XHRcdFx0XHRcdFx0Ly/ljZXlhYPkuIvms6hcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ3VycmVudFRpbWVzO1x0XHRcdFx0XHRcdC8v5b2T5YmN5YCN5pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFVzZXJNYXhTY29yZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+WIhuaVsOS4iumZkFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/nirbmgIHkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3QmFua2VyVXNlcjtcdFx0XHRcdFx0XHQvL+W6hOWutueUqOaIt1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHQgXHRcdFx0XHR3Q3VycmVudFVzZXI7XHRcdFx0XHRcdFx0Ly/lvZPliY3njqnlrrZcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdO1x0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIGJvb2xcdFx0XHRcdFx0XHRcdFx0Yk1pbmdaaHVbR0FNRV9QTEFZRVJdO1x0XHRcdFx0Ly/nnIvniYznirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsVGFibGVTY29yZVtHQU1FX1BMQVlFUl07XHRcdFx0Ly/kuIvms6jmlbDnm65cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gICAgIC8v5omR5YWL5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JIYW5kQ2FyZERhdGFbTUFYX0NPVU5UXTtcdFx0XHQvL+aJkeWFi+aVsOaNrlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/nirbmgIHkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyAgICAgYm9vbFx0XHRcdFx0XHRcdFx0XHRiQ29tcGFyZVN0YXRlO1x0XHRcdFx0XHRcdC8v5q+U54mM54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRXZlbnRHYW1lTWVzc2FnZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgc3ViID0gcGFyYW1zLmRldGFpbC5zdWI7XG4gICAgICAgIHZhciBwRGF0YSA9IHBhcmFtcy5kZXRhaWwucERhdGE7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25FdmVudEdhbWVNZXNzYWdlXSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRHYW1lTWVzc2FnZUNhbGxiYWNrID0ge1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0dBTUVfU1RBUlRdIDogdGhpcy5vblN1YkdhbWVTdGFydCwvL+a4uOaIj+W8gOWni1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0FERF9TQ09SRV0gOiB0aGlzLm9uU3ViQWRkU2NvcmUsLy/nlKjmiLfkuIvms6hcbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19MT09LX0NBUkRdIDogdGhpcy5vblN1Ykxvb2tDYXJkLC8v55yL54mM5raI5oGvXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfQ09NUEFSRV9DQVJEXSA6IHRoaXMub25TdWJDb21wYXJlQ2FyZCwvL+avlOeJjOa2iOaBr1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX09QRU5fQ0FSRF0gOiB0aGlzLm9uU3ViT3BlbkNhcmQsLy/lvIDniYzmtojmga9cbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19HSVZFX1VQXSA6IHRoaXMub25TdWJHaXZlVXAsLy/nlKjmiLfmlL7lvINcbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19QTEFZRVJfRVhJVF0gOiB0aGlzLm9uU3ViUGxheWVyRXhpdCwvL+eUqOaIt+W8uumAgFxuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0dBTUVfRU5EXSA6IHRoaXMub25TdWJHYW1lRW5kLC8v5ri45oiP57uT5p2fXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfV0FJVF9DT01QQVJFXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7Ly/nrYnlvoXmr5TniYxcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkV2ZW50R2FtZU1lc3NhZ2VdIFNVQl9TX1dBSVRfQ09NUEFSRVwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0xBU1RfQUREXSA6IHRoaXMub25TdWJMYXN0QWRkLC8vXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFjayAmJiB0aGlzLl9ldmVudEdhbWVNZXNzYWdlQ2FsbGJhY2tbc3ViXSkge1xuICAgICAgICAgICAgdmFyIGZ1biA9IHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFja1tzdWJdO1xuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lTWVzc2FnZV0gc3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJHYW1lU3RhcnQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdXCIpO1xuICAgICAgICAvL+a4uOaIj+W8gOWni1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfR2FtZVN0YXJ0XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIC8v5LiL5rOo5L+h5oGvXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxNYXhTY29yZTtcdFx0XHRcdFx0XHRcdC8v5pyA5aSn5LiL5rOoXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDZWxsU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+WNleWFg+S4i+azqFxuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ3VycmVudFRpbWVzO1x0XHRcdFx0XHRcdC8v5b2T5YmN5YCN5pWwXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxVc2VyTWF4U2NvcmU7XHRcdFx0XHRcdFx0Ly/liIbmlbDkuIrpmZBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLfkv6Hmga9cbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0JhbmtlclVzZXI7XHRcdFx0XHRcdFx0Ly/luoTlrrbnlKjmiLdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdCBcdFx0XHRcdHdDdXJyZW50VXNlcjtcdFx0XHRcdFx0XHQvL+W9k+WJjeeOqeWutlxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlBsYXlTdGF0dXNbR0FNRV9QTEFZRVJdO1x0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBnYW1lU3RhcnQgPSB7fTtcbiAgICAgICAgZ2FtZVN0YXJ0LmxNYXhTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LmxDZWxsU2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgIGdhbWVTdGFydC5sQ3VycmVudFRpbWVzID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBnYW1lU3RhcnQubFVzZXJNYXhTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LndCYW5rZXJVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGdhbWVTdGFydC5jYlBsYXlTdGF0dXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgZ2FtZVN0YXJ0LmNiUGxheVN0YXR1cy5wdXNoKHN0YXR1cyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1fbE1heFNjb3JlID0gZ2FtZVN0YXJ0LmxNYXhTY29yZTtcbiAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSBnYW1lU3RhcnQubENlbGxTY29yZTtcbiAgICAgICAgdGhpcy5tX2xVc2VyTWF4U2NvcmUgPSBnYW1lU3RhcnQubFVzZXJNYXhTY29yZTtcbiAgICAgICAgdGhpcy5tX3dDdXJyZW50VXNlciA9IGdhbWVTdGFydC5tX3dDdXJyZW50VXNlcjtcbiAgICAgICAgdGhpcy5tX3dCYW5rZXJVc2VyID0gZ2FtZVN0YXJ0Lm1fd0JhbmtlclVzZXI7XG4gICAgICAgIHRoaXMubV9pc0ZpcnN0QWRkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IDA7XG4gICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gMTtcbiAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG4gICAgICAgIHRoaXMubV9pc0ZsbG93QWx3YXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX2JMYXN0QWRkT3ZlciA9IGZhbHNlO1xuICAgICAgICAvL+aYvuekuuW6hOWutlxuICAgICAgICAvL+aYvuekuuW6leWIhlxuICAgICAgICAvL+aYvuekuuS4i+azqOeKtuaAgVxuICAgIH0sXG4gICAgb25TdWJBZGRTY29yZTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkFkZFNjb3JlXVwiKTtcbiAgICB9LFxuICAgIG9uU3ViTG9va0NhcmQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMb29rQ2FyZF1cIik7XG4gICAgfSxcbiAgICBvblN1YkNvbXBhcmVDYXJkOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViQ29tcGFyZUNhcmRdXCIpO1xuICAgIH0sXG4gICAgb25TdWJPcGVuQ2FyZDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1Yk9wZW5DYXJkXVwiKTtcbiAgICB9LFxuICAgIG9uU3ViR2l2ZVVwOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViR2l2ZVVwXVwiKTtcbiAgICB9LFxuICAgIG9uU3ViUGxheWVyRXhpdDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YlBsYXllckV4aXRdXCIpO1xuICAgIH0sXG4gICAgb25TdWJHYW1lRW5kOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViR2FtZUVuZF1cIik7XG4gICAgfSxcbiAgICBvblN1Ykxhc3RBZGQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMYXN0QWRkXVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tNZW51T3BlbjogZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICB0aGlzLm1fUGFuZWxfbWVudS5hY3RpdmUgPSB0b2dnbGUuaXNDaGVja2VkO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVRhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kU2l0RG93blBhY2tldChHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSxHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICB9LFxuICAgIG9uQ2xpY2tRdWl0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kU3RhbmR1cFBhY2tldCgpO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJQbGF6YVNjZW5lXCIpO1xuICAgIH0sXG4gICAgLy8gc2VuZERhdGEgOiBmdW5jdGlvbiAoc3ViLCBkYXRhQnVmKSB7XG4gICAgLy8gICAgIGlmICh0aGlzLl9nYW1lRnJhbWUpIHtcbiAgICAvLyAgICAgICAgIGRhdGFCdWYuc2V0Y21kaW5mbyhHbG9iYWxEZWYuTURNX0dGX0dBTUUsIHN1Yik7XG4gICAgLy8gICAgICAgICB0aGlzLl9nYW1lRnJhbWUuc2VuZFNvY2tldERhdGEoZGF0YUJ1Zik7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9LFxuICAgIC8v5Yqg5rOoXG4gICAgb25TZW5kQWRkU2NvcmU6IGZ1bmN0aW9uIChsQ3VycmVudFNjb3JlKSB7XG4gICAgICAgIC8v55So5oi35Yqg5rOoXG4gICAgICAgIC8vIHN0cnVjdCBDTURfQ19BZGRTY29yZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/liqDms6jmlbDnm65cbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1N0YXRlO1x0XHRcdFx0XHRcdFx0XHQvL+W9k+WJjeeKtuaAgVxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgZGF0YUJ1Zi5wdXNoaW50KGxDdXJyZW50U2NvcmUpO1xuICAgICAgICBkYXRhQnVmLnB1c2h3b3JkKDApO1xuICAgICAgICB0aGlzLnNlbmREYXRhKHpqaF9jbWQuU1VCX0NfQUREX1NDT1JFLGRhdGFCdWYpO1xuICAgIH0sXG4gICAgLy/nlKjmiLfmr5TniYxcbiAgICBvblN1YkNvbXBhcmVDYXJkOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdhbWVTZXJ2ZXJJdGVtID0gY2MuQ2xhc3Moe1xuICAgIHdTb3J0SUQ6IHVuZGVmaW5lZCxcbiAgICB3S2luZElEOiB1bmRlZmluZWQsXG4gICAgd1NlcnZlcklEOiB1bmRlZmluZWQsXG4gICAgd1N0YXRpb25JRDogdW5kZWZpbmVkLFxuICAgIHdTZXJ2ZXJQb3J0OiB1bmRlZmluZWQsXG4gICAgZHdTZXJ2ZXJBZGRyOiB1bmRlZmluZWQsXG4gICAgZHdPbkxpbmVDb3VudDogdW5kZWZpbmVkLFxuICAgIHN6U2VydmVyTmFtZTogdW5kZWZpbmVkLFxuICAgIGN0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09KiBHYW1lU2VydmVySXRlbSBjdG9yICAqPT09PT1cIilcbiAgICAgICAgdGhpcy53U29ydElEID0gMDtcbiAgICAgICAgdGhpcy53S2luZElEID0gMDtcbiAgICAgICAgdGhpcy53U2VydmVySUQgPSAwO1xuICAgICAgICB0aGlzLndTdGF0aW9uSUQgPSAwO1xuICAgICAgICB0aGlzLndTZXJ2ZXJQb3J0ID0gMDtcbiAgICAgICAgdGhpcy5kd1NlcnZlckFkZHIgPSAwO1xuICAgICAgICB0aGlzLmR3T25MaW5lQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnN6U2VydmVyTmFtZSA9IFwiXCI7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uKHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT0qIEdhbWVTZXJ2ZXJJdGVtIG9uSW5pdCAgKj09PT09XCIpXG4gICAgICAgIHRoaXMud1NvcnRJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud0tpbmRJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud1NlcnZlcklEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U3RhdGlvbklEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy53U2VydmVyUG9ydCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdTZXJ2ZXJBZGRyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdPbkxpbmVDb3VudCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLnN6U2VydmVyTmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoMzIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImxlbiA9IFwiK3BEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICB3aGlsZSh0cnVlKXtcbiAgICAgICAgICAgIC8v6buY6K6k5L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9OVUxMXHRcdFx0XHRcdDBcdFx0XHRcdFx0XHRcdFx0Ly/ml6DmlYjmlbDmja5cbiAgICAgICAgICAgIC8v5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0xFVkVMXHRcdDMwMDBcdFx0XHRcdFx0XHRcdC8v5oi/6Ze0562J57qnXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0NFTExcdFx0MzAwMVx0XHRcdFx0XHRcdFx0Ly/miL/pl7TlupXliIZcbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX0xPR09OX01CX1JPT01fTUlOU0NPUkVcdDMwMDJcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05pyA5bCP5YiG5pWwXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ERFpfQk9NQl9NQVhcdDMwMDNcdFx0XHRcdFx0XHRcdC8v5paX5Zyw5Li75pyA5aSn5YCN5pWwXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX0lORk9cdFx0MzAwNFx0XHRcdFx0XHRcdFx0Ly/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICB2YXIgZGF0YVNpemUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIHZhciBkYXRhRGVzY3JpYmUgPSBwRGF0YS5yZWFkd29yZCh0cnVlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZSA9IFwiK2RhdGFTaXplK1wiIGRlc2NyaWJlID0gXCIrZGF0YURlc2NyaWJlKTtcbiAgICAgICAgICAgIGlmIChkYXRhRGVzY3JpYmUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBEYXRhLnNldG1heHNpemUoMSk7XG4gICAgICAgICAgICBzd2l0Y2goZGF0YURlc2NyaWJlKXtcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDA6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2JSb29tTGV2ZWwgPSBwRGF0YS5yZWFkYnl0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDAxOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxCYXNlU2NvcmUgPSBwRGF0YS5yZWFkaW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDI6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubExpbWl0U2NvcmUgPSBwRGF0YS5yZWFkaW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubE1heEJvbWJMaW1pdCA9IHBEYXRhLnJlYWRpbnQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwNDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zekRlc2NyaWJlVHh0ID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSx0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVNlcnZlckl0ZW07XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVVzZXJJdGVtID0gY2MuQ2xhc3Moe1xuICAgIC8v55So5oi35L+h5oGv57uT5p6EXG4gICAgLy8gc3RydWN0IHRhZ1VzZXJEYXRhXG4gICAgLy8ge1xuICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0N1c3RvbUZhY2VWZXI7XHRcdFx0XHRcdC8v5LiK5Lyg5aS05YOPXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R3JvdXBJRDtcdFx0XHRcdFx0XHRcdC8v56S+5Zui57Si5byVXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlclJpZ2h0O1x0XHRcdFx0XHRcdC8v55So5oi3562J57qnXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNYXN0ZXJSaWdodDtcdFx0XHRcdFx0XHQvL+euoeeQhuadg+mZkFxuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek5hbWVbMzJdO1x0XHRcdFx0XHQvL+eUqOaIt+WQjeWtl1xuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzekdyb3VwTmFtZVszMl07XHRcdFx0XHQvL+ekvuWbouWQjeWtl1xuICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelVuZGVyV3JpdGVbMzJdO1x0XHQvL+S4quaAp+etvuWQjVxuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNZW1iZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWFzdGVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/nrqHnkIbnrYnnuqdcbiAgICAgICAgXG4gICAgLy8gICAgIC8v55So5oi356ev5YiGXG4gICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/mtojotLnph5HluIFcbiAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsU2NvcmU7XHRcdFx0XHRcdFx0XHRcdC8v55So5oi35YiG5pWwXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFdpbkNvdW50O1x0XHRcdFx0XHRcdFx0Ly/og5zliKnnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRmxlZUNvdW50O1x0XHRcdFx0XHRcdFx0Ly/mlq3nur/mlbDnm65cbiAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICBcbiAgICAvLyAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5Y+356CBXG4gICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICBcbiAgICAvLyAgICAgLy/lhbbku5bkv6Hmga9cbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkNvbXBhbmlvbjtcdFx0XHRcdFx0XHQvL+eUqOaIt+WFs+ezu1xuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1Byb3BSZXNpZHVhbFRpbWVbMTVdO1x0Ly/pgZPlhbfml7bpl7RcbiAgICAvLyB9O1xuICAgICAgICAvL+eUqOaIt+WxnuaAp1xuICAgIHdGYWNlSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuICAgIGR3Q3VzdG9tRmFjZVZlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAvL+S4iuS8oOWktOWDj1xuICAgIGR3VXNlcklEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbiAgICBkd0dyb3VwSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npL7lm6LntKLlvJVcbiAgICBkd0dhbWVJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4gICAgZHdVc2VyUmlnaHQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3562J57qnXG4gICAgbExvdmVsaW5lc3M6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4gICAgZHdNYXN0ZXJSaWdodDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5p2D6ZmQXG4gICAgc3pOYW1lOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflkI3lrZdcbiAgICBzekdyb3VwTmFtZTp1bmRlZmluZWQsICAgICAgICAgICAgIC8v56S+5Zui5ZCN5a2XXG4gICAgc3pVbmRlcldyaXRlOnVuZGVmaW5lZCwgICAgICAvL+S4quaAp+etvuWQjVxuICAgIFxuICAgIC8v55So5oi35bGe5oCnXG4gICAgY2JHZW5kZXI6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4gICAgY2JNZW1iZXJPcmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4gICAgY2JNYXN0ZXJPcmRlcjp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG562J57qnXG4gICAgXG4gICAgLy/nlKjmiLfnp6/liIZcbiAgICBsSW5zdXJlU2NvcmU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgLy/mtojotLnph5HluIFcbiAgICBsR2FtZUdvbGQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbiAgICBsU2NvcmU6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICBsV2luQ291bnQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICBsTG9zdENvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLHotKXnm5jmlbBcbiAgICBsRHJhd0NvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkozlsYDnm5jmlbBcbiAgICBsRmxlZUNvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICBsRXhwZXJpZW5jZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnu4/pqoxcbiAgICBcbiAgICAvL+eUqOaIt+eKtuaAgVxuICAgIHdUYWJsZUlEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuICAgIHdDaGFpcklEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuICAgIGNiVXNlclN0YXR1czp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgIFxuICAgIC8vIC8v5YW25LuW5L+h5oGvXG4gICAgLy8gY2JDb21wYW5pb246dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YWz57O7XG4gICAgLy8gZHdQcm9wUmVzaWR1YWxUaW1lOnVuZGVmaW5lZCwgLy/pgZPlhbfml7bpl7RcbiAgICBpbml0RGF0YUJ5VXNlckluZm9IZWFkOiBmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgdmFyIHVzZXJJbmZvSGVhZCA9IHRoaXMucmVhZFVzZXJJbmZvSGVhZChwRGF0YSk7XG4gICAgICAgIHRoaXMuZHdVc2VySUQgPSB1c2VySW5mb0hlYWQuZHdVc2VySUQ7XG4gICAgICAgIHRoaXMud1RhYmxlSUQgPSB1c2VySW5mb0hlYWQud1RhYmxlSUQ7XG4gICAgICAgIHRoaXMud0NoYWlySUQgPSB1c2VySW5mb0hlYWQud0NoYWlySUQ7XG4gICAgICAgIHRoaXMuY2JVc2VyU3RhdHVzID0gdXNlckluZm9IZWFkLmNiVXNlclN0YXR1cztcbiAgICAgICAgdGhpcy5kd1VzZXJSaWdodCA9IHVzZXJJbmZvSGVhZC5kd1VzZXJSaWdodDtcbiAgICAgICAgdGhpcy5kd01hc3RlclJpZ2h0ID0gdXNlckluZm9IZWFkLmR3TWFzdGVyUmlnaHQ7XG4gICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMud0ZhY2VJRCA9IHVzZXJJbmZvSGVhZC53RmFjZUlEO1xuICAgICAgICAgICAgdGhpcy5kd0N1c3RvbUZhY2VWZXIgPSB1c2VySW5mb0hlYWQuZHdDdXN0b21GYWNlVmVyO1xuICAgICAgICAgICAgdGhpcy5jYkdlbmRlciA9IHVzZXJJbmZvSGVhZC5jYkdlbmRlcjtcbiAgICAgICAgICAgIHRoaXMuY2JNZW1iZXJPcmRlciA9IHVzZXJJbmZvSGVhZC5jYk1lbWJlck9yZGVyO1xuICAgICAgICAgICAgdGhpcy5jYk1hc3Rlck9yZGVyID0gdXNlckluZm9IZWFkLmNiTWFzdGVyT3JkZXI7XG4gICAgICAgICAgICB0aGlzLmR3R2FtZUlEID0gdXNlckluZm9IZWFkLmR3R2FtZUlEO1xuICAgICAgICAgICAgdGhpcy5kd0dyb3VwSUQgPSB1c2VySW5mb0hlYWQuZHdHcm91cElEO1xuICAgICAgICAgICAgdGhpcy5sTG92ZWxpbmVzcyA9IHVzZXJJbmZvSGVhZC5sTG92ZWxpbmVzcztcblxuICAgICAgICAgICAgdGhpcy5sU2NvcmUgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sU2NvcmU7XG4gICAgICAgICAgICB0aGlzLmxHYW1lR29sZCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxHYW1lR29sZDtcbiAgICAgICAgICAgIHRoaXMubEluc3VyZVNjb3JlID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEluc3VyZVNjb3JlO1xuICAgICAgICAgICAgdGhpcy5sV2luQ291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sV2luQ291bnQ7XG4gICAgICAgICAgICB0aGlzLmxMb3N0Q291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sTG9zdENvdW50O1xuICAgICAgICAgICAgdGhpcy5sRHJhd0NvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubERyYXdDb3VudDtcbiAgICAgICAgICAgIHRoaXMubEZsZWVDb3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxGbGVlQ291bnQ7XG4gICAgICAgICAgICB0aGlzLmxFeHBlcmllbmNlID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEV4cGVyaWVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUodHJ1ZSl7XG4gICAgICAgICAgICAvL+m7mOiupOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTlVMTFx0XHRcdFx0XHQwXHRcdFx0XHRcdFx0XHRcdC8v5peg5pWI5pWw5o2uXG4gICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZVx0RFRQX1VTRVJfQUNDT1VOVFNcdFx0XHQzXHRcdFx0XHRcdFx0XHRcdC8v55So5oi35biQ5Y+3XG4gICAgICAgICAgICAvLyAjZGVmaW5lXHREVFBfVU5ERVJfV1JJVEVcdFx0XHRcdDlcdFx0XHRcdFx0XHRcdFx0Ly/kuKrmgKfnrb7lkI1cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX1VTRVJfR1JPVVBfTkFNRVx0XHRcdDMwMVx0XHRcdFx0XHRcdFx0XHQvL+ekvuWbouWQjeWtl1xuXG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgdmFyIGRhdGFTaXplID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgZGF0YURlc2NyaWJlID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNpemUgPSBcIitkYXRhU2l6ZStcIiBkZXNjcmliZSA9IFwiK2RhdGFEZXNjcmliZSk7XG4gICAgICAgICAgICBpZiAoZGF0YURlc2NyaWJlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgc3dpdGNoKGRhdGFEZXNjcmliZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN6TmFtZSA9IFwi5ri45oiP55So5oi3XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VySW5mb0hlYWQuZHdVc2VySUQgPT09IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEIHx8IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3pOYW1lID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN6VW5kZXJXcml0ZSA9IHBEYXRhLnJlYWRzdHJpbmcoZGF0YVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAxOlxuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN6R3JvdXBOYW1lID0gcERhdGEucmVhZHN0cmluZyhkYXRhU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlYWRVc2VySW5mb0hlYWQ6IGZ1bmN0aW9uIChwRGF0YSkge1xuICAgICAgICAvL+eUqOaIt+WfuuacrOS/oeaBr+e7k+aehFxuICAgICAgICAvLyBzdHJ1Y3QgdGFnVXNlckluZm9IZWFkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3R2FtZUlEO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI8gSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dyb3VwSUQ7XHRcdFx0XHRcdFx0XHQvL+ekvuWboue0ouW8lVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdVc2VyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnrYnnuqdcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TWFzdGVyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nrqHnkIbmnYPpmZBcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlck9yZGVyO1x0XHRcdFx0XHRcdC8v5Lya5ZGY562J57qnXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWFzdGVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/nrqHnkIbnrYnnuqdcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOWPt+eggVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiVXNlclN0YXR1cztcdFx0XHRcdFx0XHQvL+eUqOaIt+eKtuaAgVxuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+enr+WIhlxuICAgICAgICAvLyAgICAgdGFnVXNlclNjb3JlXHRcdFx0XHRcdFx0VXNlclNjb3JlSW5mbztcdFx0XHRcdFx0XHQvL+enr+WIhuS/oeaBr1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8v55So5oi356ev5YiG5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdVc2VyU2NvcmVcbiAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxTY29yZTtcdFx0XHRcdFx0XHRcdFx0Ly/nlKjmiLfliIbmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR0xPTkdcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+WtmOWCqOmHkeW4gVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsV2luQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+iDnOWIqeebmOaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bERyYXdDb3VudDtcdFx0XHRcdFx0XHRcdC8v5ZKM5bGA55uY5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxGbGVlQ291bnQ7XHRcdFx0XHRcdFx0XHQvL+aWree6v+aVsOebrlxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+aJqeWxleS/oeaBr1xuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRcdGxJbnN1cmVTY29yZTtcdFx0XHRcdFx0XHQvL+a2iOi0uemHkeW4gVxuICAgICAgICAvLyAgICAgLy9MT05HXHRcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0N1c3RvbUZhY2VWZXI7XHRcdFx0XHRcdC8v5LiK5Lyg5aS05YOPXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1Byb3BSZXNpZHVhbFRpbWVbMTVdO1x0Ly/pgZPlhbfml7bpl7RcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHVzZXJJbmZvSGVhZCA9IHt9O1xuICAgICAgICB1c2VySW5mb0hlYWQud0ZhY2VJRCA9IHBEYXRhLnJlYWR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuICAgICAgICB1c2VySW5mb0hlYWQuZHdHYW1lSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbiAgICAgICAgdXNlckluZm9IZWFkLmR3R3JvdXBJRCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npL7lm6LntKLlvJVcbiAgICAgICAgdXNlckluZm9IZWFkLmR3VXNlclJpZ2h0ID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnrYnnuqdcbiAgICAgICAgdXNlckluZm9IZWFkLmxMb3ZlbGluZXNzID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd01hc3RlclJpZ2h0ID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgIC8v566h55CG5p2D6ZmQXG4gICAgICAgIFxuICAgICAgICAvL+eUqOaIt+WxnuaAp1xuICAgICAgICB1c2VySW5mb0hlYWQuY2JHZW5kZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35oCn5YirXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYk1lbWJlck9yZGVyID0gcERhdGEucmVhZGJ5dGUoKTsgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbiAgICAgICAgdXNlckluZm9IZWFkLmNiTWFzdGVyT3JkZXIgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuetiee6p1xuICAgICAgICBcbiAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgdXNlckluZm9IZWFkLndUYWJsZUlEID0gcERhdGEucmVhZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuICAgICAgICB1c2VySW5mb0hlYWQud0NoYWlySUQgPSBwRGF0YS5yZWFkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYlVzZXJTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICAgICAgXG4gICAgICAgIC8v55So5oi356ev5YiGXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvID0ge307XG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEdhbWVHb2xkID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mHkeW4gVxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo6YeR5biBXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxXaW5Db3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IOc5Yip55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxMb3N0Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxEcmF3Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZKM5bGA55uY5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxGbGVlQ291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pat57q/5pWw55uuXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxFeHBlcmllbmNlID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG5cbiAgICAgICAgdXNlckluZm9IZWFkLmR3Q3VzdG9tRmFjZVZlciA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDlpLTlg49cbiAgICAgICAgdXNlckluZm9IZWFkLmR3UHJvcFJlc2lkdWFsVGltZSA9IFtdOy8v6YGT5YW35pe26Ze0XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCAxNTsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICAgICAgdXNlckluZm9IZWFkLmR3UHJvcFJlc2lkdWFsVGltZS5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJJbmZvSGVhZDtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lVXNlckl0ZW07IiwidmFyIEdsb2JhbERlZiA9IHtcbiAgICBNQVhfQ0hBSVI6IDEwMCxcdFx0XHRcdFx0XHRcdFx0Ly/il4rDk8Klw5vigJzFkuKXiuKAnVxuICAgIE1BWF9DSEFJUl9OT1JNQUw6IDgsXHRcdFx0XHRcdFx0XHRcdC8v4peKw5PCpcObwrvDgMKgy51cblxuICAgIElOVkFMSURfVEFCTEU6IDB4RkZGRixcdFx0XHRcdFx0XHQvL8WS76yB4oCTw5/il4rCv+KXiuKAneKIq+KJiFxuICAgIElOVkFMSURfQ0hBSVI6IDB4RkZGRixcdFx0XHRcdFx0XHQvL8WS76yB4oCTw5/igJzFkuKXiuKAneKIq+KJiFxuICAgIElOVkFMSURfSVRFTTogMHhGRkZGLFxuXG4gICAgSE1BVENIX1BPUlRfTUlOOiAxMDAwMCxcdFx0XHRcdFx0XHRcdC8v4oCTwrDCoMKxwrvCuOKXisOT4oCTwrDiiILDgMO44oGE4oir4omIXG4gICAgSE1BVENIX1BPUlRfTUFYOiAyMDAwMCxcdFx0XHRcdFx0XHRcdC8v4oCTwrDCoMKxwrvCuOKXisOTwqXDm+KIgsOAw7jigYTiiKviiYhcbiAgICBITUFUQ0hfU0lHTl9NQVg6IDk5LFx0XHRcdFx0XHRcdFx0XHQvL+KAk8KwwqDCscK7wrjCteKAouKJpcKwwrHCu8K7wrjCscKu4oiay5rCu8OAwqDLneKApsWTxZPvrIFcbiAgICBITUFUQ0hfTUFYT05MSU5FOiA1MDAsXG5cbiAgICBNQVhfQU5EUk9JRDogMTAsXHRcdFx0XHRcdFx0XHRcdC8v5pyA5aSn5py65ZmoXG4gICAgTUFYX0NIQVRfTEVOOiAxMjgsXHRcdFx0XHRcdFx0XHRcdC8v6IGK5aSp6ZW/5bqmXG4gICAgTElNSVRfQ0hBVF9USU1FUzogMTIwMCxcdFx0XHRcdFx0XHRcdC8v6ZmQ5pe26IGK5aSpXG4gICAgLy/mraPlvI/mnI3liqHlmajlnLDlnYBcbiAgICBodHRwSW5pdFVybDogXCJodHRwOi8vdmVyLmpqaGdhbWUuY29tL0hhbmRsZS9oei9pbml0LmFzaHhcIiwgICAvL2FwcOWIneWni+WMluaOpeWPo+WcsOWdgFxuICAgIGh0dHBCYXNlVXJsOiBcImh0dHA6Ly9pbnRlcmZhY2UuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAvL3dlYuaOpeWPo+WcsOWdgFxuICAgIGh0dHBPcGVuVXJsOiBcImh0dHA6Ly91c2VyLmpqaGdhbWUuY29tL2ZpbmRwYXNzd29yZEhaLmFzcHhcIiwgIC8v5om+5Zue5a+G56CBXG4gICAgaHR0cFVzZXJDZW50ZXI6IFwiaHR0cDovL2YuampoZ2FtZS5jb20vSGFuZGxlXCIsICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkuK3lv4NcbiAgICBMT0dPTl9TRVJWRVJfRE9NQUlOOiBcIm5uYXBwLmpqaGdhbWUuY29tXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgTE9HT05fU0VSVkVSX0lQOiBcIjEyMi4yMjYuMTg2LjM4XCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m75b2V5pyN5Yqh5ZmoXG4gICAgUE9SVF9MT0dPTl9TRVJWRVI6IDkwMDksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5pyN5Yqh5ZmoXG5cbi8v56uv5Y+j5a6a5LmJXG4gICAgUE9SVF9WSURFT19TRVJWRVI6IDc2MDAsXHRcdFx0XHRcdFx0XHRcdC8v6KeG6aKR5pyN5Yqh5ZmoXG4gICAgUE9SVF9DRU5URVJfU0VSVkVSOiA5MDkwLFx0XHRcdFx0XHRcdFx0XHQvL+S4reW/g+acjeWKoeWZqFxuXG4gICAgQ0hBTk5FTElEX2luaXQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muKDpgZPlj7dcbiAgICBDSEFOTkVMSURfY2VudGVyOiA3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rig6YGT5Y+3XG4vL+e9kee7nOaVsOaNruWumuS5iVxuICAgIFNPQ0tFVF9WRVI6IDB4OEMsXHRcdFx0XHRcdFx0XHRcdC8v572R57uc54mI5pysXG4gICAgU09DS0VUX0JVRkZFUjogODE5MiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc57yT5YayXG4gICAgU09DS0VUX1BBQ0tFVDogODE5MixcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvL+WGheaguOWRveS7pOeggVxuICAgIE1ETV9LTl9DT01NQU5EOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhoXmoLjlkb3ku6RcbiAgICBTVUJfS05fREVURUNUX1NPQ0tFVDogNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qOA5rWL5ZG95LukXG4gICAgU1VCX0tOX1NIVVRfRE9XTl9TT0NLRVQ6IDksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S4reaWree9kee7nFxuXG4gICAgLy9JUEMg5pWw5o2u5a6a5LmJXG4gICAgSVBDX1ZFUjogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSVBDIOeJiOacrFxuICAgIElQQ19JREVOVElGSUVSOiAweDAwMDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moIfor4blj7fnoIFcbiAgICBJUENfUEFDS0FHRTogNDA5NiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pyA5aSnIElQQyDljIVcbiAgICBJUENfQlVGRkVSOiA0MDk2LCAgICAvL+e8k+WGsumVv+W6plxuXG4gICAgVFlQRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8O3w7fCv+KAoeKJpcKn4oiCwrtcbiAgICBLSU5EX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwr/igKHigJPDleKJpcKn4oiCwrtcbiAgICBTVEFUSU9OX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCZw6bCteKAnuKJpcKn4oiCwrtcbiAgICBTRVJWRVJfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiJHDuMK64oCw4omlwqfiiILCu1xuICAgIE1PRFVMRV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL86pwq/iiaXDg+KJpcKn4oiCwrtcblxuICAgIC8v4oCT4oCYwrHvo7/iiILCruKAnMOCXG4gICAgR0VOREVSX05VTEw6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8WSwqXDt+KEouKAk+KAmMKx76O/XG4gICAgR0VOREVSX0JPWTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vxpLigJPigJPigJjigJPigJjCse+jv1xuICAgIEdFTkRFUl9HSVJMOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiYjDhuKAk+KAmOKAk+KAmMKx76O/XG5cbiAgICAvL+KAncWSxZPiiJHCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9TQ09SRTogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwrXigJ7Dt8K1wr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfR09MRDogMHgwMDAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwr/Dt+KIgs+Awr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfTUFUQ0g6IDB4MDAwNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL8KxwrvCu8K4wr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfRURVQ0FURTogMHgwMDA4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCUwrXCoeKIkcK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX1FUSEVSTUFUQ0g6IDB4MDAxNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iHquWumuS5ieavlOi1m+exu+Wei1xuXG4gICAgLy/igJ3iiJrCqsOf4peKwqXDg8Ko4oiCwq7igJzDglxuICAgIFVTX05VTEw6IDB4MDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ayoeacieeKtuaAgVxuICAgIFVTX0ZSRUU6IDB4MDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ermeeri+eKtuaAgVxuICAgIFVTX1NJVDogMHgwMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Z2Q5LiL54q25oCBXG4gICAgVVNfUkVBRFk6IDB4MDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WQjOaEj+eKtuaAgVxuICAgIFVTX0xPT0tPTjogMHgwNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peB6KeC54q25oCBXG4gICAgVVNfUExBWTogMHgwNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4gICAgVVNfT0ZGTElORTogMHgwNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pat57q/54q25oCBXG5cbiAgICAvL+KJpcKn4oiCwrviiKvDjeKIgsKu4oCcw4JcbiAgICBOQU1FX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiay5ril4rDt+KJpcKn4oiCwrtcbiAgICBQQVNTX0xFTjogMzMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oia4oC5wqzDjuKJpcKn4oiCwrtcbiAgICBFTUFJTF9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KAncKgxZPigLDiiaXCp+KIgsK7XG4gICAgR1JPVVBfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igKbDgcOV4omI4omlwqfiiILCu1xuICAgIENPTVBVVEVSX0lEX0xFTjogMzMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwqrLmeKIhsuc4oCTw5rCoeKAk1xuICAgIFVOREVSX1dSSVRFX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiPy4bigJPigJjCq8Kp4oiay5pcbiAgICBNT0JJTEVQSE9ORV9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KIj8uG4oCT4oCYwqvCqeKImsuaXG5cbiAgICAvL0dsb2JhbEZyYW1lLmhcbiAgICAvL+Wuj+WumuS5iVxuXG4gICAgLy/muLjmiI/nirbmgIFcbiAgICBHU19GUkVFOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+epuumXsueKtuaAgVxuICAgIEdTX1BMQVlJTkc6IDEwMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vSVBDIOe9kee7nOS6i+S7tlxuXG4gICAgSVBDX01BSU5fU09DS0VUOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e9kee7nOa2iOaBr1xuXG4gICAgSVBDX1NVQl9TT0NLRVRfU0VORDogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5zlj5HpgIFcbiAgICBJUENfU1VCX1NPQ0tFVF9SRUNWOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e9kee7nOaOpeaUtlxuXG4gICAgSVBDX01BSU5fQ09ORklHOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mFjee9ruS/oeaBr1xuXG4gICAgSVBDX1NVQl9TRVJWRVJfSU5GTzogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cbiAgICBJUENfU1VCX0NPTFVNTl9JTkZPOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOS/oeaBr1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL0lQQyDnlKjmiLfkv6Hmga9cblxuICAgIElQQ19NQUlOX1VTRVI6IDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbiAgICBJUENfU1VCX1VTRVJfQ09NRTogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cbiAgICBJUENfU1VCX1VTRVJfU1RBVFVTOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+eKtuaAgVxuICAgIElQQ19TVUJfVVNFUl9TQ09SRTogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnp6/liIZcbiAgICBJUENfU1VCX0dBTUVfU1RBUlQ6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5byA5aeLXG4gICAgSVBDX1NVQl9HQU1FX0ZJTklTSDogNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nu5PmnZ9cbiAgICBJUENfU1VCX1VQREFURV9GQUNFOiA2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOWktOWDj1xuICAgIElQQ19TVUJfTUVNQkVST1JERVI6IDcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pu05paw5aS05YOPXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vSVBDIOaOp+WItuS/oeaBr1xuXG4gICAgSVBDX01BSU5fQ09OQ1RST0w6IDQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5o6n5Yi25L+h5oGvXG5cbiAgICBJUENfU1VCX1NUQVJUX0ZJTklTSDogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lkK/liqjlrozmiJBcbiAgICBJUENfU1VCX0NMT1NFX0ZSQU1FOiAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFs+mXreahhuaetlxuICAgIElQQ19TVUJfSk9JTl9JTl9HQU1FOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOWFpea4uOaIj1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvL+e9kee7nOWRveS7pOeggVxuXG4gICAgTURNX0dGX0dBTUU6IDk5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5raI5oGvXG4gICAgTURNX0dGX0ZSQU1FOiA5OCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahhuaetua2iOaBr1xuICAgIE1ETV9HRl9QUkVTRU5UOiA5NywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ekvOeJqea2iOaBr1xuICAgIE1ETV9HRl9CQU5LOiA5NiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mTtuihjOa2iOaBr1xuXG4gICAgU1VCX0dGX0lORk86IDExMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5L+h5oGvXG4gICAgU1VCX0dGX1VTRVJfUkVBRFk6IDExMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35ZCM5oSPXG4gICAgU1VCX0dGX0xPT0tPTl9DT05UUk9MOiAxMTMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeinguaOp+WItlxuICAgIFNVQl9HRl9LSUNLX1RBQkxFX1VTRVI6IDExNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Lii6LWw55So5oi3XG4gICAgU1VCX0dGX1dSSVRFX01BVENIX1NDT1JFOiAxMTUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WGmeavlOi1m+aIkOe7qVxuXG4gICAgU1VCX0dGX09QVElPTjogMTE2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/phY3nva5cbiAgICBTVUJfR0ZfU0NFTkU6IDExNywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zy65pmv5L+h5oGvXG5cbiAgICBTVUJfR0ZfVVNFUl9DSEFUOiAxMTgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+iBiuWkqVxuXG4gICAgU1VCX0dGX01FU1NBR0U6IDExOSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5raI5oGvXG5cbiAgICAvL1NVQl9HRl9HSUZUOiA0MDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgea2iOaBr1xuXG4gICAgU1VCX0dGX0JBTktfU1RPUkFHRTogMjUwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pk7booYzlrZjlgqhcbiAgICBTVUJfR0ZfQkFOS19HRVQ6IDI1MSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZO26KGM5o+Q5Y+WXG4gICAgU1VCX0dGX0JBTktfUFJFU0VOVDogMjUyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otaDpgIHph5HluIFcbiAgICBTVUJfR0ZfQkFOS19NT0RJRllfUEFTUzogMjUzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv67mlLnlr4bnoIFcbiAgICBTVUJfR0ZfQkFOS19RVUVSWTogMjU0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mn6Xor6Lph5HluIFcbiAgICBTVUJfR0ZfQkFOS19QUkVTRU5UX1FVUkVZOiAyNTUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoueUqOaIt1xuICAgIFNVQl9HRl9CQU5LX0NMT1NFOiAyNTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAgOWHulxuICAgIFNVQl9HRl9UUkFOX1JFQ09SRDogMjU3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ovazluJDorrDlvZVcbiAgICBTVUJfR0ZfVVNFUl9JTkZPX1FVUkVZOiAyNTgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoueUqOaIt1xuICAgIFNVQl9HRl9VU0VSX1JFQ0hBUkdFOiAyNTksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WFheWAvFxuXG4gICAgU1VCX0dGX0ZMT1dFUl9BVFRSSUJVVEU6IDUzMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6bKc6Iqx5bGe5oCnXG4gICAgU1VCX0dGX0ZMT1dFUjogNTMxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pspzoirHmtojmga9cbiAgICBTVUJfR0ZfRVhDSEFOR0VfQ0hBUk06IDUzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWR5o2i6a2F5YqbXG5cbiAgICBTVUJfR0ZfUFJPUEVSVFk6IDUxMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YGT5YW35raI5oGvXG4gICAgU1VCX0dGX1BST1BFUlRZX1JFU1VMVDogNTExLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgZPlhbfnu5PmnpxcbiAgICBTVUJfR0ZfUkVTSURVQUxfUFJPUEVSVFk6IDUxMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Ymp5L2Z6YGT5YW3XG4gICAgU1VCX0dGX1BST1BfQVRUUklCVVRFOiA1MTMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mBk+WFt+WxnuaAp1xuICAgIFNVQl9HRl9QUk9QX0JVR0xFOiA1MTQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WWh+WPremBk+WFt1xuICAgIFNVQl9HRl9RVUVSWV9VU0VSX0lORk86IDUxNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6bKc6Iqx5raI5oGvXG4gICAgU1VCX0dGX1NFTkRfSE9OR19CQU86IDUxNiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R57qi5YyFXG4gICAgU1VCX0dGX1FJQU5HX0hPTkdfQkFPOiA1MTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkee6ouWMhVxuXG4gICAgLy/mtojmga/nsbvlnotcbiAgICBTTVRfSU5GTzogMHgwMDAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/mtojmga9cbiAgICBTTVRfRUpFQ1Q6IDB4MDAwMiwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5by55Ye65raI5oGvXG4gICAgU01UX0dMT0JBTDogMHgwMDA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhajlsYDmtojmga9cbiAgICBTTVRfQ0xPU0VfR0FNRTogMHgxMDAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhbPpl63muLjmiI9cblxuICAgIC8v5Y+R6YCB5Zy65omAXG4gICAgTE9DQVRJT05fR0FNRV9ST09NOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtFxuICAgIExPQ0FUSU9OX1BMQVpBX1JPT006IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5Y6F5oi/6Ze0XG5cbn1cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsRGVmO1xuIiwicmVxdWlyZShcIk1ENVwiKTtcbmZ1bmN0aW9uIEFjdGlvblNob3dUYW5DaHVhbmcod2lkZ2V0LCBjYil7XG4gICAgaWYgKGNjLmlzVmFsaWQod2lkZ2V0KSA9PT0gZmFsc2UgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbEZ1bl1bQWN0aW9uU2hvd1RhbkNodWFuZ10gd2lkZ2V0IGlzIGludmFsaWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2lkZ2V0Lm9wYWNpdHkgPSAwO1xuICAgIHdpZGdldC5zY2FsZSA9IDAuMDE7XG4gICAgd2lkZ2V0LnJ1bkFjdGlvbihjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbigwLjI1KSxcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMC4yLCAxLjEpLGNjLnNjYWxlVG8oMC4wNSwgMS4wKSksY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoY2IpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICkpO1xufVxuZnVuY3Rpb24gc2hvd1RvYXN0KGNvbnRleHQsbWVzc2FnZSkge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1RvYXN0Vmlld1wiLCBmdW5jdGlvbiAoZXJyLCBUb2FzdFByZWZhYikge1xuICAgICAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShUb2FzdFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIlRvYXN0Vmlld1wiKS5vbkluaXQoe21lc3NhZ2U6bWVzc2FnZX0pO1xuICAgICAgICAgICAgY29udGV4dC5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZS5jaGlsZHJlblswXSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dUb2FzdFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93QWxlcnQoY29udGV4dCxtZXNzYWdlKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvQWxlcnRWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIEFsZXJ0UHJlZmFiKSB7XG4gICAgICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKEFsZXJ0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiQWxlcnRWaWV3XCIpLmluaXQoe21lc3NhZ2U6bWVzc2FnZX0pO1xuICAgICAgICAgICAgY29udGV4dC5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd0FsZXJ0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKlxuc2hvd1BvcFdhaXRpbmcoKVxuQHBhcmFtc3tcbiAgICB3YWl0aW5nVGV4dDog55WM6Z2i5pi+56S655qE5paH5a2XLFxuICAgIHdhaXRpbmdUaW1lOiDnlYzpnaLlrZjlnKjnmoTml7bpl7Qs6LaF5pe25Y2z6ZSA5q+B55WM6Z2iLFxuICAgIGNsb3NlRXZlbnQ6IOWFs+mXreeVjOmdouebkeWQrOeahOS6i+S7tiwgXG4gICAgY2FsbEJhY2tGdW5jOiDmlLbliLDnm5HlkKzkuovku7bmiafooYznmoTlm57osIPlh73mlbAsXG59XG4qL1xuZnVuY3Rpb24gc2hvd1BvcFdhaXRpbmcoY29udGV4dCxwYXJhbXMpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9Qb3BXYWl0aW5nVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBQb3BXYWl0UHJlZmFiKSB7XG4gICAgICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKFBvcFdhaXRQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJQb3BXYWl0Vmlld1wiKS5vbkluaXQocGFyYW1zKTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBBY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93UG9wV2FpdGluZ1wiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRzaWduKHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyArIFwia2V5PWZncjdoazVkczM1aDMwaG5qN2h3YXM0Z2Z5NnNqNzh4XCI7Ly/liqDlhaVrZXlcbiAgICByZXR1cm4gY2MubWQ1RW5jb2RlKHBhcmFtcykudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKSB7XG4gICAgdmFyIG5vd1RpbWUgPSBNYXRoLmZsb29yKERhdGUubm93KCkvMTAwMCk7XG4gICAgcGFyYW1zW1wiZGF0ZXRhbXBcIl0gPSBub3dUaW1lO1xuICAgIHZhciBzb3J0X3BhcmFtcyA9IE9iamVjdC5rZXlzKHBhcmFtcykuc29ydCgpXG4gICAgY29uc29sZS5sb2coXCJbR2xvYmFsRnVuXVtidWlsZFJlcXVlc3RQYXJhbV0gXCIgKyBKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICB2YXIgcGFyYW1TdHJpbmcgPSBcIlwiO1xuICAgIGZvciAodmFyIGtpIGluIHNvcnRfcGFyYW1zKSB7XG4gICAgICAgIHZhciBrZXkgPSBzb3J0X3BhcmFtc1traV07XG4gICAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBwYXJhbXNba2V5XTtcbiAgICAgICAgICAgIHBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmcgKyBrZXkgKyBcIj1cIiArIGVsZW1lbnQgKyBcIiZcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXJhbVN0cmluZyA9IHBhcmFtU3RyaW5nICsgXCJzaWduPVwiICsgZ2V0c2lnbihwYXJhbVN0cmluZyk7XG4gICAgcmV0dXJuIHBhcmFtU3RyaW5nO1xufVxuXG5mdW5jdGlvbiBpcFRvTnVtYmVyKGlwKSB7XG5cdHZhciBudW0gPSAwO1xuXHRpZihpcCA9PSBcIlwiKSB7XG5cdFx0cmV0dXJuIG51bTtcblx0fSAgICBcbiAgICB2YXIgYU51bSA9IGlwLnNwbGl0KFwiLlwiKTsgXG4gICAgaWYoYU51bS5sZW5ndGggIT0gNCkge1xuICAgIFx0cmV0dXJuIG51bTtcbiAgICB9ICAgXG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bMF0pIDw8IDI0O1xuICAgIG51bSArPSBwYXJzZUludChhTnVtWzFdKSA8PCAxNjtcbiAgICBudW0gKz0gcGFyc2VJbnQoYU51bVsyXSkgPDwgODtcbiAgICBudW0gKz0gcGFyc2VJbnQoYU51bVszXSkgPDwgMDtcbiAgICBudW0gPSBudW0gPj4+IDA7Ly/ov5nkuKrlvojlhbPplK7vvIzkuI3nhLblj6/og73kvJrlh7rnjrDotJ/mlbDnmoTmg4XlhrVcbiAgICByZXR1cm4gbnVtOyAgXG59ICAgIFxuICBcbmZ1bmN0aW9uIG51bWJlclRvSXAobnVtYmVyKSB7ICAgIFxuICAgIHZhciBpcCA9IFwiXCI7XG4gICAgaWYobnVtYmVyIDw9IDApIHtcbiAgICBcdHJldHVybiBpcDtcbiAgICB9XG4gICAgdmFyIGlwMyA9IChudW1iZXIgPDwgMCApID4+PiAyNDtcbiAgICB2YXIgaXAyID0gKG51bWJlciA8PCA4ICkgPj4+IDI0O1xuICAgIHZhciBpcDEgPSAobnVtYmVyIDw8IDE2KSA+Pj4gMjQ7XG4gICAgdmFyIGlwMCA9IChudW1iZXIgPDwgMjQpID4+PiAyNFxuICAgIFxuICAgIGlwICs9IGlwMCArIFwiLlwiICsgaXAxICsgXCIuXCIgKyBpcDIgKyBcIi5cIiArIGlwMztcbiAgICBcbiAgICByZXR1cm4gaXA7ICAgXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBY3Rpb25TaG93VGFuQ2h1YW5nOiBBY3Rpb25TaG93VGFuQ2h1YW5nLFxuICAgIHNob3dUb2FzdDogc2hvd1RvYXN0LFxuICAgIHNob3dBbGVydDogc2hvd0FsZXJ0LFxuICAgIHNob3dQb3BXYWl0aW5nOiBzaG93UG9wV2FpdGluZyxcbiAgICBidWlsZFJlcXVlc3RQYXJhbTogYnVpbGRSZXF1ZXN0UGFyYW0sXG4gICAgaXBUb051bWJlcjppcFRvTnVtYmVyLFxuICAgIG51bWJlclRvSXA6bnVtYmVyVG9JcCxcbn07IiwidmFyIEdsb2JhbFVzZXJEYXRhID0ge1xuICAgIHdGYWNlSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICBjYkdlbmRlcjogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v55So5oi35oCn5YirXG4gICAgY2JNZW1iZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgIGlzR3Vlc3Q6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+aYr+WQpuaYr+a4uOWuolxuICAgIGlzT3BlblJlZ2lzdGVyOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+azqOWGjOWKn+iDvVxuICAgIGlzT3BlbklBUDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+aYr+WQpuW8gOWQr+iLueaenGlhcFxuICAgIHdFbmNyeXB0SUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+maj+acuueggTFcbiAgICB3Q29kZUNoZWNrSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgZHdVc2VySUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICBkd0dhbWVJRDogdW5kZWZpbmVkLFx0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgIGR3RXhwZXJpZW5jZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgIHN6TW9iaWxlQXV0aDogdW5kZWZpbmVkLCAgICAgICAgIC8v5rOo5YaM5pe26aqM6K+B56CBXG4gICAgc3pBY2NvdW50czogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5biQ5Y+3XG4gICAgc3pOaWNrTmFtZTogdW5kZWZpbmVkLCAgICAgICAgICAgLy/njqnlrrbmmLXnp7BcbiAgICBzelBhc3NXb3JkOiB1bmRlZmluZWQsXHRcdFx0Ly/nmbvlvZXlr4bnoIFcbiAgICBzekdyb3VwTmFtZTogdW5kZWZpbmVkLFx0XHRcdC8v56S+5Zui5L+h5oGvXG4gICAgc3pVbmRlcldyaXRlOiB1bmRlZmluZWQsXHQvL+S4quaAp+etvuWQjVxuICAgIFxuICAgIC8v5omp5bGV5L+h5oGvXG4gICAgZHdDdXN0b21GYWNlVmVyOiB1bmRlZmluZWQsXHRcdFx0XHQvL+WktOWDj+eJiOacrFxuICAgIC8v6ZKxXG4gICAgZHdGb3J0dW5lQ29pbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v56aP5biBXG4gICAgbGxHYW1lU2NvcmU6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICBsbEluc3VyZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZO26KGM6YeR5biBXG4gICAgZHdDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v6LSd5aOzXG4gICAgZHdJbnN1cmVDb3Vwb246IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgIC8v6ZO26KGM6LSd5aOzXG4gICAgZHdNYXRjaFRpY2tldDogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8v5Y+C6LWb5Yi4XG4gICAgaXNGaXJzdEJhbms6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly8g6aaW5qyh5L2/55SoXG5cbiAgICByb29tTGlzdDogW10sXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbklBUCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwianNvbi9zaG9wcGFnZVwiLCBmdW5jdGlvbiAoZXJyLCBjb250ZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50KTtcbiAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhID0gY29udGVudDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dsb2JhbFVzZXJEYXRhXVtpbml0XSBcIitKU09OLnN0cmluZ2lmeShHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb29tTGlzdCA9IFtdO1xuICAgIH0sXG4gICAgb25Mb2FkRGF0YTogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICAvL+aJqeWxleS/oeaBr1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdDdXN0b21GYWNlVmVyO1x0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNb29yTWFjaGluZTtcdFx0XHRcdFx0Ly/plIHlrprmnLrlmahcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JCaW5kV2VpWGluO1x0XHRcdFx0XHQvL+e7keWumuW+ruS/oSBXU0xcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdC8v6ZqP5py656CBMVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdFeHBlcmllbmNlO1x0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0Ly/muLjmiI8gSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEdhbWVTY29yZTtcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEluc3VyZVNjb3JlO1x0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pBY2NvdW50c1tOQU1FX0xFTl07XHRcdFx0Ly/nmbvlvZXluJDlj7dcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6Tmlja05hbWVbTkFNRV9MRU5dO1x0XHRcdC8v5pi156ewXG4gICAgICAgIC8vIH07XG4gICAgICAgIHRoaXMuZHdDdXN0b21GYWNlVmVyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuY2JNb29yTWFjaGluZSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JCaW5kV2VpWGluID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy53RmFjZUlEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5jYk1lbWJlciA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JHZW5kZXIgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLndFbmNyeXB0SUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndDb2RlQ2hlY2tJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdFeHBlcmllbmNlID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdHYW1lSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmxsR2FtZVNjb3JlID0gcERhdGEucmVhZGludDY0KCk7XG4gICAgICAgIHRoaXMubGxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpO1xuICAgICAgICB0aGlzLnN6QWNjb3VudHMgPSBwRGF0YS5yZWFkc3RyaW5nKDMyKTtcbiAgICAgICAgdGhpcy5zek5pY2tOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YodGhpc1twcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLicgKyBwcm9wLCAnPScsIHRoaXNbcHJvcF0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRSb29tQnlHYW1lOiBmdW5jdGlvbiAod0tpbmRJRCkge1xuICAgICAgICB2YXIgcm9vbUxpc3QgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucm9vbUxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMucm9vbUxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQud0tpbmRJRCA9PSB3S2luZElEKSB7XG4gICAgICAgICAgICAgICAgcm9vbUxpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm9vbUxpc3Q7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsVXNlckRhdGE7IiwicmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlZmF1bHRzLCBzZXQgdmlzdWFsbHkgd2hlbiBhdHRhY2hpbmcgdGhpcyBzY3JpcHQgdG8gdGhlIENhbnZhc1xuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkISdcbiAgICB9LFxuICAgIC8vIG5hbWU6IFwiaGVsbG9GcmFtZVwiLFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBqc2JUZXN0LnRlc3Rsb2coKTtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyB0aGlzLnNvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQoZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2JlZ2luJyk7XG4gICAgICAgIC8vICAgICAvLyB2YXIgbWFpbklEID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICAvLyAgICAgLy8gdmFyIHN1YklEID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhtYWluSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coc3ViSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2VuZCcpO1xuICAgICAgICAvLyAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIC8vIHZhciBwRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgLy8gLy8gcERhdGEuc2V0Y21kaW5mbygyLDMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaHdvcmQoMjMzMzMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoZG91YmxlKDEyMy4zNDM0KTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0bWFpbigpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0c3ViKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkYnl0ZSgpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZHdvcmQoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRkb3VibGUoKSk7XG4gICAgICAgIC8vIHRoaXMuc29ja2V0LkNvbm5lY3RTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KTtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSB0aGlzLnRleHQ7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBvblNvY2tldENhbGxCYWNrOiBmdW5jdGlvbihwRGF0YSkge1xuICAgIC8vICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdmFyIG1haW4gPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgLy8gICAgIHZhciBzdWIgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ21haW4gPSAnK21haW4rJyBzdWIgPSAnK3N1Yik7XG4gICAgLy8gICAgIGlmIChtYWluID09PSAwKSBcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgaWYoc3ViID09PSAwKVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZWxzZVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZWxzZVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQocERhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGVsbG9fb25Db25uZWN0Q29tcGVsZXRlZCcpO1xuICAgIH0sXG4gICAgLy8gb25Tb2NrZXRFcnJvcjpmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdvblNvY2tldEVycm9yJyk7XG4gICAgLy8gfSxcbiAgICAvLyBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwib25Tb2NrZXRFdmVudFwiKTtcbiAgICAvLyB9LFxuICAgIHNlbmRMb2dvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjE3NjAyMTcwMzEzXCIsMzIpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH1cbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xudmFyIGdhbWVfY21kID0gcmVxdWlyZShcIkNNRF9HYW1lXCIpO1xudmFyIHBsYXphX2NtZCA9IHJlcXVpcmUoXCJDTURfUGxhemFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVNlcnZlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVNlcnZlckl0ZW1cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAvLyBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgLy8gfVxuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDEpe1xuICAgICAgICAgIHRoaXMuc2VuZFJlZ2lzdGVyKCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMuX2xvZ29uTW9kZSA9PT0gMil7XG4gICAgICAgICAgdGhpcy5zZW5kVmlzaXRvcigpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuacquefpeeZu+W9leaooeW8j1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmKG1haW4gPT09IHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFKXtcbiAgICAgICAgICAgIHRoaXMub25TdWJMb2dvbkV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NFUlZFUl9MSVNUKXtcbiAgICAgICAgICAgIHRoaXMub25Sb29tTGlzdEV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NZU1RFTSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLns7vnu5/mtojmga9cIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViTG9nb25FdmVudDogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmIChzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUpe1xuICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEub25Mb2FkRGF0YShwRGF0YSk7XG4gICAgICAgICAgICB2YXIgYlJlbWVtYmVyUHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIpO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNHdWVzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSBjYy5tZDVFbmNvZGUodGhpcy5fc3pQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJSZW1lbWJlclB3ZCA9PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50JywgdGhpcy5fc3pBY2NvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHRoaXMuX3N6UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncGFzc3dvcmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9nb24gc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJMb2dvblN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX0VSUk9SX01PQklMRSkge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9naW4gZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fRklOSVNIX01PQklMRSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9naW4gZmluaXNoXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJQbGF6YVNjZW5lXCIpO1xuICAgICAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uUm9vbUxpc3RFdmVudDogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBvblJvb21MaXN0RXZlbnRcIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfVFlQRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX1RZUEVcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9LSU5EOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfS0lORFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1NUQVRJT046XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9TVEFUSU9OXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfU0VSVkVSOlxuICAgICAgICAgICAgICAgIHZhciBwR2FtZVNlcnZlciA9IG5ldyBHYW1lU2VydmVySXRlbSgpO1xuICAgICAgICAgICAgICAgIC8v5ri45oiP5oi/6Ze05YiX6KGo57uT5p6EXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ0dhbWVTZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NvcnRJRDtcdFx0XHRcdFx0XHRcdC8v5o6S5bqP5Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0tpbmRJRDtcdFx0XHRcdFx0XHRcdC8v5ZCN56ew5Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NlcnZlcklEO1x0XHRcdFx0XHRcdFx0Ly/miL/pl7Tlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U3RhdGlvbklEO1x0XHRcdFx0XHRcdFx0Ly/nq5nngrnlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U2VydmVyUG9ydDtcdFx0XHRcdFx0XHQvL+aIv+mXtOerr+WPo1xuICAgICAgICAgICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1NlcnZlckFkZHI7XHRcdFx0XHRcdFx0Ly/miL/pl7TlnLDlnYBcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdPbkxpbmVDb3VudDtcdFx0XHRcdFx0XHQvL+WcqOe6v+S6uuaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelNlcnZlck5hbWVbU0VSVkVSX0xFTl07XHRcdFx0Ly/miL/pl7TlkI3np7BcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHBHYW1lU2VydmVyLm9uSW5pdChwRGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBwR2FtZVNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mKHBHYW1lU2VydmVyW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncEdhbWVTZXJ2ZXIuJyArIHByb3AsICc9JywgcEdhbWVTZXJ2ZXJbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5yb29tTGlzdC5wdXNoKHBHYW1lU2VydmVyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwR2FtZVNlcnZlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZW5kTG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbG9nb25EYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBsb2dvbkRhdGEuc2V0Y21kaW5mbyhwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSxwbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoempoX2NtZC5LSU5EX0lEKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pBY2NvdW50LDMyKTtcbiAgICAgICAgLy8gbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyNWQ1NWFkMjgzYWE0MDBhZjQ2NGM3NmQ3MTNjMDdhZFwiLDMzKTtcbiAgICAgICAgaWYgKEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QpIHtcbiAgICAgICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6UGFzc3dvcmQsMzMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhjYy5tZDVFbmNvZGUodGhpcy5fc3pQYXNzd29yZCksMzMpO1xuICAgICAgICB9XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgfSxcbiAgICBzZW5kUmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVnaXN0ZXJEYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICB2YXIgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19BTkRST0lEKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfTU9CSUxFKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2h3b3JkKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGJ5dGUoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoZHdNb2JpbGVTeXNUeXBlKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZCh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zelJlZ0FjY291bnQsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyhjYy5tZDVFbmNvZGUodGhpcy5fc3pSZWdQYXNzd29yZCksMzMpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek1vYmlsZVBob25lLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pOaWNrTmFtZSwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6TW9iaWxlQXV0aCwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKHJlZ2lzdGVyRGF0YSk7XG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c01vYmxpZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0Ly8g5aS05YOP5qCH6K+GXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdC8vIOeUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVTeXNUeXBlO1x0XHRcdFx0Ly/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBLaW5kO1x0XHRcdFx0Ly8g5bm/5Zy65omL5py654mI5pysXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZUFwcFZlcnNpb247XHRcdFx0XHQvLyDlub/lnLrmiYvmnLrniYjmnKxcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6QWNjb3VudHNbTkFNRV9MRU5dO1x0XHRcdC8vIOeZu+W9leW4kOWPt1xuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pQYXNzV29yZFtQQVNTX0xFTl07XHRcdFx0Ly8g55m75b2V5a+G56CBXG4gICAgICAgIC8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZXBob25lW01PQklMRVBIT05FX0xFTl07IC8vIOaJi+aculxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pOaWNrTmFtZVtOQU1FX0xFTl07XHRcdFx0Ly8g5pi156ewXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek1vYmlsZUF1dGhbTkFNRV9MRU5dO1x0XHRcdC8v5omL5py66aqM6K+B56CBXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsvL+acuuWZqOW6j+WIl+WPt1xuICAgICAgICAvLyB9O1xuICAgIH0sXG4gICAgc2VuZFZpc2l0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgIH0sXG4gICAgb25Mb2dvbkJ5QWNjb3VudDogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQpIHtcbiAgICAgICAgdGhpcy5fc3pBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelBhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IFwiMDEyMzQ1Njc4OVwiO1xuICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdIFwiK3N6QWNjb3VudCtcIiAjIFwiKyBzelBhc3N3b3JkKTtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBvbkxvZ29uQnlWaXNpdG9yOiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCkge1xuICAgICAgICB0aGlzLl9zekFjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gXCIwMTIzNDU2Nzg5XCI7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDI7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5VmlzaXRvcl1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5VmlzaXRvcl1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25SZWdpc3RlcjogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQsc3pOaWNrTmFtZSxzek1vYmlsZUF1dGgpIHtcbiAgICAgICAgdGhpcy5fc3pSZWdBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelJlZ1Bhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pOaWNrTmFtZSA9IHN6Tmlja05hbWU7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlQXV0aCA9IHN6TW9iaWxlQXV0aDtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMTtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvblJlZ2lzdGVyXVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvblJlZ2lzdGVyXVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGxvZ29uVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgcmVnaXN0ZXJWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2FkXVwiKTtcbiAgICAgICAgR2xvYmFsVXNlckRhdGEuaW5pdCgpO1xuICAgICAgICB0aGlzLl9sb2dvbkZyYW1lID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChcIkxvZ29uRnJhbWVcIik7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkxvZ29uJyx0aGlzLm9uTG9nb24sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvblNob3dSZWdpc3RlcicsdGhpcy5vblNob3dSZWdpc3Rlcix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uUmVnaXN0ZXInLHRoaXMub25SZWdpc3Rlcix0aGlzKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25Mb2dvbicsdGhpcy5vbkxvZ29uLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uU2hvd1JlZ2lzdGVyJyx0aGlzLm9uU2hvd1JlZ2lzdGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uUmVnaXN0ZXInLHRoaXMub25SZWdpc3Rlcix0aGlzKTtcbiAgICB9LFxuICAgIG9uTG9nb246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9nb25dXCIpO1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gZXZlbnQuZGV0YWlsLnN6QWNjb3VudDtcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSBldmVudC5kZXRhaWwuc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fbG9nb25GcmFtZS5vbkxvZ29uQnlBY2NvdW50KHN6QWNjb3VudCxzelBhc3N3b3JkKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgY2xvc2VFdmVudDogXCJMb2dvblN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGNhbGxCYWNrRnVuYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9nb25dIGNhbGxiYWNrZnVuY1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25SZWdpc3RlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uUmVnaXN0ZXJdXCIpO1xuICAgICAgdmFyIHN6QWNjb3VudCA9IGV2ZW50LmRldGFpbC5zekFjY291bnQ7XG4gICAgICB2YXIgc3pQYXNzd29yZCA9IGV2ZW50LmRldGFpbC5zelBhc3N3b3JkO1xuICAgICAgdmFyIHN6Tmlja05hbWUgPSBldmVudC5kZXRhaWwuc3pOaWNrTmFtZTtcbiAgICAgIHZhciBzek1vYmlsZUF1dGggPSBldmVudC5kZXRhaWwuc3pNb2JpbGVBdXRoO1xuICAgICAgaWYoc3pBY2NvdW50ID09PSB1bmRlZmluZWQgfHwgc3pQYXNzd29yZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25SZWdpc3Rlcl0gc3pBY2NvdW50IG9yIHN6UGFzc3dvcmQgaXMgdW5kZWZpbmVkXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2xvZ29uRnJhbWUub25SZWdpc3RlcihzekFjY291bnQsc3pQYXNzd29yZCxzek5pY2tOYW1lLHN6TW9iaWxlQXV0aCk7XG4gICAgfSxcbiAgICBvblNob3dMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSk7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9sb2dvblZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmxvZ29uVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fbG9nb25WaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9sb2dvblZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93TG9nb25dQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uU2hvd1Zpc3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdXCIpO1xuICAgICAgICAvLyBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmuLjlrqLnmbvlvZXmmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgdXJsICs9IFwiL0d1ZXN0L0d1ZXN0TG9naW4uYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcImtpbmRpZFwiXSA9IHpqaF9jbWQuS0lORF9JRDtcbiAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZGVudGl0eVwiXSA9IFwiMmQ0ZDdjOTVlNWRmMDE3OWFmMjQ2NmY2MzVjYTcxZGVcIjtcbiAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIxXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHMgPSB2YWx1ZS51c2VybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IHZhbHVlLnB3ZDtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlBsYXphU2NlbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2xvZ29uRnJhbWUub25Mb2dvbkJ5VmlzaXRvcihHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzLEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJHdWVzdExvZ2luQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1BvcFdhaXRpbmcoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx7XG4gICAgICAgICAgICBjbG9zZUV2ZW50OiBcIkd1ZXN0TG9naW5Db21wbGV0ZWRcIixcbiAgICAgICAgICAgIGNhbGxCYWNrRnVuYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBcbiAgICB9LFxuICAgIG9uU2hvd1JlZ2lzdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICB0aGlzLl9sb2dvblZpZXcuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGNjLmlzVmFsaWQodGhpcy5fcmVnaXN0ZXJWaWV3KSA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5yZWdpc3RlclZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3JlZ2lzdGVyVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fcmVnaXN0ZXJWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1JlZ2lzdGVyXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fZWRpdGJveF9hY2NvdW50OntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfcGFzc3dvcmQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fY2hlY2tib3g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKHRoaXMubV9jaGVja2JveCkge1xuICAgICAgICAgICAgdmFyIHB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInB3ZFwiKTtcbiAgICAgICAgICAgIHZhciBiUmVtZW1iZXJQd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiUmVtZW1iZXJQd2RcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSBpcyBcIiArIGJSZW1lbWJlclB3ZCk7XG4gICAgICAgICAgICBpZiAoYlJlbWVtYmVyUHdkID09ICd0cnVlJyB8fCBiUmVtZW1iZXJQd2QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gY2hlY2tcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2NoZWNrYm94LmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgdmFyIHN6QWNjb3VudCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgc3pQYXNzd29yZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmcgPSBzekFjY291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nID0gc3pQYXNzd29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSB1bmNoZWNrXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5tX2NoZWNrYm94LnVuY2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uTG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9nb25dIFwiK3N6QWNjb3VudCtcIiAjIFwiK3N6UGFzc3dvcmQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25Mb2dvblwiLHtzekFjY291bnQ6c3pBY2NvdW50LHN6UGFzc3dvcmQ6c3pQYXNzd29yZH0pO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja1JlZ2lzdGVyQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uU2hvd1JlZ2lzdGVyXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0ZvcmdldFBhc3N3b3JkOiBmdW5jdGlvbigpe1xuICAgICAgICBjYy5zeXMub3BlblVSTChHbG9iYWxEZWYuaHR0cE9wZW5VcmwpO1xuICAgIH0sXG4gICAgY2hlY2tCb3hDbGlja2VkOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIGlmICh0b2dnbGUuaXNDaGVja2VkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW2NoZWNrQm94Q2xpY2tlZF0gaXMgY2hlY2tlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bY2hlY2tCb3hDbGlja2VkXSBpcyB1bmNoZWNrZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIsIHRvZ2dsZS5pc0NoZWNrZWQpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MubWQ1RW5jb2RlID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gZm9yIHRlc3QvZGVidWdcbiAgICBmdW5jdGlvbiBmZmxvZyhtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH0gY2F0Y2goZSkge31cbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IG51bWJlciB0byAodW5zaWduZWQpIDMyIGJpdCBoZXgsIHplcm8gZmlsbGVkIHN0cmluZ1xuICAgIGZ1bmN0aW9uIHRvX3plcm9maWxsZWRfaGV4KG4pIHtcbiAgICAgICAgdmFyIHQxID0gKG4gPj4+IDI0KS50b1N0cmluZygxNik7XG4gICAgICAgIHZhciB0MiA9IChuICYgMHgwMEZGRkZGRikudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXR1cm4gXCIwMFwiLnN1YnN0cigwLCAyIC0gdDEubGVuZ3RoKSArIHQxICtcbiAgICAgICAgICAgIFwiMDAwMDAwXCIuc3Vic3RyKDAsIDYgLSB0Mi5sZW5ndGgpICsgdDI7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhcnJheSBvZiBjaGFycyB0byBhcnJheSBvZiBieXRlcyAobm90ZTogVW5pY29kZSBub3Qgc3VwcG9ydGVkKVxuICAgIGZ1bmN0aW9uIGNoYXJzX3RvX2J5dGVzKGFjKSB7XG4gICAgICAgIHZhciByZXR2YWwgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmV0dmFsID0gcmV0dmFsLmNvbmNhdChzdHJfdG9fYnl0ZXMoYWNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH1cblxuXG4gICAgLy8gY29udmVydCBhIDY0IGJpdCB1bnNpZ25lZCBudW1iZXIgdG8gYXJyYXkgb2YgYnl0ZXMuIExpdHRsZSBlbmRpYW5cbiAgICBmdW5jdGlvbiBpbnQ2NF90b19ieXRlcyhudW0pIHtcbiAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICAgICAgcmV0dmFsLnB1c2gobnVtICYgMHhGRik7XG4gICAgICAgICAgICBudW0gPSBudW0gPj4+IDg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9XG5cbiAgICAvLyAgMzIgYml0IGxlZnQtcm90YXRpb25cbiAgICBmdW5jdGlvbiByb2wobnVtLCBwbGFjZXMpIHtcbiAgICAgICAgcmV0dXJuICgobnVtIDw8IHBsYWNlcykgJiAweEZGRkZGRkZGKSB8IChudW0gPj4+ICgzMiAtIHBsYWNlcykpO1xuICAgIH1cblxuICAgIC8vIFRoZSA0IE1ENSBmdW5jdGlvbnNcbiAgICBmdW5jdGlvbiBmRihiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiAoYiAmIGMpIHwgKH5iICYgZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkcoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gKGQgJiBiKSB8ICh+ZCAmIGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZIKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIGIgXiBjIF4gZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmSShiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiBjIF4gKGIgfCB+ZCk7XG4gICAgfVxuXG4gICAgLy8gcGljayA0IGJ5dGVzIGF0IHNwZWNpZmllZCBvZmZzZXQuIExpdHRsZS1lbmRpYW4gaXMgYXNzdW1lZFxuICAgIGZ1bmN0aW9uIGJ5dGVzX3RvX2ludDMyKGFyciwgb2ZmKSB7XG4gICAgICAgIHJldHVybiAoYXJyW29mZiArIDNdIDw8IDI0KSB8IChhcnJbb2ZmICsgMl0gPDwgMTYpIHwgKGFycltvZmYgKyAxXSA8PCA4KSB8IChhcnJbb2ZmXSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgQ29udmVyIHN0cmluZyB0byBhcnJheSBvZiBieXRlcyBpbiBVVEYtOCBlbmNvZGluZ1xuICAgICBTZWU6XG4gICAgIGh0dHA6Ly93d3cuZGFuZ3Jvc3NtYW4uaW5mby8yMDA3LzA1LzI1L2hhbmRsaW5nLXV0Zi04LWluLWphdmFzY3JpcHQtcGhwLWFuZC1ub24tdXRmOC1kYXRhYmFzZXMvXG4gICAgIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI0MDQwOC9yZWFkaW5nLWJ5dGVzLWZyb20tYS1qYXZhc2NyaXB0LXN0cmluZ1xuICAgICBIb3cgYWJvdXQgYSBTdHJpbmcuZ2V0Qnl0ZXMoPEVOQ09ESU5HPikgZm9yIEphdmFzY3JpcHQhPyBJc24ndCBpdCB0aW1lIHRvIGFkZCBpdD9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdHJfdG9fYnl0ZXMoc3RyKSB7XG4gICAgICAgIC8vIGFsZXJ0KFwiZ290IFwiICsgc3RyLmxlbmd0aCArIFwiIGNoYXJzXCIpXG4gICAgICAgIHZhciByZXR2YWwgPSBbIF07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKHN0ci5jaGFyQ29kZUF0KGkpIDw9IDB4N0YpIHtcbiAgICAgICAgICAgICAgICByZXR2YWwucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0bXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dmFsLnB1c2gocGFyc2VJbnQodG1wW2pdLCAweDEwKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBjb252ZXJ0IHRoZSA0IDMyLWJpdCBidWZmZXJzIHRvIGEgMTI4IGJpdCBoZXggc3RyaW5nLiAoTGl0dGxlLWVuZGlhbiBpcyBhc3N1bWVkKVxuICAgIGZ1bmN0aW9uIGludDEyOGxlX3RvX2hleChhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciByYSA9IFwiXCI7XG4gICAgICAgIHZhciB0ID0gMDtcbiAgICAgICAgdmFyIHRhID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDM7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB0YSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIHQgPSAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCB0YTtcbiAgICAgICAgICAgIHJhID0gcmEgKyB0b196ZXJvZmlsbGVkX2hleCh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmE7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaW5wdXQgZGF0YSB0eXBlIGFuZCBwZXJmb3JtIGNvbnZlcnNpb25zIGlmIG5lZWRlZFxuICAgIHZhciBkYXRhYnl0ZXMgPSBudWxsO1xuICAgIC8vIFN0cmluZ1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBjb252ZXJ0IHN0cmluZyB0byBhcnJheSBieXRlc1xuICAgICAgICBkYXRhYnl0ZXMgPSBzdHJfdG9fYnl0ZXMoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBlbXB0eSwganVzdCBhc3N1bWUgYXJyYXkgb2YgYnl0ZXNcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGNoYXJzX3RvX2J5dGVzKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhWzBdID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmZsb2coXCJpbnB1dCBkYXRhIHR5cGUgbWlzbWF0Y2hcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZmbG9nKFwiaW5wdXQgZGF0YSB0eXBlIG1pc21hdGNoXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBzYXZlIG9yaWdpbmFsIGxlbmd0aFxuICAgIHZhciBvcmdfbGVuID0gZGF0YWJ5dGVzLmxlbmd0aDtcblxuICAgIC8vIGZpcnN0IGFwcGVuZCB0aGUgXCIxXCIgKyA3eCBcIjBcIlxuICAgIGRhdGFieXRlcy5wdXNoKDB4ODApO1xuXG4gICAgLy8gZGV0ZXJtaW5lIHJlcXVpcmVkIGFtb3VudCBvZiBwYWRkaW5nXG4gICAgdmFyIHRhaWwgPSBkYXRhYnl0ZXMubGVuZ3RoICUgNjQ7XG4gICAgLy8gbm8gcm9vbSBmb3IgbXNnIGxlbmd0aD9cbiAgICBpZiAodGFpbCA+IDU2KSB7XG4gICAgICAgIC8vIHBhZCB0byBuZXh0IDUxMiBiaXQgYmxvY2tcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAoNjQgLSB0YWlsKTsgaSsrKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMucHVzaCgweDApO1xuICAgICAgICB9XG4gICAgICAgIHRhaWwgPSBkYXRhYnl0ZXMubGVuZ3RoICUgNjQ7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCAoNTYgLSB0YWlsKTsgaSsrKSB7XG4gICAgICAgIGRhdGFieXRlcy5wdXNoKDB4MCk7XG4gICAgfVxuICAgIC8vIG1lc3NhZ2UgbGVuZ3RoIGluIGJpdHMgbW9kIDUxMiBzaG91bGQgbm93IGJlIDQ0OFxuICAgIC8vIGFwcGVuZCA2NCBiaXQsIGxpdHRsZS1lbmRpYW4gb3JpZ2luYWwgbXNnIGxlbmd0aCAoaW4gKmJpdHMqISlcbiAgICBkYXRhYnl0ZXMgPSBkYXRhYnl0ZXMuY29uY2F0KGludDY0X3RvX2J5dGVzKG9yZ19sZW4gKiA4KSk7XG5cbiAgICAvLyBpbml0aWFsaXplIDR4MzIgYml0IHN0YXRlXG4gICAgdmFyIGgwID0gMHg2NzQ1MjMwMTtcbiAgICB2YXIgaDEgPSAweEVGQ0RBQjg5O1xuICAgIHZhciBoMiA9IDB4OThCQURDRkU7XG4gICAgdmFyIGgzID0gMHgxMDMyNTQ3NjtcblxuICAgIC8vIHRlbXAgYnVmZmVyc1xuICAgIHZhciBhID0gMCxcbiAgICAgICAgYiA9IDAsXG4gICAgICAgIGMgPSAwLFxuICAgICAgICBkID0gMDtcblxuXG4gICAgZnVuY3Rpb24gX2FkZChuMSwgbjIpIHtcbiAgICAgICAgcmV0dXJuIDB4MEZGRkZGRkZGICYgKG4xICsgbjIpXG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb24gdXBkYXRlIHBhcnRpYWwgc3RhdGUgZm9yIGVhY2ggcnVuXG4gICAgdmFyIHVwZGF0ZVJ1biA9IGZ1bmN0aW9uKG5mLCBzaW4zMiwgZHczMiwgYjMyKSB7XG4gICAgICAgIHZhciB0ZW1wID0gZDtcbiAgICAgICAgZCA9IGM7XG4gICAgICAgIGMgPSBiO1xuICAgICAgICAvL2IgPSBiICsgcm9sKGEgKyAobmYgKyAoc2luMzIgKyBkdzMyKSksIGIzMik7XG4gICAgICAgIGIgPSBfYWRkKGIsXG4gICAgICAgICAgICByb2woXG4gICAgICAgICAgICAgICAgX2FkZChhLFxuICAgICAgICAgICAgICAgICAgICBfYWRkKG5mLCBfYWRkKHNpbjMyLCBkdzMyKSlcbiAgICAgICAgICAgICAgICApLCBiMzJcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgYSA9IHRlbXA7XG4gICAgfTtcblxuXG4gICAgLy8gRGlnZXN0IG1lc3NhZ2VcbiAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YWJ5dGVzLmxlbmd0aCAvIDY0OyBpKyspIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBydW5cbiAgICAgICAgYSA9IGgwO1xuICAgICAgICBiID0gaDE7XG4gICAgICAgIGMgPSBoMjtcbiAgICAgICAgZCA9IGgzO1xuXG4gICAgICAgIHZhciBwdHIgPSBpICogNjQ7XG5cbiAgICAgICAgLy8gZG8gNjQgcnVuc1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZDc2YWE0NzgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhlOGM3Yjc1NiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4MjQyMDcwZGIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGMxYmRjZWVlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZjU3YzBmYWYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDQ3ODdjNjJhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YTgzMDQ2MTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZDQ2OTUwMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDY5ODA5OGQ4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg4YjQ0ZjdhZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZmZmY1YmIxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ODk1Y2Q3YmUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg2YjkwMTEyMiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmQ5ODcxOTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhhNjc5NDM4ZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDQ5YjQwODIxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZjYxZTI1NjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YzA0MGIzNDAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDI2NWU1YTUxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZTliNmM3YWEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZDYyZjEwNWQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDI0NDE0NTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGQ4YTFlNjgxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZTdkM2ZiYzgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyMWUxY2RlNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YzMzNzA3ZDYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGY0ZDUwZDg3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4NDU1YTE0ZWQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhhOWUzZTkwNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZmNlZmEzZjgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4Njc2ZjAyZDksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg4ZDJhNGM4YSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGZmZmEzOTQyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg4NzcxZjY4MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDZkOWQ2MTIyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZmRlNTM4MGMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhhNGJlZWE0NCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg0YmRlY2ZhOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGY2YmI0YjYwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YmViZmJjNzAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHgyODliN2VjNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZWFhMTI3ZmEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZDRlZjMwODUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg0ODgxZDA1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZDlkNGQwMzksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGU2ZGI5OWU1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4MWZhMjdjZjgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhjNGFjNTY2NSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZjQyOTIyNDQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg0MzJhZmY5NywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGFiOTQyM2E3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmM5M2EwMzksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg2NTViNTljMywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4OGYwY2NjOTIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmZmVmZjQ3ZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDg1ODQ1ZGQxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg2ZmE4N2U0ZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmUyY2U2ZTAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhhMzAxNDMxNCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDRlMDgxMWExLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4Zjc1MzdlODIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGJkM2FmMjM1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4MmFkN2QyYmIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGViODZkMzkxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgMjEpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBidWZmZXJzXG4gICAgICAgIGgwID0gX2FkZChoMCwgYSk7XG4gICAgICAgIGgxID0gX2FkZChoMSwgYik7XG4gICAgICAgIGgyID0gX2FkZChoMiwgYyk7XG4gICAgICAgIGgzID0gX2FkZChoMywgZCk7XG4gICAgfVxuICAgIC8vIERvbmUhIENvbnZlcnQgYnVmZmVycyB0byAxMjggYml0IChMRSlcbiAgICByZXR1cm4gaW50MTI4bGVfdG9faGV4KGgzLCBoMiwgaDEsIGgwKS50b0xvd2VyQ2FzZSgpO1xufTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX2JhY2s6IGNjLlNwcml0ZSxcbiAgICAgICAgbV9JbWFnZV9jb2w6IGNjLlNwcml0ZSxcbiAgICAgICAgbV9JbWFnZV90aXRsZTogY2MuU3ByaXRlLFxuICAgICAgICBtX0xhYmVsX3Njb3JlTGltaXQ6IGNjLkxhYmVsLFxuICAgICAgICBwbGF6YUF0YWxhczogY2MuU3ByaXRlQXRsYXMsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHZhciBpbmRleCA9IHBhcmFtcy5pbmRleDtcbiAgICAgICAgdGhpcy5faW5kZXggPSBwYXJhbXMuaW5kZXg7XG4gICAgICAgIC8vIHZhciByb29tSW5mbyA9IHBhcmFtcy5yb29tSW5mbztcbiAgICAgICAgdGhpcy5fcm9vbUluZm8gPSBwYXJhbXMucm9vbUluZm87XG4gICAgICAgIHRoaXMubV9JbWFnZV9iYWNrLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fYmFja19cIiArICh0aGlzLl9pbmRleCkpO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfY29sLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fY29sX1wiICsgKHRoaXMuX2luZGV4KSk7XG4gICAgICAgIHRoaXMubV9JbWFnZV90aXRsZS5zcHJpdGVGcmFtZSA9IHRoaXMucGxhemFBdGFsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF6YV9pbWFnZV9yb29tX2Rvd25fXCIgKyAodGhpcy5faW5kZXgpKTtcbiAgICAgICAgaWYgKHRoaXMuX3Jvb21JbmZvICYmIHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfc2NvcmVMaW1pdC5zdHJpbmcgPSB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVJvb21JdGVtXVtvbkNsaWNrXVwiKTsgIFxuICAgICAgICBpZighdGhpcy5fcm9vbUluZm8pIHtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaIv+mXtOaaguacquW8gOaUvu+8jOivt+eojeWQjuWGjeivlVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA+PSB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZSkge1xuICAgICAgICAgICAgLy8gR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6L+b5YWl5oi/6Ze0XCIpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uTG9nb25Sb29tXCIse3Jvb21JbmZvOnRoaXMuX3Jvb21JbmZvfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLov5vlhaXmiL/pl7TpnIDopoFcIisgdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUgKyBcIumHkeixhizmgqjnmoTph5HosYbkuI3otrMs6K+35YWF5YC8IVwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNldHRpbmdWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyUHJvZmlsZVZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGJhbmtWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgcGxhemFSb29tSXRlbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF9uYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLmluaXQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF6YSBvbkxvYWRcIik7XG4gICAgICAgIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkxvYWRdIOiOt+WPlkdhbWVGcmFtZSDmiYDlnKjoioLngrkg5bm26K6+572u5Li65bi46am76IqC54K5XCIpO1xuICAgICAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUoR2FtZUZyYW1lTm9kZSk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSBHYW1lRnJhbWVOb2RlLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdGhpcy5fZ2FtZUZyYW1lID0gdGhpcy5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hVSV1cIik7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gR2xvYmFsVXNlckRhdGEpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoR2xvYmFsVXNlckRhdGFbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2xvYmFsVXNlckRhdGEuJyArIHByb3AsICc9JywgR2xvYmFsVXNlckRhdGFbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX25hbWUuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZTtcbiAgICAgICAgdmFyIGZhY2VJRCA9IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIGlmIChmYWNlSUQgPD0gMCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgICAgICBmYWNlSUQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoUm9vbUxpc3QoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hSb29tTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcm9vbUxpc3QgPSBHbG9iYWxVc2VyRGF0YS5nZXRSb29tQnlHYW1lKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaFVJXSBcIiArIEpTT04uc3RyaW5naWZ5KHJvb21MaXN0KSk7XG4gICAgICAgIHZhciByb29tTGlzdFBhbmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwibV9QYW5lbF9jZW50ZXJcIik7XG4gICAgICAgIHJvb21MaXN0UGFuZWwucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IDM7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF6YVJvb21JdGVtKTtcbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KFwiUGxhemFSb29tSXRlbVwiKS5pbml0KHtpbmRleDppbmRleCsxLHJvb21JbmZvOnJvb21MaXN0W2luZGV4XX0pO1xuICAgICAgICAgICAgcm9vbUxpc3RQYW5lbC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVmcmVzaERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6R2FtZVVzZXJJbmZvLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtyZWZyZXNoRGF0YV0gXCIreGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1UeXBlXCIpKTtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmUgPSB2YWx1ZS5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaW5zdXJlc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZSA9IHZhbHVlLmluc3VyZXNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5hY2NvdW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzID0gdmFsdWUuYWNjb3VudHM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmdhbWVpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5kd0dhbWVJRCA9IHZhbHVlLmdhbWVpZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZmFjZWlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLndGYWNlSUQgPSB2YWx1ZS5mYWNlaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmdlbmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5jYkdlbmRlciA9IHZhbHVlLmdlbmRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaXNndWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gdmFsdWUuaXNndWVzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubmlja25hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZSA9IHZhbHVlLm5pY2tuYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hEYXRhXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2VTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VOYW1lU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uQmFua1N1Y2Nlc3MnLHRoaXMub25CYW5rU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uTG9nb25Sb29tJyx0aGlzLm9uTG9nb25Sb29tLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlU3VjY2VzcycsdGhpcy5vbkNoYW5nZVVzZXJGYWNlU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZU5hbWVTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQmFua1N1Y2Nlc3MnLHRoaXMub25CYW5rU3VjY2Vzcyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkxvZ29uUm9vbScsdGhpcy5vbkxvZ29uUm9vbSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25Mb2dvblJvb206IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkxvZ29uUm9vbV1cIik7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5vbkxvZ29uUm9vbShwYXJhbXMuZGV0YWlsLnJvb21JbmZvKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHZhciBmYWNlSUQgPSBHbG9iYWxVc2VyRGF0YS53RmFjZUlEO1xuICAgICAgICAvLyBpZiAoZmFjZUlEIDw9IDAgfHwgZmFjZUlEID4gOCkge1xuICAgICAgICAvLyAgICAgZmFjZUlEID0gMTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyB0aGlzLm1fSW1hZ2VfdXNlckZhY2Uuc3ByaXRlRnJhbWUgPSB0aGlzLnVzZXJGYWNlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJ1c2VyZmFjZV9cIiArIChmYWNlSUQtMSkpO1xuICAgICAgICB0aGlzLnJlZnJlc2hEYXRhKCk7XG4gICAgfSxcbiAgICBvbkNoYW5nZU5hbWVTdWNjZXNzOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7ICBcbiAgICB9LFxuICAgIG9uQmFua1N1Y2Nlc3M6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTsgIFxuICAgIH0sXG4gICAgb25DbGlja1NldHRpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9zZXR0aW5nVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5nVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2V0dGluZ1ZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3NldHRpbmdWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9zZXR0aW5nVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTZXR0aW5nXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvbkNsaWNrVXNlclByb2ZpbGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fdXNlclByb2ZpbGVWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJQcm9maWxlVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlclByb2ZpbGVWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl91c2VyUHJvZmlsZVZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3VzZXJQcm9maWxlVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja0NsaWVudDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tDbGllbnRdXCIpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlrqLmnI3lip/og73mmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tBY3Rpdml0eTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW2NvbkNsaWNrQWN0aXZpdHldXCIpO1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tCYW5rOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bY29uQ2xpY2tCYW5rXVwiKTtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fYmFua1ZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fYmFua1ZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmJhbmtWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9iYW5rVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fYmFua1ZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQmFua11BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja1Nob3A6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2hvcF1cIik7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3Nob3BWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX3Nob3BWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5zaG9wVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fc2hvcFZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3Nob3BWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1Nob3BdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfY29udGVudDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX3dhaXRJY29uOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uTG9hZF1cIik7XG4gICAgfSxcbiAgICBvbkluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX3dhaXRpbmdUZXh0ID0gcGFyYW1zLndhaXRpbmdUZXh0IHx8IFwi5q2j5Zyo6L+e5o6l5pyN5Yqh5Zmo77yM6K+356iN5YCZLi4uXCI7XG4gICAgICAgIHRoaXMubV93YWl0aW5nVGltZSA9IHBhcmFtcy53YWl0aW5nVGltZSB8fCA4O1xuICAgICAgICB0aGlzLm1fY2xvc2VFdmVudCA9IHBhcmFtcy5jbG9zZUV2ZW50O1xuICAgICAgICB0aGlzLm1fY2FsbEJhY2tGdW5jID0gcGFyYW1zLmNhbGxCYWNrRnVuYztcbiAgICAgICAgY2MuZGlyZWN0b3Iub24odGhpcy5tX2Nsb3NlRXZlbnQsdGhpcy5vbkNsb3NlRXZlbnQsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnNjaGVkdWxlKHRoaXMuY2xvc2UsIHRoaXMsIHRoaXMubV93YWl0aW5nVGltZSk7XG4gICAgICAgIHRoaXMubV9MYWJlbF9jb250ZW50LnN0cmluZyA9IHRoaXMubV93YWl0aW5nVGV4dDtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3dhaXRJY29uLnJ1bkFjdGlvbihjYy5yZXBlYXRGb3JldmVyKGNjLnJvdGF0ZUJ5KDIuMCwzNjAuMCkpKTtcbiAgICB9LFxuICAgIG9uQ2xvc2VFdmVudDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBpZiAodHlwZW9mKHRoaXMubV9jYWxsQmFja0Z1bmMpID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMubV9jYWxsQmFja0Z1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSxcbiAgICBvbkVtaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcImhlaGVcIik7XG4gICAgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQb3BXYWl0Vmlld11bb25EaXNhYmxlXVwiKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKHRoaXMubV9jbG9zZUV2ZW50LHRoaXMub25DbG9zZUV2ZW50LHRoaXMpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGUgKHRoaXMuY2xvc2UsIHRoaXMpO1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUG9wV2FpdFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCIgcmVxdWlyZShcIk1ENVwiKTtcbiB2YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbiB2YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbiBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX2VkaXRib3hfYWNjb3VudDp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3Bhc3N3b3JkOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfbmFtZTp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9lZGl0Ym94X3l6bTp7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuRWRpdEJveCxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fZWRpdGJveF9wYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzek5pY2tOYW1lID0gdGhpcy5tX2VkaXRib3hfbmFtZS5zdHJpbmc7XG4gICAgICAgIHZhciBzek1vYmlsZUF1dGggPSB0aGlzLm1fZWRpdGJveF95em0uc3RyaW5nO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIitzekFjY291bnQrXCIgIyBcIitzelBhc3N3b3JkKTtcbiAgICAgICAgaWYgKHN6QWNjb3VudC5sZW5ndGggPD0wIHx8IHN6UGFzc3dvcmQubGVuZ3RoIDw9MCB8fCBzek5pY2tOYW1lLmxlbmd0aCA8PSAwIHx8IHN6TW9iaWxlQXV0aC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuW4kOWPt+WvhueggeetieazqOWGjOS/oeaBr+S4jeiDveS4uuepulwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuW4kOWPt+WvhueggeetieazqOWGjOS/oeaBr+S4jeiDveS4uuepulwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3pQYXNzd29yZC5sZW5ndGggPCA2IHx8IHN6UGFzc3dvcmQubGVuZ3RoID4gMTYpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLlr4bnoIHplb/luqbkuLo2LTE25L2NXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDpgJrov4fnlKjmiLfkuK3lv4N3ZWLmjqXlj6Pms6jlhoznlKjmiLdcbiAgICAgICAgdmFyIGlzVXNlckNlbnRlciA9IHRydWU7XG4gICAgICAgIGlmKCFpc1VzZXJDZW50ZXIpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvblJlZ2lzdGVyXCIse1xuICAgICAgICAgICAgICAgIHN6QWNjb3VudDpzekFjY291bnQsXG4gICAgICAgICAgICAgICAgc3pQYXNzd29yZDpzelBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIHN6Tmlja05hbWU6c3pOaWNrTmFtZSxcbiAgICAgICAgICAgICAgICBzek1vYmlsZUF1dGg6c3pNb2JpbGVBdXRoLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICAgICAgdXJsICs9IFwiL1VzZXJDZW50ZXIvVXNlckNlbnRlclJlZ2lzdGVyLmFzaHhcIjtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSAnJztcbiAgICAgICAgICAgIHZhciBub3dUaW1lID0gTWF0aC5mbG9vcihEYXRlLm5vdygpLzEwMDApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gbm93dGltZSBzZWNvbmRzID0gXCIrbm93VGltZSk7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIntcXFwiVXNlcm5hbWVcXFwiOlxcXCJcIiArIHN6QWNjb3VudCArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIlBhc3N3b3JkXFxcIjpcXFwiXCIgKyBjYy5tZDVFbmNvZGUoc3pQYXNzd29yZCkgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJOaWNrbmFtZVxcXCI6XFxcIlwiICsgc3pOaWNrTmFtZSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkRhdGV0YW1wXFxcIjpcXFwiXCIgKyBub3dUaW1lICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgLy/nlJ/miJDnrb7lkI1cbiAgICAgICAgICAgIHZhciBzelNpZ24gPSBcIlwiO1xuICAgICAgICAgICAgc3pTaWduICs9IFwiVXNlck5hbWU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8RGF0ZVRhbXA9XCIgKyBub3dUaW1lO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifENoYW5uZWxJRD1cIiArIEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifE1vYmlsZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxDb2RlPVwiICsgc3pNb2JpbGVBdXRoO1xuICAgICAgICAgICAgc3pTaWduICs9IFwifEtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiO1xuXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJTaWduXFxcIjpcXFwiXCIgKyBjYy5tZDVFbmNvZGUoc3pTaWduKSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkNoYW5uZWxJRFxcXCI6XFxcIlwiICsgR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXIgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMgKyBcIlxcXCJNb2JpbGVcXFwiOlxcXCJcIiArIHN6QWNjb3VudCArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIk1hY2hpbmVOdW1iZXJcXFwiOlxcXCJcIiArICcxJyArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIkNvZGVcXFwiOlxcXCJcIiArIHN6TW9iaWxlQXV0aCArIFwiXFxcIn1cIjtcblxuICAgICAgICAgICAgLy9cIlVzZXJOYW1lPSVzfERhdGVUYW1wPSVsbGR8Q2hhbm5lbElEPSVkfE1vYmlsZT0lc3xDb2RlPSVzfEtleT1mZ3I3aGs1ZHMzNWgzMGhuajdod2FzNGdmeTZzajc4eFwiXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0ICYmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgNDAwKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICB4aHIuc2VuZChwYXJhbXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIgKyBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsaWNrU2VuZEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzekFjY291bnQgPSB0aGlzLm1fZWRpdGJveF9hY2NvdW50LnN0cmluZztcbiAgICAgICAgdmFyIHJlID0gLzFbMzU3OF1bMC05XXs5fS87XG4gICAgICAgIGlmIChyZS5leGVjKHN6QWNjb3VudCkgPT09IG51bGwpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrU2VuZEJ1dHRvbl0g5omL5py65Y+356CB5LiN5ZCI5rOVXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5omL5py65Y+356CB5LiN5ZCI5rOVXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgIHVybCArPSBcIi9oei9DYXB0Y2hhTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IFwiTW9iaWxlPVwiICsgc3pBY2NvdW50O1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tTZW5kQnV0dG9uXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1zKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUmVnaXN0ZXJWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gXCIgKyBwYXJhbXMpO1xuXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2FjY291bnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2FjY291bnQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEuc3pBY2NvdW50cztcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2V0dGluZ1ZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7ICBcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2V0dGluZ1ZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTd2l0Y2hBY2NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2V0dGluZ1ZpZXddW29uQ2xpY2tTd2l0Y2hBY2NvdW50XSDojrflj5ZHYW1lRnJhbWUg5omA5Zyo6IqC54K5IOW5tuWPlua2iOS4uuW4uOmpu+iKgueCuVwiKTtcbiAgICAgICAgICAgIGNjLmdhbWUucmVtb3ZlUGVyc2lzdFJvb3ROb2RlKEdhbWVGcmFtZU5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9JbWFnZV9zaG9wSXRlbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1BdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIF9zaG9wSUQ6IDAsXG4gICAgICAgIF9nb29kc0lEOiAwLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgaW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgc2hvcElEID0gcGFyYW1zLnNob3BJRDtcbiAgICAgICAgdGhpcy5fc2hvcElEID0gc2hvcElEO1xuICAgICAgICB0aGlzLl9nb29kc0lEID0gc2hvcElEICUgNjtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3Nob3BJdGVtLnNwcml0ZUZyYW1lID0gdGhpcy5zaG9wSXRlbUF0YWxzLmdldFNwcml0ZUZyYW1lKFwic2hvcF9pY29uX1wiICsgKHNob3BJRCkpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wSXRlbV1bb25DbGlja10gc2hvcElEID0gXCIrdGhpcy5fc2hvcElEKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdCgnb25JbkNoYXJnZScse2dvb2RzSUQ6dGhpcy5fZ29vZHNJRH0pO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgc2hvcEl0ZW1QcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BJdGVtTGlzdDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNjcm9sbFZpZXcsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3BJdGVtQ291bnQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkgeyAgICAgIFxuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25Mb2FkXSBcIitKU09OLnN0cmluZ2lmeShHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSkpO1xuICAgIH0sXG4gICAgcmVmcmVzaFVJOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuc2hvcEl0ZW1MaXN0LmNvbnRlbnQucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuc2hvcEl0ZW1Db3VudDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNob3BJdGVtUHJlZmFiKTtcbiAgICAgICAgICAgIHZhciBzaG9wSUQ7XG4gICAgICAgICAgICBpZihHbG9iYWxVc2VyRGF0YS5pc09wZW5JQVApe1xuICAgICAgICAgICAgICAgIHNob3BJRCA9IGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBzaG9wSUQgPSBpbmRleCArIDY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChcIlNob3BJdGVtXCIpLmluaXQoe3Nob3BJRDppbmRleH0pO1xuICAgICAgICAgICAgdGhpcy5zaG9wSXRlbUxpc3QuY29udGVudC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25JbkNoYXJnZScsdGhpcy5vbkluQ2hhcmdlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkluQ2hhcmdlJyx0aGlzLm9uSW5DaGFyZ2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25JbkNoYXJnZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25JbkNoYXJnZV1cIik7XG4gICAgICAgIHZhciBnb29kc0lEID0gcGFyYW1zLmRldGFpbC5nb29kc0lEO1xuICAgICAgICB2YXIgc2hvcERhdGFBcnJheSA9IEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhLnNob3AuYmFzZTtcbiAgICAgICAgaWYgKGdvb2RzSUQgPCAwIHx8IGdvb2RzSUQgPj0gc2hvcERhdGFBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkluQ2hhcmdlXSBzaG9wRGF0YUFycmF5IGxlbmd0aCA9IFwiICsgc2hvcERhdGFBcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpdGVtVmFsID0gc2hvcERhdGFBcnJheVtnb29kc0lEXTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19BTkRST0lEKSB7XG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25hbWVcIl0gPSBpdGVtVmFsLm5hbWU7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19udW1cIl0gPSBcIjFcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInJlbWFya1wiXSA9IFwiemhhamluaHVhR2FtZVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbm90ZVwiXSA9IFwi6ZuG57uT5Y+35ou85LiJ5bygXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lwXCJdID0gXCIxMjcuMC4wLjFcIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJfaWRlbnRpdHlcIl0gPSBcInVzZXJ0b2tlblwiOy8vdG9kb1xuICAgICAgICAgICAgcGFyYW1zW1wicHJvZHVjdGlkXCJdID0gaXRlbVZhbC5pZDtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIxXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJ2ZXJzaW9ubnVtXCJdID0gXCIxLjFcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImNoYW5uZWxpZFwiXSA9IEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuICAgICAgICAgICAgcGFyYW1zW1wicGF5X2FtdFwiXSA9IGl0ZW1WYWwucHJpY2U7XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgICAgICB1cmwgKz0gXCIvSFpNb2JpbGUvUGF5SW5pdDJfMC5hc2h4XCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJ1cmxcIl0gPSB1cmw7XG5cbiAgICAgICAgICAgIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX25hbWVcIl0gPSBpdGVtVmFsLm5hbWU7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19udW1cIl0gPSBcIjFcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInJlbWFya1wiXSA9IFwiemhhamluaHVhR2FtZVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbm90ZVwiXSA9IFwi6ZuG57uT5Y+35ou85LiJ5bygXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyX2lwXCJdID0gXCIxMjcuMC4wLjFcIjsvL3RvZG9cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJfaWRlbnRpdHlcIl0gPSBcInVzZXJ0b2tlblwiOy8vdG9kb1xuICAgICAgICAgICAgcGFyYW1zW1wicGF5X3R5cGVcIl0gPSBcIjhcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInByb2R1Y3RpZFwiXSA9IGl0ZW1WYWwuaWQ7XG4gICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMlwiO1xuICAgICAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJjaGFubmVsaWRcIl0gPSBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlcjtcblxuICAgICAgICAgICAgaWYgKEdsb2JhbFVzZXJEYXRhLmlzT3BlbklBUCkge1xuICAgICAgICAgICAgICAgIHBhcmFtc1tcInBheV9hbXRcIl0gPSBpdGVtVmFsLmlvc3ByaWNlO1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cEJhc2VVcmw7XG4gICAgICAgICAgICAgICAgdXJsICs9IFwiL0haTW9iaWxlL1BheUluaXQyXzAuYXNoeFwiO1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZXJyb3Jjb2RlID09IDEwMDI2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzT3BlbklBUCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hVSSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJTaG9wQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1BvcFdhaXRpbmcoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NlRXZlbnQ6IFwiU2hvcENvbXBsZXRlZFwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsQmFja0Z1bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkluQ2hhcmdlXSBjYWxsYmFja2Z1bmNcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmFtc1tcInBheV9hbXRcIl0gPSBpdGVtVmFsLnByaWNlO1xuICAgICAgICAgICAgICAgIHRoaXMub25DaG9vc2VQYXl0eXBlKHBhcmFtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy5vbkNob29zZVBheXR5cGUocGFyYW1zKTtcbiAgICB9LFxuICAgIG9uQ2hvb3NlUGF5dHlwZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25DaG9vc2VQYXl0eXBlXVwiKVxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9DaG9vc2VQYXlUeXBlVmlld1wiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiQ2hvb3NlUGF5VHlwZVZpZXdcIikuaW5pdChwYXJhbXMpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkNhbnZhc1wiKS5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkNob29zZVBheXR5cGVdQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTaG9wVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0xhYmVsX2NvbnRlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVG9hc3RWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVG9hc3RWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgc3pUZXh0ID0gcGFyYW1zLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMubV9MYWJlbF9jb250ZW50LnN0cmluZyA9IHN6VGV4dDtcbiAgICB9XG5cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fSW1hZ2VfdXNlckZhY2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQXRhbHM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzLFxuICAgICAgICB9LFxuICAgICAgICBfZmFjZUlEOiAwLFxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBmYWNlSUQgPSBwYXJhbXMuZmFjZUlEO1xuICAgICAgICB0aGlzLl9mYWNlSUQgPSBmYWNlSUQ7XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRCkpO1xuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZUl0ZW1dW29uQ2xpY2tdIGZhY2VJRCA9IFwiK3RoaXMuX2ZhY2VJRCk7XG4gICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoJ29uQ2hhbmdlVXNlckZhY2UnLHtmYWNlSUQ6dGhpcy5fZmFjZUlEKzF9KTtcbiAgICB9XG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICB1c2VyRmFjZUl0ZW1QcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlTGlzdDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNjcm9sbFZpZXcsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlQ291bnQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy51c2VyRmFjZUNvdW50OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlckZhY2VJdGVtUHJlZmFiKTtcbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KFwiVXNlckZhY2VJdGVtXCIpLmluaXQoe2ZhY2VJRDppbmRleH0pO1xuICAgICAgICAgICAgdGhpcy51c2VyRmFjZUxpc3QuY29udGVudC5hZGRDaGlsZChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLndGYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgdGhpcy5fZmFjZUlEID0gcGFyYW1zLmRldGFpbC5mYWNlSUQ7XG4gICAgICAgIHRoaXMub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gZmFjZUlEID0gXCIrIEpTT04uc3RyaW5naWZ5KHBhcmFtcy5kZXRhaWwpKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VcIixwYXJhbXMuZGV0YWlsKTtcbiAgICB9LFxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5zeXMuZ2FyYmFnZUNvbGxlY3QoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIEZhY2VJRCA9IHRoaXMuX2ZhY2VJRDtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvVXNlclByb2ZpbGVWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJVc2VyUHJvZmlsZVZpZXdcIikuX2ZhY2VJRCA9IEZhY2VJRDtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoXCJDYW52YXNcIikuYWRkQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fQnV0dG9uX2NoYW5nZU5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgIH0sXG4gICAgICAgIG1fQnV0dG9uX2VkaXROYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfdXNlck5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VySUQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlVmlld1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlR3JvdXAsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlck1hbkJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyV29tYW5CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX1BhbmVsX3VzZXJDaGFuZ2U6IGNjLk5vZGUsXG4gICAgICAgIG1fUGFuZWxfdXNlckluZm86IGNjLk5vZGUsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6Tmlja05hbWUgPSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lO1xuICAgICAgICB2YXIgbGxHYW1lU2NvcmUgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdmFyIGR3VXNlcklEID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBjYkdlbmRlciA9IEdsb2JhbFVzZXJEYXRhLmNiR2VuZGVyIHx8IDE7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJHb2xkLnN0cmluZyA9IGxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlcklELnN0cmluZyA9IFwiSUQ6XCIgKyBkd1VzZXJJRDtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLnN0cmluZyA9IHN6Tmlja05hbWU7XG4gICAgICAgIGlmKCB0aGlzLl9mYWNlSUQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZVVzZXJGYWNlKCk7XG4gICAgICAgICAgICBjYkdlbmRlciA9IE1hdGguZmxvb3IoKHRoaXMuX2ZhY2VJRCAtIDEpLzQpICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmFjZUlEID0gdGhpcy5fZmFjZUlEIHx8IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgaWYgKGNiR2VuZGVyID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2sgPSBcIiArIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2tlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyV29tYW5CdXR0b24uaXNDaGVjayA9IFwiICsgdGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5pc0NoZWNrZWQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIC8vIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgZmFjZUlEKTtcbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlRmFjZUlkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1wiZmFjZUlkXCJdID0gZmFjZUlEO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gXCIgKyBwYXJhbVN0cmluZyk7XG5cbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0VkaXROYW1lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgIC8vIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5lbWl0KGNjLkVkaXRCb3guZWRpdGluZy1kaWQtYmVnYW4pO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZU5hbWU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlck5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgc3pOZXdOaWNrTmFtZSA9IHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnN0cmluZztcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHN6TmV3Tmlja05hbWUubGVuZ3RoIDw9IDAgfHwgc3pOZXdOaWNrTmFtZSA9PSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvSFpNb2JpbGUvVXBkYXRlTmlja05hbWUuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJuaWNrbmFtZVwiXSA9IHN6TmV3Tmlja05hbWU7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NoYW5nZU5hbWVdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzek5pY2tOYW1lID0gdmFsdWUubmlja25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1fTGFiZWxfdXNlck5hbWUuc3RyaW5nID0gc3pOaWNrTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSBzek5pY2tOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlTmFtZVN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ2hhbmdlTmFtZV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHVzZXJGYWNlVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlckZhY2VWaWV3UHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5hZGRDaGlsZCh1c2VyRmFjZVZpZXcpO1xuICAgICAgICAvLyB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHVzZXJGYWNlVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVBhc3N3b3JkOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckluZm8uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckNoYW5nZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzek5ld1Bhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pDb25maXJtUGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICBpZihzelBhc3N3b3JkLmxlbmd0aCA8PSAwIHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoIDw9IDAgfHwgc3pDb25maXJtUGFzc3dvcmQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggeS4jeiDveS4uuepuiFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6UGFzc3dvcmQgPT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pDb25maXJtUGFzc3dvcmQgIT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pOZXdQYXNzd29yZC5sZW5ndGggPCA2IHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlUGFzc1dvcmQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIxXCI7XG4gICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzd29yZCk7XG4gICAgICAgIHBhcmFtc1tcIm5ld3Bhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzd29yZCk7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IGNjLm1kNUVuY29kZShzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJJbmZvLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9QYW5lbF91c2VyQ2hhbmdlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VQYXNzd29yZFN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzcGxhc2g6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBfc3RlcDogMCxcbiAgICAgICAgX2NvdW50OiAwLFxuICAgICAgICBrRGVzaWduRnJhbWVSYXRlOiA2MC4wLFxuICAgICAgICBrU3BsYXNoU3RlcExvZ28xU3RpbGw6IDAsXG4gICAgICAgIGtTcGxhc2hTdGVwTG9nbzFGYWRlT3V0OiAxLFxuICAgICAgICBrU3BsYXNoRmFkZVRpbWU6IDAuNSxcbiAgICAgICAga1NwbGFzaFN0aWxsVGltZTogMi4wLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICB0aGlzLl9zdGVwID0gMDtcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgIC8vIH0sIDIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHRoaXMuX2NvdW50ICs9IGR0O1xuICAgICAgICBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xU3RpbGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoU3RpbGxUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGVwICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xRmFkZU91dClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoRmFkZVRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxhc2guYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgICAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG9wID0gMjU1ICogKDEuMCAtIE1hdGguc2luKCh0aGlzLl9jb3VudC8xLjApICogMC41ICogTWF0aC5QSSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsYXNoLm9wYWNpdHkgPSBvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=