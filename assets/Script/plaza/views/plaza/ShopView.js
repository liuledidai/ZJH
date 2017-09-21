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
        this.refreshUI();
        console.log("[ShopView][onLoad] " + JSON.stringify(GlobalUserData.shopData));
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
                        GlobalFun.showToast("苹果内支付");
                    }
                    else {
                        var productid = value.id;
                        var rechargeUrl = GlobalUserData.getUserServer(GlobalDef.RECHARGE);
                        var extraUrl = "?id=" + productid + "&appurl=zhajapay://game";
                        var reqUrl = rechargeUrl + extraUrl;
                        cc.sys.openURL(reqUrl);
                    }
                }
                GlobalFun.showAlert({message:value.msg});
            }
        })

        // if (cc.sys.os == cc.sys.OS_ANDROID) {
        //     params["userid"] = GlobalUserData.dwUserID;
        //     params["goods_name"] = itemVal.name;
        //     params["goods_num"] = "1";
        //     params["remark"] = "zhajinhuaGame";
        //     params["goods_note"] = "集结号拼三张";
        //     params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1";//todo
        //     params["user_identity"] = MultiPlatform.getMachineID() || "usertoken";//todo
        //     params["productid"] = itemVal.id;
        //     params["os"] = "1";
        //     params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
        //     params["channelid"] = GlobalDef.CHANNELID_center;
        //     params["pay_amt"] = itemVal.price;

        //     var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        //     url += "/HZMobile/PayInit2_0.ashx";
        //     params["url"] = url;

        //     this.onChoosePaytype(params);
        // }
        // else if (cc.sys.os == cc.sys.OS_IOS) {
        //     params["userid"] = GlobalUserData.dwUserID;
        //     params["goods_name"] = itemVal.name;
        //     params["goods_num"] = "1";
        //     params["remark"] = "zhajinhuaGame";
        //     params["goods_note"] = "集结号拼三张";
        //     params["user_ip"] = MultiPlatform.getIpAddress() || "127.0.0.1";//todo
        //     params["user_identity"] = MultiPlatform.getMachineID() || "usertoken";//todo
        //     params["pay_type"] = "8";
        //     params["productid"] = itemVal.id;
        //     params["os"] = "2";
        //     params["versionnum"] = MultiPlatform.getAppVersion() || "1.1";
        //     params["channelid"] = GlobalDef.CHANNELID_center;

        //     if (GlobalUserData.isOpenIAP) {
        //         params["pay_amt"] = itemVal.iosprice;
        //         var url = GlobalUserData.getUserServer(GlobalDef.INTERFACE);//GlobalDef.httpBaseUrl;
        //         url += "/HZMobile/PayInit2_0.ashx";
        //         var paramString = GlobalFun.buildRequestParam(params);
        //         var xhr = new XMLHttpRequest();
        //         var self = this;
        //         xhr.onreadystatechange = function () {
        //             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        //                 var response = xhr.responseText;
        //                 console.log(response);
        //                 var value = JSON.parse(response);
        //                 if (value.status == 1) {
        //                     if (value.errorcode == 10026) {
        //                         GlobalUserData.isOpenIAP = false;
        //                         self.refreshUI();
        //                     }
        //                 }
        //                 else {
        //                     if (value.msg !== undefined) {
        //                         GlobalFun.showToast(value.msg);
        //                     }
        //                 }
        //                 cc.director.emit("ShopCompleted");
        //             }
        //         };
        //         GlobalFun.showPopWaiting(cc.director.getScene(), {
        //             closeEvent: "ShopCompleted",
        //             callBackFunc: function () {
        //                 console.log("[ShopView][onInCharge] callbackfunc");
        //             },
        //         });
        //         xhr.open("POST", url, true);
        //         // xhr.setRequestHeader("Content-Type","application/json");
        //         xhr.send(paramString);
        //         // this.onChoosePaytype(params);

        //     }
        //     else {
        //         params["pay_amt"] = itemVal.price;
        //         this.onChoosePaytype(params);
        //     }
        // }
        // // this.onChoosePaytype(params);
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
