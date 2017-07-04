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
        this.roomList = [];
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
        //     LONGLONG							llGameScore;					//游戏金币
        //     LONGLONG							llInsureScore;					//银行金币
        //     TCHAR								szAccounts[NAME_LEN];			//登录帐号
        //     TCHAR								szNickName[NAME_LEN];			//昵称
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
        this.llGameScore = pData.readint64();
        this.llInsureScore = pData.readint64();
        this.szAccounts = pData.readstring(32);
        this.szNickName = pData.readstring(32);
        // console.log(this);
        // for (var prop in this) {
        //     if (typeof(this[prop]) == "function") continue;
        //     console.log('this.' + prop, '=', this[prop]);
        // }
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