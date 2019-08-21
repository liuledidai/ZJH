var ViewBase = require("ViewBase");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var zjh_cmd = require("CMD_ZaJinHua");
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
        radioButton: {
            default: [],
            type: cc.Toggle
        },
        m_Image_nothing: cc.Sprite,
        m_Label_title_gold: cc.Label,
        m_Label_my_rank: cc.Label,
        m_Label_my_gold: cc.Label,
        m_Label_my_golddes: cc.Label,
        m_Panel_myInfo: cc.Node,
        m_rankListView: cc.ScrollView,

        _selectIndex: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.radioButtonClicked(this.radioButton[this._selectIndex]);
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    radioButtonClicked: function (toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        this.m_Image_nothing.node.active = true;
        this.m_rankListView.node.active = false;
        this.m_Panel_myInfo.active = false;
        this.requestRankInfo(this._selectIndex);
    },
    requestRankInfo: function (idx) {
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        if (idx === 0) {
            url += "/hz/hzPowerCharts.ashx";
            this.m_Label_title_gold.string = "实力";
            this.m_Label_my_golddes.string = "我的实力："
        }
        else {
            url += "/hz/hzUserCharts.ashx";
            this.m_Label_title_gold.string = "金币";
            this.m_Label_my_golddes.string = "我的金币："
        }
        if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_GUEST) {
            return;
        }
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["kindid"] = zjh_cmd.KIND_ID;
        var paramString = GlobalFun.buildRequestParam(params);
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var value = JSON.parse(response);
                if (value.status == 1) {
                    if (value.score !== undefined && value.score.length > 0) {
                        self.m_rankList = value.score;
                    }
                    else {
                        self.m_rankList = [];
                    }
                    if (value.mycharts !== undefined) {
                        self.m_Label_my_rank.string = value.mycharts;
                    }
                    if (value.myscore !== undefined) {
                        self.m_Label_my_gold.string = value.myscore;
                    }
                }
                else {
                    self.m_rankList = [];
                    GlobalFun.showToast(value.msg);
                }
                self.refreshRankList();
                cc.director.emit("requestRankInfoCompleted");
            }
        };
        GlobalFun.showPopWaiting(cc.director.getScene(), {
            closeEvent: "requestRankInfoCompleted",
            callBackFunc: function () {
                console.log("[RanklistView][requestRankInfoCompleted] callbackfunc");
            },
            waitingTime: 8,
        });
        xhr.open("POST", url, true);
        xhr.send(paramString);
        console.log("[RanklistView][requestRankInfo] " + paramString);
    },
    refreshRankList: function () {
        if (!this.m_rankList || this.m_rankList.length <= 0) {
            return;
        }
        this.node.getComponent
        this.m_Image_nothing.node.active = false;
        this.m_rankListView.node.active = true;
        this.m_Panel_myInfo.active = true;
        this.m_rankListView.content.removeAllChildren();
        for (var i = 0; i < this.m_rankList.length; i++) {
            let val = this.m_rankList[i];
            let idx = i;
            cc.loader.loadRes("prefab/RankItem", (err, prefab) => {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                cc.loader.setAutoReleaseRecursively(prefab, true);
                if (cc.isValid(this.m_rankListView.content)) {
                    var newNode = cc.instantiate(prefab);
                    this.m_rankListView.content.addChild(newNode);
                    newNode.getComponent("RankItem").init({
                        idx:idx,
                        value: val,
                    })
                }
            });
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
