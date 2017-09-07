var BaseFrame = require("BaseFrame");
require("MD5");
var game_cmd = require("CMD_Game");
var plaza_cmd = require("CMD_Plaza");
var zjh_cmd = require("CMD_ZaJinHua");
var GlobalUserData = require("GlobalUserData");
var GameServerItem = require("GameServerItem");
var GlobalDef = require("GlobalDef");
cc.Class({
    extends: BaseFrame,

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
    onLoad: function () {
        this._super();
        // for (var prop in GlobalUserData) {
        //   console.log('GlobalUserData.' + prop, '=', GlobalUserData[prop]);
        // }
    },
    onConnectCompeleted: function() {
        cc.director.emit("LoadingViewOnConnect",{message:"正在登录游戏服务器..."});
        if(this._logonMode === 0) {
            this.sendLogon();
        }
        else if(this._logonMode === 1){
            this.sendRegister();
        }
        else if(this._logonMode === 2){
            this.sendVisitor();
        }
        else{
            this.onCloseSocket();
            console.log("未知登录模式");
        }
    },
    onSocketEvent: function(main,sub,pData) {
        if(main === plaza_cmd.MDM_GP_LOGON_MOBILE){
            this.onSubLogonEvent(sub,pData);
        }
        else if(main === plaza_cmd.MDM_GP_SERVER_LIST){
            this.onRoomListEvent(sub,pData);
        }
        else if(main === plaza_cmd.MDM_GP_SYSTEM)
        {
            console.log("系统消息");
        }
    },
    onSubLogonEvent: function(sub,pData) {
        if (sub === plaza_cmd.SUB_GP_LOGON_SUCCESS_MOBILE){
            GlobalUserData.onLoadData(pData);
            var bRememberPwd = cc.sys.localStorage.getItem("bRememberPwd");
            if(GlobalUserData.isGuest !== true) {
                GlobalUserData.szPassWord = cc.md5Encode(this._szPassword);
                if (bRememberPwd == 'true') {
                    cc.sys.localStorage.setItem('account', this._szAccount);
                    cc.sys.localStorage.setItem('password', this._szPassword);
                }
                else {
                    cc.sys.localStorage.removeItem('account');
                    cc.sys.localStorage.removeItem('password');
                }
            }
            console.log("logonframe logon success");
            cc.director.emit("LogonSuccess");
        }
        else if (sub === plaza_cmd.SUB_GP_LOGON_ERROR_MOBILE) {
            this.onCloseSocket();
            console.log("logonframe login error");
            //登陆失败
            // struct CMD_GP_LogonError
            // {
            //     LONG								lErrorCode;						//错误代码
            //     char								szErrorDescribe[128];			//错误消息
            // };
            var logonError = {};
            logonError.lErrorCode = pData.readint();
            logonError.szErrorDescribe = pData.readstring();
            if (logonError.szErrorDescribe) {
                cc.director.emit("LoadingViewError",{msg:logonError.szErrorDescribe,type:GlobalDef.SMT_CLOSE_GAME});
            }
        }
        else if(sub === plaza_cmd.SUB_GP_LOGON_FINISH_MOBILE){
            console.log("logonframe login finish");
            this.onCloseSocket();
            cc.director.emit("LoadingViewOnLogonFinish",{message:"正在进入游戏大厅..."});
            // cc.director.loadScene("PlazaScene");
            // cc.sys.garbageCollect();
        }
    },
    onRoomListEvent: function(sub,pData) {
        console.log("logonframe onRoomListEvent");
        switch(sub){
            case plaza_cmd.SUB_GP_LIST_TYPE:
                console.log("SUB_GP_LIST_TYPE");
                break;
            case plaza_cmd.SUB_GP_LIST_KIND:
                console.log("SUB_GP_LIST_KIND");
                break;
            case plaza_cmd.SUB_GP_LIST_STATION:
                console.log("SUB_GP_LIST_STATION");
                break;
            case plaza_cmd.SUB_GP_LIST_SERVER:
                var pGameServer = new GameServerItem();
                //游戏房间列表结构
                // struct tagGameServer
                // {
                //     WORD								wSortID;							//排序号码
                //     WORD								wKindID;							//名称号码
                //     WORD								wServerID;							//房间号码
                //     WORD								wStationID;							//站点号码
                //     WORD								wServerPort;						//房间端口
                //     DWORD								dwServerAddr;						//房间地址
                //     DWORD								dwOnLineCount;						//在线人数
                //     TCHAR								szServerName[SERVER_LEN];			//房间名称
                // };
                pGameServer.onInit(pData);
                // for (var prop in pGameServer) {
                //     if (typeof(pGameServer[prop]) == "function") continue;
                //     console.log('pGameServer.' + prop, '=', pGameServer[prop]);
                // }
                GlobalUserData.roomList.push(pGameServer);
                // console.log(pGameServer);
                break;
            default:
                break;
        }
    },
    sendLogon: function() {
        var logonData = CCmd_Data.create();
        logonData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE,plaza_cmd.SUB_GP_LOGON_MOBILE);
        logonData.pushdword(1);
        logonData.pushdword(0);
        logonData.pushdword(zjh_cmd.KIND_ID);
        logonData.pushdword(1);
        logonData.pushstring(this._szAccount,32);
        // logonData.pushstring("25d55ad283aa400af464c76d713c07ad",33);
        if (GlobalUserData.isGuest) {
            logonData.pushstring(this._szPassword,33);
        }
        else{
            logonData.pushstring(cc.md5Encode(this._szPassword),33);
        }
        logonData.pushstring("",33);
        logonData.pushstring("",32);
        this.sendSocketData(logonData);
    },
    sendRegister: function() {
        var registerData = CCmd_Data.create();
        var dwMobileSysType = 1;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            dwMobileSysType = 2;
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            dwMobileSysType = 1;
        }
        registerData.setcmdinfo(plaza_cmd.MDM_GP_LOGON_MOBILE,plaza_cmd.SUB_GP_REGISTER_MOBILE);
        registerData.pushword(1);
        registerData.pushbyte(1);
        registerData.pushdword(dwMobileSysType);
        registerData.pushdword(zjh_cmd.KIND_ID);
        registerData.pushdword(1);
        registerData.pushstring(this._szRegAccount,32);
        registerData.pushstring(cc.md5Encode(this._szRegPassword),33);
        registerData.pushstring(this._szMobilePhone,32);
        registerData.pushstring(this._szNickName,32);
        registerData.pushstring(this._szMobileAuth,32);
        registerData.pushstring("",33);
        this.sendSocketData(registerData);
        // struct CMD_GP_RegisterAccountsMoblie
        // {
        //     WORD								wFaceID;						// 头像标识
        //     BYTE								cbGender;						// 用户性别
        //     DWORD								dwMobileSysType;				//手机操作系统类型(1苹果系统 2安卓系统)
        //     DWORD								dwMobileAppKind;				// 广场手机版本
        //     DWORD								dwMobileAppVersion;				// 广场手机版本
        //     TCHAR								szAccounts[NAME_LEN];			// 登录帐号
        //     TCHAR								szPassWord[PASS_LEN];			// 登录密码
        //     TCHAR                               szMobilephone[MOBILEPHONE_LEN]; // 手机
        //     TCHAR								szNickName[NAME_LEN];			// 昵称
        //     TCHAR								szMobileAuth[NAME_LEN];			//手机验证码
        //     TCHAR								szMobileMachine[COMPUTER_ID_LEN];//机器序列号
        // };
    },
    sendVisitor: function() {
        this.sendLogon();
    },
    onLogonByAccount: function(szAccount,szPassword) {
        this._szAccount = szAccount;
        this._szPassword = szPassword;
        this._szMobilePhone = "0123456789";
        GlobalUserData.isGuest = false;
        this._logonMode = 0;
        console.log("[logonframe][onLogonByAccount] "+szAccount+" # "+ szPassword);
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
        //     return false;
        // }
        if(this.onCreateSocket(GlobalDef.LOGON_SERVER_IP,GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onLogonByAccount][onCreateSocket] success");
        return true;
    },
    onLogonByVisitor: function(szAccount,szPassword) {
        this._szAccount = szAccount;
        this._szPassword = szPassword;
        this._szMobilePhone = "0123456789";
        this._logonMode = 2;
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onLogonByVisitor][onCreateSocket] fail");
        //     return false;
        // }
        if(this.onCreateSocket(GlobalDef.LOGON_SERVER_IP,GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onLogonByVisitor][onCreateSocket] success");
        return true;
    },
    onRegister: function(szAccount,szPassword,szNickName,szMobileAuth) {
        this._szRegAccount = szAccount;
        this._szRegPassword = szPassword;
        this._szNickName = szNickName;
        this._szMobilePhone = szAccount;
        this._szMobileAuth = szMobileAuth;
        this._logonMode = 1;
        // if(this.onCreateSocket("122.226.186.38",9009) === false) {
        //     console.log("[logonframe][onRegister][onCreateSocket] fail");
        //     return false;
        // }
        if(this.onCreateSocket(GlobalDef.LOGON_SERVER_IP,GlobalDef.PORT_LOGON_SERVER) === false) {
            console.log("[logonframe][onLogonByAccount][onCreateSocket] fail");
            return false;
        }
        console.log("[logonframe][onRegister][onCreateSocket] success");
        return true;
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
