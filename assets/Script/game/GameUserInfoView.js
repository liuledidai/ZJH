var GlobalUserData = require("GlobalUserData");
var GlobalFun = require("GlobalFun");
var GlobalDef = require("GlobalDef");
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
        scroll_offset: 0,
        m_Label_name: cc.Label,
        m_Label_gold: cc.Label,
        m_Label_charm: cc.Label,
        m_Label_ID: cc.Label,
        m_scrollView: cc.ScrollView,
        m_toggle_all: cc.Toggle,
        m_Image_userface: cc.Sprite,
        m_Image_gender: cc.Sprite,
        gameUserAtlas: cc.SpriteAtlas,
        facePrefab: cc.Prefab,
        userFaceAtals: cc.SpriteAtlas,
        m_Editbox_num: cc.EditBox,
        m_Editbox_secret: cc.EditBox,
        _selectIndex: -1,

    },

    // use this for initialization
    onLoad: function () {

    },
    init: function (userItem) {
        if (userItem === undefined) {
            console.log("[GameUserInfoView][init] userItem is undefined");
            return;
        }
        console.log("[GameUserInfoView] " + JSON.stringify(userItem, null, ' '));
        this.userItem = userItem;
        var szNickName = userItem.szName;
        var szGold = userItem.lScore;
        var szCharm = userItem.lLoveliness;
        var dwUserID = userItem.dwUserID;
        var cbGender = userItem.cbGender;
        var faceID = userItem.wFaceID;
        faceID = GlobalUserData.getUserFaceID(faceID, cbGender);
        var szGenderImgName = "gameuser_man";
        if (cbGender == GlobalDef.GENDER_GIRL) {
            szGenderImgName = "gameuser_woman";
        }
        else {
            szGenderImgName = "gameuser_man";
        }
        this.m_Image_gender.spriteFrame = this.gameUserAtlas.getSpriteFrame(szGenderImgName);
        this.m_Label_name.string = szNickName;
        this.m_Label_gold.string = szGold;
        this.m_Label_charm.string = szCharm;
        this.m_Label_ID.string = dwUserID;
        this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        this._presentData = GlobalUserData.presentData;
        this.refreshPresentList();
        if (userItem.cbUserType === GlobalDef.USER_TYPE_WEIXIN) {
            this.m_Label_name.string = userItem.szWeChatNickName || szNickName;
            cc.loader.load({ url: userItem.szWeChatImgURL, type: "png" }, (err, tex) => {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                this.m_Image_userface.spriteFrame = spriteFrame;
            })
        }
        else {
            // this.m_Image_userface.spriteFrame = this.userFaceAtals.getSpriteFrame("userface_" + (faceID - 1));
        }
    },
    refreshPresentList: function () {
        var itemList = this._presentData['present']['base'];
        var contentList = this.m_scrollView.content;
        contentList.removeAllChildren();
        for (var i = 0; i < itemList.length; i++) {
            var element = itemList[i];
            var newNode = cc.instantiate(this.facePrefab);
            newNode.active = true;
            contentList.addChild(newNode);
            newNode.getComponent("PresentNode").init(element);
            let idx = i;
            newNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.onPresentTouch(idx);
            }, this);
        }
    },
    onPresentTouch: function (idx) {
        if (idx == this._selectIndex) return;
        var children = this.m_scrollView.content.children;
        if (this._selectIndex >= 0 && cc.isValid(children[this._selectIndex])) {
            children[this._selectIndex].getComponent("PresentNode").setSelect(false);
        }
        this._selectIndex = idx;
        if (idx >= 0 && cc.isValid(children[idx])) {
            children[idx].getComponent("PresentNode").setSelect(true);
        }
    },
    onArrowLeft: function (params) {
        var offset = new cc.Vec2(this.scroll_offset, 0);
        this.scrollOffsetBy(offset);
    },
    onArrowRight: function (params) {
        var offset = new cc.Vec2(-this.scroll_offset, 0);
        this.scrollOffsetBy(offset);
    },
    scrollOffsetBy: function (offset) {
        var curOffset = this.m_scrollView.getScrollOffset();
        var endOffset = curOffset.add(offset);
        console.log("[curOffset,offset,endOffset] = " + [curOffset, offset, endOffset]);
        this.m_scrollView.scrollToOffset(cc.pSub(cc.Vec2.ZERO, endOffset), 0.2);
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    onClickConfirm: function () {
        if (this._selectIndex < 0) {
            GlobalFun.showToast("请选择您要赠送的礼物");
            return;
        }
        var szNum = this.m_Editbox_num.string;
        if (isNaN(Number(szNum)) || Number(szNum) <= 0 || Number(szNum) > 100) {
            GlobalFun.showToast("赠送的数目必须大于0且小于等于100！");
            return;
        }
        var szPassword = this.m_Editbox_secret.string;
        if (szPassword.length <= 0) {
            GlobalFun.showToast("密码不能为空");
            return;
        }
        var itemList = this._presentData['present']['base'];
        var itemInfo = itemList[this._selectIndex];
        if (!itemInfo) {
            GlobalFun.showToast("礼物出差，重新选择");
            return;
        }
        var goldVal = itemInfo.gold;
        if (goldVal * szNum > GlobalUserData.llInsureScore) {
            GlobalFun.showToast("赠送的礼物价值超过银行存款，请重新选择");
            return;
        }

        var self = this;
        if (cc.isValid(self._confirmView) === false) {
            cc.loader.loadRes("prefab/GamePresentConfirmView", function (err, prefab) {
                if (cc.isValid(self.node)) {
                    self._confirmView = cc.instantiate(prefab);
                    self.node.addChild(self._confirmView);
                    self._confirmView.getComponent("GamePresentConfirmView").init({
                        userItem: self.userItem,
                        itemInfo: itemInfo,
                        sendNum: szNum,
                        callback: () => {
                            cc.director.emit("sendGift", {
                                userItem: self.userItem,
                                cbGiftID: self._selectIndex,
                                count: szNum,
                                szPassword: szPassword,
                            });
                            self.close();
                        }
                    });
                    GlobalFun.ActionShowTanChuang(self._confirmView, function () {
                        console.log("[GameView][onClickSetting]ActionShowTanChuang callback");
                    });
                }
            });
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
