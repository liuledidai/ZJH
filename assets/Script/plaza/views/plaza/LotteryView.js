var ViewBase = require("ViewBase");
var GlobalFun = require("GlobalFun");
var AudioMng = require("AudioMng");
cc.Class({
    extends: ViewBase,

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
        m_arrow: cc.Node,
        m_arrow_back: cc.Node,
        arrow_times: 3,
        arrow_rounds: 4,
    },

    // use this for initialization
    onLoad: function () {

    },
    onDestroy: function () {
        this._super();
    },
    onDisable: function () {
        
    },
    onEnable: function () {
        
    },
    close: function () {
        this.node.removeFromParent();
        this.node.destroy();
    },
    init: function (params) {
        this.szNum = params.num;
        this.scheduleOnce(()=>{
            this.onClickStart();
        },0.4);
    },
    onClickStart: function () {
        //在俩个金币奖项离随机一个
        var rand = GlobalFun.getRandomInt(0,1);
        var randArray = [1,5];
        var idx = randArray[rand];//GlobalFun.getRandomInt(0,7);

        var orgAng = 90;
        var distAng = idx * 45 -orgAng;
        this.m_arrow.rotation %= 360;
        this.arrow_rounds = GlobalFun.getRandomInt(6,9);
        var ang = (360 - this.m_arrow.rotation) + this.arrow_rounds * 360 + distAng;
        var rotate = cc.rotateBy(this.arrow_times,ang);
        this.node.stopAllActions();
        AudioMng.playSFX("sfx_returnning");
        this.m_arrow.runAction(cc.sequence(
            rotate.easing(cc.easeCubicActionOut(this.arrow_times)),
            cc.callFunc(() => {
                this.m_arrow_back.runAction(cc.sequence(
                    cc.fadeOut(2.2),
                    cc.delayTime(1.0),
                    cc.callFunc(() => {
                        GlobalFun.showAwardView({
                            num: this.szNum,
                            callback: () => {
                                this.close();
                            }
                        })
                    })
                ))

            }),
        ));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
