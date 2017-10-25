var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var GameModel = require("GameModel");
var GameLogic = require("GameLogic");
var AudioMng = require("AudioMng");
var SceneBase = require("SceneBase");
cc.Class({
    extends: SceneBase,

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
            default: [],
            type: cc.Node,
        },
        m_flagReady: {
            default: [],
            type: cc.Node,
        },
        m_userCardPanel: {
            default: [],
            type: cc.Node,
        },
        ptPlayer: {
            default: [],
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
        //灯光
        this.m_userLight = [];
        this.m_rcCompare = [];
        this.m_reConnect = [];
        this.m_userState = [];
        var userHeadList = this.node.getChildByName("m_Panel_center").getChildByName("m_userhead").children;
        var lightView = cc.find("Canvas/lightView");
        var flagUserState = cc.find("Canvas/flagUserState");
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            var userNode = cc.instantiate(this.userInfacePrefab);
            this.node.getChildByName("nodePlayer").addChild(userNode);
            this.m_Node_player[index] = userNode;
            userNode.setPosition(this.ptPlayer[index]);
            userNode.rotation = index * (-90);
            // userNode.getComponentInChildren("UserInfaceItem").playerAnimate("wait",index,{cbGender:(Math.floor(index/2) + 1)});
            // userNode.setScale(1.5);
            userNode.active = false;

            this.m_userHead[index] = {};
            this.m_userHead[index].name = userHeadList[index].getChildByName("m_Label_username").getComponent(cc.Label);
            this.m_userHead[index].score = userHeadList[index].getChildByName("m_Label_score").getComponent(cc.Label);
            this.m_userHead[index].bg = userHeadList[index];
            this.m_userHead[index].fire = userHeadList[index].getChildByName("dragon_fire");
            this.m_userHead[index].score_star = userHeadList[index].getChildByName("score_star").getComponent(cc.ParticleSystem);
            this.m_userHead[index].score_star.stopSystem();
            this.m_userHead[index].fire.active = false;
            this.m_userHead[index].bg.active = false;
            let idx = index;
            userNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.onShowUserInfo(idx);
            }, this)
            this.m_userHead[index].bg.on(cc.Node.EventType.TOUCH_END, () => {
                this.onShowUserInfo(idx);
            }, this)

            //计时器
            this.m_timeProgress[index] = userHeadList[index].getComponent(cc.ProgressBar);
            this.m_timeProgress[index].progress = 0;
            this.m_timeProgress[index].clock_star = userHeadList[index].getChildByName("clock_star").getComponent(cc.ParticleSystem);
            if (this.m_timeProgress[index].clock_star) {
                this.m_timeProgress[index].clock_star.stopSystem();
            }
            this.m_rcCompare[index] = this.node.getChildByName("flagCompare").children[index];
            this.m_rcCompare[index].active = false;
            this.m_reConnect[index] = this.node.getChildByName("flagReConnect").children[index];
            this.m_reConnect[index].active = false;
            //灯光
            this.m_userLight[index] = lightView.children[index];
            this.m_userLight[index].active = false;

            //用户状态：已看牌，弃牌，比牌输
            this.m_userState[index] = flagUserState.children[index];
            this.m_userState[index].active = false;
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
                cardNode.setPosition(this.ptCard[index].x + (index === zjh_cmd.MY_VIEWID && 80 || 35) * j, this.ptCard[index].y);
                cardNode.setScale((index === zjh_cmd.MY_VIEWID && 1.0 || 0.9));
                var cardItem = cardNode.getComponent("CardItem");
                cardItem.showCardBack();
                cardNode.active = false;
            }
            var cardType = cc.instantiate(this.cardTypePrefab);
            cardPanel.addChild(cardType);
            this.m_userCard[index].cardType = cardType;
            cardType.setPosition(this.ptCard[index].x + (index === zjh_cmd.MY_VIEWID && 80 || 35),
                this.ptCard[index].y - (index === zjh_cmd.MY_VIEWID && 70 || 60));
            cardType.active = false;
        }

        this.m_userChatNode = [];
        //用户聊天
        for (var index = 0; index < zjh_cmd.GAME_PLAYER; index++) {
            this.m_userChatNode[index] = {};
            //根节点
            this.m_userChatNode[index].area = cc.find("Canvas/chatView/userChatNode_" + index);
            //气泡节点
            this.m_userChatNode[index].view = cc.find("game_chat_bg", this.m_userChatNode[index].area);
            this.m_userChatNode[index].view.active = false;
            //表情节点
            this.m_userChatNode[index].emotion = cc.find("game_chat_emotion", this.m_userChatNode[index].area);
            this.m_userChatNode[index].emotion.active = false;
        }
        //孤注一掷
        this.m_fireView = cc.find("Canvas/fireView");
        this.m_fireView.active = false;
        //底部按钮
        this.m_nodeBottom.active = false;
        this.m_chipBG.active = false;
        this.nodeChipPool = this.node.getChildByName("nodeChipPool");
        this.bAutoFollow = false;

        //筹码缓存池
        this.ChipItemPool = new cc.NodePool('ChipItemPool');
    },
    onEnable: function () {
        this._super();
    },
    onDisable: function () {
        this._super();
    },
    onDestroy: function () {
        this._super();  
    },
    onResetView: function () {
        this.bAutoFollow = false;
        this.m_Button_autofollow.node.active = !this.bAutoFollow;
        this.m_Button_cancelfollow.node.active = this.bAutoFollow;
        this.m_Button_ready.node.active = false;
        this.m_nodeBottom.active = false;
        this.m_chipBG.active = false;
        this.m_fireView.active = false;
        this.setBanker(GlobalDef.INVALID_CHAIR);
        this.setAllTableScore(0);
        this.setCompareCard(false);
        this.cleanAllJettons();
        this.stopCompareCard();
        this.setMaxCellScore(0);
        // this.setGameStatusFlag();

        for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
            this.setLookCard(i, false);
            this.setUserCardType(i);
            this.setUserTableScore(i, 0);
            this.setUserGiveUp(i, false);
            this.setUserCard(i, undefined);
            this.clearCard(i);
            this.setUserReConnect(i, false);
            this.m_userLight[i].active = false;
            this.setUserLastAdd(i,false);
            this.m_userHead[i].score_star.stopSystem();
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
        else {
            var progress = (1.0 * time / zjh_cmd.TIME_START_GAME);
            // this.m_Progress_time.node.active = true;
            if (this.m_timeProgress[viewID]) {
                // this.m_timeProgress[viewID].progress = progress;
            }
            else {
                this.m_Progress_time.node.active = true;
                this.m_Progress_time.node.setPosition(0, 60);
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
        console.log("[GameView][onUpdateUser] viewID = " + viewID + " userItem = " + JSON.stringify(userItem, null, ' '));
        this.m_Node_player[viewID].active = (userItem !== undefined);
        if (userItem) {
            this.playUserAnim("wait", viewID, userItem);
            this.m_flagReady[viewID].active = (GlobalDef.US_READY === userItem.cbUserStatus);
            this.setUserReConnect(viewID, (GlobalDef.US_OFFLINE === userItem.cbUserStatus));
            this.m_userHead[viewID].bg.active = true;
            var szNickName = userItem.szName;
            if (userItem.cbUserType === GlobalDef.USER_TYPE_WEIXIN) {
                szNickName = userItem.szWeChatNickName || szNickName;
            }
            this.m_userHead[viewID].name.string = szNickName;
            this.m_userHead[viewID].score.string = userItem.lScore;
            this.m_userHead[viewID].userItem = userItem;
        }
        else {
            this.m_flagReady[viewID].active = false;
            this.setUserReConnect(viewID, false);
            this.m_userHead[viewID].name.string = "";
            this.m_userHead[viewID].score.string = "";
            this.m_userHead[viewID].bg.active = false;
            this.m_userHead[viewID].userItem = undefined;
        }
    },
    playUserAnim: function (szAnim, viewID, userItem) {
        this.m_Node_player[viewID].getComponentInChildren("UserInfaceItem").playerAnimate(szAnim, viewID, userItem)
    },
    //牌类型介绍的弹出与弹入
    onShowIntroduce: function (bShow) {

    },
    //筹码移动
    playerJetton: function (wViewChairID, num, notani) {
        if (!num || num < 1 || !this.m_lCellScore || this.m_lCellScore < 1) {
            console.log("[GameView][playerJetton] num is invalid");
            return;
        }
        var level = Math.ceil(num/this.m_lCellScore);
        console.log("[GameView][playerJetton] num,this.m_lCellScore,level",num,this.m_lCellScore,level);
        //加注动作
        this.playUserAnim("chip", wViewChairID);
        var chip;
        if (this.ChipItemPool.size() > 0) {
            // console.log("[ChipItemPool] size ",this.ChipItemPool.size());
            chip = this.ChipItemPool.get();
        }
        else {
            chip = cc.instantiate(this.chipPrefab);
        }
        this.nodeChipPool.addChild(chip);
        var chipItem = chip.getComponent("ChipItem");
        chipItem.init(num,level);
        chip.setPosition(this.ptPlayer[wViewChairID]);
        var x = Math.random() * 200 - 100;
        var y = Math.random() * 100 - 50;
        console.log("[GameView][playerJetton] [x,y] = " + [x, y]);
        chip.runAction(cc.moveTo(0.4, cc.p(x, y)).easing(cc.easeOut(0.5)));
        // }
    },
    //停止比牌动画
    stopCompareCard: function () {
        this.node.getChildByName("compareView").active = false;
    },
    //比牌
    compareCard: function (firstuser, seconduser, firstcard, secondcard, bfirstwin, callback) {
        // AudioMng.playSFX("sfx_comparecard");
        var compareView = cc.find("Canvas/compareView");
        compareView.active = true;
        // compareView.runAction(cc.sequence(cc.delayTime(3.0), cc.callFunc(function () {
        //     callback();
        // })));
        var timeBegin = Date.now();
        var firstView = this._scene.switchViewChairID(firstuser.wChairID);
        var secondView = this._scene.switchViewChairID(seconduser.wChairID);
        var fileName = "YX_bipai";
        var animName = "YX_bipai_0";
        var leftPos = cc.p(-450, 100);
        var rightPos = cc.p(250, -20);
        var firstPos, secondPos;
        if (firstView + secondView < 3) {
            if (firstView < secondView) {
                [firstPos, secondPos] = [leftPos, rightPos];
            }
            else {
                [firstPos, secondPos] = [rightPos, leftPos];
            }
        }
        else {
            if (firstView < secondView) {
                [firstPos, secondPos] = [rightPos, leftPos];
            }
            else {
                [firstPos, secondPos] = [leftPos, rightPos];
            }
        }
        if (firstPos == leftPos) {
            if (bfirstwin) {
                animName = "YX_bipai_1";
            }
            else {
                animName = "YX_bipai_0";
            }
        }
        else {
            if (bfirstwin) {
                animName = "YX_bipai_0";
            }
            else {
                animName = "YX_bipai_1";
            }
        }
        if (cc.isValid(this.firstCompareNode) == false) {
            this.firstCompareNode = new cc.Node("firstCompareNode");
            this.secondCompareNode = new cc.Node("secondCompareNode");
            this.firstcardnode = [];
            this.secondcardnode = [];
            compareView.addChild(this.firstCompareNode);
            compareView.addChild(this.secondCompareNode);
            for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
                let firstcardnode = cc.instantiate(this.cardPrefab);
                let secondcardnode = cc.instantiate(this.cardPrefab);
                this.firstCompareNode.addChild(firstcardnode);
                this.secondCompareNode.addChild(secondcardnode);
                this.firstcardnode[i] = firstcardnode;
                this.secondcardnode[i] = secondcardnode;
            }
        }
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            this.firstcardnode[i].setPosition((firstView === zjh_cmd.MY_VIEWID && 80 || 35) * i, 0);
            this.firstcardnode[i].setScale((firstView === zjh_cmd.MY_VIEWID && 1.0 || 0.9));
            this.secondcardnode[i].setPosition((secondView === zjh_cmd.MY_VIEWID && 80 || 35) * i, 0);
            this.secondcardnode[i].setScale((secondView === zjh_cmd.MY_VIEWID && 1.0 || 0.9));
        }
        this.firstCompareNode.setScale(1.0);
        this.secondCompareNode.setScale(1.0);
        this.firstCompareNode.setPosition(this.ptCard[firstView]);
        this.secondCompareNode.setPosition(this.ptCard[secondView]);
        this.firstCompareNode.active = true;
        this.secondCompareNode.active = true;
        this.m_userCard[firstView].area.active = false;
        this.m_userCard[secondView].area.active = false;
        // compareView.stopAllActions();

        this.firstCompareNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.5),
            cc.delayTime(0.5),
            cc.moveTo(0.2, firstPos)
        ))
        this.secondCompareNode.runAction(cc.sequence(
            cc.scaleTo(0.2, 1.5),
            cc.delayTime(0.5),
            cc.moveTo(0.2, secondPos)
        ))
        compareView.runAction(cc.sequence(
            cc.delayTime(0.9),
            cc.callFunc(() => {
                this.firstCompareNode.active = false;
                this.secondCompareNode.active = false;
                GlobalFun.playEffects(compareView, {
                    fileName: fileName,
                    anim: animName,
                    tag: fileName + animName,
                    loop: false,
                    frameEventHandler: (event) => {
                        console.log("frameEventHandler ",event.detail.name)
                        if (event.detail.name === "YX_bipai_sy1") {
                            AudioMng.playSFX("sfx_bipaishibai");
                        }
                    },
                    callback: () => {
                        // this.stopCompareCard();
                        this.firstCompareNode.active = true;
                        this.secondCompareNode.active = true;
                        this.firstCompareNode.setScale(1.5);
                        this.secondCompareNode.setScale(1.5);
                        this.firstCompareNode.setPosition(firstPos);
                        this.secondCompareNode.setPosition(secondPos);
                        this.firstCompareNode.runAction(cc.sequence(
                            cc.spawn(
                                cc.scaleTo(0.2, 1.0),
                                cc.moveTo(0.2, this.ptCard[firstView]),
                            ),
                            cc.delayTime(0.3),
                        ))
                        this.secondCompareNode.runAction(cc.sequence(
                            cc.spawn(
                                cc.scaleTo(0.2, 1.0),
                                cc.moveTo(0.2, this.ptCard[secondView]),
                            ),
                            cc.delayTime(0.3),
                            cc.callFunc(() => {
                                this.m_userCard[firstView].area.active = true;
                                this.m_userCard[secondView].area.active = true;
                                this.stopCompareCard();
                                if (typeof (callback) == "function") {
                                    callback();
                                    // console.timeEnd("compare");
                                    var timeEnd = Date.now();
                                    console.log("[compare] ", timeBegin, timeEnd, timeEnd - timeBegin);
                                }
                            })
                        ))
                    }
                });
            }),
        ))

    },
    //底注显示
    setCellScore: function (cellScore) {
        this.m_lCellScore = cellScore;
        if (!cellScore) {

        }
        else {

        }
    },
    setCellTurn: function (cellScore, turnCount, maxTurn) {
        var text = "底注:" + cellScore + "      第 " + (turnCount + 1) + "/" + maxTurn + " 局";
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
        var x = this.m_userHead[viewID].bg.width / 2 - 15;
        var y = this.m_userHead[viewID].bg.height / 2 - 15;
        var _pos = this.m_userHead[viewID].bg.convertToWorldSpaceAR(new cc.Vec2(x, y));
        var pos = this.node.convertToNodeSpaceAR(_pos);
        this.m_Image_banker.setPosition(pos);//this.ptBanker[viewID]
    },
    setUserReConnect: function (viewID, isReConnect) {
        this.m_reConnect[viewID].active = isReConnect;
        this.m_reConnect[viewID].stopAllActions();
        if (isReConnect) {
            this.m_reConnect[viewID].runAction(cc.repeatForever(cc.sequence(
                cc.fadeIn(1.0),
                cc.delayTime(1.0),
                cc.fadeOut(1.0),
            )));
        }
    },
    setGameStatusFlag: function (status) {
        console.log("[GameView][setGameStatusFlag]",status);
        var statusFlag = cc.find("Canvas/gameStatusFlag");
        if (cc.isValid(statusFlag)) {
            
            if (status == null || status == "none") {
                statusFlag.active = false;
            }
            else {
                statusFlag.active = true;
                for (var i = 0; i < statusFlag.children.length; i++) {
                    var element = statusFlag.children[i];
                    element.active = false;
                }
                var flagNode = cc.find("m_Image_status_" + status,statusFlag);
                if (cc.isValid(flagNode)) {
                    flagNode.active = true;
                }
            }
        }
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
        else {
            var userItem = this.m_userHead[viewID].userItem;
            if (userItem) {
                this.m_userHead[viewID].score.string = (userItem.lScore - score);
            }
        }
    },
    //发牌
    sendCard: function (viewID, index, fDelay) {
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
        spriteCard.setScale((viewID === zjh_cmd.MY_VIEWID) && 1.0 || 0.9);
        spriteCard.setPosition(0, 0);
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
                    cc.moveTo(0.2, self.ptCard[viewID].x + ((viewID === zjh_cmd.MY_VIEWID) && 80 || 35) * index, self.ptCard[viewID].y),
                )
            )
        )

    },
    //看牌状态
    setLookCard: function (viewID, bLook) {
        // if (viewID === zjh_cmd.MY_VIEWID) {
        //     return;
        // }
        this.m_userState[viewID].active = bLook;
        if (bLook) {
            this.m_userState[viewID].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("game_label_look_card");
        }
    },
    //弃牌状态
    setUserGiveUp: function (viewID, bGiveup) {
        //todo
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = true;
        }
        this.m_userState[viewID].active = bGiveup;
        if (bGiveup) {
            this.m_userState[viewID].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("game_label_out_card");
        }
    },
    //比牌输状态
    setUserLose: function (viewID, bLose) {
        var nodeCard = this.m_userCard[viewID];
        for (var i = 0; i < zjh_cmd.MAX_COUNT; i++) {
            var cardNode = nodeCard.card[i];
            cardNode.active = true;
        }
        this.m_userState[viewID].active = bLose;
        if (bLose) {
            this.m_userState[viewID].getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame("game_label_lose_card");
        }
    },
    //孤注一掷状态
    setUserLastAdd: function (viewID, bLastAdd) {
        if (this.m_userHead[viewID]) {
            this.m_userHead[viewID].fire.active = bLastAdd;
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
        this.m_userState[viewID].active = false;
    },
    //显示牌值
    setUserCard: function (viewID, cardData) {
        console.log("[GameView][setUserCard][viewID,cardData] = " + [viewID, cardData]);
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
                else {
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
    setUserCardType: function (viewID, cardtype, state) {
        var nodeCardType = this.m_userCard[viewID].cardType;
        var cardTypeState = "card_type_" + (state || "");
        console.log("[GameView][setUserCardType] [viewID,cardtype] = " + [viewID, cardtype]);
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
    showCardTypeAnim: function (cardType, callback) {
        var gender = "_male";
        if (GlobalUserData.cbGender == GlobalDef.GENDER_GIRL) {
            gender = "_female";
        }
        switch (cardType) {
            case GameLogic.CT_JIN_HUA:
                AudioMng.playSFX("sfx_jinhua" + gender);
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_tonghua",
                    loop: false,
                    callback: callback,
                });
                break;
            case GameLogic.CT_SHUN_JIN:
                AudioMng.playSFX("sfx_shunjin" + gender);
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_tonghuashun",
                    loop: false,
                    callback: callback,
                });
                break;
            case GameLogic.CT_BAO_ZI:
                AudioMng.playSFX("sfx_baozi" + gender);
                GlobalFun.playEffects(this.node, {
                    fileName: "jinhuabaoziths",
                    anim: "yx_baozi",
                    loop: false,
                    callback: callback,
                });
                break;

            default:
                if (typeof (callback) == "function") {
                    callback();
                }
                break;
        }
    },
    winScore: function name(params) {
        for (var index = 0; index < 4; index++) {
            this.winTheChip(index,index + 2000);
        }
        // this.showSendPresent(0,0,1,1);
        // for (var i = 0; i < zjh_cmd.GAME_PLAYER; i++) {
        //     // for (var j = i + 1; j < zjh_cmd.GAME_PLAYER; j++) {
        //     this.showSendPresent(0, i, i, 1);
        //     // }

        // }
        // var firstUser = {
        //     wChairID: 0,
        // }
        // var seconduser = {
        //     wChairID: 1,
        // }
        // this.compareCard(firstUser, seconduser, undefined, undefined, true);
    },
    //赢得筹码
    winTheChip: function (wWinner, score) {
        this.playUserAnim("collect", wWinner);
        var children = this.nodeChipPool.children;
        var delayTime = 0.1 * children.length + 0.4;
        var _pos = this.m_userHead[wWinner].bg.convertToWorldSpaceAR(cc.v2(0,0));
        var pos = this.nodeChipPool.convertToNodeSpaceAR(_pos);
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            element.runAction(cc.sequence(
                cc.delayTime(0.1 * (children.length - i)),
                cc.moveTo(0.4, pos).easing(cc.easeOut(0.4)),
                cc.callFunc((node)=> {
                    AudioMng.playSFX("sfx_gold_fly");
                    // node.destroy();
                    this.ChipItemPool.put(node);
                })
            )
            )
        }
        this.m_userHead[wWinner].bg.runAction(cc.sequence(
            cc.delayTime(0.4),
            cc.callFunc(() => {
                GlobalFun.playEffects(this.m_userHead[wWinner].bg, {
                    fileName: "YX_fj_gg",
                    anim: "YX_fj_gg",
                    loop: false,
                    remove: false,
                    callback: () => {
                        this.m_userHead[wWinner].bg.runAction(cc.sequence(
                            cc.delayTime(0.5),
                            cc.callFunc(() => {
                                this.m_userHead[wWinner].score_star.stopSystem();
                            })
                        ))
                    }
                })
            }),
            cc.delayTime(0.5),
            cc.callFunc(()=>{
                this.m_userHead[wWinner].score_star.resetSystem();
            })
        ))
        
        //显示赢家积分
        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => {
                cc.loader.loadRes("prefab/winScoreLabel", function (err, prefab) {
                    if (err) {
                        console.log(err.message || err);
                        return;
                    }
                    cc.loader.setAutoReleaseRecursively(prefab, true);
                    var label = cc.instantiate(prefab);
                    // label.setPosition(self.ptCard[wWinner].x + (wWinner === zjh_cmd.MY_VIEWID && 80 || 35), self.ptCard[wWinner].y);
                    label.setPosition(pos.x, pos.y - 90);
                    self.node.addChild(label);
                    label.getComponent(cc.Label).string = "+" + score;
                    label.opacity = 0;
                    AudioMng.playSFX("sfx_addscore_2");
                    label.runAction(cc.sequence(
                        cc.spawn(
                            cc.moveBy(0.4, 0, 90),
                            cc.fadeIn(0.2),
                        ),
                        cc.delayTime(0.4),
                        cc.spawn(
                            cc.moveBy(0.2, 0, 20),
                            cc.fadeOut(0.2),
                        ),
                        cc.callFunc(function (node) {
                            node.destroy();
                        })
                    ))
                })
            })
        ))
    },
    //清理筹码
    cleanAllJettons: function () {
        this.nodeChipPool.removeAllChildren();
    },
    showSendPresent: function (wSendChairID, wRecvChairID, cbGiftID, wGiftCount) {
        if (wSendChairID === GlobalDef.INVALID_CHAIR) {
            //送全场
        }
        else {
            var sendViewID = this._scene.switchViewChairID(wSendChairID);
            var recvViewID = this._scene.switchViewChairID(wRecvChairID);
            var sendPoint = this.ptPlayer[sendViewID];
            var recvPoint = this.ptPlayer[recvViewID];
            var presentData = GlobalUserData.presentData['present']['base'];
            var icon = presentData[cbGiftID].icon;
            var charm = presentData[cbGiftID].charm * wGiftCount;
            var presentView = cc.find("Canvas/presentView");
            var fileName = "jjh_liwu";
            var animName = "jjh_liwu_" + GlobalFun.PrefixInteger(cbGiftID, 2);
            cc.loader.loadRes("res/gameUserInfo", cc.SpriteAtlas, (err, atlas) => {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                cc.loader.setAutoReleaseRecursively(atlas, true)
                var node = new cc.Node("present");
                var sprite = node.addComponent(cc.Sprite);
                var frame = atlas.getSpriteFrame(icon.split('.')[0]);
                sprite.spriteFrame = frame;
                presentView.addChild(node);
                node.setPosition(sendPoint);
                node.runAction(cc.sequence(
                    cc.delayTime(1.0),
                    cc.moveTo(0.5, recvPoint),
                    cc.callFunc((pnode) => {
                        AudioMng.playSFX("sfx_present_" + GlobalFun.PrefixInteger(cbGiftID + 1, 2));
                        GlobalFun.playEffects(presentView, {
                            fileName: fileName,
                            anim: animName,
                            tag: fileName + animName,
                            loop: false,
                            x: recvPoint.x,
                            y: recvPoint.y,
                            callback: () => {
                                // 显示魅力
                                if (charm <= 0) {
                                    return;
                                }
                                cc.loader.loadRes("prefab/charmLabel", function (err, prefab) {
                                    if (err) {
                                        console.log(err.message || err);
                                        return;
                                    }
                                    cc.loader.setAutoReleaseRecursively(prefab, true);
                                    var label = cc.instantiate(prefab);
                                    label.setPosition(recvPoint.x, recvPoint.y - 90);
                                    presentView.addChild(label);
                                    label.getComponent(cc.Label).string = "魅力+" + charm;
                                    label.opacity = 0;
                                    label.runAction(cc.sequence(
                                        cc.spawn(
                                            cc.moveBy(0.4, 0, 90),
                                            cc.fadeIn(0.2),
                                        ),
                                        cc.delayTime(0.4),
                                        cc.spawn(
                                            cc.moveBy(0.2, 0, 20),
                                            cc.fadeOut(0.2),
                                        ),
                                        cc.callFunc(function (labelnode) {
                                            labelnode.removeFromParent();
                                            labelnode.destroy();
                                        })
                                    ))
                                })
                            }
                        });
                        pnode.removeFromParent();
                        pnode.destroy();
                    })
                ))
            });
        }
    },
    showUserChat: function (viewID, message) {
        console.log("[GameView][showUserChat]", message);
        if (this.m_userChatNode[viewID] && cc.isValid(this.m_userChatNode[viewID].area)) {
            this.m_userChatNode[viewID].area.stopAllActions();
            this.m_userChatNode[viewID].view.active = false;
            this.m_userChatNode[viewID].emotion.active = false;
        }
        else {
            return;
        }
        if (cc.isValid(this.m_userChatNode[viewID].view)) {
            let chatView = this.m_userChatNode[viewID].view;
            chatView.active = true;
            var label = chatView.getComponentInChildren(cc.Label);
            label.string = message;
            this.m_userChatNode[viewID].area.runAction(cc.sequence(
                cc.delayTime(3.0),
                cc.callFunc(() => {
                    chatView.active = false;
                }),
            ))
        }
    },
    showUserEmotion: function (viewID, index) {
        console.log("[GameView][showUserEmotion]", index);
        if (this.m_userChatNode[viewID] && cc.isValid(this.m_userChatNode[viewID].area)) {
            this.m_userChatNode[viewID].area.stopAllActions();
            this.m_userChatNode[viewID].view.active = false;
            this.m_userChatNode[viewID].emotion.active = false;
        }
        else {
            return;
        }
        if (cc.isValid(this.m_userChatNode[viewID].emotion)) {
            let chatEmotion = this.m_userChatNode[viewID].emotion;
            chatEmotion.active = true;
            var fileName = "jjh_biaoqing";
            var animName = "cartoon_" + GlobalFun.PrefixInteger(index, 2);
            GlobalFun.playEffects(chatEmotion, {
                fileName: fileName,
                anim: animName,
                loop: false,
                remove: false,
                callback: () => {
                    console.log("[bug]", cc.isValid(chatEmotion));
                    chatEmotion.active = false;
                },
            });
        }
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
    onClickChat: function () {
        // this._scene.sendTextChat('hello world');
        console.log("[GameView][onClickChat]");
        var self = this;
        if (cc.isValid(self._chatView) === false) {
            cc.loader.loadRes("prefab/GameChatView", function (err, chatPrefab) {
                cc.loader.setAutoReleaseRecursively(chatPrefab, true);
                if (cc.isValid(self.node)) {
                    self._chatView = cc.instantiate(chatPrefab);
                    self.node.addChild(self._chatView);
                }
            });
        }
    },
    onClickSetting: function () {
        console.log("[GameView][onClickSetting]");
        var self = this;
        if (cc.isValid(self._settingView) === false) {
            cc.loader.loadRes("prefab/GameSettingView", function (err, settingPrefab) {
                cc.loader.setAutoReleaseRecursively(settingPrefab, true);
                if (cc.isValid(self.node)) {
                    self._settingView = cc.instantiate(settingPrefab);
                    self.node.addChild(self._settingView);
                    // self._chatView.getComponent("GameChatView")
                    GlobalFun.ActionShowTanChuang(self._settingView, function () {
                        console.log("[GameView][onClickSetting]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    //按键响应
    onStartGame: function () {
        this._scene.onStartGame(true);
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
    onCompareChoose: function (event, index) {
        this._scene.onCompareChoose(index);
    },
    onLastAdd: function () {
        this._scene.onLastAdd();
    },
    onAddScore: function (event, params) {
        console.log(params);
        this._scene.addScore(params);
    },
    onShowUserInfo: function (index) {
        console.log("[GameView][onShowUserInfo] index = " + index);
        // this._scene.onShowUserInfo(index);
        var userItem = this.m_userHead[index].userItem;
        var self = this;
        var isSelf = userItem.dwUserID == GlobalUserData.dwUserID || GlobalUserData.cbUserType == GlobalDef.USER_TYPE_GUEST;
        var ViewName = "GameUserInfoView";
        if (isSelf) {
            ViewName = "GameSelfInfoView";
        }
        if (cc.isValid(self._gameUserInfoView) === false) {
            cc.loader.loadRes("prefab/" + ViewName, function (err, UserInfoPrefab) {
                cc.loader.setAutoReleaseRecursively(UserInfoPrefab, true);
                if (cc.isValid(self.node)) {
                    self._gameUserInfoView = cc.instantiate(UserInfoPrefab);
                    self.node.addChild(self._gameUserInfoView);
                    var gameUserInfoView = self._gameUserInfoView.getComponent(ViewName);
                    gameUserInfoView.init(userItem);
                    GlobalFun.ActionShowTanChuang(self._gameUserInfoView, function () {
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
