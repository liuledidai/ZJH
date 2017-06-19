var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
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
        shopItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        shopItemList: {
            default: null,
            type: cc.ScrollView,
        },
        shopItemCount: 0,
    },

    // use this for initialization
    onLoad: function () {
        
        for (var index = 0; index < this.shopItemCount; index++) {
            var item = cc.instantiate(this.shopItemPrefab);
            var shopID;
            if(GlobalUserData.isOpenIAP){
                shopID = index;
            }
            else{
                shopID = index + 6;
            }
            item.getComponent("ShopItem").init({shopID:index});
            this.shopItemList.content.addChild(item);
        }
        console.log("[ShopView][onLoad] "+JSON.stringify(GlobalUserData.shopData));
    },
    onEnable: function() {
        // cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        // console.log("[UserFaceView][onEnable]");
    },
    onDisable: function() {
        // cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        // console.log("[UserFaceView][onDisable]");
    },
    onChangeUserFace: function (params) {
        // GlobalUserData.wFaceID = params.detail.faceID;
        // this._faceID = params.detail.faceID;
        // this.onClickCloseButton();
        // console.log("[UserFaceView][onChangeUserFace] faceID = "+ JSON.stringify(params.detail));
        // cc.director.emit("onChangeUserFace",params.detail);
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[ShopView][onDestroy]");
    },
    onClickCloseButton: function() {
        this.node.destroy();
        console.log("[ShopView][onClickCloseButton] destroy");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
