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
#import "Reachability.h"
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import "IosHelper.h"

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

+(NSString *)getAppVersion
{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:(NSString *)kCFBundleVersionKey];
    return version;
}

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

+(float)getBatteryLevel
{
    return [UIDevice currentDevice].batteryLevel;
}

+ (NSString *)getNetconnType{
    
    NSString *netconnType = @"NETWORK_NONE";
    
    Reachability *reach = [Reachability reachabilityWithHostName:@"www.apple.com"];
    
    switch ([reach currentReachabilityStatus]) {
        case NotReachable:// 没有网络
        {
            
            netconnType = @"NETWORK_NONE";//@"no network";
        }
            break;
            
        case ReachableViaWiFi:// Wifi
        {
            netconnType = @"NETWORK_WIFI";//@"Wifi";
        }
            break;
            
        case ReachableViaWWAN:// 手机自带网络
        {
            // 获取手机网络类型
            CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
            
            NSString *currentStatus = info.currentRadioAccessTechnology;
            
            if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyGPRS"]) {
                
                netconnType = @"NETWORK_2G";//@"GPRS";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyEdge"]) {
                
                netconnType = @"NETWORK_2G";//@"2.75G EDGE";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyCDMA1x"]){
                
                netconnType = @"NETWORK_2G";//@"2G";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyWCDMA"]){
                
                netconnType = @"NETWORK_3G";//@"3G";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyHSDPA"]){
                
                netconnType = @"NETWORK_3G";//@"3.5G HSDPA";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyHSUPA"]){
                
                netconnType = @"NETWORK_3G";//@"3.5G HSUPA";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyCDMAEVDORev0"]){
                
                netconnType = @"NETWORK_3G";//@"3G";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyCDMAEVDORevA"]){
                
                netconnType = @"NETWORK_3G";//@"3G";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyCDMAEVDORevB"]){
                
                netconnType = @"NETWORK_3G";//@"3G";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyeHRPD"]){
                
                netconnType = @"NETWORK_3G";//@"HRPD";
            }else if ([currentStatus isEqualToString:@"CTRadioAccessTechnologyLTE"]){
                
                netconnType = @"NETWORK_4G";//@"4G";
            }
        }
            break;
            
        default:
            break;
    }
    
    return netconnType;
}

+(BOOL) isInstallWx
{
    return IosHelper::isInstallWx();
}

@end
