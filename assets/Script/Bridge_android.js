var Bridge_android = {};
var BRIDGE_CLASS = "org/cocos2dx/javascript/AppActivity";
var DEVICE_MODULE = "org/cocos2dx/javascript/DeviceModule"
//获取设备id
Bridge_android.getMachineID = function () {
    var sigs = "()Ljava/lang/String;"
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getMachineID",sigs);
    return ret;
};

//获取设备ip
Bridge_android.getIpAddress = function () {
    var sigs = "()Ljava/lang/String;"
    var ret = jsb.reflection.callStaticMethod(DEVICE_MODULE,"getUserIP",sigs);
    return ret;
};

Bridge_android.showAlert = function (title,message) {
    var sigs = "(Ljava/lang/String;Ljava/lang/String;)V"
    var ret = jsb.reflection.callStaticMethod(BRIDGE_CLASS,"showAlert",sigs,title,message);
    return ret;
};
module.exports = Bridge_android;