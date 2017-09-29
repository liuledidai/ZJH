var MultiPlatform = {};
var PLATFORM = {};
PLATFORM[cc.sys.OS_IOS] = require("Bridge_ios");
PLATFORM[cc.sys.OS_ANDROID] = require("Bridge_android");

MultiPlatform.getMachineID = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getMachineID) {
        return PLATFORM[cc.sys.os].getMachineID();
    }
    else {
        console.log("[MultiPlatform][getMachineID] unsupport platform -> " + cc.sys.os);
        return "2d4d7c95e5df0179af2466f635ca711e";
    }
};

MultiPlatform.getIpAddress = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getIpAddress) {
        return PLATFORM[cc.sys.os].getIpAddress();
    }
    else {
        console.log("[MultiPlatform][getIpAddress] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

MultiPlatform.getAppVersion = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getIpAddress) {
        return PLATFORM[cc.sys.os].getAppVersion();
    }
    else {
        console.log("[MultiPlatform][getAppVersion] unsupport platform -> " + cc.sys.os);
        return "";
    }
}

MultiPlatform.getBatteryLevel = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getBatteryLevel) {
        return PLATFORM[cc.sys.os].getBatteryLevel();
    }
    else {
        console.log("[MultiPlatform][getBatteryLevel] unsupport platform -> " + cc.sys.os);
        return 0;
    }
}

MultiPlatform.getNetconnType = function () {
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].getNetconnType) {
        return PLATFORM[cc.sys.os].getNetconnType();
    }
    else {
        console.log("[MultiPlatform][getNetconnType] unsupport platform -> " + cc.sys.os);
        return "";
    }
}

MultiPlatform.showAlert = function (title,message) {
    title = title || cc.sys.os;
    message = message || cc.sys.os;
    if (PLATFORM[cc.sys.os] && PLATFORM[cc.sys.os].showAlert) {
        return PLATFORM[cc.sys.os].showAlert(title,message);
    }
    else {
        console.log("[MultiPlatform][showAlert] unsupport platform -> " + cc.sys.os);
        return "";
    }
};

module.exports = MultiPlatform;