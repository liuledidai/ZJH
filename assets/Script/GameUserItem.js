var GlobalUserData = require("GlobalUserData");
var GameUserItem = cc.Class({
    //用户信息结构
    // struct tagUserData
    // {
    //     //用户属性
    //     WORD								wFaceID;							//头像索引
    //     DWORD								dwCustomFaceVer;					//上传头像
    //     DWORD								dwUserID;							//用户 I D
    //     DWORD								dwGroupID;							//社团索引
    //     DWORD								dwGameID;							//用户 I D
    //     DWORD								dwUserRight;						//用户等级
    //     LONG								lLoveliness;						//用户魅力
    //     DWORD								dwMasterRight;						//管理权限
    //     TCHAR								szName[32];					//用户名字
    //     TCHAR								szGroupName[32];				//社团名字
    //     TCHAR								szUnderWrite[32];		//个性签名
        
    //     //用户属性
    //     BYTE								cbGender;							//用户性别
    //     BYTE								cbMemberOrder;						//会员等级
    //     BYTE								cbMasterOrder;						//管理等级
        
    //     //用户积分
    //     LONGLONG							lInsureScore;						//消费金币
    //     LONGLONG							lGameGold;							//游戏金币
    //     LONGLONG							lScore;								//用户分数
    //     LONG								lWinCount;							//胜利盘数
    //     LONG								lLostCount;							//失败盘数
    //     LONG								lDrawCount;							//和局盘数
    //     LONG								lFleeCount;							//断线数目
    //     LONG								lExperience;						//用户经验
        
    //     //用户状态
    //     WORD								wTableID;							//桌子号码
    //     WORD								wChairID;							//椅子位置
    //     BYTE								cbUserStatus;						//用户状态
        
    //     //其他信息
    //     BYTE								cbCompanion;						//用户关系
    //     DWORD								dwPropResidualTime[15];	//道具时间
    // };
        //用户属性
    wFaceID:undefined,                            //头像索引
    dwCustomFaceVer:undefined,                    //上传头像
    dwUserID:undefined,                           //用户 I D
    dwGroupID:undefined,                          //社团索引
    dwGameID:undefined,                           //用户 I D
    dwUserRight:undefined,                        //用户等级
    lLoveliness:undefined,                        //用户魅力
    dwMasterRight:undefined,                      //管理权限
    szName:undefined,                   //用户名字
    szGroupName:undefined,             //社团名字
    szUnderWrite:undefined,      //个性签名
    
    //用户属性
    cbGender:undefined,                           //用户性别
    cbMemberOrder:undefined,                      //会员等级
    cbMasterOrder:undefined,                      //管理等级
    
    //用户积分
    lInsureScore:undefined,                       //消费金币
    lGameGold:undefined,                          //游戏金币
    lScore:undefined,                             //用户分数
    lWinCount:undefined,                          //胜利盘数
    lLostCount:undefined,                         //失败盘数
    lDrawCount:undefined,                         //和局盘数
    lFleeCount:undefined,                         //断线数目
    lExperience:undefined,                        //用户经验
    
    //用户状态
    wTableID:undefined,                           //桌子号码
    wChairID:undefined,                           //椅子位置
    cbUserStatus:undefined,                       //用户状态
    
    // //其他信息
    // cbCompanion:undefined,                        //用户关系
    // dwPropResidualTime:undefined, //道具时间
    initDataByUserInfoHead: function (pData) {
        var userInfoHead = this.readUserInfoHead(pData);
        this.dwUserID = userInfoHead.dwUserID;
        this.wTableID = userInfoHead.wTableID;
        this.wChairID = userInfoHead.wChairID;
        this.cbUserStatus = userInfoHead.cbUserStatus;
        this.dwUserRight = userInfoHead.dwUserRight;
        this.dwMasterRight = userInfoHead.dwMasterRight;
        if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
            this.wFaceID = userInfoHead.wFaceID;
            this.dwCustomFaceVer = userInfoHead.dwCustomFaceVer;
            this.cbGender = userInfoHead.cbGender;
            this.cbMemberOrder = userInfoHead.cbMemberOrder;
            this.cbMasterOrder = userInfoHead.cbMasterOrder;
            this.dwGameID = userInfoHead.dwGameID;
            this.dwGroupID = userInfoHead.dwGroupID;
            this.lLoveliness = userInfoHead.lLoveliness;

            this.lScore = userInfoHead.UserScoreInfo.lScore;
            this.lGameGold = userInfoHead.UserScoreInfo.lGameGold;
            this.lInsureScore = userInfoHead.UserScoreInfo.lInsureScore;
            this.lWinCount = userInfoHead.UserScoreInfo.lWinCount;
            this.lLostCount = userInfoHead.UserScoreInfo.lLostCount;
            this.lDrawCount = userInfoHead.UserScoreInfo.lDrawCount;
            this.lFleeCount = userInfoHead.UserScoreInfo.lFleeCount;
            this.lExperience = userInfoHead.UserScoreInfo.lExperience;
        }
        pData.blockEnd();
        while(true){
            //默认信息
            // #define DTP_NULL					0								//无效数据
            //房间信息
            // #define	DTP_USER_ACCOUNTS			3								//用户帐号
            // #define	DTP_UNDER_WRITE				9								//个性签名
            // #define DTP_USER_GROUP_NAME			301								//社团名字

            // pData.setmaxsize(1);
            console.log("[GameUserItem][initDataByUserInfoHead] [offset,datasize] = " + [pData.getReadOffset(),pData.getDataSize()]);
            var dataSize = pData.readword(true);
            var dataDescribe = pData.readword(true);
            console.log("[GameUserItem][initDataByUserInfoHead]size = "+dataSize+" describe = "+dataDescribe);
            if (dataDescribe === 0) {
                break;
            }
            // pData.setmaxsize(1);
            switch(dataDescribe){
                case 3:
                    this.szName = "游戏用户";
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szName = pData.readstring(dataSize,true);
                    }
                    break;
                case 9:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szUnderWrite = pData.readstring(dataSize,true);
                    }
                    break;
                case 301:
                    if (userInfoHead.dwUserID === GlobalUserData.dwUserID || true) {
                        this.szGroupName = pData.readstring(dataSize,true);
                    }
                    break;
                default:
                    break;
            }
        }
    },
    readUserInfoHead: function (pData) {
        //用户基本信息结构
        // struct tagUserInfoHead
        // {
        //     //用户属性
        //     WORD								wFaceID;							//头像索引
        //     DWORD								dwUserID;							//用户 I D
        //     DWORD								dwGameID;							//游戏 I D
        //     DWORD								dwGroupID;							//社团索引
        //     DWORD								dwUserRight;						//用户等级
        //     LONG								lLoveliness;						//用户魅力
        //     DWORD								dwMasterRight;						//管理权限
            
        //     //用户属性
        //     BYTE								cbGender;							//用户性别
        //     BYTE								cbMemberOrder;						//会员等级
        //     BYTE								cbMasterOrder;						//管理等级
            
        //     //用户状态
        //     WORD								wTableID;							//桌子号码
        //     WORD								wChairID;							//椅子位置
        //     BYTE								cbUserStatus;						//用户状态
            
        //     //用户积分
        //     tagUserScore						UserScoreInfo;						//积分信息
                    //         //用户积分信息
                    // struct tagUserScore
                    // {
                    //     LONGLONG							lScore;								//用户分数
                    //     LONGLONG							lGameGold;							//游戏金币
                    //     LONGLONG							lInsureScore;						//存储金币
                    //     LONG								lWinCount;							//胜利盘数
                    //     LONG								lLostCount;							//失败盘数
                    //     LONG								lDrawCount;							//和局盘数
                    //     LONG								lFleeCount;							//断线数目
                    //     LONG								lExperience;						//用户经验
                    // };
            
        //     //扩展信息
        //     //LONG								lInsureScore;						//消费金币
        //     //LONG								lGameGold;							//游戏金币
        //     DWORD								dwCustomFaceVer;					//上传头像
        //     DWORD								dwPropResidualTime[15];	//道具时间
        // BYTE                                cbUserType;                     //用户类型
        // TCHAR								szWeChatImgURL[256];			// 微信头相
        // TCHAR								szWeChatNickName[NAME_LEN];		// 微信昵称
        // };
        var userInfoHead = {};
        userInfoHead.wFaceID = pData.readword();                            //头像索引
        userInfoHead.dwUserID = pData.readdword();                           //用户 I D
        userInfoHead.dwGameID = pData.readdword();                           //游戏 I D
        userInfoHead.dwGroupID = pData.readdword();                          //社团索引
        userInfoHead.dwUserRight = pData.readdword();                        //用户等级
        userInfoHead.lLoveliness = pData.readint();                        //用户魅力
        userInfoHead.dwMasterRight = pData.readdword();                      //管理权限
        
        //用户属性
        userInfoHead.cbGender = pData.readbyte();                           //用户性别
        userInfoHead.cbMemberOrder = pData.readbyte();                      //会员等级
        userInfoHead.cbMasterOrder = pData.readbyte();                      //管理等级
        
        //用户状态
        userInfoHead.wTableID = pData.readword();                           //桌子号码
        userInfoHead.wChairID = pData.readword();                           //椅子位置
        userInfoHead.cbUserStatus = pData.readbyte();                       //用户状态
        
        //用户积分
        pData.blockBegin("tagUserScore",8);
        userInfoHead.UserScoreInfo = {};
        userInfoHead.UserScoreInfo.lScore = pData.readint64();                             //用户分数
        userInfoHead.UserScoreInfo.lGameGold = pData.readint64();                          //游戏金币
        userInfoHead.UserScoreInfo.lInsureScore = pData.readint64();                       //存储金币
        userInfoHead.UserScoreInfo.lWinCount = pData.readint();                          //胜利盘数
        userInfoHead.UserScoreInfo.lLostCount = pData.readint();                         //失败盘数
        userInfoHead.UserScoreInfo.lDrawCount = pData.readint();                         //和局盘数
        userInfoHead.UserScoreInfo.lFleeCount = pData.readint();                         //断线数目
        userInfoHead.UserScoreInfo.lExperience = pData.readint();                        //用户经验
        pData.blockEnd();
        userInfoHead.dwCustomFaceVer = pData.readdword();                    //上传头像
        userInfoHead.dwPropResidualTime = [];//道具时间
        for (var index = 0; index < 15; index++) {
            var val = pData.readdword();
            userInfoHead.dwPropResidualTime.push(val);
        }
        userInfoHead.cbUserType = pData.readbyte();
        userInfoHead.szWeChatImgURL = pData.readstring(256);
        userInfoHead.szWeChatNickName = pData.readstring(32);
        console.log("[GameUserItem][userInfoHead] = " + JSON.stringify(userInfoHead,null,' '));
        return userInfoHead;
    }
});

module.exports = GameUserItem;