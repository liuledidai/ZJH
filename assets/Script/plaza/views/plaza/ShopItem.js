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
            default:null,
            type: cc.SpriteAtlas,
        },
        _shopID: 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        var shopID = params.shopID;
        this._shopID = shopID;
        this.m_Image_shopItem.spriteFrame = this.shopItemAtals.getSpriteFrame("shop_icon_" + (shopID));
    },
    onClick: function (params) {
        console.log("[ShopItem][onClick] shopID = "+this._shopID);
        // cc.director.emit('onChangeUserFace',{faceID:this._faceID+1});
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
