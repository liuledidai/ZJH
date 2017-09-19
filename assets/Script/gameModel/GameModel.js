var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var ChatDef = require("ChatDef");

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
    onLoad: function () {
        console.log("[GameModel][onLoad]");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode){
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
        }
        this.onInitGameEngine();
        this.m_bOnGame = false;
        this.m_cbGameStatus = -1;
        AudioMng.playMusic("bgm_room");
    },
    onDestroy: function () {
        AudioMng.stopMusic();
        this._gameFrame.onCloseSocket();
        cc.sys.garbageCollect();
    },
    onEnable: function (params) {
        console.log("[GameModel][onEnable]");
        cc.director.on("onEventGameMessage",this.onEventGameMessage,this);
        cc.director.on("onEventGameScene",this.onEventGameScene,this);
        cc.director.on("onEventUserEnter",this.onEventUserEnter,this);
        cc.director.on("onEventUserStatus",this.onEventUserStatus,this);
        cc.director.on("onEventUserScore",this.onEventUserScore,this);
        cc.director.on("onExitRoom",this.onExitRoom,this);
        cc.director.on("onExitTable",this.onExitTable,this);
        cc.director.on("OnSubMoblieGift",this.OnSubMoblieGift,this);
        cc.director.on("OnEventChatMsg",this.OnEventChatMsg,this);
    },
    onDisable: function (params) {
        console.log("[GameModel][onDisable]");
        cc.director.off("onEventGameMessage",this.onEventGameMessage,this);
        cc.director.off("onEventGameScene",this.onEventGameScene,this);
        cc.director.off("onEventUserEnter",this.onEventUserEnter,this);
        cc.director.off("onEventUserStatus",this.onEventUserStatus,this);
        cc.director.off("onEventUserScore",this.onEventUserScore,this);
        cc.director.off("onExitRoom",this.onExitRoom,this);
        cc.director.off("onExitTable",this.onExitTable,this);
        cc.director.off("OnSubMoblieGift",this.OnSubMoblieGift,this);
        cc.director.off("OnEventChatMsg",this.OnEventChatMsg,this);
        
    },
    //初始化游戏数据
    onInitGameEngine: function () {
        console.log("[GameModel][onInitGameEngine]");
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
    },
    //重置框架
    onResetGameEngine: function () {
        console.log("[GameModel][onResetGameEngine]");
        this.killGameClock();
        this.m_bOnGame = false;
    },
    //退出询问
    onQueryExitGame: function () {
        // this.onExitTable();
        if (this.m_bOnGame) {
            GlobalFun.showAlert({
                message: "陛下，打算临战退缩吗？强退将会被笨笨的机器人托管，确定离开？",
                btn:[
                    {
                        name:"取消",
                    },
                    {
                        name:"确定",
                        callback:function () {
                            cc.director.emit("onExitRoom");
                        }
                    }
                ],
            })
        }
        else {
            this.onExitRoom();
        }
    },
    standUpAndQuit: function () {
        
    },
    //退出桌子
    onExitTable: function () {
        console.log("[GameModel][onExitTable]");
        this.killGameClock();

        var myItem = this.getMeUserItem();
        if (myItem && myItem.cbUserStatus > GlobalDef.US_FREE) {
            this._gameFrame.sendStandupPacket();
            return;
        }
    },
    onExitRoom: function () {
        this._gameFrame.sendStandupPacket();
        this._gameFrame.sendLeftGamePacket();
        // this._gameFrame.onCloseSocket();
        this.killGameClock();  
    },
    onKeyBack: function () {
        this.onQueryExitGame();
    },
    //获取自己椅子
    getMeChairID: function () {
        return this._gameFrame.getChairID();
    },
    //获取自己桌子
    getMeTableID: function () {
        return this._gameFrame.getTableID();
    },
    getMeUserItem: function () {
        return this._gameFrame.getMeUserItem();
    },
    // 椅子号转视图位置,注意椅子号从0~nChairCount-1,返回的视图位置从0~nChairCount-1
    switchViewChairID: function (chair) {
        var viewID = GlobalDef.INVALID_CHAIR;
        var nChairCount = this._gameFrame.getChairCount();  
        var nChairID = this.getMeChairID();
        if (chair !== GlobalDef.INVALID_CHAIR && chair < nChairCount) {
            viewID = ((chair + nChairCount - nChairID)%(nChairCount)) ;//+ 1;
        }
        console.log("[GameModel][switchViewChairID] + [nChairCount,nChairID,chair,viewID] = "+ [nChairCount,nChairID,chair,viewID]);
        return viewID;
    },
    //是否合法视图ID
    isValidViewID: function (viewID) {
        var nChairCount = this._gameFrame.getChairCount();
        return (viewID >= 0) && (viewID < nChairCount);  
    },
    //设置计时器
    setGameClock: function (chair, id, time) {
        if (!cc.director.getScheduler().isScheduled(this.onClockUpdata,this)) {
            cc.director.getScheduler().schedule(this.onClockUpdata, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
        }  
        this._ClockChair = chair;
        this._ClockID = id;
        this._ClockTime = time;
        this._ClockViewChair = this.switchViewChairID(chair);
        this.onUpdateClockView();
    },
    //关闭计时器
    killGameClock: function (notView) {
        console.log("[GameModel][killGameClock]");
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
        if (cc.director.getScheduler().isScheduled(this.onClockUpdata,this)) {
            console.log("[GameModel][killGameClock] unschedule this.onClockUpdata");
            cc.director.getScheduler().unschedule(this.onClockUpdata, this);
        }  
        if (! notView) {
            this.onUpdateClockView();
        }
    },
    getClockViewID: function () {
        return this._ClockViewChair;
    },
    //计时器更新
    onClockUpdata: function (dt) {
        // console.log("---------------------------dt = " + dt);
        // console.log("[GameModel][onClockUpdata] chair = " + this._ClockChair + " time = " + this._ClockTime + " id = " + this._ClockID);
        if (this._ClockID !== GlobalDef.INVALID_ITEM) {
            this._ClockTime = this._ClockTime - 1;
            var ret = this.onEventGameClockInfo(this._ClockChair, this._ClockTime, this._ClockID);
            if (ret === true || this._ClockTime < 1) {
                console.log("[GameModel][onClockUpdata] [ret,clocktime] = " + [ret,this._ClockTime]);
                this.killGameClock();
            }
        }  
        this.onUpdateClockView();
    },
    //更新计时器显示
    onUpdateClockView: function () {
        // onUpdateClockView
        // console.log("[GameModel][onUpdateClockView] clockTime = " + this._ClockTime + " viewChair = " + this._ClockViewChair);
    },
    //用户状态 
    onEventUserStatus: function (params) {
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
                if (this._gameView && this._gameView.onUpdateUser)
                {
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
                if (this._gameView && this._gameView.onUpdateUser)
                {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //用户积分
    onEventUserScore: function (params) {
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
                if (this._gameView && this._gameView.onUpdateUser)
                {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //用户进入
    onEventUserEnter: function (params) {
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
                if (this._gameView && this._gameView.onUpdateUser)
                {
                    this._gameView.onUpdateUser(viewID, userItem);
                }
            }
        }
    },
    //魅力赠送
    OnSubMoblieGift: function (params) {
        // present.cbGiftID 
        // present.wSendChairID 
        // present.wRecvChairID
        // present.wGiftCount
        var present = params.detail.present;
        if (present && this._gameView && this._gameView.showSendPresent) {
            this._gameView.showSendPresent(
                present.wSendChairID,
                present.wRecvChairID,
                present.cbGiftID,
                present.wGiftCount
            );
        } 
    },
    //发送准备
    sendUserReady: function () {
        this._gameFrame.sendUserReady();
    },
    sendTextChat: function(msg, tagetUser, color) {
        this._gameFrame.sendTextChat(msg, tagetUser, color);
    },
    sendChatMsg: function (chatType, wTableID, wChairID, msg) {
        this._gameFrame.sendChatMsg(chatType, wTableID, wChairID, msg);
    },
    sendGift: function (wRecvChairID, cbGiftID, count, password) {
        this._gameFrame.sendGift(wRecvChairID, cbGiftID, count, password);
    },
    //发送数据
    sendData : function (sub, dataBuf) {
        if (this._gameFrame) {
            dataBuf.setcmdinfo(GlobalDef.MDM_GF_GAME, sub);
            this._gameFrame.sendSocketData(dataBuf);
        }
    },

    //场景消息
    onEventGameScene: function (params) {
        
    },
    //游戏消息
    onEventGameMessage: function (params) {
        
    },
    //计时器响应
    onEventGameClockInfo: function (chair, time, clockID) {
        
    },
    //文字表情聊天
    OnEventChatMsg: function (params) {
        var tableChat = params.detail.tableChat;
        var viewID = this.switchViewChairID(tableChat.wChairID);
        console.log(viewID);
        console.log(JSON.stringify(tableChat, null, " "));
        var chatType = tableChat.cbType;
        if (chatType == ChatDef.ChatType.Emotion) {
            var index = parseInt(tableChat.cbBuffer);
            console.log("[OnEventChatMsg]", chatType, index);
            if (this._gameView && this._gameView.showUserEmotion) {
                this._gameView.showUserEmotion(viewID, index);
            }
        }
        else if (chatType == ChatDef.ChatType.QuickChat) {
            var index = parseInt(tableChat.cbBuffer);
            console.log("[OnEventChatMsg]", chatType, index);
            var soundName = "sfx_chat_" + index;
            AudioMng.playSFX(soundName);
            var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), tableChat.wChairID);
            if (!userItem) {
                return;
            }
            if (userItem.cbGender == GlobalDef.GENDER_GIRL) {
                index -= 9;
            }
            if (index >= 0 && index < 9) {
                var msg = ChatDef.quickChatMsg[index];
                if (this._gameView && this._gameView.showUserChat) {
                    this._gameView.showUserChat(viewID, msg);
                }
            }
        }
        else {
            var msg = tableChat.cbBuffer;
            console.log("[OnEventChatMsg]", chatType, msg);
            if (this._gameView && this._gameView.showUserChat) {
                this._gameView.showUserChat(viewID, msg);
            }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
module.exports = GameModel;