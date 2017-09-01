var GlobalFun = require("GlobalFun");
var people =
    {
        "base": [
            [
                {
                    "wait1": {
                        "image": "res/people/people_1_1",
                        "frame": 17
                    },
                    "wait2": {
                        "image": "res/people/people_1_5",
                        "frame": 16
                    },
                    "wait3": {
                        "image": "res/people/people_1_6",
                        "frame": 31
                    },
                    "chip": {
                        "image": "res/people/people_1_2",
                        "frame": 24
                    },
                    "lose": {
                        "image": "res/people/people_1_3",
                        "frame": 20
                    },
                    "win": {
                        "image": "res/people/people_1_4",
                        "frame": 15
                    },
                    "collect": {
                        "image": "res/people/people_1_7",
                        "frame": 21
                    }
                },
                {
                    "wait1": {
                        "image": "res/people/people_2_1",
                        "frame": 17
                    },
                    "wait2": {
                        "image": "res/people/people_2_5",
                        "frame": 20
                    },
                    "wait3": {
                        "image": "res/people/people_2_6",
                        "frame": 30
                    },
                    "chip": {
                        "image": "res/people/people_2_2",
                        "frame": 24
                    },
                    "lose": {
                        "image": "res/people/people_2_3",
                        "frame": 24
                    },
                    "win": {
                        "image": "res/people/people_2_4",
                        "frame": 28
                    },
                    "collect": {
                        "image": "res/people/people_2_7",
                        "frame": 23
                    }
                }
            ],
            [
                {
                    "wait1": {
                        "image": "res/people/people_3_1",
                        "frame": 17
                    },
                    "wait2": {
                        "image": "res/people/people_3_5",
                        "frame": 45
                    },
                    "wait3": {
                        "image": "res/people/people_3_6",
                        "frame": 33
                    },
                    "chip": {
                        "image": "res/people/people_3_2",
                        "frame": 21
                    },
                    "lose": {
                        "image": "res/people/people_3_3",
                        "frame": 37
                    },
                    "win": {
                        "image": "res/people/people_3_4",
                        "frame": 28
                    },
                    "collect": {
                        "image": "res/people/people_3_7",
                        "frame": 26
                    }
                },
                {
                    "wait1": {
                        "image": "res/people/people_4_1",
                        "frame": 17
                    },
                    "wait2": {
                        "image": "res/people/people_4_5",
                        "frame": 15
                    },
                    "wait3": {
                        "image": "res/people/people_4_6",
                        "frame": 30
                    },
                    "chip": {
                        "image": "res/people/people_4_2",
                        "frame": 22
                    },
                    "lose": {
                        "image": "res/people/people_4_3",
                        "frame": 33
                    },
                    "win": {
                        "image": "res/people/people_4_4",
                        "frame": 19
                    },
                    "collect": {
                        "image": "res/people/people_4_7",
                        "frame": 19
                    }
                }
            ]
        ]
    };
cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.Sprite,
        requireComponent: cc.Animation,
    },
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
        // this.playerAnimate("win",0);
    },
    playerAnimate: function (szAnim, viewID, userItem) {
        console.log("play_______",szAnim);
        var animation = this.node.getComponent(cc.Animation);
        var gender = 0;
        this.m_userItem = userItem || this.m_userItem;
        if (this.m_userItem && this.m_userItem.cbGender) {
            gender = this.m_userItem.cbGender - 1;
        }
        var index = viewID % 2;
        if (szAnim == "wait") {
            szAnim = szAnim + GlobalFun.getRandomInt(1, 3);
        }
        var animName = "";
        if (gender == 0) {
            animName = "male_" + index + "_" + szAnim;
        }
        else {
            animName = "female_" + index + "_" + szAnim;
        }
        var pVal = people["base"][gender][index][szAnim];
        if (pVal == null) {
            console.log("people is null",gender,index,szAnim);
            return;
        }
        var urls = [];
        for (var i = 0; i < pVal.frame; i++) {
            var str = pVal.image + "_" + GlobalFun.PrefixInteger(i + 1, 2);
            urls.push(str);
        }
        if (animation.getAnimationState(animName)) {
            animation.play(animName);
            console.log("anim is exist",animName);
        }
        else {
            this.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                var spriteFrames = assets;
                var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, spriteFrames.length);
                clip.name = animName;
                clip.wrapMode = cc.WrapMode.Default;
                console.log(animation.addClip(clip));
                animation.play(animName);
                // clip.events.push({
                //     frame: 1,               // 准确的时间，以秒为单位。这里表示将在动画播放到 1s 时触发事件
                //     func: "playanim",     // 回调函数名称
                //     params: ["win"]    // 回调参数
                // });
            })
        }
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(GlobalFun.getRandomInt(5, 10)),
            cc.callFunc(()=>{
                this.playerAnimate("wait",viewID,userItem);
            }),
        ));
    },
    loadResArray: function (urls, type, completeCallback) {
        if (!completeCallback && type && !cc.isChildClassOf(type, cc.RawAsset)) {
            completeCallback = type;
            type = null;
        }
        var self = this;
        var uuids = [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var uuid = cc.loader._getResUuid(url, type);
            if (uuid) {
                uuids.push(uuid);
            }
        }
        var remain = uuids.length;
        if (remain > 0) {
            var res = [];
            for (var i = 0, len = remain; i < len; ++i) {
                var uuid = uuids[i];
                res.push({
                    type: 'uuid',
                    uuid: uuid
                });
            }
            cc.loader.load(res, function (errors, items) {
                var results = [];
                for (var i = 0; i < res.length; ++i) {
                    var uuid = res[i].uuid;
                    var id = this._getReferenceKey(uuid);
                    var item = items.getContent(id);
                    if (item) {
                        // should not release these assets, even if they are static referenced in the scene.
                        this.setAutoReleaseRecursively(uuid, false);
                        results.push(item);
                    }
                }
                if (completeCallback) {
                    completeCallback(errors, results);
                }
            });
        }
        else {
            this.scheduleOnce(function () {
                if (completeCallback) {
                    completeCallback(null, []);
                }
            });
        }
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
