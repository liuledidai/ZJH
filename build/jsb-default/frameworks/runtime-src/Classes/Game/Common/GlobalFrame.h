//
//  GlobalFrame.h
//  NiuNiuGame
//
//  Created by anxijun on 16/4/1.
//
//

#ifndef GlobalFrame_h
#define GlobalFrame_h

#include "GlobalDef.h"
#include "GlobalProperty.h"


//////////////////////////////////////////////////////////////////////////
//宏定义

//游戏状态
#define GS_FREE							0								//空闲状态
#define GS_PLAYING						100								//游戏状态

//////////////////////////////////////////////////////////////////////////
//IPC 网络事件

#define IPC_MAIN_SOCKET					1								//网络消息

#define IPC_SUB_SOCKET_SEND				1								//网络发送
#define IPC_SUB_SOCKET_RECV				2								//网络接收

//IPC 网络包结构
struct IPC_SocketPackage
{
    CMD_Command							Command;						//命令信息
    BYTE								cbBuffer[SOCKET_PACKET];		//数据缓冲
};

//////////////////////////////////////////////////////////////////////////
//IPC 配置信息

#define IPC_MAIN_CONFIG					2								//配置信息

#define IPC_SUB_SERVER_INFO				1								//房间信息
#define IPC_SUB_COLUMN_INFO				2								//列表信息

//游戏信息
struct IPC_GF_ServerInfo
{
    DWORD								dwUserID;						//用户 I D
    WORD								wTableID;						//桌子号码
    WORD								wChairID;						//椅子号码
    WORD								wKindID;						//类型标识
    WORD								wServerID;						//房间标识
    WORD								wGameGenre;						//游戏类型
    WORD								wChairCount;					//椅子数目
    BYTE								cbHideUserInfo;					//隐藏信息
    DWORD								dwVideoAddr;					//视频地址
    TCHAR								szKindName[KIND_LEN];			//类型名字
    TCHAR								szServerName[SERVER_LEN];		//房间名称
};

//////////////////////////////////////////////////////////////////////////
//IPC 用户信息

#define IPC_MAIN_USER					3								//用户信息

#define IPC_SUB_USER_COME				1								//用户信息
#define IPC_SUB_USER_STATUS				2								//用户状态
#define IPC_SUB_USER_SCORE				3								//用户积分
#define IPC_SUB_GAME_START				4								//游戏开始
#define IPC_SUB_GAME_FINISH				5								//游戏结束
#define IPC_SUB_UPDATE_FACE				6								//更新头像
#define IPC_SUB_MEMBERORDER				7								//更新头像

//用户状态
struct IPC_UserStatus
{
    DWORD								dwUserID;						//用户 I D
    WORD								wNetDelay;						//网络延时
    BYTE								cbUserStatus;					//用户状态
};

//用户分数
struct IPC_UserScore
{
    LONG								lLoveliness;					//用户魅力
    DWORD								dwUserID;						//用户 I D
    tagUserScore						UserScore;						//用户积分
};

//会员等级
struct IPC_MemberOrder
{
    BYTE								cbMember;					//会员等级
    DWORD								dwUserID;						//用户 I D
};

//用户分数
struct IPC_UpdateFace
{
    DWORD								dwCustomFace;					//用户 I D
};

//////////////////////////////////////////////////////////////////////////
//IPC 控制信息

#define IPC_MAIN_CONCTROL				4								//控制信息

#define IPC_SUB_START_FINISH			1								//启动完成
#define IPC_SUB_CLOSE_FRAME				2								//关闭框架
#define IPC_SUB_JOIN_IN_GAME			3								//加入游戏

//加入游戏
struct IPC_JoinInGame
{
    WORD								wTableID;						//桌子号码
    WORD								wChairID;						//椅子号码
};

//////////////////////////////////////////////////////////////////////////
//网络命令码

#define MDM_GF_GAME						99								//游戏消息
#define MDM_GF_FRAME					98								//框架消息
#define	MDM_GF_PRESENT					97								//礼物消息
#define	MDM_GF_BANK						96								//银行消息

#define SUB_GF_INFO						111								//游戏信息
#define SUB_GF_USER_READY				112								//用户同意
#define SUB_GF_LOOKON_CONTROL			113								//旁观控制
#define SUB_GF_KICK_TABLE_USER			114								//踢走用户
#define SUB_GF_WRITE_MATCH_SCORE        115                             //写比赛成绩

#define SUB_GF_OPTION					116								//游戏配置
#define SUB_GF_SCENE					117								//场景信息

#define SUB_GF_USER_CHAT				118								//用户聊天

#define SUB_GF_MESSAGE					119								//系统消息

//#define SUB_GF_GIFT						400								//赠送消息

#define SUB_GF_BANK_STORAGE				250								//银行存储
#define SUB_GF_BANK_GET					251								//银行提取
#define SUB_GF_BANK_PRESENT				252								//赠送金币
#define SUB_GF_BANK_MODIFY_PASS			253								//修改密码
#define SUB_GF_BANK_QUERY				254								//查询金币
#define SUB_GF_BANK_PRESENT_QUREY		255								//查询用户
#define SUB_GF_BANK_CLOSE				256								//退出
#define SUB_GF_TRAN_RECORD				257								//转帐记录
#define SUB_GF_USER_INFO_QUREY			258								//查询用户
#define SUB_GF_USER_RECHARGE			259								//用户充值

#define SUB_GF_FLOWER_ATTRIBUTE			530								//鲜花属性
#define SUB_GF_FLOWER					531								//鲜花消息
#define SUB_GF_EXCHANGE_CHARM			532								//兑换魅力

#define SUB_GF_PROPERTY					510								//道具消息
#define SUB_GF_PROPERTY_RESULT			511								//道具结果
#define SUB_GF_RESIDUAL_PROPERTY		512								//剩余道具
#define SUB_GF_PROP_ATTRIBUTE			513								//道具属性
#define SUB_GF_PROP_BUGLE				514								//喇叭道具
#define SUB_GF_QUERY_USER_INFO			515								//鲜花消息
#define SUB_GF_SEND_HONG_BAO			516								//发红包
#define SUB_GF_QIANG_HONG_BAO			517								//发红包

struct CMD_GF_TranGoldRecord
{
    DWORD								dwUserID;
    TCHAR								szPassWord[PASS_LEN];
    
};

//版本信息
struct CMD_GF_Info
{
    BYTE								bAllowLookon;					//旁观标志
};

//游戏配置
struct CMD_GF_Option
{
    BYTE								bGameStatus;					//游戏状态
    BYTE								bAllowLookon;					//允许旁观
};

//旁观控制
struct CMD_GF_LookonControl
{
    DWORD								dwUserID;						//用户标识
    BYTE								bAllowLookon;					//允许旁观
};

//踢走用户
struct CMD_GF_KickTableUser
{
    DWORD								dwUserID;						//用户 I D
};

//聊天结构
struct CMD_GF_UserChat
{
    WORD								wChatLength;					//信息长度
    COLORREF							crFontColor;					//信息颜色
    DWORD								dwSendUserID;					//发送用户
    DWORD								dwTargetUserID;					//目标用户
    TCHAR								szChatMessage[MAX_CHAT_LEN];	//聊天信息
};
//////////////////////////////////////////////////////////////////////////

//消息类型
#define SMT_INFO						0x0001							//信息消息
#define SMT_EJECT						0x0002							//弹出消息
#define SMT_GLOBAL						0x0004							//全局消息
#define SMT_CLOSE_GAME					0x1000							//关闭游戏

//消息数据包
struct CMD_GF_Message
{
    WORD								wMessageType;					//消息类型
    WORD								wMessageLength;					//消息长度
    TCHAR								szContent[1024];				//消息内容
};

//////////////////////////////////////////////////////////////////////////

//共享内存定义
struct tagShareMemory
{
    WORD								wDataSize;						//数据大小
    WORD								hWndGameFrame;					//框架句柄
    WORD								hWndGamePlaza;					//广场句柄
    WORD								hWndGameServer;					//房间句柄
};

//////////////////////////////////////////////////////////////////////////

//发送场所
#define	LOCATION_GAME_ROOM				1								//游戏房间
#define	LOCATION_PLAZA_ROOM				2								//大厅房间

//////////////////////////////////////////////////////////////////////////

//赠送结构
struct CMD_GF_Gift
{
    BYTE								cbSendLocation;					//发送场所
    DWORD								dwSendUserID;					//赠送者ID
    DWORD								dwRcvUserID;					//接受者ID
    WORD								wGiftID;						//礼物	ID
    WORD								wFlowerCount;					//鲜花数目
};

//赠送结构
struct CMD_GF_Gift_New
{
    BYTE								cbSendLocation;					//发送场所
    DWORD								dwSendGameID;					//赠送者ID
    DWORD								dwRcvGameID;					//接受者ID
    TCHAR								szRcvUserName[32];				//用户名称qq5069099
    WORD								wGiftID;						//礼物	ID
    WORD								wFlowerCount;					//鲜花数目
    TCHAR								szPassword[PASS_LEN];			//用户密码
};

//道具结构
struct CMD_GF_Property
{
    BYTE								cbSendLocation;					//发送场所
    int									nPropertyID;					//道具ID
    DWORD								dwPachurseCount;				//购买数目
    DWORD								dwOnceCount;					//单次数目
    DWORD								dwSourceUserID;					//赠送玩家
    DWORD								dwTargetUserID;					//目标玩家
    TCHAR								szRcvUserName[32];				//用户名称
    TCHAR								szBankPassword[PASS_LEN];		//银行密码
};

//喇叭结构
struct CMD_GF_BugleProperty
{
    BYTE								cbSendLocation;					//发送场所
    TCHAR								szUserName[32];					//玩家帐号
    COLORREF							crText;							//文字颜色
    TCHAR								szContext[BUGLE_MAX_CHAR];		//喇叭内容
};
//发红包结构体
struct CMD_GF_SendHongBao
{
    BYTE								cbSendLocation;					//发送场所
    int									iHongBaoCount;					//红包个数
    LONG								lHongBaoGold;					//红包总金额
    TCHAR								szBankPassword[PASS_LEN];		//银行密码
    COLORREF							crText;							//文字颜色
    TCHAR								szHongBaoWords[HONG_BAO_WORDS];	//红包留言
};
//发红包结果
struct CMD_GF_SendResult
{
    bool								bSuccess;						//是否成功
    TCHAR								szSendUserName[NAME_LEN];		//发红包玩家昵称
    LONGLONG							llHongBaoID;					//红包ID
    COLORREF							crText;							//文字颜色
    TCHAR								szHongBaoWords[HONG_BAO_WORDS];	//红包留言
};
//抢红包结构体
struct CMD_GF_QiangHongBao
{
    LONGLONG							llHongBaoID;					//红包编号
};
//抢红包结果
struct CMD_GF_QiangResult
{
    bool								bSuccess;						//是否成功
    bool								bCanDelete;						//是否在记录中可以删除
    LONGLONG							iHongBaoID;						//红包编号
    DWORD								dwQiangUserID;					//抢红包玩家ID
    LONG								lQiangGold;						//抢到的金币
    TCHAR								szMessage[32];					//信息说明
};
//兑换结构
struct CMD_GF_ExchangeCharm
{
    BYTE								cbSendLocation;					//发送场所
    LONG								lLoveliness;					//魅力数值
    DWORD								lGoldValue;						//金币数值
    TCHAR								szBankPassword[PASS_LEN];		//用户密码
};

//赠送通知
struct CMD_GF_GiftNotify
{
    BYTE								cbSendLocation;					//发送场所
    DWORD								dwSendGameID;					//赠送者ID
    DWORD								dwRcvGameID;					//接受者ID
    TCHAR								szRcvUserName[32];				//用户名称qq5069099
    WORD								wGiftID;						//礼物	ID
    WORD								wFlowerCount;					//鲜花数目
    int									nStatus;						//0,玩家不存在,1玩家存在,2,赠送成功
};

//存储金币
struct CMD_GF_BankStorage
{
    DWORD								dwUserID;						//用户ID
    LONGLONG 							lStorageValue;					//存储金币
    BYTE								cbGameAction;					//游戏操作
    TCHAR								szPassword[PASS_LEN];			//用户密码
};

//提取金币
struct CMD_GF_BankGet
{
    DWORD								dwUserID;						//用户ID
    LONGLONG							lGetValue;						//提取金币
    BYTE								cbGameAction;					//游戏操作
    TCHAR								szPassword[PASS_LEN];			//用户密码
};

//赠送金币
struct CMD_GF_Present
{
    DWORD								dwUserID;						//用户ID
    DWORD								dwPresentUserID;				//赠送ID
    DWORD								dwPresentGameID;				//赠送游戏ID
    LONGLONG							lPresentValue;					//赠送金币
    DWORD								dwRecvGameID;					//接受ID
    TCHAR								szRecvUser[NAME_LEN];			//接受用户
    TCHAR								szPassword[PASS_LEN];			//用户密码
    bool								bIsNickName;					//是否昵称
};

//赠送金币
struct CMD_GF_Recharge
{
    LONGLONG							lRechargeValue;					//赠送金币
};

//修改密码
struct CMD_GF_ModifyPass
{
    DWORD								dwUserID;						//用户ID
    TCHAR								szOldPassword[PASS_LEN];		//旧密码
    TCHAR								szNewPassword[PASS_LEN];		//新密码
};

//剩余道具
struct CMD_GF_ResidualProperty
{
    DWORD								dwResidualTime[PROPERTY_COUNT];	//剩余时间
};

////比赛成绩 2011.9.17 
struct CMD_GF_WriteMatchScore
{
    LONGLONG                         lMatchScore;                      ///比赛成绩
};

#endif /* GlobalFrame_h */
