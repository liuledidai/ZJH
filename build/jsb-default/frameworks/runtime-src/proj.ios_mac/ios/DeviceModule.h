//
//  DeviceModule.h
//  NiuNiuGame
//
//  Created by anxijun on 16/4/6.
//
//

//#ifndef DeviceModule_h
//#define DeviceModule_h
//
////#include "../Classes/Game/Common/GlobalDef.h"
//
////class DeviceModule
////{
////public:
////    static DeviceModule* sharedDeviceModule();
////    
////    
////    float getSystemVersion();
////    
//////    void GetClientSerial(tagClientSerial& clientSerial);
////    
////    std::string getUserToken();
////    
////    std::string getUserIP();
////    
////    std::string createCFUUID();
////    
////    std::string getDeviceName();
////    
////    float getAppVersion();
//// 
////    std::string md5(std::string str);
////};
//
//#endif /* DeviceModule_h */


@interface DeviceModule : NSObject

//- (id)  initWithServiceName:(NSString *) serviceName;
//
//- (id)  initWithServiceName:(NSString *) serviceName accessGroup:(NSString *) accessGroup;
//
//- (BOOL) addToKeychainUsingName:(NSString *) name andValue:(NSString *) value error:(NSError **) error;
//
//- (NSString *) valueForName:(NSString *) name error:(NSError **)error;
//
//- (BOOL) removeName:(NSString *) name error:(NSError **) error;
+ (NSString *) getUserToken;
+ (NSString *) getUserIP;
+ (NSString *) createCFUUID;
+ (NSString *) getDeviceName;
+ (NSString *) md5;

@end
