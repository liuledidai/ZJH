#ifndef CMD_MAIL_HEAD_
#define CMD_MAIL_HEAD_

#include "typedef.h"

#define	MDM_USER_MAIL		1


#define MAIL_USER_COME		1
#define MAIL_USER_LEAVE		2
#define	MAIL_USER_UPDATE	3
#define MAIL_USER_MAIL		4

struct mailUserCome{
	DWORD	dwUserID;
	char	szNickName[32];
	WORD	wKindID;
	WORD	wServerID;
// 	WORD	wTableID;
// 	WORD	wChairID;
	//以后再加
};

struct mailUserInfo{
	DWORD	dwUserID;
	char	szNickName[32];
	WORD	wKindID;
	WORD	wServerID;
	WORD	wTableID;
	WORD	wChairID;
	
	mailUserInfo()
	{
		dwUserID = 0xffffffff;
		szNickName[0] = '0';
		wKindID = 0;
		wServerID = 0;
		wTableID = 0;
		wChairID = 0;
	}
};
struct mailUserLeave{
	DWORD	dwUserID;
};

struct mailUserUpdate{
	DWORD	dwUserID;
	WORD	wKindID;
	WORD	wServerID;
	WORD	wTableID;
	WORD	wChairID;
};



struct mailMailInfo{
	DWORD	dwMailID;
	char	szTitle[32];
	char	szInfo[256];
	//携带物品以后再加
};

#endif