"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

var BaseFrame = require("BaseFrame");
cc.Class({
    extends: cc.Component, BaseFrame: BaseFrame,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function onLoad() {
        jsbTest.testlog();
        var self = this;
        this.socket = ClientSocket.createSocket(function (pData) {
            // console.log('callback_begin');
            // var mainID = pData.getmain();
            // var subID = pData.getsub();
            // console.log(mainID);
            // console.log(subID);
            // console.log('callback_end');
            self.onSocketCallBack(pData);
        });
        // var pData = CCmd_Data.create();
        // pData.setcmdinfo(2,3);
        // pData.pushbyte(1);
        // pData.pushword(23333);
        // pData.pushdouble(123.3434);
        // console.log(pData.getmain());
        // console.log(pData.getsub());
        // console.log(pData.readbyte());
        // console.log(pData.readword());
        // console.log(pData.readdouble());
        this.socket.ConnectSocket("122.226.186.38", 9009);
        this.label.string = this.text;
    },
    // called every frame
    update: function update(dt) {},
    onSocketCallBack: function onSocketCallBack(pData) {
        if (pData === undefined) {
            return;
        }
        var main = pData.getmain();
        var sub = pData.getsub();
        console.log('main = ' + main + ' sub = ' + sub);
        if (main === 0) {
            if (sub === 0) {
                this.onConnectCompeleted();
            } else {
                this.onSocketError(pData);
            }
        } else {
            this.onSocketEvent(pData);
        }
    },
    onConnectCompeleted: function onConnectCompeleted() {
        this.sendLogon();
        console.log('onConnectCompeleted');
    },
    onSocketError: function onSocketError(pData) {
        console.log('onSocketError');
    },
    onSocketEvent: function onSocketEvent(pData) {
        console.log("onSocketEvent");
    },
    sendLogon: function sendLogon() {
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(15, 150);
        logonData.pushdword(1);
        logonData.pushdword(0);
        logonData.pushdword(3);
        logonData.pushdword(1);
        logonData.pushstring("17602170313", 32);
        logonData.pushstring("25d55ad283aa400af464c76d713c07ad", 33);
        logonData.pushstring("2d4d7c95e5df0179af2466f635ca71de", 33);
        logonData.pushbyte(0);
        logonData.pushbyte(0);
        this.socket.sendSocketData(logonData);
    }
});

cc._RFpop();