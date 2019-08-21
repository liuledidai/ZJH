var SceneBase = require("SceneBase");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var AudioMng = require("AudioMng");
var MultiPlatform = require("MultiPlatform");
var bindText = "<size=32><color=#B35B1B>尊敬的用户，你当前为【游客模式】<br/>\
1.绑定账号后，体验币无法转换为金币。<br/>\
2.游客账号购买的金币，注册后等值赠送<br/>\
3.游客账号会不定期重置，对此造成的损失，本公司概不负责。<br/>\
为了保障你的虚拟财产安全，以及您获得更好的游戏体验，我们建议你绑定账号。<br/>\
                                                        《集结号拼三张》团队</c></size>\
"
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
        settingView: {
            default: null,
            type: cc.Prefab,
        },
        userProfileView: {
            default: null,
            type: cc.Prefab,
        },
        bankView: {
            default: null,
            type: cc.Prefab,
        },
        shopView: {
            default: null,
            type: cc.Prefab,
        },
        roomItemList: {
            default: null,
            type: cc.ScrollView,
        },
        plazaRoomItem: {
            default: null,
            type: cc.Prefab,
        },
        m_Image_userFace: {
            default: null,
            type: cc.Sprite,
        },
        m_Label_name: {
            default: null,
            type: cc.Label,
        },
        m_Label_ID: cc.Label,
        m_Label_userCharm: cc.Label,
        m_Label_userGold: {
            default: null,
            type: cc.Label,
        },
        m_Label_notice: cc.RichText,
        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas,
        },
        m_Button_activity: cc.Button,
    },

    // use this for initialization
    onLoad: function () {
        // GlobalUserData.init();
        console.log("Plaza onLoad");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode) {
            console.log("[PlazaView][onLoad] 获取GameFrame 所在节点 并设置为常驻节点");
            cc.game.addPersistRootNode(GameFrameNode);
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
            // this._gameFrame.onCloseSocket();
        }
        this.RoomItemPool = new cc.NodePool('RoomItemPool');
        //显示滚动消息
        var noticeMsg = cc.sys.localStorage.getItem("systemmessage") || "测试通知";
        
        if (noticeMsg && noticeMsg.length > 0) {
            this.m_Label_notice.string = noticeMsg;
            var fLabelWidth = this.m_Label_notice.node.getContentSize().width;
            var fParenWidth = this.m_Label_notice.node.parent.getContentSize().width;
            var runDis = (fLabelWidth + fParenWidth + 30);
            var runTime = runDis / 80;
            this.m_Label_notice.node.stopAllActions();
            this.m_Label_notice.node.runAction(cc.repeatForever(cc.sequence(
                cc.place((fParenWidth + 30) / 2, 0),
                cc.moveBy(runTime, -runDis, 0)
            )));
        }
        
        AudioMng.playMusic("bgm_plaza");
        if (GlobalUserData.cbUserType == GlobalDef.USER_TYPE_GUEST && !GlobalUserData.isShowBind) {
            GlobalUserData.isShowBind = true;
            GlobalFun.showAlert({
                message: bindText,
                textAlignment: cc.TextAlignment.LEFT,
                btn: [
                    {
                        name: "继续游戏",
                    },
                    {
                        name: "绑定账号",
                        callback: () => {
                            GlobalFun.showBindView();
                        }
                    }
                ],
            })
        }
        // this._gameFrame = this.getScene().getChildByName("GameFrame").getComponent("GameFrame");
        this.refreshUI();
        this.refreshRoomList();
        this.refreshData();
        // this.m_Label_time = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_time");
        // this.m_Label_networkState = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_networkState");
        // if (this.m_Label_time) {
        //     console.log("[PlazaView][schedule]");
        //     cc.director.getScheduler().schedule(this.refreshTimeAndNetworkInfo, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
        // }
        // this.refreshTimeAndNetworkInfo();
    },
    onDestroy: function () {
        this._super();
        cc.director.getScheduler().unschedule(this.refreshTimeAndNetworkInfo, this);
        AudioMng.stopMusic();
        // cc.sys.garbageCollect();
    },
    refreshTimeAndNetworkInfo: function () {
        var timeStr = date.toTimeString().slice(0, 8);
        var batteryLevel = MultiPlatform.getBatteryLevel();
        var netWorkType = MultiPlatform.getNetconnType();
        this.m_Label_time.getComponent(cc.Label).string = timeStr;
        this.m_Label_networkState.getComponent(cc.Label).string = netWorkType;

    },
    refreshUI: function () {
        console.log("[PlazaView][refreshUI]");
        for (var prop in GlobalUserData) {
            if (typeof (GlobalUserData[prop]) == "function") continue;
            console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        }
        if(!cc.isValid(this)) {
            console.log("[PlazaView is invalid]");
            return;
        }
        this.m_Label_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_userCharm.string = GlobalUserData.dwLoveLiness;
        
        this.m_Label_ID.string = "ID:" + GlobalUserData.dwGameID;
        var faceID = GlobalUserData.getUserFaceID();
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        if (GlobalUserData.cbUserType == GlobalDef.USER_TYPE_WEIXIN) {
            this.m_Label_name.string = GlobalUserData.szWeChatNickName || GlobalUserData.szNickName;
            if (!GlobalUserData.szWeChatImgURL) {
                // this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
            }
            else {
                cc.loader.load({ url: GlobalUserData.szWeChatImgURL, type: "png" }, (err, tex) => {
                    if (err) {
                        console.log(err.message || err);
                        return;
                    }
                    var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                    this.m_Image_userFace.spriteFrame = spriteFrame;
                })
            }

            this.m_Button_activity.node.active = true;
            var redPoint = cc.find("redPoint", this.m_Button_activity.node);
            var loginData = GlobalUserData.activityData.login;
            var shareData = GlobalUserData.activityData.share;
            if (!loginData || !shareData) {
                redPoint.active = false;
                return;
            }
            //登录
            var loginNum = parseInt(loginData.number);
            var current = parseInt(loginData.current);
            var gamecount = parseInt(loginData.gamecount);
            var loginTime = GlobalFun.getDeadlineTime();//parseInt(loginData.time);
            //分享
            var shareNum = parseInt(shareData.number);

            if (shareNum > 0) {
                redPoint.active = true;
            }
            else if (loginNum > 0) {
                if (loginTime > GlobalFun.getNowTimeSeconds() || gamecount > current) {
                    redPoint.active = false;
                }
                else {
                    redPoint.active = true;
                }
            }
            else {
                redPoint.active = false;
            }
        }
        else {
            this.m_Label_name.string = GlobalUserData.szNickName;
            this.m_Button_activity.node.active = false;
        }
        
        // this.refreshRoomList();
    },
    refreshRoomList: function () {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
        var PlazaScrollRing = cc.find("Canvas/PlazaScrollRing").getComponent("PlazaScrollRing");
        var beginx = -PlazaScrollRing.node.getContentSize().width / 2;
        var space = 600;
        if (PlazaScrollRing) {
            // PlazaScrollRing.clearItem();
            for (var i = PlazaScrollRing.node.children.length - 1; i >= 0; i--) {
                var node = PlazaScrollRing.node.children[i];
                this.RoomItemPool.put(node);
                console.log("[nodePool] put size",this.RoomItemPool.size());
            }
            // PlazaScrollRing.node.getComponent(cc.Layout).enabled = true;
            for (var index = 0; index < 3; index++) {
                var item = null;
                if (this.RoomItemPool.size() > 0) {
                    item = this.RoomItemPool.get();
                    console.log("[nodePool] get size",this.RoomItemPool.size());
                }
                else {
                    item = cc.instantiate(this.plazaRoomItem);
                }
                item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
                item.setPositionX(beginx + space * index);
                PlazaScrollRing.addItem(item);
            }
            for (var index = 0; index < 3; index++) {
                var item = null;
                if (this.RoomItemPool.size() > 0) {
                    item = this.RoomItemPool.get();
                    console.log("[nodePool] get size",this.RoomItemPool.size());
                }
                else {
                    item = cc.instantiate(this.plazaRoomItem);
                }
                item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
                item.setPositionX(beginx + space * (index + 3));
                PlazaScrollRing.addItem(item);
            }
            PlazaScrollRing.init();
            PlazaScrollRing._updateToFocus("init");
            this.scheduleOnce(()=>{
                // PlazaScrollRing.init();
                var initRoomID = 0;
                if (GlobalUserData.llGameScore < 10000) {
                    initRoomID = 3;
                }
                else if (GlobalUserData.llGameScore < 100000) {
                    initRoomID = 1;
                }
                else {
                    initRoomID = 2;
                }
                PlazaScrollRing.setFocusid(initRoomID);
            });
        }
    },
    refreshData: function () {
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        // url += "/hz/hzGameUserInfo.ashx";
        url += "/hz/hzGameUserInfo3_0.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["kindid"] = zjh_cmd.KIND_ID;
        params["fkindid"] = zjh_cmd.KIND_ID + "01";
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[PlazaView][refreshData] " + xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = Number(value.score);
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = Number(value.insurescore);
                    }
                    if (value.accounts !== undefined) {
                        GlobalUserData.szAccounts = value.accounts;
                    }
                    if (value.gameid !== undefined) {
                        GlobalUserData.dwGameID = Number(value.gameid);
                    }
                    if (value.faceid !== undefined) {
                        GlobalUserData.wFaceID = Number(value.faceid);
                    }
                    if (value.gender !== undefined) {
                        GlobalUserData.cbGender = value.gender;
                    }
                    if (value.usertype !== undefined) {
                        GlobalUserData.cbUserType = parseInt(value.usertype);
                    }
                    if (value.isguest !== undefined) {
                        GlobalUserData.isGuest = Number(value.isguest) && true || false;
                    }
                    if (value.nickname !== undefined) {
                        GlobalUserData.szNickName = value.nickname;
                    }
                    if (value.loveliness !== undefined) {
                        GlobalUserData.dwLoveLiness = Number(value.loveliness);
                    }
                    //抽奖次数
                    if(value.counteLoveliness !== undefined) {
                        GlobalUserData.wExchangenum = Number(value.counteLoveliness);
                    }
                    //活动数据
                    if (value.activity !== undefined) {
                        GlobalUserData.activityData = value.activity;
                        GlobalFun.setDeadlineTime(GlobalUserData.activityData.login.leftTime)
                        console.log("activityData = ",JSON.stringify(value.activity, null, " "));
                    }
                    if (value.difference !== undefined) {
                        GlobalUserData._gameServerDifftime = Number(value.difference);
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
    onEnable: function () {
        this._super();
        cc.director.on('onLogonRoom', this.onLogonRoom, this);
        cc.director.on("onUserChanged", this.onUserChanged,this);
        cc.director.on("onPlazaRefreshUI",this.refreshUI,this);
        console.log("[PlazaView][onEnable]");

    },
    onDisable: function () {
        this._super();
        cc.director.off('onLogonRoom', this.onLogonRoom, this);
        cc.director.off("onUserChanged", this.onUserChanged,this);
        cc.director.off("onPlazaRefreshUI",this.refreshUI,this);
        console.log("[PlazaView][onDisable]");
    },
    onLogonRoom: function (params) {
        console.log("[PlazaView][onLogonRoom]");
        var self = this;
        // this._gameFrame.onLogonRoom(params.detail.roomInfo);
        var roomInfo = params.detail.roomInfo;
        GlobalFun.showLoadingView({
            closeEvent: "LogonRoomFinish",
            loadfunc: function () {
                cc.director.preloadScene("GameScene", function () {
                    cc.log("GameScene scene preloaded");
                    self._gameFrame.onLogonRoom(roomInfo);
                });
            },
            closefunc: function () {
                cc.director.loadScene("GameScene");
                // cc.sys.garbageCollect();
            },
        })
    },
    onUserChanged: function () {
        this.refreshData();
    },
    onClickSetting: function () {
        if (cc.isValid(this._settingView) === false) {
            this._settingView = cc.instantiate(this.settingView);
            this.node.addChild(this._settingView);
        }
        GlobalFun.ActionShowTanChuang(this._settingView, function () {
            console.log("[PlazaView][onClickSetting]ActionShowTanChuang callback");
        })
    },
    onClickUserProfile: function (params) {
        if (cc.isValid(this._userProfileView) === false) {
            this._userProfileView = cc.instantiate(this.userProfileView);
            this.node.addChild(this._userProfileView);
        }
        GlobalFun.ActionShowTanChuang(this._userProfileView, function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        })
    },
    onClickClient: function (params) {
        console.log("[PlazaView][onClickClient]");
        var self = this;
        if (cc.isValid(self._serviceView) === false) {
            cc.loader.loadRes("prefab/ServiceView", function (err, ServicePrefab) {
                cc.loader.setAutoReleaseRecursively(ServicePrefab, true);
                if (cc.isValid(self.node)) {
                    self._serviceView = cc.instantiate(ServicePrefab);
                    self.node.addChild(self._serviceView);
                    GlobalFun.ActionShowTanChuang(self._serviceView, function () {
                        console.log("[PlazaView][onClickClient]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    onClickActivity: function (params) {
        console.log("[PlazaView][conClickActivity]");
        // GlobalFun.showAlert({ message: "暂未开放,敬请期待!" });
        GlobalFun.showActivityView();
    },
    onClickRankList: function name(params) {
        console.log("[PlazaView][onClickRankList]");
        // GlobalFun.showAlert({ message: "暂未开放,敬请期待!" });
        GlobalFun.showRanklistView();
    },
    onClickRule: function (params) {
        console.log("[PlazaView][onClickRule]");
        var self = this;
        if (cc.isValid(self._ruleView) === false) {
            cc.loader.loadRes("prefab/RuleView", function (err, Prefab) {
                cc.loader.setAutoReleaseRecursively(Prefab, true);
                if (cc.isValid(self.node)) {
                    self._ruleView = cc.instantiate(Prefab);
                    self.node.addChild(self._ruleView);
                    GlobalFun.ActionShowTanChuang(self._ruleView, function () {
                        console.log("[PlazaView][onClickRule]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    onClickBank: function (params) {
        console.log("[PlazaView][conClickBank]");
        if (cc.isValid(this._bankView) === false) {
            this._bankView = cc.instantiate(this.bankView);
            this.node.addChild(this._bankView);
        }
        GlobalFun.ActionShowTanChuang(this._bankView, function () {
            console.log("[PlazaView][onClickBank]ActionShowTanChuang callback");
        })
    },
    onClickShop: function (params) {
        console.log("[PlazaView][onClickShop]");
        if (cc.isValid(this._shopView) === false) {
            this._shopView = cc.instantiate(this.shopView);
            this.node.addChild(this._shopView);
        }
        GlobalFun.ActionShowTanChuang(this._shopView, function () {
            console.log("[PlazaView][onClickShop]ActionShowTanChuang callback");
        })
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
