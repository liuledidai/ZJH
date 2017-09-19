require("MD5");
var GlobalUserData = require("GlobalUserData");
var GlobalFun = {};
var ZORDER = cc.Enum({
    LoadingOrder: 1000,
    AlertOrder: 1001,
    ToastOrder: 1002,
})

GlobalFun.ActionShowTanChuang = function ActionShowTanChuang(widget, cb) {
    if (cc.isValid(widget) === false) {
        console.log("[GlobalFun][ActionShowTanChuang] widget is invalid");
        return;
    }
    widget.opacity = 0;
    widget.scale = 0.01;
    widget.runAction(cc.spawn(
        cc.fadeIn(0.25),
        cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.05, 1.0)), cc.callFunc(function () {
            if (typeof (cb) === "function") {
                cb();
            }
        })
    ));
};
/**
 * 
 * @param {*} params 
 * {
 *  message:对话框显示的文本,
 *  textAlignment:文本对齐模式，默认居中
 *  btn: [
 *      {
 *          name:按钮显示的文本，
 *          callback: 按钮回调，
 *      }
 *      ]
 * }
 * @param {*} context 
 */
GlobalFun.showAlert = function showAlert(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/AlertView", function (err, AlertPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(AlertPrefab);
            context.addChild(newNode, ZORDER.AlertOrder);
            newNode.getComponent("AlertView").init(params);
            GlobalFun.ActionShowTanChuang(cc.find("commonBg", newNode));
            console.log("showAlert");
        }
    });
};

GlobalFun.showToast = function showToast(message, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/ToastView", function (err, ToastPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(ToastPrefab);
            newNode.getComponent("ToastView").init({ message: message });
            context.addChild(newNode, ZORDER.ToastOrder);
            console.log("showToast");
        }
    });
};
/*
showPopWaiting()
@params{
    waitingText: 界面显示的文字,
    waitingTime: 界面存在的时间,超时即销毁界面,
    closeEvent: 关闭界面监听的事件, 
    callBackFunc: 收到监听事件执行的回调函数,
}
*/
GlobalFun.showPopWaiting = function showPopWaiting(context, params) {
    if (cc.isValid(context) === false) {
        return;
    }
    cc.loader.loadRes("prefab/PopWaitingView", function (err, PopWaitPrefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(PopWaitPrefab);
            newNode.getComponent("PopWaitView").onInit(params);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
            console.log("showPopWaiting");
        }
    });
};

GlobalFun.showLoadingView = function showLoadingView(params, context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showLoadingView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/LoadingView", function (err, res) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(res);
            newNode.getComponent("LoadingView").init(params);
            context.addChild(newNode, ZORDER.LoadingOrder);
        }
    })
}

GlobalFun.showBindView = function showBindView(context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showBindView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/GuestBindView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showShopView = function showShopView(context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showShopView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/ShopView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showBankView = function showBankView(context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showBankView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/BankView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showLotteryView = function showLotteryView(params,context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showLotteryView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/LotteryView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            newNode.getComponent("LotteryView").init(params);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showAwardView = function showAwardView(params,context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showAwardView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/AwardView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            newNode.getComponent("AwardView").init(params);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showRanklistView = function showRanklistView(params,context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showRanklistView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/RanklistView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            // newNode.getComponent("RanklistView").init(params);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};

GlobalFun.showActivityView = function showActivityView(params,context) {
    context = context || cc.Canvas.instance.node;
    if (cc.isValid(context) === false) {
        console.log("[GlobalFun][showActivityView] context is invalid");
        return;
    }
    cc.loader.loadRes("prefab/ActivityView", function (err, prefab) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (cc.isValid(context)) {
            var newNode = cc.instantiate(prefab);
            context.addChild(newNode);
            // newNode.getComponent("RanklistView").init(params);
            GlobalFun.ActionShowTanChuang(newNode);
        }
    });
};
/**
 * params = {
 * url: url地址，
 * paramString : url 参数
 * callback: 正常回调函数
 * timeoutCallback: 超时回调
 * timeout: 超时时间 单位秒
 * }
 * 
 */
GlobalFun.sendRequest = function sendRequest(params) {
    var url = params.url;
    var paramString = params.paramString;
    var callback = params.callback;
    var timeoutCallback = params.timeoutCallback;
    var timeout = params.timeout || 8; //单位秒
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response);
            try {
                var value = JSON.parse(response);
                if (callback !== null && typeof (callback) == "function") {
                    callback(value);
                }
            } catch (error) {
                console.log("err:" + error);
            }
            cc.director.emit("sendRequestCompleted");
        }
    };
    GlobalFun.showPopWaiting(cc.director.getScene(), {
        closeEvent: "sendRequestCompleted",
        callBackFunc: function () {
            console.log("[GlobalFun][sendRequest] callbackfunc");
        },
        waitingTime: (timeout),
    });
    xhr.open("POST", url, true);
    xhr.timeout = (timeout * 1000);//单位毫秒
    xhr.ontimeout = function (e) {
        console.log("[GlobalFun][sendRequest] timeout ",url);
        if (timeoutCallback !== null && typeof (timeoutCallback) == "function") {
            timeoutCallback();
        }
        cc.director.emit("sendRequestCompleted");
        xhr.abort();
    }
    xhr.send(paramString);
};

GlobalFun.getsign = function getsign(params) {
    params = params + "key=fgr7hk5ds35h30hnj7hwas4gfy6sj78x";//加入key
    return cc.md5Encode(params).toLowerCase();
};

GlobalFun.buildRequestParam = function buildRequestParam(params) {
    var nowTime = Math.floor(Date.now() / 1000);
    //加入时间戳
    params["datetamp"] = nowTime;
    //加入GUID
    if (GlobalUserData.szUserGUID && GlobalUserData.szUserGUID.length > 0) {
        params["token"] = GlobalUserData.szUserGUID;
    }
    var sort_params = Object.keys(params).sort()
    console.log("[GlobalFun][buildRequestParam] " + JSON.stringify(params, null, ' '));
    var paramString = "";
    for (var ki in sort_params) {
        var key = sort_params[ki];
        if (params.hasOwnProperty(key)) {
            var element = params[key];
            paramString = paramString + key + "=" + element + "&";
        }
    }
    paramString = paramString + "sign=" + GlobalFun.getsign(paramString);
    return paramString;
};

GlobalFun.ipToNumber = function ipToNumber(ip) {
    var num = 0;
    if (ip == "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length != 4) {
        return num;
    }
    num += parseInt(aNum[0]) << 24;
    num += parseInt(aNum[1]) << 16;
    num += parseInt(aNum[2]) << 8;
    num += parseInt(aNum[3]) << 0;
    num = num >>> 0;//这个很关键，不然可能会出现负数的情况
    return num;
};

GlobalFun.numberToIp = function numberToIp(number) {
    var ip = "";
    if (number <= 0) {
        return ip;
    }
    var ip3 = (number << 0) >>> 24;
    var ip2 = (number << 8) >>> 24;
    var ip1 = (number << 16) >>> 24;
    var ip0 = (number << 24) >>> 24

    ip += ip0 + "." + ip1 + "." + ip2 + "." + ip3;

    return ip;
};
//数字填充前缀0
GlobalFun.PrefixInteger = function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
};

//获得(min,max)之间的随机整数，（min<= x <= max）
GlobalFun.getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
/* args {
    fileName,
    *anim,
    *loop,
    *remove,
    *callback,
    *x,
    *y,
    *scale,
    *tag,
} */
GlobalFun.playEffects = function playEffects(parent, args) {
    if (cc.isValid(parent) == false) {
        return;
    }
    var fileName = args.fileName;
    var tag = args.tag || fileName;
    var anim = args.anim;
    var loop = args.loop;
    var node;
    if (parent.getChildByName(tag)) {
        node = parent.getChildByName(tag);
        console.log("node exist ", tag);
    }
    else {
        node = new cc.Node(tag);
        node.parent = parent;
        console.log("node create ", tag);
    }
    node.setPosition(cc.p(args.x || 0, args.y || 0));
    if (args.remove === undefined) {
        args.remove = true;
    }
    var filePath = "anim/";
    var ske = filePath + fileName + "_ske";
    var tex = filePath + fileName + "_tex";
    var display = node.getComponent(dragonBones.ArmatureDisplay) || node.addComponent(dragonBones.ArmatureDisplay);
    display.removeEventListener(dragonBones.EventObject.COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, display.eventHandler, display)
    display.removeEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, display.eventHandler, display);
    display.removeEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, display.eventHandler, display)
    display.removeEventListener(dragonBones.EventObject.FRAME_EVENT, display.eventHandler, display)
    display.eventHandler = function (event) {
        // console.log("[playEffects]", fileName, event.type);
        if (event.type === dragonBones.EventObject.COMPLETE) {
            if (typeof (args.callback) === "function") {
                args.callback(node);
            }
            if (args.remove) {
                console.log("[playEffects] remove 1")
                node.removeFromParent();
                node.destroy();
                console.log("[playEffects] remove 2")
            }
        }
    }

    cc.loader.loadRes(ske, function (err, dragonBonesAsset) {
        if (err) {
            console.log(err.message || err);
            return;
        }
        if (dragonBonesAsset instanceof dragonBones.DragonBonesAsset) {
            display.dragonAsset = dragonBonesAsset;
            cc.loader.loadRes(tex, dragonBones.DragonBonesAtlasAsset, function (err, dragonBonesAtlasAsset) {
                if (err) {
                    console.log(err.message || err);
                    return;
                }
                if (dragonBonesAtlasAsset instanceof dragonBones.DragonBonesAtlasAsset) {
                    display.dragonAtlasAsset = dragonBonesAtlasAsset;
                    var armatureNames = display.getArmatureNames();
                    if (armatureNames.length <= 0) {
                        console.log("[playEffects][armatureNames] " + fileName + " is empty");
                        return;
                    }
                    var armatureName = armatureNames[0];
                    // // display.buildArmature(armatureName);
                    display.armatureName = armatureName;
                    var animationNames = display.getAnimationNames(armatureName);
                    if (animationNames.length <= 0) {
                        console.log("[playEffects][animationNames] " + fileName + " is empty");
                        return;
                    }
                    var animationName = animationNames.indexOf(anim) !== -1 && anim || animationNames[0];
                    var times = loop && -1 || 1;
                    display.addEventListener(dragonBones.EventObject.COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, display.eventHandler, display)
                    display.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, display.eventHandler, display);
                    display.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, display.eventHandler, display)
                    display.addEventListener(dragonBones.EventObject.FRAME_EVENT, display.eventHandler, display)
                    display.playAnimation(animationName, times);
                    console.log(animationName);
                }
                else {
                }
            })
        }
        else {
        }
    })
};

module.exports = GlobalFun;
// {
//     ActionShowTanChuang: ActionShowTanChuang,
//     showAlert: showAlert,
//     showToast: showToast,
//     showPopWaiting: showPopWaiting,
//     buildRequestParam: buildRequestParam,
//     ipToNumber: ipToNumber,
//     numberToIp: numberToIp,
//     PrefixInteger: PrefixInteger,
//     showLoadingView: showLoadingView,
//     getRandomInt: getRandomInt,
//     playEffects: playEffects,
//     showBindView: showBindView,
//     showShopView: showShopView,
// };
