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
        userFaceItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        userFaceList: {
            default: null,
            type: cc.ScrollView,
        },
        userFaceCount: 0,
    },

    // use this for initialization
    onLoad: function () {
        for (var index = 0; index < this.userFaceCount; index++) {
            var item = cc.instantiate(this.userFaceItemPrefab);
            item.getComponent("UserFaceItem").init({faceID:index});
            this.userFaceList.content.addChild(item);
        }
    },
    onEnable: function() {
        cc.director.on('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[UserFaceView][onEnable]");
    },
    onDisable: function() {
        cc.director.off('onChangeUserFace',this.onChangeUserFace,this);
        console.log("[UserFaceView][onDisable]");
    },
    onChangeUserFace: function (params) {
        // GlobalUserData.wFaceID = params.detail.faceID;
        this._faceID = params.detail.faceID;
        this.onClickCloseButton();
        console.log("[UserFaceView][onChangeUserFace] faceID = "+ JSON.stringify(params.detail));
        cc.director.emit("onChangeUserFace",params.detail);
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[UserFaceView][onDestroy]");
    },
    onClickCloseButton: function() {
        var FaceID = this._faceID;
        cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            newNode.getComponent("UserProfileView")._faceID = FaceID;
            cc.director.getScene().getChildByName("Canvas").addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode,function () {
                console.log("[UserFaceView][onClickUserProfile]ActionShowTanChuang callback");
            })
            
        });
        this.node.destroy();
        console.log("[UserFaceView][onClickCloseButton] destroy");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
