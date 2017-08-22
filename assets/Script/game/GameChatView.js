var GlobalFun = require("GlobalFun");
var ChatType = cc.Enum({
    Face: 0,
    Text: 1,
})
var chatTextList = [
    "快点啊，都等到我花儿都谢了！",
    "怎么又断线了，网络怎么这么差啊！",
    "不要走决战到天亮！",
    "你的牌打得也太好了！",
    "你是妹妹还是哥哥啊！",
    "和你合作真是愉快了！",
    "大家好，很高兴见到各位！",
    "各位，真是不好意思我得离开一会。",
    "不要吵了,吵啥嘛吵,专心玩游戏吧！"
];
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
        m_scrollView: cc.ScrollView,
        textPrefab: cc.Node,
        facePrefab: cc.Node,
        chatAtlas: cc.SpriteAtlas,
        radioButton: {
            default: [],
            type: cc.Toggle
        },
    },

    // use this for initialization
    onLoad: function () {
        this._selectIndex = 0;
        this.refreshList(this._selectIndex);
        var bgNode = this.node.getChildByName("game_chat_bg");
        bgNode.opacity = 0;
        bgNode.runAction(cc.sequence(
            cc.moveBy(0,600,0),
            cc.spawn(
                cc.moveBy(0.3,-600,0),
                cc.fadeIn(0.3),
            ),
        ))
    },
    onDestroy: function () {
        cc.sys.garbageCollect();
    },
    refreshList: function (index) {
        var contentList = this.m_scrollView.content;
        contentList.removeAllChildren();
        if (this._selectIndex === ChatType.Text) {
            for (var i = 0; i < chatTextList.length; i++) {
                var text = chatTextList[i];
                var textNode = cc.instantiate(this.textPrefab);
                textNode.active = true;
                var textLabel = textNode.getChildByName("m_Label_chat").getComponent(cc.Label).string = text;
                contentList.addChild(textNode);
            }
        }
        else if (this._selectIndex === ChatType.Face) {
            for (var i = 0; i < 12; i++) {
                var faceNode = cc.instantiate(this.facePrefab);
                faceNode.active = true;
                var faceSprite = faceNode.getChildByName("m_Image_chatFace").getComponent(cc.Sprite);
                faceSprite.spriteFrame = this.chatAtlas.getSpriteFrame("chat_emoticon_" + GlobalFun.PrefixInteger(i+1,2));
                contentList.addChild(faceNode);
            }
        }
    },
    radioButtonClicked: function (toggle) {
        var index = this.radioButton.indexOf(toggle);
        this._selectIndex = index;
        this.refreshList(this._selectIndex);
    },
    close: function () {
        var self = this;
        var bgNode = this.node.getChildByName("game_chat_bg");
        // bgNode.opacity = 0;
        bgNode.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(0.3,600,0),
                cc.fadeOut(0.3),
            ),
            cc.callFunc(function () {
                self.node.destroy();
            })
        ))
        // this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
