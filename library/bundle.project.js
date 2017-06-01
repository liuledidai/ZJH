require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BaseFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f9300AoJB1ASp1uITlO+9z1', 'BaseFrame');
// Script/plaza/models/BaseFrame.js

"use strict";

var BaseFrame = cc.Class({
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
    onLoad: function onLoad() {
        // this._viewFrame = view;
        this._threadid = undefined;
        this._socket = undefined;
        // this._callBack = callback;

        this._gameFrame = undefined;
        this.m_tabCacheMsg = {};
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {},
    // name: "BaseFrame",
    // ctor: function(){
    //     // this._viewFrame = view;
    //     this._threadid = undefined;
    //     this._socket = undefined;
    //     // this._callBack = callback;

    //     this._gameFrame = undefined;
    //     this.m_tabCacheMsg = {};

    // },
    setCallBack: function setCallBack(callback) {
        this._callBack = callback;
    },
    setViewFrame: function setViewFrame(viewFrame) {
        this._viewFrame = viewFrame;
    },
    setSocketEvent: function setSocketEvent(socketEvent) {
        this._socketEvent = socketEvent;
    },
    getViewFrame: function getViewFrame() {
        return this._viewFrame;
    },
    isSocketServer: function isSocketServer() {
        return this._socket !== undefined && this._threadid !== undefined;
    },
    onSocketError: function onSocketError(pData) {
        if (this._threadid === undefined) {
            return;
        }

        this.onCloseSocket();
        //todo...
    },
    onCreateSocket: function onCreateSocket(szUrl, nPort) {
        if (this._socket !== undefined) {
            return false;
        }
        this._szServerUrl = szUrl;
        this._nServerPort = nPort;
        this._SocketFun = function (pData) {
            this.onSocketCallBack(pData);
        };
        this._socket = ClientSocket.createSocket(this._SocketFun);
        if (this._socket.ConnectSocket(this._szServerUrl, this._nServerPort) === true) {
            this._threadid = 0;
            return true;
        } else {
            this.onCloseSocket();
            return false;
        }
    },
    onSocketCallBack: function onSocketCallBack(pData) {
        if (pData === undefined) {
            return;
        }
        if (this._callBack === undefined) {
            console.log('no callback');
            this.onCloseSocket();
            return;
        }
        var main = pData.getmain();
        var sub = pData.getsub();
        console.log("onSocketCallBack main: " + main + " #sub: " + sub);
        if (main === 0) {
            if (sub === 0) {
                this._threadid = 1;
                this.onConnectCompeleted();
            } else {
                this.onSocketError(pData);
                this.onCloseSocket();
            }
        } else {
            this.onSocketEvent(main, sub, pData);
        }
    },
    onCloseSocket: function onCloseSocket() {
        if (this._socket !== undefined) {
            this._socket.releaseSocket();
            this._socket = undefined;
        }
        if (this._threadid !== undefined) {
            this._threadid = undefined;
        }
        this._SocketFun = undefined;
    },
    sendSocketData: function sendSocketData(pData) {
        if (this._socket === undefined) {
            return false;
        }
        this._socket.sendSocketData(pData);
    },
    onConnectCompeleted: function onConnectCompeleted() {
        console.log("BaseFrame_onConnectCompeleted");
    },
    onSocketEvent: function onSocketEvent(main, sub, pData) {
        console.log("BaseFrame_onSocketEvent_" + main + "-" + sub);
    },
    onGameSocketEvent: function onGameSocketEvent(main, sub, pData) {
        console.log("BaseFrame_onGameSocketEvent_" + main + "-" + sub);
    }

});

module.exports = BaseFrame;

cc._RFpop();
},{}],"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

"use strict";

var BaseFrame = require("BaseFrame");
cc.Class({
    extends: BaseFrame,

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
},{"BaseFrame":"BaseFrame"}]},{},["HelloWorld","BaseFrame"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvSGVsbG9Xb3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNFO0FBQ0Q7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBQ0Q7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNFO0FBRUk7QUFDSDs7QUFFRDtBQUNBO0FBQ0Q7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBRUk7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUVJO0FBRUk7QUFDQTtBQUNIO0FBR0c7QUFDQTtBQUNIO0FBQ0o7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBRUk7QUFDQTtBQUNIO0FBQ0Q7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDs7QUFuSm9COztBQXVKekI7Ozs7Ozs7Ozs7QUN2SkE7QUFDQTtBQUNJOztBQUVBO0FBQ0k7QUFDSTtBQUNBO0FBRkc7QUFJUDtBQUNBO0FBTlE7O0FBU1o7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFHQTtBQUNJO0FBRUk7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFFSTtBQUNIO0FBR0c7QUFDSDtBQUNKO0FBR0c7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBekZJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhc2VGcmFtZSA9IGNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzLl92aWV3RnJhbWUgPSB2aWV3O1xuICAgICAgICB0aGlzLl90aHJlYWRpZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAvLyB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fZ2FtZUZyYW1lID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm1fdGFiQ2FjaGVNc2cgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgfSxcbiAgICAvLyBuYW1lOiBcIkJhc2VGcmFtZVwiLFxuICAgIC8vIGN0b3I6IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgLy8gICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgIC8vICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgIC8vICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgLy8gICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgICAgICBcbiAgICAvLyB9LFxuICAgIHNldENhbGxCYWNrOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrOyAgXG4gICAgfSxcbiAgICBzZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKHZpZXdGcmFtZSl7XG4gICAgICB0aGlzLl92aWV3RnJhbWUgPSB2aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIHNldFNvY2tldEV2ZW50OiBmdW5jdGlvbihzb2NrZXRFdmVudCl7XG4gICAgICAgIHRoaXMuX3NvY2tldEV2ZW50ID0gc29ja2V0RXZlbnQ7XG4gICAgfSxcbiAgICBnZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBpc1NvY2tldFNlcnZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICBpZih0aGlzLl90aHJlYWRpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAge1xuICAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgIC8vdG9kby4uLlxuICAgIH0sXG4gICAgb25DcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKHN6VXJsLG5Qb3J0KXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zelNlcnZlclVybCA9IHN6VXJsO1xuICAgICAgICB0aGlzLl9uU2VydmVyUG9ydCA9IG5Qb3J0O1xuICAgICAgICB0aGlzLl9Tb2NrZXRGdW4gPSBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0Q2FsbEJhY2socERhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSBDbGllbnRTb2NrZXQuY3JlYXRlU29ja2V0KHRoaXMuX1NvY2tldEZ1bik7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldC5Db25uZWN0U29ja2V0KHRoaXMuX3N6U2VydmVyVXJsLHRoaXMuX25TZXJ2ZXJQb3J0KSA9PT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fY2FsbEJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGNhbGxiYWNrJyk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2FsbEJhY2sgbWFpbjogXCIgKyBtYWluICsgXCIgI3N1YjogXCIrc3ViKTtcbiAgICAgICAgaWYobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQobWFpbiwgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2VTb2NrZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQucmVsZWFzZVNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHNlbmRTb2NrZXREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kU29ja2V0RGF0YShwRGF0YSk7XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkNvbm5lY3RDb21wZWxldGVkXCIpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vblNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIG9uR2FtZVNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uR2FtZVNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUZyYW1lOyIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogQmFzZUZyYW1lLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlZmF1bHRzLCBzZXQgdmlzdWFsbHkgd2hlbiBhdHRhY2hpbmcgdGhpcyBzY3JpcHQgdG8gdGhlIENhbnZhc1xuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkISdcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGpzYlRlc3QudGVzdGxvZygpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gQ2xpZW50U29ja2V0LmNyZWF0ZVNvY2tldChmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2tfYmVnaW4nKTtcbiAgICAgICAgICAgIC8vIHZhciBtYWluSUQgPSBwRGF0YS5nZXRtYWluKCk7XG4gICAgICAgICAgICAvLyB2YXIgc3ViSUQgPSBwRGF0YS5nZXRzdWIoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1haW5JRCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdWJJRCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2tfZW5kJyk7XG4gICAgICAgICAgICBzZWxmLm9uU29ja2V0Q2FsbEJhY2socERhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdmFyIHBEYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICAvLyBwRGF0YS5zZXRjbWRpbmZvKDIsMyk7XG4gICAgICAgIC8vIHBEYXRhLnB1c2hieXRlKDEpO1xuICAgICAgICAvLyBwRGF0YS5wdXNod29yZCgyMzMzMyk7XG4gICAgICAgIC8vIHBEYXRhLnB1c2hkb3VibGUoMTIzLjM0MzQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwRGF0YS5nZXRtYWluKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwRGF0YS5nZXRzdWIoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRieXRlKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkd29yZCgpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocERhdGEucmVhZGRvdWJsZSgpKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuQ29ubmVjdFNvY2tldChcIjEyMi4yMjYuMTg2LjM4XCIsOTAwOSk7XG4gICAgICAgIHRoaXMubGFiZWwuc3RyaW5nID0gdGhpcy50ZXh0O1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpIHtcbiAgICAgICAgaWYocERhdGEgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYWluID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICB2YXIgc3ViID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdtYWluID0gJyttYWluKycgc3ViID0gJytzdWIpO1xuICAgICAgICBpZiAobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29ubmVjdENvbXBlbGV0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU29ja2V0RXJyb3IocERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5vblNvY2tldEV2ZW50KHBEYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Db25uZWN0Q29tcGVsZXRlZDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5zZW5kTG9nb24oKTtcbiAgICAgICAgY29uc29sZS5sb2coJ29uQ29ubmVjdENvbXBlbGV0ZWQnKTtcbiAgICB9LFxuICAgIG9uU29ja2V0RXJyb3I6ZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZygnb25Tb2NrZXRFcnJvcicpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0RXZlbnRcIik7XG4gICAgfSxcbiAgICBzZW5kTG9nb246IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsb2dvbkRhdGEgPSBDQ21kX0RhdGEuY3JlYXRlKCk7XG4gICAgICAgIGxvZ29uRGF0YS5zZXRjbWRpbmZvKDE1LDE1MCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoZHdvcmQoMSk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMTc2MDIxNzAzMTNcIiwzMik7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMjVkNTVhZDI4M2FhNDAwYWY0NjRjNzZkNzEzYzA3YWRcIiwzMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoc3RyaW5nKFwiMmQ0ZDdjOTVlNWRmMDE3OWFmMjQ2NmY2MzVjYTcxZGVcIiwzMyk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgbG9nb25EYXRhLnB1c2hieXRlKDApO1xuICAgICAgICB0aGlzLnNvY2tldC5zZW5kU29ja2V0RGF0YShsb2dvbkRhdGEpO1xuICAgIH1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==