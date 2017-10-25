var GlobalFun = require("GlobalFun");
var SceneBase = cc.Class({
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
    },

    // use this for initialization
    onLoad: function () {
        
    },
    onEnable: function () {
        // add key down and key up event
        console.log("[SceneBase] onEnable");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onDisable: function () {
        console.log("[SceneBase] onDisable");
        this.node.destroy();
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    onDestroy: function () {
        // cc.loader.releaseAll();
        console.log("[SceneBase] onDestroy garbageCollect");
        cc.sys.garbageCollect();
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.back:
                // console.log('Press a key');
                GlobalFun.showAlert({
                    message:"确定要退出游戏吗?",
                    btn:[
                        {
                            name:"取消",
                        },
                        {
                            name:"确定",
                            callback:()=>{
                                cc.game.end();
                            }
                        }
                    ],
                    tag:"GameExit",
                })
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
                console.log('release a key');
                break;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = SceneBase;