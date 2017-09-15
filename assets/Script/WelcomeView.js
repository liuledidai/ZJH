var AudioMng = require("AudioMng");
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
        splash:{
            default:null,
            type:cc.Node,
        },
        videoPlayer: {
            default: null,
            type: cc.VideoPlayer
        },
        _step: 0,
        _count: 0,
        kDesignFrameRate: 60.0,
        kSplashStepLogo1Still: 0,
        kSplashStepLogo1FadeOut: 1,
        kSplashFadeTime: 1.5,
        kSplashStillTime: 5.0,
    },

    // use this for initialization
    onLoad: function () {
        this._count = 0;
        this._step = 0;
        // this.scheduleOnce(function(){
        //     cc.director.loadScene("LoginScene");
        // }, 2);
        AudioMng.loadSoundData();
        cc.loader.loadRes("prefab/PopWaitingView",function (err,res) {
            
        });
        cc.loader.loadResDir("json",function (err,res) {
            // for (var i = 0; i < res.length; i++) {
            //     var element = res[i];
            //     console.log("resDir ",i,JSON.stringify(element,null,' '));
            // }
        });
    },
    _pausedCallback: function () {
        this.videoPlayer.pause();
    },
    _restoreCallback: function () {
        // this.videoPlayer.play();
        this.scheduleOnce(()=>{
            this.videoPlayer.node.active = false;
            cc.director.loadScene("LoginScene");
        })
    },
    onEnable: function () {
        cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
        console.log("[WelcomeView][onEnable]");
    },
    onDisable: function () {
        cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
        console.log("[WelcomeView][onDisable]");
    },
    onDestroy: function (params) {
        console.log("[WelcomeView][onDestroy]")
        cc.sys.garbageCollect();  
    },
    play: function (params) {
        this.videoPlayer.play();
    },
    pause: function (params) {
        this.videoPlayer.pause();  
    },
    stop: function (params) {
        this.videoPlayer.stop();  
    },
    onVideoPlayerEvent: function(sender, event) {
        console.log("[event]",event);
        // this.label.string = event;
        if (event === cc.VideoPlayer.EventType.META_LOADED) {
            // this.totalTime.string = this.videoPlayer.getDuration().toFixed(2);
            // this.videoPlayer.play();
            console.log("[event] META_LOADED",event);
        } else if (event === cc.VideoPlayer.EventType.CLICKED) {
            // if(this.videoPlayer.isPlaying()) {
            //     this.videoPlayer.pause();
            // } else {
            //     this.videoPlayer.play();
            // }
            console.log("[event] CLICKED",event);
        }
        else if (event === cc.VideoPlayer.EventType.COMPLETED) {
            console.log("[event] COMPLETED",event);
            cc.director.loadScene("LoginScene");
        }
        else if(event === cc.VideoPlayer.EventType.READY_TO_PLAY) {
            // this.videoPlayer.pause();
            this.scheduleOnce(()=>{
                this.videoPlayer.play();
            })
            console.log("[event] READY_TO_PLAY",event);
        }
        else if(event === cc.VideoPlayer.EventType.PLAYING) {
            // this.videoPlayer.play();
            console.log("[event] PLAYING",event);
        }
        else if(event === cc.VideoPlayer.EventType.PAUSED) {
            // this.videoPlayer.play();
            console.log("[event] PAUSED",event);
        }
        else if(event === cc.VideoPlayer.EventType.STOPPED) {
            // this.videoPlayer.play();
            console.log("[event] STOPPED",event);
            cc.director.loadScene("LoginScene");
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
            // console.log("VideoPlayer is not supported on Mac and Windows!");
            // return;
        }
        else {
            return;
        }
        this._count += dt;
        if (this._step === this.kSplashStepLogo1Still)
        {
            if(this._count > this.kSplashStillTime)
            {
                this._count = 0;
                this._step += 1;
            }
        }
        else if (this._step === this.kSplashStepLogo1FadeOut)
        {
            if (this._count > this.kSplashFadeTime)
            {
                this.splash.active = false;
                this._count = 0;
                cc.director.loadScene("LoginScene");
            }
            else
            {
                var op = 255 * (1.0 - Math.sin((this._count/(this.kSplashFadeTime * 2.0)) * 0.5 * Math.PI));
                this.splash.opacity = op;
            }
        }
    },
});
