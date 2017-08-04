cc.Class({
    extends: cc.ScrollView,

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
    },

    // use this for initialization
    onLoad: function () {
        // this._scrollView = this.node.getComponent("cc.ScrollView");
        this._sPosition = cc.Vec2.ZERO;
        var scContentSize = this.node.getContentSize();
        var content = this.content.getComponent(cc.Layout);
        content.paddingLeft = scContentSize.width / 2;
        content.paddingRight = scContentSize.width / 2;
        var childItem = this.content.children[0];
        // this.init({
        //     paddingLeft:childItem.getContentSize().width/2,
        //     paddingRight:childItem.getContentSize().width/2,
        // })
        this.bInit = false;
    },
    init: function (params) {
        if (this.bInit) {
            return;
        }
        this.bInit = true;
        var scContentSize = this.node.getContentSize();
        var paddingLeft = params.paddingLeft || scContentSize.width / 2;
        var paddingRight = params.paddingRight || scContentSize.width / 2;
        this.content.getComponent(cc.Layout).paddingLeft = paddingLeft;
        this.content.getComponent(cc.Layout).paddingRight = paddingRight;
        this._endCallBack = params.endCallBack;
        console.log("[CoverView][init] [paddingLeft,paddingRight] = " + [paddingLeft, paddingRight]);
    },
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on("scrolling", this.onScrolling, this.node);
        this.node.on("bounce-left", this.onBounceLeft, this.node);
        this.node.on("bounce-right", this.onBounceRight, this.node);
        this.node.on("scroll-ended", this.onScrollEnded, this.node);
    },
    onDisable: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off("scrolling", this.onScrolling, this.node);
        this.node.off("bounce-left", this.onBounceLeft, this.node);
        this.node.off("bounce-right", this.onBounceRight, this.node);
        this.node.off("scroll-ended", this.onScrollEnded, this.node);
    },
    onScrolling: function (params) {
        console.log(params);
    },
    onScrollEnded: function (params) {
        // console.log(params);
        this.getComponent("CoverView").stopAutoScroll();
        this.getComponent("CoverView").adjustEndScrollView();
    },
    onBounceLeft: function (params) {
        // console.log(params);
    },
    onBounceRight: function (params) {
        // console.log(params);
    },
    onTouchStart: function (param) {
        // console.log(param);
    },
    onTouchMove: function (param) {
        var prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var movePoint = new cc.Vec2(param.touch.getLocation());
        var adjustPoint = movePoint.sub(prevPoint);
        // console.log("onTouchMove = " + [prevPoint,movePoint,adjustPoint]);
        this.getComponent("CoverView").adjustScrollView(adjustPoint);
        this.getComponent("CoverView").adjustItemScale(adjustPoint);
    },
    onTouchEnd: function (param) {
        // console.log(param);
        console.log("[CoverView][onTouchEnd]" + cc.ScrollView.EventType.BOUNCE_LEFT);
        var touch_prevPoint = new cc.Vec2(param.touch.getPreviousLocation());
        var touch_endPoint = new cc.Vec2(param.touch.getLocation());
        touch_endPoint.y = 0;
        // touch_endPoint = this.convertToWorldSpace(touch_endPoint);

        // touch_endPoint = this.getComponent("CoverView").content.convertToNodeSpaceAR(touch_endPoint);
        // var disx = touch_prevPoint.x - touch_endPoint.x;
        this.getComponent("CoverView").adjustEndScrollView();
        var curPos = this.getComponent("CoverView").getContentPosition();
        var sPos = this.getComponent("CoverView")._sPosition;
        var distance = cc.pDistance(curPos, sPos);
        var bMove = true;
        if (distance < 5.0) bMove = false;
        if (!bMove) {
            var curIndex = this.getComponent("CoverView").getCurIndex();
            var endPoint = touch_endPoint.sub(curPos);
            var children = this.getComponent("CoverView").content.children;
            for (var index = 0; index < children.length; index++) {
                var element = children[index];
                var rect = element.getBoundingBox();
                // console.log("[CoverView][onTouchEnd] rect " + rect + "endpoint " + endPoint);
                if (rect.contains(endPoint)) {
                    // console.log("[CoverView][onTouchEnd] " + endPoint);
                    if (curIndex !== index) {
                        this.getComponent("CoverView").scrollToIndex(index);
                    }
                    return;
                }
            }
        }

    },
    onTouchCancel: function (param) {
        // console.log(param);
    },
    adjustScrollView: function (adjustPoint) {
        var scroll_contentPositon = this.getContentPosition();
        var addPoint = new cc.Vec2(adjustPoint.x, 0);
        scroll_contentPositon = scroll_contentPositon.add(addPoint);
        this.setContentPosition(scroll_contentPositon);
    },
    adjustItemScale: function (adjustPoint) {
        var children = this.content.children;
        var scContentSize = this.node.getContentSize();
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = Math.abs(scContentSize.width / 2 - posX);
            var scale = 1 - disMid / dist * 0.25;
            element.setScale(scale);
        }
    },
    adjustEndScrollView: function (params) {
        console.log("[CoverView][adjustEndScrollView]");
        this._sPosition = this.getContentPosition();

        var midX = this.node.getContentSize().width / 2;
        var children = this.content.children;
        var minX = midX - children[0].getPositionX() - this.getContentPosition().x;//this.node.getContentSize().width;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = midX - posX;
            if (Math.abs(disMid) < Math.abs(minX)) {
                minX = disMid;
            }
        }
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var offset = this.getContentPosition().x;
            var posX = element.getPositionX() + offset;
            var disMid = Math.abs(midX - posX - minX);
            var scale = 1 - disMid / dist * 0.25;
            element.runAction(cc.scaleTo(0.2, scale));
        }
        this.stopAutoScroll();
        this.content.stopAllActions();
        this.content.runAction(cc.sequence(
            cc.moveBy(0.2, minX, 0),
            cc.callFunc(() => {
                // console.log("[CoverView][adjustEndScrollView] curIndex = " + this.getCurIndex());
                if (typeof (this._endCallBack) === "function") {
                    this._endCallBack();
                }
            })
        ));
    },
    scrollToIndex: function (index) {
        var children = this.content.children;
        // console.log("[CoverView][scrollToIndex] " + index);
        if (index >= children.length || index < 0) {
            return;
        }
        var curIndex = this.getCurIndex();
        var curObj = children[curIndex];
        var scrollObj = children[index];
        var sc_prePoint = curObj.getPosition();
        var sc_movePoint = scrollObj.getPosition();
        var adjustPoint = sc_prePoint.sub(sc_movePoint);

        var scroll_contentPositon = this.getContentPosition();
        var addPoint = new cc.Vec2(adjustPoint.x, 0);
        scroll_contentPositon = scroll_contentPositon.add(addPoint);
        this.scrollToOffset(cc.Vec2.ZERO.sub(scroll_contentPositon), 0.15);
        // console.log("[CoverView][scrollToIndex] " + scroll_contentPositon + " offset " + this.getScrollOffset());
        // this.adjustItemScale();
        // this.adjustEndScrollView();
        this.node.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(() => {
                this.adjustItemScale(adjustPoint);
                this.adjustEndScrollView();
            })
        ))

    },
    getCurIndex: function () {
        var children = this.content.children;
        var dist = children[1].getPosition().x - children[0].getPosition().x;
        var dis1 = - this.getContentPosition().x;
        var dis2 = 0;
        var index = Math.floor((dis1 + dis2 + 5) / (dist));
        if (index < 0) {
            index = 0;
        }
        else if (index >= children.length) {
            index = children.length - 1;
        }
        // console.log("getCurIndex [dist,dis1,dis2] = " + [dist,dis1,dis2]);
        return index;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
