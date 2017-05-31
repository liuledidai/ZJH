#ifndef _TYPEDEF_H_
#define _TYPEDEF_H_

#include "cocos2d.h"

//初始化
#if ( CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)

typedef unsigned int		DWORD;
typedef unsigned short      WORD;
typedef unsigned char		BYTE;
typedef int                 LONG;
typedef DWORD               COLORREF;
typedef  const char *		LPCSTR;
typedef long long			INT64;
typedef long long           __int64;
typedef long long			LONGLONG;

typedef unsigned int        UINT;
typedef int                 INT;
typedef char                TCHAR;

typedef int                 INT_PTR, *PINT_PTR;

typedef struct _GUID {
    unsigned int   Data1;
    unsigned short Data2;
    unsigned short Data3;
    unsigned char  Data4[8];
} GUID;

#ifndef assert
#define assert(cond)         CCAssert(cond,"CCAssert")
#endif  // CCAssert

#define CopyMemory(Destination,Source,Length) memcpy((Destination),(Source),(Length))
#define MoveMemory(Destination,Source,Length) memmove((Destination),(Source),(Length))
#define ZeroMemory(Destination,Length) memset((Destination),0,(Length))
#define FillMemory(Destination,Length,Fill) memset((Destination),(Fill),(Length))
#define CountArray(Array) (sizeof(Array)/sizeof(Array[0]))
#define CountStringBuffer(String) ((UINT)((strlen(String)+1)*sizeof(TCHAR)))

#define LOWORD(_dw)     ((WORD)(((DWORD_PTR)(_dw)) & 0xffff))
#define HIWORD(_dw)     ((WORD)((((DWORD_PTR)(_dw)) >> 16) & 0xffff))

#define RGB(r,g,b)      ((COLORREF)(((BYTE)(r)|((WORD)((BYTE)(g))<<8))|(((DWORD)(BYTE)(b))<<16)))

//接口释放
#define  SafeRelease(pObject) { if (pObject!=NULL) { pObject->release(); pObject=NULL; } }

//删除指针
#define  SafeDelete(pData) { try { delete pData; } catch (...) { assert(false); } pData=NULL; }

//删除数组
#define  SafeDeleteArray(pData) { try { delete [] pData; } catch (...) { assert(false); } pData=NULL; }


//无效数值
#define INVALID_BYTE				((BYTE)(0xFF))						//无效数值
#define INVALID_WORD				((WORD)(0xFFFF))					//无效数值
#define INVALID_DWORD				((DWORD)(0xFFFFFFFF))				//无效数值


//////////////////////////////////////////////////////////////////////////

#define CCLOG_BYTE(bytes,size) { \
    for (int i = 0; i < size; i++) { \
        if (i!=0&&i%4==0) {\
            printf(" "); \
        } \
        printf("%02X", bytes[i]); \
    } \
}

#endif

#endif