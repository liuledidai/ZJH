var Bridge_ios = {};
var BRIDGE_CLASS = "AppController";
var DEVICE_MODULE = "DeviceModule";

//获取设备id
Bridge_ios.getMachineID = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getUserToken");
    return ret;
};

//获取设备ip
Bridge_ios.getIpAddress = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getUserIP");
    return ret;
};

//获取游戏version
Bridge_ios.getAppVersion = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getAppVersion");
    return ret;
};

Bridge_ios.showAlert = function (title,message) {
    var ret = jsb.reflection.callStaticMethod(BRIDGE_CLASS,"showAlert:andContent:",title,message);
    return ret;
};

module.exports = Bridge_ios;