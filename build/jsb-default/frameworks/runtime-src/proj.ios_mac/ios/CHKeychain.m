//
//  CHKeychain.m
//  sengoku
//
//  Created by anajun on 13-9-13.
//
//

#import "CHKeychain.h"

@interface CHKeychain()

@property (nonatomic, copy) NSString *serviceName;
@property (nonatomic, copy) NSString *accessGroup;

@end

@implementation CHKeychain

- (void) dealloc
{
    [_accessGroup release];
    [_serviceName release];
    
    [super dealloc];
}

- (id) initWithServiceName:(NSString *) serviceName
{
    return [self initWithServiceName:serviceName accessGroup:nil];
}

- (id)  initWithServiceName:(NSString *) serviceName accessGroup:(NSString *) accessGroup
{
    NSParameterAssert([serviceName length] != 0);
    self = [super init];
    if (self)
    {
        _serviceName = [serviceName copy];
        _accessGroup = [accessGroup copy];
    }
    return self;
}

- (NSString *) valueForName:(NSString *) name error:(NSError **)error
{
    return [self findValueFromKeychainUsingName:name error:error];
}

- (BOOL) removeName:(NSString *) name error:(NSError **) error
{
    return [self removeValueFromKeychainUsingName:name error:error];
}

- (BOOL) addToKeychainUsingName:(NSString *) inName andValue:(NSString *) inValue error:(NSError **) error
{
    @try
    {
        NSString *serverName = self.serviceName;
        NSString *securityDomain = self.serviceName;
        
        NSDictionary *searchDictionary = nil;
        NSMutableDictionary *keychainItemAttributeDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                                                (id)kSecClassInternetPassword, kSecClass,
                                                                securityDomain, kSecAttrSecurityDomain,
                                                                serverName, kSecAttrServer,
                                                                inName, kSecAttrAccount,
                                                                kSecAttrAuthenticationTypeDefault, kSecAttrAuthenticationType,
                                                                [NSNumber numberWithUnsignedLongLong:'oaut'], kSecAttrType,
                                                                [inValue dataUsingEncoding:NSUTF8StringEncoding], kSecValueData,
                                                                nil];
        if (_accessGroup.length > 0)
        {
            [keychainItemAttributeDictionary setObject:_accessGroup forKey:(id)kSecAttrAccessGroup];
        }
        
        OSStatus status = [self findValueFromKeychainUsingName:inName returningValue:NULL returningItem:&searchDictionary];
        if (status == errSecSuccess)
        {
            NSMutableDictionary *updateDictionary = [keychainItemAttributeDictionary mutableCopy];
            [updateDictionary removeObjectForKey:(id)kSecClass];
            
            OSStatus updateStatus = SecItemUpdate((CFDictionaryRef)keychainItemAttributeDictionary, (CFDictionaryRef)updateDictionary);
            [updateDictionary release];
            if (updateStatus != errSecSuccess)
            {
                if (error)
                {
                    *error = [NSError errorWithDomain:@"JKNKeychainAccessor" code:updateStatus userInfo:nil];
                }
                NSLog(@"Failed with an errorcode:%d, when we add item[username:%@, servicename:%@, value:%@] to keychain", (int)updateStatus, inName, serverName, inValue);
                return NO;
            }
            else
            {
                return YES;
            }
        }
        else
        {
            OSStatus success = SecItemAdd((CFDictionaryRef)keychainItemAttributeDictionary, NULL);
            if (success != errSecSuccess)
            {
                NSLog(@"Failed with an errorcode:%d, when we add item[username:%@, servicename:%@, value:%@] to keychain", (int)success, inName, serverName, inValue);
                if (error)
                {
                    *error = [NSError errorWithDomain:@"JKNKeychainAccessor" code:success userInfo:nil];
                }
                return NO;
            }
            else
            {
                return YES;
            }
        }
    }
    @catch (NSException *exception)
    {
        NSLog(@"%@", exception);
        return NO;
    }
}

#pragma mark - -- private method --
- (NSString *) findValueFromKeychainUsingName:(NSString *) inName error:(NSError **) error
{
    NSString *value = nil;
    OSStatus status = [self findValueFromKeychainUsingName:inName returningValue:&value returningItem:NULL];
    if (error && status != errSecSuccess)
    {
        *error = [NSError errorWithDomain:@"JKNKeychainAccessor" code:status userInfo:nil];
    }
    return value;
}

- (BOOL) removeValueFromKeychainUsingName:(NSString *) inName error:(NSError **) error
{
    NSString *serverName = self.serviceName;
    NSString *securityDomain = self.serviceName;
    
    NSMutableDictionary *searchDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:	(id)kSecClassInternetPassword, (id)kSecClass,
                                             securityDomain, (id)kSecAttrSecurityDomain,
                                             serverName, (id)kSecAttrServer,
                                             inName, (id)kSecAttrAccount,
                                             nil];
    
    if (_accessGroup.length > 0)
    {
        [searchDictionary setObject:_accessGroup forKey:(id)kSecAttrAccessGroup];
    }
    
    OSStatus success = SecItemDelete((CFDictionaryRef)searchDictionary);
    if (success != errSecSuccess)
    {
        NSLog(@"Delete item[username:%@, servicename:%@] in keychain failed with an errorcode:%d", inName, serverName, (int)success);
        if (error)
        {
            *error = [NSError errorWithDomain:@"JKNKeychainAccessor" code:success userInfo:nil];
        }
        return NO;
    }
    else
    {
        return YES;
    }
}

- (OSStatus) findValueFromKeychainUsingName:(NSString *) inName returningValue:(NSString **) returningValue returningItem:(NSDictionary **) outKeychainItemRef
{
    NSString *foundPassword = nil;
    NSString *serverName = self.serviceName;
    NSString *securityDomain = self.serviceName;
    NSDictionary *attributesDictionary = nil;
    NSData *foundValue = nil;
    OSStatus status = noErr;
    
    NSMutableDictionary *searchDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:(id)kSecClassInternetPassword, (id)kSecClass,
                                             securityDomain, (id)kSecAttrSecurityDomain,
                                             serverName, (id)kSecAttrServer,
                                             inName, (id)kSecAttrAccount,
                                             (id)kSecMatchLimitOne, (id)kSecMatchLimit,
                                             (id)kCFBooleanTrue, (id)kSecReturnData,
                                             (id)kCFBooleanTrue, (id)kSecReturnAttributes,
                                             (id)kCFBooleanTrue, (id)kSecReturnPersistentRef,
                                             nil];
    
    if (_accessGroup.length > 0)
    {
        [searchDictionary setObject:_accessGroup forKey:(id)kSecAttrAccessGroup];
    }
    
    status = SecItemCopyMatching((CFDictionaryRef)searchDictionary, (CFTypeRef *)&attributesDictionary);
    foundValue = [attributesDictionary objectForKey:(id)kSecValueData];
    
    if (status != errSecSuccess)
    {
        NSLog(@"Find value with username[%@] and servicename[%@] in keychain failed with an errorcode:%d", inName, serverName, (int)status);
    }
    
    if (status == noErr && foundValue)
    {
        foundPassword = [[NSString alloc] initWithData:foundValue encoding:NSUTF8StringEncoding];
    }
    
    if (outKeychainItemRef)
    {
        *outKeychainItemRef = [attributesDictionary autorelease];
    }
    else
    {
        // release the object inside.
        [attributesDictionary release];
    }
    
    if (returningValue)
    {
        *returningValue = [foundPassword autorelease];
    }
    else
    {
        [foundPassword release];
    }
    return status;
}
@end
