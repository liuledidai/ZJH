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
        m_Image_select:cc.Node,
        m_Image_present: cc.Sprite,
        presentAtlas: cc.SpriteAtlas,
        m_Label_charm: cc.Label,
        m_Label_price: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        var icon = params.icon;
        var gold = params.gold;
        var charm = params.charm;
        this.m_Image_present.spriteFrame = this.presentAtlas.getSpriteFrame(icon.split('.')[0]);
        this.m_Label_charm.string = "魅力" + charm;
        this.m_Label_price.string = params.display;
    },
    setSelect: function (bSelect) {
        this.m_Image_select.active = bSelect;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
