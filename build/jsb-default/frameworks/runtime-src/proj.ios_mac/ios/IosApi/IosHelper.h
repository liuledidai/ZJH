//
//  IosHelper.h
//  kkddz
//
//  Created by macbook110 on 13-6-4.
//
//

#ifndef __kkddz__IosHelper__
#define __kkddz__IosHelper__

#include <iostream>
using namespace std;

class  IosHelper
{
public:
	//微信登录
	static bool sendAuthRequest();
	
    static void startBrowserJni( const char * url);
    //分享到微信朋友
    static void shareWithWeixinFriendTxt(const char * pTitle,const char * pDescript,const char * pUrl);
    //分享到微信朋友圈
    static void shareWithWeixinCircleTxt(const char * pTitle,const char * pDescript,const char * pUrl);
	
    static void shareWithWeixinFriendImg(const char * pTxt,const char *FileName);
    
    static void shareWithWeixinCircleImg(const char * pTxt,const char *FileName);
    
    static void shareWithWeixinFriendApp(const char * pTxt);
    
    static void sharedComplete();
	
    static bool isInstallWx();
    
    static void wxShareOpenAppCallback(const char *para);
    
    static void compressImageData();
    
	static void beginRecord(const char *_fileName);
    static void endRecord();
};

#endif /* defined(__kkddz__IosHelper__) */
