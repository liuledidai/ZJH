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
    init: function (chipnum) {
        var chipColorLevel = [1,1000,10000,100000,1000000];
        this.chipnum = chipnum;
        this.chipLabel.string = chipnum;
        for (var i = chipColorLevel.length - 1; i >= 0; i--) {
            var chipLevel = chipColorLevel[i];
            if ( this.chipnum >= chipLevel ) {
                this.chipSprite.spriteFrame = this.chipAtlas.getSpriteFrame("bigchip_" + (i + 1));
                break;
            } 
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
