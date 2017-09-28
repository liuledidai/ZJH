var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
var MultiPlatform = require("MultiPlatform");
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
         //初始化IAP
        this.sdkboxInit();
        this.refreshUI();
        console.log("[ShopView][onLoad] " + JSON.stringify(GlobalUserData.shopData));
    },
    sdkboxInit: function (params) {
        if (cc.sys.os !== cc.sys.OS_IOS) return;
        sdkbox.IAP.setListener({
            onSuccess : (product) => {
                //Purchase success
                console.log("sdkbox.IAP.onSuccess",JSON.stringify(product));
                this.verifyReceipt(product.receiptCipheredPayload);
            },
            onFailure : function (product, msg) {
                //Purchase failed
                //msg is the error message
                console.log("sdkbox.IAP.onFailure")
                GlobalFun.showToast(msg);
            },
            onCanceled : function (product) {
                //Purchase was canceled by user
                console.log("sdkbox.IAP.onCanceled")
            },
            onRestored : function (product) {
                //Purchase restored
                console.log("sdkbox.IAP.onRestored")
            },
            onProductRequestSuccess : function (products) {
                //Returns you the data for all the iap products
                //You can get each item using following method
                console.log("sdkbox.IAP.onProductRequestSuccess")
                for (var i = 0; i < products.length; i++) {
                    // loop
                    console.log(JSON.stringify(products[i]));
                }
                cc.director.emit("iapInitCompleted");
                GlobalUserData.isIapInit = true;
            },
            onProductRequestFailure : function (msg) {
                console.log("sdkbox.IAP.onProductRequestFailure")
                GlobalFun.showToast("获取产品信息失败，请退出重试");
                //When product refresh request fails.
            }
        });

        if (GlobalUserData.isIapInit) {
            sdkbox.IAP.refresh();
            return;
        }
        //初始化IAP
        GlobalFun.showPopWaiting(cc.director.getScene(),{
            closeEvent: "iapInitCompleted",
            callBackFunc: function () {
                console.log("[ShopView][sdkboxInit] callbackfunc");
            },
            waitingTime:8,
        });
        // var json = { 
        //     "ios": {
        //         "iap": {
        //             "items": {
        //                 "com.jjhgame.zhajinhua.tier9": {
        //                     "id": "com.jjhgame.zhajinhua.tier9"
        //                 },
        //                 "com.jjhgame.zhajinhua.tier13": {
        //                     "id": "com.jjhgame.zhajinhua.tier13"
        //                 }
        //             }
        //         }
        //     }
        // };
        var jsConfig = {
            "ios": {
                "iap": {
                    "items": {}
                }
            }
        }
        var shopDataArray = GlobalUserData.shopData.shop.base;
        for (var i = 0; i < shopDataArray.length; i++) {
            var name = shopDataArray[i]["id"];
            jsConfig.ios.iap.items[name] = {};
            jsConfig.ios.iap.items[name]["id"] = name;
        }
        sdkbox.IAP.init(JSON.stringify(jsConfig));
    },
    refreshUI: function (params) {
        if (!GlobalUserData.shopData) return;
        var shopDataArray = GlobalUserData.shopData.shop.base
        this.shopItemList.content.removeAllChildren();
        for (var index = 0; index < shopDataArray.length; index++) {
            var item = cc.instantiate(this.shopItemPrefab);
            let goodsID = index;
            item.on(cc.Node.EventType.TOUCH_END, () => {
                this.onShopItemClick(goodsID);
            }, item);
            item.getComponent("ShopItem").init({ val: shopDataArray[index] });
            this.shopItemList.content.addChild(item);
        }
    },
    _pausedCallback: function (params) {
        console.log("zhajinhua _pausedCallback");
    },
    _restoreCallback: function (params) {
        console.log("zhajinhua _restoreCallback");  
    },
    onEnable: function () {
        // cc.director.on('onInCharge',this.onInCharge,this);
        cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
        console.log("[ShopView][onEnable]");
    },
    onDisable: function () {
        // cc.director.off('onInCharge',this.onInCharge,this);
        cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
        console.log("[ShopView][onDisable]");
    },
    onShopItemClick: function (goodsID) {
        console.log("[ShopView][onShopItemClick] goodsID = ", goodsID);
        if (GlobalUserData.cbUserType === GlobalDef.USER_TYPE_GUEST) {
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
    onPayResult: function (params) {
        
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
        params["userid"] = GlobalUserData.dwUserID;
        params["kindid"] = zjh_cmd.KIND_ID;
        params["goods_name"] = itemVal.name;
        params["user_identity"] = MultiPlatform.getMachineID() || "";
        params["productid"] = itemVal.id;
        params["versionnum"] = MultiPlatform.getAppVersion() || "1.0";
        params["channelid"] = GlobalDef.CHANNELID_center;
        params["pay_amt"] = itemVal.price;
        if (cc.sys.os == cc.sys.OS_IOS) {
            params["os"] = "2";
            params["pay_type"] = "8";
        }
        else {
            params["os"] = "1";
        }

        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);
        url += "/HZMobile/NewPayInit1_0.ashx";
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString:paramString,
            callback:(value)=>{
                if (value.status == 1) {
                    if (value.returnpaytype == "8") {
                        sdkbox.IAP.purchase(value.productid);
                    }
                    else {
                        var productid = value.id;
                        var rechargeUrl = GlobalUserData.getUserServer(GlobalDef.RECHARGE);
                        var extraUrl = "?id=" + productid + "&appurl=zhajapay://game";
                        var reqUrl = rechargeUrl + extraUrl;
                        cc.sys.openURL(reqUrl);
                    }
                }
                else {
                    GlobalFun.showAlert({message:value.msg});
                }
                
            }
        })
    },
    verifyReceipt: function (receipt) {
        // var receipt = receipt;
        var params = {};
        params["userid"] = GlobalUserData.dwUserID;
        params["receipt"] = receipt;
        params["kindid"] = zjh_cmd.KIND_ID;
        params["user_identity"] = MultiPlatform.getMachineID() || "";
        params["channelid"] = GlobalDef.CHANNELID_center;

        var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);
        url += "/HZMobile/IOSVerify3_0.ashx";
        var paramString = GlobalFun.buildRequestParam(params);
        GlobalFun.sendRequest({
            url:url,
            paramString:paramString,
            callback:(value)=>{
                if (value.status) {
                    if (value.productidlist !== undefined) {

                    }
                    if (value.score !== undefined) {
                        GlobalUserData.llGameScore = Number(value.score);
                    }
                    if (value.insurescore !== undefined) {
                        GlobalUserData.llInsureScore = Number(value.insurescore);
                    }
                    cc.director.emit("PlazaRefreshUI");
                }
                GlobalFun.showAlert({
                    message: value.msg,
                })
            },
        })
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
