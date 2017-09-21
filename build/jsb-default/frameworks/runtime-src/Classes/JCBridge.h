//
//  JCBridge.h
//  ZJHGAME
//
//  Created by leeliu on 2017/5/24.
//
//

#ifndef JCBridge_h
#define JCBridge_h

#include <stdio.h>
#include "cocos2d.h"
#include "Game/NetWork/cocos-net.h"

class JCBridge {
public:
    JCBridge();
    ~JCBridge();
    
    static std::string callNative(std::string funcName,std::string params);
public:
    static void setJSCallback(std::function<void (std::string,std::string,bool)> jscallback);
    static void callJS(std::string funcName,std::string params,bool isJson);
    

};


#endif /* JCBridge_h */
