var ScrollRing = require("ScrollRing");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
cc.Class({
    extends: ScrollRing,

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
    },

    // use this for initialization
    onLoad: function () {
        this._super();
    },
    addItem: function (itemNode) {
        var layout = this.node.getComponent(cc.Layout);
        if (layout) {
            layout.enabled = true;
        }
        this.node.addChild(itemNode);
        // if (layout) {
        //     layout.enabled = false;
        // }
    },
    clearItem: function () {
        this.node.removeAllChildren();
    },
    // start:function(){
    //     this._super();
    //     //
    // },
    refreshRoomList: function (roomList) {
        var itemidx = {"item1":0,"item2":1,"item3":2};
        this.roominfos = {};
        for(var i = 0;i < this.node.childrenCount;i ++){
            var ch = this.node.children[i];
            console.log("item",ch.name,roomList[itemidx[ch.name]]);
            var lab = ch.getChildByName("label").getComponent(cc.Label);
            if(roomList[itemidx[ch.name]]){
                this.roominfos[ch.name] = roomList[itemidx[ch.name]];
                lab.string = "财富："+ this.roominfos[ch.name].lLimitScore;
            }else{
                lab.string = "未开放";
            }
        }
    },
    onFocusChange: function (evName, itemNode) {
        if (!cc.isValid(itemNode)) {
            console.log("onFocusChange", evName," itemNode is invalid");
            return;
        }
        console.log("onFocusChange", evName,itemNode.getComponent("PlazaRoomItem")._index);
        // for(var i = 0;i < itemNode.childrenCount;i++){
        // var node = itemNode.children[i];
        // if(node.name == "dragon"){
        if (evName == "loseFocus") {
            itemNode.getComponent("PlazaRoomItem").stopAnim();
        }
        else if (evName == "focused") {
            itemNode.getComponent("PlazaRoomItem").playAnim();
        }
        // }
    },
    /*
    roominfo://游戏房间列表结构
    struct tagMobileGameServer
    {
        BYTE                                cbRoomLevel;                        //房间等级
        LONG                                lBaseScore;                         //房间底分
        LONG                                lLimitScore;                        //进入限制
        LONG                                lMaxBombLimit;                      //最大倍数限制
        WORD								wSortID;							//排序号码
        WORD								wKindID;							//名称号码
        WORD								wServerID;							//房间号码
        WORD								wStationID;							//站点号码
        WORD								wServerPort;						//房间端口
        DWORD								dwServerAddr;						//房间地址
        DWORD								dwOnLineCount;						//在线人数
        TCHAR								szServerName[SERVER_LEN];			//房间名称
        TCHAR								szDescribeTxt[128];                 //房间信息
    };
    */ 
    onClickItem:function(itemNode){
        itemNode.getComponent("PlazaRoomItem").onClick();
        // var roominfo = this.roominfos[itemNode.name];
        
        // console.log("[PlazaRoomItem][onClick]");  
        // if(!roominfo) {
        //     console.log("error:not found roominfo");
        //     // GlobalFun.showAlert(cc.director.getScene(),"房间暂未开放，请稍后再试");
        //     return;
        // }
        // if(GlobalUserData.llGameScore >= roominfo.lLimitScore) {
        //     // GlobalFunc.showAlert(cc.director.getScene(),"进入房间");
        //     cc.director.emit("onLogonRoom",{roomInfo:roominfo});
        // }
        // else {
        //     // GlobalFun.showToast("进入房间需要"+ roominfo.lLimitScore + "金币,您的金币不足,请充值!");
        // }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
