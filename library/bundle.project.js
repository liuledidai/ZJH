require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BaseFrame":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f9300AoJB1ASp1uITlO+9z1', 'BaseFrame');
// Script/plaza/models/BaseFrame.js

"use strict";

var BaseFrame = cc.Class({
    // extends: cc.Component,

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
    // onLoad: function () {

    // },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    name: "BaseFrame",
    ctor: function ctor() {
        // this._viewFrame = view;
        this._threadid = undefined;
        this._socket = undefined;
        // this._callBack = callback;

        this._gameFrame = undefined;
        this.m_tabCacheMsg = {};
    },
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
},{"BaseFrame":"BaseFrame"}]},{},["HelloWorld","BaseFrame"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvcGxhemEvbW9kZWxzL0Jhc2VGcmFtZS5qcyIsImFzc2V0cy9TY3JpcHQvSGVsbG9Xb3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFSDtBQUNEO0FBQ0U7QUFDRDtBQUNEO0FBQ0U7QUFDRDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0U7QUFDRDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0U7QUFFSTtBQUNIOztBQUVEO0FBQ0E7QUFDRDtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFFSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFFSTtBQUNBO0FBQ0g7QUFHRztBQUNBO0FBQ0g7QUFDSjtBQUdHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFFSTtBQUNBO0FBQ0g7QUFDRDtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUVJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIOztBQTdJb0I7O0FBaUp6Qjs7Ozs7Ozs7OztBQ2pKQTtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFGRztBQUlQO0FBQ0E7QUFOUTs7QUFTWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUdBO0FBQ0k7QUFFSTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUVJO0FBQ0g7QUFHRztBQUNIO0FBQ0o7QUFHRztBQUNIO0FBQ0o7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUF6RkkiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQmFzZUZyYW1lID0gY2MuQ2xhc3Moe1xuICAgIC8vIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgLy8gb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAvLyB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbiAgICBuYW1lOiBcIkJhc2VGcmFtZVwiLFxuICAgIGN0b3I6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIHRoaXMuX3ZpZXdGcmFtZSA9IHZpZXc7XG4gICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIHRoaXMuX2NhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9nYW1lRnJhbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubV90YWJDYWNoZU1zZyA9IHt9O1xuICAgICAgICBcbiAgICB9LFxuICAgIHNldENhbGxCYWNrOiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICB0aGlzLl9jYWxsQmFjayA9IGNhbGxiYWNrOyAgXG4gICAgfSxcbiAgICBzZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKHZpZXdGcmFtZSl7XG4gICAgICB0aGlzLl92aWV3RnJhbWUgPSB2aWV3RnJhbWU7ICBcbiAgICB9LFxuICAgIHNldFNvY2tldEV2ZW50OiBmdW5jdGlvbihzb2NrZXRFdmVudCl7XG4gICAgICAgIHRoaXMuX3NvY2tldEV2ZW50ID0gc29ja2V0RXZlbnQ7XG4gICAgfSxcbiAgICBnZXRWaWV3RnJhbWU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5fdmlld0ZyYW1lOyAgXG4gICAgfSxcbiAgICBpc1NvY2tldFNlcnZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICBpZih0aGlzLl90aHJlYWRpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAge1xuICAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgIC8vdG9kby4uLlxuICAgIH0sXG4gICAgb25DcmVhdGVTb2NrZXQ6IGZ1bmN0aW9uKHN6VXJsLG5Qb3J0KXtcbiAgICAgICAgaWYodGhpcy5fc29ja2V0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zelNlcnZlclVybCA9IHN6VXJsO1xuICAgICAgICB0aGlzLl9uU2VydmVyUG9ydCA9IG5Qb3J0O1xuICAgICAgICB0aGlzLl9Tb2NrZXRGdW4gPSBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0Q2FsbEJhY2socERhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSBDbGllbnRTb2NrZXQuY3JlYXRlU29ja2V0KHRoaXMuX1NvY2tldEZ1bik7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldC5Db25uZWN0U29ja2V0KHRoaXMuX3N6U2VydmVyVXJsLHRoaXMuX25TZXJ2ZXJQb3J0KSA9PT0gdHJ1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Tb2NrZXRDYWxsQmFjazogZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICBpZihwRGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5fY2FsbEJhY2sgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vIGNhbGxiYWNrJyk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2VTb2NrZXQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm9uU29ja2V0Q2FsbEJhY2sgbWFpbjogXCIgKyBtYWluICsgXCIgI3N1YjogXCIrc3ViKTtcbiAgICAgICAgaWYobWFpbiA9PT0gMCkgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHN1YiA9PT0gMCkgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGhyZWFkaWQgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMub25Db25uZWN0Q29tcGVsZXRlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcihwRGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsb3NlU29ja2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm9uU29ja2V0RXZlbnQobWFpbiwgc3ViLCBwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2xvc2VTb2NrZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHRoaXMuX3NvY2tldCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQucmVsZWFzZVNvY2tldCgpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuX3RocmVhZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX3RocmVhZGlkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX1NvY2tldEZ1biA9IHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHNlbmRTb2NrZXREYXRhOiBmdW5jdGlvbihwRGF0YSl7XG4gICAgICAgIGlmICh0aGlzLl9zb2NrZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvY2tldC5zZW5kU29ja2V0RGF0YShwRGF0YSk7XG4gICAgfSxcbiAgICBvbkNvbm5lY3RDb21wZWxldGVkOiBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vbkNvbm5lY3RDb21wZWxldGVkXCIpO1xuICAgIH0sXG4gICAgb25Tb2NrZXRFdmVudDogZnVuY3Rpb24obWFpbixzdWIscERhdGEpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIkJhc2VGcmFtZV9vblNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIG9uR2FtZVNvY2tldEV2ZW50OiBmdW5jdGlvbihtYWluLHN1YixwRGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQmFzZUZyYW1lX29uR2FtZVNvY2tldEV2ZW50X1wiK21haW4rXCItXCIrc3ViKTtcbiAgICB9LFxuICAgIFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUZyYW1lOyIsInZhciBCYXNlRnJhbWUgPSByZXF1aXJlKFwiQmFzZUZyYW1lXCIpXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LEJhc2VGcmFtZSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICAvLyBkZWZhdWx0cywgc2V0IHZpc3VhbGx5IHdoZW4gYXR0YWNoaW5nIHRoaXMgc2NyaXB0IHRvIHRoZSBDYW52YXNcbiAgICAgICAgdGV4dDogJ0hlbGxvLCBXb3JsZCEnXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBqc2JUZXN0LnRlc3Rsb2coKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnNvY2tldCA9IENsaWVudFNvY2tldC5jcmVhdGVTb2NrZXQoZnVuY3Rpb24ocERhdGEpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2JlZ2luJyk7XG4gICAgICAgICAgICAvLyB2YXIgbWFpbklEID0gcERhdGEuZ2V0bWFpbigpO1xuICAgICAgICAgICAgLy8gdmFyIHN1YklEID0gcERhdGEuZ2V0c3ViKCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYWluSUQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3ViSUQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxiYWNrX2VuZCcpO1xuICAgICAgICAgICAgc2VsZi5vblNvY2tldENhbGxCYWNrKHBEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHZhciBwRGF0YSA9IENDbWRfRGF0YS5jcmVhdGUoKTtcbiAgICAgICAgLy8gcERhdGEuc2V0Y21kaW5mbygyLDMpO1xuICAgICAgICAvLyBwRGF0YS5wdXNoYnl0ZSgxKTtcbiAgICAgICAgLy8gcERhdGEucHVzaHdvcmQoMjMzMzMpO1xuICAgICAgICAvLyBwRGF0YS5wdXNoZG91YmxlKDEyMy4zNDM0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocERhdGEuZ2V0bWFpbigpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocERhdGEuZ2V0c3ViKCkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwRGF0YS5yZWFkYnl0ZSgpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocERhdGEucmVhZHdvcmQoKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBEYXRhLnJlYWRkb3VibGUoKSk7XG4gICAgICAgIHRoaXMuc29ja2V0LkNvbm5lY3RTb2NrZXQoXCIxMjIuMjI2LjE4Ni4zOFwiLDkwMDkpO1xuICAgICAgICB0aGlzLmxhYmVsLnN0cmluZyA9IHRoaXMudGV4dDtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICB9LFxuICAgIG9uU29ja2V0Q2FsbEJhY2s6IGZ1bmN0aW9uKHBEYXRhKSB7XG4gICAgICAgIGlmKHBEYXRhID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWFpbiA9IHBEYXRhLmdldG1haW4oKTtcbiAgICAgICAgdmFyIHN1YiA9IHBEYXRhLmdldHN1YigpO1xuICAgICAgICBjb25zb2xlLmxvZygnbWFpbiA9ICcrbWFpbisnIHN1YiA9ICcrc3ViKTtcbiAgICAgICAgaWYgKG1haW4gPT09IDApIFxuICAgICAgICB7XG4gICAgICAgICAgICBpZihzdWIgPT09IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbm5lY3RDb21wZWxldGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNvY2tldEVycm9yKHBEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFdmVudChwRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ29ubmVjdENvbXBlbGV0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2VuZExvZ29uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdvbkNvbm5lY3RDb21wZWxldGVkJyk7XG4gICAgfSxcbiAgICBvblNvY2tldEVycm9yOmZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coJ29uU29ja2V0RXJyb3InKTtcbiAgICB9LFxuICAgIG9uU29ja2V0RXZlbnQ6IGZ1bmN0aW9uKHBEYXRhKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJvblNvY2tldEV2ZW50XCIpO1xuICAgIH0sXG4gICAgc2VuZExvZ29uOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbG9nb25EYXRhID0gQ0NtZF9EYXRhLmNyZWF0ZSgpO1xuICAgICAgICBsb2dvbkRhdGEuc2V0Y21kaW5mbygxNSwxNTApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDApO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGR3b3JkKDEpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjE3NjAyMTcwMzEzXCIsMzIpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjI1ZDU1YWQyODNhYTQwMGFmNDY0Yzc2ZDcxM2MwN2FkXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaHN0cmluZyhcIjJkNGQ3Yzk1ZTVkZjAxNzlhZjI0NjZmNjM1Y2E3MWRlXCIsMzMpO1xuICAgICAgICBsb2dvbkRhdGEucHVzaGJ5dGUoMCk7XG4gICAgICAgIGxvZ29uRGF0YS5wdXNoYnl0ZSgwKTtcbiAgICAgICAgdGhpcy5zb2NrZXQuc2VuZFNvY2tldERhdGEobG9nb25EYXRhKTtcbiAgICB9XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=