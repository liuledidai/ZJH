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
        this.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(this.m_turnTime / 2, 0, 0.7), cc.skewTo(this.m_turnTime / 2, 0, -this._skewDegree)), cc.callFunc(function () {
            self.showCard();
        }), cc.spawn(cc.scaleTo(this.m_turnTime / 2, 0.7, 0.7), cc.skewTo(this.m_turnTime / 2, 0, 0)), cc.callFunc(function () {
            if (self._callBack && typeof self._callBack === "function") {
                self._callBack();
            }
        })));
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
                    this.onResetGameEngine();
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
        this.onExitRoom();
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
        this.m_isFirstAdd = false;
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
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(function () {
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
    // onClickMenuOpen: function (toggle) {
    //     this.m_Panel_menu.active = toggle.isChecked;
    //     // toggle.node.setLocalZOrder(2);
    //     // this.m_Panel_menu.setLocalZOrder(1);
    // },
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

        //跟注按钮
        var maxAddScore = this.m_lUserMaxScore - this.m_lTableScore[myChair];
        //是否第一次下注
        var children = this._gameView.m_nodeBottom[1].children;
        var textLabel = children[0].children[0].getComponent(cc.Label);
        if (this.m_isFirstAdd) {
            textLabel.string = "下注";
        } else {
            textLabel.string = "跟注";
        }
        //更新比牌按钮分数
        var compareScore = this.m_lCellScore * this.m_lCurrentTimes * (this.m_bLookCard[myChair] && 4 || 2);
        var bLastAdd = false;
        if (maxAddScore <= compareScore) {
            bLastAdd = true;
        }
        children[4].getComponent(cc.Button).active = bLastAdd;

        var bCompare = this.m_lCurrentTurn >= 1 && !bLastAdd;
        this._gameView.m_Button_compareCard.interactable = bCompare;
        var compareLabel = this._gameView.m_Button_compareCard.node.children[0].getComponent(cc.Label);
        compareLabel.node.active = bCompare;
        compareLabel.string = compareScore;

        var array = [this.m_lCurrentTimes, 3, 6, 10];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var bHide = !bLastAdd && (i === 0 || element > this.m_lCurrentTimes);
            var lScore = element * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
            var scoreLabel = children[i].children[1].getComponent(cc.Label);
            scoreLabel.string = lScore;
            children[i].getComponent(cc.Button).interactable = bHide;
            if (maxAddScore < lScore) {
                children[i].getComponent(cc.Button).interactable = false;
            }
        }
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
        chipPrefab: cc.Prefab,
        m_Button_ready: cc.Button,
        m_Button_lookCard: cc.Button,
        m_Button_giveUp: cc.Button,
        m_Button_compareCard: cc.Button,
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
        m_Image_banker: cc.Node,
        m_LookCard: {
            default: [],
            type: cc.Node
        },
        m_GiveUp: {
            default: [],
            type: cc.Node
        },
        m_Toggle_menuOpen: cc.Toggle
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
                cardNode.setPosition(this.ptCard[index].x + (index & 1 && 35 || 70) * j, this.ptCard[index].y);
                cardNode.setScale(0.7);
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
        this.nodeChipPool = this.node.getChildByName("nodeChipPool");
        this.m_Panel_areaMenu = this.node.getChildByName("m_Panel_areaMenu");
        this.onClickMenuOpen(this.m_Toggle_menuOpen.getComponent(cc.Toggle));
        this.m_bShowMenu = false;
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
    playerJetton: function playerJetton(wViewChairID, num, notani) {
        if (!num || num < 1 || !this.m_lCellScore || this.m_lCellScore < 1) {
            console.log("[GameView][playerJetton] num is invalid");
            return;
        }
        var count = Math.floor(num / this.m_lCellScore);
        if (count > 10) {
            count = 10;
        }
        if (count <= 0) {
            count = 1;
        }
        for (var i = 0; i < count; i++) {
            var chip = cc.instantiate(this.chipPrefab);
            this.nodeChipPool.addChild(chip);
            chip.setPosition(this.ptPlayer[wViewChairID]);
            chip.setScale(0.5);
            var x = Math.random() * 200 - 100;
            var y = Math.random() * 100 - 50;
            console.log("[GameView][playerJetton] [x,y] = " + [x, y]);
            chip.runAction(cc.moveTo(0.2, cc.p(x, y)));
        }
    },
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
        } else {
            this.m_Label_allScore.node.active = true;
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
        spriteCard.setScale(0.7);
        spriteCard.setPosition(0, 0);
        cardItem.showCardBack();
        spriteCard.runAction(cc.sequence(cc.delayTime(fDelay),
        // cc.fadeIn(0),
        cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, self.ptCard[viewID].x + (viewID & 1 && 35 || 70) * index, self.ptCard[viewID].y))));
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
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[i];
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
                this.m_userCard[viewID].card[i].active = false;
            }
        }
    },
    //显示牌类型
    setUserCardType: function setUserCardType(viewID, cardtype) {},
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
    },
    onClickMenuOpen: function onClickMenuOpen(toggle) {
        this.showMenu(toggle.isChecked);
    },
    onTouch: function onTouch(params) {
        console.log(params);
        if (this.m_bShowMenu) {
            this.m_Toggle_menuOpen.uncheck();
        }
    },
    showMenu: function showMenu(bShow) {
        console.log("[GameView][showMenu] bShow = " + bShow);
        this.m_bShowMenu = bShow;
        if (bShow) {
            this.m_Panel_areaMenu.active = bShow;
            this.m_Panel_areaMenu.runAction(cc.moveBy(0.2, cc.p(0, -420)));
        } else {
            this.m_Panel_areaMenu.runAction(cc.sequence(cc.moveBy(0.2, cc.p(0, 420)), cc.callFunc(function (node) {
                // node.active = false;
            })));
        }
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvZXh0ZXJuYWwvQWxlcnRWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9CYW5rVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvaGVhZGVyL0NNRF9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1BsYXphLmpzIiwiYXNzZXRzL1NjcmlwdC9oZWFkZXIvQ01EX1phSmluSHVhLmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL0NhcmRJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9DaG9vc2VQYXlUeXBlVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0dhbWVGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvZ2FtZS9HYW1lTG9naWMuanMiLCJhc3NldHMvU2NyaXB0L2dhbWVNb2RlbC9HYW1lTW9kZWwuanMiLCJhc3NldHMvU2NyaXB0L2dhbWUvR2FtZVNjZW5lLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lU2VydmVySXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZVVzZXJJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL0dhbWVWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9HbG9iYWxEZWYuanMiLCJhc3NldHMvU2NyaXB0L2V4dGVybmFsL0dsb2JhbEZ1bi5qcyIsImFzc2V0cy9TY3JpcHQvR2xvYmFsVXNlckRhdGEuanMiLCJhc3NldHMvU2NyaXB0L0hlbGxvV29ybGQuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL21vZGVscy9Mb2dvbkZyYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS9Mb2dvblNjZW5lLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9sb2dvbi9Mb2dvblZpZXcuanMiLCJhc3NldHMvU2NyaXB0L01ENS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvUGxhemFSb29tSXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvUGxhemFWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9Qb3BXYWl0Vmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvbG9nb24vUmVnaXN0ZXJWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9TZXR0aW5nVmlldy5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvU2hvcEl0ZW0uanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1Nob3BWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9leHRlcm5hbC9Ub2FzdFZpZXcuanMiLCJhc3NldHMvU2NyaXB0L3BsYXphL3ZpZXdzL3BsYXphL1VzZXJGYWNlSXRlbS5qcyIsImFzc2V0cy9TY3JpcHQvcGxhemEvdmlld3MvcGxhemEvVXNlckZhY2VWaWV3LmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lL1VzZXJJbmZhY2VJdGVtLmpzIiwiYXNzZXRzL1NjcmlwdC9wbGF6YS92aWV3cy9wbGF6YS9Vc2VyUHJvZmlsZVZpZXcuanMiLCJhc3NldHMvU2NyaXB0L1dlbGNvbWVWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhROztBQWNaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUF2Q0k7Ozs7Ozs7Ozs7QUNBVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGc0I7QUFJMUI7QUFDSTtBQUNBO0FBRnVCO0FBSTNCO0FBQ0k7QUFDQTtBQUZtQjtBQUl2QjtBQXRDUTs7QUF5Q1o7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFYTjtBQWFBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSDtBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQTNOSTs7Ozs7Ozs7OztBQ0xUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNFO0FBQ0Q7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBRUk7QUFDSDs7QUFFRDtBQUNBO0FBQ0Q7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUVJO0FBQ0E7QUFDSDtBQUdHO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFSTtBQUNBO0FBQ0g7QUFDRDtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIOztBQXZKb0I7O0FBMkp6Qjs7Ozs7Ozs7OztBQzNKQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7O0FDL2FBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDbmZBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQzNNQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZFE7O0FBaUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFHUTtBQUNIO0FBR0c7QUFDSTtBQUNIO0FBQ0o7QUFFUjtBQS9ESTs7Ozs7Ozs7OztBQ0RUO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWJROztBQWdCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNBO0FBQ0g7QUEvREk7Ozs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTs7QUFHQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0E7QUFDQTtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFBZ0M7O0FBQzVCO0FBT3FEO0FBQzdDO0FBQ0k7QUFDQTtBQUZrQztBQUl6QztBQU1SO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFBbUM7O0FBQy9CO0FBYVE7QUFDQTtBQUNIO0FBRVI7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFwQ1I7QUFzQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNSO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFEaUM7QUFHckM7QUFDSjtBQUNJO0FBNUNSO0FBOENIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQTdCUjtBQStCSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUxSO0FBT0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFHQTtBQUNKO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQztBQUlwQztBQUNKO0FBQ0k7QUFqRFI7QUFtREg7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhnQztBQUt2QztBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFKQTtBQU1JO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFMSztBQU9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBQ0Q7QUFWSztBQVlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBRUc7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUhpQztBQUt4QztBQUNKO0FBQ0Q7QUE5Q0E7QUFnREk7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBSGlDO0FBS3hDO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBRUk7QUFDSTtBQURnQztBQUd2QztBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0k7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBMXRCSzs7Ozs7Ozs7OztBQ1ZUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUF5QztBQUNwQztBQUFnQjtBQUNwQjtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUFvRztBQUMvRjtBQUFnQjtBQUNwQjtBQUNKO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDSDs7QUFHRDs7Ozs7Ozs7OztBQ3hLQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUdBO0FBQ0E7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUVJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUdBO0FBQ0E7QUFHQTtBQUNBO0FBclFxQjtBQTZRekI7Ozs7Ozs7Ozs7Ozs7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFaUTs7QUFlWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFFRztBQUNJO0FBQ0g7QUFDSjtBQUVHO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBRUc7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBRUk7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0o7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFFRztBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUVHO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNKO0FBQ0k7QUFoS1I7QUFrS0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQXFDOztBQUNqQztBQVlIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFFSjs7QUFFRDs7QUFFQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7O0FBRUE7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUo7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUVHO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBQ0o7QUFDSjs7QUFFRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUdKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTs7QUFFQTtBQUVIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIOztBQUVEOztBQUVBO0FBQ0k7QUFDSDs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBRUc7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUo7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSTtBQUNIO0FBQ0Q7QUFFSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQTloQ0k7Ozs7Ozs7Ozs7QUNOVDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQUNKO0FBQ0k7QUFqQlI7QUFtQkg7QUFDSjtBQXBFeUI7O0FBdUU5Qjs7Ozs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSjtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0o7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNKO0FBQ0k7QUFsQlI7QUFvQkg7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ1k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQS9OdUI7O0FBa081Qjs7Ozs7Ozs7OztBQ25PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZVO0FBSWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGUztBQUliO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRk07QUFJVjtBQUNJO0FBQ0E7QUFGSTtBQUlSO0FBQ0E7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBM0RROztBQThEWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFHQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFHQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFNSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBSUo7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFLSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdRO0FBQ0E7QUFPWDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFHRztBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUVHO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBR0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBSVE7QUFDSDtBQUdSO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBR1E7QUFDSDtBQUNSO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUE3Ykk7Ozs7Ozs7Ozs7QUNMVDtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUo7QUFDSTtBQUNBOztBQUVBO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBR0o7Ozs7Ozs7Ozs7QUN6TEE7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBR1k7QUFDSTtBQUNIO0FBQ0o7QUFFWjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDs7Ozs7Ozs7O0FBU0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7QUFFRDtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSDs7QUFFRDtBQUNDO0FBQ0E7QUFDQztBQUNBO0FBQ0U7QUFDQTtBQUNDO0FBQ0E7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0E7QUFDQztBQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJhOzs7Ozs7Ozs7O0FDL0hqQjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQS9GZ0I7O0FBa0dyQjs7Ozs7Ozs7OztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFOUTtBQVFaO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQTFGSTs7Ozs7Ozs7OztBQ0pUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0U7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUVHO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRjtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFqQ1I7QUFtQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBRUc7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBRUg7QUF2Tkk7Ozs7Ozs7Ozs7QUNSVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZPO0FBSVg7QUFDSTtBQUNBO0FBRlU7QUFmTjs7QUFxQlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUoyQztBQU1uRDtBQUNEO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDRDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBMUlJOzs7Ozs7Ozs7O0FDSlQ7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGUTtBQW5CSjs7QUF5Qlo7QUFDQTtBQUNJO0FBQ0k7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDSDtBQTlFSTs7Ozs7Ozs7OztBQ0RUO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNIOztBQUdEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQVJMO0FBVUg7O0FBS0Q7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7O0FBTUE7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDSDs7QUFHRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSDs7Ozs7Ozs7OztBQ2xSRDtBQUNBO0FBQ0E7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlE7O0FBa0JaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQWxESTs7Ozs7Ozs7OztBQ0hUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlM7QUFJYjtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNJO0FBQ0E7QUFGTTtBQUlWO0FBQ0k7QUFDQTtBQUZNO0FBSVY7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZjO0FBSWxCO0FBQ0k7QUFDQTtBQUZXO0FBM0NQOztBQWlEWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDSjtBQTNOSTs7Ozs7Ozs7OztBQ0pUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZhO0FBZlQ7O0FBcUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUE5REk7Ozs7Ozs7Ozs7QUNBUjtBQUNBO0FBQ0E7QUFDQTtBQUNHOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGZTtBQUluQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZVO0FBdkJOOztBQTZCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSjBCO0FBTWpDO0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUF0SUs7Ozs7Ozs7Ozs7QUNIVjtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZhO0FBWFQ7O0FBaUJaO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBekNJOzs7Ozs7Ozs7O0FDRFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjtBQUNBO0FBcEJROztBQXVCWjtBQUNBO0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBM0NLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlk7QUFJaEI7QUFDSTtBQUNBO0FBRlU7QUFJZDtBQW5CUTs7QUFzQlo7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0Q7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0g7QUFFRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBRUc7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBSjJDO0FBTWhEO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUFFRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBbEtJOzs7Ozs7Ozs7O0FDSFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFYVDs7QUFpQlo7QUFDQTtBQUdBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDs7QUFHRDtBQUNBOztBQUVBO0FBekNLOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmM7QUFJbEI7QUFDSTtBQUNBO0FBRlc7QUFJZjs7QUFuQlE7O0FBdUJaO0FBQ0E7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBMUNLOzs7Ozs7Ozs7O0FDQVQ7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBbkJROztBQXNCWjtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFFSjtBQUNEO0FBQ0E7QUFDSDtBQWpFSTs7Ozs7Ozs7OztBQ0ZUO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0k7QUFDQTtBQUZRO0FBSVo7QUFDSTtBQUNBO0FBRlE7QUFJWjtBQUNJO0FBQ0E7QUFGUztBQTNCTDs7QUFpQ1o7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBSGtCO0FBS3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIaUI7QUFLckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIa0I7QUFLdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFIa0I7QUFLdEI7QUFDQTs7QUFFQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQWxHSTs7Ozs7Ozs7OztBQ0RUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmlCO0FBSXJCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGWTtBQUloQjtBQUNJO0FBQ0E7QUFGYztBQUlsQjtBQUNJO0FBQ0E7QUFGVztBQUlmO0FBQ0k7QUFDQTtBQUZnQjtBQUlwQjtBQUNJO0FBQ0E7QUFGVTtBQUlkO0FBQ0k7QUFDQTtBQUZhO0FBSWpCO0FBQ0k7QUFDQTtBQUZlO0FBSW5CO0FBQ0k7QUFDQTtBQUZzQjtBQUkxQjtBQUNJO0FBQ0E7QUFGdUI7QUFJM0I7QUFDSTtBQUNBO0FBRm1CO0FBSXZCO0FBQ0E7QUF4RVE7O0FBMkVaO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBRUc7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFFSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0s7QUFDQTtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBOztBQUVBO0FBbFNLOzs7Ozs7Ozs7O0FDSlQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXJCUTs7QUF3Qlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBOURJIiwic291cmNlc0NvbnRlbnQiOlsiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9hbGVydDogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLmluaXQoe21lc3NhZ2U6XCJ0aGlzIGlzIGp1c3QgdGVzdFwifSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25Mb2FkXVwiKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBwYXJhbXMubWVzc2FnZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2FsZXJ0LnN0cmluZyA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5mYWRlSW4oMC41KSxjYy5kZWxheVRpbWUoMS4wKSxjYy5mYWRlT3V0KDAuNSksY2MucmVtb3ZlU2VsZigpKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11baW5pdF0gbWVzc2FnZSA9IFwiICsgbWVzc2FnZSk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0FsZXJ0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltBbGVydFZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICByYWRpb0J1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVcbiAgICAgICAgfSxcbiAgICAgICAgcGFuZWxHcm91cDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX2dldF91c2VyR29sZDogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfZ2V0X2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX3VzZXJHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9zYXZlX2JhbmtHb2xkOiBjYy5MYWJlbCxcbiAgICAgICAgbV9FZGl0Ym94X2dldF9nb2xkOiBjYy5FZGl0Qm94LFxuICAgICAgICBtX0VkaXRib3hfZ2V0X2JhbmtQd2Q6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9zYXZlX2dvbGQ6IGNjLkVkaXRCb3gsXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBfc2VsZWN0SW5kZXg6MCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2dldF91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfdXNlckdvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxHYW1lU2NvcmU7XG4gICAgICAgIHRoaXMubV9MYWJlbF9nZXRfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3NhdmVfYmFua0dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uRW5hYmxlXVwiKTtcblxuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICByYWRpb0J1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKHRvZ2dsZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJhZGlvQnV0dG9uLmluZGV4T2YodG9nZ2xlKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgdG9nZ2xlLm5vZGUuc2V0TG9jYWxaT3JkZXIoMSk7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiUmFkaW9CdXR0b25cIjtcbiAgICAgICAgc3dpdGNoKGluZGV4KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjFcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjJcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICB0aXRsZSArPSBcIjNcIjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJhZGlvQnV0dG9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMucmFkaW9CdXR0b25baV07XG4gICAgICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsR3JvdXBbaV07XG4gICAgICAgICAgICBpZihjYy5pc1ZhbGlkKGVsZW1lbnQpICYmIGNjLmlzVmFsaWQocGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5ub2RlLnNldExvY2FsWk9yZGVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBwYW5lbC5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2V0TG9jYWxaT3JkZXIoMCk7XG4gICAgICAgICAgICAgICAgICAgIHBhbmVsLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgIC8vIHRoaXMuX3VwZGF0ZVRvZ2dsZUV2ZW50U3RyaW5nKHRpdGxlLCB0aGlzLnJhZGlvQnV0dG9uRXZlbnRTdHJpbmcsIHRvZ2dsZSk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICAvLyB1cmwgKz0gXCIvaHovaHpVcGRhdGVGYWNlSWQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIGlmKHRoaXMuX3NlbGVjdEluZGV4ID09IDApIHtcbiAgICAgICAgICAgIHZhciBzekdvbGRDb3VudCA9IHRoaXMubV9FZGl0Ym94X2dldF9nb2xkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzelBhc3NXb3JkID0gdGhpcy5tX0VkaXRib3hfZ2V0X2JhbmtQd2Quc3RyaW5nO1xuICAgICAgICAgICAgdmFyIHJlID0gLy4vO1xuICAgICAgICAgICAgaWYoc3pHb2xkQ291bnQubGVuZ3RoIDw9IDAgfHwgc3pQYXNzV29yZC5sZW5ndGggPD0gMCl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3miJblr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5oiW5a+G56CB5LiN6IO95Li656m6IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihOdW1iZXIoc3pHb2xkQ291bnQpIDw9IDAgfHwgTnVtYmVyKHN6R29sZENvdW50KSA+IChHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlKSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rpk7booYznmoTph5Hpop3pmZDliLbvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66ZO26KGM55qE6YeR6aKd6ZmQ5Yi2IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcImluc3VyZXBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIyXCI7XG5cbiAgICAgICAgICAgIHVybCArPSBcIi9oei9oelVzZXJCYW5rTW9iaWxlLmFzaHhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9zZWxlY3RJbmRleCA9PSAxKSB7XG4gICAgICAgICAgICB2YXIgc3pHb2xkQ291bnQgPSB0aGlzLm1fRWRpdGJveF9zYXZlX2dvbGQuc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHN6R29sZENvdW50Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDph5Hpop3kuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6YeR6aKd5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKE51bWJlcihzekdvbGRDb3VudCkgPD0gMCB8fCBOdW1iZXIoc3pHb2xkQ291bnQpID4gTnVtYmVyKEdsb2JhbFVzZXJEYXRhLmxsR2FtZVNjb3JlKSl7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDmlbDlgLzkuI3lkIjms5XmiJbotoXlh7rouqvkuIrph5Hpop3vvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5pWw5YC85LiN5ZCI5rOV5oiW6LaF5Ye66Lqr5LiK6YeR6aKd77yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wic2NvcmVcIl0gPSBzekdvbGRDb3VudDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjFcIjtcblxuICAgICAgICAgICAgdXJsICs9IFwiL2h6L2h6VXNlckJhbmtNb2JpbGUuYXNoeFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5fc2VsZWN0SW5kZXggPT0gMikge1xuICAgICAgICAgICAgdmFyIHN6UGFzc1dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICB2YXIgc3pOZXdQYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X25ld1Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgICAgIHZhciBzekNvbmZpcm1QYXNzV29yZCA9IHRoaXMubV9FZGl0Ym94X2NvbmZpcm1QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgICAgICBpZiAoc3pQYXNzV29yZC5sZW5ndGggPD0gMCB8fCBzek5ld1Bhc3NXb3JkLmxlbmd0aCA8PSAwIHx8IHN6Q29uZmlybVBhc3NXb3JkLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSDlr4bnoIHkuI3og73kuLrnqbrvvIFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB5LiN6IO95Li656m677yBXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6UGFzc1dvcmQgPT0gc3pOZXdQYXNzV29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmlrDml6flr4bnoIHkuI3og73nm7jlkIwhXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHN6Q29uZmlybVBhc3NXb3JkICE9IHN6TmV3UGFzc1dvcmQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltCYW5rVmlld11bb25DbGlja0NvbmZpcm1dIOehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzek5ld1Bhc3NXb3JkLmxlbmd0aCA8IDYgfHwgc3pOZXdQYXNzV29yZC5sZW5ndGggPiAxNikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0JhbmtWaWV3XVtvbkNsaWNrQ29uZmlybV0g5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgICAgIHBhcmFtc1tcInR5cGVcIl0gPSBcIjJcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzV29yZCk7XG4gICAgICAgICAgICBwYXJhbXNbXCJuZXdwYXNzXCJdID0gY2MubWQ1RW5jb2RlKHN6TmV3UGFzc1dvcmQpO1xuXG4gICAgICAgICAgICB1cmwgKz0gXCIvaHovaHpVcGRhdGVQYXNzV29yZC5hc2h4XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA9IHZhbHVlLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5pbnN1cmVzY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlID0gdmFsdWUuaW5zdXJlc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQmFua1N1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQmFua1ZpZXddW29uQ2xpY2tDb25maXJtXSBcIiArIHBhcmFtU3RyaW5nKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tTYXZlQWxsOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3NhdmVfZ29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICB9LFxuICAgIG9uQ2xpY2tHZXRBbGw6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfZ2V0X2dvbGQuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEubGxJbnN1cmVTY29yZTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBCYXNlRnJhbWUgPSBjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcy5fdmlld0ZyYW1lID0gdmlldztcbiAgICAgICAgY29uc29sZS5sb2coXCJCYXNlRnJhbWUgb25Mb2FkXCIpO1xuICAgICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm1fdGFiQ2FjaGVNc2cgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcIkJhc2VGcmFtZVwiLFxuICAgIC8vIGN0b3I6IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgLy8gICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgIC8vICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgICAgICBcbiAgICAvLyB9LFxuICAgIHNldENhbGxCYWNrOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrOyAgXG4gICAgfSxcbiAgICBzZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKHZpZXdGcmFtZSl7XG4gICAgICB0aGlzLl92aWV3RnJhbWUgPSB2aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIHNldFNvY2tldEV2ZW50OiBmdW5jdGlvbihzb2NrZXRFdmVudCl7XG4gICAgICAgIHRoaXMuX3NvY2tldEV2ZW50ID0gc29ja2V0RXZlbnQ7XG4gICAgfSxcbiAgICBnZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBpc1NvY2tldFNlcnZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICBpZih0aGlzLl90aHJlYWRpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAge1xuICAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgIC8vdG9kby4uLlxuICAgIH0sXG4gICAgb25DcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKHN6VXJsLG5Qb3J0KXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zelNlcnZlclVybCA9IHN6VXJsO1xuICAgICAgICB0aGlzLl9uU2VydmVyUG9ydCA9IG5Qb3J0O1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgICAgIHNlbGYub25Tb2NrZXRDYWxsQmFjayhwRGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQodGhpcy5fU29ja2V0RnVuKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lKTtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0LkNvbm5lY3RTb2NrZXQodGhpcy5fc3pTZXJ2ZXJVcmwsdGhpcy5fblNlcnZlclBvcnQpID09PSB0cnVlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl90aHJlYWRpZCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib25DcmVhdGVTb2NrZXQgY2xvc2VcIik7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYodGhpcy5fY2FsbEJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ25vIGNhbGxiYWNrJyk7XG4gICAgICAgIC8vICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2FsbEJhY2sgbWFpbjogXCIgKyBtYWluICsgXCIgI3N1YjogXCIrc3ViKTtcbiAgICAgICAgaWYobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQobWFpbiwgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2VTb2NrZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQucmVsZWFzZVNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHNlbmRTb2NrZXREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kU29ja2V0RGF0YShwRGF0YSk7XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkNvbm5lY3RDb21wZWxldGVkXCIpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vblNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIG9uR2FtZVNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uR2FtZVNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUZyYW1lOyIsInZhciBnYW1lX2NtZCA9IHt9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nmbvlvZXmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX0xPR09OID0gMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze055m75b2VXG5cbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9BQ0NPVU5UUyA9IDExICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5oi355m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fVVNFUklEID0gMjIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5nYW1lX2NtZC5TVUJfR1JfTE9HT05fTU9CSUxFID0gMzMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYZcblxuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1NVQ0NFU1MgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leaIkOWKn1xuZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0VSUk9SID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9MT0dPTl9GSU5JU0ggPSA2MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eZu+W9leWujOaIkFxuXG4vLyAvL+aIv+mXtOW4kOWPt+eZu+W9lVxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5QWNjb3VudHNcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1Byb2Nlc3NWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAvL+i/m+eoi+eJiOacrFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+aJi+acuueZu+mZhlxuLy8gc3RydWN0IENNRF9HUl9Mb2dvbkJ5VXNlcklETW9iaWxlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RW5jcnlwdElEOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb2RlQ2hlY2tJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v6ZqP5py656CBMlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdXZWlYaW5DaGVja0lEOyAgICAgICAgICAgICAgICAgICAgLy/lvq7kv6Hpqozor4HnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVBcHBWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/muLjmiI9BUFDniYjmnKzlj7co5LiO55m76ZmG5aSn5Y6F55u45ZCMKVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOyAgIC8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuXG4vLyAvL+aIv+mXtCBJRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQcm9jZXNzVmVyc2lvbjsgICAgICAgICAgICAgICAgICAgLy/ov5vnqIvniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgICAgIC8v5bm/5Zy654mI5pysXG4vLyB9O1xuXG4vLyAvL+eZu+W9leaIkOWKn+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gfTtcblxuLy8gLy/nmbvlvZXlpLHotKVcbi8vIHN0cnVjdCBDTURfR1JfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEVycm9yQ29kZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RXJyb3JEZXNjcmliZVsxMjhdOyAgICAgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nlKjmiLfmlbDmja7ljIXlrprkuYlcblxuZ2FtZV9jbWQuTURNX0dSX1VTRVIgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9TSVRfUkVRID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvor7fmsYJcbmdhbWVfY21kLlNVQl9HUl9VU0VSX0xPT0tPTl9SRVEgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aXgeinguivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBTkRVUF9SRVEgPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1t+eri+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfTEVGVF9HQU1FX1JFUSA9IDQ0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56a75byA5ri45oiPXG5cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0NPTUUgPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+i/m+WFpVxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfU1RBVFVTID0gNjAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1NDT1JFID0gNjAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliIbmlbBcbmdhbWVfY21kLlNVQl9HUl9TSVRfRkFJTEVEID0gNjAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvlpLHotKVcbmdhbWVfY21kLlNVQl9HUl9VU0VSX1JJR0hUID0gNjA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbmdhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVIgPSA2MDUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTEQgPSA2MDYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoumHkeixhlxuZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX1RSQU4gPSA2MDcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoui9rOW4kFxuXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9DSEFUID0gNzAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ogYrlpKnmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX1dJU1BFUiA9IDcwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56eB6K+t5raI5oGvXG5nYW1lX2NtZC5TVUJfR1JfVVNFUl9SVUxFID0gNzAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfop4TliJlcblxuZ2FtZV9jbWQuU1VCX0dSX1VTRVJfSU5WSVRFID0gODAwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgoDor7fmtojmga9cbmdhbWVfY21kLlNVQl9HUl9VU0VSX0lOVklURV9SRVEgPSA4MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mCgOivt+ivt+axglxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTkRfUVVFUlkgPSA4MDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgeafpeivolxuZ2FtZV9jbWQuU1VCX0dSX1BSRVNFTlRfRVJST1IgPSA4MDNcblxuLy8gLy/kvJrlkZjnrYnnuqdcbi8vIHN0cnVjdCBDTURfR1JfTWVtYmVyT3JkZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5bqTIElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlck9yZGVyOyAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuLy8gfTtcblxuLy8gLy/nlKjmiLfmnYPpmZBcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJpZ2h0XG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VyUmlnaHQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfmnYPpmZBcbi8vIH07XG5cbi8vIC8v55So5oi354q25oCBXG4vLyBzdHJ1Y3QgQ01EX0dSX1VzZXJTdGF0dXNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5L2N572uXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aVsOaNruW6kyBJRFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyU3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGFpcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qSF5a2Q5L2N572uXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+WIhuaVsFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxMb3ZlbGluZXNzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36a2F5YqbXG4vLyAgICAgLy9MT05HICAgICAgICAgICAgICAgICAgICAgICAgICBsSW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAvL+a2iOi0uemHkeixhlxuLy8gICAgIC8vTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbEdhbWVHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HosYZcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIHRhZ1VzZXJTY29yZSAgICAgICAgICAgICAgICAgICAgVXNlclNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np6/liIbkv6Hmga9cbi8vIH07XG5cbi8vIC8vc3RydWN0IG9uZVRyYW5SZWNvcmRcbi8vIC8ve1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEO1xuLy8gLy8gIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dO1xuLy8gLy8gIC8vRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VG9Vc2VySUQ7XG4vLyAvLyAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pUb0FjY291bnRzW05BTUVfTEVOXTtcbi8vIC8vICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuZ29sZDtcbi8vIC8vICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuRGF0YVsxNV07XG4vLyAvL1xuLy8gLy99O1xuXG4vLyAvL+afpeivoue7k+aenCB3c2wgMjAxNS40LjFcbi8vIHN0cnVjdCBvbmVUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgLy9EV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUcmFuR2FtZUlEOyAgICAgICAgICAgICAgICAgLy/ovazluJDmuLjmiI9JRFxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VHJhbkdhbWVJRFszMV07ICAgICAgICAgICAgICAgIC8v6L2s5biQ5ri45oiPSURcbi8vICAgICAvL1RDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelRyYW5UeXBlW05BTUVfTEVOXTsgICAgICAgICAgIC8v6L2s5biQ57G75Z6LXG4vLyAgICAgLy9MT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgbFByZXNlbnRWYWx1ZTsgICAgICAgICAgICAgICAgICAvL+i1oOmAgemHkeixhlxuLy8gICAgIC8vVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblRpbWVbMjBdOyAgICAgICAgICAgICAgICAgLy/ovazluJDml7bpl7RcbiAgICBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgLy/nlKjmiLfmmLXnp7Bcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dhbWVJRDsgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291bnQ7ICAgICAgICAgICAgICAgICAgICAvL+aVsOmHj1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Rmxvd2VyTmFtZVszMl07ICAgICAgICAgICAvL+ekvOeJqeWQjeensFxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VHJhblR5cGVbTkFNRV9MRU5dOyAgICAgICAvL+i9rOW4kOexu+Wei1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9UcmFuR29sZFJlY29yZFJcbi8vIHtcbi8vICAgICBCWVRFICAgIG51bTsvL+acieWHoOadoeihqFxuLy8gICAgIG9uZVRyYW5SZWNvcmQgICBvbmV0cmFucmVjb3JkWzEwXTsvL+acgOWkmuWNgeadoeiusOW9leS4gOWPkVxuLy8gfTtcblxuLy8gLy8vLy/nlKjmiLfmn6Xor6Lph5HosYbnu5PmnpwgMjAxMS43LjE1IGJ5IGdhb3NoYW5cbi8vIHN0cnVjdCBDTURfR1JfVXNlclF1aUJhbmtlclxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAgLy/pk7booYzph5HosYZcbi8vICAgICBDTURfR1BfVHJhbkdvbGRSZWNvcmRSICAgICAgICAgICAgICBUcmFuUmVjb3JkO1xuLy8gfTtcblxuLy8gLy/or7fmsYLlnZDkuItcbi8vIHN0cnVjdCBDTURfR1JfVXNlclNpdFJlcVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JQYXNzTGVuOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplb/luqZcbi8vICAgICAvL0RXT1JEICAgICAgICAgICAgICAgICAgICAgICAgIGR3QW5zd2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Zue562UIEkgRC8v5YW85a6556ev5YiG5ri45oiP5YWl5bqn6Zeu6aKYXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhaXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1RhYmxlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDkvY3nva5cbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VGFibGVQYXNzW1BBU1NfTEVOXTsgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlUmVxXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLyAvL+WdkOS4i+Wksei0pVxuLy8gc3RydWN0IENNRF9HUl9TaXRGYWlsZWRcbi8vIHtcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RmFpbGVkRGVzY3JpYmVbMjU2XTsgICAgICAgICAgICAgIC8v6ZSZ6K+v5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+iBiuWkqee7k+aehFxuLy8gc3RydWN0IENNRF9HUl9Vc2VyQ2hhdFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYXRMZW5ndGg7ICAgICAgICAgICAgICAgICAgICAgICAgLy/kv6Hmga/plb/luqZcbi8vICAgICBDT0xPUlJFRiAgICAgICAgICAgICAgICAgICAgICAgIGNyRm9udENvbG9yOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6aKc6ImyXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1NlbmRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgeeUqOaIt1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q2hhdE1lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgICAgIC8v6IGK5aSp5L+h5oGvXG4vLyB9O1xuXG4vLyAvL+engeivree7k+aehFxuLy8gc3RydWN0IENNRF9HUl9XaXNwZXJcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDaGF0TGVuZ3RoOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv6ZW/5bqmXG4vLyAgICAgQ09MT1JSRUYgICAgICAgICAgICAgICAgICAgICAgICBjckZvbnRDb2xvcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+minOiJslxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdTZW5kVXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICBzekNoYXRNZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgICAvL+iBiuWkqeS/oeaBr1xuLy8gfTtcblxuLy8gLy/nlKjmiLfop4TliJlcbi8vIHN0cnVjdCBDTURfR1JfVXNlclJ1bGVcbi8vIHtcbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQYXNzd29yZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6K6+572u5a+G56CBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiTGltaXRXaW47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mZkOWItuiDnOeOh1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxpbWl0RmxlZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbmlq3nur9cbi8vICAgICBib29sICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJMaW1pdFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi25YiG5pWwXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiQ2hlY2tTYW1lSVA7ICAgICAgICAgICAgICAgICAgICAgICAvL+aViOmqjOWcsOWdgFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpblJhdGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pmZDliLbog5znjodcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGbGVlUmF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZmQ5Yi26YCD6LeRXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOmrmOWIhuaVsFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbExlc3NTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDkvY7liIbmlbBcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc3dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgICAgIC8v5qGM5a2Q5a+G56CBXG4vLyB9O1xuXG4vLyAvL+mCgOivt+eUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9Vc2VySW52aXRlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOWPt+eggVxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/phY3nva7kv6Hmga/mlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX0lORk8gPSAzMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mFjee9ruS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfU0VSVkVSX0lORk8gPSA5MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOmFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX09SREVSX0lORk8gPSA5MDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+mFjee9rlxuZ2FtZV9jbWQuU1VCX0dSX01FTUJFUl9JTkZPID0gOTAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjphY3nva5cbmdhbWVfY21kLlNVQl9HUl9DT0xVTU5fSU5GTyA9IDkwMyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo6YWN572uXG5nYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSCA9IDkwNCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5a6M5oiQXG5cbi8vIC8v5ri45oiP5oi/6Ze05L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlcnZlckluZm9cbi8vIHtcbi8vICAgICAvL+aIv+mXtOWxnuaAp1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlyQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdHYW1lR2VucmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnosgSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1ZpZGVvQWRkcjsgICAgICAgICAgICAgICAgICAgICAgICAvL+inhumikeWcsOWdgFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIaWRlVXNlckluZm87ICAgICAgICAgICAgICAgICAgICAgLy/pmpDol4/kv6Hmga9cbi8vIH07XG5cbi8vIC8v5YiG5pWw5o+P6L+w5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1Njb3JlSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0Rlc2NyaWJlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/mj4/ov7DmlbDnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdEYXRhRGVzY3JpYmVbMTZdOyAgICAgICAgICAgICAgICAgIC8v5pWw5o2u5qCH5b+XXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOe7k+aehFxuLy8gc3RydWN0IHRhZ09yZGVySXRlbVxuLy8ge1xuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnnuqfnp6/liIZcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckRlc2NyaWJlWzE2XTsgICAgICAgICAgICAgICAgIC8v562J57qn5o+P6L+wXG4vLyB9O1xuXG4vLyAvL+etiee6p+aPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9PcmRlckluZm9cbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdPcmRlckNvdW50OyAgICAgICAgICAgICAgICAgICAgICAgIC8v562J57qn5pWw55uuXG4vLyAgICAgdGFnT3JkZXJJdGVtICAgICAgICAgICAgICAgICAgICBPcmRlckl0ZW1bMTI4XTsgICAgICAgICAgICAgICAgICAgICAvL+etiee6p+aPj+i/sFxuLy8gfTtcblxuLy8gLy/liJfooajpobnmj4/ov7Dnu5PmnoRcbi8vIHN0cnVjdCB0YWdDb2x1bW5JdGVtXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uV2lkdGg7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOWuveW6plxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0RhdGFEZXNjcmliZTsgICAgICAgICAgICAgICAgICAgICAgLy/lrZfmrrXnsbvlnotcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Q29sdW1uTmFtZVsxNl07ICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5ZCN5a2XXG4vLyB9O1xuXG4vLyAvL+WIl+ihqOaPj+i/sOS/oeaBr1xuLy8gc3RydWN0IENNRF9HUl9Db2x1bW5JbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29sdW1uQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+WIl+ihqOaVsOebrlxuLy8gICAgIHRhZ0NvbHVtbkl0ZW0gICAgICAgICAgICAgICAgICAgQ29sdW1uSXRlbVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/liJfooajmj4/ov7Bcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOeKtuaAgeaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1RBVFVTID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nirbmgIHkv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX0lORk8gPSA2MDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOS/oeaBr1xuZ2FtZV9jbWQuU1VCX0dSX1RBQkxFX1NUQVRVUyA9IDYwMSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q54q25oCBXG5cbi8vIC8v5qGM5a2Q54q25oCB57uT5p6EXG4vLyBzdHJ1Y3QgdGFnVGFibGVTdGF0dXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJQbGF5U3RhdHVzOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gfTtcblxuLy8gLy/moYzlrZDnirbmgIHmlbDnu4Rcbi8vIHN0cnVjdCBDTURfR1JfVGFibGVJbmZvXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3VGFibGVDb3VudDsgICAgICAgICAgICAgICAgICAgICAgICAvL+ahjOWtkOaVsOebrlxuLy8gICAgIHRhZ1RhYmxlU3RhdHVzICAgICAgICAgICAgICAgICAgVGFibGVTdGF0dXNbNTEyXTsgICAgICAgICAgICAgICAgICAgLy/nirbmgIHmlbDnu4Rcbi8vIH07XG5cbi8vIC8v5qGM5a2Q54q25oCB5L+h5oGvXG4vLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlU3RhdHVzXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiVGFibGVMb2NrOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+mUgeWumueKtuaAgVxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgYlBsYXlTdGF0dXM7ICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGM5a2Q5Y+356CBXG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/nrqHnkIbmlbDmja7ljIVcblxuZ2FtZV9jbWQuTURNX0dSX01BTkFHRVIgPSA1NSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuWRveS7pFxuXG5nYW1lX2NtZC5TVUJfR1JfU0VORF9XQVJOSU5HID0gMTEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HpgIHorablkYpcbmdhbWVfY21kLlNVQl9HUl9TRU5EX01FU1NBR0UgPSAyMiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkemAgea2iOaBr1xuZ2FtZV9jbWQuU1VCX0dSX0xPT0tfVVNFUl9JUCA9IDMzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l55yL5Zyw5Z2AXG5nYW1lX2NtZC5TVUJfR1JfS0lMTF9VU0VSID0gNDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ouKLlh7rnlKjmiLdcbmdhbWVfY21kLlNVQl9HUl9MSU1JVF9BQ0NPVU5TID0gNTUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npoHnlKjluJDmiLdcbmdhbWVfY21kLlNVQl9HUl9TRVRfVVNFUl9SSUdIVCA9IDY2ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p2D6ZmQ6K6+572uXG5nYW1lX2NtZC5TVUJfR1JfT1BUSU9OX1NFUlZFUiA9IDc3ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5oi/6Ze06K6+572uXG5cbi8vIC8v5Y+R6YCB6K2m5ZGKXG4vLyBzdHJ1Y3QgQ01EX0dSX1NlbmRXYXJuaW5nXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6V2FybmluZ01lc3NhZ2VbTUFYX0NIQVRfTEVOXTsgICAgIC8v6K2m5ZGK5raI5oGvXG4vLyB9O1xuXG4vLyAvL+ezu+e7n+a2iOaBr1xuLy8gc3RydWN0IENNRF9HUl9TZW5kTWVzc2FnZVxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHYW1lOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUm9vbTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5raI5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2hhdExlbmd0aDsgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pTeXN0ZW1NZXNzYWdlW01BWF9DSEFUX0xFTl07ICAgICAgLy/ns7vnu5/mtojmga9cbi8vIH07XG5cbi8vIC8v5p+l55yL5Zyw5Z2AXG4vLyBzdHJ1Y3QgQ01EX0dSX0xvb2tVc2VySVBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+i4ouWHuueUqOaIt1xuLy8gc3RydWN0IENNRF9HUl9LaWxsVXNlclxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdUYXJnZXRVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgLy/nm67moIfnlKjmiLdcbi8vIH07XG5cbi8vIC8v56aB55So5biQ5oi3XG4vLyBzdHJ1Y3QgQ01EX0dSX0xpbWl0QWNjb3VudHNcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyB9O1xuXG4vLyAvL+adg+mZkOiuvue9rlxuLy8gc3RydWN0IENNRF9HUl9TZXRVc2VyUmlnaHRcbi8vIHtcbi8vICAgICAvL+e7keWumuWPmOmHj1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JBY2NvdW50c1JpZ2h0OyAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fmnYPpmZBcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiR2FtZVJpZ2h0OyAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35p2D6ZmQXG4vLyAgICAgLy/nm67moIfnlKjmiLdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VGFyZ2V0VXNlcklEOyAgICAgICAgICAgICAgICAgICAgIC8v55uu5qCH55So5oi3XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0Um9vbUNoYXQ7ICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuLy8gICAgIC8v5p2D6ZmQ5Y+Y5YyWXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0TG9va29uR2FtZTsgICAgICAgICAgICAgICAgICAvL+aXgeinguadg+mZkFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMaW1pdEdhbWVDaGF0OyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ogYrlpKlcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGltaXRTZW5kV2lzcGVyOyAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5raI5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxpbWl0UGxheUdhbWU7ICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+adg+mZkFxuLy8gfTtcblxuLy/orr7nva7moIflv5dcbmdhbWVfY21kLk9TRl9ST09NX0NIQVQgPSAxICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheiBiuWkqVxuZ2FtZV9jbWQuT1NGX0dBTUVfQ0hBVCA9IDIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6IGK5aSpXG5nYW1lX2NtZC5PU0ZfUk9PTV9XSVNQRVIgPSAzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+WOheengeiBilxuZ2FtZV9jbWQuT1NGX0VOVEVSX0dBTUUgPSA0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpea4uOaIj1xuZ2FtZV9jbWQuT1NGX0VOVEVSX1JPT00gPSA1ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i/m+WFpeaIv+mXtFxuZ2FtZV9jbWQuT1NGX1NIQUxMX0NMT1NFID0gNiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ljbPlsIblhbPpl61cblxuLy8gLy/miL/pl7Torr7nva5cbi8vIHN0cnVjdCBDTURfR1JfT3B0aW9uU2VydmVyXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk9wdGlvbkZsYWdzOyAgICAgICAgICAgICAgICAgICAgICAvL+iuvue9ruagh+W/l1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JPcHRpb25WYWx1ZTsgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7moIflv5dcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+aVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU1lTVEVNID0gNjYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/kv6Hmga9cblxuZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0UgPSAyMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vL+a2iOaBr+exu+Wei1xuZ2FtZV9jbWQuU01UX0lORk8gPSAweDAwMDEgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+a2iOaBr1xuZ2FtZV9jbWQuU01UX0VKRUNUID0gMHgwMDAyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbmdhbWVfY21kLlNNVF9HTE9CQUwgPSAweDAwMDQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xuZ2FtZV9jbWQuU01UX1NDT1JFX05PVEVOT1VHSCA9IDB4MDAwOCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YeR5biB5LiN5aSfXG5nYW1lX2NtZC5TTVRfQ0xPU0VfUk9PTSA9IDB4MTAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5oi/6Ze0XG5nYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSA9IDB4NDAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lit5pat6L+e5o6lXG5cbi8vIC8v5raI5oGv5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX0dSX01lc3NhZ2Vcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNZXNzYWdlVHlwZTsgICAgICAgICAgICAgICAgICAgICAgIC8v5raI5oGv57G75Z6LXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3TWVzc2FnZUxlbmd0aDsgICAgICAgICAgICAgICAgICAgICAvL+a2iOaBr+mVv+W6plxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pDb250ZW50WzEwMjRdOyAgICAgICAgICAgICAgICAgICAgLy/mtojmga/lhoXlrrlcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+aIv+mXtOaVsOaNruWMhVxuXG5nYW1lX2NtZC5NRE1fR1JfU0VSVkVSX0lORk8gPSA3NyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuXG5nYW1lX2NtZC5TVUJfR1JfT05MSU5FX0NPVU5UX0lORk8gPSAxMDAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WcqOe6v+S/oeaBr1xuXG4vLyAvL+S6uuaVsOS/oeaBr1xuLy8gc3RydWN0IHRhZ09uTGluZUNvdW50SW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0tpbmRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovmoIfor4Zcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgIC8v5Zyo57q/5Lq65pWwXG4vLyB9O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZV9jbWQ7IiwidmFyIHBsYXphX2NtZCA9IHt9O1xuXG4vL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9MT1cgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxucGxhemFfY21kLlZFUl9QTEFaQV9ISUdIID0gMTY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vIHBsYXphX2NtZC5WRVJfUExBWkFfRlJBTUUgPSBNQUtFTE9ORzsoVkVSX1BMQVpBX0xPVyxWRVJfUExBWkFfSElHSClcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V6ZSZ6K+v5qCH6K+GXG5cbnBsYXphX2NtZC5FUkNfR1BfTE9HT05fU1VDQ0VTUyA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55m76ZmG5oiQ5YqfXG5wbGF6YV9jbWQuRVJDX0dQX0FDQ09VTlRTX05PVF9FWElTVCA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5biQ5Y+35LiN5a2Y5ZyoXG5wbGF6YV9jbWQuRVJDX0dQX0xPTkdfTlVMTElUWSA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56aB5q2i55m75b2VXG5wbGF6YV9jbWQuRVJDX0dQX1BBU1NXT1JEX0VSQ09SID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr4bnoIHplJnor69cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v55m75b2V5ZG95Luk56CBXG5cbnBsYXphX2NtZC5NRE1fR1BfTE9HT04gPSAxMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX0FDQ09VTlRTID0gMzAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/luJDlj7fnmbvlvZVcbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fVVNFUklEID0gMzAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JIEQg55m75b2VXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX0FDQ09VTlRTID0gMzAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfVVBMT0FEX0NVU1RPTV9GQUNFID0gMzA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fUkVDT1JEID0gMzA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrprkuYnlpLTlg49cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xucGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUgPSAxNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuuW5v+WcuueZu+W9lVxuXG5wbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSA9IDE1MDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py655m76ZmGXG5wbGF6YV9jbWQuU1VCX0dQX1JFR0lTVEVSX01PQklMRSA9IDE1MTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5py65rOo5YaMXG5cbnBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUgPSAyNjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuaIkOWKn1xucGxhemFfY21kLlNVQl9HUF9MT0dPTl9FUlJPUl9NT0JJTEUgPSAyNjE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJi+acuueZu+mZhuWksei0pVxucGxhemFfY21kLlNVQl9HUF9MT0dPTl9GSU5JU0hfTU9CSUxFID0gMjYyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvmnLrnmbvpmYblrozmiJBcblxuLy8gLy/luJDlj7fnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeUFjY291bnRzTW9iaWxlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlOyAgICAgICAgICAgICAgICAvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbldlaVhpbkF1dGhJRDsgICAgICAgICAgICAgICAgICAvL+W+ruS/oemqjOivgSAvL+WFvOWuueS9v+eUqD4xMDAwd+aJq+eggeeZu+mZhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwS2luZDsgICAgICAgICAgICAgICAgLy/miYvmnLpBUFDmuLjmiI9JRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy/miYvmnLpBUFDniYjmnKxcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dOy8v5py65Zmo5bqP5YiX5Y+3XG4vLyB9O1xuLy8gLy/ms6jlhozluJDlj7dcbi8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c01vYmxpZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLfmgKfliKtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZVN5c1R5cGU7ICAgICAgICAgICAgICAgIC8v5omL5py65pON5L2c57O757uf57G75Z6LKDHoi7nmnpzns7vnu58gMuWuieWNk+ezu+e7nylcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd01vYmlsZUFwcEtpbmQ7ICAgICAgICAgICAgICAgIC8vIOW5v+WcuuaJi+acuueJiOacrFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TW9iaWxlQXBwVmVyc2lvbjsgICAgICAgICAgICAgLy8g5bm/5Zy65omL5py654mI5pysXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvLyDnmbvlvZXluJDlj7dcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8vIOeZu+W9leWvhueggVxuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6TW9iaWxlcGhvbmVbTU9CSUxFUEhPTkVfTEVOXTsgLy8g5omL5py6XG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAvLyDmmLXnp7Bcbi8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZUF1dGhbTkFNRV9MRU5dOyAgICAgICAgIC8v5omL5py66aqM6K+B56CBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pNb2JpbGVNYWNoaW5lW0NPTVBVVEVSX0lEX0xFTl07Ly/mnLrlmajluo/liJflj7dcbi8vIH07XG5cbi8vIC8v5omL5py655m76ZmG5oiQ5YqfXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuLy8ge1xuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkJpbmRXZWlYaW47ICAgICAgICAgICAgICAgICAgIC8v57uR5a6a5b6u5L+hIFdTTFxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1lbWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmNyeXB0SUQ7ICAgICAgICAgICAgICAgICAgICAgLy/pmo/mnLrnoIExXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvZGVDaGVja0lEOyAgICAgICAgICAgICAgICAgICAvL+maj+acuueggTJcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0V4cGVyaWVuY2U7ICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHYW1lSUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIjyBJIERcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxsR2FtZVNjb3JlOyAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbEluc3VyZVNjb3JlOyAgICAgICAgICAgICAgICAgIC8v6ZO26KGM6YeR5biBXG4vLyAgICAgVENIQVIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBY2NvdW50c1tOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leW4kOWPt1xuLy8gICAgIFRDSEFSICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6Tmlja05hbWVbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mmLXnp7Bcbi8vIH07XG5cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vIC8v5biQ5Y+355m75b2VXG4vLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uQnlBY2NvdW50c1xuLy8ge1xuXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JVc2VyUGhvbmVUYWc7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdQbGF6YVZlcnNpb247ICAgICAgICAgICAgICAgICAvL+W5v+WcuueJiOacrFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6QWNjb3VudHNbTkFNRV9MRU5dOyAgICAgICAgICAgLy/nmbvlvZXluJDlj7dcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgICAgIC8v55m75b2V5a+G56CBXG4vLyB9O1xuXG4vLyAvL0kgRCDnmbvlvZVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25CeVVzZXJJRFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6UGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgICAgLy/nmbvlvZXlr4bnoIFcbi8vIH07XG5cbi8vIC8v5rOo5YaM5biQ5Y+3XG4vLyBzdHJ1Y3QgQ01EX0dQX1JlZ2lzdGVyQWNjb3VudHNcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP5qCH6K+GXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3UGxhemFWZXJzaW9uOyAgICAgICAgICAgICAgICAgLy/lub/lnLrniYjmnKxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q2l0eU51bTsgICAgICAgICAgICAgICAgICAgICAgIC8v5Z+O5biC57yW56CBXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JFbmpveVR5cGU7ICAgICAgICAgICAgICAgICAgICAvL+WKoOWFpeexu+Wei1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6U3ByZWFkZXJbTkFNRV9MRU5dOyAgICAgICAgICAgLy/mjqjlub/kurrlkI1cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekFjY291bnRzW05BTUVfTEVOXTsgICAgICAgICAgIC8v55m75b2V5biQ5Y+3XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek5pY2tOYW1lW05BTUVfTEVOXTsgICAgICAgICAgIC8v55So5oi35pi156ewXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pQYXNzV29yZFtQQVNTX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pSZWFsTmFtZVtOQU1FX0xFTl07XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pJZGVudGl0eVtOQU1FX0xFTl07ICAgICAgICAgICAvL+eZu+W9leWvhueggVxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFbmpveUNvZGVbUEFTU19MRU5dOyAgICAgICAgICAvL+aOqOiNkOeggW9y5paw5omL56CBXG4vLyB9O1xuXG4vLyAvL+eZu+mZhuaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Mb2dvblN1Y2Nlc3Ncbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEOyAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP57Si5byVXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JHZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTWVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy/kvJrlkZjnrYnnuqdcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3R2FtZUlEOyAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdFeHBlcmllbmNlOyAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuICAgIFxuLy8gICAgIC8v5omp5bGV5L+h5oGvXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXN0b21GYWNlVmVyOyAgICAgICAgICAgICAgICAvL+WktOWDj+eJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTW9vck1hY2hpbmU7ICAgICAgICAgICAgICAgICAgLy/plIHlrprmnLrlmahcblxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Rm9ydHVuZUNvaW47ICAgICAgICAgICAgICAgICAgLy/npo/luIFcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0dvbGQ7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LmQ6LGGXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdJbnN1cmVTY29yZTsgICAgICAgICAgICAgICAgICAvL+S5kOixhlxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3Q291cG9uOyAgICAgICAgICAgICAgICAgICAgICAgLy/ngavohb9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgIC8v54Gr6IW/XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdNYXRjaFRpY2tldDsgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRmlyc3RCYW5rOyAgICAgICAgICAgICAgICAgICAgLy8g6aaW5qyh5L2/55SoXG5cbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelVzZXJQaG9uZUluZm9yWzE2XTsgICAgICAgICAgIC8v55So5oi35omL5py6XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pFcnJvckRlc2NyaWJlWzEyOF07ICAgICAgICAgICAvL+mUmeivr+a2iOaBr1xuLy8gfTtcblxuLy8gLy/nmbvpmYblpLHotKVcbi8vIHN0cnVjdCBDTURfR1BfTG9nb25FcnJvclxuLy8ge1xuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxFcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgLy/plJnor6/ku6PnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekVycm9yRGVzY3JpYmVbMTI4XTsgICAgICAgICAgIC8v6ZSZ6K+v5raI5oGvXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgdGFnQXdhcmRJbmZvXG4vLyB7XG4vLyAgICAgaW50ICAgICBuQXdhcmRHb2xkWzddO1xuLy8gfTtcblxuLy8gdHlwZWRlZiBzdHJ1Y3Rcbi8vIHtcbi8vICAgICB0YWdBd2FyZEluZm8gaW5mbztcbi8vICAgICBCWVRFICAgICAgICBJc0NoZWNrZWQ7XG4vLyAgICAgaW50ICAgICAgICAgbkxvZ29uVGltZTtcbi8vIH1DTURfR1BfQXdhcmRJbmZvO1xuLy8gLy/moKHpqoznlKjmiLfkv6Hmga9cbi8vIHN0cnVjdCBDTURfR1BfQ2hlY2tSZWdpc3RlclxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6RGF0YVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmxhZzsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vMDrmo4DmtYvotKblj7cgMTrmo4DmtYvmmLXnp7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy/muLjmiI/liJfooajlkb3ku6TnoIFcblxucGxhemFfY21kLk1ETV9HUF9TRVJWRVJfTElTVCA9IDE3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfTElTVF9UWVBFID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nsbvlnovliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9LSU5EID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/np43nsbvliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TVEFUSU9OID0gNTAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nq5nngrnliJfooahcbnBsYXphX2NtZC5TVUJfR1BfTElTVF9TRVJWRVIgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOWIl+ihqFxucGxhemFfY21kLlNVQl9HUF9MSVNUX0ZJTklTSCA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R6YCB5a6M5oiQXG5wbGF6YV9jbWQuU1VCX0dQX0xJU1RfQ09ORklHID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liJfooajphY3nva5cblxuLy8gLy/liJfooajphY3nva5cbi8vIHN0cnVjdCBDTURfR1BfTGlzdENvbmZpZ1xuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJTaG93T25MaW5lQ291bnQ7ICAgICAgICAgICAgICAgLy/mmL7npLrkurrmlbBcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vL+ezu+e7n+WRveS7pOeggVxuXG5wbGF6YV9jbWQuTURNX0dQX1NZU1RFTSA9IDE5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57O757uf5ZG95LukXG5cbnBsYXphX2NtZC5TVUJfR1BfVkVSU0lPTiA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v54mI5pys6YCa55+lXG5wbGF6YV9jbWQuU1VCX1NQX1NZU1RFTV9NU0cgPSA1MDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ezu+e7n+a2iOaBr1xuXG4vLyAvL+eJiOacrOmAmuefpVxuLy8gc3RydWN0IENNRF9HUF9WZXJzaW9uXG4vLyB7XG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk5ld1ZlcnNpb247ICAgICAgICAgICAgICAgICAgICAvL+abtOaWsOeJiOacrFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJBbGxvd0Nvbm5lY3Q7ICAgICAgICAgICAgICAgICAgLy/lhYHorrjov57mjqVcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnBsYXphX2NtZC5NRE1fR1BfVVNFUiA9IDIyOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35L+h5oGvXG5cbnBsYXphX2NtZC5TVUJfR1BfVVNFUl9VUExPQURfRkFDRSA9IDUwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VTRVJfRE9XTkxPQURfRkFDRSA9IDUwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiL6L295aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX1VQTE9BRF9GQUNFX1JFU1VMVCA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0RFTEVURV9GQUNFX1JFU1VMVCA9IDUwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX0NVU1RPTV9GQUNFX0RFTEVURSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aS05YOPXG5wbGF6YV9jbWQuU1VCX0dQX01PRElGWV9JTkRJVklEVUFMID0gNTA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kuKrkurrotYTmlplcbnBsYXphX2NtZC5TVUJfR1BfTU9ESUZZX0lORElWSURVQUxfUkVTVUxUID0gNTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/kv67mlLnnu5PmnpxcblxucGxhemFfY21kLlNVQl9HUF9TQUZFX0JJTkQgPSA1MDc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutue7keWumlxucGxhemFfY21kLlNVQl9HUF9TQUZFX1VOQklORCA9IDUwODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Kej6Zmk57uR5a6aXG5wbGF6YV9jbWQuU1VCX0dQX0NIRUNLX1BTRCA9IDUwOTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+G56CB6aqM6K+BIFdTTCAyMDE1LjMuMjdcblxuXG5wbGF6YV9jbWQuTURNX0dQX1JFRyA9IDIzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+azqOWGjFxucGxhemFfY21kLlNVQl9HUF9JTklUX1JFR0lTVEVSID0gNTAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ms6jlhozluJDlj7dcbnBsYXphX2NtZC5TVUJfR1BfQ0FOQ0VMX1JFR0lTVEVSID0gNTAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflj5bmtojms6jlhoxcbnBsYXphX2NtZC5TVUJfR1BfUkVGVVNFX1JFRyA9IDUwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95rOo5YaMXG5wbGF6YV9jbWQuU1VCX0dQX0NBTl9SRUcgPSA1MDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peazqOWGjFxucGxhemFfY21kLlNVQl9HUF9HRVRfUkVHQ09ERSA9IDUwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERSA9IDUwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xucGxhemFfY21kLlNVQl9HUF9SRVRfUkVHQ09ERV9FUlJPUiA9IDUwNjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55Sz6K+35rOo5YaM56CBIHdzbCAyMDE1LjQuM1xuXG4vLyAvL+S4quS6uui1hOaWmVxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOaWNrTmFtZVtOQU1FX0xFTl07ICAgICAgICAgICAgICAgLy/njqnlrrbmmLXnp7Bcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5HZW5kZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a625oCn5YirXG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQWdlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuW5tOm+hFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pBZGRyZXNzWzY0XTsgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrblnLDlnYBcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN6VW5kZXJXcml0ZVszMl07ICAgICAgICAgICAgICAgICAgIC8v5Liq5oCn562+5ZCNXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzelBhc3N3b3JkWzMzXTsgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutuWvhueggVxuLy8gfTtcblxuLy8gLy/lrprkuYnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkQ3VzdG9tRmFjZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFNpemU7ICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN5aSn5bCPXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYkxhc3RQYWNrZXQ7ICAgICAgICAgICAgICAgICAgICAvL+acgOWQjuagh+ivhlxuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJGaXJzdFBhY2tldDsgICAgICAgICAgICAgICAgICAgLy/nrKzkuIDkuKrmoIfor4Zcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgIC8v5aS05YOP5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+S4i+i9veaIkOWKn1xuLy8gc3RydWN0IENNRF9HUF9Eb3dubG9hZEZhY2VTdWNjZXNzXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1RvbHRhbFNpemU7ICAgICAgICAgICAgICAgICAgICAgICAvL+aAu+WFseWkp+Wwj1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDdXJyZW50U2l6ZTsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lpKflsI9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3VXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v546p5a62IElEXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICBiRmFjZURhdGFbMjA0OF07ICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+aVsOaNrlxuLy8gfTtcblxuLy8gLy/kuIvovb3lpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRG93bmxvYWRGYWNlXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd1VzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eOqeWutiBJRFxuLy8gfTtcblxuLy8gLy/kuIrkvKDnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfVXBsb2FkRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTnu5Pmnpxcbi8vIHN0cnVjdCBDTURfR1BfRGVsZXRlRmFjZVJlc3VsdFxuLy8ge1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZU1zZ1sxMjhdOyAgICAgICAgICAgICAgICAgLy/mj4/ov7Dkv6Hmga9cbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICBiT3BlcmF0ZVN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAvL+aIkOWKn+agh+ivhlxuLy8gfTtcblxuLy8gLy/liKDpmaTmtojmga9cbi8vIHN0cnVjdCBDTURfR1BfQ3VzdG9tRmFjZURlbGV0ZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/njqnlrrYgSURcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3RmFjZVZlcjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOP54mI5pysXG4vLyB9O1xuLy8gLy/kv67mlLnlpLTlg49cbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICB3RmFjZUlEO1xuLy8gfTtcbi8vIHN0cnVjdCBDTURfR1BfRmFjZUNoYW5nZVJlc3VsdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JSZXN1bHRJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57nu5Pmnpxcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdGYWNlSUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aS05YOPSURcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfVXNlckluZm9cbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3SW5zdXJlU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgIC8v5L+d6Zmp566x56aP5biBXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0luc3VyZUNvdXBvbjsgICAgICAgICAgICAgICAgICAgICAvL+S/nemZqeeusei0neWjs1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdDb3Vwb247ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/otJ3lo7PmlbBcbi8vICAgICBEV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgIGR3TWF0Y2hUaWNrZXQ7ICAgICAgICAgICAgICAgICAgICAgIC8v6Zeo56Wo5pWwXG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICBkd0ZvcnR1bmVDb2luOyAgICAgICAgICAgICAgICAgICAgICAvL+emj+ixhuaVsFxuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdHb2xkOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/npo/luIHmlbBcbi8vIH07XG4vLyAvL+S/ruaUuee7k+aenFxuLy8gc3RydWN0IENNRF9HUF9Nb2RpZnlJbmRpdmlkdWFsUmVzdWx0XG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICBzekRlc2NyaWJlTXNnWzEyOF07ICAgICAgICAgICAgICAgICAvL+aPj+i/sOS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk9wZXJhdGVTdWNjZXNzOyAgICAgICAgICAgICAgICAgICAgLy/miJDlip/moIfor4Zcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfR2V0TG9nb25Bd2FyZFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgZHdVc2VySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLdJRFxuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgblRpbWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lh6DnrYnlpZblirFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgIGxTY29yZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6I635b6X5aWW5YqxXG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1JldHVyblxuLy8ge1xuLy8gICAgIGludCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbkNvZGU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm55jb2RlXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICBsVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WAvFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pEZXNjcmliZVszMl07ICAgICAgICAgICAgICAgICAgICAgLy/ov5Tlm57mj4/ov7Bcbi8vIH07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8g6ZO26KGM5pON5L2cKOW8gOWIhuWGmSzlh4/lsJHliKTmlq3lrZfoioIpXG5wbGF6YV9jbWQuTURNX0dQX0JBTksgPSA1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpk7booYzkv6Hmga9cblxuLy8g5a6i5oi356uv6K+35rGCXG5wbGF6YV9jbWQuU1VCX0dQX0NIQU5HRV9QQVNTV09SRCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRSA9IDEwMTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOafpeeci+iusOW9lVxucGxhemFfY21kLlNVQl9HUF9CQU5LX1NUT1JBR0UgPSAxMDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19HRVQgPSAxMDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0UgPSAxMDQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjlpZbliLhcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX0dFVCA9IDEwNTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWlluWIuFxuXG4vLyDor7fmsYLlupTnrZRcbnBsYXphX2NtZC5TVUJfR1BfQ0hBTkdFX1BBU1NXT1JEX1JFUyA9IDExMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS/ruaUueWvhueggVxuLy9wbGF6YV9jbWQuU1VCX0dQX0xPT0tfU0FWRV9SRVMgPSAxMTE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmn6XnnIvorrDlvZVcbnBsYXphX2NtZC5TVUJfR1BfQkFOS19TVE9SQUdFX1JFUyA9IDExMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOmHkeW4gVxucGxhemFfY21kLlNVQl9HUF9CQU5LX0dFVF9SRVMgPSAxMTM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bph5HluIFcbnBsYXphX2NtZC5TVUJfR1BfQ09VUE9OX1NUT1JBR0VfUkVTID0gMTE0OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo5aWW5Yi4XG5wbGF6YV9jbWQuU1VCX0dQX0NPVVBPTl9HRVRfUkVTID0gMTE1OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5aWW5Yi4XG5cblxuLy8gLy8g5L+u5pS55a+G56CBXG4vLyBzdHJ1Y3QgQ01EX0dQX0NoYW5nZVBhc3NXb3JkXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3QmtQYXNzV29yZFtQQVNTX0xFTl07ICAgICAgICAvLyDmlrDnmoTlr4bnoIFcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRCa1Bhc3NXb3JkW1BBU1NfTEVOXTsgICAgICAgIC8vIOWOn+Wni+WvhueggVxuLy8gfTtcblxuXG4vLyAvLyDph5HluIEs5aWW5Yi4LOWtmOWFpeWtmOWCqOe7k+aehFxuLy8gdHlwZWRlZiBzdHJ1Y3QgXG4vLyB7XG4vLyAgICAgRFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklEOyAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlKjmiLdJRFxuLy8gICAgIExPTkdMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyB9Q01EX0dQX0JhbmtTdG9yYWdlLCBDTURfR1BfQ291cG9uU3RvcmFnZTtcblxuLy8gLy8g6YeR5biBLOWlluWIuCzlj5blh7rlrZjlgqjnu5PmnoRcbi8vIHR5cGVkZWYgc3RydWN0IFxuLy8ge1xuLy8gICAgIERXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJRDsgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55So5oi3SURcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25WYWx1ZTsgICAgICAgICAgICAgICAgIC8vIOaTjeS9nOaVsOmHj1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luUGFzc1dvcmRbUEFTU19MRU5dOyAgICAgICAgLy8g5aSn5Y6F5a+G56CBXG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFua1Bhc3N3b3JkW1BBU1NfTEVOXTsgICAgICAgICAvLyDnlKjmiLflr4bnoIFcbi8vIH1DTURfR1BfQmFua0dldCwgQ01EX0dQX0NvdXBvbkdldDtcblxuXG4vLyAvLyDkv67mlLnlr4bnoIHlupTnrZRcbi8vIHN0cnVjdCBDTURfR1BfQ2hhbmdlUGFzc1dvcmRSZXNcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIDDkuLrmiJDlip8o5L+u5pS5aXNGaXJzdClcbi8vIH07XG5cbi8vIC8vIOmHkeW4gSzlpZbliLgs5a2Y5YKo5bqU562UXG4vLyB0eXBlZGVmIHN0cnVjdCBcbi8vIHtcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvckNvZGU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOmUmeivr+eggSww5Li65oiQ5YqfXG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlZhbHVlOyAgICAgICAgICAgICAgICAgICAgICAvLyDouqvkuIrpkrFcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYW5rVmFsdWU7ICAgICAgICAgICAgICAgICAgICAgIC8vIOS/nemZqeeusemSsVxuLy8gfUNNRF9HUF9CYW5rU3RvcmFnZVJlcywgQ01EX0dQX0JhbmtHZXRSZXMsIENNRF9HUF9Db3Vwb25TdG9yYWdlUmVzLCBDTURfR1BfQ291cG9uR2V0UmVzO1xuXG5wbGF6YV9jbWQuTURNX0dQX05FVyA9IDY7XG5cbnBsYXphX2NtZC5TVUJfR1BfR0VUX05FV1MgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWFrOWRilxucGxhemFfY21kLlNVQl9HUF9GSU5EX0ZSSUVETiA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0dFVF9GUklFTkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iOt+WPluWlveWPi1xucGxhemFfY21kLlNVQl9HUF9BRERfRlJJRU5EID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lop7liqDlpb3lj4tcbnBsYXphX2NtZC5TVUJfR1BfREVMRVRFX0ZSSUVORCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yig6Zmk5aW95Y+LXG5wbGF6YV9jbWQuU1VCX0dQX0ZSSUVORF9FUlJPUiA9IDY7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl57uT5p6cXG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfTU9ORVkgPSA3OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgVxucGxhemFfY21kLlNVQl9HUF9TRU5EX1JFQ09SRCA9IDg7XG5wbGF6YV9jbWQuU1VCX0dQX1NFTkRfUkVTVUxUID0gOTtcblxuLy8gc3RydWN0IENNRF9HUF9HZXROZXdzXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3pOZXdzWzI1Nl07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZF9SZWxhdGl2ZSBcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdVc2VySUQ7XG4vLyAgICAgRFdPUkQgICAgICAgICAgIGR3RnJpZW5kSUQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX0ZyaWVuZEVycm9yXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgc3pEZXNjcmliZVsxMjhdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9EZWxldGVGcmllbmRSZXN1bHRcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICAgICAgZHdEZWxldGVJRDtcbi8vIH07XG5cbi8vIHN0cnVjdCBDTURfR1BfRmluZFVzZXJcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBXT1JEICAgICAgICB3RmFjZUlEO1xuLy8gICAgIGNoYXIgICAgICAgIHN6Tmlja05hbWVbMzJdO1xuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9GcmllbmRMaXN0XG4vLyB7XG4vLyAgICAgaW50ICAgICAgICAgICAgICAgICBuQ291bnQ7ICAgICAgICAgICAgIC8v5Liq5pWwXG4vLyAgICAgQ01EX0dQX0ZpbmRVc2VyICAgICBGdXNlclsxMF07ICAvL+acgOWkmlxuLy8gfTtcblxuLy8gc3RydWN0IENNRF9HUF9TZW5kTW9uZXlcbi8vIHtcbi8vICAgICBEV09SRCAgICAgICBkd1VzZXJJRDtcbi8vICAgICBEV09SRCAgICAgICBkd0ZyaWVuZElEO1xuLy8gICAgIExPTkdMT05HICAgIGxTY29yZTtcbi8vIH07XG5cbi8vIHN0cnVjdCB0YWdUcmFuUmVjb3JkXG4vLyB7XG4vLyAgICAgY2hhciAgICAgICAgICAgICAgICBzelNlbmROYW1lWzMyXTtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6QWNjZXB0TmFtZVszMl07XG4vLyAgICAgTE9OR0xPTkcgICAgICAgICAgICBsVHJhbkdvbGQ7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1RyYW5SZWNvcmRcbi8vIHtcbi8vICAgICBpbnQgICAgICAgICAgICAgICAgIG5Db3VudDtcbi8vICAgICB0YWdUcmFuUmVjb3JkICAgICAgIFJlY29yZFsyMF07XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dQX1NlbmRSZXN1bHRcbi8vIHtcbi8vICAgICBjaGFyICAgICAgICAgICAgICAgIHN6U2VuZE5hbWVbMzJdO1xuLy8gICAgIGNoYXIgICAgICAgICAgICAgICAgc3pBY2NlcHROYW1lWzMyXTtcbi8vICAgICBMT05HTE9ORyAgICAgICAgICAgIGxTY29yZTtcbi8vIH07XG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLyAvL+i2o+ivree7k+aehFxuLy8gc3RydWN0IENNRF9HRl9Vc2VyRnVuXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NoYWlySUQ7ICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOWPt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdNYWluSW5kZXg7ICAgICAgICAgICAgICAgICAgICAgLy/otqPor63mnaHnm65cbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3U3ViSW5kZXg7XG4vLyB9O1xuXG4vLyBzdHJ1Y3QgQ01EX0dGX0xldmVsSW5mb1xuLy8ge1xuLy8gICAgIFdPUkQgICAgd0NoYWlySUQ7XG4vLyAgICAgTE9ORyAgICBsR2FtZUxldmVsO1xuLy8gICAgIExPTkcgICAgQXdhcmRUeXBlO1xuLy8gICAgIExPTkcgICAgQXdhcmRWYWx1ZTtcbi8vICAgICBMT05HICAgIGxFeHBlcmllbmNlO1xuLy8gICAgIExPTkdMT05HICAgIGxMZXZlbFVwVmFsdWU7XG4vLyB9O1xuXG4vLyAvL+ivt+axguS7u+WKoVxuLy8gc3RydWN0IENNRF9HRl9NaXNzaW9uUmVxdWVzdFxuLy8ge1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYk1pc3Npb25UeXBlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyB9O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy/mtojmga/nsbvlnotcbnBsYXphX2NtZC5TTVRfSU5GTyA9IDB4MDAwMTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5L+h5oGv5raI5oGvXG5wbGF6YV9jbWQuU01UX0VKRUNUID0gMHgwMDAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbnBsYXphX2NtZC5TTVRfR0xPQkFMID0gMHgwMDA0OyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhajlsYDmtojmga9cbnBsYXphX2NtZC5TTVRfQ0xPU0VfR0FNRSA9IDB4MTAwMDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5ri45oiPXG5cbm1vZHVsZS5leHBvcnRzID0gcGxhemFfY21kOyIsInZhciB6amhfY21kID0ge307XG5cblxuempoX2NtZC5LSU5EX0lEID0gMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiPIEkgRFxuempoX2NtZC5TRVJWRVJfSUQgPSAzMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnI3liqHlmaggSSBEXG56amhfY21kLkdBTUVfUExBWUVSID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5Lq65pWwXG56amhfY21kLkdBTUVfTkFNRSA9IFwi6K+I6YeR6IqxXCI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+WQjeWtl1xuLy8gempoX2NtZC5HQU1FX0dFTlJFICAgICAgICAgICAgICAgICAgICAgIChHQU1FX0dFTlJFX0dPTER8R0FNRV9HRU5SRV9NQVRDSCkgIC8v5ri45oiP57G75Z6LXG56amhfY21kLk1BWF9DT1VOVCA9IDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aJkeWFi+aVsOebrlxuXG5cbnpqaF9jbWQuU0VSVkVSQUREUkVTUyA9IFwiMTI3LjAuMC4xXCI7XG56amhfY21kLlNFUlZFUl9QT1JUID0gMTY4MDtcblxuLy/nu5PmnZ/ljp/lm6BcbnpqaF9jbWQuR0VSX05PX1BMQVlFUiA9IDB4MTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+ayoeacieeOqeWutlxuempoX2NtZC5HRVJfQ09NUEFSRUNBUkQgPSAweDIwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznu5PmnZ9cbnpqaF9jbWQuR0VSX09QRU5DQVJEID0gMHgzMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5byA54mM57uT5p2fXG5cbi8v5ri45oiP54q25oCBXG56amhfY21kLkdTX1RLX0ZSRUUgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5byA5aeLXG56amhfY21kLkdTX1RLX1BMQVlJTkcgPSAxMDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ov5vooYxcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8v5pyN5Yqh5Zmo5ZG95Luk57uT5p6EXG5cbnpqaF9jbWQuU1VCX1NfR0FNRV9TVEFSVCA9IDEwMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+W8gOWni1xuempoX2NtZC5TVUJfU19BRERfU0NPUkUgPSAxMDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jnu5PmnpxcbnpqaF9jbWQuU1VCX1NfR0lWRV9VUCA9IDEwMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+i3n+azqFxuempoX2NtZC5TVUJfU19DT01QQVJFX0NBUkQgPSAxMDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzot5/ms6hcbnpqaF9jbWQuU1VCX1NfTE9PS19DQVJEID0gMTA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM6Lef5rOoXG56amhfY21kLlNVQl9TX1NFTkRfQ0FSRCA9IDEwMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WPkeeJjOa2iOaBr1xuempoX2NtZC5TVUJfU19HQU1FX0VORCA9IDEwNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adn1xuempoX2NtZC5TVUJfU19QTEFZRVJfRVhJVCA9IDEwNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+W8uumAgFxuempoX2NtZC5TVUJfU19PUEVOX0NBUkQgPSAxMDg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvIDniYzmtojmga9cbnpqaF9jbWQuU1VCX1NfV0FJVF9DT01QQVJFID0gMTA5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v562J5b6F5q+U54mMXG56amhfY21kLlNVQl9TX0xBU1RfQUREID0gMTEwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyAvL+a4uOaIj+eKtuaAgVxuLy8gc3RydWN0IENNRF9TX1N0YXR1c0ZyZWVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WfuuehgOenr+WIhlxuLy8gfTtcblxuLy8gLy/muLjmiI/nirbmgIFcbi8vIHN0cnVjdCBDTURfU19TdGF0dXNQbGF5XG4vLyB7XG4vLyAgICAgLy/liqDms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4Q2VsbFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WNleWFg+S4iumZkFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v54q25oCB5L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyAgICAgYm9vbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYk1pbmdaaHVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgICAgLy/nnIvniYznirbmgIFcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVGFibGVTY29yZVtHQU1FX1BMQVlFUl07ICAgICAgICAgICAvL+S4i+azqOaVsOebrlxuICAgIFxuLy8gICAgIC8v5omR5YWL5L+h5oGvXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JIYW5kQ2FyZERhdGFbTUFYX0NPVU5UXTsgICAgICAgICAgLy/miZHlhYvmlbDmja5cbiAgICBcbi8vICAgICAvL+eKtuaAgeS/oeaBr1xuLy8gICAgIGJvb2wgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbi8vIH07XG5cbi8vIC8v5ri45oiP5byA5aeLXG4vLyBzdHJ1Y3QgQ01EX1NfR2FtZVN0YXJ0XG4vLyB7XG4vLyAgICAgLy/kuIvms6jkv6Hmga9cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsTWF4U2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+acgOWkp+S4i+azqFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDZWxsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y2V5YWD5LiL5rOoXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUaW1lczsgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3lgI3mlbBcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsVXNlck1heFNjb3JlOyAgICAgICAgICAgICAgICAgICAgICAvL+WIhuaVsOS4iumZkFxuICAgIFxuLy8gICAgIC8v55So5oi35L+h5oGvXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0JhbmtlclVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/luoTlrrbnlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeOqeWutlxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07ICAgICAgICAgIC8v5ri45oiP54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+S4i+azqFxuLy8gc3RydWN0IENNRF9TX0FkZFNjb3JlXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0N1cnJlbnRVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3nlKjmiLdcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3QWRkU2NvcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlU3RhdGU7ICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM54q25oCBXG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEFkZFNjb3JlQ291bnQ7ICAgICAgICAgICAgICAgICAgICAgLy/liqDms6jmlbDnm65cbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFRpbWVzOyAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeWAjeaVsFxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblraTms6jkuIDmjrdcbi8vIH07XG5cbi8vIC8v55So5oi35pS+5byDXG4vLyBzdHJ1Y3QgQ01EX1NfR2l2ZVVwXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0dpdmVVcFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAgLy/mlL7lvIPnlKjmiLdcbi8vIH07XG5cbi8vIC8v5q+U54mM5pWw5o2u5YyFXG4vLyBzdHJ1Y3QgQ01EX1NfQ29tcGFyZUNhcmRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjeeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlclsyXTsgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ovpPniYznlKjmiLdcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsQ3VycmVudFR1cm47ICAgICAgICAgICAgICAgICAgICAgICAvL+W9k+WJjei9ruaVsFxuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTG9zdENhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgIC8v6L6T5a6254mM5pWw5o2uXG4vLyB9O1xuXG4vLyAvL+eci+eJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX0xvb2tDYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvb2tDYXJkVXNlcjsgICAgICAgICAgICAgICAgICAgICAgLy/nnIvniYznlKjmiLdcbi8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkNhcmREYXRhW01BWF9DT1VOVF07ICAgICAgICAgICAgICAvL+eUqOaIt+aJkeWFi1xuLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZDsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG4vLyB9O1xuXG4vLyAvL+W8gOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9TX09wZW5DYXJkXG4vLyB7XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1dpbm5lcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnlKjmiLdcbi8vIH07XG5cbi8vIC8v5a2k5rOo5LiA5o63XG4vLyBzdHJ1Y3QgQ01EX1NfTGFzdEFkZFxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGFydExhc3RBZGRVc2VyO1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl07XG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyW0dBTUVfUExBWUVSXTtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q3VycmVudFVzZXI7XG4vLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuO1xuLy8gfTtcblxuXG4vLyAvL+a4uOaIj+e7k+adn1xuLy8gc3RydWN0IENNRF9TX0dhbWVFbmRcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsR2FtZVRheDsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+eojuaUtlxuLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxHYW1lU2NvcmVbR0FNRV9QTEFZRVJdOyAgICAgICAgICAgIC8v5ri45oiP5b6X5YiGXG4vLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JDYXJkRGF0YVtHQU1FX1BMQVlFUl1bTUFYX0NPVU5UXTsgLy/nlKjmiLfmiZHlhYtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdWzRdOyAgICAgICAvL+avlOeJjOeUqOaIt1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdFbmRTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v57uT5p2f54q25oCBXG4vLyB9O1xuXG4vLyAvL+eUqOaIt+mAgOWHulxuLy8gc3RydWN0IENNRF9TX1BsYXllckV4aXRcbi8vIHtcbi8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3UGxheWVySUQ7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mAgOWHuueUqOaIt1xuLy8gfTtcblxuLy8gLy/nrYnlvoXmr5TniYxcbi8vIHN0cnVjdCBDTURfU19XYWl0Q29tcGFyZVxuLy8ge1xuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDb21wYXJlVXNlcjsgICAgICAgICAgICAgICAgICAgICAgIC8v5q+U54mM55So5oi3XG4vLyB9O1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL+WuouaIt+err+WRveS7pOe7k+aehFxuempoX2NtZC5NWV9WSUVXSUQgPSAyOy8vMztcblxuempoX2NtZC5TVUJfQ19BRERfU0NPUkUgPSAxOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfliqDms6hcbnpqaF9jbWQuU1VCX0NfR0lWRV9VUCA9IDI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aUvuW8g+a2iOaBr1xuempoX2NtZC5TVUJfQ19DT01QQVJFX0NBUkQgPSAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYzmtojmga9cbnpqaF9jbWQuU1VCX0NfTE9PS19DQVJEID0gNDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55yL54mM5raI5oGvXG56amhfY21kLlNVQl9DX09QRU5fQ0FSRCA9IDU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+W8gOeJjOa2iOaBr1xuempoX2NtZC5TVUJfQ19XQUlUX0NPTVBBUkUgPSA2OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nrYnlvoXmr5TniYxcbnpqaF9jbWQuU1VCX0NfRklOSVNIX0ZMQVNIID0gNzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a6M5oiQ5Yqo55S7XG56amhfY21kLlNVQl9DX0xBU1RfQUREID0gODsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2k5rOo5LiA5o63XG5cbi8vIC8v55So5oi35Yqg5rOoXG4vLyBzdHJ1Y3QgQ01EX0NfQWRkU2NvcmVcbi8vIHtcbi8vICAgICBMT05HICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsU2NvcmU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WKoOazqOaVsOebrlxuLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdTdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN54q25oCBXG4vLyB9O1xuXG4vLyAvL+avlOeJjOaVsOaNruWMhVxuLy8gc3RydWN0IENNRF9DX0NvbXBhcmVDYXJkXG4vLyB7ICAgXG4vLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0NvbXBhcmVVc2VyOyAgICAgICAgICAgICAgICAgICAgICAgLy/mr5TniYznlKjmiLdcbi8vIH07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vKioqKioqKioqKioqKioqKuWumuaXtuWZqOagh+ivhioqKioqKioqKioqKioqKioqKi0tXG4vL+W8gOWni+WumuaXtuWZqFxuempoX2NtZC5JRElfU1RBUlRfR0FNRSAgIFx0XHRcdD0gMjAwXG4vLyDliqDms6jlrprml7blmahcbnpqaF9jbWQuSURJX1VTRVJfQUREX1NDT1JFXHRcdFx0PSAyMDFcbi8vIOmAieavlOeJjOeUqOaIt+WumuaXtuWZqFxuempoX2NtZC5JRElfVVNFUl9DT01QQVJFX0NBUkRcdFx0PSAyMDJcbi8vIOi/h+a7pOWumuaXtuWZqFxuempoX2NtZC5JRElfRElTQUJMRVx0XHRcdFx0XHQ9IDIwM1xuLy8gKioqKioqKioqKioqKioqKirml7bpl7TmoIfor4YqKioqKioqKioqKioqKioqKi0tXG4vLyDlvIDlp4vlrprml7blmahcbnpqaF9jbWQuVElNRV9TVEFSVF9HQU1FXHRcdFx0XHQ9IDEwXG4vLyDliqDms6jlrprml7blmahcbnpqaF9jbWQuVElNRV9VU0VSX0FERF9TQ09SRVx0XHRcdD0gMTBcbi8vIOavlOeJjOWumuaXtuWZqFxuempoX2NtZC5USU1FX1VTRVJfQ09NUEFSRV9DQVJEXHRcdD0gMTBcblxubW9kdWxlLmV4cG9ydHMgPSB6amhfY21kOyIsInZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgY2FyZFNwcml0ZTogY2MuU3ByaXRlLFxuICAgICAgICBtX2NiQ2FyZERhdGE6IDAsXG4gICAgICAgIGNhcmRBdGxhczogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIG1fdHVyblRpbWU6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9za2V3RGVncmVlID0gMTA7XG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAoY2JDYXJkRGF0YSkge1xuICAgICAgICB0aGlzLm1fY2JDYXJkRGF0YSA9IGNiQ2FyZERhdGE7XG4gICAgfSxcbiAgICBzZXRDYXJkRGF0YTogZnVuY3Rpb24gKGNiQ2FyZERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2FyZEl0ZW1dW3NldENhcmREYXRhXSBjYkNhcmREYXRhID0gXCIgKyBjYkNhcmREYXRhKTtcbiAgICAgICAgdGhpcy5tX2NiQ2FyZERhdGEgPSBjYkNhcmREYXRhO1xuICAgIH0sXG4gICAgZ2V0Q2FyZERhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubV9jYkNhcmREYXRhOyAgXG4gICAgfSxcbiAgICBzaG93Q2FyZEJhY2s6IGZ1bmN0aW9uIChiQW5pbSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDYXJkSXRlbV1bc2hvd0NhcmRCYWNrXVwiKTtcbiAgICAgICAgdGhpcy5jYXJkU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5jYXJkQXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJjYXJkX2JhY2tcIik7XG4gICAgfSxcbiAgICBzaG93Q2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLm1fdHVyblRpbWUgPSAwLjU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0NhcmRJdGVtXVtzaG93Q2FyZF0gY2FyZERhdGEgPSBcIiArIHRoaXMubV9jYkNhcmREYXRhKTtcbiAgICAgICAgdGhpcy5jYXJkU3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5jYXJkQXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJiaWdfY2FyZF9cIiArIEdsb2JhbEZ1bi5QcmVmaXhJbnRlZ2VyKHRoaXMubV9jYkNhcmREYXRhLDIpKTtcbiAgICB9LFxuICAgIHNldFR1cm5DYWxsYmFjazogZnVuY3Rpb24gKGNhbGxCYWNrKSB7XG4gICAgICAgIHRoaXMuX2NhbGxCYWNrID0gY2FsbEJhY2s7XG4gICAgfSxcbiAgICBzZXRUdXJuVGltZTogZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdGhpcy5tX3R1cm5UaW1lID0gdDtcbiAgICB9LFxuICAgIHR1cm5DYXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnNwYXduKGNjLnNjYWxlVG8odGhpcy5tX3R1cm5UaW1lLzIsIDAsIDAuNyksY2Muc2tld1RvKHRoaXMubV90dXJuVGltZS8yLCAwLCAtdGhpcy5fc2tld0RlZ3JlZSkpLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc2hvd0NhcmQoKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgY2Muc3Bhd24oY2Muc2NhbGVUbyh0aGlzLm1fdHVyblRpbWUvMiwgMC43LCAwLjcpLGNjLnNrZXdUbyh0aGlzLm1fdHVyblRpbWUvMiwgMCwgMCkpLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jYWxsQmFjayAmJiB0eXBlb2Yoc2VsZi5fY2FsbEJhY2spID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fY2FsbEJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKSk7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9wcm9kdWN0TmFtZTogY2MuTGFiZWwsXG4gICAgICAgIG1fTGFiZWxfcHJvZHVjdFByaWNlOiBjYy5MYWJlbCxcbiAgICAgICAgbV9MYWJlbF9wYXlQcmljZTogY2MuTGFiZWwsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgaWYodGhpcy5fcGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcHJvZHVjdE5hbWUuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wiZ29vZHNfbmFtZVwiXTtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9wcm9kdWN0UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfcGF5UHJpY2Uuc3RyaW5nID0gdGhpcy5fcGFyYW1zW1wicGF5X2FtdFwiXSArIFwi5YWDXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW2luaXRdIFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5fcGFyYW1zLCBudWxsLCAnICcpKTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY2MuZGlyZWN0b3Iub24oJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uRW5hYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZignb25DaGFuZ2VVc2VyRmFjZScsdGhpcy5vbkNoYW5nZVVzZXJGYWNlLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltDaG9vc2VQYXlUeXBlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gR2xvYmFsVXNlckRhdGEud0ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICAvLyB0aGlzLl9mYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgLy8gdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2hhbmdlVXNlckZhY2VdIGZhY2VJRCA9IFwiKyBKU09OLnN0cmluZ2lmeShwYXJhbXMuZGV0YWlsKSk7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkNoYW5nZVVzZXJGYWNlXCIscGFyYW1zLmRldGFpbCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdmFyIEZhY2VJRCA9IHRoaXMuX2ZhY2VJRDtcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvU2hvcFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbQ2hvb3NlUGF5VHlwZVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV0gQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0Nob29zZVBheVR5cGVWaWV3XVtvbkNsaWNrQ2xvc2VCdXR0b25dIGRlc3Ryb3lcIik7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgQmFzZUZyYW1lID0gcmVxdWlyZShcIkJhc2VGcmFtZVwiKTtcbnJlcXVpcmUoXCJNRDVcIik7XG52YXIgZ2FtZV9jbWQgPSByZXF1aXJlKFwiQ01EX0dhbWVcIik7XG52YXIgcGxhemFfY21kID0gcmVxdWlyZShcIkNNRF9QbGF6YVwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHYW1lU2VydmVySXRlbSA9IHJlcXVpcmUoXCJHYW1lU2VydmVySXRlbVwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2FtZVVzZXJJdGVtID0gcmVxdWlyZShcIkdhbWVVc2VySXRlbVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5fd1RhYmxlQ291bnQgPSAwO1xuXHQgICAgdGhpcy5fd0NoYWlyQ291bnQgPSAwO1xuXHQgICAgdGhpcy5fd1NlcnZlclR5cGUgPSAwO1xuXHQgICAgdGhpcy5fZHdTZXJ2ZXJSdWxlID0gMDtcbiAgICAgICAgdGhpcy5fY2JHYW1lU3RhdHVzIFx0PSAwO1xuICAgICAgICB0aGlzLl9jYkFsbG93TG9va29uID0gMDtcbiAgICAgICAgdGhpcy5fY2JIaWRlVXNlckluZm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdXNlckxpc3QgPSB7fTsgIFxuICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0ID0ge307XG4gICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzID0ge307XG4gICAgICAgIHRoaXMuX3dUYWJsZUlEID0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEU7XG4gICAgICAgIHRoaXMuX3dDaGFpcklEID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgfSxcbiAgICBvbkxvZ29uUm9vbTogZnVuY3Rpb24gKHJvb21JbmZvKSB7XG4gICAgICAgIHRoaXMuX3Jvb21JbmZvID0gcm9vbUluZm87XG4gICAgICAgIGlmICghdGhpcy5fcm9vbUluZm8pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dIOiOt+WPluaIv+mXtOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uTG9nb25Sb29tXSDnmbvlvZXmiL/pl7Q6IFwiICsgR2xvYmFsRnVuLm51bWJlclRvSXAodGhpcy5fcm9vbUluZm8uZHdTZXJ2ZXJBZGRyKSArIFwiIyBcIiArIHRoaXMuX3Jvb21JbmZvLndTZXJ2ZXJQb3J0KTtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChHbG9iYWxGdW4ubnVtYmVyVG9JcCh0aGlzLl9yb29tSW5mby5kd1NlcnZlckFkZHIpLHRoaXMuX3Jvb21JbmZvLndTZXJ2ZXJQb3J0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dW29uQ3JlYXRlU29ja2V0XSBmYWlsXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bb25Mb2dvblJvb21dW29uQ3JlYXRlU29ja2V0XSBzdWNjZXNzXCIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbmRMb2dvblBhY2tldCgpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvblNvY2tldEV2ZW50XSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICBpZiAoIXRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2sgPSB7XG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9MT0dPTl0gOiB0aGlzLk9uU29ja2V0TWFpbkxvZ29uLC8v55m75b2V5raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9VU0VSXSA6IHRoaXMuT25Tb2NrZXRNYWluVXNlciwvL+eUqOaIt+a2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfSU5GT10gOiB0aGlzLk9uU29ja2V0TWFpbkluZm8sLy/phY3nva7mtojmga9cbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuTURNX0dSX1NUQVRVU10gOiB0aGlzLk9uU29ja2V0TWFpblN0YXR1cywvL+eKtuaAgea2iOaBr1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5NRE1fR1JfU1lTVEVNXSA6IHRoaXMuT25Tb2NrZXRNYWluU3lzdGVtLC8v57O757uf5raI5oGvXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLk1ETV9HUl9TRVJWRVJfSU5GT10gOiB0aGlzLk9uU29ja2V0TWFpblNlcnZlckluZm8sLy/miL/pl7Tmtojmga9cbiAgICAgICAgICAgICAgICBbR2xvYmFsRGVmLk1ETV9HRl9HQU1FXSA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7Ly/muLjmiI/mtojmga9cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YjpzdWIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwRGF0YTpwRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtHbG9iYWxEZWYuTURNX0dGX0ZSQU1FXSA6IHRoaXMuT25Tb2NrZXRNYWluR2FtZUZyYW1lLC8v5qGG5p625raI5oGvXG4gICAgICAgICAgICAgICAgW0dsb2JhbERlZi5NRE1fR0ZfUFJFU0VOVF0gOiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrICYmIHRoaXMuX3NvY2tldEV2ZW50Q2FsbGJhY2tbbWFpbl0pIHtcbiAgICAgICAgICAgIHZhciBmdW4gPSB0aGlzLl9zb2NrZXRFdmVudENhbGxiYWNrW21haW5dO1xuICAgICAgICAgICAgZnVuLmNhbGwodGhpcywgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uU29ja2V0RXZlbnRdIG1haW4gPSBcIisgbWFpbiArIFwic3ViID0gXCIgKyBzdWIgKyBcIiBub3QgZmluZFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluTG9nb246IGZ1bmN0aW9uKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXVwiKTtcbiAgICAgICAgaWYgKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX1NVQ0NFU1Mpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Mb2dvbl0gbG9nb24gc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0ID0ge307XG4gICAgICAgICAgICAvLyBjYy5kaXJlY3Rvci5lbWl0KFwiTG9nb25TdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1YiA9PT0gZ2FtZV9jbWQuU1VCX0dSX0xPR09OX0VSUk9SKSB7XG4gICAgICAgICAgICAvL+eZu+W9leWksei0pVxuICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Mb2dvbkVycm9yXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0bEVycm9yQ29kZTtcdFx0XHRcdFx0XHRcdC8v6ZSZ6K+v5Luj56CBXG4gICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6RXJyb3JEZXNjcmliZVsxMjhdO1x0XHRcdFx0Ly/plJnor6/mtojmga9cbiAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICB2YXIgbG9nb25FcnJvciA9IHt9O1xuICAgICAgICAgICAgbG9nb25FcnJvci5sRXJyb3JDb2RlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICAgICAgbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUgPSBwRGF0YS5yZWFkc3RyaW5nKDEyOCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkxvZ29uXSBlcnJvckNvZGUgPSBcIiArIGxvZ29uRXJyb3IubEVycm9yQ29kZSArIFwiIGRlcyA9IFwiICsgbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUpO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksbG9nb25FcnJvci5zekVycm9yRGVzY3JpYmUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJsb2dvbmZyYW1lIGxvZ2luIGVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoc3ViID09PSBnYW1lX2NtZC5TVUJfR1JfTE9HT05fRklOSVNIKXtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkdhbWVTY2VuZVwiKTtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRMb2dvbkZpbmlzaCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Mb2dvbl0gTG9nb24gRmluaXNoXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+eZu+W9leWujOaIkFxuICAgIG9uU29ja2V0TG9nb25GaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtvblNvY2tldExvZ29uRmluaXNoXVwiKTtcbiAgICAgICAgdmFyIG15VXNlckl0ZW0gPSB0aGlzLmdldE1lVXNlckl0ZW0oKTtcbiAgICAgICAgaWYgKCFteVVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW29uU29ja2V0TG9nb25GaW5pc2hdIOiOt+WPluiHquW3seeahOS/oeaBr+Wksei0pVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fd1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FbnRlclRhYmxlXCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kR2FtZU9wdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRW50ZXJSb29tXCIpO1xuICAgICAgICAgICAgdGhpcy5zZW5kU2l0RG93blBhY2tldChHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSwgR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBPblNvY2tldE1haW5Vc2VyOiBmdW5jdGlvbihzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5Vc2VyXVwiKTtcbiAgICAgICAgaWYgKCF0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrID0ge1xuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9DT01FXTogdGhpcy5PblNvY2tldFN1YlVzZXJDb21lLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9TVEFUVVNdOiB0aGlzLk9uU29ja2V0U3ViU3RhdHVzLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9TQ09SRV06IHRoaXMuT25Tb2NrZXRTdWJTY29yZSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfUklHSFRdOiB0aGlzLk9uU29ja2V0U3ViUmlnaHQsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9NRU1CRVJfT1JERVJdOiB0aGlzLk9uU29ja2V0U3ViTWVtYmVyT3JkZXIsXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9TSVRfRkFJTEVEXTogdGhpcy5PblNvY2tldFN1YlNpdEZhaWxlZCxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1VTRVJfQ0hBVF06IHRoaXMuT25Tb2NrZXRTdWJDaGF0LFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9XSVNQRVJdOiB0aGlzLk9uU29ja2V0U3ViV2lzcGVyLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfVVNFUl9JTlZJVEVdOiB0aGlzLk9uU29ja2V0U3ViVXNlckludml0ZSxcbiAgICAgICAgICAgICAgICBbZ2FtZV9jbWQuU1VCX0dSX1FVRVJZX0dPTERdOiB0aGlzLk9uU29ja2V0U3ViUXVlcnlHb2xkLFxuICAgICAgICAgICAgICAgIFtnYW1lX2NtZC5TVUJfR1JfUFJFU0VORF9RVUVSWV06IHRoaXMuT25Tb2NrZXRTdWJQcmVzZW50UXVlcnksXG4gICAgICAgICAgICAgICAgW2dhbWVfY21kLlNVQl9HUl9QUkVTRU5UX0VSUk9SXTogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfUFJFU0VOVF9FUlJPUlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5PblNvY2tldFN1YlVzZXJDb21lKHN1YixwRGF0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc29ja2V0TWFpblVzZXJDYWxsYmFjayAmJiB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrW3N1Yl0pIHtcbiAgICAgICAgICAgIHZhciBmdW4gPSB0aGlzLl9zb2NrZXRNYWluVXNlckNhbGxiYWNrW3N1Yl07XG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpblVzZXJdIHN1YiA9IFwiICsgc3ViICsgXCIgbm90IGZpbmRcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5JbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9TRVJWRVJfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9TRVJWRVJfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfU2VydmVySW5mb1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/miL/pl7TlsZ7mgKdcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0NoYWlyQ291bnQ7XHRcdFx0XHRcdFx0Ly/mpIXlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d0dhbWVHZW5yZTtcdFx0XHRcdFx0XHRcdC8v5ri45oiP57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUNvdW50O1x0XHRcdFx0XHRcdC8v5qGM5a2Q5pWw55uuXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdLaW5kSUQ7XHRcdFx0XHRcdFx0XHQvL+exu+WeiyBJIERcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VmlkZW9BZGRyO1x0XHRcdFx0XHRcdC8v6KeG6aKR5Zyw5Z2AXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiSGlkZVVzZXJJbmZvO1x0XHRcdFx0XHRcdC8v6ZqQ6JeP5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgc2VydmVySW5mbyA9IHt9O1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0NoYWlyQ291bnQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIHNlcnZlckluZm8ud0dhbWVHZW5yZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53VGFibGVDb3VudCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby53S2luZElEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBzZXJ2ZXJJbmZvLmR3VmlkZW9BZGRyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgICAgICAgICAgc2VydmVySW5mby5jYkhpZGVVc2VySW5mbyA9IHBEYXRhLnJlYWRieXRlKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl93Q2hhaXJDb3VudCA9IHNlcnZlckluZm8ud0NoYWlyQ291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fd1RhYmxlQ291bnQgPSBzZXJ2ZXJJbmZvLndUYWJsZUNvdW50O1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiSGlkZVVzZXJJbmZvID0gc2VydmVySW5mby5jYkhpZGVVc2VySW5mbztcbiAgICAgICAgICAgICAgICB0aGlzLl93R2FtZUdlbnJlID0gc2VydmVySW5mby53R2FtZUdlbnJlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dLaW5kSUQgPSBzZXJ2ZXJJbmZvLndLaW5kSUQ7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX0NPTFVNTl9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX0NPTFVNTl9JTkZPXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnYW1lX2NtZC5TVUJfR1JfQ09ORklHX0ZJTklTSDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9DT05GSUdfRklOSVNIXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRNYWluU3RhdHVzOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluU3RhdHVzXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9JTkZPOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dSX1RBQkxFX0lORk9cIik7XG4gICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIHmlbDnu4RcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1RhYmxlSW5mb1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d1RhYmxlQ291bnQ7XHRcdFx0XHRcdFx0Ly/moYzlrZDmlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgdGFnVGFibGVTdGF0dXNcdFx0XHRcdFx0VGFibGVTdGF0dXNbNTEyXTtcdFx0XHRcdFx0Ly/nirbmgIHmlbDnu4RcbiAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDnirbmgIHnu5PmnoRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdUYWJsZVN0YXR1c1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGJQbGF5U3RhdHVzO1x0XHRcdFx0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlRhYmxlTG9jaztcdFx0XHRcdFx0XHRcdC8v6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICAgICAgdmFyIHdUYWJsZUNvdW50ID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgd1RhYmxlQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFibGVTdGF0dXNbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW2luZGV4XS5iUGxheVN0YXR1cyA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhYmxlU3RhdHVzW2luZGV4XS5iVGFibGVMb2NrID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9UQUJMRV9TVEFUVVM6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfVEFCTEVfU1RBVFVTXCIpO1xuICAgICAgICAgICAgICAgIC8v5qGM5a2Q54q25oCB5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9UYWJsZVN0YXR1c1xuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0YlRhYmxlTG9jaztcdFx0XHRcdFx0XHRcdC8v6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGJQbGF5U3RhdHVzO1x0XHRcdFx0XHRcdC8v5ri45oiP54q25oCBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZVN0YXR1cyA9IHt9O1xuICAgICAgICAgICAgICAgIHRhYmxlU3RhdHVzLmJUYWJsZUxvY2sgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRhYmxlU3RhdHVzLmJQbGF5U3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICB0YWJsZVN0YXR1cy53VGFibGVJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZVN0YXR1c1t0YWJsZVN0YXR1cy53VGFibGVJRF0uYlBsYXlTdGF0dXMgPSB0YWJsZVN0YXR1cy5iUGxheVN0YXR1cztcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJsZVN0YXR1c1t0YWJsZVN0YXR1cy53VGFibGVJRF0uYlRhYmxlTG9jayA9IHRhYmxlU3RhdHVzLmJUYWJsZUxvY2s7XG5cbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwidXBEYXRlVGFibGVTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHdUYWJsZUlEOnRhYmxlU3RhdHVzLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/ns7vnu5/mtojmga9cbiAgICBPblNvY2tldE1haW5TeXN0ZW06IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dXCIpO1xuICAgICAgICBzd2l0Y2goc3ViKXtcbiAgICAgICAgICAgIGNhc2UgZ2FtZV9jbWQuU1VCX0dSX01FU1NBR0U6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1JfTUVTU0FHRVwiKTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+aVsOaNruWMhVxuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTWVzc2FnZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VUeXBlO1x0XHRcdFx0XHRcdC8v5raI5oGv57G75Z6LXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdNZXNzYWdlTGVuZ3RoO1x0XHRcdFx0XHRcdC8v5raI5oGv6ZW/5bqmXG4gICAgICAgICAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzekNvbnRlbnRbMTAyNF07XHRcdFx0XHRcdC8v5raI5oGv5YaF5a65XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICAvL+a2iOaBr+WkhOeQhlxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0ge307XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZVR5cGUgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGggPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIG1lc3NhZ2Uuc3pDb250ZW50ID0gcERhdGEucmVhZHN0cmluZyhtZXNzYWdlLndNZXNzYWdlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvL+WFs+mXrei/nuaOpVxuICAgICAgICAgICAgICAgIHZhciBiSW50ZXJtZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBnYW1lX2NtZC5TTVRfSU5URVJNSVRfTElORSkge1xuICAgICAgICAgICAgICAgICAgICBiSW50ZXJtZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtZXNzYWdlLndNZXNzYWdlVHlwZSAmIGdhbWVfY21kLlNNVF9DTE9TRV9ST09NKSB7XG4gICAgICAgICAgICAgICAgICAgIGJJbnRlcm1ldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiSW50ZXJtZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TeXN0ZW1dIFwiICsgbWVzc2FnZS5zekNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+aIv+mXtOa2iOaBr1xuICAgIE9uU29ja2V0TWFpblNlcnZlckluZm86IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldE1haW5TZXJ2ZXJJbmZvXVwiKTtcbiAgICAgICAgc3dpdGNoKHN1Yil7XG4gICAgICAgICAgICBjYXNlIGdhbWVfY21kLlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GTzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUl9PTkxJTkVfQ09VTlRfSU5GT1wiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0TWFpbkdhbWVGcmFtZTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0TWFpbkdhbWVGcmFtZV1cIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX09QVElPTjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9PUFRJT05cIik7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/phY3nva5cbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dGX09wdGlvblxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiR2FtZVN0YXR1cztcdFx0XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRiQWxsb3dMb29rb247XHRcdFx0XHRcdC8v5YWB6K645peB6KeCXG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYkdhbWVTdGF0dXMgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NiQWxsb3dMb29rb24gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1VTRVJfQ0hBVDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9VU0VSX0NIQVRcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdsb2JhbERlZi5TVUJfR0ZfTUVTU0FHRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HRl9NRVNTQUdFXCIpO1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9HUl9NZXNzYWdlXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3TWVzc2FnZVR5cGU7XHRcdFx0XHRcdFx0Ly/mtojmga/nsbvlnotcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0d01lc3NhZ2VMZW5ndGg7XHRcdFx0XHRcdFx0Ly/mtojmga/plb/luqZcbiAgICAgICAgICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6Q29udGVudFsxMDI0XTtcdFx0XHRcdFx0Ly/mtojmga/lhoXlrrlcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIC8v5raI5oGv5aSE55CGXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB7fTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLndNZXNzYWdlVHlwZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS53TWVzc2FnZUxlbmd0aCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS5zekNvbnRlbnQgPSBwRGF0YS5yZWFkc3RyaW5nKG1lc3NhZ2Uud01lc3NhZ2VMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9DTE9TRV9HQU1FKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25DbG9zZVNvY2tldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS53TWVzc2FnZVR5cGUgJiBHbG9iYWxEZWYuU01UX0VKRUNUKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRNYWluR2FtZUZyYW1lXSBtZXNzYWdlID0gXCIgKyBtZXNzYWdlLnN6Q29udGVudCArIFwiIHR5cGUgPSBcIiArIG1lc3NhZ2Uud01lc3NhZ2VUeXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2Uud01lc3NhZ2VUeXBlICYgR2xvYmFsRGVmLlNNVF9HTE9CQUwpe1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuU1VCX0dGX1NDRU5FOlxuICAgICAgICAgICAgICAgIC8v5ri45oiP5Zy65pmvXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR0ZfU0NFTkVcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRHYW1lU2NlbmVcIix7XG4gICAgICAgICAgICAgICAgICAgIGNiR2FtZVN0YXR1czp0aGlzLl9jYkdhbWVTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIHBEYXRhOnBEYXRhLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+eUqOaIt+i/m+WFpVxuICAgIE9uU29ja2V0U3ViVXNlckNvbWU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJDb21lXSBwRGF0YSBsZW4gPSBcIiArIHBEYXRhLmdldERhdGFTaXplKCkpO1xuICAgICAgICB2YXIgdXNlckl0ZW0gPSBuZXcgR2FtZVVzZXJJdGVtKCk7XG4gICAgICAgIHVzZXJJdGVtLmluaXREYXRhQnlVc2VySW5mb0hlYWQocERhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViVXNlckNvbWVdIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlckl0ZW0sIG51bGwsICcgJykpO1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXTtcbiAgICAgICAgLy8gaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJMaXN0W3VzZXJJdGVtLmR3VXNlcklEXSA9IHVzZXJJdGVtO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8v6K6w5b2V6Ieq5bex55qE5qGM5Y+3XG4gICAgICAgIGlmICh1c2VySXRlbS5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQpIHtcbiAgICAgICAgICAgIHRoaXMuX3dUYWJsZUlEID0gdXNlckl0ZW0ud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJJdGVtLndDaGFpcklEO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VySXRlbS53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgJiYgdXNlckl0ZW0ud0NoYWlySUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRlVGFibGVVc2VyKHVzZXJJdGVtLndUYWJsZUlELHVzZXJJdGVtLndDaGFpcklELHVzZXJJdGVtKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlckVudGVyXCIse1xuICAgICAgICAgICAgICAgIHdUYWJsZUlEOnVzZXJJdGVtLndUYWJsZUlELFxuICAgICAgICAgICAgICAgIHdDaGFpcklEOnVzZXJJdGVtLndDaGFpcklELFxuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXJJdGVtLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCl7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0TG9nb25GaW5pc2goKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJTdGF0dXM6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c11cIik7XG4gICAgICAgIC8v55So5oi354q25oCBXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfVXNlclN0YXR1c1xuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3VGFibGVJRDtcdFx0XHRcdFx0XHRcdC8v5qGM5a2Q5L2N572uXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+aVsOaNruW6kyBJRFxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0Y2JVc2VyU3RhdHVzO1x0XHRcdFx0XHRcdC8v55So5oi354q25oCBXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q2hhaXJJRDtcdFx0XHRcdFx0XHRcdC8v5qSF5a2Q5L2N572uXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB1c2VyU3RhdHVzID0ge307XG4gICAgICAgIHVzZXJTdGF0dXMud1RhYmxlSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB1c2VyU3RhdHVzLmR3VXNlcklEID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdXNlclN0YXR1cy53Q2hhaXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10gbmV3U3RhdHVzID0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VyU3RhdHVzLCBudWxsLCAnICcpKTtcbiAgICAgICAgdmFyIHVzZXJJdGVtID0gdGhpcy5zZWFyY2hVc2VyQnlVc2VySUQodXNlclN0YXR1cy5kd1VzZXJJRCk7XG4gICAgICAgIHZhciBteVVzZXJJdGVtID0gdGhpcy5nZXRNZVVzZXJJdGVtKCk7XG4gICAgICAgIGlmICghbXlVc2VySXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g5pyq5om+5Yiw6Ieq5bexXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8v5om+5LiN5Yiw55So5oi3XG4gICAgICAgIGlmICghdXNlckl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTdGF0dXNdIOaJvuS4jeWIsOeUqOaIt1wiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvL+iusOW9leaXp+eKtuaAgVxuICAgICAgICB2YXIgb2xkU3RhdHVzID0ge307XG4gICAgICAgIG9sZFN0YXR1cy53VGFibGVJRCA9IHVzZXJJdGVtLndUYWJsZUlEO1xuICAgICAgICBvbGRTdGF0dXMud0NoYWlySUQgPSB1c2VySXRlbS53Q2hhaXJJRDtcbiAgICAgICAgb2xkU3RhdHVzLmNiVXNlclN0YXR1cyA9IHVzZXJJdGVtLmNiVXNlclN0YXR1cztcblxuICAgICAgICAvL+abtOaWsOS/oeaBr1xuICAgICAgICB1c2VySXRlbS5jYlVzZXJTdGF0dXMgPSB1c2VyU3RhdHVzLmNiVXNlclN0YXR1cztcbiAgICAgICAgdXNlckl0ZW0ud1RhYmxlSUQgPSB1c2VyU3RhdHVzLndUYWJsZUlEO1xuICAgICAgICB1c2VySXRlbS53Q2hhaXJJRCA9IHVzZXJTdGF0dXMud0NoYWlySUQ7XG5cbiAgICAgICAgLy/muIXpmaTml6fmoYzlrZDmpIXlrZDorrDlvZVcbiAgICAgICAgaWYob2xkU3RhdHVzLndUYWJsZUlEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgLy/mlrDml6fmoYzlrZDkuI3lkIwg5paw5pen5qSF5a2Q5LiN5ZCMXG4gICAgICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEICE9PSB1c2VyU3RhdHVzLndUYWJsZUlEIHx8IG9sZFN0YXR1cy53Q2hhaXJJRCAhPT0gdXNlclN0YXR1cy53Q2hhaXJJRCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25VcERhdGVUYWJsZVVzZXIob2xkU3RhdHVzLndUYWJsZUlELCBvbGRTdGF0dXMud0NoYWlySUQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/mlrDmoYzlrZDorrDlvZVcbiAgICAgICAgaWYgKHVzZXJTdGF0dXMud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICB0aGlzLm9uVXBEYXRlVGFibGVVc2VyKHVzZXJTdGF0dXMud1RhYmxlSUQsIHVzZXJTdGF0dXMud0NoYWlySUQsIHVzZXJJdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v6Ieq5bex54q25oCBXG4gICAgICAgIGlmIChteVVzZXJJdGVtLmR3VXNlcklEID09PSB1c2VyU3RhdHVzLmR3VXNlcklEKSB7XG4gICAgICAgICAgICB0aGlzLl93VGFibGVJRCA9IHVzZXJTdGF0dXMud1RhYmxlSUQ7XG4gICAgICAgICAgICB0aGlzLl93Q2hhaXJJRCA9IHVzZXJTdGF0dXMud0NoYWlySUQ7XG5cbiAgICAgICAgICAgIC8v56a75byAXG4gICAgICAgICAgICBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19OVUxMKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex56a75byAXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV4aXRSb29tXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/otbfnq4tcbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXJTdGF0dXMuY2JVc2VyU3RhdHVzID09PSBHbG9iYWxEZWYuVVNfRlJFRSAmJiBvbGRTdGF0dXMuY2JVc2VyU3RhdHVzID4gR2xvYmFsRGVmLlVTX0ZSRUUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU3RhdHVzXSDoh6rlt7Hotbfnq4tcIik7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXhpdFRhYmxlXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMub25SZXNldEdhbWVFbmdpbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Z2Q5LiLXG4gICAgICAgICAgICBlbHNlIGlmICh1c2VyU3RhdHVzLmNiVXNlclN0YXR1cyA+IEdsb2JhbERlZi5VU19GUkVFICYmIG9sZFN0YXR1cy5jYlVzZXJTdGF0dXMgPCBHbG9iYWxEZWYuVVNfU0lUKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex5Z2Q5LiLXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkVudGVyVGFibGVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kR2FtZU9wdGlvbigpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/mjaLkvY1cbiAgICAgICAgICAgIGVsc2UgaWYgKHVzZXJTdGF0dXMud1RhYmxlSUQgIT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g5o2i5L2NXCIpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkVudGVyVGFibGVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kR2FtZU9wdGlvbigpO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclN0YXR1c1wiLHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckl0ZW06dXNlckl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXR1czp1c2VyU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTdGF0dXM6b2xkU3RhdHVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlN0YXR1c10g6Ieq5bex5paw54q25oCBIFwiICsgSlNPTi5zdHJpbmdpZnkodXNlclN0YXR1cywgbnVsbCwgJyAnKSk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uRXZlbnRVc2VyU3RhdHVzXCIse1xuICAgICAgICAgICAgICAgICAgICB1c2VySXRlbTp1c2VySXRlbSxcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhdHVzOnVzZXJTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFN0YXR1czpvbGRTdGF0dXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/ku5bkurrnirbmgIFcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL+abtOaWsOeUqOaIt1xuICAgICAgICAgICAgaWYgKG9sZFN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUgfHwgdXNlclN0YXR1cy53VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25FdmVudFVzZXJTdGF0dXNcIix7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0dXM6dXNlclN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU3RhdHVzOm9sZFN0YXR1cyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Yig6Zmk55So5oi3XG4gICAgICAgICAgICBpZiAodXNlclN0YXR1cy5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19OVUxMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlbW92ZVVzZXIodXNlclN0YXR1cy5kd1VzZXJJRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU2NvcmU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlNjb3JlXVwiKTtcbiAgICAgICAgLy/nlKjmiLfliIbmlbBcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Vc2VyU2NvcmVcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0bExvdmVsaW5lc3M7XHRcdFx0XHRcdFx0Ly/nlKjmiLfprYXliptcbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5raI6LS56YeR6LGGXG4gICAgICAgIC8vICAgICAvL0xPTkdcdFx0XHRcdFx0XHRcdGxHYW1lR29sZDtcdFx0XHRcdFx0XHRcdC8v5ri45oiP6YeR6LGGXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdVc2VySUQ7XHRcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIHRhZ1VzZXJTY29yZVx0XHRcdFx0XHRVc2VyU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+enr+WIhuS/oeaBr1xuICAgICAgICAgICAgICAgIC8vIHN0cnVjdCB0YWdVc2VyU2NvcmVcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsU2NvcmU7XHRcdFx0XHRcdFx0XHRcdC8v55So5oi35YiG5pWwXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5a2Y5YKo6YeR5biBXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFdpbkNvdW50O1x0XHRcdFx0XHRcdFx0Ly/og5zliKnnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsTG9zdENvdW50O1x0XHRcdFx0XHRcdFx0Ly/lpLHotKXnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRHJhd0NvdW50O1x0XHRcdFx0XHRcdFx0Ly/lkozlsYDnm5jmlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRmxlZUNvdW50O1x0XHRcdFx0XHRcdFx0Ly/mlq3nur/mlbDnm65cbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRXhwZXJpZW5jZTtcdFx0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAgICAgICAgIC8vIH07XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB1c2VyU2NvcmUgPSB7fTtcbiAgICAgICAgdXNlclNjb3JlLmxMb3ZlbGluZXNzID0gcERhdGEucmVhZGludCgpOyAvL+eUqOaIt+mtheWKm1xuICAgICAgICB1c2VyU2NvcmUuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgLy/nlKjmiLdJRFxuICAgICAgICAvL+eUqOaIt+enr+WIhlxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlID0ge307XG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubFNjb3JlID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WIhuaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxHYW1lR29sZCA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sSW5zdXJlU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo6YeR5biBXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubFdpbkNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/og5zliKnnm5jmlbBcbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sTG9zdENvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0peebmOaVsFxuICAgICAgICB1c2VyU2NvcmUuVXNlclNjb3JlLmxEcmF3Q291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZKM5bGA55uY5pWwXG4gICAgICAgIHVzZXJTY29yZS5Vc2VyU2NvcmUubEZsZWVDb3VudCA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/mlbDnm65cbiAgICAgICAgdXNlclNjb3JlLlVzZXJTY29yZS5sRXhwZXJpZW5jZSA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuXG4gICAgICAgIC8v6Ieq5bex5L+h5oGvXG4gICAgICAgIHZhciBteVVzZXJJdGVtID0gdGhpcy5nZXRNZVVzZXJJdGVtKCk7XG4gICAgICAgIHZhciB1c2VySXRlbSA9IHRoaXMuc2VhcmNoVXNlckJ5VXNlcklEKHVzZXJTY29yZS5kd1VzZXJJRCk7XG4gICAgICAgIC8vIGlmICh1c2VyU2NvcmUuZHdVc2VySUQgPT0gbXlVc2VySXRlbS5kd1VzZXJJRCkge1xuICAgICAgICBpZiAoIXVzZXJJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViU2NvcmVdIOabtOaWsCBcIiArIEpTT04uc3RyaW5naWZ5KHVzZXJTY29yZSwgbnVsbCwgJyAnKSk7XG4gICAgICAgICAgICB1c2VySXRlbS5sU2NvcmUgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxTY29yZTtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxHYW1lR29sZCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEdhbWVHb2xkO1xuICAgICAgICAgICAgdXNlckl0ZW0ubFdpbkNvdW50ID0gdXNlclNjb3JlLlVzZXJTY29yZS5sV2luQ291bnQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sTG9zdENvdW50ID0gdXNlclNjb3JlLlVzZXJTY29yZS5sTG9zdENvdW50O1xuICAgICAgICAgICAgdXNlckl0ZW0ubERyYXdDb3VudCA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubERyYXdDb3VudDtcbiAgICAgICAgICAgIHVzZXJJdGVtLmxGbGVlQ291bnQgPSB1c2VyU2NvcmUuVXNlclNjb3JlLmxGbGVlQ291bnQ7XG4gICAgICAgICAgICB1c2VySXRlbS5sRXhwZXJpZW5jZSA9IHVzZXJTY29yZS5Vc2VyU2NvcmUubEV4cGVyaWVuY2U7XG4gICAgICAgICAgICB1c2VySXRlbS5sTG92ZWxpbmVzcyA9IHVzZXJTY29yZS5sTG92ZWxpbmVzcztcbiAgICAgICAgfVxuICAgICAgICAvL+mAmuefpeabtOaWsOeVjOmdolxuICAgICAgICBpZih0aGlzLl93VGFibGVJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJvbkV2ZW50VXNlclNjb3JlXCIse1xuICAgICAgICAgICAgICAgIHVzZXJJdGVtOnVzZXJJdGVtLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIE9uU29ja2V0U3ViUmlnaHQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlJpZ2h0XVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViTWVtYmVyT3JkZXI6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1Yk1lbWJlck9yZGVyXVwiKTtcbiAgICB9LFxuICAgIE9uU29ja2V0U3ViU2l0RmFpbGVkOiBmdW5jdGlvbiAoc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTaXRGYWlsZWRdXCIpO1xuICAgICAgICAvL+WdkOS4i+Wksei0pVxuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dSX1NpdEZhaWxlZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pGYWlsZWREZXNjcmliZVsyNTZdO1x0XHRcdFx0Ly/plJnor6/mj4/ov7BcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHN6RmFpbGVkRGVzY3JpYmUgPSBwRGF0YS5yZWFkc3RyaW5nKDI1Nik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bT25Tb2NrZXRTdWJTaXRGYWlsZWRdIFwiICsgc3pGYWlsZWREZXNjcmliZSk7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YkNoYXQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YkNoYXRdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJXaXNwZXI6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1Yldpc3Blcl1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlVzZXJJbnZpdGU6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlVzZXJJbnZpdGVdXCIpO1xuICAgIH0sXG4gICAgT25Tb2NrZXRTdWJRdWVyeUdvbGQ6IGZ1bmN0aW9uIChzdWIscERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZUZyYW1lXVtPblNvY2tldFN1YlF1ZXJ5R29sZF1cIik7XG4gICAgfSxcbiAgICBPblNvY2tldFN1YlByZXNlbnRRdWVyeTogZnVuY3Rpb24gKHN1YixwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lRnJhbWVdW09uU29ja2V0U3ViUHJlc2VudFF1ZXJ5XVwiKTtcbiAgICB9LFxuICAgIHNlbmRMb2dvblBhY2tldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bc2VuZExvZ29uUGFja2V0XVwiKTtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX0xPR09OLGdhbWVfY21kLlNVQl9HUl9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHdvcmQoR2xvYmFsVXNlckRhdGEud0VuY3J5cHRJRCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNod29yZChHbG9iYWxVc2VyRGF0YS53Q29kZUNoZWNrSUQpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEKTtcblxuICAgICAgICB2YXIgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpe1xuICAgICAgICAgICAgZHdNb2JpbGVTeXNUeXBlID0gMjtcbiAgICAgICAgfVxuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKGR3TW9iaWxlU3lzVHlwZSk7XG5cbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcoR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCwzMyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVGcmFtZV1bc2VuZExvZ29uUGFja2V0XSBwYXNzd29yZCA9IFwiICsgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgICAgIC8vIC8v5omL5py655m76ZmGXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1JfTG9nb25CeVVzZXJJRE1vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIEyXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdXZWlYaW5DaGVja0lEO1x0XHRcdFx0XHQvL+W+ruS/oemqjOivgeeggVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVTeXNUeXBlO1x0XHRcdFx0XHQvL+aJi+acuuaTjeS9nOezu+e7n+exu+Weiygx6Iu55p6c57O757ufIDLlronljZPns7vnu58pXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBWZXJzaW9uO1x0XHRcdFx0XHQvL+a4uOaIj0FQUOeJiOacrOWPtyjkuI7nmbvpmYblpKfljoXnm7jlkIwpXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0c3pQYXNzV29yZFtQQVNTX0xFTl07XHRcdFx0XHQvL+eZu+W9leWvhueggVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdHN6TW9iaWxlTWFjaGluZVtDT01QVVRFUl9JRF9MRU5dO1x0Ly/mnLrlmajluo/liJflj7dcbiAgICAgICAgLy8gfTtcbiAgICB9LFxuICAgIC8v5Z2Q5LiL6K+35rGCXG4gICAgc2VuZFNpdERvd25QYWNrZXQ6IGZ1bmN0aW9uICh3VGFibGVJRCwgd0NoYWlySUQsIHN6UGFzc1dvcmQpIHtcbiAgICAgICAgLy/or7fmsYLlnZDkuItcbiAgICAgICAgLy8gc3RydWN0IENNRF9HUl9Vc2VyU2l0UmVxXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdGNiUGFzc0xlbjtcdFx0XHRcdFx0XHRcdC8v5a+G56CB6ZW/5bqmXG4gICAgICAgIC8vICAgICAvL0RXT1JEXHRcdFx0XHRcdFx0XHRkd0Fuc3dlcklEO1x0XHRcdFx0XHRcdFx0Ly/lm57nrZQgSSBELy/lhbzlrrnnp6/liIbmuLjmiI/lhaXluqfpl67pophcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDkvY3nva5cbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRzelRhYmxlUGFzc1tQQVNTX0xFTl07XHRcdFx0XHQvL+ahjOWtkOWvhueggVxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgc2l0RGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgc2l0RGF0YS5zZXRjbWRpbmZvKGdhbWVfY21kLk1ETV9HUl9VU0VSLGdhbWVfY21kLlNVQl9HUl9VU0VSX1NJVF9SRVEpO1xuICAgICAgICB2YXIgY2JQYXNzTGVuID0gMDtcbiAgICAgICAgaWYgKHN6UGFzc1dvcmQpIHtcbiAgICAgICAgICAgIGNiUGFzc0xlbiA9IHN6UGFzc1dvcmQubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgc2l0RGF0YS5wdXNoYnl0ZShjYlBhc3NMZW4pO1xuICAgICAgICBzaXREYXRhLnB1c2h3b3JkKHdDaGFpcklEKTtcbiAgICAgICAgc2l0RGF0YS5wdXNod29yZCh3VGFibGVJRCk7XG4gICAgICAgIHNpdERhdGEucHVzaHN0cmluZyhzelBhc3NXb3JkLEdsb2JhbERlZi5QQVNTX0xFTik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic2l6ZTEgPSBcIiArIHNpdERhdGEuZ2V0RGF0YVNpemUoKSk7XG4gICAgICAgIHZhciBzZW5kU2l6ZSA9IHNpdERhdGEuZ2V0RGF0YVNpemUoKSAtIEdsb2JhbERlZi5QQVNTX0xFTiArIGNiUGFzc0xlbjtcbiAgICAgICAgY29uc29sZS5sb2coXCJzaXplMiA9IFwiICsgc2VuZFNpemUpO1xuICAgICAgICBzaXREYXRhLnNldERhdGFTaXplKHNlbmRTaXplKTtcblxuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoc2l0RGF0YSk7XG4gICAgfSxcbiAgICAvL+ermei1t+adpVxuICAgIHNlbmRTdGFuZHVwUGFja2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX1VTRVIsIGdhbWVfY21kLlNVQl9HUl9VU0VSX1NUQU5EVVBfUkVRKTtcblxuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGRhdGEpO1xuICAgIH0sXG4gICAgc2VuZExlZnRHYW1lUGFja2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhLnNldGNtZGluZm8oZ2FtZV9jbWQuTURNX0dSX1VTRVIsIGdhbWVfY21kLlNVQl9HUl9VU0VSX0xFRlRfR0FNRV9SRVEpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICAvL+WPkemAgeWHhuWkh1xuICAgIHNlbmRVc2VyUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhHbG9iYWxEZWYuTURNX0dGX0ZSQU1FLCBHbG9iYWxEZWYuU1VCX0dGX1VTRVJfUkVBRFkpO1xuXG4gICAgICAgIHRoaXMuc2VuZFNvY2tldERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICAvL+WPkemAgea4uOaIj+S/oeaBr1xuICAgIHNlbmRHYW1lT3B0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8v54mI5pys5L+h5oGvXG4gICAgICAgIC8vIHN0cnVjdCBDTURfR0ZfSW5mb1xuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGJBbGxvd0xvb2tvbjtcdFx0XHRcdFx0Ly/ml4Hop4LmoIflv5dcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGRhdGEuc2V0Y21kaW5mbyhHbG9iYWxEZWYuTURNX0dGX0ZSQU1FLCBHbG9iYWxEZWYuU1VCX0dGX0lORk8pO1xuICAgICAgICBkYXRhLnB1c2hieXRlKDApO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGRhdGEpO1xuICAgIH0sXG4gICAgb25VcERhdGVUYWJsZVVzZXI6IGZ1bmN0aW9uICh0YWJsZWlkLGNoYWlyaWQsdXNlcml0ZW0pIHtcbiAgICAgICAgdmFyIGlkID0gdGFibGVpZDtcbiAgICAgICAgdmFyIGlkZXggPSBjaGFpcmlkO1xuICAgICAgICBpZiAoIXRoaXMuX3RhYmxlVXNlckxpc3RbaWRdKSB7XG4gICAgICAgICAgICB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyaXRlbSkge1xuICAgICAgICAgICAgdGhpcy5fdGFibGVVc2VyTGlzdFtpZF1baWRleF0gPSB1c2VyaXRlbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RhYmxlVXNlckxpc3RbaWRdW2lkZXhdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+iOt+WPluahjOWtkOeUqOaIt1xuICAgIGdldFRhYmxlVXNlckl0ZW06IGZ1bmN0aW9uICh0YWJsZWlkLGNoYWlyaWQpIHtcbiAgICAgICAgdmFyIGlkID0gdGFibGVpZDtcbiAgICAgICAgdmFyIGlkZXggPSBjaGFpcmlkO1xuICAgICAgICBpZiAodGhpcy5fdGFibGVVc2VyTGlzdFtpZF0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJsZVVzZXJMaXN0W2lkXVtpZGV4XTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0VGFibGVJbmZvOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmxlU3RhdHVzW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2hhaXJDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd0NoYWlyQ291bnQ7ICBcbiAgICB9LFxuICAgIGdldFRhYmxlQ291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dUYWJsZUNvdW50OyAgXG4gICAgfSxcbiAgICAvL+iOt+WPluahjOWtkElEXG4gICAgZ2V0VGFibGVJRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd1RhYmxlSUQ7XG4gICAgfSxcbiAgICAvL+iOt+WPluakheWtkElEXG4gICAgZ2V0Q2hhaXJJRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd0NoYWlySUQ7ICBcbiAgICB9LFxuICAgIC8v6I635Y+W5ri45oiP54q25oCBXG4gICAgZ2V0R2FtZVN0YXR1czogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2JHYW1lU3RhdHVzOyAgXG4gICAgfSxcbiAgICAvL+iuvue9rua4uOaIj+eKtuaAgVxuICAgIHNldEdhbWVTdGF0dXM6IGZ1bmN0aW9uIChjYkdhbWVTdGF0dXMpIHtcbiAgICAgICAgdGhpcy5fY2JHYW1lU3RhdHVzID0gY2JHYW1lU3RhdHVzO1xuICAgIH0sXG4gICAgLy/ojrflj5boh6rlt7HmuLjmiI/kv6Hmga9cbiAgICBnZXRNZVVzZXJJdGVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTGlzdFtHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRF07XG4gICAgfSxcbiAgICBzZWFyY2hVc2VyQnlVc2VySUQ6IGZ1bmN0aW9uIChkd1VzZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxpc3RbZHdVc2VySURdO1xuICAgIH0sXG4gICAgb25SZW1vdmVVc2VyOiBmdW5jdGlvbiAoZHdVc2VySUQpIHtcbiAgICAgICAgdGhpcy5fdXNlckxpc3RbZHdVc2VySURdID0gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgb25SZXNldEdhbWVFbmdpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2FtZUxvZ2ljID0ge307XG4vL+Wuj+WumuS5iVxuR2FtZUxvZ2ljLk1BWF9DT1VOVCA9IDM7XHRcdFx0XHRcdFx0XHRcdFx0Ly/mnIDlpKfmlbDnm65cbkdhbWVMb2dpYy5EUkFXID0gMjtcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgIC8v5ZKM5bGA57G75Z6LXG5cbi8v5pWw5YC85o6p56CBXG5HYW1lTG9naWMuTE9HSUNfTUFTS19DT0xPUiA9IDB4RjA7XHRcdFx0XHRcdFx0XHQvL+iKseiJsuaOqeeggVxuR2FtZUxvZ2ljLkxPR0lDX01BU0tfVkFMVUUgPSAweDBGO1x0XHRcdFx0XHRcdFx0Ly/mlbDlgLzmjqnnoIFcblxuLy/miZHlhYvnsbvlnotcbkdhbWVMb2dpYy5DVF9TSU5HTEUgPSAxO1x0XHRcdFx0XHRcdFx0XHRcdC8v5Y2V54mM57G75Z6LXG5HYW1lTG9naWMuQ1RfRE9VQkxFID0gMjtcdFx0XHRcdFx0XHRcdFx0ICAgIC8v5a+55a2Q57G75Z6LXG5HYW1lTG9naWMuQ1RfU0hVTl9aSSA9IDM7XHRcdFx0XHRcdFx0XHRcdFx0Ly/pobrlrZDnsbvlnotcbkdhbWVMb2dpYy5DVF9KSU5fSFVBID0gNDtcdFx0XHRcdFx0XHRcdFx0XHQvL+mHkeiKseexu+Wei1xuR2FtZUxvZ2ljLkNUX1NIVU5fSklOID0gNTtcdFx0XHRcdFx0XHRcdFx0XHQvL+mhuumHkeexu+Wei1xuR2FtZUxvZ2ljLkNUX0JBT19aSSA9IDY7XHRcdFx0XHRcdFx0XHRcdFx0Ly/osbnlrZDnsbvlnotcbkdhbWVMb2dpYy5DVF9TUEVDSUFMID0gNztcdFx0XHRcdFx0XHRcdFx0XHQvL+eJueauiuexu+Wei1xuXG4vL+iOt+WPluaVsOWAvFxuR2FtZUxvZ2ljLmdldENhcmRWYWx1ZSA9IGZ1bmN0aW9uIChjYkNhcmREYXRhKSB7XG4gICAgcmV0dXJuIChjYkNhcmREYXRhICYgR2FtZUxvZ2ljLkxPR0lDX01BU0tfVkFMVUUpO1xufTtcbi8v6I635Y+W6Iqx6ImyXG5HYW1lTG9naWMuZ2V0Q2FyZENvbG9yID0gZnVuY3Rpb24gKGNiQ2FyZERhdGEpIHtcbiAgICByZXR1cm4gKGNiQ2FyZERhdGEgJiBHYW1lTG9naWMuTE9HSUNfTUFTS19DT0xPUik7XG59O1xuLy/pgLvovpHmlbDlgLxcbkdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZSA9IGZ1bmN0aW9uIChjYkNhcmREYXRhKSB7XG4gICAgdmFyIGNiQ2FyZFZhbHVlID0gR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShjYkNhcmREYXRhKTtcblxuICAgIGlmIChjYkNhcmRWYWx1ZSA9PSAxKSB7XG4gICAgICAgIGNiQ2FyZFZhbHVlID0gY2JDYXJkVmFsdWUgKyAxMztcbiAgICB9XG4gICAgcmV0dXJuIGNiQ2FyZFZhbHVlO1xufTtcbkdhbWVMb2dpYy5zb3J0Q2FyZCA9IGZ1bmN0aW9uIChjYXJkRGF0YSkge1xuICAgIHZhciBjYXJkRGF0YVRtcCA9IFtdO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBjYXJkRGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY2FyZERhdGFUbXBbaW5kZXhdID0gY2FyZERhdGFbaW5kZXhdO1xuICAgIH1cbiAgICAvL+WFiOaOkuminOiJslxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZERhdGFUbXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXJkRGF0YVRtcC5sZW5ndGggLSBpOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChjYXJkRGF0YVRtcFtqXSA8IGNhcmREYXRhVG1wW2ogKyAxXSkge1xuICAgICAgICAgICAgICAgIFtjYXJkRGF0YVRtcFtqXSwgY2FyZERhdGFUbXBbaiArIDFdXSA9IFtjYXJkRGF0YVRtcFtqICsgMV0sIGNhcmREYXRhVG1wW2pdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICB9XG4gICAgLy/lho3mjpLlpKflsI9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhVG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2FyZERhdGFUbXAubGVuZ3RoIC0gaTsgaisrKSB7XG4gICAgICAgICAgICBpZiAoR2FtZUxvZ2ljLmdldENhcmRMb2dpY1ZhbHVlKGNhcmREYXRhVG1wW2pdKSA8IEdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZShjYXJkRGF0YVRtcFtqICsgMV0pICkge1xuICAgICAgICAgICAgICAgIFtjYXJkRGF0YVRtcFtqXSwgY2FyZERhdGFUbXBbaiArIDFdXSA9IFtjYXJkRGF0YVRtcFtqICsgMV0sIGNhcmREYXRhVG1wW2pdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FyZERhdGFUbXA7XG59O1xuLy/ojrflvpfniYzlnotcbkdhbWVMb2dpYy5nZXRDYXJkVHlwZSA9IGZ1bmN0aW9uIChjYXJkKSB7XG4gICAgaWYgKGNhcmQubGVuZ3RoICE9PSBHYW1lTG9naWMuTUFYX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGNhcmREYXRhID0gR2FtZUxvZ2ljLnNvcnRDYXJkKGNhcmQpO1xuICAgIHZhciBjYlNhbWVDb2xvciA9IHRydWU7XG4gICAgdmFyIGJMaW5lQ2FyZCA9IHRydWU7XG4gICAgdmFyIGNiRmlyc3RDb2xvciA9IEdhbWVMb2dpYy5nZXRDYXJkQ29sb3IoY2FyZERhdGFbMF0pO1xuICAgIHZhciBjYkZpcnN0VmFsdWUgPSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbMF0pO1xuXG4gICAgLy/niYzlnovliIbmnpBcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgY2FyZERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmIChjYkZpcnN0Q29sb3IgIT09IEdhbWVMb2dpYy5nZXRDYXJkQ29sb3IoY2FyZERhdGFbaW5kZXhdKSkge1xuICAgICAgICAgICAgY2JTYW1lQ29sb3IgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2JGaXJzdFZhbHVlICE9PSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbaW5kZXhdK2luZGV4KSkge1xuICAgICAgICAgICAgYkxpbmVDYXJkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNiU2FtZUNvbG9yID09PSBmYWxzZSAmJiBiTGluZUNhcmQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL+eJueauikEyM1xuICAgIGlmIChmYWxzZSA9PT0gYkxpbmVDYXJkKSB7XG4gICAgICAgIHZhciBiT25lID0gZmFsc2U7XG4gICAgICAgIHZhciBiVHdvID0gZmFsc2U7XG4gICAgICAgIHZhciBiVGhyZWUgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGNhcmREYXRhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgaWYgKEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoY2FyZERhdGFbaW5kZXhdKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGJPbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShjYXJkRGF0YVtpbmRleF0pID09PSAyKSB7XG4gICAgICAgICAgICAgICAgYlR3byA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDMpIHtcbiAgICAgICAgICAgICAgICBiVGhyZWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYk9uZSAmJiBiVHdvICYmIGJUaHJlZSkge1xuICAgICAgICAgICAgICAgIGJMaW5lQ2FyZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/pobrph5HnsbvlnotcbiAgICBpZiAoY2JTYW1lQ29sb3IgJiYgYkxpbmVDYXJkKSB7XG4gICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU0hVTl9KSU47XG4gICAgfVxuICAgIC8v6aG65a2Q57G75Z6LXG4gICAgaWYgKCAoZmFsc2UgPT09IGNiU2FtZUNvbG9yKSAmJiBiTGluZUNhcmQpIHtcbiAgICAgICAgcmV0dXJuIEdhbWVMb2dpYy5DVF9TSFVOX1pJO1xuICAgIH1cbiAgICAvL+mHkeiKseexu+Wei1xuICAgIGlmIChjYlNhbWVDb2xvciAmJiAoZmFsc2UgPT09IGJMaW5lQ2FyZCkgKSB7XG4gICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfSklOX0hVQTtcbiAgICB9XG4gICAgLy/niYzlnovliIbmnpBcbiAgICB2YXIgYkRvdWJsZSA9IGZhbHNlO1xuICAgIHZhciBiUGFudGhlciA9IHRydWU7XG4gICAgLy/lr7nniYzliIbmnpBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gaSsxOyBqIDwgY2FyZERhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbaV0pID09PSBHYW1lTG9naWMuZ2V0Q2FyZExvZ2ljVmFsdWUoY2FyZERhdGFbal0pKSB7XG4gICAgICAgICAgICAgICAgYkRvdWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJEb3VibGUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8v5LiJ5p2hKOixueWtkCnliIbmnpBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcmREYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChiUGFudGhlciAmJiBjYkZpcnN0VmFsdWUgIT09IEdhbWVMb2dpYy5nZXRDYXJkTG9naWNWYWx1ZShjYXJkRGF0YVtpXSkpIHtcbiAgICAgICAgICAgIGJQYW50aGVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/lr7nlrZDlkozosbnlrZDliKTmlq1cbiAgICBpZiAoYkRvdWJsZSkge1xuICAgICAgICBpZiAoYlBhbnRoZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfQkFPX1pJO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIEdhbWVMb2dpYy5DVF9ET1VCTEU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy/nibnmrooyMzVcbiAgICB2YXIgYlR3byA9IGZhbHNlO1xuICAgIHZhciBiVGhyZWUgPSBmYWxzZTtcbiAgICB2YXIgYkZpdmUgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgY2FyZERhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDIpIHtcbiAgICAgICAgICAgIGJUd28gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoY2FyZERhdGFbaW5kZXhdKSA9PT0gMykge1xuICAgICAgICAgICAgYlRocmVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGNhcmREYXRhW2luZGV4XSkgPT09IDUpIHtcbiAgICAgICAgICAgIGJGaXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggYlR3byAmJiBiVGhyZWUgJiYgYkZpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU1BFQ0lBTDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBHYW1lTG9naWMuQ1RfU0lOR0xFO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVMb2dpYzsiLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuXG52YXIgR2FtZU1vZGVsID0gY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25Mb2FkXVwiKTtcbiAgICAgICAgdmFyIEdhbWVGcmFtZU5vZGUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICBpZiAoR2FtZUZyYW1lTm9kZSl7XG4gICAgICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSBHYW1lRnJhbWVOb2RlLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uSW5pdEdhbWVFbmdpbmUoKTtcbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX2NiR2FtZVN0YXR1cyA9IC0xO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkVuYWJsZV1cIik7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudEdhbWVNZXNzYWdlXCIsdGhpcy5vbkV2ZW50R2FtZU1lc3NhZ2UsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FdmVudEdhbWVTY2VuZVwiLHRoaXMub25FdmVudEdhbWVTY2VuZSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oXCJvbkV2ZW50VXNlckVudGVyXCIsdGhpcy5vbkV2ZW50VXNlckVudGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRVc2VyU3RhdHVzXCIsdGhpcy5vbkV2ZW50VXNlclN0YXR1cyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oXCJvbkV2ZW50VXNlclNjb3JlXCIsdGhpcy5vbkV2ZW50VXNlclNjb3JlLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbihcIm9uRXhpdFJvb21cIix0aGlzLm9uRXhpdFJvb20sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKFwib25FeGl0VGFibGVcIix0aGlzLm9uRXhpdFRhYmxlLHRoaXMpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25EaXNhYmxlXVwiKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FdmVudEdhbWVNZXNzYWdlXCIsdGhpcy5vbkV2ZW50R2FtZU1lc3NhZ2UsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lU2NlbmVcIix0aGlzLm9uRXZlbnRHYW1lU2NlbmUsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRVc2VyRW50ZXJcIix0aGlzLm9uRXZlbnRVc2VyRW50ZXIsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRVc2VyU3RhdHVzXCIsdGhpcy5vbkV2ZW50VXNlclN0YXR1cyx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FdmVudFVzZXJTY29yZVwiLHRoaXMub25FdmVudFVzZXJTY29yZSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FeGl0Um9vbVwiLHRoaXMub25FeGl0Um9vbSx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKFwib25FeGl0VGFibGVcIix0aGlzLm9uRXhpdFRhYmxlLHRoaXMpO1xuICAgIH0sXG4gICAgLy/liJ3lp4vljJbmuLjmiI/mlbDmja5cbiAgICBvbkluaXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25Jbml0R2FtZUVuZ2luZV1cIik7XG4gICAgICAgIHRoaXMuX0Nsb2NrSUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNO1xuICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSAwO1xuICAgICAgICB0aGlzLl9DbG9ja0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVI7XG4gICAgfSxcbiAgICAvL+mHjee9ruahhuaetlxuICAgIG9uUmVzZXRHYW1lRW5naW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25SZXNldEdhbWVFbmdpbmVdXCIpO1xuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgdGhpcy5tX2JPbkdhbWUgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8v6YCA5Ye66K+i6ZeuXG4gICAgb25RdWVyeUV4aXRHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub25FeGl0VGFibGUoKTtcbiAgICB9LFxuICAgIHN0YW5kVXBBbmRRdWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/pgIDlh7rmoYzlrZBcbiAgICBvbkV4aXRUYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uRXhpdFRhYmxlXVwiKTtcbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG5cbiAgICAgICAgdmFyIG15SXRlbSA9IHRoaXMuZ2V0TWVVc2VySXRlbSgpO1xuICAgICAgICBpZiAobXlJdGVtICYmIG15SXRlbS5jYlVzZXJTdGF0dXMgPiBHbG9iYWxEZWYuVVNfRlJFRSkge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTdGFuZHVwUGFja2V0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRXhpdFJvb206IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7ICBcbiAgICB9LFxuICAgIG9uS2V5QmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9uUXVlcnlFeGl0R2FtZSgpO1xuICAgIH0sXG4gICAgLy/ojrflj5boh6rlt7HmpIXlrZBcbiAgICBnZXRNZUNoYWlySUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVGcmFtZS5nZXRDaGFpcklEKCk7XG4gICAgfSxcbiAgICAvL+iOt+WPluiHquW3seahjOWtkFxuICAgIGdldE1lVGFibGVJRDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZUZyYW1lLmdldFRhYmxlSUQoKTtcbiAgICB9LFxuICAgIGdldE1lVXNlckl0ZW06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVGcmFtZS5nZXRNZVVzZXJJdGVtKCk7XG4gICAgfSxcbiAgICAvLyDmpIXlrZDlj7fovazop4blm77kvY3nva4s5rOo5oSP5qSF5a2Q5Y+35LuOMH5uQ2hhaXJDb3VudC0xLOi/lOWbnueahOinhuWbvuS9jee9ruS7jjF+bkNoYWlyQ291bnRcbiAgICBzd2l0Y2hWaWV3Q2hhaXJJRDogZnVuY3Rpb24gKGNoYWlyKSB7XG4gICAgICAgIHZhciB2aWV3SUQgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgdmFyIG5DaGFpckNvdW50ID0gdGhpcy5fZ2FtZUZyYW1lLmdldENoYWlyQ291bnQoKTsgIFxuICAgICAgICB2YXIgbkNoYWlySUQgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuICAgICAgICBpZiAoY2hhaXIgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSICYmIGNoYWlyIDwgbkNoYWlyQ291bnQpIHtcbiAgICAgICAgICAgIHZpZXdJRCA9ICgoY2hhaXIgKyBNYXRoLmZsb29yKG5DaGFpckNvdW50ICogMy8yKSAtIG5DaGFpcklEKSUobkNoYWlyQ291bnQpKSA7Ly8rIDE7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtzd2l0Y2hWaWV3Q2hhaXJJRF0gKyBbbkNoYWlyQ291bnQsbkNoYWlySUQsY2hhaXIsdmlld0lEXSA9IFwiKyBbbkNoYWlyQ291bnQsbkNoYWlySUQsY2hhaXIsdmlld0lEXSk7XG4gICAgICAgIHJldHVybiB2aWV3SUQ7XG4gICAgfSxcbiAgICAvL+aYr+WQpuWQiOazleinhuWbvklEXG4gICAgaXNWYWxpZFZpZXdJRDogZnVuY3Rpb24gKHZpZXdJRCkge1xuICAgICAgICB2YXIgbkNoYWlyQ291bnQgPSB0aGlzLl9nYW1lRnJhbWUuZ2V0Q2hhaXJDb3VudCgpO1xuICAgICAgICByZXR1cm4gKHZpZXdJRCA+IDApICYmICh2aWV3SUQgPD0gbkNoYWlyQ291bnQpOyAgXG4gICAgfSxcbiAgICAvL+iuvue9ruiuoeaXtuWZqFxuICAgIHNldEdhbWVDbG9jazogZnVuY3Rpb24gKGNoYWlyLCBpZCwgdGltZSkge1xuICAgICAgICBpZiAoIWNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmlzU2NoZWR1bGVkKHRoaXMub25DbG9ja1VwZGF0YSx0aGlzKSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUodGhpcy5vbkNsb2NrVXBkYXRhLCB0aGlzLCAxLCBjYy5tYWNyby5SRVBFQVRfRk9SRVZFUiwgMCwgZmFsc2UpO1xuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5fQ2xvY2tDaGFpciA9IGNoYWlyO1xuICAgICAgICB0aGlzLl9DbG9ja0lEID0gaWQ7XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IHRpbWU7XG4gICAgICAgIHRoaXMuX0Nsb2NrVmlld0NoYWlyID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChjaGFpcik7XG4gICAgICAgIHRoaXMub25VcGRhdGVDbG9ja1ZpZXcoKTtcbiAgICB9LFxuICAgIC8v5YWz6Zet6K6h5pe25ZmoXG4gICAga2lsbEdhbWVDbG9jazogZnVuY3Rpb24gKG5vdFZpZXcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtraWxsR2FtZUNsb2NrXVwiKTtcbiAgICAgICAgdGhpcy5fQ2xvY2tJRCA9IEdsb2JhbERlZi5JTlZBTElEX0lURU07XG4gICAgICAgIHRoaXMuX0Nsb2NrVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX0Nsb2NrQ2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgdGhpcy5fQ2xvY2tWaWV3Q2hhaXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjtcbiAgICAgICAgaWYgKGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLmlzU2NoZWR1bGVkKHRoaXMub25DbG9ja1VwZGF0YSx0aGlzKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtraWxsR2FtZUNsb2NrXSB1bnNjaGVkdWxlIHRoaXMub25DbG9ja1VwZGF0YVwiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGUodGhpcy5vbkNsb2NrVXBkYXRhLCB0aGlzKTtcbiAgICAgICAgfSAgXG4gICAgICAgIGlmICghIG5vdFZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMub25VcGRhdGVDbG9ja1ZpZXcoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2xvY2tWaWV3SUQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0Nsb2NrVmlld0NoYWlyO1xuICAgIH0sXG4gICAgLy/orqHml7blmajmm7TmlrBcbiAgICBvbkNsb2NrVXBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25DbG9ja1VwZGF0YV0gY2hhaXIgPSBcIiArIHRoaXMuX0Nsb2NrQ2hhaXIgKyBcIiB0aW1lID0gXCIgKyB0aGlzLl9DbG9ja1RpbWUgKyBcIiBpZCA9IFwiICsgdGhpcy5fQ2xvY2tJRCk7XG4gICAgICAgIGlmICh0aGlzLl9DbG9ja0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9JVEVNKSB7XG4gICAgICAgICAgICB0aGlzLl9DbG9ja1RpbWUgPSB0aGlzLl9DbG9ja1RpbWUgLSAxO1xuICAgICAgICAgICAgdmFyIHJldCA9IHRoaXMub25FdmVudEdhbWVDbG9ja0luZm8odGhpcy5fQ2xvY2tDaGFpciwgdGhpcy5fQ2xvY2tUaW1lLCB0aGlzLl9DbG9ja0lEKTtcbiAgICAgICAgICAgIGlmIChyZXQgPT09IHRydWUgfHwgdGhpcy5fQ2xvY2tUaW1lIDwgMSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25DbG9ja1VwZGF0YV0gW3JldCxjbG9ja3RpbWVdID0gXCIgKyBbcmV0LHRoaXMuX0Nsb2NrVGltZV0pO1xuICAgICAgICAgICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICBcbiAgICAgICAgdGhpcy5vblVwZGF0ZUNsb2NrVmlldygpO1xuICAgIH0sXG4gICAgLy/mm7TmlrDorqHml7blmajmmL7npLpcbiAgICBvblVwZGF0ZUNsb2NrVmlldzogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBvblVwZGF0ZUNsb2NrVmlld1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uVXBkYXRlQ2xvY2tWaWV3XSBjbG9ja1RpbWUgPSBcIiArIHRoaXMuX0Nsb2NrVGltZSArIFwiIHZpZXdDaGFpciA9IFwiICsgdGhpcy5fQ2xvY2tWaWV3Q2hhaXIpO1xuICAgIH0sXG4gICAgLy/nlKjmiLfnirbmgIEgXG4gICAgb25FdmVudFVzZXJTdGF0dXM6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gcGFyYW1zID0ge3VzZXJJdGVtOixuZXdTdGF0dXMsb2xkU3RhdHVzLH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkV2ZW50VXNlclN0YXR1c11cIik7XG4gICAgICAgIHZhciB1c2VySXRlbSA9IHBhcmFtcy5kZXRhaWwudXNlckl0ZW07XG4gICAgICAgIHZhciBuZXdTdGF0dXMgPSBwYXJhbXMuZGV0YWlsLm5ld1N0YXR1cztcbiAgICAgICAgdmFyIG9sZFN0YXR1cyA9IHBhcmFtcy5kZXRhaWwub2xkU3RhdHVzO1xuICAgICAgICB2YXIgbXlUYWJsZSA9IHRoaXMuZ2V0TWVUYWJsZUlEKCk7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcblxuICAgICAgICBpZiAobXlUYWJsZSA9PT0gdW5kZWZpbmVkIHx8IG15VGFibGUgPT09IEdsb2JhbERlZi5JTlZBTElEX1RBQkxFKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZU1vZGVsXVtvbkV2ZW50VXNlclN0YXR1c10gbXlUYWJsZSA9IFwiICsgbXlUYWJsZSArIFwiIG9sZCA9IFwiICsgSlNPTi5zdHJpbmdpZnkob2xkU3RhdHVzLCBudWxsLCAnICcpICsgXCIgbmV3ID0gXCIgKyBKU09OLnN0cmluZ2lmeShuZXdTdGF0dXMsIG51bGwsICcgJykpO1xuICAgICAgICAvL+aXp+eahOa4hemZpFxuICAgICAgICBpZiAob2xkU3RhdHVzLndUYWJsZUlEID09PSBteVRhYmxlKSB7XG4gICAgICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChvbGRTdGF0dXMud0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAhPT0gdW5kZWZpbmVkICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lTW9kZWxdW29uRXZlbnRVc2VyU3RhdHVzXSDml6fnmoTmuIXpmaRcIik7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dhbWVWaWV3ICYmIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcih2aWV3SUQsIHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5pu05paw5paw54q25oCBXG4gICAgICAgIGlmIChuZXdTdGF0dXMud1RhYmxlSUQgPT09IG15VGFibGUpIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKG5ld1N0YXR1cy53Q2hhaXJJRCk7XG4gICAgICAgICAgICBpZiAodmlld0lEICE9PSB1bmRlZmluZWQgJiYgdmlld0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgICAgIC8vIG9uVXBkYXRlVXNlclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVNb2RlbF1bb25FdmVudFVzZXJTdGF0dXNdIOabtOaWsOaWsOeKtuaAgVwiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2FtZVZpZXcgJiYgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKHZpZXdJRCwgdXNlckl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/nlKjmiLfnp6/liIZcbiAgICBvbkV2ZW50VXNlclNjb3JlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHBhcmFtcyA9IHt1c2VyU2NvcmUsfVxuICAgICAgICB2YXIgdXNlckl0ZW0gPSBwYXJhbXMuZGV0YWlsLnVzZXJJdGVtO1xuICAgICAgICB2YXIgbXlUYWJsZSA9IHRoaXMuZ2V0TWVUYWJsZUlEKCk7XG4gICAgICAgIGlmIChteVRhYmxlID09PSB1bmRlZmluZWQgfHwgbXlUYWJsZSA9PT0gR2xvYmFsRGVmLklOVkFMSURfVEFCTEUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobXlUYWJsZSA9PT0gdXNlckl0ZW0ud1RhYmxlSUQpIHtcbiAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHVzZXJJdGVtLndDaGFpcklEKTtcbiAgICAgICAgICAgIGlmICh2aWV3SUQgIT09IHVuZGVmaW5lZCAmJiB2aWV3SUQgIT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAgICAgLy8gb25VcGRhdGVVc2VyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2dhbWVWaWV3ICYmIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlVXNlcih2aWV3SUQsIHVzZXJJdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v55So5oi36L+b5YWlXG4gICAgb25FdmVudFVzZXJFbnRlcjogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBwYXJhbXMgPSB7d1RhYmxlSUQsd0NoYWlySUQsdXNlckl0ZW0sfVxuICAgICAgICB2YXIgd1RhYmxlSUQgPSBwYXJhbXMuZGV0YWlsLndUYWJsZUlEO1xuICAgICAgICB2YXIgd0NoYWlySUQgPSBwYXJhbXMuZGV0YWlsLndDaGFpcklEO1xuICAgICAgICB2YXIgdXNlckl0ZW0gPSBwYXJhbXMuZGV0YWlsLnVzZXJJdGVtO1xuXG4gICAgICAgIHZhciBteVRhYmxlID0gdGhpcy5nZXRNZVRhYmxlSUQoKTtcbiAgICAgICAgaWYgKG15VGFibGUgPT09IHVuZGVmaW5lZCB8fCBteVRhYmxlID09PSBHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChteVRhYmxlID09PSB3VGFibGVJRCkge1xuICAgICAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQod0NoYWlySUQpO1xuICAgICAgICAgICAgaWYgKHZpZXdJRCAhPT0gdW5kZWZpbmVkICYmIHZpZXdJRCAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgICAgICAvLyBvblVwZGF0ZVVzZXJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2FtZVZpZXcgJiYgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKHZpZXdJRCwgdXNlckl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lj5HpgIHlh4blpIdcbiAgICBzZW5kVXNlclJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kVXNlclJlYWR5KCk7XG4gICAgfSxcbiAgICAvL+WPkemAgeaVsOaNrlxuICAgIHNlbmREYXRhIDogZnVuY3Rpb24gKHN1YiwgZGF0YUJ1Zikge1xuICAgICAgICBpZiAodGhpcy5fZ2FtZUZyYW1lKSB7XG4gICAgICAgICAgICBkYXRhQnVmLnNldGNtZGluZm8oR2xvYmFsRGVmLk1ETV9HRl9HQU1FLCBzdWIpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTb2NrZXREYXRhKGRhdGFCdWYpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8v5Zy65pmv5raI5oGvXG4gICAgb25FdmVudEdhbWVTY2VuZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBcbiAgICB9LFxuICAgIC8v5ri45oiP5raI5oGvXG4gICAgb25FdmVudEdhbWVNZXNzYWdlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/orqHml7blmajlk43lupRcbiAgICBvbkV2ZW50R2FtZUNsb2NrSW5mbzogZnVuY3Rpb24gKGNoYWlyLCB0aW1lLCBjbG9ja0lEKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lTW9kZWw7IiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbnZhciBHYW1lTW9kZWwgPSByZXF1aXJlKFwiR2FtZU1vZGVsXCIpO1xudmFyIEdhbWVMb2dpYyA9IHJlcXVpcmUoXCJHYW1lTG9naWNcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogR2FtZU1vZGVsLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyBtX0J1dHRvbl9tZW51T3BlbjogY2MuVG9nZ2xlLFxuICAgICAgICBtX1BhbmVsX21lbnU6Y2MuTm9kZSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgLy8gaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAvLyAgICAgdGhpcy5fZ2FtZUZyYW1lID0gR2FtZUZyYW1lTm9kZS5nZXRDb21wb25lbnQoXCJHYW1lRnJhbWVcIik7XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tX2xNYXhUdXJuQ291bnQgPSA4O1xuICAgICAgICB0aGlzLl9nYW1lVmlldyA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJHYW1lVmlld1wiKTtcbiAgICAgICAgXG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vbihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9mZihcIm9uRXZlbnRHYW1lTWVzc2FnZVwiLHRoaXMub25FdmVudEdhbWVNZXNzYWdlLHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm9uRXhpdFJvb20oKTtcbiAgICB9LFxuICAgIG9uSW5pdEdhbWVFbmdpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkluaXRHYW1lRW5naW5lXVwiKTtcbiAgICAgICAgdGhpcy5tX3dDdXJyZW50VXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5b2T5YmN55So5oi3XG4gICAgICAgIHRoaXMubV93QmFua2VyVXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5bqE5a6255So5oi3XG5cbiAgICAgICAgdGhpcy5tX2NiUGxheVN0YXR1cyA9IFswLDAsMCwwLDBdOy8v5ri45oiP54q25oCBXG4gICAgICAgIHRoaXMubV9sVGFibGVTY29yZSA9IFswLDAsMCwwLDBdOy8v5LiL5rOo5pWw55uuXG5cbiAgICAgICAgdGhpcy5tX2xNYXhDZWxsU2NvcmUgPSAwOy8v5Y2V5YWD5LiK6ZmQXG4gICAgICAgIHRoaXMubV9sQ2VsbFNjb3JlID0gMDsvL+WNleWFg+S4i+azqFxuXG4gICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gMDsvL+W9k+WJjeWAjeaVsFxuICAgICAgICB0aGlzLm1fbFVzZXJNYXhTY29yZSA9IDA7Ly/mnIDlpKfliIbmlbBcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IDA7Ly/lvZPliY3ova7mlbBcblxuICAgICAgICB0aGlzLm1fYkxvb2tDYXJkID0gW2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXTsvL+eci+eJjOWKqOS9nFxuXG4gICAgICAgIHRoaXMubV93TG9zdFVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+avlOeJjOWksei0pVxuICAgICAgICB0aGlzLm1fd1dpbm5lclVzZXIgPSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUjsvL+iDnOWIqeeUqOaIt1xuXG4gICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgPSAwO1xuICAgICAgICBcbiAgICAgICAgLy8gdGhpcy5zZXRHYW1lQ2xvY2soempoX2NtZC5NWV9WSUVXSUQsIHpqaF9jbWQuSURJX1NUQVJUX0dBTUUsIHpqaF9jbWQuVElNRV9TVEFSVF9HQU1FKVxuICAgIH0sXG4gICAgb25SZXNldEdhbWVFbmdpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25SZXNldFZpZXcoKTtcbiAgICAgICAgdGhpcy5tX3dDdXJyZW50VXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5b2T5YmN55So5oi3XG4gICAgICAgIHRoaXMubV93QmFua2VyVXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5bqE5a6255So5oi3XG4gICAgICAgIHRoaXMubV9jYlBsYXlTdGF0dXMgPSBbMCwwLDAsMCwwXTsvL+a4uOaIj+eKtuaAgVxuICAgICAgICB0aGlzLm1fbFRhYmxlU2NvcmUgPSBbMCwwLDAsMCwwXTsvL+S4i+azqOaVsOebrlxuICAgICAgICB0aGlzLm1fbE1heENlbGxTY29yZSA9IDA7Ly/ljZXlhYPkuIrpmZBcbiAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSAwOy8v5Y2V5YWD5LiL5rOoXG4gICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gMDsvL+W9k+WJjeWAjeaVsFxuICAgICAgICB0aGlzLm1fbFVzZXJNYXhTY29yZSA9IDA7Ly/mnIDlpKfliIbmlbBcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IDA7Ly/lvZPliY3ova7mlbBcbiAgICAgICAgdGhpcy5tX2JMb29rQ2FyZCA9IFtmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV07Ly/nnIvniYzliqjkvZxcbiAgICAgICAgdGhpcy5tX3dMb3N0VXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v5q+U54mM5aSx6LSlXG4gICAgICAgIHRoaXMubV93V2lubmVyVXNlciA9IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSOy8v6IOc5Yip55So5oi3XG4gICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgPSAwO1xuICAgICAgICAvLyB0aGlzLnNldEdhbWVDbG9jayh6amhfY21kLk1ZX1ZJRVdJRCwgempoX2NtZC5JRElfU1RBUlRfR0FNRSwgempoX2NtZC5USU1FX1NUQVJUX0dBTUUpXG4gICAgfSxcbiAgICAvL+iuvue9ruiuoeaXtuWZqFxuICAgIHNldEdhbWVDbG9jazogZnVuY3Rpb24gKGNoYWlyLCBpZCwgdGltZSkge1xuICAgICAgICB0aGlzLl9zdXBlcihjaGFpciwgaWQsIHRpbWUpO1xuICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5nZXRDbG9ja1ZpZXdJRCgpO1xuICAgICAgICBpZiAodmlld0lEICE9PSB1bmRlZmluZWQgJiYgdmlld0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgLy/ml7bpl7Tov5vluqbmnaFcbiAgICAgICAgICAgIC8vdGhpcy5PbkV2ZW50R2FtZUNsb2NrSW5mbyh2aWV3SUQsIGlkKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lhbPpl63orqHml7blmahcbiAgICBraWxsR2FtZUNsb2NrOiBmdW5jdGlvbiAobm90Vmlldykge1xuICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5nZXRDbG9ja1ZpZXdJRCgpO1xuICAgICAgICBpZiAodmlld0lEICE9PSB1bmRlZmluZWQgJiYgdmlld0lEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgLy/ml7bpl7Tov5vluqbmnaFcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG4gICAgLy/ojrflvpflvZPliY3mraPlnKjnjqnnmoTnjqnlrrbmlbDph49cbiAgICBnZXRQbGF5aW5nTnVtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBudW0gPSAwO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDw9IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW2luZGV4XSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIG51bSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW07XG4gICAgfSxcbiAgICAvL+aXtumSn+WkhOeQhlxuICAgIE9uRXZlbnRHYW1lQ2xvY2tJbmZvOiBmdW5jdGlvbiAoY2hhaXIsIHRpbWUsIGNsb2NrSUQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkV2ZW50R2FtZUNsb2NrSW5mb10gY2hhaXIgPSBcIiArIGNoYWlyICsgXCIgdGltZSA9IFwiICsgdGltZSArIFwiIGNsb2NrSUQgPSBcIiArIGNsb2NrSUQpO1xuICAgICAgICBpZiAoY2xvY2tJRCA9PT0gempoX2NtZC5JRElfU1RBUlRfR0FNRSkge1xuICAgICAgICAgICAgaWYgKHRpbWUgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25FeGl0VGFibGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9ESVNBQkxFKSB7XG4gICAgICAgICAgICBpZiAodGltZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2xvY2tJRCA9PT0gempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkUpIHtcbiAgICAgICAgICAgIGlmICh0aW1lID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tX3dDdXJyZW50VXNlciA9PT0gdGhpcy5nZXRNZUNoYWlySUQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uR2l2ZVVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjbG9ja0lEID09PSB6amhfY21kLklESV9VU0VSX0NPTVBBUkVfQ0FSRCkge1xuICAgICAgICAgICAgaWYgKHRpbWUgPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25BdXRvQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25VcGRhdGVDbG9ja1ZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX2dhbWVWaWV3ICYmIHRoaXMuX2dhbWVWaWV3Lm9uVXBkYXRlQ2xvY2tWaWV3KVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5vblVwZGF0ZUNsb2NrVmlldyh0aGlzLl9DbG9ja1ZpZXdDaGFpciwgdGhpcy5fQ2xvY2tUaW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lnLrmma/mtojmga9cbiAgICBvbkV2ZW50R2FtZVNjZW5lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHBhcmFtcyA9IHtjYkdhbWVTdGF0dXMscERhdGEsfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lU2NlbmVdXCIpO1xuICAgICAgICB2YXIgY2JHYW1lU3RhdHVzID0gcGFyYW1zLmRldGFpbC5jYkdhbWVTdGF0dXM7XG4gICAgICAgIHZhciBwRGF0YSA9IHBhcmFtcy5kZXRhaWwucERhdGE7XG4gICAgICAgIC8v5Yid5aeL5YyW5bey5pyJ546p5a62XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgdXNlckl0ZW0gPSB0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVVc2VySXRlbSh0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVJRCgpLCBpbmRleCk7XG4gICAgICAgICAgICBpZiAodXNlckl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgd1ZpZXdDaGFpcklEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChpbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcub25VcGRhdGVVc2VyKHdWaWV3Q2hhaXJJRCx1c2VySXRlbSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkV2ZW50R2FtZVNjZW5lXSB3Vmlld0NoYWlySUQgPSBcIiArIHdWaWV3Q2hhaXJJRCArIFwiIHVzZXJJdGVtID0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VySXRlbSxudWxsLCAnICcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGNiR2FtZVN0YXR1cykge1xuICAgICAgICAgICAgY2FzZSBHbG9iYWxEZWYuR1NfRlJFRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lU2NlbmVdIGNiR2FtZVN0YXR1cyA9IEdTX0ZSRUVcIik7XG4gICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfU3RhdHVzRnJlZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsQ2VsbFNjb3JlO1x0XHRcdFx0XHRcdFx0Ly/ln7rnoYDnp6/liIZcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHRoaXMubV9iT25HYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2xDZWxsU2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q2VsbFNjb3JlKHRoaXMubV9sQ2VsbFNjb3JlKTtcbiAgICAgICAgICAgICAgICAvLyBzaG93UmVhZHkoKTvmmL7npLrlh4blpIfmjInpkq5cbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5tX0J1dHRvbl9yZWFkeS5ub2RlLmFjdGl2ZSA9ICh0aGlzLmdldE1lVXNlckl0ZW0oKS5jYlVzZXJTdGF0dXMgPT09IEdsb2JhbERlZi5VU19TSVQpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKEdsb2JhbERlZi5JTlZBTElEX0NIQUlSLCB6amhfY21kLklESV9TVEFSVF9HQU1FLCB6amhfY21kLlRJTUVfU1RBUlRfR0FNRSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgR2xvYmFsRGVmLkdTX1BMQVlJTkc6XG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9TX1N0YXR1c1BsYXlcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8v5Yqg5rOo5L+h5oGvXG4gICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bE1heENlbGxTY29yZTtcdFx0XHRcdFx0XHQvL+WNleWFg+S4iumZkFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDZWxsU2NvcmU7XHRcdFx0XHRcdFx0XHQvL+WNleWFg+S4i+azqFxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDdXJyZW50VGltZXM7XHRcdFx0XHRcdFx0Ly/lvZPliY3lgI3mlbBcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsVXNlck1heFNjb3JlO1x0XHRcdFx0XHRcdC8v55So5oi35YiG5pWw5LiK6ZmQXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICAgICAvL+eKtuaAgeS/oeaBr1xuICAgICAgICAgICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdCYW5rZXJVc2VyO1x0XHRcdFx0XHRcdC8v5bqE5a6255So5oi3XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdCBcdFx0XHRcdHdDdXJyZW50VXNlcjtcdFx0XHRcdFx0XHQvL+W9k+WJjeeOqeWutlxuICAgICAgICAgICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgYm9vbFx0XHRcdFx0XHRcdFx0XHRiTWluZ1podVtHQU1FX1BMQVlFUl07XHRcdFx0XHQvL+eci+eJjOeKtuaAgVxuICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxUYWJsZVNjb3JlW0dBTUVfUExBWUVSXTtcdFx0XHQvL+S4i+azqOaVsOebrlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgLy/miZHlhYvkv6Hmga9cbiAgICAgICAgICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkhhbmRDYXJkRGF0YVtNQVhfQ09VTlRdO1x0XHRcdC8v5omR5YWL5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICAgICAvL+eKtuaAgeS/oeaBr1xuICAgICAgICAgICAgICAgIC8vICAgICBib29sXHRcdFx0XHRcdFx0XHRcdGJDb21wYXJlU3RhdGU7XHRcdFx0XHRcdFx0Ly/mr5TniYznirbmgIFcbiAgICAgICAgICAgICAgICAvLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgICAgICAgICB2YXIgcGxheVN0YXR1cyA9IHt9O1xuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMubE1heENlbGxTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxDZWxsU2NvcmUgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5sQ3VycmVudFRpbWVzID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMubFVzZXJNYXhTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcblxuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMud0JhbmtlclVzZXIgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMud0N1cnJlbnRVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmNiUGxheVN0YXR1cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMuY2JQbGF5U3RhdHVzW2luZGV4XSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMuYk1pbmdaaHUgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmJNaW5nWmh1W2luZGV4XSA9IHBEYXRhLnJlYWRib29sKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMubFRhYmxlU2NvcmUgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxUYWJsZVNjb3JlW2luZGV4XSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5jYkhhbmRDYXJkRGF0YSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXlTdGF0dXMuY2JIYW5kQ2FyZERhdGFbaW5kZXhdID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGxheVN0YXR1cy5iQ29tcGFyZVN0YXRlID0gcERhdGEucmVhZGJvb2woKTtcbiAgICAgICAgICAgICAgICBwbGF5U3RhdHVzLmxDdXJyZW50VHVybiA9IHBEYXRhLnJlYWRpbnQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMubV9sTWF4Q2VsbFNjb3JlID0gcGxheVN0YXR1cy5sTWF4Q2VsbFNjb3JlO1xuICAgICAgICAgICAgICAgIHRoaXMubV9sQ2VsbFNjb3JlID0gcGxheVN0YXR1cy5sQ2VsbFNjb3JlO1xuICAgICAgICAgICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gcGxheVN0YXR1cy5sQ3VycmVudFRpbWVzO1xuICAgICAgICAgICAgICAgIHRoaXMubV9sQ3VycmVudFR1cm4gPSBwbGF5U3RhdHVzLmxDdXJyZW50VHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLm1fbFVzZXJNYXhTY29yZSA9IHBsYXlTdGF0dXMubFVzZXJNYXhTY29yZTtcbiAgICAgICAgICAgICAgICB0aGlzLm1fd0JhbmtlclVzZXIgPSBwbGF5U3RhdHVzLndCYW5rZXJVc2VyO1xuICAgICAgICAgICAgICAgIHRoaXMubV93Q3VycmVudFVzZXIgPSBwbGF5U3RhdHVzLndDdXJyZW50VXNlcjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzW2luZGV4XSA9IHBsYXlTdGF0dXMuY2JQbGF5U3RhdHVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX2JMb29rQ2FyZFtpbmRleF0gPSBwbGF5U3RhdHVzLmJNaW5nWmh1W2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW2luZGV4XSA9IHBsYXlTdGF0dXMubFRhYmxlU2NvcmVbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY2FyZERhdGEgPSBbXVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLk1BWF9DT1VOVDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBjYXJkRGF0YVtpbmRleF0gPSBwbGF5U3RhdHVzLmNiSGFuZENhcmREYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG5cbiAgICAgICAgICAgICAgICAvL+W6leazqOS/oeaBr1xuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENlbGxTY29yZSh0aGlzLm1fbENlbGxTY29yZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q2VsbFR1cm4odGhpcy5tX2xDZWxsU2NvcmUsIHRoaXMubV9sQ3VycmVudFR1cm4sIHRoaXMubV9sTWF4VHVybkNvdW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRNYXhDZWxsU2NvcmUodGhpcy5tX2xNYXhDZWxsU2NvcmUpXG5cbiAgICAgICAgICAgICAgICAvL+W6hOWutuS/oeaBr1xuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEJhbmtlcih0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHRoaXMubV93QmFua2VyVXNlcikpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy/op4blm77kvY3nva5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQoaSk7XG4gICAgICAgICAgICAgICAgICAgIC8v5omL54mM5pi+56S6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW2ldID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3Lm1fdXNlckNhcmRbdmlld0lEXS5hcmVhLmFjdGl2ZSA9IFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IG15Q2hhaXIgJiYgdGhpcy5tX2JMb29rQ2FyZFtteUNoYWlyXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYXJkSW5kZXggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHpqaF9jbWQuTUFYX0NPVU5UOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FyZEluZGV4W2tdID0gY2FyZERhdGFba107Ly9HYW1lTG9naWMuZ2V0Q2FyZENvbG9yKGNhcmREYXRhW2tdKSAqIDEzICsgR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShjYXJkRGF0YVtrXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkKHZpZXdJRCwgY2FyZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkKHZpZXdJRCwgWzB4ZmYsMHhmZiwweGZmXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLl9nYW1lVmlldy51c2VyQ2FyZFt2aWV3SURdXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh2aWV3SUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8v55yL54mM5pi+56S6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldExvb2tDYXJkKHZpZXdJRCwgdGhpcy5tX2JMb29rQ2FyZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJUYWJsZVNjb3JlKHZpZXdJRCwgdGhpcy5tX2xUYWJsZVNjb3JlW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSArPSB0aGlzLm1fbFRhYmxlU2NvcmVbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnBsYXllckpldHRvbih2aWV3SUQsIHRoaXMubV9sVGFibGVTY29yZVtpXSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIPniYxcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gIT09IDEgJiYgdGhpcy5tX2xUYWJsZVNjb3JlW2ldID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcudXNlckNhcmRcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJHaXZlVXAodmlld0lELCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL+aAu+S4i+azqFxuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG4gICAgICAgICAgICAgICAgLy90b2RvXG4gICAgICAgICAgICAgICAgaWYgKCAhcGxheVN0YXR1cy5iQ29tcGFyZVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldE1lQ2hhaXJJRCgpID09PSB0aGlzLm1fd0N1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9VU0VSX0FERF9TQ09SRSwgempoX2NtZC5USU1FX1VTRVJfQUREX1NDT1JFKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldE1lQ2hhaXJJRCgpID09PSB0aGlzLm1fd0N1cnJlbnRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+mAieaLqeeOqeWutuavlOeJjFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXBhcmVTdGF0dXMgPSBbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tpXSA9PT0gMSAmJiBpICE9PSBteUNoYWlyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBhcmVTdGF0dXNbdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChpKV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENvbXBhcmVDYXJkKHRydWUsIGNvbXBhcmVTdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7ml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQ09NUEFSRV9DQVJELCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q29tcGFyZUNhcmQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/orr7nva7ml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX0RJU0FCTEUsIHpqaF9jbWQuVElNRV9VU0VSX0NPTVBBUkVfQ0FSRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkV2ZW50R2FtZU1lc3NhZ2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHN1YiA9IHBhcmFtcy5kZXRhaWwuc3ViO1xuICAgICAgICB2YXIgcERhdGEgPSBwYXJhbXMuZGV0YWlsLnBEYXRhO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uRXZlbnRHYW1lTWVzc2FnZV0gcERhdGEgbGVuID0gXCIgKyBwRGF0YS5nZXREYXRhU2l6ZSgpKTtcbiAgICAgICAgaWYgKCF0aGlzLl9ldmVudEdhbWVNZXNzYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFjayA9IHtcbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19HQU1FX1NUQVJUXSA6IHRoaXMub25TdWJHYW1lU3RhcnQsLy/muLjmiI/lvIDlp4tcbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19BRERfU0NPUkVdIDogdGhpcy5vblN1YkFkZFNjb3JlLC8v55So5oi35LiL5rOoXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfTE9PS19DQVJEXSA6IHRoaXMub25TdWJMb29rQ2FyZCwvL+eci+eJjOa2iOaBr1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX0NPTVBBUkVfQ0FSRF0gOiB0aGlzLm9uU3ViQ29tcGFyZUNhcmQsLy/mr5TniYzmtojmga9cbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19PUEVOX0NBUkRdIDogdGhpcy5vblN1Yk9wZW5DYXJkLC8v5byA54mM5raI5oGvXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfR0lWRV9VUF0gOiB0aGlzLm9uU3ViR2l2ZVVwLC8v55So5oi35pS+5byDXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfUExBWUVSX0VYSVRdIDogdGhpcy5vblN1YlBsYXllckV4aXQsLy/nlKjmiLflvLrpgIBcbiAgICAgICAgICAgICAgICBbempoX2NtZC5TVUJfU19HQU1FX0VORF0gOiB0aGlzLm9uU3ViR2FtZUVuZCwvL+a4uOaIj+e7k+adn1xuICAgICAgICAgICAgICAgIFt6amhfY21kLlNVQl9TX1dBSVRfQ09NUEFSRV0gOiB0aGlzLm9uU3ViV2FpdENvbXBhcmUsXG4gICAgICAgICAgICAgICAgW3pqaF9jbWQuU1VCX1NfTEFTVF9BRERdIDogdGhpcy5vblN1Ykxhc3RBZGQsLy9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZXZlbnRHYW1lTWVzc2FnZUNhbGxiYWNrICYmIHRoaXMuX2V2ZW50R2FtZU1lc3NhZ2VDYWxsYmFja1tzdWJdKSB7XG4gICAgICAgICAgICB2YXIgZnVuID0gdGhpcy5fZXZlbnRHYW1lTWVzc2FnZUNhbGxiYWNrW3N1Yl07XG4gICAgICAgICAgICBmdW4uY2FsbCh0aGlzLCBzdWIsIHBEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25FdmVudEdhbWVNZXNzYWdlXSBzdWIgPSBcIiArIHN1YiArIFwiIG5vdCBmaW5kXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvblN1YkdhbWVTdGFydDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkdhbWVTdGFydF1cIik7XG4gICAgICAgIC8v5ri45oiP5byA5aeLXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19HYW1lU3RhcnRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgLy/kuIvms6jkv6Hmga9cbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bE1heFNjb3JlO1x0XHRcdFx0XHRcdFx0Ly/mnIDlpKfkuIvms6hcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bENlbGxTY29yZTtcdFx0XHRcdFx0XHRcdC8v5Y2V5YWD5LiL5rOoXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxDdXJyZW50VGltZXM7XHRcdFx0XHRcdFx0Ly/lvZPliY3lgI3mlbBcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFVzZXJNYXhTY29yZTtcdFx0XHRcdFx0XHQvL+WIhuaVsOS4iumZkFxuICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAvL+eUqOaIt+S/oeaBr1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3QmFua2VyVXNlcjtcdFx0XHRcdFx0XHQvL+W6hOWutueUqOaIt1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0IFx0XHRcdFx0d0N1cnJlbnRVc2VyO1x0XHRcdFx0XHRcdC8v5b2T5YmN546p5a62XG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiUGxheVN0YXR1c1tHQU1FX1BMQVlFUl07XHRcdFx0Ly/muLjmiI/nirbmgIFcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGdhbWVTdGFydCA9IHt9O1xuICAgICAgICBnYW1lU3RhcnQubE1heFNjb3JlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBnYW1lU3RhcnQubENlbGxTY29yZSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LmxDdXJyZW50VGltZXMgPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgIGdhbWVTdGFydC5sVXNlck1heFNjb3JlID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBnYW1lU3RhcnQud0JhbmtlclVzZXIgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICBnYW1lU3RhcnQud0N1cnJlbnRVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgZ2FtZVN0YXJ0LmNiUGxheVN0YXR1cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaW5kZXgrKykge1xuICAgICAgICAgICAgZ2FtZVN0YXJ0LmNiUGxheVN0YXR1c1tpbmRleF0gPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdIGdhbWVTdGFydCA9IFwiICsgSlNPTi5zdHJpbmdpZnkoZ2FtZVN0YXJ0LCBudWxsLCAnICcpKTtcbiAgICAgICAgdGhpcy5tX2xNYXhTY29yZSA9IGdhbWVTdGFydC5sTWF4U2NvcmU7XG4gICAgICAgIHRoaXMubV9sQ2VsbFNjb3JlID0gZ2FtZVN0YXJ0LmxDZWxsU2NvcmU7XG4gICAgICAgIHRoaXMubV9sVXNlck1heFNjb3JlID0gZ2FtZVN0YXJ0LmxVc2VyTWF4U2NvcmU7XG4gICAgICAgIHRoaXMubV93Q3VycmVudFVzZXIgPSBnYW1lU3RhcnQud0N1cnJlbnRVc2VyO1xuICAgICAgICB0aGlzLm1fd0JhbmtlclVzZXIgPSBnYW1lU3RhcnQud0JhbmtlclVzZXI7XG4gICAgICAgIHRoaXMubV9pc0ZpcnN0QWRkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IDA7XG4gICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gMTtcbiAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSA9IDA7XG4gICAgICAgIHRoaXMubV9pc0ZsbG93QWx3YXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX2JMYXN0QWRkT3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fYk9uR2FtZSA9IHRydWU7XG4gICAgICAgIC8v5pi+56S65bqE5a62XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEJhbmtlcih0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHRoaXMubV93QmFua2VyVXNlcikpO1xuICAgICAgICAvL+aYvuekuuW6leWIhlxuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsU2NvcmUodGhpcy5tX2xDZWxsU2NvcmUpO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDZWxsVHVybih0aGlzLm1fbENlbGxTY29yZSwgdGhpcy5tX2xDdXJyZW50VHVybiwgdGhpcy5tX2xNYXhUdXJuQ291bnQpO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRNYXhDZWxsU2NvcmUodGhpcy5tX2xNYXhDZWxsU2NvcmUpO1xuICAgICAgICAvL+aYvuekuuS4i+azqOeKtuaAgVxuXG4gICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgPSAwO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5jbGVhbkFsbEpldHRvbnMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3Vmlld0NoYWlySUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGkpO1xuICAgICAgICAgICAgdGhpcy5tX2NiUGxheVN0YXR1c1tpXSA9IGdhbWVTdGFydC5jYlBsYXlTdGF0dXNbaV07XG4gICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tpXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubV9sbEFsbFRhYmxlU2NvcmUgKz0gdGhpcy5tX2xDZWxsU2NvcmU7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW2ldID0gdGhpcy5tX2xDZWxsU2NvcmU7XG4gICAgICAgICAgICAgICAgLy/nlKjmiLfkuIvms6hcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyVGFibGVTY29yZSh3Vmlld0NoYWlySUQsIHRoaXMubV9sQ2VsbFNjb3JlKTtcbiAgICAgICAgICAgICAgICAvL+enu+WKqOetueeggVxuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnBsYXllckpldHRvbih3Vmlld0NoYWlySUQsIHRoaXMubV9sVGFibGVTY29yZVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy/mgLvorqHkuIvms6hcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0QWxsVGFibGVTY29yZSh0aGlzLm1fbGxBbGxUYWJsZVNjb3JlKTtcbiAgICAgICAgLy/lj5HniYxcbiAgICAgICAgdmFyIGRlbGF5Q291bnQgPSAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkdhbWVTdGFydF0gW3RoaXMubV93QmFua2VyVXNlcixqLHpqaF9jbWQuR0FNRV9QTEFZRVJdID0gXCIgKyBbdGhpcy5tX3dCYW5rZXJVc2VyLGosempoX2NtZC5HQU1FX1BMQVlFUl0pO1xuICAgICAgICAgICAgICAgIHZhciBjaGFpciA9ICh0aGlzLm1fd0JhbmtlclVzZXIgKyBqKSAlICh6amhfY21kLkdBTUVfUExBWUVSKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViR2FtZVN0YXJ0XSBjaGFpciA9IFwiICsgY2hhaXIpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW2NoYWlyXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZW5kQ2FyZCh0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGNoYWlyKSwgaSwgZGVsYXlDb3VudCAqIDAuMSk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGF5Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQUREX1NDT1JFLCB6amhfY21kLlRJTUVfVVNFUl9BRERfU0NPUkUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgPT09IHRoaXMuZ2V0TWVDaGFpcklEKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29udHJvbCgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIG9uU3ViQWRkU2NvcmU6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJBZGRTY29yZV1cIik7XG4gICAgICAgIC8v55So5oi35LiL5rOoXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19BZGRTY29yZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDdXJyZW50VXNlcjtcdFx0XHRcdFx0XHQvL+W9k+WJjeeUqOaIt1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3QWRkU2NvcmVVc2VyO1x0XHRcdFx0XHRcdC8v5Yqg5rOo55So5oi3XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb21wYXJlU3RhdGU7XHRcdFx0XHRcdFx0Ly/mr5TniYznirbmgIFcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEFkZFNjb3JlQ291bnQ7XHRcdFx0XHRcdFx0Ly/liqDms6jmlbDnm65cbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEN1cnJlbnRUaW1lcztcdFx0XHRcdFx0XHQvL+W9k+WJjeWAjeaVsFxuICAgICAgICAvLyAgICAgTE9ORyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbEN1cnJlbnRUdXJuOyAgICAgICAgICAgICAgICAgICAgICAgLy/lvZPliY3ova7mlbBcbiAgICAgICAgLy8gICAgIEJZVEUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiTGFzdEFkZFNjb3JlOyAgICAgICAgICAgICAgICAgICAgIC8v5piv5ZCm5a2k5rOo5LiA5o63XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBhZGRTY29yZSA9IHt9O1xuICAgICAgICBhZGRTY29yZS53Q3VycmVudFVzZXIgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICBhZGRTY29yZS53QWRkU2NvcmVVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgYWRkU2NvcmUud0NvbXBhcmVTdGF0ZSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGFkZFNjb3JlLmxBZGRTY29yZUNvdW50ID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBhZGRTY29yZS5sQ3VycmVudFRpbWVzID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBhZGRTY29yZS5sQ3VycmVudFR1cm4gPSBwRGF0YS5yZWFkaW50KCk7XG4gICAgICAgIGFkZFNjb3JlLmNiTGFzdEFkZFNjb3JlID0gcERhdGEucmVhZGJ5dGUoKTtcblxuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGFkZFNjb3JlLndBZGRTY29yZVVzZXIpO1xuXG4gICAgICAgIHRoaXMubV93Q3VycmVudFVzZXIgPSBhZGRTY29yZS53Q3VycmVudFVzZXI7XG4gICAgICAgIGlmICh0aGlzLm1fbEN1cnJlbnRUaW1lcyA8IGFkZFNjb3JlLmxDdXJyZW50VGltZXMpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuX2dhbWVWaWV3LnJ1bkFkZFRpbWVzQW5pbWF0ZSh2aWV3SUQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9sQ3VycmVudFRpbWVzID0gYWRkU2NvcmUubEN1cnJlbnRUaW1lcztcblxuICAgICAgICBpZiAoYWRkU2NvcmUud0FkZFNjb3JlVXNlciAhPT0gbXlDaGFpcikge1xuICAgICAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRkU2NvcmUud0FkZFNjb3JlVXNlciAhPT0gbXlDaGFpcikge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcucGxheWVySmV0dG9uKHZpZXdJRCwgYWRkU2NvcmUubEFkZFNjb3JlQ291bnQpO1xuICAgICAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW2FkZFNjb3JlLndBZGRTY29yZVVzZXJdICs9IGFkZFNjb3JlLmxBZGRTY29yZUNvdW50O1xuICAgICAgICAgICAgdGhpcy5tX2xsQWxsVGFibGVTY29yZSArPSBhZGRTY29yZS5sQWRkU2NvcmVDb3VudDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJUYWJsZVNjb3JlKHZpZXdJRCwgdGhpcy5tX2xUYWJsZVNjb3JlW2FkZFNjb3JlLndBZGRTY29yZVVzZXJdKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7IFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkZFNjb3JlLndDb21wYXJlU3RhdGUgPT09IDAgJiYgdGhpcy5tX3dDdXJyZW50VXNlciA9PT0gbXlDaGFpcikge1xuICAgICAgICAgICAgdGhpcy5tX2xDdXJyZW50VHVybiA9IGFkZFNjb3JlLmxDdXJyZW50VHVybjtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENlbGxUdXJuKHRoaXMubV9sQ2VsbFNjb3JlLCB0aGlzLm1fbEN1cnJlbnRUdXJuLCB0aGlzLm1fbE1heFR1cm5Db3VudCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1faXNGaXJzdEFkZCA9IGZhbHNlO1xuICAgICAgICAvL+iuvue9ruiuoeaXtuWZqFxuICAgICAgICBpZiAoYWRkU2NvcmUud0NvbXBhcmVTdGF0ZSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5tX3dDdXJyZW50VXNlciwgempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkUsIHpqaF9jbWQuVElNRV9VU0VSX0FERF9TQ09SRSk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25TdWJMb29rQ2FyZDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1Ykxvb2tDYXJkXVwiKTtcbiAgICAgICAgLy/nnIvniYzmlbDmja7ljIVcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0xvb2tDYXJkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0xvb2tDYXJkVXNlcjtcdFx0XHRcdFx0XHQvL+eci+eJjOeUqOaIt1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkNhcmREYXRhW01BWF9DT1VOVF07XHRcdFx0XHQvL+eUqOaIt+aJkeWFi1xuICAgICAgICAvLyAgICAgQllURSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2JMYXN0QWRkOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lraTms6jkuIDmjrdcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGxvb2tDYXJkID0ge307XG4gICAgICAgIGxvb2tDYXJkLndMb29rQ2FyZFVzZXIgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICBsb29rQ2FyZC5jYkNhcmREYXRhID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5NQVhfQ09VTlQ7IGkrKykge1xuICAgICAgICAgICAgbG9va0NhcmQuY2JDYXJkRGF0YVtpXSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbG9va0NhcmQuY2JMYXN0QWRkID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1Ykxvb2tDYXJkXSBsb29rQ2FyZCA9IFwiICsgSlNPTi5zdHJpbmdpZnkobG9va0NhcmQsIG51bGwsICcgJykpO1xuICAgICAgICB2YXIgdmlld0lEID0gdGhpcy5zd2l0Y2hWaWV3Q2hhaXJJRChsb29rQ2FyZC53TG9va0NhcmRVc2VyKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0TG9va0NhcmQodmlld0lELCB0cnVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1Ykxvb2tDYXJkXSBbbG9va0NhcmQud0xvb2tDYXJkVXNlcix0aGlzLmdldE1lQ2hhaXJJRCgpXSA9IFwiICsgW2xvb2tDYXJkLndMb29rQ2FyZFVzZXIsdGhpcy5nZXRNZUNoYWlySUQoKV0pO1xuICAgICAgICBpZiAobG9va0NhcmQud0xvb2tDYXJkVXNlciA9PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgICAgICB2YXIgY2FyZEluZGV4ID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjYXJkSW5kZXhbaV0gPSBsb29rQ2FyZC5jYkNhcmREYXRhW2ldOy8vR2FtZUxvZ2ljLmdldENhcmRDb2xvcihsb29rQ2FyZC5jYkNhcmREYXRhW2ldKSAqIDEzICsgR2FtZUxvZ2ljLmdldENhcmRWYWx1ZShsb29rQ2FyZC5jYkNhcmREYXRhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkKHZpZXdJRCwgY2FyZEluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJDb21wYXJlQ2FyZDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkNvbXBhcmVDYXJkXVwiKTtcbiAgICAgICAgLy/mr5TniYzmlbDmja7ljIVcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0NvbXBhcmVDYXJkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0N1cnJlbnRVc2VyO1x0XHRcdFx0XHRcdC8v5b2T5YmN55So5oi3XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb21wYXJlVXNlclsyXTtcdFx0XHRcdFx0Ly/mr5TniYznlKjmiLdcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0xvc3RVc2VyO1x0XHRcdFx0XHRcdFx0Ly/ovpPniYznlKjmiLdcbiAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjsgICAgICAgICAgICAgICAgICAgICAgIC8v5b2T5YmN6L2u5pWwXG4gICAgICAgIC8vICAgICBCWVRFICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYkxvc3RDYXJkRGF0YVtNQVhfQ09VTlRdOyAgICAgICAgICAvL+i+k+WutueJjOaVsOaNrlxuICAgICAgICAvLyB9O1xuICAgICAgICB2YXIgY29tcGFyZUNhcmQgPSB7fTtcbiAgICAgICAgY29tcGFyZUNhcmQud0N1cnJlbnRVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgY29tcGFyZUNhcmQud0NvbXBhcmVVc2VyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgICAgICBjb21wYXJlQ2FyZC53Q29tcGFyZVVzZXJbaV0gPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBhcmVDYXJkLndMb3N0VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGNvbXBhcmVDYXJkLmxDdXJyZW50VHVybiA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgY29tcGFyZUNhcmQuY2JMb3N0Q2FyZERhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICBjb21wYXJlQ2FyZC5jYkxvc3RDYXJkRGF0YVtpXSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1fd0N1cnJlbnRVc2VyID0gY29tcGFyZUNhcmQud0N1cnJlbnRVc2VyO1xuICAgICAgICB0aGlzLm1fbEN1cnJlbnRUdXJuID0gY29tcGFyZUNhcmQubEN1cnJlbnRUdXJuO1xuICAgICAgICB0aGlzLm1fd0xvc3RVc2VyID0gY29tcGFyZUNhcmQud0xvc3RVc2VyO1xuICAgICAgICB0aGlzLm1fd1dpbm5lclVzZXIgPSBjb21wYXJlQ2FyZC53Q29tcGFyZVVzZXJbMF0gKyBjb21wYXJlQ2FyZC53Q29tcGFyZVVzZXJbMV0gLSB0aGlzLm1fd0xvc3RVc2VyO1xuICAgICAgICB0aGlzLm1fY2JQbGF5U3RhdHVzW3RoaXMubV93TG9zdFVzZXJdID0gMDtcblxuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZChmYWxzZSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldENlbGxUdXJuKHRoaXMubV9sQ2VsbFNjb3JlLCB0aGlzLm1fbEN1cnJlbnRUdXJuLCB0aGlzLm1fbE1heFR1cm5Db3VudCk7XG4gICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGZpcnN0VXNlciA9IHRoaXMuX2dhbWVGcmFtZS5nZXRUYWJsZVVzZXJJdGVtKHRoaXMuX2dhbWVGcmFtZS5nZXRUYWJsZUlEKCksY29tcGFyZUNhcmQud0NvbXBhcmVVc2VyWzBdKTtcbiAgICAgICAgdmFyIHNlY29uZFVzZXIgPSB0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVVc2VySXRlbSh0aGlzLl9nYW1lRnJhbWUuZ2V0VGFibGVJRCgpLGNvbXBhcmVDYXJkLndDb21wYXJlVXNlclsxXSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LmNvbXBhcmVDYXJkKGZpcnN0VXNlciwgc2Vjb25kVXNlciwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbXBhcmVDYXJkLndDb21wYXJlVXNlclswXSA9PT0gdGhpcy5tX3dXaW5uZXJVc2VyLCBmdW5jdGlvbiBuYW1lKHBhcmFtcykge1xuICAgICAgICAgICAgc2VsZi5vbkZsdXNoQ2FyZEZpbmlzaCgpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25GbHVzaENhcmRGaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy90b2RvXG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnN0b3BDb21wYXJlQ2FyZCgpO1xuICAgICAgICB2YXIgY291bnQgPSB0aGlzLmdldFBsYXlpbmdOdW0oKTtcbiAgICAgICAgaWYgKGNvdW50ID4gMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgPT09IHRoaXMuZ2V0TWVDaGFpcklEKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRyb2woKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRHYW1lQ2xvY2sodGhpcy5tX3dDdXJyZW50VXNlciwgempoX2NtZC5JRElfVVNFUl9BRERfU0NPUkUsIHpqaF9jbWQuVElNRV9VU0VSX0FERF9TQ09SRSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tteUNoYWlyXSA9PT0gMSB8fCBteUNoYWlyID09PSB0aGlzLm1fd0xvc3RVc2VyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX0ZJTklTSF9GTEFTSCxkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJPcGVuQ2FyZDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1Yk9wZW5DYXJkXVwiKTtcbiAgICAgICAgLy/lvIDniYzmlbDmja7ljIVcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX09wZW5DYXJkXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1dpbm5lcjtcdFx0XHRcdFx0XHRcdC8v6IOc5Yip55So5oi3XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbbXlDaGFpcl0gPT09IDEgJiYgIXRoaXMubV9iTGFzdEFkZE92ZXIpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX0ZJTklTSF9GTEFTSCxkYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJHaXZlVXA6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHaXZlVXBdXCIpO1xuICAgICAgICAvL+eUqOaIt+aUvuW8g1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfR2l2ZVVwXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0dpdmVVcFVzZXI7XHRcdFx0XHRcdFx0Ly/mlL7lvIPnlKjmiLdcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHdHaXZlVXBVc2VyID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQod0dpdmVVcFVzZXIpO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyR2l2ZVVwKHZpZXdJRCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMubV9jYlBsYXlTdGF0dXNbd0dpdmVVcFVzZXJdID0gMDtcblxuICAgICAgICAvL+i2heaXtuacjeWKoeWZqOiHquWKqOaUvuW8g1xuICAgICAgICBpZiAod0dpdmVVcFVzZXIgPT09IHRoaXMuZ2V0TWVDaGFpcklEKCkpIHtcbiAgICAgICAgICAgIHRoaXMua2lsbEdhbWVDbG9jaygpO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc3RvcENvbXBhcmVDYXJkKCk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZChmYWxzZSx1bmRlZmluZWQpO1xuICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXdcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25TdWJQbGF5ZXJFeGl0OiBmdW5jdGlvbiAoc3ViLCBwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uU3ViUGxheWVyRXhpdF1cIik7XG4gICAgICAgIC8v55So5oi36YCA5Ye6XG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19QbGF5ZXJFeGl0XG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1BsYXllcklEO1x0XHRcdFx0XHRcdFx0Ly/pgIDlh7rnlKjmiLdcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIHdQbGF5ZXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHZhciB3Vmlld0NoYWlySUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHdQbGF5ZXJJRCk7XG4gICAgICAgIHRoaXMubV9jYlBsYXlTdGF0dXNbd1BsYXllcklEXSA9IDA7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3Lm1fTm9kZV9wbGF5ZXJbd1ZpZXdDaGFpcklEXS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uU3ViR2FtZUVuZDogZnVuY3Rpb24gKHN1YiwgcERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvblN1YkdhbWVFbmRdXCIpO1xuICAgICAgICAvL+a4uOaIj+e7k+adn1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX1NfR2FtZUVuZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxHYW1lVGF4O1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/nqI7mlLZcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEdhbWVTY29yZVtHQU1FX1BMQVlFUl07XHRcdFx0Ly/muLjmiI/lvpfliIZcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JDYXJkRGF0YVtHQU1FX1BMQVlFUl1bTUFYX0NPVU5UXTtcdC8v55So5oi35omR5YWLXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb21wYXJlVXNlcltHQU1FX1BMQVlFUl1bNF07XHRcdC8v5q+U54mM55So5oi3XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdFbmRTdGF0ZTtcdFx0XHRcdFx0XHRcdC8v57uT5p2f54q25oCBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB3aW5uZXIgO1xuICAgICAgICB2YXIgZ2FtZUVuZCA9IHt9O1xuICAgICAgICBnYW1lRW5kLmxHYW1lVGF4ID0gcERhdGEucmVhZGludCgpO1xuICAgICAgICBnYW1lRW5kLmxHYW1lU2NvcmUgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGdhbWVFbmQubEdhbWVTY29yZVtpXSA9IHBEYXRhLnJlYWRpbnQoKTtcbiAgICAgICAgICAgIGlmIChnYW1lRW5kLmxHYW1lU2NvcmVbaV0gPiAwKSB7XG4gICAgICAgICAgICAgICAgd2lubmVyID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnYW1lRW5kLmNiQ2FyZERhdGEgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGdhbWVFbmQuY2JDYXJkRGF0YVtpXSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB6amhfY21kLk1BWF9DT1VOVDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ2FtZUVuZC5jYkNhcmREYXRhW2ldW2pdID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnYW1lRW5kLndDb21wYXJlVXNlciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGkrKykge1xuICAgICAgICAgICAgZ2FtZUVuZC53Q29tcGFyZVVzZXJbaV0gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgZ2FtZUVuZC53Q29tcGFyZVVzZXJbaV1bal0gPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGdhbWVFbmQud0VuZFN0YXRlID0gcERhdGEucmVhZHdvcmQoKTtcblxuICAgICAgICB0aGlzLm1fYk9uR2FtZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgdmFyIG15Q2hhaXIgPSB0aGlzLmdldE1lQ2hhaXJJRCgpO1xuICAgICAgICAvL+a4heeQhueVjOmdolxuICAgICAgICB0aGlzLl9nYW1lVmlldy5zdG9wQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0Q29tcGFyZUNhcmQoZmFsc2UpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2dhbWVWaWV3Lm1fbm9kZUJvdHRvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b21baV07XG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIC4uLi4uLlxuICAgICAgICBcbiAgICAgICAgdmFyIGVuZFNob3c7XG4gICAgICAgIHZhciBzYXZlVHlwZSA9IFtdO1xuICAgICAgICAvL+enu+WKqOetueeggVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZpZXdJRCA9IHRoaXMuc3dpdGNoVmlld0NoYWlySUQoaSk7XG4gICAgICAgICAgICBpZiAoZ2FtZUVuZC5sR2FtZVNjb3JlW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGdhbWVFbmQubEdhbWVTY29yZVtpXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUodmlld0lELCBnYW1lRW5kLmxHYW1lU2NvcmVbaV0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy53aW5UaGVDaGlwKHZpZXdJRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyVGFibGVTY29yZSh2aWV3SUQsZ2FtZUVuZC5sR2FtZVNjb3JlW2ldKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbmRTaG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9nYW1lVmlldy5cbiAgICAgICAgICAgICAgICAvLy4uLi5cbiAgICAgICAgICAgICAgICAvLy4uLi4uXG4gICAgICAgICAgICAgICAgc2F2ZVR5cGVbaV0gPSBHYW1lTG9naWMuZ2V0Q2FyZFR5cGUoZ2FtZUVuZC5jYkNhcmREYXRhW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNhdmVUeXBlW2ldID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyVGFibGVTY29yZSh2aWV3SUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHZhciB3VXNlcklEID0gZ2FtZUVuZC53Q29tcGFyZVVzZXJbbXlDaGFpcl1baV07XG4gICAgICAgICAgICBpZiAod1VzZXJJRCAmJiB3VXNlcklEICE9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKHdVc2VySUQpO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSW5kZXggPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHpqaF9jbWQuTUFYX0NPVU5UOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZEluZGV4W2tdID0gZ2FtZUVuZC5jYkNhcmREYXRhW3dVc2VySURdW2tdOy8vR2FtZUxvZ2ljLmdldENhcmRDb2xvcihnYW1lRW5kLmNiQ2FyZERhdGFbd1VzZXJJRF1ba10pICogMTMgKyBHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGdhbWVFbmQuY2JDYXJkRGF0YVt3VXNlcklEXVtrXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkKHZpZXdJRCwgY2FyZEluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZFR5cGUodmlld0lELCBzYXZlVHlwZVt3VXNlcklEXSk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcgIC4uLi5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnYW1lRW5kLndDb21wYXJlVXNlcltteUNoYWlyXVswXSAhPT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIgfHwgdGhpcy5tX2JMb29rQ2FyZFtteUNoYWlyXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGNhcmRJbmRleCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB6amhfY21kLk1BWF9DT1VOVDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY2FyZEluZGV4W2tdID0gZ2FtZUVuZC5jYkNhcmREYXRhW215Q2hhaXJdW2tdOy8vR2FtZUxvZ2ljLmdldENhcmRDb2xvcihnYW1lRW5kLmNiQ2FyZERhdGFbbXlDaGFpcl1ba10pICogMTMgKyBHYW1lTG9naWMuZ2V0Q2FyZFZhbHVlKGdhbWVFbmQuY2JDYXJkRGF0YVtteUNoYWlyXVtrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB2YXIgbXlWaWV3SUQgXG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRVc2VyQ2FyZCh6amhfY21kLk1ZX1ZJRVdJRCwgY2FyZEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldFVzZXJDYXJkVHlwZSh6amhfY21kLk1ZX1ZJRVdJRCwgc2F2ZVR5cGVbbXlDaGFpcl0pO1xuICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcgIC4uLi5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnYW1lRW5kLndFbmRTdGF0ZSA9PSAxKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tX2NiUGxheVN0YXR1c1tteUNoYWlyXSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1fY2JQbGF5U3RhdHVzW2ldID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FyZEluZGV4ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHpqaF9jbWQuTUFYX0NPVU5UOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXJkSW5kZXhba10gPSBnYW1lRW5kLmNiQ2FyZERhdGFbaV1ba107Ly9HYW1lTG9naWMuZ2V0Q2FyZENvbG9yKGdhbWVFbmQuY2JDYXJkRGF0YVtpXVtrXSkgKiAxMyArIEdhbWVMb2dpYy5nZXRDYXJkVmFsdWUoZ2FtZUVuZC5jYkNhcmREYXRhW2ldW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2aWV3SUQgPSB0aGlzLnN3aXRjaFZpZXdDaGFpcklEKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckNhcmQodmlld0lELCBjYXJkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlckNhcmRUeXBlKHZpZXdJRCwgc2F2ZVR5cGVbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fZ2FtZVZpZXcgIC4uLi5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kU2hvdykge1xuICAgICAgICAgICAgLy8gLi4uXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmRlbGF5VGltZSgzLjApLGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYub25SZXNldEdhbWVFbmdpbmUoKTtcbiAgICAgICAgICAgIHNlbGYuX2dhbWVWaWV3Lm1fQnV0dG9uX3JlYWR5Lm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuc2V0R2FtZUNsb2NrKEdsb2JhbERlZi5JTlZBTElEX0NIQUlSLCB6amhfY21kLklESV9TVEFSVF9HQU1FLCB6amhfY21kLlRJTUVfU1RBUlRfR0FNRSk7XG4gICAgICAgICAgICBzZWxmLm1fY2JQbGF5U3RhdHVzID0gWzAsMCwwLDAsMF07XG4gICAgICAgIH0pKSlcbiAgICAgICAgXG5cbiAgICB9LFxuICAgIG9uU3ViV2FpdENvbXBhcmU6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJXYWl0Q29tcGFyZV1cIik7XG4gICAgICAgIC8v562J5b6F5q+U54mMXG4gICAgICAgIC8vIHN0cnVjdCBDTURfU19XYWl0Q29tcGFyZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDb21wYXJlVXNlcjtcdFx0XHRcdFx0XHQvL+avlOeJjOeUqOaIt1xuICAgICAgICAvLyB9OyBcbiAgICAgICAgdmFyIHdDb21wYXJlVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGlmICh3Q29tcGFyZVVzZXIgIT09IHRoaXMubV93Q3VycmVudFVzZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJXYWl0Q29tcGFyZV0gd0NvbXBhcmVVc2VyICE9IG1fd0N1cnJlbnRVc2VyXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyICE9PSB0aGlzLmdldE1lQ2hhaXJJRCgpKSB7XG4gICAgICAgIC8vICAgICB0aGlzLnNldEdhbWVDbG9jayh0aGlzLm1fd0N1cnJlbnRVc2VyLCB6amhfY21kLklESV9ESVNBQkxFLCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBvblN1Ykxhc3RBZGQ6IGZ1bmN0aW9uIChzdWIsIHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJMYXN0QWRkXVwiKTtcbiAgICAgICAgLy/lraTms6jkuIDmjrdcbiAgICAgICAgLy8gc3RydWN0IENNRF9TX0xhc3RBZGRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd1N0YXJ0TGFzdEFkZFVzZXI7XG4gICAgICAgIC8vICAgICBXT1JEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3Q29tcGFyZVVzZXJbR0FNRV9QTEFZRVJdO1xuICAgICAgICAvLyAgICAgV09SRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd0xvc3RVc2VyW0dBTUVfUExBWUVSXTtcbiAgICAgICAgLy8gICAgIFdPUkQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdDdXJyZW50VXNlcjtcbiAgICAgICAgLy8gICAgIExPTkcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxDdXJyZW50VHVybjtcbiAgICAgICAgLy8gfTtcbiAgICAgICAgdmFyIGxhc3RBZGQgPSB7fTtcbiAgICAgICAgbGFzdEFkZC53U3RhcnRMYXN0QWRkVXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGxhc3RBZGQud0NvbXBhcmVVc2VyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICBsYXN0QWRkLndDb21wYXJlVXNlcltpXSA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdEFkZC53TG9zdFVzZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGxhc3RBZGQud0xvc3RVc2VyW2ldID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0QWRkLndDdXJyZW50VXNlciA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIGxhc3RBZGQubEN1cnJlbnRUdXJuID0gcERhdGEucmVhZGludCgpO1xuXG4gICAgICAgIHRoaXMubV9sQ3VycmVudFR1cm4gPSBsYXN0QWRkLmxDdXJyZW50VHVybjtcblxuICAgIH0sXG4gICAgLy8gb25DbGlja01lbnVPcGVuOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgLy8gICAgIHRoaXMubV9QYW5lbF9tZW51LmFjdGl2ZSA9IHRvZ2dsZS5pc0NoZWNrZWQ7XG4gICAgLy8gICAgIC8vIHRvZ2dsZS5ub2RlLnNldExvY2FsWk9yZGVyKDIpO1xuICAgIC8vICAgICAvLyB0aGlzLm1fUGFuZWxfbWVudS5zZXRMb2NhbFpPcmRlcigxKTtcbiAgICAvLyB9LFxuICAgIG9uQ2xpY2tDaGFuZ2VUYWJsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUuc2VuZFNpdERvd25QYWNrZXQoR2xvYmFsRGVmLklOVkFMSURfVEFCTEUsR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpXG4gICAgfSxcbiAgICBvbkNsaWNrUXVpdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLl9nYW1lRnJhbWUuc2VuZFN0YW5kdXBQYWNrZXQoKTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiUGxhemFTY2VuZVwiKTtcbiAgICB9LFxuICAgIC8vIHNlbmREYXRhIDogZnVuY3Rpb24gKHN1YiwgZGF0YUJ1Zikge1xuICAgIC8vICAgICBpZiAodGhpcy5fZ2FtZUZyYW1lKSB7XG4gICAgLy8gICAgICAgICBkYXRhQnVmLnNldGNtZGluZm8oR2xvYmFsRGVmLk1ETV9HRl9HQU1FLCBzdWIpO1xuICAgIC8vICAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLnNlbmRTb2NrZXREYXRhKGRhdGFCdWYpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSxcbiAgICAvL+WKoOazqFxuICAgIG9uU2VuZEFkZFNjb3JlOiBmdW5jdGlvbiAobEN1cnJlbnRTY29yZSxiQ29tcGFyZUNhcmQpIHtcbiAgICAgICAgLy/nlKjmiLfliqDms6hcbiAgICAgICAgLy8gc3RydWN0IENNRF9DX0FkZFNjb3JlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFNjb3JlO1x0XHRcdFx0XHRcdFx0XHQvL+WKoOazqOaVsOebrlxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U3RhdGU7XHRcdFx0XHRcdFx0XHRcdC8v5b2T5YmN54q25oCBXG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBkYXRhQnVmLnB1c2hpbnQobEN1cnJlbnRTY29yZSk7XG4gICAgICAgIGRhdGFCdWYucHVzaHdvcmQoYkNvbXBhcmVDYXJkICYmIDEgfHwgMCk7XG4gICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19BRERfU0NPUkUsZGF0YUJ1Zik7XG4gICAgfSxcbiAgICAvL+WPkemAgeWHhuWkh1xuICAgIG9uU3RhcnRHYW1lOiBmdW5jdGlvbiAoYlJlYWR5KSB7XG4gICAgICAgIHRoaXMub25SZXNldEdhbWVFbmdpbmUoKTtcbiAgICAgICAgaWYgKGJSZWFkeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZW5kVXNlclJlYWR5KCk7XG4gICAgICAgIH0gIFxuICAgIH0sXG4gICAgLy/oh6rliqjmr5TniYxcbiAgICBvbkF1dG9Db21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hhaXIgPSBteUNoYWlyIC0gaTtcbiAgICAgICAgICAgIGlmIChjaGFpciA8IDApIHtcbiAgICAgICAgICAgICAgICBjaGFpciArPSB6amhfY21kLkdBTUVfUExBWUVSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbY2hhaXJdID09IDEpIHtcbiAgICAgICAgICAgICAgICAvL+WPkemAgeavlOeJjOa2iOaBr1xuICAgICAgICAgICAgICAgIC8v5q+U54mM5pWw5o2u5YyFXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IENNRF9DX0NvbXBhcmVDYXJkXG4gICAgICAgICAgICAgICAgLy8ge1x0XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NvbXBhcmVVc2VyO1x0XHRcdFx0XHRcdC8v5q+U54mM55So5oi3XG4gICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhQnVmLnB1c2h3b3JkKGNoYWlyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmREYXRhKHpqaF9jbWQuU1VCX0NfQ09NUEFSRV9DQVJELGRhdGFCdWYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ICBcbiAgICB9LFxuICAgIC8v5q+U54mM5pON5L2cXG4gICAgb25Db21wYXJlQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGlmIChteUNoYWlyID09PSB1bmRlZmluZWQgfHwgbXlDaGFpciAhPT0gdGhpcy5tX3dDdXJyZW50VXNlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBsYXllckNvdW50ID0gdGhpcy5nZXRQbGF5aW5nTnVtKCk7XG5cbiAgICAgICAgaWYgKHBsYXllckNvdW50IDwgMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG5cbiAgICAgICAgdmFyIHNjb3JlID0gdGhpcy5tX2xDdXJyZW50VGltZXMgKiB0aGlzLm1fbENlbGxTY29yZSAqICh0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdICYmIDQgfHwgMik7XG5cbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW215Q2hhaXJdICs9IHNjb3JlO1xuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlICs9IHNjb3JlO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24oempoX2NtZC5NWV9WSUVXSUQsIHNjb3JlKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUoempoX2NtZC5NWV9WSUVXSUQsIHRoaXMubV9sVGFibGVTY29yZVtteUNoYWlyXSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG5cbiAgICAgICAgdGhpcy5vblNlbmRBZGRTY29yZShzY29yZSwgdHJ1ZSk7Ly/lj5HpgIHkuIvms6jmtojmga9cblxuICAgICAgICB2YXIgYkF1dG9Db21wYXJlID0gKHRoaXMuZ2V0UGxheWluZ051bSgpID09PSAyKTtcbiAgICAgICAgaWYgKCFiQXV0b0NvbXBhcmUpIHtcbiAgICAgICAgICAgIGJBdXRvQ29tcGFyZSA9ICh0aGlzLm1fd0JhbmtlclVzZXIgPT09IG15Q2hhaXIpICYmICh0aGlzLm1fbFRhYmxlU2NvcmVbbXlDaGFpcl0gLSBzY29yZSkgPT09IHRoaXMubV9sQ2VsbFNjb3JlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiQXV0b0NvbXBhcmUpIHtcbiAgICAgICAgICAgIHRoaXMub25BdXRvQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjb21wYXJlU3RhdHVzID0gW2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEgJiYgaSAhPT0gbXlDaGFpcikge1xuICAgICAgICAgICAgICAgICAgICBjb21wYXJlU3RhdHVzW3RoaXMuc3dpdGNoVmlld0NoYWlySUQoaSldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZCh0cnVlLGNvbXBhcmVTdGF0dXMpO1xuICAgICAgICAgICAgLy8gLy/lj5HpgIHnrYnlvoXmr5TniYzmtojmga9cbiAgICAgICAgICAgIC8vIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAgICAgLy8gdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX1dBSVRfQ09NUEFSRSxkYXRhQnVmKTtcbiAgICAgICAgICAgIC8vIHRoaXMuc2V0R2FtZUNsb2NrKHRoaXMubV93Q3VycmVudFVzZXIsIHpqaF9jbWQuSURJX1VTRVJfQ09NUEFSRV9DQVJELCB6amhfY21kLlRJTUVfVVNFUl9DT01QQVJFX0NBUkQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNvbXBhcmVDaG9vc2U6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoIWluZGV4IHx8IGluZGV4ID09PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVtvbkNvbXBhcmVDaG9vc2VdIGluZGV4IGVycm9yXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25Db21wYXJlQ2hvb3NlXSBub3QgbV93Q3VycmVudFVzZXIgKG1fd0N1cnJlbnRVc2VyID0gXCIgKyB0aGlzLm1fd0N1cnJlbnRVc2VyICsgXCIgbXljaGFpciA9IFwiICsgbXlDaGFpcik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLkdBTUVfUExBWUVSOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpICE9PSBteUNoYWlyICYmIHRoaXMubV9jYlBsYXlTdGF0dXNbaV0gPT09IDEgJiYgaW5kZXggPT09IHRoaXMuc3dpdGNoVmlld0NoYWlySUQoaSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5zZXRDb21wYXJlQ2FyZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5raWxsR2FtZUNsb2NrKCk7XG4gICAgICAgICAgICAgICAgLy/lj5HpgIHmr5TniYzmtojmga9cbiAgICAgICAgICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICBkYXRhQnVmLnB1c2h3b3JkKGkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZERhdGEoempoX2NtZC5TVUJfQ19DT01QQVJFX0NBUkQsZGF0YUJ1Zik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/mlL7lvIPmk43kvZxcbiAgICBvbkdpdmVVcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvL+WIoOmZpOiuoeaXtuWZqFxuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgLy/pmpDol4/mk43kvZzmjInpkq5cbiAgICAgICAgLy90aGlzLl9nYW1lVmlldyAuLi4uXG4gICAgICAgIC8v5Y+R6YCB5pWw5o2uXG4gICAgICAgIHZhciBkYXRhQnVmID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICB0aGlzLnNlbmREYXRhKHpqaF9jbWQuU1VCX0NfR0lWRV9VUCwgZGF0YUJ1Zik7XG4gICAgfSxcblxuICAgIC8v5o2i5L2N5pON5L2cXG4gICAgb25DaGFuZ2VEZXNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2dhbWVGcmFtZS5zZW5kU2l0RG93blBhY2tldChHbG9iYWxEZWYuSU5WQUxJRF9UQUJMRSxHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikgXG4gICAgfSxcblxuICAgIC8v55yL54mM5pON5L2cXG4gICAgb25Mb29rQ2FyZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbXlDaGFpciA9IHRoaXMuZ2V0TWVDaGFpcklEKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25Mb29rQ2FyZF0gdHlwZVtteUNoYWlyLHRoaXMubV93Q3VycmVudFVzZXJdID0gXCIgKyBbdHlwZW9mKG15Q2hhaXIpLHR5cGVvZih0aGlzLm1fd0N1cnJlbnRVc2VyKV0pO1xuICAgICAgICBpZiAobXlDaGFpciA9PT0gdW5kZWZpbmVkfHwgbXlDaGFpciA9PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1fd0N1cnJlbnRVc2VyICE9IG15Q2hhaXIpIFxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX2JMb29rQ2FyZFtteUNoYWlyXSA9IHRydWU7XG4gICAgICAgIC8vIC4uLi5cbiAgICAgICAgLy8gLi4uLlxuICAgICAgICAvL+WPkemAgea2iOaBr1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lU2NlbmVdW29uTG9va0NhcmRdIHNlbmREYXRhXCIpO1xuICAgICAgICB2YXIgZGF0YUJ1ZiA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5zZW5kRGF0YSh6amhfY21kLlNVQl9DX0xPT0tfQ0FSRCwgZGF0YUJ1Zik7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy/kuIvms6jmk43kvZxcbiAgICBhZGRTY29yZTogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKHRoaXMubV93Q3VycmVudFVzZXIgIT09IG15Q2hhaXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtpbGxHYW1lQ2xvY2soKTtcbiAgICAgICAgLy/muIXnkIbnlYzpnaJcbiAgICAgICAgLy/lupXpg6jmjInpkq5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fZ2FtZVZpZXcubV9ub2RlQm90dG9tW2ldO1xuICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLy4uLi5cblxuICAgICAgICAvL+S4i+azqOmHkeminVxuICAgICAgICB2YXIgYXJyYXkgPSBbdGhpcy5tX2xDdXJyZW50VGltZXMsMyw2LDEwXTtcbiAgICAgICAgdmFyIHNjb3JlSW5kZXggPSAoIWluZGV4ICYmIDAgfHwgaW5kZXgpO1xuICAgICAgICB2YXIgYWRkU2NvcmUgPSB0aGlzLm1fbENlbGxTY29yZSAqIChhcnJheVtzY29yZUluZGV4XSB8fCB0aGlzLm1fbEN1cnJlbnRUaW1lcyk7XG5cbiAgICAgICAgLy/nnIvniYzliqDlgI1cbiAgICAgICAgaWYgKHRoaXMubV9iTG9va0NhcmRbbXlDaGFpcl0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGFkZFNjb3JlID0gYWRkU2NvcmUgKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tX2xUYWJsZVNjb3JlW215Q2hhaXJdICs9IGFkZFNjb3JlO1xuICAgICAgICB0aGlzLm1fbGxBbGxUYWJsZVNjb3JlICs9IGFkZFNjb3JlO1xuICAgICAgICB0aGlzLl9nYW1lVmlldy5wbGF5ZXJKZXR0b24oempoX2NtZC5NWV9WSUVXSUQsIGFkZFNjb3JlKTtcbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcuc2V0VXNlclRhYmxlU2NvcmUoempoX2NtZC5NWV9WSUVXSUQsIHRoaXMubV9sVGFibGVTY29yZVtteUNoYWlyXSk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3LnNldEFsbFRhYmxlU2NvcmUodGhpcy5tX2xsQWxsVGFibGVTY29yZSk7XG5cbiAgICAgICAgLy/lj5HpgIHmlbDmja5cbiAgICAgICAgdGhpcy5vblNlbmRBZGRTY29yZShhZGRTY29yZSwgZmFsc2UpO1xuICAgIH0sXG4gICAgLy/mm7TmlrDmjInpkq7mjqfliLZcbiAgICB1cGRhdGVDb250cm9sOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBteUNoYWlyID0gdGhpcy5nZXRNZUNoYWlySUQoKTtcbiAgICAgICAgaWYgKG15Q2hhaXIgPT09IHVuZGVmaW5lZCB8fCBteUNoYWlyID09PSBHbG9iYWxEZWYuSU5WQUxJRF9DSEFJUikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVNjZW5lXVt1cGRhdGVDb250cm9sXSBteWNoYWlyIGlzIGludmFsaWQgXCIgKyBteUNoYWlyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2dhbWVWaWV3Lm1fbm9kZUJvdHRvbS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9nYW1lVmlldy5tX25vZGVCb3R0b21baV07XG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL+eci+eJjOaMiemSrlxuICAgICAgICBpZiAoISB0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdKSB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lVmlldy5tX0J1dHRvbl9sb29rQ2FyZC5pbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZVZpZXcubV9CdXR0b25fbG9va0NhcmQuaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2FtZVZpZXcubV9CdXR0b25fZ2l2ZVVwLmludGVyYWN0YWJsZSA9IHRydWU7XG5cbiAgICAgICAgLy/ot5/ms6jmjInpkq5cbiAgICAgICAgdmFyIG1heEFkZFNjb3JlID0gdGhpcy5tX2xVc2VyTWF4U2NvcmUgLSB0aGlzLm1fbFRhYmxlU2NvcmVbbXlDaGFpcl07XG4gICAgICAgIC8v5piv5ZCm56ys5LiA5qyh5LiL5rOoXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuX2dhbWVWaWV3Lm1fbm9kZUJvdHRvbVsxXS5jaGlsZHJlbjtcbiAgICAgICAgdmFyIHRleHRMYWJlbCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIGlmICh0aGlzLm1faXNGaXJzdEFkZCkge1xuICAgICAgICAgICAgdGV4dExhYmVsLnN0cmluZyA9IFwi5LiL5rOoXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0ZXh0TGFiZWwuc3RyaW5nID0gXCLot5/ms6hcIjtcbiAgICAgICAgfVxuICAgICAgICAvL+abtOaWsOavlOeJjOaMiemSruWIhuaVsFxuICAgICAgICB2YXIgY29tcGFyZVNjb3JlID0gdGhpcy5tX2xDZWxsU2NvcmUgKiB0aGlzLm1fbEN1cnJlbnRUaW1lcyAqICh0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdICYmIDQgfHwgMik7XG4gICAgICAgIHZhciBiTGFzdEFkZCA9IGZhbHNlO1xuICAgICAgICBpZiAobWF4QWRkU2NvcmUgPD0gY29tcGFyZVNjb3JlKSB7XG4gICAgICAgICAgICBiTGFzdEFkZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGRyZW5bNF0uZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbikuYWN0aXZlID0gYkxhc3RBZGQ7XG5cbiAgICAgICAgdmFyIGJDb21wYXJlID0gKHRoaXMubV9sQ3VycmVudFR1cm4gPj0gMSkgJiYgKCFiTGFzdEFkZCk7XG4gICAgICAgIHRoaXMuX2dhbWVWaWV3Lm1fQnV0dG9uX2NvbXBhcmVDYXJkLmludGVyYWN0YWJsZSA9IGJDb21wYXJlO1xuICAgICAgICB2YXIgY29tcGFyZUxhYmVsID0gdGhpcy5fZ2FtZVZpZXcubV9CdXR0b25fY29tcGFyZUNhcmQubm9kZS5jaGlsZHJlblswXS5nZXRDb21wb25lbnQoY2MuTGFiZWwpOyAgICAgICAgXG4gICAgICAgIGNvbXBhcmVMYWJlbC5ub2RlLmFjdGl2ZSA9IGJDb21wYXJlO1xuICAgICAgICBjb21wYXJlTGFiZWwuc3RyaW5nID0gY29tcGFyZVNjb3JlO1xuXG4gICAgICAgIHZhciBhcnJheSA9IFt0aGlzLm1fbEN1cnJlbnRUaW1lcywzLDYsMTBdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGFycmF5W2ldO1xuICAgICAgICAgICAgdmFyIGJIaWRlID0gIWJMYXN0QWRkICYmICggaSA9PT0gMCB8fCBlbGVtZW50ID4gdGhpcy5tX2xDdXJyZW50VGltZXMpO1xuICAgICAgICAgICAgdmFyIGxTY29yZSA9IGVsZW1lbnQgKiB0aGlzLm1fbENlbGxTY29yZSAqICh0aGlzLm1fYkxvb2tDYXJkW215Q2hhaXJdICYmIDIgfHwgMSk7XG4gICAgICAgICAgICB2YXIgc2NvcmVMYWJlbCA9IGNoaWxkcmVuW2ldLmNoaWxkcmVuWzFdLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgICAgICBzY29yZUxhYmVsLnN0cmluZyA9IGxTY29yZTtcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldLmdldENvbXBvbmVudChjYy5CdXR0b24pLmludGVyYWN0YWJsZSA9IGJIaWRlO1xuICAgICAgICAgICAgaWYgKG1heEFkZFNjb3JlIDwgbFNjb3JlKSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5baV0uZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbikuaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIC8v55So5oi35q+U54mMXG4gICAgLy8gb25TdWJDb21wYXJlQ2FyZDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBcbiAgICAvLyB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHYW1lU2VydmVySXRlbSA9IGNjLkNsYXNzKHtcbiAgICB3U29ydElEOiB1bmRlZmluZWQsXG4gICAgd0tpbmRJRDogdW5kZWZpbmVkLFxuICAgIHdTZXJ2ZXJJRDogdW5kZWZpbmVkLFxuICAgIHdTdGF0aW9uSUQ6IHVuZGVmaW5lZCxcbiAgICB3U2VydmVyUG9ydDogdW5kZWZpbmVkLFxuICAgIGR3U2VydmVyQWRkcjogdW5kZWZpbmVkLFxuICAgIGR3T25MaW5lQ291bnQ6IHVuZGVmaW5lZCxcbiAgICBzelNlcnZlck5hbWU6IHVuZGVmaW5lZCxcbiAgICBjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCI9PT09PSogR2FtZVNlcnZlckl0ZW0gY3RvciAgKj09PT09XCIpXG4gICAgICAgIHRoaXMud1NvcnRJRCA9IDA7XG4gICAgICAgIHRoaXMud0tpbmRJRCA9IDA7XG4gICAgICAgIHRoaXMud1NlcnZlcklEID0gMDtcbiAgICAgICAgdGhpcy53U3RhdGlvbklEID0gMDtcbiAgICAgICAgdGhpcy53U2VydmVyUG9ydCA9IDA7XG4gICAgICAgIHRoaXMuZHdTZXJ2ZXJBZGRyID0gMDtcbiAgICAgICAgdGhpcy5kd09uTGluZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5zelNlcnZlck5hbWUgPSBcIlwiO1xuICAgIH0sXG4gICAgb25Jbml0OiBmdW5jdGlvbihwRGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09KiBHYW1lU2VydmVySXRlbSBvbkluaXQgICo9PT09PVwiKVxuICAgICAgICB0aGlzLndTb3J0SUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndLaW5kSUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndTZXJ2ZXJJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud1N0YXRpb25JRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMud1NlcnZlclBvcnQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLmR3U2VydmVyQWRkciA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmR3T25MaW5lQ291bnQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5zelNlcnZlck5hbWUgPSBwRGF0YS5yZWFkc3RyaW5nKDMyKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJsZW4gPSBcIitwRGF0YS5nZXREYXRhU2l6ZSgpKTtcbiAgICAgICAgd2hpbGUodHJ1ZSl7XG4gICAgICAgICAgICAvL+m7mOiupOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTlVMTFx0XHRcdFx0XHQwXHRcdFx0XHRcdFx0XHRcdC8v5peg5pWI5pWw5o2uXG4gICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9MRVZFTFx0XHQzMDAwXHRcdFx0XHRcdFx0XHQvL+aIv+mXtOetiee6p1xuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9DRUxMXHRcdDMwMDFcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05bqV5YiGXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9MT0dPTl9NQl9ST09NX01JTlNDT1JFXHQzMDAyXHRcdFx0XHRcdFx0XHQvL+aIv+mXtOacgOWwj+WIhuaVsFxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfRERaX0JPTUJfTUFYXHQzMDAzXHRcdFx0XHRcdFx0XHQvL+aWl+WcsOS4u+acgOWkp+WAjeaVsFxuICAgICAgICAgICAgLy8gI2RlZmluZSBEVFBfTE9HT05fTUJfUk9PTV9JTkZPXHRcdDMwMDRcdFx0XHRcdFx0XHRcdC8v5oi/6Ze05L+h5oGvXG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgdmFyIGRhdGFTaXplID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgZGF0YURlc2NyaWJlID0gcERhdGEucmVhZHdvcmQodHJ1ZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNpemUgPSBcIitkYXRhU2l6ZStcIiBkZXNjcmliZSA9IFwiK2RhdGFEZXNjcmliZSk7XG4gICAgICAgICAgICBpZiAoZGF0YURlc2NyaWJlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBwRGF0YS5zZXRtYXhzaXplKDEpO1xuICAgICAgICAgICAgc3dpdGNoKGRhdGFEZXNjcmliZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDAwOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNiUm9vbUxldmVsID0gcERhdGEucmVhZGJ5dGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzAwMTpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sQmFzZVNjb3JlID0gcERhdGEucmVhZGludCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDAyOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxMaW1pdFNjb3JlID0gcERhdGEucmVhZGludCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzMDAzOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxNYXhCb21iTGltaXQgPSBwRGF0YS5yZWFkaW50KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMDQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3pEZXNjcmliZVR4dCA9IHBEYXRhLnJlYWRzdHJpbmcoZGF0YVNpemUsdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTZXJ2ZXJJdGVtO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdhbWVVc2VySXRlbSA9IGNjLkNsYXNzKHtcbiAgICAvL+eUqOaIt+S/oeaBr+e7k+aehFxuICAgIC8vIHN0cnVjdCB0YWdVc2VyRGF0YVxuICAgIC8vIHtcbiAgICAvLyAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RmFjZUlEO1x0XHRcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdDdXN0b21GYWNlVmVyO1x0XHRcdFx0XHQvL+S4iuS8oOWktOWDj1xuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dyb3VwSUQ7XHRcdFx0XHRcdFx0XHQvL+ekvuWboue0ouW8lVxuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dhbWVJRDtcdFx0XHRcdFx0XHRcdC8v55So5oi3IEkgRFxuICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJSaWdodDtcdFx0XHRcdFx0XHQvL+eUqOaIt+etiee6p1xuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3ZlbGluZXNzO1x0XHRcdFx0XHRcdC8v55So5oi36a2F5YqbXG4gICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3TWFzdGVyUmlnaHQ7XHRcdFx0XHRcdFx0Ly/nrqHnkIbmnYPpmZBcbiAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pOYW1lWzMyXTtcdFx0XHRcdFx0Ly/nlKjmiLflkI3lrZdcbiAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pHcm91cE5hbWVbMzJdO1x0XHRcdFx0Ly/npL7lm6LlkI3lrZdcbiAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pVbmRlcldyaXRlWzMyXTtcdFx0Ly/kuKrmgKfnrb7lkI1cbiAgICAgICAgXG4gICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JHZW5kZXI7XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiTWVtYmVyT3JkZXI7XHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1hc3Rlck9yZGVyO1x0XHRcdFx0XHRcdC8v566h55CG562J57qnXG4gICAgICAgIFxuICAgIC8vICAgICAvL+eUqOaIt+enr+WIhlxuICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEluc3VyZVNjb3JlO1x0XHRcdFx0XHRcdC8v5raI6LS56YeR5biBXG4gICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bFNjb3JlO1x0XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+WIhuaVsFxuICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxXaW5Db3VudDtcdFx0XHRcdFx0XHRcdC8v6IOc5Yip55uY5pWwXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvc3RDb3VudDtcdFx0XHRcdFx0XHRcdC8v5aSx6LSl55uY5pWwXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bERyYXdDb3VudDtcdFx0XHRcdFx0XHRcdC8v5ZKM5bGA55uY5pWwXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEZsZWVDb3VudDtcdFx0XHRcdFx0XHRcdC8v5pat57q/5pWw55uuXG4gICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEV4cGVyaWVuY2U7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICAgICAgXG4gICAgLy8gICAgIC8v55So5oi354q25oCBXG4gICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1RhYmxlSUQ7XHRcdFx0XHRcdFx0XHQvL+ahjOWtkOWPt+eggVxuICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdDaGFpcklEO1x0XHRcdFx0XHRcdFx0Ly/mpIXlrZDkvY3nva5cbiAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlVzZXJTdGF0dXM7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnirbmgIFcbiAgICAgICAgXG4gICAgLy8gICAgIC8v5YW25LuW5L+h5oGvXG4gICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JDb21wYW5pb247XHRcdFx0XHRcdFx0Ly/nlKjmiLflhbPns7tcbiAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdQcm9wUmVzaWR1YWxUaW1lWzE1XTtcdC8v6YGT5YW35pe26Ze0XG4gICAgLy8gfTtcbiAgICAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICB3RmFjZUlEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpLTlg4/ntKLlvJVcbiAgICBkd0N1c3RvbUZhY2VWZXI6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgLy/kuIrkvKDlpLTlg49cbiAgICBkd1VzZXJJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLcgSSBEXG4gICAgZHdHcm91cElEOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56S+5Zui57Si5byVXG4gICAgZHdHYW1lSUQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3IEkgRFxuICAgIGR3VXNlclJpZ2h0OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+etiee6p1xuICAgIGxMb3ZlbGluZXNzOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+mtheWKm1xuICAgIGR3TWFzdGVyUmlnaHQ6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuadg+mZkFxuICAgIHN6TmFtZTp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgIC8v55So5oi35ZCN5a2XXG4gICAgc3pHcm91cE5hbWU6dW5kZWZpbmVkLCAgICAgICAgICAgICAvL+ekvuWbouWQjeWtl1xuICAgIHN6VW5kZXJXcml0ZTp1bmRlZmluZWQsICAgICAgLy/kuKrmgKfnrb7lkI1cbiAgICBcbiAgICAvL+eUqOaIt+WxnuaAp1xuICAgIGNiR2VuZGVyOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuICAgIGNiTWVtYmVyT3JkZXI6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+S8muWRmOetiee6p1xuICAgIGNiTWFzdGVyT3JkZXI6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuetiee6p1xuICAgIFxuICAgIC8v55So5oi356ev5YiGXG4gICAgbEluc3VyZVNjb3JlOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgIC8v5raI6LS56YeR5biBXG4gICAgbEdhbWVHb2xkOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP6YeR5biBXG4gICAgbFNjb3JlOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWwXG4gICAgbFdpbkNvdW50OnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6IOc5Yip55uY5pWwXG4gICAgbExvc3RDb3VudDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSx6LSl55uY5pWwXG4gICAgbERyYXdDb3VudDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZKM5bGA55uY5pWwXG4gICAgbEZsZWVDb3VudDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pat57q/5pWw55uuXG4gICAgbEV4cGVyaWVuY2U6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi357uP6aqMXG4gICAgXG4gICAgLy/nlKjmiLfnirbmgIFcbiAgICB3VGFibGVJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbiAgICB3Q2hhaXJJRDp1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mpIXlrZDkvY3nva5cbiAgICBjYlVzZXJTdGF0dXM6dW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfnirbmgIFcbiAgICBcbiAgICAvLyAvL+WFtuS7luS/oeaBr1xuICAgIC8vIGNiQ29tcGFuaW9uOnVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+WFs+ezu1xuICAgIC8vIGR3UHJvcFJlc2lkdWFsVGltZTp1bmRlZmluZWQsIC8v6YGT5YW35pe26Ze0XG4gICAgaW5pdERhdGFCeVVzZXJJbmZvSGVhZDogZnVuY3Rpb24gKHBEYXRhKSB7XG4gICAgICAgIHZhciB1c2VySW5mb0hlYWQgPSB0aGlzLnJlYWRVc2VySW5mb0hlYWQocERhdGEpO1xuICAgICAgICB0aGlzLmR3VXNlcklEID0gdXNlckluZm9IZWFkLmR3VXNlcklEO1xuICAgICAgICB0aGlzLndUYWJsZUlEID0gdXNlckluZm9IZWFkLndUYWJsZUlEO1xuICAgICAgICB0aGlzLndDaGFpcklEID0gdXNlckluZm9IZWFkLndDaGFpcklEO1xuICAgICAgICB0aGlzLmNiVXNlclN0YXR1cyA9IHVzZXJJbmZvSGVhZC5jYlVzZXJTdGF0dXM7XG4gICAgICAgIHRoaXMuZHdVc2VyUmlnaHQgPSB1c2VySW5mb0hlYWQuZHdVc2VyUmlnaHQ7XG4gICAgICAgIHRoaXMuZHdNYXN0ZXJSaWdodCA9IHVzZXJJbmZvSGVhZC5kd01hc3RlclJpZ2h0O1xuICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLndGYWNlSUQgPSB1c2VySW5mb0hlYWQud0ZhY2VJRDtcbiAgICAgICAgICAgIHRoaXMuZHdDdXN0b21GYWNlVmVyID0gdXNlckluZm9IZWFkLmR3Q3VzdG9tRmFjZVZlcjtcbiAgICAgICAgICAgIHRoaXMuY2JHZW5kZXIgPSB1c2VySW5mb0hlYWQuY2JHZW5kZXI7XG4gICAgICAgICAgICB0aGlzLmNiTWVtYmVyT3JkZXIgPSB1c2VySW5mb0hlYWQuY2JNZW1iZXJPcmRlcjtcbiAgICAgICAgICAgIHRoaXMuY2JNYXN0ZXJPcmRlciA9IHVzZXJJbmZvSGVhZC5jYk1hc3Rlck9yZGVyO1xuICAgICAgICAgICAgdGhpcy5kd0dhbWVJRCA9IHVzZXJJbmZvSGVhZC5kd0dhbWVJRDtcbiAgICAgICAgICAgIHRoaXMuZHdHcm91cElEID0gdXNlckluZm9IZWFkLmR3R3JvdXBJRDtcbiAgICAgICAgICAgIHRoaXMubExvdmVsaW5lc3MgPSB1c2VySW5mb0hlYWQubExvdmVsaW5lc3M7XG5cbiAgICAgICAgICAgIHRoaXMubFNjb3JlID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFNjb3JlO1xuICAgICAgICAgICAgdGhpcy5sR2FtZUdvbGQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sR2FtZUdvbGQ7XG4gICAgICAgICAgICB0aGlzLmxJbnN1cmVTY29yZSA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxJbnN1cmVTY29yZTtcbiAgICAgICAgICAgIHRoaXMubFdpbkNvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubFdpbkNvdW50O1xuICAgICAgICAgICAgdGhpcy5sTG9zdENvdW50ID0gdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubExvc3RDb3VudDtcbiAgICAgICAgICAgIHRoaXMubERyYXdDb3VudCA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxEcmF3Q291bnQ7XG4gICAgICAgICAgICB0aGlzLmxGbGVlQ291bnQgPSB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRmxlZUNvdW50O1xuICAgICAgICAgICAgdGhpcy5sRXhwZXJpZW5jZSA9IHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxFeHBlcmllbmNlO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlKHRydWUpe1xuICAgICAgICAgICAgLy/pu5jorqTkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmUgRFRQX05VTExcdFx0XHRcdFx0MFx0XHRcdFx0XHRcdFx0XHQvL+aXoOaViOaVsOaNrlxuICAgICAgICAgICAgLy/miL/pl7Tkv6Hmga9cbiAgICAgICAgICAgIC8vICNkZWZpbmVcdERUUF9VU0VSX0FDQ09VTlRTXHRcdFx0M1x0XHRcdFx0XHRcdFx0XHQvL+eUqOaIt+W4kOWPt1xuICAgICAgICAgICAgLy8gI2RlZmluZVx0RFRQX1VOREVSX1dSSVRFXHRcdFx0XHQ5XHRcdFx0XHRcdFx0XHRcdC8v5Liq5oCn562+5ZCNXG4gICAgICAgICAgICAvLyAjZGVmaW5lIERUUF9VU0VSX0dST1VQX05BTUVcdFx0XHQzMDFcdFx0XHRcdFx0XHRcdFx0Ly/npL7lm6LlkI3lrZdcblxuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHZhciBkYXRhU2l6ZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgdmFyIGRhdGFEZXNjcmliZSA9IHBEYXRhLnJlYWR3b3JkKHRydWUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaXplID0gXCIrZGF0YVNpemUrXCIgZGVzY3JpYmUgPSBcIitkYXRhRGVzY3JpYmUpO1xuICAgICAgICAgICAgaWYgKGRhdGFEZXNjcmliZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcERhdGEuc2V0bWF4c2l6ZSgxKTtcbiAgICAgICAgICAgIHN3aXRjaChkYXRhRGVzY3JpYmUpe1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zek5hbWUgPSBcIua4uOaIj+eUqOaIt1wiO1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckluZm9IZWFkLmR3VXNlcklEID09PSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRCB8fCB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN6TmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoZGF0YVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zelVuZGVyV3JpdGUgPSBwRGF0YS5yZWFkc3RyaW5nKGRhdGFTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDMwMTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvSGVhZC5kd1VzZXJJRCA9PT0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zekdyb3VwTmFtZSA9IHBEYXRhLnJlYWRzdHJpbmcoZGF0YVNpemUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICByZWFkVXNlckluZm9IZWFkOiBmdW5jdGlvbiAocERhdGEpIHtcbiAgICAgICAgLy/nlKjmiLfln7rmnKzkv6Hmga/nu5PmnoRcbiAgICAgICAgLy8gc3RydWN0IHRhZ1VzZXJJbmZvSGVhZFxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICAvL+eUqOaIt+WxnuaAp1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RmFjZUlEO1x0XHRcdFx0XHRcdFx0Ly/lpLTlg4/ntKLlvJVcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlcklEO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd0dhbWVJRDtcdFx0XHRcdFx0XHRcdC8v5ri45oiPIEkgRFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHcm91cElEO1x0XHRcdFx0XHRcdFx0Ly/npL7lm6LntKLlvJVcbiAgICAgICAgLy8gICAgIERXT1JEXHRcdFx0XHRcdFx0XHRcdGR3VXNlclJpZ2h0O1x0XHRcdFx0XHRcdC8v55So5oi3562J57qnXG4gICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxMb3ZlbGluZXNzO1x0XHRcdFx0XHRcdC8v55So5oi36a2F5YqbXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01hc3RlclJpZ2h0O1x0XHRcdFx0XHRcdC8v566h55CG5p2D6ZmQXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v55So5oi35bGe5oCnXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdFx0Ly/nlKjmiLfmgKfliKtcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNZW1iZXJPcmRlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1hc3Rlck9yZGVyO1x0XHRcdFx0XHRcdC8v566h55CG562J57qnXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIC8v55So5oi354q25oCBXG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdUYWJsZUlEO1x0XHRcdFx0XHRcdFx0Ly/moYzlrZDlj7fnoIFcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0NoYWlySUQ7XHRcdFx0XHRcdFx0XHQvL+akheWtkOS9jee9rlxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYlVzZXJTdGF0dXM7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnirbmgIFcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/nlKjmiLfnp6/liIZcbiAgICAgICAgLy8gICAgIHRhZ1VzZXJTY29yZVx0XHRcdFx0XHRcdFVzZXJTY29yZUluZm87XHRcdFx0XHRcdFx0Ly/np6/liIbkv6Hmga9cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAvL+eUqOaIt+enr+WIhuS/oeaBr1xuICAgICAgICAgICAgICAgICAgICAvLyBzdHJ1Y3QgdGFnVXNlclNjb3JlXG4gICAgICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsU2NvcmU7XHRcdFx0XHRcdFx0XHRcdC8v55So5oi35YiG5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HTE9OR1x0XHRcdFx0XHRcdFx0bEdhbWVHb2xkO1x0XHRcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/lrZjlgqjph5HluIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bFdpbkNvdW50O1x0XHRcdFx0XHRcdFx0Ly/og5zliKnnm5jmlbBcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bExvc3RDb3VudDtcdFx0XHRcdFx0XHRcdC8v5aSx6LSl55uY5pWwXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMT05HXHRcdFx0XHRcdFx0XHRcdGxEcmF3Q291bnQ7XHRcdFx0XHRcdFx0XHQvL+WSjOWxgOebmOaVsFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTE9OR1x0XHRcdFx0XHRcdFx0XHRsRmxlZUNvdW50O1x0XHRcdFx0XHRcdFx0Ly/mlq3nur/mlbDnm65cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIExPTkdcdFx0XHRcdFx0XHRcdFx0bEV4cGVyaWVuY2U7XHRcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICAgICAgICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgLy/mianlsZXkv6Hmga9cbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0XHRsSW5zdXJlU2NvcmU7XHRcdFx0XHRcdFx0Ly/mtojotLnph5HluIFcbiAgICAgICAgLy8gICAgIC8vTE9OR1x0XHRcdFx0XHRcdFx0XHRsR2FtZUdvbGQ7XHRcdFx0XHRcdFx0XHQvL+a4uOaIj+mHkeW4gVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdDdXN0b21GYWNlVmVyO1x0XHRcdFx0XHQvL+S4iuS8oOWktOWDj1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdQcm9wUmVzaWR1YWxUaW1lWzE1XTtcdC8v6YGT5YW35pe26Ze0XG4gICAgICAgIC8vIH07XG4gICAgICAgIHZhciB1c2VySW5mb0hlYWQgPSB7fTtcbiAgICAgICAgdXNlckluZm9IZWFkLndGYWNlSUQgPSBwRGF0YS5yZWFkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WktOWDj+e0ouW8lVxuICAgICAgICB1c2VySW5mb0hlYWQuZHdVc2VySUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaItyBJIERcbiAgICAgICAgdXNlckluZm9IZWFkLmR3R2FtZUlEID0gcERhdGEucmVhZGR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI8gSSBEXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd0dyb3VwSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56S+5Zui57Si5byVXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd1VzZXJSaWdodCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi3562J57qnXG4gICAgICAgIHVzZXJJbmZvSGVhZC5sTG92ZWxpbmVzcyA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+mtheWKm1xuICAgICAgICB1c2VySW5mb0hlYWQuZHdNYXN0ZXJSaWdodCA9IHBEYXRhLnJlYWRkd29yZCgpOyAgICAgICAgICAgICAgICAgICAgICAvL+euoeeQhuadg+mZkFxuICAgICAgICBcbiAgICAgICAgLy/nlKjmiLflsZ7mgKdcbiAgICAgICAgdXNlckluZm9IZWFkLmNiR2VuZGVyID0gcERhdGEucmVhZGJ5dGUoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+aAp+WIq1xuICAgICAgICB1c2VySW5mb0hlYWQuY2JNZW1iZXJPcmRlciA9IHBEYXRhLnJlYWRieXRlKCk7ICAgICAgICAgICAgICAgICAgICAgIC8v5Lya5ZGY562J57qnXG4gICAgICAgIHVzZXJJbmZvSGVhZC5jYk1hc3Rlck9yZGVyID0gcERhdGEucmVhZGJ5dGUoKTsgICAgICAgICAgICAgICAgICAgICAgLy/nrqHnkIbnrYnnuqdcbiAgICAgICAgXG4gICAgICAgIC8v55So5oi354q25oCBXG4gICAgICAgIHVzZXJJbmZvSGVhZC53VGFibGVJRCA9IHBEYXRhLnJlYWR3b3JkKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/moYzlrZDlj7fnoIFcbiAgICAgICAgdXNlckluZm9IZWFkLndDaGFpcklEID0gcERhdGEucmVhZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+akheWtkOS9jee9rlxuICAgICAgICB1c2VySW5mb0hlYWQuY2JVc2VyU3RhdHVzID0gcERhdGEucmVhZGJ5dGUoKTsgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG4gICAgICAgIFxuICAgICAgICAvL+eUqOaIt+enr+WIhlxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mbyA9IHt9O1xuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sU2NvcmUgPSBwRGF0YS5yZWFkaW50NjQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YiG5pWwXG4gICAgICAgIHVzZXJJbmZvSGVhZC5Vc2VyU2NvcmVJbmZvLmxHYW1lR29sZCA9IHBEYXRhLnJlYWRpbnQ2NCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/ph5HluIFcbiAgICAgICAgdXNlckluZm9IZWFkLlVzZXJTY29yZUluZm8ubEluc3VyZVNjb3JlID0gcERhdGEucmVhZGludDY0KCk7ICAgICAgICAgICAgICAgICAgICAgICAvL+WtmOWCqOmHkeW4gVxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sV2luQ291bnQgPSBwRGF0YS5yZWFkaW50KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvL+iDnOWIqeebmOaVsFxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sTG9zdENvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+Wksei0peebmOaVsFxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRHJhd0NvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+WSjOWxgOebmOaVsFxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRmxlZUNvdW50ID0gcERhdGEucmVhZGludCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAvL+aWree6v+aVsOebrlxuICAgICAgICB1c2VySW5mb0hlYWQuVXNlclNjb3JlSW5mby5sRXhwZXJpZW5jZSA9IHBEYXRhLnJlYWRpbnQoKTsgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+e7j+mqjFxuXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd0N1c3RvbUZhY2VWZXIgPSBwRGF0YS5yZWFkZHdvcmQoKTsgICAgICAgICAgICAgICAgICAgIC8v5LiK5Lyg5aS05YOPXG4gICAgICAgIHVzZXJJbmZvSGVhZC5kd1Byb3BSZXNpZHVhbFRpbWUgPSBbXTsvL+mBk+WFt+aXtumXtFxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMTU7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgICAgIHVzZXJJbmZvSGVhZC5kd1Byb3BSZXNpZHVhbFRpbWUucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VySW5mb0hlYWQ7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZVVzZXJJdGVtOyIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG52YXIgR2FtZU1vZGVsID0gcmVxdWlyZShcIkdhbWVNb2RlbFwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfY2VsbFR1cm46IGNjLkxhYmVsLFxuICAgICAgICBtX0xhYmVsX2FsbFNjb3JlOiBjYy5MYWJlbCxcbiAgICAgICAgbV9ub2RlQm90dG9tOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fUHJvZ3Jlc3NfdGltZTogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgIG1fTGFiZWxfdGltZTogY2MuTGFiZWwsXG4gICAgICAgIGNhcmRQcmVmYWI6IGNjLlByZWZhYixcbiAgICAgICAgdXNlckluZmFjZVByZWZhYjogY2MuUHJlZmFiLFxuICAgICAgICBjaGlwUHJlZmFiOiBjYy5QcmVmYWIsXG4gICAgICAgIG1fQnV0dG9uX3JlYWR5OiBjYy5CdXR0b24sXG4gICAgICAgIG1fQnV0dG9uX2xvb2tDYXJkOiBjYy5CdXR0b24sXG4gICAgICAgIG1fQnV0dG9uX2dpdmVVcDogY2MuQnV0dG9uLFxuICAgICAgICBtX0J1dHRvbl9jb21wYXJlQ2FyZDogY2MuQnV0dG9uLFxuICAgICAgICBtX05vZGVfcGxheWVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OltdLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9mbGFnUmVhZHk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBtX3VzZXJDYXJkUGFuZWw6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBwdFBsYXllcjoge1xuICAgICAgICAgICAgZGVmYXVsdDpbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzIsXG4gICAgICAgIH0sXG4gICAgICAgIHB0QmFua2VyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzIsXG4gICAgICAgIH0sXG4gICAgICAgIHB0Q2FyZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5WZWMyLFxuICAgICAgICB9LFxuICAgICAgICBtX0ltYWdlX2JhbmtlcjogY2MuTm9kZSxcbiAgICAgICAgbV9Mb29rQ2FyZDoge1xuICAgICAgICAgICAgZGVmYXVsdDpbXSxcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9HaXZlVXA6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6W10sXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fVG9nZ2xlX21lbnVPcGVuOiBjYy5Ub2dnbGUsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zY2VuZSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoXCJHYW1lU2NlbmVcIik7XG4gICAgICAgIHRoaXMubV9MYWJlbF9jZWxsVHVybi5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9waW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc3BlZWQgPSAwLjE7XG4gICAgICAgIC8v55So5oi35aS05YOPXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB6amhfY21kLkdBTUVfUExBWUVSOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgdXNlck5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnVzZXJJbmZhY2VQcmVmYWIpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwibm9kZVBsYXllclwiKS5hZGRDaGlsZCh1c2VyTm9kZSk7XG4gICAgICAgICAgICB0aGlzLm1fTm9kZV9wbGF5ZXJbaW5kZXhdID0gdXNlck5vZGU7XG4gICAgICAgICAgICB1c2VyTm9kZS5zZXRQb3NpdGlvbih0aGlzLnB0UGxheWVyW2luZGV4XSk7XG4gICAgICAgICAgICB1c2VyTm9kZS5yb3RhdGlvbiA9IGluZGV4ICogKC05MCkgKyAxODA7XG4gICAgICAgICAgICB1c2VyTm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fdXNlckNhcmQgPSBbXTtcbiAgICAgICAgLy/nlKjmiLfmiYvniYxcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMubV91c2VyQ2FyZFtpbmRleF0gPSB7fTtcbiAgICAgICAgICAgIHRoaXMubV91c2VyQ2FyZFtpbmRleF0uY2FyZCA9IFtdO1xuICAgICAgICAgICAgLy/niYzljLrln59cbiAgICAgICAgICAgIHZhciBjYXJkUGFuZWwgPSB0aGlzLm1fdXNlckNhcmRQYW5lbFtpbmRleF07XG4gICAgICAgICAgICB0aGlzLm1fdXNlckNhcmRbaW5kZXhdLmFyZWEgPSBjYXJkUGFuZWw7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHpqaF9jbWQuTUFYX0NPVU5UOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmNhcmRQcmVmYWIpO1xuICAgICAgICAgICAgICAgIHRoaXMubV91c2VyQ2FyZFtpbmRleF0uY2FyZFtqXSA9IGNhcmROb2RlO1xuICAgICAgICAgICAgICAgIGNhcmRQYW5lbC5hZGRDaGlsZChjYXJkTm9kZSk7XG4gICAgICAgICAgICAgICAgY2FyZE5vZGUuc2V0UG9zaXRpb24odGhpcy5wdENhcmRbaW5kZXhdLnggKyAoKGluZGV4ICYgMSkgJiYgMzUgfHwgNzApICogaix0aGlzLnB0Q2FyZFtpbmRleF0ueSk7XG4gICAgICAgICAgICAgICAgY2FyZE5vZGUuc2V0U2NhbGUoMC43KTtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZEl0ZW0gPSBjYXJkTm9kZS5nZXRDb21wb25lbnQoXCJDYXJkSXRlbVwiKTtcbiAgICAgICAgICAgICAgICBjYXJkSXRlbS5zaG93Q2FyZEJhY2soKTtcbiAgICAgICAgICAgICAgICBjYXJkTm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL+W6lemDqOaMiemSrlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubV9ub2RlQm90dG9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMubV9ub2RlQm90dG9tW2ldO1xuICAgICAgICAgICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5vZGVDaGlwUG9vbCA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcIm5vZGVDaGlwUG9vbFwiKTtcbiAgICAgICAgdGhpcy5tX1BhbmVsX2FyZWFNZW51ID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKFwibV9QYW5lbF9hcmVhTWVudVwiKTtcbiAgICAgICAgdGhpcy5vbkNsaWNrTWVudU9wZW4odGhpcy5tX1RvZ2dsZV9tZW51T3Blbi5nZXRDb21wb25lbnQoY2MuVG9nZ2xlKSk7XG4gICAgICAgIHRoaXMubV9iU2hvd01lbnUgPSBmYWxzZTtcbiAgICB9LFxuICAgIG9uRW5hYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIH0sXG4gICAgb25SZXNldFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9yZWFkeS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tX25vZGVCb3R0b20ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5tX25vZGVCb3R0b21baV07XG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0QmFua2VyKEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKTtcbiAgICAgICAgdGhpcy5zZXRBbGxUYWJsZVNjb3JlKDApO1xuICAgICAgICB0aGlzLnNldENvbXBhcmVDYXJkKGZhbHNlKTtcbiAgICAgICAgdGhpcy5jbGVhbkFsbEpldHRvbnMoKTtcbiAgICAgICAgdGhpcy5zdG9wQ29tcGFyZUNhcmQoKTtcbiAgICAgICAgdGhpcy5zZXRNYXhDZWxsU2NvcmUoMCk7XG5cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZXRMb29rQ2FyZChpLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJDYXJkVHlwZShpKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VXNlclRhYmxlU2NvcmUoaSwgMCk7XG4gICAgICAgICAgICB0aGlzLnNldFVzZXJHaXZlVXAoaSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zZXRVc2VyQ2FyZChpLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgdGhpcy5jbGVhckNhcmQoaSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy/mm7TmlrDml7bpkp9cbiAgICBvblVwZGF0ZUNsb2NrVmlldzogZnVuY3Rpb24gKHZpZXdJRCwgdGltZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lVmlld11bb25VcGRhdGVDbG9ja1ZpZXddIFt2aWV3SUQsIHRpbWVdID0gXCIgKyBbdmlld0lELCB0aW1lXSk7XG4gICAgICAgIGlmICh0aW1lIDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMubV9Qcm9ncmVzc190aW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMubV9Qcm9ncmVzc190aW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnB0UGxheWVyW3ZpZXdJRF0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5ub2RlLnNldFBvc2l0aW9uKHRoaXMucHRQbGF5ZXJbdmlld0lEXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5ub2RlLnNldFBvc2l0aW9uKDAsNjApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9ncmVzcyA9ICgxLjAqdGltZS96amhfY21kLlRJTUVfU1RBUlRfR0FNRSk7XG4gICAgICAgIHRoaXMubV9Qcm9ncmVzc190aW1lLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgICAgIHRoaXMubV9MYWJlbF90aW1lLnN0cmluZyA9IHRpbWUudG9TdHJpbmcoKTtcbiAgICB9LFxuICAgIC8v5pu05paw55So5oi35pi+56S6XG4gICAgb25VcGRhdGVVc2VyOiBmdW5jdGlvbiAodmlld0lELCB1c2VySXRlbSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHZpZXdJRCA9PT0gdW5kZWZpbmVkIHx8IHZpZXdJRCA9PT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVWaWV3XVtvblVwZGF0ZVVzZXJdIHZpZXdJRCBpcyB1bmRlZmluZWQgb3IgaW52YWxpZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lVmlld11bb25VcGRhdGVVc2VyXSB2aWV3SUQgPSBcIiArIHZpZXdJRCArIFwiIHVzZXJJdGVtID0gXCIgKyBKU09OLnN0cmluZ2lmeSh1c2VySXRlbSxudWxsLCAnICcpKTtcbiAgICAgICAgdGhpcy5tX05vZGVfcGxheWVyW3ZpZXdJRF0uYWN0aXZlID0gKHVzZXJJdGVtICE9PSB1bmRlZmluZWQpO1xuICAgICAgICBpZih1c2VySXRlbSkge1xuICAgICAgICAgICAgdGhpcy5tX2ZsYWdSZWFkeVt2aWV3SURdLmFjdGl2ZSA9IChHbG9iYWxEZWYuVVNfUkVBRFkgPT09IHVzZXJJdGVtLmNiVXNlclN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMubV9mbGFnUmVhZHlbdmlld0lEXS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/niYznsbvlnovku4vnu43nmoTlvLnlh7rkuI7lvLnlhaVcbiAgICBvblNob3dJbnRyb2R1Y2U6IGZ1bmN0aW9uIChiU2hvdykge1xuICAgICAgICBcbiAgICB9LFxuICAgIC8v562556CB56e75YqoXG4gICAgcGxheWVySmV0dG9uOiBmdW5jdGlvbiAod1ZpZXdDaGFpcklELCBudW0sIG5vdGFuaSkge1xuICAgICAgICBpZiAoIW51bSB8fCBudW0gPCAxIHx8ICF0aGlzLm1fbENlbGxTY29yZSB8fCB0aGlzLm1fbENlbGxTY29yZSA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVWaWV3XVtwbGF5ZXJKZXR0b25dIG51bSBpcyBpbnZhbGlkXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb3VudCA9IE1hdGguZmxvb3IobnVtL3RoaXMubV9sQ2VsbFNjb3JlKTtcbiAgICAgICAgaWYgKGNvdW50ID4gMTApIHtcbiAgICAgICAgICAgIGNvdW50ID0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50IDw9IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gMTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlwID0gY2MuaW5zdGFudGlhdGUodGhpcy5jaGlwUHJlZmFiKTtcbiAgICAgICAgICAgIHRoaXMubm9kZUNoaXBQb29sLmFkZENoaWxkKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5zZXRQb3NpdGlvbih0aGlzLnB0UGxheWVyW3dWaWV3Q2hhaXJJRF0pO1xuICAgICAgICAgICAgY2hpcC5zZXRTY2FsZSgwLjUpO1xuICAgICAgICAgICAgdmFyIHggPSBNYXRoLnJhbmRvbSgpICogMjAwIC0gMTAwO1xuICAgICAgICAgICAgdmFyIHkgPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTA7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lVmlld11bcGxheWVySmV0dG9uXSBbeCx5XSA9IFwiICsgW3gseV0pO1xuICAgICAgICAgICAgY2hpcC5ydW5BY3Rpb24oY2MubW92ZVRvKDAuMiwgY2MucCh4LHkpKSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5YGc5q2i5q+U54mM5Yqo55S7XG4gICAgc3RvcENvbXBhcmVDYXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZShcImNvbXBhcmVWaWV3XCIpLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgLy/mr5TniYxcbiAgICBjb21wYXJlQ2FyZDogZnVuY3Rpb24gKGZpcnN0dXNlcixzZWNvbmR1c2VyLGZpcnN0Y2FyZCxzZWNvbmRjYXJkLGJmaXJzdHdpbixjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJjb21wYXJlVmlld1wiKS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmRlbGF5VGltZSgxLjApLGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pKSk7XG4gICAgfSxcbiAgICAvL+W6leazqOaYvuekulxuICAgIHNldENlbGxTY29yZTogZnVuY3Rpb24gKGNlbGxTY29yZSkge1xuICAgICAgICB0aGlzLm1fbENlbGxTY29yZSA9IGNlbGxTY29yZTtcbiAgICAgICAgaWYgKCFjZWxsU2NvcmUpIHtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0Q2VsbFR1cm46IGZ1bmN0aW9uIChjZWxsU2NvcmUsIHR1cm5Db3VudCwgbWF4VHVybikge1xuICAgICAgICB2YXIgdGV4dCA9IFwi5bqV5rOoOlwiICsgY2VsbFNjb3JlICsgXCIg6L2u5pWwOlwiICsgKHR1cm5Db3VudCArIDEpICsgXCIvXCIgKyBtYXhUdXJuO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY2VsbFR1cm4ubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfY2VsbFR1cm4uc3RyaW5nID0gdGV4dDtcbiAgICB9LFxuICAgIC8v5bCB6aG25YiG5pWwXG4gICAgc2V0TWF4Q2VsbFNjb3JlOiBmdW5jdGlvbiAoY2VsbFNjb3JlKSB7XG4gICAgICAgIGlmICghY2VsbFNjb3JlKSB7XG4gICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgfSAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5bqE5a625pi+56S6XG4gICAgc2V0QmFua2VyOiBmdW5jdGlvbiAodmlld0lEKSB7XG4gICAgICAgIGlmICh2aWV3SUQgPT09IHVuZGVmaW5lZCB8fCB2aWV3SUQgPT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICAvL3RvZG9cbiAgICAgICAgICAgIHRoaXMubV9JbWFnZV9iYW5rZXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gIFxuICAgICAgICB0aGlzLm1fSW1hZ2VfYmFua2VyLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9JbWFnZV9iYW5rZXIuc2V0UG9zaXRpb24odGhpcy5wdEJhbmtlclt2aWV3SURdKTtcbiAgICB9LFxuICAgIC8v5LiL5rOo5oC76aKdXG4gICAgc2V0QWxsVGFibGVTY29yZTogZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgIGlmIChzY29yZSA9PT0gdW5kZWZpbmVkIHx8IHNjb3JlID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfYWxsU2NvcmUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubV9MYWJlbF9hbGxTY29yZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfYWxsU2NvcmUuc3RyaW5nID0gc2NvcmU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v546p5a625LiL5rOoXG4gICAgc2V0VXNlclRhYmxlU2NvcmU6IGZ1bmN0aW9uICh2aWV3SUQsIHNjb3JlKSB7XG4gICAgICAgIGlmIChzY29yZSA9PT0gdW5kZWZpbmVkIHx8IHNjb3JlID09PSAwKSB7XG4gICAgICAgICAgICAvLyBpZiAodmlld0lEICE9PSApXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG5cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy/lj5HniYxcbiAgICBzZW5kQ2FyZDogZnVuY3Rpb24gKHZpZXdJRCwgaW5kZXgsIGZEZWxheSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlt2aWV3SUQsaW5kZXgsZkRlbGF5XSA9IFwiICsgW3ZpZXdJRCxpbmRleCxmRGVsYXldKTtcbiAgICAgICAgaWYgKHZpZXdJRCA9PT0gdW5kZWZpbmVkIHx8IHZpZXdJRCA9PT0gR2xvYmFsRGVmLklOVkFMSURfQ0hBSVIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGZJbnRlcnZhbCA9IDAuMTtcbiAgICAgICAgdmFyIG5vZGVDYXJkID0gdGhpcy5tX3VzZXJDYXJkW3ZpZXdJRF07XG4gICAgICAgIHZhciBzcHJpdGVDYXJkID0gbm9kZUNhcmQuY2FyZFtpbmRleF07XG4gICAgICAgIHZhciBjYXJkSXRlbSA9IHNwcml0ZUNhcmQuZ2V0Q29tcG9uZW50KFwiQ2FyZEl0ZW1cIik7XG4gICAgICAgIHNwcml0ZUNhcmQuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgc3ByaXRlQ2FyZC5vcGFjaXR5ID0gMDtcbiAgICAgICAgc3ByaXRlQ2FyZC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBzcHJpdGVDYXJkLnNldFNjYWxlKDAuNyk7XG4gICAgICAgIHNwcml0ZUNhcmQuc2V0UG9zaXRpb24oMCwwKTtcbiAgICAgICAgY2FyZEl0ZW0uc2hvd0NhcmRCYWNrKCk7XG4gICAgICAgIHNwcml0ZUNhcmQucnVuQWN0aW9uKFxuICAgICAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgY2MuZGVsYXlUaW1lKGZEZWxheSksXG4gICAgICAgICAgICAgICAgLy8gY2MuZmFkZUluKDApLFxuICAgICAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgICAgICBjYy5mYWRlSW4oMC4xKSxcbiAgICAgICAgICAgICAgICAgICAgY2MubW92ZVRvKDAuMixzZWxmLnB0Q2FyZFt2aWV3SURdLnggKyAoKHZpZXdJRCAmIDEpICYmIDM1IHx8IDcwKSAqIGluZGV4LCBzZWxmLnB0Q2FyZFt2aWV3SURdLnkpLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG4gICAgfSxcbiAgICAvL+eci+eJjOeKtuaAgVxuICAgIHNldExvb2tDYXJkOiBmdW5jdGlvbiAodmlld0lELCBiTG9vaykge1xuICAgICAgICAvLyBpZiAodmlld0lEID09PSB6amhfY21kLk1ZX1ZJRVdJRCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMubV9Mb29rQ2FyZFt2aWV3SURdLmFjdGl2ZSA9IGJMb29rO1xuICAgIH0sXG4gICAgLy/lvIPniYznirbmgIFcbiAgICBzZXRVc2VyR2l2ZVVwOiBmdW5jdGlvbiAodmlld0lELCBiR2l2ZXVwKSB7XG4gICAgICAgIC8vdG9kb1xuICAgICAgICB2YXIgbm9kZUNhcmQgPSB0aGlzLm1fdXNlckNhcmRbdmlld0lEXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSBub2RlQ2FyZC5jYXJkW2ldO1xuICAgICAgICAgICAgY2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1fR2l2ZVVwW3ZpZXdJRF0uYWN0aXZlID0gYkdpdmV1cDtcbiAgICAgICAgaWYgKGJHaXZldXApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9va0NhcmQodmlld0lELCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8v5riF55CG54mMXG4gICAgY2xlYXJDYXJkOiBmdW5jdGlvbiAodmlld0lEKSB7XG4gICAgICAgIC8vdG9kb1xuICAgICAgICB2YXIgbm9kZUNhcmQgPSB0aGlzLm1fdXNlckNhcmRbdmlld0lEXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSBub2RlQ2FyZC5jYXJkW2ldO1xuICAgICAgICAgICAgY2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0dpdmVVcFt2aWV3SURdLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH0sXG4gICAgLy/mmL7npLrniYzlgLxcbiAgICBzZXRVc2VyQ2FyZDogZnVuY3Rpb24gKHZpZXdJRCwgY2FyZERhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVZpZXddW3NldFVzZXJDYXJkXVt2aWV3SUQsY2FyZERhdGFdID0gXCIgKyBbdmlld0lELGNhcmREYXRhXSk7XG4gICAgICAgIGlmICh2aWV3SUQgPT09IHVuZGVmaW5lZCB8fCB2aWV3SUQgPT09IEdsb2JhbERlZi5JTlZBTElEX0NIQUlSKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhcmREYXRhKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FyZE5vZGUgPSB0aGlzLm1fdXNlckNhcmRbdmlld0lEXS5jYXJkW2ldO1xuICAgICAgICAgICAgICAgIHZhciBjYXJkSXRlbSA9IGNhcmROb2RlLmdldENvbXBvbmVudChcIkNhcmRJdGVtXCIpO1xuICAgICAgICAgICAgICAgIGNhcmROb2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKCFjYXJkRGF0YVtpXSB8fCBjYXJkRGF0YVtpXSA9PT0gMCB8fCBjYXJkRGF0YVtpXSA9PT0gMHhmZikge1xuICAgICAgICAgICAgICAgICAgICBjYXJkSXRlbS5zaG93Q2FyZEJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FyZEl0ZW0uc2V0Q2FyZERhdGEoY2FyZERhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICBjYXJkSXRlbS5zZXRUdXJuVGltZSgwLjUpO1xuICAgICAgICAgICAgICAgICAgICBjYXJkSXRlbS5zZXRUdXJuQ2FsbGJhY2soZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbR2FtZVZpZXddW3NldFVzZXJDYXJkXVtzZXRUdXJuQ2FsbGJhY2tdXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY2FyZEl0ZW0udHVybkNhcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FyZEl0ZW0uc2hvd0NhcmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHpqaF9jbWQuTUFYX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1fdXNlckNhcmRbdmlld0lEXS5jYXJkW2ldLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+aYvuekuueJjOexu+Wei1xuICAgIHNldFVzZXJDYXJkVHlwZTogZnVuY3Rpb24gKHZpZXdJRCwgY2FyZHR5cGUpIHtcblxuICAgIH0sXG4gICAgLy/otaLlvpfnrbnnoIFcbiAgICB3aW5UaGVDaGlwOiBmdW5jdGlvbiAod1dpbm5lcikge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLm5vZGVDaGlwUG9vbC5jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGVsZW1lbnQucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgICAgIGNjLmRlbGF5VGltZSgwLjEqKGNoaWxkcmVuLmxlbmd0aCAtIGkpKSxcbiAgICAgICAgICAgICAgICBjYy5tb3ZlVG8oMC40LHRoaXMucHRQbGF5ZXJbd1dpbm5lcl0pLFxuICAgICAgICAgICAgICAgIGNjLmNhbGxGdW5jKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+a4heeQhuetueeggVxuICAgIGNsZWFuQWxsSmV0dG9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGVDaGlwUG9vbC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgIH0sXG4gICAgLy/lj5bmtojmr5TniYzpgInmi6lcbiAgICBzZXRDb21wYXJlQ2FyZDogZnVuY3Rpb24gKGJDaG9vc2UsIHN0YXR1cykge1xuICAgICAgICB0aGlzLmJDb21wYXJlQ2hvb3NlID0gYkNob29zZTtcbiAgICAgICAgLy8gdG9kb1xuICAgIH0sXG4gICAgb25DbGlja01lbnVPcGVuOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2hvd01lbnUodG9nZ2xlLmlzQ2hlY2tlZCk7XG4gICAgfSxcbiAgICBvblRvdWNoOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBhcmFtcyk7XG4gICAgICAgIGlmICh0aGlzLm1fYlNob3dNZW51KSB7XG4gICAgICAgICAgICB0aGlzLm1fVG9nZ2xlX21lbnVPcGVuLnVuY2hlY2soKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd01lbnU6IGZ1bmN0aW9uIChiU2hvdykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltHYW1lVmlld11bc2hvd01lbnVdIGJTaG93ID0gXCIgKyBiU2hvdyk7XG4gICAgICAgIHRoaXMubV9iU2hvd01lbnUgPSBiU2hvdztcbiAgICAgICAgaWYgKGJTaG93KSB7XG4gICAgICAgICAgICB0aGlzLm1fUGFuZWxfYXJlYU1lbnUuYWN0aXZlID0gYlNob3c7XG4gICAgICAgICAgICB0aGlzLm1fUGFuZWxfYXJlYU1lbnUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjIsY2MucCgwLC00MjApKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHRoaXMubV9QYW5lbF9hcmVhTWVudS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgY2MubW92ZUJ5KDAuMixjYy5wKDAsNDIwKSksXG4gICAgICAgICAgICAgICAgY2MuY2FsbEZ1bmMoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KSkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvL+aMiemUruWTjeW6lFxuICAgIG9uU3RhcnRHYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLm9uU3RhcnRHYW1lKHRydWUpO1xuICAgICAgICAvLyB0aGlzLm1fQnV0dG9uX3JlYWR5Lm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIC8vIHZhciBkZWxheUNvdW50ID0gMTtcbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCB6amhfY21kLk1BWF9DT1VOVDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHpqaF9jbWQuR0FNRV9QTEFZRVI7IGorKykge1xuICAgICAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdIFt0aGlzLm1fd0JhbmtlclVzZXIsaix6amhfY21kLkdBTUVfUExBWUVSXSA9IFwiICsgW3RoaXMubV93QmFua2VyVXNlcixqLHpqaF9jbWQuR0FNRV9QTEFZRVJdKTtcbiAgICAgICAgLy8gICAgICAgICB2YXIgY2hhaXIgPSBqO1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiW0dhbWVTY2VuZV1bb25TdWJHYW1lU3RhcnRdIGNoYWlyID0gXCIgKyBjaGFpcik7XG4gICAgICAgIC8vICAgICAgICAgLy8gaWYgKHRoaXMubV9jYlBsYXlTdGF0dXNbY2hhaXJdID09PSAxKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHRoaXMuc2VuZENhcmQoY2hhaXIsIGksIGRlbGF5Q291bnQgKiAwLjEpO1xuICAgICAgICAvLyAgICAgICAgICAgICBkZWxheUNvdW50ICs9IDE7XG4gICAgICAgIC8vICAgICAgICAgLy8gfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gdGhpcy5fYkJhY2sgPSAhdGhpcy5fYkJhY2s7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgempoX2NtZC5HQU1FX1BMQVlFUjsgaSsrKSB7XG4gICAgICAgIC8vICAgICB2YXIgY2FyZERhdGEgPSBbMiwzLDRdO1xuICAgICAgICAvLyAgICAgdGhpcy5zZXRVc2VyQ2FyZChpLHRoaXMuX2JCYWNrICYmIGNhcmREYXRhIHx8IFtdKTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBvbkdpdmVVcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zY2VuZS5vbkdpdmVVcCgpOyAgXG4gICAgfSxcbiAgICBvbkxvb2tDYXJkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLm9uTG9va0NhcmQoKTtcbiAgICB9LFxuICAgIG9uQ29tcGFyZUNhcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmUub25Db21wYXJlQ2FyZCgpOyAgXG4gICAgfSxcbiAgICBvbkFkZFNjb3JlOiBmdW5jdGlvbiAoZXZlbnQscGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBhcmFtcyk7XG4gICAgICAgIHRoaXMuX3NjZW5lLmFkZFNjb3JlKHBhcmFtcyk7ICBcbiAgICB9LFxuICAgIC8vXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgIC8vICAgICB2YXIgcHJvZ3Jlc3MgPSB0aGlzLm1fUHJvZ3Jlc3NfdGltZS5wcm9ncmVzcztcbiAgICAvLyAgICAgaWYgKHByb2dyZXNzIDwgMS4wICYmIHRoaXMuX3BpbmcpIHtcbiAgICAvLyAgICAgICAgIHByb2dyZXNzICs9IGR0ICogdGhpcy5fc3BlZWQ7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZWxzZSB7XG4gICAgLy8gICAgICAgICBwcm9ncmVzcyAtPSBkdCAqIHRoaXMuX3NwZWVkO1xuICAgIC8vICAgICAgICAgdGhpcy5fcGluZyA9IHByb2dyZXNzIDw9IDA7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdmFyIHRpbWUgPSBNYXRoLmNlaWwocHJvZ3Jlc3MgKiAxMCk7XG4gICAgLy8gICAgIHRoaXMubV9Qcm9ncmVzc190aW1lLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgLy8gICAgIHRoaXMubV9MYWJlbF90aW1lLnN0cmluZyA9IHRpbWUudG9TdHJpbmcoKTtcbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsRGVmID0ge1xuICAgIE1BWF9DSEFJUjogMTAwLFx0XHRcdFx0XHRcdFx0XHQvL+KXisOTwqXDm+KAnMWS4peK4oCdXG4gICAgTUFYX0NIQUlSX05PUk1BTDogOCxcdFx0XHRcdFx0XHRcdFx0Ly/il4rDk8Klw5vCu8OAwqDLnVxuXG4gICAgSU5WQUxJRF9UQUJMRTogMHhGRkZGLFx0XHRcdFx0XHRcdC8vxZLvrIHigJPDn+KXisK/4peK4oCd4oir4omIXG4gICAgSU5WQUxJRF9DSEFJUjogMHhGRkZGLFx0XHRcdFx0XHRcdC8vxZLvrIHigJPDn+KAnMWS4peK4oCd4oir4omIXG4gICAgSU5WQUxJRF9JVEVNOiAweEZGRkYsXG5cbiAgICBITUFUQ0hfUE9SVF9NSU46IDEwMDAwLFx0XHRcdFx0XHRcdFx0Ly/igJPCsMKgwrHCu8K44peKw5PigJPCsOKIgsOAw7jigYTiiKviiYhcbiAgICBITUFUQ0hfUE9SVF9NQVg6IDIwMDAwLFx0XHRcdFx0XHRcdFx0Ly/igJPCsMKgwrHCu8K44peKw5PCpcOb4oiCw4DDuOKBhOKIq+KJiFxuICAgIEhNQVRDSF9TSUdOX01BWDogOTksXHRcdFx0XHRcdFx0XHRcdC8v4oCTwrDCoMKxwrvCuMK14oCi4omlwrDCscK7wrvCuMKxwq7iiJrLmsK7w4DCoMud4oCmxZPFk++sgVxuICAgIEhNQVRDSF9NQVhPTkxJTkU6IDUwMCxcblxuICAgIE1BWF9BTkRST0lEOiAxMCxcdFx0XHRcdFx0XHRcdFx0Ly/mnIDlpKfmnLrlmahcbiAgICBNQVhfQ0hBVF9MRU46IDEyOCxcdFx0XHRcdFx0XHRcdFx0Ly/ogYrlpKnplb/luqZcbiAgICBMSU1JVF9DSEFUX1RJTUVTOiAxMjAwLFx0XHRcdFx0XHRcdFx0Ly/pmZDml7bogYrlpKlcbiAgICAvL+ato+W8j+acjeWKoeWZqOWcsOWdgFxuICAgIGh0dHBJbml0VXJsOiBcImh0dHA6Ly92ZXIuampoZ2FtZS5jb20vSGFuZGxlL2h6L2luaXQuYXNoeFwiLCAgIC8vYXBw5Yid5aeL5YyW5o6l5Y+j5Zyw5Z2AXG4gICAgaHR0cEJhc2VVcmw6IFwiaHR0cDovL2ludGVyZmFjZS5qamhnYW1lLmNvbS9IYW5kbGVcIiwgICAgICAgIC8vd2Vi5o6l5Y+j5Zyw5Z2AXG4gICAgaHR0cE9wZW5Vcmw6IFwiaHR0cDovL3VzZXIuampoZ2FtZS5jb20vZmluZHBhc3N3b3JkSFouYXNweFwiLCAgLy/mib7lm57lr4bnoIFcbiAgICBodHRwVXNlckNlbnRlcjogXCJodHRwOi8vZi5qamhnYW1lLmNvbS9IYW5kbGVcIiwgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S4reW/g1xuICAgIExPR09OX1NFUlZFUl9ET01BSU46IFwibm5hcHAuampoZ2FtZS5jb21cIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXmnI3liqHlmahcbiAgICBMT0dPTl9TRVJWRVJfSVA6IFwiMTIyLjIyNi4xODYuMzhcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvlvZXmnI3liqHlmahcbiAgICBQT1JUX0xPR09OX1NFUlZFUjogOTAwOSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nmbvpmYbmnI3liqHlmahcblxuLy/nq6/lj6PlrprkuYlcbiAgICBQT1JUX1ZJREVPX1NFUlZFUjogNzYwMCxcdFx0XHRcdFx0XHRcdFx0Ly/op4bpopHmnI3liqHlmahcbiAgICBQT1JUX0NFTlRFUl9TRVJWRVI6IDkwOTAsXHRcdFx0XHRcdFx0XHRcdC8v5Lit5b+D5pyN5Yqh5ZmoXG5cbiAgICBDSEFOTkVMSURfaW5pdDogMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4oOmBk+WPt1xuICAgIENIQU5ORUxJRF9jZW50ZXI6IDcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muKDpgZPlj7dcbi8v572R57uc5pWw5o2u5a6a5LmJXG4gICAgU09DS0VUX1ZFUjogMHg4QyxcdFx0XHRcdFx0XHRcdFx0Ly/nvZHnu5zniYjmnKxcbiAgICBTT0NLRVRfQlVGRkVSOiA4MTkyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nvZHnu5znvJPlhrJcbiAgICBTT0NLRVRfUEFDS0VUOiA4MTkyLFxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIC8v5YaF5qC45ZG95Luk56CBXG4gICAgTURNX0tOX0NPTU1BTkQ6IDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WGheaguOWRveS7pFxuICAgIFNVQl9LTl9ERVRFQ1RfU09DS0VUOiA1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mo4DmtYvlkb3ku6RcbiAgICBTVUJfS05fU0hVVF9ET1dOX1NPQ0tFVDogOSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Lit5pat572R57ucXG5cbiAgICAvL0lQQyDmlbDmja7lrprkuYlcbiAgICBJUENfVkVSOiAweDAwMDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JUEMg54mI5pysXG4gICAgSVBDX0lERU5USUZJRVI6IDB4MDAwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+agh+ivhuWPt+eggVxuICAgIElQQ19QQUNLQUdFOiA0MDk2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mnIDlpKcgSVBDIOWMhVxuICAgIElQQ19CVUZGRVI6IDQwOTYsICAgIC8v57yT5Yay6ZW/5bqmXG5cbiAgICBUWVBFX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vw7fDt8K/4oCh4omlwqfiiILCu1xuICAgIEtJTkRfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/Cv+KAoeKAk8OV4omlwqfiiILCu1xuICAgIFNUQVRJT05fTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igJnDpsK14oCe4omlwqfiiILCu1xuICAgIFNFUlZFUl9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KIkcO4wrrigLDiiaXCp+KIgsK7XG4gICAgTU9EVUxFX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vzqnCr+KJpcOD4omlwqfiiILCu1xuXG4gICAgLy/igJPigJjCse+jv+KIgsKu4oCcw4JcbiAgICBHRU5ERVJfTlVMTDogMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vxZLCpcO34oSi4oCT4oCYwrHvo79cbiAgICBHRU5ERVJfQk9ZOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/GkuKAk+KAk+KAmOKAk+KAmMKx76O/XG4gICAgR0VOREVSX0dJUkw6IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KJiMOG4oCT4oCY4oCT4oCYwrHvo79cblxuICAgIC8v4oCdxZLFk+KIkcK/4oCh4oCTw5VcbiAgICBHQU1FX0dFTlJFX1NDT1JFOiAweDAwMDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/CteKAnsO3wrXCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9HT0xEOiAweDAwMDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/Cv8O34oiCz4DCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9NQVRDSDogMHgwMDA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vwrHCu8K7wrjCv+KAoeKAk8OVXG4gICAgR0FNRV9HRU5SRV9FRFVDQVRFOiAweDAwMDgsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/igJTCtcKh4oiRwr/igKHigJPDlVxuICAgIEdBTUVfR0VOUkVfUVRIRVJNQVRDSDogMHgwMDE2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6Ieq5a6a5LmJ5q+U6LWb57G75Z6LXG5cbiAgICAvL+KAneKImsKqw5/il4rCpcODwqjiiILCruKAnMOCXG4gICAgVVNfTlVMTDogMHgwMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5rKh5pyJ54q25oCBXG4gICAgVVNfRlJFRTogMHgwMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56uZ56uL54q25oCBXG4gICAgVVNfU0lUOiAweDAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnZDkuIvnirbmgIFcbiAgICBVU19SRUFEWTogMHgwMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZCM5oSP54q25oCBXG4gICAgVVNfTE9PS09OOiAweDA0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ml4Hop4LnirbmgIFcbiAgICBVU19QTEFZOiAweDA1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcbiAgICBVU19PRkZMSU5FOiAweDA2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mlq3nur/nirbmgIFcblxuICAgIC8v4omlwqfiiILCu+KIq8ON4oiCwq7igJzDglxuICAgIE5BTUVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiJrLmuKXisO34omlwqfiiILCu1xuICAgIFBBU1NfTEVOOiAzMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiJrigLnCrMOO4omlwqfiiILCu1xuICAgIEVNQUlMX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oCdwqDFk+KAsOKJpcKn4oiCwrtcbiAgICBHUk9VUF9MRU46IDMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+KApsOBw5XiiYjiiaXCp+KIgsK7XG4gICAgQ09NUFVURVJfSURfTEVOOiAzMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/CqsuZ4oiGy5zigJPDmsKh4oCTXG4gICAgVU5ERVJfV1JJVEVfTEVOOiAzMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/iiI/LhuKAk+KAmMKrwqniiJrLmlxuICAgIE1PQklMRVBIT05FX0xFTjogMzIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v4oiPy4bigJPigJjCq8Kp4oiay5pcblxuICAgIC8vR2xvYmFsRnJhbWUuaFxuICAgIC8v5a6P5a6a5LmJXG5cbiAgICAvL+a4uOaIj+eKtuaAgVxuICAgIEdTX0ZSRUU6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56m66Zey54q25oCBXG4gICAgR1NfUExBWUlORzogMTAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/nirbmgIFcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy9JUEMg572R57uc5LqL5Lu2XG5cbiAgICBJUENfTUFJTl9TT0NLRVQ6IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc5raI5oGvXG5cbiAgICBJUENfU1VCX1NPQ0tFVF9TRU5EOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+e9kee7nOWPkemAgVxuICAgIElQQ19TVUJfU09DS0VUX1JFQ1Y6IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v572R57uc5o6l5pS2XG5cbiAgICBJUENfTUFJTl9DT05GSUc6IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YWN572u5L+h5oGvXG5cbiAgICBJUENfU1VCX1NFUlZFUl9JTkZPOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+aIv+mXtOS/oeaBr1xuICAgIElQQ19TVUJfQ09MVU1OX0lORk86IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YiX6KGo5L+h5oGvXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vSVBDIOeUqOaIt+S/oeaBr1xuXG4gICAgSVBDX01BSU5fVVNFUjogMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLfkv6Hmga9cblxuICAgIElQQ19TVUJfVVNFUl9DT01FOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+S/oeaBr1xuICAgIElQQ19TVUJfVVNFUl9TVEFUVVM6IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi354q25oCBXG4gICAgSVBDX1NVQl9VU0VSX1NDT1JFOiAzLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+eUqOaIt+enr+WIhlxuICAgIElQQ19TVUJfR0FNRV9TVEFSVDogNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/lvIDlp4tcbiAgICBJUENfU1VCX0dBTUVfRklOSVNIOiA1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adn1xuICAgIElQQ19TVUJfVVBEQVRFX0ZBQ0U6IDYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5pu05paw5aS05YOPXG4gICAgSVBDX1NVQl9NRU1CRVJPUkRFUjogNywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDlpLTlg49cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy9JUEMg5o6n5Yi25L+h5oGvXG5cbiAgICBJUENfTUFJTl9DT05DVFJPTDogNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mjqfliLbkv6Hmga9cblxuICAgIElQQ19TVUJfU1RBUlRfRklOSVNIOiAxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WQr+WKqOWujOaIkFxuICAgIElQQ19TVUJfQ0xPU0VfRlJBTUU6IDIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YWz6Zet5qGG5p62XG4gICAgSVBDX1NVQl9KT0lOX0lOX0dBTUU6IDMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Yqg5YWl5ri45oiPXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8v572R57uc5ZG95Luk56CBXG5cbiAgICBNRE1fR0ZfR0FNRTogOTksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/mtojmga9cbiAgICBNRE1fR0ZfRlJBTUU6IDk4LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5qGG5p625raI5oGvXG4gICAgTURNX0dGX1BSRVNFTlQ6IDk3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v56S854mp5raI5oGvXG4gICAgTURNX0dGX0JBTks6IDk2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6ZO26KGM5raI5oGvXG5cbiAgICBTVUJfR0ZfSU5GTzogMTExLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/muLjmiI/kv6Hmga9cbiAgICBTVUJfR0ZfVVNFUl9SRUFEWTogMTEyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/nlKjmiLflkIzmhI9cbiAgICBTVUJfR0ZfTE9PS09OX0NPTlRST0w6IDExMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5peB6KeC5o6n5Yi2XG4gICAgU1VCX0dGX0tJQ0tfVEFCTEVfVVNFUjogMTE0LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ouKLotbDnlKjmiLdcbiAgICBTVUJfR0ZfV1JJVEVfTUFUQ0hfU0NPUkU6IDExNSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5YaZ5q+U6LWb5oiQ57upXG5cbiAgICBTVUJfR0ZfT1BUSU9OOiAxMTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+a4uOaIj+mFjee9rlxuICAgIFNVQl9HRl9TQ0VORTogMTE3LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lnLrmma/kv6Hmga9cblxuICAgIFNVQl9HRl9VU0VSX0NIQVQ6IDExOCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi36IGK5aSpXG5cbiAgICBTVUJfR0ZfTUVTU0FHRTogMTE5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/ns7vnu5/mtojmga9cblxuICAgIC8vU1VCX0dGX0dJRlQ6IDQwMCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6LWg6YCB5raI5oGvXG5cbiAgICBTVUJfR0ZfQkFOS19TVE9SQUdFOiAyNTAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mTtuihjOWtmOWCqFxuICAgIFNVQl9HRl9CQU5LX0dFVDogMjUxLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pk7booYzmj5Dlj5ZcbiAgICBTVUJfR0ZfQkFOS19QUkVTRU5UOiAyNTIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i1oOmAgemHkeW4gVxuICAgIFNVQl9HRl9CQU5LX01PRElGWV9QQVNTOiAyNTMsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/ruaUueWvhueggVxuICAgIFNVQl9HRl9CQU5LX1FVRVJZOiAyNTQsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+afpeivoumHkeW4gVxuICAgIFNVQl9HRl9CQU5LX1BSRVNFTlRfUVVSRVk6IDI1NSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i55So5oi3XG4gICAgU1VCX0dGX0JBTktfQ0xPU0U6IDI1NiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YCA5Ye6XG4gICAgU1VCX0dGX1RSQU5fUkVDT1JEOiAyNTcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+i9rOW4kOiusOW9lVxuICAgIFNVQl9HRl9VU0VSX0lORk9fUVVSRVk6IDI1OCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5p+l6K+i55So5oi3XG4gICAgU1VCX0dGX1VTRVJfUkVDSEFSR0U6IDI1OSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v55So5oi35YWF5YC8XG5cbiAgICBTVUJfR0ZfRkxPV0VSX0FUVFJJQlVURTogNTMwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pspzoirHlsZ7mgKdcbiAgICBTVUJfR0ZfRkxPV0VSOiA1MzEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mynOiKsea2iOaBr1xuICAgIFNVQl9HRl9FWENIQU5HRV9DSEFSTTogNTMyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lhZHmjaLprYXliptcblxuICAgIFNVQl9HRl9QUk9QRVJUWTogNTEwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pgZPlhbfmtojmga9cbiAgICBTVUJfR0ZfUFJPUEVSVFlfUkVTVUxUOiA1MTEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+mBk+WFt+e7k+aenFxuICAgIFNVQl9HRl9SRVNJRFVBTF9QUk9QRVJUWTogNTEyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/liankvZnpgZPlhbdcbiAgICBTVUJfR0ZfUFJPUF9BVFRSSUJVVEU6IDUxMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v6YGT5YW35bGe5oCnXG4gICAgU1VCX0dGX1BST1BfQlVHTEU6IDUxNCwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ZaH5Y+t6YGT5YW3XG4gICAgU1VCX0dGX1FVRVJZX1VTRVJfSU5GTzogNTE1LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/pspzoirHmtojmga9cbiAgICBTVUJfR0ZfU0VORF9IT05HX0JBTzogNTE2LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lj5HnuqLljIVcbiAgICBTVUJfR0ZfUUlBTkdfSE9OR19CQU86IDUxNywgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+R57qi5YyFXG5cbiAgICAvL+a2iOaBr+exu+Wei1xuICAgIFNNVF9JTkZPOiAweDAwMDEsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+S/oeaBr+a2iOaBr1xuICAgIFNNVF9FSkVDVDogMHgwMDAyLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lvLnlh7rmtojmga9cbiAgICBTTVRfR0xPQkFMOiAweDAwMDQsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFqOWxgOa2iOaBr1xuICAgIFNNVF9DTE9TRV9HQU1FOiAweDEwMDAsICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WFs+mXrea4uOaIj1xuXG4gICAgLy/lj5HpgIHlnLrmiYBcbiAgICBMT0NBVElPTl9HQU1FX1JPT006IDEsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5ri45oiP5oi/6Ze0XG4gICAgTE9DQVRJT05fUExBWkFfUk9PTTogMiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lpKfljoXmiL/pl7RcblxufVxubW9kdWxlLmV4cG9ydHMgPSBHbG9iYWxEZWY7XG4iLCJyZXF1aXJlKFwiTUQ1XCIpO1xuZnVuY3Rpb24gQWN0aW9uU2hvd1RhbkNodWFuZyh3aWRnZXQsIGNiKXtcbiAgICBpZiAoY2MuaXNWYWxpZCh3aWRnZXQpID09PSBmYWxzZSApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbR2xvYmFsRnVuXVtBY3Rpb25TaG93VGFuQ2h1YW5nXSB3aWRnZXQgaXMgaW52YWxpZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aWRnZXQub3BhY2l0eSA9IDA7XG4gICAgd2lkZ2V0LnNjYWxlID0gMC4wMTtcbiAgICB3aWRnZXQucnVuQWN0aW9uKGNjLnNwYXduKFxuICAgICAgICAgICAgY2MuZmFkZUluKDAuMjUpLFxuICAgICAgICAgICAgY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjIsIDEuMSksY2Muc2NhbGVUbygwLjA1LCAxLjApKSxjYy5jYWxsRnVuYyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihjYikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgKSk7XG59XG5mdW5jdGlvbiBzaG93VG9hc3QoY29udGV4dCxtZXNzYWdlKSB7XG4gICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwcmVmYWIvVG9hc3RWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIFRvYXN0UHJlZmFiKSB7XG4gICAgICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKFRvYXN0UHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUuZ2V0Q29tcG9uZW50KFwiVG9hc3RWaWV3XCIpLm9uSW5pdCh7bWVzc2FnZTptZXNzYWdlfSk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgQWN0aW9uU2hvd1RhbkNodWFuZyhuZXdOb2RlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvd1RvYXN0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dBbGVydChjb250ZXh0LG1lc3NhZ2UpIHtcbiAgICBpZiAoY2MuaXNWYWxpZChjb250ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9BbGVydFZpZXdcIiwgZnVuY3Rpb24gKGVyciwgQWxlcnRQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoQWxlcnRQcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJBbGVydFZpZXdcIikuaW5pdCh7bWVzc2FnZTptZXNzYWdlfSk7XG4gICAgICAgICAgICBjb250ZXh0LmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93QWxlcnRcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qXG5zaG93UG9wV2FpdGluZygpXG5AcGFyYW1ze1xuICAgIHdhaXRpbmdUZXh0OiDnlYzpnaLmmL7npLrnmoTmloflrZcsXG4gICAgd2FpdGluZ1RpbWU6IOeVjOmdouWtmOWcqOeahOaXtumXtCzotoXml7bljbPplIDmr4HnlYzpnaIsXG4gICAgY2xvc2VFdmVudDog5YWz6Zet55WM6Z2i55uR5ZCs55qE5LqL5Lu2LCBcbiAgICBjYWxsQmFja0Z1bmM6IOaUtuWIsOebkeWQrOS6i+S7tuaJp+ihjOeahOWbnuiwg+WHveaVsCxcbn1cbiovXG5mdW5jdGlvbiBzaG93UG9wV2FpdGluZyhjb250ZXh0LHBhcmFtcykge1xuICAgIGlmIChjYy5pc1ZhbGlkKGNvbnRleHQpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL1BvcFdhaXRpbmdWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIFBvcFdhaXRQcmVmYWIpIHtcbiAgICAgICAgaWYgKGNjLmlzVmFsaWQoY29udGV4dCkpIHtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUoUG9wV2FpdFByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIlBvcFdhaXRWaWV3XCIpLm9uSW5pdChwYXJhbXMpO1xuICAgICAgICAgICAgY29udGV4dC5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNob3dQb3BXYWl0aW5nXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldHNpZ24ocGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zICsgXCJrZXk9ZmdyN2hrNWRzMzVoMzBobmo3aHdhczRnZnk2c2o3OHhcIjsvL+WKoOWFpWtleVxuICAgIHJldHVybiBjYy5tZDVFbmNvZGUocGFyYW1zKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5mdW5jdGlvbiBidWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpIHtcbiAgICB2YXIgbm93VGltZSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKS8xMDAwKTtcbiAgICBwYXJhbXNbXCJkYXRldGFtcFwiXSA9IG5vd1RpbWU7XG4gICAgdmFyIHNvcnRfcGFyYW1zID0gT2JqZWN0LmtleXMocGFyYW1zKS5zb3J0KClcbiAgICBjb25zb2xlLmxvZyhcIltHbG9iYWxGdW5dW2J1aWxkUmVxdWVzdFBhcmFtXSBcIiArIEpTT04uc3RyaW5naWZ5KHBhcmFtcyxudWxsLCcgJykpO1xuICAgIHZhciBwYXJhbVN0cmluZyA9IFwiXCI7XG4gICAgZm9yICh2YXIga2kgaW4gc29ydF9wYXJhbXMpIHtcbiAgICAgICAgdmFyIGtleSA9IHNvcnRfcGFyYW1zW2tpXTtcbiAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcGFyYW1TdHJpbmcgPSBwYXJhbVN0cmluZyArIGtleSArIFwiPVwiICsgZWxlbWVudCArIFwiJlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhcmFtU3RyaW5nID0gcGFyYW1TdHJpbmcgKyBcInNpZ249XCIgKyBnZXRzaWduKHBhcmFtU3RyaW5nKTtcbiAgICByZXR1cm4gcGFyYW1TdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGlwVG9OdW1iZXIoaXApIHtcblx0dmFyIG51bSA9IDA7XG5cdGlmKGlwID09IFwiXCIpIHtcblx0XHRyZXR1cm4gbnVtO1xuXHR9ICAgIFxuICAgIHZhciBhTnVtID0gaXAuc3BsaXQoXCIuXCIpOyBcbiAgICBpZihhTnVtLmxlbmd0aCAhPSA0KSB7XG4gICAgXHRyZXR1cm4gbnVtO1xuICAgIH0gICBcbiAgICBudW0gKz0gcGFyc2VJbnQoYU51bVswXSkgPDwgMjQ7XG4gICAgbnVtICs9IHBhcnNlSW50KGFOdW1bMV0pIDw8IDE2O1xuICAgIG51bSArPSBwYXJzZUludChhTnVtWzJdKSA8PCA4O1xuICAgIG51bSArPSBwYXJzZUludChhTnVtWzNdKSA8PCAwO1xuICAgIG51bSA9IG51bSA+Pj4gMDsvL+i/meS4quW+iOWFs+mUru+8jOS4jeeEtuWPr+iDveS8muWHuueOsOi0n+aVsOeahOaDheWGtVxuICAgIHJldHVybiBudW07ICBcbn0gICAgXG4gIFxuZnVuY3Rpb24gbnVtYmVyVG9JcChudW1iZXIpIHsgICAgXG4gICAgdmFyIGlwID0gXCJcIjtcbiAgICBpZihudW1iZXIgPD0gMCkge1xuICAgIFx0cmV0dXJuIGlwO1xuICAgIH1cbiAgICB2YXIgaXAzID0gKG51bWJlciA8PCAwICkgPj4+IDI0O1xuICAgIHZhciBpcDIgPSAobnVtYmVyIDw8IDggKSA+Pj4gMjQ7XG4gICAgdmFyIGlwMSA9IChudW1iZXIgPDwgMTYpID4+PiAyNDtcbiAgICB2YXIgaXAwID0gKG51bWJlciA8PCAyNCkgPj4+IDI0XG4gICAgXG4gICAgaXAgKz0gaXAwICsgXCIuXCIgKyBpcDEgKyBcIi5cIiArIGlwMiArIFwiLlwiICsgaXAzO1xuICAgIFxuICAgIHJldHVybiBpcDsgICBcbn1cbi8v5pWw5a2X5aGr5YWF5YmN57yAMFxuZnVuY3Rpb24gUHJlZml4SW50ZWdlcihudW0sIGxlbmd0aCkge1xuICAgIHJldHVybiAoQXJyYXkobGVuZ3RoKS5qb2luKCcwJykgKyBudW0pLnNsaWNlKC1sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBY3Rpb25TaG93VGFuQ2h1YW5nOiBBY3Rpb25TaG93VGFuQ2h1YW5nLFxuICAgIHNob3dUb2FzdDogc2hvd1RvYXN0LFxuICAgIHNob3dBbGVydDogc2hvd0FsZXJ0LFxuICAgIHNob3dQb3BXYWl0aW5nOiBzaG93UG9wV2FpdGluZyxcbiAgICBidWlsZFJlcXVlc3RQYXJhbTogYnVpbGRSZXF1ZXN0UGFyYW0sXG4gICAgaXBUb051bWJlcjppcFRvTnVtYmVyLFxuICAgIG51bWJlclRvSXA6bnVtYmVyVG9JcCxcbiAgICBQcmVmaXhJbnRlZ2VyOlByZWZpeEludGVnZXIsXG59OyIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHtcbiAgICB3RmFjZUlEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5aS05YOP57Si5byVXG4gICAgY2JHZW5kZXI6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgIGNiTWVtYmVyOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/kvJrlkZjnrYnnuqdcbiAgICBpc0d1ZXN0OiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/mmK/lkKbmmK/muLjlrqJcbiAgICBpc09wZW5SZWdpc3RlcjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/ms6jlhozlip/og71cbiAgICBpc09wZW5JQVA6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgLy/mmK/lkKblvIDlkK/oi7nmnpxpYXBcbiAgICB3RW5jcnlwdElEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/pmo/mnLrnoIExXG4gICAgd0NvZGVDaGVja0lEOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgIGR3VXNlcklEOiB1bmRlZmluZWQsXHRcdFx0XHRcdFx0Ly/nlKjmiLcgSSBEXG4gICAgZHdHYW1lSUQ6IHVuZGVmaW5lZCxcdFx0XHRcdFx0XHQvL+a4uOaIjyBJIERcbiAgICBkd0V4cGVyaWVuY2U6IHVuZGVmaW5lZCxcdFx0XHRcdFx0Ly/nlKjmiLfnu4/pqoxcbiAgICBzek1vYmlsZUF1dGg6IHVuZGVmaW5lZCwgICAgICAgICAvL+azqOWGjOaXtumqjOivgeeggVxuICAgIHN6QWNjb3VudHM6IHVuZGVmaW5lZCxcdFx0XHQvL+eZu+W9leW4kOWPt1xuICAgIHN6Tmlja05hbWU6IHVuZGVmaW5lZCwgICAgICAgICAgIC8v546p5a625pi156ewXG4gICAgc3pQYXNzV29yZDogdW5kZWZpbmVkLFx0XHRcdC8v55m75b2V5a+G56CBXG4gICAgc3pHcm91cE5hbWU6IHVuZGVmaW5lZCxcdFx0XHQvL+ekvuWbouS/oeaBr1xuICAgIHN6VW5kZXJXcml0ZTogdW5kZWZpbmVkLFx0Ly/kuKrmgKfnrb7lkI1cbiAgICBcbiAgICAvL+aJqeWxleS/oeaBr1xuICAgIGR3Q3VzdG9tRmFjZVZlcjogdW5kZWZpbmVkLFx0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAvL+mSsVxuICAgIGR3Rm9ydHVuZUNvaW46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+emj+W4gVxuICAgIGxsR2FtZVNjb3JlOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8v5ri45oiP6YeR5biBXG4gICAgbGxJbnN1cmVTY29yZTogdW5kZWZpbmVkLFx0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgIGR3Q291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAvL+i0neWjs1xuICAgIGR3SW5zdXJlQ291cG9uOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAvL+mTtuihjOi0neWjs1xuICAgIGR3TWF0Y2hUaWNrZXQ6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvL+WPgui1m+WIuFxuICAgIGlzRmlyc3RCYW5rOiB1bmRlZmluZWQsXHRcdFx0XHRcdC8vIOmmluasoeS9v+eUqFxuXG4gICAgcm9vbUxpc3Q6IFtdLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19JT1Mpe1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc09wZW5JQVAgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcImpzb24vc2hvcHBhZ2VcIiwgZnVuY3Rpb24gKGVyciwgY29udGVudCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29udGVudCk7XG4gICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zaG9wRGF0YSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIltHbG9iYWxVc2VyRGF0YV1baW5pdF0gXCIrSlNPTi5zdHJpbmdpZnkoR2xvYmFsVXNlckRhdGEuc2hvcERhdGEsIG51bGwsICcgJykpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yb29tTGlzdCA9IFtdO1xuICAgIH0sXG4gICAgb25Mb2FkRGF0YTogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyBzdHJ1Y3QgQ01EX0dQX0xvZ29uU3VjY2Vzc01vYmlsZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICAvL+aJqeWxleS/oeaBr1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdDdXN0b21GYWNlVmVyO1x0XHRcdFx0Ly/lpLTlg4/niYjmnKxcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JNb29yTWFjaGluZTtcdFx0XHRcdFx0Ly/plIHlrprmnLrlmahcbiAgICAgICAgLy8gICAgIEJZVEVcdFx0XHRcdFx0XHRcdFx0Y2JCaW5kV2VpWGluO1x0XHRcdFx0XHQvL+e7keWumuW+ruS/oSBXU0xcbiAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0ZhY2VJRDtcdFx0XHRcdFx0XHQvL+WktOWDj+e0ouW8lVxuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYk1lbWJlcjtcdFx0XHRcdFx0XHQvL+S8muWRmOetiee6p1xuICAgICAgICAvLyAgICAgQllURVx0XHRcdFx0XHRcdFx0XHRjYkdlbmRlcjtcdFx0XHRcdFx0XHQvL+eUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3RW5jcnlwdElEO1x0XHRcdFx0XHRcdC8v6ZqP5py656CBMVxuICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3Q29kZUNoZWNrSUQ7XHRcdFx0XHRcdC8v6ZqP5py656CBMlxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdFeHBlcmllbmNlO1x0XHRcdFx0XHQvL+eUqOaIt+e7j+mqjFxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdHYW1lSUQ7XHRcdFx0XHRcdFx0Ly/muLjmiI8gSSBEXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1VzZXJJRDtcdFx0XHRcdFx0XHQvL+eUqOaItyBJIERcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEdhbWVTY29yZTtcdFx0XHRcdFx0Ly/muLjmiI/ph5HluIFcbiAgICAgICAgLy8gICAgIExPTkdMT05HXHRcdFx0XHRcdFx0XHRsbEluc3VyZVNjb3JlO1x0XHRcdFx0XHQvL+mTtuihjOmHkeW4gVxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pBY2NvdW50c1tOQU1FX0xFTl07XHRcdFx0Ly/nmbvlvZXluJDlj7dcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6Tmlja05hbWVbTkFNRV9MRU5dO1x0XHRcdC8v5pi156ewXG4gICAgICAgIC8vIH07XG4gICAgICAgIHRoaXMuZHdDdXN0b21GYWNlVmVyID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuY2JNb29yTWFjaGluZSA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JCaW5kV2VpWGluID0gcERhdGEucmVhZGJ5dGUoKTtcbiAgICAgICAgdGhpcy53RmFjZUlEID0gcERhdGEucmVhZHdvcmQoKTtcbiAgICAgICAgdGhpcy5jYk1lbWJlciA9IHBEYXRhLnJlYWRieXRlKCk7XG4gICAgICAgIHRoaXMuY2JHZW5kZXIgPSBwRGF0YS5yZWFkYnl0ZSgpO1xuICAgICAgICB0aGlzLndFbmNyeXB0SUQgPSBwRGF0YS5yZWFkd29yZCgpO1xuICAgICAgICB0aGlzLndDb2RlQ2hlY2tJRCA9IHBEYXRhLnJlYWR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdFeHBlcmllbmNlID0gcERhdGEucmVhZGR3b3JkKCk7XG4gICAgICAgIHRoaXMuZHdHYW1lSUQgPSBwRGF0YS5yZWFkZHdvcmQoKTtcbiAgICAgICAgdGhpcy5kd1VzZXJJRCA9IHBEYXRhLnJlYWRkd29yZCgpO1xuICAgICAgICB0aGlzLmxsR2FtZVNjb3JlID0gcERhdGEucmVhZGludDY0KCk7XG4gICAgICAgIHRoaXMubGxJbnN1cmVTY29yZSA9IHBEYXRhLnJlYWRpbnQ2NCgpO1xuICAgICAgICB0aGlzLnN6QWNjb3VudHMgPSBwRGF0YS5yZWFkc3RyaW5nKDMyKTtcbiAgICAgICAgdGhpcy5zek5pY2tOYW1lID0gcERhdGEucmVhZHN0cmluZygzMik7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAvLyBmb3IgKHZhciBwcm9wIGluIHRoaXMpIHtcbiAgICAgICAgLy8gICAgIGlmICh0eXBlb2YodGhpc1twcm9wXSkgPT0gXCJmdW5jdGlvblwiKSBjb250aW51ZTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd0aGlzLicgKyBwcm9wLCAnPScsIHRoaXNbcHJvcF0pO1xuICAgICAgICAvLyB9XG4gICAgfSxcbiAgICBnZXRSb29tQnlHYW1lOiBmdW5jdGlvbiAod0tpbmRJRCkge1xuICAgICAgICB2YXIgcm9vbUxpc3QgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucm9vbUxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMucm9vbUxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQud0tpbmRJRCA9PSB3S2luZElEKSB7XG4gICAgICAgICAgICAgICAgcm9vbUxpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm9vbUxpc3Q7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2xvYmFsVXNlckRhdGE7IiwicmVxdWlyZShcIk1ENVwiKTtcbnZhciBnYW1lX2NtZCA9IHJlcXVpcmUoXCJDTURfR2FtZVwiKTtcbnZhciBwbGF6YV9jbWQgPSByZXF1aXJlKFwiQ01EX1BsYXphXCIpO1xudmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlZmF1bHRzLCBzZXQgdmlzdWFsbHkgd2hlbiBhdHRhY2hpbmcgdGhpcyBzY3JpcHQgdG8gdGhlIENhbnZhc1xuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkISdcbiAgICB9LFxuICAgIC8vIG5hbWU6IFwiaGVsbG9GcmFtZVwiLFxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBqc2JUZXN0LnRlc3Rsb2coKTtcbiAgICAgICAgLy8gdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyB0aGlzLnNvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQoZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2JlZ2luJyk7XG4gICAgICAgIC8vICAgICAvLyB2YXIgbWFpbklEID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICAvLyAgICAgLy8gdmFyIHN1YklEID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhtYWluSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coc3ViSUQpO1xuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2VuZCcpO1xuICAgICAgICAvLyAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIC8vIHZhciBwRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgLy8gLy8gcERhdGEuc2V0Y21kaW5mbygyLDMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgLy8gLy8gcERhdGEucHVzaHdvcmQoMjMzMzMpO1xuICAgICAgICAvLyAvLyBwRGF0YS5wdXNoZG91YmxlKDEyMy4zNDM0KTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0bWFpbigpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEuZ2V0c3ViKCkpO1xuICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkYnl0ZSgpKTtcbiAgICAgICAgLy8gLy8gY29uc29sZS5sb2cocERhdGEucmVhZHdvcmQoKSk7XG4gICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRkb3VibGUoKSk7XG4gICAgICAgIC8vIHRoaXMuc29ja2V0LkNvbm5lY3RTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpO1xuICAgICAgICB0aGlzLm9uQ3JlYXRlU29ja2V0KFwiMTIyLjIyNi4xODYuMzhcIiw5MDA5KTtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSB0aGlzLnRleHQ7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBvblNvY2tldENhbGxCYWNrOiBmdW5jdGlvbihwRGF0YSkge1xuICAgIC8vICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdmFyIG1haW4gPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgLy8gICAgIHZhciBzdWIgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ21haW4gPSAnK21haW4rJyBzdWIgPSAnK3N1Yik7XG4gICAgLy8gICAgIGlmIChtYWluID09PSAwKSBcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgaWYoc3ViID09PSAwKVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZWxzZVxuICAgIC8vICAgICAgICAge1xuICAgIC8vICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZWxzZVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQocERhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGVsbG9fb25Db25uZWN0Q29tcGVsZXRlZCcpO1xuICAgIH0sXG4gICAgLy8gb25Tb2NrZXRFcnJvcjpmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdvblNvY2tldEVycm9yJyk7XG4gICAgLy8gfSxcbiAgICAvLyBvblNvY2tldEV2ZW50OiBmdW5jdGlvbihwRGF0YSl7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwib25Tb2NrZXRFdmVudFwiKTtcbiAgICAvLyB9LFxuICAgIHNlbmRMb2dvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxvZ29uRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgbG9nb25EYXRhLnNldGNtZGluZm8ocGxhemFfY21kLk1ETV9HUF9MT0dPTl9NT0JJTEUscGxhemFfY21kLlNVQl9HUF9MT0dPTl9NT0JJTEUpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjE3NjAyMTcwMzEzXCIsMzIpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgdGhpcy5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH1cbn0pO1xuIiwidmFyIEJhc2VGcmFtZSA9IHJlcXVpcmUoXCJCYXNlRnJhbWVcIik7XG5yZXF1aXJlKFwiTUQ1XCIpO1xudmFyIGdhbWVfY21kID0gcmVxdWlyZShcIkNNRF9HYW1lXCIpO1xudmFyIHBsYXphX2NtZCA9IHJlcXVpcmUoXCJDTURfUGxhemFcIik7XG52YXIgempoX2NtZCA9IHJlcXVpcmUoXCJDTURfWmFKaW5IdWFcIik7XG52YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2FtZVNlcnZlckl0ZW0gPSByZXF1aXJlKFwiR2FtZVNlcnZlckl0ZW1cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBCYXNlRnJhbWUsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICAvLyBmb3IgKHZhciBwcm9wIGluIEdsb2JhbFVzZXJEYXRhKSB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ0dsb2JhbFVzZXJEYXRhLicgKyBwcm9wLCAnPScsIEdsb2JhbFVzZXJEYXRhW3Byb3BdKTtcbiAgICAgICAgLy8gfVxuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLl9sb2dvbk1vZGUgPT09IDEpe1xuICAgICAgICAgIHRoaXMuc2VuZFJlZ2lzdGVyKCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMuX2xvZ29uTW9kZSA9PT0gMil7XG4gICAgICAgICAgdGhpcy5zZW5kVmlzaXRvcigpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIuacquefpeeZu+W9leaooeW8j1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKG1haW4sc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmKG1haW4gPT09IHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFKXtcbiAgICAgICAgICAgIHRoaXMub25TdWJMb2dvbkV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NFUlZFUl9MSVNUKXtcbiAgICAgICAgICAgIHRoaXMub25Sb29tTGlzdEV2ZW50KHN1YixwRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtYWluID09PSBwbGF6YV9jbWQuTURNX0dQX1NZU1RFTSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLns7vnu5/mtojmga9cIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU3ViTG9nb25FdmVudDogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGlmIChzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fU1VDQ0VTU19NT0JJTEUpe1xuICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEub25Mb2FkRGF0YShwRGF0YSk7XG4gICAgICAgICAgICB2YXIgYlJlbWVtYmVyUHdkID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIpO1xuICAgICAgICAgICAgaWYoR2xvYmFsVXNlckRhdGEuaXNHdWVzdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQgPSBjYy5tZDVFbmNvZGUodGhpcy5fc3pQYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJSZW1lbWJlclB3ZCA9PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50JywgdGhpcy5fc3pBY2NvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHRoaXMuX3N6UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdhY2NvdW50Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNjLnN5cy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgncGFzc3dvcmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9nb24gc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJMb2dvblN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3ViID09PSBwbGF6YV9jbWQuU1VCX0dQX0xPR09OX0VSUk9SX01PQklMRSkge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9naW4gZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihzdWIgPT09IHBsYXphX2NtZC5TVUJfR1BfTE9HT05fRklOSVNIX01PQklMRSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvZ29uZnJhbWUgbG9naW4gZmluaXNoXCIpO1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJQbGF6YVNjZW5lXCIpO1xuICAgICAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uUm9vbUxpc3RFdmVudDogZnVuY3Rpb24oc3ViLHBEYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9nb25mcmFtZSBvblJvb21MaXN0RXZlbnRcIik7XG4gICAgICAgIHN3aXRjaChzdWIpe1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfVFlQRTpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQl9HUF9MSVNUX1RZUEVcIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHBsYXphX2NtZC5TVUJfR1BfTElTVF9LSU5EOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VCX0dQX0xJU1RfS0lORFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgcGxhemFfY21kLlNVQl9HUF9MSVNUX1NUQVRJT046XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTVUJfR1BfTElTVF9TVEFUSU9OXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBwbGF6YV9jbWQuU1VCX0dQX0xJU1RfU0VSVkVSOlxuICAgICAgICAgICAgICAgIHZhciBwR2FtZVNlcnZlciA9IG5ldyBHYW1lU2VydmVySXRlbSgpO1xuICAgICAgICAgICAgICAgIC8v5ri45oiP5oi/6Ze05YiX6KGo57uT5p6EXG4gICAgICAgICAgICAgICAgLy8gc3RydWN0IHRhZ0dhbWVTZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NvcnRJRDtcdFx0XHRcdFx0XHRcdC8v5o6S5bqP5Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d0tpbmRJRDtcdFx0XHRcdFx0XHRcdC8v5ZCN56ew5Y+356CBXG4gICAgICAgICAgICAgICAgLy8gICAgIFdPUkRcdFx0XHRcdFx0XHRcdFx0d1NlcnZlcklEO1x0XHRcdFx0XHRcdFx0Ly/miL/pl7Tlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U3RhdGlvbklEO1x0XHRcdFx0XHRcdFx0Ly/nq5nngrnlj7fnoIFcbiAgICAgICAgICAgICAgICAvLyAgICAgV09SRFx0XHRcdFx0XHRcdFx0XHR3U2VydmVyUG9ydDtcdFx0XHRcdFx0XHQvL+aIv+mXtOerr+WPo1xuICAgICAgICAgICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd1NlcnZlckFkZHI7XHRcdFx0XHRcdFx0Ly/miL/pl7TlnLDlnYBcbiAgICAgICAgICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdPbkxpbmVDb3VudDtcdFx0XHRcdFx0XHQvL+WcqOe6v+S6uuaVsFxuICAgICAgICAgICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzelNlcnZlck5hbWVbU0VSVkVSX0xFTl07XHRcdFx0Ly/miL/pl7TlkI3np7BcbiAgICAgICAgICAgICAgICAvLyB9O1xuICAgICAgICAgICAgICAgIHBHYW1lU2VydmVyLm9uSW5pdChwRGF0YSk7XG4gICAgICAgICAgICAgICAgLy8gZm9yICh2YXIgcHJvcCBpbiBwR2FtZVNlcnZlcikge1xuICAgICAgICAgICAgICAgIC8vICAgICBpZiAodHlwZW9mKHBHYW1lU2VydmVyW3Byb3BdKSA9PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncEdhbWVTZXJ2ZXIuJyArIHByb3AsICc9JywgcEdhbWVTZXJ2ZXJbcHJvcF0pO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5yb29tTGlzdC5wdXNoKHBHYW1lU2VydmVyKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwR2FtZVNlcnZlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZW5kTG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbG9nb25EYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBsb2dvbkRhdGEuc2V0Y21kaW5mbyhwbGF6YV9jbWQuTURNX0dQX0xPR09OX01PQklMRSxwbGF6YV9jbWQuU1VCX0dQX0xPR09OX01PQklMRSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoempoX2NtZC5LSU5EX0lEKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hkd29yZCgxKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pBY2NvdW50LDMyKTtcbiAgICAgICAgLy8gbG9nb25EYXRhLnB1c2hzdHJpbmcoXCIyNWQ1NWFkMjgzYWE0MDBhZjQ2NGM3NmQ3MTNjMDdhZFwiLDMzKTtcbiAgICAgICAgaWYgKEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QpIHtcbiAgICAgICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6UGFzc3dvcmQsMzMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhjYy5tZDVFbmNvZGUodGhpcy5fc3pQYXNzd29yZCksMzMpO1xuICAgICAgICB9XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKGxvZ29uRGF0YSk7XG4gICAgfSxcbiAgICBzZW5kUmVnaXN0ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVnaXN0ZXJEYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICB2YXIgZHdNb2JpbGVTeXNUeXBlID0gMTtcbiAgICAgICAgaWYoY2Muc3lzLm9zID09IGNjLnN5cy5PU19BTkRST0lEKXtcbiAgICAgICAgICAgIGR3TW9iaWxlU3lzVHlwZSA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0lPUyl7XG4gICAgICAgICAgICBkd01vYmlsZVN5c1R5cGUgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5zZXRjbWRpbmZvKHBsYXphX2NtZC5NRE1fR1BfTE9HT05fTU9CSUxFLHBsYXphX2NtZC5TVUJfR1BfUkVHSVNURVJfTU9CSUxFKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2h3b3JkKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGJ5dGUoMSk7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoZHdvcmQoZHdNb2JpbGVTeXNUeXBlKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hkd29yZCh6amhfY21kLktJTkRfSUQpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zelJlZ0FjY291bnQsMzIpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyhjYy5tZDVFbmNvZGUodGhpcy5fc3pSZWdQYXNzd29yZCksMzMpO1xuICAgICAgICByZWdpc3RlckRhdGEucHVzaHN0cmluZyh0aGlzLl9zek1vYmlsZVBob25lLDMyKTtcbiAgICAgICAgcmVnaXN0ZXJEYXRhLnB1c2hzdHJpbmcodGhpcy5fc3pOaWNrTmFtZSwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKHRoaXMuX3N6TW9iaWxlQXV0aCwzMik7XG4gICAgICAgIHJlZ2lzdGVyRGF0YS5wdXNoc3RyaW5nKFwiXCIsMzMpO1xuICAgICAgICB0aGlzLnNlbmRTb2NrZXREYXRhKHJlZ2lzdGVyRGF0YSk7XG4gICAgICAgIC8vIHN0cnVjdCBDTURfR1BfUmVnaXN0ZXJBY2NvdW50c01vYmxpZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBXT1JEXHRcdFx0XHRcdFx0XHRcdHdGYWNlSUQ7XHRcdFx0XHRcdFx0Ly8g5aS05YOP5qCH6K+GXG4gICAgICAgIC8vICAgICBCWVRFXHRcdFx0XHRcdFx0XHRcdGNiR2VuZGVyO1x0XHRcdFx0XHRcdC8vIOeUqOaIt+aAp+WIq1xuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVTeXNUeXBlO1x0XHRcdFx0Ly/miYvmnLrmk43kvZzns7vnu5/nsbvlnosoMeiLueaenOezu+e7nyAy5a6J5Y2T57O757ufKVxuICAgICAgICAvLyAgICAgRFdPUkRcdFx0XHRcdFx0XHRcdFx0ZHdNb2JpbGVBcHBLaW5kO1x0XHRcdFx0Ly8g5bm/5Zy65omL5py654mI5pysXG4gICAgICAgIC8vICAgICBEV09SRFx0XHRcdFx0XHRcdFx0XHRkd01vYmlsZUFwcFZlcnNpb247XHRcdFx0XHQvLyDlub/lnLrmiYvmnLrniYjmnKxcbiAgICAgICAgLy8gICAgIFRDSEFSXHRcdFx0XHRcdFx0XHRcdHN6QWNjb3VudHNbTkFNRV9MRU5dO1x0XHRcdC8vIOeZu+W9leW4kOWPt1xuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pQYXNzV29yZFtQQVNTX0xFTl07XHRcdFx0Ly8g55m75b2V5a+G56CBXG4gICAgICAgIC8vICAgICBUQ0hBUiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzek1vYmlsZXBob25lW01PQklMRVBIT05FX0xFTl07IC8vIOaJi+aculxuICAgICAgICAvLyAgICAgVENIQVJcdFx0XHRcdFx0XHRcdFx0c3pOaWNrTmFtZVtOQU1FX0xFTl07XHRcdFx0Ly8g5pi156ewXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek1vYmlsZUF1dGhbTkFNRV9MRU5dO1x0XHRcdC8v5omL5py66aqM6K+B56CBXG4gICAgICAgIC8vICAgICBUQ0hBUlx0XHRcdFx0XHRcdFx0XHRzek1vYmlsZU1hY2hpbmVbQ09NUFVURVJfSURfTEVOXTsvL+acuuWZqOW6j+WIl+WPt1xuICAgICAgICAvLyB9O1xuICAgIH0sXG4gICAgc2VuZFZpc2l0b3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNlbmRMb2dvbigpO1xuICAgIH0sXG4gICAgb25Mb2dvbkJ5QWNjb3VudDogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQpIHtcbiAgICAgICAgdGhpcy5fc3pBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelBhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pNb2JpbGVQaG9uZSA9IFwiMDEyMzQ1Njc4OVwiO1xuICAgICAgICBHbG9iYWxVc2VyRGF0YS5pc0d1ZXN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDA7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW2xvZ29uZnJhbWVdW29uTG9nb25CeUFjY291bnRdIFwiK3N6QWNjb3VudCtcIiAjIFwiKyBzelBhc3N3b3JkKTtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvbkxvZ29uQnlBY2NvdW50XVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBvbkxvZ29uQnlWaXNpdG9yOiBmdW5jdGlvbihzekFjY291bnQsc3pQYXNzd29yZCkge1xuICAgICAgICB0aGlzLl9zekFjY291bnQgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6UGFzc3dvcmQgPSBzelBhc3N3b3JkO1xuICAgICAgICB0aGlzLl9zek1vYmlsZVBob25lID0gXCIwMTIzNDU2Nzg5XCI7XG4gICAgICAgIHRoaXMuX2xvZ29uTW9kZSA9IDI7XG4gICAgICAgIGlmKHRoaXMub25DcmVhdGVTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5VmlzaXRvcl1bb25DcmVhdGVTb2NrZXRdIGZhaWxcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJbbG9nb25mcmFtZV1bb25Mb2dvbkJ5VmlzaXRvcl1bb25DcmVhdGVTb2NrZXRdIHN1Y2Nlc3NcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgb25SZWdpc3RlcjogZnVuY3Rpb24oc3pBY2NvdW50LHN6UGFzc3dvcmQsc3pOaWNrTmFtZSxzek1vYmlsZUF1dGgpIHtcbiAgICAgICAgdGhpcy5fc3pSZWdBY2NvdW50ID0gc3pBY2NvdW50O1xuICAgICAgICB0aGlzLl9zelJlZ1Bhc3N3b3JkID0gc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fc3pOaWNrTmFtZSA9IHN6Tmlja05hbWU7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlUGhvbmUgPSBzekFjY291bnQ7XG4gICAgICAgIHRoaXMuX3N6TW9iaWxlQXV0aCA9IHN6TW9iaWxlQXV0aDtcbiAgICAgICAgdGhpcy5fbG9nb25Nb2RlID0gMTtcbiAgICAgICAgaWYodGhpcy5vbkNyZWF0ZVNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvblJlZ2lzdGVyXVtvbkNyZWF0ZVNvY2tldF0gZmFpbFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIltsb2dvbmZyYW1lXVtvblJlZ2lzdGVyXVtvbkNyZWF0ZVNvY2tldF0gc3VjY2Vzc1wiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIFxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGxvZ29uVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgcmVnaXN0ZXJWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25Mb2FkXVwiKTtcbiAgICAgICAgR2xvYmFsVXNlckRhdGEuaW5pdCgpO1xuICAgICAgICB0aGlzLl9sb2dvbkZyYW1lID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChcIkxvZ29uRnJhbWVcIik7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkxvZ29uJyx0aGlzLm9uTG9nb24sdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvblNob3dSZWdpc3RlcicsdGhpcy5vblNob3dSZWdpc3Rlcix0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3Iub24oJ29uUmVnaXN0ZXInLHRoaXMub25SZWdpc3Rlcix0aGlzKTtcbiAgICB9LFxuICAgIG9uRGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25Mb2dvbicsdGhpcy5vbkxvZ29uLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uU2hvd1JlZ2lzdGVyJyx0aGlzLm9uU2hvd1JlZ2lzdGVyLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uUmVnaXN0ZXInLHRoaXMub25SZWdpc3Rlcix0aGlzKTtcbiAgICB9LFxuICAgIG9uTG9nb246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9nb25dXCIpO1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gZXZlbnQuZGV0YWlsLnN6QWNjb3VudDtcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSBldmVudC5kZXRhaWwuc3pQYXNzd29yZDtcbiAgICAgICAgdGhpcy5fbG9nb25GcmFtZS5vbkxvZ29uQnlBY2NvdW50KHN6QWNjb3VudCxzelBhc3N3b3JkKTtcbiAgICAgICAgR2xvYmFsRnVuLnNob3dQb3BXYWl0aW5nKGNjLmRpcmVjdG9yLmdldFNjZW5lKCkse1xuICAgICAgICAgICAgY2xvc2VFdmVudDogXCJMb2dvblN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGNhbGxCYWNrRnVuYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uTG9nb25dIGNhbGxiYWNrZnVuY1wiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgb25SZWdpc3RlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uUmVnaXN0ZXJdXCIpO1xuICAgICAgdmFyIHN6QWNjb3VudCA9IGV2ZW50LmRldGFpbC5zekFjY291bnQ7XG4gICAgICB2YXIgc3pQYXNzd29yZCA9IGV2ZW50LmRldGFpbC5zelBhc3N3b3JkO1xuICAgICAgdmFyIHN6Tmlja05hbWUgPSBldmVudC5kZXRhaWwuc3pOaWNrTmFtZTtcbiAgICAgIHZhciBzek1vYmlsZUF1dGggPSBldmVudC5kZXRhaWwuc3pNb2JpbGVBdXRoO1xuICAgICAgaWYoc3pBY2NvdW50ID09PSB1bmRlZmluZWQgfHwgc3pQYXNzd29yZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25SZWdpc3Rlcl0gc3pBY2NvdW50IG9yIHN6UGFzc3dvcmQgaXMgdW5kZWZpbmVkXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2xvZ29uRnJhbWUub25SZWdpc3RlcihzekFjY291bnQsc3pQYXNzd29yZCxzek5pY2tOYW1lLHN6TW9iaWxlQXV0aCk7XG4gICAgfSxcbiAgICBvblNob3dMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSk7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX2xvZ29uVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9sb2dvblZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmxvZ29uVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fbG9nb25WaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9sb2dvblZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93TG9nb25dQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uU2hvd1Zpc3RvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblNjZW5lXVtvblNob3dWaXN0b3JdXCIpO1xuICAgICAgICAvLyBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmuLjlrqLnmbvlvZXmmoLmnKrlvIDmlL4s5pWs6K+35pyf5b6FIVwiKTtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgdXJsICs9IFwiL0d1ZXN0L0d1ZXN0TG9naW4uYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcImtpbmRpZFwiXSA9IHpqaF9jbWQuS0lORF9JRDtcbiAgICAgICAgcGFyYW1zW1widmVyc2lvbm51bVwiXSA9IFwiMS4xXCI7XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZGVudGl0eVwiXSA9IFwiMmQ0ZDdjOTVlNWRmMDE3OWFmMjQ2NmY2MzVjYTcxZGVcIjtcbiAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG4gICAgICAgIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIyXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB0b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJvc1wiXSA9IFwiMlwiOy8vXCIxXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgIC8vIFwiZGF0ZXRhbXA9MTQ5NzQxMTUxMiZmYWNlSWQ9MiZ1c2VyaWQ9MjcxNDI2NDkmc2lnbj05MDljNDdiNTMwYzY4YzhlOTdlYmU0MDdjMjEyYzdkZVwiXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbTG9nb25TY2VuZV1bb25TaG93VmlzdG9yXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHMgPSB2YWx1ZS51c2VybmFtZTtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IHZhbHVlLnB3ZDtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNHdWVzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIlBsYXphU2NlbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2xvZ29uRnJhbWUub25Mb2dvbkJ5VmlzaXRvcihHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzLEdsb2JhbFVzZXJEYXRhLnN6UGFzc1dvcmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmVtaXQoXCJHdWVzdExvZ2luQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBHbG9iYWxGdW4uc2hvd1BvcFdhaXRpbmcoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx7XG4gICAgICAgICAgICBjbG9zZUV2ZW50OiBcIkd1ZXN0TG9naW5Db21wbGV0ZWRcIixcbiAgICAgICAgICAgIGNhbGxCYWNrRnVuYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1Zpc3Rvcl0gY2FsbGJhY2tmdW5jXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgeGhyLnNlbmQocGFyYW1TdHJpbmcpO1xuICAgICAgICBcbiAgICB9LFxuICAgIG9uU2hvd1JlZ2lzdGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fbG9nb25WaWV3KSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICB0aGlzLl9sb2dvblZpZXcuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGNjLmlzVmFsaWQodGhpcy5fcmVnaXN0ZXJWaWV3KSA9PT0gZmFsc2Upe1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5yZWdpc3RlclZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3JlZ2lzdGVyVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fcmVnaXN0ZXJWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uU2NlbmVdW29uU2hvd1JlZ2lzdGVyXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fZWRpdGJveF9hY2NvdW50OntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfcGFzc3dvcmQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fY2hlY2tib3g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGVcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKHRoaXMubV9jaGVja2JveCkge1xuICAgICAgICAgICAgdmFyIHB3ZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInB3ZFwiKTtcbiAgICAgICAgICAgIHZhciBiUmVtZW1iZXJQd2QgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJiUmVtZW1iZXJQd2RcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSBpcyBcIiArIGJSZW1lbWJlclB3ZCk7XG4gICAgICAgICAgICBpZiAoYlJlbWVtYmVyUHdkID09ICd0cnVlJyB8fCBiUmVtZW1iZXJQd2QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9hZF0gY2hlY2tcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2NoZWNrYm94LmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgdmFyIHN6QWNjb3VudCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRcIikgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgc3pQYXNzd29yZCA9IGNjLnN5cy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBhc3N3b3JkXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmcgPSBzekFjY291bnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nID0gc3pQYXNzd29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25Mb2FkXSB1bmNoZWNrXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5tX2NoZWNrYm94LnVuY2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uTG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3pBY2NvdW50ID0gdGhpcy5tX2VkaXRib3hfYWNjb3VudC5zdHJpbmc7XG4gICAgICAgIHZhciBzelBhc3N3b3JkID0gdGhpcy5tX2VkaXRib3hfcGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW29uTG9nb25dIFwiK3N6QWNjb3VudCtcIiAjIFwiK3N6UGFzc3dvcmQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25Mb2dvblwiLHtzekFjY291bnQ6c3pBY2NvdW50LHN6UGFzc3dvcmQ6c3pQYXNzd29yZH0pO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gdGhpcy5ub2RlLmFjdGl2ZSA9IGZhbHNlOyAgXG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja1JlZ2lzdGVyQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uU2hvd1JlZ2lzdGVyXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0ZvcmdldFBhc3N3b3JkOiBmdW5jdGlvbigpe1xuICAgICAgICBjYy5zeXMub3BlblVSTChHbG9iYWxEZWYuaHR0cE9wZW5VcmwpO1xuICAgIH0sXG4gICAgY2hlY2tCb3hDbGlja2VkOiBmdW5jdGlvbiAodG9nZ2xlKSB7XG4gICAgICAgIGlmICh0b2dnbGUuaXNDaGVja2VkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltMb2dvblZpZXddW2NoZWNrQm94Q2xpY2tlZF0gaXMgY2hlY2tlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0xvZ29uVmlld11bY2hlY2tCb3hDbGlja2VkXSBpcyB1bmNoZWNrZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYlJlbWVtYmVyUHdkXCIsIHRvZ2dsZS5pc0NoZWNrZWQpO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MubWQ1RW5jb2RlID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgLy8gZm9yIHRlc3QvZGVidWdcbiAgICBmdW5jdGlvbiBmZmxvZyhtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH0gY2F0Y2goZSkge31cbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IG51bWJlciB0byAodW5zaWduZWQpIDMyIGJpdCBoZXgsIHplcm8gZmlsbGVkIHN0cmluZ1xuICAgIGZ1bmN0aW9uIHRvX3plcm9maWxsZWRfaGV4KG4pIHtcbiAgICAgICAgdmFyIHQxID0gKG4gPj4+IDI0KS50b1N0cmluZygxNik7XG4gICAgICAgIHZhciB0MiA9IChuICYgMHgwMEZGRkZGRikudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXR1cm4gXCIwMFwiLnN1YnN0cigwLCAyIC0gdDEubGVuZ3RoKSArIHQxICtcbiAgICAgICAgICAgIFwiMDAwMDAwXCIuc3Vic3RyKDAsIDYgLSB0Mi5sZW5ndGgpICsgdDI7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhcnJheSBvZiBjaGFycyB0byBhcnJheSBvZiBieXRlcyAobm90ZTogVW5pY29kZSBub3Qgc3VwcG9ydGVkKVxuICAgIGZ1bmN0aW9uIGNoYXJzX3RvX2J5dGVzKGFjKSB7XG4gICAgICAgIHZhciByZXR2YWwgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhYy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmV0dmFsID0gcmV0dmFsLmNvbmNhdChzdHJfdG9fYnl0ZXMoYWNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH1cblxuXG4gICAgLy8gY29udmVydCBhIDY0IGJpdCB1bnNpZ25lZCBudW1iZXIgdG8gYXJyYXkgb2YgYnl0ZXMuIExpdHRsZSBlbmRpYW5cbiAgICBmdW5jdGlvbiBpbnQ2NF90b19ieXRlcyhudW0pIHtcbiAgICAgICAgdmFyIHJldHZhbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICAgICAgcmV0dmFsLnB1c2gobnVtICYgMHhGRik7XG4gICAgICAgICAgICBudW0gPSBudW0gPj4+IDg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldHZhbDtcbiAgICB9XG5cbiAgICAvLyAgMzIgYml0IGxlZnQtcm90YXRpb25cbiAgICBmdW5jdGlvbiByb2wobnVtLCBwbGFjZXMpIHtcbiAgICAgICAgcmV0dXJuICgobnVtIDw8IHBsYWNlcykgJiAweEZGRkZGRkZGKSB8IChudW0gPj4+ICgzMiAtIHBsYWNlcykpO1xuICAgIH1cblxuICAgIC8vIFRoZSA0IE1ENSBmdW5jdGlvbnNcbiAgICBmdW5jdGlvbiBmRihiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiAoYiAmIGMpIHwgKH5iICYgZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZkcoYiwgYywgZCkge1xuICAgICAgICByZXR1cm4gKGQgJiBiKSB8ICh+ZCAmIGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZIKGIsIGMsIGQpIHtcbiAgICAgICAgcmV0dXJuIGIgXiBjIF4gZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmSShiLCBjLCBkKSB7XG4gICAgICAgIHJldHVybiBjIF4gKGIgfCB+ZCk7XG4gICAgfVxuXG4gICAgLy8gcGljayA0IGJ5dGVzIGF0IHNwZWNpZmllZCBvZmZzZXQuIExpdHRsZS1lbmRpYW4gaXMgYXNzdW1lZFxuICAgIGZ1bmN0aW9uIGJ5dGVzX3RvX2ludDMyKGFyciwgb2ZmKSB7XG4gICAgICAgIHJldHVybiAoYXJyW29mZiArIDNdIDw8IDI0KSB8IChhcnJbb2ZmICsgMl0gPDwgMTYpIHwgKGFycltvZmYgKyAxXSA8PCA4KSB8IChhcnJbb2ZmXSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgQ29udmVyIHN0cmluZyB0byBhcnJheSBvZiBieXRlcyBpbiBVVEYtOCBlbmNvZGluZ1xuICAgICBTZWU6XG4gICAgIGh0dHA6Ly93d3cuZGFuZ3Jvc3NtYW4uaW5mby8yMDA3LzA1LzI1L2hhbmRsaW5nLXV0Zi04LWluLWphdmFzY3JpcHQtcGhwLWFuZC1ub24tdXRmOC1kYXRhYmFzZXMvXG4gICAgIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI0MDQwOC9yZWFkaW5nLWJ5dGVzLWZyb20tYS1qYXZhc2NyaXB0LXN0cmluZ1xuICAgICBIb3cgYWJvdXQgYSBTdHJpbmcuZ2V0Qnl0ZXMoPEVOQ09ESU5HPikgZm9yIEphdmFzY3JpcHQhPyBJc24ndCBpdCB0aW1lIHRvIGFkZCBpdD9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdHJfdG9fYnl0ZXMoc3RyKSB7XG4gICAgICAgIC8vIGFsZXJ0KFwiZ290IFwiICsgc3RyLmxlbmd0aCArIFwiIGNoYXJzXCIpXG4gICAgICAgIHZhciByZXR2YWwgPSBbIF07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKHN0ci5jaGFyQ29kZUF0KGkpIDw9IDB4N0YpIHtcbiAgICAgICAgICAgICAgICByZXR2YWwucHVzaChzdHIuY2hhckNvZGVBdChpKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0bXAubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dmFsLnB1c2gocGFyc2VJbnQodG1wW2pdLCAweDEwKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0dmFsO1xuICAgIH07XG5cblxuXG5cbiAgICAvLyBjb252ZXJ0IHRoZSA0IDMyLWJpdCBidWZmZXJzIHRvIGEgMTI4IGJpdCBoZXggc3RyaW5nLiAoTGl0dGxlLWVuZGlhbiBpcyBhc3N1bWVkKVxuICAgIGZ1bmN0aW9uIGludDEyOGxlX3RvX2hleChhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciByYSA9IFwiXCI7XG4gICAgICAgIHZhciB0ID0gMDtcbiAgICAgICAgdmFyIHRhID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDM7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB0YSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIHQgPSAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCAodGEgJiAweEZGKTtcbiAgICAgICAgICAgIHRhID0gdGEgPj4+IDg7XG4gICAgICAgICAgICB0ID0gdCA8PCA4O1xuICAgICAgICAgICAgdCA9IHQgfCB0YTtcbiAgICAgICAgICAgIHJhID0gcmEgKyB0b196ZXJvZmlsbGVkX2hleCh0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmE7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaW5wdXQgZGF0YSB0eXBlIGFuZCBwZXJmb3JtIGNvbnZlcnNpb25zIGlmIG5lZWRlZFxuICAgIHZhciBkYXRhYnl0ZXMgPSBudWxsO1xuICAgIC8vIFN0cmluZ1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBjb252ZXJ0IHN0cmluZyB0byBhcnJheSBieXRlc1xuICAgICAgICBkYXRhYnl0ZXMgPSBzdHJfdG9fYnl0ZXMoZGF0YSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmNvbnN0cnVjdG9yID09IEFycmF5KSB7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBlbXB0eSwganVzdCBhc3N1bWUgYXJyYXkgb2YgYnl0ZXNcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbMF0gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGFieXRlcyA9IGNoYXJzX3RvX2J5dGVzKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhWzBdID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMgPSBkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmZsb2coXCJpbnB1dCBkYXRhIHR5cGUgbWlzbWF0Y2hcIik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZmbG9nKFwiaW5wdXQgZGF0YSB0eXBlIG1pc21hdGNoXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBzYXZlIG9yaWdpbmFsIGxlbmd0aFxuICAgIHZhciBvcmdfbGVuID0gZGF0YWJ5dGVzLmxlbmd0aDtcblxuICAgIC8vIGZpcnN0IGFwcGVuZCB0aGUgXCIxXCIgKyA3eCBcIjBcIlxuICAgIGRhdGFieXRlcy5wdXNoKDB4ODApO1xuXG4gICAgLy8gZGV0ZXJtaW5lIHJlcXVpcmVkIGFtb3VudCBvZiBwYWRkaW5nXG4gICAgdmFyIHRhaWwgPSBkYXRhYnl0ZXMubGVuZ3RoICUgNjQ7XG4gICAgLy8gbm8gcm9vbSBmb3IgbXNnIGxlbmd0aD9cbiAgICBpZiAodGFpbCA+IDU2KSB7XG4gICAgICAgIC8vIHBhZCB0byBuZXh0IDUxMiBiaXQgYmxvY2tcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAoNjQgLSB0YWlsKTsgaSsrKSB7XG4gICAgICAgICAgICBkYXRhYnl0ZXMucHVzaCgweDApO1xuICAgICAgICB9XG4gICAgICAgIHRhaWwgPSBkYXRhYnl0ZXMubGVuZ3RoICUgNjQ7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCAoNTYgLSB0YWlsKTsgaSsrKSB7XG4gICAgICAgIGRhdGFieXRlcy5wdXNoKDB4MCk7XG4gICAgfVxuICAgIC8vIG1lc3NhZ2UgbGVuZ3RoIGluIGJpdHMgbW9kIDUxMiBzaG91bGQgbm93IGJlIDQ0OFxuICAgIC8vIGFwcGVuZCA2NCBiaXQsIGxpdHRsZS1lbmRpYW4gb3JpZ2luYWwgbXNnIGxlbmd0aCAoaW4gKmJpdHMqISlcbiAgICBkYXRhYnl0ZXMgPSBkYXRhYnl0ZXMuY29uY2F0KGludDY0X3RvX2J5dGVzKG9yZ19sZW4gKiA4KSk7XG5cbiAgICAvLyBpbml0aWFsaXplIDR4MzIgYml0IHN0YXRlXG4gICAgdmFyIGgwID0gMHg2NzQ1MjMwMTtcbiAgICB2YXIgaDEgPSAweEVGQ0RBQjg5O1xuICAgIHZhciBoMiA9IDB4OThCQURDRkU7XG4gICAgdmFyIGgzID0gMHgxMDMyNTQ3NjtcblxuICAgIC8vIHRlbXAgYnVmZmVyc1xuICAgIHZhciBhID0gMCxcbiAgICAgICAgYiA9IDAsXG4gICAgICAgIGMgPSAwLFxuICAgICAgICBkID0gMDtcblxuXG4gICAgZnVuY3Rpb24gX2FkZChuMSwgbjIpIHtcbiAgICAgICAgcmV0dXJuIDB4MEZGRkZGRkZGICYgKG4xICsgbjIpXG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb24gdXBkYXRlIHBhcnRpYWwgc3RhdGUgZm9yIGVhY2ggcnVuXG4gICAgdmFyIHVwZGF0ZVJ1biA9IGZ1bmN0aW9uKG5mLCBzaW4zMiwgZHczMiwgYjMyKSB7XG4gICAgICAgIHZhciB0ZW1wID0gZDtcbiAgICAgICAgZCA9IGM7XG4gICAgICAgIGMgPSBiO1xuICAgICAgICAvL2IgPSBiICsgcm9sKGEgKyAobmYgKyAoc2luMzIgKyBkdzMyKSksIGIzMik7XG4gICAgICAgIGIgPSBfYWRkKGIsXG4gICAgICAgICAgICByb2woXG4gICAgICAgICAgICAgICAgX2FkZChhLFxuICAgICAgICAgICAgICAgICAgICBfYWRkKG5mLCBfYWRkKHNpbjMyLCBkdzMyKSlcbiAgICAgICAgICAgICAgICApLCBiMzJcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgYSA9IHRlbXA7XG4gICAgfTtcblxuXG4gICAgLy8gRGlnZXN0IG1lc3NhZ2VcbiAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YWJ5dGVzLmxlbmd0aCAvIDY0OyBpKyspIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBydW5cbiAgICAgICAgYSA9IGgwO1xuICAgICAgICBiID0gaDE7XG4gICAgICAgIGMgPSBoMjtcbiAgICAgICAgZCA9IGgzO1xuXG4gICAgICAgIHZhciBwdHIgPSBpICogNjQ7XG5cbiAgICAgICAgLy8gZG8gNjQgcnVuc1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZDc2YWE0NzgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhlOGM3Yjc1NiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4MjQyMDcwZGIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGMxYmRjZWVlLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZjU3YzBmYWYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCA3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDQ3ODdjNjJhLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgMTIpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4YTgzMDQ2MTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCAxNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhmZDQ2OTUwMSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDIyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDY5ODA5OGQ4LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDMyKSwgNyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg4YjQ0ZjdhZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDEyKTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweGZmZmY1YmIxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQwKSwgMTcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ODk1Y2Q3YmUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDQpLCAyMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHg2YjkwMTEyMiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDcpO1xuICAgICAgICB1cGRhdGVSdW4oZkYoYiwgYywgZCksIDB4ZmQ5ODcxOTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTIpLCAxMik7XG4gICAgICAgIHVwZGF0ZVJ1bihmRihiLCBjLCBkKSwgMHhhNjc5NDM4ZSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1NiksIDE3KTtcbiAgICAgICAgdXBkYXRlUnVuKGZGKGIsIGMsIGQpLCAweDQ5YjQwODIxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMjIpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZjYxZTI1NjIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNCksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YzA0MGIzNDAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjQpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDI2NWU1YTUxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZTliNmM3YWEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgMjApO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZDYyZjEwNWQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCA1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweDI0NDE0NTMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGQ4YTFlNjgxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDYwKSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZTdkM2ZiYzgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHgyMWUxY2RlNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzNiksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4YzMzNzA3ZDYsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCA5KTtcbiAgICAgICAgdXBkYXRlUnVuKGZHKGIsIGMsIGQpLCAweGY0ZDUwZDg3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDEyKSwgMTQpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4NDU1YTE0ZWQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzIpLCAyMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHhhOWUzZTkwNSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDUpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4ZmNlZmEzZjgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDkpO1xuICAgICAgICB1cGRhdGVSdW4oZkcoYiwgYywgZCksIDB4Njc2ZjAyZDksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjgpLCAxNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmRyhiLCBjLCBkKSwgMHg4ZDJhNGM4YSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDIwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGZmZmEzOTQyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDIwKSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg4NzcxZjY4MSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweDZkOWQ2MTIyLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZmRlNTM4MGMsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNTYpLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhhNGJlZWE0NCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0KSwgNCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg0YmRlY2ZhOSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAxNiksIDExKTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGY2YmI0YjYwLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI4KSwgMTYpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4YmViZmJjNzAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNDApLCAyMyk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHgyODliN2VjNiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA1MiksIDQpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZWFhMTI3ZmEsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZDRlZjMwODUsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHg0ODgxZDA1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDI0KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4ZDlkNGQwMzksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMzYpLCA0KTtcbiAgICAgICAgdXBkYXRlUnVuKGZIKGIsIGMsIGQpLCAweGU2ZGI5OWU1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ4KSwgMTEpO1xuICAgICAgICB1cGRhdGVSdW4oZkgoYiwgYywgZCksIDB4MWZhMjdjZjgsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSChiLCBjLCBkKSwgMHhjNGFjNTY2NSwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA4KSwgMjMpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZjQyOTIyNDQsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyKSwgNik7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg0MzJhZmY5NywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyOCksIDEwKTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGFiOTQyM2E3LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDU2KSwgMTUpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmM5M2EwMzksIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMjApLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg2NTViNTljMywgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0OCksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4OGYwY2NjOTIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTIpLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhmZmVmZjQ3ZCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyA0MCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDg1ODQ1ZGQxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQpLCAyMSk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHg2ZmE4N2U0ZiwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAzMiksIDYpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4ZmUyY2U2ZTAsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgNjApLCAxMCk7XG4gICAgICAgIHVwZGF0ZVJ1bihmSShiLCBjLCBkKSwgMHhhMzAxNDMxNCwgYnl0ZXNfdG9faW50MzIoZGF0YWJ5dGVzLCBwdHIgKyAyNCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweDRlMDgxMWExLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDUyKSwgMjEpO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4Zjc1MzdlODIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgMTYpLCA2KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGJkM2FmMjM1LCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDQ0KSwgMTApO1xuICAgICAgICB1cGRhdGVSdW4oZkkoYiwgYywgZCksIDB4MmFkN2QyYmIsIGJ5dGVzX3RvX2ludDMyKGRhdGFieXRlcywgcHRyICsgOCksIDE1KTtcbiAgICAgICAgdXBkYXRlUnVuKGZJKGIsIGMsIGQpLCAweGViODZkMzkxLCBieXRlc190b19pbnQzMihkYXRhYnl0ZXMsIHB0ciArIDM2KSwgMjEpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBidWZmZXJzXG4gICAgICAgIGgwID0gX2FkZChoMCwgYSk7XG4gICAgICAgIGgxID0gX2FkZChoMSwgYik7XG4gICAgICAgIGgyID0gX2FkZChoMiwgYyk7XG4gICAgICAgIGgzID0gX2FkZChoMywgZCk7XG4gICAgfVxuICAgIC8vIERvbmUhIENvbnZlcnQgYnVmZmVycyB0byAxMjggYml0IChMRSlcbiAgICByZXR1cm4gaW50MTI4bGVfdG9faGV4KGgzLCBoMiwgaDEsIGgwKS50b0xvd2VyQ2FzZSgpO1xufTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX2JhY2s6IGNjLlNwcml0ZSxcbiAgICAgICAgbV9JbWFnZV9jb2w6IGNjLlNwcml0ZSxcbiAgICAgICAgbV9JbWFnZV90aXRsZTogY2MuU3ByaXRlLFxuICAgICAgICBtX0xhYmVsX3Njb3JlTGltaXQ6IGNjLkxhYmVsLFxuICAgICAgICBwbGF6YUF0YWxhczogY2MuU3ByaXRlQXRsYXMsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIC8vIHZhciBpbmRleCA9IHBhcmFtcy5pbmRleDtcbiAgICAgICAgdGhpcy5faW5kZXggPSBwYXJhbXMuaW5kZXg7XG4gICAgICAgIC8vIHZhciByb29tSW5mbyA9IHBhcmFtcy5yb29tSW5mbztcbiAgICAgICAgdGhpcy5fcm9vbUluZm8gPSBwYXJhbXMucm9vbUluZm87XG4gICAgICAgIHRoaXMubV9JbWFnZV9iYWNrLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fYmFja19cIiArICh0aGlzLl9pbmRleCkpO1xuICAgICAgICB0aGlzLm1fSW1hZ2VfY29sLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF6YUF0YWxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXphX2ltYWdlX3Jvb21fY29sX1wiICsgKHRoaXMuX2luZGV4KSk7XG4gICAgICAgIHRoaXMubV9JbWFnZV90aXRsZS5zcHJpdGVGcmFtZSA9IHRoaXMucGxhemFBdGFsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF6YV9pbWFnZV9yb29tX2Rvd25fXCIgKyAodGhpcy5faW5kZXgpKTtcbiAgICAgICAgaWYgKHRoaXMuX3Jvb21JbmZvICYmIHRoaXMuX3Jvb21JbmZvLmxMaW1pdFNjb3JlKSB7XG4gICAgICAgICAgICB0aGlzLm1fTGFiZWxfc2NvcmVMaW1pdC5zdHJpbmcgPSB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbGljazogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVJvb21JdGVtXVtvbkNsaWNrXVwiKTsgIFxuICAgICAgICBpZighdGhpcy5fcm9vbUluZm8pIHtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaIv+mXtOaaguacquW8gOaUvu+8jOivt+eojeWQjuWGjeivlVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA+PSB0aGlzLl9yb29tSW5mby5sTGltaXRTY29yZSkge1xuICAgICAgICAgICAgLy8gR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi6L+b5YWl5oi/6Ze0XCIpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uTG9nb25Sb29tXCIse3Jvb21JbmZvOnRoaXMuX3Jvb21JbmZvfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd1RvYXN0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLov5vlhaXmiL/pl7TpnIDopoFcIisgdGhpcy5fcm9vbUluZm8ubExpbWl0U2NvcmUgKyBcIumHkeixhizmgqjnmoTph5HosYbkuI3otrMs6K+35YWF5YC8IVwiKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwidmFyIEdsb2JhbFVzZXJEYXRhID0gcmVxdWlyZShcIkdsb2JhbFVzZXJEYXRhXCIpO1xudmFyIEdsb2JhbEZ1biA9IHJlcXVpcmUoXCJHbG9iYWxGdW5cIik7XG52YXIgR2xvYmFsRGVmID0gcmVxdWlyZShcIkdsb2JhbERlZlwiKTtcbnZhciB6amhfY21kID0gcmVxdWlyZShcIkNNRF9aYUppbkh1YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHNldHRpbmdWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICB1c2VyUHJvZmlsZVZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGJhbmtWaWV3OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wVmlldzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgcGxhemFSb29tSXRlbToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF9uYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEdsb2JhbFVzZXJEYXRhLmluaXQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQbGF6YSBvbkxvYWRcIik7XG4gICAgICAgIHZhciBHYW1lRnJhbWVOb2RlID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgaWYgKEdhbWVGcmFtZU5vZGUpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkxvYWRdIOiOt+WPlkdhbWVGcmFtZSDmiYDlnKjoioLngrkg5bm26K6+572u5Li65bi46am76IqC54K5XCIpO1xuICAgICAgICAgICAgY2MuZ2FtZS5hZGRQZXJzaXN0Um9vdE5vZGUoR2FtZUZyYW1lTm9kZSk7XG4gICAgICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSBHYW1lRnJhbWVOb2RlLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdGhpcy5fZ2FtZUZyYW1lID0gdGhpcy5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpLmdldENvbXBvbmVudChcIkdhbWVGcmFtZVwiKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hVSTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hVSV1cIik7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gR2xvYmFsVXNlckRhdGEpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoR2xvYmFsVXNlckRhdGFbcHJvcF0pID09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2xvYmFsVXNlckRhdGEuJyArIHByb3AsICc9JywgR2xvYmFsVXNlckRhdGFbcHJvcF0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9MYWJlbF91c2VyR29sZC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX25hbWUuc3RyaW5nID0gR2xvYmFsVXNlckRhdGEuc3pOaWNrTmFtZTtcbiAgICAgICAgdmFyIGZhY2VJRCA9IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIGlmIChmYWNlSUQgPD0gMCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgICAgICBmYWNlSUQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG5cbiAgICAgICAgdGhpcy5yZWZyZXNoUm9vbUxpc3QoKTtcbiAgICB9LFxuICAgIHJlZnJlc2hSb29tTGlzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcm9vbUxpc3QgPSBHbG9iYWxVc2VyRGF0YS5nZXRSb29tQnlHYW1lKHpqaF9jbWQuS0lORF9JRCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaFVJXSBcIiArIEpTT04uc3RyaW5naWZ5KHJvb21MaXN0LCBudWxsLCAnICcpKTtcbiAgICAgICAgdmFyIHJvb21MaXN0UGFuZWwgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoXCJtX1BhbmVsX2NlbnRlclwiKTtcbiAgICAgICAgcm9vbUxpc3RQYW5lbC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMzsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXphUm9vbUl0ZW0pO1xuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoXCJQbGF6YVJvb21JdGVtXCIpLmluaXQoe2luZGV4OmluZGV4KzEscm9vbUluZm86cm9vbUxpc3RbaW5kZXhdfSk7XG4gICAgICAgICAgICByb29tTGlzdFBhbmVsLmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWZyZXNoRGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBCYXNlVXJsO1xuICAgICAgICB1cmwgKz0gXCIvaHovaHpHYW1lVXNlckluZm8uYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW3JlZnJlc2hEYXRhXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZSA9IHZhbHVlLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5pbnN1cmVzY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5sbEluc3VyZVNjb3JlID0gdmFsdWUuaW5zdXJlc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmFjY291bnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6QWNjb3VudHMgPSB2YWx1ZS5hY2NvdW50cztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZ2FtZWlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmR3R2FtZUlEID0gdmFsdWUuZ2FtZWlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5mYWNlaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEud0ZhY2VJRCA9IHZhbHVlLmZhY2VpZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuZ2VuZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmNiR2VuZGVyID0gdmFsdWUuZ2VuZGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5pc2d1ZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLmlzR3Vlc3QgPSB2YWx1ZS5pc2d1ZXN0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5uaWNrbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lID0gdmFsdWUubmlja25hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoVUkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bcmVmcmVzaERhdGFdIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH0sXG4gICAgb25FbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZU5hbWVTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25CYW5rU3VjY2VzcycsdGhpcy5vbkJhbmtTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbignb25Mb2dvblJvb20nLHRoaXMub25Mb2dvblJvb20sdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2VTdWNjZXNzJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlTmFtZVN1Y2Nlc3MnLHRoaXMub25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3MsdGhpcyk7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9mZignb25CYW5rU3VjY2VzcycsdGhpcy5vbkJhbmtTdWNjZXNzLHRoaXMpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uTG9nb25Sb29tJyx0aGlzLm9uTG9nb25Sb29tLHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkxvZ29uUm9vbTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uTG9nb25Sb29tXVwiKTtcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lLm9uTG9nb25Sb29tKHBhcmFtcy5kZXRhaWwucm9vbUluZm8pO1xuICAgIH0sXG4gICAgb25DaGFuZ2VVc2VyRmFjZVN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdmFyIGZhY2VJRCA9IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIC8vIGlmIChmYWNlSUQgPD0gMCB8fCBmYWNlSUQgPiA4KSB7XG4gICAgICAgIC8vICAgICBmYWNlSUQgPSAxO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIHRoaXMubV9JbWFnZV91c2VyRmFjZS5zcHJpdGVGcmFtZSA9IHRoaXMudXNlckZhY2VBdGFscy5nZXRTcHJpdGVGcmFtZShcInVzZXJmYWNlX1wiICsgKGZhY2VJRC0xKSk7XG4gICAgICAgIHRoaXMucmVmcmVzaERhdGEoKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlTmFtZVN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVUkoKTsgIFxuICAgIH0sXG4gICAgb25CYW5rU3VjY2VzczogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLnJlZnJlc2hVSSgpOyAgXG4gICAgfSxcbiAgICBvbkNsaWNrU2V0dGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKCBjYy5pc1ZhbGlkKHRoaXMuX3NldHRpbmdWaWV3KSA9PT0gZmFsc2UgKXtcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy5zZXR0aW5nVmlldyk7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQodGhpcy5fc2V0dGluZ1ZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHRoaXMuX3NldHRpbmdWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1NldHRpbmddQWN0aW9uU2hvd1RhbkNodWFuZyBjYWxsYmFja1wiKTtcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIG9uQ2xpY2tVc2VyUHJvZmlsZTogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl91c2VyUHJvZmlsZVZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fdXNlclByb2ZpbGVWaWV3ID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VyUHJvZmlsZVZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX3VzZXJQcm9maWxlVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fdXNlclByb2ZpbGVWaWV3LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja1VzZXJQcm9maWxlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvbkNsaWNrQ2xpZW50OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NsaWVudF1cIik7XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuWuouacjeWKn+iDveaaguacquW8gOaUvizmlazor7fmnJ/lvoUhXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0FjdGl2aXR5OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bY29uQ2xpY2tBY3Rpdml0eV1cIik7XG4gICAgICAgIEdsb2JhbEZ1bi5zaG93VG9hc3QoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaaguacquW8gOaUvizmlazor7fmnJ/lvoUhXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Jhbms6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtjb25DbGlja0JhbmtdXCIpO1xuICAgICAgICBpZiggY2MuaXNWYWxpZCh0aGlzLl9iYW5rVmlldykgPT09IGZhbHNlICl7XG4gICAgICAgICAgICB0aGlzLl9iYW5rVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmFua1ZpZXcpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMuX2JhbmtWaWV3KTtcbiAgICAgICAgfVxuICAgICAgICBHbG9iYWxGdW4uQWN0aW9uU2hvd1RhbkNodWFuZyh0aGlzLl9iYW5rVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tCYW5rXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBvbkNsaWNrU2hvcDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tTaG9wXVwiKTtcbiAgICAgICAgaWYoIGNjLmlzVmFsaWQodGhpcy5fc2hvcFZpZXcpID09PSBmYWxzZSApe1xuICAgICAgICAgICAgdGhpcy5fc2hvcFZpZXcgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnNob3BWaWV3KTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLl9zaG9wVmlldyk7XG4gICAgICAgIH1cbiAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcodGhpcy5fc2hvcFZpZXcsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrU2hvcF1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9MYWJlbF9jb250ZW50OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fSW1hZ2Vfd2FpdEljb246e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQb3BXYWl0Vmlld11bb25Mb2FkXVwiKTtcbiAgICB9LFxuICAgIG9uSW5pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICB0aGlzLm1fd2FpdGluZ1RleHQgPSBwYXJhbXMud2FpdGluZ1RleHQgfHwgXCLmraPlnKjov57mjqXmnI3liqHlmajvvIzor7fnqI3lgJkuLi5cIjtcbiAgICAgICAgdGhpcy5tX3dhaXRpbmdUaW1lID0gcGFyYW1zLndhaXRpbmdUaW1lIHx8IDg7XG4gICAgICAgIHRoaXMubV9jbG9zZUV2ZW50ID0gcGFyYW1zLmNsb3NlRXZlbnQ7XG4gICAgICAgIHRoaXMubV9jYWxsQmFja0Z1bmMgPSBwYXJhbXMuY2FsbEJhY2tGdW5jO1xuICAgICAgICBjYy5kaXJlY3Rvci5vbih0aGlzLm1fY2xvc2VFdmVudCx0aGlzLm9uQ2xvc2VFdmVudCx0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUodGhpcy5jbG9zZSwgdGhpcywgdGhpcy5tX3dhaXRpbmdUaW1lKTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2NvbnRlbnQuc3RyaW5nID0gdGhpcy5tX3dhaXRpbmdUZXh0O1xuICAgICAgICB0aGlzLm1fSW1hZ2Vfd2FpdEljb24ucnVuQWN0aW9uKGNjLnJlcGVhdEZvcmV2ZXIoY2Mucm90YXRlQnkoMi4wLDM2MC4wKSkpO1xuICAgIH0sXG4gICAgb25DbG9zZUV2ZW50OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmICh0eXBlb2YodGhpcy5tX2NhbGxCYWNrRnVuYykgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5tX2NhbGxCYWNrRnVuYygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9LFxuICAgIG9uRW1pdDogZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwiaGVoZVwiKTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQb3BXYWl0Vmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1BvcFdhaXRWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYodGhpcy5tX2Nsb3NlRXZlbnQsdGhpcy5vbkNsb3NlRXZlbnQsdGhpcyk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkudW5zY2hlZHVsZSAodGhpcy5jbG9zZSwgdGhpcyk7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltQb3BXYWl0Vmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsIiByZXF1aXJlKFwiTUQ1XCIpO1xuIHZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xuIHZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuIGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fZWRpdGJveF9hY2NvdW50OntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfcGFzc3dvcmQ6e1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fZWRpdGJveF9uYW1lOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX2VkaXRib3hfeXptOntcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTsgIFxuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDb25maXJtQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pQYXNzd29yZCA9IHRoaXMubV9lZGl0Ym94X3Bhc3N3b3JkLnN0cmluZztcbiAgICAgICAgdmFyIHN6Tmlja05hbWUgPSB0aGlzLm1fZWRpdGJveF9uYW1lLnN0cmluZztcbiAgICAgICAgdmFyIHN6TW9iaWxlQXV0aCA9IHRoaXMubV9lZGl0Ym94X3l6bS5zdHJpbmc7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiK3N6QWNjb3VudCtcIiAjIFwiK3N6UGFzc3dvcmQpO1xuICAgICAgICBpZiAoc3pBY2NvdW50Lmxlbmd0aCA8PTAgfHwgc3pQYXNzd29yZC5sZW5ndGggPD0wIHx8IHN6Tmlja05hbWUubGVuZ3RoIDw9IDAgfHwgc3pNb2JpbGVBdXRoLmxlbmd0aCA8PSAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5biQ5Y+35a+G56CB562J5rOo5YaM5L+h5oGv5LiN6IO95Li656m6XCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5biQ5Y+35a+G56CB562J5rOo5YaM5L+h5oGv5LiN6IO95Li656m6XCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzelBhc3N3b3JkLmxlbmd0aCA8IDYgfHwgc3pQYXNzd29yZC5sZW5ndGggPiAxNil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuWvhueggemVv+W6puS4ujYtMTbkvY1cIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHplb/luqbkuLo2LTE25L2NXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIOmAmui/h+eUqOaIt+S4reW/g3dlYuaOpeWPo+azqOWGjOeUqOaIt1xuICAgICAgICB2YXIgaXNVc2VyQ2VudGVyID0gdHJ1ZTtcbiAgICAgICAgaWYoIWlzVXNlckNlbnRlcikge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uUmVnaXN0ZXJcIix7XG4gICAgICAgICAgICAgICAgc3pBY2NvdW50OnN6QWNjb3VudCxcbiAgICAgICAgICAgICAgICBzelBhc3N3b3JkOnN6UGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgc3pOaWNrTmFtZTpzek5pY2tOYW1lLFxuICAgICAgICAgICAgICAgIHN6TW9iaWxlQXV0aDpzek1vYmlsZUF1dGgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBHbG9iYWxEZWYuaHR0cFVzZXJDZW50ZXI7XG4gICAgICAgICAgICB1cmwgKz0gXCIvVXNlckNlbnRlci9Vc2VyQ2VudGVyUmVnaXN0ZXIuYXNoeFwiO1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9ICcnO1xuICAgICAgICAgICAgdmFyIG5vd1RpbWUgPSBNYXRoLmZsb29yKERhdGUubm93KCkvMTAwMCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBub3d0aW1lIHNlY29uZHMgPSBcIitub3dUaW1lKTtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwie1xcXCJVc2VybmFtZVxcXCI6XFxcIlwiICsgc3pBY2NvdW50ICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiUGFzc3dvcmRcXFwiOlxcXCJcIiArIGNjLm1kNUVuY29kZShzelBhc3N3b3JkKSArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIk5pY2tuYW1lXFxcIjpcXFwiXCIgKyBzek5pY2tOYW1lICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiRGF0ZXRhbXBcXFwiOlxcXCJcIiArIG5vd1RpbWUgKyBcIlxcXCIsXCI7XG4gICAgICAgICAgICAvL+eUn+aIkOetvuWQjVxuICAgICAgICAgICAgdmFyIHN6U2lnbiA9IFwiXCI7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJVc2VyTmFtZT1cIiArIHN6QWNjb3VudDtcbiAgICAgICAgICAgIHN6U2lnbiArPSBcInxEYXRlVGFtcD1cIiArIG5vd1RpbWU7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8Q2hhbm5lbElEPVwiICsgR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8TW9iaWxlPVwiICsgc3pBY2NvdW50O1xuICAgICAgICAgICAgc3pTaWduICs9IFwifENvZGU9XCIgKyBzek1vYmlsZUF1dGg7XG4gICAgICAgICAgICBzelNpZ24gKz0gXCJ8S2V5PWZncjdoazVkczM1aDMwaG5qN2h3YXM0Z2Z5NnNqNzh4XCI7XG5cbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIlNpZ25cXFwiOlxcXCJcIiArIGNjLm1kNUVuY29kZShzelNpZ24pICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiQ2hhbm5lbElEXFxcIjpcXFwiXCIgKyBHbG9iYWxEZWYuQ0hBTk5FTElEX2NlbnRlciArIFwiXFxcIixcIjtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtcyArIFwiXFxcIk1vYmlsZVxcXCI6XFxcIlwiICsgc3pBY2NvdW50ICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiTWFjaGluZU51bWJlclxcXCI6XFxcIlwiICsgJzEnICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zICsgXCJcXFwiQ29kZVxcXCI6XFxcIlwiICsgc3pNb2JpbGVBdXRoICsgXCJcXFwifVwiO1xuXG4gICAgICAgICAgICAvL1wiVXNlck5hbWU9JXN8RGF0ZVRhbXA9JWxsZHxDaGFubmVsSUQ9JWR8TW9iaWxlPSVzfENvZGU9JXN8S2V5PWZncjdoazVkczM1aDMwaG5qN2h3YXM0Z2Z5NnNqNzh4XCJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgIHhoci5zZW5kKHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIiArIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xpY2tTZW5kQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN6QWNjb3VudCA9IHRoaXMubV9lZGl0Ym94X2FjY291bnQuc3RyaW5nO1xuICAgICAgICB2YXIgcmUgPSAvMVszNTc4XVswLTldezl9LztcbiAgICAgICAgaWYgKHJlLmV4ZWMoc3pBY2NvdW50KSA9PT0gbnVsbCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tTZW5kQnV0dG9uXSDmiYvmnLrlj7fnoIHkuI3lkIjms5VcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLmiYvmnLrlj7fnoIHkuI3lkIjms5VcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwVXNlckNlbnRlcjtcbiAgICAgICAgdXJsICs9IFwiL2h6L0NhcHRjaGFNb2JpbGUuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0gXCJNb2JpbGU9XCIgKyBzekFjY291bnQ7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1JlZ2lzdGVyVmlld11bb25DbGlja1NlbmRCdXR0b25dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltSZWdpc3RlclZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBcIiArIHBhcmFtcyk7XG5cbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfYWNjb3VudDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fTGFiZWxfYWNjb3VudC5zdHJpbmcgPSBHbG9iYWxVc2VyRGF0YS5zekFjY291bnRzO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTZXR0aW5nVmlld11bb25EZXN0cm95XVwiKTtcbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIHRoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTsgIFxuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltTZXR0aW5nVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja1N3aXRjaEFjY291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIEdhbWVGcmFtZU5vZGUgPSBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiR2FtZUZyYW1lXCIpO1xuICAgICAgICBpZiAoR2FtZUZyYW1lTm9kZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltTZXR0aW5nVmlld11bb25DbGlja1N3aXRjaEFjY291bnRdIOiOt+WPlkdhbWVGcmFtZSDmiYDlnKjoioLngrkg5bm25Y+W5raI5Li65bi46am76IqC54K5XCIpO1xuICAgICAgICAgICAgY2MuZ2FtZS5yZW1vdmVQZXJzaXN0Um9vdE5vZGUoR2FtZUZyYW1lTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwiTG9naW5TY2VuZVwiKTtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBtX0ltYWdlX3Nob3BJdGVtOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlLFxuICAgICAgICB9LFxuICAgICAgICBzaG9wSXRlbUF0YWxzOiB7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgfSxcbiAgICAgICAgX3Nob3BJRDogMCxcbiAgICAgICAgX2dvb2RzSUQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBzaG9wSUQgPSBwYXJhbXMuc2hvcElEO1xuICAgICAgICB0aGlzLl9zaG9wSUQgPSBzaG9wSUQ7XG4gICAgICAgIHRoaXMuX2dvb2RzSUQgPSBzaG9wSUQgJSA2O1xuICAgICAgICB0aGlzLm1fSW1hZ2Vfc2hvcEl0ZW0uc3ByaXRlRnJhbWUgPSB0aGlzLnNob3BJdGVtQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJzaG9wX2ljb25fXCIgKyAoc2hvcElEKSk7XG4gICAgfSxcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BJdGVtXVtvbkNsaWNrXSBzaG9wSUQgPSBcIit0aGlzLl9zaG9wSUQpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KCdvbkluQ2hhcmdlJyx7Z29vZHNJRDp0aGlzLl9nb29kc0lEfSk7XG4gICAgfVxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxVc2VyRGF0YSA9IHJlcXVpcmUoXCJHbG9iYWxVc2VyRGF0YVwiKTtcbnZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xudmFyIEdsb2JhbERlZiA9IHJlcXVpcmUoXCJHbG9iYWxEZWZcIik7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzaG9wSXRlbVByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1MaXN0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlldyxcbiAgICAgICAgfSxcbiAgICAgICAgc2hvcEl0ZW1Db3VudDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7ICAgICAgXG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkxvYWRdIFwiK0pTT04uc3RyaW5naWZ5KEdsb2JhbFVzZXJEYXRhLnNob3BEYXRhKSk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5zaG9wSXRlbUxpc3QuY29udGVudC5yZW1vdmVBbGxDaGlsZHJlbigpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zaG9wSXRlbUNvdW50OyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2hvcEl0ZW1QcmVmYWIpO1xuICAgICAgICAgICAgdmFyIHNob3BJRDtcbiAgICAgICAgICAgIGlmKEdsb2JhbFVzZXJEYXRhLmlzT3BlbklBUCl7XG4gICAgICAgICAgICAgICAgc2hvcElEID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHNob3BJRCA9IGluZGV4ICsgNjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KFwiU2hvcEl0ZW1cIikuaW5pdCh7c2hvcElEOmluZGV4fSk7XG4gICAgICAgICAgICB0aGlzLnNob3BJdGVtTGlzdC5jb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkluQ2hhcmdlJyx0aGlzLm9uSW5DaGFyZ2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkVuYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5vZmYoJ29uSW5DaGFyZ2UnLHRoaXMub25JbkNoYXJnZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uRGlzYWJsZV1cIik7XG4gICAgfSxcbiAgICBvbkluQ2hhcmdlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkluQ2hhcmdlXVwiKTtcbiAgICAgICAgdmFyIGdvb2RzSUQgPSBwYXJhbXMuZGV0YWlsLmdvb2RzSUQ7XG4gICAgICAgIHZhciBzaG9wRGF0YUFycmF5ID0gR2xvYmFsVXNlckRhdGEuc2hvcERhdGEuc2hvcC5iYXNlO1xuICAgICAgICBpZiAoZ29vZHNJRCA8IDAgfHwgZ29vZHNJRCA+PSBzaG9wRGF0YUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uSW5DaGFyZ2VdIHNob3BEYXRhQXJyYXkgbGVuZ3RoID0gXCIgKyBzaG9wRGF0YUFycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGl0ZW1WYWwgPSBzaG9wRGF0YUFycmF5W2dvb2RzSURdO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIFxuICAgICAgICBpZihjYy5zeXMub3MgPT0gY2Muc3lzLk9TX0FORFJPSUQpIHtcbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbmFtZVwiXSA9IGl0ZW1WYWwubmFtZTtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX251bVwiXSA9IFwiMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wicmVtYXJrXCJdID0gXCJ6aGFqaW5odWFHYW1lXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19ub3RlXCJdID0gXCLpm4bnu5Plj7fmi7zkuInlvKBcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJfaXBcIl0gPSBcIjEyNy4wLjAuMVwiOy8vdG9kb1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pZGVudGl0eVwiXSA9IFwidXNlcnRva2VuXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJwcm9kdWN0aWRcIl0gPSBpdGVtVmFsLmlkO1xuICAgICAgICAgICAgcGFyYW1zW1wib3NcIl0gPSBcIjFcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInZlcnNpb25udW1cIl0gPSBcIjEuMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wiY2hhbm5lbGlkXCJdID0gR2xvYmFsRGVmLkNIQU5ORUxJRF9jZW50ZXI7XG4gICAgICAgICAgICBwYXJhbXNbXCJwYXlfYW10XCJdID0gaXRlbVZhbC5wcmljZTtcblxuICAgICAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgICAgIHVybCArPSBcIi9IWk1vYmlsZS9QYXlJbml0Ml8wLmFzaHhcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInVybFwiXSA9IHVybDtcblxuICAgICAgICAgICAgdGhpcy5vbkNob29zZVBheXR5cGUocGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNjLnN5cy5vcyA9PSBjYy5zeXMuT1NfSU9TKXtcbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICAgICAgcGFyYW1zW1wiZ29vZHNfbmFtZVwiXSA9IGl0ZW1WYWwubmFtZTtcbiAgICAgICAgICAgIHBhcmFtc1tcImdvb2RzX251bVwiXSA9IFwiMVwiO1xuICAgICAgICAgICAgcGFyYW1zW1wicmVtYXJrXCJdID0gXCJ6aGFqaW5odWFHYW1lXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJnb29kc19ub3RlXCJdID0gXCLpm4bnu5Plj7fmi7zkuInlvKBcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcInVzZXJfaXBcIl0gPSBcIjEyNy4wLjAuMVwiOy8vdG9kb1xuICAgICAgICAgICAgcGFyYW1zW1widXNlcl9pZGVudGl0eVwiXSA9IFwidXNlcnRva2VuXCI7Ly90b2RvXG4gICAgICAgICAgICBwYXJhbXNbXCJwYXlfdHlwZVwiXSA9IFwiOFwiO1xuICAgICAgICAgICAgcGFyYW1zW1wicHJvZHVjdGlkXCJdID0gaXRlbVZhbC5pZDtcbiAgICAgICAgICAgIHBhcmFtc1tcIm9zXCJdID0gXCIyXCI7XG4gICAgICAgICAgICBwYXJhbXNbXCJ2ZXJzaW9ubnVtXCJdID0gXCIxLjFcIjtcbiAgICAgICAgICAgIHBhcmFtc1tcImNoYW5uZWxpZFwiXSA9IEdsb2JhbERlZi5DSEFOTkVMSURfY2VudGVyO1xuXG4gICAgICAgICAgICBpZiAoR2xvYmFsVXNlckRhdGEuaXNPcGVuSUFQKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zW1wicGF5X2FtdFwiXSA9IGl0ZW1WYWwuaW9zcHJpY2U7XG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgICAgICAgICB1cmwgKz0gXCIvSFpNb2JpbGUvUGF5SW5pdDJfMC5hc2h4XCI7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtU3RyaW5nID0gR2xvYmFsRnVuLmJ1aWxkUmVxdWVzdFBhcmFtKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5lcnJvcmNvZGUgPT0gMTAwMjYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuaXNPcGVuSUFQID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFVJKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIlNob3BDb21wbGV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93UG9wV2FpdGluZyhjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VFdmVudDogXCJTaG9wQ29tcGxldGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrRnVuYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uSW5DaGFyZ2VdIGNhbGxiYWNrZnVuY1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5vbkNob29zZVBheXR5cGUocGFyYW1zKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zW1wicGF5X2FtdFwiXSA9IGl0ZW1WYWwucHJpY2U7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNob29zZVBheXR5cGUocGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzLm9uQ2hvb3NlUGF5dHlwZShwYXJhbXMpO1xuICAgIH0sXG4gICAgb25DaG9vc2VQYXl0eXBlOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkNob29zZVBheXR5cGVdXCIpXG4gICAgICAgIGNjLmxvYWRlci5sb2FkUmVzKFwicHJlZmFiL0Nob29zZVBheVR5cGVWaWV3XCIsIGZ1bmN0aW9uIChlcnIsIHByZWZhYikge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBjYy5pbnN0YW50aWF0ZShwcmVmYWIpO1xuICAgICAgICAgICAgbmV3Tm9kZS5nZXRDb21wb25lbnQoXCJDaG9vc2VQYXlUeXBlVmlld1wiKS5pbml0KHBhcmFtcyk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKFwiQ2FudmFzXCIpLmFkZENoaWxkKG5ld05vZGUpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLkFjdGlvblNob3dUYW5DaHVhbmcobmV3Tm9kZSxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uQ2hvb3NlUGF5dHlwZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICAgICAgfSkgICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcbiAgICBvbkRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1Nob3BWaWV3XVtvbkRlc3Ryb3ldXCIpO1xuICAgIH0sXG4gICAgb25DbGlja0Nsb3NlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbU2hvcFZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fTGFiZWxfY29udGVudDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsLFxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltUb2FzdFZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ29uZmlybUJ1dHRvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltUb2FzdFZpZXddW29uQ2xpY2tDb25maXJtQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25Jbml0OiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHZhciBzelRleHQgPSBwYXJhbXMubWVzc2FnZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX2NvbnRlbnQuc3RyaW5nID0gc3pUZXh0O1xuICAgIH1cblxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuIiwiY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIF9mYWNlSUQ6IDAsXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIGZhY2VJRCA9IHBhcmFtcy5mYWNlSUQ7XG4gICAgICAgIHRoaXMuX2ZhY2VJRCA9IGZhY2VJRDtcbiAgICAgICAgdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlEKSk7XG4gICAgfSxcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlSXRlbV1bb25DbGlja10gZmFjZUlEID0gXCIrdGhpcy5fZmFjZUlEKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuZW1pdCgnb25DaGFuZ2VVc2VyRmFjZScse2ZhY2VJRDp0aGlzLl9mYWNlSUQrMX0pO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIHVzZXJGYWNlSXRlbVByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VMaXN0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlldyxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VDb3VudDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnVzZXJGYWNlQ291bnQ7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy51c2VyRmFjZUl0ZW1QcmVmYWIpO1xuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoXCJVc2VyRmFjZUl0ZW1cIikuaW5pdCh7ZmFjZUlEOmluZGV4fSk7XG4gICAgICAgICAgICB0aGlzLnVzZXJGYWNlTGlzdC5jb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25FbmFibGVdXCIpO1xuICAgIH0sXG4gICAgb25EaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25EaXNhYmxlXVwiKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gR2xvYmFsVXNlckRhdGEud0ZhY2VJRCA9IHBhcmFtcy5kZXRhaWwuZmFjZUlEO1xuICAgICAgICB0aGlzLl9mYWNlSUQgPSBwYXJhbXMuZGV0YWlsLmZhY2VJRDtcbiAgICAgICAgdGhpcy5vbkNsaWNrQ2xvc2VCdXR0b24oKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlckZhY2VWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgSlNPTi5zdHJpbmdpZnkocGFyYW1zLmRldGFpbCkpO1xuICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VVc2VyRmFjZVwiLHBhcmFtcy5kZXRhaWwpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2xvc2VCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgRmFjZUlEID0gdGhpcy5fZmFjZUlEO1xuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyhcInByZWZhYi9Vc2VyUHJvZmlsZVZpZXdcIiwgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICBuZXdOb2RlLmdldENvbXBvbmVudChcIlVzZXJQcm9maWxlVmlld1wiKS5fZmFjZUlEID0gRmFjZUlEO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZShcIkNhbnZhc1wiKS5hZGRDaGlsZChuZXdOb2RlKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKG5ld05vZGUsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJGYWNlVmlld11bb25DbGlja1VzZXJQcm9maWxlXUFjdGlvblNob3dUYW5DaHVhbmcgY2FsbGJhY2tcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyRmFjZVZpZXddW29uQ2xpY2tDbG9zZUJ1dHRvbl0gZGVzdHJveVwiKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcbiIsInZhciBHbG9iYWxGdW4gPSByZXF1aXJlKFwiR2xvYmFsRnVuXCIpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgY2hpcEZyYW1lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgd2luRnJhbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuICAgICAgICBsb3NlRnJhbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuICAgICAgICBsb29rRnJhbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuICAgICAgICBwZW9wbGVBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMTY7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcEZyYW1lc1tpbmRleF0gPSB0aGlzLnBlb3BsZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwicGVvcGxlX2NoaXBfXCIgKyBHbG9iYWxGdW4uUHJlZml4SW50ZWdlcihpbmRleCsxLDIpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgMTg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRoaXMud2luRnJhbWVzW2luZGV4XSA9IHRoaXMucGVvcGxlQXRhbHMuZ2V0U3ByaXRlRnJhbWUoXCJwZW9wbGVfd2luX1wiICsgR2xvYmFsRnVuLlByZWZpeEludGVnZXIoaW5kZXgrMSwyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IDMyOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvc2VGcmFtZXNbaW5kZXhdID0gdGhpcy5wZW9wbGVBdGFscy5nZXRTcHJpdGVGcmFtZShcInBlb3BsZV9sb3NlX1wiICsgR2xvYmFsRnVuLlByZWZpeEludGVnZXIoaW5kZXgrMSwyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IDIwOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvb2tGcmFtZXNbaW5kZXhdID0gdGhpcy5wZW9wbGVBdGFscy5nZXRTcHJpdGVGcmFtZShcInBlb3BsZV9sb29rX1wiICsgR2xvYmFsRnVuLlByZWZpeEludGVnZXIoaW5kZXgrMSwyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaXBfY2xpcCA9IGNjLkFuaW1hdGlvbkNsaXAuY3JlYXRlV2l0aFNwcml0ZUZyYW1lcyh0aGlzLmNoaXBGcmFtZXMsdGhpcy5jaGlwRnJhbWVzLmxlbmd0aCk7XG4gICAgICAgIGNoaXBfY2xpcC5uYW1lID0gXCJjaGlwXCI7XG4gICAgICAgIGNoaXBfY2xpcC5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICBmcmFtZTogMSwgICAgICAgICAgICAgICAvLyDlh4bnoa7nmoTml7bpl7TvvIzku6Xnp5LkuLrljZXkvY3jgILov5nph4zooajnpLrlsIblnKjliqjnlLvmkq3mlL7liLAgMXMg5pe26Kem5Y+R5LqL5Lu2XG4gICAgICAgICAgICBmdW5jOiBcInBsYXlhbmltXCIsICAgICAvLyDlm57osIPlh73mlbDlkI3np7BcbiAgICAgICAgICAgIHBhcmFtczogW1wid2luXCJdICAgIC8vIOWbnuiwg+WPguaVsFxuICAgICAgICB9KTtcbiAgICAgICAgY2hpcF9jbGlwLndyYXBNb2RlID0gY2MuV3JhcE1vZGUuTG9vcDtcbiAgICAgICAgYW5pbWF0aW9uLmFkZENsaXAoY2hpcF9jbGlwKTtcbiAgICAgICAgLy8gYW5pbWF0aW9uLnBsYXkoJ2NoaXAnKTtcblxuICAgICAgICB2YXIgd2luX2NsaXAgPSBjYy5BbmltYXRpb25DbGlwLmNyZWF0ZVdpdGhTcHJpdGVGcmFtZXModGhpcy53aW5GcmFtZXMsdGhpcy53aW5GcmFtZXMubGVuZ3RoKTtcbiAgICAgICAgd2luX2NsaXAubmFtZSA9IFwid2luXCI7XG4gICAgICAgIHdpbl9jbGlwLmV2ZW50cy5wdXNoKHtcbiAgICAgICAgICAgIGZyYW1lOiAxLCAgICAgICAgICAgICAgIC8vIOWHhuehrueahOaXtumXtO+8jOS7peenkuS4uuWNleS9jeOAgui/memHjOihqOekuuWwhuWcqOWKqOeUu+aSreaUvuWIsCAxcyDml7bop6blj5Hkuovku7ZcbiAgICAgICAgICAgIGZ1bmM6IFwicGxheWFuaW1cIiwgICAgIC8vIOWbnuiwg+WHveaVsOWQjeensFxuICAgICAgICAgICAgcGFyYW1zOiBbXCJsb3NlXCJdICAgIC8vIOWbnuiwg+WPguaVsFxuICAgICAgICB9KTtcbiAgICAgICAgd2luX2NsaXAud3JhcE1vZGUgPSBjYy5XcmFwTW9kZS5Mb29wO1xuICAgICAgICBhbmltYXRpb24uYWRkQ2xpcCh3aW5fY2xpcCk7XG5cbiAgICAgICAgdmFyIGxvc2VfY2xpcCA9IGNjLkFuaW1hdGlvbkNsaXAuY3JlYXRlV2l0aFNwcml0ZUZyYW1lcyh0aGlzLmxvc2VGcmFtZXMsdGhpcy5sb3NlRnJhbWVzLmxlbmd0aCk7XG4gICAgICAgIGxvc2VfY2xpcC5uYW1lID0gXCJsb3NlXCI7XG4gICAgICAgIGxvc2VfY2xpcC5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICBmcmFtZTogMSwgICAgICAgICAgICAgICAvLyDlh4bnoa7nmoTml7bpl7TvvIzku6Xnp5LkuLrljZXkvY3jgILov5nph4zooajnpLrlsIblnKjliqjnlLvmkq3mlL7liLAgMXMg5pe26Kem5Y+R5LqL5Lu2XG4gICAgICAgICAgICBmdW5jOiBcInBsYXlhbmltXCIsICAgICAvLyDlm57osIPlh73mlbDlkI3np7BcbiAgICAgICAgICAgIHBhcmFtczogW1wibG9va1wiXSAgICAvLyDlm57osIPlj4LmlbBcbiAgICAgICAgfSk7XG4gICAgICAgIGxvc2VfY2xpcC53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XG4gICAgICAgIGFuaW1hdGlvbi5hZGRDbGlwKGxvc2VfY2xpcCk7XG5cbiAgICAgICAgdmFyIGxvb2tfY2xpcCA9IGNjLkFuaW1hdGlvbkNsaXAuY3JlYXRlV2l0aFNwcml0ZUZyYW1lcyh0aGlzLmxvb2tGcmFtZXMsdGhpcy5sb29rRnJhbWVzLmxlbmd0aCk7XG4gICAgICAgIGxvb2tfY2xpcC5uYW1lID0gXCJsb29rXCI7XG4gICAgICAgIGxvb2tfY2xpcC5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICBmcmFtZTogdGhpcy5sb29rRnJhbWVzLmxlbmd0aC82MCwgICAgICAgICAgICAgICAvLyDlh4bnoa7nmoTml7bpl7TvvIzku6Xnp5LkuLrljZXkvY3jgILov5nph4zooajnpLrlsIblnKjliqjnlLvmkq3mlL7liLAgMXMg5pe26Kem5Y+R5LqL5Lu2XG4gICAgICAgICAgICBmdW5jOiBcInBsYXlhbmltXCIsICAgICAvLyDlm57osIPlh73mlbDlkI3np7BcbiAgICAgICAgICAgIHBhcmFtczogW1wiY2hpcFwiXSAgICAvLyDlm57osIPlj4LmlbBcbiAgICAgICAgfSk7XG4gICAgICAgIGxvb2tfY2xpcC53cmFwTW9kZSA9IGNjLldyYXBNb2RlLkxvb3A7XG4gICAgICAgIGFuaW1hdGlvbi5hZGRDbGlwKGxvb2tfY2xpcCk7XG5cbiAgICAgICAgYW5pbWF0aW9uLnBsYXkoXCJsb29rXCIpO1xuICAgIH0sXG4gICAgcGxheWFuaW06IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbVXNlckluZmFjZUl0ZW1dW3BsYXlhbmltXSBcIiArIHBhcmFtcyk7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGFuaW1hdGlvbi5wbGF5KHBhcmFtcyk7XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJ2YXIgR2xvYmFsVXNlckRhdGEgPSByZXF1aXJlKFwiR2xvYmFsVXNlckRhdGFcIik7XG52YXIgR2xvYmFsRnVuID0gcmVxdWlyZShcIkdsb2JhbEZ1blwiKTtcbnZhciBHbG9iYWxEZWYgPSByZXF1aXJlKFwiR2xvYmFsRGVmXCIpO1xucmVxdWlyZShcIk1ENVwiKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIG1fQnV0dG9uX2NoYW5nZU5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sXG4gICAgICAgIH0sXG4gICAgICAgIG1fQnV0dG9uX2VkaXROYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uLFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfdXNlck5hbWU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0xhYmVsX3VzZXJOYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWwsXG4gICAgICAgIH0sXG4gICAgICAgIG1fTGFiZWxfdXNlckdvbGQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9MYWJlbF91c2VySUQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbCxcbiAgICAgICAgfSxcbiAgICAgICAgbV9JbWFnZV91c2VyRmFjZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdXNlckZhY2VBdGFsczoge1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgIH0sXG4gICAgICAgIHVzZXJGYWNlVmlld1ByZWZhYjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyQnV0dG9uOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVG9nZ2xlR3JvdXAsXG4gICAgICAgIH0sXG4gICAgICAgIGdlbmRlck1hbkJ1dHRvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlRvZ2dsZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VuZGVyV29tYW5CdXR0b246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ub2dnbGUsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9vcmlnaW5QYXNzd29yZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3gsXG4gICAgICAgIH0sXG4gICAgICAgIG1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX0VkaXRib3hfbmV3UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94LFxuICAgICAgICB9LFxuICAgICAgICBtX1BhbmVsX3VzZXJDaGFuZ2U6IGNjLk5vZGUsXG4gICAgICAgIG1fUGFuZWxfdXNlckluZm86IGNjLk5vZGUsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2VkaXROYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVmcmVzaFVJKCk7XG4gICAgfSxcbiAgICByZWZyZXNoVUk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6Tmlja05hbWUgPSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lO1xuICAgICAgICB2YXIgbGxHYW1lU2NvcmUgPSBHbG9iYWxVc2VyRGF0YS5sbEdhbWVTY29yZTtcbiAgICAgICAgdmFyIGR3VXNlcklEID0gR2xvYmFsVXNlckRhdGEuZHdVc2VySUQ7XG4gICAgICAgIHZhciBjYkdlbmRlciA9IEdsb2JhbFVzZXJEYXRhLmNiR2VuZGVyIHx8IDE7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fQnV0dG9uX2NoYW5nZU5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJHb2xkLnN0cmluZyA9IGxsR2FtZVNjb3JlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlcklELnN0cmluZyA9IFwiSUQ6XCIgKyBkd1VzZXJJRDtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLnN0cmluZyA9IHN6Tmlja05hbWU7XG4gICAgICAgIGlmKCB0aGlzLl9mYWNlSUQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZVVzZXJGYWNlKCk7XG4gICAgICAgICAgICBjYkdlbmRlciA9IE1hdGguZmxvb3IoKHRoaXMuX2ZhY2VJRCAtIDEpLzQpICsgMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZmFjZUlEID0gdGhpcy5fZmFjZUlEIHx8IEdsb2JhbFVzZXJEYXRhLndGYWNlSUQ7XG4gICAgICAgIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgaWYgKGNiR2VuZGVyID09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2sgPSBcIiArIHRoaXMuZ2VuZGVyTWFuQnV0dG9uLmlzQ2hlY2tlZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdlbmRlcldvbWFuQnV0dG9uLmNoZWNrKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRoaXMuZ2VuZGVyV29tYW5CdXR0b24uaXNDaGVjayA9IFwiICsgdGhpcy5nZW5kZXJXb21hbkJ1dHRvbi5pc0NoZWNrZWQpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLm9uKCdvbkNoYW5nZVVzZXJGYWNlJyx0aGlzLm9uQ2hhbmdlVXNlckZhY2UsdGhpcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25FbmFibGVdXCIpO1xuXG4gICAgfSxcbiAgICBvbkRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjYy5kaXJlY3Rvci5vZmYoJ29uQ2hhbmdlVXNlckZhY2UnLHRoaXMub25DaGFuZ2VVc2VyRmFjZSx0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkRpc2FibGVdXCIpO1xuICAgIH0sXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLnN5cy5nYXJiYWdlQ29sbGVjdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIltVc2VyUHJvZmlsZVZpZXddW29uRGVzdHJveV1cIik7XG4gICAgfSxcbiAgICBvbkNoYW5nZVVzZXJGYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmYWNlSUQgPSB0aGlzLl9mYWNlSUQ7XG4gICAgICAgIC8vIGlmIChmYWNlSUQgPD0wIHx8IGZhY2VJRCA+IDgpIHtcbiAgICAgICAgLy8gICAgIGZhY2VJRCA9IDE7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBmYWNlSUQgPSBcIisgZmFjZUlEKTtcbiAgICAgICAgLy8gdGhpcy5tX0ltYWdlX3VzZXJGYWNlLnNwcml0ZUZyYW1lID0gdGhpcy51c2VyRmFjZUF0YWxzLmdldFNwcml0ZUZyYW1lKFwidXNlcmZhY2VfXCIgKyAoZmFjZUlELTEpKTtcbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlRmFjZUlkLmFzaHhcIjtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICAgICBwYXJhbXNbXCJ1c2VyaWRcIl0gPSBHbG9iYWxVc2VyRGF0YS5kd1VzZXJJRDtcbiAgICAgICAgcGFyYW1zW1wiZmFjZUlkXCJdID0gZmFjZUlEO1xuICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSBHbG9iYWxGdW4uYnVpbGRSZXF1ZXN0UGFyYW0ocGFyYW1zKTtcbiAgICAgICAgLy8gXCJkYXRldGFtcD0xNDk3NDExNTEyJmZhY2VJZD0yJnVzZXJpZD0yNzE0MjY0OSZzaWduPTkwOWM0N2I1MzBjNjhjOGU5N2ViZTQwN2MyMTJjN2RlXCJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNoYW5nZVVzZXJGYWNlXSBcIit4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQgJiYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCA0MDApKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlVXNlckZhY2VTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DaGFuZ2VVc2VyRmFjZV0gXCIgKyBwYXJhbVN0cmluZyk7XG5cbiAgICB9LFxuICAgIG9uQ2xpY2tDbG9zZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0Nsb3NlQnV0dG9uXSBkZXN0cm95XCIpO1xuICAgIH0sXG4gICAgb25DbGlja0VkaXROYW1lOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9jaGFuZ2VOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0xhYmVsX3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgIC8vIHRoaXMubV9CdXR0b25fZWRpdE5hbWUubm9kZS5lbWl0KGNjLkVkaXRCb3guZWRpdGluZy1kaWQtYmVnYW4pO1xuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZU5hbWU6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5tX0J1dHRvbl9lZGl0TmFtZS5ub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMubV9CdXR0b25fY2hhbmdlTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1fTGFiZWxfdXNlck5hbWUubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1fRWRpdGJveF91c2VyTmFtZS5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgc3pOZXdOaWNrTmFtZSA9IHRoaXMubV9FZGl0Ym94X3VzZXJOYW1lLnN0cmluZztcbiAgICAgICAgdGhpcy5tX0VkaXRib3hfdXNlck5hbWUuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHN6TmV3Tmlja05hbWUubGVuZ3RoIDw9IDAgfHwgc3pOZXdOaWNrTmFtZSA9PSBHbG9iYWxVc2VyRGF0YS5zek5pY2tOYW1lKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXJsID0gR2xvYmFsRGVmLmh0dHBVc2VyQ2VudGVyO1xuICAgICAgICB1cmwgKz0gXCIvSFpNb2JpbGUvVXBkYXRlTmlja05hbWUuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJuaWNrbmFtZVwiXSA9IHN6TmV3Tmlja05hbWU7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NoYW5nZU5hbWVdIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLm5pY2tuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzek5pY2tOYW1lID0gdmFsdWUubmlja25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1fTGFiZWxfdXNlck5hbWUuc3RyaW5nID0gc3pOaWNrTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdsb2JhbFVzZXJEYXRhLnN6Tmlja05hbWUgPSBzek5pY2tOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZW1pdChcIm9uQ2hhbmdlTmFtZVN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubXNnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLHZhbHVlLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcbiAgICAgICAgLy8geGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgICAgIHhoci5zZW5kKHBhcmFtU3RyaW5nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJbVXNlclByb2ZpbGVWaWV3XVtvbkNsaWNrQ2hhbmdlTmFtZV0gXCIgKyBwYXJhbVN0cmluZyk7XG4gICAgfSxcbiAgICBvbkNsaWNrQ2hhbmdlVXNlckZhY2U6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgdmFyIHVzZXJGYWNlVmlldyA9IGNjLmluc3RhbnRpYXRlKHRoaXMudXNlckZhY2VWaWV3UHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5hZGRDaGlsZCh1c2VyRmFjZVZpZXcpO1xuICAgICAgICAvLyB0aGlzLm9uQ2xpY2tDbG9zZUJ1dHRvbigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25DbGlja0Nsb3NlQnV0dG9uKCk7XG4gICAgICAgIEdsb2JhbEZ1bi5BY3Rpb25TaG93VGFuQ2h1YW5nKHVzZXJGYWNlVmlldyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIltQbGF6YVZpZXddW29uQ2xpY2tVc2VyUHJvZmlsZV1BY3Rpb25TaG93VGFuQ2h1YW5nIGNhbGxiYWNrXCIpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgb25DbGlja0NoYW5nZVBhc3N3b3JkOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckluZm8uYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICB0aGlzLm1fUGFuZWxfdXNlckNoYW5nZS5hY3RpdmUgPSB0cnVlO1xuICAgIH0sXG4gICAgb25DbGlja0NvbmZpcm1CdXR0b246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN6UGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9vcmlnaW5QYXNzd29yZC5zdHJpbmc7XG4gICAgICAgIHZhciBzek5ld1Bhc3N3b3JkID0gdGhpcy5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICB2YXIgc3pDb25maXJtUGFzc3dvcmQgPSB0aGlzLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nO1xuICAgICAgICBpZihzelBhc3N3b3JkLmxlbmd0aCA8PSAwIHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoIDw9IDAgfHwgc3pDb25maXJtUGFzc3dvcmQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggeS4jeiDveS4uuepuiFcIik7XG4gICAgICAgICAgICBHbG9iYWxGdW4uc2hvd0FsZXJ0KGNjLmRpcmVjdG9yLmdldFNjZW5lKCksXCLlr4bnoIHkuI3og73kuLrnqbohXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHN6UGFzc3dvcmQgPT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g5paw5pen5a+G56CB5LiN6IO955u45ZCMIVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuaWsOaXp+WvhueggeS4jeiDveebuOWQjCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pDb25maXJtUGFzc3dvcmQgIT0gc3pOZXdQYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbUGxhemFWaWV3XVtvbkNsaWNrQ29uZmlybUJ1dHRvbl0g56Gu6K6k5a+G56CB5LiN5LiA6Ie0IVwiKTtcbiAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSxcIuehruiupOWvhueggeS4jeS4gOiHtCFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3pOZXdQYXNzd29yZC5sZW5ndGggPCA2IHx8IHN6TmV3UGFzc3dvcmQubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1BsYXphVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIOWvhueggemVv+W6puS4ujYtMTbkvY0hXCIpO1xuICAgICAgICAgICAgR2xvYmFsRnVuLnNob3dBbGVydChjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLFwi5a+G56CB6ZW/5bqm5Li6Ni0xNuS9jSFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybCA9IEdsb2JhbERlZi5odHRwQmFzZVVybDtcbiAgICAgICAgdXJsICs9IFwiL2h6L2h6VXBkYXRlUGFzc1dvcmQuYXNoeFwiO1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tcInVzZXJpZFwiXSA9IEdsb2JhbFVzZXJEYXRhLmR3VXNlcklEO1xuICAgICAgICBwYXJhbXNbXCJ0eXBlXCJdID0gXCIxXCI7XG4gICAgICAgIHBhcmFtc1tcIm9sZHBhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pQYXNzd29yZCk7XG4gICAgICAgIHBhcmFtc1tcIm5ld3Bhc3NcIl0gPSBjYy5tZDVFbmNvZGUoc3pOZXdQYXNzd29yZCk7XG4gICAgICAgIHZhciBwYXJhbVN0cmluZyA9IEdsb2JhbEZ1bi5idWlsZFJlcXVlc3RQYXJhbShwYXJhbXMpO1xuICAgICAgICAvLyBcImRhdGV0YW1wPTE0OTc0MTE1MTImZmFjZUlkPTImdXNlcmlkPTI3MTQyNjQ5JnNpZ249OTA5YzQ3YjUzMGM2OGM4ZTk3ZWJlNDA3YzIxMmM3ZGVcIlxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiK3hoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKSk7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDQwMCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsVXNlckRhdGEuc3pQYXNzV29yZCA9IGNjLm1kNUVuY29kZShzek5ld1Bhc3N3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwYXNzd29yZCcsIHN6TmV3UGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm1fRWRpdGJveF9jb25maXJtUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfbmV3UGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tX0VkaXRib3hfb3JpZ2luUGFzc3dvcmQuc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tX1BhbmVsX3VzZXJJbmZvLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubV9QYW5lbF91c2VyQ2hhbmdlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5lbWl0KFwib25DaGFuZ2VQYXNzd29yZFN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHZhbHVlLm1zZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbEZ1bi5zaG93QWxlcnQoY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKSx2YWx1ZS5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG4gICAgICAgIC8vIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgICAgICB4aHIuc2VuZChwYXJhbVN0cmluZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW1VzZXJQcm9maWxlVmlld11bb25DbGlja0NvbmZpcm1CdXR0b25dIFwiICsgcGFyYW1TdHJpbmcpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzcGxhc2g6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5Ob2RlLFxuICAgICAgICB9LFxuICAgICAgICBfc3RlcDogMCxcbiAgICAgICAgX2NvdW50OiAwLFxuICAgICAgICBrRGVzaWduRnJhbWVSYXRlOiA2MC4wLFxuICAgICAgICBrU3BsYXNoU3RlcExvZ28xU3RpbGw6IDAsXG4gICAgICAgIGtTcGxhc2hTdGVwTG9nbzFGYWRlT3V0OiAxLFxuICAgICAgICBrU3BsYXNoRmFkZVRpbWU6IDAuNSxcbiAgICAgICAga1NwbGFzaFN0aWxsVGltZTogMi4wLFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICB0aGlzLl9zdGVwID0gMDtcbiAgICAgICAgLy8gdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgIC8vIH0sIDIpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHRoaXMuX2NvdW50ICs9IGR0O1xuICAgICAgICBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xU3RpbGwpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoU3RpbGxUaW1lKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGVwICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RlcCA9PT0gdGhpcy5rU3BsYXNoU3RlcExvZ28xRmFkZU91dClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvdW50ID4gdGhpcy5rU3BsYXNoRmFkZVRpbWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGxhc2guYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIkxvZ2luU2NlbmVcIik7XG4gICAgICAgICAgICAgICAgY2Muc3lzLmdhcmJhZ2VDb2xsZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG9wID0gMjU1ICogKDEuMCAtIE1hdGguc2luKCh0aGlzLl9jb3VudC8xLjApICogMC41ICogTWF0aC5QSSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsYXNoLm9wYWNpdHkgPSBvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=