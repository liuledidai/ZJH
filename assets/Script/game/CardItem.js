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
        m_turnTime: 0,
    },

    // use this for initialization
    onLoad: function () {
        this._skewDegree = 10;
    },
    init: function (cbCardData) {
        this.m_cbCardData = cbCardData;
    },
    setCardData: function (cbCardData) {
        console.log("[CardItem][setCardData] cbCardData = " + cbCardData);
        this.m_cbCardData = cbCardData;
    },
    getCardData: function () {
        return this.m_cbCardData;  
    },
    showCardBack: function (bAnim) {
        console.log("[CardItem][showCardBack]");
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("card_back");
    },
    showCard: function () {
        // this.m_turnTime = 0.5;
        console.log("[CardItem][showCard] cardData = " + this.m_cbCardData);
        this.cardSprite.spriteFrame = this.cardAtlas.getSpriteFrame("big_card_" + GlobalFun.PrefixInteger(this.m_cbCardData,2));
    },
    setTurnCallback: function (callBack) {
        this._callBack = callBack;
    },
    setTurnTime: function (t) {
        this.m_turnTime = t;
    },
    turnCard: function () {
        var self = this;
        this.node.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(this.m_turnTime/2, 0, self.node.scaleY),cc.skewTo(this.m_turnTime/2, 0, -this._skewDegree)),
            cc.callFunc(function () {
                self.showCard();
            }),
            cc.spawn(cc.scaleTo(this.m_turnTime/2, self.node.scaleY, self.node.scaleY),cc.skewTo(this.m_turnTime/2, 0, 0)),
            cc.callFunc(function () {
                if (self._callBack && typeof(self._callBack) === "function") {
                    self._callBack();
                }
            }),
        ));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
