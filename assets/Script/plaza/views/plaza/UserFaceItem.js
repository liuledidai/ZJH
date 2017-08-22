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
        m_Image_userFace: {
            default: null,
            type: cc.Sprite,
        },
        m_Image_select: cc.Sprite,
        userFaceAtals: {
            default:null,
            type: cc.SpriteAtlas,
        },
        _faceID: 0,

    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        var faceID = params.faceID;
        this._faceID = faceID;
        this.m_Image_userFace.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID));
    },
    setSelect: function (bSelect) {
        this.m_Image_select.node.active = bSelect;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
