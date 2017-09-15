require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var BaseFrame = require("BaseFrame");
var GlobalFun = require("GlobalFun");
cc.Class({
    extends: BaseFrame,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        videoPlayer: {
            default: null,
            type: cc.VideoPlayer
        }
    },
    play: function name(params) {
        this.videoPlayer.play();
    },
    pause: function (params) {
        this.videoPlayer.pause();  
    },
    stop: function (params) {
        this.videoPlayer.stop();  
    },
    onVideoPlayerEvent: function(sender, event) {
        this.label.string = event;
        if (event === cc.VideoPlayer.EventType.META_LOADED) {
            // this.totalTime.string = this.videoPlayer.getDuration().toFixed(2);
        } else if (event === cc.VideoPlayer.EventType.CLICKED) {
            if(this.videoPlayer.isPlaying()) {
                this.videoPlayer.pause();
            } else {
                this.videoPlayer.play();
            }
        }
    },
    // name: "helloFrame",
    // use this for initialization
    onLoad: function () {
        // jsbTest.testlog();
        // var self = this;
        // this.socket = ClientSocket.createSocket(function(pData){
        //     // console.log('callback_begin');
        //     // var mainID = pData.getmain();
        //     // var subID = pData.getsub();
        //     // console.log(mainID);
        //     // console.log(subID);
        //     // console.log('callback_end');
        //     self.onSocketCallBack(pData);
        // });
        // // var pData = CCmd_Data.create();
        // // pData.setcmdinfo(2,3);
        // // pData.pushbyte(1);
        // // pData.pushword(23333);
        // // pData.pushdouble(123.3434);
        // // console.log(pData.getmain());
        // // console.log(pData.getsub());
        // // console.log(pData.readbyte());
        // // console.log(pData.readword());
        // // console.log(pData.readdouble());
        // this.socket.ConnectSocket("122.226.186.38",9009);
        // this.onCreateSocket("122.226.186.38",9009);
        // this.label.string = this.text;
        console.log("[HelloWorld][onLoad]");
    },
    onEnable: function (params) {
        console.log("[HelloWorld][onEnable]");
    },
    start: function (params) {
        console.log("[HelloWorld][start]");
    },
    // called every frame
    update: function (dt) {

    },
    // play: function (params) {
    //     console.log("play");
    //     // var node = new cc.Node();
    //     // this.node.addChild(node,9999);
    //     let bDate = Date.now();
    //     GlobalFun.playEffects(this.node, {
    //         fileName: "yx_wlg3",
    //         anim: "yx_gzyz",
    //         loop: false,
    //         // x: 200,
    //         // y: 200,
    //         callback: ()=> {
    //             let eDate = Date.now();
    //             console.log("time = ",eDate-bDate);
    //         }
    //     });
    //     // node.runAction(cc.sequence(
    //     //     cc.delayTime(2),
    //     //     cc.callFunc(function (node) {
    //     //         node.destroy();
    //     //     })
    //     // )
    //     // )
    // },
    // onSocketCallBack: function(pData) {
    //     if(pData === undefined)
    //     {
    //         return;
    //     }
    //     var main = pData.getmain();
    //     var sub = pData.getsub();
    //     console.log('main = '+main+' sub = '+sub);
    //     if (main === 0) 
    //     {
    //         if(sub === 0)
    //         {
    //             this.onConnectCompeleted();
    //         }
    //         else
    //         {
    //             this.onSocketError(pData);
    //         }
    //     }
    //     else
    //     {
    //         this.onSocketEvent(pData);
    //     }
    // },
    onConnectCompeleted: function(){
        this.sendLogon();
        console.log('hello_onConnectCompeleted');
    },
    // onSocketError:function(pData){
    //     console.log('onSocketError');
    // },
    // onSocketEvent: function(pData){
    //     console.log("onSocketEvent");
    // },
    sendLogon: function(){
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE,plaza_cmd.SUB_GP_LOGON_MOBILE);
        logonData.pushdword(1);
        logonData.pushdword(0);
        logonData.pushdword(3);
        logonData.pushdword(1);
        logonData.pushstring("17602170313",32);
        logonData.pushstring("25d55ad283aa400af464c76d713c07ad",33);
        logonData.pushstring("2d4d7c95e5df0179af2466f635ca71de",33);
        logonData.pushbyte(0);
        logonData.pushbyte(0);
        this.sendSocketData(logonData);
    }
});
