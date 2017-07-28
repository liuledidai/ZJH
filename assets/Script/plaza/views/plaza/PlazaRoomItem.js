var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
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
        this.m_Image_title.spriteFrame = this.plazaAtalas.getSpriteFrame("plaza_image_room_down_" + (this._index));
        if (this._roomInfo && this._roomInfo.lLimitScore) {
            this.m_Label_scoreLimit.string = this._roomInfo.lLimitScore;
        }
        var actionNode = this.node.getChildByName("m_Node_back");
        actionNode.setPosition(1000,0);
        actionNode.runAction(cc.sequence(
            cc.delayTime(this._index * 0.1),
            cc.moveTo(0.25,-80,0),
            cc.moveTo(0.25,0,0)
        ))
    },
    onClick: function (params) {
        console.log("[PlazaRoomItem][onClick]");  
        if(!this._roomInfo) {
            GlobalFun.showAlert(cc.director.getScene(),"房间暂未开放，请稍后再试");
            return;
        }
        if(GlobalUserData.llGameScore >= this._roomInfo.lLimitScore) {
            // GlobalFun.showAlert(cc.director.getScene(),"进入房间");
            cc.director.emit("onLogonRoom",{roomInfo:this._roomInfo});
        }
        else {
            GlobalFun.showToast({message:"进入房间需要"+ this._roomInfo.lLimitScore + "金豆,您的金豆不足,请充值!"});
        }
    },
    select: function () {
        var nodeBack = this.node.getChildByName("m_Node_back");
        nodeBack.setScale(1.2,1.2);
        this.m_Image_col.node.runAction(cc.tintTo(0.5,255,255,255));
        this.m_Image_title.node.runAction(cc.tintTo(0.5,255,255,255));
    },
    unselect: function () {
        var nodeBack = this.node.getChildByName("m_Node_back");
        nodeBack.setScale(1.0,1.0);
        this.m_Image_col.node.runAction(cc.tintTo(0.5,170,170,170));
        this.m_Image_title.node.runAction(cc.tintTo(0.5,170,170,170));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
