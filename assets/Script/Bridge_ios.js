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

//获取设备电量信息
Bridge_ios.getBatteryLevel = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getBatteryLevel");
    return ret;
};

//获取设备网络类型
Bridge_ios.getNetconnType = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getNetconnType");
    return ret;
};

Bridge_ios.showAlert = function (title,message) {
    var ret = jsb.reflection.callStaticMethod(BRIDGE_CLASS,"showAlert:andContent:",title,message);
    return ret;
};

Bridge_ios.isInstallWx = function () {
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"isInstallWx");
    return ret;
}

module.exports = Bridge_ios;