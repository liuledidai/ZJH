var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var MultiPlatform = require("MultiPlatform");
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
        this.refreshUI();
        console.log("[ShopView][onLoad] " + JSON.stringify(GlobalUserData.shopData));
    },
    refreshUI: function (params) {
        this.shopItemList.content.removeAllChildren();
        for (var index = 0; index < this.shopItemCount; index++) {
            var item = cc.instantiate(this.shopItemPrefab);
            let shopID;
            let goodsID = index;
            if (GlobalUserData.isOpenIAP) {
                shopID = index;
            }
            else {
                shopID = index + 6;
            }
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this.onShopItemClick(goodsID);
            }, item);
            item.getComponent("ShopItem").init({ shopID: goodsID });
            this.shopItemList.content.addChild(item);
        }
    },
    onEnable: function () {
        // cc.director.on('onInCharge',this.onInCharge,this);
        console.log("[ShopView][onEnable]");
    },
    onDisable: function () {
        // cc.director.off('onInCharge',this.onInCharge,this);
        console.log("[ShopView][onDisable]");
    },
    onShopItemClick: function (goodsID) {
        console.log("[ShopView][onShopItemClick] goodsID = ", goodsID);
        if (GlobalUserData.isGuest) {
            GlobalFun.showAlert({
                message: "<color=#000000>为了您的账号安全,充值前请绑定手机号!<br/> (绑定就送<color=#FF0000>2000</c>金币,账号和手机号均限领一次)</c>",
                btn: [
                    {
                        name: "去绑定",
                        callback: () => {
                            GlobalFun.showBindView();
                            this.close();
                        }
                    },
                    {
                        name: "继续",
                        callback: () => {
                            this.onInCharge({ goodsID: goodsID })
                        }
                    }
                ],
            })
        }
        else {
            this.onInCharge({ goodsID: goodsID })
        }
    },
    onInCharge: function (args) {
        console.log("[ShopView][onInCharge]");
        var goodsID = args.goodsID;
        var shopDataArray = GlobalUserData.shopData.shop.base;
        if (goodsID < 0 || goodsID >= shopDataArray.length) {
            console.log("[ShopView][onInCharge] shopDataArray length = " + shopDataArray.length);
            return;
        }
        var itemVal = shopDataArray[goodsID];
        var params = {};

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            params["userid"] = GlobalUserData.dwUserID;
            params["goods_name"] = itemVal.name;
            params["goods_num"] = "1";
            params["remark"] = "zhajinhuaGame";
            params["goods_note"] = "集结号拼三张";
            params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1";//todo
            params["user_identity"] = MultiPlatform.getMachineID() || "usertoken";//todo
            params["productid"] = itemVal.id;
            params["os"] = "1";
            params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
            params["channelid"] = GlobalDef.CHANNELID_center;
            params["pay_amt"] = itemVal.price;

            var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
            url += "/HZMobile/PayInit2_0.ashx";
            params["url"] = url;

            this.onChoosePaytype(params);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            params["userid"] = GlobalUserData.dwUserID;
            params["goods_name"] = itemVal.name;
            params["goods_num"] = "1";
            params["remark"] = "zhajinhuaGame";
            params["goods_note"] = "集结号拼三张";
            params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1";//todo
            params["user_identity"] = MultiPlatform.getMachineID() || "usertoken";//todo
            params["pay_type"] = "8";
            params["productid"] = itemVal.id;
            params["os"] = "2";
            params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
            params["channelid"] = GlobalDef.CHANNELID_center;

            if (GlobalUserData.isOpenIAP) {
                params["pay_amt"] = itemVal.iosprice;
                var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
                url += "/HZMobile/PayInit2_0.ashx";
                var paramString = GlobalFun.buildRequestParam(params);
                var xhr = new XMLHttpRequest();
                var self = this;
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                        var response = xhr.responseText;
                        console.log(response);
                        var value = JSON.parse(response);
                        if (value.status == 1) {
                            if (value.errorcode == 10026) {
                                GlobalUserData.isOpenIAP = false;
                                self.refreshUI();
                            }
                        }
                        else {
                            if (value.msg !== undefined) {
                                GlobalFun.showToast(value.msg);
                            }
                        }
                        cc.director.emit("ShopCompleted");
                    }
                };
                GlobalFun.showPopWaiting(cc.director.getScene(), {
                    closeEvent: "ShopCompleted",
                    callBackFunc: function () {
                        console.log("[ShopView][onInCharge] callbackfunc");
                    },
                });
                xhr.open("POST", url, true);
                // xhr.setRequestHeader("Content-Type","application/json");
                xhr.send(paramString);
                // this.onChoosePaytype(params);

            }
            else {
                params["pay_amt"] = itemVal.price;
                this.onChoosePaytype(params);
            }
        }
        // this.onChoosePaytype(params);
    },
    onChoosePaytype: function (params) {
        console.log("[ShopView][onChoosePaytype]")
        cc.loader.loadRes("prefab/ChoosePayTypeView", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            newNode.getComponent("ChoosePayTypeView").init(params);
            cc.director.getScene().getChildByName("Canvas").addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode, function () {
                console.log("[ShopView][onChoosePaytype]ActionShowTanChuang callback");
            })
        });
        this.close();
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
        console.log("[ShopView][onDestroy]");
    },
    onClickCloseButton: function () {
        this.close();
        console.log("[ShopView][onClickCloseButton] destroy");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
