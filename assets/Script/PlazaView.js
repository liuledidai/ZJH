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
        m_Label_ID:cc.Label,
        m_Label_userGold: {
            default: null,
            type: cc.Label,
        },
        m_Label_notice: cc.RichText,
        userFaceAtals: {
            default:null,
            type: cc.SpriteAtlas,
        }
    },

    // use this for initialization
    onLoad: function () {
        // GlobalUserData.init();
        console.log("Plaza onLoad");
        var GameFrameNode = cc.director.getScene().getChildByName("GameFrame");
        if (GameFrameNode){
            console.log("[PlazaView][onLoad] 获取GameFrame 所在节点 并设置为常驻节点");
            cc.game.addPersistRootNode(GameFrameNode);
            this._gameFrame = GameFrameNode.getComponent("GameFrame");
            // this._gameFrame.onCloseSocket();
        }
        var fLabelWidth = this.m_Label_notice.node.getContentSize().width;
        var fParenWidth = this.m_Label_notice.node.parent.getContentSize().width;
        var runDis = (fLabelWidth + fParenWidth + 30);
        var runTime = runDis / 80;
        this.m_Label_notice.node.runAction(cc.repeatForever(cc.sequence(
            cc.place((fParenWidth + 30)/2, 0),
            cc.moveBy(runTime, -runDis, 0)
        )))
        AudioMng.playMusic("bgm_plaza");
        if (GlobalUserData.isGuest) {
            GlobalFun.showAlert({
                message: bindText,
                textAlignment:cc.TextAlignment.LEFT,
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
        this.m_Label_time = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_time");
        this.m_Label_networkState = cc.find("Canvas/m_Panel_top_right/plaza_state/m_Label_networkState");
        if (this.m_Label_time) {
            console.log("[PlazaView][schedule]");
            cc.director.getScheduler().schedule(this.refreshTimeAndNetworkInfo, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
        }
        this.refreshTimeAndNetworkInfo();
    },
    onDestroy: function () {
        cc.director.getScheduler().unschedule(this.refreshTimeAndNetworkInfo, this);
        AudioMng.stopMusic();  
        cc.sys.garbageCollect();
    },
    refreshTimeAndNetworkInfo: function () {
        var date = new Date(Date.now());
        var timeStr = date.toTimeString().slice(0,8);
        var batteryLevel = MultiPlatform.getBatteryLevel();
        var netWorkType = MultiPlatform.getNetconnType();
        this.m_Label_time.getComponent(cc.Label).string = timeStr;
        this.m_Label_networkState.getComponent(cc.Label).string = netWorkType;

    },
    refreshUI: function () {
        console.log("[PlazaView][refreshUI]");
        for (var prop in GlobalUserData) {
            if (typeof(GlobalUserData[prop]) == "function") continue;
            console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        }
        this.m_Label_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_name.string = GlobalUserData.szNickName;
        this.m_Label_ID.string = "ID" + GlobalUserData.dwUserID;
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));

        // this.refreshRoomList();
    },
    refreshRoomList: function () {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
        var PlazaScrollRing = cc.find("Canvas/PlazaScrollRing").getComponent("PlazaScrollRing");
        var beginx = -PlazaScrollRing.node.getContentSize().width/2;
        var space = 600;
        if (PlazaScrollRing) {
            PlazaScrollRing.clearItem();
            // PlazaScrollRing.node.getComponent(cc.Layout).enabled = true;
            for (var index = 0; index < 4; index++) {
                var item = cc.instantiate(this.plazaRoomItem);
                item.getComponent("PlazaRoomItem").init({ index: index + 1, roomInfo: roomList[index] });
                item.setPositionX(beginx + space*index);
                PlazaScrollRing.addItem(item);
            }
             PlazaScrollRing.init();
             PlazaScrollRing._updateToFocus("init");
        }
    },
    refreshData: function () {
        var url = GlobalDef.httpBaseUrl;
        url += "/hz/hzGameUserInfo.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            console.log("[PlazaView][refreshData] "+xhr.getResponseHeader("Content-Type"));
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = value.score;
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = value.insurescore;
                    }
                    if (value.accounts !== undefined) {
                        GlobalUserData.szAccounts = value.accounts;
                    }
                    if (value.gameid !== undefined) {
                        GlobalUserData.dwGameID = value.gameid;
                    }
                    if (value.faceid !== undefined) {
                        GlobalUserData.wFaceID = value.faceid;
                    }
                    if (value.gender !== undefined) {
                        GlobalUserData.cbGender = value.gender;
                    }
                    if (value.isguest !== undefined) {
                        GlobalUserData.isGuest = Number(value.isguest) && true || false;
                    }
                    if (value.nickname !== undefined) {
                        GlobalUserData.szNickName = value.nickname;
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
    onEnable: function() {
        cc.director.on('onChangeUserFaceSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.on('onChangeNameSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.on('onBankSuccess',this.onBankSuccess,this);
        cc.director.on('onGuestBindSuccess',this.onGuestBindSuccess,this);
        cc.director.on('onLogonRoom',this.onLogonRoom,this);
        console.log("[PlazaView][onEnable]");

    },
    onDisable: function() {
        cc.director.off('onChangeUserFaceSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.off('onChangeNameSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.off('onBankSuccess',this.onBankSuccess,this);
        cc.director.off('onGuestBindSuccess',this.onGuestBindSuccess,this);
        cc.director.off('onLogonRoom',this.onLogonRoom,this);
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
    onChangeUserFaceSuccess: function () {
        // var faceID = GlobalUserData.wFaceID;
        // if (faceID <= 0 || faceID > 8) {
        //     faceID = 1;
        // }
        // this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));
        this.refreshData();
    },
    onChangeNameSuccess: function (params) {
        this.refreshUI();  
    },
    onBankSuccess: function (params) {
        this.refreshUI();  
    },
    onGuestBindSuccess: function (params) {
        this.refreshUI();  
    },
    onClickSetting: function() {
        if( cc.isValid(this._settingView) === false ){
            this._settingView = cc.instantiate(this.settingView);
            this.node.addChild(this._settingView);
        }
        GlobalFun.ActionShowTanChuang(this._settingView,function () {
            console.log("[PlazaView][onClickSetting]ActionShowTanChuang callback");
        })
    },
    onClickUserProfile: function (params) {
        if( cc.isValid(this._userProfileView) === false ){
            this._userProfileView = cc.instantiate(this.userProfileView);
            this.node.addChild(this._userProfileView);
        }
        GlobalFun.ActionShowTanChuang(this._userProfileView,function () {
            console.log("[PlazaView][onClickUserProfile]ActionShowTanChuang callback");
        })
    },
    onClickClient: function (params) {
        console.log("[PlazaView][onClickClient]");
        var self = this;
        if( cc.isValid(self._serviceView) === false ){
            cc.loader.loadRes("prefab/ServiceView", function (err, ServicePrefab) {
                if (cc.isValid(self.node)) {
                    self._serviceView = cc.instantiate(ServicePrefab);
                    self.node.addChild(self._serviceView);
                    GlobalFun.ActionShowTanChuang(self._serviceView,function () {
                        console.log("[PlazaView][onClickClient]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },
    onClickActivity: function (params) {
        console.log("[PlazaView][conClickActivity]");
        GlobalFun.showAlert({message:"暂未开放,敬请期待!"});
    },
    onClickBank: function (params) {
        console.log("[PlazaView][conClickBank]");
        if( cc.isValid(this._bankView) === false ){
            this._bankView = cc.instantiate(this.bankView);
            this.node.addChild(this._bankView);
        }
        GlobalFun.ActionShowTanChuang(this._bankView,function () {
            console.log("[PlazaView][onClickBank]ActionShowTanChuang callback");
        })
    },
    onClickShop: function (params) {
        console.log("[PlazaView][onClickShop]");
        if( cc.isValid(this._shopView) === false ){
            this._shopView = cc.instantiate(this.shopView);
            this.node.addChild(this._shopView);
        }
        GlobalFun.ActionShowTanChuang(this._shopView,function () {
            console.log("[PlazaView][onClickShop]ActionShowTanChuang callback");
        })
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
