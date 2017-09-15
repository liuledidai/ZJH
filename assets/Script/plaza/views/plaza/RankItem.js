var GlobalUserData = require("GlobalUserData");
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
        m_Image_rank: cc.Sprite,
        m_Label_rank: cc.Label,

        m_Image_face: cc.Sprite,
        m_Label_name: cc.Label,
        m_Label_gold: cc.Label,

        m_Panel_myself: cc.Node,

        userFaceAtals: {
            default: null,
            type: cc.SpriteAtlas,
        },
        rankAtals: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (params) {
        var idx = params.idx;
        var value = params.value;
        if (idx < 3) {
            this.m_Image_rank.node.active = true;
            this.m_Image_rank.spriteFrame = this.rankAtals.getSpriteFrame("leader_image_No_" + (idx + 1));
        }
        else {
            this.m_Image_rank.node.active = false;
        }
        this.m_Label_rank.string = (idx+1);
        if (value.thirdheadimgurl.length > 0) {
            cc.loader.load({url:value.thirdheadimgurl,type:"png"},(err,tex)=>{
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0,0,tex.width,tex.height));
                this.m_Image_face.spriteFrame = spriteFrame;
            })
        } 
        else {
            var faceID = value.faceid;
            if (faceID <= 0 || faceID > 8) {
                faceID = 1;
            }
            this.m_Image_face.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        }
        if (value.thirdnickname.length > 0) {
            this.m_Label_name.string = value.thirdnickname;
        }
        else {
            this.m_Label_name.string = value.nickname;
        }
        this.m_Label_gold.string = value.score;
        var color = cc.Color.BLACK;
        if (value.userid == GlobalUserData.dwUserID) {
            this.m_Panel_myself.active = true;
            color = cc.hexToColor("#08a613");
        }
        else {
            this.m_Panel_myself.active = false;
            color = cc.hexToColor("#983800");
        }
        this.m_Label_name.node.color = color;
        this.m_Label_gold.node.color = color;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
