var ViewBase = require("ViewBase");
var GlobalUserData = require("GlobalUserData");
var GlobalDef = require("GlobalDef");
cc.Class({
    extends: ViewBase,

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
        m_Label_nickname: cc.Label,
        m_Label_id: cc.Label,
        m_Label_presentname: cc.Label,
        m_Label_num: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_des: cc.Label,

    },

    // use this for initialization
    onLoad: function () {

    },
    close: function (callback) {
        if (callback && typeof (callback) == "function") {
            callback();
        }
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickConfirm: function () {
        this.close(this.callback)
    },
    init: function (params) {
        this.callback = params.callback;
        var itemInfo = params.itemInfo;
        var userItem = params.userItem;
        var sendNum = params.sendNum;
        var szNickName = userItem.szName;
        var dwGameID = userItem.dwGameID;
        var goldVal = itemInfo.gold;
        var costGold = goldVal * sendNum;
        var llInsureScore = GlobalUserData.llInsureScore;
        var leftGold = llInsureScore - costGold;
        if (userItem.cbUserType === GlobalDef.USER_TYPE_WEIXIN) {
            szNickName = userItem.szWeChatNickName || szNickName;
        }

        this.m_Label_nickname.string = szNickName;
        this.m_Label_id.string = dwGameID;
        this.m_Label_presentname.string = itemInfo.name;
        this.m_Label_num.string = sendNum;
        this.m_Label_gold.string = costGold;
        this.m_Label_charm.string = (itemInfo.charm * sendNum) + "魅力";

        var szDes = "说明：您的银行存款" + llInsureScore + ",购买礼物后存款剩余" + leftGold + ".";
        this.m_Label_des.string = szDes;

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
