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
        cardSprite: cc.Sprite,
        m_cbCardData: 0,
        cardAtlas: cc.SpriteAtlas,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (cbCardData) {
        this.m_cbCardData = cbCardData;
    },
    setCardData: function (cbCardData) {
        console.log("[CardItem][setCardData] cbCardData = " + cbCardData);
        this.m_cbCardData = cbCardData;
    },
    showCardBack: function () {
        console.log("[CardItem][showCardBack]");
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("card_back");
    },
    showCard: function () {
        console.log("[CardItem][showCard] cardData = " + this.m_cbCardData);
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("big_card_" + GlobalFun.PrefixInteger(this.m_cbCardData,2));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
