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
            type: cc.Node,
        },
        m_Progress_time: cc.ProgressBar,
        m_Label_time: cc.Label,
        cardPrefab: cc.Prefab,
        userInfacePrefab: cc.Prefab,
        m_Button_ready: cc.Button,
        m_Button_lookCard: cc.Button,
        m_Button_giveUp: cc.Button,
        m_Node_player: {
            default:[],
            type: cc.Node,
        },
        m_flagReady: {
            default:[],
            type: cc.Node,
        },
        m_userCardPanel: {
            default:[],
            type: cc.Node,
        },
        ptPlayer: {
            default:[],
            type: cc.Vec2,
        },
        ptBanker: {
            default: [],
            type: cc.Vec2,
        },
        m_Image_banker: cc.Node,
        m_LookCard: {
            default:[],
            type:cc.Node,
        },
        m_GiveUp: {
            default:[],
            type:cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
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
            userNode.rotation = index * (-90) + 180;
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
    onEnable: function () {
        
    },
    onResetView: function () {
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
    onUpdateClockView: function (viewID, time) {
        console.log("[GameView][onUpdateClockView] [viewID, time] = " + [viewID, time]);
        if (time <= 0) {
            this.m_Progress_time.node.active = false;
            return;
        }
        else{
            this.m_Progress_time.node.active = true;
            if (this.ptPlayer[viewID]) {
                this.m_Progress_time.node.setPosition(this.ptPlayer[viewID]);
            }
            else {
                this.m_Progress_time.node.setPosition(0,60);
            }
        }
        var progress = (1.0*time/zjh_cmd.TIME_START_GAME);
        this.m_Progress_time.progress = progress;
        this.m_Label_time.string = time.toString();
    },
    //更新用户显示
    onUpdateUser: function (viewID, userItem) {
        
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            console.log("[GameView][onUpdateUser] viewID is undefined or invalid");
            return;
        }
        console.log("[GameView][onUpdateUser] viewID = " + viewID + " userItem = " + JSON.stringify(userItem,null, ' '));
        this.m_Node_player[viewID].active = (userItem !== undefined);
        if(userItem) {
            this.m_flagReady[viewID].active = (GlobalDef.US_READY === userItem.cbUserStatus);
        }
        else{
            this.m_flagReady[viewID].active = false;
        }
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function (bShow) {
        
    },
    //筹码移动
    playerJetton: function (wViewChairID, num, notani) {
        
    },
    //停止比牌动画
    stopCompareCard: function () {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function (firstuser,seconduser,firstcard,secondcard,bfirstwin,callback) {
        this.node.getChildByName("compareView").active = true;
        this.node.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(function () {
            callback();
        })));
    },
    //底注显示
    setCellScore: function (cellScore) {
        this.m_lCellScore = cellScore;
        if (!cellScore) {

        }
        else{

        }
    },
    setCellTurn: function (cellScore, turnCount, maxTurn) {
        var text = "底注:" + cellScore + " 轮数:" + (turnCount + 1) + "/" + maxTurn;
        this.m_Label_cellTurn.node.active = true;
        this.m_Label_cellTurn.string = text;
    },
    //封顶分数
    setMaxCellScore: function (cellScore) {
        if (!cellScore) {
            //todo
        }  
        else {

        }
    },
    //庄家显示
    setBanker: function (viewID) {
        if (!viewID || viewID === GlobalDef.INVALID_CHAIR) {
            //todo
            this.m_Image_banker.active = false;
            return;
        }  
        this.m_Image_banker.active = true;
        this.m_Image_banker.setPosition(this.ptBanker[viewID]);
    },
    //下注总额
    setAllTableScore: function (score) {
        if (!score || score === 0) {
            this.m_Label_allScore.node.active = false;
        }
        else {
            this.m_Label_allScore.node.active = true;
            this.m_Label_allScore.string = score;
        }
    },
    //玩家下注
    setUserTableScore: function (viewID, score) {
        if (!score || score === 0) {
            // if (viewID !== )
        }
        else
        {

        }
    },
    //发牌
    sendCard: function (viewID, index, fDelay) {
        console.log("[viewID,index,fDelay] = " + [viewID,index,fDelay]);
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
        spriteCard.runAction(
            cc.sequence(
                cc.delayTime(fDelay),
                cc.spawn(
                    cc.scaleTo(0.25,1.0),
                )
            )
        )

    },
    //看牌状态
    setLookCard: function (viewID, bLook) {
        // if (viewID === zjh_cmd.MY_VIEWID) {
        //     return;
        // }
        this.m_LookCard[viewID].active = bLook;
    },
    //弃牌状态
    setUserGiveUp: function (viewID, bGiveup) {
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
    clearCard: function (viewID) {
        //todo
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = false;
        }
        this.m_GiveUp[viewID].active = false;
    },
    //显示牌值
    setUserCard: function (viewID, cardData) {
        console.log("[GameView][setUserCard][viewID,cardData] = " + [viewID,cardData]);
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
                }
                else
                {
                    cardItem.setCardData(cardData[i]);
                    cardItem.showCard();
                }
            }
        }
        else {
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                this.m_userCard[viewID].card[i].active = false;
            }
        }
    },
    //显示牌类型
    setUserCardType: function (viewID, cardtype) {

    },
    //赢得筹码
    winTheChip: function (wWinner) {
        
    },
    //清理筹码
    cleanAllJettons: function () {
        
    },
    //取消比牌选择
    setCompareCard: function (bChoose, status) {
        this.bCompareChoose = bChoose;
        // todo
    },
    //按键响应
    onStartGame: function () {
        this._scene.onStartGame(true);
        // this.m_Button_ready.node.active = false;
    },
    onGiveUp: function () {
        this._scene.onGiveUp();  
    },
    onLookCard: function () {
        this._scene.onLookCard();
    },
    onCompareCard: function () {
        this._scene.onCompareCard();  
    },
    onAddScore: function (event,params) {
        console.log(params);
        this._scene.addScore(params);  
    },
    //
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //     var progress = this.m_Progress_time.progress;
    //     if (progress < 1.0 && this._ping) {
    //         progress += dt * this._speed;
    //     }
    //     else {
    //         progress -= dt * this._speed;
    //         this._ping = progress <= 0;
    //     }
    //     var time = Math.ceil(progress * 10);
    //     this.m_Progress_time.progress = progress;
    //     this.m_Label_time.string = time.toString();
    // },
});
