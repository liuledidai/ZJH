var BaseFrame = require("BaseFrame");
require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var zjh_cmd = require("CMD_ZaJinHua");
var GlobalUserData = require("GlobalUserData");
var GameServerItem = require("GameServerItem");
var GlobalDef = require("GlobalDef");
var ChatDef = require("ChatDef");
var GlobalFun = require("GlobalFun");
var GameUserItem = require("GameUserItem");
cc.Class({
    extends: BaseFrame,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.init();
    },
    init: function (params) {
        this._wTableCount = 0;
	    this._wChairCount = 0;
	    this._wServerType = 0;
	    this._dwServerRule = 0;
        this._cbGameStatus 	= 0;
        this._cbAllowLookon = 0;
        this._cbHideUserInfo = false;
        this.bChangeDesk = false;
        this._userList = {};  
        this._tableUserList = {};
        this._tableStatus = {};
        this._wTableID = GlobalDef.INVALID_TABLE;
        this._wChairID = GlobalDef.INVALID_CHAIR;
    },
    onLogonRoom: function (roomInfo) {
        this._roomInfo = roomInfo;
        if (!this._roomInfo) {
            console.log("[GameFrame][onLogonRoom] 获取房间信息失败");
            return;
        }
        console.log("[GameFrame][onLogonRoom] 登录房间: " + GlobalFun.numberToIp(this._roomInfo.dwServerAddr) + "# " + this._roomInfo.wServerPort);
        if (this._socket) {
            this.onCloseSocket();
        }
        if(this.onCreateSocket(GlobalFun.numberToIp(this._roomInfo.dwServerAddr),this._roomInfo.wServerPort) === false) {
            console.log("[GameFrame][onLogonRoom][onCreateSocket] fail");
            return false;
        }
        console.log("[GameFrame][onLogonRoom][onCreateSocket] success");
        return true;
    },
    onConnectCompeleted: function() {
        //初始化参数
        this.init();
        cc.director.emit("LoadingViewOnConnect",{message:"正在连接游戏房间..."});
        this.sendLogonPacket();
    },
    onSocketEvent: function(main,sub,pData) {
        console.log("[GameFrame][onSocketEvent] pData len = " + pData.getDataSize());
        if (!this._socketEventCallback) {
            this._socketEventCallback = {
                [game_cmd.MDM_GR_LOGON] : this.OnSocketMainLogon,//登录消息
                [game_cmd.MDM_GR_USER] : this.OnSocketMainUser,//用户消息
                [game_cmd.MDM_GR_INFO] : this.OnSocketMainInfo,//配置消息
                [game_cmd.MDM_GR_STATUS] : this.OnSocketMainStatus,//状态消息
                [game_cmd.MDM_GR_SYSTEM] : this.OnSocketMainSystem,//系统消息
                [game_cmd.MDM_GR_SERVER_INFO] : this.OnSocketMainServerInfo,//房间消息
                [GlobalDef.MDM_GF_GAME] : function (sub, pData) {//游戏消息
                    cc.director.emit("onEventGameMessage",{
                        sub:sub,
                        pData:pData,
                    })
                },
                [GlobalDef.MDM_GF_FRAME] : this.OnSocketMainGameFrame,//框架消息
                [GlobalDef.MDM_GF_PRESENT] : this.OnGamePresentMessage,//礼物消息
            }
        }
        if (this._socketEventCallback && this._socketEventCallback[main]) {
            var fun = this._socketEventCallback[main];
            fun.call(this, sub, pData);
        }
        else
        {
            console.log("[GameFrame][onSocketEvent] main = "+ main + "sub = " + sub + " not find");
        }
    },
    OnSocketMainLogon: function(sub,pData) {
        console.log("[GameFrame][OnSocketMainLogon]");
        if (sub === game_cmd.SUB_GR_LOGON_SUCCESS){
            console.log("[GameFrame][OnSocketMainLogon] logon success");
            this._userList = {};
            // cc.director.emit("LogonSuccess");
        }
        else if (sub === game_cmd.SUB_GR_LOGON_ERROR) {
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
                cc.director.emit("LoadingViewError",{msg:logonError.szErrorDescribe,type:GlobalDef.SMT_CLOSE_GAME});
            }
            // console.log("logonframe login error");
        }
        else if(sub === game_cmd.SUB_GR_LOGON_FINISH){
            // cc.director.loadScene("GameScene");
            cc.director.emit("LoadingViewOnLogonFinish",{message:"正在进入游戏..."});
            this.onSocketLogonFinish();
            console.log("[GameFrame][OnSocketMainLogon] Logon Finish");
        }
    },
    //登录完成
    onSocketLogonFinish: function () {
        console.log("[GameFrame][onSocketLogonFinish]");
        var myUserItem = this.getMeUserItem();
        if (!myUserItem) {
            console.log("[GameFrame][onSocketLogonFinish] 获取自己的信息失败");
            return;
        }
        if (this._wTableID !== GlobalDef.INVALID_TABLE) {
            cc.director.emit("onEnterTable");
            this.sendGameOption();
        }
        else {
            cc.director.emit("onEnterRoom");
            this.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR);
        }
    },
    OnSocketMainUser: function(sub,pData) {
        console.log("[GameFrame][OnSocketMainUser]");
        if (!this._socketMainUserCallback) {
            this._socketMainUserCallback = {
                [game_cmd.SUB_GR_USER_COME]: this.OnSocketSubUserCome,
                [game_cmd.SUB_GR_USER_STATUS]: this.OnSocketSubStatus,
                [game_cmd.SUB_GR_USER_SCORE]: this.OnSocketSubScore,
                [game_cmd.SUB_GR_USER_RIGHT]: this.OnSocketSubRight,
                [game_cmd.SUB_GR_MEMBER_ORDER]: this.OnSocketSubMemberOrder,
                [game_cmd.SUB_GR_SIT_FAILED]: this.OnSocketSubSitFailed,
                [game_cmd.SUB_GR_USER_CHAT]: this.OnSocketSubChat,
                [game_cmd.SUB_GR_USER_WISPER]: this.OnSocketSubWisper,
                [game_cmd.SUB_GR_USER_INVITE]: this.OnSocketSubUserInvite,
                [game_cmd.SUB_GR_QUERY_GOLD]: this.OnSocketSubQueryGold,
                [game_cmd.SUB_GR_PRESEND_QUERY]: this.OnSocketSubPresentQuery,
                [GlobalDef.SUB_GF_QUICKPHRASE_DOWN]: this.OnSocketQuickPhraseDown,
                [game_cmd.SUB_GR_PRESENT_ERROR]: function (sub, pData) {
                    console.log("SUB_GR_PRESENT_ERROR");
                    // this.OnSocketSubUserCome(sub,pData);
                },
            }
        }
        if (this._socketMainUserCallback && this._socketMainUserCallback[sub]) {
            var fun = this._socketMainUserCallback[sub];
            fun.call(this,sub,pData);
        }
        else
        {
            console.log("[GameFrame][OnSocketMainUser] sub = " + sub + " not find");
        }
    },
    OnSocketMainInfo: function (sub,pData) {
        console.log("[GameFrame][OnSocketMainInfo]");
        switch(sub){
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
    OnSocketMainStatus: function (sub,pData) {
        console.log("[GameFrame][OnSocketMainStatus]");
        switch(sub){
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

                cc.director.emit("upDateTableStatus",{
                    wTableID:tableStatus.wTableID,
                });
                break;
            default:
                break;
        }
    },
    //系统消息
    OnSocketMainSystem: function (sub,pData) {
        console.log("[GameFrame][OnSocketMainSystem]");
        switch(sub){
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
                }
                else if (message.wMessageType & game_cmd.SMT_CLOSE_ROOM) {
                    bIntermet = true;
                }

                console.log("[GameFrame][OnSocketMainSystem] message = " + message.szContent + " type = " + message.wMessageType);
                if (bIntermet) {
                    if (message.szContent) {
                        cc.director.emit("LoadingViewError",{msg:message.szContent,type:GlobalDef.SMT_CLOSE_GAME});
                    }
                    console.log("[GameFrame][OnSocketMainSystem] " + message.szContent);
                    this.onCloseSocket();
                }
                if (message.wMessageType & GlobalDef.SMT_EJECT) {
                    // console.log("[GameFrame][OnSocketMainSystem] message = " + message.szContent + " type = " + message.wMessageType);
                    GlobalFun.showAlert({
                        message: message.szContent,
                        // btn: [
                        //     {
                        //         name: "确定",
                        //         callback: function () {
                        //             cc.director.emit("onExitRoom")
                        //         }
                        //     }
                        // ],
                    })
                }
                break;
            default:
                break;
        }
    },
    //房间消息
    OnSocketMainServerInfo: function (sub,pData) {
        console.log("[GameFrame][OnSocketMainServerInfo]");
        switch(sub){
            case game_cmd.SUB_GR_ONLINE_COUNT_INFO:
                console.log("SUB_GR_ONLINE_COUNT_INFO");
                break;
            default:
                break;
        }
    },
    OnSocketMainGameFrame: function (sub,pData) {
        console.log("[GameFrame][OnSocketMainGameFrame]");
        switch(sub){
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
                        btn: [
                            {
                                name: "确定",
                                callback: function () {
                                    cc.director.emit("onExitRoom")
                                }
                            }
                        ],
                    })
                }
                if (message.wMessageType & GlobalDef.SMT_GLOBAL){

                }
                break;
            case GlobalDef.SUB_GF_SCENE:
                //游戏场景
                console.log("SUB_GF_SCENE");
                cc.director.emit("onEventGameScene",{
                    cbGameStatus:this._cbGameStatus,
                    pData:pData,
                })
                break;
            default:
                break;
        }
    },
    //用户进入
    OnSocketSubUserCome: function (sub,pData) {
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
        if (userItem.wTableID !== GlobalDef.INVALID_TABLE && userItem.wChairID !== GlobalDef.INVALID_CHAIR)
        {
            this.onUpDateTableUser(userItem.wTableID,userItem.wChairID,userItem);
            cc.director.emit("onEventUserEnter",{
                wTableID:userItem.wTableID,
                wChairID:userItem.wChairID,
                userItem:userItem,
            });
        }
        if (userItem.dwUserID === GlobalUserData.dwUserID){
            // this.onSocketLogonFinish();
        }
    },
    OnSocketSubStatus: function (sub,pData) {
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
        if(oldStatus.wTableID !== GlobalDef.INVALID_TABLE) {
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
                }
                else {
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
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
            //换位
            else if (userStatus.wTableID !== GlobalDef.INVALID_TABLE && this.bChangeDesk) {
                console.log("[GameFrame][OnSocketSubStatus] 换位");
                cc.director.emit("onEnterTable");
                this.sendGameOption();
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
            else {
                console.log("[GameFrame][OnSocketSubStatus] 自己新状态 " + JSON.stringify(userStatus, null, ' '));
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
        }
        //他人状态
        else {
            //更新用户
            if (oldStatus.wTableID !== GlobalDef.INVALID_TABLE || userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
            //删除用户
            if (userStatus.cbUserStatus === GlobalDef.US_NULL) {
                this.onRemoveUser(userStatus.dwUserID);
            }
        }
    },
    OnSocketSubScore: function (sub,pData) {
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
        userScore.UserScore.lScore = pData.readint64();                             //用户分数
        userScore.UserScore.lGameGold = pData.readint64();                          //游戏金币
        userScore.UserScore.lInsureScore = pData.readint64();                       //存储金币
        userScore.UserScore.lWinCount = pData.readint();                          //胜利盘数
        userScore.UserScore.lLostCount = pData.readint();                         //失败盘数
        userScore.UserScore.lDrawCount = pData.readint();                         //和局盘数
        userScore.UserScore.lFleeCount = pData.readint();                         //断线数目
        userScore.UserScore.lExperience = pData.readint();                        //用户经验

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
        if(this._wTableID !== GlobalDef.INVALID_TABLE)
        {
            cc.director.emit("onEventUserScore",{
                userItem:userItem,
            });
        }
    },
    OnSocketSubRight: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubRight]");
    },
    OnSocketSubMemberOrder: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubMemberOrder]");
    },
    OnSocketSubSitFailed: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubSitFailed]");
        //坐下失败
        // struct CMD_GR_SitFailed
        // {
        //     TCHAR							szFailedDescribe[256];				//错误描述
        // };
        var szFailedDescribe = pData.readstring(256);
        console.log("[GameFrame][OnSocketSubSitFailed] " + szFailedDescribe);
    },
    OnSocketSubChat: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubChat]");
    },
    OnSocketSubWisper: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubWisper]");
    },
    OnSocketSubUserInvite: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubUserInvite]");
    },
    OnSocketSubQueryGold: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubQueryGold]");
    },
    OnSocketSubPresentQuery: function (sub,pData) {
        console.log("[GameFrame][OnSocketSubPresentQuery]");
    },
    OnSocketQuickPhraseDown: function (sub,pData) {
        console.log("[GameFrame][OnSocketQuickPhraseDown]");
                //         //用户文字表情聊天
        // struct CMD_GF_TableChat
        // {
        //     WORD                                wTableID;						//桌子号
        //     WORD                                wChairID;						//椅子号
        //     WORD                                wBufferSize;                    //实际长度
        //     BYTE                                cbType;                         //聊天类型 1表情，2固定文字，3文字
        //     BYTE                                cbBuffer[256];                  //文字或者索引
        // };
        var tableChat = {};
        tableChat.wTableID = pData.readword();
        tableChat.wChairID = pData.readword();
        tableChat.wBufferSize = pData.readword();
        tableChat.cbType = pData.readbyte();
        if (tableChat.cbType == ChatDef.ChatType.Emotion || tableChat.cbType == ChatDef.ChatType.QuickChat) {
            tableChat.cbBuffer = pData.readword();
        }
        else {
            tableChat.cbBuffer = pData.readstring(256);
        }
        cc.director.emit("OnEventChatMsg",{
            tableChat:tableChat,
        });
    },
    OnGamePresentMessage: function (sub,pData) {
        console.log("[GameFrame][OnGamePresentMessage]");
        if(sub == GlobalDef.SUB_GF_PRESENT_RESULT) {
            this.OnSubMoblieGift(sub,pData);
        }
    },
    OnSubMoblieGift: function (sub,pData) {
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

        cc.director.emit("OnSubMoblieGift",{present:present});
        console.log("[GameFrame][OnSubMoblieGift] present = " + JSON.stringify(present, null, ' '));
    },
    sendLogonPacket: function() {
        console.log("[GameFrame][sendLogonPacket]");
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(game_cmd.MDM_GR_LOGON,game_cmd.SUB_GR_LOGON_MOBILE);
        logonData.pushword(GlobalUserData.wEncryptID);
        logonData.pushword(GlobalUserData.wCodeCheckID);
        logonData.pushdword(0);
        logonData.pushdword(GlobalUserData.dwUserID);

        var dwMobileSysType = 1;
        if(cc.sys.os == cc.sys.OS_IOS){
            dwMobileSysType = 1;
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID){
            dwMobileSysType = 2;
        }
        logonData.pushdword(dwMobileSysType);

        logonData.pushdword(1);
        logonData.pushstring(GlobalUserData.szPassWord,33);
        console.log("[GameFrame][sendLogonPacket] password = " + GlobalUserData.szPassWord);
        logonData.pushstring("",33);
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
    sendSitDownPacket: function (wTableID, wChairID, szPassWord) {
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
        sitData.setcmdinfo(game_cmd.MDM_GR_USER,game_cmd.SUB_GR_USER_SIT_REQ);
        var cbPassLen = 0;
        if (szPassWord) {
            cbPassLen = szPassWord.length;
        }

        sitData.pushbyte(cbPassLen);
        sitData.pushword(wChairID);
        sitData.pushword(wTableID);
        sitData.pushstring(szPassWord,GlobalDef.PASS_LEN);
        console.log("size1 = " + sitData.getDataSize());
        var sendSize = sitData.getDataSize() - GlobalDef.PASS_LEN + cbPassLen;
        console.log("size2 = " + sendSize);
        sitData.setDataSize(sendSize);


        this.sendSocketData(sitData);
    },
    //站起来
    sendStandupPacket: function () {
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_STANDUP_REQ);

        this.sendSocketData(data);
    },
    sendLeftGamePacket: function () {
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_LEFT_GAME_REQ);

        this.sendSocketData(data);
    },
    //发送准备
    sendUserReady: function () {
        var data = CCmd_Data.create();
        data.setcmdinfo(GlobalDef.MDM_GF_FRAME, GlobalDef.SUB_GF_USER_READY);

        this.sendSocketData(data);
    },
    //发送游戏信息
    sendGameOption: function () {
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
    sendTextChat: function(msg, tagetUser, color) {
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
        color = color || 16777215;//RGB(255,255,255)
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, game_cmd.SUB_GR_USER_CHAT);
        data.pushword(msgLen);
        data.pushdword(color);
        data.pushdword(GlobalUserData.dwUserID);
        data.pushdword(tagetUser);
        data.pushstring(msg,GlobalDef.MAX_CHAT_LEN);

        console.log("size1 = " + data.getDataSize());
        var sendSize = data.getDataSize() - GlobalDef.MAX_CHAT_LEN + msgLen;
        console.log("size2 = " + sendSize);
        data.setDataSize(sendSize);


        // this.sendSocketData(sitData);

        this.sendSocketData(data);
    },
    //聊天（文字、表情）
    sendChatMsg: function (chatType, wTableID, wChairID, msg) {
        //         //用户文字表情聊天
        // struct CMD_GF_TableChat
        // {
        //     WORD                                wTableID;						//桌子号
        //     WORD                                wChairID;						//椅子号
        //     WORD                                wBufferSize;                    //实际长度
        //     BYTE                                cbType;                         //聊天类型 1表情，2固定文字，3文字
        //     BYTE                                cbBuffer[256];                  //文字或者索引
        // };
        var wBufferSize = 256;
        // if (typeof(msg) == "number") {
        //     wBufferSize = 2;
        // }
        // else {
        //     wBufferSize = 256;
        // }
        var data = CCmd_Data.create();
        data.setcmdinfo(game_cmd.MDM_GR_USER, GlobalDef.SUB_GF_QUICKPHRASE_UP);
        data.pushword(wTableID);
        data.pushword(wChairID);
        data.pushword(wBufferSize);
        data.pushbyte(chatType);
        if (typeof(msg) == "number") {
            data.pushword(msg);
        }
        else {
            data.pushstring(msg,256);
        }
        //  WORD wDataSize = wBufferSize + sizeof(WORD)*3 + sizeof(BYTE);
        var sendSize = wBufferSize + 7;
        data.setDataSize(sendSize);

        this.sendSocketData(data);
    },
    sendGift: function (wRecvChairID, cbGiftID, count, password) {
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
        data.pushstring(password,GlobalDef.PASS_LEN);

        this.sendSocketData(data);
    },
    onUpDateTableUser: function (tableid,chairid,useritem) {
        var id = tableid;
        var idex = chairid;
        if (!this._tableUserList[id]) {
            this._tableUserList[id] = {};
        }
        if (useritem) {
            this._tableUserList[id][idex] = useritem;
        }
        else {
            this._tableUserList[id][idex] = undefined;
        }
    },
    //获取桌子用户
    getTableUserItem: function (tableid,chairid) {
        var id = tableid;
        var idex = chairid;
        if (this._tableUserList[id]) {
            return this._tableUserList[id][idex];
        }
    },
    getTableInfo: function (index) {
        if (index > 0) {
            return this._tableStatus[index];
        }
    },
    getChairCount: function () {
        return this._wChairCount;  
    },
    getTableCount: function () {
        return this._wTableCount;  
    },
    //获取桌子ID
    getTableID: function () {
        return this._wTableID;
    },
    //获取椅子ID
    getChairID: function () {
        return this._wChairID;  
    },
    //获取游戏状态
    getGameStatus: function () {
        return this._cbGameStatus;  
    },
    //设置游戏状态
    setGameStatus: function (cbGameStatus) {
        this._cbGameStatus = cbGameStatus;
    },
    //获取自己游戏信息
    getMeUserItem: function () {
        return this._userList[GlobalUserData.dwUserID];
    },
    searchUserByUserID: function (dwUserID) {
        return this._userList[dwUserID];
    },
    onRemoveUser: function (dwUserID) {
        this._userList[dwUserID] = undefined;
    },
    onResetGameEngine: function () {
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
