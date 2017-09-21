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
        userFaceItemPrefab: {
            default: null,
            type: cc.Prefab,
        },
        userFaceList: {
            default: null,
            type: cc.ScrollView,
        },
        userFaceCount: 0,
        _selectIndex: -1,
    },

    // use this for initialization
    onLoad: function () {
        for (var index = 0; index < this.userFaceCount; index++) {
            var item = cc.instantiate(this.userFaceItemPrefab);
            let idx = index;
            item.getComponent("UserFaceItem").init({ faceID: index });
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this.onFaceItemClick(idx);
            })
            this.userFaceList.content.addChild(item);
        }
        this.onFaceItemClick(GlobalUserData.wFaceID - 1);
    },
    onEnable: function () {
        console.log("[UserFaceView][onEnable]");
    },
    onDisable: function () {
        console.log("[UserFaceView][onDisable]");
    },
    close: function (params) {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onFaceItemClick: function (idx) {
        if (idx === this._selectIndex) {
            return;
        }
        var children = this.userFaceList.content.children;
        if (this._selectIndex >= 0 && cc.isValid(children[this._selectIndex])) {
            children[this._selectIndex].getComponent("UserFaceItem").setSelect(false);
        }
        this._selectIndex = idx;
        if (idx >= 0 && cc.isValid(children[idx])) {
            children[idx].getComponent("UserFaceItem").setSelect(true);
        }
    },
    onClickConfirm: function () {
        this.onChangeUserFace({ faceID: this._selectIndex + 1 })
    },
    onChangeUserFace: function (params) {
        this._faceID = params.faceID;
        var faceID = this._faceID;
        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        // url += "/hz/hzUpdateFaceId.ashx";
        url += "/hz/hzUpdateFaceId3_0.ashx";
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["faceId"] = faceID;
        var paramString = GlobalFun.buildRequestParam(params);
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                cc.director.emit("onUserChanged");
                var value = JSON.parse(response);
                if (value.msg !== undefined) {
                    GlobalFun.showToast(value.msg);
                }
                if (value.status == 1) {
                    self.close();
                }
            }
        };
        xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(paramString);
        console.log("[UserFaceView][onChangeUserFace] " + paramString);
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[UserFaceView][onDestroy]");
    },
    onClickCloseButton: function () {
        // var FaceID = this._faceID;
        // cc.loader.loadRes("prefab/UserProfileView", function (err, prefab) {
        //     var newNode = cc.instantiate(prefab);
        //     newNode.getComponent("UserProfileView")._faceID = FaceID;
        //     cc.director.getScene().getChildByName("Canvas").addChild(newNode);
        //     GlobalFun.ActionShowTanChuang(newNode, function () {
        //         console.log("[UserFaceView][onClickUserProfile]ActionShowTanChuang callback");
        //     })

        // });
        this.close();
        console.log("[UserFaceView][onClickCloseButton] destroy");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
