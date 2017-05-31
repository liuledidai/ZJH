#ifndef CMD_GAME_HEAD_FILE
#define CMD_GAME_HEAD_FILE

//////////////////////////////////////////////////////////////////////////
//登录数据包定义

#define MDM_GR_LOGON				11									//房间登录

#define SUB_GR_LOGON_ACCOUNTS		11									//帐户登录
#define SUB_GR_LOGON_USERID			22									//I D 登录
#define SUB_GR_LOGON_MOBILE			33									//手机登陆

#define SUB_GR_LOGON_SUCCESS		600									//登录成功
#define SUB_GR_LOGON_ERROR			601									//登录失败
#define SUB_GR_LOGON_FINISH			602									//登录完成

//房间帐号登录
struct CMD_GR_LogonByAccounts
{
    TCHAR							szAccounts[NAME_LEN];				//登录帐号
    DWORD							dwProcessVersion;					//进程版本
    TCHAR							szPassWord[PASS_LEN];				//登录密码
    DWORD							dwPlazaVersion;						//广场版本
};

//手机登陆
struct CMD_GR_LogonByUserIDMobile
{
    WORD							wEncryptID;							//随机码1
    WORD							wCodeCheckID;						//随机码2
    DWORD							dwWeiXinCheckID;					//微信验证码
    DWORD							dwUserID;							//用户 I D
    DWORD							dwMobileSysType;					//手机操作系统类型(1苹果系统 2安卓系统)
    DWORD							dwMobileAppVersion;					//游戏APP版本号(与登陆大厅相同)
    TCHAR							szPassWord[PASS_LEN];				//登录密码
    TCHAR							szMobileMachine[COMPUTER_ID_LEN];	//机器序列号
};

//房间 ID 登录
struct CMD_GR_LogonByUserID
{
    TCHAR							szPassWord[PASS_LEN];				//登录密码
    DWORD							dwUserID;							//用户 I D
    DWORD							dwProcessVersion;					//进程版本
    DWORD							dwPlazaVersion;						//广场版本
};

//登录成功消息
struct CMD_GR_LogonSuccess
{
    DWORD							dwUserID;							//用户 I D
};

//登录失败
struct CMD_GR_LogonError
{
    LONG							lErrorCode;							//错误代码
    TCHAR							szErrorDescribe[128];				//错误消息
};

//////////////////////////////////////////////////////////////////////////
//用户数据包定义

#define MDM_GR_USER					22									//用户信息

#define SUB_GR_USER_SIT_REQ			11									//坐下请求
#define SUB_GR_USER_LOOKON_REQ		22									//旁观请求
#define SUB_GR_USER_STANDUP_REQ		33									//起立请求
#define SUB_GR_USER_LEFT_GAME_REQ	44									//离开游戏

#define SUB_GR_USER_COME			600									//用户进入
#define SUB_GR_USER_STATUS			601									//用户状态
#define SUB_GR_USER_SCORE			602									//用户分数
#define SUB_GR_SIT_FAILED			603									//坐下失败
#define SUB_GR_USER_RIGHT			604									//用户权限
#define SUB_GR_MEMBER_ORDER			605									//会员等级
#define SUB_GR_QUERY_GOLD			606									//查询金豆
#define SUB_GR_QUERY_TRAN			607									//查询转帐

#define SUB_GR_USER_CHAT			700									//聊天消息
#define SUB_GR_USER_WISPER			701									//私语消息
#define SUB_GR_USER_RULE			702									//用户规则

#define SUB_GR_USER_INVITE			800									//邀请消息
#define SUB_GR_USER_INVITE_REQ		801									//邀请请求
#define SUB_GR_PRESEND_QUERY		802									//赠送查询
#define SUB_GR_PRESENT_ERROR        803

//会员等级
struct CMD_GR_MemberOrder
{
    DWORD							dwUserID;							//数据库 ID
    BYTE							cbMemberOrder;						//会员等级
};

//用户权限
struct CMD_GR_UserRight
{
    DWORD							dwUserID;							//数据库 ID
    DWORD							dwUserRight;						//用户权限
};

//用户状态
struct CMD_GR_UserStatus
{
    WORD							wTableID;							//桌子位置
    DWORD							dwUserID;							//数据库 ID
    BYTE							cbUserStatus;						//用户状态
    WORD							wChairID;							//椅子位置
};

//用户分数
struct CMD_GR_UserScore
{
    LONG							lLoveliness;						//用户魅力
    //LONG							lInsureScore;						//消费金豆
    //LONG							lGameGold;							//游戏金豆
    DWORD							dwUserID;							//用户 I D
    tagUserScore					UserScore;							//积分信息
};

//struct oneTranRecord
//{
//	//DWORD								dwUserID;
//	TCHAR								szAccounts[NAME_LEN];
//	//DWORD								dwToUserID;
//	TCHAR								szToAccounts[NAME_LEN];
//	LONGLONG							trangold;
//	TCHAR								tranData[15];
//
//};

//查询结果 wsl 2015.4.1
struct oneTranRecord
{
    //DWORD								dwTranGameID;                 //转帐游戏ID
    //TCHAR								dwTranGameID[31];                //转帐游戏ID
    //TCHAR								szTranType[NAME_LEN];			//转帐类型
    //LONGLONG							lPresentValue;					//赠送金豆
    //TCHAR								szTranTime[20];					//转帐时间
    
    TCHAR								szNickName[NAME_LEN];		//用户昵称
    DWORD								dwGameID;					//用户ID
    DWORD								dwCount;					//数量
    TCHAR								szFlowerName[32];			//礼物名称
    TCHAR								szTranType[NAME_LEN];		//转帐类型
};

struct CMD_GP_TranGoldRecordR
{
    BYTE	num;//有几条表
    oneTranRecord	onetranrecord[10];//最多十条记录一发
};

/////用户查询金豆结果 2011.7.15 by gaoshan
struct CMD_GR_UserQuiBanker
{
    LONGLONG							lInsureScore;					//银行金豆
    CMD_GP_TranGoldRecordR				TranRecord;
};

//请求坐下
struct CMD_GR_UserSitReq
{
    BYTE							cbPassLen;							//密码长度
    //DWORD							dwAnswerID;							//回答 I D//兼容积分游戏入座问题
    WORD							wChairID;							//椅子位置
    WORD							wTableID;							//桌子位置
    TCHAR							szTablePass[PASS_LEN];				//桌子密码
};

//邀请用户
struct CMD_GR_UserInviteReq
{
    WORD							wTableID;							//桌子号码
    DWORD							dwUserID;							//用户 I D
};

//坐下失败
struct CMD_GR_SitFailed
{
    TCHAR							szFailedDescribe[256];				//错误描述
};

//聊天结构
struct CMD_GR_UserChat
{
    WORD							wChatLength;						//信息长度
    COLORREF						crFontColor;						//信息颜色
    DWORD							dwSendUserID;						//发送用户
    DWORD							dwTargetUserID;						//目标用户
    TCHAR							szChatMessage[MAX_CHAT_LEN];		//聊天信息
};

//私语结构
struct CMD_GR_Wisper
{
    WORD							wChatLength;						//信息长度
    COLORREF						crFontColor;						//信息颜色
    DWORD							dwSendUserID;						//发送用户
    DWORD							dwTargetUserID;						//目标用户
    TCHAR							szChatMessage[MAX_CHAT_LEN];		//聊天信息
};

//用户规则
struct CMD_GR_UserRule
{
    bool							bPassword;							//设置密码
    bool							bLimitWin;							//限制胜率
    bool							bLimitFlee;							//限制断线
    bool							bLimitScore;						//限制分数
    bool							bCheckSameIP;						//效验地址
    WORD							wWinRate;							//限制胜率
    WORD							wFleeRate;							//限制逃跑
    LONGLONG 						lMaxScore;							//最高分数
    LONGLONG 						lLessScore;							//最低分数
    TCHAR							szPassword[PASS_LEN];				//桌子密码
};

//邀请用户
struct CMD_GR_UserInvite
{
    WORD							wTableID;							//桌子号码
    DWORD							dwUserID;							//用户 I D
};

//////////////////////////////////////////////////////////////////////////
//配置信息数据包

#define MDM_GR_INFO					33									//配置信息

#define SUB_GR_SERVER_INFO			900									//房间配置
#define SUB_GR_ORDER_INFO			901									//等级配置
#define SUB_GR_MEMBER_INFO			902									//会员配置
#define SUB_GR_COLUMN_INFO			903									//列表配置
#define SUB_GR_CONFIG_FINISH		904									//配置完成

//游戏房间信息
struct CMD_GR_ServerInfo
{
    //房间属性
    WORD							wChairCount;						//椅子数目
    WORD							wGameGenre;							//游戏类型
    WORD							wTableCount;						//桌子数目
    WORD							wKindID;							//类型 I D
    DWORD							dwVideoAddr;						//视频地址
    BYTE							cbHideUserInfo;						//隐藏信息
};

//分数描述信息
struct CMD_GR_ScoreInfo
{
    WORD							wDescribeCount;						//描述数目
    WORD							wDataDescribe[16];					//数据标志
};

//等级描述结构
struct tagOrderItem
{
    LONGLONG 						lScore;								//等级积分
    WORD							wOrderDescribe[16];					//等级描述
};

//等级描述信息
struct CMD_GR_OrderInfo
{
    WORD							wOrderCount;						//等级数目
    tagOrderItem					OrderItem[128];						//等级描述
};

//列表项描述结构
struct tagColumnItem
{
    WORD							wColumnWidth;						//列表宽度
    WORD							wDataDescribe;						//字段类型
    TCHAR							szColumnName[16];					//列表名字
};

//列表描述信息
struct CMD_GR_ColumnInfo
{
    WORD							wColumnCount;						//列表数目
    tagColumnItem					ColumnItem[32];						//列表描述
};

//////////////////////////////////////////////////////////////////////////
//房间状态数据包

#define MDM_GR_STATUS				44									//状态信息

#define SUB_GR_TABLE_INFO			600									//桌子信息
#define SUB_GR_TABLE_STATUS			601									//桌子状态

//桌子状态结构
struct tagTableStatus
{
    BYTE							bPlayStatus;						//游戏状态
    BYTE							bTableLock;							//锁定状态
};

//桌子状态数组
struct CMD_GR_TableInfo
{
    WORD							wTableCount;						//桌子数目
    tagTableStatus					TableStatus[512];					//状态数组
};

//桌子状态信息
struct CMD_GR_TableStatus
{
    BYTE							bTableLock;							//锁定状态
    BYTE							bPlayStatus;						//游戏状态
    WORD							wTableID;							//桌子号码
};

//////////////////////////////////////////////////////////////////////////
//管理数据包

#define MDM_GR_MANAGER				55									//管理命令

#define SUB_GR_SEND_WARNING			11									//发送警告
#define SUB_GR_SEND_MESSAGE			22									//发送消息
#define SUB_GR_LOOK_USER_IP			33									//查看地址
#define SUB_GR_KILL_USER			44									//踢出用户
#define SUB_GR_LIMIT_ACCOUNS		55									//禁用帐户
#define SUB_GR_SET_USER_RIGHT		66									//权限设置
#define SUB_GR_OPTION_SERVER		77									//房间设置

//发送警告
struct CMD_GR_SendWarning
{
    WORD							wChatLength;						//信息长度
    DWORD							dwTargetUserID;						//目标用户
    TCHAR							szWarningMessage[MAX_CHAT_LEN];		//警告消息
};

//系统消息
struct CMD_GR_SendMessage
{
    BYTE							cbGame;								//游戏消息
    BYTE							cbRoom;								//游戏消息
    WORD							wChatLength;						//信息长度
    TCHAR							szSystemMessage[MAX_CHAT_LEN];		//系统消息
};

//查看地址
struct CMD_GR_LookUserIP
{
    DWORD							dwTargetUserID;						//目标用户
};

//踢出用户
struct CMD_GR_KillUser
{
    DWORD							dwTargetUserID;						//目标用户
};

//禁用帐户
struct CMD_GR_LimitAccounts
{
    DWORD							dwTargetUserID;						//目标用户
};

//权限设置
struct CMD_GR_SetUserRight
{
    //绑定变量
    BYTE							cbAccountsRight;					//帐号权限
    BYTE							cbGameRight;						//帐号权限
    //目标用户
    DWORD							dwTargetUserID;						//目标用户
    BYTE							cbLimitRoomChat;					//大厅聊天
    //权限变化
    BYTE							cbLimitLookonGame;					//旁观权限
    BYTE							cbLimitGameChat;					//游戏聊天
    BYTE							cbLimitSendWisper;					//发送消息
    BYTE							cbLimitPlayGame;					//游戏权限
};

//设置标志
#define OSF_ROOM_CHAT				1									//大厅聊天
#define OSF_GAME_CHAT				2									//游戏聊天
#define OSF_ROOM_WISPER				3									//大厅私聊
#define OSF_ENTER_GAME				4									//进入游戏
#define OSF_ENTER_ROOM				5									//进入房间
#define OSF_SHALL_CLOSE				6									//即将关闭

//房间设置
struct CMD_GR_OptionServer
{
    BYTE							cbOptionFlags;						//设置标志
    BYTE							cbOptionValue;						//设置标志
};

//////////////////////////////////////////////////////////////////////////
//系统数据包

#define MDM_GR_SYSTEM				66									//系统信息

#define SUB_GR_MESSAGE				200									//系统消息

//消息类型
#define SMT_INFO					0x0001								//信息消息
#define SMT_EJECT					0x0002								//弹出消息
#define SMT_GLOBAL					0x0004								//全局消息
#define SMT_SCORE_NOTENOUGH			0x0008								//金币不够
#define SMT_CLOSE_ROOM				0x1000								//关闭房间
#define SMT_INTERMIT_LINE			0x4000								//中断连接

//消息数据包
struct CMD_GR_Message
{
    WORD							wMessageType;						//消息类型
    WORD							wMessageLength;						//消息长度
    TCHAR							szContent[1024];					//消息内容
};

//////////////////////////////////////////////////////////////////////////
//房间数据包

#define MDM_GR_SERVER_INFO			77									//房间信息

#define SUB_GR_ONLINE_COUNT_INFO	100									//在线信息

//人数信息
struct tagOnLineCountInfo
{
    WORD							wKindID;							//类型标识
    DWORD							dwOnLineCount;						//在线人数
};


#endif