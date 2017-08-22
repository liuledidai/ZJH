var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
var GameLogic = require("GameLogic");
var AudioMng = require("AudioMng");
var SoundEffectType = cc.Enum({
    kSoundEffectXiaZhu: 1,
    kSoundEffectGenZhu: 2,
    kSoundEffectJiaZhu: 3,
    kSoundEffectKanPai: 4,
    kSoundEffectFaQiBiPai: 5,
    kSoundEffectBiPaiShiBai: 6,
    kSoundEffectQiPai: 7,
});
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
    },

    // use this for initialization
    onLoad: function () {
        // var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        // if (GameFrameNode){
        //     this._gameFrame = GameFrameNode.getComponent("GameFrame");
        // }
        this._super();
        this.m_lMaxTurnCount = 8;
        this._gameView = this.node.getComponent("GameView");

    },
    onDestroy: function () {
        this._super();
    },
    onEnable: function (params) {
        // cc.director.on("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
    },
    onDisable: function (params) {
        // cc.director.off("onEventGameMessage",this.onEventGameMessage,this);
        this._super();
        // this.onExitRoom();
    },
    onExitRoom: function () {
        this._super();
        cc.director.loadScene("PlazaScene");
    },
    onInitGameEngine: function () {
        this._super();
        console.log("[GameScene][onInitGameEngine]");
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;//当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR;//庄家用户

        this.m_cbPlayStatus = [0, 0, 0, 0, 0];//游戏状态
        this.m_lTableScore = [0, 0, 0, 0, 0];//下注数目

        this.m_lMaxCellScore = 0;//单元上限
        this.m_lCellScore = 0;//单元下注

        this.m_lCurrentTimes = 0;//当前倍数
        this.m_lUserMaxScore = 0;//最大分数
        this.m_lCurrentTurn = 0;//当前轮数

        this.m_bLookCard = [false, false, false, false, false];//看牌动作

        this.m_wLostUser = GlobalDef.INVALID_CHAIR;//比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR;//胜利用户

        this.m_llAllTableScore = 0;
        this.m_bLastAddOver = false; //是否孤注一掷结束

        // this.setGameClock(zjh_cmd.MY_VIEWID, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
    },
    onResetGameEngine: function () {
        this._super();
        this._gameView.onResetView();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;//当前用户
        this.m_wBankerUser = GlobalDef.INVALID_CHAIR;//庄家用户
        this.m_cbPlayStatus = [0, 0, 0, 0, 0];//游戏状态
        this.m_lTableScore = [0, 0, 0, 0, 0];//下注数目
        this.m_lMaxCellScore = 0;//单元上限
        this.m_lCellScore = 0;//单元下注
        this.m_lCurrentTimes = 0;//当前倍数
        this.m_lUserMaxScore = 0;//最大分数
        this.m_lCurrentTurn = 0;//当前轮数
        this.m_bLookCard = [false, false, false, false, false];//看牌动作
        this.m_wLostUser = GlobalDef.INVALID_CHAIR;//比牌失败
        this.m_wWinnerUser = GlobalDef.INVALID_CHAIR;//胜利用户
        this.m_llAllTableScore = 0;
        this.m_bLastAddOver = false;//是否孤注一掷结束
        // this.setGameClock(zjh_cmd.MY_VIEWID, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
    },
    //设置计时器
    setGameClock: function (chair, id, time) {
        this._super(chair, id, time);
        var viewID = this.getClockViewID();
        if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
            //时间进度条
            // this.onEventGameClockInfo(viewID, id);
            var progressTime = time;
            var self = this;
            var progressBar = this._gameView.m_timeProgress[viewID];
            progressBar.node.runAction(cc.repeatForever(cc.sequence(
                cc.delayTime(0.05),
                cc.callFunc(function () {
                    progressTime -= 0.05;
                    var progress = 1.0 * progressTime / zjh_cmd.TIME_START_GAME;
                    // console.log("[setGameClock][scheduleUpdate] ->" + [progressTime]);
                    progressBar.progress = progress;
                })
            )))
        }
    },
    //关闭计时器
    killGameClock: function (notView) {
        var viewID = this.getClockViewID();
        if (viewID !== undefined && viewID !== GlobalDef.INVALID_CHAIR) {
            if (this._gameView.m_timeProgress[viewID]) {
                this._gameView.m_timeProgress[viewID].progress = 0;
                this._gameView.m_timeProgress[viewID].node.stopAllActions();
            }

        }
        this._super(notView);
    },
    //获得当前正在玩的玩家数量
    getPlayingNum: function () {
        var num = 0;
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            if (this.m_cbPlayStatus[index] === 1) {
                num++;
            }
        }
        return num;
    },
    //时钟处理
    onEventGameClockInfo: function (chair, time, clockID) {
        // console.log("[GameScene][onEventGameClockInfo] chair = " + chair + " time = " + time + " clockID = " + clockID);
        if (chair !== GlobalDef.INVALID_CHAIR && chair !== this.getMeChairID()) {
            return;
        }
        if (clockID === zjh_cmd.IDI_START_GAME) {
            if (time == 0) {
                // this.onExitTable();
                this.onStartGame(true);
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
                    this.onGiveUp();
                    return true;
                }
            }
        }
        else if (clockID === zjh_cmd.IDI_USER_COMPARE_CARD) {
            if (time == 0) {
                this.onAutoCompareCard();
                return true;
            }
        }
    },
    onUpdateClockView: function () {
        this._super();
        if (this._gameView && this._gameView.onUpdateClockView) {
            this._gameView.onUpdateClockView(this._ClockViewChair, this._ClockTime);
        }
    },
    //场景消息
    onEventGameScene: function (params) {
        // params = {cbGameStatus,pData,}
        console.log("[GameScene][onEventGameScene]");
        var cbGameStatus = params.detail.cbGameStatus;
        var pData = params.detail.pData;
        //初始化已有玩家
        // this.onResetGameEngine();
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
            // if (userItem) {
            var wViewChairID = this.switchViewChairID(index);
            this._gameView.onUpdateUser(wViewChairID, userItem);
            console.log("[GameScene][onEventGameScene] wViewChairID = " + wViewChairID + " userItem = " + JSON.stringify(userItem, null, ' '));
            // }
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
                this._gameView.m_Button_ready.node.active = (this.getMeUserItem().cbUserStatus === GlobalDef.US_SIT);
                this.setGameClock(GlobalDef.INVALID_CHAIR, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME)
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
                var cardData = []
                for (var index = 0; index < zjh_cmd.MAX_COUNT; index++) {
                    cardData[index] = playStatus.cbHandCardData[index];
                }
                this.m_llAllTableScore = 0;

                //底注信息
                this._gameView.setCellScore(this.m_lCellScore);
                this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
                this._gameView.setMaxCellScore(this.m_lMaxCellScore)

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
                                cardIndex[k] = cardData[k];//GameLogic.getCardColor(cardData[k]) * 13 + GameLogic.getCardValue(cardData[k]);
                            }
                            this._gameView.setUserCard(viewID, cardIndex);
                        }
                        else {
                            this._gameView.setUserCard(viewID, [0xff, 0xff, 0xff]);
                        }
                    }
                    else {
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
                //控件信息
                this._gameView.m_nodeBottom.active = false;
                if (!playStatus.bCompareState) {
                    this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);

                    if (this.getMeChairID() === this.m_wCurrentUser) {
                        this.updateControl();
                    }
                }
                else {
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
                    }
                    else {
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
    onEventGameMessage: function (params) {
        var sub = params.detail.sub;
        var pData = params.detail.pData;
        console.log("[GameScene][onEventGameMessage] pData len = " + pData.getDataSize());
        if (!this._eventGameMessageCallback) {
            this._eventGameMessageCallback = {
                [zjh_cmd.SUB_S_GAME_START]: this.onSubGameStart,//游戏开始
                [zjh_cmd.SUB_S_ADD_SCORE]: this.onSubAddScore,//用户下注
                [zjh_cmd.SUB_S_LOOK_CARD]: this.onSubLookCard,//看牌消息
                [zjh_cmd.SUB_S_COMPARE_CARD]: this.onSubCompareCard,//比牌消息
                [zjh_cmd.SUB_S_OPEN_CARD]: this.onSubOpenCard,//开牌消息
                [zjh_cmd.SUB_S_GIVE_UP]: this.onSubGiveUp,//用户放弃
                [zjh_cmd.SUB_S_PLAYER_EXIT]: this.onSubPlayerExit,//用户强退
                [zjh_cmd.SUB_S_GAME_END]: this.onSubGameEnd,//游戏结束
                [zjh_cmd.SUB_S_WAIT_COMPARE]: this.onSubWaitCompare,
                [zjh_cmd.SUB_S_LAST_ADD]: this.onSubLastAdd,//
            }
        }
        if (this._eventGameMessageCallback && this._eventGameMessageCallback[sub]) {
            var fun = this._eventGameMessageCallback[sub];
            fun.call(this, sub, pData);
        }
        else {
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
                var chair = (this.m_wBankerUser + j) % (zjh_cmd.GAME_PLAYER);
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
        AudioMng.playSFX("sfx_addscore");
    },
    onSubAddScore: function (sub, pData) {
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

        //播放音效
        if (addScore.wCompareState === 0) {
            AudioMng.playSFX("sfx_addscore");
            var sfxType = SoundEffectType.kSoundEffectJiaZhu;
            if (this.m_isFirstAdd) {
                sfxType = SoundEffectType.kSoundEffectXiaZhu;
            }
            else if (this.m_lCurrentTimes === addScore.lCurrentTimes) {
                sfxType = SoundEffectType.kSoundEffectGenZhu;
            }
            this.playSound(sfxType, addScore.wAddScoreUser);
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
        //设置计时器
        if (addScore.wCompareState === 0 && this.m_wCurrentUser !== GlobalDef.INVALID_CHAIR) {
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
        }

        if (addScore.wCompareState === 0 && this.m_wCurrentUser === myChair) {
            this.m_lCurrentTurn = addScore.lCurrentTurn;
            this._gameView.setCellTurn(this.m_lCellScore, this.m_lCurrentTurn, this.m_lMaxTurnCount);
            this.updateControl();
        }
        this.m_isFirstAdd = false;


    },
    onSubLookCard: function (sub, pData) {
        AudioMng.playSFX("sfx_lookcard");
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

        //看牌音效 
        this.playSound(SoundEffectType.kSoundEffectKanPai, lookCard.wLookCardUser);

        console.log("[GameScene][onSubLookCard] lookCard = " + JSON.stringify(lookCard, null, ' '));
        var viewID = this.switchViewChairID(lookCard.wLookCardUser);
        this._gameView.setLookCard(viewID, true);
        if (this.getMeChairID() === this.m_wCurrentUser) {
            this.updateControl();
        }
        console.log("[GameScene][onSubLookCard] [lookCard.wLookCardUser,this.getMeChairID()] = " + [lookCard.wLookCardUser, this.getMeChairID()]);
        if (lookCard.wLookCardUser == this.getMeChairID()) {
            var cardIndex = [];
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                cardIndex[i] = lookCard.cbCardData[i];//GameLogic.getCardColor(lookCard.cbCardData[i]) * 13 + GameLogic.getCardValue(lookCard.cbCardData[i]);
            }
            this._gameView.setUserCard(viewID, cardIndex);
            this._gameView.setUserCardType(viewID, GameLogic.getCardType(cardIndex));
        }
    },
    onSubCompareCard: function (sub, pData) {
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
        this._gameView.compareCard(firstUser, secondUser, undefined, undefined, compareCard.wCompareUser[0] === this.m_wWinnerUser, function (params) {
            self.onFlushCardFinish();
            self.playSound(SoundEffectType.kSoundEffectBiPaiShiBai, self.m_wLostUser);
        })
        this.playSound(SoundEffectType.kSoundEffectFaQiBiPai, compareCard.wCompareUser[0]);
        AudioMng.playSFX("sfx_comparecard");
    },
    onFlushCardFinish: function () {
        console.log("[onFlushCardFinish]time = ", Date.now());
        //todo
        var viewID = this.switchViewChairID(this.m_wLostUser);
        this._gameView.setUserLose(viewID, true);
        this._gameView.stopCompareCard();
        var count = this.getPlayingNum();
        if (count > 1) {
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
            if (this.m_wCurrentUser === this.getMeChairID()) {
                this.updateControl()
            }
        }
        else {
            var myChair = this.getMeChairID();
            if (this.m_cbPlayStatus[myChair] === 1 || myChair === this.m_wLostUser) {
                var data = CCmd_Data.create();
                this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
            }
        }
    },
    onSubOpenCard: function (sub, pData) {
        console.log("[GameScene][onSubOpenCard]");
        //开牌数据包
        // struct CMD_S_OpenCard
        // {
        //     WORD								wWinner;							//胜利用户
        // };
        var myChair = this.getMeChairID();
        //8轮结束开牌发送
        if (this.m_cbPlayStatus[myChair] === 1 && !this.m_bLastAddOver) {
            this.node.runAction(cc.sequence(
                cc.delayTime(1.0),
                cc.callFunc(() => {
                    var data = CCmd_Data.create();
                    //比牌结束定时器
                    this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
                })
            ))
        }
    },
    onSubGiveUp: function (sub, pData) {
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
        //弃牌音效
        this.playSound(SoundEffectType.kSoundEffectQiPai, wGiveUpUser);
        //超时服务器自动放弃
        if (wGiveUpUser === this.getMeChairID()) {
            this.killGameClock();
            this._gameView.stopCompareCard();
            this._gameView.setCompareCard(false, undefined);
            this._gameView.m_chipBG.active = false;
            this._gameView.m_nodeBottom.active = false;
        }
    },
    onSubPlayerExit: function (sub, pData) {
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
    onSubGameEnd: function (sub, pData) {
        console.log("[onSubGameEnd]time = ", Date.now());
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
        this._gameView.m_chipBG.active = false;
        this._gameView.m_nodeBottom.active = false;
        // ......

        // var endShow;
        var saveType = [];
        //移动筹码
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            var viewID = this.switchViewChairID(i);
            if (gameEnd.lGameScore[i] !== 0) {
                var viewID = this.switchViewChairID(i);
                saveType[i] = GameLogic.getCardType(gameEnd.cbCardData[i]);
                if (!(i === myChair && this.m_bLookCard[i])) {
                    this._gameView.setUserCard(viewID, gameEnd.cbCardData[i]);
                }
                if (gameEnd.lGameScore[i] > 0) {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i]);
                    this._gameView.winTheChip(viewID);
                    this._gameView.setUserCardType(viewID, saveType[i], "win_");
                    if (i === myChair) {
                        AudioMng.playSFX("sfx_gamewin");
                        GlobalFun.playEffects(this.node, {
                            fileName: "yx_wlg3",
                            anim: "yx_win",
                            loop: false,
                        });
                    }
                    else {
                        AudioMng.playSFX("sfx_gamelose");
                        GlobalFun.playEffects(this.node, {
                            fileName: "yx_wlg3",
                            anim: "yx_lose",
                            loop: false,
                        });
                    }
                }
                else {
                    this._gameView.setUserTableScore(viewID, gameEnd.lGameScore[i])
                    this._gameView.setUserCardType(viewID, saveType[i], "lose_");
                }
                // endShow = true;
                // this._gameView.
                //....
                //.....

            }
            else {
                saveType[i] = 1;
                this._gameView.setUserTableScore(viewID);
            }
        }

        // for (var i = 0; i < 4; i++) {
        //     var wUserID = gameEnd.wCompareUser[myChair][i];
        //     if (wUserID && wUserID !== GlobalDef.INVALID_CHAIR) {
        //         var viewID = this.switchViewChairID(wUserID);
        //         var cardIndex = [];
        //         for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //             cardIndex[k] = gameEnd.cbCardData[wUserID][k];//GameLogic.getCardColor(gameEnd.cbCardData[wUserID][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[wUserID][k]);
        //         }
        //         this._gameView.setUserCard(viewID, cardIndex);
        //         this._gameView.setUserCardType(viewID, saveType[wUserID]);
        //         // this._gameView  ....
        //     }
        // }

        // if (gameEnd.wCompareUser[myChair][0] !== GlobalDef.INVALID_CHAIR || this.m_bLookCard[myChair] === true) {
        //     var cardIndex = [];
        //     for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //         cardIndex[k] = gameEnd.cbCardData[myChair][k];//GameLogic.getCardColor(gameEnd.cbCardData[myChair][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[myChair][k]);
        //     }
        //     // var myViewID 
        //     this._gameView.setUserCard(zjh_cmd.MY_VIEWID, cardIndex);
        //     this._gameView.setUserCardType(zjh_cmd.MY_VIEWID, saveType[myChair]);
        //     // this._gameView  ....
        // }

        // if (gameEnd.wEndState == 1) {
        //     if (this.m_cbPlayStatus[myChair] === 1) {
        //         for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
        //             if (this.m_cbPlayStatus[i] === 1) {
        //                 var cardIndex = [];
        //                 for (var k = 0; k < zjh_cmd.MAX_COUNT; k++) {
        //                     cardIndex[k] = gameEnd.cbCardData[i][k];//GameLogic.getCardColor(gameEnd.cbCardData[i][k]) * 13 + GameLogic.getCardValue(gameEnd.cbCardData[i][k]);
        //                 }
        //                 var viewID = this.switchViewChairID(i);
        //                 this._gameView.setUserCard(viewID, cardIndex);
        //                 this._gameView.setUserCardType(viewID, saveType[i]);
        //                 // this._gameView  ....
        //             }

        //         }
        //     }
        // }

        // if (endShow) {
        //     // ...
        // }
        var self = this;
        this.node.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(function () {
            self.onResetGameEngine();
            self._gameView.m_Button_ready.node.active = true;
            self.setGameClock(GlobalDef.INVALID_CHAIR, zjh_cmd.IDI_START_GAME, zjh_cmd.TIME_START_GAME);
            self.m_cbPlayStatus = [0, 0, 0, 0, 0];
        })))


    },
    onSubWaitCompare: function (sub, pData) {
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
    onSubLastAdd: function (sub, pData) {
        console.log("[GameScene][onSubLastAdd]");
        console.log("[onSubLastAdd]time = ", Date.now());

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
        this.m_wCurrentUser = lastAdd.wCurrentUser;

        var wStartLastAddUser = lastAdd.wStartLastAddUser;
        
        //播放孤注一掷动画
        GlobalFun.playEffects(this.node, {
            fileName: "yx_wlg3",
            anim: "yx_gzyz",
            loop: false,
        });

        var delayTime = 1.6;
        //播放比牌动画
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (lastAdd.wCompareUser[i] !== GlobalDef.INVALID_CHAIR && lastAdd.wLostUser[i] !== GlobalDef.INVALID_CHAIR) {
                let wCompareUser = lastAdd.wCompareUser[i];
                let wLostUser = lastAdd.wLostUser[i];
                var self = this;
                let firstUser = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), wStartLastAddUser);
                let secondUser = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), wCompareUser);
                this.node.runAction(cc.sequence(
                    cc.delayTime(delayTime),
                    cc.callFunc(() => {
                        this.playSound(SoundEffectType.kSoundEffectFaQiBiPai, wStartLastAddUser);
                        AudioMng.playSFX("sfx_comparecard");
                        this._gameView.compareCard(firstUser, secondUser, undefined, undefined, wStartLastAddUser !== wLostUser, function name(params) {
                            console.log("[onSubLastAdd][onFlushCardFinish]time = ", Date.now());
                            self.onFlushCardFinish();
                            self.playSound(SoundEffectType.kSoundEffectBiPaiShiBai, wLostUser);
                        })
                    })
                ))
                delayTime += 1.5;
            }
        }
        //找到被淘汰的玩家
        if (this.m_wCurrentUser !== GlobalDef.INVALID_CHAIR) {
            for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                if (lastAdd.wCompareUser[i] !== GlobalDef.INVALID_CHAIR && lastAdd.wLostUser[i] !== GlobalDef.INVALID_CHAIR) {
                    var wLostUser = lastAdd.wLostUser[i];
                    this.m_cbPlayStatus[wLostUser] = 0;
                    //如果自己被淘汰
                    if (wLostUser === this.getMeChairID()) {
                        this.updateControl();
                    }
                    // this._gameView.setUserCard()
                }
            }
            this.node.runAction(cc.sequence(
                cc.delayTime(delayTime),
                cc.callFunc(()=>{
                    if (this.m_wCurrentUser === this.getMeChairID()) {
                        this.updateControl();
                    }
                    this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_ADD_SCORE, zjh_cmd.TIME_USER_ADD_SCORE);
                })
            ))
        }
        else {
            this.m_bLastAddOver = true;
            if (this.m_cbPlayStatus[this.getMeChairID()]) {
                this.node.runAction(cc.sequence(
                    cc.delayTime(delayTime),
                    cc.callFunc(()=> {
                        var data = CCmd_Data.create();
                        this.sendData(zjh_cmd.SUB_C_FINISH_FLASH, data);
                    })
                ))
            }
        }
    },
    // onClickChangeTable: function (params) {
    //     this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR)
    // },
    onClickQuit: function (params) {
        // this._gameFrame.sendStandupPacket();
        // cc.director.loadScene("PlazaScene");
        this.onQueryExitGame();
    },
    // sendData : function (sub, dataBuf) {
    //     if (this._gameFrame) {
    //         dataBuf.setcmdinfo(GlobalDef.MDM_GF_GAME, sub);
    //         this._gameFrame.sendSocketData(dataBuf);
    //     }
    // },
    //加注
    onSendAddScore: function (lCurrentScore, bCompareCard) {
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
    onStartGame: function (bReady) {
        this.onResetGameEngine();
        if (bReady === true) {
            this.sendUserReady();
        }
    },
    onAutoFollow: function () {
        if (this.getMeChairID() !== this.m_wCurrentUser) {
            return false;
        }
        if (!(this._gameView && this._gameView.bAutoFollow)) {
            return false;
        }
        var myChair = this.getMeChairID();
        var maxAddScore = this.m_lUserMaxScore - this.m_lTableScore[myChair];
        var followScore = this.m_lCurrentTimes * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
        if (maxAddScore < followScore) {
            this._gameView.onClickAutoFollowButton();
            return false;
        }
        else {
            //跟注
            this.addScore(0);
            return true;
        }
    },
    //自动比牌
    onAutoCompareCard: function () {
        var myChair = this.getMeChairID();
        for (var i = 1; i < zjh_cmd.GAME_PLAYER; i++) {
            var chair = myChair - i;
            if (chair < 0) {
                chair += zjh_cmd.GAME_PLAYER;
            }
            console.log("[GameScene][onAutoCompareCard] [myChair,chair] = " + [myChair, chair]);
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
    onCompareCard: function () {
        var myChair = this.getMeChairID();
        if (myChair === undefined || myChair !== this.m_wCurrentUser) {
            return;
        }
        this._gameView.m_nodeBottom.active = false;
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

        this.onSendAddScore(score, true);//发送下注消息

        var bAutoCompare = (this.getPlayingNum() === 2);
        if (!bAutoCompare) {
            bAutoCompare = (this.m_wBankerUser === myChair) && (this.m_lTableScore[myChair] - score) === this.m_lCellScore;
        }
        if (bAutoCompare) {
            this.onAutoCompareCard();
        }
        else {
            var compareStatus = [false, false, false, false, false];
            for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
                if (this.m_cbPlayStatus[i] === 1 && i !== myChair) {
                    compareStatus[this.switchViewChairID(i)] = true;
                }
            }
            this._gameView.setCompareCard(true, compareStatus);
            //发送等待比牌消息
            var dataBuf = CCmd_Data.create();
            this.sendData(zjh_cmd.SUB_C_WAIT_COMPARE, dataBuf);
            this.setGameClock(this.m_wCurrentUser, zjh_cmd.IDI_USER_COMPARE_CARD, zjh_cmd.TIME_USER_COMPARE_CARD);
        }
    },
    onCompareChoose: function (index) {
        if (index === undefined || index === GlobalDef.INVALID_CHAIR) {
            console.log("[GameScene][onCompareChoose] index error");
            return;
        }
        var myChair = this.getMeChairID();
        if (this.m_wCurrentUser !== myChair) {
            console.log("[GameScene][onCompareChoose] not m_wCurrentUser (m_wCurrentUser = " + this.m_wCurrentUser + " mychair = " + myChair);
            return;
        }
        console.log("[GameScene][onCompareChoose] index = " + index);
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (i !== myChair && this.m_cbPlayStatus[i] === 1 && index == this.switchViewChairID(i)) {
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
    onGiveUp: function () {
        //删除计时器
        this.killGameClock();
        //隐藏操作按钮
        this._gameView.m_nodeBottom.active = false;
        //发送数据
        var dataBuf = CCmd_Data.create();
        this.sendData(zjh_cmd.SUB_C_GIVE_UP, dataBuf);
    },

    //换位操作
    onChangeDesk: function () {
        if (this.m_bOnGame) {
            GlobalFun.showAlert({
                message: "陛下，游戏中无法切换座位。",
            })
        }
        else {
            this._gameFrame.sendSitDownPacket(GlobalDef.INVALID_TABLE, GlobalDef.INVALID_CHAIR)
        }
    },

    //看牌操作
    onLookCard: function () {
        var myChair = this.getMeChairID();
        console.log("[GameScene][onLookCard] type[myChair,this.m_wCurrentUser] = " + [typeof (myChair), typeof (this.m_wCurrentUser)]);
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
    addScore: function (index) {
        var myChair = this.getMeChairID();
        if (this.m_wCurrentUser !== myChair) {
            return;
        }
        this.killGameClock();
        //清理界面
        this._gameView.m_chipBG.active = false;
        //底部按钮
        this._gameView.m_nodeBottom.active = false;
        //....

        //下注金额
        var array = [this.m_lCurrentTimes, 3, 6, 10];
        var scoreIndex = (!index && 0 || index);
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
    //孤注一掷
    onLastAdd: function () {
        var dataBuf = CCmd_Data.create();
        this.sendData(zjh_cmd.SUB_C_LAST_ADD, dataBuf);
        this.killGameClock();
        this.m_wCurrentUser = GlobalDef.INVALID_CHAIR;
    },
    onShowUserInfo: function (index) {
        var userItem = this._gameFrame.getTableUserItem(this._gameFrame.getTableID(), index);
    },
    //更新按钮控制
    updateControl: function () {

        var myChair = this.getMeChairID();
        if (myChair === undefined || myChair === GlobalDef.INVALID_CHAIR) {
            console.log("[GameScene][updateControl] mychair is invalid " + myChair);
            return;
        }
        //自动跟注
        if (this.onAutoFollow()) {
            return;
        }
        this._gameView.m_nodeBottom.active = true;
        this._gameView.m_chipBG.active = false;

        //看牌按钮
        if (!this.m_bLookCard[myChair]) {
            this._gameView.m_Button_lookCard.node.active = true;
        }
        else {
            this._gameView.m_Button_lookCard.node.active = false;
        }
        this._gameView.m_Button_giveUp.interactable = true;

        //跟注按钮
        var maxAddScore = this.m_lUserMaxScore - this.m_lTableScore[myChair];
        var followScore = this.m_lCurrentTimes * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
        var followLabel = this._gameView.m_Button_follow.node.children[0].getComponent(cc.Label);
        followLabel.string = followScore;
        // if (maxAddScore < followScore) {
        // console.log("[GameScene][updateControl] [this.m_lUserMaxScore, this.m_lTableScore[myChair], followScore]" + [this.m_lUserMaxScore, this.m_lTableScore[myChair], followScore])
        this._gameView.m_Button_follow.interactable = !(maxAddScore < followScore);
        // }
        // //是否第一次下注

        // var textLabel = children[0].children[0].getComponent(cc.Label);
        // if (this.m_isFirstAdd) {
        //     textLabel.string = "下注";
        // }
        // else {
        //     textLabel.string = "跟注";
        // }
        // 更新比牌按钮分数
        var compareScore = this.m_lCellScore * this.m_lCurrentTimes * (this.m_bLookCard[myChair] && 4 || 2);
        var bLastAdd = false;
        if (maxAddScore <= compareScore) {
            bLastAdd = true;
        }
        //孤注一掷
        this._gameView.m_Button_lastadd.interactable = bLastAdd;

        var bCompare = (this.m_lCurrentTurn >= 1) && (!bLastAdd);
        this._gameView.m_Button_compareCard.interactable = bCompare;
        var compareLabel = this._gameView.m_Button_compareCard.node.children[0].getComponent(cc.Label);
        // compareLabel.node.active = bCompare;
        compareLabel.string = compareScore;
        //加注按钮
        var bCanAdd = false;
        var children = this._gameView.m_chipBG.children;
        var array = [3, 6, 10];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var bHide = !bLastAdd && (element > this.m_lCurrentTimes);
            var lScore = element * this.m_lCellScore * (this.m_bLookCard[myChair] && 2 || 1);
            var scoreLabel = children[i].children[0].getComponent(cc.Label);
            scoreLabel.string = lScore;
            children[i].getComponent(cc.Button).enableAutoGrayEffect = true;
            children[i].getComponent(cc.Button).interactable = bHide;
            bCanAdd = bCanAdd || (bHide && maxAddScore >= lScore);
            if (maxAddScore < lScore) {
                children[i].getComponent(cc.Button).interactable = false;
            }
            if (children[i].getComponent(cc.Button).interactable) {
                children[i].color = new cc.Color(255, 255, 255);
            }
            else {
                children[i].color = new cc.Color(170, 170, 170);
            }
        }
        this._gameView.m_Button_addscore.interactable = bCanAdd;

    },
    playSound: function (sfxType, chair) {
        var szKey = "";
        var userItem = this._gameFrame.getTableUserItem(this.getMeTableID(), chair);
        var cbGender = 1;
        if (userItem) {
            cbGender = userItem.cbGender;
        }
        if (cbGender === 1) {
            szKey += "male_yuyin_";
        }
        else {
            szKey += "female_yuyin_";
        }
        switch (sfxType) {
            case SoundEffectType.kSoundEffectXiaZhu:
                szKey += "xiazhu";
                break;
            case SoundEffectType.kSoundEffectGenZhu:
                szKey += "genzhu_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectJiaZhu:
                szKey += "jiazhu_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectKanPai:
                szKey += "kanpai_";
                var randNum = GlobalFun.getRandomInt(1, 4);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectFaQiBiPai:
                szKey += "faqibipai";
                break;
            case SoundEffectType.kSoundEffectBiPaiShiBai:
                szKey += "bipaishibai_";
                var randNum = GlobalFun.getRandomInt(1, 3);
                szKey += randNum;
                break;
            case SoundEffectType.kSoundEffectQiPai:
                szKey += "qipai_";
                var randNum = GlobalFun.getRandomInt(1, 4);
                szKey += randNum;
                break;
            default:
                break;
        }
        AudioMng.playSFX(szKey);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
