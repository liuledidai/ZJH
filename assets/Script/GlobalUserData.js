var AudioMng = require("AudioMng");
var plaza_cmd = require("CMD_Plaza");
var GlobalUserData = {
    wFaceID: undefined,					//头像索引
    cbGender: undefined,						//用户性别
    cbMember: undefined,						//会员等级
    isGuest: undefined,						//是否是游客
    isOpenRegister: undefined,                 //是否开启注册功能
    isOpenIAP: undefined,                      //是否开启苹果iap
    wEncryptID: undefined,						//随机码1
    wCodeCheckID: undefined,					//随机码2
    dwUserID: undefined,						//用户 I D
    dwGameID: undefined,						//游戏 I D
    dwExperience: undefined,					//用户经验
    szMobileAuth: undefined,         //注册时验证码
    szAccounts: undefined,			//登录帐号
    szNickName: undefined,           //玩家昵称
    szPassWord: undefined,			//登录密码
    szGroupName: undefined,			//社团信息
    szUnderWrite: undefined,	//个性签名
    
    //扩展信息
    dwCustomFaceVer: undefined,				//头像版本
    //钱
    dwFortuneCoin: undefined,                  //福币
    llGameScore: undefined,					//游戏金币
    llInsureScore: undefined,					//银行金币
    dwCoupon: undefined,                       //贝壳
    dwInsureCoupon: undefined,                 //银行贝壳
    dwMatchTicket: undefined,                  //参赛券
    isFirstBank: undefined,					// 首次使用
    bServerIndex: undefined,                   //进入服务器的index
    wExchangenum: undefined,                   //魅力兑换次数

    roomList: [],
    init: function () {
        if(cc.sys.os == cc.sys.OS_IOS){
            this.isOpenIAP = true;
        }
        else {
            this.isOpenIAP = false;
        }
        cc.loader.loadRes("json/shoppage", function (err, content) {
            console.log(content);
            GlobalUserData.shopData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.shopData, null, ' '));
        });
        cc.loader.loadRes("json/present", function (err, content) {
            console.log(content);
            GlobalUserData.presentData = content;
            // console.log("[GlobalUserData][init] "+JSON.stringify(GlobalUserData.presentData, null, ' '));
        });
        this.roomList = [];
        var music_setting =  JSON.parse(cc.sys.localStorage.getItem('music_setting') || "{}");
        var effect_setting =  JSON.parse(cc.sys.localStorage.getItem('effect_setting') || "{}");
        this.bMusicAble = music_setting.musicable === undefined || music_setting.musicable;
        this.nMusic = (music_setting.musicvalue === undefined && 1.0) || music_setting.musicvalue;
        this.bEffectAble = effect_setting.effectable === undefined || effect_setting.effectable;
        this.nEffect = (effect_setting.effectvalue === undefined && 1.0) || effect_setting.effectvalue;

        if (GlobalUserData.bMusicAble) {
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
        }
        else {
            AudioMng.setMusicVolume(0);
        }
        if (GlobalUserData.bEffectAble) {
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        }
        else {
            AudioMng.setEffectsVolume(0);
        }
    },
    setMusicAble: function (able) {
        this.bMusicAble = able;
        if (able) {
            this.nMusic = 1.0;
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
            AudioMng.resumeMusic();
        }
        else {
            this.nMusic = 0;
            AudioMng.setMusicVolume(GlobalUserData.nMusic);
            AudioMng.pauseMusic();
        }
        var music_setting = {
            musicable:able,
            musicvalue:this.nMusic,
        }
        cc.sys.localStorage.setItem("music_setting",JSON.stringify(music_setting));
    },
    setEffectAble: function (able) {
        this.bEffectAble = able;
        if (able) {
            this.nEffect = 1.0;
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        }
        else {
            this.nEffect = 0;
            AudioMng.setEffectsVolume(GlobalUserData.nEffect);
        }
        var effect_setting = {
            effectable:able,
            effectvalue:this.nEffect,
        }
        cc.sys.localStorage.setItem("effect_setting",JSON.stringify(effect_setting));
    },
    onLoadData: function(pData){
        // struct CMD_GP_LogonSuccessMobile
        // {
        //     //扩展信息
        //     DWORD								dwCustomFaceVer;				//头像版本
        //     BYTE								cbMoorMachine;					//锁定机器
        //     BYTE								cbBindWeiXin;					//绑定微信 WSL
        //     WORD								wFaceID;						//头像索引
        //     BYTE								cbMember;						//会员等级
        //     BYTE								cbGender;						//用户性别
        //     WORD								wEncryptID;						//随机码1
        //     WORD								wCodeCheckID;					//随机码2
        //     DWORD								dwExperience;					//用户经验
        //     DWORD								dwGameID;						//游戏 I D
        //     DWORD								dwUserID;						//用户 I D
        //---- DWORD                               dwLoveLiness;                   //用户魅力值
        //     LONGLONG							llGameScore;					//游戏金币
        //     LONGLONG							llInsureScore;					//银行金币
        //     TCHAR								szAccounts[NAME_LEN];			//登录帐号
        //     TCHAR								szNickName[NAME_LEN];			//昵称
        //-----------新增
        // BYTE                                cbUserType;                     //用户类型
        // TCHAR								szWeChatImgURL[256];			// 微信头相
        // TCHAR								szWeChatNickName[NAME_LEN];		// 微信昵称
        // };
        this.dwCustomFaceVer = pData.readdword();
        this.cbMoorMachine = pData.readbyte();
        this.cbBindWeiXin = pData.readbyte();
        this.wFaceID = pData.readword();
        this.cbMember = pData.readbyte();
        this.cbGender = pData.readbyte();
        this.wEncryptID = pData.readword();
        this.wCodeCheckID = pData.readword();
        this.dwExperience = pData.readdword();
        this.dwGameID = pData.readdword();
        this.dwUserID = pData.readdword();
        this.dwLoveLiness = pData.readdword();
        this.llGameScore = pData.readint64();
        this.llInsureScore = pData.readint64();
        this.szAccounts = pData.readstring(32);
        this.szNickName = pData.readstring(32);

        this.cbUserType = pData.readbyte();
        this.szWeChatImgURL = pData.readstring(256);
        this.szWeChatNickName = pData.readstring(32);
        pData.blockEnd();
        while(true){
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("[GlobalUserData]size = "+dataSize+" describe = "+dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch(dataDescribe){
                case plaza_cmd.DTP_SEND_MOBILE_GUID:
                    this.szUserGUID = pData.readstring(dataSize);
                default:
                    break;
            }
        }
    },
    getRoomByGame: function (wKindID) {
        var roomList = [];
        for (var index = 0; index < this.roomList.length; index++) {
            var element = this.roomList[index];
            if (element.wKindID == wKindID) {
                roomList.push(element);
            }
        }
        return roomList;
    },
};

module.exports = GlobalUserData;