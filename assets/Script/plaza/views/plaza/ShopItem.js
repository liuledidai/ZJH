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
        m_Image_shopItem: {
            default: null,
            type: cc.Sprite,
        },
        shopItemAtals: {
            default: null,
            type: cc.SpriteAtlas,
        },
        m_Label_des: cc.Label,
        m_Label_price: cc.Label,
        _shopID: 0,
        _goodsID: 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        var shopID = params.shopID;
        this._shopID = shopID;
        this._goodsID = shopID % 6;
        var shopDataArray = GlobalUserData.shopData.shop.base;
        if (this._goodsID < 0 || this._goodsID >= shopDataArray.length) {
            console.log("[ShopItem][init] shopDataArray length = " + shopDataArray.length);
            return;
        }
        var itemVal = shopDataArray[this._goodsID];
        var des = itemVal.name || "";
        var price = 0;
        if (GlobalUserData.isOpenIAP) {
            price = itemVal.iosprice;
        }
        else {
            price = itemVal.price;
        }
        this.m_Label_des.string = des;
        this.m_Label_price.string = price;
        this.m_Image_shopItem.spriteFrame = this.shopItemAtals.getSpriteFrame("shop_icon_" + (shopID));
    },
    onClick: function (params) {
        // console.log("[ShopItem][onClick] shopID = " + this._shopID);
        // if (GlobalUserData.isGuest) {
        //     GlobalFun.showAlert({
        //         message: "<color=#000000>为了您的账号安全,充值前请绑定手机号!<br/> (绑定就送<color=#FF0000>2000</c>金币,账号和手机号均限领一次)</c>",
        //         btn: [
        //             {
        //                 name: "去绑定",
        //                 callback: function () {
        //                     GlobalFun.showBindView();
        //                 }
        //             },
        //             {
        //                 name: "继续",
        //                 callback: () => {
        //                     cc.director.emit('onInCharge', { goodsID: this._goodsID });
        //                 }
        //             }
        //         ],
        //     })
        // }
        // else {
        //     cc.director.emit('onInCharge', { goodsID: this._goodsID });
        // }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
