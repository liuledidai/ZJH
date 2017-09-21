//
//  WXApiManager.m
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import "WXApiManager.h"
#include "../../../Classes/libs/Platform/MissionWeiXin.h"

@implementation WXApiManager

#pragma mark - LifeCycle
+(instancetype)sharedManager {
    static dispatch_once_t onceToken;
    static WXApiManager *instance;
    dispatch_once(&onceToken, ^{
        instance = [[WXApiManager alloc] init];
    });
    return instance;
}

- (void)dealloc {
    self.delegate = nil;
    [super dealloc];
}

#pragma mark - WXApiDelegate
- (void)onResp:(BaseResp *)resp {
    NSLog(@"wx onResp");
    if ([resp isKindOfClass:[SendMessageToWXResp class]])
    {
        SendMessageToWXResp *messageResp = (SendMessageToWXResp *)resp;
        MissionWeiXin::getInstance()->share_callback(messageResp.errCode);
    }
    else if ([resp isKindOfClass:[SendAuthResp class]])
    {
        int retCode = resp.errCode;
        if (retCode != 0)
        {
            std::string msg = "";
            
            switch (retCode)
            {
                case -1:
                    msg = "微信登录失败";
                    break;
                case -2:
                    msg = "登录失败，用户点击取消";
                    break;
                default:
                    msg = "微信登录失败";
                    break;
            }
            MissionWeiXin::getInstance()->access_token_callback(msg,false);
            return;
        }
        
        SendAuthResp *authResp = (SendAuthResp *)resp;

        MissionWeiXin::getInstance()->access_token_callback([authResp.code cStringUsingEncoding:NSUTF8StringEncoding],true);
    }
    else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]])
    {
        
    }
    else if ([resp isKindOfClass:[WXChooseCardResp class]])
    {
        
    }
}

- (void)onReq:(BaseReq *)req {
    if ([req isKindOfClass:[GetMessageFromWXReq class]])
    {
    }
    else if ([req isKindOfClass:[ShowMessageFromWXReq class]])
    {
        
    }
    else if ([req isKindOfClass:[LaunchFromWXReq class]])
    {
        
    }
}

@end
