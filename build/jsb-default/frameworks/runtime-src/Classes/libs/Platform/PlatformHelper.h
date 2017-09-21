//
//  PlatformHelper.hpp
//  MyCppGame
//
//  Created by 李文龙 on 2016/12/9.
//
//

#ifndef __WX_Helper_H__
#define __WX_Helper_H__

#include <stdio.h>

class PlatformHelper
{
public:
    static bool loginWX(const char* APP_ID,const char* AppSecret);
    
    static void shareImageWX(const char* ImgPath,int nType);
    static void shareTextWX(const char* kText,int nType);
    static void shareUrlWX(const char* kUrl,const char* kTitle,const char* kDesc,int nType);
    
    static void shareAppData(const char* roomCardID, int nType);
    
    static void showWebView(const char* url );

    static void startSoundRecord();
    static std::string stopSoundRecord();
    
    static void getUrlFile(std::string url);
    
    static std::string kRecordFileName;
    
    static long long getNowTimeOfMilSec();
    static long long getNowTimeOfSec();
};

#endif /* PlatformHelper_hpp */
