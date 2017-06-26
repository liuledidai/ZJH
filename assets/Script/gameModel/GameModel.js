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
    onLoad: function () {
        console.log("[GameModel][onLoad]");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode){
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
        }
        this.onInitGameEngine();
        this.m_bOnGame = false;
        this.m_cbGameStatus = -1;
    },
    onEnable: function (params) {
        console.log("[GameModel][onEnable]");
        cc.director.on("onEventGameMessage",this.onEventGameMessage,this);
        cc.director.on("onEventGameScene",this.onEventGameScene,this);
        cc.director.on("onEventUserEnter",this.onEventUserEnter,this);
        cc.director.on("onEventUserStatus",this.onEventUserStatus,this);
        cc.director.on("onEventUserScore",this.onEventUserScore,this);
    },
    onDisable: function (params) {
        console.log("[GameModel][onDisable]");
        cc.director.off("onEventGameMessage",this.onEventGameMessage,this);
        cc.director.off("onEventGameScene",this.onEventGameScene,this);
        cc.director.off("onEventUserEnter",this.onEventUserEnter,this);
        cc.director.off("onEventUserStatus",this.onEventUserStatus,this);
        cc.director.off("onEventUserScore",this.onEventUserScore,this);
    },
    //初始化游戏数据
    onInitGameEngine: function () {
        console.log("[GameModel][onInitGameEngine]");
        this._ClockFun = undefined;
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
    },
    //重置框架
    onResetGameEngine: function () {
        this.killGameClock();
        this.m_bOnGame = false;
    },
    //退出询问
    onQueryExitGame: function () {
        this.onExitTable();
    },
    standUpAndQuit: function () {
        
    },
    //退出桌子
    onExitTable: function () {
        this.killGameClock();

        var myItem = this.getMeUserItem();
        if (myItem && myItem.cbUserStatus > GlobalDef.US_FREE) {
            this._gameFrame.sendStandupPacket();
            return;
        }
    },
    onExitRoom: function () {
        this._gameFrame.onCloseSocket();
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
    // 椅子号转视图位置,注意椅子号从0~nChairCount-1,返回的视图位置从1~nChairCount
    switchViewChairID: function (chair) {
        var viewID = GlobalDef.INVALID_CHAIR;
        var nChairCount = this._gameFrame.getChairCount();  
        var nChairID = this.getMeChairID();
        if (chair !== GlobalDef.INVALID_CHAIR && chair < nChairCount) {
            viewID = ((chair + Math.floor(nChairCount * 3/2) - nChairID)%(nChairCount)) + 1;
        }
        return viewID;
    },
    //是否合法视图ID
    isValidViewID: function (viewID) {
        var nChairCount = this._gameFrame.getChairCount();
        return (viewID > 0) && (viewID <= nChairCount);  
    },
    //设置计时器
    setGameClock: function (chair, id, time) {
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
    killGameClock: function (notView) {
        this._ClockID = GlobalDef.INVALID_ITEM;
        this._ClockTime = 0;
        this._ClockChair = GlobalDef.INVALID_CHAIR;
        this._ClockViewChair = GlobalDef.INVALID_CHAIR;
        if (this._ClockFun) {
            cc.director.getScheduler().unschedule(this.onClockUpdata, this);
            this._ClockFun = undefined;
        }  
        if (! notView) {
            this.onUpdataClockView();
        }
    },
    getClockViewID: function () {
        return this._ClockViewChair;
    },
    //计时器更新
    onClockUpdata: function () {
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
    onUpdataClockView: function () {
        // onUpdataClockView
    },
    //用户状态 
    onEventUserStatus: function (params) {
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
    onEventUserScore: function (params) {
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
    onEventUserEnter: function (params) {
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
    sendUserReady: function () {
        this._gameFrame.sendUserReady();
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
module.exports = GameModel;