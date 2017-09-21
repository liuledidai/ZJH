//
//  JJParamUntil.h
//
//  Created by anxijun on 16/10/10.
//
//

#ifndef JJParamUntil_h
#define JJParamUntil_h

#include "cocos2d.h"

USING_NS_CC;

typedef std::map<std::string, std::string> StringMap;

class JJParamUntil {
    
    static void sort(std::vector<std::string> & container,StringMap& params);
    static bool compareLevel(const std::string &a,const std::string &b);
    static std::string getSign(std::string paramstr);
    
public:
    
    
    static StringMap stringTobuildParam(std::string paramStr);
    
    static std::vector<std::string> split(std::string str,std::string pattern);
};

#endif /* JJParamUntil_h */
