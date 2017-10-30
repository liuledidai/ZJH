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
        chipSprite: cc.Sprite,
        chipLabel: cc.Label,
        chipnum: 0,
        chipAtlas: cc.SpriteAtlas,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (chipnum,chipLevel) {
        /*
        // 1: 1,2
        // 2: 3,4
        // 3: 6,10
        // 4: 12
        // 5: 20
        */
        // chipnum = chipnum * 1000;
        var chipColorLevel = [1,3,6,12,24];
        this.chipnum = chipnum;
        this.chipLevel = chipLevel || 1;
        this.chipLabel.string = GlobalFun.numberFormat(chipnum);
        for (var i = chipColorLevel.length - 1; i >= 0; i--) {
            var level = chipColorLevel[i];
            if ( this.chipLevel >= level ) {
                this.chipSprite.spriteFrame = this.chipAtlas.getSpriteFrame("game_bigchip_" + (i + 1));
                break;
            } 
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
