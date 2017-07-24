//
//  CHKeychain.h
//  sengoku
//
//  Created by anajun on 13-9-13.
//
//

#import <Foundation/Foundation.h>
#import <Security/Security.h>

@interface CHKeychain : NSObject

- (id)  initWithServiceName:(NSString *) serviceName;

- (id)  initWithServiceName:(NSString *) serviceName accessGroup:(NSString *) accessGroup;

- (BOOL) addToKeychainUsingName:(NSString *) name andValue:(NSString *) value error:(NSError **) error;

- (NSString *) valueForName:(NSString *) name error:(NSError **)error;

- (BOOL) removeName:(NSString *) name error:(NSError **) error;

@end
