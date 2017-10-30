var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
var MultiPlatform = require("MultiPlatform");
var animConfig = [
    {fileName:"DT_xsc",animName:"DT_xsc",titleName:"XSC_piaodai"},
    {fileName:"DT_gsc",animName:"DT_gsc",titleName:"GSC_piaodai"},
    {fileName:"DT_zsc",animName:"DT_zsc",titleName:"ZSC_piaodai"},
];
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
        m_Image_back: cc.Sprite,
        m_Image_col: cc.Sprite,
        m_Image_title: cc.Sprite,
        m_Label_scoreLimit: cc.Label,
        plazaAtalas: cc.SpriteAtlas,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        // var index = params.index;
        this._index = params.index;
        // var roomInfo = params.roomInfo;
        this._roomInfo = params.roomInfo;
        // this.m_Image_back.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_back_" + (this._index));
        this.m_Image_col.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_back_" + (this._index));
        // this.m_Image_title.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_down_" + (this._index));
        if (this._roomInfo && this._roomInfo.lLimitScore) {
            this.m_Label_scoreLimit.string = "准入:" + GlobalFun.numberFormat(this._roomInfo.lLimitScore);
        }
        else {
            this.m_Label_scoreLimit.string = "暂未开放";
        }
        GlobalFun.playEffects(this.node, {
            fileName: animConfig[this._index - 1].fileName,
            anim: animConfig[this._index - 1].animName,
            loop: true,
            // callback: callback,
        });
        GlobalFun.playEffects(this.node, {
            fileName: "DT_piaodai",
            anim: animConfig[this._index - 1].titleName,
            loop: true,
            x: 0,
            y: -135,
            // callback: callback,
        });
        // var actionNode = this.node.getChildByName("m_Node_back");
        // actionNode.setPosition(1000,0);
        // actionNode.runAction(cc.sequence(
        //     cc.delayTime(this._index * 0.1),
        //     cc.moveTo(0.25,-80,0),
        //     cc.moveTo(0.25,0,0)
        // ))
    },
    onClick: function (params) {
        console.log("[PlazaRoomItem][onClick]");  
        if(!this._roomInfo) {
            GlobalFun.showToast("房间暂未开放，请稍后再试");
            return;
        }

        if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_GUEST && this._roomInfo.wSortID > 3000) {
            var tipText = "尊敬的游客用户,该房间只有正式用户才能进入，是否绑定为正式用户";
            GlobalFun.showAlert({
                message: tipText,
                // textAlignment: cc.TextAlignment.LEFT,
                btn: [
                    {
                        name: "取消",
                    },
                    {
                        name: "绑定",
                        callback: () => {
                            GlobalFun.showBindView();
                        }
                    }
                ],
            })
            return;
        }
        if(GlobalUserData.llGameScore >= this._roomInfo.lLimitScore) {
            // GlobalFun.showToast("进入房间");
            cc.director.emit("onLogonRoom",{roomInfo:this._roomInfo});
            return;
        }
        else if ((GlobalUserData.llGameScore + GlobalUserData.llInsureScore) >= this._roomInfo.lLimitScore) {
            var tipText = "您身上的金币不足，需要去银行取款吗?";
            console.log(GlobalUserData.llGameScore + GlobalUserData.llInsureScore);
            GlobalFun.showAlert({
                message: tipText,
                // textAlignment: cc.TextAlignment.LEFT,
                btn: [
                    {
                        name: "取消",
                    },
                    {
                        name: "取款",
                        callback: () => {
                            GlobalFun.showBankView();
                        }
                    }
                ],
            })
        }
        else {
            var tipText = "进入房间需要"+ this._roomInfo.lLimitScore + "金豆,您的金豆不足,请充值!"
            var btncallback = GlobalFun.showShopView;
            var btnName = "充值";
            if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_GUEST) {
                tipText = "亲爱的游客用户，您的金币不足，您可以领取系统赠送的救济金，每天仅限领两次!";
                btnName = "领取";
                btncallback = () => {
                    // GlobalFun.showToast("领取救济金");
                    var szMachineID = MultiPlatform.getMachineID();
                    var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE); //GlobalDef.httpUserCenter;
                    url += "/HZMobile/GiveGold.ashx";
                    var params = {};
                    params["userid"] = GlobalUserData.dwUserID;
                    params["kindid"] = zjh_cmd.KIND_ID;
                    params["user_identity"] = szMachineID || "2d4d7c95e5df0179af2466f635ca71d1";
                    params["channelid"] = GlobalDef.CHANNELID_center;
                    if (cc.sys.os == cc.sys.OS_IOS) {
                        params["os"] = "2";
                    }
                    else {
                        // todo
                        params["os"] = "2";//"1";
                    }
                    var paramString = GlobalFun.buildRequestParam(params);
                    GlobalFun.sendRequest({
                        url: url,
                        paramString: paramString,
                        callback: (value) => {
                            if (value.status == 1) {
                                cc.director.emit("onUserChanged");
                            }
                            if (value.msg) {
                                GlobalFun.showToast(value.msg);
                            }
                        },
                    })
                }
            }
            GlobalFun.showAlert({
                message: tipText,
                // textAlignment: cc.TextAlignment.LEFT,
                btn: [
                    {
                        name: "取消",
                    },
                    {
                        name: btnName,
                        callback: () => {
                            // GlobalFun.showShopView();
                            btncallback();
                        }
                    }
                ],
            })
        }
    },
    select: function () {
        var nodeBack = this.node.getChildByName("m_Node_back");
        // nodeBack.setScale(1.0,1.0);
        this.m_Image_col.node.runAction(cc.tintTo(0.5,255,255,255));
        this.m_Image_title.node.runAction(cc.tintTo(0.5,255,255,255));
        this.node.getComponent(cc.Button).interactable = true;
    },
    unselect: function () {
        var nodeBack = this.node.getChildByName("m_Node_back");
        // nodeBack.setScale(1.0,1.0);
        this.m_Image_col.node.runAction(cc.tintTo(0.5,170,170,170));
        this.m_Image_title.node.runAction(cc.tintTo(0.5,170,170,170));
        this.node.getComponent(cc.Button).interactable = false;
    },
    playAnim: function (params) {
        var displays = this.node.getComponentsInChildren(dragonBones.ArmatureDisplay);
        for (var i = 0; i < displays.length; i++) {
            var display = displays[i];
            display.enabled = true;
            this.m_Image_col.enabled = false;
            display.playAnimation(display.animationName);
        }
    },
    stopAnim: function (params) {
        console.log("stopAnim",this._index);
        this.scheduleOnce(()=>{
            var displays = this.node.getComponentsInChildren(dragonBones.ArmatureDisplay);
            for (var i = 0; i < displays.length; i++) {
                var display = displays[i];
                display.enabled = false;
                this.m_Image_col.enabled = true;
                if (display.animationName) {
                    display.armature().animation.stop(display.animationName);
                }
            }
        })
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
