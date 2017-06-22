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
        if(this.onCreateSocket(GlobalFun.numberToIp(this._roomInfo.dwServerAddr),this._roomInfo.wServerPort) === false) {
            console.log("[GameFrame][onLogonRoom][onCreateSocket] fail");
            return false;
        }
        console.log("[GameFrame][onLogonRoom][onCreateSocket] success");
        return true;
    },
    onConnectCompeleted: function() {
        this.sendLogonPacket();
    },
    onSocketEvent: function(main,sub,pData) {
        var self = this;
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
                [GlobalDef.MDM_GF_PRESENT] : function (sub, pData) {
                    
                },
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
            // console.log("logonframe login error");
        }
        else if(sub === game_cmd.SUB_GR_LOGON_FINISH){
            console.log("[GameFrame][OnSocketMainLogon] Logon Finish");
        }
    },
    OnSocketMainUser: function(sub,pData) {
        console.log("[GameFrame][OnSocketMainUser]");
        console.log("[GameFrame][OnSocketMainUser] pData len = " + pData.getDataSize());
        var self = this;
        if (!this._socketMainUserCallback) {
            this._socketMainUserCallback = {
                [game_cmd.SUB_GR_USER_COME]: function (sub, pData) {
                    console.log("SUB_GR_USER_COME");
                    this.OnSocketSubUserCome(sub,pData);
                },
                [game_cmd.SUB_GR_USER_STATUS]: function (sub, pData) {
                    console.log("SUB_GR_USER_STATUS");
                    this.OnSocketSubStatus(sub,pData);
                },
                [game_cmd.SUB_GR_USER_SCORE]: function (sub, pData) {
                    console.log("SUB_GR_USER_SCORE");
                    this.OnSocketSubScore(sub,pData);
                },
                [game_cmd.SUB_GR_USER_RIGHT]: function (sub, pData) {
                    console.log("SUB_GR_USER_RIGHT");
                    this.OnSocketSubRight(sub,pData);
                },
                [game_cmd.SUB_GR_MEMBER_ORDER]: function (sub, pData) {
                    console.log("SUB_GR_MEMBER_ORDER");
                    this.OnSocketSubMemberOrder(sub,pData);
                },
                [game_cmd.SUB_GR_SIT_FAILED]: function (sub, pData) {
                    console.log("SUB_GR_SIT_FAILED");
                    this.OnSocketSubSitFailed(sub,pData);
                },
                [game_cmd.SUB_GR_USER_CHAT]: function (sub, pData) {
                    console.log("SUB_GR_USER_CHAT");
                    this.OnSocketSubChat(sub,pData);
                },
                [game_cmd.SUB_GR_USER_WISPER]: function (sub, pData) {
                    console.log("SUB_GR_USER_WISPER");
                    this.OnSocketSubWisper(sub,pData);
                },
                [game_cmd.SUB_GR_USER_INVITE]: function (sub, pData) {
                    console.log("SUB_GR_USER_INVITE");
                    this.OnSocketSubUserInvite(sub,pData);
                },
                [game_cmd.SUB_GR_QUERY_GOLD]: function (sub, pData) {
                    console.log("SUB_GR_QUERY_GOLD");
                    this.OnSocketSubQueryGold(sub,pData);
                },
                [game_cmd.SUB_GR_PRESEND_QUERY]: function (sub, pData) {
                    console.log("SUB_GR_PRESEND_QUERY");
                    this.OnSocketSubPresentQuery(sub,pData);
                },
                [game_cmd.SUB_GR_PRESENT_ERROR]: function (sub, pData) {
                    console.log("SUB_GR_PRESENT_ERROR");
                    // this.OnSocketSubUserCome(sub,pData);
                },
            }
        }
        if (this._socketMainUserCallback && this._socketMainUserCallback[sub]) {
            var fun = this._socketMainUserCallback[sub];
            // fun(sub, pData);
            fun.call(this,sub,pData);
        }
        else
        {
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
                break;
            case game_cmd.SUB_GR_TABLE_STATUS:
                console.log("SUB_GR_TABLE_STATUS");
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
        if (userItem.wTableID !== GlobalDef.INVALID_TABLE && userItem.wChairID !== GlobalDef.INVALID_CHAIR)
        {
            this.onUpDataTableUser(userItem.wTableID,userItem.wChairID,userItem);
            cc.director.emit("onEventUserEnter",{
                wTableID:userItem.wTableID,
                wChairID:userItem.wChairID,
                userItem:userItem,
            });
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
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
            //换位
            else if (userStatus.wTableID !== GlobalDef.INVALID_TABLE) {
                console.log("[GameFrame][OnSocketSubStatus] 换位");
                cc.director.emit("onEnterTable");
                cc.director.emit("onEventUserStatus",{
                    userItem:userItem,
                    newStatus:userStatus,
                    oldStatus:oldStatus,
                });
            }
            else {
                console.log("[GameFrame][OnSocketSubStatus] 自己新状态 " + JSON.stringify(userStatus));
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
        if(myUserItem.wTableID !== GlobalDef.INVALID_TABLE)
        {
            cc.director.emit("onEventUserScore",{
                userScore:userScore,
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
        var sitData = CCmd_Data.create();
        sitData.setcmdinfo(game_cmd.MDM_GR_USER,game_cmd.SUB_GR_USER_SIT_REQ);
        if (szPassWord) {
            sitData.pushbyte(szPassWord.length);
        }
        else {
            sitData.pushbyte(0);
        }
        sitData.pushword(wChairID);
        sitData.pushword(wTableID);
        sitData.pushstring(szPassWord,GlobalDef.PASS_LEN);

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
    onUpDataTableUser: function (tableid,chairid,useritem) {
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
    getTableUserItem: function (tableid,chairid) {
        var id = tableid;
        var idex = chairid;
        if (this._tableUserList[id]) {
            return this._tableUserList[id][idex];
        }
    },
    getMeUserItem: function () {
        return this._userList[GlobalUserData.dwUserID];
    },
    searchUserByUserID: function (dwUserID) {
        return this._userList[dwUserID];
    },
    onRemoveUser: function (dwUserID) {
        this._userList[dwUserID] = undefined;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
