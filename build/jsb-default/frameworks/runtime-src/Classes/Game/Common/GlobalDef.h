#ifndef GLOBAL_DEF_HEAD_FILE
#define GLOBAL_DEF_HEAD_FILE

#include "typedef.h"
#include "GlobalProperty.h"

//////////////////////////////////////////////////////////////////////////
//π´π≤∂®“Â

#define MAX_CHAIR						100								//◊Ó¥Û“Œ◊”
#define MAX_CHAIR_NORMAL				8								//◊Ó¥Û»À ˝

#define INVALID_TABLE					((WORD)(-1))						//Œﬁ–ß◊¿◊”∫≈
#define INVALID_CHAIR					((WORD)(-1))						//Œﬁ–ß“Œ◊”∫≈

#define HMATCH_PORT_MIN					10000							//–° ±»¸◊Ó–°∂Àø⁄∫≈
#define HMATCH_PORT_MAX					20000							//–° ±»¸◊Ó¥Û∂Àø⁄∫≈
#define HMATCH_SIGN_MAX					99								//–° ±»¸µ•≥°±»»¸±®√˚»À ˝…œœﬁ
#define HMATCH_MAXONLINE				500

#define MAX_ANDROID						10								//最大机器
#define MAX_CHAT_LEN					128								//聊天长度
#define LIMIT_CHAT_TIMES				1200							//限时聊天

/////////////////////////////////////////////////////////////////////////////////////////

////测试服务器地址
//#define httpInitUrl                     "http://183.131.74.146:8006/Handle/hz/init.ashx" //app初始化接口地址
//#define httpBaseUrl                     "http://183.131.74.146:8006/Handle"              //web接口地址
//#define httpOpenUrl                     "http://183.131.74.146:8015"                     //找回密码
//#define httpUserCenter                  "http://183.131.74.146:8007/Handle"              //用户中心
//#define LOGON_SERVER_DOMAIN             "183.131.74.146"                                 //登录服务器
//#define LOGON_SERVER_IP                 "183.131.74.146"                                 //登录服务器
//#define PORT_LOGON_SERVER				9008                                             //登陆服务器

//正式服务器地址
#define httpInitUrl                     "http://ver.jjhgame.com/Handle/hz/init.ashx"   //app初始化接口地址
#define httpBaseUrl                     "http://interface.jjhgame.com/Handle"          //web接口地址
#define httpOpenUrl                     "http://user.jjhgame.com/findpasswordHZ.aspx"  //找回密码
#define httpUserCenter                  "http://f.jjhgame.com/Handle"                  //用户中心
#define LOGON_SERVER_DOMAIN             "nnapp.jjhgame.com"                            //登录服务器
#define LOGON_SERVER_IP                 "122.226.186.38"                               //登录服务器
#define PORT_LOGON_SERVER				9009                                           //登陆服务器

//端口定义
#define PORT_VIDEO_SERVER				7600								//视频服务器
#define PORT_CENTER_SERVER				9090								//中心服务器

#define CHANNELID_init                       1                              //渠道号
#define CHANNELID_center                     7                              //渠道号
//网络数据定义
#define SOCKET_VER						0x8C								//网络版本
#define SOCKET_BUFFER					8192								//网络缓冲
#define SOCKET_PACKET					(SOCKET_BUFFER-sizeof(CMD_Head)-2*sizeof(DWORD))

/////////////////////////////////////////////////////////////////////////////////////////

//内核命令码
#define MDM_KN_COMMAND					3									//内核命令
#define SUB_KN_DETECT_SOCKET			5									//检测命令
#define SUB_KN_SHUT_DOWN_SOCKET			9									//中断网络

//Õ¯¬Áƒ⁄∫À
struct CMD_Info
{
	BYTE								cbVersion;							//∞Ê±æ±Í ∂
	BYTE								cbCheckCode;						//–ß—È◊÷∂Œ
	WORD								wPacketSize;						// ˝æ›¥Û–°
};

//Õ¯¬Á√¸¡Ó
struct CMD_Command
{
	WORD								wMainCmdID;							//÷˜√¸¡Ó¬Î
	WORD								wSubCmdID;							//◊”√¸¡Ó¬Î
};

//Õ¯¬Á∞¸Õ∑
struct CMD_Head
{
	CMD_Info							CmdInfo;							//ª˘¥°Ω·ππ
	CMD_Command							CommandInfo;						//√¸¡Ó–≈œ¢
};

//Õ¯¬Á∞¸ª∫≥Â
struct CMD_Buffer
{
	CMD_Head							Head;								// ˝æ›∞¸Õ∑
	BYTE								cbBuffer[SOCKET_PACKET];			// ˝æ›ª∫≥Â
};

//ºÏ≤‚Ω·ππ–≈œ¢
struct CMD_KN_DetectSocket
{
	DWORD								dwSendTickCount;					//∑¢ÀÕ ±º‰
	DWORD								dwRecvTickCount;					//Ω” ’ ±º‰
};

/////////////////////////////////////////////////////////////////////////////////////////

//IPC 数据定义
#define IPC_VER							0x0001								//IPC 版本
#define IPC_IDENTIFIER					0x0001								//标识号码
#define IPC_PACKAGE						4096								//最大 IPC 包
#define IPC_BUFFER						(sizeof(IPC_Head)+IPC_PACKAGE)		//缓冲长度

//IPC 数据包头
struct IPC_Head
{
    WORD								wVersion;							//IPC 版本
    WORD								wDataSize;							//数据大小
    WORD								wMainCmdID;							//主命令码
    WORD								wSubCmdID;							//子命令码
};

//IPC 缓冲结构
struct IPC_Buffer
{
    IPC_Head							Head;								//数据包头
    BYTE								cbBuffer[IPC_PACKAGE];				//数据缓冲
};


//////////////////////////////////////////////////////////////////////////

//≥§∂»∫Í∂®“Â
#define TYPE_LEN						32									//÷÷¿‡≥§∂»
#define KIND_LEN						32									//¿‡–Õ≥§∂»
#define STATION_LEN						32									//’æµ„≥§∂»
#define SERVER_LEN						32									//∑øº‰≥§∂»
#define MODULE_LEN						32									//Ω¯≥Ã≥§∂»

//–‘±∂®“Â
#define GENDER_NULL						0									//Œ¥÷™–‘±
#define GENDER_BOY						1									//ƒ––‘–‘±
#define GENDER_GIRL						2									//≈Æ–‘–‘±

//”Œœ∑¿‡–Õ
#define GAME_GENRE_SCORE				0x0001								//µ„÷µ¿‡–Õ
#define GAME_GENRE_GOLD					0x0002								//¿÷∂π¿‡–Õ
#define GAME_GENRE_MATCH				0x0004								//±»»¸¿‡–Õ
#define GAME_GENRE_EDUCATE				0x0008								//—µ¡∑¿‡–Õ
#define GAME_GENRE_QTHERMATCH			0x0016								//自定义比赛类型

//”Œœ∑¿‡–ÕΩ·ππ
struct tagGameType
{
	WORD								wSortID;							//≈≈–Ú∫≈¬Î
	WORD								wTypeID;							//÷÷¿‡∫≈¬Î
	char								szTypeName[TYPE_LEN];				//÷÷¿‡√˚◊÷
};

//”Œœ∑√˚≥∆Ω·ππ
struct tagGameKind
{
	WORD								wSortID;							//≈≈–Ú∫≈¬Î
	WORD								wTypeID;							//¿‡–Õ∫≈¬Î
	WORD								wKindID;							//√˚≥∆∫≈¬Î
	DWORD								dwMaxVersion;						//◊Ó–¬∞Ê±æ
	DWORD								dwOnLineCount;						//‘⁄œﬂ ˝ƒø
	char								szKindName[KIND_LEN];				//”Œœ∑√˚◊÷
	char								szProcessName[MODULE_LEN];			//Ω¯≥Ã√˚◊÷
};

//”Œœ∑’æµ„Ω·ππ
struct tagGameStation
{
	WORD								wSortID;							//≈≈–Ú∫≈¬Î
	WORD								wKindID;							//√˚≥∆∫≈¬Î
	WORD								wJoinID;							//π“Ω”∫≈¬Î
	WORD								wStationID;							//’æµ„∫≈¬Î
	char								szStationName[STATION_LEN];			//’æµ„√˚≥∆
};

//游戏房间列表结构
struct tagGameServer
{
    WORD								wSortID;							//排序号码
    WORD								wKindID;							//名称号码
    WORD								wServerID;							//房间号码
    WORD								wStationID;							//站点号码
    WORD								wServerPort;						//房间端口
    DWORD								dwServerAddr;						//房间地址
    DWORD								dwOnLineCount;						//在线人数
    TCHAR								szServerName[SERVER_LEN];			//房间名称
};

//游戏房间列表结构
struct tagMobileGameServer
{
    BYTE                                cbRoomLevel;                        //房间等级
    LONG                                lBaseScore;                         //房间底分
    LONG                                lLimitScore;                        //进入限制
    LONG                                lMaxBombLimit;                      //最大倍数限制
    WORD								wSortID;							//排序号码
    WORD								wKindID;							//名称号码
    WORD								wServerID;							//房间号码
    WORD								wStationID;							//站点号码
    WORD								wServerPort;						//房间端口
    DWORD								dwServerAddr;						//房间地址
    DWORD								dwOnLineCount;						//在线人数
    TCHAR								szServerName[SERVER_LEN];			//房间名称
    TCHAR								szDescribeTxt[128];                 //房间信息
};

//LAN游戏房间列表结构
struct LanGameServerInfo
{
    bool								bLanServer;                         //是否是内网服务器
    WORD								wServerPort;						//房间端口
    DWORD                               dwSendTime;                         //服务器信息发送时间
    LONGLONG                            lLessScore;                          //最少分数
    char								szServerAddr[SERVER_LEN];			//房间地址
    TCHAR								szServerName[SERVER_LEN];			//房间名称
};

//”Œœ∑º∂±Ω·ππ
struct tagLevelItem
{
	LONG								lLevelScore;						//º∂±ª˝∑÷
	wchar_t								szLevelName[16];					//º∂±√Ë ˆ
};
//////////////////////////////////////////////////////////////////////////

//”√ªß◊¥Ã¨∂®“Â
#define US_NULL							0x00								//没有状态
#define US_FREE							0x01								//站立状态
#define US_SIT							0x02								//坐下状态
#define US_READY						0x03								//同意状态
#define US_LOOKON						0x04								//旁观状态
#define US_PLAY							0x05								//游戏状态
#define US_OFFLINE						0x06								//断线状态

//≥§∂»∫Í∂®“Â
#define NAME_LEN						32									//√˚◊÷≥§∂»
#define PASS_LEN						33									//√‹¬Î≥§∂»
#define EMAIL_LEN						32									//” œ‰≥§∂»
#define GROUP_LEN						32									//…ÁÕ≈≥§∂»
#define COMPUTER_ID_LEN					33									//ª˙∆˜–Ú¡–
#define UNDER_WRITE_LEN					32									//∏ˆ–‘«©√˚
#define MOBILEPHONE_LEN					32									//∏ˆ–‘«©√˚

//用户积分信息
struct tagUserScore
{
    LONGLONG							lScore;								//用户分数
    LONGLONG							lGameGold;							//游戏金币
    LONGLONG							lInsureScore;						//存储金币
    LONG								lWinCount;							//胜利盘数
    LONG								lLostCount;							//失败盘数
    LONG								lDrawCount;							//和局盘数
    LONG								lFleeCount;							//断线数目
    LONG								lExperience;						//用户经验
};

//”√ªß◊¥Ã¨–≈œ¢
struct tagUserStatus
{
	WORD								wTableID;							//◊¿◊”∫≈¬Î
	WORD								wChairID;							//“Œ◊”Œª÷√
	BYTE								cbUserStatus;						//”√ªß◊¥Ã¨
};

//用户基本信息结构
struct tagUserInfoHead
{
    //用户属性
    WORD								wFaceID;							//头像索引
    DWORD								dwUserID;							//用户 I D
    DWORD								dwGameID;							//游戏 I D
    DWORD								dwGroupID;							//社团索引
    DWORD								dwUserRight;						//用户等级
    LONG								lLoveliness;						//用户魅力
    DWORD								dwMasterRight;						//管理权限
    
    //用户属性
    BYTE								cbGender;							//用户性别
    BYTE								cbMemberOrder;						//会员等级
    BYTE								cbMasterOrder;						//管理等级
    
    //用户状态
    WORD								wTableID;							//桌子号码
    WORD								wChairID;							//椅子位置
    BYTE								cbUserStatus;						//用户状态
    
    //用户积分
    tagUserScore						UserScoreInfo;						//积分信息
    
    //扩展信息
    //LONG								lInsureScore;						//消费金币
    //LONG								lGameGold;							//游戏金币
    DWORD								dwCustomFaceVer;					//上传头像
    DWORD								dwPropResidualTime[PROPERTY_COUNT];	//道具时间
};

//用户信息结构
struct tagUserData
{
    //用户属性
    WORD								wFaceID;							//头像索引
    DWORD								dwCustomFaceVer;					//上传头像
    DWORD								dwUserID;							//用户 I D
    DWORD								dwGroupID;							//社团索引
    DWORD								dwGameID;							//用户 I D
    DWORD								dwUserRight;						//用户等级
    LONG								lLoveliness;						//用户魅力
    DWORD								dwMasterRight;						//管理权限
    TCHAR								szName[NAME_LEN];					//用户名字
    TCHAR								szGroupName[GROUP_LEN];				//社团名字
    TCHAR								szUnderWrite[UNDER_WRITE_LEN];		//个性签名
    
    //用户属性
    BYTE								cbGender;							//用户性别
    BYTE								cbMemberOrder;						//会员等级
    BYTE								cbMasterOrder;						//管理等级
    
    //用户积分
    LONGLONG							lInsureScore;						//消费金币
    LONGLONG							lGameGold;							//游戏金币
    LONGLONG							lScore;								//用户分数
    LONG								lWinCount;							//胜利盘数
    LONG								lLostCount;							//失败盘数
    LONG								lDrawCount;							//和局盘数
    LONG								lFleeCount;							//断线数目
    LONG								lExperience;						//用户经验
    
    //用户状态
    WORD								wTableID;							//桌子号码
    WORD								wChairID;							//椅子位置
    BYTE								cbUserStatus;						//用户状态
    
    //其他信息
    BYTE								cbCompanion;						//用户关系
    DWORD								dwPropResidualTime[PROPERTY_COUNT];	//道具时间
};

//全局用户资料
struct tagGlobalUserData
{
    WORD								wFaceID;						//头像索引
    BYTE								cbGender;						//用户性别
    BYTE								cbMember;						//会员等级
    bool								isGuest;						//是否是游客
    bool                                isOpenRegister;                 //是否开启注册功能
    bool                                isOpenIAP;                      //是否开启苹果iap
    WORD								wEncryptID;						//随机码1
    WORD								wCodeCheckID;					//随机码2
    DWORD								dwUserID;						//用户 I D
    DWORD								dwGameID;						//游戏 I D
    DWORD								dwExperience;					//用户经验
    char                                szMobileAuth[NAME_LEN];         //注册时验证码
    char								szAccounts[NAME_LEN];			//登录帐号
    char                                szNickName[NAME_LEN];           //玩家昵称
    char								szPassWord[PASS_LEN];			//登录密码
    char								szGroupName[GROUP_LEN];			//社团信息
    char								szUnderWrite[UNDER_WRITE_LEN];	//个性签名
    
    //扩展信息
    DWORD								dwCustomFaceVer;				//头像版本
    //钱
    DWORD                               dwFortuneCoin;                  //福币
    LONGLONG							llGameScore;					//游戏金币
    LONGLONG							llInsureScore;					//银行金币
    DWORD                               dwCoupon;                       //贝壳
    DWORD                               dwInsureCoupon;                 //银行贝壳
    DWORD                               dwMatchTicket;                  //参赛券
    BYTE								isFirstBank;					// 首次使用
};

struct tagFishMission
{
	WORD								wMissionID;
	WORD                                wMissionType;
	WORD								wMissionValue;
	WORD								wAwardType;
	LONG								nAwardValue;
	char								szDescribe[50];
};

//»ŒŒÒ ˝æ›
struct tagMission
{
	int                                 nMissionID;
	int	                                nMissionType;
	int									nMissionValue;
	LONGLONG							lAward;
	WORD								wAwardType;
	char								szDescribe[50];
	//»ŒŒÒ ˝æ›
	tagMission()
	{
		nMissionID=0;
		nMissionType=0;
		nMissionValue=0;
		lAward=0;
		wAwardType=0;
	}
};
//////////////////////////////////////////////////////////////////////////

//ª˙∆˜–Ú¡–∫≈Ω·ππ
struct tagClientSerial
{
	DWORD								dwSystemVer;						//œµÕ≥∞Ê±æ
	DWORD								dwComputerID[3];					//ª˙∆˜–Ú¡–
};

//≈‰÷√ª∫≥ÂΩ·ππ
struct tagOptionBuffer
{
	BYTE								cbBufferLen;						// ˝æ›≥§∂»
	BYTE								cbOptionBuf[32];					//…Ë÷√ª∫≥Â
};

struct tagAandroidMsg
{
	BYTE                                cbAndroidType;
};

//////////////////////////////////////////////////////////////////////////
//加密密钥
const DWORD g_dwPacketKey=0x38A1BD72;

//发送映射
const BYTE g_SendByteMap[256]=
{
    0x29,0x6b,0xee,0xbc,0x11,0xa2,0xe4,0xe1,0xb2,0x0b,0x2f,0xd7,0x65,0x3c,0x27,0x09,
    0x73,0xe7,0x43,0xde,0x3b,0x22,0x9e,0x99,0xf2,0x8b,0xab,0xa7,0x6e,0x92,0x17,0x7e,
    0xd3,0xa5,0x5d,0x16,0x93,0x13,0x1f,0x81,0xbf,0xa1,0x4e,0x57,0x4d,0xdc,0x15,0xbb,
    0xad,0x25,0x03,0xae,0xd2,0x4a,0xf1,0xc4,0x7b,0xbd,0x07,0xd0,0xa4,0xe3,0xca,0x69,
    0x60,0x77,0xc2,0xeb,0x58,0xd1,0x68,0x7d,0x42,0x8d,0xc3,0xe2,0xb7,0x86,0xc5,0x08,
    0xdd,0xf8,0x48,0xfc,0xb0,0xff,0x24,0x6d,0x9b,0x59,0x0c,0x63,0x1a,0x4c,0x1d,0xb8,
    0x76,0x0f,0xda,0x38,0xe8,0xef,0x9d,0xd8,0x9c,0x9a,0x1b,0x47,0x01,0x2a,0x39,0x23,
    0x8c,0x35,0xcb,0x30,0xce,0x05,0x98,0xcf,0x32,0xfd,0x31,0x10,0xf5,0xe5,0xa0,0x5e,
    0x3f,0x72,0x82,0x19,0xdf,0xfa,0x3a,0xb4,0x95,0x54,0x94,0xc0,0xd6,0x61,0x33,0x64,
    0x85,0x96,0xa6,0x91,0xc6,0xc7,0x3e,0x3d,0x87,0x34,0xaf,0x50,0x00,0x14,0x2c,0x06,
    0xea,0xa8,0x52,0x6a,0x62,0xb6,0x37,0xa9,0xf3,0x5c,0x6c,0xb3,0x67,0x40,0x04,0x2d,
    0x44,0x66,0xec,0x4b,0x49,0xf0,0x8e,0x1c,0x9f,0x90,0x28,0x74,0xc9,0x41,0x20,0x89,
    0xd4,0x80,0x0d,0x78,0x1e,0xc1,0xf9,0xd5,0xfe,0xa3,0x46,0x0e,0x7f,0x83,0x55,0xb5,
    0x2e,0x7a,0x97,0x88,0xc8,0xe9,0xe6,0x7c,0x53,0x0a,0xf7,0x18,0xd9,0x56,0xf4,0x75,
    0x2b,0xe0,0x12,0x21,0x8f,0x8a,0x51,0xac,0x36,0xed,0xcd,0x45,0x5f,0xcc,0x84,0xdb,
    0x5a,0x70,0x5b,0xb9,0x02,0x79,0x4f,0xfb,0x6f,0xba,0xf6,0xb1,0xbe,0xaa,0x26,0x71
};

//接收映射
const BYTE g_RecvByteMap[256]=
{
    0x9c,0x6c,0xf4,0x32,0xae,0x75,0x9f,0x3a,0x4f,0x0f,0xd9,0x09,0x5a,0xc2,0xcb,0x61,
    0x7b,0x04,0xe2,0x25,0x9d,0x2e,0x23,0x1e,0xdb,0x83,0x5c,0x6a,0xb7,0x5e,0xc4,0x26,
    0xbe,0xe3,0x15,0x6f,0x56,0x31,0xfe,0x0e,0xba,0x00,0x6d,0xe0,0x9e,0xaf,0xd0,0x0a,
    0x73,0x7a,0x78,0x8e,0x99,0x71,0xe8,0xa6,0x63,0x6e,0x86,0x14,0x0d,0x97,0x96,0x80,
    0xad,0xbd,0x48,0x12,0xb0,0xeb,0xca,0x6b,0x52,0xb4,0x35,0xb3,0x5d,0x2c,0x2a,0xf6,
    0x9b,0xe6,0xa2,0xd8,0x89,0xce,0xdd,0x2b,0x44,0x59,0xf0,0xf2,0xa9,0x22,0x7f,0xec,
    0x40,0x8d,0xa4,0x5b,0x8f,0x0c,0xb1,0xac,0x46,0x3f,0xa3,0x01,0xaa,0x57,0x1c,0xf8,
    0xf1,0xff,0x81,0x10,0xbb,0xdf,0x60,0x41,0xc3,0xf5,0xd1,0x38,0xd7,0x47,0x1f,0xcc,
    0xc1,0x27,0x82,0xcd,0xee,0x90,0x4d,0x98,0xd3,0xbf,0xe5,0x19,0x70,0x49,0xb6,0xe4,
    0xb9,0x93,0x1d,0x24,0x8a,0x88,0x91,0xd2,0x76,0x17,0x69,0x58,0x68,0x66,0x16,0xb8,
    0x7e,0x29,0x05,0xc9,0x3c,0x21,0x92,0x1b,0xa1,0xa7,0xfd,0x1a,0xe7,0x30,0x33,0x9a,
    0x54,0xfb,0x08,0xab,0x87,0xcf,0xa5,0x4c,0x5f,0xf3,0xf9,0x2f,0x03,0x39,0xfc,0x28,
    0x8b,0xc5,0x42,0x4a,0x37,0x4e,0x94,0x95,0xd4,0xbc,0x3e,0x72,0xed,0xea,0x74,0x77,
    0x3b,0x45,0x34,0x20,0xc0,0xc7,0x8c,0x0b,0x67,0xdc,0x62,0xef,0x2d,0x50,0x13,0x84,
    0xe1,0x07,0x4b,0x3d,0x06,0x7d,0xd6,0x11,0x64,0xd5,0xa0,0x43,0xb2,0xe9,0x02,0x65,
    0xb5,0x36,0x18,0xa8,0xde,0x7c,0xfa,0xda,0x51,0xc6,0x85,0xf7,0x53,0x79,0xc8,0x55
};

//////////////////////////////////////////////////////////////////////////

#endif
