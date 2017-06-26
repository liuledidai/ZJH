var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
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
        m_Panel_menu:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        // if (GameFrameNode){
        //     this._gameFrame = GameFrameNode.getComponent("GameFrame");
        // }
        this._super();
    },
    onEnable: function (params) {
        // cc.director.on("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
    },
    onDisable: function (params) {
        // cc.director.off("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
    },
    onInitGameEngine: function () {
        this._super();
        console.log("[GameScene][onInitGameEngine]");
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;//当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR;//庄家用户

        this.m_cbPlayStatus = [0,0,0,0,0];//游戏状态
        this.m_lTableScore = [0,0,0,0,0];//下注数目

        this.m_lMaxCellScore = 0;//单元上限
        this.m_lCellScore = 0;//单元下注

        this.m_lCurrentTimes = 0;//当前倍数
        this.m_lUserMaxScore = 0;//最大分数

        this.m_bLookCard = [false,false,false,false,false];//看牌动作

        this.m_wLostUser = GlobalDef.INVALID_CHAIR;//比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR;//胜利用户

        this.m_llAllTableScore = 0;

    },
    onResetGameEngine: function () {
        this._super();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;//当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR;//庄家用户
        this.m_cbPlayStatus = [0,0,0,0,0];//游戏状态
        this.m_lTableScore = [0,0,0,0,0];//下注数目
        this.m_lMaxCellScore = 0;//单元上限
        this.m_lCellScore = 0;//单元下注
        this.m_lCurrentTimes = 0;//当前倍数
        this.m_lUserMaxScore = 0;//最大分数
        this.m_bLookCard = [false,false,false,false,false];//看牌动作
        this.m_wLostUser = GlobalDef.INVALID_CHAIR;//比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR;//胜利用户
        this.m_llAllTableScore = 0;
    },
    //设置计时器
    setGameClock: function (chair, id, time) {
        this._super();
        var viewID = this.getClockViewID();
        if (viewID && viewID !== GlobalDef.INVALID_CHAIR)
        {
            //时间进度条
            //this.OnEventGameClockInfo(viewID, id);
        }
    },
    //关闭计时器
    killGameClock: function (notView) {
        var viewID = this.getClockViewID();
        if (viewID && viewID !== GlobalDef.INVALID_CHAIR)
        {
            //时间进度条
        }
        this._super();
    },
    //获得当前正在玩的玩家数量
    getPlayingNum: function () {
        var num = 0;
        for (var index = 1; index <= zjh_cmd.GAME_PLAYER; index++) {
            if (this.m_cbPlayStatus[index] === 1) {
                num++;
            }
        }
        return num;
    },
    //时钟处理
    OnEventGameClockInfo: function (chair, time, clockID) {
        
        if (clockID === zjh_cmd.IDI_START_GAME) {
            if (time == 0) {
                this.onExitTable();
                return true;
            }
        }
        else if (clockID === zjh_cmd.IDI_DISABLE) {
            if (time == 0) {
                return true;
            }
        }
        else if (clockID === zjh_cmd.IDI_USER_ADD_SCORE) {
            if (time == 0) {
                if (this.m_wCurrentUser === this.getMeChairID()) {
                    // this.onGiveUp();
                    return true;
                }
            }
        }
        else if (clockID === zjh_cmd.IDI_USER_COMPARE_CARD) {
            if (time == 0) {
                // this.onAutoCompareCard();
                return true;
            }
        }
    },
    //场景消息
    onEventGameScene: function (params) {
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
                // showReady();显示准备按钮
                this.setGameClock(this.getMeChairID(), zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
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
                // for (var index = 0; index < zjh_cmd.MAX_COUNT; index++) {
                //     playStatus.cbHandCardData[index] = pData.readbyte();
                // }
                this.m_llAllTableScore = 0;

                //底注信息
                // this.setCellScore(this.m_lCellScore);
                // this.setMaxCellScore(this.m_lMaxCellScore)

                //庄家信息
                // this.setBanker(this.switchViewChairID(this.m_wBankerUser));
                break;
            default:
                break;
        }
    },
    onEventGameMessage: function (params) {
        var sub = params.detail.sub;
        var pData = params.detail.pData;
        console.log("[GameScene][onEventGameMessage] pData len = " + pData.getDataSize());
        if (!this._eventGameMessageCallback) {
            this._eventGameMessageCallback = {
                [zjh_cmd.SUB_S_GAME_START] : this.onSubGameStart,//游戏开始
                [zjh_cmd.SUB_S_ADD_SCORE] : this.onSubAddScore,//用户下注
                [zjh_cmd.SUB_S_LOOK_CARD] : this.onSubLookCard,//看牌消息
                [zjh_cmd.SUB_S_COMPARE_CARD] : this.onSubCompareCard,//比牌消息
                [zjh_cmd.SUB_S_OPEN_CARD] : this.onSubOpenCard,//开牌消息
                [zjh_cmd.SUB_S_GIVE_UP] : this.onSubGiveUp,//用户放弃
                [zjh_cmd.SUB_S_PLAYER_EXIT] : this.onSubPlayerExit,//用户强退
                [zjh_cmd.SUB_S_GAME_END] : this.onSubGameEnd,//游戏结束
                [zjh_cmd.SUB_S_WAIT_COMPARE] : function (sub, pData) {//等待比牌
                    console.log("[GameScene][onEventGameMessage] SUB_S_WAIT_COMPARE");
                },
                [zjh_cmd.SUB_S_LAST_ADD] : this.onSubLastAdd,//
            }
        }
        if (this._eventGameMessageCallback && this._eventGameMessageCallback[sub]) {
            var fun = this._eventGameMessageCallback[sub];
            fun.call(this, sub, pData);
        }
        else
        {
            console.log("[GameScene][onEventGameMessage] sub = " + sub + " not find");
        }
    },
    onSubGameStart: function (sub, pData) {
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
    onSubAddScore: function (sub, pData) {
        console.log("[GameScene][onSubAddScore]");
    },
    onSubLookCard: function (sub, pData) {
        console.log("[GameScene][onSubLookCard]");
    },
    onSubCompareCard: function (sub, pData) {
        console.log("[GameScene][onSubCompareCard]");
    },
    onSubOpenCard: function (sub, pData) {
        console.log("[GameScene][onSubOpenCard]");
    },
    onSubGiveUp: function (sub, pData) {
        console.log("[GameScene][onSubGiveUp]");
    },
    onSubPlayerExit: function (sub, pData) {
        console.log("[GameScene][onSubPlayerExit]");
    },
    onSubGameEnd: function (sub, pData) {
        console.log("[GameScene][onSubGameEnd]");
    },
    onSubLastAdd: function (sub, pData) {
        console.log("[GameScene][onSubLastAdd]");
    },
    onClickMenuOpen: function (toggle) {
        this.m_Panel_menu.active = toggle.isChecked;
    },
    onClickChangeTable: function (params) {
        this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE,GlobalDef.INVALID_CHAIR)
    },
    onClickQuit: function (params) {
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
    onSendAddScore: function (lCurrentScore) {
        //用户加注
        // struct CMD_C_AddScore
        // {
        //     LONG								lScore;								//加注数目
        //     WORD								wState;								//当前状态
        // };
        var dataBuf = CCmd_Data.create();
        dataBuf.pushint(lCurrentScore);
        dataBuf.pushword(0);
        this.sendData(zjh_cmd.SUB_C_ADD_SCORE,dataBuf);
    },
    //用户比牌
    onSubCompareCard: function (params) {
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
