var GlobalFun = require("GlobalFun");
var ChatDef = require("ChatDef");
var GlobalDef = require("GlobalDef");
var GlobalUserData = require("GlobalUserData");
// var ChatType = cc.Enum({
//     Face: 0,
//     Text: 1,
// })
// var chatTextList = [
//     "快点啊，都等到我花儿都谢了！",
//     "怎么又断线了，网络怎么这么差啊！",
//     "不要走决战到天亮！",
//     "你的牌打得也太好了！",
//     "你是妹妹还是哥哥啊！",
//     "和你合作真是愉快了！",
//     "大家好，很高兴见到各位！",
//     "各位，真是不好意思我得离开一会。",
//     "不要吵了,吵啥嘛吵,专心玩游戏吧！"
// ];
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
        m_emotionList: cc.ScrollView,
        m_quickChatList: cc.ScrollView,
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
        this.initListContent();
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
    initListContent: function () {
        //快捷语列表
        var quickChatList = this.m_quickChatList.content;
        quickChatList.removeAllChildren();
        for (var i = 0; i < ChatDef.quickChatMsg.length; i++) {
            var text = ChatDef.quickChatMsg[i];
            var textNode = cc.instantiate(this.textPrefab);
            textNode.active = true;
            var textLabel = textNode.getChildByName("m_Label_chat").getComponent(cc.Label).string = text;
            quickChatList.addChild(textNode);
            let idx = i;
            textNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.onQuickChat(idx);
            }, this);
        }

        //表情列表
        var emotionList = this.m_emotionList.content;
        emotionList.removeAllChildren();
        for (var i = 0; i < 12; i++) {
            var faceNode = cc.instantiate(this.facePrefab);
            faceNode.active = true;
            var faceSprite = faceNode.getChildByName("m_Image_chatFace").getComponent(cc.Sprite);
            faceSprite.spriteFrame = this.chatAtlas.getSpriteFrame("chat_emoticon_" + GlobalFun.PrefixInteger(i+1,2));
            emotionList.addChild(faceNode);
            let idx = i+1;
            faceNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.onEmotionChat(idx);
            }, this);
        }
    },
    refreshList: function (index) {
        if (this._selectIndex === ChatDef.ChatType.QuickChat) {
            this.m_emotionList.node.active = false;
            this.m_quickChatList.node.active = true;
        }
        else if (this._selectIndex === ChatDef.ChatType.Emotion) {
            this.m_emotionList.node.active = true;
            this.m_quickChatList.node.active = false;
        }
    },
    onEmotionChat: function (idx) {
        cc.director.emit("sendChatMsg",{
            chatType:ChatDef.ChatType.Emotion,
            msg:idx,
        })
    },
    onQuickChat: function (idx) {
        var msg = ChatDef.quickChatMsg[idx];
        if (GlobalUserData.cbGender == GlobalDef.GENDER_GIRL) {
            idx += 9;
        }
        cc.director.emit("sendChatMsg",{
            chatType:ChatDef.ChatType.QuickChat,
            msg:idx,
        })
        // cc.director.emit("sendChatMsg",{
        //     chatType:ChatDef.ChatType.WordChat,
        //     msg:msg,
        // })
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
