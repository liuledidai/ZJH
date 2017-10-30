var GlobalFun = require("GlobalFun");
var peopleCfg =
    {
        "base": [
            [
                {
                    "idle": {
                        "image": "res/people/boy0_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/boy0_chip",
                        "frame": 14
                    },
                    "lose": {
                        "image": "res/people/boy0_lose",
                        "frame": 13
                    },
                    "win": {
                        "image": "res/people/boy0_win",
                        "frame": 10
                    },
                    "look": {
                        "image": "res/people/boy0_look",
                        "frame": 19
                    }
                },
                {
                    "idle": {
                        "image": "res/people/boy1_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/boy1_chip",
                        "frame": 14
                    },
                    "lose": {
                        "image": "res/people/boy1_lose",
                        "frame": 13
                    },
                    "win": {
                        "image": "res/people/boy1_win",
                        "frame": 10
                    },
                    "look": {
                        "image": "res/people/boy1_look",
                        "frame": 19
                    }
                },
                {
                    "idle": {
                        "image": "res/people/boy2_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/boy2_chip",
                        "frame": 12
                    },
                    "lose": {
                        "image": "res/people/boy2_lose",
                        "frame": 10
                    },
                    "win": {
                        "image": "res/people/boy2_win",
                        "frame": 15
                    },
                    "look": {
                        "image": "res/people/boy2_look",
                        "frame": 15
                    }
                },
                {
                    "idle": {
                        "image": "res/people/boy1_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/boy1_chip",
                        "frame": 14
                    },
                    "lose": {
                        "image": "res/people/boy1_lose",
                        "frame": 13
                    },
                    "win": {
                        "image": "res/people/boy1_win",
                        "frame": 10
                    },
                    "look": {
                        "image": "res/people/boy1_look",
                        "frame": 19
                    }
                }
            ],
            [
                {
                    "idle": {
                        "image": "res/people/girl0_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/girl0_chip",
                        "frame": 11
                    },
                    "lose": {
                        "image": "res/people/girl0_lose",
                        "frame": 17
                    },
                    "win": {
                        "image": "res/people/girl0_win",
                        "frame": 11
                    },
                    "look": {
                        "image": "res/people/girl0_look",
                        "frame": 17
                    }
                },
                {
                    "idle": {
                        "image": "res/people/girl1_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/girl1_chip",
                        "frame": 11
                    },
                    "lose": {
                        "image": "res/people/girl1_lose",
                        "frame": 17
                    },
                    "win": {
                        "image": "res/people/girl1_win",
                        "frame": 11
                    },
                    "look": {
                        "image": "res/people/girl1_look",
                        "frame": 17
                    }
                },
                {
                    "idle": {
                        "image": "res/people/girl2_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/girl2_chip",
                        "frame": 11
                    },
                    "lose": {
                        "image": "res/people/girl2_lose",
                        "frame": 17
                    },
                    "win": {
                        "image": "res/people/girl2_win",
                        "frame": 11
                    },
                    "look": {
                        "image": "res/people/girl2_look",
                        "frame": 17
                    }
                },
                {
                    "idle": {
                        "image": "res/people/girl1_idle",
                        "frame": 9
                    },
                    "chip": {
                        "image": "res/people/girl1_chip",
                        "frame": 11
                    },
                    "lose": {
                        "image": "res/people/girl1_lose",
                        "frame": 17
                    },
                    "win": {
                        "image": "res/people/girl1_win",
                        "frame": 11
                    },
                    "look": {
                        "image": "res/people/girl1_look",
                        "frame": 17
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
        var index = viewID;
        // if (szAnim == "wait") {
        //     szAnim = szAnim + GlobalFun.getRandomInt(1, 3);
        // }
        var animName = "";
        if (gender == 0) {
            animName = "male_" + index + "_" + szAnim;
        }
        else {
            animName = "female_" + index + "_" + szAnim;
        }
        var pVal = peopleCfg["base"][gender][index][szAnim];
        if (pVal == null) {
            console.log("people is null",gender,index,szAnim);
            return;
        }
        var urls = [];
        for (var i = 0; i < pVal.frame; i++) {
            var str = pVal.image + GlobalFun.PrefixInteger(i + 1, 2);
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
        var act = ["idle","win","lose","look","chip"];
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(GlobalFun.getRandomInt(5, 10)),
            cc.callFunc(()=>{
                this.playerAnimate("idle",viewID,userItem);
                // this.playerAnimate(act[GlobalFun.getRandomInt(0, 4)],viewID,userItem);
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
                        // this.setAutoReleaseRecursively(uuid, false);
                        this.setAutoReleaseRecursively(uuid, true);
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
    onDestroy: function () {

    }
});
