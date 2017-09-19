var ChatDef = {
    ChatType : cc.Enum({
        Emotion: 0, //表情
        QuickChat: 1,//常用语
        WordChat: 2,//文字聊天
    }),
    quickChatMsg : [
        "快点啊，都等到我花儿都谢了！",
        "怎么又断线了，网络怎么这么差啊！",
        "不要走决战到天亮！",
        "你的牌打得也太好了！",
        "你是妹妹还是哥哥啊！",
        "和你合作真是愉快了！",
        "大家好，很高兴见到各位！",
        "各位，真是不好意思我得离开一会。",
        "不要吵了,吵啥嘛吵,专心玩游戏吧！"
    ],
}

module.exports = ChatDef;