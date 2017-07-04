var GlobalFun = require("GlobalFun");
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
        chipFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        winFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        loseFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        lookFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        peopleAtals: {
            default:null,
            type: cc.SpriteAtlas,
        },
    },

    // use this for initialization
    onLoad: function () {
        var animation = this.node.getComponent(cc.Animation);
        for (var index = 0; index < 16; index++) {
            this.chipFrames[index] = this.peopleAtals.getSpriteFrame("people_chip_" + GlobalFun.PrefixInteger(index+1,2));
        }
        for (var index = 0; index < 18; index++) {
            this.winFrames[index] = this.peopleAtals.getSpriteFrame("people_win_" + GlobalFun.PrefixInteger(index+1,2));
        }
        for (var index = 0; index < 32; index++) {
            this.loseFrames[index] = this.peopleAtals.getSpriteFrame("people_lose_" + GlobalFun.PrefixInteger(index+1,2));
        }
        for (var index = 0; index < 20; index++) {
            this.lookFrames[index] = this.peopleAtals.getSpriteFrame("people_look_" + GlobalFun.PrefixInteger(index+1,2));
        }
        var chip_clip = cc.AnimationClip.createWithSpriteFrames(this.chipFrames,this.chipFrames.length);
        chip_clip.name = "chip";
        chip_clip.events.push({
            frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim",     // 回调函数名称
            params: ["win"]    // 回调参数
        });
        chip_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(chip_clip);
        // animation.play('chip');

        var win_clip = cc.AnimationClip.createWithSpriteFrames(this.winFrames,this.winFrames.length);
        win_clip.name = "win";
        win_clip.events.push({
            frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim",     // 回调函数名称
            params: ["lose"]    // 回调参数
        });
        win_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(win_clip);

        var lose_clip = cc.AnimationClip.createWithSpriteFrames(this.loseFrames,this.loseFrames.length);
        lose_clip.name = "lose";
        lose_clip.events.push({
            frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim",     // 回调函数名称
            params: ["look"]    // 回调参数
        });
        lose_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(lose_clip);

        var look_clip = cc.AnimationClip.createWithSpriteFrames(this.lookFrames,this.lookFrames.length);
        look_clip.name = "look";
        look_clip.events.push({
            frame: this.lookFrames.length/60,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
            func: "playanim",     // 回调函数名称
            params: ["chip"]    // 回调参数
        });
        look_clip.wrapMode = cc.WrapMode.Loop;
        animation.addClip(look_clip);

        animation.play("look");
    },
    playanim: function (params) {
        // console.log("[UserInfaceItem][playanim] " + params);
        var animation = this.node.getComponent(cc.Animation);
        animation.play(params);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
