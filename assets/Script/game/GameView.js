var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
var GameLogic = require("GameLogic");
var AudioMng = require("AudioMng");
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
        //label
        m_Label_cellTurn: cc.Label,
        m_Label_allScore: cc.Label,
        m_Label_time: cc.Label,
        //prefab
        cardPrefab: cc.Prefab,
        userInfacePrefab: cc.Prefab,
        chipPrefab: cc.Prefab,
        cardTypePrefab: cc.Prefab,
        //button
        m_Button_ready: cc.Button,
        m_Button_lookCard: cc.Button,
        m_Button_giveUp: cc.Button,
        m_Button_compareCard: cc.Button,
        m_Button_follow: cc.Button,
        m_Button_lastadd: cc.Button,
        m_Button_addscore: cc.Button,
        m_Button_autofollow: cc.Button,
        m_Button_cancelfollow: cc.Button,
        //other
        m_nodeBottom: cc.Node,
        m_chipBG: cc.Node,
        m_Image_banker: cc.Node,
        m_Progress_time: cc.ProgressBar,
        //atlas
        gameAtlas: cc.SpriteAtlas,
        //array
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
        ptCard: {
            default: [],
            type: cc.Vec2,
        },
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
        this.m_userHead = [];
        //计时器
        this.m_timeProgress = [];
        this.m_rcCompare = [];
        var userHeadList = this.node.getChildByName("m_Panel_center").getChildByName("m_userhead").children;
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userNode = cc.instantiate(this.userInfacePrefab);
            this.node.getChildByName("nodePlayer").addChild(userNode);
            this.m_Node_player[index] = userNode;
            userNode.setPosition(this.ptPlayer[index]);
            userNode.rotation = index * (-90);
            userNode.active = false;

            this.m_userHead[index] = {};
            this.m_userHead[index].name = userHeadList[index].getChildByName("m_Label_username").getComponent(cc.Label);
            this.m_userHead[index].score = userHeadList[index].getChildByName("game_gold_back").children[0].getComponent(cc.Label);
            this.m_userHead[index].bg = userHeadList[index];
            this.m_userHead[index].bg.active = false;
            let idx = index;
            userNode.on(cc.Node.EventType.TOUCH_END,() => {
                this.onShowUserInfo(idx);
            },this)
            this.m_userHead[index].bg.on(cc.Node.EventType.TOUCH_END,() => {
                this.onShowUserInfo(idx);
            },this)

            //计时器
            this.m_timeProgress[index] = userHeadList[index].getComponent(cc.ProgressBar);
            this.m_timeProgress[index].progress = 0;
            this.m_rcCompare[index] = this.node.getChildByName("flagCompare").children[index];
            this.m_rcCompare[index].active = false;
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
                cardNode.setPosition(this.ptCard[index].x + ( index === zjh_cmd.MY_VIEWID && 80 || 35) * j,this.ptCard[index].y);
                cardNode.setScale(( index === zjh_cmd.MY_VIEWID && 1.0 || 0.7));
                var cardItem = cardNode.getComponent("CardItem");
                cardItem.showCardBack();
                cardNode.active = false;
            }
            var cardType = cc.instantiate(this.cardTypePrefab);
            cardPanel.addChild(cardType);
            this.m_userCard[index].cardType = cardType;
            cardType.setPosition(this.ptCard[index].x + (index === zjh_cmd.MY_VIEWID && 80 || 35),
                                this.ptCard[index].y - (index === zjh_cmd.MY_VIEWID && 50 || 60));
            cardType.active = false;
        }

        //底部按钮
        this.m_nodeBottom.active = false;
        this.nodeChipPool = this.node.getChildByName("nodeChipPool");
        this.bAutoFollow = false;
    },
    onEnable: function () {
        
    },
    onResetView: function () {
        this.bAutoFollow = false;
        this.m_Button_autofollow.node.active = !this.bAutoFollow;
        this.m_Button_cancelfollow.node.active = this.bAutoFollow;
        this.m_Button_ready.node.active = false;
        this.m_nodeBottom.active = false;
        this.m_chipBG.active = false;
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
        // console.log("[GameView][onUpdateClockView] [viewID, time] = " + [viewID, time]);
        if (time <= 0) {
            this.m_Progress_time.node.active = false;
            if (this.m_timeProgress[viewID]) {
                this.m_timeProgress[viewID].progress = 0;
            }
            return;
        }
        else{
            var progress = (1.0*time/zjh_cmd.TIME_START_GAME);
            // this.m_Progress_time.node.active = true;
            if (this.m_timeProgress[viewID]) {
                // this.m_timeProgress[viewID].progress = progress;
            }
            else {
                this.m_Progress_time.node.active = true;
                this.m_Progress_time.node.setPosition(0,60);
                // this.m_Progress_time.progress = progress;
                this.m_Label_time.string = time.toString();
            }
        }
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
            this.m_userHead[viewID].bg.active = true;
            this.m_userHead[viewID].name.string = userItem.szName;
            this.m_userHead[viewID].score.string = userItem.lScore;
            this.m_userHead[viewID].userItem = userItem;
        }
        else{
            this.m_flagReady[viewID].active = false;
            this.m_userHead[viewID].name.string = "";
            this.m_userHead[viewID].score.string = "";
            this.m_userHead[viewID].bg.active = false;
            this.m_userHead[viewID].userItem = undefined;
        }
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function (bShow) {
        
    },
    //筹码移动
    playerJetton: function (wViewChairID, num, notani) {
        if (!num || num < 1 /*|| !this.m_lCellScore || this.m_lCellScore < 1*/) {
            console.log("[GameView][playerJetton] num is invalid");
            return;
        }
        // var count = Math.floor(num/this.m_lCellScore);
        // if (count > 10) {
        //     count = 10;
        // }
        // if (count <= 0) {
        //     count = 1;
        // }
        // for (var i = 0; i < count; i++) {
        var chip = cc.instantiate(this.chipPrefab);
        this.nodeChipPool.addChild(chip);
        var chipItem = chip.getComponent("ChipItem");
        chipItem.init(num);
        chip.setPosition(this.ptPlayer[wViewChairID]);
        // chip.setScale(0.5);
        var x = Math.random() * 200 - 100;
        var y = Math.random() * 100 - 50;
        console.log("[GameView][playerJetton] [x,y] = " + [x,y]);
        chip.runAction(cc.moveTo(0.2, cc.p(x,y)));
        // }
    },
    //停止比牌动画
    stopCompareCard: function () {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function (firstuser,seconduser,firstcard,secondcard,bfirstwin,callback) {
        // AudioMng.playSFX("sfx_comparecard");
        var compareView = this.node.getChildByName("compareView");
        compareView.active = true;
        compareView.runAction(cc.sequence(cc.delayTime(3.0),cc.callFunc(function () {
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
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            //todo
            this.m_Image_banker.active = false;
            return;
        }  
        this.m_Image_banker.active = true;
        this.m_Image_banker.setPosition(this.ptBanker[viewID]);
    },
    //下注总额
    setAllTableScore: function (score) {
        if (score === undefined || score === 0) {
            this.m_Label_allScore.node.active = false;
            this.m_Label_allScore.node.parent.active = false;
        }
        else {
            this.m_Label_allScore.node.active = true;
            this.m_Label_allScore.node.parent.active = true;
            this.m_Label_allScore.string = score;
        }
    },
    //玩家下注
    setUserTableScore: function (viewID, score) {
        if (score === undefined || score === 0) {
            // if (viewID !== )
        }
        else
        {

        }
    },
    //发牌
    sendCard: function (viewID, index, fDelay) {
        console.log("[viewID,index,fDelay] = " + [viewID,index,fDelay]);
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
        spriteCard.setScale((viewID === zjh_cmd.MY_VIEWID) && 1.0 || 0.7);
        spriteCard.setPosition(0,0);
        cardItem.showCardBack();
        spriteCard.runAction(
            cc.sequence(
                cc.delayTime(fDelay),
                // cc.fadeIn(0),
                cc.callFunc(function () {
                    AudioMng.playSFX("sfx_sendcard");
                }),
                cc.spawn(
                    cc.fadeIn(0.1),
                    cc.moveTo(0.2,self.ptCard[viewID].x + ((viewID === zjh_cmd.MY_VIEWID) && 80 || 35) * index, self.ptCard[viewID].y),
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
        this.m_GiveUp[viewID].getComponentInChildren(cc.Label).string = "弃牌";
        if (bGiveup) {
            this.setLookCard(viewID, false);
        }
    },
    //比牌输状态
    setUserLose: function (viewID, bLose) {
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = true;
        }
        this.m_GiveUp[viewID].active = bLose;
        this.m_GiveUp[viewID].getComponentInChildren(cc.Label).string = "比牌输";
        if (bLose) {
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
        if (viewID === undefined || viewID === GlobalDef.INVALID_CHAIR) {
            return;
        }
        if (cardData) {
            cardData = GameLogic.sortCard(cardData);
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[zjh_cmd.MAX_COUNT - i - 1];
                var cardItem = cardNode.getComponent("CardItem");
                cardNode.active = true;
                if (!cardData[i] || cardData[i] === 0 || cardData[i] === 0xff) {
                    cardItem.showCardBack();
                }
                else
                {
                    cardItem.setCardData(cardData[i]);
                    cardItem.setTurnTime(0.5);
                    cardItem.setTurnCallback(function (params) {
                        console.log("[GameView][setUserCard][setTurnCallback]");
                    });
                    cardItem.turnCard();
                    // cardItem.showCard();
                }
            }
        }
        else {
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                var cardNode = this.m_userCard[viewID].card[i];
                cardNode.skewX = 0;
                cardNode.skewY = 0;
                cardNode.active = false;
            }
        }
    },
    //显示牌类型
    setUserCardType: function (viewID, cardtype,state) {
        var nodeCardType = this.m_userCard[viewID].cardType;
        var cardTypeState = "card_type_" + (state || "");
        console.log("[GameView][setUserCardType] [viewID,cardtype] = " + [viewID,cardtype]);
        if (cardtype && cardtype >= 1 && cardtype <= 6) {
            var spCardType = nodeCardType.getComponent(cc.Sprite);
            nodeCardType.active = true;
            console.log("[GameView][setUserCardType] cardTypeState = " + cardTypeState);
            spCardType.spriteFrame = this.gameAtlas.getSpriteFrame(cardTypeState + cardtype);
        }
        else {
            nodeCardType.active = false;
        }
    },
    //赢得筹码
    winTheChip: function (wWinner) {
        var children = this.nodeChipPool.children;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            element.runAction(cc.sequence(
                cc.delayTime(0.1*(children.length - i)),
                cc.moveTo(0.4,this.ptPlayer[wWinner]),
                cc.callFunc(function (node) {
                    node.destroy();
                })
                )
            )
        }
    },
    //清理筹码
    cleanAllJettons: function () {
        this.nodeChipPool.removeAllChildren();
    },
    //取消比牌选择
    setCompareCard: function (bChoose, status) {
        this.bCompareChoose = bChoose;
        // todo
        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            if (bChoose && status && status[i]) {
                this.m_rcCompare[i].active = true;
            }
            else {
                this.m_rcCompare[i].active = false;
            }
        }
    },
    onTouch: function (params) {
        // console.log(params);
        // if (this.m_bShowMenu) {
        //     this.m_Toggle_menuOpen.uncheck();
        // }
    },
    onClickAddScoreButton: function () {
        // this.m_nodeBottom.active = false;
        this.m_chipBG.active = !this.m_chipBG.active;
    },
    onClickAutoFollowButton: function () {
        this.bAutoFollow = !this.bAutoFollow;
        this.m_Button_autofollow.node.active = !this.bAutoFollow;
        this.m_Button_cancelfollow.node.active = this.bAutoFollow;
        this._scene.onAutoFollow();
    },
    onClickChat: function() {
        // this._scene.sendTextChat('hello world');
        console.log("[GameView][onClickChat]");
        var self = this;
        if( cc.isValid(self._chatView) === false ){
            cc.loader.loadRes("prefab/GameChatView", function (err, chatPrefab) {
                if (cc.isValid(self.node)) {
                    self._chatView = cc.instantiate(chatPrefab);
                    self.node.addChild(self._chatView);
                    // self._chatView.getComponent("GameChatView")
                    // GlobalFun.ActionShowTanChuang(self._serviceView,function () {
                    //     console.log("[PlazaView][onClickClient]ActionShowTanChuang callback");
                    // });
                }
            });
        }
    },
    onClickSetting: function () {
        console.log("[GameView][onClickSetting]");
        var self = this;
        if( cc.isValid(self._settingView) === false ){
            cc.loader.loadRes("prefab/GameSettingView", function (err, settingPrefab) {
                if (cc.isValid(self.node)) {
                    self._settingView = cc.instantiate(settingPrefab);
                    self.node.addChild(self._settingView);
                    // self._chatView.getComponent("GameChatView")
                    GlobalFun.ActionShowTanChuang(self._settingView,function () {
                        console.log("[GameView][onClickSetting]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    //按键响应
    onStartGame: function () {
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
    onGiveUp: function () {
        this._scene.onGiveUp();  
    },
    onLookCard: function () {
        this._scene.onLookCard();
    },
    onCompareCard: function () {
        this._scene.onCompareCard();  
    },
    onCompareChoose: function (event,index) {
        this._scene.onCompareChoose(index);
    },
    onLastAdd: function () {
        this._scene.onLastAdd();
    },
    onAddScore: function (event,params) {
        console.log(params);
        this._scene.addScore(params);  
        // var arr = [0,1000,10000,100000];
        // this.playerJetton(zjh_cmd.MY_VIEWID,arr[params]);
    },
    onShowUserInfo: function (index) {
        console.log("[GameView][onShowUserInfo] index = " + index);  
        // this._scene.onShowUserInfo(index);
        var userItem = this.m_userHead[index].userItem;
        var self = this;
        if( cc.isValid(self._gameUserInfoView) === false ){
            cc.loader.loadRes("prefab/GameUserInfoView", function (err, UserInfoPrefab) {
                if (cc.isValid(self.node)) {
                    self._gameUserInfoView = cc.instantiate(UserInfoPrefab);
                    self.node.addChild(self._gameUserInfoView);
                    var gameUserInfoView = self._gameUserInfoView.getComponent("GameUserInfoView");
                    gameUserInfoView.init(userItem);
                    GlobalFun.ActionShowTanChuang(self._gameUserInfoView,function () {
                        console.log("[GameView][onShowUserInfo]ActionShowTanChuang callback");
                    });
                }
            });
        }
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
