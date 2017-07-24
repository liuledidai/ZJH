//
//  DeviceModule.cpp
//  NiuNiuGame
//
//  Created by anxijun on 16/4/6.
//
//

#import "DeviceModule.h"
#import <CommonCrypto/CommonDigest.h>
#import "CHKeychain.h"

#define kKeyChainServiceName    @"AccountKeyChainServiceName"
#define accessGroupName         @"GZVX6L999D.JJHGameAppFamily"

NSString * const KEY_USERTOKEN = @"com.jjhgame.app.token";

@implementation DeviceModule
//float DeviceModule::getSystemVersion()
//{
//    float version = [[UIDevice currentDevice].systemVersion floatValue];
//    return version;
//}
//
//void DeviceModule::GetClientSerial(tagClientSerial& clientSerial)
//{
//    clientSerial.dwSystemVer = getSystemVersion();
//    clientSerial.dwComputerID[0] = 2957651000;
//    clientSerial.dwComputerID[1] = 24904;
//    clientSerial.dwComputerID[2] = 141757687;
//    
//    return ;
//}


+ (NSString *)createCFUUID{
    
    CFUUIDRef cfuuid = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef refuuid = CFUUIDCreateString(kCFAllocatorDefault, cfuuid);
    CFRelease(cfuuid);
    NSString *cfuuidString = (__bridge NSString *)refuuid;
    return cfuuidString;//[cfuuidString UTF8String];
}

+ (NSString *)getUserToken
{
    CHKeychain *globalKeyChainAccessor = [[[CHKeychain alloc] initWithServiceName:kKeyChainServiceName
                                                                      accessGroup:accessGroupName] autorelease];
    NSString *userToken = [globalKeyChainAccessor valueForName:KEY_USERTOKEN error:nil];
    if (userToken && [userToken length] > 0)
    {
        return [DeviceModule md5:userToken];
    }
    else
    {
        NSString *ret = [DeviceModule createCFUUID];
        NSString *userToken = ret;
        [globalKeyChainAccessor addToKeychainUsingName:KEY_USERTOKEN andValue:userToken error:nil];
        return [DeviceModule md5:ret];
    }
}

+(NSString *)getUserIP
{
    return @"127.0.0.1";
}

+(NSString *)getDeviceName
{
    NSString *deviceName = [[UIDevice currentDevice] name];
    if ([deviceName hasSuffix:@"的 iPhone"]) {
        return [deviceName stringByReplacingOccurrencesOfString:@"的 iPhone" withString:@""];
    }if ([deviceName hasSuffix:@"的 iPad"]) {
        return [deviceName stringByReplacingOccurrencesOfString:@"的 iPad" withString:@""];
    }else{
        return deviceName;
    }
}

//float DeviceModule::getAppVersion()
//{
//    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString *)kCFBundleVersionKey];
//    return [version floatValue];
//}

+(NSString *)md5:(NSString *)str
{
//    const char *cStr = str.c_str();
    unsigned char result[16];
    CC_MD5(str, str.length, result); // This is the md5 call
    NSString *string = [NSString stringWithFormat:
                        @"%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x%02x",
                        result[0], result[1], result[2], result[3],
                        result[4], result[5], result[6], result[7],
                        result[8], result[9], result[10], result[11],
                        result[12], result[13], result[14], result[15]
                        ];
    return string;
}

@end
