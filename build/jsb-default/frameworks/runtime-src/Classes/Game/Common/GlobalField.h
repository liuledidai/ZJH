#ifndef GLOBAL_FIELD_HEAD_FILE
#define GLOBAL_FIELD_HEAD_FILE

#include "GlobalDef.h"

//////////////////////////////////////////////////////////////////////////

//数据描述头
struct tagDataDescribe
{
	WORD							wDataSize;						//数据大小
	WORD							wDataDescribe;					//数据描述
};

//////////////////////////////////////////////////////////////////////////

//默认信息
#define DTP_NULL					0								//无效数据

//房间信息
#define DTP_LOGON_MB_ROOM_LEVEL		3000							//房间等级
#define DTP_LOGON_MB_ROOM_CELL		3001							//房间底分
#define DTP_LOGON_MB_ROOM_MINSCORE	3002							//房间最小分数
#define DTP_LOGON_MB_DDZ_BOMB_MAX	3003							//斗地主最大倍数
#define DTP_LOGON_MB_ROOM_INFO		3004							//房间信息

//基础信息
#define DTP_USER_ID					1								//用户 I D
#define DTP_GAME_ID					2								//用户 I D
#define	DTP_USER_ACCOUNTS			3								//用户帐号
#define	DTP_USER_PASS				4								//用户密码
#define DTP_USER_GENDER				5								//用户性别
#define DTP_USER_FACE				6								//用户头像
#define DTP_USER_RIGHT				7								//用户权限
#define DTP_MASTER_RIGHT			8								//管理权限
#define	DTP_UNDER_WRITE				9								//个性签名
#define	DTP_LOVE_LINESS				10								//用户魅力
#define DTP_USER_COUPON				11                              //玩家奖券
#define DTP_USER_MATCHTICKET        12                              //玩家参赛券

//状态信息
#define DTP_USER_STATUS				100								//用户状态
#define DTP_USER_TABLE				101								//游戏桌号
#define DTP_USER_CHAIR				102								//椅子号码
#define DTP_USER_PING				103								//网络延时
#define DTP_USER_INDEX				104								//用户索引
#define DTP_USER_ROUND				105								//循环计数
#define DTP_LOOK_ON_USER			106								//旁观玩家

//积分信息
#define DTP_USER_WIN				200								//胜局盘数
#define DTP_USER_LOST				201								//输局盘数
#define DTP_USER_DRAW				202								//和局盘数
#define DTP_USER_FLEE				203								//逃局盘数
#define DTP_WIN_RATE				204								//用户胜率
#define DTP_LOST_RATE				205								//用户输率
#define DTP_DRAW_RATE				206								//用户和率
#define DTP_FLEE_RATE				207								//用户逃率
#define DTP_USER_TAX				208								//用户税收
#define DTP_INSURE_SCORE			209								//存储金币
#define DTP_GAME_GOLD				210								//游戏金币
#define DTP_USER_SCORE				211								//用户分数
#define DTP_USER_PLAY_COUNT			212								//总局盘数
#define DTP_USER_EXPERIENCE			213								//用户经验
#define DTP_GAME_LEVEL				214								//游戏等级
#define DTP_COMMUNITY_LEVEL			215								//社区等级

//扩展信息
#define DTP_USER_GROUP_ID			300								//社团 I D
#define DTP_USER_GROUP_NAME			301								//社团名字
#define DTP_USER_NOTE				302								//用户备注
#define DTP_USER_DESCRIBE			303								//用户描述
#define DTP_USER_COMPANION			304								//用户关系
#define	DTP_USER_NICK_NAME			305								//用户昵称
#define DTP_USER_LEVEL              306                             //等级图标
#define DTP_USER_SEX                307                             //性别图标

//系统信息
#define DTP_COMPUTER_ID				1000							//机器序列
#define DTP_STATION_PAGE			1001							//站点页面
#define DTP_OPTION_BUFFER			1002							//配置信息
#define DTP_ANDROID_MSG             1003                            //机器人信息
#define DTP_MOBIE_LOGON				1004							//手机登陆

#define DTP_LOGON_PACK1				1010							//扩充辅助加密
#define DTP_LOGON_PACK2				1011							//扩充辅助加密
#define DTP_LOGON_PACK3				1012							//扩充辅助加密

#define DTP_ENCRPT_LOGON_ROOM		2000							//进入房间扩充包
#define DTP_ENCRPT_LOGON_ROOM_WX	2001							//进入房间微信ID
#define DTP_ENCRPT_LOGON_PLAZA_RET	2002							//登陆大厅成功返回
#define DTP_CONTROL_LOGON_PLAZA		2003							//登陆大厅预留控制

#define LOGON_ROOM_SIZE	128

//////////////////////////////////////////////////////////////////////////


//避免使用map
struct tagLogonRoom
{
    unsigned char	szCodeMsg[LOGON_ROOM_SIZE];																//加密内容 二进制流
};



//数据包辅助类
class CSendPacketHelper
{
	//变量定义
protected:
	WORD								m_wDataSize;					//数据大小
	WORD								m_wBufferSize;					//缓冲大小
	BYTE								* m_pcbBuffer;					//缓冲指针

	//函数定义
public:
	//构造函数
	CSendPacketHelper(void * pcbBuffer, WORD wBufferSize)
	{
		m_wDataSize=0;
		m_wBufferSize=wBufferSize;
		m_pcbBuffer=(BYTE *)pcbBuffer;
	}
	//析构函数
	virtual ~CSendPacketHelper() {}

	//功能函数
public:
	//清理数据
	void CleanData() { m_wDataSize=0; }
	//获取大小
	WORD GetDataSize() { return m_wDataSize; }
	//获取缓冲
	void * GetDataBuffer() { return m_pcbBuffer; }
	//插入数据
	bool AddPacket(void * pData, WORD wDataSize, WORD wDataType)
	{
		//效验大小
		assert((wDataSize+sizeof(tagDataDescribe)+m_wDataSize)<=m_wBufferSize);
		if ((wDataSize+sizeof(tagDataDescribe)+m_wDataSize)>m_wBufferSize) return false;

		//插入数据
		assert(m_pcbBuffer!=NULL);
		tagDataDescribe * pDataDescribe=(tagDataDescribe *)(m_pcbBuffer+m_wDataSize);
		pDataDescribe->wDataSize=wDataSize;
		pDataDescribe->wDataDescribe=wDataType;

		//插入数据
		if (wDataSize>0)
		{
			assert(pData!=NULL);
			CopyMemory(pDataDescribe+1,pData,wDataSize);
		}

		//设置数据
		m_wDataSize+=sizeof(tagDataDescribe)+wDataSize;
	
		return true;
	}
};

/////////////////////////////////////////////////////////////////////////////////////////

//数据包辅助类
class CRecvPacketHelper
{
	//变量定义
protected:
	WORD								m_wDataPos;						//数据点
	WORD								m_wDataSize;					//数据大小
	BYTE								* m_pcbBuffer;					//缓冲指针

	//函数定义
public:
	//构造函数
	CRecvPacketHelper(void* pcbBuffer, WORD wDataSize)
	{
		m_wDataPos=0;
		m_wDataSize=wDataSize;
		m_pcbBuffer=(BYTE *)pcbBuffer;
	}
	//析构函数
	virtual ~CRecvPacketHelper() {}

	//功能函数
public:
	//获取数据
	void * GetData(tagDataDescribe & DataDescribe)
	{
		//效验数据
		if (m_wDataPos>=m_wDataSize) 
		{
//			ASSERT(m_wDataPos==m_wDataSize);
			DataDescribe.wDataSize=0;
			DataDescribe.wDataDescribe=DTP_NULL;
			return NULL;
		}

		//获取数据
//		ASSERT((m_wDataPos+sizeof(tagDataDescribe))<=m_wDataSize);
		memcpy(&DataDescribe,m_pcbBuffer+m_wDataPos,sizeof(tagDataDescribe));
//		ASSERT((m_wDataPos+sizeof(tagDataDescribe)+DataDescribe.wDataSize)<=m_wDataSize);

		//效验数据
		if ((m_wDataPos+sizeof(tagDataDescribe)+DataDescribe.wDataSize)>m_wDataSize)
		{
			DataDescribe.wDataSize=0;
			DataDescribe.wDataDescribe=DTP_NULL;
			return NULL;
		}

		//设置数据
		void * pData=NULL;
		if (DataDescribe.wDataSize>0) pData=m_pcbBuffer+m_wDataPos+sizeof(tagDataDescribe);
		m_wDataPos+=sizeof(tagDataDescribe)+DataDescribe.wDataSize;
		return pData;
	};
};

//////////////////////////////////////////////////////////////////////////

#endif