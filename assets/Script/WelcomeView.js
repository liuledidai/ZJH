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
        _step: 0,
        _count: 0,
        kDesignFrameRate: 60.0,
        kSplashStepLogo1Still: 0,
        kSplashStepLogo1FadeOut: 1,
        kSplashFadeTime: 0.5,
        kSplashStillTime: 2.0,
    },

    // use this for initialization
    onLoad: function () {
        this._count = 0;
        this._step = 0;
        // this.scheduleOnce(function(){
        //     cc.director.loadScene("LoginScene");
        // }, 2);
        AudioMng.loadSoundData();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
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
                cc.sys.garbageCollect();
            }
            else
            {
                var op = 255 * (1.0 - Math.sin((this._count/1.0) * 0.5 * Math.PI));
                this.splash.opacity = op;
            }
        }
    },
});
