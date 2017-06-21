var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
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
        this.refreshUI();
    },
    refreshUI: function () {
        console.log("[PlazaView][refreshUI]");
        for (var prop in GlobalUserData) {
            if (typeof(GlobalUserData[prop]) == "function") continue;
            console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        }
        this.m_Label_userGold.string = GlobalUserData.llGameScore;
        this.m_Label_name.string = GlobalUserData.szNickName;
        var faceID = GlobalUserData.wFaceID;
        if (faceID <= 0 || faceID > 8) {
            faceID = 1;
        }
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID-1));

        this.refreshRoomList();
    },
    refreshRoomList: function () {
        var roomList = GlobalUserData.getRoomByGame(zjh_cmd.KIND_ID);
        console.log("[PlazaView][refreshUI] " + JSON.stringify(roomList));
        var roomListPanel = this.node.getChildByName("m_Panel_center");
        roomListPanel.removeAllChildren();
        for (var index = 0; index < 3; index++) {
            var item = cc.instantiate(this.plazaRoomItem);
            item.getComponent("PlazaRoomItem").init({index:index+1,roomInfo:roomList[index]});
            roomListPanel.addChild(item);
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
        console.log("[PlazaView][onEnable]");

    },
    onDisable: function() {
        cc.director.off('onChangeUserFaceSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.off('onChangeNameSuccess',this.onChangeUserFaceSuccess,this);
        cc.director.off('onBankSuccess',this.onBankSuccess,this);
        console.log("[PlazaView][onDisable]");
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
        GlobalFun.showToast(cc.director.getScene(),"客服功能暂未开放,敬请期待!");
    },
    onClickActivity: function (params) {
        console.log("[PlazaView][conClickActivity]");
        GlobalFun.showToast(cc.director.getScene(),"暂未开放,敬请期待!");
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
