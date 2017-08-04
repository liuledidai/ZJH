var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
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
        }
        AudioMng.playMusic("bgm_plaza");
        // this._gameFrame = this.getScene().getChildByName("GameFrame").getComponent("GameFrame");
        this.refreshUI();
    },
    onDestroy: function () {
        AudioMng.stopMusic();  
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

        this.refreshRoomList();
    },
    refreshRoomList: function () {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList, null, ' '));
        var coverView = cc.find("Canvas/scrollview").getComponent("CoverView");
        var roomListPanel = coverView.content;
        roomListPanel.removeAllChildren();
        for (var index = 0; index < 4; index++) {
            var item = cc.instantiate(this.plazaRoomItem);
            item.getComponent("PlazaRoomItem").init({index:index+1,roomInfo:roomList[index]});
            roomListPanel.addChild(item);
        }
        var scContentSize = coverView.node.getContentSize();
        var padding = roomListPanel.children[1].getPositionX() - roomListPanel.children[0].getPositionX();
        coverView.init({
            paddingLeft:scContentSize.width/2 - padding/2,
            paddingRight:scContentSize.width/2 - padding/2,
            endCallBack:()=> {
                this.onCoverViewEndCallBack();
            }
        });
        // coverView.scrollToLeft(0.1);
        this.node.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(()=> {
                if (GlobalUserData.llGameScore < 10000) {
                    coverView.scrollToIndex(0);
                }
                else if (GlobalUserData.llGameScore < 100000) {
                    coverView.scrollToIndex(1);
                }
                else {
                    coverView.scrollToIndex(2);
                }
                
            })
        ));
        // this.scheduleOnce(coverView.scrollToLeft(0.1));
        // var roomPageView = cc.find("Canvas/pageview").getComponent(cc.PageView);
        // roomPageView.removeAllPages();
        // for (var index = 0; index < 4; index++) {
        //     var item = cc.instantiate(this.plazaRoomItem);
        //     var PlazaRoomItem = item.getComponent("PlazaRoomItem");
        //     PlazaRoomItem.init({index:index+1,roomInfo:roomList[index]});
        //     // if (index === 0) {
        //     //     PlazaRoomItem.select();
        //     // }
        //     // else {
        //     //     PlazaRoomItem.unselect();
        //     // }
        //     // roomPageView.addPage(item);
        // }
        // roomPageView.scrollToPage(1,0.5);
    },
    onCoverViewEndCallBack: function () {
        var coverView = cc.find("Canvas/scrollview").getComponent("CoverView");
        var children = coverView.content.children;
        var curIndex = coverView.getCurIndex();
        for (var index = 0; index < children.length; index++) {
            var element = children[index];
            var PlazaRoomItem = element.getComponent("PlazaRoomItem");
            if (index === curIndex) {
                PlazaRoomItem.select();
            }
            else {
                PlazaRoomItem.unselect();
            }
        }
    },
    onScrollViewEvent: function (event) {
        console.log(event);
        // console.log(this.roomItemList.content);
        console.log([this.roomItemList.getMaxScrollOffset(),this.roomItemList.getScrollOffset(),this.roomItemList.getContentPosition()]);
    },
    onPageViewEvent: function (event) {
        var roomPageView = cc.find("Canvas/pageview").getComponent(cc.PageView);
        var curIndex = roomPageView.getCurrentPageIndex();
        var allPages = roomPageView.getPages();
        console.log("[PlazaView][onPageViewEvent] curIndex = " + curIndex);
        for (var index = 0; index < allPages.length; index++) {
            var element = allPages[index];
            var PlazaRoomItem = element.getComponent("PlazaRoomItem");
            if (curIndex === index) {
                PlazaRoomItem.select();
            }
            else {
                // element.color = new cc.Color(170,170,170);
                PlazaRoomItem.unselect()
            }
        }
        // if (curIndex === allPages.length - 1) {
        //     var firstPage = cc.instantiate(allPages[0]);
        //     roomPageView.removePageAtIndex(0);            
        //     roomPageView.insertPage(firstPage,allPages.length);            
        //     // roomPageView.setCurrentPageIndex(allPages.length - 2);
            
        // }
        // else if (curIndex === 0) {
        //     var lastPage = cc.instantiate(allPages[allPages.length - 1]);
        //     roomPageView.removePageAtIndex(allPages.length -1);
        //     roomPageView.insertPage(lastPage,0);
        //     // roomPageView.setCurrentPageIndex(1);
        // }
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
                        GlobalUserData.isGuest = value.isguest;
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
        GlobalFun.showToast({message:"暂未开放,敬请期待!"});
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
