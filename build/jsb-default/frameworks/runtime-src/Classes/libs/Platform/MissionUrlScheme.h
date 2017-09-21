//
//  MissionUrlScheme.hpp
//  MaJiangGame
//
//  Created by 李文龙 on 2017/6/29.
//
//

#ifndef MissionUrlScheme_hpp
#define MissionUrlScheme_hpp

#include "cocos2d.h"

class IUrlOpenAppCallbackSink
{
public:
    virtual void openAppByUrlCallback(std::string action, std::string param) = 0;
};

class MissionUrlScheme
{
public:
    MissionUrlScheme();
    ~MissionUrlScheme();
    
    void setUrlOpenAppSink(IUrlOpenAppCallbackSink* pSink);
    
    void openAppByUrlCallback(const char* param);

public:
    static MissionUrlScheme* getInstance();
    
private:
    static MissionUrlScheme*                           m_pMissionUrlScheme;
    IUrlOpenAppCallbackSink*                           m_pUrlOpenAppSink;
};

#endif /* MissionUrlScheme_hpp */
