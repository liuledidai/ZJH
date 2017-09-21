//
//  PlatformHelper.cpp
//  MyCppGame
//
//  Created by 李文龙 on 2016/12/9.
//
//
#include "cocos2d.h"
#include "PlatformHelper.h"
#include "MissionWeiXin.h"
#include "MissionUrlScheme.h"
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#include <Jni.h>
#include "platform/android/jni/JniHelper.h"
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#include "IosHelper.h"
#endif

USING_NS_CC;

#define JAVA_CLASSNAME  "org/cocos2dx/javascript/Native"

std::string PlatformHelper::kRecordFileName = "";

extern "C"
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    //微信登录成功回调
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_Native_WxLoginGetAccessToken(JNIEnv* env, jclass method, jstring param)
    {
        const char* data = env->GetStringUTFChars(param, 0);
        cocos2d::log("JNICALL :%s",data);
        MissionWeiXin::getInstance()->access_token_callback(data,true);
        env->ReleaseStringUTFChars(param, data);
    }
    //微信登录失败回调
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_Native_WxLoginGetFailToken(JNIEnv* env, jclass method, jstring param)
    {
        const char* data = env->GetStringUTFChars(param, 0);
        cocos2d::log("JNICALL :%s",data);
        MissionWeiXin::getInstance()->access_token_callback(data,false);
        env->ReleaseStringUTFChars(param, data);
    }
    
    //外部应用通过url打开应用回调
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_Native_OpenAppByUrlCallback(JNIEnv* env, jclass method, jstring param)
    {
        const char* UserParam = env->GetStringUTFChars(param, 0);
        cocos2d::log("JNICALL :%s",UserParam);
        MissionUrlScheme::getInstance()->openAppByUrlCallback(UserParam);
        env->ReleaseStringUTFChars(param, UserParam);
    }
    
    //微信分享结果回调
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_Native_WxShareResultCallback(JNIEnv* env, jclass method, jint errcode)
    {
        int retcode = errcode;
        cocos2d::log("JNICALL :%d",retcode);
        MissionWeiXin::getInstance()->share_callback(retcode);
    }
    //通用传递字符串
    JNIEXPORT jstring JNICALL Java_org_cocos2dx_javascript_Native_getValue(JNIEnv* env, jclass method, jstring param)
    {
        const char* key = env->GetStringUTFChars(param, 0);
        const char* retstr = "";
        cocos2d::log("JNICALL getValue :%s",key);
        if(strcmp(key,"WX_APP_ID") == 0){
            retstr = (char*)MissionWeiXin::getInstance()->getAppid();
        }
        env->ReleaseStringUTFChars(param, key);
        
        return env->NewStringUTF(retstr);//注释4
    }
#endif
}

bool PlatformHelper::loginWX(const char* APP_ID,const char* AppSecret)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"LoginWX","(Ljava/lang/String;Ljava/lang/String;)V");
    if (isHave)
    {
        jstring jAPP_ID = minfo.env->NewStringUTF(APP_ID);
        jstring jAppSecret = minfo.env->NewStringUTF(AppSecret);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jAPP_ID,jAppSecret);
        
        minfo.env->DeleteLocalRef(jAPP_ID);
        minfo.env->DeleteLocalRef(jAppSecret);
        minfo.env->DeleteLocalRef(minfo.classID);
        cocos2d::log("JniFun call LoginWX over!");
        return true;
    }
    else
    {
        cocos2d::log("JniFun call LoginWX error!");
        return false;
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    return IosHelper::sendAuthRequest();
#endif
}

void PlatformHelper::shareImageWX(const char* ImgPath,int nType)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"ShareImageWX","(Ljava/lang/String;I)V");
    if (isHave)
    {
        jstring jImgPath = minfo.env->NewStringUTF(ImgPath);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jImgPath,nType);
        cocos2d::log("JniFun call ShareImageWX over!");
        
        minfo.env->DeleteLocalRef(jImgPath);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call ShareImageWX error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    if (nType == 0)
    {
        IosHelper::shareWithWeixinFriendImg("",ImgPath);
    }
    else
    {
        IosHelper::shareWithWeixinCircleImg("",ImgPath);
    }
#endif
}

void PlatformHelper::shareTextWX(const char* kText,int nType)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"ShareTextWX","(Ljava/lang/String;I)V");
    if (isHave)
    {
        jstring jkText = minfo.env->NewStringUTF(kText);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jkText,nType);
        cocos2d::log("JniFun call ShareTextWX over!");
        
        minfo.env->DeleteLocalRef(jkText);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call ShareTextWX error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    if (nType == 0)
    {
        IosHelper::shareWithWeixinFriendTxt(kText, kText, "www.baidu.com");
    }
    else
    {
        IosHelper::shareWithWeixinCircleTxt(kText, kText, "www.baidu.com");
    }
#endif
}

void PlatformHelper::shareUrlWX(const char* kUrl,const char* kTitle,const char* kDesc,int nType)
{
    
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"ShareUrlWX","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V");
    if (isHave)
    {
        jstring jkUrlt = minfo.env->NewStringUTF(kUrl);
        jstring jkTitle = minfo.env->NewStringUTF(kTitle);
        jstring jkDesc = minfo.env->NewStringUTF(kDesc);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jkUrlt,jkTitle,jkDesc,nType);
        cocos2d::log("JniFun call ShareUrlWX over!");
        
        minfo.env->DeleteLocalRef(jkUrlt);
        minfo.env->DeleteLocalRef(jkTitle);
        minfo.env->DeleteLocalRef(jkDesc);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call ShareUrlWX error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    if (nType == 0)
    {
        IosHelper::shareWithWeixinFriendTxt(kTitle, kDesc, kUrl);
    }
    else
    {
        IosHelper::shareWithWeixinCircleTxt(kTitle, kDesc, kUrl);
    }
#endif
}

void PlatformHelper::shareAppData(const char* roomCardID,int nType)
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"shareAppDataWX","(Ljava/lang/String;I)V");
    if (isHave)
    {
        jstring jsRoomCardID = minfo.env->NewStringUTF(roomCardID);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jsRoomCardID,nType);
        cocos2d::log("JniFun call ShareUrlWX over!");
        
        minfo.env->DeleteLocalRef(jsRoomCardID);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call ShareUrlWX error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    if (nType == 0)
    {
        IosHelper::shareWithWeixinFriendApp(roomCardID);
    }
    else
    {
        IosHelper::shareWithWeixinFriendApp(roomCardID);
    }
#endif
}

void PlatformHelper::showWebView(const char* url )
{
    
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME,"showWebView","(Ljava/lang/String;)V");
    if (isHave)
    {
        jstring jurl = minfo.env->NewStringUTF(url);
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID,jurl);
        cocos2d::log("JniFun call showWebView over!");
        
        minfo.env->DeleteLocalRef(jurl);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call showWebView error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    IosHelper::startBrowserJni(url);
#endif
}
    
void PlatformHelper::startSoundRecord()
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME, "startSoundRecord", "()V");
    if (isHave)
    {
        minfo.env->CallStaticVoidMethod(minfo.classID, minfo.methodID);
        cocos2d::log("JniFun call startSoundRecord over!");
        
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call startSoundRecord error!");
    }
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    kRecordFileName = cocos2d::FileUtils::getInstance()->getWritablePath()+"SoundRecord.wav";
    
    if (FileUtils::getInstance()->isFileExist(kRecordFileName))
    {
        FileUtils::getInstance()->removeFile(kRecordFileName);
    }
    
    IosHelper::beginRecord(kRecordFileName.c_str());
#endif
}

std::string PlatformHelper::stopSoundRecord()
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
    std::string str;
    JniMethodInfo minfo;
    bool isHave = JniHelper::getStaticMethodInfo(minfo,JAVA_CLASSNAME, "stopSoundRecord", "()Ljava/lang/String;");
    if (isHave)
    {
        jstring jFileName = (jstring)minfo.env->CallStaticObjectMethod(minfo.classID, minfo.methodID);
        const char *newStr = minfo.env->GetStringUTFChars(jFileName, 0);
        str = newStr;
        cocos2d::log("JniFun call stopSoundRecord over :");
        cocos2d::log("%s",str.c_str());
        minfo.env->ReleaseStringUTFChars(jFileName, newStr);
        minfo.env->DeleteLocalRef(minfo.classID);
    }
    else
    {
        cocos2d::log("JniFun call stopSoundRecord error!");
    }
    return str;
#endif
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS
    IosHelper::endRecord();
    return kRecordFileName;
#endif
    return "";
}

long long PlatformHelper::getNowTimeOfMilSec()
{
    struct timeval tv;
    gettimeofday(&tv,NULL);
    return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

long long PlatformHelper::getNowTimeOfSec()
{
    struct timeval tv;
    gettimeofday(&tv,NULL);
    return tv.tv_sec;
}
