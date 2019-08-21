//
//  IosHelper.cpp
//  kkddz
//
//  Created by macbook110 on 13-6-4.
//
//

#include "IosHelper.h"
#include "../../../Classes/libs/JJParamUntil.h"
#include "../../../Classes/libs/Platform/MissionWeiXin.h"
#include "MissionWeiXin.h"

//static NSString *kAuthOpenID = @"oxvSYw2f6y5skRRmIoukNHjisCOA";

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)

#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <UIKit/UIDevice.h>
#include <sys/socket.h> // Per msqr
#include <sys/sysctl.h>
#include <net/if.h>
#include <net/if_dl.h>
#import "WXApi.h"
#import "WXApiObject.h"
#endif//

bool IosHelper::sendAuthRequest()
{ 
    //构造SendAuthReq结构体 
    SendAuthReq* req =[[[SendAuthReq alloc ] init ] autorelease];
    req.scope = @"snsapi_userinfo";
    req.state = @"jjhgame";
    //第三方向微信终端发送一个SendAuthReq消息结构
    //需要设置，appid，等相关微信信息
    return [WXApi sendReq:req];
}

void IosHelper::shareWithWeixinCircleTxt(const char * pTitle,const char * pDescript,const char * pUrl)
{
    NSString *title = [NSString stringWithCString:pTitle encoding:NSUTF8StringEncoding];
    NSString *descript = [NSString stringWithCString:pDescript encoding:NSUTF8StringEncoding];
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = descript;
    message.messageExt = title;
    message.messageAction = title;
    
    NSString *imageName = [[[[NSBundle mainBundle] infoDictionary]valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    [message setThumbImage:[UIImage imageNamed:imageName]];
    
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = [NSString stringWithCString:pUrl encoding:NSUTF8StringEncoding];
    
    message.mediaObject = ext;
    
    
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init]autorelease];
    req.bText = NO;
    req.message = message; 
    req.scene = WXSceneTimeline;
    
    [WXApi sendReq:req];
}
void IosHelper::shareWithWeixinFriendTxt(const char * pTitle,const char * pDescript,const char * pUrl)
{
    NSString *title = [NSString stringWithCString:pTitle encoding:NSUTF8StringEncoding];
    NSString *descript = [NSString stringWithCString:pDescript encoding:NSUTF8StringEncoding];
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = descript;
    message.messageExt = title;
    message.messageAction = title;
    
    NSString *imageName = [[[[NSBundle mainBundle] infoDictionary]valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    [message setThumbImage:[UIImage imageNamed:imageName]];
    
    WXWebpageObject *ext = [WXWebpageObject object];
    ext.webpageUrl = [NSString stringWithCString:pUrl encoding:NSUTF8StringEncoding];
    
    message.mediaObject = ext;
    
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init]autorelease];
    req.bText = NO;
    req.message = message; 
    req.scene = WXSceneSession;
    
    [WXApi sendReq:req];

}

void IosHelper::shareWithWeixinFriendImg(const char * pTxt,const char *FileName)
{
    NSString *txt = [NSString stringWithCString:pTxt encoding:NSUTF8StringEncoding];
    NSString *filePath = [NSString stringWithCString:FileName encoding:NSUTF8StringEncoding];
    WXMediaMessage *message = [WXMediaMessage message];
    
    message.title = txt;
    message.description = txt;
    
    //生成缩略图
    UIImage *image = [UIImage imageNamed:filePath];
    CGSize newsize;
    newsize.width = 150.f;
    newsize.height = image.size.height * 150.f / image.size.width;
    
    UIGraphicsBeginImageContext(newsize);
    [image drawInRect:CGRectMake(0,0,newsize.width,newsize.height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData *dataImage = UIImageJPEGRepresentation(newImage, 0.8);
    
    [message setThumbData:dataImage];
    
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:filePath];
    
    message.mediaObject = ext;
    
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init]autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    
    [WXApi sendReq:req];
}
void IosHelper::shareWithWeixinCircleImg(const char * pTxt,const char *FileName)
{
    NSString *txt = [NSString stringWithCString:pTxt encoding:NSUTF8StringEncoding];
    NSString *filePath = [NSString stringWithCString:FileName encoding:NSUTF8StringEncoding];
    WXMediaMessage *message = [WXMediaMessage message];
    
    message.title = txt;
    message.description = txt;
    
    //生成缩略图
    UIImage *image = [UIImage imageNamed:filePath];
    CGSize newsize;
    newsize.width = 150.f;
    newsize.height = image.size.height * 150.f / image.size.width;
    
    UIGraphicsBeginImageContext(newsize);
    [image drawInRect:CGRectMake(0,0,newsize.width,newsize.height)];
    UIImage* newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    NSData *dataImage = UIImageJPEGRepresentation(newImage, 0.8);
    
    [message setThumbData:dataImage];
    
    WXImageObject *ext = [WXImageObject object];
    ext.imageData = [NSData dataWithContentsOfFile:filePath];
    
    message.mediaObject = ext;
    
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init]autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneTimeline;
    
    [WXApi sendReq:req];
}

void IosHelper::shareWithWeixinFriendApp(const char * pTxt)
{
    NSString *text = [NSString stringWithCString:pTxt encoding:NSUTF8StringEncoding];
    
    Byte* pBuffer = (Byte *)malloc(1024);
    memset(pBuffer, 0, 1024);
    NSData* data = [NSData dataWithBytes:pBuffer length:1024];

    WXAppExtendObject *ext = [WXAppExtendObject object];
    ext.extInfo = @"<xml>extend info</xml>";
    ext.url = @"http://weixin.qq.com";;
    ext.fileData = data;
    
    WXMediaMessage *message = [WXMediaMessage message];
    
    message.title = @"好友邀请您一起玩集结号十三水！！！";
    message.description = @"房间号123132";
    message.messageAction = @"<action>dotaliTest</action>";
    
    NSString *imageName = [[[[NSBundle mainBundle] infoDictionary]valueForKeyPath:@"CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconFiles"] lastObject];
    [message setThumbImage:[UIImage imageNamed:imageName]];
    
    message.mediaObject = ext;
    
    SendMessageToWXReq* req = [[[SendMessageToWXReq alloc] init]autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    
    [WXApi sendReq:req];
}

void IosHelper::startBrowserJni( const char * url)
{
    NSString *nsFineName = [NSString stringWithCString:url encoding:NSUTF8StringEncoding];
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:nsFineName]];
}
 AVAudioRecorder *recorder = NULL;
void IosHelper::beginRecord(const char *_fileName)
{
    if (recorder == nil)
    {
        //设置文件名和录音路径
        NSString *recordFilePath = [NSString stringWithCString:_fileName encoding:NSUTF8StringEncoding];
        
        NSDictionary *recordSetting = [NSDictionary dictionaryWithObjectsAndKeys:
                                       [NSNumber numberWithFloat: 8000.0],AVSampleRateKey, //采样率
                                       [NSNumber numberWithInt: kAudioFormatLinearPCM],AVFormatIDKey,
                                       [NSNumber numberWithInt:16],AVLinearPCMBitDepthKey,//采样位数 默认 16
                                       [NSNumber numberWithInt: 1], AVNumberOfChannelsKey,//通道的数目
                                       nil];
        //初始化录音
        NSError *error = nil;
        recorder = [[ AVAudioRecorder alloc] initWithURL:[NSURL URLWithString:recordFilePath] settings:recordSetting error:&error];
    }
    recorder.meteringEnabled = YES;
    [recorder prepareToRecord];
    //开始录音
    UInt32 sessionCategory = kAudioSessionCategory_PlayAndRecord;
    AudioSessionSetProperty(kAudioSessionProperty_AudioCategory, sizeof(sessionCategory), &sessionCategory);
    
    // 扬声器播放
    UInt32 audioRouteOverride = kAudioSessionOverrideAudioRoute_Speaker;
    AudioSessionSetProperty (kAudioSessionProperty_OverrideAudioRoute, sizeof(audioRouteOverride), &audioRouteOverride);
    [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayAndRecord error:nil];
    [[AVAudioSession sharedInstance] setActive:YES error:nil];
    [recorder record];
}

void IosHelper::endRecord()
{
    if (recorder != nil)
    {
        if (recorder.isRecording)
            [recorder stop];
        [recorder release];
        recorder = nil;
    }
}

bool IosHelper::isInstallWx()
{
    return [WXApi isWXAppInstalled];
}

void IosHelper::wxShareOpenAppCallback(const char *para)
{
    const char* pStr = strstr(para,"hzmj?");
    pStr+=5;
    std::string text = pStr;
    
    std::vector<std::string> kVector = JJParamUntil::split(text,"&");
    std::map<std::string, std::string> paraMap;
    
    for (int index = 0; index < kVector.size(); index++)
    {
        std::vector<std::string> tmp = JJParamUntil::split(kVector[index],"=");
        if (tmp.size() == 2)
        {
            paraMap[tmp[0]] = tmp[1];
        }
    }
    
    MissionWeiXin::getInstance()->WxShareOpenAppCallback(paraMap["type"].c_str(), paraMap["roomcard"].c_str());
}
